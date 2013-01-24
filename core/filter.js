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

		this._ = {
			// Optimized rules.
			rules: {}
		};

		if ( editorOrRules instanceof CKEDITOR.editor ) {
			var editor = editorOrRules;
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
		 * Shorthand function that can be used during feature activation.
		 *
		 *	* If {@link #customConfig} is `true` (custom {@link CKEDITOR.config#allowedContent} was defined)
		 *		this method returns `true` (what means that tested feature is allowed) if `requires` is allowed
		 *		or hasn't been defined. So it returns `false` only if required content isn't allowed.
		 *	* If {@link #customConfig} is `false` (default allowed content rules are used) it registers
		 *		`allows` rules using {@link #allow} method. In this case method always returns
		 *		`true` (feature is allowed), because it assumes that rules provided in `allows`
		 *		will validate elements required by this feature.
		 *
		 * @param [allows] Rules to be added as allowed.
		 * @param [requires] Content to be checked by {@link #check}.
		 * @returns {Boolean} Whether feature is allowed.
		 */
		registerContent: function( allows, requires ) {
			if ( this.disabled )
				return true;

			// If default configuration, then add allowed content rules.
			this.allow( allows );
			// If custom configuration, then check if required content is allowed.
			if ( this.customConfig && requires )
				return this.check( requires );

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

			var element;

			if ( typeof test == 'string' )
				element = mockElementFromString( test );
			else
				element = mockElementFromStyle( test );

			// Make a deep copy.
			var copy = CKEDITOR.tools.clone( element );

			this.getFilterFunction()( copy );

			if ( copy.name != element.name )
				return false;
			// Compare only left to right, because copy may be only trimmed version of original element.
			if ( !CKEDITOR.tools.objectCompare( element.attributes, copy.attributes, true ) )
				return false;

			return true;
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
			//              <   elements   ><    classes    ><              styles and attributes              >< separator >
		var groupPattern = /^([a-z0-9*\s]+)(?:\.([\w\-,\s]+))?((?:\s*{[\w\-,\s]+}\s*|\s*\[[\w\-,\s]+\]\s*){0,2})(?:;\s*|$)/i,
			match,
			attrsAndStyles, styles, attrs,
			rules = {},
			groupNum = 1;

		input = trim( input );

		while ( ( match = input.match( groupPattern ) ) ) {
			styles = attrs = null;

			if ( ( attrsAndStyles = match[ 3 ] ) ) {
				styles = attrsAndStyles.match( /{([^}]+)}/ );
				if ( styles )
					styles = trim( styles[ 1 ] );

				attrs = attrsAndStyles.match( /\[([^\]]+)\]/ );
				if ( attrs )
					attrs = trim( attrs[ 1 ] );
			}

			rules[ '$' + groupNum++ ] = {
				elements: match[ 1 ],
				classes: match[ 2 ] ? trim( match[ 2 ] ) : null,
				styles: styles,
				attributes: attrs
			};

			// Move to the next group.
			input = input.slice( match[ 0 ].length );
		}

		return rules;
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