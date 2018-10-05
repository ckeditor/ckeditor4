/* bender-tags: editor */

( function() {
	'use strict';

	bender.test( {
		tearDown: function() {
			CKEDITOR.document.findOne( '.clear_focus' ).focus();
		},
		'Test focus element without focus options': testFocus(),
		'Test focus element with defer': testFocus( true ),
		'Test focus element with defer as focus option': testFocus( { defer: true } ),
		'Test focus element with defer set to false': testFocus( { defer: false } ),
		'Test focus element with empty object as focus option': testFocus( {} )
	} );

	function testFocus( focusOptions ) {
		return function() {
			var document = CKEDITOR.document,
				focusable = document.findOne( '.focusable' ),
				defer = focusOptions === true || focusOptions && focusOptions.defer;

			focusable.focus( focusOptions );

			if ( defer ) {
				assert.areNotSame( document.getActive(), focusable );
				setTimeout( function() {
					resume( assertFocus );
				}, 120 );
				wait();
			} else {
				assertFocus();
			}

			function assertFocus() {
				assert.areSame( document.getActive(), focusable );
			}
		};
	}
} )();
