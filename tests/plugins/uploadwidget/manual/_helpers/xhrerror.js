/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

// Mock the real XMLHttpRequest so the upload test may show the effect of an error during upload.

window.FormData = function() {
	var total, filename;
	return {
		append: function( name, file, filename ) {
			total = file.size;
			filename = filename;
		},
		getTotal: function() {
			return total;
		},
		getFileName: function() {
			return filename;
		}
	};
};

window.XMLHttpRequest = function() {
	return {
		open: function() {},

		upload: {},

		send: function( formData ) {
			// Total file size.
			var total = formData.getTotal(),
				loaded = 0,
				step = Math.round( total / 10 ),
				onprogress = this.upload.onprogress,
				onerror = this.onerror,
				interval;

			// Wait 400 ms for every step.
			interval = setInterval( function() {
				// Add data to 'loaded' counter.
				loaded += step;

				// If less then 50% of file is loaded call onprogress.
				if ( loaded < step * 5 ) {
					onprogress( { loaded: loaded, total: total, lengthComputable: true } );
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
