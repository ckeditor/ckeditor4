/* bender-tags: editor,utils */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		'test setSelection - none': function() {
			var editor = this.editor,
				selectionChangeCalled = 0;

			var listener = editor.on( 'selectionChange', function() {
				++selectionChangeCalled;
			} );

			var selection = bender.tools.selection.setWithHtml( editor, '<p>x</p>' );

			listener.removeListener();

			assert.areSame( 0, selectionChangeCalled, 'selectionChange called' );
			assert.isTrue( selection instanceof CKEDITOR.dom.selection, 'CKEDITOR.dom.selection' );
			assert.areSame( '<p>x</p>', editor.getData(), 'editor data' );
		},

		'test setSelection - element': function() {
			var editor = this.editor,
				selectionChangeCalled = 0;

			var listener = editor.on( 'selectionChange', function() {
				++selectionChangeCalled;
			} );

			var selection = bender.tools.selection.setWithHtml( editor, '<p>[x]</p>' );

			listener.removeListener();

			assert.areSame( 1, selectionChangeCalled, 'selectionChange called' );
			assert.isTrue( selection instanceof CKEDITOR.dom.selection, 'CKEDITOR.dom.selection' );
			assert.areSame( '<p>x</p>', editor.getData(), 'editor data' );
		},

		'test setSelection - text': function() {
			var editor = this.editor,
				selectionChangeCalled = 0;

			var listener = editor.on( 'selectionChange', function() {
				++selectionChangeCalled;
			} );

			var selection = bender.tools.selection.setWithHtml( editor, '<p>{x}</p>' );

			listener.removeListener();

			assert.areSame( 1, selectionChangeCalled, 'selectionChange called' );
			assert.isTrue( selection instanceof CKEDITOR.dom.selection, 'CKEDITOR.dom.selection' );
			assert.areSame( '<p>x</p>', editor.getData(), 'editor data' );
		},

		'test setSelection - selectionChange is always fired': function() {
			var editor = this.editor,
				bot = this.editorBot,
				selectionChangeCalled = 0;

			bot.setData( '<p>x</p>', function() {
				var listener = editor.on( 'selectionChange', function() {
					++selectionChangeCalled;
				} );

				// Focus editor what may make browser preparing initial selection
				// after we set editable's HTML. That selection may be placed in
				// exactly the same location, so selectionChange would not be fired.
				editor.focus();

				selectionChangeCalled = 0;

				bender.tools.selection.setWithHtml( editor, '<p>[]x</p>' );
				assert.areSame( 1, selectionChangeCalled, 'selectionChange called #1a' );

				bender.tools.selection.setWithHtml( editor, '<p>[]x</p>' );
				assert.areSame( 2, selectionChangeCalled, 'selectionChange called #1b' );

				selectionChangeCalled = 0;

				bender.tools.selection.setWithHtml( editor, '<p>{}x</p>' );
				assert.areSame( 1, selectionChangeCalled, 'selectionChange called #2a' );

				bender.tools.selection.setWithHtml( editor, '<p>{}x</p>' );
				assert.areSame( 2, selectionChangeCalled, 'selectionChange called #2b' );

				selectionChangeCalled = 0;

				bender.tools.selection.setWithHtml( editor, '<p>[x]</p>' );
				assert.areSame( 1, selectionChangeCalled, 'selectionChange called #3a' );

				bender.tools.selection.setWithHtml( editor, '<p>[x]</p>' );
				assert.areSame( 2, selectionChangeCalled, 'selectionChange called #3b' );

				listener.removeListener();
			} );
		},

		// https://dev.ckeditor.com/ticket/12690
		'test setSelection - in empty inline element': function() {
			var editor = this.editor;

			bender.tools.selection.setWithHtml( editor, '<p>x<span style="font-size:48px"><strong>[]</strong></span>x</p>' );

			var sel = editor.getSelection();
			assert.areSame( 'strong', sel.getStartElement().getName() );
		},

		'test getSelection - element': function() {
			var editor = this.editor,
				htmlWithRange = '<p>[x]</p>';

			bender.tools.selection.setWithHtml( editor, htmlWithRange );

			assert.isMatching( /<p>[\[\{]x[\]\}](<br>)?<\/p>/gi, bender.tools.selection.getWithHtml( editor ), 'getSelection' );
			assert.isMatching( '<p>x(<br>)?</p>', bender.tools.fixHtml( editor.editable().getHtml(), 1, 1 ), 'editable innerHTML' );
		},

		'test getSelection - text': function() {
			var editor = this.editor,
				htmlWithRange = '<p>{x}</p>';

			bender.tools.selection.setWithHtml( editor, htmlWithRange );

			assert.isMatching( /<p>[\[\{]x[\]\}](<br>)?<\/p>/gi, bender.tools.selection.getWithHtml( editor ), 'getSelection' );
			assert.isMatching( '<p>x(<br>)?</p>', bender.tools.fixHtml( editor.editable().getHtml(), 1, 1 ), 'editable innerHTML' );
		},

		'test getSelection - multiple ranges': function() {
			var editor = this.editor,
				revert = bender.tools.replaceMethod( CKEDITOR.dom.selection.prototype, 'getRanges', function() {
					return [ 1, 2 ];
				} ),
				error;

			try {
				bender.tools.selection.getWithHtml( editor );
			} catch ( e ) {
				error = e;
			} finally {
				revert();
			}

			assert.isNotUndefined( error, 'Error is expected to be thrown' );
		}
	} );
} )();
