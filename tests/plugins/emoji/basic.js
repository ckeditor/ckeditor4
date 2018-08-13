/* bender-tags: emoji */
/* bender-ckeditor-plugins: emoji,toolbar,stylescombo,format,clipboard,undo */
/* bender-include: _helpers/tools.js */
/* global emojiTools */

( function() {
	'use strict';


	bender.editors = {
		inline: {
			creator: 'inline',
			name: 'inline',
			startupData: '<p>foo:grinning_face:bar :not_emoji:</p>'
		},
		classic: {
			creator: 'replace',
			name: 'classic',
			startupData: '<p>foo:grinning_face:bar :not_emoji:</p>'
		},
		divarea: {
			creator: 'replace',
			name: 'divarea',
			startupData: '<p>foo:grinning_face:bar :not_emoji:</p>',
			config: {
				extraPlugins: 'divarea',
				emoji_minChars: 3
			}
		}
	};

	var stub = null;

	var singleTests = {
		'test for custom emoji characters': function() {
			var editor = this.editors.divarea,
				bot = this.editorBots.divarea;

			emojiTools.runAfterInstanceReady( editor, bot, function( editor, bot ) {
				var autocomplete = editor._.emoji.autocomplete;

				bot.setHtmlWithSelection( '<p>foo :da^</p>' );
				editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

				// Asserted data might not be initialised yet or reset to null value with `onTextUnmatch` method.
				emojiTools.assertIsNullOrUndefined( autocomplete.model.query );
				emojiTools.assertIsNullOrUndefined( autocomplete.model.data );

				// Handle throttle in autocomplete which by defualt is 20ms;
				setTimeout( function() {
					resume( function() {
						bot.setHtmlWithSelection( '<p>foo :dagg^</p>' );
						editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );
						assert.areSame( ':dagg', autocomplete.model.query, 'Model keeps wrong querry.' );
						assert.areSame( 1, autocomplete.model.data.length, 'Emoji result contains more than one result.' );
						objectAssert.areEqual( { id: ':dagger:', symbol: '🗡' }, autocomplete.model.data[ 0 ], 'Emoji result contains wrong result' );
						autocomplete.close();
					} );
				}, 50 );
				wait();
			} );
		}
	};

	var tests = {
		setUp: function() {
			if ( emojiTools.notSupportedEnvironment ) {
				assert.ignore();
			}

			// Fallback in case where ajax couldn't load before tests.
			var data = JSON.stringify( [
				{ id: ':bug:', symbol: '🐛' },
				{ id: ':dagger:', symbol: '🗡' },
				{ id: ':OK_hand:', symbol: '👌' }
			] );

			stub = sinon.stub( CKEDITOR.ajax, 'load', function( url, callback ) {
				if ( url.indexOf( 'emoji/_assets/emoji.json' ) !== -1 ) {
					callback( data );
				}
			} );
		},

		tearDown: function() {
			stub.restore();

			for ( var key in this.editorBots ) {
				var editor = this.editorBots[ key ].editor,
					autocomplete;

				if ( editor._.emoji ) {
					autocomplete = editor._.emoji.autocomplete;

					emojiTools.clearAutocompleteModel( autocomplete );
					autocomplete.close();
				}
			}
		},

		'test emoji objects are added to editor': function( editor ) {
			emojiTools.runAfterInstanceReady( editor, null, function( editor ) {
				assert.isObject( editor._.emoji, 'Emoji variable doesn\' exists.' );
				objectAssert.ownsKeys( [ 'list', 'autocomplete' ], editor._.emoji, 'Emoji variable is missing some keys.' );
			} );
		},

		'test emoji suggestion box has proper values': function( editor, bot ) {
			emojiTools.runAfterInstanceReady( editor, bot, function( editor, bot ) {
				var autocomplete = editor._.emoji.autocomplete;

				bot.setHtmlWithSelection( '<p>foo :bug^</p>' );
				editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );
				assert.areSame( ':bug', autocomplete.model.query, 'Model keeps wrong querry.' );
				assert.areSame( 1, autocomplete.model.data.length, 'Emoji result contains more than one result.' );
				objectAssert.areEqual( { id: ':bug:', symbol: '🐛' }, autocomplete.model.data[ 0 ], 'Emoji result contains wrong result' );
			} );
		},

		'test emoji are not actived when too few letters are written': function( editor, bot ) {
			emojiTools.runAfterInstanceReady( editor, bot, function( editor, bot ) {
				var autocomplete = editor._.emoji.autocomplete;
				bot.setHtmlWithSelection( '<p>foo :b^</p>' );
				editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

				// Asserted data might not be initialised yet or reset to null value with `onTextUnmatch` method.
				emojiTools.assertIsNullOrUndefined( autocomplete.model.query );
				emojiTools.assertIsNullOrUndefined( autocomplete.model.data );

			} );
		},

		// (#2167)
		'test emoji suggestion box is case insensitive': function( editor, bot ) {
			emojiTools.runAfterInstanceReady( editor, bot, function( editor, bot ) {
				var autocomplete = editor._.emoji.autocomplete,
					queries = [ ':OK_HAND', ':ok_hand', ':OK_hand', ':ok_HAND', ':Ok_hanD', 'oK_HANd' ];

				CKEDITOR.tools.array.forEach( queries, function( query, index ) {
					setTimeout( function() {
						resume();
						bot.setHtmlWithSelection( '<p>foo ' + query + '^</p>' );
						editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

						objectAssert.areEqual( { id: ':ok_hand:', symbol: '👌' }, autocomplete.model.data[ 0 ], 'Emoji result contains wrong result' );
					}, 50 * ( index + 1 ) );
					wait();
				} );
			} );
		},

		// (#2195)
		'test emoji suggestion box shouldn\'t appear inside text': function( editor, bot ) {
			emojiTools.runAfterInstanceReady( editor, bot, function( editor, bot ) {
				var autocomplete = editor._.emoji.autocomplete,
					editable = editor.editable();

				bot.setHtmlWithSelection( '<p>foo:bug^</p>' );

				// Delay assertions because of autocomplete throttle.
				setTimeout( function() {
					resume( function() {
						emojiTools.assertIsNullOrUndefined( autocomplete.model.query );
						emojiTools.assertIsNullOrUndefined( autocomplete.model.data );
					} );
				}, 50 );

				editable.fire( 'keyup', new CKEDITOR.dom.event( {} ) );
				wait();
			} );
		},

		// (#2195)
		'test emoji suggestion box should appear at the beginning of new line': function( editor, bot ) {
			emojiTools.runAfterInstanceReady( editor, bot, function( editor, bot ) {
				var autocomplete = editor._.emoji.autocomplete,
					editable = editor.editable();

				bot.setHtmlWithSelection( '<p>foo</p><p>:bug^</p>' );

				// Delay assertions because of autocomplete throttle.
				setTimeout( function() {
					resume( function() {
						objectAssert.areEqual( { id: ':bug:', symbol: '🐛' }, autocomplete.model.data[ 0 ], 'Emoji result contains wrong result' );
					} );
				}, 50 );

				editable.fire( 'keyup', new CKEDITOR.dom.event( {} ) );
				wait();
			} );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );
	CKEDITOR.tools.array.forEach( CKEDITOR.tools.objectKeys( singleTests ), function( key ) {
		if ( tests[ key ] === undefined ) {
			tests[ key ] = singleTests[ key ];
		}
	} );
	bender.test( tests );
} )();
