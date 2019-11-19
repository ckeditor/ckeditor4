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

	// Disable autocomplete throttling so the tests can be run synchronously.
	var throttle = CKEDITOR.tools.buffers.throttle,
		stub = null;

	sinon.stub( CKEDITOR.tools.buffers, 'throttle', function( minInterval, output, contextObj ) {
		return new throttle( 0, output, contextObj );
	} );

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

				bot.setHtmlWithSelection( '<p>foo :dagg^</p>' );
				editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );
				assert.areSame( ':dagg', autocomplete.model.query, 'Model keeps wrong query' );
				assert.areSame( 1, autocomplete.model.data.length, 'Emoji result contains more than one result' );
				objectAssert.areEqual( { id: ':dagger:', symbol: '🗡' }, { id: autocomplete.model.data[ 0 ].id, symbol: autocomplete.model.data[ 0 ].symbol }, 'Emoji result contains wrong result' );
				autocomplete.close();
			} );
		}
	};

	var tests = {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'emoji' );

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

		// This test should be on top of test suite, cause other tests will cache emojis (#2583).
		'test emoji names cache': function( editor, bot ) {
			bot.setHtmlWithSelection( '<p>foo :collision:^</p>' );

			var collision = CKEDITOR.tools.array.filter( editor._.emoji.list, function( item ) {
				return item.id === ':collision:';
			} )[ 0 ];

			assert.isUndefined( collision.name, 'Emoji name should be undefined.' );

			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			assert.areEqual( 'collision', collision.name, 'Emoji name should be cached.' );
		},

		'test emoji objects are added to editor': function( editor ) {
			emojiTools.runAfterInstanceReady( editor, null, function( editor ) {
				assert.isObject( editor._.emoji, 'Emoji variable doesn\' exists' );
				objectAssert.ownsKeys( [ 'list', 'autocomplete' ], editor._.emoji, 'Emoji variable is missing some keys' );
			} );
		},

		'test emoji suggestion box has proper values': function( editor, bot ) {
			emojiTools.runAfterInstanceReady( editor, bot, function( editor, bot ) {
				var autocomplete = editor._.emoji.autocomplete;

				bot.setHtmlWithSelection( '<p>foo :bug^</p>' );
				editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );
				assert.areSame( ':bug', autocomplete.model.query, 'Model keeps wrong query' );
				assert.areSame( 1, autocomplete.model.data.length, 'Emoji result contains more than one result' );
				objectAssert.areEqual( { id: ':bug:', symbol: '🐛' }, { id: autocomplete.model.data[ 0 ].id, symbol: autocomplete.model.data[ 0 ].symbol }, 'Emoji result contains wrong result' );
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

				CKEDITOR.tools.array.forEach( queries, function( query ) {
					bot.setHtmlWithSelection( '<p>foo ' + query + '^</p>' );
					editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

					objectAssert.areEqual( { id: ':ok_hand:', symbol: '👌' }, { id: autocomplete.model.data[ 0 ].id, symbol: autocomplete.model.data[ 0 ].symbol }, 'Emoji result contains wrong result' );
				} );
			} );
		},

		// (#2195)
		'test emoji suggestion box shouldn\'t appear inside text': function( editor, bot ) {
			emojiTools.runAfterInstanceReady( editor, bot, function( editor, bot ) {
				var autocomplete = editor._.emoji.autocomplete,
					editable = editor.editable();

				bot.setHtmlWithSelection( '<p>foo:bug^</p>' );

				emojiTools.assertIsNullOrUndefined( autocomplete.model.query );
				emojiTools.assertIsNullOrUndefined( autocomplete.model.data );

				editable.fire( 'keyup', new CKEDITOR.dom.event( {} ) );
			} );
		},

		// (#2195)
		'test emoji suggestion box should appear at the beginning of new line': function( editor, bot ) {
			emojiTools.runAfterInstanceReady( editor, bot, function( editor, bot ) {
				var autocomplete = editor._.emoji.autocomplete,
					editable = editor.editable();

				bot.setHtmlWithSelection( '<p>foo</p><p>:bug^</p>' );
				editable.fire( 'keyup', new CKEDITOR.dom.event( {} ) );
				objectAssert.areEqual( { id: ':bug:', symbol: '🐛' }, { id: autocomplete.model.data[ 0 ].id, symbol: autocomplete.model.data[ 0 ].symbol }, 'Emoji result contains wrong result' );
			} );
		},

		// (#2394)
		'test emoji correctly matches repeated keywords': function( editor, bot ) {
			emojiTools.runAfterInstanceReady( editor, bot, function( editor, bot ) {
				var autocomplete = editor._.emoji.autocomplete;

				bot.setHtmlWithSelection( '<p>foo :collision :collision^</p>' );
				editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );
				assert.areSame( ':collision', autocomplete.model.query, 'Model keeps wrong query' );
				assert.areSame( 1, autocomplete.model.data.length, 'Emoji result contains more than one result' );
				objectAssert.areEqual( { id: ':collision:', symbol: '💥' }, { id: autocomplete.model.data[ 0 ].id, symbol: autocomplete.model.data[ 0 ].symbol }, 'Emoji result contains wrong result' );
			} );
		},

		// (#2527)
		'test emoji autocomplete is sorted in proper order': function( editor, bot ) {
			emojiTools.runAfterInstanceReady( editor, bot, function( editor, bot ) {
				var autocomplete = editor._.emoji.autocomplete,
					expected = [ ':smiling_cat_face_with_heart-eyes:',
						':smiling_face:',
						':smiling_face_with_halo:',
						':smiling_face_with_heart-eyes:',
						':smiling_face_with_horns:',
						':smiling_face_with_smiling_eyes:',
						':smiling_face_with_sunglasses:',
						':beaming_face_with_smiling_eyes:',
						':grinning_cat_face_with_smiling_eyes:',
						':grinning_face_with_smiling_eyes:',
						':kissing_face_with_smiling_eyes:',
						':slightly_smiling_face:'
					],
					actual;

				bot.setHtmlWithSelection( '<p>foo :smiling^</p>' );
				editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

				actual = CKEDITOR.tools.array.map( autocomplete.model.data, function( el ) {
					return el.id;
				} );

				arrayAssert.itemsAreSame( expected, actual );
				assert.areSame( '<span>😻</span> smiling_cat_face_with_heart-eyes' , autocomplete.view.element.getChild( 0 ).getHtml(), 'First element in view should start from "smiling".' );
			} );
		},

		// (#2583)
		'test emoji autocomplete panel displays name': function( editor, bot ) {
			emojiTools.runAfterInstanceReady( editor, bot, function( editor, bot ) {
				bot.setHtmlWithSelection( '<p>:smiling_cat_face_with_heart-eyes:^</p>' );
				editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

				var element = CKEDITOR.document.findOne( '.cke_emoji-suggestion_item' );

				assert.areEqual( element.getHtml(), '<span>😻</span> smiling_cat_face_with_heart-eyes' );
			} );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );
	CKEDITOR.tools.array.forEach( CKEDITOR.tools.object.keys( singleTests ), function( key ) {
		if ( tests[ key ] === undefined ) {
			tests[ key ] = singleTests[ key ];
		}
	} );
	bender.test( tests );
} )();
