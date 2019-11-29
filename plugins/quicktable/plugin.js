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
		requires: 'panelbutton,floatpanel',
		// jscs:disable maximumLineLength
		lang: 'af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		// jscs:enable maximumLineLength
		init: function( editor ) {
			var lang = editor.lang.quicktable;

			if ( editor.plugins.table ) {
				new CKEDITOR.plugins.quicktable( editor, {
					name: 'table',
					label: lang.table,
					title: lang.table,
					insert: function( rows, cols ) {
						CKEDITOR.plugins.table.insert( editor, rows, cols );
					}
				} ).attach();
			}
		}
	} );

	CKEDITOR.plugins.quicktable = CKEDITOR.tools.createClass( {
		$: function( editor, definition ) {
			this.editor = editor;
			this.definition = definition;

			this.gridSize = 10;
		},

		proto: {
			attach: function() {
				var definition = this.definition,
					path = this.editor.plugins.quicktable.path,
					lang = this.editor.lang,
					that = this;

				this.editor.ui.add( this.getPanelName(), CKEDITOR.UI_PANELBUTTON, {
					icon: definition.icon || definition.name,
					label: definition.label,
					title: definition.title,
					modes: { wysiwyg: 1 },
					toolbar: 'insert,10',
					onBlock: function( panel, block ) {
						that._.initializeComponent( panel, block );

						block.autoSize = true;

						CKEDITOR.ui.fire( 'ready', this );
					},
					panel: {
						css: path + 'skins/default.css',
						attributes: { role: 'listbox', 'aria-label': lang.insert }
					}
				} );

			},

			getPanelName: function() {
				return 'quicktable' + this.definition.name;
			}
		},

		_: {
			initializeComponent: function( panel, block ) {
				this.block = block;
				this.element = block.element;

				this.element.addClass( 'cke_quicktable' );
				this.element.getDocument().getBody().setStyle( 'overflow', 'hidden' );

				this._.addAdvancedButton();
				this._.addStatus();
				this._.addGrid();
				this._.handleKeyoardNavigation();

				this.block.vNavOffset = this.gridSize;
			},

			handleKeyoardNavigation: function() {
				var keys = this.block.keys,
					rtl = this.editor.lang.dir == 'rtl';

				keys[ rtl ? 37 : 39 ] = 'next'; // ARROW-RIGHT
				keys[ 40 ] = 'down'; // ARROW-DOWN
				keys[ 9 ] = 'next'; // TAB
				keys[ rtl ? 39 : 37 ] = 'prev'; // ARROW-LEFT
				keys[ 38 ] = 'up'; // ARROW-UP
				keys[ CKEDITOR.SHIFT + 9 ] = 'prev'; // SHIFT + TAB
				keys[ 32 ] = 'click'; // SPACE
			},

			gridTemplate: new CKEDITOR.template( '<div' +
				' class="cke_quicktable_grid"' +
				' role="menu"' +
				'></div>'
			),

			rowTemplate: new CKEDITOR.template( '<div' +
				' class="cke_quicktable_row"' +
				'></div>'
			),

			cellTemplate: new CKEDITOR.template( '<a' +
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

			advButtonTemplate: new CKEDITOR.template( '<a' +
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
			),

			addAdvancedButton: function() {
				var button = this._.createElementFromTemplate( this._.advButtonTemplate, {
						title: this.definition.title,
						iconPath: CKEDITOR.skin.icons[ this.definition.name ].path
					} ),
					row = this._.createElementFromTemplate( this._.rowTemplate );

				row.append( button );

				// These elements won't be focused by panel plugin due to missing correct attribute and visibility,
				// however, they will fix the issue where panel rows are not equal size for vertical navigation.
				for ( var i = 0; i < GRID_SIZE - 1; i++ ) {
					row.append( this._.createFillingFocusable() );
				}

				this.element.append( row );

				button.on( 'click', function() {
					this.editor.execCommand( this.definition.name );
				}, this );

				button.on( 'focus', this._.clearSelectedCells, this );
			},

			createFillingFocusable: function() {
				return CKEDITOR.dom.element.createFromHtml( '<a' +
					' href="javascript:void(0);"' +
					' style="display: none;"' +
					' role="presentation" />' );
			},

			clearSelectedCells: function() {
				var cells = this.grid.find( '.cke_quicktable_selected' ).toArray();

				for ( var i = 0; i < cells.length; i++ ) {
					cells[ i ].removeClass( 'cke_quicktable_selected' );
				}
			},

			addStatus: function() {
				this.status = new CKEDITOR.dom.element( 'div' );

				this.status.addClass( 'cke_quicktable_status' );
				this.status.setText( '0 x 0' );
				this.status.setAttribute( 'id', CKEDITOR.tools.getNextId() + '_quicktable_status' );

				this.element.append( this.status );
			},

			addGrid: function() {
				this.grid = this._.createGridElement();

				this.element.append( this.grid );

				this.grid.on( 'mouseover', this._.handleGridSelection );
				this.grid.on( 'click', function() {
					this.definition.insert( this._.rows, this._.cols );
				}, this );
			},

			createGridElement: function() {
				var grid = this._.createElementFromTemplate( this._.gridTemplate );

				for ( var i = 0; i < this.gridSize; i++ ) {
					var row = this._.createElementFromTemplate( this._.rowTemplate );

					for ( var j = 0; j < this.gridSize; j++ ) {
						var cell = this._.createElementFromTemplate( this._.cellTemplate, {
							statusId: this.status.getId()
						} );

						cell.on( 'focus', this._.handleGridSelection );
						row.append( cell );
					}

					grid.append( row );
				}

				return grid;
			},

			handleGridSelection: function( evt ) {
				var targetCellElement = evt.data.getTarget();

				if ( !targetCellElement.hasClass( 'cke_quicktable_cell' ) ) {
					return;
				}

				targetCellElement.focus();

				this._.cols = targetCellElement.getIndex() + 1;
				this._.rows = targetCellElement.getParent().getIndex() + 1;

				this._.updateGridStatus();
				this._.updateGridSelection();
			},

			updateGridStatus: function() {
				this.status.setText( this._.rows + ' x ' + this._.cols );
			},

			updateGridSelection: function() {
				var rows = this.grid.find( '.cke_quicktable_row' );

				for ( var i = 0; i < rows.count(); i++ ) {
					var row = rows.getItem( i );

					for ( var j = 0; j < row.getChildCount(); j++ ) {
						var cell = row.getChild( j );

						if ( i < this._.rows && j < this._.cols ) {
							cell.addClass( 'cke_quicktable_selected' );
						} else {
							cell.removeClass( 'cke_quicktable_selected' );
						}
					}
				}
			},

			createElementFromTemplate: function( template, options ) {
				return CKEDITOR.dom.element.createFromHtml( template.output( options ) );
			}
		}
	} );
} )();
