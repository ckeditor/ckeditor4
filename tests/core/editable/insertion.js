/* bender-tags: editor,unit,insertion */

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

	bender.test( {
		testInsertElement: function() {
			var editor = this.editor;

			// When editor has focus.
			var ins = CKEDITOR.dom.element.createFromHtml( '<strong>baz</strong>', editor.document );
			bender.tools.setHtmlWithSelection( editor, 'foo^bar' );
			editor.insertElement( ins );
			assert.areSame( 'foo<strong>baz</strong>bar', tools.compatHtml( editor.getData() ), 'insert element with existing selection, editor focused' );

			// When editor loose focus.
			bender.tools.setHtmlWithSelection( editor, 'foo^bar' );
			ins = CKEDITOR.dom.element.createFromHtml( '<strong>baz</strong>', editor.document );
			doc.getById( 'text_input' ).focus();
			editor.insertElement( ins );
			assert.areSame( 'foo<strong>baz</strong>bar', tools.compatHtml( editor.getData() ), 'insert element with existing selection, editor blurred' );
		},

		testInsertHtml: function() {
			var editor = this.editor;

			// When editor has focus.
			bender.tools.setHtmlWithSelection( editor, 'foo^bar' );
			editor.insertHtml( 'baz' );
			assert.areSame( 'foobazbar', tools.compatHtml( editor.getData() ), 'insert html with existing selection, editor focused' );

			// When editor loose focus.
			bender.tools.setHtmlWithSelection( editor, 'foo^bar' );
			doc.getById( 'text_input' ).focus();
			editor.insertHtml( 'baz' );
			assert.areSame( 'foobazbar', tools.compatHtml( editor.getData() ), 'insert html with existing selection, editor blurred' );
		},

		testInsertText: function() {
			var editor = this.editor;

			// When editor has focus.
			bender.tools.setHtmlWithSelection( editor, 'foo^bar' );
			editor.insertText( 'baz' );
			assert.areSame( 'foobazbar', tools.compatHtml( editor.getData() ), 'insert text with existing selection, editor focused' );

			// When editor loose focus.
			bender.tools.setHtmlWithSelection( editor, 'foo^bar' );
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
				bender.tools.selection.getWithHtml( editor ), { compareSelection: true, normalizeSelection: true } );
		}
	} );
} )();