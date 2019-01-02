/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	'use strict';

	CKEDITOR.plugins.add( 'cloudservices', {
		requires: 'filetools,ajax',
		onLoad: function() {
			var FileLoader = CKEDITOR.fileTools.fileLoader;

			/**
			 * A dedicated uploader type for [CKEditor Cloud Services](https://ckeditor.com/ckeditor-cloud-services/).
			 *
			 * Note that this type is defined in the {@link CKEDITOR.pluginDefinition#onLoad plugin.onLoad} method, thus is
			 * guaranteed to be available in dependent plugin's {@link CKEDITOR.pluginDefinition#beforeInit beforeInit},
			 * {@link CKEDITOR.pluginDefinition#init init} and {@link CKEDITOR.pluginDefinition#afterInit} methods.
			 *
			 * @since 4.9.0
			 * @class CKEDITOR.plugins.cloudservices.cloudServicesLoader
			 * @extends CKEDITOR.fileTools.fileLoader
			 * @constructor
			 * @inheritdoc
			 * @param {CKEDITOR.editor} editor The editor instance. Used only to get the language data.
			 * @param {Blob/String} fileOrData A [blob object](https://developer.mozilla.org/en/docs/Web/API/Blob) or a data
			 * string encoded with Base64.
			 * @param {String} [fileName] The file name. If not set and the second parameter is a file, then its name will be used.
			 * If not set and the second parameter is a Base64 data string, then the file name will be created based on
			 * the {@link CKEDITOR.config#fileTools_defaultFileName} option.
			 * @param {String} [token] A token used for the [CKEditor Cloud Services](https://ckeditor.com/ckeditor-cloud-services/) request.
			 * If skipped, {@link CKEDITOR.config#cloudServices_tokenUrl} will be used to request a token.
			 */
			function CloudServicesLoader( editor, fileOrData, fileName, token ) {
				FileLoader.call( this, editor, fileOrData, fileName );

				/**
				 * Custom [CKEditor Cloud Services](https://ckeditor.com/ckeditor-cloud-services/) token.
				 *
				 * @property {String} customToken
				 * @member CKEDITOR.plugins.cloudservices.cloudServicesLoader
				 */
				this.customToken = token;
			}

			CloudServicesLoader.prototype = CKEDITOR.tools.extend( {}, FileLoader.prototype );

			/**
			 * @inheritdoc
			 * @param {String} [url] The upload URL. If not provided, {@link CKEDITOR.config#cloudServices_uploadUrl} will be used.
			 * @param {Object} [additionalRequestParameters] Additional data that would be passed to the
			 * {@link CKEDITOR.editor#fileUploadRequest} event.
			 */
			CloudServicesLoader.prototype.upload = function( url, additionalRequestParameters ) {
				url = url || this.editor.config.cloudServices_uploadUrl;

				if ( !url ) {
					CKEDITOR.error( 'cloudservices-no-upload-url' );
					return;
				}

				FileLoader.prototype.upload.call( this, url, additionalRequestParameters );
			};

			/**
			 * @method loadAndUpload
			 * @inheritdoc
			 * @param {String} [url] The upload URL. If not provided, {@link CKEDITOR.config#cloudServices_uploadUrl} will be used.
			 * @param {Object} [additionalRequestParameters] Additional parameters that would be passed to
			 * the {@link CKEDITOR.editor#fileUploadRequest} event.
			*/

			CKEDITOR.plugins.cloudservices.cloudServicesLoader = CloudServicesLoader;
		},

		beforeInit: function( editor ) {
			var tokenUrl = editor.config.cloudServices_tokenUrl,
				tokenFetcher = {
					token: null,

					// Allow external code (tests) to affect token refresh interval if needed.
					REFRESH_INTERVAL: editor.CLOUD_SERVICES_TOKEN_INTERVAL || 3600000,

					refreshToken: function() {
						CKEDITOR.ajax.load( tokenUrl, function( token ) {
							if ( token ) {
								tokenFetcher.token = token;
							}
						} );
					},

					init: function() {
						this.refreshToken();

						var intervalId = window.setInterval( this.refreshToken, this.REFRESH_INTERVAL );

						editor.once( 'destroy', function() {
							window.clearInterval( intervalId );
						} );
					}
				};

			if ( !tokenUrl ) {
				CKEDITOR.error( 'cloudservices-no-token-url' );
			} else {
				tokenFetcher.init();
			}

			editor.on( 'fileUploadRequest', function( evt ) {
				var fileLoader = evt.data.fileLoader,
					reqData = evt.data.requestData,
					token = fileLoader.customToken || tokenFetcher.token;

				if ( fileLoader instanceof CKEDITOR.plugins.cloudservices.cloudServicesLoader ) {
					// Cloud Services expect file to be put as a "file" property.
					reqData.file = reqData.upload;
					delete reqData.upload;

					if ( !token ) {
						CKEDITOR.error( 'cloudservices-no-token' );
						evt.cancel();
						return;
					}
					// Add authorization token.
					evt.data.fileLoader.xhr.setRequestHeader( 'Authorization', token );
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
	 * The endpoint URL for [CKEditor Cloud Services](https://ckeditor.com/ckeditor-cloud-services) uploads.
	 * This option must be set for Easy Image to work correctly.
	 *
	 * The upload URL is unique for each customer and can be found in the [CKEditor Ecosystem dashboard](https://dashboard.ckeditor.com)
	 * after subscribing to the Easy Image service.
	 * To learn how to start using Easy Image, refer to the {@glink guide/dev_easyimage_integration Easy Image Integration} documentation.
	 *
	 * Note: Make sure to also set the {@link CKEDITOR.config#cloudServices_tokenUrl} configuration option.
	 *
	 * ```js
	 *	CKEDITOR.replace( 'editor', {
	 *		extraPlugins: 'easyimage',
	 *		cloudServices_tokenUrl: 'https://example.com/cs-token-endpoint',
	 *		cloudServices_uploadUrl: 'https://your-organization-id.cke-cs.com/easyimage/upload/'
	 *	} );
	 *  ```
	 *
	 * @since 4.9.0
	 * @cfg {String} [cloudServices_uploadUrl='']
	 * @member CKEDITOR.config
	 */

	/**
	 * The URL to the security token endpoint in your application. The role of this endpoint is to securely authorize
	 * the end users of your application to use [CKEditor Cloud Services](https://ckeditor.com/ckeditor-cloud-services), only
	 * if they should have access e.g. to upload files with Easy Image.
	 *
	 * You can find more information about token endpoints in the [Easy Image - Quick Start](https://ckeditor.com/docs/cs/latest/guides/easy-image/quick-start.html#create-token-endpoint)
	 * and [Cloud Services - Creating token endpoint](https://ckeditor.com/docs/cs/latest/guides/token-endpoints/tokenendpoint.html) documentation.
	 *
	 * Without a properly working token endpoint (token URL) CKEditor plugins will not be able to connect to CKEditor Cloud Services.
	 *
	 * ```js
	 *	CKEDITOR.replace( 'editor', {
	 *		extraPlugins: 'easyimage',
	 *		cloudServices_tokenUrl: 'https://example.com/cs-token-endpoint',
	 *		cloudServices_uploadUrl: 'https://your-organization-id.cke-cs.com/easyimage/upload/'
	 *	} );
	 *  ```
	 *
	 * @since 4.9.0
	 * @cfg {String} [cloudServices_tokenUrl='']
	 * @member CKEDITOR.config
	 */
} )();
