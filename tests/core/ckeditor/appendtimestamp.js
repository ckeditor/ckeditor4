/* bender-tags: editor */

( function() {
	'use strict';

	bender.test( {
		'test append timestamp returns the same resource path if there is no timestamp': performTimestampTest(
				'',
				'style.css',
				'style.css',
				'Resource path was modified without timestamp in CKEDITOR'
		),

		'test append timestamp returns resource path with timestamp': performTimestampTest(
			'cke4',
			'style.css',
			'style.css?t=cke4',
			'Resource path was modified without timestamp in CKEDITOR'
		),

		'test append timestamp returns the same resource path if it is a directory path': performTimestampTest(
			'cke4',
			'style/',
			'style/',
			'Resource path to directory should not be changed'
		),

		'test append timestamp to resource path with only timestamp does not change it': performTimestampTest(
			'cke4',
			'style.css?t=qaz1',
			'style.css?t=qaz1',
			'Resource path with timestamp was affected with new timestamp'
		),

		'test append timestamp to resource path with chained timestamp does not change it': performTimestampTest(
			'cke4',
			'style.css?q=abc&t=qaz1',
			'style.css?q=abc&t=qaz1',
			'Resource path with chained timestamp was affected with new timestamp'
		)
	} );

	function performTimestampTest( timestamp, resourcePath, expected, message ) {
		return function() {
			var originalTimestamp = CKEDITOR.timestamp;
			CKEDITOR.timestamp = timestamp;

			var result = CKEDITOR.appendTimestamp( resourcePath );

			CKEDITOR.timestamp = originalTimestamp;
			assert.areSame( expected, result, message );
		};
	}
} )();
