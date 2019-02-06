/* bender-tags: editor */

( function() {
	'use strict';

	// We're gonna do that later, manually.
	CKEDITOR.disableAutoInline = true;

	bender.test( {
		'inline duplicates': createTestCase( 'inline', 'editable' ),
		'themedui duplicates': createTestCase( 'replace', 'editor' )
	} );

	function createTestCase( creator, element ) {
		return function() {
			var spy = sinon.spy( CKEDITOR, 'error' );

			CKEDITOR[ creator ]( element );

			wait( function() {
				CKEDITOR[ creator ]( element );

				spy.restore();
				assert.areSame( 1, spy.callCount, 'Error was thrown' );
				assert.areSame( 'editor-element-conflict', spy.args[ 0 ][ 0 ], 'Appropriate error code was used' );
			}, 100 );
		};
	}

} )();
