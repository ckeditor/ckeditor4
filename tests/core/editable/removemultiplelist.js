/* bender-ckeditor-plugins: list,toolbar,table,format */

( function() {
	'use strict';

	bender.editors = {
		classic: {},
		inline: {
			creator: 'inline'
		}
	};

	var tests = {
		'test remove full multiple list': function( editor, bot ) {
			bender.tools.testInputOut( 'multiple_full_list', function( source, expected ) {
				bender.tools.setHtmlWithSelection( editor, source );

				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 46 } ) );

				bender.assert.beautified.html( expected, bot.htmlWithSelection() );
			} );
		},

		'test remove part of multiple list': function( editor, bot ) {
			bender.tools.testInputOut( 'multiple_part_list', function( source, expected ) {
				bender.tools.setHtmlWithSelection( editor, source );

				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 46 } ) );

				bender.assert.beautified.html( expected, bot.htmlWithSelection() );
			} );
		},

		'test remove full mixed lists': function( editor, bot ) {
			bender.tools.testInputOut( 'mixed_full_lists', function( source, expected ) {
				bender.tools.setHtmlWithSelection( editor, source );

				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 46 } ) );

				bender.assert.beautified.html( expected, bot.htmlWithSelection() );
			} );
		},

		'test remove part mixed lists': function( editor, bot ) {
			bender.tools.testInputOut( 'mixed_part_lists', function( source, expected ) {
				bender.tools.setHtmlWithSelection( editor, source );

				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 46 } ) );

				bender.assert.beautified.html( expected, bot.htmlWithSelection() );
			} );
		},

		'test remove multiple list with table': function( editor, bot ) {
			bender.tools.testInputOut( 'lists_with_table', function( source, expected ) {
				bender.tools.setHtmlWithSelection( editor, source );

				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 46 } ) );

				bender.assert.beautified.html( expected, bot.htmlWithSelection() );
			} );
		},

		'test remove full multiple nested lists': function( editor, bot ) {
			bender.tools.testInputOut( 'nested_full_lists', function( source, expected ) {
				bender.tools.setHtmlWithSelection( editor, source );

				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 46 } ) );

				bender.assert.beautified.html( expected, bot.htmlWithSelection() );
			} );
		},

		'test remove part of multiple nested lists': function( editor, bot ) {
			bender.tools.testInputOut( 'nested_part_lists', function( source, expected ) {
				bender.tools.setHtmlWithSelection( editor, source );

				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 46 } ) );

				bender.assert.beautified.html( expected, bot.htmlWithSelection() );
			} );
		},

		'test remove whole of nested list inside another one': function( editor, bot ) {
			bender.tools.testInputOut( 'only_nested_part_list', function( source, expected ) {
				bender.tools.setHtmlWithSelection( editor, source );

				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 46 } ) );

				bender.assert.beautified.html( expected, bot.htmlWithSelection() );
			} );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	bender.test( tests );
} )();
