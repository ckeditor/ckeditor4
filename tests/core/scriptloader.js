/* bender-tags: editor,unit */

var tests = {
//		test_loadCode : function()
//		{
//			CKEDITOR.scriptLoader.loadCode( 'var test="Testing!";' );
//
//			/*jsl:ignore
//			assert.areEqual( 'Testing!', test );
//			/*jsl:end
//		},

	'test load': function() {
		var tc = this;

		function callback( data ) {
			tc.resume( function() {
				assert.areSame( 'Test!', testVar );
			} );
		}

		CKEDITOR.scriptLoader.load( '../_assets/sample.js', callback );

		this.wait();
	},

	'test queue': function() {
		var tc = this;

		function testQueue( scripts ) {
			var loaded = [],
				script;

			for ( var i = 0; i < scripts.length; i++ ) {
				// Mark this script as loaded.
				// This should happen before scriptLoader.queue() loads
				// the next pending script. It allows the final load order
				// assertion.
				script = scripts[ i ];

				( function( script ) {
					function callback( success ) {
						loaded.push( script );

						tc.resume( function() {
							assert.areSame( true, success, 'Successful load.' );
							wait();
						} );

						if ( loaded.length == scripts.length ) {
							tc.resume( function() {
								assert.areSame( 'Foo', testVar1, 'Script has been loaded.' );
								assert.areSame( 'Bar', testVar2, 'Script has been loaded.' );
								assert.areSame( 'Bam', testVar3, 'Script has been loaded.' );

								arrayAssert.itemsAreSame( scripts, loaded, 'Scripts loaded in queue order.' );
							} );
						}
					}

					CKEDITOR.scriptLoader.queue( script, callback );
				} )( script );
			}
		}

		testQueue( [
			'../_assets/queue1.js',
			'../_assets/queue2.js',
			'../_assets/queue3.js'
		] );

		this.wait();
	}
};

// Repeat the queue tests, to be sure that it is not getting stuck.
tests[ 'test queue again' ] = tests[ 'test queue' ];

bender.test( tests );