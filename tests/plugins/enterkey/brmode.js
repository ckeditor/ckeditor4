/* bender-tags: editor */
/* bender-ckeditor-plugins: entities,enterkey */

( function() {
	bender.editor = {
		config: {
			enterMode: CKEDITOR.ENTER_BR,
			allowedContent: true
		}
	};

	bender.test( {
		doTest: function( input, expected, msg ) {
			var ed = this.editor;
			bender.tools.setHtmlWithSelection( ed,  input );
			ed.execCommand( 'enter' );
			var output = bender.tools.getHtmlWithSelection( ed );
			expected.exec ?
				assert.isMatching( expected, output, msg ) :
				assert.areSame( expected, output, msg );
		},

		'test enter mode br': function() {
			this.doTest( '<p>foo^bar</p>', '<p>foo<br />^bar</p>', 'in block' );
			this.doTest( '<ul><li>foo^</li></ul>', '<ul><li>foo</li><li>^&nbsp;</li></ul>', 'end of list item' );
			this.doTest( '<h1>foo^</h1>bar', CKEDITOR.env.ie && CKEDITOR.env.version < 9 ? '<h1>foo^</h1><br />bar' : '<h1>foo</h1>^<br />bar', 'end of heading' );
			this.doTest( '<h1 dir="rtl">foo^</h1>', '<h1 dir="rtl">foo</h1><div dir="rtl">^&nbsp;</div>', 'end of heading (with direction)' );
			this.doTest( '<pre>foo^bar</pre>', /^<pre>foo(\r\n|\r|\n|<br \/>)\^bar<\/pre>$/, 'in pre' );
		}

		/*
		// Commented out until we decide whether we want to block enter key completely and how.
		'test blocked if active filter does not allow br': function() {
			var filter = new CKEDITOR.filter( 'p' );
			this.editor.setActiveFilter( filter );

			try {
				this.doTest( '<p>foo^bar</p>', '<p>foo^bar</p>', 'br is blocked' );
			} catch ( e ) {
				throw e;
			} finally {
				// Always reset filter - even if previous test failed.
				this.editor.setActiveFilter( null );
			}

			this.doTest( '<p>foo^bar</p>', '<p>foo<br />^bar</p>', 'br is not blocked' );
		}
		*/
	} );
} )();
