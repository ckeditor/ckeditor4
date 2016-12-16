/* bender-tags: 4.6.1, tc, 11064, widgetselection */
/* bender-ckeditor-plugins: widgetselection */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {

		init: function() {
			this.widgetselection = CKEDITOR.plugins.widgetselection;
		},

		setUp: function() {
			if ( !CKEDITOR.env.webkit ) {
				assert.ignore();
			}
		},

		'test collapsed selection': function() {
			bender.tools.selection.setWithHtml( this.editor, '<p>This is{} text</p>' );
			assert.isFalse( this.widgetselection.isWholeContentSelected( this.editor.editable() ) );

			bender.tools.selection.setWithHtml( this.editor, '<p contenteditable="false">Non-editable</p><p>This is{} text</p>' );
			assert.isFalse( this.widgetselection.isWholeContentSelected( this.editor.editable() ), 'With non-editable.' );
		},

		'test ranged selection on the beginning': function() {
			bender.tools.selection.setWithHtml( this.editor, '[<p>This is] text</p>' );
			assert.isFalse( this.widgetselection.isWholeContentSelected( this.editor.editable() ) );

			bender.tools.selection.setWithHtml( this.editor, '[<p contenteditable="false">Non-editable</p><p>This is] text</p>' );
			assert.isFalse( this.widgetselection.isWholeContentSelected( this.editor.editable() ), 'With non-editable.' );
		},

		'test ranged selection on in the middle': function() {
			bender.tools.selection.setWithHtml( this.editor, '<p>Thi[s is t]ext</p>' );
			assert.isFalse( this.widgetselection.isWholeContentSelected( this.editor.editable() ) );

			bender.tools.selection.setWithHtml( this.editor, '<p contenteditable="false">Non-editable</p>[<p>This is] text</p>' );
			assert.isFalse( this.widgetselection.isWholeContentSelected( this.editor.editable() ), 'With non-editable.' );
		},

		'test ranged selection on the end': function() {
			bender.tools.selection.setWithHtml( this.editor, '<p>This [is text]</p>' );
			assert.isFalse( this.widgetselection.isWholeContentSelected( this.editor.editable() ) );

			bender.tools.selection.setWithHtml( this.editor, '<p contenteditable="false">Non-editable</p>[<p>This is text</p>]' );
			assert.isFalse( this.widgetselection.isWholeContentSelected( this.editor.editable() ), 'With non-editable.' );
		},

		'test whole selection 1': function() {
			bender.tools.selection.setWithHtml( this.editor, '<p>[This is text]</p>' );
			assert.isTrue( this.widgetselection.isWholeContentSelected( this.editor.editable() ) );
		},

		'test whole selection 2': function() {
			if ( CKEDITOR.env.safari ) {
				// Selection like [<p contenteditable="false">Non-editable</p><p>This is text</p>] is not achievable
				// in Safari programatically with use of ranges.
				assert.ignore();
			}

			bender.tools.selection.setWithHtml( this.editor, '[<p contenteditable="false">Non-editable</p><p>This is text</p>]' );
			assert.isTrue( this.widgetselection.isWholeContentSelected( this.editor.editable() ), 'With non-editable.' );
		}
	} );
} )();
