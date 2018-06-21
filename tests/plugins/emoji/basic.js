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

				bot.setHtmlWithSelection( '<p>foo:da^</p>' );
				editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );
				assert.isUndefined( autocomplete.model.query );
				assert.isUndefined( autocomplete.model.data );

				// Handle throttle in autocomplete which by defualt is 20ms;
				setTimeout( function() {
					resume( function() {
						bot.setHtmlWithSelection( '<p>foo:dagg^</p>' );
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
				{ id: ':dagger:', symbol: '🗡' }
			] );

			stub = sinon.stub( CKEDITOR.ajax, 'load', function( url, callback ) {
				if ( url.indexOf( 'emoji/_assets/emoji.json' ) !== -1 ) {
					callback( data );
				}
			} );
		},

		tearDown: function() {
			stub.restore();
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

				bot.setHtmlWithSelection( '<p>foo:bug^</p>' );
				editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );
				assert.areSame( ':bug', autocomplete.model.query, 'Model keeps wrong querry.' );
				assert.areSame( 1, autocomplete.model.data.length, 'Emoji result contains more than one result.' );
				objectAssert.areEqual( { id: ':bug:', symbol: '🐛' }, autocomplete.model.data[ 0 ], 'Emoji result contains wrong result' );

				emojiTools.clearAutocompleteModel( autocomplete );
				autocomplete.close();
			} );
		},

		'test emoji are not actived when too few letters are written': function( editor, bot ) {
			emojiTools.runAfterInstanceReady( editor, bot, function( editor, bot ) {
				var autocomplete = editor._.emoji.autocomplete;
				bot.setHtmlWithSelection( '<p>foo:b^</p>' );
				editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

				assert.isUndefined( autocomplete.model.query );
				assert.isUndefined( autocomplete.model.data );

				emojiTools.clearAutocompleteModel( autocomplete );
				autocomplete.close();

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
