/* bender-ckeditor-plugins: font,toolbar */
/* bender-include: ./_helpers/tools.js */
/* global fontTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			extraAllowedContent: 'em u(*)'
		}
	};

	var htmlMatchingOpts = {
			fixStyles: true
		},
		ffArial = 'font-family:Arial,Helvetica,sans-serif',
		ffCS = 'font-family:Comic Sans MS,cursive',
		ffCourierNew = 'font-family:Courier New,Courier,monospace';

	bender.test( {
		_should: {
			ignore: {
				'test apply font size over another font size (collapsed selection in empty span)':
				CKEDITOR.env.webkit && !CKEDITOR.env.chrome
			}
		},

		assertCombo: function( comboName, comboValue, collapsed, bot, resultHtml, callback ) {
			bot.combo( comboName, function( combo ) {
				combo.onClick( comboValue );

				this.wait( function() {
					// The empty span from collapsed selection is lost on FF and IE8, insert something to prevent that.
					collapsed && bot.editor.insertText( 'bar' );
					assert.isInnerHtmlMatching( resultHtml, bot.editor.editable().getHtml(), htmlMatchingOpts );
					callback && callback( bot );
				}, 0 );
			} );
		},

		'test apply font size (collapsed selection)': function() {
			// (#3180)
			if ( CKEDITOR.env.ie && CKEDITOR.env.version === 9 ) {
				assert.ignore();
			}

			var bot = this.editorBot,
				editor = this.editor;

			bot.combo( 'FontSize', function( combo ) {
				combo.onClick( 48 );
				editor.insertText( 'foo' );
				assert.isInnerHtmlMatching( '<p><span style="font-size:48px">foo</span>@</p>',
					editor.editable().getHtml(), htmlMatchingOpts );

				this.wait( function() {
					// Click again to exit the style.
					// Since 4.8.0, 2nd click on the same menu item does not unselect it.
					// It is required to click on the '(Default)' option to reset style (#584).
					bot.combo( 'FontSize', function( combo ) {
						combo.onClick( fontTools.defaultValue );
						this.wait( function() {
							editor.insertText( 'bar' );
							assert.isInnerHtmlMatching( '<p><span style="font-size:48px">foo</span>bar@</p>',
								editor.editable().getHtml(), htmlMatchingOpts );
						}, 0 );
					} );
				}, 0 );
			} );
		},

		'test apply font size (text selection)': function() {
			var bot = this.editorBot;

			bender.tools.selection.setWithHtml( bot.editor, '<p>{foo}</p>' );
			this.assertCombo( 'FontSize', 48, false, bot, '<p><span style="font-size:48px">foo</span>@</p>' );
		},

		'test apply font size over another font size (collapsed selection)': function() {
			var bot = this.editorBot;

			bender.tools.selection.setWithHtml( bot.editor, '<p>x<span style="font-size:48px">f{}oo</span>x</p>' );
			this.assertCombo( 'FontSize', 24, true, bot,
				'<p>x<span style="font-size:48px">f</span><span style="font-size:24px">bar</span><span style="font-size:48px">oo</span>x@</p>' );
		},

		'test apply font size over another font size (collapsed selection in empty span)': function() {
			var bot = this.editorBot;

			bender.tools.selection.setWithHtml( bot.editor, '<p>x<span style="font-size:48px"><em>[]</em></span>x</p>' );
			this.assertCombo( 'FontSize', 24, true, bot,
				'<p>x<em><span style="font-size:24px">bar</span></em>x@</p>',
				function( bot ) {
					assert.areSame( 1, bot.editor.editable().find( 'span' ).count(), 'there is only one span in the editable' );
				} );
		},

		'test apply font size over another font size (collapsed selection at the existing span boundary)': function() {
			var bot = this.editorBot;

			bender.tools.selection.setWithHtml( bot.editor, '<p>x<span style="font-size:48px">{}foo</span>x</p>' );
			this.assertCombo( 'FontSize', 24, true, bot,
				'<p>x<span style="font-size:24px">bar</span><span style="font-size:48px">foo</span>x@</p>' );
		},

		'test apply font size over another font size (text selection)': function() {
			var bot = this.editorBot;

			bender.tools.selection.setWithHtml( bot.editor, '<p>x<span style="font-size:48px">f{o}o</span>x</p>' );
			this.assertCombo( 'FontSize', 24, false, bot,
				'<p>x<span style="font-size:48px">f</span><span style="font-size:24px">o</span><span style="font-size:48px">o</span>x@</p>' );
		},

		'test apply font size over another font size (the existing span selection)': function() {
			var bot = this.editorBot;

			bender.tools.selection.setWithHtml( bot.editor, '<p>x<span style="font-size:48px">{foo}</span>x</p>' );
			this.assertCombo( 'FontSize', 24, false, bot, '<p>x<span style="font-size:24px">foo</span>x@</p>' );
		},

		'test apply font size over another font size (selection containing other span)': function() {
			var bot = this.editorBot;

			bender.tools.selection.setWithHtml( bot.editor, '<p>x{f<span style="font-size:48px">o</span>o}x</p>' );
			this.assertCombo( 'FontSize', 24, false, bot, '<p>x<span style="font-size:24px">foo</span>x@</p>' );
		},

		'test apply font size over another font size (deeply nested text selection)': function() {
			var bot = this.editorBot;

			bender.tools.selection.setWithHtml( bot.editor, '<p>x<span style="font-size:48px"><em>f{o}o</em></span>x</p>' );
			this.assertCombo( 'FontSize', 24, false, bot,
				'<p>x<span style="font-size:48px"><em>f</em></span><span style="font-size:24px"><em>o</em></span><span style="font-size:48px"><em>o</em></span>x@</p>' );
		},

		'test apply font size over another font size (deeply nested collapsed selection)': function() {
			// https://dev.ckeditor.com/ticket/12690
			if ( CKEDITOR.env.safari ) {
				assert.ignore();
			}

			var bot = this.editorBot;

			bender.tools.selection.setWithHtml( bot.editor, '<p>x<span style="font-size:48px"><em>f<u class="y">{}o</u>o</em></span>x</p>' );
			this.assertCombo( 'FontSize', 24, true, bot,
				'<p>x<span style="font-size:48px"><em>f</em></span><em><u class="y"><span style="font-size:24px">bar</span></u></em>' +
				'<span style="font-size:48px"><em><u class="y">o</u>o</em></span>x@</p>' );
		},

		'test apply font size over font family (check possible false positive match)': function() {
			var bot = this.editorBot;

			bender.tools.selection.setWithHtml( bot.editor, '<p>x<span style="' + ffArial + '">f{o}o</span>x</p>' );
			this.assertCombo( 'FontSize', 24, false, bot, '<p>x<span style="' + ffArial + '">f<span style="font-size:24px">o</span>o</span>x@</p>' );
		},

		'test apply font family over another font family (text selection)': function() {
			var bot = this.editorBot;

			bender.tools.selection.setWithHtml( bot.editor, '<p>x<span style="' + ffArial + '">f{o}o</span>x</p>' );
			this.assertCombo( 'Font', 'Comic Sans MS', false, bot,
				'<p>x<span style="' + ffArial + '">f</span><span style="' + ffCS + '">o</span><span style="' + ffArial + '">o</span>x@</p>' );
		},

		// https://dev.ckeditor.com/ticket/14856
		'test reapply font family on the beginning (collapsed selection)': function() {
			if ( CKEDITOR.env.safari ) {
				assert.ignore();
			}

			var bot = this.editorBot;

			bender.tools.selection.setWithHtml( bot.editor, '<p>x<span style="' + ffArial + '"><em>{}foo</em></span>x</p>' );
			this.assertCombo( 'Font', 'Comic Sans MS', true, bot,
				'<p>x<em><span style="' + ffCS + '">bar</span></em><span style="' + ffArial + '"><em>foo</em></span>x@</p>' );
		},

		'test reapply font family in the middle (collapsed selection)': function() {
			var bot = this.editorBot;

			bender.tools.selection.setWithHtml( bot.editor, '<p>x<span style="' + ffArial + '"><em>fo{}o</em></span>x</p>' );
			this.assertCombo( 'Font', 'Comic Sans MS', true, bot,
				'<p>x<span style="' + ffArial + '"><em>fo</em></span><em><span style="' + ffCS + '">bar</span></em>' +
				'<span style="' + ffArial + '"><em>o</em></span>x@</p>' );
		},

		'test reapply font size on the end (collapsed selection)': function() {
			var bot = this.editorBot;

			bender.tools.selection.setWithHtml( bot.editor, '<p>x<span style="font-size:12px"><em>foo{}</em></span>x</p>' );
			this.assertCombo( 'FontSize', 24, true, bot,
				'<p>x<span style="font-size:12px"><em>foo</em></span><em><span style="font-size:24px">bar</span></em>x@</p>' );
		},

		// #584
		'test remove font size from text': function() {
			var bot = this.editorBot;
			bender.tools.selection.setWithHtml( bot.editor, '<p><span style="font-size:12px">[foo]</span></p>' );
			this.assertCombo( 'FontSize', fontTools.defaultValue, false, bot, '<p>foo@</p>' );
		},

		'test remove font family from text': function() {
			var bot = this.editorBot;
			bender.tools.selection.setWithHtml( bot.editor, '<p><span style="' + ffArial + '">[foo]</span></p>' );
			this.assertCombo( 'Font', fontTools.defaultValue, false, bot, '<p>foo@</p>' );
		},

		'test remove font size partialy from text': function() {
			var bot = this.editorBot;
			bender.tools.selection.setWithHtml( bot.editor, '<p><span style="font-size:24px">[foo ]bar</span></p>' );
			this.assertCombo( 'FontSize', fontTools.defaultValue, false, bot, '<p>foo <span style="font-size:24px">bar</span>@</p>' );
		},

		'test remove font family partially from text': function() {
			var bot = this.editorBot;
			bender.tools.selection.setWithHtml( bot.editor, '<p><span style="' + ffArial + '">[foo ]bar</span></p>' );
			this.assertCombo( 'Font', fontTools.defaultValue, false, bot, '<p>foo <span style="' + ffArial + '">bar</span>@</p>' );
		},

		'test remove font size from unstyled text': function() {
			var bot = this.editorBot;
			bender.tools.selection.setWithHtml( bot.editor, '<p>[foo]</p>' );
			this.assertCombo( 'FontSize', fontTools.defaultValue, false, bot, '<p>foo@</p>' );
		},

		'test remove font family from unstyled text': function() {
			var bot = this.editorBot;
			bender.tools.selection.setWithHtml( bot.editor, '<p>[foo]</p>' );
			this.assertCombo( 'Font', fontTools.defaultValue, false, bot, '<p>foo@</p>' );
		},

		'test reapply this same font size twice': function() {
			var bot = this.editorBot;
			bender.tools.selection.setWithHtml( bot.editor, '<p>[foo]</p>' );

			bot.combo( 'FontSize', function( combo ) {
				combo.onClick( 24 );
				this.wait( function() {
					combo.onClick( 24 );
					this.wait( function() {
						assert.isInnerHtmlMatching( '<p><span style="font-size:24px">foo</span>@</p>', bot.editor.editable().getHtml(), htmlMatchingOpts );
					}, 0 );
				}, 0 );
			} );

		},

		'test reapply this same font family twice': function() {
			var bot = this.editorBot;
			bender.tools.selection.setWithHtml( bot.editor, '<p>[foo]</p>' );

			bot.combo( 'Font', function( combo ) {
				combo.onClick( 'Arial' );
				this.wait( function() {
					combo.onClick( 'Arial' );
					this.wait( function() {
						assert.isInnerHtmlMatching( '<p><span style="' + ffArial + '">foo</span>@</p>', bot.editor.editable().getHtml(), htmlMatchingOpts );
					}, 0 );
				}, 0 );
			} );
		},

		// (#1040)
		'test apply new style to entire selection if partially present': function() {
			var bot = this.editorBot;
			bender.tools.selection.setWithHtml( bot.editor, '<h1><span style="' + ffCourierNew + '">[Hello</span> world!]</h1>' );

			bot.combo( 'Font', function( combo ) {
				combo.onClick( 'Courier New' );
				this.wait( function() {
					assert.isInnerHtmlMatching( '<h1><span style="' + ffCourierNew + '">Hello world!</span>@</h1>', bot.editor.editable().getHtml(), htmlMatchingOpts );
				}, 0 );
			} );
		},

		// (#1040)
		'test if styles are not changed if applied second time on the part of already styled element': function() {
			var bot = this.editorBot;
			bender.tools.selection.setWithHtml( bot.editor, '<h1><span style="' + ffCourierNew + '">[Hel]lo</span> world!</h1>' );

			bot.combo( 'Font', function( combo ) {
				combo.onClick( 'Courier New' );
				this.wait( function() {
					assert.isInnerHtmlMatching( '<h1><span style="' + ffCourierNew + '">Hello</span> world!@</h1>', bot.editor.editable().getHtml(), htmlMatchingOpts );
				}, 0 );
			} );
		}
	} );
} )();
