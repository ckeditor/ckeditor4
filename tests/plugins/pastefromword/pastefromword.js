/* bender-tags: editor,unit,clipboard */
/* bender-ckeditor-plugins: pastefromword */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		'test whether default filter is loaded': function() {
			var editor = this.editor;

			editor.once( 'paste', function( evt ) {
				resume( function() {
					assert.areSame( '<p>text <strong>text</strong></p>', evt.data.dataValue, 'Basic filter was applied' );
				} );
			}, null, null, 999 );

			editor.fire( 'paste', {
				type: 'auto',
				// This data will be recognized as pasted from Word.
				dataValue: '<p>text <strong class="MsoNormal">text</strong></p>'
			} );

			wait();
		}
	} );

} )();