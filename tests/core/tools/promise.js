/* bender-tags: editor */

( function() {
	'use strict';

	bender.test( {

		setUp: function() {
			this.Promise = window.Promise;
		},

		tearDown: function() {
			window.Promise = this.Promise;
		},

		// (#2962)
		'test promise initialization': function() {
			if ( window.Promise ) {
				assert.areSame( window.Promise, CKEDITOR.tools.promise, 'Native Promise should be enabled' );
				assert.isUndefined( window.ES6Promise, 'Polyfill Promise should not be loaded' );
			} else {
				assert.isNotUndefined( window.ES6Promise, 'Polyfill Promise should be loaded' );
				assert.areSame( window.ES6Promise, CKEDITOR.tools.promise, 'Polyfill Promise should be enabled' );
			}
		},

		// (#2962)
		'test missing promise polyfill': function() {
			// Bundled CKEditor is missing loader.
			if ( !CKEDITOR.loader ) {
				assert.ignore();
			}

			var loaderStub = sinon.stub( CKEDITOR.scriptLoader, 'load', function( url, callback ) {
					callback( false );
				} ),
				errorStub = sinon.stub( CKEDITOR, 'error' );

			window.Promise = undefined;
			window.ES6Promise = undefined;

			// Drop cache.
			delete CKEDITOR.loader.loadedScripts[ 's:promise' ];

			CKEDITOR.loader.load( 'promise' );

			// Give loader some time to load module.
			setTimeout( function() {
				resume( function() {
					loaderStub.restore();
					errorStub.restore();

					assert.isTrue( errorStub.calledWith( 'no-vendor-lib', { path: CKEDITOR.getUrl( 'vendor/promise.js' ) } ) );
				} );
			}, 100 );

			wait();
		}
	} );

} )();
