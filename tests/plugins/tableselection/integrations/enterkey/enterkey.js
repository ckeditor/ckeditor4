/* bender-tags: editor,unit,tableselection */
/* bender-ckeditor-plugins: table,tableselection,wysiwygarea,enterkey */
/* bender-include: ../../_helpers/tableselection.js */
/* global tableSelectionHelpers */

( function() {
	'use strict';

	bender.editors = {
		editor1: {
			name: 'editor1',
			config: {
				enterMode: CKEDITOR.ENTER_DIV,
				shiftEnterMode: CKEDITOR.ENTER_BR
			}
		},
		editor2: {
			name: 'editor2',
			creator: 'inline',
			config: {
				enterMode: CKEDITOR.ENTER_BR,
				shiftEnterMode: CKEDITOR.ENTER_DIV
			}
		},
		editor3: {
			name: 'editor3',
			config: {
				enterMode: CKEDITOR.ENTER_P,
				shiftEnterMode: CKEDITOR.ENTER_DIV
			}
		},
		editor4: {
			name: 'editor4',
			creator: 'inline',
			config: {
				enterMode: CKEDITOR.ENTER_DIV,
				shiftEnterMode: CKEDITOR.ENTER_P
			}
		}
	};

	var tests = {
		'test enter key in selected table': function( editor, bot ) {
			bender.tools.testInputOut( 'basicTable', function( source, expected ) {
				bender.tools.setHtmlWithSelection( editor, source );

				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 13 } ) );

				bender.assert.beautified.html( expected, bot.getData() );
			} );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );
	tableSelectionHelpers.ignoreUnsupportedEnvironment( tests );
	bender.test( tests );
} )();
