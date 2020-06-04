/* bender-tags: editor */
/* bender-ckeditor-plugins: link,toolbar */

( function() {
	'use strict';

	bender.editor = {
		creator: 'replace',
		config: {
			extraAllowedContent: 'strong',
			removePlugins: 'entities'
		}
	};

	bender.test( {
		'Create link followed by space inside bold text': function() {
			var bot = this.editorBot;

			bot.setHtmlWithSelection( '<p><strong>[test] </strong>text</p>' );

			bot.dialog( 'link', function( dialog ) {
				dialog.setValueOf( 'info', 'url', 'ckeditor.com' );
				dialog.getButton( 'ok' ).click();

				assert.areEqual( '<p><strong><a href="http://ckeditor.com">test</a> </strong>text</p>', bot.getData( true ) );
			} );
		}
	} );
} )();
