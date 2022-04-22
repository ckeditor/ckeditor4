/* bender-tags: editor */

( function() {
	'use strict';

	bender.editors = {
		classic: {},
		inline: {
			creator: 'inline'
		}
	};

	var tests = {
		'test native focus should be not moved outside the table and the editor after exec: \'cell -> Insert Cell Before\' and pressing the TAB key': function( editor ) {
			var options = {
				action: 'cellInsertBefore',
				editorType: editor.name + 'without',
				shiftKey: false
			};

			assertTableFocus( options );
		},

		'test native focus should be not moved outside the table and the editor after exec: \'cell -> Insert Cell Before\' and pressing the SHIFT+TAB key': function( editor ) {
			var options = {
				action: 'cellInsertBefore',
				editorType: editor.name + 'previous-without',
				shiftKey: true
			};

			assertTableFocus( options );
		},

		'test native focus should be not moved outside the table and the editor after exec: \'cell -> Insert Cell After\' and pressing the TAB key': function( editor ) {
			var options = {
				action: 'cellInsertAfter',
				editorType: editor.name + 'without',
				pluginSet: 0,
				shiftKey: false
			};

			assertTableFocus( options );
		},

		'test native focus should be not moved outside the table and the editor after exec: \'cell -> Insert Cell After\' and pressing the SHIFT+TAB key': function( editor ) {
			var options = {
				action: 'cellInsertAfter',
				editorType: editor.name + 'previous-without',
				shiftKey: true
			};

			assertTableFocus( options );
		},

		'test native focus should be not moved outside the table and the editor after exec: \'cell -> Merge Right\' and pressing the TAB key': function( editor ) {
			var options = {
				action: 'cellMergeRight',
				editorType: editor.name + 'without',
				shiftKey: false
			};

			assertTableFocus( options );
		},

		'test native focus should be not moved outside the table and the editor after exec: \'cell -> Merge Right\' and pressing the SHIFT + TAB key': function( editor ) {
			var options = {
				action: 'cellMergeRight',
				editorType: editor.name + 'previous-without',
				shiftKey: true
			};

			assertTableFocus( options );
		},

		'test native focus should be not moved outside the table and the editor after exec: \'cell -> Merge Down\' and pressing the TAB key': function( editor ) {
			var options = {
				action: 'cellMergeDown',
				editorType: editor.name + 'without',
				shiftKey: false
			};

			assertTableFocus( options );
		},

		'test native focus should be not moved outside the table and the editor after exec: \'cell -> Merge Down\' and pressing the SHIFT + TAB key': function( editor ) {
			var options = {
				action: 'cellMergeDown',
				editorType: editor.name + 'previous-without',
				shiftKey: true
			};

			assertTableFocus( options );
		},

		'test native focus should be not moved outside the table and the editor after exec: \'row -> Insert Row Before\' and pressing the TAB key': function( editor ) {
			var options = {
				action: 'rowInsertBefore',
				editorType: editor.name + 'without',
				pluginSet: 0,
				shiftKey: false
			};

			assertTableFocus( options );
		},

		'test native focus should be not moved outside the table and the editor after exec: \'row -> Insert Row Before\' and pressing the SHIFT + TAB key': function( editor ) {
			var options = {
				action: 'rowInsertBefore',
				editorType: editor.name + 'previous-without',
				shiftKey: true
			};

			assertTableFocus( options );
		},

		'test native focus should be not moved outside the table and the editor after exec: \'row -> Insert Row After\' and pressing the TAB key': function( editor ) {
			var options = {
				action: 'rowInsertAfter',
				editorType: editor.name + 'without',
				shiftKey: false
			};

			assertTableFocus( options );
		},

		'test native focus should be not moved outside the table and the editor after exec: \'row -> Insert Row After\' and pressing the SHIFT + TAB key': function( editor ) {
			var options = {
				action: 'rowInsertAfter',
				editorType: editor.name + 'previous-without',
				shiftKey: true
			};

			assertTableFocus( options );
		},

		'test native focus should be not moved outside the table and the editor after exec: \'column -> Insert Column Before\' and pressing the TAB key': function( editor ) {
			var options = {
				action: 'columnInsertBefore',
				editorType: editor.name + 'without',
				shiftKey: false
			};

			assertTableFocus( options );
		},

		'test native focus should be not moved outside the table and the editor after exec: \'column -> Insert Column Before\' and pressing the SHIFT + TAB key': function( editor ) {
			var options = {
				action: 'columnInsertBefore',
				editorType: editor.name + 'previous-without',
				shiftKey: true
			};

			assertTableFocus( options );
		},

		'test native focus should be not moved outside the table and the editor after exec: \'column -> Insert Column After\' and pressing the TAB key': function( editor ) {
			var options = {
				action: 'columnInsertAfter',
				editorType: editor.name + 'without',
				shiftKey: false
			};

			assertTableFocus( options );
		},

		'test native focus should be not moved outside the table and the editor after exec: \'column -> Insert Column After\' and pressing the SHIFT + TAB key': function( editor ) {
			var options = {
				action: 'columnInsertAfter',
				editorType: editor.name + 'previous-without',
				shiftKey: true
			};

			assertTableFocus( options );
		}
	};

	function assertTableFocus( options ) {
		var action = options.action,
			editorType = options.editorType,
			shiftKey = options.shiftKey,
			editorName = 'tablecellfocus-' + action + '-' + editorType,
			pluginSet = 'toolbar, table, tab, tabletools';

		bender.editorBot.create( {
			name: editorName,
			config: {
				plugins: pluginSet
			}
		}, function( bot ) {
			var editor = bot.editor,
				editable = editor.editable(),
				template = '<table border="1">' +
					'<tbody>' +
						'<tr>' +
							'<td>1_1</td>' +
							'<td>1_2</td>' +
						'</tr>' +
						'<tr>' +
							'<td>start^</td>' +
							'<td>2_2</td>' +
						'</tr>' +
						'<tr>' +
							'<td>3_1</td>' +
							'<td>3_2</td>' +
						'</tr>' +
					'</tbody>' +
				'</table>';

			bot.setHtmlWithSelection( template );
			bot.execCommand( action );

			resume( function() {
				var selectionBefore = editor.getSelection(),
					elementBeforeKeydownEvt = selectionBefore
						.getRanges()[ 0 ]
						._getTableElement()
						.getText();

				editable.fire( 'keydown', new CKEDITOR.dom.event( {
					keyCode: 9,
					shiftKey: shiftKey ? true : false
				} ) );

				var selectionAfter = editor.getSelection(),
					isSelectionInTable = selectionAfter.isInTable( true ),
					elementAfterKeydownEvt = selectionAfter
						.getRanges()[ 0 ]
						._getTableElement()
						.getText();

				assert.isTrue( isSelectionInTable,
					'Selection was moved outside the table after invoke ' + action + ' command.' );
				assert.areNotSame( elementBeforeKeydownEvt, elementAfterKeydownEvt,
					'Elements should be different after invoke ' + action + ' command.' );
			}, 100 );

			wait();
		} );
	}

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	bender.test( tests );
} )();
