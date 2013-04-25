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