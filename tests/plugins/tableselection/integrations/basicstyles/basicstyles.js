/* bender-tags: editor, tableselection */
/* bender-ckeditor-plugins: basicstyles,tabletools,toolbar,tableselection */

( function() {
	'use strict';

	bender.editor = {};

	var tests = {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'tableselection' );
		},

		// (#941)
		'test toggle style': function() {
			var editor = this.editor;

			this.editorBot.setHtmlWithSelection( CKEDITOR.document.getById( 'table' ).getValue() );

			var cell = editor.editable().findOne( 'td' );

			editor.getSelection().fake( cell );

			selectElement( editor, cell );

			editor.execCommand( 'bold' );

			assert.areEqual( 'strong', cell.getFirst().getName(), 'Cell should be bolded' );

			selectElement( editor, cell.findOne( 'strong' ) );

			editor.execCommand( 'bold' );

			assert.areEqual( CKEDITOR.NODE_TEXT, cell.getFirst().type, 'Cell should be unbolded' );
		}
	};

	bender.test( tests );

	function selectElement( editor, element ) {
		var range = editor.createRange();
		range.setStartAt( element, CKEDITOR.POSITION_AFTER_START );
		range.setEndAt( element, CKEDITOR.POSITION_BEFORE_END );
		range.select();
	}
} )();
