/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: link,toolbar */

( function() {
	'use strict';

	bender.editor = {
		config: {
			autoParagraph: false,
			extraAllowedContent: 'span[style]'
		}
	};

	bender.test( {
		// #8275
		'test create link (without editor focus)': function() {
			var bot = this.editorBot;

			// Make sure that the focus is not in the editor.
			CKEDITOR.document.getById( 'blurTarget' ).focus();

			bot.dialog( 'link', function( dialog ) {
				// Should auto trim leading spaces. (#6845)
				dialog.setValueOf( 'info', 'url', ' ckeditor.com' );
				dialog.getButton( 'ok' ).click();

				assert.areEqual( '<a href="http://ckeditor.com">http://ckeditor.com</a>', bot.getData( true ) );
			} );
		},

		'test create link (with editor focus)': function() {
			var bot = this.editorBot;

			bot.setData( '', function() {
				bot.editor.focus();

				bot.dialog( 'link', function( dialog ) {
					dialog.setValueOf( 'info', 'url', 'ckeditor.com' );
					dialog.getButton( 'ok' ).click();

					assert.areEqual( '<a href="http://ckeditor.com">http://ckeditor.com</a>', bot.getData( true ) );
				} );
			} );
		},

		'test text selection after link created': function() {
			var bot = this.editorBot,
				editor = this.editor;

			bot.setHtmlWithSelection( '<p>foo ^</p>' );

			bot.dialog( 'link', function( dialog ) {
				dialog.setValueOf( 'info', 'url', 'http://ckeditor.com' );
				dialog.getButton( 'ok' ).click();

				var range = new CKEDITOR.dom.range( editor.document ),
					link = editor.elementPath().contains( 'a' );

				range.setStart( link.getFirst(), 4 );
				range.collapse( true );
				range.select();

				bot.dialog( 'link', function( dialog ) {
					dialog.getButton( 'ok' ).click();
					editor.getSelection().getRanges()[ 0 ].deleteContents();
					assert.areSame( '<p>foo</p>', bot.getData( false, true ) );
				} );
			} );
		},

		'test edit link (text selected)': function() {
			var bot = this.editorBot;

			bot.setHtmlWithSelection( '<a href="http://cksource.com" name="test">[foo]</a>' );

			bot.dialog( 'link', function( dialog ) {
				dialog.setValueOf( 'info', 'url', 'http://ckeditor.com' );
				dialog.getButton( 'ok' ).click();

				assert.areSame( '<a href="http://ckeditor.com" name="test">foo</a>', bot.getData( true ) );
			} );
		},

		'test unlink command states': function() {
			var unlink = this.editor.getCommand( 'unlink' ),
				bot = this.editorBot;

			bot.setHtmlWithSelection( '<a href="http://ckeditor.com">^foo</a>' );
			assert.isTrue( unlink.state == CKEDITOR.TRISTATE_OFF, 'collapsed in link' );
			bot.setHtmlWithSelection( '^foo' );
			assert.isTrue( unlink.state == CKEDITOR.TRISTATE_DISABLED, 'collapsed not in link' );
			bot.setHtmlWithSelection( '<a href="http://ckeditor.com" name="test">[<i contenteditable="false">bar</i>]</a>' );
			assert.isTrue( unlink.state == CKEDITOR.TRISTATE_OFF, 'fake selection on non-editable element in link' );
		},

		// #9212
		'test getSelectedLink for selection inside read-only node': function() {
			var bot = this.editorBot,
				editor = this.editor;

			bot.setHtmlWithSelection( 'foo<span contenteditable="false">ba^r</span>bum' );
			assert.isNull( CKEDITOR.plugins.link.getSelectedLink( editor ) );
		},

		'test getSelectedLink for fake selection on non-editable element': function() {
			var bot = this.editorBot,
				editor = this.editor;

			bot.setHtmlWithSelection( 'foo<a href="http://ckeditor.com">[<i contenteditable="false">bar</i>]</a>bum' );
			assert.areSame( 'a', CKEDITOR.plugins.link.getSelectedLink( editor ).getName() );
		},

		'test create link on a non-editable inline element': function() {
			var bot = this.editorBot,
				editor = this.editor;

			bot.setHtmlWithSelection( 'foo[<em contenteditable="false">bar</em>]bum' );
			bot.dialog( 'link', function( dialog ) {
				dialog.setValueOf( 'info', 'url', 'http://ckeditor.com' );
				dialog.getButton( 'ok' ).click();

				assert.areSame( 'foo<a href="http://ckeditor.com"><em contenteditable="false">bar</em></a>bum', bot.getData( true ) );
				assert.isTrue( !!editor.getSelection().isFake );
			} );
		},

		'test edit link on a non-editable inline element': function() {
			var bot = this.editorBot,
				editor = this.editor;

			bot.setHtmlWithSelection( 'foo<a href="http://ckeditor.com">[<em contenteditable="false">bar</em>]</a>bum' );
			bot.dialog( 'link', function( dialog ) {
				dialog.setValueOf( 'info', 'url', 'http://cksource.com' );
				dialog.getButton( 'ok' ).click();

				assert.areSame( 'foo<a href="http://cksource.com"><em contenteditable="false">bar</em></a>bum', bot.getData( true ) );
				assert.isTrue( !!editor.getSelection().isFake );
			} );
		},

		'test unlink on a non-editable inline element': function() {
			var bot = this.editorBot,
				editor = this.editor;

			bot.setHtmlWithSelection( 'foo<a href="http://ckeditor.com">[<em contenteditable="false">bar</em>]</a>bum' );
			editor.execCommand( 'unlink' );

			assert.areSame( 'foo<em contenteditable="false">bar</em>bum', bot.getData( true ) );
			assert.isTrue( !!editor.getSelection().isFake );
		},

		'test edit link which contents equals its href': function() {
			var bot = this.editorBot,
				editor = this.editor;

			bot.setHtmlWithSelection( 'foo<a href="http://ckeditor.com" data-cke-saved-href="http://ckeditor.com">http://ckedi^tor.com</a>bum' );
			bot.dialog( 'link', function( dialog ) {
				dialog.setValueOf( 'info', 'url', 'http://cksource.com' );
				dialog.getButton( 'ok' ).click();

				assert.areSame( 'foo<a href="http://cksource.com">http://cksource.com</a>bum', bot.getData( true ) );
				assert.areSame( 'http://cksource.com', editor.getSelection().getSelectedText(), 'content of a link was selected' );
			} );
		},

		'test edit link text': function() {
			var bot = this.editorBot,
				expected = '[<a href="http://ckeditor.com">testing 1, 2, 3</a>]';

			if ( CKEDITOR.env.safari || ( CKEDITOR.env.ie && CKEDITOR.env.version == 8 ) ) {
				expected = '<a href="http://ckeditor.com">[testing 1, 2, 3]</a>';
			}

			bot.setHtmlWithSelection( '[<a href="http://ckeditor.com">http://ckeditor.com</a>]' );

			bot.dialog( 'link', function( dialog ) {
				assert.areSame( dialog.getValueOf( 'info', 'linkDisplayText' ), 'http://ckeditor.com' );
				dialog.setValueOf( 'info', 'linkDisplayText', 'testing 1, 2, 3' );
				dialog.getButton( 'ok' ).click();
				assert.areSame( expected, bender.tools.getHtmlWithSelection( bot.editor ) );
			} );
		},

		'test changing inner text': function() {
			// Once the innertext (display text) is changed, any markup within the selection should be removed, and it should add
			// an anchor element with innertext at the beginning of initial selection.
			var bot = this.editorBot;

			bot.setHtmlWithSelection( '<p>[testing <a href="http://ckeditor.com">http://ckeditor.<strong>com</strong></a>].</p>' );

			bot.dialog( 'link', function( dialog ) {
				assert.areSame( dialog.getValueOf( 'info', 'linkDisplayText' ), 'testing http://ckeditor.com' );
				dialog.setValueOf( 'info', 'linkDisplayText', 'foobar' );
				dialog.setValueOf( 'info', 'url', 'http://example.dev' );
				dialog.getButton( 'ok' ).click();
				assert.areSame( '<p><a href="http://example.dev">foobar</a>.</p>', bot.getData( true ) );
			} );
		},

		'test XSS protection': function() {
			var bot = this.editorBot,
				expected = '<a href="http://ckeditor.com">&lt;img src="" onerror="alert( 1 );"&gt;</a>';

			if ( this.editor.plugins.entities ) {
				// If entities plugin is present (e.g. built version) also quotes will be encoded.
				expected = '<a href="http://ckeditor.com">&lt;img src=&quot;&quot; onerror=&quot;alert( 1 );&quot;&gt;</a>';
			}

			bot.setHtmlWithSelection( '<a href="http://ckeditor.com">a^aa</a>' );

			bot.dialog( 'link', function( dialog ) {
				dialog.setValueOf( 'info', 'linkDisplayText', '<img src="" onerror="alert( 1 );">' );
				dialog.getButton( 'ok' ).click();
				assert.areSame( expected, bot.getData( true ) );
			} );
		},

		'test overriding whole block': function() {
			// If we have whole block selected, we need to make sure that by overriding the selection with new anchor it
			// will be wrapped with a block instead of be put directly into editable (body).
			var bot = this.editorBot;

			bot.setHtmlWithSelection( '[<p>aaa</p>]' );

			bot.dialog( 'link', function( dialog ) {
				dialog.setValueOf( 'info', 'linkDisplayText', 'bbb' );
				dialog.setValueOf( 'info', 'url', 'http://ckeditor.com' );
				dialog.getButton( 'ok' ).click();
				assert.areSame( '<p><a href="http://ckeditor.com">bbb</a></p>', bot.getData( true ) );
			} );
		},

		'test link with a nested strong without text change': function() {
			// If no innertext was changed, the nested elements should not get removed.
			var bot = this.editorBot;

			bot.setHtmlWithSelection( '[<a href="http://ckeditor.com">http://ckeditor.<strong>com</strong></a>].' );

			bot.dialog( 'link', function( dialog ) {
				assert.areSame( dialog.getValueOf( 'info', 'linkDisplayText' ), 'http://ckeditor.com' );
				dialog.setValueOf( 'info', 'url', 'http://example.dev' );
				dialog.getButton( 'ok' ).click();
				assert.areSame( '<a href="http://example.dev">http://ckeditor.<strong>com</strong></a>.', bot.getData( true ) );
			} );
		},

		'test changing inner text of link with same href and inner text': function() {
			var bot = this.editorBot;

			// Note it's crucial to include data-cke-saved-href attribute to reproduce this issue.
			bot.setHtmlWithSelection( '<p>aa [<a href="http://foobar" data-cke-saved-href="http://foobar">http://foobar</a>] bb</p>' );

			bot.dialog( 'link', function( dialog ) {
				dialog.setValueOf( 'info', 'linkDisplayText', 'foo' );
				dialog.getButton( 'ok' ).click();
				assert.areSame( '<p>aa <a href="http://foobar">foo</a> bb</p>', bot.getData( true ) );
			} );
		},

		'test link with a nested anchors without text change': function() {

			if ( CKEDITOR.env.ie && CKEDITOR.env.version == 8 ) {
				// #14848
				assert.ignore();
			}

			// Even though display text was not changed we have to remove nested, editable anchor elements.
			var bot = this.editorBot;

			bot.setHtmlWithSelection( '[<em>foo </em><a href="aaa">bbb</a> <span contenteditable="false"><a href="aaa">ccc</a></span>]' );

			bot.dialog( 'link', function( dialog ) {
				dialog.setValueOf( 'info', 'url', 'newlink' );
				dialog.getButton( 'ok' ).click();
				assert.areSame( '<a href="http://newlink"><em>foo </em>bbb <span contenteditable="false"><a href="aaa">ccc</a></span></a>', bot.getData( true ) );
			} );
		},

		'test link with a nested strong with text change': function() {
			var bot = this.editorBot;

			bot.setHtmlWithSelection( '[<a href="http://ckeditor.com">http://ckeditor.<strong>com</strong></a>].' );

			bot.dialog( 'link', function( dialog ) {
				dialog.setValueOf( 'info', 'linkDisplayText', 'foo' );
				dialog.setValueOf( 'info', 'url', 'http://example.dev' );
				dialog.getButton( 'ok' ).click();
				assert.areSame( '<a href="http://example.dev">foo</a>.', bot.getData( true ) );
			} );
		},

		'test changing inner text multiline': function() {
			var bot = this.editorBot;

			bot.setHtmlWithSelection( '<p>a[a</p><p>bb</p><p>c]c</p>' );

			bot.dialog( 'link', function( dialog ) {
				assert.areSame( dialog.getValueOf( 'info', 'linkDisplayText' ), 'abbc' );
				dialog.setValueOf( 'info', 'linkDisplayText', 'foo' );
				dialog.setValueOf( 'info', 'url', 'http://bar' );
				dialog.getButton( 'ok' ).click();
				assert.areSame( '<p>a<a href="http://bar">foo</a>c</p>', bot.getData( true ) );
			} );
		},

		'test multiline selection without changing display text': function() {
			var bot = this.editorBot;

			// When using getSelectedText() on multiline selection, it will contain new line chars. Text inputs used in dialog, can't contain
			// new lines, so if our initial pattern would use text with new lines, those would always differ.

			bot.setHtmlWithSelection( '<p>fo[o</p><h2>b]ar</h2>' );
			bot.dialog( 'link', function( dialog ) {
				dialog.setValueOf( 'info', 'url', 'aaa' );
				dialog.getButton( 'ok' ).click();

				assert.areSame( '<p>fo<a href="http://aaa">o</a></p><h2><a href="http://aaa">b</a>ar</h2>', bot.getData( true ) );
			} );
		},

		'test changing inner text block containing': function() {
			var bot = this.editorBot;

			bot.setHtmlWithSelection( '<p>a[a</p><p>bb]</p><p>cc</p>' );

			bot.dialog( 'link', function( dialog ) {
				assert.areSame( dialog.getValueOf( 'info', 'linkDisplayText' ), 'abb' );
				dialog.setValueOf( 'info', 'linkDisplayText', 'foo' );
				dialog.setValueOf( 'info', 'url', 'http://bar' );
				dialog.getButton( 'ok' ).click();
				assert.areSame( '<p>a<a href="http://bar">foo</a></p><p>cc</p>', bot.getData( true ) );
			} );
		},

		'test link passes filter': function() {
			this.editorBot.assertInputOutput(
				'<p><a href="http://ckeditor.com">text</a></p>',
				/^<p><a data-cke-saved-href="http:\/\/ckeditor.com" href="http:\/\/ckeditor.com">text<\/a>(<br \/>)?<\/p>$/
			);
		},

		'test anchor passes filter': function() {
			this.editorBot.assertInputOutput(
				'<p><a name="#idid">text</a></p>',
				/^<p><a( class="\s?cke_anchor")? data-cke-saved-name="#idid" name="#idid">text<\/a>(<br \/>)?<\/p>$/
			);
		},

		'test empty anchor passes filter': function() {
			// jscs:disable maximumLineLength
			var matchRegex = CKEDITOR.env.ie && CKEDITOR.env.version == 8 ?
				/^<p><img alt="[^"]+" class="cke_anchor" data-cke-real-element-type="anchor" data-cke-real-node-type="1" data-cke-realelement="[^"]+" src="data:image[^"]+" title="[^"]+" \/><\/p>$/ :
				/^<p><img align="" alt="[^"]+" class="cke_anchor" data-cke-real-element-type="anchor" data-cke-real-node-type="1" data-cke-realelement="[^"]+" src="data:image[^"]+" title="[^"]+" \/>(<br \/>)?<\/p>$/;
			// jscs:enable maximumLineLength

			this.editorBot.assertInputOutput(
				'<p><a name="#idid"></a></p>',
				matchRegex
			);
		},

		// #11822
		'test select link on double-click': function() {
			var bot = this.editorBot,
				editor = bot.editor;

			// Do not let dialog to show – it is not necessary.
			editor.once( 'doubleclick', function( evt ) {
				evt.cancel();
			}, null, null, 100 );

			bot.setData( '<p>a<a href="http://bar">b</a>c</p>', function() {
				editor.fire( 'doubleclick', {
					element: editor.document.findOne( 'a' )
				} );

				// Assert selected text only because, depending on the browser,
				// selection is <a>[b]</a> or [<a>b</a>].
				assert.areSame( 'b', editor.getSelection().getSelectedText(), 'Link selected' );
			} );
		},

		// #11822
		'test select anchor on double-click': function() {
			var bot = this.editorBot,
				editor = bot.editor;

			// Do not let dialog to show – it is not necessary.
			editor.once( 'doubleclick', function( evt ) {
				evt.cancel();
			}, null, null, 100 );

			bot.setData( '<p>a<a name="foo">b</a>c</p>', function() {
				editor.fire( 'doubleclick', {
					element: editor.document.findOne( 'a' )
				} );

				// Assert selected text only because, depending on the browser,
				// selection is <a>[b]</a> or [<a>b</a>].
				assert.areSame( 'b', editor.getSelection().getSelectedText(), 'Link selected' );
			} );
		},

		// #11956
		'test select link with descendants on double-click': function() {
			var bot = this.editorBot,
				editor = bot.editor;

			// Do not let dialog to show – it is not necessary.
			editor.once( 'doubleclick', function( evt ) {
				evt.cancel();

				resume( function() {
					assert.areSame( editor.document.findOne( 'a' ), evt.data.link, 'Link selected' );
				} );
			} );

			bot.setData( '<p>a<a href="http://bar"><span style="background:#f00;">b</span></a>c</p>', function() {
				editor.fire( 'doubleclick', {
					element: editor.document.findOne( 'span' )
				} );

				wait();
			} );
		},

		// #13887
		'test link target special chars': function() {
			var bot = this.editorBot;

			bot.setHtmlWithSelection( '<a href="http://ckeditor.com">[foo]</a>' );

			bot.dialog( 'link', function( dialog ) {
				var funnyTargetValue = 'foo-b!ar^$`*(';

				dialog.setValueOf( 'target', 'linkTargetType', 'frame' );
				dialog.setValueOf( 'target', 'linkTargetName', funnyTargetValue );

				dialog.getButton( 'ok' ).click();

				assert.areSame( '<a href="http://ckeditor.com" target="' + funnyTargetValue + '">foo</a>', bot.getData( true ) );
			} );
		},

		'test link target keywords': function() {
			var bot = this.editorBot;

			bot.setHtmlWithSelection( '<a href="http://ckeditor.com">[foo]</a>' );

			bot.dialog( 'link', function( dialog ) {
				dialog.setValueOf( 'target', 'linkTargetType', 'frame' );
				dialog.setValueOf( 'target', 'linkTargetName', '_self' );

				dialog.getButton( 'ok' ).click();

				assert.areSame( '<a href="http://ckeditor.com" target="_self">foo</a>', bot.getData( true ) );
			} );
		},

		// #5278
		'test link target with space': function() {
			var bot = this.editorBot;

			bot.setHtmlWithSelection( '<a href="http://ckeditor.com">[foo]</a>' );

			bot.dialog( 'link', function( dialog ) {
				var funnyTargetValue = ' foo bar';

				dialog.setValueOf( 'target', 'linkTargetType', 'frame' );
				dialog.setValueOf( 'target', 'linkTargetName', funnyTargetValue );

				dialog.getButton( 'ok' ).click();

				assert.areSame( '<a href="http://ckeditor.com" target="foobar">foo</a>', bot.getData( true ) );
			} );
		},

		'test CKEDITOR.link.showDisplayTextForElement': function() {
			var doc = CKEDITOR.document,
				showDisplayTextForElement = CKEDITOR.plugins.link.showDisplayTextForElement;

			assert.isFalse( showDisplayTextForElement( doc.findOne( 'input#blurTarget' ), this.editor ), 'Input element' );
			assert.isTrue( showDisplayTextForElement( doc.findOne( 'span' ), this.editor ), 'Span element' );
			assert.isTrue( showDisplayTextForElement( null, this.editor ), 'Null value' );
		},

		// #13062
		'test unlink when cursor is right before the link': function() {
			var editor = this.editor,
				bot = this.editorBot;

			bot.setHtmlWithSelection( '<p><a href="http://cksource.com">^Link</a></p>' );

			editor.ui.get( 'Unlink' ).click( editor );

			assert.areSame( '<p>^Link</p>', bot.htmlWithSelection() );
		},

		// #13062
		'test unlink when cursor is right after the link': function() {
			// IE8 fails this test for unknown reason; however it does well
			// in the manual one.
			if ( CKEDITOR.env.ie && CKEDITOR.env.version == 8 ) {
				assert.ignore();
			}

			var editor = this.editor,
				bot = this.editorBot;

			bot.setHtmlWithSelection( '<p><a href="http://cksource.com">Link^</a></p>' );

			resume( function() {
				editor.ui.get( 'Unlink' ).click( editor );
				assert.areSame( '<p>Link^</p>', bot.htmlWithSelection() );
			} );

			wait( 100 );
		},

		// #13062
		'test unlink when cursor is right before the link and there are more than one link in paragraph': function() {
			var editor = this.editor,
				bot = this.editorBot;

			bot.setHtmlWithSelection( '<p>I am<a href="http://foo"> an </a>in<a href="http://bar">sta</a>nce of <a href="http://ckeditor.com">^<s>CKEditor</s></a>.</p>' );

			editor.ui.get( 'Unlink' ).click( editor );

			assert.areSame( '<p>I am<a href="http://foo"> an </a>in<a href="http://bar">sta</a>nce of ^<s>CKEditor</s>.</p>', bot.htmlWithSelection() );
		}
	} );
} )();
