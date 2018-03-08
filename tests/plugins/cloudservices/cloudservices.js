/* bender-ckeditor-plugins: cloudservices */
/* bender-include: %BASE_PATH%/plugins/easyimage/_helpers/tools.js*/
/* global easyImageTools */

( function() {
	var TOKEN_VALUE = 'sample-token-value',
		TOKEN_URL = '/mock_token_url',
		UPLOAD_URL = 'cs_url',
		xhrServer = sinon.fakeServer.create();

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

		if ( req.url in respMapping ) {
			req.respond( 200, {}, respMapping[ req.url ] );
		} else {
			req.respond( 200, {}, 'dummy-response' );
		}
	} );

	bender.test( {
		setUp: function() {
			if ( easyImageTools.isUnsupportedEnvironment() ) {
				assert.ignore();
			}
			this.cloudservices = CKEDITOR.plugins.cloudservices;

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

		'test no URL error': function() {
			var instance = new this.cloudservices.cloudServicesLoader( this.editor, bender.tools.pngBase64, null, 'different_token' ),
				listener = this.editor.once( 'fileUploadRequest', this.commonRequestListener, null, null, 0 );
			this.editor.config.cloudServices_uploadUrl = undefined;
			CKEDITOR.once( 'log', function( evt ) {
				evt.cancel();
				assert.areEqual( 'cloudservices-no-url', evt.data.errorCode, 'There should be URL error log.' );
			} );
			instance.upload();
			listener.removeListener();
		},

		'test no TOKEN error': function() {
			var config = {
					extraPlugins: 'cloudservices',
					cloudServices_tokenUrl: '/empty_token',
					cloudServices_uploadUrl: UPLOAD_URL
				},
				botDefinition = {
					startupData: '<p>foo</p>',
					name: 'empty_token',
					config: config
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

		// Common fileUploadRequest listener reused by tests.
		commonRequestListener: function( evt ) {
			var loader = evt.data.fileLoader;

			sinon.stub( loader.xhr, 'open' );
			sinon.stub( loader.xhr, 'send' );
			sinon.stub( loader.xhr, 'setRequestHeader' );
		}
	} );
} )();
