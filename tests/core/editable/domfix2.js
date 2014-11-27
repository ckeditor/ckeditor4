/* bender-tags: editor,unit,autoparagraphing */

var doc = CKEDITOR.document;

bender.test( {
	// Initialize the editor instance.
	'async:init': function() {
		var tc = this;
		var editor = new CKEDITOR.editor();
		editor.on( 'loaded', function() {
			editor.editable( doc.getById( 'editor' ) );
			editor.mode = 'wysiwyg';
			editor.fire( 'contentDom' );
			tc.editor = editor;
			// Allow editor creation to complete.
			setTimeout( function() {
				tc.callback();
			}, 0 );
		} );
	},

	// Test auto wrapping content that lives directly in body element with paragraph.
	testAutoParagraphing: function() {
		var editor = this.editor;
		editor.setData( '' );
		editor.focus();
		var path = editor.elementPath();
		assert.isTrue( path.block.is( 'p' ) );
		if ( CKEDITOR.env.gecko ) {
			var tail = path.block.getLast();
			assert.isTrue( tail.is( 'br' ) );
		}
	}
} );