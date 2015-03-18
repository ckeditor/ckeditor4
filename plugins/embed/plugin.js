/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	CKEDITOR.plugins.add( 'embed', {
		icons: 'embed', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		requires: 'embedbase',

		init: function( editor ) {
			var widgetDefinition = CKEDITOR.plugins.embedBase.createWidgetBaseDefinition( editor );

			CKEDITOR.tools.extend( widgetDefinition, {
				dialog: 'embedBase',
				button: editor.lang.embedbase.button,
				allowedContent: 'div[!data-oembed-url]',
				requiredContent: 'div[data-oembed-url]',
				providerUrl: new CKEDITOR.template(
					editor.config.embed_provider ||
					'//ckeditor.iframe.ly/api/oembed?url={url}&callback={callback}'
				),

				upcast: function( el, data ) {
					if ( el.name == 'div' && el.attributes[ 'data-oembed-url' ] ) {
						data.url = el.attributes[ 'data-oembed-url' ];

						return true;
					}
				},

				downcast: function( el ) {
					el.attributes[ 'data-oembed-url' ] = this.data.url;
				}
			}, true );

			editor.widgets.add( 'embed', widgetDefinition );

			// Do not filter contents of the div[data-oembed-url] at all.
			editor.filter.addElementCallback( function( el ) {
				if ( 'data-oembed-url' in el.attributes ) {
					return CKEDITOR.FILTER_SKIP_TREE;
				}
			} );
		}
	} );

} )();