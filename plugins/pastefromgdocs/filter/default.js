/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* globals CKEDITOR */

( function() {
	var pastetools = CKEDITOR.plugins.pastetools,
		commonFilter = pastetools.filters.common,
		Style = commonFilter.styles,
		plug = {};

	/**
	 * Set of Paste from Google Docs plugin helpers.
	 *
	 * @since 4.13.0
	 * @private
	 * @member CKEDITOR.plugins.pastetools.filters
	 */
	CKEDITOR.plugins.pastetools.filters.gdocs = plug;

	/**
	 * Rules for Paste from GDocs filter.
	 *
	 * @since 4.13.0
	 * @private
	 * @member CKEDITOR.plugins.pastetools.filters.gdocs
	 */
	plug.rules = function( html, editor, filter ) {
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
					return Style.normalizedStyles( element, editor ) || false;
				},
				'class': function( classes ) {
					return falseIfEmpty( classes.replace( /kix-line-break/ig, '' ) );
				}
			},

			elements: {
				'span': function( element ) {
					Style.createStyleStack( element, filter, editor, /vertical-align|white-space|font-variant/ );
				},

				'b': function( element ) {
					// Google docs sometimes uses `b` as a wrapper without semantic value.
					commonFilter.elements.replaceWithChildren( element );
					return false;
				},

				'p': function( element ) {
					if ( element.parent.name === 'li' ) {
						commonFilter.elements.replaceWithChildren( element );
						return false;
					}
				},

				'ul': function( element ) {
					Style.pushStylesLower( element );
				},

				'ol': function( element ) {
					Style.pushStylesLower( element );
				},

				'li': function( element ) {
					Style.pushStylesLower( element );
				}
			}
		};
	};

	function falseIfEmpty( value ) {
		if ( value === '' ) {
			return false;
		}
		return value;
	}

	CKEDITOR.pasteFilters.gdocs = pastetools.createFilter( {
		rules: [
			commonFilter.rules,
			plug.rules
		]
	} );
} )();
