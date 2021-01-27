/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* globals CKEDITOR */

( function() {
	'use strict';

	var pastetools = CKEDITOR.plugins.pastetools,
		commonFilter = pastetools.filters.common,
		Style = commonFilter.styles;

	/**
	 * A set of Paste from LibreOffice plugin helpers.
	 *
	 * @since 4.14.0
	 * @private
	 * @member CKEDITOR.plugins.pastetools.filters
	 */
	CKEDITOR.plugins.pastetools.filters.libreoffice = {
		/**
		 * Rules for the Paste from LibreOffice filter.
		 *
		 * @since 4.14.0
		 * @private
		 * @member CKEDITOR.plugins.pastetools.filters.libreoffice
		 */
		rules: function( html, editor, filter ) {
			return {
				root: function( element ) {
					element.filterChildren( filter );
				},

				comment: function() {
					return false;
				},

				elementNames: [
					[ /^head$/i, '' ],
					[ /^meta$/i, '' ],
					[ /^strike$/i, 's' ]
				],

				elements: {
					// Required due to bug (#3664).
					'!doctype': function( el ) {
						el.replaceWithChildren();
					},

					'span': function( element ) {
						if ( element.attributes.style ) {
							element.attributes.style = Style.normalizedStyles( element, editor );

							Style.createStyleStack( element, filter, editor );
						}

						replaceEmptyElementWithChildren( element );
					},

					'p': function( element ) {
						var styles = CKEDITOR.tools.parseCssText( element.attributes.style );

						if ( editor.plugins.pagebreak &&
							( styles[ 'page-break-before' ] === 'always' || styles[ 'break-before' ] === 'page' )
						) {
							insertPageBreakBefore( editor, element );
						}

						element.attributes.style = CKEDITOR.tools.writeCssText( styles );

						element.filterChildren( filter );
						Style.createStyleStack( element, filter, editor );
					},

					'div': function( element ) {
						Style.createStyleStack( element, filter, editor );
					},

					'a': function( el ) {
						if ( el.attributes.style ) {
							el.attributes.style = removeDefaultLinkStyles( el.attributes.style );
						}
					},

					'h1': function( el ) {
						Style.createStyleStack( el, filter, editor );
					},

					'h2': function( el ) {
						Style.createStyleStack( el, filter, editor );
					},

					'h3': function( el ) {
						Style.createStyleStack( el, filter, editor );
					},

					'h4': function( el ) {
						Style.createStyleStack( el, filter, editor );
					},

					'h5': function( el ) {
						Style.createStyleStack( el, filter, editor );
					},

					'h6': function( el ) {
						Style.createStyleStack( el, filter, editor );
					},

					'pre': function( el ) {
						Style.createStyleStack( el, filter, editor );
					},

					'font': function( el ) {
						if ( shouldReplaceFontWithChildren( el ) ) {
							el.replaceWithChildren();
						}

						// 1. Case there is no style stack
						// 2. font-size is child of this node
						// 3. font-size is parent of this node
						var styles = CKEDITOR.tools.parseCssText( el.attributes.style );
						var firstChild = el.getFirst();

						if ( el.attributes.size &&
							firstChild &&
							firstChild.type === CKEDITOR.NODE_ELEMENT &&
							/font-size/.test( firstChild.attributes.style )
						) {
							el.replaceWithChildren();
						}

						if ( styles[ 'font-size' ] ) {
							// We need to remove 'size' and transform font to span with 'font-size'.
							delete el.attributes.size;
							el.name = 'span';

							if ( firstChild && firstChild.type === CKEDITOR.NODE_ELEMENT && firstChild.attributes.size ) {
								firstChild.replaceWithChildren();
							}
						}
					},

					'ul': function( el ) {
						if ( listMerger( el, filter ) ) {
							return false;
						}
					},

					'ol': function( el ) {
						if ( listMerger( el, filter ) ) {
							return false;
						}
					},

					'img': function( el ) {
						var src = el.attributes.src;

						if ( !src ) {
							return false;
						}
					},

					// All tables in LO assume collapsed borders, but the style is
					// not always provided during the paste.
					'table': function( element ) {
						element.attributes.style = addBorderCollapse( element.attributes.style );
					}
				},

				attributes: {
					'style': function( styles, element ) {
						// Returning false deletes the attribute.
						return Style.normalizedStyles( element, editor ) || false;
					},

					// Many elements can have [align] attribute. Let's make it a wildcard
					// transformation then!
					'align': function( align, element ) {
						// Images have their own handling logic.
						if ( element.name === 'img' ) {
							return;
						}

						var styles = CKEDITOR.tools.parseCssText( element.attributes.style );

						styles[ 'text-align' ] = element.attributes.align;
						element.attributes.style = CKEDITOR.tools.writeCssText( styles );

						return false;
					},

					'cellspacing': remove,

					'cellpadding': remove,

					'border': remove
				}
			};
		}
	};

	function replaceEmptyElementWithChildren( element ) {
		if ( !CKEDITOR.tools.object.entries( element.attributes ).length ) {
			element.replaceWithChildren();
		}
	}

	function shouldReplaceFontWithChildren( element ) {
		// Anchor is additionally styled with font.
		if ( element.parent.name === 'a' && element.attributes.color === '#000080' ) {
			return true;
		}

		// Sub or sup is additionally styled with font.
		if ( element.parent.children.length === 1 && ( element.parent.name === 'sup' || element.parent.name === 'sub' ) && element.attributes.size === '2' ) {
			return true;
		}

		return false;
	}

	// Return true if a list is successfully merged to the previous item..
	function listMerger( el, filter ) {
		if ( !shouldMergeToPreviousList( el ) ) {
			return false;
		}

		var previous = el.previous,
			lastLi = getLastListItem( previous ),
			liDepthValue = checkDepth( lastLi ),
			innerList = unwrapList( el, liDepthValue );

		if ( innerList ) {
			lastLi.add( innerList );
			innerList.filterChildren( filter );
			return true;
		}

		return false;
	}

	function shouldMergeToPreviousList( element ) {
		// There needs to be a previous list that the element should be merged to.
		if ( !element.previous || !isList( element.previous ) ) {
			return false;
		}

		// There might be cases in PFW where a li element has no children (test Tickets/7131 word2013 chrome).
		if ( !element.getFirst().children.length ) {
			return false;
		}

		// The current list needs to be a nested list, what points that is sublist.
		if ( element.children.length !== 1 || !isList( element.getFirst().getFirst() ) ) {
			return false;
		}

		return true;
	}

	// Checks the evel of nested list for a given element.
	// It's exepected that the argument is the `li` element.
	function checkDepth( element ) {
		var level = 0,
			currentElement = element,
			listEvaluator = getListEvaluator();

		while ( ( currentElement = currentElement.getAscendant( listEvaluator ) ) ) {
			level++;
		}

		return level;
	}

	function getLastListItem( el ) {
		var lastChild = el.children[ el.children.length - 1 ];

		if ( !isList( lastChild ) && lastChild.name !== 'li' ) {
			return el;
		}

		return getLastListItem( lastChild );
	}

	function getListEvaluator() {
		var isInBlock = false;

		return function( element ) {
			// There might be situation that the list is somehow nested in another type of element, quotes, div, table, etc.
			// When such situation happens, we should not search for any above list.
			if ( isInBlock ) {
				return false;
			}

			if ( !isList( element ) && element.name !== 'li' ) {
				isInBlock = true;
				return false;
			}

			return isList( element );
		};
	}

	// Get a nested list by first items.
	function unwrapList( list, count ) {
		if ( count ) {
			return unwrapList( list.getFirst().getFirst(), --count );
		}

		return list;
	}

	function isList( element ) {
		return element.name === 'ol' || element.name === 'ul';
	}

	function remove() {
		return false;
	}

	function removeDefaultLinkStyles( styles ) {
		var parsedStyles = CKEDITOR.tools.parseCssText( styles );

		if ( parsedStyles.color === '#000080' ) {
			delete parsedStyles.color;
		}

		if ( parsedStyles[ 'text-decoration' ] === 'underline' ) {
			delete parsedStyles[ 'text-decoration' ];
		}

		return CKEDITOR.tools.writeCssText( parsedStyles );
	}

	function insertPageBreakBefore( editor, element ) {
		var pagebreakEl = CKEDITOR.plugins.pagebreak.createElement( editor );

		pagebreakEl = CKEDITOR.htmlParser.fragment.fromHtml( pagebreakEl.getOuterHtml() ).children[ 0 ];

		pagebreakEl.insertBefore( element );
	}

	function addBorderCollapse( styles ) {
		var parsedStyles = CKEDITOR.tools.parseCssText( styles );

		if ( parsedStyles[ 'border-collapse' ] ) {
			return styles;
		}

		parsedStyles[ 'border-collapse' ] = 'collapse';

		return CKEDITOR.tools.writeCssText( parsedStyles );
	}

	CKEDITOR.pasteFilters.libreoffice = pastetools.createFilter( {
		rules: [
			commonFilter.rules,
			CKEDITOR.plugins.pastetools.filters.libreoffice.rules
		]
	} );
} )();
