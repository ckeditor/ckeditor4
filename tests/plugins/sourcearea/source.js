/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: sourcearea */

	CKEDITOR.disableAutoInline = true;
	var doc = CKEDITOR.document,
		tools = bender.tools;

	bender.editor = { creator: 'replace', config: { startupMode: 'source' } };

	// This group of tests plays upon the source area editable.
	bender.test(
	{
		// Test all editable APIs.
		testFocus : function() {
			var editor = this.editor;
			var editable = editor.editable();

			assert.isTrue( editable.hasClass( 'cke_editable' ) );

			editor.focus();
			assert.isTrue( this.editor.focusManager.hasFocus );

			doc.getById( 'text_input' ).focus();
			// Focus manager blurring is asynchronous.
			this.wait( function() { assert.isFalse( editor.focusManager.hasFocus ); }, 200 );
		},

		testData : function() {
			var editor = this.editor;
			editor.setData( '<p>foo</p>' );
			assert.areSame( '<p>foo</p>', tools.compatHtml( editor.editable().getValue() ), 'set data' );
			assert.areSame( '<p>foo</p>', tools.compatHtml( editor.getData() ), 'retrieve data' );
		},

		testDetach: function() {
			var editable = this.editor.editable();
			this.editor.editable( null );
			assert.isFalse( editable.hasClass( 'cke_editable' ) );
		}
} );