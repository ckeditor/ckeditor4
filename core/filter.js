/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

(function() {
	'use strict';

	var DTD = CKEDITOR.dtd,
		copy = CKEDITOR.tools.copy,
		indexOf = CKEDITOR.tools.indexOf,
		parseCssText = CKEDITOR.tools.parseCssText,
		trim = CKEDITOR.tools.trim;

	/**
	 * @class
	 */
	CKEDITOR.filter = function( editorOrRules ) {
		/**
		 * Whether custom {@link CKEDITOR.config#allowedContent} was set.
		 *
		 * @property {Boolean} customConfig
		 */

		/**
		 * Array of rules added by {@link #allow} method.
		 *
		 * Rules in this array are slightly modified version of those
		 * which were added.
		 *
		 * This property is useful for debugging issues with rules string parsing
		 * or for checking what rules were automatically added by editor features.
		 */
		this.allowedContent = [];

		/**
		 * Whether filter is disabled.
		 *
		 * To disable filter set {@link CKEDITOR.config#allowedContent} to `true`.
		 *
		 * @readonly
		 */
		this.disabled = false;

		this.editor = null;

		this._ = {
			// Optimized rules.
			rules: {},
			cachedTests: {}
		};

		if ( editorOrRules instanceof CKEDITOR.editor ) {
			var editor = this.editor = editorOrRules;
			this.customConfig = true;

			var allowedContent = editor.config.allowedContent;

			// Disable filter completely by setting config.allowedContent = true.
			if ( allowedContent === true ) {
				this.disabled = true;
				return;
			}

			if ( !allowedContent )
				this.customConfig = false;

			this.allow( defaultAllowedContent, 1 );
			this.allow( allowedContent, 1 );

			//
			// Add filter listeners to toHTML and toDataFormat events.
			//

			var filterFn = this.getFilterFunction(),
				filter = new CKEDITOR.htmlParser.filter();

			filter.addRules( {
				elements: {
					'^': filterFn
				}
			} );

			// Filter incoming "data".
			// Add element filter before htmlDataProcessor.dataFilter
			// when purifying input data to correct html.
			this._.toHtmlListener = editor.on( 'toHtml', function( evt ) {
				// Filter only children because data maybe be wrapped
				// with element, not a doc fragment.
				evt.data.dataValue.filterChildren( filter );
			}, null, null, 6 );

			// Filter outcoming "data".
			// Add element filter  after htmlDataProcessor.htmlFilter
			// when preparing output data HTML.
			this._.toDataFormatListener = editor.on( 'toDataFormat', function( evt ) {
				// Filter only children because data maybe be wrapped
				// with element, not a doc fragment.
				evt.data.dataValue.filterChildren( filter );
			}, null, null, 11 );
		}
		// Rules object passed in editorOrRules argument - initialize standalone filter.
		else {
			this.customConfig = false;
			this.allow( editorOrRules, 1 );
		}
	};

	CKEDITOR.filter.prototype = {
		/**
		 * Adds specified rules to the filter.
		 *
		 * @param {Object/String/CKEDITOR.style/Object[]/String[]/CKEDITOR.style[]} newRules
		 * @param {Boolean} [overrideCustom] By default this method will reject any rules
		 * if default {@link CKEDITOR.config#allowedContent} is defined. Pass `true`
		 * to force rules addition.
		 * @returns {Boolean} Whether rules were accepted.
		 */
		allow: function( newRules, overrideCustom ) {
			if ( this.disabled )
				return false;

			// Don't override custom user's configuration if not explicitly requested.
			if ( this.customConfig && !overrideCustom )
				return false;

			if ( !newRules )
				return false;

			// Clear cache.
			this._.cachedChecks = {};

			var i, ret;

			if ( typeof newRules == 'string' )
				newRules = parseRulesString( newRules );
			else if ( newRules instanceof CKEDITOR.style )
				newRules = convertStyleToRules( newRules );
			else if ( CKEDITOR.tools.isArray( newRules ) ) {
				for ( i = 0; i < newRules.length; ++i )
					ret = this.allow( newRules[ i ], overrideCustom );
				return ret; // Return last status.
			}

			var groupName, rule,
				rulesToOptimize = [];

			for ( groupName in newRules ) {
				// Clone rule, because we'll modify it later.
				rule = copy( newRules[ groupName ] );

				if ( typeof rule == 'boolean' )
					rule = {};
				else if ( typeof rule == 'function' )
					rule = { validate: rule };

				if ( groupName.charAt( 0 ) != '$' )
					rule.elements = groupName;

				this.allowedContent.push( rule );
				rulesToOptimize.push( rule );
			}

			optimizeRules( this._.rules, rulesToOptimize );

			return true;
		},

		/**
		 * Disable allowed content filter.
		 */
		disable: function() {
			this.disabled = true;
			if ( this._.toHtmlListener )
				this._.toHtmlListener.removeListener();
			if ( this._.toDataFormatListener )
				this._.toDataFormatListener.removeListener();
		},

		/**
		 * Returns function that accepts {@link CKEDITOR.htmlParser.element}
		 * and filters it basing on allowed content rules registered by
		 * {@link #allow} method.
		 *
		 * Filter uses this function as an elements rule for {@link CKEDITOR.htmlParser.filter}.
		 *
		 *		editor.dataProcessor.htmlFilter.addRules( {
		 *			elements: {
		 *				'^': editor.filter.getFilterFunction()
		 *			}
		 *		} );
		 *
		 * @returns {Function}
		 */
		getFilterFunction: function() {
			if ( this._.filterFunction )
				return this._.filterFunction;

			var optimizedRules = this._.rules,
				unprotectElementsNamesRegexp = /^cke:(object|embed|param|html|body|head|title)$/;

			return this._.filterFunction = function( element ) {
				var name = element.name;
				// Unprotect elements names previously protected by htmlDataProcessor
				// (see protectElementNames and protectSelfClosingElements functions).
				name = name.replace( unprotectElementsNamesRegexp, '$1' );

				var rules = optimizedRules.elements[ name ],
					genericRules = optimizedRules.generic,
					status = {
						valid: false,
						validAttributes: {},
						validClasses: {},
						validStyles: {},
						// Whether all are valid.
						allAttributes: false,
						allClasses: false,
						allStyles: false
					},
					i, l;

				// Early return - if there are no rules, remove this element.
				if ( !rules && !genericRules ) {
					removeElement( element, name );
					return;
				}

				// These properties could be mocked by filter#check.
				if ( !element.styles )
					element.styles = parseCssText( element.attributes.style || '', 1 );
				if ( !element.classes )
					element.classes = element.attributes[ 'class' ] ? element.attributes[ 'class' ].split( /\s+/ ) : [];

				if ( rules ) {
					for ( i = 0, l = rules.length; i < l; ++i )
						applyRule( rules[ i ], element, status, true );
				}

				if ( genericRules ) {
					for ( i = 0, l = genericRules.length; i < l; ++i )
						applyRule( genericRules[ i ], element, status, false );
				}

				// Finally, if after running all filter rules it still hasn't been allowed - remove it.
				if ( !status.valid ) {
					removeElement( element, name );
					return;
				}

				updateElement( element, status );
			};
		},

		 /**
		 * Checks whether a feature can be enabled for the HTML restrictions in place
		 * for the current CKEditor instance, based on the HTML the feature might
		 * generate and the minimal HTML the feature needs to be able to generate.
		 *
		 * @param feature
		 * @param feature.generates HTML that can be generated by this feature.
		 * @param feature.requires Minimal HTML that this feature must be allowed to
		 * generate for it to be able to function at all.
		 * @returns {Boolean} Whether this feature can be enabled.
		 */
		addFeature: function( feature ) {
			if ( this.disabled )
				return true;

			if ( !feature )
				return true;

			// Some features may want to register other feature.
			// E.g. button may return command bound to it.
			if ( feature.toFeature )
				feature = feature.toFeature( this.editor );

			// If default configuration (will be checked inside #allow()),
			// then add allowed content rules.
			this.allow( feature.allows );
			// If custom configuration, then check if required content is allowed.
			if ( this.customConfig && feature.requires )
				return this.check( feature.requires );

			return true;
		},

		/**
		 * Checks whether content defined in test argument is allowed
		 * by this filter.
		 *
		 * @param {String/CKEDITOR.style} test
		 * @returns {Boolean} Returns `true` if content is allowed.
		 */
		check: function( test ) {
			if ( this.disabled )
				return true;

			var element, result;

			if ( typeof test == 'string' ) {
				if ( test in this._.cachedChecks )
					return this._.cachedChecks[ test ];

				element = mockElementFromString( test );
			} else
				element = mockElementFromStyle( test );

			// Make a deep copy.
			var clone = CKEDITOR.tools.clone( element );

			this.getFilterFunction()( clone );

			if ( clone.name != element.name )
				result = false;
			// Compare only left to right, because clone may be only trimmed version of original element.
			else if ( !CKEDITOR.tools.objectCompare( element.attributes, clone.attributes, true ) )
				result = false;
			else
				result = true;

			if ( typeof test == 'string' )
				this._.cachedChecks[ test ] = result;

			return result;
		}
	};

	function applyRule( rule, element, status, isSpecific ) {
		var name = element.name;

		// This generic rule doesn't apply to this element - skip it.
		if ( !isSpecific && rule.elements && !rule.elements( name ) )
			return;

		// Optimalization - validate only if still invalid.
		if ( !status.valid ) {
			// If rule has validator and it accepts this element - make it valid.
			if ( rule.validate ) {
				if ( rule.validate( element ) )
					status.valid = !rule.propertiesOnly;
				// Return so attrs, styles and classes won't be validated.
				else
					return;
			}
			// If there's no validator make it valid anyway, because there exists a rule for this element.
			else
				// If propertiesOnly is true it will keep status.valid == false.
				// This way only element properties (styles, attrs, classes) will be validated.
				status.valid = !rule.propertiesOnly;
		}

		// Apply rule only when all attrs/styles/classes haven't been marked as valid.
		if ( !status.allAttributes ) {
			status.allAttributes = applyRuleToHash( rule.attributes, element.attributes, status.validAttributes );
		}
		if ( !status.allStyles ) {
			status.allStyles = applyRuleToHash( rule.styles, element.styles, status.validStyles );
		}
		if ( !status.allClasses ) {
			status.allClasses = applyRuleToArray( rule.classes, element.classes, status.validClasses );
		}
	}

	function applyRuleToArray( itemsRule, items, validItems ) {
		if ( !itemsRule )
			return;

		if ( itemsRule === true )
			return true;

		for ( var i = 0, l = items.length, item; i < l; ++i ) {
			item = items[ i ];
			if ( !validItems[ item ] )
				validItems[ item ] = itemsRule( item );
		}

		return false;
	}

	function applyRuleToHash( itemsRule, items, validItems ) {
		if ( !itemsRule )
			return;

		if ( itemsRule === true )
			return true;

		for ( var name in items ) {
			if ( !validItems[ name ] )
				validItems[ name ] = itemsRule( name, items[ name ] );
		}

		return false;
	}

	function convertStyleToRules( style ) {
		var styleDef = style.getDefinition(),
			rules = {},
			rule,
			attrs = styleDef.attributes;

		rules[ styleDef.element ] = rule = {
			styles: styleDef.styles
		};

		if ( attrs ) {
			attrs = copy( attrs );
			rule.classes = attrs[ 'class' ] ? attrs[ 'class' ].split( /\s+/ ) : null
			rule.attributes = attrs;
		}

		return rules;
	}

	// Create pseudo element that will be passed through filter
	// to check if tested string is allowed.
	function mockElementFromString( str ) {
		var element = parseRulesString( str )[ '$1' ],
			styles = element.styles,
			classes = element.classes;

		element.name = element.elements;
		element.classes = classes = ( classes ? classes.split( /\s*,\s*/ ) : [] );
		element.styles = mockHash( styles );
		element.attributes = mockHash( element.attributes );

		if ( classes.length )
			element.attributes[ 'class' ] = classes.join( ' ' );
		if ( styles )
			element.attributes.style = CKEDITOR.tools.writeCssText( element.styles );

		return element;
	}

	// Create pseudo element that will be passed through filter
	// to check if tested style is allowed.
	function mockElementFromStyle( style ) {
		var styleDef = style.getDefinition(),
			styles = styleDef.styles || null,
			attrs = styleDef.attributes || {};

		if ( styles ) {
			styles = copy( styles );
			attrs.style = CKEDITOR.tools.writeCssText( styles );
		}

		var el = {
			name: styleDef.element,
			attributes: attrs,
			classes: attrs[ 'class' ] ? attrs[ 'class' ].split( /\s+/ ) : null,
			styles: styles
		};

		return el;
	}

	function mockHash( str ) {
		// It may be a null or empty string.
		if ( !str )
			return {};

		var keys = str.split( /\s*,\s*/ ).sort(),
			obj = {}

		while ( keys.length )
			obj[ keys.shift() ] = 'test';

		return obj;
	}

	// Optimize rule's validators (for elements, styles, etc.).
	// If any of these validators is a wildcard return true,
	// what means that this rule is a priority.
	// It should be applied in the first order, because it will
	// mark many properties as valid without checking them,
	// so next rules will be able to skip them saving time.
	function optimizeValidators( rule ) {
		var validator,
			priority = false;

		for ( var i in { elements:1,styles:1,attributes:1,classes:1 } ) {
			if ( ( validator = rule[ i ] ) ) {
				rule[ i ] = validatorFunction( validator );
				if ( validator === true )
					priority = true;
			}
		}

		return priority;
	}

	function optimizeRules( optimizedRules, rules ) {
		var elementsRules = optimizedRules.elements || {},
			genericRules = optimizedRules.generic || [],
			i, l, rule, elements, element, priority;

		for ( i = 0, l = rules.length; i < l; ++i ) {
			// Do not modify original rule.
			rule = copy( rules[ i ] );

			if ( typeof rule.elements == 'string' ) {
				elements = trim( rule.elements );
				delete rule.elements;

				// Do not optimize rule.elements.
				priority = optimizeValidators( rule );

				if ( elements == '*' ) {
					rule.propertiesOnly = true;
					// Add priority rules at the beginning.
					genericRules[ priority ? 'unshift' : 'push' ]( rule );
				}
				else {
					elements = elements.split( /\s+/ );

					while ( ( element = elements.pop() ) ) {
						if ( !elementsRules[ element ] )
							elementsRules[ element ] = [ rule ];
						else
							elementsRules[ element ][ priority ? 'unshift' : 'push' ]( rule );
					}
				}
			}
			else {
				priority = optimizeValidators( rule );

				// Add priority rules at the beginning.
				genericRules[ priority ? 'unshift' : 'push' ]( rule );
			}
		}

		optimizedRules.elements = elementsRules;
		optimizedRules.generic = genericRules.length ? genericRules : null;
	}

	function parseRulesString( input ) {
			//              <   elements   ><                     styles, attributes and classes                      >< separator >
		var groupPattern = /^([a-z0-9*\s]+)((?:\s*{[\w\-,\s\*]+}\s*|\s*\[[\w\-,\s\*]+\]\s*|\s*\([\w\-,\s\*]+\)\s*){0,3})(?:;\s*|$)/i,
			match,
			props, styles, attrs, classes,
			rules = {},
			groupNum = 1;

		input = trim( input );

		while ( ( match = input.match( groupPattern ) ) ) {
			if ( ( props = match[ 2 ] ) ) {
				styles = parserProperties( props, 'styles' );
				attrs = parserProperties( props, 'attrs' );
				classes = parserProperties( props, 'classes' );
			} else
				styles = attrs = classes = null;

			rules[ '$' + groupNum++ ] = {
				elements: match[ 1 ],
				classes: classes,
				styles: styles,
				attributes: attrs
			};

			// Move to the next group.
			input = input.slice( match[ 0 ].length );
		}

		return rules;
	}

	var groupsPatterns = {
		styles: /{([^}]+)}/,
		attrs: /\[([^\]]+)\]/,
		classes: /\(([^\)]+)\)/
	};

	function parserProperties( properties, groupName ) {
		var group = properties.match( groupsPatterns[ groupName ] );
		return group ? trim( group[ 1 ] ) : null;
	}

	function removeElement( element, name ) {
		if ( DTD.$block[ name ] ) {
			// TODO Very brutal way of removing elements.
			element.name = 'p';
			element.attributes = {};
			element.styles = {};
		}
		else
			delete element.name;
	}

	function updateElement( element, status ) {
		var validAttrs = status.validAttributes,
			validStyles = status.validStyles,
			validClasses = status.validClasses,
			attrs = element.attributes,
			styles = element.styles,
			origClasses = attrs[ 'class' ],
			origStyles = attrs.style,
			name,
			stylesArr = [],
			classesArr = [],
			internalAttr = /^data-cke-/;

		// Will be updated later.
		delete attrs.style;
		delete attrs[ 'class' ];

		if ( !status.allAttributes ) {
			// We can safely remove class and styles attributes because they will be serialized later.
			for ( name in attrs ) {
				if ( !validAttrs[ name ] && !internalAttr.test( name ) )
					delete attrs[ name ];
			}
		}

		if ( !status.allStyles ) {
			for ( name in styles ) {
				if ( validStyles[ name ] )
					stylesArr.push( name + ':' + styles[ name ] );
			}
			if ( stylesArr.length )
				attrs.style = stylesArr.sort().join( '; ' );
		}
		else if ( origStyles )
			attrs.style = origStyles;

		if ( !status.allClasses ) {
			for ( name in validClasses ) {
				if ( validClasses[ name ] )
					classesArr.push( name );
			}
			if ( classesArr.length )
				attrs[ 'class' ] = classesArr.sort().join( ' ' );
		}
		else if ( origClasses )
			attrs[ 'class' ] = origClasses;
	}

	function validatorFunction( validator ) {
		if ( validator == '*' )
			return true;

		var type = typeof validator;
		if ( type == 'object' )
			type = validator.test ? 'regexp' :
				validator.push ? 'array' :
				type;

		switch ( type ) {
			case 'function':
				return validator;
			case 'string':
				var arr = trim( validator ).split( /\s*,\s*/ );
				return function( value ) {
					return indexOf( arr, value ) > -1;
				};
			case 'regexp':
				return function( value ) {
					return validator.test( value );
				};
			case 'array':
				return function( value ) {
					return indexOf( validator, value ) > -1;
				};
			case 'object':
				return function( value ) {
					return value in validator;
				};
		}
	}

	// Default editor's rules.
	var defaultAllowedContent = 'p br';

})();