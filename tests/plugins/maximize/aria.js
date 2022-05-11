/* bender-tags: editor */
/* bender-ckeditor-plugins: toolbar, maximize */
/* bender-include: ../button/_helpers/buttontools.js */
/* global buttonTools */

( function() {
	bender.editor = true;

	// (#2444)
	var tests = buttonTools.createAriaPressedTests( 'test_editor', [
		'Maximize'
	] );

	tests.setUp = function() {
		// Maximize plugin is disabled on iOS (https://dev.ckeditor.com/ticket/8307).
		if ( CKEDITOR.env.iOS ) {
			assert.ignore();
		}
	};

	// (#2444)
	tests[ 'the label is not changed after maximizing the editor' ] = function() {
		// For some reason the global setup function does not work for this test.
		if ( CKEDITOR.env.iOS ) {
			assert.ignore();
		}

		var editor = this.editor,
			button = buttonTools.getUiItem( editor, 'Maximize' ),
			domButton = buttonTools.getButtonDomElement( button ),
			initialLabel = button.label;

		editor.once( 'afterCommandExec', function() {
			var label = domButton.findOne( '.cke_button_label' ).getHtml();

			editor.execCommand( 'maximize' );

			assert.areSame( initialLabel, label );
		} );

		editor.execCommand( 'maximize' );
	};

	bender.test( tests );
} )();
