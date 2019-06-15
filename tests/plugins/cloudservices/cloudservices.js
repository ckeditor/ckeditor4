/* bender-ckeditor-plugins: cloudservices,easyimage */

( function() {
	var TOKEN_VALUE = 'sample-token-value',
		TOKEN_URL = '/mock_token_url',
		UPLOAD_URL = 'cs_url',
		xhrServer = sinon.fakeServer.create(),
		incrementalTokenCount = 0;

	bender.editor = {
		config: {
			cloudServices_uploadUrl: UPLOAD_URL,
			cloudServices_tokenUrl: TOKEN_URL
		}
	};

	xhrServer.respondWith( function( req ) {
		var respMapping = {
			'/empty_token': ''
		};

		respMapping[ TOKEN_URL ] = TOKEN_VALUE;

		respMapping[ UPLOAD_URL ] = JSON.stringify( {
			200: 'https://foo/bar.jpg/w_200',
			400: 'https://foo/bar.jpg/w_400',
			600: 'https://foo/bar.jpg/w_600',
			'default': 'https://foo/bar.jpg'
		} );

		if ( req.url in respMapping ) {
			req.respond( 200, {}, respMapping[ req.url ] );
		} else if ( req.url === '/incremental_token' ) {
			req.respond( 200, {}, TOKEN_VALUE + incrementalTokenCount );
			incrementalTokenCount += 1;
		} else {
			req.respond( 200, {}, 'dummy-response' );
		}
	} );

	bender.test( {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'easyimage' );

			this.cloudservices = CKEDITOR.plugins.cloudservices;

			incrementalTokenCount = 0;

			xhrServer.respond();

			this.editor.config.cloudServices_uploadUrl = UPLOAD_URL;
		},

		'test plugin exposes loader': function() {
			assert.isInstanceOf( Function, this.cloudservices.cloudServicesLoader, 'cloudServicesLoader property type' );
		},

		'test loader uses config url/token': function() {
			var instance = new this.cloudservices.cloudServicesLoader( this.editor, bender.tools.pngBase64 ),
				// Stub loader.xhr methods before it's actually called.
				listener = this.editor.once( 'fileUploadRequest', this.commonRequestListener, null, null, 0 );

			try {
				instance.upload();

				// Make sure that configured URL has been requested.
				sinon.assert.calledWithExactly( instance.xhr.open, 'POST', UPLOAD_URL, true );

				// Make sure that proper header has been added.
				sinon.assert.calledWithExactly( instance.xhr.setRequestHeader, 'Authorization', TOKEN_VALUE );

				assert.areSame( 1, instance.xhr.send.callCount, 'Call count' );
			} catch ( e ) {
				// Propagate.
				throw e;
			} finally {
				// Always remove listener.
				listener.removeListener();
			}
		},

		'test the token is fetched from cloudServices_tokenUrl': function() {
			var botDefinition = {
					startupData: '<p>foo</p>',
					name: 'incremental_token',
					config: {
						extraPlugins: 'cloudservices',
						cloudServices_tokenUrl: '/incremental_token',
						cloudServices_uploadUrl: UPLOAD_URL
					}
				};

			CKEDITOR.once( 'instanceCreated', function( evt ) {
				// Lower the polling rate.
				evt.editor.CLOUD_SERVICES_TOKEN_INTERVAL = 100;
			} );

			bender.editorBot.create( botDefinition, function( bot ) {
				xhrServer.respond();
				setTimeout( function() {
					resume( function() {
						xhrServer.respond();

						var instance = new this.cloudservices.cloudServicesLoader( bot.editor, bender.tools.pngBase64 );

						instance.upload();

						for ( var i = xhrServer.requests.length - 1; i >= 0; i-- ) {
							var curReq = xhrServer.requests[ i ];

							if ( curReq.method === 'POST' && curReq.url === UPLOAD_URL ) {
								objectAssert.hasKey( 'Authorization', curReq.requestHeaders, 'Token is included as a header' );
								assert.isMatching( /sample\-token\-value\d+/, curReq.requestHeaders.Authorization, 'Authorization header' );
								assert.areNotSame( TOKEN_VALUE + '0', curReq.requestHeaders.Authorization, 'Authorization header value' );
								break;
							}
						}
					} );
				}, 250 );

				wait();
			} );
		},

		'test destroying the editor stops CS token querying': function() {
			var customizedTokenUrl = TOKEN_URL + '/editor_to_be_removed',
				botDefinition = {
					startupData: '<p>foo</p>',
					name: 'editor_to_be_removed',
					config: {
						extraPlugins: 'cloudservices',
						cloudServices_tokenUrl: customizedTokenUrl,
						cloudServices_uploadUrl: UPLOAD_URL
					}
				};

			function getActiveTokenUrlCount() {
				return CKEDITOR.tools.array.filter( xhrServer.requests, function( req ) {
					return req.url === customizedTokenUrl;
				} ).length;
			}

			CKEDITOR.once( 'instanceCreated', function( evt ) {
				// Lower the polling rate.
				evt.editor.CLOUD_SERVICES_TOKEN_INTERVAL = 100;
			} );

			bender.editorBot.create( botDefinition, function( bot ) {
				xhrServer.respond();

				// Store initial count of token calls.
				var initialCount = getActiveTokenUrlCount();

				bot.editor.destroy();

				// Wait a bit after the editor was destroyed.
				setTimeout( function() {
					resume( function() {
						xhrServer.respond();
						assert.areSame( initialCount, getActiveTokenUrlCount(), 'Token requests count does not increase' );
					} );
				}, 250 );

				wait();
			} );
		},

		'test loader allows url overriding': function() {
			var instance = new this.cloudservices.cloudServicesLoader( this.editor, bender.tools.pngBase64 ),
				// Stub loader.xhr methods before it's actually called.
				listener = this.editor.once( 'fileUploadRequest', this.commonRequestListener, null, null, 0 );

			try {
				instance.upload( 'my_custom_url' );

				sinon.assert.calledWithExactly( instance.xhr.open, 'POST', 'my_custom_url', true );

				assert.areSame( 1, instance.xhr.send.callCount, 'Call count' );
			} catch ( e ) {
				// Propagate.
				throw e;
			} finally {
				// Always remove listener.
				listener.removeListener();
			}
		},

		'test loader allows token overriding': function() {
			var instance = new this.cloudservices.cloudServicesLoader( this.editor, bender.tools.pngBase64, null, 'different_token' ),
				// Stub loader.xhr methods before it's actually called.
				listener = this.editor.once( 'fileUploadRequest', this.commonRequestListener, null, null, 0 );

			try {
				instance.upload();

				sinon.assert.calledWithExactly( instance.xhr.setRequestHeader, 'Authorization', 'different_token' );

				assert.areSame( 1, instance.xhr.send.callCount, 'Call count' );
			} catch ( e ) {
				// Propagate.
				throw e;
			} finally {
				// Always remove listener.
				listener.removeListener();
			}
		},

		'test no upload URL error': function() {
			var instance = new this.cloudservices.cloudServicesLoader( this.editor, bender.tools.pngBase64, null, 'different_token' ),
				listener = this.editor.once( 'fileUploadRequest', this.commonRequestListener, null, null, 0 );
			this.editor.config.cloudServices_uploadUrl = undefined;
			CKEDITOR.once( 'log', function( evt ) {
				evt.cancel();
				assert.areEqual( 'cloudservices-no-upload-url', evt.data.errorCode, 'There should be URL error log.' );
			} );
			instance.upload();
			listener.removeListener();
		},

		'test no token error': function() {
			var botDefinition = {
					startupData: '<p>foo</p>',
					name: 'empty_token',
					config: {
						extraPlugins: 'cloudservices',
						cloudServices_tokenUrl: '/empty_token',
						cloudServices_uploadUrl: UPLOAD_URL
					}
				},
				plugin = this.cloudservices;

			bender.editorBot.create( botDefinition, function( bot ) {
				xhrServer.respond();

				var instance = new plugin.cloudServicesLoader( bot.editor, bender.tools.pngBase64 ),
					listener = CKEDITOR.once( 'log', function( evt ) {
						evt.cancel();
						assert.areEqual( 'cloudservices-no-token', evt.data.errorCode, 'There should be TOKEN error log.' );
					} );

				instance.upload();

				listener.removeListener();
			} );
		},

		'test no token URL error': function() {
			var botDefinition = {
					startupData: '<p>foo</p>',
					name: 'no_token_url',
					config: {
						extraPlugins: 'cloudservices',
						cloudServices_uploadUrl: UPLOAD_URL
					}
				},
				tokenUrlErrors = 0,
				listener = CKEDITOR.on( 'log', function( evt ) {
					if ( evt.data.errorCode === 'cloudservices-no-token-url' ) {
						tokenUrlErrors += 1;
					}

					evt.cancel();
				} );

			bender.editorBot.create( botDefinition, function() {
				listener.removeListener();

				assert.areSame( 1, tokenUrlErrors, 'URL errors logged' );
			} );
		},

		// Common fileUploadRequest listener reused by tests.
		commonRequestListener: function( evt ) {
			var loader = evt.data.fileLoader;

			sinon.stub( loader.xhr, 'open' );
			sinon.stub( loader.xhr, 'send' );
			sinon.stub( loader.xhr, 'setRequestHeader' );
		}
	} );
} )();
