/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	CKEDITOR.plugins.add( 'embedsemantic', {
		icons: 'embedsemantic', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		requires: 'embedbase',

		onLoad: function() {
			this.registerOembedTag();
		},

		init: function( editor ) {
			var widgetDefinition = CKEDITOR.plugins.embedBase.createWidgetBaseDefinition( editor ),
				origInit = widgetDefinition.init;

			CKEDITOR.tools.extend( widgetDefinition, {
				dialog: 'embedBase',
				button: editor.lang.embedbase.button,
				allowedContent: 'oembed',
				requiredContent: 'oembed',
				// Share config with the embed plugin.
				providerUrl: new CKEDITOR.template(
					editor.config.embed_provider ||
					'//ckeditor.iframe.ly/api/oembed?url={url}&callback={callback}'
				),

				init: function() {
					origInit.call( this );

					// Need to wait for #ready with the initial content loading, because on #init there's no data yet.
					this.once( 'ready', function() {
						// When widget is created using dialog, the dialog's code will handle loading the content
						// (because it handles success and error), so do load the content only when loading data.
						if ( this.data.loadOnReady ) {
							this.loadContent( this.data.url );
						}
					} );
				},

				upcast: function( element, data ) {
					if ( element.name != 'oembed' ) {
						return;
					}

					var text = element.children[ 0 ],
						div;

					if ( text && text.type == CKEDITOR.NODE_TEXT && text.value ) {
						data.url = text.value;
						data.loadOnReady = true;
						div = new CKEDITOR.htmlParser.element( 'div' );
						element.replaceWith( div );
						return div;
					}
				},

				downcast: function() {
					var ret = new CKEDITOR.htmlParser.element( 'oembed' );
					ret.add( new CKEDITOR.htmlParser.text( this.data.url ) );

					return ret;
				}
			}, true );

			editor.widgets.add( 'embedSemantic', widgetDefinition );
		},

		registerOembedTag: function() {
			var dtd = CKEDITOR.dtd,
				name;

			// The oembed tag may contain text only.
			dtd.oembed = { '#': 1 };

			// Register oembed tag as allowed child, in each tag that can contain a div.
			// It also registers the oembed tag in objects like $block, $blockLimit, etc.
			for ( name in dtd ) {
				if ( dtd[ name ].div ) {
					dtd[ name ].oembed = 1;
				}
			}
		}
	} );

} )();