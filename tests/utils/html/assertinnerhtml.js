/* bender-tags: editor,unit,utils */

( function() {
	'use strict';

	var htmlTools = bender.tools.html,
		shouldReturn, called, expected, actual, options;

	htmlTools.compareInnerHtml = function( argExpected, argActual, argOptions ) {
		called = true;
		expected = argExpected;
		actual = argActual;
		options = argOptions;

		return shouldReturn;
	};

	bender.test( {
		setUp: function() {
			called = expected = actual = options = undefined;
			shouldReturn = true;
		},

		'test passes - no opts': function() {
			htmlTools.assertInnerHtml( 'a', 'b' );
			assert.isTrue( called, 'compareInnerHtml was called' );
			assert.areSame( 'a', expected, 'expected' );
			assert.areSame( 'b', actual, 'actual' );
			assert.isNull( options, 'options' );
		},

		'test passes - opts': function() {
			var obj = {};

			htmlTools.assertInnerHtml( 'a', 'b', obj );
			assert.isTrue( called, 'compareInnerHtml was called' );
			assert.areSame( 'a', expected, 'expected' );
			assert.areSame( 'b', actual, 'actual' );
			assert.areSame( obj, options, 'options' );
		},

		'test passes - message': function() {
			htmlTools.assertInnerHtml( 'a', 'b', 'msg' );
			assert.isTrue( called, 'compareInnerHtml was called' );
			assert.areSame( 'a', expected, 'expected' );
			assert.areSame( 'b', actual, 'actual' );
			assert.isNull( options, 'options' );
		},

		'test fails': function() {
			shouldReturn = false;

			var error,
				failed = false;

			try {
				htmlTools.assertInnerHtml( 'a', 'b', 'msg' );
			} catch ( e ) {
				error = e;
				failed = true;
			}

			assert.isTrue( failed, 'failed' );
			assert.isTrue( called, 'compareInnerHtml was called' );
			assert.areSame( 'a', expected, 'expected' );
			assert.areSame( 'b', actual, 'actual' );
			assert.isNull( options, 'options' );
			assert.areSame( 'msg', error.message, 'message' )
		}
	} );
} )();