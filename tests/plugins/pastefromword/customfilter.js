/* bender-tags: editor,clipboard */
/* bender-ckeditor-plugins: pastefromword */
/* bender-include: generated/_helpers/pfwTools.js, ../pastetools/_helpers/ptTools.js */
/* global ptTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			pasteFromWordCleanupFile: '%TEST_DIR%_assets/customfilter.js'
		}
	};

	var tests = {
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
				dataValue: '<p>fail <strong class="MsoNormal">fail</strong></p>',
				method: 'paste'
			} );

			wait();
		}
	};

	ptTools.ignoreTestsOnMobiles( tests );

	bender.test( tests );
} )();
