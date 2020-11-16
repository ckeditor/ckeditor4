/* exported blobHelpers */

( function() {
	'use strict';

	// jscs:disable maximumLineLength
	var SAMPLE_PNG = 'data:image/png;base64,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',
	// jscs:enable maximumLineLength
		isSupportedEnvironment = typeof Uint8Array === 'function' && typeof Blob === 'function' &&
			typeof URL === 'function' && typeof ArrayBuffer === 'function';

	function ignoreUnsupportedEnvironment( testSuite, check ) {
		testSuite._should = testSuite._should || {};
		testSuite._should.ignore = testSuite._should.ignore || {};

		for ( var key in testSuite ) {
			if ( ( typeof check !== 'undefined' && !check ) || !this.isSupportedEnvironment ) {
				testSuite._should.ignore[ key ] = true;
			}
		}
	}

	function dataUriToBlob( dataURI ) {
		var base64String = atob( dataURI.split( ',' )[1] ),
			fileType = dataURI.match( /^data:([^;]*);base64,/ )[ 1 ],
			arrayBuffer = new Uint8Array( base64String.length );

		for ( var i = 0; i < base64String.length; i++ ) {
			arrayBuffer[ i ] = base64String.charCodeAt( i );
		}

		return new Blob( [ arrayBuffer ], { type: fileType } );
	}

	function simulatePasteBlob( editor, assertion, userOptions ) {
		var defaultOptions = {
				imageDataUrl: SAMPLE_PNG,
				imageType: null,
				template: '<p{%CLASS%}>Hello<img style="height:200px; width:200px" src="{%URL%}" />world.</p>'
			},
			// Our tools break ArrayBuffers, so we need to handle this option separately.
			image = userOptions && userOptions.image || SAMPLE_PNG,
			options = CKEDITOR.tools.object.merge( defaultOptions, userOptions || {} ),
			imageDataUrl = options.imageDataUrl,
			url = getObjectUrl( image, options.imageType ),
			template = options.template,
			input = template.replace( /{%URL%}/g, url ).replace( /{%CLASS%}/g, ' class="MsoNormal"' ),
			expected = template.replace( /{%URL%}/g, imageDataUrl ).replace( /{%CLASS%}/g, '' );

		editor.once( 'pasteFromWord', function( evt ) {
			// `saveSnapshot` is last event after content is paste from word.
			evt.editor.once( 'saveSnapshot', function() {
				resume( function() {
					// Additional wait is required to update undo manager state.
					setTimeout( function() {
						resume( function() {
							assertion( input, expected );
						} );
					}, 100 );

					wait();
				} );
			}, null, null, 999 );
		} );

		editor.fire( 'paste', {
			type: 'auto',
			// This data will be recognized as pasted from Word.
			dataValue: input,
			method: 'paste'
		} );

		wait();
	}

	function getObjectUrl( image, type ) {
		if ( typeof image === 'string' ) {
			return URL.createObjectURL( dataUriToBlob( image ) );
		}

		var uInt8Array = new Uint8Array( image ),
			blob = new Blob( [ uInt8Array ], { type: type } );

		return URL.createObjectURL( blob );
	}

	window.blobHelpers = {
		/*
		 * Modifies testSuite by adding entries in `_should.ignore` object for each method/property, if
		 * the current environment is not supported.
		 *
		 * @param {Object} testSuite
		 * @param {Boolean} [check] Custom check to be considered in addition to the default one.
		 */
		ignoreUnsupportedEnvironment: ignoreUnsupportedEnvironment,

		/*
		 * @property {Boolean} isSupportedEnvironment Whether Blob URLs are supported in current environment.
		 */
		isSupportedEnvironment: isSupportedEnvironment,

		/*
		 * Converts Data URI into proper Blob.
		 *
		 * @param {String} dataUri Data URI to be converted.
		 * @returns {Blob} Blob representing resource described by passed data URI.
		 */
		dataUriToBlob: dataUriToBlob,

		/*
		 * Simulate pasting image as Blob URL.
		 *
		 * @param {CKEDITOR.editor} editor Editor, in which paste occurs.
		 * @param {Function} assertion Test assertion
		 * @param {String} assertion.input HTML, which was pasted.
		 * @param {String} assertion.expected Expected HTML output.
		 */
		simulatePasteBlob: simulatePasteBlob
	};
}() );
