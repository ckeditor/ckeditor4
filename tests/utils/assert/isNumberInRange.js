/* bender-tags: editor,unit,utils */

( function () {
	'use strict';

	var assert = bender.assert;

	bender.test( {
		'test': function() {
			var message = 'Message describing why assert should be valid.';

			// Number is not in range.
			assert.throwsError( YUITest.ComparisonFailure, function() {
				assert.isNumberInRange( 100, 101, 102, message );
			} );
			assert.throwsError( YUITest.ComparisonFailure, function() {
				assert.isNumberInRange( 100, 102, 101, message );
			} );
			assert.throwsError( YUITest.ComparisonFailure, function() {
				assert.isNumberInRange( 100, 98, 99, message );
			} );

			// Number is in range.
			assert.isNumberInRange( 100, 99, 101, message );
			assert.isNumberInRange( 100, 101, 99, message );
			assert.isNumberInRange( 100, 100, 101, message );
			assert.isNumberInRange( 100, 101, 100, message );
			assert.isNumberInRange( 100, 98, 100, message );
		}
	} );
} )();