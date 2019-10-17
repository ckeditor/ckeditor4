/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* globals CKEDITOR */

( function() {
	'use strict';

	var pastetools = CKEDITOR.plugins.pastetools,
		commonFilter = pastetools.filters.common;

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

				attributes: {
					'style': function( styles ) {
						var tmpStyles = CKEDITOR.tools.parseCssText( styles );

						if ( tmpStyles.background ) {
							tmpStyles[ 'background-color' ] = tmpStyles.background;
							delete tmpStyles.background;
						}

						return CKEDITOR.tools.writeCssText( tmpStyles );
					},

					'size': function( styles, element ) {
						if ( element.name === 'font' ) {
							return false;
						}
					}
				},

				elements: {
					'!doctype': function( el ) {
						el.replaceWithChildren();
					},

					'span': function( el ) {
						if ( el.hasClass( 'Apple-converted-space' ) ) {
							var textNode = el.getFirst();

							el.name = '';
							textNode.value = textNode.value.replace( /\u00A0/g, ' ' );
						}
					},

					'p': function( el ) {
						var styles = CKEDITOR.tools.parseCssText( el.attributes.style );

						if ( styles[ 'text-align' ] === 'start' ) {
							delete styles[ 'text-align' ];
						}

						el.attributes.style = CKEDITOR.tools.writeCssText( styles );
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
					}
				}
			};
		}
	};

	CKEDITOR.pasteFilters.pflibreoffice = pastetools.createFilter( {
		rules: [
			commonFilter.rules,
			CKEDITOR.plugins.pastetools.filters.pflibreoffice.rules
		]
	} );
} )();
