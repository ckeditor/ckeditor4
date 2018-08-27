/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
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
			addButton( 'TextColor', 'fore', lang.textColorTitle, 10, {
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

			var  bgOptions = {},
				normalizeBackground = editor.config.colorButton_normalizeBackground;

			if ( normalizeBackground === undefined || normalizeBackground ) {
				// If background contains only color, then we want to convert it into background-color so that it's
				// correctly picked by colorbutton plugin.
				bgOptions.contentTransformations = [
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
								return background.color && tools.objectKeys( background ).length === 1;
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

			addButton( 'BGColor', 'back', lang.bgColorTitle, 20, bgOptions );
		}

		function addButton( name, type, title, order, options ) {
			var style = new CKEDITOR.style( config[ 'colorButton_' + type + 'Style' ] ),
				colorBoxId = CKEDITOR.tools.getNextId() + '_colorBox',
				panelBlock;

			options = options || {};

			editor.ui.add( name, CKEDITOR.UI_PANELBUTTON, {
				label: title,
				title: title,
				modes: { wysiwyg: 1 },
				editorFocus: 0,
				toolbar: 'colors,' + order,
				allowedContent: style,
				requiredContent: style,
				contentTransformations: options.contentTransformations,

				panel: {
					css: CKEDITOR.skin.getPath( 'editor' ),
					attributes: { role: 'listbox', 'aria-label': lang.panelTitle }
				},

				onBlock: function( panel, block ) {
					panelBlock = block;

					block.autoSize = true;
					block.element.addClass( 'cke_colorblock' );
					block.element.setHtml( renderColors( panel, type, colorBoxId ) );
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

				refresh: function() {
					if ( !editor.activeFilter.check( style ) )
						this.setState( CKEDITOR.TRISTATE_DISABLED );
				},

				// The automatic colorbox should represent the real color (https://dev.ckeditor.com/ticket/6010)
				onOpen: function() {

					var selection = editor.getSelection(),
						block = selection && selection.getStartElement(),
						path = editor.elementPath( block ),
						automaticColor;

					if ( !path )
						return;

					// Find the closest block element.
					block = path.block || path.blockLimit || editor.document.getBody();

					// The background color might be transparent. In that case, look up the color in the DOM tree.
					do {
						automaticColor = block && block.getComputedStyle( type == 'back' ? 'background-color' : 'color' ) || 'transparent';
					}
					while ( type == 'back' && automaticColor == 'transparent' && block && ( block = block.getParent() ) );

					// The box should never be transparent.
					if ( !automaticColor || automaticColor == 'transparent' )
						automaticColor = '#ffffff';

					if ( config.colorButton_enableAutomatic !== false ) {
						this._.panel._.iframe.getFrameDocument().getById( colorBoxId ).setStyle( 'background-color', automaticColor );
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

							currentColor = normalizeColor( element.getComputedStyle( type == 'back' ? 'background-color' : 'color'  ) );
							finalColor = finalColor || currentColor;

							if ( finalColor !== currentColor ) {
								finalColor = '';
								break;
							}

							element = walker.next();
						}

						selectColor( panelBlock, finalColor );
					}

					return automaticColor;
				}
			} );
		}

		function renderColors( panel, type, colorBoxId ) {
			var output = [],
				colors = config.colorButton_colors.split( ',' ),
				colorsPerRow = config.colorButton_colorsPerRow || 6,
				// Tells if we should include "More Colors..." button.
				moreColorsEnabled = editor.plugins.colordialog && config.colorButton_enableMore !== false,
				// aria-setsize and aria-posinset attributes are used to indicate size of options, because
				// screen readers doesn't play nice with table, based layouts (https://dev.ckeditor.com/ticket/12097).
				total = colors.length + ( moreColorsEnabled ? 2 : 1 );

			var clickFn = CKEDITOR.tools.addFunction( function applyColorStyle( color, type ) {

				editor.focus();
				editor.fire( 'saveSnapshot' );

				if ( color == '?' ) {
					editor.getColorFromDialog( function( color ) {
						if ( color ) {
							return setColor( color );
						}
					} );
				} else {
					return setColor( color );
				}

				function setColor( color ) {
					var colorStyle = config[ 'colorButton_' + type + 'Style' ];
					// Clean up any conflicting style within the range.
					editor.removeStyle( new CKEDITOR.style( colorStyle, { color: 'inherit' } ) );

					colorStyle.childRule = type == 'back' ?
					function( element ) {
						// It's better to apply background color as the innermost style. (https://dev.ckeditor.com/ticket/3599)
						// Except for "unstylable elements". (https://dev.ckeditor.com/ticket/6103)
						return isUnstylable( element );
					} : function( element ) {
						// Fore color style must be applied inside links instead of around it. (https://dev.ckeditor.com/ticket/4772,https://dev.ckeditor.com/ticket/6908)
						return !( element.is( 'a' ) || element.getElementsByTag( 'a' ).count() ) || isUnstylable( element );
					};

					editor.focus();
					if ( color ) {
						editor.applyStyle( new CKEDITOR.style( colorStyle, { color: color } ) );
					}
					editor.fire( 'saveSnapshot' );
				}

			} );

			if ( config.colorButton_enableAutomatic !== false ) {
				// Render the "Automatic" button.
				output.push( '<a class="cke_colorauto" _cke_focus=1 hidefocus=true' +
					' title="', lang.auto, '"' +
					' onclick="CKEDITOR.tools.callFunction(', clickFn, ',null,\'', type, '\');return false;"' +
					' href="javascript:void(\'', lang.auto, '\')"' +
					' role="option" aria-posinset="1" aria-setsize="', total, '">' +
						'<table role="presentation" cellspacing=0 cellpadding=0 width="100%">' +
							'<tr>' +
								'<td colspan="' + colorsPerRow + '" align="center"><span class="cke_colorbox" id="', colorBoxId, '"></span>', lang.auto, '</td>' +
							'</tr>' +
						'</table>' +
					'</a>' );
			}
			output.push( '<table role="presentation" cellspacing=0 cellpadding=0 width="100%">' );

			// Render the color boxes.
			for ( var i = 0; i < colors.length; i++ ) {
				if ( ( i % colorsPerRow ) === 0 )
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
					colorName = '#' + colorName.replace( /^(.)(.)(.)$/, '$1$1$2$2$3$3' );
					colorLabel = editor.lang.colorbutton.colors[ colorCode ] || colorCode;
				} else {
					colorLabel = colorName;
				}

				output.push( '<td>' +
					'<a class="cke_colorbox" _cke_focus=1 hidefocus=true' +
						' title="', colorLabel, '"' +
						' onclick="CKEDITOR.tools.callFunction(', clickFn, ',\'', colorName, '\',\'', type, '\'); return false;"' +
						' href="javascript:void(\'', colorLabel, '\')"' +
						' data-value="' + colorCode + '"' +
						' role="option" aria-posinset="', ( i + 2 ), '" aria-setsize="', total, '">' +
						'<span class="cke_colorbox" style="background-color:#', colorCode, '"></span>' +
					'</a>' +
					'</td>' );
			}

			// Render the "More Colors" button.
			if ( moreColorsEnabled ) {
				output.push( '</tr>' +
					'<tr>' +
						'<td colspan="' + colorsPerRow + '" align="center">' +
							'<a class="cke_colormore" _cke_focus=1 hidefocus=true' +
								' title="', lang.more, '"' +
								' onclick="CKEDITOR.tools.callFunction(', clickFn, ',\'?\',\'', type, '\');return false;"' +
								' href="javascript:void(\'', lang.more, '\')"', ' role="option" aria-posinset="', total, '" aria-setsize="', total, '">', lang.more, '</a>' +
						'</td>' ); // tr is later in the code.
			}

			output.push( '</tr></table>' );

			return output.join( '' );
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
 * Read more in the {@glink guide/dev_colorbutton documentation}
 * and see the [SDK sample](https://sdk.ckeditor.com/samples/colorbutton.html).
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
 *
 * **Since 4.6.2:** The default color palette has changed. It contains fewer colors in more
 * pastel shades than the previous one.
 *
 * Read more in the {@glink guide/dev_colorbutton documentation}
 * and see the [SDK sample](https://sdk.ckeditor.com/samples/colorbutton.html).
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
 * Read more in the {@glink guide/dev_colorbutton documentation}
 * and see the [SDK sample](https://sdk.ckeditor.com/samples/colorbutton.html).
 *
 *		// This is actually the default value.
 *		config.colorButton_foreStyle = {
 *			element: 'span',
 *			styles: { color: '#(color)' }
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
 * Read more in the {@glink guide/dev_colorbutton documentation}
 * and see the [SDK sample](https://sdk.ckeditor.com/samples/colorbutton.html).
 *
 *		// This is actually the default value.
 *		config.colorButton_backStyle = {
 *			element: 'span',
 *			styles: { 'background-color': '#(color)' }
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
 * Read more in the {@glink guide/dev_colorbutton documentation}
 * and see the [SDK sample](https://sdk.ckeditor.com/samples/colorbutton.html).
 *
 *		config.colorButton_enableAutomatic = false;
 *
 * @cfg {Boolean} [colorButton_enableAutomatic=true]
 * @member CKEDITOR.config
 */

/**
 * Defines how many colors will be shown per row in the color selectors.
 *
 * Read more in the {@glink guide/dev_colorbutton documentation}
 * and see the [SDK sample](https://sdk.ckeditor.com/samples/colorbutton.html).
 *
 *		config.colorButton_colorsPerRow = 8;
 *
 * @since 4.6.2
 * @cfg {Number} [colorButton_colorsPerRow=6]
 * @member CKEDITOR.config
 */

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
