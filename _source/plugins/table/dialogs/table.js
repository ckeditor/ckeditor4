/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function() {
	var widthPattern = /^(\d+(?:\.\d+)?)(px|%)$/,
		heightPattern = /^(\d+(?:\.\d+)?)px$/;

	var commitValue = function( data ) {
			var id = this.id;
			if ( !data.info )
				data.info = {};
			data.info[ id ] = this.getValue();
		};

	// Copy all the attributes from one node to the other, kinda like a clone
	// skipAttributes is an object with the attributes that must NOT be copied
	function copyAttributes( source, dest, skipAttributes ) {
		var attributes = source.$.attributes;

		for ( var n = 0; n < attributes.length; n++ ) {
			var attribute = attributes[ n ];

			if ( attribute.specified ) {
				var attrName = attribute.nodeName;
				// We can set the type only once, so do it with the proper value, not copying it.
				if ( attrName in skipAttributes )
					continue;

				var attrValue = source.getAttribute( attrName );
				if ( attrValue == null )
					attrValue = attribute.nodeValue;

				dest.setAttribute( attrName, attrValue );
			}
		}
		// The style:
		if ( source.$.style.cssText !== '' )
			dest.$.style.cssText = source.$.style.cssText;
	}

	/**
	 * Replaces a tag with another one, keeping its contents:
	 * for example TD --> TH, and TH --> TD.
	 * input: the original node, and the new tag name
	 * http://www.w3.org/TR/DOM-Level-3-Core/core.html#Document3-renameNode
	 */
	function renameNode( node, newTag ) {
		// Only rename element nodes.
		if ( node.type != CKEDITOR.NODE_ELEMENT )
			return null;

		// If it's already correct exit here.
		if ( node.getName() == newTag )
			return node;

		var doc = node.getDocument();

		// Create the new node
		var newNode = new CKEDITOR.dom.element( newTag, doc );

		// Copy all attributes
		copyAttributes( node, newNode, {} );

		// Move children to the new node
		node.moveChildren( newNode );

		// Finally replace the node and return the new one
		node.$.parentNode.replaceChild( newNode.$, node.$ );

		return newNode;
	}

	function tableDialog( editor, command ) {
		var makeElement = function( name ) {
				return new CKEDITOR.dom.element( name, editor.document );
			};

		return {
			title: editor.lang.table.title,
			minWidth: 430,
			minHeight: 180,
			onShow: function() {
				// Detect if there's a selected table.
				this.restoreSelection();
				var selection = editor.getSelection(),
					ranges = selection.getRanges(),
					selectedTable = null;

				var rowsInput = this.getContentElement( 'info', 'txtRows' ),
					colsInput = this.getContentElement( 'info', 'txtCols' ),
					widthInput = this.getContentElement( 'info', 'txtWidth' );
				if ( command == 'tableProperties' ) {
					if ( ( selectedTable = this.getSelectedElement() ) ) {
						if ( selectedTable.getName() != 'table' )
							selectedTable = null;
					} else if ( ranges.length > 0 ) {
						var rangeRoot = ranges[ 0 ].getCommonAncestor( true );
						selectedTable = rangeRoot.getAscendant( 'table', true );
					}

					// Save a reference to the selected table, and push a new set of default values.
					this._.selectedElement = selectedTable;
				}

				// Enable, disable and select the row, cols, width fields.
				if ( selectedTable ) {
					this.setupContent( selectedTable );
					rowsInput && rowsInput.disable();
					colsInput && colsInput.disable();
					widthInput && widthInput.select();
				} else {
					rowsInput && rowsInput.enable();
					colsInput && colsInput.enable();
					rowsInput && rowsInput.select();
				}
			},
			onOk: function() {
				var table = this._.selectedElement || makeElement( 'table' ),
					me = this,
					data = {};

				this.commitContent( data, table );

				if ( data.info ) {
					var info = data.info;

					// Generate the rows and cols.
					if ( !this._.selectedElement ) {
						var tbody = table.append( makeElement( 'tbody' ) ),
							rows = parseInt( info.txtRows, 10 ) || 0;
						cols = parseInt( info.txtCols, 10 ) || 0;

						for ( var i = 0; i < rows; i++ ) {
							var row = tbody.append( makeElement( 'tr' ) );
							for ( var j = 0; j < cols; j++ ) {
								var cell = row.append( makeElement( 'td' ) );
								if ( !CKEDITOR.env.ie )
									cell.append( makeElement( 'br' ) );
							}
						}
					}

					// Modify the table headers. Depends on havint rows and cols generated
					// correctly so it can't be done in commit functions.

					// Should we make a <thead>?
					var headers = info.selHeaders;
					if ( table.$.tHead == null && ( headers == 'row' || headers == 'both' ) ) {
						var thead = new CKEDITOR.dom.element( table.$.createTHead() ),
							tbody = table.getElementsByTag( 'tbody' ).getItem( 0 ),
							theRow = tbody.getElementsByTag( 'tr' ).getItem( 0 );

						// Change TD to TH:
						for ( var i = 0; i < theRow.getChildCount(); i++ ) {
							var th = renameNode( theRow.getChild( i ), 'th' );
							if ( th != null )
								th.setAttribute( 'scope', 'col' );
						}
						thead.append( theRow.remove() );
					}

					if ( table.$.tHead !== null && !( headers == 'row' || headers == 'both' ) ) {
						// Move the row out of the THead and put it in the TBody:
						var thead = new CKEDITOR.dom.element( table.$.tHead ),
							tbody = table.getElementsByTag( 'tbody' ).getItem( 0 );

						var previousFirstRow = tbody.getFirst();
						while ( thead.getChildCount() > 0 ) {
							var theRow = thead.getFirst();
							for ( var i = 0; i < theRow.getChildCount(); i++ ) {
								var newCell = renameNode( theRow.getChild( i ), 'td' );
								if ( newCell != null )
									newCell.removeAttribute( 'scope' );
							}
							theRow.insertBefore( previousFirstRow );
						}
						thead.remove();
					}

					// Should we make all first cells in a row TH?
					if ( !this.hasColumnHeaders && ( headers == 'col' || headers == 'both' ) ) {
						for ( var row = 0; row < table.$.rows.length; row++ ) {
							var newCell = renameNode( new CKEDITOR.dom.element( table.$.rows[ row ].cells[ 0 ] ), 'th' );
							if ( newCell != null )
								newCell.setAttribute( 'scope', 'col' );
						}
					}

					// Should we make all first TH-cells in a row make TD? If 'yes' we do it the other way round :-)
					if ( ( this.hasColumnHeaders ) && !( headers == 'col' || headers == 'both' ) ) {
						for ( var i = 0; i < table.$.rows.length; i++ ) {
							var row = new CKEDITOR.dom.element( table.$.rows[ i ] );
							if ( row.getParent().getName() == 'tbody' ) {
								var newCell = renameNode( new CKEDITOR.dom.element( row.$.cells[ 0 ] ), 'td' );
								if ( newCell != null )
									newCell.removeAttribute( 'scope' );
							}
						}
					}

					// Set the width and height.
					var styles = [];
					if ( info.txtHeight )
						styles.push( 'height:' + info.txtHeight + 'px' );
					if ( info.txtWidth ) {
						var type = info.cmbWidthType || 'pixels';
						styles.push( 'width:' + info.txtWidth + ( type == 'pixels' ? 'px' : '%' ) );
					}
					styles = styles.join( ';' );
					if ( styles != '' )
						table.$.style.cssText = styles;
					else
						table.removeAttribute( 'style' );
				}

				// Insert the table element if we're creating one.
				if ( !this._.selectedElement ) {
					this.restoreSelection();
					editor.insertElement( table );
					this.clearSavedSelection();
				}

				return true;
			},
			contents: [
				{
				id: 'info',
				label: editor.lang.table.title,
				accessKey: 'I',
				elements: [
					{
					type: 'hbox',
					widths: [ '40%', '10%', '60%' ],
					children: [
						{
						type: 'vbox',
						padding: 0,
						children: [
							{
							type: 'text',
							id: 'txtRows',
							labelLayout: 'horizontal',
							widths: [ '60%', '40%' ],
							style: 'width:105px',
							'default': 3,
							label: editor.lang.table.rows,
							validate: function() {
								var pass = true,
									value = this.getValue();
								pass = pass && CKEDITOR.dialog.validate.integer()( value ) && value > 0;
								if ( !pass ) {
									alert( editor.lang.table.invalidRows );
									this.select();
								}
								return pass;
							},
							setup: function( selectedElement ) {
								this.setValue( selectedElement.$.rows.length );
							},
							commit: commitValue
						},
							{
							type: 'text',
							id: 'txtCols',
							labelLayout: 'horizontal',
							widths: [ '60%', '40%' ],
							style: 'width:105px',
							'default': 2,
							label: editor.lang.table.columns,
							validate: function() {
								var pass = true,
									value = this.getValue();
								pass = pass && CKEDITOR.dialog.validate.integer()( value ) && value > 0;
								if ( !pass ) {
									alert( editor.lang.table.invalidCols );
									this.select();
								}
								return pass;
							},
							setup: function( selectedTable ) {
								this.setValue( selectedTable.$.rows[ 0 ].cells.length );
							},
							commit: commitValue
						},
							{
							type: 'select',
							id: 'selHeaders',
							labelLayout: 'horizontal',
							'default': '',
							widths: [ '40%', '60%' ],
							label: editor.lang.table.headers,
							items: [
								[ editor.lang.table.headersNone, '' ],
								[ editor.lang.table.headersRow, 'row' ],
								[ editor.lang.table.headersColumn, 'col' ],
								[ editor.lang.table.headersBoth, 'both' ]
								],
							setup: function( selectedTable ) {
								// Fill in the headers field.
								var dialog = this.getDialog();
								dialog.hasColumnHeaders = true;

								// Check if all the first cells in every row are TH
								for ( var row = 0; row < selectedTable.$.rows.length; row++ ) {
									// If just one cell isn't a TH then it isn't a header column
									if ( selectedTable.$.rows[ row ].cells[ 0 ].nodeName.toLowerCase() != 'th' ) {
										dialog.hasColumnHeaders = false;
										break;
									}
								}

								// Check if the table contains <thead>.
								if ( ( selectedTable.$.tHead !== null ) )
									this.setValue( dialog.hasColumnHeaders ? 'both' : 'row' );
								else
									this.setValue( dialog.hasColumnHeaders ? 'col' : '' );
							},
							commit: commitValue
						},
							{
							type: 'text',
							id: 'txtBorder',
							labelLayout: 'horizontal',
							widths: [ '60%', '40%' ],
							style: 'width:105px',
							'default': 1,
							label: editor.lang.table.border,
							validate: CKEDITOR.dialog.validate[ 'number' ]( editor.lang.table.invalidBorder ),
							setup: function( selectedTable ) {
								this.setValue( selectedTable.getAttribute( 'border' ) || '' );
							},
							commit: function( data, selectedTable ) {
								if ( this.getValue() )
									selectedTable.setAttribute( 'border', this.getValue() );
								else
									selectedTable.removeAttribute( 'border' );
							}
						},
							{
							id: 'cmbAlign',
							type: 'select',
							labelLayout: 'horizontal',
							'default': '',
							widths: [ '40%', '60%' ],
							label: editor.lang.table.align,
							items: [
								[ editor.lang.table.alignNotSet, '' ],
								[ editor.lang.table.alignLeft, 'left' ],
								[ editor.lang.table.alignCenter, 'center' ],
								[ editor.lang.table.alignRight, 'right' ]
								],
							setup: function( selectedTable ) {
								this.setValue( selectedTable.getAttribute( 'align' ) || '' );
							},
							commit: function( data, selectedTable ) {
								if ( this.getValue() )
									selectedTable.setAttribute( 'align', this.getValue() );
								else
									selectedTable.removeAttribute( 'align' );
							}
						}
						]
					},
						{
						type: 'html',
						align: 'right',
						html: ''
					},
						{
						type: 'vbox',
						align: 'right',
						padding: 0,
						children: [
							{
							type: 'hbox',
							align: 'center',
							widths: [ '70%', '30%' ],
							children: [
								{
								type: 'text',
								id: 'txtWidth',
								labelLayout: 'horizontal',
								widths: [ '50%', '50%' ],
								label: editor.lang.table.width,
								'default': 200,
								validate: CKEDITOR.dialog.validate[ 'number' ]( editor.lang.table.invalidWidth ),
								setup: function( selectedTable ) {
									var widthMatch = widthPattern.exec( selectedTable.$.style.width );
									if ( widthMatch )
										this.setValue( widthMatch[ 1 ] );
								},
								commit: commitValue
							},
								{
								id: 'cmbWidthType',
								type: 'select',
								labelLayout: 'horizontal',
								widths: [ '0%', '100%' ],
								label: '',
								'default': 'pixels',
								items: [
									[ editor.lang.table.widthPx, 'pixels' ],
									[ editor.lang.table.widthPc, 'percents' ]
									],
								setup: function( selectedTable ) {
									var widthMatch = widthPattern.exec( selectedTable.$.style.width );
									if ( widthMatch )
										this.setValue( widthMatch[ 2 ] == 'px' ? 'pixels' : 'percents' );
								},
								commit: commitValue
							}
							]
						},
							{
							type: 'hbox',
							widths: [ '70%', '30%' ],
							children: [
								{
								type: 'text',
								id: 'txtHeight',
								labelLayout: 'horizontal',
								widths: [ '50%', '50%' ],
								label: editor.lang.table.height,
								'default': '',
								validate: CKEDITOR.dialog.validate[ 'number' ]( editor.lang.table.invalidHeight ),
								setup: function( selectedTable ) {
									var heightMatch = heightPattern.exec( selectedTable.$.style.height );
									if ( heightMatch )
										this.setValue( heightMatch[ 1 ] );
								},
								commit: commitValue
							},
								{
								type: 'html',
								html: editor.lang.table.widthPx
							}
							]
						},
							{
							type: 'html',
							html: '&nbsp;'
						},
							{
							type: 'text',
							id: 'txtCellSpace',
							labelLayout: 'horizontal',
							widths: [ '50%', '50%' ],
							style: 'width:140px',
							label: editor.lang.table.cellSpace,
							'default': 1,
							validate: CKEDITOR.dialog.validate[ 'number' ]( editor.lang.table.invalidCellSpacing ),
							setup: function( selectedTable ) {
								this.setValue( selectedTable.getAttribute( 'cellSpacing' ) || '' );
							},
							commit: function( data, selectedTable ) {
								if ( this.getValue() )
									selectedTable.setAttribute( 'cellSpacing', this.getValue() );
								else
									setAttribute.removeAttribute( 'cellSpacing' );
							}
						},
							{
							type: 'text',
							id: 'txtCellPad',
							labelLayout: 'horizontal',
							widths: [ '50%', '50%' ],
							style: 'width:140px',
							label: editor.lang.table.cellPad,
							'default': 1,
							validate: CKEDITOR.dialog.validate[ 'number' ]( editor.lang.table.invalidCellPadding ),
							setup: function( selectedTable ) {
								this.setValue( selectedTable.getAttribute( 'cellPadding' ) || '' );
							},
							commit: function( data, selectedTable ) {
								if ( this.getValue() )
									selectedTable.setAttribute( 'cellPadding', this.getValue() );
								else
									selectedTable.removeAttribute( 'cellPadding' );
							}
						}
						]
					}
					]
				},
					{
					type: 'html',
					align: 'right',
					html: ''
				},
					{
					type: 'vbox',
					padding: 0,
					children: [
						{
						id: 'txtCaption',
						type: 'text',
						label: editor.lang.table.caption,
						widths: [ '30%', '70%' ],
						labelLayout: 'horizontal',
						'default': '',
						style: 'width:400px',
						setup: function( selectedTable ) {
							var nodeList = selectedTable.getElementsByTag( 'caption' );
							if ( nodeList.count() > 0 ) {
								var caption = nodeList.getItem( 0 );
								caption = ( caption.getChild( 0 ) && caption.getChild( 0 ).getText() ) || '';
								caption = CKEDITOR.tools.trim( caption );
								this.setValue( caption );
							}
						},
						commit: function( data, table ) {
							var caption = this.getValue(),
								captionElement = table.getElementsByTag( 'caption' );
							if ( caption != '' ) {
								if ( captionElement.count() > 0 ) {
									captionElement = captionElement.getItem( 0 );
									captionElement.setHtml( '' );
								} else {
									captionElement = new CKEDITOR.dom.element( 'caption', editor.document );
									if ( table.getChildCount() )
										captionElement.insertBefore( table.getFirst() );
									else
										captionElement.appendTo( table );
								}
								captionElement.append( new CKEDITOR.dom.text( caption, editor.document ) );
							} else if ( captionElement.count() > 0 ) {
								for ( var i = captionElement.count() - 1; i >= 0; i-- )
									captionElement.getItem( i ).remove();
							}
						}
					},
						{
						id: 'txtSummary',
						type: 'text',
						labelLayout: 'horizontal',
						label: editor.lang.table.summary,
						'default': '',
						widths: [ '30%', '70%' ],
						accessKey: 'A',
						style: 'width:400px',
						setup: function( selectedTable ) {
							this.setValue( selectedTable.getAttribute( 'summary' ) || '' );
						},
						commit: function( data, selectedTable ) {
							if ( this.getValue() )
								selectedTable.setAttribute( 'summary', this.getValue() );
						}
					}
					]
				}
				]
			}
			]
		};
	}

	CKEDITOR.dialog.add( 'table', function( editor ) {
		return tableDialog( editor, 'table' );
	});
	CKEDITOR.dialog.add( 'tableProperties', function( editor ) {
		return tableDialog( editor, 'tableProperties' );
	});
})();
