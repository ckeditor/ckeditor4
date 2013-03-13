/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.skin} class, which is used to manage skin parts.
 */

(function() {
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
		 * Returns the root path of the skin directory.
		 *
		 * @method
		 * @todo
		 */
		path: getConfigPath,

		/**
		 * Load a skin part onto the page, do nothing if the part is already loaded.
		 *
		 * **Note:** The "editor" part is always auto loaded upon instance creation,
		 * thus this function is mainly used to **lazy load** other part of the skin
		 * which don't have to present until been requested.
		 *
		 *		// Load the dialog part.
		 *		editor.skin.loadPart( 'dialog' );
		 *
		 * @param {String} part Name of skin part CSS file resides in the skin directory.
		 * @param {Function} fn The provided callback function which is invoked after part is loaded.
		 */
		loadPart: function( part, fn ) {
			if ( CKEDITOR.skin.name != getName() ) {
				CKEDITOR.scriptLoader.load( CKEDITOR.getUrl( getConfigPath() + 'skin.js' ), function() {
					loadCss( part, fn );
				});
			} else
				loadCss( part, fn );
		},

		/**
		 * Retrieve the real URL of a (CSS) skin part.
		 *
		 * @param {String} part
		 */
		getPath: function( part ) {
			return CKEDITOR.getUrl( getCssPath( part ) );
		},

		/**
		 * List of registered icons. To add new icons to this list, use {@link #addIcon}.
		 */
		icons: {},

		/**
		 * Registers an icon.
		 *
		 * @param {String} name The icon name.
		 * @param {String} path The path to reach the icon image file.
		 * @param {Number} [offset] The vertical offset position of the icon, if
		 * available inside a strip image.
		 */
		addIcon: function( name, path, offset ) {
			name = name.toLowerCase();
			if ( !this.icons[ name ] ) {
				this.icons[ name ] = {
					path: path,
					offset: offset || 0
				};
			}
		},

		/**
		 * Get the CSS background styles to be used to render an specific icon.
		 *
		 * @param {String} name The icon name, as registered with {@link #addIcon}.
		 * @param {Boolean} [rtl] Indicates that the RTL version of the icon is
		 * to be used, if available.
		 * @param {String} [overridePath] The path to reach the icon image file. It
		 * overrides the path defined by the named icon, if available, and is
		 * used if the named icon was not registered.
		 * @param {Number} [overrideOffset] The vertical offset position of the
		 * icon. It overrides the offset defined by the named icon, if
		 * available, and is used if the named icon was not registered.
		 */
		getIconStyle: function( name, rtl, overridePath, overrideOffset ) {
			var icon, path, offset;

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

			return path &&
				( 'background-image:url(' + CKEDITOR.getUrl( path ) + ');background-position:0 ' + offset + 'px;' );
		}
	};

	function getCssPath( part ) {
			// Check for ua-specific version of skin part.
			var uas = CKEDITOR.skin[ 'ua_' + part ], env = CKEDITOR.env;
			if ( uas ) {

				// Having versioned UA checked first.
				uas = uas.split( ',' ).sort( function ( a, b ) { return a > b ? -1 : 1; } );

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
		/**
		 * @method
		 * @member CKEDITOR.editor
		 * @todo
		 */
		getUiColor: function() {
			return this.uiColor;
		},

		/**
		 * @method
		 * @member CKEDITOR.editor
		 * @todo
		 */
		setUiColor: function( color ) {
			var uiStyle = getStylesheet( CKEDITOR.document );

			return ( this.setUiColor = function( color ) {
				var chameleon = CKEDITOR.skin.chameleon;

				var replace = [ [ uiColorRegexp, color ] ];
				this.uiColor = color;

				// Update general style.
				updateStylesheets( [ uiStyle ], chameleon( this, 'editor' ), replace );

				// Update panel styles.
				updateStylesheets( uiColorMenus, chameleon( this, 'panel' ), replace );
			}).call( this, color );
		}
	});

	var uiColorStylesheetId = 'cke_ui_color',
		uiColorMenus = [],
		uiColorRegexp = /\$color/g;

	function getStylesheet( document ) {
		var node = document.getById( uiColorStylesheetId );
		if ( !node ) {
			node = document.getHead().append( 'style' );
			node.setAttribute( "id", uiColorStylesheetId );
			node.setAttribute( "type", "text/css" );
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

				if ( CKEDITOR.env.ie )
					styleNodes[ id ].$.styleSheet.cssText += content;
				else
					styleNodes[ id ].$.innerHTML += content;
			}
		}
	}

	CKEDITOR.on( 'instanceLoaded', function( evt ) {
		// The chameleon feature is not for IE quirks.
		if ( CKEDITOR.env.ie && CKEDITOR.env.quirks )
			return;

		var editor = evt.editor,
			showCallback = function( event ) {
				var panel = event.data[ 0 ] || event.data;
				var iframe = panel.element.getElementsByTag( 'iframe' ).getItem( 0 ).getFrameDocument();

				// Add stylesheet if missing.
				if ( !iframe.getById( 'cke_ui_color' ) ) {
					var node = getStylesheet( iframe );
					uiColorMenus.push( node );

					var color = editor.getUiColor();
					// Set uiColor for new panel.
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
	});
})();

/**
 * List of file names, with each one matches a browser agent string cited from
 * {@link CKEDITOR.env}, the corresponding skin part file will be loaded in addition
 * to the "main" skin file for a particular browser.
 *
 * **Note:** For each of the defined skin parts must have
 * the corresponding CSS file with the same name as UA inside of
 * the skin directory.
 *
 * @property ua
 * @todo type?
 */

 /**
  * Current skin name.
  *
  * @property {String} name
  * @todo
  */

/**
 * The editor skin name. Note that is is not possible to have editors with
 * different skin settings in the same page. In such case, just one of the
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
 * A function that support the chameleon (skin color switch) feature, providing
 * the skin colors styles update to be apply in runtime.
 *
 * **Note:** the embedded `$color` variable is to be substituted by a concrete UI color.
 *
 * @method chameleon
 * @param {String} editor The editor instance upon color changes impact.
 * @param {String} part Name of the skin part where the color changes take place.
 */
