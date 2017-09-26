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
	'test editor config.forceSimpleAmpersand in html element attributes': function () {
		var data = '<p><a href="http://www.blah.com?foo=1&bar=2">Test link</a></p>';
		bender.editorBot.create({
			name: 'basic_forceSimpleAmpersand',
			formattedOutput: true,

			config: {
				allowedContent: true,
				forceSimpleAmpersand: true,

				on: {
					instanceReady: function (evt) {
						var wrtierConfig = {
							indent: true,
							breakBeforeOpen: false,
							breakAfterOpen: false,
							breakBeforeClose: false,
							breakAfterClose: false
						};
						
						evt.editor.dataProcessor.writer.setRules('p', wrtierConfig);
						evt.editor.dataProcessor.writer.setRules('div', wrtierConfig);
					}
				}
			}
		}, function (bot) {
			bot.setData( data, function () {
				var afterFormat = bot.getData( false, false);

				// Trigger getData a second time to reveal bug.
				assert.areSame( afterFormat, data);
			});
		});
	}
} );