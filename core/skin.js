/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKEDITOR.skin} class, which is used to manage skin parts.
 */

(function() {
	var config = CKEDITOR.skinName.split( ',' ),
		skinName = config[ 0 ],
		skinPath = CKEDITOR.getUrl( config[ 1 ] || ( 'skins/' + skinName + '/' ) ),
		cssLoaded = {},
		isLoaded;

	/**
	 * Manages the loading of skin parts among all editor instances.
	 */
	CKEDITOR.skin = {
		/**
		 * The skin name.
		 */
		name: skinName,

		/**
		 * Root path of the skin directory.
		 */
		path: skinPath,

		/**
		 * Load a skin part onto the page, do nothing if the part is already loaded.
		 * <storng>Note:</strong> The "editor" part is always auto loaded upon instance creation,
		 * thus this function is mainly used to <strong>lazy load</strong> other part of the skin
		 * which don't have to present until been requested.
		 *
		 * @param {String} part Name of skin part CSS file resides in the skin directory.
		 * @param {Function} fn The provided callback function which is invoked after part is loaded.
		 * @example
		 * // Load the dialog part.
		 * editor.skin.loadPart( "dialog" );
		 */
		loadPart: function( part, fn ) {
			if ( !isLoaded ) {
				isLoaded = 1;

				CKEDITOR.scriptLoader.load( CKEDITOR.getUrl( skinPath + 'skin.js' ), function() {
					loadCss( part, fn );
				});
			} else
				loadCss( part, fn );
		},

		/**
		 * Retrieve the real URL of a (CSS) skin part.
		 * @param {String} part
		 */
		getPath: function( part ) {
			return CKEDITOR.getUrl( skinPath + part + '.css' );
		}
	};

	function loadCss( part, callback ) {
		// Avoid reload.
		if ( !cssLoaded[ part ] ) {
			var parts = [ part ];

			if ( part == 'editor' ) {
				// TODO: Make it load properly once packaged.

				var uaParts = CKEDITOR.skin.uaParts;
				if ( uaParts ) {
					for ( var i = 0, ua; i < uaParts.length; i++ ) {
						ua = uaParts[ i ];

						// We gonna accept ie6, ie7 and the such as part names,
						// so we need to fix them to match CKEDITOR.env.
						if ( /^ie\d+$/.exec( ua ) )
							ua += 'Compat';

						if ( CKEDITOR.env[ ua ] )
							parts.push( 'browser_' + uaParts[ i ] );
					}
				}
			}

			appendPath( parts );

			for ( var c = 0; c < parts.length; c++ )
				CKEDITOR.document.appendStyleSheet( parts[ c ] + '.css' );

			cssLoaded[ part ] = 1;
		}

		// css loading should not be blocking.
		callback && callback();
	}

	function appendPath( fileNames ) {
		for ( var n = 0; n < fileNames.length; n++ ) {
			fileNames[ n ] = CKEDITOR.getUrl( skinPath + fileNames[ n ] );
		}
	}

	CKEDITOR.tools.extend( CKEDITOR.editor.prototype, {
		getUiColor: function() {
			return this.uiColor;
		},

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
		// We have to split CSS declarations for webkit.
		if ( CKEDITOR.env.webkit ) {
			styleContent = styleContent.split( '}' ).slice( 0, -1 );
			for ( var i = 0; i < styleContent.length; i++ )
				styleContent[ i ] = styleContent[ i ].split( '{' );
		}

		var r, i, content;
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
		var editor = evt.editor;

		editor.on( 'menuShow', function( event ) {
			var panel = event.data[ 0 ];
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
		});

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
 * <strong>Note:</strong> For each of the defined skin parts must have
 * the corresponding CSS file with the same name as UA inside of
 * the skin directory.
 *
 * @name CKEDITOR.skin.uaParts
 */

/**
 * A function that support the chameleon (skin color switch) feature, providing
 * the skin colors styles update to be apply in runtime.
 * <strong>Note:</strong> the embedded "$color" variable is to be substituted by a concrete UI color.
 *
 * @function CKEDITOR.skin.chameleon
 * @param {String} editor The editor instance upon color changes impact.
 * @param {String} part Name of the skin part where the color changes take place.
 */
