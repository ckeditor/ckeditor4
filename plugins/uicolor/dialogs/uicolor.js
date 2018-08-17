/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.dialog.add( 'uicolor', function( editor ) {

	var $el = CKEDITOR.dom.element,
		$doc = CKEDITOR.document,
		lang = editor.lang.uicolor,
		colorCellCls = 'cke_colordialog_colorcell',
		focusedColorLightCls = 'cke_colordialog_focused_light',
		focusedColorDarkCls = 'cke_colordialog_focused_dark',
		selectedColorCls = 'cke_colordialog_selected',
		highlightedColorId = generateId( 'hicolor' ),
		highlightedColorTextId = generateId( 'hicolortext' ),
		selectedColorId = generateId( 'selhicolor' ),
		spacer = { type: 'html', html: '&nbsp;' },
		dialog,
		colorTable,
		selectedColorCell,
		focusedColorCell,
		hoveredColorCell;

	// ---Selected color handling.
	// Updates selected color.
	function updateSelected( evt ) {
		var target = evt.data.getTarget(),
			color;

		if ( target.getName() == 'td' && ( color = target.getChild( 0 ).getHtml() ) ) {
			deselectActiveColorCell();

			selectColorCell( target );
			setSelectedColorPreview( color );
		}
	}

	// Clears selected color.
	function clearSelected() {
		deselectActiveColorCell();
		setSelectedColorPreview( null );
	}

	// Selects given color cell in a color table.
	function selectColorCell( cell ) {
		if ( cell ) {
			selectedColorCell = cell;
			selectedColorCell.setAttribute( 'aria-selected', true );
			selectedColorCell.addClass( selectedColorCls );
		}
	}

	// Removes selection from the currently selected color cell.
	function deselectActiveColorCell() {
		if ( selectedColorCell ) {
			selectedColorCell.removeClass( selectedColorCls );
			selectedColorCell.removeAttribute( 'aria-selected' ); // Attribute aria-selected should also be removed when selection changes.
			selectedColorCell = null;
		}
	}

	// Sets given color as selected in a preview panel. If no color given the current one is cleared.
	function setSelectedColorPreview( color ) {
		dialog.getContentElement( 'picker', 'selectedColor' ).setValue( color );

		if ( !color ) {
			$doc.getById( selectedColorId ).removeStyle( 'background-color' );
		}
	}


	// ---Highlighted color handling.
	// Updates highlighted color.
	function updateHighlight( event ) {
		// Convert to event.
		!event.name && ( event = new CKEDITOR.event( event ) );

		var isFocus = !( /mouse/ ).test( event.name ),
			target = event.data.getTarget(),
			color;

		if ( target.getName() == 'td' && ( color = target.getChild( 0 ).getHtml() ) ) {
			removeHighlight( event );

			isFocus ? focusedColorCell = target : hoveredColorCell = target;

			// Apply CSS class to show focus.
			if ( isFocus ) {
				target.addClass( isLightColor( color ) ? focusedColorLightCls : focusedColorDarkCls );
			}
			setHighlightedColor( color );
		}
	}

	// Clears highlighted color.
	function clearHighlight() {
		if ( focusedColorCell ) {
			focusedColorCell.removeClass( focusedColorLightCls );
			focusedColorCell.removeClass( focusedColorDarkCls );
			focusedColorCell = null;
			setHighlightedColor( null );
		}
	}

	// Removes highlight from the given color cell.
	function removeHighlight( event ) {
		var isFocus = !( /mouse/ ).test( event.name ),
			target = isFocus && focusedColorCell;

		if ( target ) {
			target.removeClass( focusedColorLightCls );
			target.removeClass( focusedColorDarkCls );
		}

		if ( !( focusedColorCell || hoveredColorCell ) ) {
			setHighlightedColor( false );
		}
	}

	// Sets given color as highlighted in a preview panel. If no color given the current one is cleared.
	function setHighlightedColor( color ) {
		if ( color ) {
			$doc.getById( highlightedColorId ).setStyle( 'background-color', color );
			$doc.getById( highlightedColorTextId ).setHtml( color );

		} else {
			$doc.getById( highlightedColorId ).removeStyle( 'background-color' );
			$doc.getById( highlightedColorTextId ).setHtml( '&nbsp;' );
		}
	}


	// Basing black-white decision off of luma scheme using the Rec. 709 version.
	function isLightColor( color ) {
		color = color.replace( /^#/, '' );
		for ( var i = 0, rgb = []; i <= 2; i++ )
			rgb[ i ] = parseInt( color.substr( i * 2, 2 ), 16 );
		var luma = ( 0.2126 * rgb[ 0 ] ) + ( 0.7152 * rgb[ 1 ] ) + ( 0.0722 * rgb[ 2 ] );
		return luma >= 165;
	}

	// Manages selection/focus and key handling in a dialog.
	function onKeyStrokes( evt ) {
		var domEvt = evt.data;

		var element = domEvt.getTarget();
		var relative, nodeToMove;
		var keystroke = domEvt.getKeystroke(),
			rtl = editor.lang.dir == 'rtl';

		switch ( keystroke ) {
			// UP-ARROW
			case 38:
				// relative is TR
				if ( ( relative = element.getParent().getPrevious() ) ) {
					nodeToMove = relative.getChild( [ element.getIndex() ] );
					nodeToMove.focus();
				}
				domEvt.preventDefault();
				break;
			// DOWN-ARROW
			case 40:
				// relative is TR
				if ( ( relative = element.getParent().getNext() ) ) {
					nodeToMove = relative.getChild( [ element.getIndex() ] );
					if ( nodeToMove && nodeToMove.type == 1 )
						nodeToMove.focus();

				}
				domEvt.preventDefault();
				break;

			// SPACE
			// ENTER
			case 32:
			case 13:
				updateSelected( evt );
				domEvt.preventDefault();
				break;

			// RIGHT-ARROW
			case rtl ? 37 : 39:
				// relative is TD
				if ( ( nodeToMove = element.getNext() ) ) {
					if ( nodeToMove.type == 1 ) {
						nodeToMove.focus();
						domEvt.preventDefault( true );
					}
				}
				// relative is TR
				else if ( ( relative = element.getParent().getNext() ) ) {
					nodeToMove = relative.getChild( [ 0 ] );
					if ( nodeToMove && nodeToMove.type == 1 ) {
						nodeToMove.focus();
						domEvt.preventDefault( true );
					}
				}
				break;

			// LEFT-ARROW
			case rtl ? 39 : 37:
				// relative is TD
				if ( ( nodeToMove = element.getPrevious() ) ) {
					nodeToMove.focus();
					domEvt.preventDefault( true );
				}
				// relative is TR
				else if ( ( relative = element.getParent().getPrevious() ) ) {
					nodeToMove = relative.getLast();
					nodeToMove.focus();
					domEvt.preventDefault( true );
				}
				break;
			default:
				// Do not stop not handled events.
				return;
		}
	}

	// Creates color palette table and binds event listeners to manage focus inside it.
	function createColorTable() {
		var table = CKEDITOR.dom.element.createFromHtml( '<table tabIndex="-1" class="cke_colordialog_table"' +
			' aria-label="' + lang.options + '" role="grid" style="border-collapse:separate;" cellspacing="0">' +
			'<caption class="cke_voice_label">' + lang.options + '</caption>' +
			'<tbody role="presentation"></tbody></table>' );

		table.on( 'mouseover', updateHighlight );
		table.on( 'mouseout', removeHighlight );

		// Create the base colors array.
		var aColors = [ '00', '33', '66', '99', 'cc', 'ff' ];

		// This function combines two ranges of three values from the color array into a row.
		function appendColorRow( rangeA, rangeB ) {
			for ( var i = rangeA; i < rangeA + 3; i++ ) {
				var row = new $el( table.$.insertRow( -1 ) );
				row.setAttribute( 'role', 'row' );

				for ( var j = rangeB; j < rangeB + 3; j++ ) {
					for ( var n = 0; n < 6; n++ ) {
						appendColorCell( row.$, '#' + aColors[ j ] + aColors[ n ] + aColors[ i ] );
					}
				}
			}
		}

		// This function create a single color cell in the color table.
		function appendColorCell( targetRow, color ) {
			var cell = new $el( targetRow.insertCell( -1 ) );
			cell.setAttribute( 'class', 'ColorCell ' + colorCellCls );
			cell.setAttribute( 'tabIndex', -1 );
			cell.setAttribute( 'role', 'gridcell' );
			cell.setAttribute( 'data-color', color );

			cell.on( 'keydown', onKeyStrokes );
			cell.on( 'click', updateSelected );
			cell.on( 'focus', updateHighlight );
			cell.on( 'blur', removeHighlight );

			cell.setStyle( 'background-color', color );

			var colorLabel = generateId( 'color_table_cell' );
			cell.setAttribute( 'aria-labelledby', colorLabel );
			cell.append( CKEDITOR.dom.element.createFromHtml( '<span id="' + colorLabel + '" class="cke_voice_label">' + color + '</span>', CKEDITOR.document ) );
		}

		appendColorRow( 0, 0 );
		appendColorRow( 3, 0 );
		appendColorRow( 0, 3 );
		appendColorRow( 3, 3 );

		// Create the last row.
		var oRow = new $el( table.$.insertRow( -1 ) );
		oRow.setAttribute( 'role', 'row' );

		// Create the gray scale colors cells.
		appendColorCell( oRow.$, '#000000' );
		for ( var n = 0; n < 16; n++  ) {
			var c = n.toString( 16 );
			appendColorCell( oRow.$, '#' + c + c + c + c + c + c );
		}
		appendColorCell( oRow.$, '#ffffff' );

		return table;
	}

	// Generates id from the given string and next number in a sequence.
	function generateId( id ) {
		return CKEDITOR.tools.getNextId() + '_' + id;
	}

	// Finds cell with the given color defined.
	function findColorCell( color ) {
		var colorCell = null;

		if ( colorTable && color ) {
			colorCell = colorTable.findOne( 'td[data-color="' + color + '"]' );
		}
		return colorCell;
	}

	// Sets the editor UI color and update states of color table and color dropdown depending on what triggered the update.
	function onColorChanged( color, predefinedColor ) {
		var newColor = color || predefinedColor;

		editor.setUiColor( newColor );
		dialog.getContentElement( 'picker', 'configBox' ).setValue( newColor );

		if ( color && dialog.getContentElement( 'picker', 'predefined' ).getValue() !== newColor ) {
			// Color was updated via color palette, update dropdown.
			dialog.getContentElement( 'picker', 'predefined' ).setValue( newColor );

		} else if ( predefinedColor ) {
			// Color was updated via dropdown, updated palette.
			var colorCell = findColorCell( newColor );
			if ( colorCell ) {
				selectColorCell( colorCell );
			} else {
				deselectActiveColorCell();
			}

			if ( dialog.getContentElement( 'picker', 'selectedColor' ).getValue() !== newColor ) {
				setSelectedColorPreview( newColor );
			}
		}
	}

	// Returns normalized uiColor value.
	function getUiColor( editor ) {
		return editor.getUiColor() ? CKEDITOR.tools.parseCssText( 'color:' + editor.getUiColor(), true ).color : null;
	}


	// Initialize.
	colorTable = createColorTable();

	// Load CSS.
	CKEDITOR.document.appendStyleSheet( CKEDITOR.getUrl( CKEDITOR.plugins.get( 'uicolor' ).path + 'dialogs/uicolor.css' ) );

	return {
		title: lang.title,
		minWidth: 360,
		minHeight: 220,
		buttons: [ CKEDITOR.dialog.okButton ],
		onLoad: function() {
			// Update reference.
			dialog = this;
		},
		onHide: function() {
			clearSelected();
			clearHighlight();
		},
		contents: [ {
			id: 'picker',
			label: lang.title,
			accessKey: 'I',
			elements: [ {
				type: 'hbox',
				padding: 0,
				widths: [ '70%', '10%', '30%' ],
				children: [ {
					type: 'html',
					html: '<div></div>',
					onLoad: function() {
						CKEDITOR.document.getById( this.domId ).append( colorTable );
					},
					focus: function() {
						var color = getUiColor( editor ),
							focusCell = color ? findColorCell( color ) : ( focusedColorCell || this.getElement().getElementsByTag( 'td' ).getItem( 0 ) );

						if ( focusCell ) {
							// Highlights color cell on open.
							focusCell && focusCell.focus();

							// If UI color is set also set the color cell as selected.
							if ( color ) {
								selectColorCell( focusCell );
								setSelectedColorPreview( color );
							}
						}
					}
				},
				spacer,
				{
					type: 'vbox',
					padding: 0,
					widths: [ '70%', '5%', '25%' ],
					children: [ {
						type: 'html',
						html: '<span>' + lang.highlight + '</span>' +
							'<div id="' + highlightedColorId + '" style="border: 1px solid; height: 74px; width: 74px;"></div>' +
							'<div id="' + highlightedColorTextId + '">&nbsp;</div><span>' + lang.selected + '</span>' +
							'<div id="' + selectedColorId + '" style="border: 1px solid; height: 20px; width: 74px;"></div>'
					},
					{
						type: 'text',
						label: lang.selected,
						labelStyle: 'display:none',
						id: 'selectedColor',
						style: 'width: 76px;margin-top:4px',
						onChange: function() {
							// Try to update color preview with new value. If fails, then set it to none.
							try {
								var newColor = this.getValue();
								if ( newColor ) {
									$doc.getById( selectedColorId ).setStyle( 'background-color', newColor );
									onColorChanged( newColor );
								}
							} catch ( e ) {
								clearSelected();
							}
						}
					} ]
				} ]
			}, {
				type: 'vbox',
				children: [ {
					type: 'hbox',
					padding: 0,
					children: [ {
						id: 'predefined',
						type: 'select',
						'default': '',
						width: '100%',
						label: lang.predefined,
						items: [
							[ '' ],
							[ 'Light blue', '#9ab8f3' ],
							[ 'Sand', '#d2b48c' ],
							[ 'Metallic', '#949aaa' ],
							[ 'Purple', '#c2a3c7' ],
							[ 'Olive', '#a2c980' ],
							[ 'Happy green', '#9bd446' ],
							[ 'Jezebel Blue', '#14b8c4' ],
							[ 'Burn', '#ff89a' ],
							[ 'Easy red', '#ff6969' ],
							[ 'Pisces 3', '#48b4f2' ],
							[ 'Aquarius 5', '#487ed4' ],
							[ 'Absinthe', '#a8cf76' ],
							[ 'Scrambled Egg', '#c7a622' ],
							[ 'Hello monday', '#8e8d80' ],
							[ 'Lovely sunshine', '#f1e8b1' ],
							[ 'Recycled air', '#b3c593' ],
							[ 'Down', '#bcbca4' ],
							[ 'Mark Twain', '#cfe91d' ],
							[ 'Specks of dust', '#d1b596' ],
							[ 'Lollipop', '#f6ce23' ]
						],
						onShow: function() {
							this.setValue( getUiColor( editor ) );
						},
						onChange: function() {
							var color = this.getValue();
							if ( color ) {
								onColorChanged( null, color );

								// Set focus (after opening dialog if uiColor is based
								// on predefined value we want to focus the dropdown).
								this.focus();
							}
						}
					} ]
				},
				{
					id: 'configBox',
					type: 'text',
					label: lang.config,
					onShow: function() {
						this.getInputElement().setAttribute( 'readonly', true );
						this.setValue( getUiColor( editor ) );
					},
					onChange: function() {
						var color = this.getValue();

						// Update the value only if color was passed. If user types something different do not update.
						if ( color && CKEDITOR.tools.style.parse._findColor( color ).length ) {
							this.setValue( 'config.uiColor = "' + color.toLowerCase() + '"', true );
						}
					}
				} ]
			} ]
		} ]
	};
} );
