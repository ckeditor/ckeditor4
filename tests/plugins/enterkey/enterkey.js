/* bender-tags: editor */
/* bender-ckeditor-plugins: entities,enterkey */

( function() {
	'use strict';

	var selectionTools = bender.tools.selection,
		matchOpts = {
			compareSelection: true,
			normalizeSelection: true
		};

	function se( editorName, htmlWithSeleciton, expectedHtmlWithSelection ) {
		return function() {
			var editor = this.editors[ editorName ];

			selectionTools.setWithHtml( editor, htmlWithSeleciton );
			editor.execCommand( 'shiftEnter' );

			var output = selectionTools.getWithHtml( editor );

			assert.isInnerHtmlMatching( expectedHtmlWithSelection, output, matchOpts );
		};
	}

	function e( editorName, htmlWithSeleciton, expectedHtmlWithSelection ) {
		return function() {
			var editor = this.editors[ editorName ];

			selectionTools.setWithHtml( editor, htmlWithSeleciton );
			editor.execCommand( 'enter' );

			var output = selectionTools.getWithHtml( editor );

			assert.isInnerHtmlMatching( expectedHtmlWithSelection, output, matchOpts );
		};
	}

	bender.editors = {
		editor: {
			name: 'editor1',
			config: {
				enterMode: CKEDITOR.ENTER_P,
				allowedContent: true
			}
		},

		editorNoAutoParagraph: {
			name: 'editor2',
			config: {
				autoParagraph: false
			}
		}
	};

	bender.test( {
		_should: {
			ignore: {
				'test shift+enter key - end of block, inside inline element followed by bogus br': !CKEDITOR.env.needsBrFiller,
				'test shift+enter key - end of list item, inside inline element followed by bogus br': !CKEDITOR.env.needsBrFiller
			}
		},

		// https://dev.ckeditor.com/ticket/7912
		'test enter key after invisible element': function() {
			// IE restrain making selection in invisible element.
			if ( CKEDITOR.env.ie )
				assert.ignore();

			var bot = this.editorBots.editor,
				editor = bot.editor;

			bot.setHtmlWithSelection( '<p>foo<span style="display:none;">bar^</span></p>' );
			bot.execCommand( 'enter' );
			editor.insertText( 'baz' );

			var output = bender.tools.getHtmlWithSelection( editor );
			output = editor.dataProcessor.toDataFormat( output );

			var expected =
					CKEDITOR.env.safari ?
						'<p>foo</p><p>baz^<span style="display:none;">bar</span></p>' :
						'<p>foo<span style="display:none;">bar</span></p><p>baz^</p>';

			assert.areSame( expected, bender.tools.fixHtml( output ) );
		},

		// https://dev.ckeditor.com/ticket/8321
		'test enter key at the end of block with inline styles': function() {
			var bot = this.editorBots.editor,
				editor = bot.editor;

			bot.setHtmlWithSelection( '<p><b><i>foo^</i></b></p>' );
			bot.execCommand( 'enter' );
			editor.insertText( 'bar' );
			assert.areSame( '<p><b><i>foo</i></b></p><p><b><i>bar</i></b></p>', bot.getData( false, true ) );
		},

		// https://dev.ckeditor.com/ticket/7946 TODO: Add editor doc quirks mode tests.
		'test enter key key scrolls document': function() {
			// On iPads, behavior of scrollTop, scrollHeight and clientHeight is a bit unexpected.
			// <html> and <iframe> are resized even though they shouldn't, sudden changes of scrollHeight
			// from higher value to ~clientHeight, even though more elements are being added, etc. (https://dev.ckeditor.com/ticket/13439)
			if ( CKEDITOR.env.iOS ) {
				assert.ignore();
			}

			var bot = this.editorBots.editor,
				editor = bot.editor;

			editor.focus();
			bot.setHtmlWithSelection( '^' );

			// Press enough enter key in order overflow the content area.
			var i = 0;
			while ( i++ < 20 ) bot.execCommand( 'enter' );
			var start = editor.getSelection().getStartElement();
			var rect = start.$.getBoundingClientRect();
			var viewport = bot.editor.window.getViewPaneSize();

			// Make sure the cursor is inside of viewport.
			assert.isTrue( rect.top < viewport.height && rect.top > 0 );
		},

		// Start of https://dev.ckeditor.com/ticket/8812
		'test ener key at the end of contents with comment': function() {
			var bot = this.editorBots.editor;

			bot.setHtmlWithSelection( 'test ^<!-- --> ' );
			bot.execCommand( 'enter' );
			assert.areSame( '<p>test <!-- --></p><p>&nbsp;</p>', bot.getData( false, true ) );
		},

		'test enter key in the middle of contents with comments': function() {
			var bot = this.editorBots.editor;

			bot.setHtmlWithSelection( '<!-- baz -->foo^bar<!-- baz -->' );
			bot.execCommand( 'enter' );

			// IE9+Compat looses the first comment, so we remove it from the assertion (not related to https://dev.ckeditor.com/ticket/8812).
			assert.areSame( '<p>foo</p><p>bar</p>', bot.getData( false, true ).replace( /<![^>]+>/g, '' ) );
		},

		'test enter key in the middle of contents with comments (2)': function() {
			var bot = this.editorBots.editor;

			bot.setHtmlWithSelection( '<b>foo</b>bar^baz<!-- --><b>qux</b>' );
			bot.execCommand( 'enter' );

			assert.areSame( '<p><b>foo</b>bar</p><p>baz<!-- --><b>qux</b></p>', bot.getData( false, true ) );
		},
		// End of https://dev.ckeditor.com/ticket/8812

		'test enter key uses editor.activeEnterMode': function() {
			var bot = this.editorBots.editorNoAutoParagraph;

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
		},

		'test enter key is influenced by the active filter': function() {
			var bot = this.editorBots.editorNoAutoParagraph;

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
		},

		// (https://dev.ckeditor.com/ticket/12162)
		'test enter key directly in nested editable': function() {
			var editor = this.editors.editorNoAutoParagraph,
				expected = '<p>foo</p>' +
				'<div contenteditable="false">' +
					'<div contenteditable="true">' +
						'<p>hell@</p>' +
						'<p>@@</p>' +
					'</div>' +
				'</div>';

			bender.tools.selection.setWithHtml( editor,
				'<p>foo</p>' +
				'<div contenteditable="false">' +
					'<div contenteditable="true">' +
						'hell[o]' +
					'</div>' +
				'</div>' );

			editor.execCommand( 'enter' );

			assert.isInnerHtmlMatching( expected, editor.editable().getHtml().replace( / data-cke-expando="\d+"/g, '' ),
				'New paragraphs should be created.' );
		},

		/*
		// Commented out until we decide whether we want to block enter key completely and how.
		'test enter key is completely blocked if neither p nor br are allowed': function() {
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
		},
		*/

		// #478
		'test enter key with no selection': function() {
			var editor = this.editors.editor,
				editable = editor.editable();

			editor.getSelection().removeAllRanges();
			editable.fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 13 } ) );

			assert.pass( 'Error is not thrown' );
		},

		'test enter key - start of block':				e( 'editor', '<p id="x">{}foo</p>', '<p>@@</p><p id="x">^foo@</p>' ),
		'test enter key - middle of block':				e( 'editor', '<p id="x">foo{}bar</p>', '<p id="x">foo@</p><p>^bar@</p>' ),
		'test enter key - end of block':				e( 'editor', '<p id="x">foo{}</p>', '<p id="x">foo@</p><p>^@</p>' ),

		'test enter key - inline with id':				e( 'editor', '<p>fo<b id="x">o{}b</b>ar</p>', '<p>fo<b id="x">o</b>@</p><p><b>^b</b>ar@</p>' ),
		'test enter key - block with id':				e( 'editor', '<div><p id="x">fo<b id="y">o{}b</b>ar</p></div>', '<div><p id="x">fo<b id="y">o</b>@</p><p><b>^b</b>ar@</p></div>' ),

		'test shift+enter key - middle of block':		se( 'editor', '<p>foo{}bar</p>', '<p>foo<br />^bar@</p>' ),
		'test shift+enter key - list item':				se( 'editor', '<ul><li>foo{}bar</li></ul>', '<ul><li>foo<br />^bar@</li></ul>' ),
		'test shift+enter key - start of block':		se( 'editor', '<p>{}foobar</p>', '<p><br />^foobar@</p>' ),
		'test shift+enter key - end of block':			se( 'editor', '<p>foobar{}</p>', '<p>foobar<br />^@</p>' ),
		'test shift+enter key - before br':				se( 'editor', '<p>foo{}<br />bar</p>', '<p>foo<br />^<br />bar@</p>' ),
		'test shift+enter key - after br':				se( 'editor', '<p>foo<br />{}bar</p>', '<p>foo<br /><br />^bar@</p>' ),

		// https://dev.ckeditor.com/ticket/11947
		'test shift+enter key - end of block, inside inline element followed by bogus br':
			se( 'editor', '<p><em>foo{}</em><br /></p>', '<p><em>foo<br />^</em><br /></p>' ),
		'test shift+enter key - end of list item, inside inline element followed by bogus br':
			se( 'editor', '<ul><li><em>foo{}</em><br /></li></ul>', '<ul><li><em>foo<br />^</em><br /></li></ul>' )
	} );

} )();
