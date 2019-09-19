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
	 * Set of Paste from Google Docs plugin helpers.
	 *
	 * @since 4.13.0
	 * @private
	 * @member CKEDITOR.plugins.pastetools.filters
	 */
	CKEDITOR.plugins.pastetools.filters.gdocs = {
		/**
		 * Rules for the Paste from Google Docs filter.
		 *
		 * @since 4.13.0
		 * @private
		 * @member CKEDITOR.plugins.pastetools.filters.gdocs
		 */
		rules: function( html, editor, filter ) {
			return {
				elementNames: [
					[ /^meta/, '' ]
				],

				comment: function() {
					return false;
				},

				attributes: {
					'id': function( value ) {
						var gDocsIdRegex = /^docs\-internal\-guid\-/;

						return !gDocsIdRegex.test( value );
					},
					'dir': function( value ) {
						return value === 'ltr' ? false : value;
					},
					'style': function( styles, element ) {
						return falseIfEmpty( Style.normalizedStyles( element, editor ) );
					},
					'class': function( classes ) {
						return falseIfEmpty( classes.replace( /kix-line-break/ig, '' ) );
					}
				},

				elements: {
					'div': function( element ) {
						if ( isTableWrapper( element ) ) {
							// Align attribute does not seem to change anything
							// and as we translate it to float, it safer to remove it (#3435).
							delete element.attributes.align;
						}
					},

					'span': function( element ) {
						Style.createStyleStack( element, filter, editor, /vertical-align|white-space|font-variant/ );

						handleSuperAndSubScripts( element );
					},

					'b': function( element ) {
						// Google docs sometimes uses `b` as a wrapper without semantic value.
						commonFilter.elements.replaceWithChildren( element );

						return false;
					},

					'p': function( element ) {
						if ( element.parent && element.parent.name === 'li' ) {
							commonFilter.elements.replaceWithChildren( element );

							return false;
						}
					},

					'ul': function( element ) {
						Style.pushStylesLower( element );

						return fixList( element );
					},

					'ol': function( element ) {
						Style.pushStylesLower( element );

						return fixList( element );
					},

					'li': function( element ) {
						Style.pushStylesLower( element );

						return unwrapList( element );
					}
				}
			};
		}
	};

	function falseIfEmpty( value ) {
		if ( value === '' ) {
			return false;
		}

		return value;
	}

	function fixList( element ) {
		var listRegex = /(o|u)l/i;

		if ( !listRegex.test( element.parent.name ) ) {
			return element;
		}

		commonFilter.elements.replaceWithChildren( element );

		return false;
	}

	function unwrapList( element ) {
		var children = element.children,
			listRegex = /(o|u)l/i;

		if ( children.length !== 1 || !listRegex.test( children[ 0 ].name ) ) {
			return element;
		}

		commonFilter.elements.replaceWithChildren( element );

		return false;
	}

	function handleSuperAndSubScripts( element ) {
		var superScriptRegex = /vertical-align:\s*super/,
			subScriptRegex = /vertical-align:\s*sub/,
			replaceRegex = /vertical-align\s*.+?;?/,
			style = element.attributes.style;

		if ( superScriptRegex.test( style ) ) {
			element.name = 'sup';
		} else if ( subScriptRegex.test( style ) ) {
			element.name = 'sub';
		}

		element.attributes.style = style.replace( replaceRegex, '' );
	}

	function isTableWrapper( element ) {
		var isDiv = element.name === 'div',
			isOnlyOneChild = element.children.length === 1,
			isTableInside = element.children[ 0 ].name === 'table';

		return isDiv && isOnlyOneChild && isTableInside;
	}

	CKEDITOR.pasteFilters.gdocs = pastetools.createFilter( {
		rules: [
			commonFilter.rules,
			CKEDITOR.plugins.pastetools.filters.gdocs.rules
		]
	} );
} )();
