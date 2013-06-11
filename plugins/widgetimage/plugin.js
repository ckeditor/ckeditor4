/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

'use strict';

(function() {

	CKEDITOR.plugins.add( 'widgetimage', {
		requires: 'widget,image',
		icons: 'widgetimage',

		init: function( editor ) {
			editor.widgets.add( 'image', {
				dialog: 'image',
				button: {
					label: 'Captioned image'
				},
				template: new CKEDITOR.template(
					'<figure class="caption" data-widget="image">' +
						'<img alt="" src="" /><figcaption>caption...</figcaption>' +
					'</figure>'
				),

				init: function() {
					// Read float style from figure/image and remove it from these elements.
					// This style will be set on wrapper in #data listener.
					var floatStyle = this.element.getStyle( 'float' ) || this.parts.image.getStyle( 'float' );
					this.element.removeStyle( 'float' );
					this.parts.image.removeStyle( 'float' );
					this.setData( 'floatStyle', floatStyle );

					this.on( 'getOutput', function( evt ) {
						downcastWidgetElement( evt.data, this );
					} );

					this.on( 'dialog', function( evt ) {
						// We'll handle editing here.
						evt.cancel();

						var dialog = evt.data,
							widget = this,
							okListener;

						dialog.customImageElement = this.parts.image;

						dialog.once( 'show', function() {
							dialog.setValueOf( 'info', 'cmbAlign', widget.data.floatStyle );
							dialog.hidePage( 'Link' );
						} );

						okListener = dialog.once( 'ok', function() {
							widget.setData( 'floatStyle', dialog.getValueOf( 'info', 'cmbAlign' ) );
							widget.parts.image.removeStyle( 'float' );
						} );

						dialog.once( 'hide', function() {
							okListener.removeListener();
							dialog.showPage( 'Link' );
						} );
					} );
				},

				data: function() {
					this.wrapper.setStyle( 'float', this.data.floatStyle );
				},

				upcasts: {
					// Upcast images with data-caption attributes.
					captionedImage: function( el ) {
						if ( el.name == 'img' && 'data-caption' in el.attributes )
							return upcastElement( el );
					},

					// Upcast all images.
					image: function( el ) {
						if ( el.name == 'img' )
							return upcastElement( el );
					}
				},

				downcasts: {
					captionedImage: function( el, widget ) {
						var img = el.getFirst( 'img' );

						downcastWidgetElement( el, widget, img );

						return img;
					}
				},

				parts: {
					image: 'img',
					caption: 'figcaption'
				}
			} );
		}
	} );

	function upcastElement( el ) {
		var figure = el.wrapWith( new CKEDITOR.htmlParser.element( 'figure', { 'class': 'caption' } ) ),
			caption = CKEDITOR.htmlParser.fragment.fromHtml( el.attributes[ 'data-caption' ] || '', 'figcaption' );

		figure.add( caption );

		delete el.attributes[ 'data-caption' ];
		return figure;
	}

	function downcastWidgetElement( element, widget, downcastTo ) {
		if ( !downcastTo )
			downcastTo = element;

		var attrs = downcastTo.attributes;

		// Downcasting to image - copy caption's content to data-caption attribute.
		if ( downcastTo.name == 'img' ) {
			var caption = element.getFirst( 'figcaption' );

			// Something could happen that caption was removed. However,
			// this was a widget, so it still should be.
			attrs[ 'data-caption' ] = caption ? caption.getHtml() : '';
		}

		// Add float style to the downcasted element.
		var floatStyle = widget.data.floatStyle;
		if ( floatStyle ) {
			var styles = CKEDITOR.tools.parseCssText( attrs.style || '' );
			styles.float = floatStyle;
			attrs.style = CKEDITOR.tools.writeCssText( styles );
		}
	}

})();