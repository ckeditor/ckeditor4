/* exported assertCombo */

function assertCombo( comboName, comboValue, collapsed, bot, resultHtml, callback ) {
	bot.combo( comboName, function( combo ) {
		combo.onClick( comboValue );

		this.wait( function() {
			// The empty span from collapsed selection is lost on FF and IE8, insert something to prevent that.
			collapsed && bot.editor.insertText( 'bar' );
			assert.beautified.html( resultHtml, bot.editor.getData() );
			callback && callback( bot );
		}, 0 );
	} );
}
