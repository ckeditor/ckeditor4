/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.skin} class that is used to manage skin parts.
 */

( function() {
	var cssLoaded = {};

	function getName() {
		return CKEDITOR.skinName.split( ',' )[ 0 ];
	}

	function getConfigPath() {
		return CKEDITOR.getUrl( CKEDITOR.skinName.split( ',' )[ 1 ] || ( 'skins/' + getName() + '/' ) );
	}

	/**
	 * Manages the loading of skin parts among all editor instances.
	 *
	 * @class
	 * @singleton
	 */
	CKEDITOR.skin = {
		/**
		 * Returns the root path to the skin directory.
		 *
		 * @method
		 * @todo
		 */
		path: getConfigPath,

		/**
		 * Loads a skin part into the page. Does nothing if the part has already been loaded.
		 *
		 * **Note:** The "editor" part is always auto loaded upon instance creation,
		 * thus this function is mainly used to **lazy load** other parts of the skin
		 * that do not have to be displayed until requested.
		 *
		 *		// Load the dialog part.
		 *		editor.skin.loadPart( 'dialog' );
		 *
		 * @param {String} part The name of the skin part CSS file that resides in the skin directory.
		 * @param {Function} fn The provided callback function which is invoked after the part is loaded.
		 */
		loadPart: function( part, fn ) {
			if ( CKEDITOR.skin.name != getName() ) {
				CKEDITOR.scriptLoader.load( CKEDITOR.getUrl( getConfigPath() + 'skin.js' ), function() {
					loadCss( part, fn );
				} );
			} else {
				loadCss( part, fn );
			}
		},

		/**
		 * Retrieves the real URL of a (CSS) skin part.
		 *
		 * @param {String} part
		 */
		getPath: function( part ) {
			return CKEDITOR.getUrl( getCssPath( part ) );
		},

		/**
		 * The list of registered icons. To add new icons to this list, use {@link #addIcon}.
		 */
		icons: {},

		/**
		 * Registers an icon.
		 *
		 * @param {String} name The icon name.
		 * @param {String} path The path to the icon image file.
		 * @param {Number} [offset] The vertical offset position of the icon, if
		 * available inside a strip image.
		 * @param {String} [bgsize] The value of the CSS "background-size" property to
		 * use for this icon
		 */
		addIcon: function( name, path, offset, bgsize ) {
			name = name.toLowerCase();
			if ( !this.icons[ name ] ) {
				this.icons[ name ] = {
					path: path,
					offset: offset || 0,
					bgsize: bgsize || '16px'
				};
			}
		},

		/**
		 * Gets the CSS background styles to be used to render a specific icon.
		 *
		 * @param {String} name The icon name, as registered with {@link #addIcon}.
		 * @param {Boolean} [rtl] Indicates that the RTL version of the icon is
		 * to be used, if available.
		 * @param {String} [overridePath] The path to the icon image file. It
		 * overrides the path defined by the named icon, if available, and is
		 * used if the named icon was not registered.
		 * @param {Number} [overrideOffset] The vertical offset position of the
		 * icon. It overrides the offset defined by the named icon, if
		 * available, and is used if the named icon was not registered.
		 * @param {String} [overrideBgsize] The value of the CSS "background-size" property
		 * to use for the icon. It overrides the value defined by the named icon,
		 * if available, and is used if the named icon was not registered.
		 */
		getIconStyle: function( name, rtl, overridePath, overrideOffset, overrideBgsize ) {
			var icon, path, offset, bgsize;

			if ( name ) {
				name = name.toLowerCase();
				// If we're in RTL, try to get the RTL version of the icon.
				if ( rtl )
					icon = this.icons[ name + '-rtl' ];

				// If not in LTR or no RTL version available, get the generic one.
				if ( !icon )
					icon = this.icons[ name ];
			}

			path = overridePath || ( icon && icon.path ) || '';
			offset = overrideOffset || ( icon && icon.offset );
			bgsize = overrideBgsize || ( icon && icon.bgsize ) || '16px';

			// If we use apostrophes in background-image, we must escape apostrophes in path (just to be sure). (https://dev.ckeditor.com/ticket/13361)
			if ( path )
				path = path.replace( /'/g, '\\\'' );

			return path &&
				( 'background-image:url(\'' + CKEDITOR.getUrl( path ) + '\');background-position:0 ' + offset + 'px;background-size:' + bgsize + ';' );
		}
	};

	function getCssPath( part ) {
		// Check for ua-specific version of skin part.
		var uas = CKEDITOR.skin[ 'ua_' + part ], env = CKEDITOR.env;
		if ( uas ) {

			// Having versioned UA checked first.
			uas = uas.split( ',' ).sort( function( a, b ) {
				return a > b ? -1 : 1;
			} );

			// Loop through all ua entries, checking is any of them match the current ua.
			for ( var i = 0, ua; i < uas.length; i++ ) {
				ua = uas[ i ];

				if ( env.ie ) {
					if ( ( ua.replace( /^ie/, '' ) == env.version ) || ( env.quirks && ua == 'iequirks' ) )
						ua = 'ie';
				}

				if ( env[ ua ] ) {
					part += '_' + uas[ i ];
					break;
				}
			}
		}
		return CKEDITOR.getUrl( getConfigPath() + part + '.css' );
	}

	function loadCss( part, callback ) {
		// Avoid reload.
		if ( !cssLoaded[ part ] ) {
			CKEDITOR.document.appendStyleSheet( getCssPath( part ) );
			cssLoaded[ part ] = 1;
		}

		// CSS loading should not be blocking.
		callback && callback();
	}

	CKEDITOR.tools.extend( CKEDITOR.editor.prototype, {
		/** Gets the color of the editor user interface.
		 *
		 *		CKEDITOR.instances.editor1.getUiColor();
		 *
		 * @method
		 * @member CKEDITOR.editor
		 * @returns {String} uiColor The editor UI color or `undefined` if the UI color is not set.
		 */
		getUiColor: function() {
			return this.uiColor;
		},

		/** Sets the color of the editor user interface. This method accepts a color value in
		 * hexadecimal notation, with a `#` character (e.g. #ffffff).
		 *
		 * 		CKEDITOR.instances.editor1.setUiColor( '#ff00ff' );
		 *
		 * @method
		 * @member CKEDITOR.editor
		 * @param {String} color The desired editor UI color in hexadecimal notation.
		 */
		setUiColor: function( color ) {
			var uiStyle = getStylesheet( CKEDITOR.document );

			return ( this.setUiColor = function( color ) {
				this.uiColor = color;

				var chameleon = CKEDITOR.skin.chameleon,
					editorStyleContent = '',
					panelStyleContent = '';

				if ( typeof chameleon == 'function' ) {
					editorStyleContent = chameleon( this, 'editor' );
					panelStyleContent = chameleon( this, 'panel' );
				}

				var replace = [ [ uiColorRegexp, color ] ];

				// Update general style.
				updateStylesheets( [ uiStyle ], editorStyleContent, replace );

				// Update panel styles.
				updateStylesheets( uiColorMenus, panelStyleContent, replace );
			} ).call( this, color );
		}
	} );

	var uiColorStylesheetId = 'cke_ui_color',
		uiColorMenus = [],
		uiColorRegexp = /\$color/g;

	function getStylesheet( document ) {
		var node = document.getById( uiColorStylesheetId );
		if ( !node ) {
			node = document.getHead().append( 'style' );
			node.setAttribute( 'id', uiColorStylesheetId );
			node.setAttribute( 'type', 'text/css' );
		}
		return node;
	}

	function updateStylesheets( styleNodes, styleContent, replace ) {
		var r, i, content;

		// We have to split CSS declarations for webkit.
		if ( CKEDITOR.env.webkit ) {
			styleContent = styleContent.split( '}' ).slice( 0, -1 );
			for ( i = 0; i < styleContent.length; i++ )
				styleContent[ i ] = styleContent[ i ].split( '{' );
		}

		for ( var id = 0; id < styleNodes.length; id++ ) {
			if ( CKEDITOR.env.webkit ) {
				for ( i = 0; i < styleContent.length; i++ ) {
					content = styleContent[ i ][ 1 ];
					for ( r = 0; r < replace.length; r++ )
						content = content.replace( replace[ r ][ 0 ], replace[ r ][ 1 ] );

					styleNodes[ id ].$.sheet.addRule( styleContent[ i ][ 0 ], content );
				}
			} else {
				content = styleContent;
				for ( r = 0; r < replace.length; r++ )
					content = content.replace( replace[ r ][ 0 ], replace[ r ][ 1 ] );

				if ( CKEDITOR.env.ie && CKEDITOR.env.version < 11 )
					styleNodes[ id ].$.styleSheet.cssText += content;
				else
					styleNodes[ id ].$.innerHTML += content;
			}
		}
	}

	CKEDITOR.on( 'instanceLoaded', function( evt ) {
		// The chameleon feature is not for IE quirks.
		if ( CKEDITOR.env.ie && CKEDITOR.env.quirks ) {
			return;
		}

		var editor = evt.editor,
			showCallback = function( event ) {
				var panel = event.data[ 0 ] || event.data,
					iframe = panel.element.getElementsByTag( 'iframe' ).getItem( 0 ).getFrameDocument();

				// Add the stylesheet if missing.
				if ( !iframe.getById( 'cke_ui_color' ) ) {
					var node = getStylesheet( iframe );
					uiColorMenus.push( node );

					// Cleanup after destroying the editor (#589).
					editor.on( 'destroy', function() {
						uiColorMenus = CKEDITOR.tools.array.filter( uiColorMenus, function( storedNode ) {
							return node !== storedNode;
						} );
					} );

					var color = editor.getUiColor();
					// Set uiColor for the new panel.
					if ( color ) {
						updateStylesheets( [ node ], CKEDITOR.skin.chameleon( editor, 'panel' ), [ [ uiColorRegexp, color ] ] );
					}
				}
			};

		editor.on( 'panelShow', showCallback );
		editor.on( 'menuShow', showCallback );

		// Apply UI color if specified in config.
		if ( editor.config.uiColor )
			editor.setUiColor( editor.config.uiColor );
	} );
} )();

/**
 * The list of file names matching the browser user agent string from
 * {@link CKEDITOR.env}. This is used to load the skin part file in addition
 * to the "main" skin file for a particular browser.
 *
 * **Note:** For each of the defined skin parts the corresponding
 * CSS file with the same name as the user agent must exist inside
 * the skin directory.
 *
 * @property ua
 * @todo type?
 */

/**
 * The name of the skin that is currently used.
 *
 * @property {String} name
 * @todo
 */

/**
 * The editor skin name. Note that it is not possible to have editors with
 * different skin settings in the same page. In such case just one of the
 * skins will be used for all editors.
 *
 * This is a shortcut to {@link CKEDITOR#skinName}.
 *
 * It is possible to install skins outside the default `skin` folder in the
 * editor installation. In that case, the absolute URL path to that folder
 * should be provided, separated by a comma (`'skin_name,skin_path'`).
 *
 *		config.skin = 'moono';
 *
 *		config.skin = 'myskin,/customstuff/myskin/';
 *
 * @cfg {String} skin
 * @member CKEDITOR.config
 */

/**
 * A function that supports the chameleon (skin color switch) feature, providing
 * the skin color style updates to be applied in runtime.
 *
 * **Note:** The embedded `$color` variable is to be substituted with a specific UI color.
 *
 * @method chameleon
 * @param {String} editor The editor instance that the color changes apply to.
 * @param {String} part The name of the skin part where the color changes take place.
 */

/**
 * To help implement browser-specific "hacks" to the skin files and make it easy to maintain,
 * it is possible to have dedicated files for such browsers. The browser files must be named after the main file names,
 * appended by an underscore and the browser name (e.g. `editor_ie.css`, `editor_ie8.css`). The accepted browser names
 * must match the {@link CKEDITOR.env} properties. You can find more information about browser "hacks" in the
 * {@glink guide/skin_sdk_browser_hacks Dedicated Browser Hacks} guide.
 *
 *		CKEDITOR.skin.ua_editor = 'ie,iequirks,ie8,gecko';
 *
 * @property {String} ua_editor
 */

/**
 * Similar to {@link #ua_editor} but used for dialog stylesheets.
 *
 *		CKEDITOR.skin.ua_dialog = 'ie,iequirks,ie8,gecko';
 *
 * @property {String} ua_dialog
 */
