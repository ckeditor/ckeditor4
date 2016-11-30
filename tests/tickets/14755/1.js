/* bender-tags: 14755 */
/* bender-ckeditor-plugins: toolbar,list,table */

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: true
		}
	};

	bender.test( {
		'test regular case': function() {
			this.editorBot.setHtmlWithSelection( '<ol><li>[aaaaaaaaaaaaaaaa</li><li>&nbsp;]</li></ol>' );

			this.editorBot.dialog( 'table', function( dialog ) {
				assert.isTrue( true );
				dialog.getButton( 'ok' ).click();
			} );
		},

		'test bug case': function() {
			this.editorBot.setHtmlWithSelection( '<ol><li>[aaaaaaaaaaaaaaaa</li><li class="bbbbbbbbbbbbb">&nbsp;]</li></ol>' );

			this.editorBot.dialog( 'table', function( dialog ) {
				assert.isTrue( true );
				dialog.getButton( 'ok' ).click();
			} );
		}
	} );
} )();
