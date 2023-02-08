/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.dialog.add( 'colordialog', function( editor ) {
	// Define some shorthands.
	var $el = CKEDITOR.dom.element,
		$doc = CKEDITOR.document,
		lang = editor.lang.colordialog,
		colorCellCls = 'cke_colordialog_colorcell',
		focusedColorLightCls = 'cke_colordialog_focused_light',
		focusedColorDarkCls = 'cke_colordialog_focused_dark',
		selectedColorCls = 'cke_colordialog_selected';

	// Reference the dialog.
	var dialog,
		selected;

	var spacer = {
		type: 'html',
		html: '&nbsp;'
	};

	var numbering = function( id ) {
			return CKEDITOR.tools.getNextId() + '_' + id;
		},
		hicolorId = numbering( 'hicolor' ),
		hicolorTextId = numbering( 'hicolortext' ),
		selHiColorId = numbering( 'selhicolor' ),
		table;

	function clearSelected() {
		$doc.getById( selHiColorId ).removeStyle( 'background-color' );
		dialog.getContentElement( 'picker', 'selectedColor' ).setValue( '' );
		removeSelected();
	}

	function updateSelected( evt ) {
		var target = evt.data.getTarget(),
			color;

		if ( target.getName() == 'td' && ( color = target.getChild( 0 ).getHtml() ) ) {
			removeSelected();

			selected = target;
			selected.setAttribute( 'aria-selected', true );
			selected.addClass( selectedColorCls );
			dialog.getContentElement( 'picker', 'selectedColor' ).setValue( color );
		}
	}

	function removeSelected() {
		if ( selected ) {
			selected.removeClass( selectedColorCls );
			selected.removeAttribute( 'aria-selected' ); // Attribute aria-selected should also be removed when selection changes.
			selected = null;
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

	// Distinguish focused and hover states.
	var focused, hovered;

	// Apply highlight style.
	function updateHighlight( event ) {
		// Convert to event.
		!event.name && ( event = new CKEDITOR.event( event ) );

		var isFocus = !( /mouse/ ).test( event.name ),
			target = event.data.getTarget(),
			color;

		if ( target.getName() == 'td' && ( color = target.getChild( 0 ).getHtml() ) ) {
			removeHighlight( event );

			isFocus ? focused = target : hovered = target;

			// Apply CSS class to show focus.
			if ( isFocus ) {
				target.addClass( isLightColor( color ) ? focusedColorLightCls : focusedColorDarkCls );
			}
			setHighlight( color );
		}
	}

	function clearHighlight() {
		if ( focused ) {
			focused.removeClass( focusedColorLightCls );
			focused.removeClass( focusedColorDarkCls );
		}
		setHighlight( false );
		focused = null;
	}

	// Remove previously focused style.
	function removeHighlight( event ) {
		var isFocus = !( /mouse/ ).test( event.name ),
			target = isFocus && focused;

		if ( target ) {
			target.removeClass( focusedColorLightCls );
			target.removeClass( focusedColorDarkCls );
		}

		if ( !( focused || hovered ) ) {
			setHighlight( false );
		}
	}

	function setHighlight( color ) {
		if ( color ) {
			$doc.getById( hicolorId ).setStyle( 'background-color', color );
			$doc.getById( hicolorTextId ).setHtml( color );

		} else {
			$doc.getById( hicolorId ).removeStyle( 'background-color' );
			$doc.getById( hicolorTextId ).setHtml( '&nbsp;' );
		}
	}

	function onKeyStrokes( evt ) {
		var domEvt = evt.data,
			element = domEvt.getTarget(),
			keystroke = domEvt.getKeystroke(),
			rtl = editor.lang.dir == 'rtl',
			relative,
			nodeToMove;

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
					if ( nodeToMove && nodeToMove.type == 1 ) {
						nodeToMove.focus();
					}
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

	function createColorTable() {
		table = CKEDITOR.dom.element.createFromHtml( '<table tabIndex="-1" class="cke_colordialog_table"' +
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

		// This function creates a single color cell in the color table.
		function appendColorCell( targetRow, color ) {
			var cell = new $el( targetRow.insertCell( -1 ) );
			cell.setAttribute( 'class', 'ColorCell ' + colorCellCls );
			cell.setAttribute( 'tabIndex', -1 );
			cell.setAttribute( 'role', 'gridcell' );

			cell.on( 'keydown', onKeyStrokes );
			cell.on( 'click', updateSelected );
			cell.on( 'focus', updateHighlight );
			cell.on( 'blur', removeHighlight );

			cell.setStyle( 'background-color', color );

			var colorLabel = numbering( 'color_table_cell' );
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
	}

	createColorTable();

	// Load CSS.
	CKEDITOR.document.appendStyleSheet( CKEDITOR.getUrl( CKEDITOR.plugins.get( 'colordialog' ).path + 'dialogs/colordialog.css' ) );

	return {
		title: lang.title,
		minWidth: 360,
		minHeight: 220,
		onShow: function( evt ) {
			if ( !evt.data.selectionColor ||
				( evt.data.selectionColor == evt.data.automaticTextColor ) ||
				( evt.data.selectionColor == '#rgba(0, 0, 0, 0)' && evt.data.type == 'back' ) ) {
				// Fallback for IE.
				clearSelected();
				clearHighlight();
				return;
			}

			var selectionColor = evt.data.selectionColor,
				colorPalette = this.parts.contents.getElementsByTag( 'td' ).toArray(),
				itemColor;

			dialog.getContentElement( 'picker', 'selectedColor' ).setValue( selectionColor );

			CKEDITOR.tools.array.forEach( colorPalette, function( paletteItem ) {
				itemColor = CKEDITOR.tools.convertRgbToHex( paletteItem.getStyle( 'background-color' ) );
				if ( selectionColor === itemColor ) {
					paletteItem.focus();
					focused = paletteItem;
				}
			} );
		},
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
						CKEDITOR.document.getById( this.domId ).append( table );
					},
					focus: function() {
						// Restore the previously focused cell,
						// otherwise put the initial focus on the first table cell.
						( focused || this.getElement().getElementsByTag( 'td' ).getItem( 0 ) ).focus();
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
							'<div id="' + hicolorId + '" style="border: 1px solid; height: 74px; width: 74px;"></div>' +
							'<div id="' + hicolorTextId + '">&nbsp;</div><span>' + lang.selected + '</span>' +
							'<div id="' + selHiColorId + '" style="border: 1px solid; height: 20px; width: 74px;"></div>'
					},
					{
						type: 'text',
						label: lang.selected,
						labelStyle: 'display:none',
						id: 'selectedColor',
						style: 'width: 76px;margin-top:4px',
						onChange: function() {
							// Try to update color preview with new value. If fails, then set it no none.
							try {
								$doc.getById( selHiColorId ).setStyle( 'background-color', this.getValue() );
							} catch ( e ) {
								clearSelected();
							}
						}
					},
					spacer,
					{
						type: 'button',
						id: 'clear',
						label: lang.clear,
						onClick: clearSelected
					} ]
				} ]
			} ]
		} ]
	};
} );
