/* bender-tags: editor,utils */

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
			assert.isInnerHtmlMatching( 'a', 'b' );
			assert.isTrue( called, 'compareInnerHtml was called' );
			assert.areSame( 'a', expected, 'expected' );
			assert.areSame( 'b', actual, 'actual' );
			assert.isNull( options, 'options' );
		},

		'test passes - opts': function() {
			var obj = {};

			assert.isInnerHtmlMatching( 'a', 'b', obj );
			assert.isTrue( called, 'compareInnerHtml was called' );
			assert.areSame( 'a', expected, 'expected' );
			assert.areSame( 'b', actual, 'actual' );
			assert.areSame( obj, options, 'options' );
		},

		'test passes - message': function() {
			assert.isInnerHtmlMatching( 'a', 'b', 'msg' );
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
				assert.isInnerHtmlMatching( 'a', '<B foo="1" bar="2" aaa="3" >b</b>', { sortAttributes: false }, 'msg' );
			} catch ( e ) {
				error = e;
				failed = true;
			}

			assert.isTrue( failed, 'failed' );
			assert.isTrue( called, 'compareInnerHtml was called' );
			assert.areSame( 'a', expected, 'expected' );
			assert.areSame( '<B foo="1" bar="2" aaa="3" >b</b>', actual, 'actual' );
			assert.isNotNull( options, 'options' );
			assert.areSame( 'msg', error.message, 'message' );
			assert.areSame( '/^a$/', error.expected, 'error.expected' );
			assert.areSame( '<b foo="1" bar="2" aaa="3">b</b>', error.actual, 'error.actual' );
		},

		'test increments number of assertions': function() {
			// Will fail if it doesn't
			assert.isInnerHtmlMatching( 'a', 'a' );
		}
	} );
} )();
