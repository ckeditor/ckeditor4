/* bender-tags: editor */
/* bender-ckeditor-plugins: undo */

( function() {
	'use strict';

	var KeyEventsStack;

	bender.editor = true;

	bender.test( {
		setUp: function() {
			KeyEventsStack = CKEDITOR.plugins.undo.KeyEventsStack;
		},

		'test properly push record': function() {
			var kes = new KeyEventsStack();

			kes.push( 13 );
			assert.areEqual( 13, kes.stack[ 0 ].keyCode, 'Proper object should be added.' );
			assert.areEqual( 1, kes.stack.length, 'Only one should be in stack' );
		},

		'test properly find last index': function() {
			var kes = new KeyEventsStack();

			kes.push( 13 );
			kes.push( 23 );

			assert.areEqual( 1, kes.getLastIndex() );
			assert.areEqual( -1, kes.getLastIndex( 100 ) );
			assert.areEqual( 0, kes.getLastIndex( 13 ) );
			assert.areEqual( 1, kes.getLastIndex( 23 ) );
		},

		'test properly find last record': function() {
			var kes = new KeyEventsStack();

			kes.push( 13 );
			kes.push( 23 );

			assert.areEqual( 23, kes.getLast().keyCode );
			assert.areEqual( null, kes.getLast( 100 ) );
			assert.areEqual( 13, kes.getLast( 13 ).keyCode );
			assert.areEqual( 23, kes.getLast( 23 ).keyCode );
		},

		'test properly increment record': function() {
			var kes = new KeyEventsStack();

			kes.push( 13 );
			kes.push( 23 );

			kes.increment( 13 );
			assert.areEqual( 1, kes.stack[ 0 ].inputs );
		},

		'test properly remove record': function() {
			var kes = new KeyEventsStack();

			kes.push( 13 );
			kes.push( 23 );

			kes.remove();
			assert.areEqual( 1, kes.stack.length );
			assert.areEqual( 13, kes.stack[ 0 ].keyCode );

			kes.remove( 13 );
			assert.areEqual( 0, kes.stack.length );
		},

		'test properly return total inputs': function() {
			var kes = new KeyEventsStack();

			kes.push( 13 );
			kes.push( 23 );

			kes.increment( 13 );
			kes.increment( 13 );
			assert.areEqual( 2, kes.getTotalInputs() );

			kes.increment( 23 );
			assert.areEqual( 3, kes.getTotalInputs() );
		},

		'test propetly reset inputs': function() {
			var kes = new KeyEventsStack();

			kes.push( 13 );
			kes.increment( 13 );
			kes.increment( 13 );
			kes.increment( 13 );
			kes.push( 23 );
			kes.increment( 23 );
			kes.increment( 23 );
			kes.push( 33 );
			kes.increment( 33 );

			kes.resetInputs( 23 );
			assert.areEqual( 4, kes.getTotalInputs() );

			kes.resetInputs();
			assert.areEqual( 0, kes.getTotalInputs() );
		},

		'test properly clean up': function() {
			var kes = new KeyEventsStack();

			kes.push( 17 ); /* Ctrl */
			kes.push( 16 ); /* Shift */

			kes.cleanUp( {
				data: {
					$: {
						ctrlKey: true
					}
				}
			} );

			assert.areEqual( 1, kes.stack.length );
			assert.areEqual( 17, kes.stack[ 0 ].keyCode );
		}
	} );
} )();
