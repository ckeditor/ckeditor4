/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

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
			 * @constructor
			 * @inheritdoc
			 * @param {CKEDITOR.editor} editor The editor instance. Used only to get language data.
			 * @param {Blob/String} fileOrData A [blob object](https://developer.mozilla.org/en/docs/Web/API/Blob) or a data
			 * string encoded with Base64.
			 * @param {String} [fileName] The file name. If not set and the second parameter is a file, then its name will be used.
			 * If not set and the second parameter is a Base64 data string, then the file name will be created based on
			 * the {@link CKEDITOR.config#fileTools_defaultFileName} option.
			 * @param {String} [token] A token used for [Cloud Service](https://ckeditor.com/ckeditor-cloud-services/) request. If
			 * skipped {@link CKEDITOR.config#cloudServices_token} will be used.
			 */
			function CloudServicesLoader( editor, fileOrData, fileName, token ) {
				FileLoader.call( this, editor, fileOrData, fileName );

				/**
				 * Custom [Cloud Service](https://ckeditor.com/ckeditor-cloud-services/) token.
				 *
				 * @property {String} customToken
				 * @member CKEDITOR.plugins.cloudservices.cloudServicesLoader
				 */
				this.customToken = token;
			}

			CloudServicesLoader.prototype = CKEDITOR.tools.extend( {}, FileLoader.prototype );

			/**
			 * @inheritdoc
			 * @param {String} [url] The upload URL. If not provided {@link CKEDITOR.config#cloudServices_url} will be used.
			 * @param {Object} [additionalRequestParameters] Additional data that would be passed to the
			 * {@link CKEDITOR.editor#fileUploadRequest} event.
			 */
			CloudServicesLoader.prototype.upload = function( url, additionalRequestParameters ) {
				url = url || this.editor.config.cloudServices_url;

				if ( !url ) {
					CKEDITOR.error( 'cloudservices-url-error', {
						msg: 'To use cloudservice you should set up CKEDITOR.config.cloudServices_url.'
					} );
					return;
				}

				FileLoader.prototype.upload.call( this, url, additionalRequestParameters );
			};

			/**
			 * @method loadAndUpload
			 * @inheritdoc
			 * @param {String} [url] The upload URL. If not provided {@link CKEDITOR.config#cloudServices_url} will be used.
			 * @param {Object} [additionalRequestParameters] Additional parameters that would be passed to
			 * the {@link CKEDITOR.editor#fileUploadRequest} event.
			*/

			CKEDITOR.plugins.cloudservices.cloudServicesLoader = CloudServicesLoader;
		},

		beforeInit: function( editor ) {
			editor.on( 'fileUploadRequest', function( evt ) {
				var fileLoader = evt.data.fileLoader,
					reqData = evt.data.requestData;

				if ( fileLoader instanceof CKEDITOR.plugins.cloudservices.cloudServicesLoader ) {
					// Cloud Services expect file to be put as a "file" property.
					reqData.file = reqData.upload;
					delete reqData.upload;

					if ( !( fileLoader.customToken || editor.config.cloudServices_token ) ) {
						CKEDITOR.error( 'cloudservices-token-error', {
							msg: 'To use cloudservice you should set up CKEDITOR.config.cloudServices_token.'
						} );
						return;
					}
					// Add authorization token.
					evt.data.fileLoader.xhr.setRequestHeader( 'Authorization', fileLoader.customToken || editor.config.cloudServices_token );
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