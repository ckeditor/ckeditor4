/* exported richComboTools */

window.richComboTools = ( function() {
	return {
		/**
		 * Assertion function which apply style provided by the passed combo value and compare result.
		 *
		 * @param {Object} options configuration object
		 * @param {String} options.comboName name of {@link CKEDITOR.ui.richCombo} added by {@link CKEDITOR.ui.addRichCombo} to editor.
		 * @param {String} options.comboValue value selected from rich combo
		 * @param {Boolean} options.collapsed information if selection is collapsed. If it's true, then additional text is inserted to not remove empty span from some browsers.
		 * @param {Object} options.bot bot instance in current test case
		 * @param {String} options.resultHtml html which should be present after applying rich combo change
		 */
		assertCombo: function( options ) {
			var	bot = options.bot;

			bot.combo( options.comboName, function( combo ) {
				combo.onClick( options.comboValue );
				this.wait( function() {
					// The empty span from collapsed selection is lost on FF and IE8, insert something to prevent that.
					options.collapsed && bot.editor.insertText( 'bar' );
					assert.isInnerHtmlMatching( options.resultHtml, bot.editor.editable().getHtml(), null );
				}, 0 );
			} );
		}
	};
} )();
