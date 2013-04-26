'use strict';

(function() {

	CKEDITOR.plugins.add( 'widgetimage', {
		requires: 'widget,image',
		init: function( editor ) {
			editor.widgets.add( 'image', {
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
					captionedImage: function( el ) {
						var image = el.getFirst( 'img' ),
							caption = el.getFirst( 'figcaption' );

						// If for some reasons image disappeared, remove this widget.
						if ( !image )
							return false;

						// Something could happen that caption was removed. However,
						// this was a widget, so it still should be.
						image.attributes[ 'data-caption' ] = caption ? caption.getHtml() : '';

						return image;
					}
				}
			} );
		}
	} );

	function upcastElement( el ) {
		var figure = el.wrapWith( new CKEDITOR.htmlParser.element( 'figure' ) );
		figure.add( CKEDITOR.htmlParser.fragment.fromHtml( el.attributes[ 'data-caption' ] || '', 'figcaption' ) );

		delete el.attributes[ 'data-caption' ];
		return figure;
	}

})();