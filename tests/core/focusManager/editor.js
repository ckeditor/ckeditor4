/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: floatingspace,toolbar,about,format */

CKEDITOR.focusManager._.blurDelay = 0;

bender.editor =
{
	startupData : 'foo'
};

bender.test(
{
	assertFocus: function( truly ) {

		var ed = this.editor,
			fm = this.editor.focusManager;

		assert[ truly === false ? 'isFalse' : 'isTrue' ]( fm.hasFocus, 'check focusManager.hasFocus' );
		assert[ truly === false ? 'isFalse' : 'isTrue' ]( ed.container.hasClass( 'cke_focus' ), ' editor container receives focused class name.' );
	},

	'test editor focus - editable focused' : function() {
		var ed = this.editor, bot = this.editorBot;
		bot.focus( function() {
			this.assertFocus();
		} );
	},

	'test editor blur - focus move out of editor' : function() {
		var tc = this;
		var outer = CKEDITOR.document.getById( 'focusable' );
		bender.tools.focus( outer, function() {
			tc.assertFocus( false );
		} );
	},

	'test editor focus - combo opened' : function() {
		var ed = this.editor, bot = this.editorBot;
		bot.combo( 'Format', function( combo ) {
			this.assertFocus();
			combo._.panel.hide();
		} );
	},

	'test editor focus - dialog opened' : function() {
		var ed = this.editor, bot = this.editorBot;
		bot.dialog( 'about', function( dialog ) {
			this.assertFocus();
			dialog.hide();
		} );
	},

	'test editor focus - toolbar focused': function() {
		var ed = this.editor, bot = this.editorBot;
		bot.execCommand( 'toolbarFocus' );
		this.assertFocus();
	}

} );