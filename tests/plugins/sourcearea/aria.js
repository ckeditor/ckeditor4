/* bender-tags: editor */
/* bender-ckeditor-plugins: toolbar,sourcearea */
/* bender-include: ../button/_helpers/buttontools.js */
/* global buttonTools */

( function() {
	bender.editor = true;

	// (#2444)
	var tests = buttonTools.createAriaPressedTests( 'test_editor', [
		'Source'
	] );

	tests[ 'test updating [aria-pressed] attribute while changing editor\'s mode' ] = function() {
		var editor = this.editor,
			button = buttonTools.getUiItem( editor, 'Source' ),
			sourceExpected = {
				'aria-pressed': 'true'
			},
			wysiwygExpected = {
				'aria-pressed': 'false'
			};

		editor.setMode( 'source', function() {
			resume( function() {
				buttonTools.assertAttributes( sourceExpected, button );

				editor.setMode( 'wysiwyg', function() {
					resume( function() {
						buttonTools.assertAttributes( wysiwygExpected, button );
					} );
				} );

				wait();
			} );
		} );

		wait();
	};

	bender.test( tests );
} )();

