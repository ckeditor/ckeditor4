/* bender-tags: editor */
/* bender-ckeditor-plugins: find,entities, */

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

var ENTER_KEY = 13;

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
	// https://dev.ckeditor.com/ticket/6957
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

	// https://dev.ckeditor.com/ticket/7028
	'test replace all': function() {
		var bot = this.editorBot;
		bot.setHtmlWithSelection( '<p>[foo]&nbsp;foo</p><p>foobaz</p>' );
		bot.dialog( 'replace', function( dialog ) {
			dialog.setValueOf( 'replace', 'txtReplace', 'bar' );
			dialog.getContentElement( 'replace', 'btnReplaceAll' ).click();
			dialog.getButton( 'cancel' ).click();

			assert.areSame( '<p>bar&nbsp;bar</p><p>barbaz</p>', bot.getData( false, true ) );
		} );
	},

	// https://dev.ckeditor.com/ticket/12848
	'test find in read-only mode': function() {
		var bot = this.editorBot;

		bot.setData( '<p>example text</p>', function() {
			bot.editor.setReadOnly( true );

			bot.dialog( 'find', function( dialog ) {
				dialog.setValueOf( 'find', 'txtFindFind', 'example' );
				dialog.getContentElement( 'find', 'btnFind' ).click();

				bot.editor.setReadOnly( false );

				assert.areSame( '<p><span title="highlight">example</span> text</p>', bot.getData( true ) );
				dialog.getButton( 'cancel' ).click();
			} );
		} );
	},

	// https://dev.ckeditor.com/ticket/11697
	'test find and replace with pattern change - replace text after selection': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '<p>example text <strong>example</strong> text</p>' );
		bot.dialog( 'replace', function( dialog ) {
			dialog.setValueOf( 'replace', 'txtFindReplace', 'example' );
			dialog.getContentElement( 'replace', 'btnFindReplace' ).click();
			dialog.setValueOf( 'replace', 'txtFindReplace', 'ext example' );
			dialog.getContentElement( 'replace', 'btnFindReplace' ).click();

			assert.areSame( '<p>example t<span title="highlight">ext </span><strong><span title="highlight">example</span></strong> text</p>',
				bot.getData( true ), 'Text after previous selection was correctly highlighted.' );

			dialog.setValueOf( 'replace', 'txtReplace', 'example2' );
			dialog.getContentElement( 'replace', 'btnFindReplace' ).click();
			assert.areSame( '<p>example t<span title="highlight">example2</span> text</p>', bot.getData( true ),
				'Highlighted text was correctly replaced.' );

			dialog.getButton( 'cancel' ).click();
		} );
	},

	// https://dev.ckeditor.com/ticket/11697
	'test find and replace with pattern change - replace text before selection': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '<p>Apollo 11 was the spaceflight that...</p>' );
		bot.dialog( 'replace', function( dialog ) {
			dialog.setValueOf( 'replace', 'txtFindReplace', 'was the' );
			dialog.getContentElement( 'replace', 'btnFindReplace' ).click();
			dialog.setValueOf( 'replace', 'txtFindReplace', 'Apollo 11 was the space' );
			dialog.getContentElement( 'replace', 'btnFindReplace' ).click();

			assert.areSame( '<p><span title="highlight">apollo 11 was the space</span>flight that...</p>',
				bot.getData( true ), 'Text before previous selection was correctly highlighted.' );

			dialog.setValueOf( 'replace', 'txtReplace', 'A ' );
			dialog.getContentElement( 'replace', 'btnFindReplace' ).click();
			assert.areSame( '<p><span title="highlight">a </span>flight that...</p>', bot.getData( true ),
				'Highlighted text was correctly replaced.' );

			dialog.getButton( 'cancel' ).click();
		} );
	},

	// https://dev.ckeditor.com/ticket/11697
	'test find and replace with options change': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '<p>example text</p>' );
		bot.dialog( 'replace', function( dialog ) {
			dialog.setValueOf( 'replace', 'txtFindReplace', 'EXAMPLE' );
			dialog.getContentElement( 'replace', 'btnFindReplace' ).click();
			dialog.setValueOf( 'replace', 'txtReplaceCaseChk', true );
			dialog.getContentElement( 'replace', 'btnFindReplace' ).click();

			assert.areSame( '<p>example text</p>', bot.getData( true ), 'Text was not replace with case sensitive find.' );

			dialog.getContentElement( 'replace', 'btnFindReplace' ).click();

			assert.areSame( '<p>example text</p>', bot.getData( true ), 'Text was not replace with case sensitive find.' );

			dialog.getButton( 'cancel' ).click();
		} );
	},

	// (#4987)
	'test find text with double space between words': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '<p>[example&nbsp; text]</p>' );

		bot.dialog( 'find', function( dialog ) {
			dialog.getContentElement( 'find', 'btnFind' ).click();

			assert.areSame( '<p><span title="highlight">example&nbsp; text</span></p>', bot.getData( true ) );
			dialog.getButton( 'cancel' ).click();
		} );
	},

	// (#4987)
	'test find text with double &nbsp; between words': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '<p>example&nbsp;&nbsp;text</p>' );

		bot.dialog( 'find', function( dialog ) {
			dialog.setValueOf( 'find', 'txtFindFind', 'example  text' );
			dialog.getContentElement( 'find', 'btnFind' ).click();


			assert.areSame( '<p><span title="highlight">example&nbsp;&nbsp;text</span></p>', bot.getData( true ) );
			dialog.getButton( 'cancel' ).click();
		} );
	},

	// (#4987)
	'test find text with double space between words in read-only mode': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '<p>example&nbsp; text</p>' );
		bot.editor.setReadOnly( true );

		bot.dialog( 'find', function( dialog ) {
			dialog.setValueOf( 'find', 'txtFindFind', 'example  text' );
			dialog.getContentElement( 'find', 'btnFind' ).click();

			bot.editor.setReadOnly( false );

			assert.areSame( '<p><span title="highlight">example&nbsp; text</span></p>', bot.getData( true ) );
			dialog.getButton( 'cancel' ).click();
		} );
	},

	// (#4987)
	'test find word when pattern starting with empty space': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '<p>example&nbsp;[&nbsp;text]</p>' );

		bot.dialog( 'find', function( dialog ) {
			dialog.getContentElement( 'find', 'btnFind' ).click();

			assert.areSame( '<p>example&nbsp;<span title="highlight">&nbsp;text</span></p>', bot.getData( true ) );
			dialog.getButton( 'cancel' ).click();
		} );
	},

	// (#4987)
	'test find text without spaces between words should thrown alert with proper message': function() {
		var bot = this.editorBot,
			spy = sinon.stub( window, 'alert' );

		bot.setHtmlWithSelection( '<p>exampletext</p>' );

		bot.dialog( 'find', function( dialog ) {
			dialog.setValueOf( 'find', 'txtFindFind', 'example  text' );
			dialog.getContentElement( 'find', 'btnFind' ).click();

			assert.isTrue( spy.calledOnce, 'Find text without spaces between words should thrown alert' );
			assert.areEqual( spy.args[ 0 ][ 0 ], this.editorBot.editor.lang.find.notFoundMsg,
				'Find text without spaces between words should have proper alert message' );

			dialog.getButton( 'cancel' ).click();
		} );
	},

	// (#4987)
	'test find and replace text with double space between words': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '<p>[example&nbsp; text] from CKEditor4</p>' );

		bot.dialog( 'replace', function( dialog ) {
			dialog.setValueOf( 'replace', 'txtReplace', 'changed example text' );
			dialog.getContentElement( 'replace', 'btnFindReplace' ).click();
			dialog.getContentElement( 'replace', 'btnFindReplace' ).click();

			assert.areSame( '<p><span title="highlight">changed example text</span> from ckeditor4</p>', bot.getData( true ) );

			dialog.getButton( 'cancel' ).click();
		} );
	},

	// (#4987)
	'test replace all text with double spaces between words': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '<p>[example&nbsp; text]</p><p>example&nbsp; text</p>' );

		bot.dialog( 'replace', function( dialog ) {
			dialog.setValueOf( 'replace', 'txtReplace', 'replaced text' );
			dialog.getContentElement( 'replace', 'btnReplaceAll' ).click();
			dialog.getButton( 'cancel' ).click();

			assert.areSame( '<p>replaced text</p><p>replaced text</p>', bot.getData( false, true ) );

			dialog.getButton( 'cancel' ).click();
		} );
	},

	// (#5061)
	'test replace one of the occurrences of the phrase with a phrase with several spaces inside': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '<p>replace me</p>' );

		bot.dialog( 'replace', function( dialog ) {
			dialog.setValueOf( 'replace', 'txtFindReplace', 'replace me' );
			dialog.setValueOf( 'replace', 'txtReplace', 'foo   bar' );
			dialog.getContentElement( 'replace', 'btnFindReplace' ).click();
			dialog.getContentElement( 'replace', 'btnFindReplace' ).click();
			dialog.getButton( 'cancel' ).click();

			assert.areSame( '<p>foo&nbsp; &nbsp;bar</p>', bot.getData() );
		} );
	},

	// (#5061)
	'test replace all the occurrences of the phrase with a phrase with several spaces inside': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '<p>[replace me]</p><p>replace me</p>' );

		bot.dialog( 'replace', function( dialog ) {
			dialog.setValueOf( 'replace', 'txtReplace', 'foo   bar' );
			dialog.getContentElement( 'replace', 'btnReplaceAll' ).click();
			dialog.getButton( 'cancel' ).click();

			assert.areSame( '<p>foo&nbsp; &nbsp;bar</p><p>foo&nbsp; &nbsp;bar</p>', bot.getData() );
		} );
	},

	// (#4987)
	'test space separator: SPACE': function() {
		var bot = this.editorBot,
			expected = '<p>test<span title="highlight">&nbsp; </span>test</p>';

		bot.setHtmlWithSelection( '<p>test&nbsp; test</p>' );

		bot.dialog( 'find', function( dialog ) {
			dialog.setValueOf( 'find', 'txtFindFind', '  ' );
			dialog.getContentElement( 'find', 'btnFind' ).click();

			assert.areSame( expected, bot.getData( true ), 'Word separator SPACE is incorrect' );
			dialog.getButton( 'cancel' ).click();
		} );
	},

	// (#4987)
	'test space separator: OGHAM SPACE MARK': function() {
		assertSpaceSeparator( this.editorBot, '\u1680', 'OGHAM SPACE MARK' );
	},

	// (#4987)
	'test space separator: EN QUAD': function() {
		assertSpaceSeparator( this.editorBot, '\u2000', 'EN QUAD' );
	},

	// (#4987)
	'test space separator: EM QUAD': function() {
		assertSpaceSeparator( this.editorBot, '\u2001', 'EM QUAD' );
	},

	// (#4987)
	'test space separator: EN SPACE': function() {
		assertSpaceSeparator( this.editorBot, '\u2002', 'EN SPACE', '&ensp;' );
	},

	// (#4987)
	'test space separator: EM SPACE': function() {
		assertSpaceSeparator( this.editorBot, '\u2003', 'EM SPACE', '&emsp;' );
	},

	// (#4987)
	'test space separator: THREE-PER-EM SPACE': function() {
		assertSpaceSeparator( this.editorBot, '\u2004', 'THREE-PER-EM SPACE' );
	},

	// (#4987)
	'test space separator: FOUR-PER-EM SPACE': function() {
		assertSpaceSeparator( this.editorBot, '\u2005', 'FOUR-PER-EM SPACE' );
	},

	// (#4987)
	'test space separator: SIX-PER-EM SPACE': function() {
		assertSpaceSeparator( this.editorBot, '\u2006', 'SIX-PER-EM SPACE' );
	},

	// (#4987)
	'test space separator: FIGURE SPACE': function() {
		assertSpaceSeparator( this.editorBot, '\u2007', 'FIGURE SPACE' );
	},

	// (#4987)
	'test space separator: PUNCTUATION SPACE': function() {
		assertSpaceSeparator( this.editorBot, '\u2008', 'PUNCTUATION SPACE' );
	},

	// (#4987)
	'test space separator: THIN SPACE': function() {
		assertSpaceSeparator( this.editorBot, '\u2009', 'THIN SPACE', '&thinsp;' );
	},

	// (#4987)
	'test space separator: HAIR SPACE': function() {
		assertSpaceSeparator( this.editorBot, '\u200A', 'HAIR SPACE' );
	},

	// (#4987)
	'test space separator: NARROW NO-BREAK SPACE': function() {
		assertSpaceSeparator( this.editorBot, '\u202F', 'NARROW NO-BREAK SPACE' );
	},

	// (#4987)
	'test space separator: IDEOGRAPHIC SPACE': function() {
		assertSpaceSeparator( this.editorBot, '\u3000', 'IDEOGRAPHIC SPACE' );
	},

	// (#5022)
	'test find dialog with searching pattern by using Enter key': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '<p>test</p>' );
		bot.dialog( 'find', function( dialog ) {
			dialog.setValueOf( 'find', 'txtFindFind', 'test' );

			dialog.getContentElement( 'find', 'txtFindFind' )
				.getInputElement()
				.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: ENTER_KEY } ) );

			assert.areSame( '<p><span title="highlight">test</span></p>', bot.getData( true ) );
			dialog.getButton( 'cancel' ).click();
		} );
	},

	// (#5022)
	'test replace dialog with searching pattern by using Enter key': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '<p>test</p>' );
		bot.dialog( 'replace', function( dialog ) {
			dialog.setValueOf( 'replace', 'txtFindReplace', 'test' );

			dialog.getContentElement( 'replace', 'txtFindReplace' )
				.getInputElement()
				.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: ENTER_KEY } ) );

			assert.areSame( '<p><span title="highlight">test</span></p>', bot.getData( true ) );
			dialog.getButton( 'cancel' ).click();
		} );
	},

	// (#5022)
	'test replace dialog with replacing pattern by using Enter key': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '<p>test</p>' );

		bot.dialog( 'replace', function( dialog ) {
			dialog.setValueOf( 'replace', 'txtFindReplace', 'test' );
			dialog.setValueOf( 'replace', 'txtReplace', 'replaced' );

			var txtReplaceInput = dialog.getContentElement( 'replace', 'txtReplace' ).getInputElement();

			txtReplaceInput.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: ENTER_KEY } ) );
			txtReplaceInput.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: ENTER_KEY } ) );

			dialog.getButton( 'cancel' ).click();
			assert.areSame( '<p>replaced</p>', bot.getData() );
		} );
	}
} );

function assertSpaceSeparator( bot, unicode, name, expectedHtmlEntities ) {
	// In some cases editor return html entities instead of empty space expressed as ' '. #5055
	var spaceCharacter = expectedHtmlEntities || unicode,
		expected = '<p>test<span title="highlight">' + spaceCharacter + ' </span>test</p>';

	bot.setHtmlWithSelection( '<p>test[' + unicode + ' ]test</p>' );

	bot.dialog( 'find', function( dialog ) {
		dialog.getContentElement( 'find', 'btnFind' ).click();

		assert.areSame( expected, bot.getData( true ), 'Word separator ' + name + ' is incorrect' );
		dialog.getButton( 'cancel' ).click();
	} );
}
