/* @bender-ckeditor-plugins: cloudservices */

bender.editor = {
	config: {
		cloudServices_url: 'cs_url',
		cloudServices_token: 'cs_token'
	}
};

var mockBase64 = 'data:image/gif;base64,R0lGODlhDgAOAIAAAAAAAP///yH5BAAAAAAALAAAAAAOAA4AAAIMhI+py+0Po5y02qsKADs=';

bender.test( {
	setUp: function() {
		this.cloudservices = CKEDITOR.plugins.cloudservices;
	},

	'test plugin exposes loader': function() {
		assert.isInstanceOf( Function, this.cloudservices.cloudServicesLoader, 'cloudServicesLoader property type' );
	},

	'test loader uses config url/token': function() {
		var instance = new this.cloudservices.cloudServicesLoader( this.editor, mockBase64 ),
			// Stub loader.xhr methods before it's actually called.
			listener = this.editor.once( 'fileUploadRequest', this.commonRequestListener, null, null, 0 );

		try {
			instance.upload();

			// Make sure that configured URL has been requested.
			sinon.assert.calledWithExactly( instance.xhr.open, 'POST', 'cs_url', true );

			// Make sure that proper header has been added.
			sinon.assert.calledWithExactly( instance.xhr.setRequestHeader, 'Authorization', 'cs_token' );

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
		var instance = new this.cloudservices.cloudServicesLoader( this.editor, mockBase64 ),
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
		var instance = new this.cloudservices.cloudServicesLoader( this.editor, mockBase64, null, 'different_token' ),
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
		var instance = new this.cloudservices.cloudServicesLoader( this.editor, mockBase64, null, 'different_token' ),
		listener = this.editor.once( 'fileUploadRequest', this.commonRequestListener, null, null, 0 );
		this.editor.config.cloudServices_url = undefined;
		CKEDITOR.once( 'log', function( evt ) {
			evt.cancel();
			assert.areEqual( 'cloudservices-url-error', evt.data.errorCode, 'There should be URL error log.' );
		} );
		instance.upload();
		this.editor.config.cloudServices_url = 'cs_url';
		listener.removeListener();
	},

	'test no TOKEN error': function() {
		var instance = new this.cloudservices.cloudServicesLoader( this.editor, mockBase64 ),
		listener = this.editor.once( 'fileUploadRequest', this.commonRequestListener, null, null, 0 );
		this.editor.config.cloudServices_token = undefined;
		CKEDITOR.once( 'log', function( evt ) {
			evt.cancel();
			assert.areEqual( 'cloudservices-token-error', evt.data.errorCode, 'There should be TOKEN error log.' );
		} );
		instance.upload();
		listener.removeListener();
		this.editor.config.cloudServices_token = 'cs_token';
	},

	// Common fileUploadRequest listener reused by tests.
	commonRequestListener: function( evt ) {
		var loader = evt.data.fileLoader;

		sinon.stub( loader.xhr, 'open' );
		sinon.stub( loader.xhr, 'send' );
		sinon.stub( loader.xhr, 'setRequestHeader' );
	}
} );