/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

(function() {
	'use strict';

	var DTD = CKEDITOR.dtd,
		clone = CKEDITOR.tools.clone,
		indexOf = CKEDITOR.tools.indexOf,
		parseCssText = CKEDITOR.tools.parseCssText,
		trim = CKEDITOR.tools.trim;

	CKEDITOR.dataFilter = function( editorOrRules ) {
		this.allowedContent = [];
		this._ = {};

		if ( editorOrRules instanceof CKEDITOR.editor ) {
			var editor = editorOrRules;
			this.customConfig = true;

			var allowedContent = editor.config.allowedContent;

			if ( !allowedContent )
				this.customConfig = false;

			this.addRules( defaultAllowedContent, 1 );
			this.addRules( allowedContent, 1 );

			editor.once( 'pluginsLoaded', function() {
				var filterFn = this.getFilterFunction();

				// Add element filter at the end of filters queue.
				editor.dataProcessor.dataFilter.addRules( {
					elements: {
						'^': filterFn
					}
				}, 100 );

				editor.dataProcessor.htmlFilter.addRules( {
					elements: {
						'^': filterFn
					}
				}, 100 );
			}, this );
		}
		// Rules object passed in editorOrRules argument - initialize standalone dataFilter.
		else {
			this.customConfig = false;
			this.addRules( editorOrRules, 1 );
		}
	};

	CKEDITOR.dataFilter.prototype = {
		addRules: function( newRules, overrideCustom ) {
			// Don't override custom user's configuration if not explicitly requested.
			if ( this.customConfig && !overrideCustom )
				return false;

			if ( typeof newRules == 'string' )
				newRules = parseRulesString( newRules );

			var groupName, rule;

			for ( groupName in newRules ) {
				// Clone rule, because we'll modify it later.
				// TODO We don't need deep clone.
				rule = clone( newRules[ groupName ] );

				if ( typeof rule == 'boolean' )
					rule = {};
				else if ( typeof rule == 'function' )
					rule = { validate: rule };

				if ( groupName.charAt( 0 ) != '$' )
					rule.elements = groupName;

				this.allowedContent.push( rule );
			}

			return true;
		},

		getFilterFunction: function() {
			if ( this._.filterFunction )
				return this._.filterFunction;

			var rules = optimizeRules( this.allowedContent ),
				elementsRules = rules.elements,
				genericRules = rules.generic;

			return this._.filterFunction = function( element ) {
				var name = element.name,
					status = {
						valid: false,
						validAttributes: {},
						validClasses: {},
						validStyles: {},
						allValid: 0
					},
					rules = elementsRules[ name ],
					i, l;

				// Early return - if there are no rules, remove this element.
				if ( !rules && !genericRules ) {
					removeElement( element, name );
					return;
				}

				// These properties could be mocked by dataFilter#test.
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

		test: function( element ) {
			element = parseRulesString( element )[ '$1' ];
			var styles = element.styles,
				classes = element.classes;

			element.name = element.elements;
			element.classes = classes = ( classes ? classes.split( /\s*,\s*/ ) : [] );
			element.styles = mockHash( styles );
			element.attributes = mockHash( element.attributes );

			if ( classes.length )
				element.attributes[ 'class' ] = classes.join( ' ' );
			if ( styles )
				element.attributes.style = CKEDITOR.tools.writeCssText( element.styles );

			var copy = clone( element );

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

	function optimizeRule( rule ) {
		for ( var i in { elements:1,styles:1,attributes:1,classes:1 } ) {
			if ( rule[ i ] )
				rule[ i ] = validatorFunction( rule[ i ] );
		}
	}

	function optimizeRules( rules ) {
		var elementsRules = {},
			genericRules = [],
			i, l, rule, elements, element;

		for ( i = 0, l = rules.length; i < l; ++i ) {
			rule = rules[ i ];

			if ( typeof rule.elements == 'string' ) {
				elements = trim( rule.elements );
				delete rule.elements;

				// Do not optimize rule.elements.
				optimizeRule( rule );

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
				optimizeRule( rule );
				genericRules.push( rule );
			}
		}

		return {
			elements: elementsRules,
			generic: genericRules.length ? genericRules : null
		};
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