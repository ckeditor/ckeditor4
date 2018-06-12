/* bender-tags: emoji */
/* bender-ckeditor-plugins: emoji,toolbar,stylescombo,format,clipboard */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			name: 'classic',
			config: {
				emoji_emojiListUrl: '%BASE_PATH%/plugins/emoji/_assets/emoji.json'
			},
			startupData: '<p>foo :grinning_face: bar :not_emoji: this is converted emoji :star:</p>'
		},
		classic2: {
			name: 'classic2',
			config: {
				emoji_emojiListUrl: 'fake.url'
			},
			startupData: '<p>foo :grinning_face: bar :not_emoji: this is converted emoji :star:</p>'
		}
	};

	bender.test( {
		setUp: function() {
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
				assert.ignore();
			}
		},

		// #2036
		'test custom emoji list': function() {
			var editor = this.editors.classic,
				bot = this.editorBots.classic;

			assert.areSame( '<p>foo :grinning_face: bar :not_emoji: this is converted emoji ⭐</p>', editor.getData(), 'Checking startup data' );

			bot.setHtmlWithSelection( '<p>hello^world</p>' );
			editor.insertText( ':grinning_face::not_emoji::star:' );
			assert.areSame( '<p>hello:grinning_face::not_emoji:⭐world</p>', editor.getData() );
		},

		'test invalid emoji list': function() {
			var editor = this.editors.classic2;
			assert.areSame( '<p>foo :grinning_face: bar :not_emoji: this is converted emoji :star:</p>', editor.getData(), 'Checking startup data' );
			assert.isUndefined( editor._.emojiList, 'There is no emoji list loaded' );
		}
	} );

} )();
