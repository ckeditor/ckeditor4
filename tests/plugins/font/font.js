/* bender-ckeditor-plugins: font,toolbar */

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
		ffArial = 'font-family:arial,helvetica,sans-serif',
		ffCS = 'font-family:comic sans ms,cursive';

	bender.test( {
		'test apply font size (collapsed selection)': function() {
			var bot = this.editorBot,
				editor = this.editor;

			bot.combo( 'FontSize', function( combo ) {
				combo.onClick( 48 );
				editor.insertText( 'foo' );
				assert.isInnerHtmlMatching( '<p><span style="font-size:48px">foo</span>@</p>',
					editor.editable().getHtml(), htmlMatchingOpts );

				this.wait( function() {
					// Click again to exit the style.
					bot.combo( 'FontSize', function( combo ) {
						combo.onClick( 48 );
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
			bot.combo( 'FontSize', function( combo ) {
				combo.onClick( 48 );
				assert.isInnerHtmlMatching( '<p><span style="font-size:48px">foo</span>@</p>',
					bot.editor.editable().getHtml(), htmlMatchingOpts );
			} );
		},

		'test apply font size over another font size (collapsed selection)': function() {
			var bot = this.editorBot,
				editor = bot.editor;

			bender.tools.selection.setWithHtml( bot.editor, '<p>x<span style="font-size:48px">f{}oo</span>x</p>' );
			bot.combo( 'FontSize', function( combo ) {
				combo.onClick( 24 );

				this.wait( function() {
					// We lose (dunno where) the empty span on IE8, so let's insert something.
					editor.insertText( 'bar' );
					assert.isInnerHtmlMatching(
						'<p>x<span style="font-size:48px">f</span><span style="font-size:24px">bar</span><span style="font-size:48px">oo</span>x@</p>',
						editor.editable().getHtml(), htmlMatchingOpts );
				}, 0 );
			} );
		},

		'test apply font size over another font size (collapsed selection in empty span)': function() {
			var bot = this.editorBot,
				editor = bot.editor;

			bender.tools.selection.setWithHtml( bot.editor, '<p>x<span style="font-size:48px"><em>[]</em></span>x</p>' );
			bot.combo( 'FontSize', function( combo ) {
				combo.onClick( 24 );

				this.wait( function() {
					// We lose (dunno where) the empty span on IE8, so let's insert something.
					editor.insertText( 'bar' );
					assert.isInnerHtmlMatching( '<p>x<em><span style="font-size:24px">bar</span></em>x@</p>', editor.editable().getHtml(), htmlMatchingOpts );
					assert.areSame( 1, editor.editable().find( 'span' ).count(), 'there is only one span in the editable' );
				}, 0 );
			} );
		},

		'test apply font size over another font size (collapsed selection at the existing span boundary)': function() {
			var bot = this.editorBot,
				editor = bot.editor;

			bender.tools.selection.setWithHtml( bot.editor, '<p>x<span style="font-size:48px">{}foo</span>x</p>' );
			bot.combo( 'FontSize', function( combo ) {
				combo.onClick( 24 );

				this.wait( function() {
					// We lose (dunno where) the empty span on IE8, so let's insert something.
					editor.insertText( 'bar' );
					assert.isInnerHtmlMatching(
						'<p>x<span style="font-size:24px">bar</span><span style="font-size:48px">foo</span>x@</p>',
						editor.editable().getHtml(), htmlMatchingOpts );
				}, 0 );
			} );
		},

		'test apply font size over another font size (text selection)': function() {
			var bot = this.editorBot,
				editor = bot.editor;

			bender.tools.selection.setWithHtml( bot.editor, '<p>x<span style="font-size:48px">f{o}o</span>x</p>' );
			bot.combo( 'FontSize', function( combo ) {
				combo.onClick( 24 );
				assert.isInnerHtmlMatching(
					'<p>x<span style="font-size:48px">f</span><span style="font-size:24px">o</span><span style="font-size:48px">o</span>x@</p>',
					editor.editable().getHtml(), htmlMatchingOpts );
			} );
		},

		'test apply font size over another font size (the existing span selection)': function() {
			var bot = this.editorBot,
				editor = bot.editor;

			bender.tools.selection.setWithHtml( bot.editor, '<p>x<span style="font-size:48px">{foo}</span>x</p>' );
			bot.combo( 'FontSize', function( combo ) {
				combo.onClick( 24 );
				assert.isInnerHtmlMatching(
					'<p>x<span style="font-size:24px">foo</span>x@</p>',
					editor.editable().getHtml(), htmlMatchingOpts );
			} );
		},

		'test apply font size over another font size (selection containing other span)': function() {
			var bot = this.editorBot,
				editor = bot.editor;

			bender.tools.selection.setWithHtml( bot.editor, '<p>x{f<span style="font-size:48px">o</span>o}x</p>' );
			bot.combo( 'FontSize', function( combo ) {
				combo.onClick( 24 );
				assert.isInnerHtmlMatching(
					'<p>x<span style="font-size:24px">foo</span>x@</p>',
					editor.editable().getHtml(), htmlMatchingOpts );
			} );
		},

		'test apply font size over another font size (deeply nested text selection)': function() {
			var bot = this.editorBot,
				editor = bot.editor;

			bender.tools.selection.setWithHtml( bot.editor, '<p>x<span style="font-size:48px"><em>f{o}o</em></span>x</p>' );
			bot.combo( 'FontSize', function( combo ) {
				combo.onClick( 24 );
				assert.isInnerHtmlMatching(
					'<p>x<span style="font-size:48px"><em>f</em></span><span style="font-size:24px"><em>o</em></span><span style="font-size:48px"><em>o</em></span>x@</p>',
					editor.editable().getHtml(), htmlMatchingOpts );
			} );
		},

		'test apply font size over another font size (deeply nested collapsed selection)': function() {
			var bot = this.editorBot,
				editor = bot.editor;

			bender.tools.selection.setWithHtml( bot.editor, '<p>x<span style="font-size:48px"><em>f<u class="y">{}o</u>o</em></span>x</p>' );
			bot.combo( 'FontSize', function( combo ) {
				combo.onClick( 24 );

				this.wait( function() {
					editor.insertText( 'bar' );
					assert.isInnerHtmlMatching(
						'<p>x<span style="font-size:48px"><em>f</em></span>' +
						'<em><u class="y"><span style="font-size:24px">bar</span></u></em>' +
						'<span style="font-size:48px"><em><u class="y">o</u>o</em></span>x@</p>',
						editor.editable().getHtml(), htmlMatchingOpts );
				}, 0 );
			} );
		},

		'test apply font size over font family (check possible false positive match)': function() {
			var bot = this.editorBot,
				editor = bot.editor;

			bender.tools.selection.setWithHtml( bot.editor, '<p>x<span style="' + ffArial + '">f{o}o</span>x</p>' );
			bot.combo( 'FontSize', function( combo ) {
				combo.onClick( 24 );
				assert.isInnerHtmlMatching(
					'<p>x<span style="' + ffArial + '">f<span style="font-size:24px">o</span>o</span>x@</p>',
					editor.editable().getHtml(), htmlMatchingOpts );
			} );
		},

		'test apply font family over another font family (text selection)': function() {
			var bot = this.editorBot,
				editor = bot.editor;

			bender.tools.selection.setWithHtml( bot.editor, '<p>x<span style="' + ffArial + '">f{o}o</span>x</p>' );
			bot.combo( 'Font', function( combo ) {
				combo.onClick( 'Comic Sans MS' );
				assert.isInnerHtmlMatching(
					'<p>x<span style="' + ffArial + '">f</span><span style="' + ffCS + '">o</span><span style="' + ffArial + '">o</span>x@</p>',
					editor.editable().getHtml(), htmlMatchingOpts );
			} );
		}
	} );
} )();