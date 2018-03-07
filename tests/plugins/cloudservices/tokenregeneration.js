/* bender-ckeditor-plugins: cloudservices */
/* bender-include: %BASE_PATH%/plugins/easyimage/_helpers/tools.js*/
/* global easyImageTools */

( function() {
	var TOKEN_VALUE = 'sample-token-value',
		TOKEN_URL = '/mock_token_url',
		MOCK_UPLOAD_URL = '/mock_upload_url',
		xhrServer = sinon.fakeServer.create(),
		counter = 0;

	bender.editor = {
		config: {
			cloudServices_url: MOCK_UPLOAD_URL,
			cloudServices_tokenUrl: TOKEN_URL
		}
	};

	CKEDITOR.once( 'instanceCreated', function( evt ) {
		// Lower the polling rate.
		evt.editor.CLOUD_SERVICES_TOKEN_INTERVAL = 100;
	} );

	xhrServer.respondWith( function( req ) {
		if ( req.url === TOKEN_URL ) {
			req.respond( 200, {}, TOKEN_VALUE + counter );
			counter += 1;
		} else {
			req.respond( 200, {}, 'dummy-response' );
		}
	} );

	bender.test( {
		setUp: function() {
			if ( easyImageTools.isUnsupportedEnvironment() ) {
				assert.ignore();
			}

			// Handle initial token request.
			xhrServer.respond();

			this.cloudservices = CKEDITOR.plugins.cloudservices;
		},

		'test the token is fetched from cloudServices_tokenUrl': function() {
			xhrServer.respond();
			setTimeout( function() {
				resume( function() {
					xhrServer.respond();

					var instance = new this.cloudservices.cloudServicesLoader( this.editor, bender.tools.pngBase64 );

					instance.upload();

					for ( var i = xhrServer.requests.length - 1; i >= 0; i-- ) {
						var curReq = xhrServer.requests[ i ];

						if ( curReq.method === 'POST' && curReq.url === MOCK_UPLOAD_URL ) {
							objectAssert.hasKey( 'Authorization', curReq.requestHeaders, 'Token is included as a header' );
							assert.areNotSame( TOKEN_VALUE + '0', curReq.requestHeaders.Authorization, 'Authorization header value' );
							break;
						}
					}

				} );
			}, 250 );

			wait();
		}
	} );
} )();
