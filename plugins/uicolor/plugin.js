/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/ ( function() {
	CKEDITOR.plugins.add( 'uicolor', {
		requires: [ 'dialog' ],
		lang: [ 'en', 'he' ],

		init: function( editor ) {
			if ( CKEDITOR.env.ie6Compat )
				return;

			editor.addCommand( 'uicolor', new CKEDITOR.dialogCommand( 'uicolor' ) );
			editor.ui.addButton( 'UIColor', {
				label: editor.lang.uicolor.title,
				command: 'uicolor',
				icon: this.path + 'uicolor.gif'
			});
			CKEDITOR.dialog.add( 'uicolor', this.path + 'dialogs/uicolor.js' );

			// Load YUI js files.
			CKEDITOR.scriptLoader.load( CKEDITOR.getUrl( 'plugins/uicolor/yui/yui.js' ) );

			// Load YUI css files.
			editor.element.getDocument().appendStyleSheet( CKEDITOR.getUrl( 'plugins/uicolor/yui/assets/yui.css' ) );

			editor.on( 'menuShow', function( event ) {
				var panel = event.data[ 0 ];
				var iframe = panel.element.getElementsByTag( 'iframe' ).getItem( 0 ).getFrameDocument();

				// Add stylesheet if missing.
				if ( !iframe.getById( 'cke_ui_color' ) ) {
					var node = getStylesheet( iframe );
					uiColorMenus.push( node );

					var color = editor.getUiColor();
					// Set uiColor for new menu.
					if ( color )
						updateStylesheets( [ node ], uiColorMenuCss, [ [ uiColorRegexp, color ] ] );
				}
			});

			// Apply UI color if specified in config.
			if ( editor.config.uiColor )
				editor.setUiColor( editor.config.uiColor );
		}
	});

	CKEDITOR.tools.extend( CKEDITOR.editor.prototype, {
		uiColor: null,

		getUiColor: function() {
			return this.uiColor;
		},

		setUiColor: function( color ) {
			var cssContent,
				uiStyle = getStylesheet( CKEDITOR.document ),
				cssId = '.' + this.id;

			var cssSelectors = [
				cssId + " .cke_wrapper",
				cssId + "_dialog .cke_dialog_contents",
				cssId + "_dialog a.cke_dialog_tab",
				cssId + "_dialog .cke_dialog_footer"
				].join( ',' );
			var cssProperties = "background-color: $color !important;";

			if ( CKEDITOR.env.webkit )
				cssContent = [ [ cssSelectors, cssProperties ] ];
			else
				cssContent = cssSelectors + '{' + cssProperties + '}';

			return ( this.setUiColor = function( color ) {
				var replace = [ [ uiColorRegexp, color ] ];
				this.uiColor = color;

				// Update general style.
				updateStylesheets( [ uiStyle ], cssContent, replace );

				// Update menu styles.
				updateStylesheets( uiColorMenus, uiColorMenuCss, replace );
			})( color );
		}
	});

	var uiColorStylesheetId = 'cke_ui_color',
		uiColorMenus = [],
		uiColorRegexp = /\$color/g;

	var uiColorMenuCss = ".cke_menuitem .cke_icon_wrapper\
	{\
	background-color: $color !important;\
	border-color: $color !important;\
	}\
	\
	.cke_menuitem a:hover .cke_icon_wrapper,\
	.cke_menuitem a:focus .cke_icon_wrapper,\
	.cke_menuitem a:active .cke_icon_wrapper\
	{\
	background-color: $color !important;\
	border-color: $color !important;\
	}\
	\
	.cke_menuitem a:hover .cke_label,\
	.cke_menuitem a:focus .cke_label,\
	.cke_menuitem a:active .cke_label\
	{\
	background-color: $color !important;\
	}\
	\
	.cke_menuitem a.cke_disabled:hover .cke_label,\
	.cke_menuitem a.cke_disabled:focus .cke_label,\
	.cke_menuitem a.cke_disabled:active .cke_label\
	{\
	background-color: transparent !important;\
	}\
	\
	.cke_menuitem a.cke_disabled:hover .cke_icon_wrapper,\
	.cke_menuitem a.cke_disabled:focus .cke_icon_wrapper,\
	.cke_menuitem a.cke_disabled:active .cke_icon_wrapper\
	{\
	background-color: $color !important;\
	border-color: $color !important;\
	}\
	\
	.cke_menuitem a.cke_disabled .cke_icon_wrapper\
	{\
	background-color: $color !important;\
	border-color: $color !important;\
	}\
	\
	.cke_menuseparator\
	{\
	background-color: $color !important;\
	}\
	\
	.cke_menuitem a:hover,\
	.cke_menuitem a:focus,\
	.cke_menuitem a:active\
	{\
	background-color: $color !important;\
	}";

	// We have to split CSS declarations for webkit.
	if ( CKEDITOR.env.webkit ) {
		uiColorMenuCss = uiColorMenuCss.split( '}' ).slice( 0, -1 );
		for ( var i = 0; i < uiColorMenuCss.length; i++ )
			uiColorMenuCss[ i ] = uiColorMenuCss[ i ].split( '{' );
	}

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

})();

/**
 * The base user interface color to be used by the editor. Not all skins are
 * compatible with this setting.
 * @name CKEDITOR.config.uiColor
 * @type String
 * @default '' (empty)
 * @example
 * // Using a color code.
 * config.uiColor = '#AADC6E';
 * @example
 * // Using an HTML color name.
 * config.uiColor = 'Gold';
 */
