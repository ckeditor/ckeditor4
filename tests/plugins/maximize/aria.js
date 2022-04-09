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

	// (#2444)
	tests[ 'the label is not changed after maximizing the editor' ] = function() {
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
