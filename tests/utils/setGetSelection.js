/* bender-tags: editor,unit,utils */

( function() {
	'use strict';

	bender.editor = true;

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
		},

		'test getSelection - element': function() {
			var editor = this.editor,
				htmlWithRange = '<p>[x]</p>';

			var selection = bender.tools.setSelection( editor, htmlWithRange );

			assert.isMatching( /<p>[\[\{]x[\]\}](<br>)?<\/p>/gi, bender.tools.getSelection( editor ), 'getSelection' );
			assert.isMatching( '<p>x(<br>)?</p>', editor.editable().getHtml(), 'editable innerHTML' );
		},

		'test getSelection - text': function() {
			var editor = this.editor,
				htmlWithRange = '<p>{x}</p>';

			var selection = bender.tools.setSelection( editor, htmlWithRange );

			assert.isMatching( /<p>[\[\{]x[\]\}](<br>)?<\/p>/gi, bender.tools.getSelection( editor ), 'getSelection' );
			assert.isMatching( '<p>x(<br>)?</p>', editor.editable().getHtml(), 'editable innerHTML' );
		},

		'test getSelection - multiple ranges': function() {
			var editor = this.editor,
				revert = bender.tools.replaceMethod( CKEDITOR.dom.selection.prototype, 'getRanges', function() {
					return [ 1, 2 ];
				} ),
				error;

			try {
				bender.tools.getSelection( editor );
			} catch( e ) {
				error = e;
			} finally {
				revert();
			}

			assert.isNotUndefined( error, 'Error is expected to be thrown' );
		}
	} );
} )();