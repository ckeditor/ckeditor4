/* bender-tags: emoji */
/* bender-ckeditor-plugins: emoji,toolbar,stylescombo,format,clipboard,undo */

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

	function clearAutocompleteModel( autocomplete ) {
		var model = autocomplete.model;
		delete model.data;
		delete model.lastRequestId;
		delete model.query;
		delete model.range;
		delete model.selectedItemId;
	}

	var singleTests = {
		'test for custom emoji characters': function() {
			var editor = this.editors.divarea,
				bot = this.editorBots.divarea,
				autocomplete = editor._.emoji.autocomplete;

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
				} );
			}, 21 );
			wait();
		}
	};

	var tests = {
		'test emoji objects are added to editor': function( editor ) {
			assert.isObject( editor._.emoji, 'Emoji variable doesn\' exists.' );
			objectAssert.ownsKeys( [ 'list', 'autocomplete' ], editor._.emoji, 'Emoji variable is missing some keys.' );

		},

		'test emoji suggestion box has proper values': function( editor, bot ) {
			var autocomplete = editor._.emoji.autocomplete;
			bot.setHtmlWithSelection( '<p>foo:bug^</p>' );
			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );
			assert.areSame( ':bug', autocomplete.model.query, 'Model keeps wrong querry.' );
			assert.areSame( 1, autocomplete.model.data.length, 'Emoji result contains more than one result.' );
			objectAssert.areEqual( { id: ':bug:', symbol: '🐛' }, autocomplete.model.data[ 0 ], 'Emoji result contains wrong result' );

			clearAutocompleteModel( autocomplete );
		},

		'test emoji are not actived when too few letters are written': function( editor, bot ) {
			var autocomplete = editor._.emoji.autocomplete;
			bot.setHtmlWithSelection( '<p>foo:b^</p>' );
			editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

			assert.isUndefined( autocomplete.model.query );
			assert.isUndefined( autocomplete.model.data );

			clearAutocompleteModel( autocomplete );
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
