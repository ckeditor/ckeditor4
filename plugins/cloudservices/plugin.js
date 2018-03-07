/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
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
			 * @param {String} [token] A token used for [CKEditor Cloud Services](https://ckeditor.com/ckeditor-cloud-services/) request.
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
			 * @param {String} [url] The upload URL. If not provided, {@link CKEDITOR.config#cloudServices_url} will be used.
			 * @param {Object} [additionalRequestParameters] Additional data that would be passed to the
			 * {@link CKEDITOR.editor#fileUploadRequest} event.
			 */
			CloudServicesLoader.prototype.upload = function( url, additionalRequestParameters ) {
				url = url || this.editor.config.cloudServices_url;

				if ( !url ) {
					CKEDITOR.error( 'cloudservices-no-url' );
					return;
				}

				FileLoader.prototype.upload.call( this, url, additionalRequestParameters );
			};

			/**
			 * @method loadAndUpload
			 * @inheritdoc
			 * @param {String} [url] The upload URL. If not provided, {@link CKEDITOR.config#cloudServices_url} will be used.
			 * @param {Object} [additionalRequestParameters] Additional parameters that would be passed to
			 * the {@link CKEDITOR.editor#fileUploadRequest} event.
			*/

			CKEDITOR.plugins.cloudservices.cloudServicesLoader = CloudServicesLoader;
		},

		beforeInit: function( editor ) {
			var tokenUrl = editor.config.cloudServices_tokenUrl,
				tokenFetcher = {
					token: null,

					REFRESH_INTERVAL: 3600000,

					refreshToken: function() {
						CKEDITOR.ajax.load( tokenUrl, function( token ) {
							if ( token ) {
								tokenFetcher.token = token;
							}
						} );
					},

					init: function() {
						tokenFetcher.refreshToken();

						var that = this;

						window.setTimeout( function() {
							that.refreshToken();
						}, that.REFRESH_INTERVAL );
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
	 *
	 * @since 4.9.0
	 * @cfg {String} [cloudServices_url='']
	 * @member CKEDITOR.config
	 */

	/**
	 * The authentication token URL for [CKEditor Cloud Services](https://ckeditor.com/ckeditor-cloud-services). The token is used to authenticate
	 * all plugins using Cloud Services, for instance Easy Image. The token URL has to point to the service where the token is generated.
	 *
	 *		CKEDITOR.replace( 'editor', {
	 *			extraPlugins: 'easyimage',
	 *			cloudServices_tokenUrl: TOKEN_URL,
	 *			cloudServices_url: UPLOAD_URL
	 *		} );
	 *
	 * @since 4.9.0
	 * @cfg {String} [cloudServices_tokenUrl='']
	 * @member CKEDITOR.config
	 */
} )();
