/* bender-tags: editor,unit,autoparagraphing */

var doc = CKEDITOR.document;

// This group of tests plays upon the framed content.
bender.test( {
	// Initialize the editor instance.
	'async:init': function() {
		var tc = this;
		var editor = new CKEDITOR.editor();
		editor.on( 'loaded', function() {
			var innerDoc = doc.getById( 'editable_frame' ).getFrameDocument();
			var body = innerDoc.getBody();
			body.setAttribute( 'contentEditable', true );
			body.setHtml( '' );

			editor.editable( body );
			editor.mode = 'wysiwyg';

			editor.fire( 'contentDom' );
			tc.editor = editor;
			// Allow editor creation to complete.
			setTimeout( function() {
				tc.callback();
			}, 0 );
		} );
	},

	setupEditor: function( data, callback ) {
		var tc = this,
			editor = tc.editor;

		editor.setData( data, function() {
			CKEDITOR.document.getBody().focus();
			editor.focus();
			setTimeout( function() {
				tc.resume( callback );
			}, 200 );
		} );
		tc.wait();
	},

	// Test auto wrapping content that lives directly in body element with paragraph.
	testAutoParagraphing: function() {
		var editor = this.editor;

		this.setupEditor( '', function() {
			var start = editor.getSelection().getStartElement(),
					path = new CKEDITOR.dom.elementPath( start );

			assert.isTrue( path.block.is( 'p' ), 'auto fixing block-less body' );

			if ( CKEDITOR.env.gecko ) {
				var tail = path.block.getLast();
				assert.isTrue( tail.is( 'br' ), '[Firefox] check padding block br' );
			}
		} );
	}
} );