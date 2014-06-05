/* bender-tags: editor,unit,utils */

( function() {
	'use strict';

	bender.editor = true;

	function assertRange( range, startContainer, startOffset, endContainer, endOffset ) {
		assert.isTrue( range.startContainer.equals( startContainer ), 'startContainer' );
		assert.isTrue( range.endContainer.equals( endContainer ), 'endContainer' );
		assert.areSame( startOffset, range.startOffset, 'startOffset' );
		assert.areSame( endOffset, range.endOffset, 'endOffset' );
	}

	bender.test( {
		'test setSelection - element': function() {
			var editor = this.editor,
				editable = editor.editable(),
				selectionChangeCalled = 0;

			var listener = editor.on( 'selectionChange', function() {
				++selectionChangeCalled;
			} );

			var selection = bender.tools.setSelection( editor, '<p>[x]</p>' );

			listener.removeListener();

			assert.areSame( 1, selectionChangeCalled, 'selectionChange called' );
			assert.isTrue( selection instanceof CKEDITOR.dom.selection, 'CKEDITOR.dom.selection' );
			assert.areSame( '<p>x</p>', editor.getData(), 'editor data' );

			assertRange( selection.getRanges()[ 0 ], editable.getChild( [ 0 ] ), 0, editable.getChild( [ 0 ] ), 1 );
		},

		'test setSelection - text': function() {
			var editor = this.editor,
				editable = editor.editable(),
				selectionChangeCalled = 0;

			var listener = editor.on( 'selectionChange', function() {
				++selectionChangeCalled;
			} );

			var selection = bender.tools.setSelection( editor, '<p>{x}</p>' );

			listener.removeListener();

			assert.areSame( 1, selectionChangeCalled, 'selectionChange called' );
			assert.isTrue( selection instanceof CKEDITOR.dom.selection, 'CKEDITOR.dom.selection' );
			assert.areSame( '<p>x</p>', editor.getData(), 'editor data' );

			assertRange( selection.getRanges()[ 0 ], editable.getChild( [ 0, 0 ] ), 0, editable.getChild( [ 0, 0 ] ), 1 );
		},

		'test getSelection - element': function() {
			var editor = this.editor,
				htmlWithRange = '<p>[x]</p>';

			var selection = bender.tools.setSelection( editor, htmlWithRange );

			assert.isMatching( /<p>\[x\](<br>)?<\/p>/gi, bender.tools.getSelection( editor ), 'getSelection' );
			assert.isMatching( '<p>x(<br>)?</p>', editor.editable().getHtml(), 'editable innerHTML' );
		},

		'test getSelection - text': function() {
			var editor = this.editor,
				htmlWithRange = '<p>{x}</p>';

			var selection = bender.tools.setSelection( editor, htmlWithRange );

			assert.isMatching( /<p>\{x\}(<br>)?<\/p>/gi, bender.tools.getSelection( editor ), 'getSelection' );
			assert.isMatching( '<p>x(<br>)?</p>', editor.editable().getHtml(), 'editable innerHTML' );
		}
	} );
} )();