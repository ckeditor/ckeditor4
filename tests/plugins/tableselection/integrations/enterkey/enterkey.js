/* bender-tags: editor,unit,tableselection */
/* bender-ckeditor-plugins: table,tableselection,wysiwygarea,enterkey */
/* bender-include: ../../_helpers/tableselection.js */
/* global tableSelectionHelpers */

( function() {
	'use strict';

	var TABLE_WITH_SELECTION = '<table border="1">' +
		'<tbody>' +
			'<tr>' +
				'<td>AA</td>' +
				'[<td>BB</td>]' +
				'<td>CC</td>' +
			'</tr>' +
			'<tr>' +
				'<td>XX</td>' +
				'[<td>YY</td>]' +
				'<td>ZZ</td>' +
			'</tr>' +
		'</tbody>' +
	'</table>';


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

	function getNewLineHtml( editor, isShiftEnterMode ) {
		var modeToCheck = isShiftEnterMode ? editor.shiftEnterMode : editor.enterMode;
		switch ( modeToCheck ) {
			case CKEDITOR.ENTER_P:
				return '<p>&nbsp;</p>';
			case CKEDITOR.ENTER_DIV:
				return '<div>&nbsp;</div>';
			case CKEDITOR.ENTER_BR:
				return '<br />&nbsp;';
			default:
				return;
		}
	}

	function prepareEditorAndGetExpectedResult( editor, bot, isShiftEnterMode ) {
		var newLine = getNewLineHtml( editor, isShiftEnterMode );

		bot.setHtmlWithSelection( TABLE_WITH_SELECTION );

		return TABLE_WITH_SELECTION.replace( /(\[|\])/g, '' ).replace( 'YY', '&nbsp;' ).replace( 'BB', newLine );
	}

	var tests = {
		'test press enter key in selected table': function( editor, bot ) {
			var expectedResult = prepareEditorAndGetExpectedResult( editor, bot );

			editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 13 } ) );

			assert.beautified.html( expectedResult, editor.getData() );

		},
		'test press shift + enter key in selected table': function( editor, bot ) {
			var expectedResult = prepareEditorAndGetExpectedResult( editor, bot, true );

			editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 13, shiftKey: true } ) );

			assert.beautified.html( expectedResult, editor.getData() );

		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );
	tableSelectionHelpers.ignoreUnsupportedEnvironment( tests );
	bender.test( tests );
} )();
