/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

// Mock the real XMLHttpRequest so the upload test may show the effect of an error during upload.

window.XMLHttpRequest = function() {
	return {
		open: function() {},

		send: function() {
			// Total file size.
			var total = 10259,
				loaded = 0,
				step = Math.round( total / 10 ),
				onprogress = this.onprogress,
				onerror = this.onerror,
				interval;

			// Wait 400 ms for every step.
			interval = setInterval( function() {
				// Add data to 'loaded' counter.
				loaded += step;
				if ( loaded > total ) {
					loaded = total;
				}

				// If less then 50% of file is loaded call onprogress.
				if ( loaded < total / 2 ) {
					onprogress( { loaded: loaded } );
				}
				// If 50% of file is loaded call onerror and stop loading.
				else {
					clearInterval( interval );
					onerror();
				}
			}, 400 );
		},

		// Abort should call onabort.
		abort: function() {
			this.onabort();
		}
	};
};