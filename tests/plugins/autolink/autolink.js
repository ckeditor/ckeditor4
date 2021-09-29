/* bender-tags: editor */
/* bender-ckeditor-plugins: autolink,clipboard,sourcearea */
/* bender-include: ../clipboard/_helpers/pasting.js */
/* global assertPasteEvent */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			config: {
				allowedContent: true,
				pasteFilter: null
			}
		},
		optionalParameters: {
			config: {
				allowedContent: true,
				pasteFilter: null,
				removePlugins: 'link',
				autolink_urlRegex: /^https:\/\/foobar.com$/,
				autolink_emailRegex: /^foo@foobar\.com$/
			}
		},
		encodedDefault: {
			config: {
				allowedContent: true,
				pasteFilter: null,
				emailProtection: 'encode'
			}
		},
		encodedCustom: {
			config: {
				allowedContent: true,
				pasteFilter: null,
				emailProtection: 'mt(NAME,DOMAIN,SUBJECT,BODY)'
			}
		}
	};

	bender.test( {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'autolink' );
		},

		'test URL link with HTML tags': function() {
			var pastedTexts = [
				'https://<br>placekitten.com/g/200/301',
				'https://<br/>placekitten.com/g/200/302',
				'https://<br />placekitten.com/g/200/303',
				'https://place<b>kitten</b>.com/g/200/303'
			];

			var pastedText;

			while ( ( pastedText = pastedTexts.pop() ) ) {
				this.editors.classic.once( 'paste', function( evt ) {
					evt.cancel();

					assert.areSame( -1, evt.data.dataValue.search( /<a / ), 'text was not auto linked: ' + pastedText );
				}, null, null, 900 );

				this.editors.classic.execCommand( 'paste', pastedText );
			}
		},

		'test mail link with HTML tags': function() {
			var pastedTexts = [
				'<br>mail@example.com',
				'<br/>mail@example.com',
				'<br />mail@example.com',
				'<b>mail</b>@example.com'
			];

			var pastedText;

			while ( ( pastedText = pastedTexts.pop() ) ) {
				this.editors.classic.once( 'paste', function( evt ) {
					evt.cancel();

					assert.areSame( -1, evt.data.dataValue.search( /<a / ), 'text was not auto linked: ' + pastedText );
				}, null, null, 900 );

				this.editors.classic.execCommand( 'paste', pastedText );
			}
		},

		// https://dev.ckeditor.com/ticket/13419
		'test URL link with quotation marks': function() {
			var pastedText = 'https://foo.bar/?bam="bom"',
				expected = '<a href="https://foo.bar/?bam=%22bom%22">https://foo.bar/?bam="bom"</a>';

			assertPasteEvent( this.editors.classic, { dataValue: pastedText }, { dataValue: expected, type: 'html' } );
		},

		'test URL link with text after': function() {
			var pastedText = 'https://placekitten.com/g/210/300 nope';

			assertPasteEvent( this.editors.classic, { dataValue: pastedText }, { dataValue: pastedText, type: 'html' } );
		},

		// (#4858)
		'test URL link with encoded characters': function() {
			var pastedText = 'https://www.google.com/test/?one=one&amp;two=two&amp;three',
				expected = '<a href="https://www.google.com/test/?one=one&amp;two=two&amp;three">https://www.google.com/test/?one=one&amp;two=two&amp;three</a>',
				spy = sinon.spy( CKEDITOR.tools, 'htmlDecodeAttr' );

			assertPasteEvent( this.editors.classic, { dataValue: pastedText }, { dataValue: expected, type: 'html' } );

			spy.restore();

			// Ensure that the test is correct.
			assert.isTrue( spy.calledWithExactly( pastedText ), 'htmlDecodeAttr was called with incorrect input' );
		},

		'test mail link with text after': function() {
			var pastedText = 'mail@example.com nope';

			assertPasteEvent( this.editors.classic, { dataValue: pastedText }, { dataValue: pastedText, type: 'html' } );
		},

		'test URL link with text before': function() {
			var pastedText = 'nope https://placekitten.com/g/220/300';

			assertPasteEvent( this.editors.classic, { dataValue: pastedText }, { dataValue: pastedText, type: 'html' } );
		},

		'test mail link with text before': function() {
			var pastedText = 'nope mail@example.com';

			assertPasteEvent( this.editors.classic, { dataValue: pastedText }, { dataValue: pastedText, type: 'html' } );
		},

		'test URL link with text attached before': function() {
			var pastedText = 'nopehttps://placekitten.com/g/230/300';

			assertPasteEvent( this.editors.classic, { dataValue: pastedText }, { dataValue: pastedText, type: 'html' } );
		},

		'test various valid URL links': function() {
			var pastedTexts = [
				'https://placekitten.com/g/180/300',
				'http://giphy.com/gifs/space-nasa-test-GDiDCTh9AjbiM',
				'https://www.google.pl/webhp?sourceid=chrome-instant&ion=1&espv=2&ie=UTF-8#q=ebay',
				'http://www.legia.sport.pl/legia/1,139320,18079195.html#MTstream',
				'http://a.b-c.de'
			];

			var pastedText;

			while ( ( pastedText = pastedTexts.pop() ) ) {
				this.editors.classic.once( 'paste', function( evt ) {
					evt.cancel();

					pastedText = pastedText.replace( /&/g, '&amp;' );

					assert.areSame( '<a href="' + pastedText + '">' + pastedText + '</a>', evt.data.dataValue );
				}, null, null, 900 );

				this.editors.classic.execCommand( 'paste', pastedText );
			}
		},

		// (#3156)
		'test valid URL link with optional regex': function() {
			var pastedText = 'https://foobar.com',
				expected = '<a href="' + pastedText + '">' + pastedText + '</a>';

			assertPasteEvent( this.editors.optionalParameters, { dataValue: pastedText }, { dataValue: expected, type: 'html' } );
		},

		'test various valid email links': function() {
			var pastedTexts = [
				'mail@example.com',
				'mail@mail',
				// ? character is missing because of the (#2138) issue.
				".!#$%&'*+-/=^_`{|}~@1234567890",
				'mail@192.168.20.99'
			];

			var pastedText;

			while ( ( pastedText = pastedTexts.pop() ) ) {
				this.editors.classic.once( 'paste', function( evt ) {
					evt.cancel();

					pastedText = pastedText.replace( '&', '&amp;' );

					assert.areSame( '<a href="mailto:' + pastedText + '">' + pastedText + '</a>', evt.data.dataValue );
				}, null, null, 900 );

				this.editors.classic.execCommand( 'paste', pastedText );
			}
		},

		// (#3156)
		'test valid email link with optional regex': function() {
			var pastedText = 'foo@foobar.com',
				expected = '<a href="mailto:' + pastedText + '">' + pastedText + '</a>';

			assertPasteEvent( this.editors.optionalParameters, { dataValue: pastedText }, { dataValue: expected, type: 'html' } );
		},

		'test various invalid URL links': function() {
			var pastedTexts = [
				'https//placekitten.com/g/190/300',
				'https://placekitten.com/g/181/300.',
				'http://giphy.com?search',
				'https://www.google.pl,,,,',
				'http:///a'
			];

			var pastedText;

			while ( ( pastedText = pastedTexts.pop() ) ) {
				this.editors.classic.once( 'paste', function( evt ) {
					evt.cancel();

					assert.areSame( pastedText, evt.data.dataValue );
				}, null, null, 900 );

				this.editors.classic.execCommand( 'paste', pastedText );
			}
		},

		// (#3156)
		'test invalid URL link with optional regex': function() {
			var pastedText = 'https://fobar.com';

			assertPasteEvent( this.editors.optionalParameters, { dataValue: pastedText }, { dataValue: pastedText, type: 'html' } );
		},


		'test various invalid email links': function() {
			var pastedTexts = [
				'mail@',
				'@mail',
				'hello,world@host.com',
				'example@hello,world',
				'"@emai.com',
				'"example"@email.com'
			];

			var pastedText;

			while ( ( pastedText = pastedTexts.pop() ) ) {
				this.editors.classic.once( 'paste', function( evt ) {
					evt.cancel();

					assert.areSame( pastedText, evt.data.dataValue );
				}, null, null, 900 );

				this.editors.classic.execCommand( 'paste', pastedText );
			}
		},

		// (#3156)
		'test invalid email link with optional regex': function() {
			var pastedText = 'foo@fobar.com';

			assertPasteEvent( this.editors.optionalParameters, { dataValue: pastedText }, { dataValue: pastedText, type: 'html' } );
		},

		'test pasting multiple URL links': function() {
			var pastedText = 'http://en.wikipedia.org/wiki/Weasel http://en.wikipedia.org/wiki/Weasel';

			assertPasteEvent( this.editors.classic, { dataValue: pastedText }, { dataValue: pastedText, type: 'html' } );
		},

		'test pasting multiple email links': function() {
			var pastedText = 'example1@mail.com example2@mail.com';

			assertPasteEvent( this.editors.classic, { dataValue: pastedText }, { dataValue: pastedText, type: 'html' } );
		},

		'test pasting whole paragraph': function() {
			var pastedText =
				'A multi-channel operating <a href="http://en.wikipedia.org/wiki/Strategy">strategy</a>' +
				'drives the enabler, while the enablers strategically embrace the game-changing, ' +
				'<a id="organic" href="http://en.wikipedia.org/wiki/Organic">organic</a> and cross-enterprise ' +
				'<a href="mailto: cultures@mail.com">cultures</a>.';

			assertPasteEvent( this.editors.classic, { dataValue: pastedText }, { dataValue: pastedText, type: 'html' } );
		},

		'test content that is a link': function() {
			var pastedText = '<a href="http://en.wikipedia.org/wiki/Weasel">Weasel</a>';

			assertPasteEvent( this.editors.classic, { dataValue: pastedText }, { dataValue: pastedText, type: 'html' } );
		},

		'test type is changed once a link is created': function() {
			var pastedText = 'https://placekitten.com/g/180/300',
				expected = '<a href="' + pastedText + '">' + pastedText + '</a>';

			assertPasteEvent( this.editors.classic, { dataValue: pastedText, type: 'text' }, { dataValue: expected, type: 'html' } );
		},

		'test type is not changed if link was not found': function() {
			var pastedText = 'foo bar';

			assertPasteEvent( this.editors.classic, { dataValue: pastedText, type: 'text' }, { dataValue: pastedText, type: 'text' } );
		},

		'test internal paste is not autolinked': function() {
			var	editor = this.editors.classic,
				pastedText = 'https://foo.bar/g/185/310';

			this.editors.classic.once( 'paste', function( evt ) {
				evt.data.dataTransfer.sourceEditor = editor;
			}, null, null, 1 );

			this.editors.classic.once( 'paste', function( evt ) {
				evt.cancel();

				assert.areSame( pastedText, evt.data.dataValue );
			}, null, null, 900 );

			this.editors.classic.execCommand( 'paste', pastedText );
		},

		'test created protected mail link (function)': function() {
			var pastedText = 'a@a',
				expected = '<a href="javascript:void(location.href=\'mailto:\'+String.fromCharCode(97,64,97))">a@a</a>';

			assertPasteEvent( this.editors.encodedDefault, { dataValue: pastedText, type: 'text' }, function( data ) {
				assert.areEqual( 'html', data.type );
				assert.areEqual( expected, bender.tools.compatHtml( data.dataValue ) );
			} );
		},

		'test created protected mail link (string)': function() {
			var pastedText = 'a@a',
				expected = '<a href="javascript:mt(\'a\',\'a\',\'\',\'\')">a@a</a>';

			assertPasteEvent( this.editors.encodedCustom, { dataValue: pastedText, type: 'text' }, function( data ) {
				assert.areEqual( 'html', data.type );
				assert.areEqual( expected, bender.tools.compatHtml( data.dataValue ) );
			} );
		},

		// (#2756)
		'test commit keys inactive in source mode': function() {
			var editor = this.editors.classic;

			editor.setMode( 'source', function() {
				resume( function() {
					var keyCode = CKEDITOR.config.autolink_commitKeystrokes[ 0 ];
					editor.fire( 'key', {
						keyCode: keyCode,
						domEvent: {
							getKey: function() {
								return keyCode;
							}
						}
					} );
					assert.pass( 'Passed without errors' );
				} );
			} );

			wait();
		},

		// (#1824)
		'test link plugin is loaded': function() {
			bender.editorBot.create( {
				name: 'editor_link_loaded',
				config: {
					plugins: 'autolink'
				}
			}, function( bot ) {
				assert.isNotUndefined( bot.editor.plugins.link );
			} );
		}
	} );

} )();
