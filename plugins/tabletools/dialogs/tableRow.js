/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.dialog.add( 'rowProperties', function( editor ) {
	var langTable = editor.lang.table,
		langRow = langTable.row;

  var dialogadvtab = editor.plugins.dialogadvtab;

	return {
		title: langRow.title,
		minWidth: CKEDITOR.env.ie && CKEDITOR.env.quirks ? 450 : 410,
		minHeight: CKEDITOR.env.ie && ( CKEDITOR.env.ie7Compat || CKEDITOR.env.quirks ) ? 230 : 220,
		contents: [dialogadvtab && dialogadvtab.createAdvancedTab( editor, null, 'tr' )],
		onShow: function() {
			this.row = CKEDITOR.plugins.tabletools.getSelectedCells( this._.editor.getSelection() )[0].getParent();
			this.setupContent( this.row );
		},
		onOk: function() {
			var selection = this._.editor.getSelection(),
				bookmarks = selection.createBookmarks();

			var row = this.row;
				this.commitContent(row);

			this._.editor.forceNextSelectionCheck();
			selection.selectBookmarks( bookmarks );
			this._.editor.selectionChange();
		},
		onLoad: function() {
			var saved = {};

			// Prevent from changing cell properties when the field's value
			// remains unaltered, i.e. when selected multiple cells and dialog loaded
			// only the properties of the first cell (#11439).
			this.foreach( function( field ) {
				if ( !field.setup || !field.commit )
					return;

				// Save field's value every time after "setup" is called.
				field.setup = CKEDITOR.tools.override( field.setup, function( orgSetup ) {
					return function() {
						orgSetup.apply( this, arguments );
						saved[ field.id ] = field.getValue();
					};
				} );

				// Compare saved value with actual value. Update cell only if value has changed.
				field.commit = CKEDITOR.tools.override( field.commit, function( orgCommit ) {
					return function() {
						if ( saved[ field.id ] !== field.getValue() )
							orgCommit.apply( this, arguments );
					};
				} );
			} );
		}
	};
} );
