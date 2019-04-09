/* bender-tags: editor,unit,tableselection */
/* bender-ckeditor-plugins: table,tableselection,wysiwygarea,undo */
/* bender-include: ./_helpers/tableselection.js */

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
				removePlugins: 'enterkey'
			}
		},
		editor2: {
			name: 'editor2',
			creator: 'inline',
			config: {
				removePlugins: 'enterkey'
			}
		}
	};

	var tests = {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'tableselection' );
		},
		'test tableselection without enterkey plugin': function( editor, bot ) {
			var expectedResult = TABLE_WITH_SELECTION.replace( /(\[|\])/g, '' ).replace( 'BB', '&nbsp;' ).replace( 'YY', '&nbsp;' );
			bot.setHtmlWithSelection( TABLE_WITH_SELECTION );
			editor.fire( 'saveSnapshot' );
			editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 13 } ) );
			assert.beautified.html( expectedResult, editor.getData() );
		},
		'test tableselection + undo without enterkey plugin': function( editor, bot ) {
			var source = TABLE_WITH_SELECTION.replace( /(\[|\])/g, '' );
			var expectedResult = source.replace( 'BB', '&nbsp;' ).replace( 'YY', '&nbsp;' );

			bot.setHtmlWithSelection( TABLE_WITH_SELECTION );
			editor.fire( 'saveSnapshot' );
			var spy = sinon.spy( editor, 'fire' );

			editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 13 } ) );
			assert.beautified.html( expectedResult, editor.getData(), 'Content before undo step is incorrect' );

			editor.execCommand( 'undo' );
			assert.beautified.html( source, editor.getData(), 'Content after undo step is incorrect' );

			sinon.assert.neverCalledWith( spy, 'saveSnapshot' );

			spy.restore();
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );
	bender.test( tests );
} )();
