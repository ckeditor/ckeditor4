/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: entities,enterkey */

bender.editor = {
	config: {
		enterMode: CKEDITOR.ENTER_P,
		allowedContent: true
	}
};

bender.test(
{
	// #7912
	'test enterkey after invisible element': function() {
		// IE restrain making selection in invisible element.
		if ( CKEDITOR.env.ie )
			assert.ignore();

		var bot = this.editorBot;
		bot.setHtmlWithSelection( '<p>foo<span style="display:none;">bar^</span></p>' );
		bot.execCommand( 'enter' );
		this.editor.insertText( 'baz' );

		var output = bender.tools.getHtmlWithSelection( bot.editor );
		output = bot.editor.dataProcessor.toDataFormat( output );

		var expected =
				CKEDITOR.env.safari ?
					'<p>foo</p><p>baz^<span style="display:none;">bar</span></p>' :
					'<p>foo<span style="display:none;">bar</span></p><p>baz^</p>';

		assert.areSame( expected, bender.tools.fixHtml( output ) );
	},

	// #8321
	'test enter at the end of block with inline styles' : function() {
		var bot = this.editorBot;
		bot.setHtmlWithSelection( '<p><b><i>foo^</i></b></p>' );
		bot.execCommand( 'enter' );
		bot.editor.insertText( 'bar' );
		assert.areSame( '<p><b><i>foo</i></b></p><p><b><i>bar</i></b></p>', bot.getData( false, true ) );
	},

	// #7946 TODO: Add editor doc quirks mode tests.
	'test enter key scrolls document' : function() {
		var bot = this.editorBot;

		bot.editor.focus();
		bot.setHtmlWithSelection( '^' );

		// Press enough enter key in order overflow the content area.
		var i = 0;
		while ( i++ < 20 ) bot.execCommand( 'enter' );
		var start = bot.editor.getSelection().getStartElement();
		var rect = start.$.getBoundingClientRect();
		var viewport = bot.editor.window.getViewPaneSize();

		// Make sure the cursor is inside of viewport.
		assert.isTrue( rect.top < viewport.height && rect.top > 0 );
	},

	// Start of #8812
	'test Enter key at the end of contents with comment' : function() {
		var bot = this.editorBot;
		bot.setHtmlWithSelection( 'test ^<!-- --> ' );
		bot.execCommand( 'enter' );
		assert.areSame( '<p>test <!-- --></p><p>&nbsp;</p>', bot.getData( false, true ) );
	},

	'test Enter key in the middle of contents with comments' : function() {
		var bot = this.editorBot;
		bot.setHtmlWithSelection( '<!-- baz -->foo^bar<!-- baz -->' );
		bot.execCommand( 'enter' );

		// IE9+Compat looses the first comment, so we remove it from the assertion (not related to #8812).
		assert.areSame( '<p>foo</p><p>bar</p>', bot.getData( false, true ).replace( /<![^>]+>/g, '' ) );
	},

	'test Enter key in the middle of contents with comments (2)' : function() {
		var bot = this.editorBot;
		bot.setHtmlWithSelection( '<b>foo</b>bar^baz<!-- --><b>qux</b>' );
		bot.execCommand( 'enter' );

		assert.areSame( '<p><b>foo</b>bar</p><p>baz<!-- --><b>qux</b></p>', bot.getData( false, true ) );
	},
	// End of #8812

	'test Enter key uses editor.activeEnterMode': function() {
		bender.editorBot.create( {
			name: 'test_enter_editor_enter_mode',
			config: {
				autoParagraph: false
			}
		}, function( bot ) {
			bot.editor.setActiveEnterMode( CKEDITOR.ENTER_BR, CKEDITOR.ENTER_DIV );

			try {
				bot.setHtmlWithSelection( 'foo^bar' );
				bot.execCommand( 'enter' );
				assert.areSame( 'foo<br />bar', bot.getData(), 'br mode was used' );

				bot.setHtmlWithSelection( 'foo^bar' );
				bot.execCommand( 'shiftEnter' );
				assert.areSame( '<div>foo</div><div>bar</div>', bot.getData(), 'div mode was used' );
			} catch ( e ) {
				throw e;
			} finally {
				// Always reset enter mode - even if previous test failed.
				bot.editor.setActiveEnterMode( null, null );
			}

			bot.setHtmlWithSelection( 'foo^bar' );
			bot.execCommand( 'enter' );
			assert.areSame( '<p>foo</p><p>bar</p>', bot.getData(), 'main mode was used' );
		} );
	},

	'test Enter key is influenced by the active filter': function() {
		bender.editorBot.create( {
			name: 'test_enter_active_filter',
			config: {
				autoParagraph: false
			}
		}, function( bot ) {
			bot.setHtmlWithSelection( 'foo^bar' );

			var filter = new CKEDITOR.filter( 'div' );
			bot.editor.setActiveFilter( filter );

			try {
				bot.execCommand( 'enter' );
				assert.areSame( '<div>foo</div><div>bar</div>', bot.getData(), 'div mode was used' );
			} catch ( e ) {
				throw e;
			} finally {
				// Always reset filter - even if previous test failed.
				bot.editor.setActiveFilter( null );
			}

			bot.setHtmlWithSelection( 'foo^bar' );
			bot.execCommand( 'enter' );
			assert.areSame( '<p>foo</p><p>bar</p>', bot.getData(), 'main mode was used' );
		} );
	},

	/*
	// Commented out until we decide whether we want to block enter key completely and how.
	'test Enter key is completely blocked if neither p nor br are allowed': function() {
		var bot = this.editorBot;
		bot.setHtmlWithSelection( '<p>foo^bar</p>' );

		var filter = new CKEDITOR.filter( 'x' );
		this.editor.setActiveFilter( filter );

		try {
			bot.execCommand( 'enter' );
			assert.areSame( '<p>foobar</p>', bot.getData(), 'enter is blocked' );
		} catch ( e ) {
			throw e;
		} finally {
			// Always reset filter - even if previous test failed.
			this.editor.setActiveFilter( null );
		}
	}
	*/
} );