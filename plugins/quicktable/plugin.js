/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview [Quick Table](https://ckeditor.com/cke4/addon/quicktable) plugin.
 */

( function() {
	var GRID_SIZE = 10;

	CKEDITOR.plugins.add( 'quicktable', {
		requires: 'panelbutton,floatpanel'
	} );

	CKEDITOR.plugins.quicktable = {
		init: function( editor, definition ) {
			var lang = editor.lang,
				path = editor.plugins.quicktable.path;

			editor.ui.add( 'quicktable', CKEDITOR.UI_PANELBUTTON, {
				icon: definition.icon || definition.name,
				label: definition.label,
				title: definition.title,
				modes: { wysiwyg: 1 },
				toolbar: 'insert,10',
				onBlock: function( panel, block ) {
					addAdvancedButton( editor, block.element, definition );
					initializeGridFeature( editor, block.element, definition.insert );
					handleKeyoardNavigation( block, editor.lang.dir == 'rtl' );

					block.autoSize = true;
					block.vNavOffset = GRID_SIZE;

					CKEDITOR.ui.fire( 'ready', this );
				},
				panel: {
					css: path + 'skins/default.css',
					attributes: { role: 'listbox', 'aria-label': lang.insert }
				}
			} );
		}
	};

	function initializeGridFeature( editor, element, insert ) {
		var status = createStatusElement(),
			grid = createGridElement( GRID_SIZE, status.getId() );

		element.append( grid );
		element.append( status );

		grid.on( 'mouseover', handleGridSelection );
		grid.on( 'click', function() {
			insert( getGridData( grid ) );
		} );

		element.addClass( 'cke_quicktable' );
		element.getDocument().getBody().setStyle( 'overflow', 'hidden' );
	}

	function handleKeyoardNavigation( block, rtl ) {
		var keys = block.keys;

		keys[ rtl ? 37 : 39 ] = 'next'; // ARROW-RIGHT
		keys[ 40 ] = 'down'; // ARROW-DOWN
		keys[ 9 ] = 'next'; // TAB
		keys[ rtl ? 39 : 37 ] = 'prev'; // ARROW-LEFT
		keys[ 38 ] = 'up'; // ARROW-UP
		keys[ CKEDITOR.SHIFT + 9 ] = 'prev'; // SHIFT + TAB
		keys[ 32 ] = 'click'; // SPACE
	}

	var gridTemplate = new CKEDITOR.template( '<div' +
			' class="cke_quicktable_grid"' +
			' role="menu"' +
			'></div>'
		),
		rowTemplate = new CKEDITOR.template( '<div' +
			' class="cke_quicktable_row"' +
			'></div>'
		),
		cellTemplate = new CKEDITOR.template( '<a' +
			' _cke_focus=1' +
			' class="cke_quicktable_cell"' +
			' hidefocus=true' +
			' role="menuitem"' +
			' aria-labelledby="{statusId}"' +
			' draggable="false"' +
			' ondragstart="return false;"' +
			' href="javascript:void(0);"' +
			'>&nbsp;</a>'
		),
		advButtonTemplate = new CKEDITOR.template( '<a' +
				' class="cke_quicktable_button"' +
				' style="background-image:url(\'{iconPath}\')"' +
				' _cke_focus=1' +
				' title="{title}"' +
				' hidefocus=true' +
				' role="button"' +
				' draggable="false"' +
				' ondragstart="return false;"' +
				' href="javascript:void(0);"' +
				'>{title}</a>'
		);

	function createGridElement( size, statusId ) {
		var grid = createElementFromTemplate( gridTemplate );

		for ( var i = 0; i < size; i++ ) {
			var row = createElementFromTemplate( rowTemplate );

			for ( var j = 0; j < size; j++ ) {
				var cell = createElementFromTemplate( cellTemplate, {
					statusId: statusId
				} );

				cell.on( 'focus', handleGridSelection );
				row.append( cell );
			}
			grid.append( row );
		}

		return grid;
	}

	function addAdvancedButton( editor, element, definition ) {
		var button = createElementFromTemplate( advButtonTemplate, {
				title: definition.title,
				iconPath: CKEDITOR.skin.icons[ definition.name ].path
			} ),
			row = createElementFromTemplate( rowTemplate );

		row.append( button );

		// These elements won't be focused by panel plugin due to missing correct attribute and visibility,
		// however, they will fix the issue where panel rows are not equal size for vertical navigation.
		for ( var i = 0; i < GRID_SIZE - 1; i++ ) {
			row.append( createFillingFocusable() );
		}

		element.append( row );

		button.on( 'click', function() {
			editor.execCommand( definition.name );
		} );

		button.on( 'focus', function() {
			clearSelectedCells( element );
		} );
	}

	function clearSelectedCells( container ) {
		var cells = container.find( '.cke_quicktable_selected' ).toArray();

		for ( var i = 0; i < cells.length; i++ ) {
			cells[ i ].removeClass( 'cke_quicktable_selected' );
		}
	}

	function createFillingFocusable() {
		return CKEDITOR.dom.element.createFromHtml( '<a' +
			' href="javascript:void(0);"' +
			' style="display: none;"' +
			' role="presentation" />' );
	}

	function findGridElement( node ) {
		return node.type == CKEDITOR.NODE_ELEMENT && node.hasClass( 'cke_quicktable_grid' );
	}

	function createElementFromTemplate( template, options ) {
		return CKEDITOR.dom.element.createFromHtml( template.output( options ) );
	}

	function createStatusElement() {
		var element = new CKEDITOR.dom.element( 'div' );

		element.addClass( 'cke_quicktable_status' );
		element.setText( '0 x 0' );
		element.setAttribute( 'id', CKEDITOR.tools.getNextId() + '_quicktable_status' );

		return element;
	}

	function handleGridSelection( evt ) {
		var targetCellElement = evt.data.getTarget();

		if ( !targetCellElement.hasClass( 'cke_quicktable_cell' ) ) {
			return;
		}

		var grid = targetCellElement.getAscendant( findGridElement ),
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
} )();
