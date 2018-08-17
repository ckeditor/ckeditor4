/* bender-tags: editor */
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
	}
} );
