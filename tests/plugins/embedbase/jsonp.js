/* bender-ckeditor-plugins: embedbase,toolbar */

'use strict';

bender.editors = {
	classic: {
		name: 'editor_classic',
		creator: 'replace'
	}
};

var Jsonp;

bender.test( {
	spies: [],

	init: function() {
		Jsonp = CKEDITOR.plugins.embedBase._jsonp;

		var callbacks = CKEDITOR._.jsonpCallbacks;

		// Trick to execute the right callback even though _assets/twitter1.js always calls the 0th.
		callbacks[ 0 ] = function( response ) {
			var lastKey = CKEDITOR.tools.objectKeys( callbacks )[ 1 ];
			callbacks[ lastKey ]( response );
		};
	},

	tearDown: function() {
		var spy;

		while ( spy = this.spies.pop() ) {
			spy.restore();
		}
	},

	assertCleanup: function( url ) {
		// 1, because we set the 0th callback in the init().
		assert.areSame( 1, CKEDITOR.tools.objectKeys( CKEDITOR._.jsonpCallbacks ).length, 'callback was removed' );

		assert.areSame(
			-1,
			CKEDITOR.document.getBody().getHtml().indexOf( 'src="' + url ),
			'script was removed'
		);
	},

	'test sendRequest': function() {
		var that = this;

		Jsonp.sendRequest( new CKEDITOR.template( '%TEST_DIR%_assets/{foo}1.js' ), { foo: 'twitter' }, function( response ) {
			resume( function() {
				assert.areSame( 'CKSource', response.meta.author );
				that.assertCleanup( '%TEST_DIR%_assets/twitter1.js' );
			} );
		} );

		wait();
	},

	'test sendRequest with error': function() {
		// IE8- does not fire #error event on scripts.
		if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
			assert.ignore();
		}

		var that = this;

		Jsonp.sendRequest(
			new CKEDITOR.template( '%TEST_DIR%_assets/gimme404' ), {},
			function() {
				throw new Error( 'Do not call me' );
			},
			function() {
				resume( function() {
					that.assertCleanup( '%TEST_DIR%_assets/gimme404' );
				} );
			}
		);

		wait();
	}
} );