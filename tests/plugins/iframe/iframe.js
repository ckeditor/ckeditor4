/* bender-tags: editor */
/* bender-ckeditor-plugins: iframe,dialogadvtab,toolbar */

bender.editor = {
	config: {
		autoParagraph: false
	}
};

bender.test( {
	tearDown: function() {
		var dialog = CKEDITOR.dialog.getCurrent();

		if ( dialog ) {
			dialog.hide();
		}
	},

	'test create iframe': function() {
		var bot = this.editorBot;
		bot.dialog( 'iframe', function( dialog ) {
			dialog.setValueOf( 'info', 'src', 'http://ckeditor.com' );
			dialog.setValueOf( 'info', 'width', '100%' );
			dialog.setValueOf( 'info', 'height', '500' );
			dialog.setValueOf( 'advanced', 'advStyles', 'height:100px; width:100px;' );

			dialog.getButton( 'ok' ).click();

			assert.areEqual( '<iframe frameborder="0" height="500" scrolling="no" src="http://ckeditor.com" ' +
				'style="height:100px;width:100px;" width="100%"></iframe>', bot.getData( true ) );
		} );
	},

	'test update iframe': function() {
		var bot = this.editorBot, editor = this.editor;

		bot.setHtmlWithSelection( editor.dataProcessor.toHtml( '[<iframe frameborder="0" scrolling="no" src="http://ckeditor.com" width="100%"></iframe>]' ) );

		bot.dialog( 'iframe', function( dialog ) {
			assert.areSame( 'http://ckeditor.com', dialog.getValueOf( 'info', 'src' ) );
			assert.areSame( '100%', dialog.getValueOf( 'info', 'width' ) );

			dialog.setValueOf( 'info', 'src', 'http://cksource.com' );
			dialog.setValueOf( 'info', 'width', '400' );

			dialog.getButton( 'ok' ).click();

			assert.areEqual( '<iframe frameborder="0" scrolling="no" src="http://cksource.com" width="400"></iframe>', bot.getData( true ) );
		} );
	},

	// (#2423)
	'test dialog model during iframe creation': function() {
		var bot = this.editorBot,
			editor = this.editor;

		bot.setData( '', function() {
			bot.dialog( 'iframe', function( dialog ) {
				assert.isNull( dialog.getModel( editor ) );
				assert.areEqual( CKEDITOR.dialog.CREATION_MODE, dialog.getMode( editor ) );
			} );
		} );
	},

	// (#2423)
	'test dialog model with existing iframe': function() {
		var bot = this.editorBot,
			editor = this.editor,
			iframeHtml = '<iframe frameborder="0" scrolling="no" src="http://ckeditor.com" width="100%"></iframe>';

		bot.setData( iframeHtml, function() {
			bot.dialog( 'iframe', function( dialog ) {
				var iframe = editor.editable().findOne( '.cke_iframe' );

				editor.getSelection().selectElement( iframe );

				assert.areEqual( iframe, dialog.getModel( editor ) );
				assert.areEqual( CKEDITOR.dialog.EDITING_MODE, dialog.getMode( editor ) );
			} );
		} );
	}
} );
