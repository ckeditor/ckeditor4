/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'table', {
	init: function( editor ) {
		var table = CKEDITOR.plugins.table,
			lang = editor.lang.table;

		editor.addCommand( 'table', new CKEDITOR.dialogCommand( 'table' ) );
		editor.addCommand( 'tableProperties', new CKEDITOR.dialogCommand( 'tableProperties' ) );
		editor.ui.addButton( 'Table', {
			label: lang.toolbar,
			command: 'table'
		});

		CKEDITOR.dialog.add( 'table', this.path + 'dialogs/table.js' );
		CKEDITOR.dialog.add( 'tableProperties', this.path + 'dialogs/table.js' );

		// If the "menu" plugin is loaded, register the menu items.
		if ( editor.addMenuItems ) {
			editor.addMenuItems({
				table: {
					label: lang.menu,
					command: 'tableProperties',
					group: 'table',
					order: 5
				},

				//					tabledelete :
				//					{
				//						label : lang.deleteTable,
				//						command : 'tableDelete',
				//						group : 'table',
				//						order : 1
				//					},

				tablecell: {
					label: lang.cell.menu,
					group: 'tablecell',
					order: 1,
					getItems: function() {
						return {
							tablecell_insertBefore: CKEDITOR.TRISTATE_OFF,
							tablecell_insertAfter: CKEDITOR.TRISTATE_OFF,
							tablecell_delete: CKEDITOR.TRISTATE_OFF
						};
					}
				},

				tablecell_insertBefore: {
					label: lang.cell.insertBefore,
					group: 'tablecell',
					order: 5
				},

				tablecell_insertAfter: {
					label: lang.cell.insertAfter,
					group: 'tablecell',
					order: 10
				},

				tablecell_delete: {
					label: lang.cell.deleteCell,
					group: 'tablecell',
					order: 15
				},

				tablerow: {
					label: lang.row.menu,
					group: 'tablerow',
					order: 1,
					getItems: function() {
						return {
							tablerow_insertBefore: CKEDITOR.TRISTATE_OFF,
							tablerow_insertAfter: CKEDITOR.TRISTATE_OFF,
							tablerow_delete: CKEDITOR.TRISTATE_OFF
						};
					}
				},

				tablerow_insertBefore: {
					label: lang.row.insertBefore,
					group: 'tablerow',
					order: 5
				},

				tablerow_insertAfter: {
					label: lang.row.insertAfter,
					group: 'tablerow',
					order: 10
				},

				tablerow_delete: {
					label: lang.row.deleteRow,
					group: 'tablerow',
					order: 15
				},

				tablecolumn: {
					label: lang.column.menu,
					group: 'tablecolumn',
					order: 1,
					getItems: function() {
						return {
							tablecolumn_insertBefore: CKEDITOR.TRISTATE_OFF,
							tablecolumn_insertAfter: CKEDITOR.TRISTATE_OFF,
							tablecolumn_delete: CKEDITOR.TRISTATE_OFF
						};
					}
				},

				tablecolumn_insertBefore: {
					label: lang.column.insertBefore,
					group: 'tablecolumn',
					order: 5
				},

				tablecolumn_insertAfter: {
					label: lang.column.insertAfter,
					group: 'tablecolumn',
					order: 10
				},

				tablecolumn_delete: {
					label: lang.column.deleteColumn,
					group: 'tablecolumn',
					order: 15
				}
			});
		}

		// If the "contextmenu" plugin is loaded, register the listeners.
		if ( editor.contextMenu ) {
			editor.contextMenu.addListener( function( element, selection ) {
				if ( !element )
					return;

				var isTable = element.is( 'table' );
				var isCell = !isTable && element.hasAscendant( 'table' );

				if ( isTable || isCell ) {
					var ret = isCell ? {
						tablecell: CKEDITOR.TRISTATE_OFF,
						tablerow: CKEDITOR.TRISTATE_OFF,
						tablecolumn: CKEDITOR.TRISTATE_OFF
					} : {};

					ret.tabledelete = CKEDITOR.TRISTATE_OFF;
					ret.table = CKEDITOR.TRISTATE_OFF;

					return ret;
				}

				return null;
			});
		}
	}
});
