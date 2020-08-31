/* bender-tags: editor */
/* bender-ckeditor-plugins: wysiwygarea, htmlwriter */

bender.test( {
	'test extra line break': function() {
		var data = '<div>Text <strong>inline</strong> Text <p>paragraph</p></div>';

		bender.editorBot.create( {
			name: 'basic1',
			formattedOutput: true,

			config: {
				allowedContent: true,

				on: {
					instanceReady: function( evt ) {
						evt.editor.dataProcessor.writer.setRules( 'p', {
							indent: true,
							breakBeforeOpen: true,
							breakAfterOpen: true,
							breakBeforeClose: true,
							breakAfterClose: true
						} );

						evt.editor.dataProcessor.writer.setRules( 'div', {
							indent: true,
							breakBeforeOpen: false,
							breakAfterOpen: true,
							breakBeforeClose: false,
							breakAfterClose: true
						} );
					}
				}
			}
		}, function( bot ) {
			bot.setData( data, function() {
				var afterFormat = bot.getData( false, false );

				// Trigger getData a second time to reveal bug.
				assert.areSame( afterFormat, bot.getData( false, false ) );
			} );
		} );
	},

	// (#965)
	'test config.forceSimpleAmpersand works in HTML element attributes': function() {
		var data = '<p><a href="http://www.blah.com?foo=1&bar=2">Test link</a></p>';

		bender.editorBot.create( {
			name: 'forceSimpleAmpersand',
			formattedOutput: true,
			config: {
				extraAllowedContent: 'a[href]',
				forceSimpleAmpersand: true
			}
		}, function( bot ) {
			bot.editor.dataProcessor.writer.setRules( 'p', {
				indent: false,
				breakAfterClose: false
			} );

			bot.setData( data, function() {
				assert.areSame( data, bot.getData( false, false ) );
			} );
		} );
	},

	// (#3795)
	'test dataIndentationChars with empty character': function() {
		// We are testing against indentation, not new line character. Preserve new lines for smoother comparison.
		var data = '<ol>\n<li>One</li>\n<li>Two</li>\n<li>Three</li>\n</ol>\n';

		bender.editorBot.create( {
			name: 'dataIndentationChars',
			formattedOutput: true,
			config: {
				allowedContent: true,
				dataIndentationChars: ''
			}
		}, function( bot ) {
			bot.editor.dataProcessor.writer.setRules( 'ol', {
				indent: true
			} );

			bot.editor.dataProcessor.writer.setRules( 'li', {
				indent: true
			} );

			bot.setData( data, function() {
				assert.areSame( data, bot.getData( false, false ) );
			} );
		} );
	}
} );
