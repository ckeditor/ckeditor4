/* bender-tags: editor,utils */

( function() {
	'use strict';

	var assert = bender.assert;

	bender.test( {
		'test invalid arguments': function() {
			// Invalid arguments.
			assert.throwsError( YUITest.AssertionError, function() {
				assert.isNumberInRange( 100, 102, 101 );
			}, 'min > max' );
			assert.throwsError( YUITest.AssertionError, function() {
				assert.isNumberInRange( 101, 101, 101 );
			}, 'min == max' );
			assert.throwsError( YUITest.AssertionError, function() {
				assert.isNumberInRange( null, 99, 101 );
			}, 'expected not a number' );
			assert.throwsError( YUITest.AssertionError, function() {
				assert.isNumberInRange( 100, '99', 101 );
			}, 'min not a number' );
			assert.throwsError( YUITest.AssertionError, function() {
				assert.isNumberInRange( 100, 100 );
			}, 'max not a number' );
		},

		'test number not in range': function() {
			// Number is not in range.
			assert.throwsError( YUITest.ComparisonFailure, function() {
				assert.isNumberInRange( 100, 101, 102 );
			}, 'lower < min' );
			assert.throwsError( YUITest.ComparisonFailure, function() {
				assert.isNumberInRange( 100, 98, 99 );
			}, 'expected > max' );
		},

		'test passing and passed assertions number increasing': function() {
			// Number is in range.
			assert.isNumberInRange( 100, 99, 101, '99 <= 100 <= 101' );
			assert.isNumberInRange( 100, 100, 101, '100 <= 100 <= 101' );
			assert.isNumberInRange( 100, 98, 100, '98 <= 100 <= 100' );
		},

		// https://dev.ckeditor.com/ticket/12841
		'test proper assertion message': function() {
			try {
				assert.isNumberInRange( 102, 99, 101, 'Custom message.' );
			} catch ( e ) {
				assert.areEqual( 'Custom message.', e.message );
				assert.areEqual( 'Greater than 99 and lower than 101.', e.expected );
				assert.areEqual( 102, e.actual );
			}
		}
	} );
} )();
