( function() {
	'use strict';

	CKEDITOR.plugins.add( 'cloudservices', {
		requires: 'filetools',
		onLoad: function() {
			var FileLoader = CKEDITOR.fileTools.fileLoader;

			/**
			 * Dedicated uploader type for [Cloud Services](https://ckeditor.com/ckeditor-cloud-services/).
			 *
			 * Note that this type is defined in {@link CKEDITOR.pluginDefinition#onLoad plugin.onLoad} method, thus is
			 * guaranteed to be available in dependent plugin's {@link CKEDITOR.pluginDefinition#beforeInit beforeInit},
			 * {@link CKEDITOR.pluginDefinition#init init} and {@link CKEDITOR.pluginDefinition#afterInit} methods.
			 *
			 * @since 4.8.0
			 * @class CKEDITOR.plugins.cloudservices.cloudServicesLoader
			 * @extends CKEDITOR.fileTools.fileLoader
			 */
			function cloudServicesLoader( editor, fileOrData, fileName ) {
				FileLoader.call( this, editor, fileOrData, fileName );
			}

			cloudServicesLoader.prototype = CKEDITOR.tools.extend( {}, FileLoader.prototype );

			/**
			 * @inheritdoc
			 * @param {String} [url] The upload URL. If not provided {@link CKEDITOR.config#cloudServices_url} will be used.
			 * @param {Object} [additionalRequestParameters] Additional data that would be passed to the
			 * {@link CKEDITOR.editor#fileUploadRequest} event.
			 */
			cloudServicesLoader.prototype.upload = function( url, additionalRequestParameters ) {
				url = url || this.editor.config.cloudServices_url;

				FileLoader.prototype.upload.call( this, url, additionalRequestParameters );
			};

			/**
			 * @method loadAndUpload
			 * @inheritdoc
			 * @param {String} [url] The upload URL. If not provided {@link CKEDITOR.config#cloudServices_url} will be used.
			 * @param {Object} [additionalRequestParameters] Additional parameters that would be passed to
			 * the {@link CKEDITOR.editor#fileUploadRequest} event.
			*/

			CKEDITOR.plugins.cloudservices.cloudServicesLoader = cloudServicesLoader;
		},

		beforeInit: function( editor ) {
			editor.on( 'fileUploadRequest', function( evt ) {
				var fileLoader = evt.data.fileLoader,
					reqData = evt.data.requestData;

				if ( fileLoader instanceof CKEDITOR.plugins.cloudservices.cloudServicesLoader ) {
					// Cloud Services expect file to be put as a "file" property.
					reqData.file = reqData.upload;
					delete reqData.upload;

					// Add authorization token.
					evt.data.fileLoader.xhr.setRequestHeader( 'Authorization', editor.config.cloudServices_token );
				}
			}, null, null, 6 );

			editor.on( 'fileUploadResponse', function( evt ) {
				var fileLoader = evt.data.fileLoader,
					xhr = fileLoader.xhr,
					response;

				if ( fileLoader instanceof CKEDITOR.plugins.cloudservices.cloudServicesLoader ) {
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
		cloudServicesLoader: null
	};

	/**
	 * Endpoint URL for [Cloud Services](https://ckeditor.com/ckeditor-cloud-services) uploads.
	 *
	 * @since 4.8.0
	 * @cfg {String} [cloudServices_url='']
	 * @member CKEDITOR.config
	 */

	/**
	 * Token used for [Cloud Services](https://ckeditor.com/ckeditor-cloud-services) authentication.
	 *
	 * @since 4.8.0
	 * @cfg {String} [cloudServices_token='']
	 * @member CKEDITOR.config
	 */
} )();