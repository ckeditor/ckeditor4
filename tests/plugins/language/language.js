/* bender-tags: editor */
/* bender-ckeditor-plugins: language,toolbar,removeformat,sourcearea */

( function() {
	'use strict';

	bender.editor = {
		config: {
			language_list: [ 'fr:French', 'es:Spanish', 'it:Italian', 'de:German:ltr', 'ar:Arabish:rtl', 'iw:Hebrew:rTL', 'ga:Irish' ]
		}
	};

	var tests = {
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
		},

		// #779
		'test remove format for language element': function() {
			this.editorBot.setHtmlWithSelection(
				'<p>[<span style="color:#ecf0f1"><span dir="ltr" lang="fr"><span style="background-color:#e74c3c">Lorem ipsum dolor somit</span></span></span>]</p>'
			);
			this.editor.execCommand( 'removeFormat' );
			assert.beautified.html( '<p><span dir="ltr" lang="fr">Lorem ipsum dolor somit</span></p>', this.editor.getData(), 'Span element with atrributes should not be removed.' );
		},

		'test coerces a correct value when the \'dir\' attribute is empty in RTL language': function() {
			var editor = this.editor,
				language = 'ar';

			editor.setMode( 'source', function() {
				resume( function() {
					editor.editable().setValue( '<p>foo <span lang="' + language + '" dir="">bar</span></p>' );
					editor.setMode( 'wysiwyg', function() {
						resume( function() {
							var expected = '<p>foo <span dir="rtl" lang="' + language + '">bar</span></p>';

							bender.assert.beautified.html( expected, editor.getData(), {
								sortAttributes: true,
								message: 'The value of dir attribute for ' + language + ' language is incorrect.'
							} );
						}, 50 );
					} );

					wait();
					editor.setData( '' );
				} );
			} );
			wait();
		},

		'test coerces a correct value when the \'dir\' attribute is empty in LTR language': function() {
			var editor = this.editor,
				language = 'en';

			editor.setMode( 'source', function() {
				resume( function() {
					editor.editable().setValue( '<p>foo <span lang="' + language + '" dir="">bar</span></p>' );
					editor.setMode( 'wysiwyg', function() {
						resume( function() {
							var expected = '<p>foo <span dir="ltr" lang="' + language + '">bar</span></p>';

							bender.assert.beautified.html( expected, editor.getData(), {
								sortAttributes: true,
								message: 'The value of dir attribute for ' + language + ' language is incorrect.'
							} );
						}, 50 );
					} );

					wait();
					editor.setData( '' );
				} );
			} );
			wait();
		},

		'test selection on lang element should toggle ON language button in LTR language': function() {
			bender.editorBot.create( {
				name: 'editor_lang_ltr',
				config: {
					plugins: 'language,toolbar',
					allowedContent: true
				}
			}, function( bot ) {
				var editor = bot.editor,
					inputHtml = '<p><span lang="fr">Sa^lut</span></p>',
					expectedButtonState = CKEDITOR.TRISTATE_ON;

				bot.setHtmlWithSelection( inputHtml );

				var languageButtonState = editor.ui.get( 'Language' ).getState();
				assert.areSame( expectedButtonState, languageButtonState );
			} );
		},

		'test selection on lang element should toggle ON language button in RTL language': function() {
			bender.editorBot.create( {
				name: 'editor_lang_rtl',
				config: {
					plugins: 'language,toolbar',
					allowedContent: true
				}
			}, function( bot ) {
				var editor = bot.editor,
					inputHtml = '<p><span lang="ar">أ^هلاً</span></p>',
					expectedButtonState = CKEDITOR.TRISTATE_ON;

				bot.setHtmlWithSelection( inputHtml );

				var languageButtonState = editor.ui.get( 'Language' ).getState();
				assert.areSame( expectedButtonState, languageButtonState );
			} );
		}
	},
	testLanguages = getTests();

	bender.test( testLanguages );

	function getTests() {
		var rtlLanguages = CKEDITOR.tools.object.keys( CKEDITOR.lang.rtl ),
			languages = CKEDITOR.tools.object.keys( CKEDITOR.lang.languages );

		var langTests = CKEDITOR.tools.array.reduce( languages, function( tests, language ) {
			var test = {},
				isRtlLanguage = CKEDITOR.tools.array.indexOf( rtlLanguages, language  ) !== -1,
				direction = isRtlLanguage ? 'rtl' : 'ltr',
				testName = 'test add proper missing \'dir\' attribute when language is ' +
					direction.toUpperCase() + ' type (' + language + ')';

			test[ testName ] = createTest( language, direction );

			return CKEDITOR.tools.object.merge( tests, test );
		}, {} );

		return CKEDITOR.tools.object.merge( tests, langTests );
	}

	function createTest( language, direction ) {
		return function() {
			var editor = this.editor,
				dir = direction === 'rtl' ? 'rtl' : 'ltr';

			editor.setMode( 'source', function() {
				resume( function() {
					editor.editable().setValue( '<p>foo <span lang="' + language + '">bar</span></p>' );
					editor.setMode( 'wysiwyg', function() {
						resume( function() {
							var expected = '<p>foo <span dir="' + dir + '" lang="' + language + '">bar</span></p>';

							bender.assert.beautified.html( expected, editor.getData(), {
								sortAttributes: true,
								message: 'The value of dir attribute for ' + language + ' language is incorrect.'
							} );
						}, 50 );
					} );

					wait();
					editor.setData( '' );
				} );
			} );
			wait();
		};
	}
} )();
