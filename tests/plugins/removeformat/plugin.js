/* bender-tags: editor */
/* bender-ckeditor-plugins: wysiwygarea,removeformat */

bender.editor = {
	config: {
		autoParagraph: false,
		allowedContent: true
	}
};

bender.test(
{
	'test remove format always fire editor#selectionChange': function() {
		var ed = this.editor, bot = this.editorBot;
		bot.setHtmlWithSelection( '[<p style="text-align:right">foo</p>]' );
		ed.once( 'selectionChange', function() {
			assert.isTrue( true, '"selectionChange" event always fired after remove format.' );
		} );
		ed.execCommand( 'removeFormat' );
	},

	'test remove format inside nested editable': function() {
		var editor = this.editor,
			bot = this.editorBot;

		bot.setHtmlWithSelection( '<p>foo</p><div contenteditable="false"><p contenteditable="true">[<b>foo</b> bar]</p></div>' );

		bot.editor.execCommand( 'removeFormat' );
		assert.areEqual( '<p>foo</p><div contenteditable="false"><p contenteditable="true">foo bar</p></div>', bot.getData() );

		var nestedE = editor.document.findOne( 'p[contenteditable=true]' ),
			sel = editor.getSelection();

		assert.areSame( nestedE, sel.getCommonAncestor(), 'Selection should not leak from nested editable' );
	},


	'test remove format outside the contenteditable=false': function() {
		// Strong outside the non-editable should be removed.
		var bot = this.editorBot;
		bot.setHtmlWithSelection( '<p><strong>[<span contenteditable="false">foo</span>]</strong></p>' );
		bot.editor.execCommand( 'removeFormat' );
		assert.areEqual( '<p><span contenteditable="false">foo</span></p>', bot.getData() );
	},

	'test remove format outside of multiple contenteditable=false': function() {
		// Now remove formatting from range with two non-editables separated with a text node.
		var bot = this.editorBot;
		bot.setHtmlWithSelection( '<p><strong>[<span contenteditable="false">foo</span>x<span contenteditable="false">foo</span>]</strong></p>' );
		bot.editor.execCommand( 'removeFormat' );
		assert.areEqual( '<p><span contenteditable="false">foo</span>x<span contenteditable="false">foo</span></p>', bot.getData() );
	},

	'test remove format won\'t strip contenteditable formatting': function() {
		var bot = this.editorBot;
		// For the time being our goal is not to remove styles from editables nested within non-editables.
		// So in the following sample, formatting should not be removed.
		bot.setHtmlWithSelection( '<p>' +
				'<strong>' +
					'[before' +
					'<span contenteditable="false">' +
						'<em>non-editable strong</em>' +
						'<span contenteditable="true">' +
							'<em>editable strong</em>' +
						'</span>' +
					'</span>' +
					'after]' +
				'</strong>' +
			'</p>' );
		var expected = '<p>' +
				'before' +
				'<span contenteditable="false">' +
					'<em>non-editable strong</em>' +
					'<span contenteditable="true">' +
						'<em>editable strong</em>' +
					'</span>' +
				'</span>' +
				'after' +
			'</p>';

		bot.editor.execCommand( 'removeFormat' );
		assert.areEqual( expected, bot.getData(), 'Formatting was not removed' );
	},

	'test remove format selection in non-editable': function() {
		var bot = this.editorBot;

		bot.setHtmlWithSelection( '<p>' +
				'<strong>[before</strong>' +
				'<span contenteditable="false">' +
					'<em>noneditable strong</em>' +
				'</span>]' +
				'<i>after</i>' +
			'</p>' );
		var expected = '<p>' +
					'before' +
					'<span contenteditable="false">' +
						'<em>noneditable strong</em>' +
					'</span>' +
					'<i>after</i>' +
			'</p>';

		bot.editor.execCommand( 'removeFormat' );
		assert.areEqual( expected, bot.getData() );
	},

	'test remove format selection in nested editable': function() {
		var bot = this.editorBot;

		bender.tools.selection.setWithHtml( this.editor, '<h1><em>fo{o</em></h1>' +
			'<div contenteditable="false">' +
				'<div contenteditable="true">' +
					'<em>bar</em>' +
				'</div>' +
			'</div>' +
			'<p><em>}baz</em></p>' );

		var expected = '<h1><em>fo</em>o</h1>' +
			'<div contenteditable="false">' +
				'<div contenteditable="true">' +
					'<em>bar</em>' +
				'</div>' +
			'</div>' +
			'<p><em>baz</em></p>';

		bot.editor.execCommand( 'removeFormat' );

		var data = bot.getData();

		bender.assert.isInnerHtmlMatching( expected, data );
	},

	// https://dev.ckeditor.com/ticket/12311
	'test remove format for cite element': function() {
		this.editorBot.setHtmlWithSelection( '<p>[foo <cite>bar</cite> baz]</p>' );
		this.editor.execCommand( 'removeFormat' );

		assert.areEqual( '<p>foo bar baz</p>', this.editor.getData(), 'Cite element should be removed.' );
	},

	'test editor#addRemoveFormatFilter': function() {
		bender.editorBot.create( {
			name: 'test_editor2',
			config: { allowedContent: true }
		}, function( bot ) {
			bot.setHtmlWithSelection( '<p>[<span style="color:red">foo</span> <b>bar</b>]</p>' );

			bot.editor.addRemoveFormatFilter( function( element ) {
				return !element.is( 'b' ); // Don't remove 'b' elements.
			} );

			bot.editor.execCommand( 'removeFormat' );
			assert.areEqual( '<p>foo <b>bar</b></p>', bot.getData() );
		} );
	},

	// (#2451)
	'test remove format keeps selection': function() {
		var editor = this.editor,
			html = '<ol><li><h1>[Test]</h1></li></ol>',
			filter = new CKEDITOR.htmlParser.filter( {
				text: function( value ) {
					return value.replace( '{', '[' ).replace( '}', ']' );
				},
				elements: {
					br: function() {
						return false;
					}
				}
			} );

		bender.tools.selection.setWithHtml( editor, html );
		editor.execCommand( 'removeFormat' );

		assert.beautified.html( html, bender.tools.selection.getWithHtml( editor ), { customFilters: [ filter ] } );
	},

	// (#4008)
	'test remove format with collapsed selection': function() {
		var editor = this.editor;

		this.editorBot.setHtmlWithSelection( '<p><strong>Hello,^</strong></p>' );

		editor.execCommand( 'removeFormat' );
		editor.insertText( 'World!' );

		assert.areEqual( '<p><strong>Hello,</strong>World!</p>', editor.getData() );
	}
} );
