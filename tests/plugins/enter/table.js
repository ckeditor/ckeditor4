/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: enterkey,entities,table,toolbar */

bender.editor = true;
bender.test(
{
	setUp : function() {
		this.mode = this.editor.config.enterMode;
	},

	enterKey : function( html ) {
		var bot = this.editorBot;
		bot.setHtmlWithSelection( html );
		bot.execCommand( 'enter' );
		return bot.getData( false, true ).replace( /<p>&nbsp;<\/p>$/, '' );
	},

	'test enter key inside of table cell': function() {
		if ( this.mode == CKEDITOR.ENTER_P ) {
			// Block established in block-less table cells.
			assert.areSame( '<table><tbody><tr><td><p>foo</p><p>&nbsp;</p></td></tr></tbody></table>', this.enterKey( '<table><tr><td>foo^</td></tr></table>' ) );
			assert.areSame( '<table><tbody><tr><td><p>&nbsp;</p><p>foo</p></td></tr></tbody></table>', this.enterKey( '<table><tr><td>^foo</td></tr></table>' ) );
		}
		if ( this.mode == CKEDITOR.ENTER_BR ) {
			assert.areSame( '<table><tbody><tr><td>foo<br />&nbsp;</td></tr></tbody></table>', this.enterKey( '<table><tr><td>foo^</td></tr></table>' ) );
			assert.areSame( '<table><tbody><tr><td><br />foo</td></tr></tbody></table>', this.enterKey( '<table><tr><td>^foo</td></tr></table>' ) );
		}

		// BR break inside of caption.
		assert.areSame( '<table><caption><p>foo</p><p>bar</p></caption><tbody><tr><td>bar</td></tr></tbody></table>',
						this.enterKey( '<table><caption>foo^bar</caption><tr><td>bar</td></tr></table>' ) );
	}

} );