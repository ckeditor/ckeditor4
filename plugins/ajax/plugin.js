/* global ActiveXObject */
/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.ajax} object, which stores Ajax methods for
 *		data loading.
 */

( function() {
	CKEDITOR.plugins.add( 'ajax', {
		requires: 'xml'
	} );

	/**
	 * Ajax methods for data loading.
	 *
	 * @class
	 * @singleton
	 */
	CKEDITOR.ajax = ( function() {
		function createXMLHttpRequest() {
			// In IE, using the native XMLHttpRequest for local files may throw
			// "Access is Denied" errors.
			if ( !CKEDITOR.env.ie || location.protocol != 'file:' ) {
				try {
					return new XMLHttpRequest();
				} catch ( e ) {
				}
			}

			try {
				return new ActiveXObject( 'Msxml2.XMLHTTP' );
			} catch ( e ) {}
			try {
				return new ActiveXObject( 'Microsoft.XMLHTTP' );
			} catch ( e ) {}

			return null;
		}

		function checkStatus( xhr ) {
			// HTTP Status Codes:
			//	 2xx : Success
			//	 304 : Not Modified
			//	   0 : Returned when running locally (file://)
			//	1223 : IE may change 204 to 1223 (see http://dev.jquery.com/ticket/1450)

			return ( xhr.readyState == 4 && ( ( xhr.status >= 200 && xhr.status < 300 ) || xhr.status == 304 || xhr.status === 0 || xhr.status == 1223 ) );
		}

		function getResponse( xhr, type ) {
			if ( !checkStatus( xhr ) ) {
				return null;
			}

			switch ( type ) {
				case 'text':
					return xhr.responseText;
				case 'xml':
					var xml = xhr.responseXML;
					return new CKEDITOR.xml( xml && xml.firstChild ? xml : xhr.responseText );
				case 'arraybuffer':
					return xhr.response;
				default:
					return null;
			}
		}

		function load( url, callback, responseType ) {
			var async = !!callback;

			var xhr = createXMLHttpRequest();

			if ( !xhr )
				return null;

			if ( async && responseType !== 'text' && responseType !== 'xml' ) {
				xhr.responseType = responseType;
			}

			xhr.open( 'GET', url, async );

			if ( async ) {
				// TODO: perform leak checks on this closure.
				xhr.onreadystatechange = function() {
					if ( xhr.readyState == 4 ) {
						callback( getResponse( xhr, responseType ) );
						xhr = null;
					}
				};
			}

			xhr.send( null );

			return async ? '' : getResponse( xhr, responseType );
		}

		function post( url, data, contentType, callback, responseType ) {
			var xhr = createXMLHttpRequest();

			if ( !xhr )
				return null;

			xhr.open( 'POST', url, true );

			xhr.onreadystatechange = function() {
				if ( xhr.readyState == 4 ) {
					if ( callback ) {
						callback( getResponse( xhr, responseType ) );
					}
					xhr = null;
				}
			};

			xhr.setRequestHeader( 'Content-type', contentType || 'application/x-www-form-urlencoded; charset=UTF-8' );

			xhr.send( data );
		}

		return {
			/**
			 * Loads data from a URL as plain text.
			 *
			 *		// Load data synchronously.
			 *		var data = CKEDITOR.ajax.load( 'somedata.txt' );
			 *		alert( data );
			 *
			 *		// Load data asynchronously.
			 *		var data = CKEDITOR.ajax.load( 'somedata.txt', function( data ) {
			 *			alert( data );
			 *		} );
			 *
			 * @param {String} url The URL from which the data is loaded.
			 * @param {Function} [callback] A callback function to be called on
			 * data load. If not provided, the data will be loaded
			 * synchronously. Please notice that only text data might be loaded synchronously.
			 * @param {String} [responseType='text'] Defines type of returned data.
			 * Currently supports: `text`, `xml`, `arraybuffer`. This parameter was added in 4.16.0.
			 * @returns {String/null} The loaded data. For asynchronous requests, an
			 * empty string. For invalid requests, `null`.
			 */
			load: function( url, callback, responseType ) {
				responseType = responseType || 'text';

				return load( url, callback, responseType );
			},

			/**
			 * Creates an asynchronous POST `XMLHttpRequest` of the given `url`, `data` and optional `contentType`.
			 * Once the request is done, regardless if it is successful or not, the `callback` is called
			 * with `XMLHttpRequest#responseText` or `null` as an argument.
			 *
			 *		CKEDITOR.ajax.post( 'url/post.php', 'foo=bar', null, function( data ) {
			 *			console.log( data );
			 *		} );
			 *
			 *		CKEDITOR.ajax.post( 'url/post.php', JSON.stringify( { foo: 'bar' } ), 'application/json', function( data ) {
			 *			console.log( data );
			 *		} );
			 *
			 * @since 4.4
			 * @param {String} url The URL of the request.
			 * @param {String/Object/Array} data Data passed to `XMLHttpRequest#send`.
			 * @param {String} [contentType='application/x-www-form-urlencoded; charset=UTF-8'] The value of the `Content-type` header.
			 * @param {Function} [callback] A callback executed asynchronously with `XMLHttpRequest#responseText` or `null` as an argument,
			 * depending on the `status` of the request.
			 */
			post: function( url, data, contentType, callback ) {
				return post( url, data, contentType, callback, 'text' );
			},

			/**
			 * Loads data from a URL as XML.
			 *
			 *		// Load XML synchronously.
			 *		var xml = CKEDITOR.ajax.loadXml( 'somedata.xml' );
			 *		alert( xml.getInnerXml( '//' ) );
			 *
			 *		// Load XML asynchronously.
			 *		var data = CKEDITOR.ajax.loadXml( 'somedata.xml', function( xml ) {
			 *			alert( xml.getInnerXml( '//' ) );
			 *		} );
			 *
			 * @param {String} url The URL from which the data is loaded.
			 * @param {Function} [callback] A callback function to be called on
			 * data load. If not provided, the data will be loaded synchronously.
			 * @returns {CKEDITOR.xml} An XML object storing the loaded data. For asynchronous requests, an
			 * empty string. For invalid requests, `null`.
			 */
			loadXml: function( url, callback ) {
				return load( url, callback, 'xml' );
			}
		};
	} )();
} )();
