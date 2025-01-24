/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

'use strict';

// Mock the real XMLHttpRequest without upload object support.

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
	var basePath = bender.config.tests[ bender.testData.group ].basePath,
		timeout;

	return {
		open: function() {},

		send: function( formData ) {
			var xhr = this,
				onload = this.onload;

			// Wait 1s and report onload without reporting progress during upload.
			timeout = setTimeout( function() {
				var responseData = {
					fileName: formData.getFileName(),
					uploaded: 1,
					url: '\/' + basePath + '_assets\/lena.jpg',
					error: {
						number: 201,
						message: ''
					}
				};
				CKEDITOR.tools.extend( responseData, XMLHttpRequest.responseData, true );

				xhr.status = 200;
				xhr.responseText = JSON.stringify( responseData );
				onload();
			}, 1000 );
		},

		// Abort should call onabort.
		abort: function() {
			clearTimeout( timeout );
			this.status = 0;
			this.onabort();
		}
	};
};
