/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.skins.add( 'kama', ( function() {
	var preload = [];

	if ( CKEDITOR.env.ie && CKEDITOR.env.version < 7 ) {
		// For IE6, we need to preload some images, otherwhise they will be
		// downloaded several times (CSS background bug).
		preload.push( 'icons.png', 'images/sprites_ie6.png', 'images/dialog_sides.gif' );
	}

	return {
		preload: preload,
		editor: { css: [ 'editor.css' ] },
		dialog: { css: [ 'dialog.css' ] },
		templates: { css: [ 'templates.css' ] },
		margins: [ 0, 0, 0, 0 ],
		init: function( editor ) {
			var menuHead;

			function menuSetUiColor( color ) {
				if ( !menuHead )
					return null;

				var uiStyle = menuHead.append( 'style' );

				var cssSrc = "/* UI Color Support */\
.cke_skin_kama .cke_menuitem .cke_icon_wrapper\
{\
	background-color: $color !important;\
	border-color: $color !important;\
}\
\
.cke_skin_kama .cke_menuitem a:hover .cke_icon_wrapper,\
.cke_skin_kama .cke_menuitem a:focus .cke_icon_wrapper,\
.cke_skin_kama .cke_menuitem a:active .cke_icon_wrapper\
{\
	background-color: $color !important;\
	border-color: $color !important;\
}\
\
.cke_skin_kama .cke_menuitem a:hover .cke_label,\
.cke_skin_kama .cke_menuitem a:focus .cke_label,\
.cke_skin_kama .cke_menuitem a:active .cke_label\
{\
	background-color: $color !important;\
}\
\
.cke_skin_kama .cke_menuitem a.cke_disabled:hover .cke_label,\
.cke_skin_kama .cke_menuitem a.cke_disabled:focus .cke_label,\
.cke_skin_kama .cke_menuitem a.cke_disabled:active .cke_label\
{\
	background-color: transparent !important;\
}\
\
.cke_skin_kama .cke_menuitem a.cke_disabled:hover .cke_icon_wrapper,\
.cke_skin_kama .cke_menuitem a.cke_disabled:focus .cke_icon_wrapper,\
.cke_skin_kama .cke_menuitem a.cke_disabled:active .cke_icon_wrapper\
{\
	background-color: $color !important;\
	border-color: $color !important;\
}\
\
.cke_skin_kama .cke_menuitem a.cke_disabled .cke_icon_wrapper\
{\
	background-color: $color !important;\
	border-color: $color !important;\
}\
\
.cke_skin_kama .cke_menuseparator\
{\
	background-color: $color !important;\
}\
\
.cke_skin_kama .cke_menuitem a:hover,\
.cke_skin_kama .cke_menuitem a:focus,\
.cke_skin_kama .cke_menuitem a:active\
{\
	background-color: $color !important;\
}";

				uiStyle.setAttribute( "type", "text/css" );
				var regex = /\$color/g;

				// We have to split CSS declarations for webkit.
				if ( CKEDITOR.env.webkit ) {
					cssSrc = cssSrc.split( '}' ).slice( 0, -1 );
					for ( var i in cssSrc )
						cssSrc[ i ] = cssSrc[ i ].split( '{' );
				}

				return ( menuSetUiColor = function( color ) {
					if ( CKEDITOR.env.webkit ) {
						for ( var i in cssSrc )
							uiStyle.$.sheet.addRule( cssSrc[ i ][ 0 ], cssSrc[ i ][ 1 ].replace( regex, color ) );
					} else {
						var css = cssSrc.replace( regex, color );

						if ( CKEDITOR.env.ie )
							uiStyle.$.styleSheet.cssText = css;
						else
							uiStyle.setHtml( css );
					}
				})( color );
			}

			CKEDITOR.tools.extend( editor, {
				uiColor: null,

				getUiColor: function() {
					return this.uiColor;
				},

				setUiColor: function( color ) {
					var uiStyle = CKEDITOR.document.getHead().append( 'style' ),
						cssId = '#cke_' + editor.name.replace( '.', '\\.' );

					var cssSelectors = [
						cssId + " .cke_wrapper",
						cssId + "_dialog .cke_dialog_contents",
						cssId + "_dialog a.cke_dialog_tab",
						cssId + "_dialog .cke_dialog_footer"
						].join( ',' );
					var cssProperties = "background-color: $color !important;";

					uiStyle.setAttribute( "type", "text/css" );

					return ( this.setUiColor = function( color ) {
						var css = cssProperties.replace( '$color', color );
						editor.uiColor = color;

						if ( CKEDITOR.env.ie )
							uiStyle.$.styleSheet.cssText = cssSelectors + '{' + css + '}';
						else if ( CKEDITOR.env.webkit )
							uiStyle.$.sheet.addRule( cssSelectors, css );
						else
							uiStyle.setHtml( cssSelectors + '{' + css + '}' );

						menuSetUiColor( color );
					})( color );
				}
			});

			// If the "menu" plugin is loaded, register the listeners.
			if ( CKEDITOR.menu ) {
				var old = CKEDITOR.menu.prototype.show;

				CKEDITOR.menu.prototype.show = function() {
					old.apply( this, arguments );

					if ( !menuHead && editor == this.editor ) {
						// Save reference.
						menuHead = this._.element.getDocument().getHead();
						menuSetUiColor( editor.getUiColor() );
					}
				};
			}

			// Apply UI color if specified in config.
			if ( editor.config.uiColor )
				editor.setUiColor( editor.config.uiColor );

			// Fix editor's width. HPadding and 100% width iframe issue.
			//			if ( CKEDITOR.env.ie && CKEDITOR.env.quirks )
			//			{
			//				editor.on( 'mode', function( event )
			//				{
			//					var container = editor.getResizable();
			//					editor.resize( container.$.offsetWidth-10, container.$.offsetHeight );
			//					event.removeListener();
			//				});
			//			}

			//			if ( CKEDITOR.env.ie && ( CKEDITOR.env.quirks || CKEDITOR.env.version < 7 ) )
			//			{
			//				editor.on( 'themeLoaded', function( event )
			//				{
			//					var toolbars = editor.container.getChild( [0, 0, 0, 0, 0, 0, 0] ).getChildren();
			//					for ( var i = 0 ; i < toolbars.count() ; i++ )
			//					{
			//						var toolbar = toolbars.getItem( i );

			//						var last = toolbar.getLast();
			//						if ( !last || !last.getPrevious().hasClass( 'cke_rcombo' ) )
			//							continue;
			//
			//						last.addClass( 'cke_toolbar_end_last' );
			//					}
			//				});
			//			}
		}
	};
})() );

if ( CKEDITOR.dialog ) {
	CKEDITOR.dialog.on( 'resize', function( evt ) {
		var data = evt.data,
			width = data.width,
			height = data.height,
			dialog = data.dialog,
			standardsMode = !CKEDITOR.env.quirks;

		if ( data.skin != 'kama' )
			return;

		dialog.parts.contents.setStyles({
			width: width + 'px',
			height: height + 'px'
		});

		if ( !CKEDITOR.env.ie )
			return;

		// Fix the size of the elements which have flexible lengths.
		setTimeout( function() {
			var content = dialog.parts.contents,
				body = content.getParent(),
				innerDialog = body.getParent();

			// tc
			var el = innerDialog.getChild( 2 );
			el.setStyle( 'width', ( body.$.offsetWidth ) + 'px' );

			// bc
			el = innerDialog.getChild( 7 );
			el.setStyle( 'width', ( body.$.offsetWidth - 28 ) + 'px' );

			// ml
			el = innerDialog.getChild( 4 );
			el.setStyle( 'height', ( body.$.offsetHeight - 31 - 14 ) + 'px' );

			// mr
			el = innerDialog.getChild( 5 );
			el.setStyle( 'height', ( body.$.offsetHeight - 31 - 14 ) + 'px' );
		}, 100 );
	});
}
