/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: list,toolbar */

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: true
		}
	};

	function fixHtml( html ) {
		return bender.tools.compatHtml( html, 0, 1 );
	}

	bender.test( {
		'test applying list to selection containing non-editable inline elements': function() {
			var editor = this.editor,
				editable = editor.editable();

			editor.focus();

			this.editorBot.setHtmlWithSelection(
				'<p>[AA</p>' +
				'<p><span contenteditable="false">BB</span></p>' +
				'<p>c<span contenteditable="false">CC</span>c</p>' +
				'<p>DD]</p>' );

			editor.execCommand( 'numberedlist' );

			var expectedHtml =
				'<ol>' +
					'<li>AA</li>' +
					'<li><span contenteditable="false">BB</span></li>' +
					'<li>c<span contenteditable="false">CC</span>c</li>' +
					'<li>DD</li>' +
				'</ol>';

			assert.areSame( expectedHtml, fixHtml( editor.getData() ) );
		},

		'test removing list from a selection containing non-editable inline elements': function() {
			var editor = this.editor,
				editable = editor.editable();

			editor.focus();

			this.editorBot.setHtmlWithSelection(
				'<ol>' +
					'<li>[AA</li>' +
					'<li><span contenteditable="false">BB</span></li>' +
					'<li>c<span contenteditable="false">CC</span>c</li>' +
					'<li>DD]</li>' +
				'</ol>'
			);

			editor.execCommand( 'numberedlist' );

			var expectedHtml =
				'<p>AA</p>' +
				'<p><span contenteditable="false">BB</span></p>' +
				'<p>c<span contenteditable="false">CC</span>c</p>' +
				'<p>DD</p>';

			assert.areSame( expectedHtml, fixHtml( editor.getData() ) );
		},

		'test applying list to a non-editable div': function() {
			var editor = this.editor,
				bot = this.editorBot;

			bot.setData( '<p>x</p><div contenteditable="false" id="f"><div>foo</div></div><p>x</p>', function() {
				editor.getSelection().fake( editor.document.getById( 'f' ) );

				editor.execCommand( 'numberedlist' );
				assert.areSame( '<p>x</p><ol><li><div contenteditable="false" id="f"><div>foo</div></div></li></ol><p>x</p>', fixHtml( editor.getData() ) );
				assert.isTrue( !!editor.getSelection().isFake );
			} );
		},

		'test removing list from a non-editable div in a list': function() {
			var editor = this.editor,
				bot = this.editorBot;

			bot.setData( '<p>x</p><ol><li><div contenteditable="false" id="f"><div>foo</div></div></li></ol><p>x</p>', function() {
				editor.getSelection().fake( editor.document.getById( 'f' ) );

				editor.execCommand( 'numberedlist' );
				assert.areSame( '<p>x</p><div contenteditable="false" id="f"><div>foo</div></div><p>x</p>', fixHtml( editor.getData() ) );
				assert.isTrue( !!editor.getSelection().isFake );
			} );
		},

		'test applying list to a non-editable blocks, standard selection': function() {
			var editor = this.editor,
				bot = this.editorBot;

			this.editorBot.setHtmlWithSelection(
				'<p>x[x</p>' +
				'<div contenteditable="false">foo</div>' +
				'<p contenteditable="false">bar</p>' +
				'<p>x]x</p>'
			);

			editor.execCommand( 'numberedlist' );

			assert.areSame(
				'<ol>' +
					'<li>xx</li>' +
					'<li><div contenteditable="false">foo</div></li>' +
					'<li><p contenteditable="false">bar</p></li>' +
					'<li>xx</li>' +
				'</ol>',
				fixHtml( editor.getData() )
			);
		},

		'test removing list from a non-editable blocks, standard selection': function() {
			var editor = this.editor,
				bot = this.editorBot;

			this.editorBot.setHtmlWithSelection(
				'<ol>' +
					'<li>x[x</li>' +
					'<li><div contenteditable="false">foo</div></li>' +
					'<li><p contenteditable="false">bar</p></li>' +
					'<li>x]x</li>' +
				'</ol>'
			);

			editor.execCommand( 'numberedlist' );

			assert.areSame(
				'<p>xx</p>' +
				'<div contenteditable="false">foo</div>' +
				'<p contenteditable="false">bar</p>' +
				'<p>xx</p>',
				fixHtml( editor.getData() )
			);
		}
	} );

} )();