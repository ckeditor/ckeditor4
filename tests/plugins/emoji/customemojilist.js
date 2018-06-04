/* bender-tags: emoji */
/* bender-ckeditor-plugins: emoji,toolbar,stylescombo,format,clipboard */

( function() {
	'use strict';

	bender.editor = {
		name: 'classic',
		config: {
			emoji_emojiListUrl: '%BASE_PATH%/plugins/emoji/_assets/emoji.json'
		},
		startupData: '<p>foo :grinning_face: bar :not_emoji: this is converted emoji :star:</p>'
	};

	bender.test( {
		setUp: function() {
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
				assert.ignore();
			}
		},

		// #2036
		'test custom emoji list': function() {
			var editor = this.editor,
				bot = this.editorBot;

			assert.areSame( '<p>foo :grinning_face: bar :not_emoji: this is converted emoji ⭐</p>', editor.getData(), 'Checking startup data' );

			bot.setHtmlWithSelection( '<p>hello^world</p>' );
			editor.insertText( ':grinning_face::not_emoji::star:' );
			assert.areSame( '<p>hello:grinning_face::not_emoji:⭐world</p>', editor.getData() );
		}
	} );

} )();
