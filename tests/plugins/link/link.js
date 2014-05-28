/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: link,toolbar */

( function() {
	'use strict';

	bender.editor = {
		config: {
			autoParagraph: false
		}
	};

	bender.test( {
		'test create link': function() {
			// TODO: focus is required in Firefox with inline creator.
			if ( CKEDITOR.env.gecko && this.editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE )
				assert.ignore();

			var bot = this.editorBot;
			bot.dialog( 'link', function( dialog ) {
				// Should auto trim leading spaces. (#6845)
				dialog.setValueOf( 'info', 'url', ' ckeditor.com' );
				dialog.getButton( 'ok' ).click();

				// TODO: For weird reason this's needed for IE.
				CKEDITOR.env.ie && CKEDITOR.document.getById( 'blurTarget' ).focus();
				assert.areEqual( '<a href="http://ckeditor.com">http://ckeditor.com</a>', bot.getData( true ) );
			} );
		},

		'test create link (with editor focus)': function() {
			var bot = this.editorBot;
			bot.editor.focus();

			bot.dialog( 'link', function( dialog ) {
				dialog.setValueOf( 'info', 'url', 'ckeditor.com' );
				dialog.getButton( 'ok' ).click();

				assert.areEqual( '<a href="http://ckeditor.com">http://ckeditor.com</a>', bot.getData( true ) );
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
			var bot = this.editorBot,
				editor = this.editor;

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
			var matchRegex = CKEDITOR.env.ie && CKEDITOR.env.version == 8 ?
				/^<p><img alt="[^"]+" class="cke_anchor" data-cke-real-element-type="anchor" data-cke-real-node-type="1" data-cke-realelement="[^"]+" src="data:image[^"]+" title="[^"]+" \/><\/p>$/ :
				/^<p><img align="" alt="[^"]+" class="cke_anchor" data-cke-real-element-type="anchor" data-cke-real-node-type="1" data-cke-realelement="[^"]+" src="data:image[^"]+" title="[^"]+" \/>(<br \/>)?<\/p>$/;

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
		}
	} );
} )();