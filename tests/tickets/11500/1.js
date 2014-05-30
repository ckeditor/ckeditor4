/* bender-tags: editor,unit */

( function() {
	'use strict';

	bender.test( {
		'async:init': function() {
			var that = this;
			bender.tools.setUpEditors( {
				inline1: {
					creator: 'inline',
					name: 'test_editorinline1'
				},
				inline2: {
					creator: 'inline',
					name: 'test_editorinline2'
				}
			}, function( editors, bots ) {
				that.bot1 = bots.inline1;
				that.bot2 = bots.inline2;
				that.callback();
			} );
		},

		'test selection and focus are not lost in editor A when setting data in editor B': function() {
			this.bot1.setHtmlWithSelection( '<p>foo[bar]bom</p>' );
			this.bot1.editor.focus();

			this.bot2.setData( '<p>x</p>', function() {
				var sel = this.bot1.editor.getSelection( true ); // Get real selection.
				assert.areSame( 'bar', sel.getSelectedText() );
				assert.isTrue( this.bot1.editor.editable().hasFocus );
			} );
		},

		'test selection and focus are not lost in editor A when setting data in editor B which had locked selection': function() {
			// Focus editor B so it locks the selection when blurred.
			this.bot2.setHtmlWithSelection( '<p>x[x]x</p>' );
			this.bot2.editor.focus();

			this.bot1.setHtmlWithSelection( '<p>foo[bar]bom</p>' );
			this.bot1.editor.focus();

			this.bot2.setData( '<p>x1</p>', function() {
				var sel = this.bot1.editor.getSelection( true ); // Get real selection.
				assert.areSame( 'bar', sel.getSelectedText(), 'selection after 1st setData' );
				assert.isTrue( this.bot1.editor.editable().hasFocus, 'focus after 1st setData' );

				// http://dev.ckeditor.com/ticket/11500#comment:10 - two set data needed.
				this.bot2.setData( '<p>x2</p>', function() {
					var sel = this.bot1.editor.getSelection( true ); // Get real selection.
					assert.areSame( 'bar', sel.getSelectedText(), 'selection after 2nd setData' );
					assert.isTrue( this.bot1.editor.editable().hasFocus, 'focus after 2nd setData' );
				} );
			} );
		}
	} );
} )();