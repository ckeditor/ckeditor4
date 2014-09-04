/* bender-tags: editor,unit,utils */

( function () {
	'use strict';

	var assert = bender.assert;

	bender.test( {
		'test': function() {
			// Invalid arguments.
			assert.throwsError( YUITest.AssertionError, function() {
				assert.isNumberInRange( 100, 102, 101 );
			} );
			assert.throwsError( YUITest.AssertionError, function() {
				assert.isNumberInRange( null, 99, 101 );
			} );
			assert.throwsError( YUITest.AssertionError, function() {
				assert.isNumberInRange( 100, null, 100 );
			} );
			assert.throwsError( YUITest.AssertionError, function() {
				assert.isNumberInRange( 100, 100 );
			} );

			// Number is not in range.
			assert.throwsError( YUITest.ComparisonFailure, function() {
				assert.isNumberInRange( 100, 101, 102 );
			} );
			assert.throwsError( YUITest.ComparisonFailure, function() {
				assert.isNumberInRange( 100, 98, 99 );
			} );

			// Number is in range.
			assert.isNumberInRange( 100, 99, 101 );
			assert.isNumberInRange( 100, 100, 101 );
			assert.isNumberInRange( 100, 98, 100 );
		}
	} );
} )();