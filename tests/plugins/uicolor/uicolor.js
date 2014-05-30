/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: uicolor */

bender.editor = {};

bender.test(
{
	'test set ui color with yuiColorPicker': function() {
		var bot = this.editorBot;
		bot.dialog( 'uicolor', function( dialog ) {
			var yuiPicker = dialog._.contents.tab1.yuiColorPicker.picker;

			// Make it green.
			// http://developer.yahoo.com/yui/docs/YAHOO.widget.ColorPicker.html#method_setValue
			yuiPicker.setValue( [ 0, 255, 0 ] );

			assert.areEqual( '#00FF00', bot.editor.uiColor );
		} );
	}
} );