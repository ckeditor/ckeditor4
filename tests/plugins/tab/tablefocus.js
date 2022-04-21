/* bender-tags: editor */
/* bender-ckeditor-plugins: tableselection */

( function() {
	'use strict';

	bender.editors = {
		classic: {},
		inline: {
			creator: 'inline'
		}
	};

	var tests = {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'tableselection' );
		},

		'test focus should be not moved outside the table and the editor after exec: \'cell -> Insert Cell Before\' and pressing the TAB key': function( ed ) {
			var options = {
				action: 'cellInsertBefore',
				editorType: ed.name,
				shiftKey: false
			};

			assertTableFocus( options );
		},

		'test focus should be not moved outside the table and the editor after exec: \'cell -> Insert Cell Before\' and pressing the SHIFT + TAB key': function( ed ) {
			var options = {
				action: 'cellInsertBefore',
				editorType: ed.name + 'previous',
				shiftKey: true
			};

			assertTableFocus( options );
		},

		'test focus should be not moved outside the table and the editor after exec: \'cell -> Insert Cell After\' and pressing the TAB key': function( ed ) {
			var options = {
				action: 'cellInsertAfter',
				editorType: ed.name,
				shiftKey: false
			};

			assertTableFocus( options );
		},

		'test focus should be not moved outside the table and the editor after exec: \'cell -> Insert Cell After\' and pressing the SHIFT + TAB key': function( ed ) {
			var options = {
				action: 'cellInsertAfter',
				editorType: ed.name + 'previous',
				shiftKey: true
			};

			assertTableFocus( options );
		},

		'test focus should be not moved outside the table and the editor after exec: \'cell -> Merge Right\' and pressing the TAB key': function( ed ) {
			var options = {
				action: 'cellMergeRight',
				editorType: ed.name,
				shiftKey: false
			};

			assertTableFocus( options );
		},

		'test focus should be not moved outside the table and the editor after exec: \'cell -> Merge Right\' and pressing the SHIFT + TAB key': function( ed ) {
			var options = {
				action: 'cellMergeRight',
				editorType: ed.name + 'previous',
				shiftKey: true
			};

			assertTableFocus( options );
		},

		'test focus should be not moved outside the table and the editor after exec: \'cell -> Merge Down\' and pressing the TAB key': function( ed ) {
			var options = {
				action: 'cellMergeDown',
				editorType: ed.name,
				shiftKey: false
			};

			assertTableFocus( options );
		},

		'test focus should be not moved outside the table and the editor after exec: \'cell -> Merge Down\' and pressing the SHIFT + TAB key': function( ed ) {
			var options = {
				action: 'cellMergeDown',
				editorType: ed.name + 'previous',
				shiftKey: true
			};

			assertTableFocus( options );
		},

		'test focus should be not moved outside the table and the editor after exec: \'row -> Insert Row Before\' and pressing the TAB key': function( ed ) {
			var options = {
				action: 'rowInsertBefore',
				editorType: ed.name,
				shiftKey: false
			};

			assertTableFocus( options );
		},

		'test focus should be not moved outside the table and the editor after exec: \'row -> Insert Row Before\' and pressing the SHIFT + TAB key': function( ed ) {
			var options = {
				action: 'rowInsertBefore',
				editorType: ed.name + 'previous',
				shiftKey: true
			};

			assertTableFocus( options );
		},

		'test focus should be not moved outside the table and the editor after exec: \'row -> Insert Row After\' and pressing the TAB key': function( ed ) {
			var options = {
				action: 'rowInsertAfter',
				editorType: ed.name,
				shiftKey: false
			};

			assertTableFocus( options );
		},

		'test focus should be not moved outside the table and the editor after exec: \'row -> Insert Row After\' and pressing the SHIFT + TAB key': function( ed ) {
			var options = {
				action: 'rowInsertAfter',
				editorType: ed.name + 'previous',
				shiftKey: true
			};

			assertTableFocus( options );
		},

		'test focus should be not moved outside the table and the editor after exec: \'column -> Insert Column Before\' and pressing the TAB key': function( ed ) {
			var options = {
				action: 'columnInsertBefore',
				editorType: ed.name,
				shiftKey: false
			};

			assertTableFocus( options );
		},

		'test focus should be not moved outside the table and the editor after exec: \'column -> Insert Column Before\' and pressing the SHIFT + TAB key': function( ed ) {
			var options = {
				action: 'columnInsertBefore',
				editorType: ed.name + 'previous',
				shiftKey: true
			};

			assertTableFocus( options );
		},

		'test focus should be not moved outside the table and the editor after exec: \'column -> Insert Column After\' and pressing the TAB key': function( ed ) {
			var options = {
				action: 'columnInsertAfter',
				editorType: ed.name,
				shiftKey: false
			};

			assertTableFocus( options );
		},

		'test focus should be not moved outside the table and the editor after exec: \'column -> Insert Column After\' and pressing the SHIFT + TAB key': function( ed ) {
			var options = {
				action: 'columnInsertAfter',
				editorType: ed.name + 'previous',
				shiftKey: true
			};

			assertTableFocus( options );
		},


		'test focus should be not moved outside the table and the editor after exec: \'cell -> Merge Cells\' and pressing the TAB key': function( ed ) {
			var	customHtml = '<table border="1">' +
				'<tbody>' +
					'<tr>' +
						'<td>1_1</td>' +
						'<td>1_2</td>' +
					'</tr>' +
					'<tr>' +
						'<td>[success!</td>' +
						'<td>2_2]</td>' +
					'</tr>' +
					'<tr>' +
						'<td>3_1</td>' +
						'<td>3_2</td>' +
					'</tr>' +
				'</tbody>' +
			'</table>',
			options = {
				action: 'cellMerge',
				editorType: ed.name,
				shiftKey: false,
				customHtml: customHtml
			};

			assertTableFocus( options );
		},

		'test focus should be not moved outside the table and the editor after exec: \'cell -> Merge Cells\' and pressing the SHIFT + TAB key': function( ed ) {
			var	customHtml = '<table border="1">' +
					'<tbody>' +
						'<tr>' +
							'<td>1_1</td>' +
							'<td>1_2</td>' +
						'</tr>' +
						'<tr>' +
							'<td>[success!</td>' +
							'<td>2_2]</td>' +
						'</tr>' +
						'<tr>' +
							'<td>3_1</td>' +
							'<td>3_2</td>' +
						'</tr>' +
					'</tbody>' +
				'</table>',
			options = {
				action: 'cellMerge',
				editorType: ed.name + 'previous',
				shiftKey: true,
				customHtml: customHtml
			};

			assertTableFocus( options );
		}
	};

	function assertTableFocus( options ) {
		var action = options.action,
			editorType = options.editorType,
			shiftKey = options.shiftKey,
			customHtml = options.customHtml,
			editorName = 'tablecellfocus-' + action + '-' + editorType,
			pluginSet = 'table, tab, tabletools, tableselection';

		bender.editorBot.create( {
			name: editorName,
			config: {
				plugins: pluginSet
			}
		}, function( bot ) {
			var editor = bot.editor,
				editable = editor.editable(),
				defaultHtml = '<table border="1">' +
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

			bot.setHtmlWithSelection( customHtml || defaultHtml );
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
