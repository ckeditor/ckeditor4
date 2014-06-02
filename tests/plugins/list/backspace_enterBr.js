/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: list,toolbar */

bender.editor = { config : { enterMode : CKEDITOR.ENTER_BR, extraAllowedContent: 'p' } };

var BACKSPACE = 8,
	DEL = 46;

// #8248
bender.test(
{
	assertBackspace : function( name, key ) {
		var bot = this.editorBot;
		bender.tools.testInputOut( name, function( source, expected ) {
			bot.setHtmlWithSelection( source );
			bender.Y.Event.simulate( bot.editor.editable().$, 'keydown', { keyCode : key } );
			assert.areSame( bender.tools.compatHtml( expected ), bot.getData( true ) );
		} );
	},

	'test backspace key after secondary list' : function() {
		this.assertBackspace( 'list1', BACKSPACE );
		this.assertBackspace( 'list2', BACKSPACE );
	},
	'test del key at the end of secondary list item' : function() {
		this.assertBackspace( 'list1_del', DEL );
		this.assertBackspace( 'list2_del', DEL );
	},

	'test del join with next list item': function() {
		this.assertBackspace( 'merge_next_list', DEL );
	}
} );