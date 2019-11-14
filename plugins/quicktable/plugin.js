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
					initializeGridFeature( editor, block.element );
					handleKeyoardNavigation( block.keys, editor.lang.dir == 'rtl' );

					block.autoSize = true;

					CKEDITOR.ui.fire( 'ready', this );
				},
				panel: {
					css: this.path + 'skins/default.css',
					attributes: { role: 'listbox', 'aria-label': lang.insert }
				},

				onOpen: function() {
					var block = this._.panel.getBlock( this._.id );

					resetGridSelection( block.element );
				}
			} );
		}
	} );

	function initializeGridFeature( editor, element ) {
		var grid = createGridElement( 10, 10 ),
			status = createStatusElement();

		element.append( grid );
		element.append( status );

		grid.on( 'mouseover', selectGrid );
		grid.on( 'click', commitTable, editor );

		element.addClass( 'cke_quicktable' );
		element.getDocument().getBody().setStyle( 'overflow', 'hidden' );
	}

	function handleKeyoardNavigation( keys, rtl ) {
		keys[ rtl ? 37 : 39 ] = 'next'; // ARROW-RIGHT
		keys[ 40 ] = 'next'; // ARROW-DOWN
		keys[ 9 ] = 'next'; // TAB
		keys[ rtl ? 39 : 37 ] = 'prev'; // ARROW-LEFT
		keys[ 38 ] = 'prev'; // ARROW-UP
		keys[ CKEDITOR.SHIFT + 9 ] = 'prev'; // SHIFT + TAB
		keys[ 32 ] = 'click'; // SPACE
	}

	var gridTemplate = new CKEDITOR.template( '<div' +
			' class="cke_quicktable_grid"' +
			' role="grid"' +
			' aria-rowcount="{rowCount}"' +
			' aria-colcount="{colCount}"' +
			'></div>'
		),
		rowTemplate = new CKEDITOR.template( '<div' +
			' class="cke_quicktable_row"' +
			' role="row"' +
			'></div>'
		),
		cellTemplate = new CKEDITOR.template( '<a' +
			' class="cke_quicktable_cell"' +
			' _cke_focus=1' +
			' hidefocus=true' +
			' title="{title}"' +
			' role="gridcell"' +
			' aria-rowindex="{rowIndex}"' +
			' aria-colIndex="{colIndex}"' +
			' draggable="false"' +
			' ondragstart="return false;"' +
			' href="javascript:void(0);"' +
			'>&nbsp;</span>' +
			'</a>'
		);

	function createGridElement( rows, cols ) {
		var grid = createElementFromTemplate( gridTemplate, {
			rowCount: rows,
			colCount: cols
		} );

		for ( var i = 0; i < rows; i++ ) {
			var row = createElementFromTemplate( rowTemplate );

			for ( var j = 0; j < cols; j++ ) {
				var cell = createElementFromTemplate( cellTemplate, {
					title: 'title',
					rowIndex: i,
					colIndex: j
				} );

				row.append( cell );
			}

			grid.append( row );
		}

		return grid;
	}

	function createElementFromTemplate( template, options ) {
		return CKEDITOR.dom.element.createFromHtml( template.output( options ) );
	}


	function createStatusElement() {
		var element = new CKEDITOR.dom.element( 'div' );

		element.addClass( 'cke_quicktable_status' );
		element.setText( '0 x 0' );

		return element;
	}

	function selectGrid( evt ) {
		var targetCellElement = evt.data.getTarget();

		if ( !targetCellElement.hasClass( 'cke_quicktable_cell' ) ) {
			return;
		}

		var grid = evt.sender,
			rows = grid.find( '.cke_quicktable_row' ),
			gridData = setGridData( grid, {
				cols: targetCellElement.getIndex() + 1,
				rows: targetCellElement.getParent().getIndex() + 1
			} );

		updateGridStatus( grid, gridData );

		for ( var i = 0; i < rows.count(); i++ ) {
			var row = rows.getItem( i );

			for ( var j = 0; j < row.getChildCount(); j++ ) {
				var cell = row.getChild( j );

				if ( i < gridData.rows && j < gridData.cols ) {
					selectGridCell( cell );
				} else {
					unselectGridCell( cell );
				}
			}
		}
	}

	function updateGridStatus( grid, gridData ) {
		var status = grid.getParent().findOne( '.cke_quicktable_status' );

		status.setText( gridData.rows + ' x ' + gridData.cols );
	}

	function commitTable( evt ) {
		var grid = evt.sender,
			gridData = getGridData( grid );

		this.insertElement( createTableElement( gridData ) );
	}

	function resetGridSelection( container ) {
		var grid = container.findOne( '.cke_quicktable_grid' ),
			cells = grid.find( '.cke_quicktable_cell' ).toArray();

		for ( var i = 0; i < cells.length; i++ ) {
			unselectGridCell( cells[ i ] );
		}

		selectGridCell( cells[ 0 ] );

		var gridData = setGridData( grid, {
			cols: 1,
			rows: 1
		} );

		updateGridStatus( grid, gridData );
	}

	function setGridData( grid, gridData ) {
		grid.data( 'cols', gridData.cols );
		grid.data( 'rows', gridData.rows );

		return gridData;
	}

	function getGridData( grid ) {
		return {
			cols: Number( grid.data( 'cols' ) ),
			rows: Number( grid.data( 'rows' ) )
		};
	}

	function selectGridCell( element ) {
		element.addClass( 'cke_quicktable_selected' );
	}

	function unselectGridCell( element ) {
		element.removeClass( 'cke_quicktable_selected' );
	}

	function createTableElement( gridData ) {
		var table = new CKEDITOR.dom.element( 'table' );

		for ( var i = 0; i < gridData.rows; i++ ) {
			var row = new CKEDITOR.dom.element( 'tr' );

			for ( var j = 0; j < gridData.cols; j++ ) {
				var cell = new CKEDITOR.dom.element( 'td' );
				cell.setHtml( '&nbsp;' );
				row.append( cell );
			}

			table.append( row );
		}

		table.setAttribute( 'cellspacing', 1 );
		table.setAttribute( 'border', 1 );
		table.setStyle( 'width', '500px' );

		return table;
	}
} )();
