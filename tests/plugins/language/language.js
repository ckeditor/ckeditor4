/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: language,toolbar */

( function() {
	'use strict';

	bender.editor = {
		config: {
			language_list: [ 'fr:French', 'es:Spanish', 'it:Italian', 'de:German:ltr', 'ar:Arabish:rtl', 'iw:Hebrew:rTL', 'ga:Irish' ]
		}
	};

	bender.test( {
		// Helper method to return text (or html code) wrapped with html tag, containing given lang and dir (if any).
		//
		// @param {String} codeToWrap
		// @param {String} lang Language identifier i.e. 'en', 'de' etc.
		// @param {String} textDirection Text direction, one of two 'ltr' or 'rtl'.
		// @returns {String} Returns string from codeToWrap paramterer, wrapped with proper tag, and attrs.
		_getWrappedText: function( codeToWrap, lang, textDirection ) {
			var pluginWrapTagName = 'span',
				ret = '';

			ret += ( '<' + pluginWrapTagName );

			if ( textDirection )
				ret += ( ' dir="' + textDirection + '"' );

			if ( lang )
				ret += ( ' lang="' + lang + '"' );

			ret += ( '>' + codeToWrap + '</' + pluginWrapTagName + '>' );

			return ret;
		},

		'test sample selection': function() {
			var bot = this.editorBot,
				ed = this.editor,
				inputHtml = '<p>foo [bar baz]!</p>', // input html + selection
				expectedHtml = '<p>foo ' + this._getWrappedText( 'bar baz', 'es', 'ltr' ) + '!</p>';

			bot.setHtmlWithSelection( inputHtml );

			ed.execCommand( 'language', 'es' );

			assert.areEqual( expectedHtml, bender.tools.compatHtml( bot.getData(), 0, 1 ) );
		},

		'test invalid language attempt': function() {
			// Providing invalid language as an argument should not result with changing HTML.
			var bot = this.editorBot,
				ed = this.editor,
				inputHtml = '<p>foo [bar baz]!</p>', // input html + selection
				expectedHtml = '<p>foo bar baz!</p>';

			bot.setHtmlWithSelection( inputHtml );

			ed.execCommand( 'language', 'ru' );

			assert.areEqual( expectedHtml, bender.tools.compatHtml( bot.getData(), 0, 1 ) );
		},

		'test sample selection with rtl language': function() {
			var bot = this.editorBot,
				ed = this.editor,
				inputHtml = '<p>yet another[very test text] sample.</p>', // input html + selection
				expectedHtml = '<p>yet another' + this._getWrappedText( 'very test text', 'ar', 'rtl' ) + ' sample.</p>';

			bot.setHtmlWithSelection( inputHtml );

			ed.execCommand( 'language', 'ar' );

			assert.areEqual( expectedHtml, bender.tools.compatHtml( bot.getData(), 0, 1 ) );
		},

		'test multiline selection': function() {
			var bot = this.editorBot,
				ed = this.editor,
				inputHtml = '<p>foo [bar</p><p>baz</p><p>and the third] line</p><p>fourth line</p>', // input html + selection
				usedLang = 'es',
				usedLangDir = 'ltr',
				expectedHtml = '<p>foo ' + this._getWrappedText( 'bar', usedLang, usedLangDir ) + '</p><p>' +
					this._getWrappedText( 'baz', usedLang, usedLangDir ) + '</p><p>' +
					this._getWrappedText( 'and the third', usedLang, usedLangDir ) + ' line</p><p>' +
					'fourth line</p>';

			bot.setHtmlWithSelection( inputHtml );

			ed.execCommand( 'language', 'es' );

			assert.areEqual( expectedHtml, bender.tools.compatHtml( bot.getData(), 0, 1 ) );
		},

		'test language plugin no config': function() {
			var that = this;

			bender.editorBot.create( {
				name: 'test_no_config',
				config: {
					extraPlugins: 'language'
				}
			}, function( bot ) {
				var inputHtml = '<p>foo [bar baz]!</p>',
					expectedHtml = '<p>foo ' + that._getWrappedText( 'bar baz', 'es', 'ltr' ) + '!</p>';

				bot.setHtmlWithSelection( inputHtml );
				bot.editor.execCommand( 'language', 'es' );

				assert.areSame( expectedHtml, bender.tools.compatHtml( bot.getData(), 0, 1 ), 'One of default languages was not applied' );
			} );
		},

		'test removing language': function() {
			var bot = this.editorBot,
				ed = this.editor,
				inputHtml = '<p>foo <span lang="fr" dir="ltr">bar []baz</span>!</p>', // input html + selection
				expectedHtml = '<p>foo bar baz!</p>';

			bot.setHtmlWithSelection( inputHtml );

			ed.execCommand( 'language', 'fr' );

			assert.areEqual( expectedHtml, bender.tools.compatHtml( bot.getData(), 0, 1 ) );
		},

		'test removing language by range': function() {
			var bot = this.editorBot,
				ed = this.editor,
				inputHtml = '<p>foo <span lang="fr" dir="ltr">[bar baz]</span>!</p>', // input html + selection
				expectedHtml = '<p>foo bar baz!</p>';

			bot.setHtmlWithSelection( inputHtml );

			ed.execCommand( 'language', 'fr' );

			assert.areEqual( expectedHtml, bender.tools.compatHtml( bot.getData(), 0, 1 ) );
		}

	} );
} )();