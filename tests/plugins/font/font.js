/* bender-ckeditor-plugins: font,toolbar */

( function() {
	'use strict';

	bender.editor = true;

	var htmlMatchingOpts = {
		fixStyles: true
	};

	bender.test( {
		'test apply font size (collapsed cursor)': function() {
			var bot = this.editorBot,
				editor = this.editor;

			bot.combo( 'FontSize', function( combo ) {
				combo.onClick( 48 );
				editor.insertText( 'foo' );
				assert.isInnerHtmlMatching( '<p><span style="font-size:48px">foo</span>@</p>',
					editor.editable().getHtml(), htmlMatchingOpts );

				this.wait( function() {
					// Click again to exit the style.
					bot.combo( 'FontSize', function( combo ) {
						combo.onClick( 48 );
						this.wait( function() {
							editor.insertText( 'bar' );
							assert.isInnerHtmlMatching( '<p><span style="font-size:48px">foo</span>bar@</p>',
								editor.editable().getHtml(), htmlMatchingOpts );
						}, 0 );
					} );
				}, 0 );
			} );
		},

		'test apply font size (text range)': function() {
			var bot = this.editorBot;

			bender.tools.selection.setWithHtml( bot.editor, '<p>{foo}</p>' );
			bot.combo( 'FontSize', function( combo ) {
				combo.onClick( 48 );
				assert.isInnerHtmlMatching( '<p><span style="font-size:48px">foo</span>@</p>',
					bot.editor.editable().getHtml(), htmlMatchingOpts );
			} );
		}
	} );
} )();