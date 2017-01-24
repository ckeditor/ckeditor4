CKEDITOR.plugins.add( 'tabletoolstoolbar', {
    requires: 'table,tabletools',
    icons: 'table,tablealignleft,tablealigncenter,tablealignright,tablecellaligleft,tablecellinsertbefore,tablecellinsertafter,tablecelldelete,tablecellproperties,tablecellsmerge,tablecellmergeright,tablecellmergedown,tablecellsplithorizontal,tablecellsplitvertical,tabledelete,tableinsert,tableproperties,tablerowinsertbefore,tablerowinsertafter,tablerowdelete,tablecolumninsertbefore,tablecolumninsertafter,tablecolumndelete',
    init: function( editor ) {
		var lang = editor.lang.table;

        //---------- BUTTONS

        //-----------BUTTONS > table
        editor.ui.addButton( 'tableinsert', {
            label: lang.toolbar,
            command: 'table',
            toolbar: 'table'
        });

        editor.ui.addButton( 'tabledelete', {
            label: lang.deleteTable,
            command: 'tableDelete',
            toolbar: 'table'
        });

        editor.ui.addButton( 'tableproperties', {
            label: lang.menu,
            command: 'tableProperties',
            toolbar: 'table'
        });



        //TODO: How to add separator?
        //-----------BUTTONS > tabletools

        //-----------BUTTONS > tabletools > row
        editor.ui.addButton( 'tablerowinsertbefore', {
            label: lang.row.insertBefore,
            command: 'rowInsertBefore',
            toolbar: 'tablerow'
        });

        editor.ui.addButton( 'tablerowinsertafter', {
            label: lang.row.insertAfter,
            command: 'rowInsertAfter',
            toolbar: 'tablerow'
        });

        editor.ui.addButton( 'tablerowdelete', {
            label: lang.row.deleteRow,
            command: 'rowDelete',
            toolbar: 'tablerow'
        });


        //-----------BUTTONS > tabletools > column
        editor.ui.addButton( 'tablecolumninsertbefore', {
            label: lang.column.insertBefore,
            command: 'columnInsertBefore',
            toolbar: 'tablecolumn'
        });


        editor.ui.addButton( 'tablecolumninsertafter', {
            label: lang.column.insertAfter,
            command: 'columnInsertAfter',
            toolbar: 'tablecolumn'
        });

        editor.ui.addButton( 'tablecolumndelete', {
            label: lang.column.deleteColumn,
            command: 'columnDelete',
            toolbar: 'tablecolumn'
        });



        //-----------BUTTONS > tabletools > cell
        editor.ui.addButton( 'tablecellinsertbefore', {
            label: lang.cell.insertBefore,
            command: 'cellInsertBefore',
            toolbar: 'tablecell'
        });
        
        editor.ui.addButton( 'tablecellinsertafter', {
            label: lang.cell.insertAfter,
            command: 'cellInsertAfter',
            toolbar: 'tablecell'
        });

        editor.ui.addButton( 'tablecelldelete', {
            label: lang.cell.deleteCell,
            command: 'cellDelete',
            toolbar: 'tablecell'
        });

        editor.ui.addButton( 'tablecellproperties', {
            label: lang.cell.title,
            command: 'cellProperties',
            toolbar: 'tablecell'
        });

        //-----------BUTTONS > tabletools > cell merge/split

        editor.ui.addButton( 'tablecellsmerge', {
            label: lang.cell.merge,
            command: 'cellMerge',
            toolbar: 'tablecellmergesplit'
        });

        editor.ui.addButton( 'tablecellmergeright', {
            label: lang.cell.mergeRight,
            command: 'cellMergeRight',
            toolbar: 'tablecellmergesplit'
        });

        editor.ui.addButton( 'tablecellmergedown', {
            label: lang.cell.mergeDown,
            command: 'cellMergeDown',
            toolbar: 'tablecellmergesplit'
        });

        editor.ui.addButton( 'tablecellsplithorizontal', {
            label: lang.cell.splitHorizontal,
            command: 'cellHorizontalSplit',
            toolbar: 'tablecellmergesplit'
        });

        editor.ui.addButton( 'tablecellsplitvertical', {
            label: lang.cell.splitVertical,
            command: 'cellVerticalSplit',
            toolbar: 'tablecellmergesplit'
        });
  }
});