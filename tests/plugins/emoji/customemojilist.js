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
			startupData: '<p>foo :grinning_face: bar :not_emoji: this is not converted emoji :star:</p>'
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
			assert.areSame( '<p>foo :grinning_face: bar :not_emoji: this is not converted emoji :star:</p>', editor.getData(), 'Checking startup data' );
			assert.isUndefined( editor._.emojiList, 'There is no emoji list loaded' );
		},

		'test long ajax loading': function() {
			var server = sinon.fakeServer.create();

			server.respondWith( 'GET', 'http://random.url', [ 200, { 'Content-Type': 'application/json' }, '[{"id":":bug:","symbol":"🐛"}]' ] );

			bender.editorBot.create( {
				name: 'created1',
				config: {
					emoji_emojiListUrl: 'http://random.url'
				},
				startupData: '<p>foo :grinning_face: bar :not_emoji: this :star: is converted emoji :bug:</p>'
			}, function( bot ) {
				var editor = bot.editor;

				if ( editor.status !== 'ready' ) {
					editor.once( 'instanceReady', function() {
						resume( function() {
							assertAfterReady();
						} );
					}, null, null, 1000 );
					wait();
				} else {
					assertAfterReady();
				}

				function assertAfterReady() {
					server.respond();
					assert.areSame( '<p>foo :grinning_face: bar :not_emoji: this :star: is converted emoji 🐛</p>', editor.getData() );
					server.restore();
				}
			} );
		}
	} );

} )();
