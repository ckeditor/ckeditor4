/* bender-tags: editor */
/* bender-ckeditor-plugins: autolink,clipboard,link */

( function() {

	'use strict';

	bender.editors = {
		classic: {
			config: {
				removePlugins: 'link',
				allowedContent: true
			}
		},
		enterkey: {
			config: {
				removePlugins: 'link',
				extraPlugins: 'enterkey',
				allowedContent: true
			}
		},
		customCommitKeystrokes: {
			config: {
				removePlugins: 'link',
				allowedContent: true,
				autolink_commitKeystrokes: [
					37, // ArrowLeft
					38, // ArrowUp
					39, // ArrowRight
					40 // ArrowDown
				]
			}
		},
		encodedDefault: {
			config: {
				pasteFilter: null,
				emailProtection: 'encode'
			}
		},
		encodedCustom: {
			config: {
				pasteFilter: null,
				emailProtection: 'mt(NAME,DOMAIN,SUBJECT,BODY)'
			}
		}
	};

	var url = 'http://example.com^',
		email = 'mail@example.com^',
		expectedUrlLink = '<p><a href="http://example.com">http://example.com</a></p>',
		expectedEmailLink = '<p><a href="mailto:mail@example.com">mail@example.com</a></p>';

	bender.test( {
		setUp: function() {
			if ( CKEDITOR.env.ie && !CKEDITOR.env.edge ) {
				assert.ignore();
			}
		},

		// (#1815)
		'test press commit keystroke to finish link completion': function() {
			testTyping( this.editors.classic, 13, url, expectedUrlLink, 'Enter URL' );
			testTyping( this.editors.classic, 13, email, expectedEmailLink, 'Enter Email' );

			testTyping( this.editors.classic, 32, url, expectedUrlLink, 'Space URL' );
			testTyping( this.editors.classic, 32, email, expectedEmailLink, 'Space Email' );
		},

		// (#1815)
		'test enter commit keystroke not canceled': function() {
			testTyping( this.editors.enterkey, 13, url, expectedUrlLink, 'Enter URL' );
			testTyping( this.editors.enterkey, 13, email, expectedEmailLink, 'Enter Email' );
		},

		// (#1815)
		'test link completion with custom commit keystrokes': function() {
			testTyping( this.editors.customCommitKeystrokes, 37, url, expectedUrlLink, 'ArrowLeft URL' );
			testTyping( this.editors.customCommitKeystrokes, 37, email, expectedEmailLink, 'ArrowLeft email' );

			testTyping( this.editors.customCommitKeystrokes, 38, url, expectedUrlLink, 'ArrowUp URL' );
			testTyping( this.editors.customCommitKeystrokes, 38, email, expectedEmailLink, 'ArrowUp email' );

			testTyping( this.editors.customCommitKeystrokes, 39, url, expectedUrlLink, 'ArrowRight URL' );
			testTyping( this.editors.customCommitKeystrokes, 39, email, expectedEmailLink, 'ArrowRight email' );

			testTyping( this.editors.customCommitKeystrokes, 40, url, expectedUrlLink, 'ArrowDown URL' );
			testTyping( this.editors.customCommitKeystrokes, 40, email, expectedEmailLink, 'ArrowDown email' );
		},

		// (#1815)
		'test link completion with invalid commit keystroke': function() {
			testTyping( this.editors.classic, 93, 'http://example.com^', '<p>http://example.com</p>' ); // Backspace
			testTyping( this.editors.classic, 93, 'mail@example.com^', '<p>mail@example.com</p>' ); // Backspace
		},

		// (#1815)
		'test created protected mail link (string) on typing': function() {
			testTyping( this.editors.encodedCustom, 32, 'a@a^', '<p><a href="javascript:mt(\'a\',\'a\',\'\',\'\')">a@a</a></p>' ); // SPACE
		},

		// (#1815)
		'test created protected mail link (function) on typing': function() {
			testTyping( this.editors.encodedDefault, 32, 'a@a^', '<p><a href="javascript:void(location.href=\'mailto:\'+String.fromCharCode(97,64,97))">a@a</a></p>' ); // SPACE
		},

		// (#1815)
		'test typing after autolinked text': function() {
			// The issue doesn't exist on Webkit, although enabling this test for Webkit will result with false negative.
			if ( CKEDITOR.env.webkit ) {
				assert.ignore();
			}

			var editor = this.editors.classic;

			bender.tools.setHtmlWithSelection( editor, 'http://example.com^' );

			fireKeyEvent( editor, 32 ); // SPACE

			editor.insertHtml( '&nbsp;test', 'text' );

			assert.areEqual( '<p><a href="http://example.com">http://example.com</a>&nbsp;test</p>', editor.getData() );
		}
	} );

	function testTyping( editor, commitKeystroke, actual, expected, message ) {
		bender.tools.setHtmlWithSelection( editor, actual );

		fireKeyEvent( editor, commitKeystroke );

		assert.areEqual( expected, editor.getData(), message );
	}

	function fireKeyEvent( editor, keyCode ) {
		var domEvent = {
			getKey: function() {
				return keyCode;
			}
		};

		editor.fire( 'key', { keyCode: keyCode, domEvent: domEvent } );
	}
} )();
