/* bender-tags: editor,insertion */

( function() {
	'use strict';

	var doc = CKEDITOR.document,
		tools = bender.tools;

	bender.editor = {
		config: {
			autoParagraph: false,
			allowedContent: true
		}
	};

	var tests = {
		testInsertElement: function() {
			var editor = this.editor;

			// When editor has focus.
			var ins = CKEDITOR.dom.element.createFromHtml( '<strong>baz</strong>', editor.document );
			tools.setHtmlWithSelection( editor, 'foo^bar' );
			editor.insertElement( ins );
			assert.areSame( 'foo<strong>baz</strong>bar', tools.compatHtml( editor.getData() ), 'insert element with existing selection, editor focused' );

			// When editor loose focus.
			tools.setHtmlWithSelection( editor, 'foo^bar' );
			ins = CKEDITOR.dom.element.createFromHtml( '<strong>baz</strong>', editor.document );
			doc.getById( 'text_input' ).focus();
			editor.insertElement( ins );
			assert.areSame( 'foo<strong>baz</strong>bar', tools.compatHtml( editor.getData() ), 'insert element with existing selection, editor blurred' );
		},

		testInsertHtml: function() {
			var editor = this.editor;

			// When editor has focus.
			tools.setHtmlWithSelection( editor, 'foo^bar' );
			editor.insertHtml( 'baz' );
			assert.areSame( 'foobazbar', tools.compatHtml( editor.getData() ), 'insert html with existing selection, editor focused' );

			// When editor loose focus.
			tools.setHtmlWithSelection( editor, 'foo^bar' );
			doc.getById( 'text_input' ).focus();
			editor.insertHtml( 'baz' );
			assert.areSame( 'foobazbar', tools.compatHtml( editor.getData() ), 'insert html with existing selection, editor blurred' );
		},

		testInsertText: function() {
			var editor = this.editor;

			// When editor has focus.
			tools.setHtmlWithSelection( editor, 'foo^bar' );
			editor.insertText( 'baz' );
			assert.areSame( 'foobazbar', tools.compatHtml( editor.getData() ), 'insert text with existing selection, editor focused' );

			// When editor loose focus.
			tools.setHtmlWithSelection( editor, 'foo^bar' );
			doc.getById( 'text_input' ).focus();
			editor.insertText( 'baz' );
			assert.areSame( 'foobazbar', tools.compatHtml( editor.getData() ), 'insert text with existing selection, editor blurred' );
		},

		'test insertHtml without filter': function() {
			bender.editorBot.create( {
				name: 'test_inserthtml_no_acf',
				config: {
					removePlugins: 'basicstyles'
				}
			}, function( bot ) {
				var editor = bot.editor;
				editor.focus();

				editor.insertHtml( '<em>A</em>B' );
				assert.areSame( '<p>AB</p>', bot.getData(), '<em> has been filtered out' );

				editor.insertHtml( '<em>C</em>D', 'unfiltered_html' );
				assert.areSame( '<p>AB<em>C</em>D</p>', bot.getData(), '<em> has been inserted' );
			} );
		},

		'test insertHtml uses editor.activeEnterMode': function() {
			bender.editorBot.create( {
				name: 'test_inserthtml_entermode',
				config: {
					allowedContent: true
				}
			}, function( bot ) {
				var editor = bot.editor,
					toHtml = 0,
					mode;

				editor.focus();

				editor.on( 'toHtml', function( evt ) {
					toHtml += 1;
					mode = evt.data.enterMode;
				} );

				editor.setActiveEnterMode( CKEDITOR.ENTER_BR );
				editor.insertHtml( 'foo' );
				assert.areSame( CKEDITOR.ENTER_BR, mode, 'dynamic enter mode was used - BR' );

				editor.setActiveEnterMode( null );
				editor.insertHtml( 'foo' );
				assert.areSame( CKEDITOR.ENTER_P, mode, 'dynamic enter mode was used - P' );

				// Just to be sure that test is correct.
				assert.areSame( 2, toHtml, 'toHtml was fired twice' );
			} );
		},

		'test insertHtml without focus': function() {
			bender.editorBot.create( {
				name: 'test_inserthtml_no_focus',
				config: {
					allowedContent: true
				}
			}, function( bot ) {
				bot.editor.insertHtml( '<p>foo</p>' );

				assert.areSame( '<p>foo</p>', bot.editor.getData(), 'HTML was inserted' );
			} );
		},

		'test insertText without focus': function() {
			bender.editorBot.create( {
				name: 'test_inserttext_no_focus',
				config: {
					allowedContent: true
				}
			}, function( bot ) {
				bot.editor.insertText( 'bar' );

				assert.areSame( '<p>bar</p>', bot.editor.getData(), 'text was inserted' );
			} );
		},

		'test insertHtml sets options.protectedWhitespaces of dP.toHtml': function() {
			var editor = this.editor;

			editor.once( 'toHtml', function( evt ) {
				assert.isTrue( evt.data.protectedWhitespaces );
			} );

			editor.insertHtml( '  foo  ' );
		},

		'test insertHtml with range': function() {
			var bot = this.editorBot,
				editor = this.editor;

			bot.setHtmlWithSelection( '<p id="p1">foo</p><p>bar^</p>' );

			var range = editor.createRange();
			range.setStartAfter( editor.document.getById( 'p1' ) );
			range.collapse( true );

			editor.insertHtml( '<p>bam</p>', 'html', range );

			assert.isInnerHtmlMatching( '<p id="p1">foo</p><p>bam^@</p><p>bar@</p>',
				tools.selection.getWithHtml( editor ), { compareSelection: true, normalizeSelection: true } );
		}
	};

	// (#2813)
	addInsertionTests( [
		{
			name: 'when selection starts at the beginning of span',
			initial: '<span>{foo}bar</span>',
			data: '<div><div>div</div></div>',
			expected: '<div><div>div</div></div><span>bar</span>'
		}, {
			name: 'when selection ends at the end of span',
			initial: '<span>foo{bar}</span>',
			data: '<div><div>div</div></div>',
			expected: '<span>foo</span><div><div>div</div></div>'
		}, {
			name: 'when selection covers span',
			initial: '<span>{foobar}</span>',
			data: '<div><div>div</div></div>',
			expected: '<div><div>div</div></div>'
		}, {
			name: 'when selection is followed by space',
			initial: '<span>foo{bar}&nbsp;</span>',
			data: '<div><div>div</div></div>',
			expected: '<span>foo</span><div><div>div</div></div><span>&nbsp;</span>',
			ignore: CKEDITOR.env.ie && !CKEDITOR.env.edge // (#3061)
		}, {
			name: 'when selection is preceded by space',
			initial: '<span>&nbsp;{foo}bar</span>',
			data: '<div><div>div</div></div>',
			expected: '<span>&nbsp;</span><div><div>div</div></div><span>bar</span>',
			ignore: CKEDITOR.env.ie && !CKEDITOR.env.edge // (#3061)
		}, {
			name: 'when empty element is inserted at the end of span',
			initial: '<span>foo{bar}</span>',
			data: '<div></div>',
			expected: '<span>foo</span><div></div>',
			ignore: CKEDITOR.env.ie && CKEDITOR.env.version < 9 // IE8 fills empty element with `&nbsp;`, so we can skip this test.
		}, {
			name: 'when selection covers nested span',
			initial: '<p><span>{foobar}</span></p>',
			data: '<div><div>div</div></div>',
			expected: '<div><div>div</div></div>'
		}, {
			name: 'when selection covers span with empty spans on boundaries',
			initial: '<span></span><span>{foobar}</span><span></span>',
			data: '<div><div>div</div></div>',
			expected: '<span></span><div><div>div</div></div><span></span>'
		}
	] );

	bender.test( tests );

	function addInsertionTests( insertionTests ) {
		CKEDITOR.tools.array.forEach( insertionTests, addInsertionTest );
	}

	function addInsertionTest( options ) {
		var methods = [ 'insertHtml', 'insertHtmlIntoRange', 'insertElement', 'insertElementIntoRange', 'insertText' ];

		CKEDITOR.tools.array.forEach( methods, function( methodName ) {
			tests[ 'test ' + methodName + ' ' + options.name ] = function() {
				if ( options.ignore ) {
					assert.ignore();
				}

				var editor = this.editorBot.editor;

				tools.selection.setWithHtml( editor, options.initial );

				if ( methodName === 'insertText' ) {
					assertInsertText( editor, options.initial.replace( /{.*}/, 'text' ), 'text' );
				} else {
					assertInsertionMethod( editor, options.expected, methodName, options.data );
				}
			};
		} );
	}

	function assertInsertionMethod( editor, expected, methodName, html ) {
		var useRange, useElement, data;

		switch ( methodName ) {
			case 'insertHtmlIntoRange':
				useRange = true;
				break;
			case 'insertElement':
				useElement = true;
				break;
			case 'insertElementIntoRange':
				useRange = true;
				useElement = true;
		}

		data = useElement ? CKEDITOR.dom.element.createFromHtml( html ) : html;

		if ( useRange ) {
			editor.editable()[ methodName ]( data, editor.getSelection().getRanges()[ 0 ] );
		} else {
			editor[ methodName ]( data );
		}

		assert.areSame( expected, normalizeHtml( editor.editable().getHtml() ) );
	}

	function assertInsertText( editor, expected, string ) {
		editor.insertText( string );
		assert.areSame( expected, normalizeHtml( editor.editable().getHtml() ) );
	}

	function normalizeHtml( html ) {
		return html.toLowerCase().replace( /(<p>(<br(?: type="_moz")?>|&nbsp;)<\/p>|<p><\/p>$|<br(?: type="_moz")?>|\s|\u200B)/g, '' );
	}
} )();
