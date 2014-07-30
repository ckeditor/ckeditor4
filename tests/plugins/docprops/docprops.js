/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: wysiwygarea,sourcearea,dialog,toolbar,docprops */

bender.editor = { config: { fullPage: 1 } };

var title1 = 'Document title',
	title2 = 'Another document title',
	template = new CKEDITOR.template( '<html><head><title>{title}</title></head><body></body></html>' );

bender.test( {
	'test set page title with dialog': function() {
		var bot = this.editorBot,
			tc = this,
			editor = this.editor;

		bot.dialog( 'docProps', function( dialog ) {
			dialog.setValueOf( 'general', 'title', title1 );
			dialog.getButton( 'ok' ).click();

			tc.wait( function() {
				var title = editor.document.getElementsByTag( 'title' ).getItem( 0 );
				assert.areEqual( title1, title.data( 'cke-title' ), 'Title cke-data attribute has been set.' );
				assert.areEqual( template.output( { title: title1 } ), editor.getData(), 'Page title is set in editor data.' );
			}, 0 );
		} );
	},

	'test read page title into dialog': function() {
		var bot = this.editorBot,
			tc = this,
			editor = this.editor;

		editor.setData( template.output( { title: title2 } ), function() {
			tc.resume( function() {
				bot.dialog( 'docProps', function( dialog ) {
					assert.areSame( title2, dialog.getValueOf( 'general', 'title', 'Page title has been loaded into dialog.' ) );
				} );
			} );
		} );

		tc.wait();
	}
} );