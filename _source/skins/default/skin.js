/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.skins.add( 'default', ( function() {
	var preload = [];
	var dialogJs = [];

	if ( CKEDITOR.env.ie && CKEDITOR.env.version <= 6 ) {
		// For IE6, we need to preload some images, otherwhise they will be
		// downloaded several times (CSS background bug).
		preload.push( 'icons.gif', 'images/sprites.gif', 'images/dialog.sides.gif' );

		// The dialog must be fixed by code in IE6, as it doesn't support
		// several CSS features (absolute positioning).
		// dialogJs.push( 'dialog_ie6.js' );
	}

	return {
		preload: preload,
		editor: { css: [ 'editor.css' ] },
		dialog: { css: [ 'dialog.css' ], js: dialogJs }
	};
})() );

(function() {
	// Define the function for resizing dialog parts at load to speed up
	// the actual resize operation.
	var skinName = 'default',
		setSize = function( dialog, partName, width, height ) {
			var element = partName ? dialog.parts[ partName ] : dialog._.element.getFirst();
			if ( width )
				element.setStyle( 'width', width + 'px' );
			if ( height )
				element.setStyle( 'height', height + 'px' );
		};

	CKEDITOR.dialog.setMargins( 0, 14, 18, 14 );

	CKEDITOR.dialog.on( 'resize', function( evt ) {
		var data = evt.data,
			width = data.width,
			height = data.height,
			dialog = data.dialog,
			standardsMode = ( CKEDITOR.document.$.compatMode == 'CSS1Compat' );
		if ( data.skin != skinName )
			return;

		// Dialog parts dimensions.
		//  16x16  |  ?x16  |  16x16
		//  16x?   |  ?x?   |  16x?
		//  30x51  |  ?x51  |  30x51
		setSize( dialog, 't', width - 32, 16 );
		setSize( dialog, 't_resize', width - 32, null );
		setSize( dialog, 'l', 16, height - 67 );
		setSize( dialog, 'l_resize', null, height - 22 );
		setSize( dialog, 'c', width - 32, height - 67 );
		setSize( dialog, 'r', 16, height - 67 );
		setSize( dialog, 'r_resize', null, height - 22 );
		setSize( dialog, 'b', width - 60, 51 );
		setSize( dialog, 'b_resize', width - 32, null );
		setSize( dialog, 'tabs_table', width - 32, null );

		/*
		 * Although the following fix seems to be for IE6 only, it's also for IE7.
		 * While IE7 can render DIV nodes with left: and right: defined, it cannot
		 * put 100% height TABLES correctly inside those DIVs. Unless the width is
		 * set as well.
		 */
		if ( CKEDITOR.env.ie ) {
			var contentWidth = width - 34,
				contentHeight = dialog.getPageCount() > 1 ? height - 106 : height - 84,
				contentsLength = dialog.parts.contents.getChildCount();

			if ( !standardsMode ) {
				contentWidth += 2;
				contentHeight += 2;
				dialog.parts.tabs.setStyle( 'top', '33px' );
			}

			setSize( dialog, 'title', standardsMode ? width - 52 : width - 32, standardsMode ? null : 31 );
			setSize( dialog, 'contents', contentWidth, contentHeight );
			setSize( dialog, 'footer', width - 32 );

			for ( var i = 0; i < contentsLength; i++ ) {
				var child = dialog.parts.contents.getChild( i );
				if ( ( child instanceof CKEDITOR.dom.element ) && ( child.$.className || '' ).search( 'cke_dialog_page_contents' ) > -1 )
					child.setStyles({
					width: contentWidth - ( standardsMode ? 20 : 0 ) + 'px',
					height: contentHeight - ( standardsMode ? 20 : 0 ) + 'px'
				});
			}
		}

		setSize( dialog, null, width, height );
	});
})();
