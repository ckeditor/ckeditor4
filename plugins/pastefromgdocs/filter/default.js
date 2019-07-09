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
	 * Set of Paste from Word plugin helpers.
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

			attributes: {
				'dir': function( value ) {
					return value === 'ltr' ? false : value;
				},
				'style': function( styles, element ) {
					// Returning false deletes the attribute.
					return Style.normalizedStyles( element, editor ) || false;
				},
				'class': function( classes ) {
					return falseIfEmpty( classes.replace( /kix-line-break/ig, '' ) );
				}
			},

			elements: {
				'$': function( element ) {
					// Some elements are wrapped with gdocs specific element. It can be safely replaced with children.
					if ( element.attributes.id && element.attributes.id.match( /^docs\-internal\-guid\-/  ) ) {
						commonFilter.elements.replaceWithChildren( element );
						return false;
					}
				},

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
		]/* ,
		additionalTransforms: function( html ) {
			// Before filtering inline all the styles to allow because some of them are available only in style
			// sheets. This step is skipped in IEs due to their flaky support for custom types in dataTransfer. (https://dev.ckeditor.com/ticket/16847)
			if ( CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
				html = commonFilter.styles.inliner.inline( html ).getBody().getHtml();
			}

			// Sometimes Word malforms the comments.
			return html.replace( /<!\[/g, '<!--[' ).replace( /\]>/g, ']-->' );
		} */
	} );
} )();
