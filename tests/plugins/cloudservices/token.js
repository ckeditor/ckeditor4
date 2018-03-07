/* bender-ckeditor-plugins: cloudservices */
/* bender-include: %BASE_PATH%/plugins/easyimage/_helpers/tools.js*/
/* global easyImageTools */

( function() {
	var TOKEN_VALUE = 'sample-token-value',
		TOKEN_URL = 'mock_token_url',
		xhr = sinon.useFakeXMLHttpRequest(),
		requests = [];

	bender.editor = {
		config: {
			cloudServices_uploadUrl: 'mock_upload_url',
			cloudServices_tokenUrl: TOKEN_URL
		}
	};

	xhr.onCreate = function( request ) {
		requests.push( request );
	};

	bender.test( {
		setUp: function() {
			if ( easyImageTools.isUnsupportedEnvironment() ) {
				assert.ignore();
			}

			this.cloudservices = CKEDITOR.plugins.cloudservices;

			for ( var i = requests.length - 1; i >= 0; i-- ) {
				var curRequest = requests[ i ];

				if ( curRequest.url.match( TOKEN_URL ) ) {
					curRequest.respond( 200, {}, TOKEN_VALUE );
				}
			}
			// Request array should be cleared out for each TC.
			requests = [];
		},

		'test the token is fetched from cloudServices_tokenUrl': function() {
			var instance = new this.cloudservices.cloudServicesLoader( this.editor, bender.tools.pngBase64 ),
				request = null;

			instance.upload();

			for ( var i = 0; i < requests.length; i++ ) {
				if ( requests[ i ].url.match( /mock_upload_url/ ) ) {
					request = requests[ i ];
				}
			}

			assert.isNotNull( request );

			objectAssert.hasKey( 'Authorization', request.requestHeaders, 'Token is included as a header' );
			assert.areSame( TOKEN_VALUE, request.requestHeaders.Authorization, 'Authorization header value' );
		}
	} );
} )();
