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
						if ( element.hasClass( 'Apple-converted-space' ) ) {
							var textNodeWithSpace = new CKEDITOR.htmlParser.text( ' ' );
							element.replaceWith( textNodeWithSpace );
						}

						if ( element.attributes.style ) {
							element.attributes.style = Style.normalizedStyles( element, editor );

							var style = CKEDITOR.tools.parseCssText( element.attributes.style );

							if ( style.background ) {
								style[ 'background-color' ] = style.background;
								delete style.background;
							}

							style = CKEDITOR.tools.writeCssText( style );

							if ( style === '' ) {
								element.replaceWithChildren();
							} else {
								element.attributes.style = style;
							}

							Style.createStyleStack( element, filter, editor );
						}

						replaceEmptyElementWithChildren( element );
					},

					'p': function( element ) {
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
						if ( el.parent.name === 'a' && el.attributes.color === '#000080' ) {
							el.replaceWithChildren();
						}

						if ( el.attributes.size ) {
							delete el.attributes.size;
						}

						var styles = CKEDITOR.tools.parseCssText( el.attributes.style );

						if ( styles[ 'font-size' ] ) {
							el.name = 'span';
							el.attributes.style = CKEDITOR.tools.writeCssText( styles );
							return el;
						}

						replaceEmptyElementWithChildren( el );
					}
				},

				attributes: {
					'style': function( styles, element ) {
						// Returning false deletes the attribute.
						return Style.normalizedStyles( element, editor ) || false;
					}
				}
			};
		}
	};

	function replaceEmptyElementWithChildren( element ) {
		if ( !CKEDITOR.tools.object.entries( element.attributes ).length ) {
			element.replaceWithChildren();
		}
	}

	CKEDITOR.pasteFilters.pflibreoffice = pastetools.createFilter( {
		rules: [
			commonFilter.rules,
			CKEDITOR.plugins.pastetools.filters.pflibreoffice.rules
		]
	} );
} )();
