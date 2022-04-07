/* bender-tags: tableselection */

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

		'test focus should be not moved outside the table and the editor after exec: \'cell -> Insert Cell Before\' and pressing the TAB key': function( editor ) {
			var editorType = editor.name;
			assertTable( 'cellInsertBefore', editorType );
		},

		'test focus should be not moved outside the table and the editor after exec: \'cell -> Insert Cell Before\' and pressing the SHIFT + TAB key': function( editor ) {
			var editorType = editor.name + 'previous';
			assertTable( 'cellInsertBefore', editorType, true );
		},

		'test focus should be not moved outside the table and the editor after exec: \'cell -> Insert Cell After\' and pressing the TAB key': function( editor ) {
			var editorType = editor.name;
			assertTable( 'cellInsertAfter', editorType );
		},

		'test focus should be not moved outside the table and the editor after exec: \'cell -> Insert Cell After\' and pressing the SHIFT + TAB key': function( editor ) {
			var editorType = editor.name + 'previous';
			assertTable( 'cellInsertAfter', editorType, true );
		},

		'test focus should be not moved outside the table and the editor after exec: \'cell -> Delete Cells\' and pressing the TAB key': function( editor ) {
			var editorType = editor.name;
			assertTable( 'cellDelete', editorType );
		},

		'test focus should be not moved outside the table and the editor after exec: \'cell -> Delete Cells\' and pressing the SHIFT + TAB key': function( editor ) {
			var editorType = editor.name + 'previous';
			assertTable( 'cellDelete', editorType, true );
		},

		'test focus should be not moved outside the table and the editor after exec: \'cell -> Merge Right\' and pressing the TAB key': function( editor ) {
			var editorType = editor.name;
			assertTable( 'cellMergeRight', editorType );
		},

		'test focus should be not moved outside the table and the editor after exec: \'cell -> Merge Right\' and pressing the SHIFT + TAB key': function( editor ) {
			var editorType = editor.name + 'previous';
			assertTable( 'cellMergeRight', editorType, true );
		},

		'test focus should be not moved outside the table and the editor after exec: \'cell -> Merge Down\' and pressing the TAB key': function( editor ) {
			var editorType = editor.name;
			assertTable( 'cellMergeDown', editorType );
		},

		'test focus should be not moved outside the table and the editor after exec: \'cell -> Merge Down\' and pressing the SHIFT + TAB key': function( editor ) {
			var editorType = editor.name + 'previous';
			assertTable( 'cellMergeDown', editorType, true );
		},

		'test focus should be not moved outside the table and the editor after exec: \'cell -> Split Cell Horizontally\' and pressing the TAB key': function( editor ) {
			var editorType = editor.name;
			assertTable( 'cellHorizontalSplit', editorType );
		},

		'test focus should be not moved outside the table and the editor after exec: \'cell -> Split Cell Horizontally\' and pressing the SHIFT + TAB key': function( editor ) {
			var editorType = editor.name + 'previous';
			assertTable( 'cellHorizontalSplit', editorType, true );
		},

		'test focus should be not moved outside the table and the editor after exec: \'cell -> Split Cell Vertically\' and pressing the TAB key': function( editor ) {
			var editorType = editor.name;
			assertTable( 'cellVerticalSplit', editorType );
		},

		'test focus should be not moved outside the table and the editor after exec: \'cell -> Split Cell Vertically\' and pressing the SHIFT + TAB key': function( editor ) {
			var editorType = editor.name + 'previous';
			assertTable( 'cellVerticalSplit', editorType, true );
		},

		'test focus should be not moved outside the table and the editor after exec: \'row -> Insert Row Before\' and pressing the TAB key': function( editor ) {
			var editorType = editor.name;
			assertTable( 'rowInsertBefore', editorType );
		},

		'test focus should be not moved outside the table and the editor after exec: \'row -> Insert Row Before\' and pressing the SHIFT + TAB key': function( editor ) {
			var editorType = editor.name + 'previous';
			assertTable( 'rowInsertBefore', editorType, true );
		},

		'test focus should be not moved outside the table and the editor after exec: \'row -> Insert Row After\' and pressing the TAB key': function( editor ) {
			var editorType = editor.name;
			assertTable( 'rowInsertAfter', editorType );
		},

		'test focus should be not moved outside the table and the editor after exec: \'row -> Insert Row After\' and pressing the SHIFT + TAB key': function( editor ) {
			var editorType = editor.name + 'previous';
			assertTable( 'rowInsertAfter', editorType, true );
		},

		'test focus should be not moved outside the table and the editor after exec: \'row -> Delete Rows\' and pressing the TAB key': function( editor ) {
			var editorType = editor.name;
			assertTable( 'rowDelete', editorType );
		},

		'test focus should be not moved outside the table and the editor after exec: \'row -> Delete Rows\' and pressing the SHIFT + TAB key': function( editor ) {
			var editorType = editor.name + 'previous';
			assertTable( 'rowDelete', editorType, true );
		},

		'test focus should be not moved outside the table and the editor after exec: \'column -> Insert Column Before\' and pressing the TAB key': function( editor ) {
			var editorType = editor.name;
			assertTable( 'columnInsertBefore', editorType );
		},

		'test focus should be not moved outside the table and the editor after exec: \'column -> Insert Column Before\' and pressing the SHIFT + TAB key': function( editor ) {
			var editorType = editor.name + 'previous';
			assertTable( 'columnInsertBefore', editorType, true );
		},

		'test focus should be not moved outside the table and the editor after exec: \'column -> Insert Column After\' and pressing the TAB key': function( editor ) {
			var editorType = editor.name;
			assertTable( 'columnInsertAfter', editorType );
		},

		'test focus should be not moved outside the table and the editor after exec: \'column -> Insert Column After\' and pressing the SHIFT + TAB key': function( editor ) {
			var editorType = editor.name + 'previous';
			assertTable( 'columnInsertAfter', editorType, true );
		},

		'test focus should be not moved outside the table and the editor after exec: \'column -> Delete Columns\' and pressing the TAB key': function( editor ) {
			var editorType = editor.name;
			assertTable( 'columnDelete', editorType );
		},

		'test focus should be not moved outside the table and the editor after exec: \'column -> Delete Columns\' and pressing the SHIFT + TAB key': function( editor ) {
			var editorType = editor.name + 'previous';
			assertTable( 'columnDelete', editorType );
		},

		'test focus should be not moved outside the table and the editor after exec: \'cell -> Merge Cells\' and pressing the TAB key': function( editor ) {
			var	action = 'cellMerge',
				editorName = editor.name + action;

			bender.editorBot.create( {
				name: editorName,
				config: {
					plugins: 'tab, tabletools, tableselection'
				}
			}, function( bot ) {
				var editor = bot.editor,
					editable = editor.editable();

				bot.setHtmlWithSelection( '<table border="1">' +
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
				'</table>' );

				bot.execCommand( action );

				editable.fire( 'keydown', new CKEDITOR.dom.event( {
					keyCode: 9,
					shiftKey: false
				} ) );

				var selection = editor.getSelection(),
					isSelectionInTable = selection.isInTable( true );

				assert.isTrue( isSelectionInTable, 'Selection was moved outside the table after invoke ' + action + ' command.' );
			} );

		},

		'test focus should be not moved outside the table and the editor after exec: \'cell -> Merge Cells\' and pressing the SHIFT + TAB key': function( editor ) {
			var	action = 'cellMerge',
				editorName = editor.name + 'previous' + action;

			bender.editorBot.create( {
				name: editorName,
				config: {
					plugins: 'tab, tabletools, tableselection',
					style: 'display: none'
				}
			}, function( bot ) {
				var editor = bot.editor,
					editable = editor.editable();

				bot.setHtmlWithSelection( '<table border="1">' +
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
				'</table>' );

				bot.execCommand( action );

				editable.fire( 'keydown', new CKEDITOR.dom.event( {
					keyCode: 9,
					shiftKey: true
				} ) );

				var selection = editor.getSelection(),
					isSelectionInTable = selection.isInTable( true );

				assert.isTrue( isSelectionInTable, 'Selection was moved outside the table after invoke ' + action + ' command.' );
			} );

		}
	};

	function assertTable( action, editorType, shiftKey ) {
		var editorName = 'tableselection-' + action + '-' + editorType;

		bender.editorBot.create( {
			name: editorName,
			config: {
				plugins: 'tab, tabletools, tableselection'
			}
		}, function( bot ) {
			var editor = bot.editor,
				editable = editor.editable();

			bot.setHtmlWithSelection( '<table border="1">' +
				'<tbody>' +
					'<tr>' +
						'<td>1_1</td>' +
						'<td>1_2</td>' +
					'</tr>' +
					'<tr>' +
						'<td>success!^</td>' +
						'<td>2_2</td>' +
					'</tr>' +
					'<tr>' +
						'<td>3_1</td>' +
						'<td>3_2</td>' +
					'</tr>' +
				'</tbody>' +
			'</table>' );

			bot.execCommand( action );

			editable.fire( 'keydown', new CKEDITOR.dom.event( {
				keyCode: 9,
				shiftKey: shiftKey ? true : false
			} ) );

			var selection = editor.getSelection(),
				isSelectionInTable = selection.isInTable( true );

			assert.isTrue( isSelectionInTable, 'Selection was moved outside the table after invoke ' + action + ' command.' );
		} );
	}

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	bender.test( tests );
} )();
