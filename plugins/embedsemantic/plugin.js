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
				// Use a dialog exposed by the embedbase plugin.
				dialog: 'embedBase',
				button: editor.lang.embedbase.button,
				allowedContent: 'oembed',
				requiredContent: 'oembed',
				styleableElements: 'oembed',
				// Share config with the embed plugin.
				providerUrl: new CKEDITOR.template(
					editor.config.embed_provider ||
					'//ckeditor.iframe.ly/api/oembed?url={url}&callback={callback}'
				),

				init: function() {
					var that = this;

					origInit.call( this );

					// Need to wait for #ready with the initial content loading, because on #init there's no data yet.
					this.once( 'ready', function() {
						// When widget is created using dialog, the dialog's code will handle loading the content
						// (because it handles success and error), so do load the content only when loading data.
						if ( this.data.loadOnReady ) {
							this.loadContent( this.data.url, {
								callback: function() {
									// Do not load the content again on widget's next initialization (e.g. after undo or paste).
									// Plus, this is a small trick that we change loadOnReady now, inside the callback.
									// It guarantees that if the content was not loaded (an error occurred or someone
									// undid/copied sth to fast) the content will be loaded on the next initialization.
									that.setData( 'loadOnReady', false );
									editor.fire( 'updateSnapshot' );
								}
							} );
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

						// Transfer widget classes from data to widget element (#13199).
						div.attributes[ 'class' ] = element.attributes[ 'class' ];

						return div;
					}
				},

				downcast: function( element ) {
					var ret = new CKEDITOR.htmlParser.element( 'oembed' );
					ret.add( new CKEDITOR.htmlParser.text( this.data.url ) );

					// Transfer widget classes from widget element back to data (#13199).
					if ( element.attributes[ 'class' ] ) {
						ret.attributes[ 'class' ] = element.attributes[ 'class' ];
					}

					return ret;
				}
			}, true );

			editor.widgets.add( 'embedSemantic', widgetDefinition );
		},

		// Extends CKEDITOR.dtd so editor accepts <oembed> tag.
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