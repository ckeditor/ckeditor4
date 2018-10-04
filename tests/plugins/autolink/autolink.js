/* bender-tags: editor */
/* bender-ckeditor-plugins: autolink,clipboard,link */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			config: {
				allowedContent: true,
				pasteFilter: null,
				removePlugins: 'link'
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

		'test URL link with HTML tags': function() {
			var pastedTexts = [
				'https://<br>placekitten.com/g/200/301',
				'https://<br/>placekitten.com/g/200/302',
				'https://<br />placekitten.com/g/200/303',
				'https://place<b>kitten</b>.com/g/200/303'
			];

			var pastedText;

			while ( ( pastedText = pastedTexts.pop() ) ) {
				testPasteEvent( this.editors.classic, pastedText, pastedText, 'text was autolinked: ' + pastedText );
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
				testPasteEvent( this.editors.classic, pastedText, pastedText, 'text was not auto linked: ' + pastedText );
			}
		},

		// https://dev.ckeditor.com/ticket/13419
		'test URL link with quotation marks': function() {
			var pastedText = 'https://foo.bar/?bam="bom"',
				expected = '<a href="https://foo.bar/?bam=%22bom%22">https://foo.bar/?bam="bom"</a>';

			testPasteEvent( this.editors.classic, pastedText, expected );
		},

		'test URL link with text after': function() {
			var pastedText = 'https://placekitten.com/g/210/300 nope';

			testPasteEvent( this.editors.classic, pastedText, pastedText );
		},

		'test mail link with text after': function() {
			var pastedText = 'mail@example.com nope';

			testPasteEvent( this.editors.classic, pastedText, pastedText );
		},

		'test URL link with text before': function() {
			var pastedText = 'nope https://placekitten.com/g/220/300';

			testPasteEvent( this.editors.classic, pastedText, pastedText );
		},

		'test mail link with text before': function() {
			var pastedText = 'nope mail@example.com';

			testPasteEvent( this.editors.classic, pastedText, pastedText );
		},

		'test URL link with text attached before': function() {
			var pastedText = 'nopehttps://placekitten.com/g/230/300';

			testPasteEvent( this.editors.classic, pastedText, pastedText );
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
				testPasteEvent( this.editors.classic,
					pastedText,
					'<a href="' + pastedText + '">' + pastedText + '</a>',
					'autolink failed: ' + pastedText );
			}
		},

		'test various valid email links': function() {
			var pastedTexts = [
				'mail@example.com',
				'mail@mail',
				".!#$%&'*+-/=?^_`{|}~@1234567890",
				'mail@192.168.20.99'
			];

			var pastedText;

			while ( ( pastedText = pastedTexts.pop() ) ) {
				testPasteEvent( this.editors.classic,
					pastedText,
					'<a href="mailto:' + pastedText + '">' + pastedText + '</a>',
					'autolink failed: ' + pastedText );
			}
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
				testPasteEvent( this.editors.classic, pastedText, pastedText, 'text was autolinked: ' + pastedText );
			}
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
				testPasteEvent( this.editors.classic, pastedText, pastedText, 'text was autolinked: ' + pastedText );
			}
		},

		'test pasting multiple URL links': function() {
			var pastedText = 'http://en.wikipedia.org/wiki/Weasel http://en.wikipedia.org/wiki/Weasel';

			testPasteEvent( this.editors.classic, pastedText, pastedText );
		},

		'test pasting multiple email links': function() {
			var pastedText = 'example1@mail.com example2@mail.com';

			testPasteEvent( this.editors.classic, pastedText, pastedText );
		},

		'test pasting whole paragraph': function() {
			var pastedText =
				'A multi-channel operating <a href="http://en.wikipedia.org/wiki/Strategy">strategy</a>' +
				'drives the enabler, while the enablers strategically embrace the game-changing, ' +
				'<a id="organic" href="http://en.wikipedia.org/wiki/Organic">organic</a> and cross-enterprise ' +
				'<a href="mailto: cultures@mail.com">cultures</a>.';

			testPasteEvent( this.editors.classic, pastedText, pastedText );
		},

		'test content that is a link': function() {
			var pastedText = '<a href="http://en.wikipedia.org/wiki/Weasel">Weasel</a>';

			testPasteEvent( this.editors.classic, pastedText, pastedText );
		},

		'test created protected mail link (function)': function() {
			var pastedText = 'a@a',
				expected = '<a href="javascript:void(location.href=\'mailto:\'+String.fromCharCode(97,64,97))">a@a</a>';

			testPasteEvent( this.editors.encodedDefault, pastedText, expected );
		},

		'test created protected mail link (string)': function() {
			var pastedText = 'a@a',
				expected = '<a href="javascript:mt(\'a\',\'a\',\'\',\'\')">a@a</a>';

			testPasteEvent( this.editors.encodedCustom, pastedText, expected );
		}
	} );

	function testPasteEvent( editor, pastedText, expected, message ) {
		editor.once( 'afterPaste', function() {
			resume( function() {
				assert.areEqual( '<p>' + expected + '</p>', bender.tools.compatHtml( editor.getData() ), message );
				// Clean editor.
				editor.editable().setHtml( '' );
			} );
		} );

		editor.fire( 'paste', { dataValue: pastedText } );

		wait();
	}

} )();
