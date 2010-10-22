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
	 * Load images into the browser cache.
	 * @namespace
	 * @example
	 */
	CKEDITOR.imageCacher = {
		/**
		 * Loads one or more images.
		 * @param {Array} images The URLs for the images to be loaded.
		 * @param {Function} callback The optional function to be called once all images
		 *		are loaded. You can bind any function to the returned event object.
		 * @return {CKEDITOR.event} Event object which fires 'preloaded' event when all images finished.
		 *    Additionally it set "finished" property flag after 'preloaded' event.
		 */
		load: function( images, callback ) {
			var pendingCount = images.length;

			var event = new CKEDITOR.event;
			event.on( 'preloaded', function() {
				event.finished = true;
			});

			if ( callback )
				event.on( 'preloaded', callback );

			var checkPending = function() {
					if ( --pendingCount === 0 )
						event.fire( 'preloaded' );
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
