/* exported fontTools */

window.fontTools = ( function() {
	return {
		/**
		 * Assertion function which uses {@link bender.editorBot.combo}.
		 *
		 * @param {Object} options configuration object
		 * @param {String} options.comboName name of {@link CKEDITOR.ui.richCombo} added by {@link CKEDITOR.ui.addRichCombo} to editor.
		 * @param {String} options.comboValue value selected from rich combo
		 * @param {Boolean} options.collapsed information if selection is collapsed. If it's true, then additional text is inserted to not remove empty span from some browsers.
		 * @param {Object} options.bot bot instance in current test case
		 * @param {String} options.resultHtml html which should be present after applying rich combo change
		 * @param {Function} options.callback function run after assertion.
		 * @param {Object} options.callback.bot bot instance passed as argument to callback function.
		 */
		assertCombo: function( options ) {
			var comboName = options.comboName,
				comboValue = options.comboValue,
				collapsed = options.collapsed,
				bot = options.bot,
				resultHtml = options.resultHtml,
				htmlMatchingOpts = options.htmlMatchingOpts,
				callback = options.callback;

			bot.combo( comboName, function( combo ) {
				combo.onClick( comboValue );

				this.wait( function() {
					// The empty span from collapsed selection is lost on FF and IE8, insert something to prevent that.
					collapsed && bot.editor.insertText( 'bar' );
					assert.isInnerHtmlMatching( resultHtml, bot.editor.editable().getHtml(), htmlMatchingOpts );
					callback && callback( bot );
				}, 0 );
			} );
		}
	};
} )();
