/* bender-tags: editor,unit,tableselection */
/* bender-ckeditor-plugins: table,tableselection,wysiwygarea,enterkey,undo */
/* bender-ckeditor-remove-plugins: entities */
/* bender-include: ../../_helpers/tableselection.js */

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

	function fixMarkersInTable( htmlString ) {
		return htmlString.replace( /<td>\[\s?<\/td>/g, '[' ).replace( /<td>\]\s?<\/td>/g, ']' );
	}


	var tests = {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'tableselection' );
		},
		'test press enter key in selected table': function( editor, bot ) {
			var expectedResult = prepareEditorAndGetExpectedResult( editor, bot );
			editor.fire( 'saveSnapshot' );

			editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 13 } ) );
			assert.beautified.html( expectedResult, editor.getData(), 'There wasn\'t table clear and/or adding new paragraph in it\'s content after pressing Enter key.' );

			editor.execCommand( 'undo' );
			assert.beautified.html( TABLE_WITH_SELECTION, fixMarkersInTable( bender.tools.getHtmlWithSelection( editor ) ), 'Editor\'s content wasn\'t properly restored after single undo step.' );

		},
		'test press shift + enter key in selected table': function( editor, bot ) {
			var expectedResult = prepareEditorAndGetExpectedResult( editor, bot, true );
			editor.fire( 'saveSnapshot' );

			editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 13, shiftKey: true } ) );
			assert.beautified.html( expectedResult, editor.getData(), 'There wasn\'t table clear and/or adding new paragraph in it\'s content after pressing Shift+Enter key.' );

			editor.execCommand( 'undo' );
			assert.beautified.html( TABLE_WITH_SELECTION, fixMarkersInTable( bender.tools.getHtmlWithSelection( editor ) ), 'Editor\'s content wasn\'t properly restored after single undo step.' );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );
	bender.test( tests );
} )();
