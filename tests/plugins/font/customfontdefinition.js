/* bender-ckeditor-plugins: font,toolbar,wysiwygarea */
/* bender-include: ../richcombo/_helpers/tools.js */
/* bender-include: ./_helpers/tools.js */

/* global richComboTools, fontTools */

( function() {
	'use strict';

	var classAttributes = {},
		dataAttributes = {};

	classAttributes[ 'class' ] = '#(size)';
	dataAttributes[ 'data-font' ] = '#(size)';

	bender.editors = {
		font: {
			config: {
				extraAllowedContent: 'span font(*){*}[*];strong em;',
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
		},

		classes: {
			config: {
				fontSize_sizes: 'small;medium',
				fontSize_style: {
					element: 'span',
					attributes: classAttributes
				}
			}
		},

		attributes: {
			config: {
				extraAllowedContent: 'span[data-font]',
				fontSize_sizes: 'small;medium',
				fontSize_style: {
					element: 'span',
					attributes: dataAttributes
				}
			}
		}
	};

	bender.test( {
		'test setdata with font tag with face': function() {
			var editor = this.editors.font,
				bot = this.editorBots.font;

			bot.setData( '<p><font face="Courier New, Courier, monospace">foo bar baz</font></p>', function() {
				assert.beautified.html( '<p><font face="Courier New, Courier, monospace">foo bar baz</font></p>', editor.getData() );
			} );
		},

		'test apply font tag with face': function() {
			var editor = this.editors.font,
				bot = this.editorBots.font;

			bender.tools.selection.setWithHtml( editor, '<p>[foo]</p>' );
			richComboTools.assertCombo( {
				comboName: 'Font',
				comboValue: 'Courier New',
				collapsed: false,
				bot: bot,
				resultHtml: '<p><font face="Courier New, Courier, monospace">foo</font>@</p>'
			} );
		},

		'test change font tag with face': function() {
			var editor = this.editors.font,
				bot = this.editorBots.font;

			bender.tools.selection.setWithHtml( editor, '<p><font face="Arial, Helvetica, sans-serif">[foo]</font></p>' );
			richComboTools.assertCombo( {
				comboName: 'Font',
				comboValue: 'Courier New',
				collapsed: false,
				bot: bot,
				resultHtml: '<p><font face="Courier New, Courier, monospace">foo</font>@</p>'
			} );
		},

		'test remove font tag with face': function() {
			var editor = this.editors.font,
				bot = this.editorBots.font;

			bender.tools.selection.setWithHtml( editor, '<p><font face="Courier New, Courier, monospace">[foo]</font></p>' );

			richComboTools.assertCombo( {
				comboName: 'Font',
				comboValue: fontTools.defaultValue,
				collapsed: false,
				bot: bot,
				resultHtml: '<p>foo@</p>'
			} );
		},

		'test apply font tag with face in nested html': function() {
			var editor = this.editors.font,
				bot = this.editorBots.font;

			bender.tools.selection.setWithHtml( editor, '<p><strong>[fo<em>o] bar</em> baz</strong></p>' );
			richComboTools.assertCombo( {
				comboName: 'Font',
				comboValue: 'Courier New',
				collapsed: false,
				bot: bot,
				resultHtml: '<p><strong><font face="Courier New, Courier, monospace">fo</font><em><font face="Courier New, Courier, monospace">o</font> bar</em> baz</strong>@</p>'
			} );
		},

		'test setdata with font tag with size': function() {
			var editor = this.editors.font,
				bot = this.editorBots.font;

			bot.setData( '<p><font size="7">foo bar baz</font></p>', function() {
				assert.beautified.html( '<p><font size="7">foo bar baz</font></p>', editor.getData() );
			} );
		},

		'test apply font tag with size': function() {
			var editor = this.editors.font,
				bot = this.editorBots.font;

			bender.tools.selection.setWithHtml( editor, '<p>[foo]</p>' );
			richComboTools.assertCombo( {
				comboName: 'FontSize',
				comboValue: '6',
				collapsed: false,
				bot: bot,
				resultHtml: '<p><font size="6">foo</font>@</p>'
			} );
		},

		'test change font tag with size': function() {
			var editor = this.editors.font,
				bot = this.editorBots.font;

			bender.tools.selection.setWithHtml( editor, '<p><font size="2">[foo]</font></p>' );
			richComboTools.assertCombo( {
				comboName: 'FontSize',
				comboValue: '6',
				collapsed: false,
				bot: bot,
				resultHtml: '<p><font size="6">foo</font>@</p>'
			} );
		},

		'test remove font tag with size': function() {
			var editor = this.editors.font,
				bot = this.editorBots.font;

			bender.tools.selection.setWithHtml( editor, '<p><font size="6">[foo]</font></p>' );
			richComboTools.assertCombo( {
				comboName: 'FontSize',
				comboValue: fontTools.defaultValue,
				collapsed: false,
				bot: bot,
				resultHtml: '<p>foo@</p>'
			} );
		},

		'test apply font tag with size in nested html': function() {
			var editor = this.editors.font,
				bot = this.editorBots.font;

			bender.tools.selection.setWithHtml( editor, '<p><strong>[fo<em>o] bar</em> baz</strong></p>' );
			richComboTools.assertCombo( {
				comboName: 'FontSize',
				comboValue: '6',
				collapsed: false,
				bot: bot,
				resultHtml: '<p><strong><font size="6">fo</font><em><font size="6">o</font> bar</em> baz</strong>@</p>'
			} );
		},

		// (#4555)
		'test applying font style with class attribute over already applied style with class attribute generates the content with only one font style': function() {
			var editor = this.editors.classes,
				bot = this.editorBots.classes;

			bender.tools.selection.setWithHtml( editor, '<p>[<span class="small">foo</span>]</p>' );
			richComboTools.assertCombo( {
				comboName: 'FontSize',
				comboValue: 'medium',
				collapsed: false,
				bot: bot,
				resultHtml: '<p><span class="medium">foo</span>@</p>'
			} );
		},

		// (#4555)
		'test applying font style with custom attribute over already applied style with custom attribute generates the content with only one font style': function() {
			var editor = this.editors.attributes,
				bot = this.editorBots.attributes;

			bender.tools.selection.setWithHtml( editor, '<p>[<span data-font="small">foo</span>]</p>' );
			richComboTools.assertCombo( {
				comboName: 'FontSize',
				comboValue: 'medium',
				collapsed: false,
				bot: bot,
				resultHtml: '<p><span data-font="medium">foo</span>@</p>'
			} );
		}
	} );
} )();
