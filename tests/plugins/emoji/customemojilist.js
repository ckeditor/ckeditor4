/* bender-tags: emoji */
/* bender-ckeditor-plugins: emoji,toolbar,stylescombo,format,clipboard */
/* bender-include: _helpers/tools.js */
/* global emojiTools */

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
			bender.tools.ignoreUnsupportedEnvironment( 'emoji' );
		},

		// (#2036)
		'test custom emoji list is load': function() {
			var editor = this.editors.classic;
			emojiTools.runAfterInstanceReady( editor, null, function( editor ) {
				assert.areSame( 1, editor._.emoji.list.length );
				objectAssert.areDeepEqual( { id: ':star:', symbol: '⭐', group: 'travel', keywords: [ 'star' ] }, editor._.emoji.list[ 0 ] );
			} );
		},

		'test invalid emoji list': function() {
			var editor = this.editors.classic2;
			emojiTools.runAfterInstanceReady( editor, null, function( editor ) {
				assert.isUndefined( editor._.emoji, 'editor._.emoji should not be initialised when invalid emoji file is loaded.' );
			} );
		},

		'test long ajax loading': function() {
			var server = sinon.fakeServer.create();

			server.respondWith( 'GET', /^http:\/\/random\.url(?:\/?\?.*)?$/, [ 200, { 'Content-Type': 'application/json' }, '[{"id":":bug:","symbol":"🐛"}]' ] );

			bender.editorBot.create( {
				name: 'created1',
				config: {
					emoji_emojiListUrl: 'http://random.url'
				},
				startupData: '<p>foo :grinning_face: bar :not_emoji: this :star: is converted emoji :bug:</p>'
			}, function( bot ) {
				emojiTools.runAfterInstanceReady( bot.editor, null, function( editor ) {
					assert.isUndefined( editor._.emoji, 'Emoji is loaded on this stage, what should not happen here.' );
					server.respond();
					assert.areSame( 1, editor._.emoji.list.length );
					objectAssert.areEqual( { id: ':bug:', symbol: '🐛' }, editor._.emoji.list[ 0 ] );
					server.restore();
				} );
			} );
		}
	} );

} )();
