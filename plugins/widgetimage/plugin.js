'use strict';

(function() {

	CKEDITOR.plugins.add( 'widgetimage', {
		requires: 'widget,image',

		init: function( editor ) {
			editor.widgets.add( 'image', {
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

					this.on( 'data', function() {
						this.wrapper.setStyle( 'float', this.data.floatStyle );
					} );
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