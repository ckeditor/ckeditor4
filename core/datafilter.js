/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

(function() {
	'use strict';

	var DTD = CKEDITOR.dtd,
		indexOf = CKEDITOR.tools.indexOf,
		clone = CKEDITOR.tools.clone,
		parseCssText = CKEDITOR.tools.parseCssText;

	CKEDITOR.dataFilter = function( editor ) {
		this.customConfig = true;
		this.allowedContent = [];

		var allowedContent = editor.config.allowedContent;

		if ( !allowedContent ) {
			allowedContent = defaultAllowedContent;
			this.customConfig = false;
		}

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
	};

	CKEDITOR.dataFilter.prototype = {
		addRules: function( newRules, overrideCustom ) {
			// Don't override custom user's configuration if not explicitly requested.
			if ( this.customConfig && !overrideCustom )
				return;

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
		},

		getFilterFunction: function() {
			var rules = optimizeRules( this.allowedContent ),
				elementsRules = rules.elements,
				genericRules = rules.generic;

			return function( element ) {
				var name = element.name,
					status = {
						valid: false,
						modified: false,
						validStyles: {},
						validClasses: {},
						validAttributes: {}
					},
					rules = elementsRules[ name ],
					i, l;

				if ( element.name == 'span') console.log( element);

				// Early return - if there are no rules, remove this element.
				if ( !rules && !genericRules )
					removeElement( element, name );

				// TODO For performance reasons they may be parsed only on demand.
				element.styles = parseCssText( element.attributes.style || '', 1 );
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
				if ( !status.valid )
					removeElement( element, name );
			}
		}
	};

	function applyRule( rule, element, status, isSpecific ) {
		var name = element.name;

		// This generic rule doesn't apply to this element - skip it.
		if ( !isSpecific && !checkValue( rule.elements, name ) )
			return;

		// Optimalization - validate only if still invalid.
		if ( !status.valid ) {
			// If rule has validator and it accepts this element - make it valid.
			if ( rule.validate ) {
				if ( checkValue( rule.validate, element ) )
					status.valid = true;
			}
			// If there's no validator make it valid anyway, because there exists a rule for this element.
			else
				status.valid = true;
		}
	}

	function checkValue( validator, value1, value2 ) {
		// Code optimalization. Check if validator exists here.
		// If not - return true (value is ok).
		if ( !validator )
			return true;

		return validator( value1, value2 );
	}

	function optimizeRule( rule ) {
		for ( var i in { elements:1,styles:1,attrs:1,classes:1 } ) {
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
				elements = rule.elements.split( /\s+/ );
				delete rule.elements;

				// Do not optimize rule.elements.
				optimizeRule( rule );

				while ( ( element = elements.pop() ) ) {
					if ( !elementsRules[ element ] )
						elementsRules[ element ] = [ rule ];
					else
						elementsRules[ element ].push( rule );
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
			//              <   elements   >< classes ><   styles and attributes   >< separator >
		var groupPattern = /^([a-z0-9*\s]+)(?:\.([\w-,]+))?({[\w\-,]+}|\[[\w\-,]+\]){0,2}(?:;\s*|$)/i,
			match,
			attrsAndStyles, styles, attrs,
			rules = {},
			groupNum = 1;

		input = CKEDITOR.tools.trim( input );

		while ( ( match = input.match( groupPattern ) ) ) {
			styles = attrs = null;

			if ( ( attrsAndStyles = match[ 3 ] ) ) {
				styles = attrsAndStyles.match( /{([^}]+)}/ );
				if ( styles )
					styles = styles[ 1 ];

				attrs = attrsAndStyles.match( /\[([^\]]+)\]/ );
				if ( attrs )
					attrs = attrs[ 1 ];
			}

			rules[ '$' + groupNum++ ] = {
				elements: match[ 1 ],
				classes: match[ 2 ] || null,
				styles: styles,
				attrs: attrs
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

	function validatorFunction( validator ) {
		var type = typeof validator;
		if ( type == 'object' )
			type = validator.test ? 'regexp' : 'array';

		switch ( type ) {
			case 'function':
				return validator;
			case 'string':
				var arr = validator.split( /,\s+/ );
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
	// TODO... shouldn't be default completely empty?
	var defaultAllowedContent = {
		'p br div span': true
	};

})();