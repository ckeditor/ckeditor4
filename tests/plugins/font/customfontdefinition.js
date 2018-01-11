/* bender-ckeditor-plugins: font,toolbar,wysiwygarea */
/* bender-include: ./_helpers/tools.js */

/* global assertCombo */

( function() {
	'use strict';

	bender.editor = {
		config: {
			extraAllowedContent: 'span font(*){*}[*];strong em u;',
			font_style: {
				element: 'font',
				attributes: { 'face': '#(family)' },
				overrides: [ {
					element: 'font', attributes: { 'face': null }
				} ]
			},
			fontSize_sizes: '1/1;2/2;3/3;4/4;5/5;6/6;7/7;',
			fontSize_style: {
				element: 'font',
				attributes: { 'size': '#(size)' },
				overrides: [ {
					element: 'font', attributes: { 'size': null }
				} ]
			}
		}
	};

	bender.test( {
		'test setdata with font tag with face': function() {
			var editor = this.editor,
				bot = this.editorBot;

			bot.setData( '<p><font face="Courier New, Courier, monospace">foo bar baz</font></p>', function() {
				assert.beautified.html( '<p><font face="Courier New, Courier, monospace">foo bar baz</font></p>', editor.getData() );
			} );
		},

		'test apply font tag with face': function() {
			var editor = this.editor,
				bot = this.editorBot;

			bender.tools.selection.setWithHtml( editor, '<p>[foo]</p>' );
			assertCombo( 'Font', 'Courier New', false, bot, '<p><font face="Courier New, Courier, monospace">foo</font></p>' );
		},

		'test change font tag with face': function() {
			var editor = this.editor,
			bot = this.editorBot;

			bender.tools.selection.setWithHtml( editor, '<p><font face="Arial, Helvetica, sans-serif">[foo]</font></p>' );
			assertCombo( 'Font', 'Courier New', false, bot, '<p><font face="Courier New, Courier, monospace">foo</font></p>' );
		},

		'test remove font tag with face': function() {
			var editor = this.editor,
			bot = this.editorBot;

			bender.tools.selection.setWithHtml( editor, '<p><font face="Courier New, Courier, monospace">[foo]</font></p>' );
			assertCombo( 'Font', 'cke-default', false, bot, '<p>foo</p>' );
		},

		'test apply font tag with face in nested html': function() {
			var editor = this.editor,
			bot = this.editorBot;

			bender.tools.selection.setWithHtml( editor, '<p><strong>[fo<em>o] bar</em> baz</strong></p>' );
			assertCombo( 'Font', 'Courier New', false, bot,
				'<p><strong><font face="Courier New, Courier, monospace">fo</font><em><font face="Courier New, Courier, monospace">o</font> bar</em> baz<strong></p>' );
		},

		'test setdata with font tag with size': function() {
			var editor = this.editor,
			bot = this.editorBot;

			bot.setData( '<p><font size="7">foo bar baz</font></p>', function() {
				assert.beautified.html( '<p><font size="7">foo bar baz</font></p>', editor.getData() );
			} );
		},

		'test apply font tag with size': function() {
			var editor = this.editor,
			bot = this.editorBot;

			bender.tools.selection.setWithHtml( editor, '<p>[foo]</p>' );
			assertCombo( 'FontSize', '6', false, bot, '<p><font size="6">foo</font></p>' );
		},

		'test change font tag with size': function() {
			var editor = this.editor,
			bot = this.editorBot;

			bender.tools.selection.setWithHtml( editor, '<p><font size="2">[foo]</font></p>' );
			assertCombo( 'FontSize', '6', false, bot, '<p><font size="6">foo</font></p>' );
		},

		'test remove font tag with size': function() {
			var editor = this.editor,
			bot = this.editorBot;

			bender.tools.selection.setWithHtml( editor, '<p><font size="6">[foo]</font></p>' );
			assertCombo( 'FontSize', 'cke-default', false, bot, '<p>foo</p>' );
		},

		'test apply font tag with size in nested html': function() {
			var editor = this.editor,
			bot = this.editorBot;

			bender.tools.selection.setWithHtml( editor, '<p><strong>[fo<em>o] bar</em> baz</strong></p>' );
			assertCombo( 'FontSize', '6', false, bot,
				'<p><strong><font size="6">fo</font><em><font size="6">o</font> bar</em> baz<strong></p>' );
		}
	} );

} )();
