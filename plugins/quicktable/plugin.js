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
					registerGridFeature( editor, block.element );

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

	function registerGridFeature( editor, element ) {
		var grid = createGridElement( 10, 10 ),
			status = createStatusElement();

		element.append( grid );
		element.append( status );

		grid.on( 'mouseover', selectGrid );
		grid.on( 'click', commitTable, editor );

		element.addClass( 'cke_quicktable' );
		element.getDocument().getBody().setStyle( 'overflow', 'hidden' );
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

		grid.addClass( 'cke_quicktable_grid' );

		return grid;
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
			y = targetCellElement.getIndex(),
			x = targetCellElement.getParent().getIndex();

		grid.data( 'cols', y + 1 );
		grid.data( 'rows', x + 1 );

		updateGridStatus( grid );

		for ( var i = 0; i < rows.count(); i++ ) {
			var row = rows.getItem( i );

			for ( var j = 0; j < row.getChildCount(); j++ ) {
				var cell = row.getChild( j );

				if ( i <= x && j <= y ) {
					selectGridCell( cell );
				} else {
					unselectGridCell( cell );
				}
			}
		}
	}

	function updateGridStatus( grid ) {
		var status = grid.getParent().findOne( '.cke_quicktable_status' ),
			cols = grid.data( 'cols' ),
			rows = grid.data( 'rows' );

		status.setText( cols + ' x ' + rows );
	}

	function commitTable( evt ) {
		var grid = evt.sender,
			cols = grid.data( 'cols' ),
			rows = grid.data( 'rows' );

		this.insertElement( createTableElement( rows, cols ) );
	}

	function resetGridSelection( container ) {
		var cells = container.find( '.cke_quicktable_grid .cke_quicktable_cell' ).toArray();

		for ( var i = 0; i < cells.length; i++ ) {
			unselectGridCell( cells[ i ] );
		}

		selectGridCell( cells[ 0 ] );
	}

	function selectGridCell( element ) {
		element.addClass( 'cke_quicktable_selected' );
	}

	function unselectGridCell( element ) {
		element.removeClass( 'cke_quicktable_selected' );
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

		table.setAttribute( 'cellspacing', 1 );
		table.setAttribute( 'border', 1 );
		table.setStyle( 'width', '500px' );

		return table;
	}
} )();
