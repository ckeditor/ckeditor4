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
						cleanUpImage( evt.data.getFirst( 'img' ), this );
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
						var image = el.getFirst( 'img' );

						// If for some reason image disappeared, remove this widget.
						if ( !image )
							return false;

						cleanUpImage( image, widget, true );

						return image;
					}
				}
			} );
		}
	} );

	function upcastElement( el ) {
		var figure = el.wrapWith( new CKEDITOR.htmlParser.element( 'figure', { 'class': 'caption' } ) ),
			caption = CKEDITOR.htmlParser.fragment.fromHtml( el.attributes[ 'data-caption' ] || '', 'figcaption' );

		figure.add( caption );

		caption.attributes[ 'data-widget-property' ] = 'caption';
		el.attributes[ 'data-widget-property' ] = 'image';

		delete el.attributes[ 'data-caption' ];
		return figure;
	}

	function cleanUpImage( image, widget, toImage ) {
		var attrs = image.attributes;

		// Something could happen that caption was removed. However,
		// this was a widget, so it still should be.
		if ( toImage ) {
			var caption = image.parent.getFirst( 'figcaption' );
			attrs[ 'data-caption' ] = caption ? caption.getHtml() : '';

			delete attrs[ 'data-widget-property' ];
		}

		var floatStyle = widget.data.floatStyle;
		if ( floatStyle ) {
			var styles = CKEDITOR.tools.parseCssText( attrs.style || '' );
			styles.float = floatStyle;
			attrs.style = CKEDITOR.tools.writeCssText( styles );
		}
	}

})();