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
		'test custom emoji list is loadd': function() {
			var editor = this.editors.classic;

			if ( editor.status !== 'ready' ) {
				editor.once( function() {
					resume( function() {
						assertEmoji();
					} );
				} );
				wait();
			} else {
				assertEmoji();
			}

			function assertEmoji() {
				assert.areSame( 1, editor._.emoji.list.length );
				objectAssert.areEqual( { id: ':star:', symbol: '⭐' }, editor._.emoji.list[ 0 ] );
			}
		},

		'test invalid emoji list': function() {
			var editor = this.editors.classic2;

			if ( editor.status !== 'ready' ) {
				editor.once( function() {
					resume( function() {
						assertEmoji();
					} );
				} );
				wait();
			} else {
				assertEmoji();
			}

			function assertEmoji() {
				assert.isUndefined( editor._.emoji, 'There are created emoji private data, so emoji was loaded what is wrong for this case.' );
			}
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
					assert.isUndefined( editor._.emoji, 'Emoji is loaded on this stage, what should not happen here.' );
					server.respond();
					assert.areSame( 1, editor._.emoji.list.length );
					objectAssert.areEqual( { id: ':bug:', symbol: '🐛' }, editor._.emoji.list[ 0 ] );
					server.restore();
				}
			} );
		}
	} );

} )();
