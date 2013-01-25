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

			editor.once( 'pluginsLoaded', function() {
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
				editor.on( 'toHtml', function( evt ) {
					// Filter only children because data maybe be wrapped
					// with element, not a doc fragment.
					evt.data.dataValue.filterChildren( filter );
				}, null, null, 6 );

				// Filter outcoming "data".
				// Add element filter  after htmlDataProcessor.htmlFilter
				// when preparing output data HTML.
				editor.on( 'toDataFormat', function( evt ) {
					// Filter only children because data maybe be wrapped
					// with element, not a doc fragment.
					evt.data.dataValue.filterChildren( filter );
				}, null, null, 11 );
			}, this );
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
				newRules = convertStylesToRules( newRules );
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

			var optimizedRules = this._.rules;

			return this._.filterFunction = function( element ) {
				var name = element.name,
					rules = optimizedRules.elements[ name ],
					genericRules = optimizedRules.generic,
					status = {
						valid: false,
						validAttributes: {},
						validClasses: {},
						validStyles: {},
						allValid: 0
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

				// Finally, if after running all filter rules it is still disallowed - remove it.
				if ( !status.valid ) {
					removeElement( element, name );
					return;
				}

				if ( !status.allValid )
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
			var copy = CKEDITOR.tools.clone( element );

			this.getFilterFunction()( copy );

			if ( copy.name != element.name )
				result = false;
			// Compare only left to right, because copy may be only trimmed version of original element.
			else if ( !CKEDITOR.tools.objectCompare( element.attributes, copy.attributes, true ) )
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

		if ( rule.markAllValid )
			status.allValid = 1;

		// No need to run validators.
		if ( !status.allValid ) {
			applyRuleToHash( rule.attributes, element.attributes, status.validAttributes );
			applyRuleToHash( rule.styles, element.styles, status.validStyles );
			applyRuleToArray( rule.classes, element.classes, status.validClasses );
		}
	}

	function applyRuleToArray( itemsRule, items, validItems ) {
		if ( !itemsRule )
			return;

		for ( var i = 0, l = items.length, item; i < l; ++i ) {
			item = items[ i ];
			if ( !validItems[ item ] )
				validItems[ item ] = itemsRule( item );
		}
	}

	function applyRuleToHash( itemsRule, items, validItems ) {
		if ( !itemsRule )
			return;

		for ( var name in items ) {
			if ( !validItems[ name ] )
				validItems[ name ] = itemsRule( name, items[ name ] );
		}
	}

	function convertStylesToRules( style ) {
		var styleDef = style.getDefinition(),
			rule = {};

		rule[ styleDef.element ] = true;

		return rule;
	}

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

	function mockElementFromStyle( style ) {
		var styleDef = style.getDefinition();

		return {
			name: styleDef.element,
			attributes: {},
			classes: [],
			styles: {}
		};
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

	function optimizeValidators( rule ) {
		for ( var i in { elements:1,styles:1,attributes:1,classes:1 } ) {
			if ( rule[ i ] )
				rule[ i ] = validatorFunction( rule[ i ] );
		}
	}

	function optimizeRules( optimizedRules, rules ) {
		var elementsRules = optimizedRules.elements || {},
			genericRules = optimizedRules.generic || [],
			i, l, rule, elements, element;

		for ( i = 0, l = rules.length; i < l; ++i ) {
			// Do not modify original rule.
			rule = copy( rules[ i ] );

			if ( typeof rule.elements == 'string' ) {
				elements = trim( rule.elements );
				delete rule.elements;

				// Do not optimize rule.elements.
				optimizeValidators( rule );

				if ( elements == '*' ) {
					rule.propertiesOnly = true;
					genericRules.push( rule );
				}
				else {
					elements = elements.split( /\s+/ );

					while ( ( element = elements.pop() ) ) {
						if ( !elementsRules[ element ] )
							elementsRules[ element ] = [ rule ];
						else
							elementsRules[ element ].push( rule );
					}
				}
			}
			else {
				optimizeValidators( rule );
				genericRules.push( rule );
			}
		}

		optimizedRules.elements = elementsRules;
		optimizedRules.generic = genericRules.length ? genericRules : null;
	}

	function parseRulesString( input ) {
			//              <   elements   ><                  styles, attributes and classes                   >< separator >
		var groupPattern = /^([a-z0-9*\s]+)((?:\s*{[\w\-,\s]+}\s*|\s*\[[\w\-,\s]+\]\s*|\s*\([\w\-,\s]+\)\s*){0,3})(?:;\s*|$)/i,
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
			name,
			stylesArr = [],
			classesArr = [],
			internalAttr = /^data-cke-/;

		// We can safely remove class and styles attributes because they will be serialized later.
		for ( name in attrs ) {
			if ( !validAttrs[ name ] && !internalAttr.test( name ) )
				delete attrs[ name ];
		}

		for ( name in styles ) {
			if ( validStyles[ name ] )
				stylesArr.push( name + ':' + styles[ name ] );
		}
		if ( stylesArr.length )
			element.attributes.style = stylesArr.sort().join( '; ' );

		for ( name in validClasses ) {
			if ( validClasses[ name ] )
				classesArr.push( name );
		}
		if ( classesArr.length )
			element.attributes[ 'class' ] = classesArr.sort().join( ' ' );
	}

	function validatorFunction( validator ) {
		var type = typeof validator;
		if ( type == 'object' )
			type = validator.test ? 'regexp' : 'array';

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
		}
	}

	// Default editor's rules.
	var defaultAllowedContent = 'p br';

})();