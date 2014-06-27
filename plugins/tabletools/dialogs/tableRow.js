/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.dialog.add( 'rowProperties', function( editor ) {
	var langTable = editor.lang.table,
		langRow = langTable.row,
		langCommon = editor.lang.common,
		validate = CKEDITOR.dialog.validate,
		widthPattern = /^(\d+(?:\.\d+)?)(px|%)$/,
		heightPattern = /^(\d+(?:\.\d+)?)px$/,
		bind = CKEDITOR.tools.bind,
		spacer = { type: 'html', html: '&nbsp;' },
		rtl = editor.lang.dir == 'rtl',
		colorDialog = editor.plugins.colordialog;

	// Returns a function, which runs regular "setup" for all selected cells to find out
	// whether the initial value of the field would be the same for all cells. If so,
	// the value is displayed just as if a regular "setup" was executed. Otherwise,
	// i.e. when there are several cells of different value of the property, a field
	// gets empty value.
	//
	// * @param {Function} setup Setup function which returns a value instead of setting it.
	// * @returns {Function} A function to be used in dialog definition.
	function setupCells( setup ) {
		return function( cells ) {
			var fieldValue = setup( cells[ 0 ] );

			// If one of the cells would have a different value of the
			// property, set the empty value for a field.
			for ( var i = 1; i < cells.length; i++ ) {
				if ( setup( cells[ i ] ) !== fieldValue ) {
					fieldValue = null;
					break;
				}
			}

			// Setting meaningful or empty value only makes sense
			// when setup returns some value. Otherwise, a *default* value
			// is used for that field.
			if ( typeof fieldValue != 'undefined' ) {
				this.setValue( fieldValue );

				// The only way to have an empty select value in Firefox is
				// to set a negative selectedIndex.
				if ( CKEDITOR.env.gecko && this.type == 'select' && !fieldValue )
					this.getInputElement().$.selectedIndex = -1;
			}
		};
	}

	// Reads the unit of width property of the table cell.
	//
	// * @param {CKEDITOR.dom.element} cell An element representing table cell.
	// * @returns {String} A unit of width: 'px', '%' or undefined if none.
	function getCellWidthType( cell ) {
		var match = widthPattern.exec(
			cell.getStyle( 'width' ) || cell.getAttribute( 'width' ) );

		if ( match )
			return match[ 2 ];
	}

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
