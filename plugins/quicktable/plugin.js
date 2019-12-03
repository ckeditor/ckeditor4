/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview [Quick Table](https://ckeditor.com/cke4/addon/quicktable) plugin.
 */

( function() {
	'use strict';

	CKEDITOR.plugins.add( 'quicktable', {
		requires: 'panelbutton,floatpanel'
	} );

	/**
	 * The main class implementing [Quick Table](https://ckeditor.com/cke4/addon/quicktable) feature.
	 *
	 * It acts as a simplified, selectable grid menu option, reducing steps required to insert custom grid
	 * structure based on rows and columns size.
	 *
	 * @since 4.14.0
	 * @class CKEDITOR.plugins.quicktable
	 */
	CKEDITOR.plugins.quicktable = CKEDITOR.tools.createClass( {
		/**
		 * Initializes Quick Table instance over existing plugin defined by passed
		 * {@link CKEDITOR.plugins.quicktable.definition defintion configuration}.
		 *
		 * ```javascript
		 * var quicktable = new CKEDITOR.plugins.quicktable( editor );
		 *
		 * quicktable.addButton( 'Table', {
		 * 	title: 'Insert table',
		 * 	label: 'Table',
		 * 	insert: CKEDITOR.plugins.table.insert
		 * 	command: 'table'
		 * } );
		 * ```
		 *
		 * @constructor
		 * @param {CKEDITOR.editor} editor
		 */
		$: function( editor ) {
			this.editor = editor;

			/**
			 * Indicates the number of rows and columns of the selectable grid.
			 *
			 * @property {Number} [=10]
			 * @readonly
			 */
			this.gridSize = 10;
		},

		proto: {
			/**
			 * Adds menu button to the [Toolbar](https://ckeditor.com/cke4/addon/toolbar).
			 *
			 * @param {String} name UI element name.
			 * @param {CKEDITOR.plugins.quicktable.definition} definition
			 */
			addButton: function( name, definition ) {
				var path = this.editor.plugins.quicktable.path,
					that = this;

				this.definition = definition;

				this.editor.ui.add( name, CKEDITOR.UI_PANELBUTTON, CKEDITOR.tools.extend( definition, {
					modes: { wysiwyg: 1 },
					onBlock: function( panel, block ) {
						that._.initializeComponent( panel, block );

						block.autoSize = true;

						CKEDITOR.ui.fire( 'ready', this );
					},
					panel: {
						css: path + 'skins/default.css',
						attributes: { role: 'listbox', 'aria-label': definition.label }
					}
				}, true ) );
			}
		},

		_: {
			initializeComponent: function( panel, block ) {
				this.block = block;
				this.element = block.element;

				this.element.addClass( 'cke_quicktable' );
				this.element.getDocument().getBody().setStyle( 'overflow', 'hidden' );

				if ( this.definition.command ) {
					this._.addCommandButton();
				}

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
				' role="button"' +
				' aria-labelledby="{statusId}"' +
				' draggable="false"' +
				' ondragstart="return false;"' +
				' href="javascript:void(0);"' +
				'>&nbsp;</a>'
			),

			commandButtonTemplate: new CKEDITOR.template( '<a' +
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

			addCommandButton: function() {
				var icon = CKEDITOR.skin.icons[ this.definition.command ],
					button = this._.createElementFromTemplate( this._.commandButtonTemplate, {
						title: this.definition.label,
						iconPath: icon && icon.path
					} ),
					row = this._.createElementFromTemplate( this._.rowTemplate );

				row.append( button );

				// These elements won't be focused by panel plugin due to missing correct attribute and visibility,
				// however, they will fix the issue where panel rows are not equal size for vertical navigation.
				for ( var i = 0; i < this.gridSize - 1; i++ ) {
					row.append( this._.createFillingFocusable() );
				}

				this.element.append( row );

				button.on( 'click', function() {
					this.editor.execCommand( this.definition.command );
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

				this.grid.insertBefore( this.status );

				this.grid.on( 'mouseover', this._.handleGridSelection );
				this.grid.on( 'click', function() {
					if ( this.definition.insert ) {
						this.definition.insert( this.editor, this._.rows, this._.cols );
					}
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

	/**
	 *
	 * Abstract class describing the definition of the [Quick Table](https://ckeditor.com/cke4/addon/quicktable) plugin configuration.
	 *
	 * Simple usage:
	 *
	 * ```javascript
 	 * var definition = {
	 * 	title: 'Insert table',
	 * 	label: 'Table',
	 * 	insert: CKEDITOR.plugins.table.insert
	 * 	command: 'table'
	 * };
	 * ```
	 *
	 * @class CKEDITOR.plugins.quicktable.definition
	 * @abstract
	 * @since 4.14.0
	 */

	/**
	 * The title of the menu button.
	 *
	 * @property {String} title
	 */

	/**
	 * The label of the UI element.
	 *
	 * @property {String} label
	 */

	/**
	 * Callback executed once user clicked one of the grid cells.
	 *
	 * @method insert
	 * @param {CKEDITOR.editor} editor
	 * @param {Number} rows Number of rows selected by a user.
	 * @param {Number} cols Number of columns selected by a user.
	 */

	/**
	 * Command associated with the panel.
	 *
	 * @property {String} [command]
	 */
} )();
