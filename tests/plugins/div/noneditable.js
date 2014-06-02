/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: div,toolbar */

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
		'test creatediv in a selection containing non-editable divs': function() {
			var bot = this.editorBot,
				editor = this.editor;

			editor.focus();

			bot.setHtmlWithSelection(
				'<p>[AA</p>' +
				'<div contenteditable="false">BB</div>' +
				'<div contenteditable="false"><div>CC</div></div>' +
				'<p contenteditable="false">DD</p>' +
				'<p>EE]</p>' );

			var expectedHtml =
				'<div>' +
					'<p>[AA</p>' +
					'<div contenteditable="false">BB</div>' +
					'<div contenteditable="false"><div>CC</div></div>' +
					'<p contenteditable="false">DD</p>' +
					'<p>EE]</p>' +
				'</div>';

			bot.dialog( 'creatediv', function( dialog ) {
				dialog.getButton( 'ok' ).click();
				assert.isFalse( !!editor.getSelection().isFake );
				assert.areSame( expectedHtml, fixHtml( bot.htmlWithSelection() ), 'Non-editable divs remain untouched.' );
			} );
		},

		'test removediv from a selection containing non-editable divs': function() {
			var bot = this.editorBot,
				editor = this.editor;

			editor.focus();

			bot.setHtmlWithSelection(
				'<div>' +
					'<p>[AA</p>' +
					'<div contenteditable="false">BB</div>' +
					'<div contenteditable="false"><div>CC</div></div>' +
					'<p contenteditable="false">DD</p>' +
					'<p>EE]</p>' +
				'</div>' );

			var expectedHtml =
				'<p>[AA</p>' +
				'<div contenteditable="false">BB</div>' +
				'<div contenteditable="false"><div>CC</div></div>' +
				'<p contenteditable="false">DD</p>' +
				'<p>EE]</p>';

			bot.execCommand( 'removediv' );
			assert.isFalse( !!editor.getSelection().isFake );
			assert.areSame( expectedHtml, fixHtml( bot.htmlWithSelection() ), 'Only the outer, editable div is removed.' );
		},

		'test creatediv on a non-editable div': function() {
			var editor = this.editor,
				bot = this.editorBot;

			var html =
				'<p>x</p>' +
				'<div contenteditable="false" id="f">' +
					'<div>foo</div>' +
				'</div>' +
				'<p>x</p>',

				expectedHtml =
				'<p>x</p>' +
				'<div>' +
					'<div contenteditable="false" id="f">' +
						'<div>foo</div>' +
					'</div>' +
				'</div>' +
				'<p>x</p>';

			bot.setData( html, function() {
				editor.getSelection().fake( editor.document.getById( 'f' ) );

				bot.dialog( 'creatediv', function( dialog ) {
					dialog.getButton( 'ok' ).click();

					assert.areSame( expectedHtml, fixHtml( bot.getData() ), 'Non-editable div is wrapped with editable div.' );

					// For unknown reason fake selection isn't preserved in IE9.
					// Ignoring that assertion in IE9 at the moment.
					if ( !( CKEDITOR.env.ie && CKEDITOR.env.version == 9 ) )
						assert.isTrue( !!editor.getSelection().isFake );
				} );
			} );
		},

		'test removediv from a non-editable div': function() {
			var editor = this.editor,
				bot = this.editorBot;

			var html =
				'<p>x</p>' +
				'<div contenteditable="false" id="f">' +
					'<div>foo</div>' +
				'</div>' +
				'<p>x</p>'

			bot.setData( html, function() {
				editor.getSelection().fake( editor.document.getById( 'f' ) );

				bot.execCommand( 'removediv' );
				assert.areSame( html, fixHtml( bot.getData() ), 'No div is removed, non-editable div remains untouched.' );
				assert.isTrue( !!editor.getSelection().isFake );
			} );
		},

		'test removediv from an editable div containing a non-editable div': function() {
			var editor = this.editor,
				bot = this.editorBot;

			bot.setHtmlWithSelection(
				'<div>' +
					'<p>[x</p>' +
					'<div contenteditable="false" id="f">' +
						'<div>foo</div>' +
					'</div>' +
					'<p>x]</p>' +
				'</div>' );

			var expectedHtml =
				'<p>[x</p>' +
				'<div contenteditable="false" id="f">' +
					'<div>foo</div>' +
				'</div>' +
				'<p>x]</p>';

			bot.execCommand( 'removediv' );
			assert.isFalse( !!editor.getSelection().isFake );
			assert.areSame( expectedHtml, fixHtml( bot.htmlWithSelection() ), 'Outer, editable div is removed, non-editable div remains untouched.' );
		},

		'test removediv from a non-editable div withing editable div': function() {
			var editor = this.editor,
				bot = this.editorBot;

			var html =
				'<div>' +
					'<div contenteditable="false" id="f">' +
						'<div>foo</div>' +
					'</div>' +
				'</div>',

				expectedHtml =
				'<div contenteditable="false" id="f">' +
					'<div>foo</div>' +
				'</div>';

			bot.setData( html, function() {
				editor.getSelection().fake( editor.document.getById( 'f' ) );

				bot.execCommand( 'removediv' );
				assert.areSame( expectedHtml, fixHtml( bot.getData() ), 'Outer, editable div is removed, non-editable div remains untouched.' );
				assert.isTrue( !!editor.getSelection().isFake );
			} );
		}
	} );
} )();