/* bender-tags: editor, dialog */
/* bender-ckeditor-plugins: link,toolbar,image */

( function() {
	'use strict';

	bender.editors = {
		noValidation: {
			config: {
				autoParagraph: false,
				extraAllowedContent: 'span[style]'
			}
		},
		validation: {
			config: {
				autoParagraph: false,
				linkPhoneRegExp: /^[0-9]{9}$/,
				linkPhoneMsg: 'Invalid number'
			}
		},
		customProtocol: {
			config: {
				linkDefaultProtocol: 'https://'
			}
		},

		otherProtocol: {
			config: {
				linkDefaultProtocol: ''
			}
		}
	};

	bender.test( {
		// https://dev.ckeditor.com/ticket/8275
		'test create link (without editor focus)': function() {
			var bot = this.editorBots.noValidation;

			// Make sure that the focus is not in the editor.
			CKEDITOR.document.getById( 'blurTarget' ).focus();

			bot.dialog( 'link', function( dialog ) {
				// Should auto trim leading spaces. (https://dev.ckeditor.com/ticket/6845)
				dialog.setValueOf( 'info', 'url', ' ckeditor.com' );
				dialog.getButton( 'ok' ).click();

				assert.areEqual( '<a href="http://ckeditor.com">http://ckeditor.com</a>', bot.getData( true ) );
			} );
		},

		'test create link (with editor focus)': function() {
			var bot = this.editorBots.noValidation;

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
			var bot = this.editorBots.noValidation,
				editor = bot.editor;

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
			var bot = this.editorBots.noValidation;

			bot.setHtmlWithSelection( '<a href="http://cksource.com" name="test">[foo]</a>' );

			bot.dialog( 'link', function( dialog ) {
				dialog.setValueOf( 'info', 'url', 'http://ckeditor.com' );
				dialog.getButton( 'ok' ).click();

				assert.areSame( '<a href="http://ckeditor.com" name="test">foo</a>', bot.getData( true ) );
			} );
		},

		'test unlink command states': function() {
			var bot = this.editorBots.noValidation,
				unlink = bot.editor.getCommand( 'unlink' );


			bot.setHtmlWithSelection( '<a href="http://ckeditor.com">^foo</a>' );
			assert.isTrue( unlink.state == CKEDITOR.TRISTATE_OFF, 'collapsed in link' );
			bot.setHtmlWithSelection( '^foo' );
			assert.isTrue( unlink.state == CKEDITOR.TRISTATE_DISABLED, 'collapsed not in link' );
			bot.setHtmlWithSelection( '<a href="http://ckeditor.com" name="test">[<i contenteditable="false">bar</i>]</a>' );
			assert.isTrue( unlink.state == CKEDITOR.TRISTATE_OFF, 'fake selection on non-editable element in link' );
		},

		// https://dev.ckeditor.com/ticket/9212
		'test getSelectedLink for selection inside read-only node': function() {
			var bot = this.editorBots.noValidation,
				editor = bot.editor;

			bot.setHtmlWithSelection( 'foo<span contenteditable="false">ba^r</span>bum' );
			assert.isNull( CKEDITOR.plugins.link.getSelectedLink( editor ) );
		},

		'test getSelectedLink for fake selection on non-editable element': function() {
			var bot = this.editorBots.noValidation,
				editor = bot.editor;

			bot.setHtmlWithSelection( 'foo<a href="http://ckeditor.com">[<i contenteditable="false">bar</i>]</a>bum' );
			assert.areSame( 'a', CKEDITOR.plugins.link.getSelectedLink( editor ).getName() );
		},

		'test create link on a non-editable inline element': function() {
			var bot = this.editorBots.noValidation,
				editor = bot.editor;

			bot.setHtmlWithSelection( 'foo[<em contenteditable="false">bar</em>]bum' );
			bot.dialog( 'link', function( dialog ) {
				dialog.setValueOf( 'info', 'url', 'http://ckeditor.com' );
				dialog.getButton( 'ok' ).click();

				assert.areSame( 'foo<a href="http://ckeditor.com"><em contenteditable="false">bar</em></a>bum', bot.getData( true ) );
				assert.isTrue( !!editor.getSelection().isFake );
			} );
		},

		'test edit link on a non-editable inline element': function() {
			var bot = this.editorBots.noValidation,
				editor = bot.editor;

			bot.setHtmlWithSelection( 'foo<a href="http://ckeditor.com">[<em contenteditable="false">bar</em>]</a>bum' );
			bot.dialog( 'link', function( dialog ) {
				dialog.setValueOf( 'info', 'url', 'http://cksource.com' );
				dialog.getButton( 'ok' ).click();

				assert.areSame( 'foo<a href="http://cksource.com"><em contenteditable="false">bar</em></a>bum', bot.getData( true ) );
				assert.isTrue( !!editor.getSelection().isFake );
			} );
		},

		'test unlink on a non-editable inline element': function() {
			var bot = this.editorBots.noValidation,
				editor = bot.editor;

			bot.setHtmlWithSelection( 'foo<a href="http://ckeditor.com">[<em contenteditable="false">bar</em>]</a>bum' );
			editor.execCommand( 'unlink' );

			assert.areSame( 'foo<em contenteditable="false">bar</em>bum', bot.getData( true ) );
			assert.isTrue( !!editor.getSelection().isFake );
		},

		'test edit link which contents equals its href': function() {
			var bot = this.editorBots.noValidation,
				editor = bot.editor;

			bot.setHtmlWithSelection( 'foo<a href="http://ckeditor.com" data-cke-saved-href="http://ckeditor.com">http://ckedi^tor.com</a>bum' );
			bot.dialog( 'link', function( dialog ) {
				dialog.setValueOf( 'info', 'url', 'http://cksource.com' );
				dialog.getButton( 'ok' ).click();

				assert.areSame( 'foo<a href="http://cksource.com">http://cksource.com</a>bum', bot.getData( true ) );
				assert.areSame( 'http://cksource.com', editor.getSelection().getSelectedText(), 'content of a link was selected' );
			} );
		},

		'test edit selected text': function() {
			var bot = this.editorBots.noValidation,
				expected = 'aa <a href="http://ckeditor.com">[foo]</a> cc';

			bot.setHtmlWithSelection( 'aa [bb] cc' );

			bot.dialog( 'link', function( dialog ) {
				var displayTextInput = dialog.getContentElement( 'info', 'linkDisplayText' );
				dialog.setValueOf( 'info', 'url', 'http://ckeditor.com' );

				assert.isTrue( displayTextInput.isVisible(), 'Display text input visibility' );
				assert.areSame( dialog.getValueOf( 'info', 'linkDisplayText' ), 'bb' );

				dialog.setValueOf( 'info', 'linkDisplayText', 'foo' );
				dialog.getButton( 'ok' ).click();
				assert.areSame( expected, bender.tools.getHtmlWithSelection( bot.editor ) );
			} );
		},

		'test edit existing link': function() {
			var bot = this.editorBots.noValidation,
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
			var bot = this.editorBots.noValidation;

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
			var bot = this.editorBots.noValidation,
				expected = '<a href="http://ckeditor.com">&lt;img src="" onerror="alert( 1 );"&gt;</a>';

			// If entities plugin is present (e.g. built version) also quotes will be encoded.
			if ( bot.editor.plugins.entities ) {
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
			var bot = this.editorBots.noValidation;

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
			var bot = this.editorBots.noValidation;

			bot.setHtmlWithSelection( '[<a href="http://ckeditor.com">http://ckeditor.<strong>com</strong></a>].' );

			bot.dialog( 'link', function( dialog ) {
				assert.areSame( dialog.getValueOf( 'info', 'linkDisplayText' ), 'http://ckeditor.com' );
				dialog.setValueOf( 'info', 'url', 'http://example.dev' );
				dialog.getButton( 'ok' ).click();
				assert.areSame( '<a href="http://example.dev">http://ckeditor.<strong>com</strong></a>.', bot.getData( true ) );
			} );
		},

		'test changing inner text of link with same href and inner text': function() {
			var bot = this.editorBots.noValidation;

			// Note it's crucial to include data-cke-saved-href attribute to reproduce this issue.
			bot.setHtmlWithSelection( '<p>aa [<a href="http://foobar" data-cke-saved-href="http://foobar">http://foobar</a>] bb</p>' );

			bot.dialog( 'link', function( dialog ) {
				dialog.setValueOf( 'info', 'linkDisplayText', 'foo' );
				dialog.getButton( 'ok' ).click();
				assert.areSame( '<p>aa <a href="http://foobar">foo</a> bb</p>', bot.getData( true ) );
			} );
		},

		'test link with a nested anchors without text change': function() {
			// https://dev.ckeditor.com/ticket/14848
			if ( CKEDITOR.env.ie && CKEDITOR.env.version == 8 ) {
				assert.ignore();
			}

			// Even though display text was not changed we have to remove nested, editable anchor elements.
			var bot = this.editorBots.noValidation;

			bot.setHtmlWithSelection( '[<em>foo </em><a href="aaa">bbb</a> <span contenteditable="false"><a href="aaa">ccc</a></span>]' );

			bot.dialog( 'link', function( dialog ) {
				dialog.setValueOf( 'info', 'url', 'newlink' );
				dialog.getButton( 'ok' ).click();
				assert.areSame( '<a href="http://newlink"><em>foo </em>bbb <span contenteditable="false"><a href="aaa">ccc</a></span></a>', bot.getData( true ) );
			} );
		},

		'test link with a nested strong with text change': function() {
			var bot = this.editorBots.noValidation;

			bot.setHtmlWithSelection( '[<a href="http://ckeditor.com">http://ckeditor.<strong>com</strong></a>].' );

			bot.dialog( 'link', function( dialog ) {
				dialog.setValueOf( 'info', 'linkDisplayText', 'foo' );
				dialog.setValueOf( 'info', 'url', 'http://example.dev' );
				dialog.getButton( 'ok' ).click();
				assert.areSame( '<a href="http://example.dev">foo</a>.', bot.getData( true ) );
			} );
		},

		'test changing inner text multiline': function() {
			var bot = this.editorBots.noValidation;

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
			var bot = this.editorBots.noValidation;

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
			var bot = this.editorBots.noValidation;

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
			this.editorBots.noValidation.assertInputOutput(
				'<p><a href="http://ckeditor.com">text</a></p>',
				/^<p><a data-cke-saved-href="http:\/\/ckeditor.com" href="http:\/\/ckeditor.com">text<\/a>(<br \/>)?<\/p>$/
			);
		},

		'test anchor passes filter': function() {
			this.editorBots.noValidation.assertInputOutput(
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

			this.editorBots.noValidation.assertInputOutput(
				'<p><a name="#idid"></a></p>',
				matchRegex
			);
		},

		// https://dev.ckeditor.com/ticket/11822
		'test select link on double-click': function() {
			var bot = this.editorBots.noValidation,
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

		// https://dev.ckeditor.com/ticket/11822
		'test select anchor on double-click': function() {
			var bot = this.editorBots.noValidation,
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

		// https://dev.ckeditor.com/ticket/11956
		'test select link with descendants on double-click': function() {
			var bot = this.editorBots.noValidation,
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

		// https://dev.ckeditor.com/ticket/13887
		'test link target special chars': function() {
			var bot = this.editorBots.noValidation;

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
			var bot = this.editorBots.noValidation;

			bot.setHtmlWithSelection( '<a href="http://ckeditor.com">[foo]</a>' );

			bot.dialog( 'link', function( dialog ) {
				dialog.setValueOf( 'target', 'linkTargetType', 'frame' );
				dialog.setValueOf( 'target', 'linkTargetName', '_self' );

				dialog.getButton( 'ok' ).click();

				assert.areSame( '<a href="http://ckeditor.com" target="_self">foo</a>', bot.getData( true ) );
			} );
		},

		// https://dev.ckeditor.com/ticket/5278
		'test link target with space': function() {
			var bot = this.editorBots.noValidation;

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
				editor = this.editorBots.noValidation.editor,
				showDisplayTextForElement = CKEDITOR.plugins.link.showDisplayTextForElement;

			assert.isFalse( showDisplayTextForElement( doc.findOne( 'input#blurTarget' ), editor ), 'Input element' );
			assert.isTrue( showDisplayTextForElement( doc.findOne( 'span' ), editor ), 'Span element' );
			assert.isTrue( showDisplayTextForElement( null, editor ), 'Null value' );
		},

		// https://dev.ckeditor.com/ticket/13062
		'test unlink when cursor is right before the link': function() {
			var bot = this.editorBots.noValidation,
				editor = bot.editor;

			bot.setHtmlWithSelection( '<p><a href="http://cksource.com">^Link</a></p>' );

			editor.ui.get( 'Unlink' ).click( editor );

			assert.areSame( '<p>^Link</p>', bot.htmlWithSelection() );
		},

		// https://dev.ckeditor.com/ticket/13062
		'test unlink when cursor is right after the link': function() {
			// IE8 fails this test for unknown reason; however it does well
			// in the manual one.
			if ( CKEDITOR.env.ie && CKEDITOR.env.version == 8 ) {
				assert.ignore();
			}

			var bot = this.editorBots.noValidation,
				editor = bot.editor;

			bot.setHtmlWithSelection( '<p><a href="http://cksource.com">Link^</a></p>' );

			resume( function() {
				editor.ui.get( 'Unlink' ).click( editor );
				assert.areSame( '<p>Link^</p>', bot.htmlWithSelection() );
			} );

			wait( 100 );
		},

		// https://dev.ckeditor.com/ticket/13062
		'test unlink when cursor is right before the link and there are more than one link in paragraph': function() {
			var bot = this.editorBots.noValidation,
				editor = bot.editor;

			bot.setHtmlWithSelection( '<p>I am<a href="http://foo"> an </a>in<a href="http://bar">sta</a>nce of <a href="http://ckeditor.com">^<s>CKEditor</s></a>.</p>' );

			editor.ui.get( 'Unlink' ).click( editor );

			assert.areSame( '<p>I am<a href="http://foo"> an </a>in<a href="http://bar">sta</a>nce of ^<s>CKEditor</s>.</p>', bot.htmlWithSelection() );
		},

		// (#859)
		'test edit link with selection': function() {
			var bot = this.editorBots.noValidation;

			bot.setData( '<p><a class="linkClass" href="linkUrl"><img src="someUrl"/>some button text</a>some text</p>', function() {
				var editable = bot.editor.editable();

				bot.editor.getSelection().selectElement( editable.findOne( 'a' ) );

				bot.dialog( 'link', function( dialog ) {
					assert.areSame( dialog.getValueOf( 'info', 'url' ), 'linkUrl' );
					dialog.hide();
				} );
			} );
		},

		// (#2154)
		'test phone number link without validation': assertPhoneLinks( {
			editorName: 'noValidation',
			incorrectInput: 'foo',
			correctInput: '123456789',
			incorrectLinkAssertionCallback: assertIncorrectLinks,
			correctLinkAssertionCallback: assertCorrectLinks
		} ),

		'test phone number link with validation': assertPhoneLinks( {
			editorName: 'validation',
			validate: true,
			incorrectInput: 'foo',
			correctInput: '123456789',
			incorrectLinkAssertionCallback: assertIncorrectLinks,
			correctLinkAssertionCallback: assertCorrectLinks
		} ),

		// (#2478)
		'test Ctrl+K keystroke': assertKeystroke( 75 ),

		'test Ctrl+L keystroke': assertKeystroke( 76 ),

		// https://dev.ckeditor.com/ticket/12189
		'test read from mail link with Subject and Body parameters provided': function() {
			var bot = this.editorBots.noValidation;

			bot.setHtmlWithSelection( '[<a href="mailto:job@cksource.com?Subject=Test%20subject&amp;Body=Test%20body">AJD</a>]' );

			bot.dialog( 'link', function( dialog ) {
				var linkTypeField = dialog.getContentElement( 'info', 'linkType' ),
					addressField = dialog.getContentElement( 'info', 'emailAddress' ),
					subjectField = dialog.getContentElement( 'info', 'emailSubject' ),
					bodyField = dialog.getContentElement( 'info', 'emailBody' );

				assert.areEqual( 'email', linkTypeField.getValue() );
				assert.areEqual( 'job@cksource.com', addressField.getValue() );
				assert.areEqual( 'Test subject', subjectField.getValue() );
				assert.areEqual( 'Test body', bodyField.getValue() );

				dialog.fire( 'ok' );
				dialog.hide();
			} );
		},

		// (#2138)
		'test email address with "?"': assertEmail( 'mailto:ck?editor@cksource.com' ),

		'test email address with two "?"': assertEmail( 'mailto:ck?edi?tor@cksource.com' ),

		'test email address with "?" at the beginning': assertEmail( 'mailto:?ck?editor@cksource.com' ),

		'test email address with "?" in domain': assertEmail( 'mailto:?ck?editor@cksou?rce.com' ),

		'test email address with "?" and arguments': assertEmail( 'mailto:ck?editor@cksource.com?subject=cke4&amp;body=hello' ),

		// (#2227)
		'test custom URL protocol': function() {
			var bot = this.editorBots.customProtocol;

			bot.dialog( 'link', function( dialog ) {
				assert.areEqual( 'https://', dialog.getContentElement( 'info', 'protocol' ).getValue() );
				dialog.hide();
			} );
		},

		// (#2227)
		'test other URL protocol': function() {
			var bot = this.editorBots.otherProtocol;

			bot.dialog( 'link', function( dialog ) {
				assert.areEqual( '', dialog.getContentElement( 'info', 'protocol' ).getValue() );
				dialog.hide();
			} );
		}
	} );

	function assertEmail( link ) {
		return function() {
			var bot = this.editorBots.noValidation;

			bot.setHtmlWithSelection( '<h1>Mail to <a href="' + link + '">[CKSource]</a>!</h1>' );

			bot.dialog( 'link', function( dialog ) {
				dialog.getButton( 'ok' ).click();

				assert.areSame( '<h1>Mail to <a href="' + link + '">CKSource</a>!</h1>', bot.getData() );
			} );
		};
	}

	function assertKeystroke( key ) {
		return function() {
			var bot = this.editorBots.noValidation,
				editor = bot.editor;

			bot.setData( '', function() {
				editor.once( 'dialogShow', function( evt ) {
					resume( function() {
						var dialog = evt.data;

						dialog.hide();
						assert.areSame( 'link', dialog._.name );
					} );
				} );

				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( {
					keyCode: key,
					ctrlKey: true
				} ) );
				wait();
			} );
		};
	}

	function assertPhoneLinks( config ) {
		return function() {
			var bot = this.editorBots[ config.editorName ];

			bot.setHtmlWithSelection( '^' );
			bot.dialog( 'link', function( dialog ) {
				if ( config.incorrectLinkAssertionCallback ) {
					config.incorrectLinkAssertionCallback( bot, dialog, config );
				}

				bot.dialog( 'link', function( dialog ) {
					if ( config.correctLinkAssertionCallback ) {
						config.correctLinkAssertionCallback( bot, dialog, config );
					}
				} );
			} );
		};
	}

	function assertIncorrectLinks( bot, dialog, config ) {
		var stub = sinon.stub( window, 'alert' ),
			editor = bot.editor,
			validate = config.validate;

		setLinkNameAndType( dialog );
		dialog.getButton( 'ok' ).click();

		assert.areEqual( 1, stub.callCount );
		assert.areEqual( editor.lang.link.noTel, stub.args[ 0 ][ 0 ] );

		dialog.setValueOf( 'info', 'telNumber', config.incorrectInput );
		dialog.getButton( 'ok' ).click();

		assert.areEqual( validate ? 2 : 1, stub.callCount );

		if ( validate ) {
			assert.areEqual( 'Invalid number', stub.args[ 1 ][ 0 ] );
			dialog.hide();
		}

		stub.restore();
	}

	function assertCorrectLinks( bot, dialog, config ) {
		var editor = bot.editor,
			expected = config.correctInput,
			input;

		setLinkNameAndType( dialog );
		dialog.setValueOf( 'info', 'telNumber', expected );

		input = CKEDITOR.document.findOne( 'input.cke_dialog_ui_input_tel' );

		assert.areEqual( 'tel', input.getAttribute( 'type' ), 'Input type should be \'tel\'' );
		dialog.getButton( 'ok' ).click();

		assert.areEqual( '<a href="tel:' + expected + '">foo</a>', editor.getData() );


		bot.dialog( 'link', function( dialog ) {
			assert.areEqual( 'tel', dialog.getValueOf( 'info', 'linkType' ), 'Link type should be \'tel\' ' );
			assert.areEqual( expected, dialog.getValueOf( 'info', 'telNumber' ), 'Phone number should be ' + expected );
			dialog.hide();
		} );
	}

	function setLinkNameAndType( dialog ) {
		dialog.setValueOf( 'info', 'linkDisplayText', 'foo' );
		dialog.setValueOf( 'info', 'linkType', 'tel' );
	}
} )();
