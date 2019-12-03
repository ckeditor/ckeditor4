/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.plugins.add( 'table', {
	requires: 'dialog',
	// jscs:disable maximumLineLength
	lang: 'af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
	// jscs:enable maximumLineLength
	icons: 'table', // %REMOVE_LINE_CORE%
	hidpi: true, // %REMOVE_LINE_CORE%
	init: function( editor ) {
		if ( editor.blockless )
			return;

		var lang = editor.lang.table;

		editor.addCommand( 'table', new CKEDITOR.dialogCommand( 'table', {
			context: 'table',
			allowedContent: 'table{width,height,border-collapse}[align,border,cellpadding,cellspacing,summary];' +
				'caption tbody thead tfoot;' +
				'th td tr[scope];' +
				'td{border*,background-color,vertical-align,width,height}[colspan,rowspan];' +
				( editor.plugins.dialogadvtab ? 'table' + editor.plugins.dialogadvtab.allowedContent() : '' ),
			requiredContent: 'table',
			contentTransformations: [
				[ 'table{width}: sizeToStyle', 'table[width]: sizeToAttribute' ],
				[ 'td: splitBorderShorthand' ],
				[ {
					element: 'table',
					right: function( element ) {
						if ( element.styles ) {
							var parsedStyle;
							if ( element.styles.border ) {
								parsedStyle = CKEDITOR.tools.style.parse.border( element.styles.border );
							} else if ( CKEDITOR.env.ie && CKEDITOR.env.version === 8 ) {
								var styleData = element.styles;
								// Workaround for IE8 browser. It transforms CSS border shorthand property
								// to the longer one, consisting of border-top, border-right, etc. We have to check
								// if all those properties exists and have the same value (#566).
								if ( styleData[ 'border-left' ] && styleData[ 'border-left' ] === styleData[ 'border-right' ] &&
									styleData[ 'border-right' ] === styleData[ 'border-top' ] &&
									styleData[ 'border-top' ] === styleData[ 'border-bottom' ] ) {

									parsedStyle = CKEDITOR.tools.style.parse.border( styleData[ 'border-top' ] );
								}
							}
							if ( parsedStyle && parsedStyle.style && parsedStyle.style === 'solid' &&
								parsedStyle.width && parseFloat( parsedStyle.width ) !== 0 ) {
								element.attributes.border = 1;
							}
							if ( element.styles[ 'border-collapse' ] == 'collapse' ) {
								element.attributes.cellspacing = 0;
							}
						}
					}
				} ]
			]
		} ) );

		function createDef( def ) {
			return CKEDITOR.tools.extend( def || {}, {
				contextSensitive: 1,
				refresh: function( editor, path ) {
					this.setState( path.contains( 'table', 1 ) ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED );
				}
			} );
		}

		editor.addCommand( 'tableProperties', new CKEDITOR.dialogCommand( 'tableProperties', createDef() ) );
		editor.addCommand( 'tableDelete', createDef( {
			exec: function( editor ) {
				var path = editor.elementPath(),
					table = path.contains( 'table', 1 );

				if ( !table )
					return;

				// If the table's parent has only one child remove it as well (unless it's a table cell, or the editable element)
				//(https://dev.ckeditor.com/ticket/5416, https://dev.ckeditor.com/ticket/6289, https://dev.ckeditor.com/ticket/12110)
				var parent = table.getParent(),
					editable = editor.editable();

				if ( parent.getChildCount() == 1 && !parent.is( 'td', 'th' ) && !parent.equals( editable ) )
					table = parent;

				var range = editor.createRange();
				range.moveToPosition( table, CKEDITOR.POSITION_BEFORE_START );
				table.remove();
				range.select();
			}
		} ) );

		if ( editor.ui.addButton ) {
			// (#3654)
			if ( editor.plugins.quicktable ) {
				var quicktable = new CKEDITOR.plugins.quicktable( editor );

				quicktable.addButton( 'Table', {
					title: lang.toolbar,
					label: lang.insert,
					toolbar: 'insert,30',
					command: 'table',
					insert: CKEDITOR.plugins.table.insert
				} );
			} else {
				editor.ui.addButton && editor.ui.addButton( 'Table', {
					label: lang.toolbar,
					command: 'table',
					toolbar: 'insert,30'
				} );
			}
		}

		CKEDITOR.dialog.add( 'table', this.path + 'dialogs/table.js' );
		CKEDITOR.dialog.add( 'tableProperties', this.path + 'dialogs/table.js' );

		// If the "menu" plugin is loaded, register the menu items.
		if ( editor.addMenuItems ) {
			editor.addMenuItems( {
				table: {
					label: lang.menu,
					command: 'tableProperties',
					group: 'table',
					order: 5
				},

				tabledelete: {
					label: lang.deleteTable,
					command: 'tableDelete',
					group: 'table',
					order: 1
				}
			} );
		}

		editor.on( 'doubleclick', function( evt ) {
			var element = evt.data.element;

			if ( element.is( 'table' ) )
				evt.data.dialog = 'tableProperties';
		} );

		// If the "contextmenu" plugin is loaded, register the listeners.
		if ( editor.contextMenu ) {
			editor.contextMenu.addListener( function() {
				// menu item state is resolved on commands.
				return {
					tabledelete: CKEDITOR.TRISTATE_OFF,
					table: CKEDITOR.TRISTATE_OFF
				};
			} );
		}
	}
} );

	/**
	 * Table class which extends {@link CKEDITOR.dom.element} API by features
	 * related to DOM table element structure.
	 *
	 * @since 4.14.0
	 * @class CKEDITOR.plugins.table
	 * @extends CKEDITOR.dom.element
	 */
CKEDITOR.plugins.table = CKEDITOR.tools.createClass( {
	base: CKEDITOR.dom.element,

	/**
	 * Represents a table DOM element.
	 *
	 * @constructor Creates an table element class instance.
	 * @param {CKEDITOR.dom.element/Object} [element] A native DOM table element or the {@link CKEDITOR.dom.element}
	 * object. Note that {@link CKEDITOR.dom.element} still should represent native DOM table element. You can check
	 * element type using {@link CKEDITOR.dom.element#getName} method.
	 * @param {CKEDITOR.dom.document} [ownerDocument] The document that will contain
	 * the element in case of element creation.
	 */
	$: function( element, ownerDocument ) {
		if ( element && element.getName() !== 'table' ) {
			throw new Error( 'Expected table element.' );
		}

		element = element && element.$ || element;

		this.base( element || this._.createTableElement( ownerDocument ).$, ownerDocument );
	},

	_: {
		createTableElement: function( ownerDocument ) {
			var table = new CKEDITOR.dom.element( 'table', ownerDocument );
			table.append( new CKEDITOR.dom.element( 'tbody', ownerDocument ) );
			return table;
		}
	},

	statics: {
		/**
		 * Returns default table attributes.
		 *
		 * @static
		 * @param {CKEDITOR.editor} editor
		 * @returns {Object}
		 */
		getDefaultAttributes: function( editor ) {
			var editable = editor.editable();

			return {
				border: editor.filter.check( 'table[border]' ) ? 1 : 0,
				align: '',
				width: editor.filter.check( 'table{width}' ) ? ( editable.getSize( 'width' ) < 500 ? '100%' : 500 ) : 0,
				cellSpacing: editor.filter.check( 'table[cellspacing]' ) ? 1 : 0,
				cellPadding: editor.filter.check( 'table[cellpadding]' ) ? 1 : 0
			};
		},

		/**
		 * Creates and inserts a table at the current editor selection
		 * with the given count of rows and columns.
		 *
		 * @static
		 * @param {CKEDITOR.editor} editor
		 * @param {Number} rows
		 * @param {Number} cols
		 */
		insert: function( editor, rows, cols ) {
			var table = new CKEDITOR.plugins.table();

			table.appendEmpty( rows, cols );
			table.setAttributes( CKEDITOR.plugins.table.getDefaultAttributes( editor ) );

			table.insertToEditor( editor );
		}
	},

	proto: {
		/**
		 * Returns rows count of the table.
		 *
		 * **Note** that this function will return rows count for both
		 * `tbody` and `thead` DOM elements rows.
		 *
		 * @returns {Number}
		 */
		countRows: function() {
			return this.$.rows.length;
		},

		/**
		 * Returns columns count of the table.
		 *
		 * @returns {Number}
		 */
		countColumns: function() {
			var cols = 0,
				maxCols = 0,
				rows = this.countRows(),
				cells,
				row,
				cell;

			for ( var i = 0; i < rows; i++ ) {
				row = this.$.rows[ i ];
				cells = row.cells.length;
				cols = 0;

				for ( var j = 0; j < cells; j++ ) {
					cell = row.cells[ j ];
					cols += cell.colSpan;
				}

				if ( cols > maxCols ) {
					maxCols = cols;
				}

			}
			return maxCols;
		},

		/**
		 * Checks if a table has column headers.
		 *
		 * @returns {Boolean}
		 */
		hasColumnHeaders: function() {
			if ( !this.countRows() ) {
				return false;
			}

			// Check if all the first cells in every row are TH.
			for ( var row = 0; row < this.countRows(); row++ ) {
				// If just one cell isn't a TH then it isn't a header column.
				var headCell = this.$.rows[ row ].cells[ 0 ];
				if ( headCell && headCell.nodeName.toLowerCase() != 'th' ) {
					return false;
				}
			}

			return true;
		},

		/**
		 * Check if a table has row headers.
		 *
		 * @returns {Boolean}
		 */
		hasRowHeaders: function() {
			return this.getHeader() !== null;
		},

		/**
		 * Appends empty cells to the table according to the given rows and columns.
		 *
		 * @param {Number} rows
		 * @param {Number} cols
		 */
		appendEmpty: function( rows, cols ) {
			var tbody = this.getBody();

			for ( var i = 0; i < rows; i++ ) {
				var row = tbody.append( new CKEDITOR.dom.element( 'tr' ) );
				for ( var j = 0; j < cols; j++ ) {
					var cell = row.append( new CKEDITOR.dom.element( 'td' ) );
					cell.appendBogus();
				}
			}
		},

		/**
		 * Moves row located at the given index inside table body to the table header.
		 *
		 * Creates table header if doesn't exist.
		 *
		 * @param {Number} [index=0]
		 */
		moveRowToHeader: function( index ) {
			var thead = this.getHeader(),
				tbody = this.getBody(),
				theRow = this.getRows().getItem( index || 0 );

			if ( !thead ) {
				thead = new CKEDITOR.dom.element( 'thead' );
				thead.insertBefore( tbody );
			}

			// Change TD to TH:
			for ( var i = 0; i < theRow.getChildCount(); i++ ) {
				var th = theRow.getChild( i );
				// Skip bookmark nodes. (https://dev.ckeditor.com/ticket/6155)
				if ( th.type == CKEDITOR.NODE_ELEMENT && !th.data( 'cke-bookmark' ) ) {
					th.renameNode( 'th' );
					th.setAttribute( 'scope', 'col' );
				}
			}

			thead.append( theRow.remove() );
		},

		/**
		 * Moves header rows to the table body.
		 *
		 * **Note** `thead` will be removed from the DOM after this operation.
		 */
		moveHeaderToBody: function() {
			if ( !this.hasRowHeaders() ) {
				return;
			}

			var thead = this.getHeader(),
				tbody = this.getBody();

			while ( thead.getChildCount() > 0 ) {
				var theRow = thead.getFirst();
				for ( var i = 0; i < theRow.getChildCount(); i++ ) {
					var newCell = theRow.getChild( i );
					if ( newCell.type == CKEDITOR.NODE_ELEMENT ) {
						newCell.renameNode( 'td' );
						newCell.removeAttribute( 'scope' );
					}
				}

				// Append the row to the start (#1397).
				tbody.append( theRow, true );
			}
			thead.remove();
		},

		/**
		 * Converts the first column cells to column header (`td` -> `th`).
		 */
		convertColumnToHeader: function() {
			for ( var i = 0; i < this.countRows(); i++ ) {
				var newCell = new CKEDITOR.dom.element( this.$.rows[ i ].cells[ 0 ] );
				newCell.renameNode( 'th' );
				newCell.setAttribute( 'scope', 'row' );
			}
		},

		/**
		 * Converts the first column header to normal cells (`th` -> `td`).
		 */
		convertColumnHeaderToCells: function() {
			for ( var i = 0; i < this.countRows(); i++ ) {
				var row = new CKEDITOR.dom.element( this.$.rows[ i ] );
				if ( row.getParent().getName() == 'tbody' ) {
					var newCell = new CKEDITOR.dom.element( row.$.cells[ 0 ] );
					newCell.renameNode( 'td' );
					newCell.removeAttribute( 'scope' );
				}
			}

		},

		/**
		 * Returns the table header.
		 *
		 * @returns {CKEDITOR.dom.element}
		 */
		getHeader: function() {
			return this.findOne( 'thead' );
		},

		/**
		 * Returns the table body.
		 *
		 * @returns {CKEDITOR.dom.element}
		 */
		getBody: function() {
			return this.findOne( 'tbody' );
		},

		/**
		 * Returns table body rows.
		 *
		 * @returns {CKEDITOR.dom.nodeList}
		 */
		getRows: function() {
			return this.getBody().find( 'tr' );
		},

		/**
		 * Inserts table to the editor at the current editor selection.
		 *
		 * **Note** that the cursor will be moved to the first table cell after insertion.
		 *
		 * @param {CKEDITOR.editor} editor
		 */
		insertToEditor: function( editor ) {
			editor.insertElement( this );
			var firstRow = this.$.rows[ 0 ],
				firstCell = firstRow && firstRow.cells[ 0 ];

			firstCell = new CKEDITOR.dom.element( firstCell );

			if ( firstCell ) {
				// Override the default cursor position after insertElement to place
				// cursor inside the first cell (https://dev.ckeditor.com/ticket/7959), IE needs a while.
				setTimeout( function() {
					var range = editor.createRange();
					range.moveToPosition( firstCell, CKEDITOR.POSITION_AFTER_START );
					range.select();
				}, 0 );
			}
		}
	}
} );
