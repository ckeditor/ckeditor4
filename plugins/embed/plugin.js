/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

( function() {
	'use strict';

	CKEDITOR.plugins.add( 'embed', {
		icons: 'embed', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		requires: 'embedbase',

		init: function( editor ) {
			var widgetDefinition = CKEDITOR.plugins.embedBase.createWidgetBaseDefinition( editor ),
				embedBaseInitMethod = widgetDefinition.init;

			if ( !editor.config.embed_provider ) {
				CKEDITOR.error( 'embed-no-provider-url' );
			}

			// Extend the base definition with additional properties.
			CKEDITOR.tools.extend( widgetDefinition, {
				// Use a dialog exposed by the embedbase plugin.
				dialog: 'embedBase',
				button: editor.lang.embedbase.button,
				allowedContent: 'div[!data-oembed-url]',
				requiredContent: 'div[data-oembed-url]',
				providerUrl: new CKEDITOR.template( editor.config.embed_provider || '' ),

				// The filter element callback actually allows all divs with data-oembed-url,
				// so registering styles to the filter is virtually unnecessary because
				// classes won't be filtered out. However, registering them will make filter.check() work
				// which may be important in some cases.
				styleToAllowedContentRules: function( style ) {
					// Retrieve classes defined in the style.
					var classes = style.getClassesArray();

					return {
						div: {
							propertiesOnly: true,
							classes: classes,
							attributes: '!data-oembed-url'
						}
					};
				},

				init: function() {
					embedBaseInitMethod.call( this );

					if ( editor.config.embed_keepOriginalContent ) {
						return;
					}

					this.on( 'ready', function() {
						this.loadContent( this.data.url, {
							callback: function() {
								editor.fire( 'updateSnapshot' );
							}
						} );
					} );
				},

				upcast: function( el, data ) {
					var child;

					if ( el.name == 'div' && el.attributes[ 'data-oembed-url' ] ) {
						data.url = el.attributes[ 'data-oembed-url' ];

						if ( !editor.config.embed_keepOriginalContent ) {
							while ( child = el.getFirst() ) {
								child.remove();
							}
						}

						return true;
					}
				},

				downcast: function( el ) {
					el.attributes[ 'data-oembed-url' ] = this.data.url;
				}
			}, true );

			// Register the definition as 'embed' widget.
			editor.widgets.add( 'embed', widgetDefinition );

			if ( editor.config.embed_keepOriginalContent ) {
				// Do not filter contents of the div[data-oembed-url] at all.
				editor.filter.addElementCallback( function( el ) {
					if ( 'data-oembed-url' in el.attributes ) {
						return CKEDITOR.FILTER_SKIP_TREE;
					}
				} );
			}
		}
	} );

} )();

/**
 * Decides if the content inside the Media Embed widget should be left as-is, without filtering (default behavior
 * of the Embed plugin before v4.21). Since v4.21 the Media Embed widget content is regenerated
 * every time when initializing the widget.
 *
 * **NOTE:** It's not recommended to enable this option. Accepting any content inside the embed plugin may open
 * your application to security vulnerabilities. If, for some reason, you need to enable it, make sure to properly
 * configure [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) on your web page.
 *
 * @since 4.21.0
 * @cfg {Boolean} [embed_keepOriginalContent=false]
 * @member CKEDITOR.config
 */
CKEDITOR.config.embed_keepOriginalContent = false;

/**
 * A template for the URL of the provider endpoint. This URL will be queried for each resource to be embedded.
 *
 * It uses the following parameters:
 *
 *	* `url` &ndash; The URL of the requested media, e.g. `https://twitter.com/ckeditor/status/401373919157821441`.
 *	* `callback` &ndash; The name of the globally available callback used for JSONP requests.
 *
 * For example:
 *
 *		config.embed_provider = '//example.com/api/oembed-proxy?resource-url={url}&callback={callback}';
 *
 * By default CKEditor does not use any provider, although there is a ready-to-use URL available via Iframely:
 *
 *		config.embed_provider = '//ckeditor.iframe.ly/api/oembed?url={url}&callback={callback}'
 *
 * However, this endpoint contains certain limitations, e.g. it cannot embed Google Maps content.
 * It is recommended to set up an account on the [Iframely](https://iframely.com/) service for
 * better control over embedded content.
 *
 * Read more in the {@glink features/media_embed documentation}
 * and see the {@glink examples/mediaembed example}.
 *
 * Refer to {@link CKEDITOR.plugins.embedBase.baseDefinition#providerUrl} for more information about content providers.
 *
 * **Important note:** Prior to version 4.7.0 this configuration option defaulted to the
 * `//ckeditor.iframe.ly/api/oembed?url={url}&callback={callback}` string.
 *
 * @since 4.5.0
 * @cfg {String} [embed_provider='']
 * @member CKEDITOR.config
 */
