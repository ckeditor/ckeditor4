/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* globals CKEDITOR */

( function() {
	'use strict';

	var Style,
		tools = CKEDITOR.tools,
		plug = {};

	/**
	 * A set of common paste filter helpers.
	 *
	 * @since 4.13.0
	 * @private
	 * @member CKEDITOR.plugins.pastetools.filters
	 */
	CKEDITOR.plugins.pastetools.filters.common = plug;

	/**
	 * Common paste rules.
	 *
	 * @since 4.13.0
	 * @private
	 * @member CKEDITOR.plugins.pastetools.filters.common
	 */
	plug.rules = function( html, editor, filter ) {
		var availableFonts = getMatchingFonts( editor );
		return {
			elements: {
				'^': function( element ) {
					removeSuperfluousStyles( element );
					// Don't use "attributeNames", because those rules are applied after elements.
					// Normalization is required at the very begininng.
					normalizeAttributesName( element );
				},

				'span': function( element ) {
					if ( element.hasClass( 'Apple-converted-space' ) ) {
						return new CKEDITOR.htmlParser.text( ' ' );
					}
				},

				'table': function( element ) {
					element.filterChildren( filter );

					var parent = element.parent,
						root = parent && parent.parent,
						parentChildren,
						i;

					// In case parent div has only align attr, move it to the table element (https://dev.ckeditor.com/ticket/16811).
					if ( parent.name && parent.name === 'div' && parent.attributes.align &&
						tools.object.keys( parent.attributes ).length === 1 && parent.children.length === 1 ) {

						// If align is the only attribute of parent.
						element.attributes.align = parent.attributes.align;

						parentChildren = parent.children.splice( 0 );

						element.remove();
						for ( i = parentChildren.length - 1; i >= 0; i-- ) {
							root.add( parentChildren[ i ], parent.getIndex() );
						}
						parent.remove();
					}

					Style.convertStyleToPx( element );

				},

				'tr': function( element ) {
					// Attribues are moved to 'td' elements.
					element.attributes = {};
				},

				'td': function( element ) {
					var ascendant = element.getAscendant( 'table' ),
						ascendantStyle = tools.parseCssText( ascendant.attributes.style, true );

					// Sometimes the background is set for the whole table - move it to individual cells.
					var background = ascendantStyle.background;
					if ( background ) {
						Style.setStyle( element, 'background', background, true );
					}

					var backgroundColor = ascendantStyle[ 'background-color' ];
					if ( backgroundColor ) {
						Style.setStyle( element, 'background-color', backgroundColor, true );
					}

					var styles = tools.parseCssText( element.attributes.style, true ),
						borderStyles = styles.border ? CKEDITOR.tools.style.border.fromCssRule( styles.border ) : {},
						borders = tools.style.border.splitCssValues( styles, borderStyles ),
						tmpStyles = CKEDITOR.tools.clone( styles );

					// Drop all border styles before continue,
					// so there are no leftovers which may conflict with
					// new border styles.
					for ( var key in tmpStyles ) {
						if ( key.indexOf( 'border' ) == 0 ) {
							delete tmpStyles[ key ];
						}
					}

					element.attributes.style = CKEDITOR.tools.writeCssText( tmpStyles );

					// Unify background color property.
					if ( styles.background ) {
						var bg = CKEDITOR.tools.style.parse.background( styles.background );

						if ( bg.color ) {
							Style.setStyle( element, 'background-color', bg.color, true );
							Style.setStyle( element, 'background', '' );
						}
					}

					// Unify border properties.
					for ( var border in borders ) {
						var borderStyle = styles[ border ] ?
							CKEDITOR.tools.style.border.fromCssRule( styles[ border ] )
							: borders[ border ];

						// No need for redundant shorthand properties if style is disabled.
						if ( borderStyle.style === 'none' ) {
							Style.setStyle( element, border, 'none' );
						} else {
							Style.setStyle( element, border, borderStyle.toString() );
						}
					}

					Style.mapCommonStyles( element );

					Style.convertStyleToPx( element );

					Style.createStyleStack( element, filter, editor,
						/margin|text\-align|padding|list\-style\-type|width|height|border|white\-space|vertical\-align|background/i );
				},

				'font': function( element ) {
					if ( element.attributes.face && availableFonts ) {
						element.attributes.face = replaceWithMatchingFont( element.attributes.face, availableFonts );
					}
				}
			}
		};
	};

	/**
	 * Namespace containing all the helper functions to work with styles.
	 *
	 * @private
	 * @since 4.13.0
	 * @member CKEDITOR.plugins.pastetools.filters.common
	 */
	plug.styles = {
		setStyle: function( element, key, value, dontOverwrite ) {
			var styles = tools.parseCssText( element.attributes.style );

			if ( dontOverwrite && styles[ key ] ) {
				return;
			}

			if ( value === '' ) {
				delete styles[ key ];
			} else {
				styles[ key ] = value;
			}

			element.attributes.style = CKEDITOR.tools.writeCssText( styles );
		},

		convertStyleToPx: function( element ) {
			var style = element.attributes.style;

			if ( !style ) {
				return;
			}

			element.attributes.style = style.replace( /\d+(\.\d+)?pt/g, function( match ) {
				return CKEDITOR.tools.convertToPx( match ) + 'px';
			} );
		},

		// Map attributes to styles.
		mapStyles: function( element, attributeStyleMap ) {
			for ( var attribute in attributeStyleMap ) {
				if ( element.attributes[ attribute ] ) {
					if ( typeof attributeStyleMap[ attribute ] === 'function' ) {
						attributeStyleMap[ attribute ]( element.attributes[ attribute ] );
					} else {
						Style.setStyle( element, attributeStyleMap[ attribute ], element.attributes[ attribute ] );
					}
					delete element.attributes[ attribute ];
				}
			}
		},

		// Maps common attributes to styles.
		mapCommonStyles: function( element ) {
			return Style.mapStyles( element, {
				vAlign: function( value ) {
					Style.setStyle( element, 'vertical-align', value );
				},
				width: function( value ) {
					Style.setStyle( element, 'width', fixValue( value ) );
				},
				height: function( value ) {
					Style.setStyle( element, 'height', fixValue( value ) );
				}
			} );
		},

		/**
		 * Filters Word-specific styles for a given element. It may also filter additional styles
		 * based on the `editor` configuration.
		 *
		 * @private
		 * @since 4.13.0
		 * @param {CKEDITOR.htmlParser.element} element
		 * @param {CKEDITOR.editor} editor
		 * @member CKEDITOR.plugins.pastetools.filters.common.styles
		 */
		normalizedStyles: function( element, editor ) {

			// Some styles and style values are redundant, so delete them.
			var resetStyles = [
					'background-color:transparent',
					'border-image:none',
					'color:windowtext',
					'direction:ltr',
					'mso-',
					'visibility:visible',
					'div:border:none' // This one stays because https://dev.ckeditor.com/ticket/6241
				],
				textStyles = [
					'font-family',
					'font',
					'font-size',
					'color',
					'background-color',
					'line-height',
					'text-decoration'
				],
				matchStyle = function() {
					var keys = [];
					for ( var i = 0; i < arguments.length; i++ ) {
						if ( arguments[ i ] ) {
							keys.push( arguments[ i ] );
						}
					}

					return tools.indexOf( resetStyles, keys.join( ':' ) ) !== -1;
				},
				removeFontStyles = CKEDITOR.plugins.pastetools.getConfigValue( editor, 'removeFontStyles' ) === true;

			var styles = tools.parseCssText( element.attributes.style );

			if ( element.name == 'cke:li' ) {

				// IE8 tries to emulate list indentation with a combination of
				// text-indent and left margin. Normalize this. Note that IE8 styles are uppercase.
				if ( styles[ 'TEXT-INDENT' ] && styles.MARGIN ) {
					element.attributes[ 'cke-indentation' ] = plug.lists.getElementIndentation( element );
					styles.MARGIN = styles.MARGIN.replace( /(([\w\.]+ ){3,3})[\d\.]+(\w+$)/, '$10$3' );
				} else {
					// Remove text indent in other cases, because it works differently with lists in html than in Word.
					delete styles[ 'TEXT-INDENT' ];
				}
				delete styles[ 'text-indent' ];
			}

			var keys = tools.object.keys( styles );

			for ( var i = 0; i < keys.length; i++ ) {
				var styleName = keys[ i ].toLowerCase(),
					styleValue = styles[ keys[ i ] ],
					indexOf = CKEDITOR.tools.indexOf,
					toBeRemoved = removeFontStyles && indexOf( textStyles, styleName.toLowerCase() ) !== -1;

				if ( toBeRemoved || matchStyle( null, styleName, styleValue ) ||
					matchStyle( null, styleName.replace( /\-.*$/, '-' ) ) ||
					matchStyle( null, styleName ) ||
					matchStyle( element.name, styleName, styleValue ) ||
					matchStyle( element.name, styleName.replace( /\-.*$/, '-' ) ) ||
					matchStyle( element.name, styleName ) ||
					matchStyle( styleValue )
				) {
					delete styles[ keys[ i ] ];
				}
			}

			var keepZeroMargins = CKEDITOR.plugins.pastetools.getConfigValue( editor, 'keepZeroMargins' );
			// Still some elements might have shorthand margins or longhand with zero values.
			parseShorthandMargins( styles );
			normalizeMargins();

			return CKEDITOR.tools.writeCssText( styles );

			function normalizeMargins() {
				var keys = [ 'top', 'right', 'bottom', 'left' ];
				CKEDITOR.tools.array.forEach( keys, function( key ) {
					key = 'margin-' + key;
					if ( !( key in styles ) ) {
						return;
					}

					var value = CKEDITOR.tools.convertToPx( styles[ key ] );
					// We need to get rid of margins, unless they are allowed in config (#2935).
					if ( value || keepZeroMargins ) {
						styles[ key ] = value ? value + 'px' : 0;
					} else {
						delete styles[ key ];
					}
				} );
			}
		},

		/**
		 * Surrounds the element's children with a stack of `<span>` elements, each one having one style
		 * originally belonging to the element.
		 *
		 * @private
		 * @since 4.13.0
		 * @param {CKEDITOR.htmlParser.element} element
		 * @param {CKEDITOR.htmlParser.filter} filter
		 * @param {CKEDITOR.editor} editor
		 * @param {RegExp} [skipStyles] All matching style names will not be extracted to the style stack. Defaults
		 * to `/margin((?!-)|-left|-top|-bottom|-right)|text-indent|text-align|width|border|padding/i`.
		 * @member CKEDITOR.plugins.pastetools.filters.common.styles
		 */
		createStyleStack: function( element, filter, editor, skipStyles ) {
			var children = [],
				i;

			element.filterChildren( filter );

			// Store element's children somewhere else.
			for ( i = element.children.length - 1; i >= 0; i-- ) {
				children.unshift( element.children[ i ] );
				element.children[ i ].remove();
			}

			Style.sortStyles( element );

			// Create a stack of spans with each containing one style.
			var styles = tools.parseCssText( Style.normalizedStyles( element, editor ) ),
				innermostElement = element,
				styleTopmost = element.name === 'span'; // Ensure that the root element retains at least one style.

			for ( var style in styles ) {
				if ( style.match( skipStyles || /margin((?!-)|-left|-top|-bottom|-right)|text-indent|text-align|width|border|padding/i ) ) {
					continue;
				}

				if ( styleTopmost ) {
					styleTopmost = false;
					continue;
				}

				var newElement = new CKEDITOR.htmlParser.element( 'span' );

				newElement.attributes.style = style + ':' + styles[ style ];

				innermostElement.add( newElement );
				innermostElement = newElement;

				delete styles[ style ];
			}

			if ( !CKEDITOR.tools.isEmpty( styles ) ) {
				element.attributes.style = CKEDITOR.tools.writeCssText( styles );
			} else {
				delete element.attributes.style;
			}

			// Add the stored children to the innermost span.
			for ( i = 0; i < children.length; i++ ) {
				innermostElement.add( children[ i ] );
			}
		},

		// Some styles need to be stacked in a particular order to work properly.
		sortStyles: function( element ) {
			var orderedStyles = [
					'border',
					'border-bottom',
					'font-size',
					'background'
				],
				style = tools.parseCssText( element.attributes.style ),
				keys = tools.object.keys( style ),
				sortedKeys = [],
				nonSortedKeys = [];

			// Divide styles into sorted and non-sorted, because Array.prototype.sort()
			// requires a transitive relation.
			for ( var i = 0; i < keys.length; i++ ) {
				if ( tools.indexOf( orderedStyles, keys[ i ].toLowerCase() ) !== -1 ) {
					sortedKeys.push( keys[ i ] );
				} else {
					nonSortedKeys.push( keys[ i ] );
				}
			}

			// For styles in orderedStyles[] enforce the same order as in orderedStyles[].
			sortedKeys.sort( function( a, b ) {
				var aIndex = tools.indexOf( orderedStyles, a.toLowerCase() );
				var bIndex = tools.indexOf( orderedStyles, b.toLowerCase() );

				return aIndex - bIndex;
			} );

			keys = [].concat( sortedKeys, nonSortedKeys );

			var sortedStyles = {};

			for ( i = 0; i < keys.length; i++ ) {
				sortedStyles[ keys[ i ] ] = style[ keys[ i ] ];
			}

			element.attributes.style = CKEDITOR.tools.writeCssText( sortedStyles );
		},

		/**
		 * Moves the element styles lower in the DOM hierarchy. If `wrapText==true` and the direct child of an element
		 * is a text node, it will be wrapped in a `<span>` element.
		 *
		 * @private
		 * @since 4.13.0
		 * @param {CKEDITOR.htmlParser.element} element
		 * @param {Object} exceptions An object containing style names which should not be moved, e.g. `{ background: true }`.
		 * @param {Boolean} [wrapText=false] Whether a direct text child of an element should be wrapped into a `<span>` tag
		 * so that the styles can be moved to it.
		 * @returns {Boolean} Returns `true` if the styles were successfully moved lower.
		 * @member CKEDITOR.plugins.pastetools.filters.common.styles
		 */
		pushStylesLower: function( element, exceptions, wrapText ) {

			if ( !element.attributes.style ||
				element.children.length === 0 ) {
				return false;
			}

			exceptions = exceptions || {};

			// Entries ending with a dash match styles that start with
			// the entry name, e.g. 'border-' matches 'border-style', 'border-color' etc.
			var retainedStyles = {
				'list-style-type': true,
				'width': true,
				'height': true,
				'border': true,
				'border-': true
			};

			var styles = tools.parseCssText( element.attributes.style );

			for ( var style in styles ) {
				if ( style.toLowerCase() in retainedStyles ||
					retainedStyles [ style.toLowerCase().replace( /\-.*$/, '-' ) ] ||
					style.toLowerCase() in exceptions ) {
					continue;
				}

				var pushed = false;

				for ( var i = 0; i < element.children.length; i++ ) {
					var child = element.children[ i ];

					if ( child.type === CKEDITOR.NODE_TEXT && wrapText ) {
						var wrapper = new CKEDITOR.htmlParser.element( 'span' );
						wrapper.setHtml( child.value );
						child.replaceWith( wrapper );
						child = wrapper;
					}

					if ( child.type !== CKEDITOR.NODE_ELEMENT ) {
						continue;
					}

					pushed = true;

					Style.setStyle( child, style, styles[ style ] );
				}

				if ( pushed ) {
					delete styles[ style ];
				}
			}

			element.attributes.style = CKEDITOR.tools.writeCssText( styles );

			return true;
		},

		/**
		 * Namespace containing the styles inliner.
		 *
		 * @since 4.13.0
		 * @private
		 * @member CKEDITOR.plugins.pastetools.filters.common.styles
		 */
		inliner: {
			/**
			 *
			 * Styles skipped by the styles inliner.
			 *
			 * @property {String[]}
			 * @private
			 * @since 4.13.0
			 * @member CKEDITOR.plugins.pastetools.filters.common.styles.inliner
			 */
			filtered: [
				'break-before',
				'break-after',
				'break-inside',
				'page-break',
				'page-break-before',
				'page-break-after',
				'page-break-inside'
			],

			/**
			 * Parses the content of the provided `<style>` element.
			 *
			 * @param {CKEDITOR.dom.element/String} styles The `<style>` element or CSS text.
			 * @returns {Array} An array containing parsed styles. Each item (style) is an object containing two properties:
			 * * selector &ndash; A string representing a CSS selector.
			 * * styles &ndash; An object containing a list of styles (e.g. `{ margin: 0, text-align: 'left' }`).
			 * @since 4.13.0
			 * @private
			 * @member CKEDITOR.plugins.pastetools.filters.common.styles.inliner
			 */
			parse: function( styles ) {
				var parseCssText = CKEDITOR.tools.parseCssText,
					filterStyles = Style.inliner.filter,
					sheet = styles.is ? styles.$.sheet : createIsolatedStylesheet( styles );

				function createIsolatedStylesheet( styles ) {
					var style = new CKEDITOR.dom.element( 'style' ),
						iframe = new CKEDITOR.dom.element( 'iframe' );

					iframe.hide();
					CKEDITOR.document.getBody().append( iframe );
					iframe.$.contentDocument.documentElement.appendChild( style.$ );

					style.$.textContent = styles;
					iframe.remove();
					return style.$.sheet;
				}

				function getStyles( cssText ) {
					var startIndex = cssText.indexOf( '{' ),
						endIndex = cssText.indexOf( '}' );

					return parseCssText( cssText.substring( startIndex + 1, endIndex ), true );
				}

				var parsedStyles = [],
					rules,
					i;

				if ( sheet ) {
					rules = sheet.cssRules;

					for ( i = 0; i < rules.length; i++ ) {
						// To detect if the rule contains styles and is not an at-rule, it's enough to check rule's type.
						if ( rules[ i ].type === window.CSSRule.STYLE_RULE ) {
							parsedStyles.push( {
								selector: rules[ i ].selectorText,
								styles: filterStyles( getStyles( rules[ i ].cssText ) )
							} );
						}
					}
				}
				return parsedStyles;
			},

			/**
			 * Filters out all unnecessary styles.
			 *
			 * @param {Object} stylesObj An object containing parsed CSS declarations
			 * as property/value pairs (see {@link CKEDITOR.plugins.pastetools.filters.common.styles.inliner#parse}).
			 * @returns {Object} The `stylesObj` copy with specific styles filtered out.
			 * @since 4.13.0
			 * @private
			 * @member CKEDITOR.plugins.pastetools.filters.common.styles.inliner
			 */
			filter: function( stylesObj ) {
				var toRemove = Style.inliner.filtered,
					indexOf = tools.array.indexOf,
					newObj = {},
					style;

				for ( style in stylesObj ) {
					if ( indexOf( toRemove, style ) === -1 ) {
						newObj[ style ] = stylesObj[ style ];
					}
				}

				return newObj;
			},

			/**
			 * Sorts the given styles array. All rules containing class selectors will have lower indexes than the rest
			 * of the rules. Selectors with the same priority will be sorted in a reverse order than in the input array.
			 *
			 * @param {Array} stylesArray An array of styles as returned from
			 * {@link CKEDITOR.plugins.pastetools.filters.common.styles.inliner#parse}.
			 * @returns {Array} Sorted `stylesArray`.
			 * @since 4.13.0
			 * @private
			 * @member CKEDITOR.plugins.pastetools.filters.common.styles.inliner
			 */
			sort: function( stylesArray ) {

				// Returns comparison function which sorts all selectors in a way that class selectors are ordered
				// before the rest of the selectors. The order of the selectors with the same specificity
				// is reversed so that the most important will be applied first.
				function getCompareFunction( styles ) {
					var order = CKEDITOR.tools.array.map( styles, function( item ) {
						return item.selector;
					} );

					return function( style1, style2 ) {
						var value1 = isClassSelector( style1.selector ) ? 1 : 0,
							value2 = isClassSelector( style2.selector ) ? 1 : 0,
							result = value2 - value1;

						// If the selectors have same specificity, the latter one should
						// have higher priority (goes first).
						return result !== 0 ? result :
							order.indexOf( style2.selector ) - order.indexOf( style1.selector );
					};
				}

				// True if given CSS selector contains a class selector.
				function isClassSelector( selector ) {
					return ( '' + selector ).indexOf( '.' ) !== -1;
				}

				return stylesArray.sort( getCompareFunction( stylesArray ) );
			},

			/**
			 * Finds and inlines all the `<style>` elements in a given `html` string and returns a document where
			 * all the styles are inlined into appropriate elements.
			 *
			 * This is needed because sometimes Microsoft Word does not put the style directly into the element, but
			 * into a generic style sheet.
			 *
			 * @param {String} html An HTML string to be parsed.
			 * @returns {CKEDITOR.dom.document}
			 * @since 4.13.0
			 * @private
			 * @member CKEDITOR.plugins.pastetools.filters.common.styles.inliner
			 */
			inline: function( html ) {
				var parseStyles = Style.inliner.parse,
					sortStyles = Style.inliner.sort,
					document = createTempDocument( html ),
					stylesTags = document.find( 'style' ),
					stylesArray = sortStyles( parseStyleTags( stylesTags ) );

				function createTempDocument( html ) {
					var parser = new DOMParser(),
						document = parser.parseFromString( html, 'text/html' );

					return new CKEDITOR.dom.document( document );
				}

				function parseStyleTags( stylesTags ) {
					var styles = [],
						i;

					for ( i = 0; i < stylesTags.count(); i++ ) {
						styles = styles.concat( parseStyles( stylesTags.getItem( i ) ) );
					}

					return styles;
				}

				function applyStyle( document, selector, style ) {
					var elements = document.find( selector ),
						element,
						oldStyle,
						newStyle,
						i;

					parseShorthandMargins( style );

					for ( i = 0; i < elements.count(); i++ ) {
						element = elements.getItem( i );

						oldStyle = CKEDITOR.tools.parseCssText( element.getAttribute( 'style' ) );

						parseShorthandMargins( oldStyle );
						// The styles are applied with decreasing priority so we do not want
						// to overwrite the existing properties.
						newStyle = CKEDITOR.tools.extend( {}, oldStyle, style );
						element.setAttribute( 'style', CKEDITOR.tools.writeCssText( newStyle ) );
					}
				}

				CKEDITOR.tools.array.forEach( stylesArray, function( style ) {
					applyStyle( document, style.selector, style.styles );
				} );

				return document;
			}
		}
	};
	Style = plug.styles;

	plug.lists = {
		getElementIndentation: function( element ) {
			var style = tools.parseCssText( element.attributes.style );

			if ( style.margin || style.MARGIN ) {
				style.margin = style.margin || style.MARGIN;
				var fakeElement = {
					styles: {
						margin: style.margin
					}
				};
				CKEDITOR.filter.transformationsTools.splitMarginShorthand( fakeElement );
				style[ 'margin-left' ] = fakeElement.styles[ 'margin-left' ];
			}

			return parseInt( tools.convertToPx( style[ 'margin-left' ] || '0px' ), 10 );
		}
	};

	/**
	 * Namespace containing all the helper functions to work with elements.
	 *
	 * @private
	 * @since 4.13.0
	 * @member CKEDITOR.plugins.pastetools.filters.common
	 */
	plug.elements = {
		/**
		 * Replaces an element with its children.
		 *
		 * This function is customized to work inside filters.
		 *
		 * @private
		 * @since 4.13.0
		 * @param {CKEDITOR.htmlParser.element} element
		 * @member CKEDITOR.plugins.pastetools.filters.common.elements
		 */
		replaceWithChildren: function( element ) {
			for ( var i = element.children.length - 1; i >= 0; i-- ) {
				element.children[ i ].insertAfter( element );
			}
		}
	};

	plug.createAttributeStack = createAttributeStack;

	plug.parseShorthandMargins = parseShorthandMargins;

	/**
	 * Namespace containing all the helper functions to work with [RTF](https://interoperability.blob.core.windows.net/files/Archive_References/%5bMSFT-RTF%5d.pdf).
	 *
	 * @private
	 * @since 4.16.0
	 * @member CKEDITOR.plugins.pastetools.filters.common
	 */
	plug.rtf = {
		/**
		 * Get all groups from the RTF content with the given name.
		 *
		 * ```js
		 * var rtfContent = '{\\rtf1\\some\\control\\words{\\group content}{\\group content}{\\whatever {\\subgroup content}}}',
		 * 	groups = CKEDITOR.plugins.pastetools.filters.common.rtf.getGroups( rtfContent, '(group|whatever)' );
		 *
		 * console.log( groups );
		 *
		 * // Result of the console.log:
		 * // [
		 * // 	{"start":25,"end":41,"content":"{\\group content}"},
		 * // 	{"start":41,"end":57,"content":"{\\group content}"},
		 * // 	{"start":57,"end":88,"content":"{\\whatever {\\subgroup content}}"}
		 * // ]
		 * ```
		 *
		 * @private
		 * @since 4.16.0
		 * @param {String} rtfContent
		 * @param {String} groupName Group name to find. It can be a regex-like string.
		 * @returns {CKEDITOR.plugins.pastetools.filters.common.rtf.GroupInfo[]}
		 * @member CKEDITOR.plugins.pastetools.filters.common.rtf
		 */
		getGroups: function( rtfContent, groupName ) {
			var groups = [],
				current,
				from = 0;

			while ( current = plug.rtf.getGroup( rtfContent, groupName, {
				start: from
			} ) ) {
				from = current.end;

				groups.push( current );
			}

			return groups;
		},

		/**
		 * Remove all groups from the RTF content with the given name.
		 *
		 * ```js
		 * var rtfContent = '{\\rtf1\\some\\control\\words{\\group content}{\\group content}{\\whatever {\\subgroup content}}}',
		 * 	rtfWithoutGroups = CKEDITOR.plugins.pastetools.filters.common.rtf.removeGroups( rtfContent, '(group|whatever)' );
		 *
		 * console.log( rtfWithoutGroups ); // {\rtf1\some\control\words}
		 * ```
		 *
		 * @private
		 * @since 4.16.0
		 * @param {String} rtfContent
		 * @param {String} groupName Group name to find. It can be a regex-like string.
		 * @returns {String} RTF content without the removed groups.
		 * @member CKEDITOR.plugins.pastetools.filters.common.rtf
		 */
		removeGroups: function( rtfContent, groupName ) {
			var current;

			while ( current = plug.rtf.getGroup( rtfContent, groupName ) ) {
				var beforeContent = rtfContent.substring( 0, current.start ),
					afterContent = rtfContent.substring( current.end );

				rtfContent = beforeContent + afterContent;
			}

			return rtfContent;
		},

		/**
		 * Get the group from the RTF content with the given name.
		 *
		 * Groups are recognized thanks to being in `{\<name>}` format.
		 *
		 * ```js
		 * var rtfContent = '{\\rtf1\\some\\control\\words{\\group content1}{\\group content2}{\\whatever {\\subgroup content}}}',
		 * 	firstGroup = CKEDITOR.plugins.pastetools.filters.common.rtf.getGroup( rtfContent, '(group|whatever)' ),
		 * 	lastGroup = CKEDITOR.plugins.pastetools.filters.common.rtf.getGroup( rtfContent, '(group|whatever)', {
		 * 		start: 50
		 * 	} );
		 *
		 * console.log( firstGroup ); // {"start":25,"end":42,"content":"{\\group content1}"}
		 * console.log( lastGroup ); // {"start":59,"end":90,"content":"{\\whatever {\\subgroup content}}"}
		 * ```
		 *
		 * @private
		 * @since 4.16.0
		 * @param {String} content RTF content.
		 * @param {String} groupName Group name to find. It can be a regex-like string.
		 * @param {Object} options Additional options.
		 * @param {Number} options.start String index on which the search should begin.
		 * @returns {CKEDITOR.plugins.pastetools.filters.common.rtf.GroupInfo}
		 * @member CKEDITOR.plugins.pastetools.filters.common.rtf
		 */
		getGroup: function( content, groupName, options ) {
			// This function is in fact a very primitive RTF parser.
			// It iterates over RTF content and search for the last } in the group
			// by keeping track of how many elements are open using a stack-like method.
			var open = 0,
				// Despite the fact that we search for only one group,
				// the global modifier is used to be able to manipulate
				// the starting index of the search. Without g flag it's impossible.
				startRegex = new RegExp( '\\{\\\\' + groupName, 'g' ),
				group,
				i,
				current;

			options = CKEDITOR.tools.object.merge( {
				start: 0
			}, options || {} );

			startRegex.lastIndex = options.start;
			group = startRegex.exec( content );

			if ( !group ) {
				return null;
			}

			i = group.index;
			current = content[ i ];

			do {
				// Every group start has format of {\. However there can be some whitespace after { and before /.
				// Additionally we need to filter also curly braces from the content – fortunately they are escaped.
				var isValidGroupStart = current === '{' && getPreviousNonWhitespaceChar( content, i ) !== '\\' &&
					getNextNonWhitespaceChar( content, i ) === '\\',
					isValidGroupEnd = current === '}' && getPreviousNonWhitespaceChar( content, i ) !== '\\' &&
						open > 0;

				if ( isValidGroupStart ) {
					open++;
				} else if ( isValidGroupEnd ) {
					open--;
				}

				current = content[ ++i ];
			} while ( current && open > 0 );

			return {
				start: group.index,
				end: i,
				content: content.substring( group.index, i )
			};
		},

		/**
		 * Get group content.
		 *
		 * The content starts with the first character that is not a part of
		 * control word or subgroup.
		 *
		 * ```js
		 * var group = '{\\group{\\subgroup subgroupcontent} group content}',
		 * 	groupContent = CKEDITOR.plugins.pastetools.filters.common.rtf.extractGroupContent( group );
		 *
		 * console.log( groupContent ); // "group content"
		 * ```
		 *
		 * @private
		 * @since 4.16.0
		 * @param {String} group Whole group string.
		 * @returns {String} Extracted group content.
		 * @member CKEDITOR.plugins.pastetools.filters.common.rtf
		 */
		extractGroupContent: function( group ) {
			var groupName = getGroupName( group ),
				controlWordsRegex = /^\{(\\[\w-]+\s*)+/g,
				// Sometimes content follows the last subgroup without any space.
				// We need to add it to correctly parse the whole thing.
				subgroupWithousSpaceRegex = /\}([^{\s]+)/g;

			group = group.replace( subgroupWithousSpaceRegex, '} $1' );
			// And now remove all subgroups that are not the actual group.
			group = plug.rtf.removeGroups( group, '(?!' + groupName + ')' );
			// Remove all control words and trim the whitespace at the beginning
			// that could be introduced by preserving space after last subgroup.
			group = CKEDITOR.tools.trim( group.replace( controlWordsRegex, '' ) );

			// What's left is group content with } at the end.
			return group.replace( /}$/, '' );
		}
	};

	function getGroupName( group ) {
		var groupNameRegex = /^\{\\(\w+)/,
			groupName = group.match( groupNameRegex );

		if ( !groupName ) {
			return null;
		}

		return groupName[ 1 ];
	}

	function getPreviousNonWhitespaceChar( content, index ) {
		return getNonWhitespaceChar( content, index, -1 );
	}

	function getNextNonWhitespaceChar( content, index ) {
		return getNonWhitespaceChar( content, index, 1 );
	}

	function getNonWhitespaceChar( content, startIndex, direction ) {
		var index = startIndex + direction,
			current = content[ index ],
			whiteSpaceRegex = /[\s]/;

		while ( current && whiteSpaceRegex.test( current ) ) {
			index = index + direction;
			current = content[ index ];
		}

		return current;
	}


	function fixValue( value ) {
		// Add 'px' only for values which are not ended with %
		var endsWithPercent = /%$/;

		return endsWithPercent.test( value ) ? value : value + 'px';
	}

	// Same as createStyleStack, but instead of styles - stack attributes.
	function createAttributeStack( element, filter ) {
		var i,
			children = [];

		element.filterChildren( filter );

		// Store element's children somewhere else.
		for ( i = element.children.length - 1; i >= 0; i-- ) {
			children.unshift( element.children[ i ] );
			element.children[ i ].remove();
		}

		// Create a stack of spans with each containing one style.
		var attributes = element.attributes,
			innermostElement = element,
			topmost = true;

		for ( var attribute in attributes ) {

			if ( topmost ) {
				topmost = false;
				continue;
			}

			var newElement = new CKEDITOR.htmlParser.element( element.name );

			newElement.attributes[ attribute ] = attributes[ attribute ];

			innermostElement.add( newElement );
			innermostElement = newElement;

			delete attributes[ attribute ];
		}

		// Add the stored children to the innermost span.
		for ( i = 0; i < children.length; i++ ) {
			innermostElement.add( children[ i ] );
		}
	}

	function parseShorthandMargins( style ) {
		var marginCase = style.margin ? 'margin' : style.MARGIN ? 'MARGIN' : false,
			key, margin;
		if ( marginCase ) {
			margin = CKEDITOR.tools.style.parse.margin( style[ marginCase ] );
			for ( key in margin ) {
				style[ 'margin-' + key ] = margin[ key ];
			}
			delete style[ marginCase ];
		}
	}

	function removeSuperfluousStyles( element ) {
		var resetStyles = [
				'background-color:transparent',
				'background:transparent',
				'background-color:none',
				'background:none',
				'background-position:initial initial',
				'background-repeat:initial initial',
				'caret-color',
				'font-family:-webkit-standard',
				'font-variant-caps',
				'letter-spacing:normal',
				'orphans',
				'widows',
				'text-transform:none',
				'word-spacing:0px',
				'-webkit-text-size-adjust:auto',
				'-webkit-text-stroke-width:0px',
				'text-indent:0px',
				'margin-bottom:0in'
			];

		var styles = CKEDITOR.tools.parseCssText( element.attributes.style ),
			styleName,
			styleString;

		for ( styleName in styles ) {
			styleString = styleName + ':' + styles[ styleName ];

			if ( CKEDITOR.tools.array.some( resetStyles, function( val ) {
				return styleString.substring( 0, val.length ).toLowerCase() === val;
			} ) ) {
				delete styles[ styleName ];
				continue;
			}
		}

		styles = CKEDITOR.tools.writeCssText( styles );

		if ( styles !== '' ) {
			element.attributes.style = styles;
		} else {
			delete element.attributes.style;
		}
	}

	function getMatchingFonts( editor ) {
		var fontNames = editor.config.font_names,
			validNames = [];

		if ( !fontNames || !fontNames.length ) {
			return false;
		}

		validNames = CKEDITOR.tools.array.map( fontNames.split( ';' ), function( value ) {
			// Font can have a short name at the begining. It's necessary to remove it, to apply correct style.
			if ( value.indexOf( '/' ) === -1 ) {
				return value;
			}

			return value.split( '/' )[ 1 ];
		} );

		return validNames.length ? validNames : false;
	}

	function replaceWithMatchingFont( fontValue, availableFonts ) {
		var fontParts = fontValue.split( ',' ),
			matchingFont = CKEDITOR.tools.array.find( availableFonts, function( font ) {
				for ( var i = 0; i < fontParts.length; i++ ) {
					if ( font.indexOf( CKEDITOR.tools.trim( fontParts[ i ] ) ) === -1 ) {
						return false;
					}
				}

				return true;
			} );

		return matchingFont || fontValue;
	}

	function normalizeAttributesName( element ) {
		if ( element.attributes.bgcolor ) {
			var styles = CKEDITOR.tools.parseCssText( element.attributes.style );

			if ( !styles[ 'background-color' ] ) {
				styles[ 'background-color' ] = element.attributes.bgcolor;

				element.attributes.style = CKEDITOR.tools.writeCssText( styles );
			}
		}
	}

	/**
	 * Virtual class that illustrates group info
	 * returned by {@link CKEDITOR.plugins.pastetools.filters.common.rtf#getGroup} method.
	 *
	 * @since 4.16.0
	 * @class CKEDITOR.plugins.pastetools.filters.common.rtf.GroupInfo
	 * @abstract
	 */

	/**
	 * String index, on which the group starts.
	 *
	 * @property {Number} start
	 * @member CKEDITOR.plugins.pastetools.filters.common.rtf.GroupInfo
	 */

	/**
	 * String index, on which the group ends.
	 *
	 * @property {Number} end
	 * @member CKEDITOR.plugins.pastetools.filters.common.rtf.GroupInfo
	 */

	/**
	 * The whole group, including control words and subgroups.
	 *
	 * @property {String} content
	 * @member CKEDITOR.plugins.pastetools.filters.common.rtf.GroupInfo
	 */

	/**
	 * Whether to ignore all font-related formatting styles, including:
	 *
	 * * font size,
	 * * font family,
	 * * font foreground and background color.
	 *
	 * ```js
	 *	config.pasteTools_removeFontStyles = true;
	 * ```
	 *
	 * **Important note:** This configuration option is deprecated.
	 * Either configure a proper {@glink guide/dev_advanced_content_filter Advanced Content Filter} for the editor
	 * or use the {@link CKEDITOR.editor#afterPasteFromWord} event.
	 *
	 * @deprecated 4.13.0
	 * @since 4.13.0
	 * @cfg {Boolean} [pasteTools_removeFontStyles=false]
	 * @member CKEDITOR.config
	 */

	/**
	 * Whether the `margin` style of a pasted element that equals to 0 should be removed.
	 *
	 * ```js
	 *	// Disable removing `margin:0`, `margin-left:0`, etc.
	 *	config.pasteTools_keepZeroMargins = true;
	 * ```
	 *
	 * **Note**: Please remember to update the {@glink guide/dev_advanced_content_filter Advanced Content Filter}
	 * when you want to keep margins that other plugins don't use like `top` and `bottom`.
	 *
	 * @since 4.13.0
	 * @cfg {Boolean} [pasteTools_keepZeroMargins=false]
	 * @member CKEDITOR.config
	 */
} )();
