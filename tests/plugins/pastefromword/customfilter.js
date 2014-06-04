/* bender-tags: editor,unit,clipboard */
/* bender-ckeditor-plugins: pastefromword */

( function() {
	'use strict';

	bender.editor = {
		config: {
			pasteFromWordCleanupFile: '%TEST_DIR%_assets/customFilter.js'
		}
	};

	bender.test( {
		'test whether custom filter is loaded': function() {
			var editor = this.editor;

			editor.once( 'paste', function( evt ) {
				resume( function() {
					assert.areSame( 'ok', evt.data.dataValue, 'Custom filter was applied' );
				} );
			}, null, null, 999 );

			editor.fire( 'paste', {
				type: 'auto',
				// This data will be recognized as pasted from Word.
				dataValue: '<p>fail <strong class="MsoNormal">fail</strong></p>'
			} );

			wait();
		}
	} );

} )();