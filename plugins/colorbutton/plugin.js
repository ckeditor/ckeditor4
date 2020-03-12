/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview The "colorbutton" plugin that makes it possible to assign
 *               text and background colors to editor contents.
 *
 */
CKEDITOR.plugins.add( 'colorbutton', {
	requires: 'panelbutton,floatpanel',
	// jscs:disable maximumLineLength
	lang: 'af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
	// jscs:enable maximumLineLength
	icons: 'bgcolor,textcolor', // %REMOVE_LINE_CORE%
	hidpi: true, // %REMOVE_LINE_CORE%
	init: function( editor ) {
		var config = editor.config,
			lang = editor.lang.colorbutton;

		if ( !CKEDITOR.env.hc ) {
			addButton( {
				name: 'TextColor',
				type: 'fore',
				commandName: 'textColor',
				title: lang.textColorTitle,
				order: 10,
				contentTransformations: [
					[
						{
							element: 'font',
							check: 'span{color}',
							left: function( element ) {
								return !!element.attributes.color;
							},
							right: function( element ) {
								element.name = 'span';

								element.attributes.color && ( element.styles.color = element.attributes.color );
								delete element.attributes.color;
							}
						}
					]
				]
			} );

			var contentTransformations,
				normalizeBackground = editor.config.colorButton_normalizeBackground;

			if ( normalizeBackground === undefined || normalizeBackground ) {
				// If background contains only color, then we want to convert it into background-color so that it's
				// correctly picked by colorbutton plugin.
				contentTransformations = [
					[
						{
							// Transform span that specify background with color only to background-color.
							element: 'span',
							left: function( element ) {
								var tools = CKEDITOR.tools;
								if ( element.name != 'span' || !element.styles || !element.styles.background ) {
									return false;
								}

								var background = tools.style.parse.background( element.styles.background );

								// We return true only if background specifies **only** color property, and there's only one background directive.
								return background.color && tools.object.keys( background ).length === 1;
							},
							right: function( element ) {
								var style = new CKEDITOR.style( editor.config.colorButton_backStyle, {
										color: element.styles.background
									} ),
									definition = style.getDefinition();

								// Align the output object with the template used in config.
								element.name = definition.element;
								element.styles = definition.styles;
								element.attributes = definition.attributes || {};

								return element;
							}
						}
					]
				];
			}

			addButton( {
				name: 'BGColor',
				type: 'back',
				commandName: 'bgColor',
				title: lang.bgColorTitle,
				order: 20,
				contentTransformations: contentTransformations
			} );
		}

		var ColorBox = CKEDITOR.tools.createClass( {
			$: function( color, clickFn ) {
				this.$ = new CKEDITOR.dom.element( 'td' );
				this.color = color;
				this.label = ColorBox.colorNames[ this.color ] || this.color;
				this.clickFn = clickFn;

				this.setHtml();
			},

			statics: {
				colorNames: editor.lang.colorbutton.colors,

				generateHtml: function( options ) {
					return '<td>' +
							'<a class="cke_colorbox" _cke_focus=1 hidefocus=true' +
								' title="' + options.label + '"' +
								' draggable="false"' +
								' ondragstart="return false;"' + // Draggable attribute is buggy on Firefox.
								' onclick="CKEDITOR.tools.callFunction(' + options.clickFn + ',\'' + options.color + '\');' +
								' return false;"' +
								' href="javascript:void(\'' + options.color + '\')"' +
								' data-value="' + options.color + '"' +
								' role="option" aria-posinset="' + options.position + '" aria-setsize="' + options.setSize + '">' +
								'<span class="cke_colorbox" style="background-color:#' + options.color + '"></span>' +
							'</a>' +
						'</td>';
				}
			},

			proto: {
				setHtml: function() {
					this.getElement().setHtml( '<a class="cke_colorbox" _cke_focus=1 hidefocus=true' +
							' title="' + this.label + '"' +
							' draggable="false"' +
							' ondragstart="return false;"' + // Draggable attribute is buggy on Firefox.
							' onclick="CKEDITOR.tools.callFunction(' + this.clickFn + ',\'' + this.color + '\');' +
							' return false;"' +
							' href="javascript:void(\'' + this.color + '\')"' +
							' data-value="' + this.color + '"' +
							' role="option">' +
							'<span class="cke_colorbox" style="background-color:#' + this.color + '"></span>' +
						'</a>' );
				},

				setAriaAttributes: function( posinset, setsize ) {
					this.getElement().getChild( 0 ).setAttributes( {
						'aria-posinset': posinset,
						'aria-setsize': setsize
					} );
				},

				getElement: function() {
					return this.$;
				}
			}
		} );

		var ColorHistoryRow = CKEDITOR.tools.createClass( {
			$: function() {
				this.$ = new CKEDITOR.dom.element( 'tr' );
				this.$.addClass( 'cke_colorhistory_row' );
				this.boxes = [];
			},

			statics: {
				maxLength: editor.config.colorButton_colorsPerRow
			},

			proto: {
				extractColorBox: function( colorCode ) {
					var index = CKEDITOR.tools.getIndex( this.boxes, function( box ) {
						return box.color == colorCode;
					} );

					if ( index >= 0 ) {
						this.boxes[ index ].getElement().remove();
						return this.boxes.splice( index, 1 )[ 0 ];
					}
				},

				getElement: function() {
					return this.$;
				},

				addNewColor: function( colorBox ) {
					this.boxes.unshift( colorBox );
					this.getElement().append( colorBox.getElement(), true );
				}
			}
		} );

		var ColorHistory = CKEDITOR.tools.createClass( {
			$: function( editor, cssProperty, container ) {
				this.editor = editor;
				this.cssProperty = cssProperty;
				this.container = container;
			},

			statics: {
				renderContainer: function( tag ) {
					return '<' + tag + ' class="cke_colorhistory" role="presentation" cellspacing=0 cellpadding=0 width="100%">' +
						'<tr>' +
							'<td colspan="' + ColorHistoryRow.maxLength + '" align="center">' +
								'<span class="cke_colorhistory_sep"><hr></span>' +
							'</td>' +
						'</tr>' +
					'</' + tag + '>';
				},

				rowLimit: editor.config.colorButton_historyRowLimit,

				capacity: function() {
					return ColorHistory.rowLimit * ColorHistoryRow.maxLength;
				},

				colorList: CKEDITOR.tools.style.parse._colors
			},

			_: {
				getHexCode: function( span, cssProperty, list ) {
					var color = span.getStyle( cssProperty );

					return color in list ? list[ color ].substr( 1 ) : normalizeColor( span.getComputedStyle( cssProperty ) ).toUpperCase();
				},

				extractColorInfo: function() {
					var spans = CKEDITOR.tools.getStyledSpans( this.cssProperty, editor.editable() ),
						colorOccurrences = CKEDITOR.tools.array.reduce( spans, function( occurrences, span ) {
							var colorCode = this._.getHexCode( span, this.cssProperty, ColorHistory.colorList );

							occurrences[ colorCode ] = occurrences[ colorCode ] || 0;
							occurrences[ colorCode ] += 1;

							return occurrences;
						}, {}, this );

					return colorOccurrences;
				},

				sortByOccurrencesAscending: function( objectToParse, targetKeyName ) {
					var result = [];

					for ( var key in objectToParse ) {
						var color = {};

						color[ targetKeyName ] = key;
						color.frequency = objectToParse[ key ];

						result.push( color );
					}

					result.sort( function( a, b ) {
						return b.frequency - a.frequency;
					} );

					this._.trimToCapacity( result );

					return result.reverse();
				},

				trimToCapacity: function( array ) {
					array.splice( ColorHistory.capacity() );
				},

				fillRows: function( colorData ) {
					CKEDITOR.tools.array.forEach( colorData, function( color ) {
						this.addNew( color.colorCode );
					}, this );
				},

				extractColorBox: function( color ) {
					if ( !this.rows ) {
						return;
					}

					var existing;

					CKEDITOR.tools.array.forEach( this.rows, function( row ) {
						existing = existing || row.extractColorBox( color );
					} );

					return existing;
				},

				rearrangeColorsInRows: function() {
					for ( var rowIndex = 0; rowIndex < ColorHistory.rowLimit; rowIndex++ ) {
						if ( this.rows[ rowIndex ].boxes.length <= ColorHistoryRow.maxLength ) {
							return;
						} else if ( this.rows[ rowIndex + 1 ] ) {
							this._.moveLastBoxToNextRow( rowIndex );
						} else if ( rowIndex < ColorHistory.rowLimit - 1 ) {
							this.rows[ rowIndex + 1 ] = new ColorHistoryRow();
							this.container.append( this.rows[ rowIndex + 1 ].getElement() );
							this._.moveLastBoxToNextRow( rowIndex );
						} else {
							this.rows[ rowIndex ].getElement().getLast().remove();
							this.rows[ rowIndex ].boxes.pop();
						}
					}
				},

				moveLastBoxToNextRow: function( index ) {
					this.rows[ index + 1 ].boxes.unshift( this.rows[ index ].boxes.pop() );
					this.rows[ index ].getElement().getLast().move( this.rows[ index + 1 ].getElement(), true );
				},

				pushToBeginning: function( color ) {
					var colorBox = new ColorBox( color, this.clickFn );

					if ( !this.rows ) {
						this.rows = [ new ColorHistoryRow() ];
						this.container.append( this.rows[ 0 ].getElement() );
					}

					this.rows[ 0 ].addNewColor( colorBox );
				},

				updateAriaAttributes: function() {
					var position = 1,
						historyLength = this._.getLength();

					CKEDITOR.tools.array.forEach( this.rows, function( row ) {
						CKEDITOR.tools.array.forEach( row.boxes, function( colorBox ) {
							colorBox.setAriaAttributes( position, historyLength );
							position += 1;
						} );
					} );
				},

				getLength: function() {
					return CKEDITOR.tools.array.reduce( this.rows, function( total, row ) {
						return total += row.boxes.length;
					}, 0 );
				}
			},

			proto: {
				setClickFn: function( clickFn ) {
					this.clickFn = clickFn;
				},

				setContainer: function( container ) {
					this.container = container;
				},

				render: function() {
					if ( ColorHistory.capacity() == 0 ) {
						return;
					}

					var colorOccurrences = this._.extractColorInfo();

					if ( CKEDITOR.tools.isEmpty( colorOccurrences ) ) {
						return;
					}

					var sortedColors = this._.sortByOccurrencesAscending( colorOccurrences, 'colorCode' );

					this._.fillRows( sortedColors );
				},

				addNew: function( colorCode ) {
					if ( ColorHistory.capacity() == 0 ) {
						return;
					}

					var existingBox = this._.extractColorBox( colorCode );

					if ( existingBox ) {
						this.rows[ 0 ].addNewColor( existingBox );
					} else {
						this._.pushToBeginning( colorCode );
					}

					this._.rearrangeColorsInRows();
					this._.updateAriaAttributes();
				}
			}
		} );

		function addButton( options ) {
			var name = options.name,
				type = options.type,
				title = options.title,
				order = options.order,
				commandName = options.commandName,
				contentTransformations = options.contentTransformations || {},
				style = new CKEDITOR.style( config[ 'colorButton_' + type + 'Style' ] ),
				colorBoxId = CKEDITOR.tools.getNextId() + '_colorBox',
				colorData = { type: type },
				defaultColorStyle = new CKEDITOR.style( config[ 'colorButton_' + type + 'Style' ], { color: 'inherit' } ),
				panelBlock;

			editor.addCommand( commandName, {
				contextSensitive: true,
				exec: function( editor, data ) {
					if ( editor.readOnly ) {
						return;
					}

					var newStyle = data.newStyle;

					editor.removeStyle( defaultColorStyle );

					editor.focus();

					if ( newStyle ) {
						editor.applyStyle( newStyle );
					}

					editor.fire( 'saveSnapshot' );
				},

				refresh: function( editor, path ) {
					if ( !defaultColorStyle.checkApplicable( path, editor, editor.activeFilter ) ) {
						this.setState( CKEDITOR.TRISTATE_DISABLED );
					} else if ( defaultColorStyle.checkActive( path, editor ) ) {
						this.setState( CKEDITOR.TRISTATE_ON );
					} else {
						this.setState( CKEDITOR.TRISTATE_OFF );
					}
				}
			} );

			editor.ui.add( name, CKEDITOR.UI_PANELBUTTON, {
				label: title,
				title: title,
				command: commandName,
				editorFocus: 0,
				toolbar: 'colors,' + order,
				allowedContent: style,
				requiredContent: style,
				contentTransformations: contentTransformations,

				panel: {
					css: CKEDITOR.skin.getPath( 'editor' ),
					attributes: { role: 'listbox', 'aria-label': lang.panelTitle }
				},

				onBlock: function( panel, block ) {
					var history = new ColorHistory( editor, type == 'back' ? 'background-color' : 'color' );

					panelBlock = block;

					block.autoSize = true;
					block.element.addClass( 'cke_colorblock' );
					block.element.setHtml( renderColors( {
						type: type,
						colorBoxId: colorBoxId,
						colorData: colorData,
						commandName: commandName,
						panel: panelBlock,
						colorHistory: history
					} ) );

					history.setContainer( block.element.findOne( '.cke_colorhistory' ) );
					history.setClickFn( block.element.data( 'clickFn' ) );

					if ( editor.config.colorButton_renderContentColors ) {
						history.render();
					}

					// The block should not have scrollbars (https://dev.ckeditor.com/ticket/5933, https://dev.ckeditor.com/ticket/6056)
					block.element.getDocument().getBody().setStyle( 'overflow', 'hidden' );

					CKEDITOR.ui.fire( 'ready', this );

					var keys = block.keys;
					var rtl = editor.lang.dir == 'rtl';
					keys[ rtl ? 37 : 39 ] = 'next'; // ARROW-RIGHT
					keys[ 40 ] = 'next'; // ARROW-DOWN
					keys[ 9 ] = 'next'; // TAB
					keys[ rtl ? 39 : 37 ] = 'prev'; // ARROW-LEFT
					keys[ 38 ] = 'prev'; // ARROW-UP
					keys[ CKEDITOR.SHIFT + 9 ] = 'prev'; // SHIFT + TAB
					keys[ 32 ] = 'click'; // SPACE
				},

				// The automatic colorbox should represent the real color (https://dev.ckeditor.com/ticket/6010)
				onOpen: function() {
					var selection = editor.getSelection(),
						block = selection && selection.getStartElement(),
						path = editor.elementPath( block ),
						cssProperty = type == 'back' ? 'background-color' : 'color',
						automaticColor;

					if ( !path ) {
						return;
					}

					// Find the closest block element.
					block = path.block || path.blockLimit || editor.document.getBody();

					// The background color might be transparent. In that case, look up the color in the DOM tree.
					do {
						automaticColor = block && block.getComputedStyle( cssProperty ) || 'transparent';
					}
					while ( type == 'back' && automaticColor == 'transparent' && block && ( block = block.getParent() ) );

					// The box should never be transparent.
					if ( !automaticColor || automaticColor == 'transparent' ) {
						automaticColor = '#ffffff';
					}

					if ( config.colorButton_enableAutomatic !== false ) {
						panelBlock.element.findOne( '#' + colorBoxId ).setStyle( 'background-color', automaticColor );
					}

					var range = selection && selection.getRanges()[ 0 ];

					if ( range ) {
						var walker = new CKEDITOR.dom.walker( range ),
							element = range.collapsed ? range.startContainer : walker.next(),
							finalColor = '',
							currentColor;

						while ( element ) {
							// (#2296)
							if ( element.type !== CKEDITOR.NODE_ELEMENT ) {
								element = element.getParent();
							}

							currentColor = normalizeColor( element.getComputedStyle( cssProperty ) );
							finalColor = finalColor || currentColor;

							if ( finalColor !== currentColor ) {
								finalColor = '';
								break;
							}

							element = walker.next();
						}

						if ( finalColor == 'transparent' ) {
							finalColor = '';
						}
						if ( type == 'fore' ) {
							colorData.automaticTextColor = '#' + normalizeColor( automaticColor );
						}
						colorData.selectionColor = finalColor ? '#' + finalColor : '';

						selectColor( panelBlock, finalColor );
					}

					return automaticColor;
				}
			} );
		}

		function renderColors( options ) {
			var type = options.type,
				colorBoxId = options.colorBoxId,
				colorData = options.colorData,
				commandName = options.commandName,
				panel = options.panel,
				output = [],
				colors = config.colorButton_colors.split( ',' ),
				// Tells if we should include "More Colors..." button.
				moreColorsEnabled = editor.plugins.colordialog && config.colorButton_enableMore !== false,
				// aria-setsize and aria-posinset attributes are used to indicate size of options, because
				// screen readers doesn't play nice with table, based layouts (https://dev.ckeditor.com/ticket/12097).
				total = colors.length + ( moreColorsEnabled ? 2 : 1 ),
				colorStyleTemplate = editor.config[ 'colorButton_' + type + 'Style' ];

			colorStyleTemplate.childRule = type == 'back' ?
				function( element ) {
					// It's better to apply background color as the innermost style. (https://dev.ckeditor.com/ticket/3599)
					// Except for "unstylable elements". (https://dev.ckeditor.com/ticket/6103)
					return isUnstylable( element );
				} : function( element ) {
					// Fore color style must be applied inside links instead of around it. (https://dev.ckeditor.com/ticket/4772,https://dev.ckeditor.com/ticket/6908)
					return !( element.is( 'a' ) || element.getElementsByTag( 'a' ).count() ) || isUnstylable( element );
				};

			var clickFn = CKEDITOR.tools.addFunction( function applyColorStyle( color, colorName ) {
				editor.focus();
				editor.fire( 'saveSnapshot' );

				if ( color == '?' ) {
					editor.getColorFromDialog( function( color ) {
						if ( color ) {
							setColor( color );
							options.colorHistory.addNew( color.substr( 1 ).toUpperCase() );
						}
					}, null, colorData );
				} else if ( color ) {
					setColor( color && '#' + color );
					options.colorHistory.addNew( color.toUpperCase() );
				}
			} );

			panel.element.data( 'clickfn', clickFn );

			if ( config.colorButton_enableAutomatic !== false ) {
				output.push( generateAutomaticButtonHtml() );
			}

			output.push( '<table role="presentation" cellspacing=0 cellpadding=0 width="100%"><tbody>' );

			// Render the color boxes.
			for ( var i = 0; i < colors.length; i++ ) {
				if ( ( i % ColorHistoryRow.maxLength ) === 0 )
					output.push( '</tr><tr>' );

				var parts = colors[ i ].split( '/' ),
					colorName = parts[ 0 ],
					colorCode = parts[ 1 ] || colorName,
					colorLabel;

				// The data can be only a color code (without #) or colorName + color code
				// If only a color code is provided, then the colorName is the color with the hash
				// Convert the color from RGB to RRGGBB for better compatibility with IE and <font>. See https://dev.ckeditor.com/ticket/5676
				// Additionally, if the data is a single color code then let's try to translate it or fallback on the
				// color code. If the data is a color name/code, then use directly the color name provided.
				if ( !parts[ 1 ] ) {
					colorLabel = editor.lang.colorbutton.colors[ colorCode ] || colorCode;
				} else {
					colorLabel = colorName;
				}

				output.push( ColorBox.generateHtml( {
					label: colorLabel,
					clickFn: clickFn,
					color: colorCode,
					position: i + 2, // First color box should have position 2 as position 1 is for Automatic Button.
					setSize: total
				} ) );
			}

			if ( editor.config.colorButton_historyRowLimit ) {
				output.push( '</tbody>' +
						ColorHistory.renderContainer( 'tbody' ) +
					'<tbody>' );
			}

			if ( moreColorsEnabled ) {
				output.push( generateMoreColorsButtonHtml() );
			}

			output.push( '</tr></tbody></table>' );

			return output.join( '' );

			function generateAutomaticButtonHtml() {
				return '<a class="cke_colorauto" _cke_focus=1 hidefocus=true' +
					' title="' + lang.auto + '"' +
					' draggable="false"' +
					' ondragstart="return false;"' + // Draggable attribute is buggy on Firefox.
					' onclick="CKEDITOR.tools.callFunction(' + clickFn + ',null,\'' + type + '\');return false;"' +
					' href="javascript:void(\'' + lang.auto + '\')"' +
					' role="option" aria-posinset="1" aria-setsize="' + total + '">' +
						'<table role="presentation" cellspacing=0 cellpadding=0 width="100%">' +
							'<tr>' +
								'<td colspan="' + ColorHistoryRow.maxLength + '" align="center">' +
									'<span class="cke_colorbox" id="' + colorBoxId + '"></span>' + lang.auto +
								'</td>' +
							'</tr>' +
						'</table>' +
					'</a>';
			}

			function generateMoreColorsButtonHtml() {
				return '</tr>' +
					'<tr>' +
						'<td colspan="' + ColorHistoryRow.maxLength + '" align="center">' +
							'<a class="cke_colormore" _cke_focus=1 hidefocus=true' +
								' title="' + lang.more + '"' +
								' draggable="false"' +
								' ondragstart="return false;"' + // Draggable attribute is buggy on Firefox.
								' onclick="CKEDITOR.tools.callFunction(' + clickFn + ',\'?\',\'' + type + '\');return false;"' +
								' href="javascript:void(\'' + lang.more + '\')"' + ' role="option" aria-posinset="' + total +
								'" aria-setsize="' + total + '">' + lang.more +
							'</a>' +
						'</td>'; // </tr> is later in the code.
			}

			function setColor( color ) {
				var colorStyle = color && new CKEDITOR.style( colorStyleTemplate, { color: color } );

				editor.execCommand( commandName, { newStyle: colorStyle } );
			}
		}

		function isUnstylable( ele ) {
			return ( ele.getAttribute( 'contentEditable' ) == 'false' ) || ele.getAttribute( 'data-nostyle' );
		}

		/*
		 * Selects the specified color in the specified panel block.
		 *
		 * @private
		 * @member CKEDITOR.plugins.colorbutton
		 * @param {CKEDITOR.ui.panel.block} block
		 * @param {String} color
		 */
		function selectColor( block, color ) {
			var items = block._.getItems();

			for ( var i = 0; i < items.count(); i++ ) {
				var item = items.getItem( i );

				item.removeAttribute( 'aria-selected' );

				if ( color && color == normalizeColor( item.getAttribute( 'data-value' ) ) ) {
					item.setAttribute( 'aria-selected', true );
				}
			}
		}

		/*
		 * Converts a CSS color value to an easily comparable form.
		 *
		 * @private
		 * @member CKEDITOR.plugins.colorbutton
		 * @param {String} color
		 * @returns {String}
		 */
		function normalizeColor( color ) {
			// Replace 3-character hexadecimal notation with a 6-character hexadecimal notation (#1008).
			return CKEDITOR.tools.normalizeHex( '#' + CKEDITOR.tools.convertRgbToHex( color || '' ) ).replace( /#/g, '' );
		}
	}
} );

/**
 * Whether to enable the **More Colors** button in the color selectors.
 *
 * Read more in the {@glink features/colorbutton documentation}
 * and see the {@glink examples/colorbutton example}.
 *
 *		config.colorButton_enableMore = false;
 *
 * @cfg {Boolean} [colorButton_enableMore=true]
 * @member CKEDITOR.config
 */

/**
 * Defines the colors to be displayed in the color selectors. This is a string
 * containing hexadecimal notation for HTML colors, without the `'#'` prefix.
 *
 * **Since 3.3:** A color name may optionally be defined by prefixing the entries with
 * a name and the slash character. For example, `'FontColor1/FF9900'` will be
 * displayed as the color `#FF9900` in the selector, but will be output as `'FontColor1'`.
 * **This behaviour was altered in version 4.12.0.**
 *
 * **Since 4.6.2:** The default color palette has changed. It contains fewer colors in more
 * pastel shades than the previous one.
 *
 * **Since 4.12.0:** Defining colors with names works in a different way. Colors names can be defined
 * by `colorName/colorCode`. The color name is only used in the tooltip. The output will now use the color code.
 * For example, `FontColor/FF9900` will be displayed as the color `#FF9900` in the selector, and will
 * be output as `#FF9900`.
 *
 * Read more in the {@glink features/colorbutton documentation}
 * and see the {@glink examples/colorbutton example}.
 *
 *		// Brazil colors only.
 *		config.colorButton_colors = '00923E,F8C100,28166F';
 *
 *		config.colorButton_colors = 'FontColor1/FF9900,FontColor2/0066CC,FontColor3/F00';
 *
 *		// CKEditor color palette available before version 4.6.2.
 *		config.colorButton_colors =
 *			'000,800000,8B4513,2F4F4F,008080,000080,4B0082,696969,' +
 *			'B22222,A52A2A,DAA520,006400,40E0D0,0000CD,800080,808080,' +
 *			'F00,FF8C00,FFD700,008000,0FF,00F,EE82EE,A9A9A9,' +
 *			'FFA07A,FFA500,FFFF00,00FF00,AFEEEE,ADD8E6,DDA0DD,D3D3D3,' +
 *			'FFF0F5,FAEBD7,FFFFE0,F0FFF0,F0FFFF,F0F8FF,E6E6FA,FFF';
 *
 * @cfg {String} [colorButton_colors=see source]
 * @member CKEDITOR.config
 */
CKEDITOR.config.colorButton_colors = '1ABC9C,2ECC71,3498DB,9B59B6,4E5F70,F1C40F,' +
	'16A085,27AE60,2980B9,8E44AD,2C3E50,F39C12,' +
	'E67E22,E74C3C,ECF0F1,95A5A6,DDD,FFF,' +
	'D35400,C0392B,BDC3C7,7F8C8D,999,000';

/**
 * Stores the style definition that applies the text foreground color.
 *
 * **Note:** Advanced Content Filter (ACF) is not updated automatically by a custom style definition.
 * You may need to add additional ACF rules, so the customized style element is not removed.
 * Learn more how to configure ACF with {@glink guide/dev_advanced_content_filter Advanced Content Filter guide}.
 *
 * Read more in the {@glink features/colorbutton documentation}
 * and see the {@glink examples/colorbutton example}.
 *
 *		// This is actually the default value.
 *		config.colorButton_foreStyle = {
 *			element: 'span',
 *			styles: { color: '#(color)' }
 *		};
 *
 * **Since 4.15.0:** Added `colorName` property, which can be used instead of a `color`
 * property to customize foreground style. For example to add custom class:
 *
 *		config.colorButton_foreStyle = {
 *			element: 'span',
 *			attributes: { 'class': '#(colorName)' }
 *		};
 *
 * @cfg [colorButton_foreStyle=see source]
 * @member CKEDITOR.config
 */
CKEDITOR.config.colorButton_foreStyle = {
	element: 'span',
	styles: { 'color': '#(color)' },
	overrides: [ {
		element: 'font', attributes: { 'color': null }
	} ]
};

/**
 * Stores the style definition that applies the text background color.
 *
 * **Note:** Advanced Content Filter (ACF) is not updated automatically by a custom style definition.
 * You may need to add additional ACF rules, so the customized style element is not removed.
 * Learn more how to configure ACF with {@glink guide/dev_advanced_content_filter Advanced Content Filter guide}.
 *
 * Read more in the {@glink features/colorbutton documentation}
 * and see the {@glink examples/colorbutton example}.
 *
 *		// This is actually the default value.
 *		config.colorButton_backStyle = {
 *			element: 'span',
 *			styles: { 'background-color': '#(color)' }
 *		};
 *
 * **Since 4.15.0:** Added `colorName` property, which can be used instead of a `color`
 * property to customize background style. For example to add custom class:
 *
 *		config.colorButton_backStyle = {
 *			element: 'span',
 *			attributes: { 'class': '#(colorName)' }
 *		};
 *
 * @cfg [colorButton_backStyle=see source]
 * @member CKEDITOR.config
 */
CKEDITOR.config.colorButton_backStyle = {
	element: 'span',
	styles: { 'background-color': '#(color)' }
};

/**
 * Whether to enable the **Automatic** button in the color selectors.
 *
 * Read more in the {@glink features/colorbutton documentation}
 * and see the {@glink examples/colorbutton example}.
 *
 *		config.colorButton_enableAutomatic = false;
 *
 * @cfg {Boolean} [colorButton_enableAutomatic=true]
 * @member CKEDITOR.config
 */

/**
 * Defines how many colors will be shown per row in the color selectors.
 *
 * Read more in the {@glink features/colorbutton documentation}
 * and see the {@glink examples/colorbutton example}.
 *
 *		config.colorButton_colorsPerRow = 8;
 *
 * @since 4.6.2
 * @cfg {Number} [colorButton_colorsPerRow=6]
 * @member CKEDITOR.config
 */

CKEDITOR.config.colorButton_colorsPerRow = 6;

/**
 * Whether the plugin should convert `background` CSS properties with color only, to a `background-color` property,
 * allowing the [Color Button](https://ckeditor.com/cke4/addon/colorbutton) plugin to edit these styles.
 *
 *		config.colorButton_normalizeBackground = false;
 *
 * @since 4.6.1
 * @cfg {Boolean} [colorButton_normalizeBackground=true]
 * @member CKEDITOR.config
 */

/**
 * Defines how many color history rows can be created.
 *
 *		config.colorButton_historyRowLimit = 2;
 *
 * @since 4.15.0
 * @cfg {Number} [colorButton_historyRowLimit=1]
 * @member CKEDITOR.config
 */

CKEDITOR.config.colorButton_historyRowLimit = 1;

/**
 * Defines if color history should be initially filled by colors found in content.
 *
 *		config.colorButton_renderContentColors = false;
 *
 * @since 4.15.0
 * @cfg {Number} [colorButton_renderContentColors=true]
 * @member CKEDITOR.config
 */

CKEDITOR.config.colorButton_renderContentColors = true;
