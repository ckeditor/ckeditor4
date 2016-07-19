/* bender-tags: editor,unit */
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
	}
} );
