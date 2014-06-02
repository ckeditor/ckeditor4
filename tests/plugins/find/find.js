/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: find */

bender.editor = {
	config: {
		find_highlight: {
			element: 'span',
			attributes: {
				title: 'highlight'
			}
		},
		allowedContent: true
	}
};

window.alert = function() {};

bender.test( {
	'test find and replace': function() {
		var bot = this.editorBot;
		bot.setHtmlWithSelection( '<p>foo</p><p>[bar]</p>' );
		bot.dialog( 'find', function( dialog ) {
			assert.areSame( 'bar', dialog.getValueOf( 'find', 'txtFindFind' ) );

			dialog.getContentElement( 'find', 'btnFind' ).click();

			assert.areSame( '<p>foo</p><p><span title="highlight">bar</span></p>', bot.getData( true ) );

			dialog.selectPage( 'replace' );

			dialog.setValueOf( 'replace', 'txtReplace', 'baz' );
			dialog.getContentElement( 'replace', 'btnFindReplace' ).click();
			dialog.getButton( 'cancel' ).click();

			assert.areEqual( '<p>foo</p><p>baz</p>', bot.getData( false, true ) );

		} );
	},
	// #6957
	'test find highlight for read-only text': function() {
		var bot = this.editorBot;
		bot.setHtmlWithSelection( '<p>[foo]</p><p contenteditable="false">bar</p>' );
		bot.dialog( 'find', function( dialog ) {
			dialog.setValueOf( 'find', 'txtFindFind', 'bar' );
			dialog.getContentElement( 'find', 'btnFind' ).click();

			assert.areSame( '<p>foo</p><p contenteditable="false"><span title="highlight">bar</span></p>', bot.getData( true ) );
			dialog.getButton( 'cancel' ).click();
		} );
	},

	// #7028
	'test replace all': function() {
		var bot = this.editorBot;
		bot.setHtmlWithSelection( '<p>[foo]&nbsp;foo</p><p>foobaz</p>' );
		bot.dialog( 'replace', function( dialog ) {
			dialog.setValueOf( 'replace', 'txtReplace', 'bar' );
			dialog.getContentElement( 'replace', 'btnReplaceAll' ).click();
			dialog.getButton( 'cancel' ).click();

			assert.areSame( '<p>bar&nbsp;bar</p><p>barbaz</p>', bot.getData( false, true ) );
		} );
	}
} );