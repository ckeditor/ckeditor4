( function() {
	'use strict';

	CKEDITOR.plugins.add( 'cloudservices', {
		requires: 'filetools',
		onLoad: function() {
			var FileLoader = CKEDITOR.fileTools.fileLoader;

			/**
			 * Dedicated uploader for [Cloud Services](https://ckeditor.com/ckeditor-cloud-services/).
			 *
			 * @since 4.8.0
			 * @class CKEDITOR.plugins.cloudservices.fileLoader
			 * @extends CKEDITOR.fileTools.fileLoader
			 */
			function CloudSericesLoader( editor, fileOrData, fileName ) {
				FileLoader.call( this, editor, fileOrData, fileName );
			}

			CloudSericesLoader.prototype = CKEDITOR.tools.extend( {}, FileLoader.prototype );

			// CloudSericesLoader.prototype.attachRequestListeners = function() {
			// 	FileLoader.prototype.attachRequestListeners.call( this );

			// 	this.xhr.setRequestHeader( 'Authorization', this.editor.config.easyimage_token );
			// };

			CKEDITOR.plugins.cloudservices.fileLoader = CloudSericesLoader;
		},

		beforeInit: function( editor ) {
			editor.on( 'fileUploadRequest', function( evt ) {
				var fileLoader = evt.data.fileLoader,
					reqData = evt.data.requestData;

				if ( fileLoader instanceof CKEDITOR.plugins.cloudservices.fileLoader ) {
					// Cloud Services expect file to be put as a "file" property.
					reqData.file = reqData.upload;
					delete reqData.upload;

					// Add authorization token.
					evt.data.fileLoader.xhr.setRequestHeader( 'Authorization', editor.config.easyimage_token );
				}
			}, null, null, 6 );

			editor.on( 'fileUploadResponse', function( evt ) {
				var fileLoader = evt.data.fileLoader,
					xhr = fileLoader.xhr,
					response;

				if ( fileLoader instanceof CKEDITOR.plugins.cloudservices.fileLoader ) {
					evt.stop();

					try {
						response = JSON.parse( xhr.responseText );

						evt.data.response = response;
					} catch ( e ) {
						CKEDITOR.warn( 'filetools-response-error', { responseText: xhr.responseText } );
					}
				}
			} );
		}
	} );

	CKEDITOR.plugins.cloudservices = {
		// Note this type is loaded on runtime.
		fileLoader: null
	};
} )();