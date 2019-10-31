/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* globals CKEDITOR */

( function() {
	'use strict';

	var pastetools = CKEDITOR.plugins.pastetools,
		commonFilter = pastetools.filters.common,
		Style = commonFilter.styles;

	/**
	 * Set of Paste from Libre Office plugin helpers.
	 *
	 * @since 4.14.0
	 * @private
	 * @member CKEDITOR.plugins.pastetools.filters
	 */
	CKEDITOR.plugins.pastetools.filters.pflibreoffice = {
		/**
		 * Rules for the Paste from Libre Office filter.
		 *
		 * @since 4.14.0
		 * @private
		 * @member CKEDITOR.plugins.pastetools.filters.pflibreoffice
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
						if ( element.attributes.align ) {
							var styles = CKEDITOR.tools.parseCssText( element.attributes.style );

							styles[ 'text-align' ] = element.attributes.align;
							delete element.attributes.align;

							element.attributes.style = CKEDITOR.tools.writeCssText( styles );
						}

						element.filterChildren( filter );
						Style.createStyleStack( element, filter, editor );
					},

					'div': function( element ) {
						Style.createStyleStack( element, filter, editor );
					},

					'a': function( el ) {
						if ( el.attributes.style ) {
							var styles = CKEDITOR.tools.parseCssText( el.attributes.style );

							if ( styles.color === '#000080' ) {
								delete styles.color;
							}

							if ( styles[ 'text-decoration' ] === 'underline' ) {
								delete styles[ 'text-decoration' ];
							}

							el.attributes.style = CKEDITOR.tools.writeCssText( styles );
						}
					},

					'font': function( el ) {
						if ( shouldReplaceFontWithChildren( el ) ) {
							el.replaceWithChildren();
						}

						if ( el.attributes.size ) {
							fontSizeFixer( el );
							if ( el.children.length === 1 && el.children[ 0 ].name === 'font' ) {
								// Probably element was split by PFW and there was created a style stack for font.
								var childStyles = CKEDITOR.tools.parseCssText( el.children[ 0 ].attributes.style );

								if ( childStyles[ 'font-size' ] ) {
									el.replaceWithChildren();
								}
							} else {
								var styles = CKEDITOR.tools.parseCssText( el.attributes.style );

								if ( styles[ 'font-size' ] ) {
									// We need to remove 'size' and transform font to span with 'font-size'.
									delete el.attributes.size;
									el.name = 'span';
								}
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
					}
				},

				attributes: {
					'style': function( styles, element ) {
						// Returning false deletes the attribute.
						return Style.normalizedStyles( element, editor ) || false;
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
		// Anchor is additionaly styled with font
		if ( element.parent.name === 'a' && element.attributes.color === '#000080' ) {
			return true;
		}

		// Sub or sup is additionaly styled with font
		if ( element.parent.children.length === 1 && ( element.parent.name === 'sup' || element.parent.name === 'sub' ) && element.attributes.size === '2' ) {
			return true;
		}

		return false;
	}

	function fontSizeFixer( element ) {
		// There are 2 sitaution:
		// 1. font tag has 2 attributes 'size' and 'style' with 'font-size' - situation when content was not transformed with PFW
		// 2. font tag has 'size' attribute and has child which is a font with 'style' containing 'font-size' - situation when PFW made a style stack
		if ( element.attributes.style ) {
			var styles = CKEDITOR.tools.parseCssText( element.attributes.style );
			if ( styles[ 'font-size' ] ) {
				delete element.attributes.size;
				element.name = 'span';
			}
		} else if ( element.children.length === 1 && element.children[ 0 ].name === 'font' ) {
			var childStyles = CKEDITOR.tools.parseCssText( element.children[ 0 ].attributes.style );
			if ( childStyles[ 'font-size' ] ) {
				element.children[ 0 ].name = 'span';
				element.replaceWithChildren();
			}
		}
	}

	// Return true if sucesfuly merge list to previous item.
	function listMerger( el, filter ) {
		if ( !shouldMergeToPreviousList( el ) ) {
			return false;
		}

		var previous = el.previous,
			lastLi = getLastListItem( previous ),
			liDepthValue = depthChecker( lastLi ),
			innerList = unwrapList( el, liDepthValue );

		if ( innerList ) {
			lastLi.add( innerList );
			innerList.filterChildren( filter );
			return true;
		}

		return false;
	}

	function shouldMergeToPreviousList( element ) {
		// There need to be previous list where element should be merged.
		if ( !element.previous || !isList( element.previous ) ) {
			return false;
		}

		// There might be cases in PFW where li element has no children (test Tickets/7131 word2013 chrome)
		if ( !element.getFirst().children.length ) {
			return false;
		}

		// Curretn list need to be nested list, what points that is sublist.
		if ( element.children.length !== 1 || !isList( element.getFirst().getFirst() ) ) {
			return false;
		}

		return true;
	}

	// Checks level of nested list for given element.
	// It's exepected that argument is the `li` element.
	function depthChecker( element ) {
		var level = 0,
			currentElement = element;

		while ( ( currentElement = currentElement.getAscendant( getListEvaluator() ) ) ) {
			level++;
		}

		return level;
	}

	function getLastListItem( el ) {
		var lastChild = el.children[ el.children.length - 1 ];

		if ( !isList( lastChild ) && lastChild.name !== 'li' ) {
			return el;
		} else {
			return getLastListItem( lastChild );
		}
	}

	function getListEvaluator() {
		var guard = false;

		return function( element ) {
			// There might be situation that list is somehow nested in other type of element, quotes, div, table, etc.
			// When such situation happen we should not search for any above list.
			if ( guard ) {
				return false;
			}

			if ( !isList( element ) && element.name !== 'li' ) {
				guard = true;
				return false;
			}

			return isList( element );
		};
	}

	// Get nested list by first items
	function unwrapList( list, count ) {
		if ( count ) {
			return unwrapList( list.getFirst().getFirst(), --count );
		} else {
			return list;
		}
	}

	function isList( element ) {
		return element.name === 'ol' || element.name === 'ul';
	}

	function remove() {
		return false;
	}

	CKEDITOR.pasteFilters.pflibreoffice = pastetools.createFilter( {
		rules: [
			commonFilter.rules,
			CKEDITOR.plugins.pastetools.filters.pflibreoffice.rules
		]
	} );
} )();
