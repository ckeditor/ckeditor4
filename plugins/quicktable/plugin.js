/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview [Quick Table](https://ckeditor.com/cke4/addon/quicktable) plugin.
 */

( function() {

	CKEDITOR.plugins.add( 'quicktable', {
		requires: 'panelbutton,floatpanel',
		// jscs:disable maximumLineLength
		lang: 'af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		// jscs:enable maximumLineLength
		icons: 'quicktable', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%

		init: function( editor ) {
			var lang = editor.lang.quicktable;

			editor.ui.add( 'quicktable', CKEDITOR.UI_PANELBUTTON, {
				label: lang.title,
				title: lang.title,
				modes: { wysiwyg: 1 },
				toolbar: 'insert,10',
				onBlock: function( panel, block ) {
					var grid = createGridElement( 10, 10 ),
						status = new CKEDITOR.dom.element( 'div' );

					status.addClass( 'cke_quicktable_status' );
					status.setText( '0 x 0' );

					grid.on( 'mouseover', selectGrid, this );
					grid.on( 'click', commitTable, this );

					block.autoSize = true;

					block.element.append( grid );
					block.element.append( status );

					block.element.addClass( 'cke_quicktable' );
					block.element.getDocument().getBody().setStyle( 'overflow', 'hidden' );

					CKEDITOR.ui.fire( 'ready', this );
				},
				panel: {
					css: this.path + 'skins/default.css',
					attributes: { role: 'listbox', 'aria-label': lang.insert }
				}
			} );
		}
	} );

	function selectGrid( evt ) {
		var target = evt.data.getTarget();

		if ( !target.hasClass( 'cke_quicktable_cell' ) ) {
			return;
		}

		var grid = evt.sender,
			status = evt.sender.getParent().findOne( '.cke_quicktable_status' ),
			rows = grid.find( '.cke_quicktable_row' ),
			rowsLength = rows.count(),
			y = target.getIndex(),
			x = target.getParent().getIndex(),
			colsCount = y + 1,
			rowsCount = x + 1;

		grid.data( 'cols', colsCount );
		grid.data( 'rows', rowsCount );

		status.setText( rowsCount + ' x ' + colsCount );

		for ( var i = 0; i < rowsLength; i++ ) {
			var row = rows.getItem( i ),
				colsLength = row.getChildCount();

			for ( var j = 0; j < colsLength; j++ ) {
				var cell = row.getChild( j );

				if ( i <= x && j <= y ) {
					cell.addClass( 'cke_quicktable_selected' );
				} else {
					cell.removeClass( 'cke_quicktable_selected' );
				}
			}
		}
	}

	function commitTable( evt ) {
		var grid = evt.sender,
			cols = grid.data( 'cols' ),
			rows = grid.data( 'rows' ),
			editor = this._.editor;

		if ( rows && cols ) {
			var table = createTableElement( rows, cols ),
				insertEvent = { returnValue: table };

			if ( editor.fire( 'insertTable', insertEvent ) !== false ) {
				editor.insertElement( insertEvent.returnValue );
			}
		}
	}

	function createGridElement( x, y ) {
		var grid = new CKEDITOR.dom.element( 'div' );

		for ( var i = 0; i < x; i++ ) {
			var row = new CKEDITOR.dom.element( 'div' );
			row.addClass( 'cke_quicktable_row' );

			for ( var j = 0; j < y; j++ ) {
				var cell = new CKEDITOR.dom.element( 'div' );
				cell.addClass( 'cke_quicktable_cell' );
				row.append( cell );
			}

			grid.append( row );
		}

		return grid;
	}

	function createTableElement( x, y ) {
		var table = new CKEDITOR.dom.element( 'table' );

		for ( var i = 0; i < x; i++ ) {
			var row = new CKEDITOR.dom.element( 'tr' );

			for ( var j = 0; j < y; j++ ) {
				var cell = new CKEDITOR.dom.element( 'td' );
				cell.setHtml( '&nbsp;' );
				row.append( cell );
			}

			table.append( row );
		}

		return table;
	}
} )();
