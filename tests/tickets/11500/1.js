/* bender-tags: editor */

( function() {
	'use strict';

	bender.editors = {
		inline1: {
			creator: 'inline',
			name: 'test_editorinline1'
		},
		inline2: {
			creator: 'inline',
			name: 'test_editorinline2'
		}
	};

	bender.test( {
		'test selection and focus are not lost in editor A when setting data in editor B': function() {
			var bots = this.editorBots;

			bots.inline1.setHtmlWithSelection( '<p>foo[bar]bom</p>' );
			bots.inline1.editor.focus();

			bots.inline2.setData( '<p>x</p>', function() {
				var sel = bots.inline1.editor.getSelection( true ); // Get real selection.
				assert.areSame( 'bar', sel.getSelectedText() );
				assert.isTrue( bots.inline1.editor.editable().hasFocus );
			} );
		},

		'test selection and focus are not lost in editor A when setting data in editor B which had locked selection': function() {
			var bots = this.editorBots;

			// Focus editor B so it locks the selection when blurred.
			bots.inline2.setHtmlWithSelection( '<p>x[x]x</p>' );
			bots.inline2.editor.focus();

			bots.inline1.setHtmlWithSelection( '<p>foo[bar]bom</p>' );
			bots.inline1.editor.focus();

			bots.inline2.setData( '<p>x1</p>', function() {
				var sel = bots.inline1.editor.getSelection( true ); // Get real selection.
				assert.areSame( 'bar', sel.getSelectedText(), 'selection after 1st setData' );
				assert.isTrue( bots.inline1.editor.editable().hasFocus, 'focus after 1st setData' );

				// https://dev.ckeditor.com/ticket/11500#comment:10 - two set data needed.
				bots.inline2.setData( '<p>x2</p>', function() {
					var sel = bots.inline1.editor.getSelection( true ); // Get real selection.
					assert.areSame( 'bar', sel.getSelectedText(), 'selection after 2nd setData' );
					assert.isTrue( bots.inline1.editor.editable().hasFocus, 'focus after 2nd setData' );
				} );
			} );
		}
	} );
} )();
