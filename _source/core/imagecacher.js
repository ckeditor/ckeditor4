/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function() {
	var loaded = {};

	var loadImage = function( image, callback ) {
			var doCallback = function() {
					img.removeAllListeners();
					loaded[ image ] = 1;
					callback();
				};

			var img = new CKEDITOR.dom.element( 'img' );
			img.on( 'load', doCallback );
			img.on( 'error', doCallback );
			img.setAttribute( 'src', image );
		};

	/**
	 * @namespace Load images into the browser cache.
	 */
	CKEDITOR.imageCacher = {
		/**
		 * Loads one or more images.
		 * @param {Array} images The URLs of the images to be loaded.
		 * @param {Function} [callback] A function to be called once all images
		 *		are loaded.
		 * @return {CKEDITOR.event} An event object which fires the 'loaded'
		 *		event when all images are completely loaded. Additionally, the
		 *		"finished" property is set after the "loaded" event call.
		 * @example
		 * var loader = CKEDITOR.imageCacher.load( [ '/image1.png', 'image2.png' ] );
		 * if ( !loader.finished )
		 * {
		 *     loader.on( 'load', function()
		 *         {
		 *             alert( 'All images are loaded' );
		 *         });
		 * }
		 */
		load: function( images, callback ) {
			var pendingCount = images.length;

			var event = new CKEDITOR.event;
			event.on( 'loaded', function() {
				event.finished = 1;
			});

			if ( callback )
				event.on( 'loaded', callback );

			var checkPending = function() {
					if ( --pendingCount === 0 )
						event.fire( 'loaded' );
				};

			for ( var i = 0; i < images.length; i++ ) {
				var image = images[ i ];

				if ( loaded[ image ] )
					checkPending();
				else
					loadImage( image, checkPending );
			}

			return event;
		}
	};
})();
