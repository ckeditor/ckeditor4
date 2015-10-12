/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: ajax,xml */

( function() {
	'use strict';

	function assertAjaxPost( expectedUrl, expectedData, expectedContentType, execRequest ) {
		var orgXMLHttpRequest = window.XMLHttpRequest;

		try {
			var sendCalled = 0,
				openCalled = 0,
				setRequestHeaderCalled = 0;

			window.XMLHttpRequest = function() {};

			window.XMLHttpRequest.prototype = {
				send: function( data ) {
					assert.areSame( expectedData, data, 'Data passed correctly' );
					++sendCalled;
				},

				open: function( type, url ) {
					assert.areSame( 'POST', type, 'Request type is valid' );
					assert.areSame( expectedUrl, url, 'Request url is valid' );
					++openCalled;
				},

				setRequestHeader: function( name, value ) {
					assert.areSame( 'Content-type', name, 'Header name is valid' );
					assert.areSame( expectedContentType, value, 'Content-type type is valid' );
					++setRequestHeaderCalled;
				}
			};

			execRequest();

			assert.areSame( 1, sendCalled, 'XMLHttpRequest.send called once' );
			assert.areSame( 1, openCalled, 'XMLHttpRequest.open called once' );
			assert.areSame( expectedContentType ? 1 : 0, setRequestHeaderCalled, 'XMLHttpRequest.setRequestHeader called' );
		} catch ( e ) {
			throw e;
		} finally {
			window.XMLHttpRequest = orgXMLHttpRequest;
		}

		// Call it once again so the callback can be tested.
		execRequest();
	}

	bender.test( {
		test_load_sync: function() {
			var data = CKEDITOR.ajax.load( '../../_assets/sample.txt' );
			assert.areSame( 'Sample Text', data, 'The loaded data doesn\'t match' );
		},

		test_load_sync_404: function() {
			var data = CKEDITOR.ajax.load( '404.txt' );
			assert.isNull( data );
		},

		test_load_async: function() {
			var callback = function( data ) {
				resume( function() {
					assert.areSame( 'Sample Text', data, 'The loaded data doesn\'t match' );
				} );
			};

			// Defer loading file, because in some cases on IE7 it's done synchronously, so resume() is called before wait().
			setTimeout( function() {
				CKEDITOR.ajax.load( '../../_assets/sample.txt', callback );
			} );

			wait();
		},

		test_load_async_404: function() {
			var callback = function( data ) {
				resume( function() {
					assert.isNull( data );
				} );
			};

			CKEDITOR.ajax.load( '404.txt', callback );

			wait();
		},

		test_loadXml_sync: function() {
			if ( CKEDITOR.env.ie && CKEDITOR.env.version > 9 ) {
				assert.ignore();
			}

			var data = CKEDITOR.ajax.loadXml( '../../_assets/sample.xml' );
			assert.isInstanceOf( CKEDITOR.xml, data );
			assert.isNotNull( data.selectSingleNode( '//list/item' ), 'The loaded data doesn\'t match (null)' );
			assert.isNotUndefined( data.selectSingleNode( '//list/item' ), 'The loaded data doesn\'t match (undefined)' );
		},

		test_loadXml_sync_404: function() {
			var data = CKEDITOR.ajax.loadXml( '404.xml' );
			assert.isNull( data );
		},

		test_loadXml_async: function() {
			if ( CKEDITOR.env.ie && CKEDITOR.env.version > 9 ) {
				assert.ignore();
			}

			var callback = function( data ) {
				resume( function() {
					assert.isInstanceOf( CKEDITOR.xml, data );
					assert.isNotNull( data.selectSingleNode( '//list/item' ), 'The loaded data doesn\'t match (null)' );
					assert.isNotUndefined( data.selectSingleNode( '//list/item' ), 'The loaded data doesn\'t match (undefined)' );
				} );
			};

			// Defer loading file, because in some cases on IE7 it's done synchronously, so resume() is called before wait().
			setTimeout( function() {
				CKEDITOR.ajax.loadXml( '../../_assets/sample.xml', callback );
			} );

			wait();
		},

		test_loadXml_async_404: function() {
			var callback = function( data ) {
				resume( function() {
					assert.isNull( data );
				} );
			};

			CKEDITOR.ajax.loadXml( '404.xml', callback );

			wait();
		},

		'test CKEDITOR.ajax.post: ContentType application/x-www-form-urlencoded': function() {
			var url = '404.post',
				data = 'key=value',
				contentType = 'application/x-www-form-urlencoded';

			assertAjaxPost( url, data, contentType, function() {
				CKEDITOR.ajax.post( url, data, contentType, function() {
					resume( function() {
						assert.isTrue( true, 'Callback called' );
					} );
				} );
			} );

			wait();
		},

		'test CKEDITOR.ajax.post: ContentType application/json': function() {
			var url = '404.post',
				data = JSON.stringify( { key: 'value' } ),
				contentType = 'application/json';

			assertAjaxPost( url, data, contentType, function() {
				CKEDITOR.ajax.post( url, data, contentType, function() {
					resume( function() {
						assert.isTrue( true, 'Callback called' );
					} );
				} );
			} );

			wait();
		},

		'test CKEDITOR.ajax.post: ContentType not specified': function() {
			var url = '404.post',
				data = 'key=value';

			assertAjaxPost( url, data, 'application/x-www-form-urlencoded; charset=UTF-8', function() {
				CKEDITOR.ajax.post( url, data, null, function() {
					resume( function() {
						assert.isTrue( true, 'Callback called' );
					} );
				} );
			} );

			wait();
		}
	} );
} )();
