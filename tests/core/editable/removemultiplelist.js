/* bender-ckeditor-plugins: list,toolbar,table,format */

( function() {
	'use strict';

	bender.editors = {
		classic: {},
		inline: {
			creator: 'inline'
		}
	};

	var tests = {},
		keyCodes = [
			{
				name: 'Backspace',
				code: 46
			},

			{
				name: 'Delete',
				code: 8
			}
		],
		testCases = [
			{
				name: 'test fully selected lists are removed when',
				template: 'multiple_full_list'
			},

			{
				name: 'test fully mixed lists are removed when',
				template: 'mixed_full_lists'
			},

			{
				name: 'test multiple list with table is removed when',
				template: 'lists_with_table'
			},

			{
				name: 'test fully multiple nested lists are removed when',
				template: 'nested_full_lists'
			},

			{
				name: 'test whole of nested list inside another one is removed when',
				template: 'only_nested_part_list'
			},

			{
				name: 'test last item with previous nested list is removed when',
				template: 'nested_list',
				ignore: CKEDITOR.env.ie && CKEDITOR.env.version < 9
			},

			{
				name: 'test part of multiple nested lists are removed when remove when',
				template: 'nested_part_lists',
				ignore: CKEDITOR.env.ie && CKEDITOR.env.version < 9
			},

			{
				name: 'test part of multiple list is removed when',
				template: 'multiple_part_list',
				ignore: CKEDITOR.env.ie || CKEDITOR.env.gecko
			},

			{
				name: 'test part mixed lists is removed when',
				template: 'mixed_part_lists',
				ignore: CKEDITOR.env.ie || CKEDITOR.env.gecko
			}
		];

	for ( var i = 0; i < keyCodes.length; i++ ) {
		CKEDITOR.tools.array.forEach( testCases, function( test ) {
			var testName = test.name + ' ' + keyCodes[ i ].name + ' key is pressed',
				keyCode = keyCodes[ i ].code,
				options = {
					testInput: test.template,
					testName: testName,
					keyCode: keyCode
				},
				newTest = {};

			newTest[ testName ] = function( editor, bot ) {
					if ( test.ignore ) {
						assert.ignore();
					}

					setTest( editor, bot, options );
				};

			CKEDITOR.tools.extend( tests, newTest );
		} );
	}

	function setTest( editor, bot, options ) {
		return bender.tools.testInputOut( options.testInput, function( source, expected ) {
			bender.tools.setHtmlWithSelection( editor, source );

			editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: options.keyCode } ) );

			bender.assert.beautified.html( expected, bot.htmlWithSelection(), 'There was a problem with test: ' + options.testName );
		} );
	}

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	bender.test( tests );
} )();
