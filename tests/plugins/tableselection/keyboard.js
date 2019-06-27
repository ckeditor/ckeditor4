/* bender-tags: tableselection */
/* bender-ckeditor-plugins: entities,dialog,tableselection,toolbar,undo,floatingspace */
/* bender-include: _helpers/tableselection.js, ../undo/_helpers/tools.js */
/* global tableSelectionHelpers, doCommandTest, undoEventDispatchTestsTools */

( function() {
	'use strict';

	bender.editors = {
		classic: {},
		inline: {
			creator: 'inline'
		}
	};

	var getRangesForCells = tableSelectionHelpers.getRangesForCells;

	var tests = {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'tableselection' );
		},
		'test backspace in the middle': function( editor, bot ) {
			bender.tools.testInputOut( 'emptyTable', function( source, expected ) {
				bender.tools.setHtmlWithSelection( editor, source );

				editor.getSelection().selectRanges( getRangesForCells( editor, [ 1, 2 ] ) );

				// Reuse undo's fancy tools to mimic the keyboard.
				var keyTools = undoEventDispatchTestsTools( {
					editor: editor
				} );
				keyTools.key.keyEvent( keyTools.key.keyCodesEnum.BACKSPACE );

				bender.assert.beautified.html( expected, bot.htmlWithSelection() );
			} );
		},

		'test backspace bogus br': function( editor ) {
			// Bogus brs should not be removed.
			bender.tools.testInputOut( 'emptyTableBogusBr', function( source, expected ) {
				bender.tools.setHtmlWithSelection( editor, source );

				editor.getSelection().selectRanges( getRangesForCells( editor, [ 0, 1 ] ) );

				// Reuse undo's fancy tools to mimic the keyboard.
				var keyTools = undoEventDispatchTestsTools( {
					editor: editor
				} );
				keyTools.key.keyEvent( keyTools.key.keyCodesEnum.BACKSPACE );

				bender.assert.beautified.html( expected, editor.editable().getHtml() );
			} );
		},

		'test backspace whole first row': function( editor, bot ) {
			bender.tools.testInputOut( 'emptyTableDeleteFirstRow', function( source, expected ) {
				bender.tools.setHtmlWithSelection( editor, source );

				editor.getSelection().selectRanges( getRangesForCells( editor, [ 0, 1 ] ) );

				// Reuse undo's fancy tools to mimic the keyboard.
				var keyTools = undoEventDispatchTestsTools( {
					editor: editor
				} );
				keyTools.key.keyEvent( keyTools.key.keyCodesEnum.BACKSPACE );

				bender.assert.beautified.html( expected, bot.htmlWithSelection() );
			} );
		},

		'test backspace whole second row': function( editor, bot ) {
			bender.tools.testInputOut( 'emptyTableDeleteSecondRow', function( source, expected ) {
				bender.tools.setHtmlWithSelection( editor, source );

				editor.getSelection().selectRanges( getRangesForCells( editor, [ 2, 3 ] ) );

				// Reuse undo's fancy tools to mimic the keyboard.
				var keyTools = undoEventDispatchTestsTools( {
					editor: editor
				} );
				keyTools.key.keyEvent( keyTools.key.keyCodesEnum.BACKSPACE );

				bender.assert.beautified.html( expected, bot.htmlWithSelection() );
			} );
		},

		'test backspace multiple rows': function( editor, bot ) {
			bender.tools.testInputOut( 'emptyTableDeleteFewRows', function( source, expected ) {
				bender.tools.setHtmlWithSelection( editor, source );

				editor.getSelection().selectRanges( getRangesForCells( editor, [ 0, 1, 2, 3 ] ) );

				// Reuse undo's fancy tools to mimic the keyboard.
				var keyTools = undoEventDispatchTestsTools( {
					editor: editor
				} );
				keyTools.key.keyEvent( keyTools.key.keyCodesEnum.BACKSPACE );

				bender.assert.beautified.html( expected, bot.htmlWithSelection() );
			} );
		},

		'test backspace whole table': function( editor, bot ) {
			bender.tools.testInputOut( 'emptyTableRemoveWhole', function( source, expected ) {
				bender.tools.setHtmlWithSelection( editor, source );

				editor.getSelection().selectRanges( getRangesForCells( editor, [ 0, 1, 2, 3 ] ) );

				// Reuse undo's fancy tools to mimic the keyboard.
				var keyTools = undoEventDispatchTestsTools( {
					editor: editor
				} );
				keyTools.key.keyEvent( keyTools.key.keyCodesEnum.BACKSPACE );

				bender.assert.beautified.html( expected, bot.htmlWithSelection() );
			} );
		},

		'test backspace whole table multiple tables': function( editor, bot ) {
			bender.tools.testInputOut( 'emptyTableSibling', function( source, expected ) {
				bender.tools.setHtmlWithSelection( editor, source );

				editor.getSelection().selectRanges( getRangesForCells( editor, [ 2, 3 ] ) );

				// Reuse undo's fancy tools to mimic the keyboard.
				var keyTools = undoEventDispatchTestsTools( {
					editor: editor
				} );
				keyTools.key.keyEvent( keyTools.key.keyCodesEnum.BACKSPACE );

				bender.assert.beautified.html( expected, bot.htmlWithSelection() );
			} );
		},

		'test backspace column': function( editor, bot ) {
			// Make sure that backspace in one column of many, doesnt remove whole table.
			doCommandTest( bot, function() {
				editor.getSelection().selectRanges( getRangesForCells( editor, [ 1, 3 ] ) );

				// Reuse undo's fancy tools to mimic the keyboard.
				var keyTools = undoEventDispatchTestsTools( {
					editor: editor
				} );
				keyTools.key.keyEvent( keyTools.key.keyCodesEnum.BACKSPACE );
			}, { 'case': 'emptyTableSingleColumn', markCells: true, skipCheckingSelection: true } );
		},

		'test delete in the middle': function( editor, bot ) {
			bender.tools.testInputOut( 'emptyTable', function( source, expected ) {
				bender.tools.setHtmlWithSelection( editor, source );

				editor.getSelection().selectRanges( getRangesForCells( editor, [ 1, 2 ] ) );

				// Reuse undo's fancy tools to mimic the keyboard.
				var keyTools = undoEventDispatchTestsTools( {
					editor: editor
				} );
				keyTools.key.keyEvent( keyTools.key.keyCodesEnum.DELETE );

				bender.assert.beautified.html( expected, bot.htmlWithSelection() );
			} );
		},

		'test delete whole table with sibling paragraph': function( editor, bot ) {
			bender.tools.testInputOut( 'emptyTableParagraphSibling', function( source, expected ) {
				bender.tools.setHtmlWithSelection( editor, source );

				editor.getSelection().selectRanges( getRangesForCells( editor, [ 0, 1 ] ) );

				// Reuse undo's fancy tools to mimic the keyboard.
				var keyTools = undoEventDispatchTestsTools( {
					editor: editor
				} );
				keyTools.key.keyEvent( keyTools.key.keyCodesEnum.BACKSPACE );

				bender.assert.beautified.html( expected, bot.htmlWithSelection() );
			} );
		},

		// #415
		'test enter key': function( editor, bot ) {
			bender.tools.testInputOut( 'enterKey', function( source, expected ) {
				bender.tools.setHtmlWithSelection( editor, source );

				editor.getSelection().selectRanges( getRangesForCells( editor, [ 0, 1, 2, 3 ] ) );

				editor.editable().fire( 'keypress', new CKEDITOR.dom.event( { keyCode: 13 } ) );

				bender.assert.beautified.html( expected, bot.htmlWithSelection() );
			} );
		},

		// #867
		'test typing inside selected table': function( editor, bot ) {
			bender.tools.testInputOut( 'typingTable', function( source, expected ) {
				bender.tools.setHtmlWithSelection( editor, source );

				editor.getSelection().selectElement( editor.editable().findOne( 'table' ) );

				editor.editable().fire( 'keypress', new CKEDITOR.dom.event( { charCode: 65 } ) );

				// This test checks only if table is correctly removed as artificial
				// keypress event can't actually type anything into the editor.
				bender.assert.beautified.html( expected, bot.htmlWithSelection() );
			} );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	bender.test( tests );
} )();
