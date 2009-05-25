/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'resize', {
	init: function( editor ) {
		var config = editor.config;

		if ( config.resize_enabled ) {
			var container = null;
			var origin, startSize;

			function dragHandler( evt ) {
				var dx = evt.data.$.screenX - origin.x;
				var dy = evt.data.$.screenY - origin.y;
				var internalWidth = startSize.width + dx * ( editor.lang.dir == 'rtl' ? -1 : 1 );
				var internalHeight = startSize.height + dy;

				editor.resize( Math.max( config.resize_minWidth, Math.min( internalWidth, config.resize_maxWidth ) ), Math.max( config.resize_minHeight, Math.min( internalHeight, config.resize_maxHeight ) ) );
			}

			function dragEndHandler( evt ) {
				CKEDITOR.document.removeListener( 'mousemove', dragHandler );
				CKEDITOR.document.removeListener( 'mouseup', dragEndHandler );

				if ( editor.document ) {
					editor.document.removeListener( 'mousemove', dragHandler );
					editor.document.removeListener( 'mouseup', dragEndHandler );
				}
			}

			var mouseDownFn = CKEDITOR.tools.addFunction( function( $event ) {
				if ( container == null )
					container = editor.getResizable();

				startSize = { width: container.$.offsetWidth || 0, height: container.$.offsetHeight || 0 };
				origin = { x: $event.screenX, y: $event.screenY };

				CKEDITOR.document.on( 'mousemove', dragHandler );
				CKEDITOR.document.on( 'mouseup', dragEndHandler );

				if ( editor.document ) {
					editor.document.on( 'mousemove', dragHandler );
					editor.document.on( 'mouseup', dragEndHandler );
				}
			});

			editor.on( 'themeSpace', function( event ) {
				if ( event.data.space == 'bottom' ) {
					event.data.html += '<div class="cke_resizer"' +
						' title="' + CKEDITOR.tools.htmlEncode( editor.lang.resize ) + '"' +
						' onmousedown="CKEDITOR.tools.callFunction(' + mouseDownFn + ', event)"' +
						'></div>';
				}
			}, editor, null, 100 );
		}
	}
});

CKEDITOR.config.resize_minWidth = 750;
CKEDITOR.config.resize_minHeight = 250;
CKEDITOR.config.resize_maxWidth = 3000;
CKEDITOR.config.resize_maxHeight = 3000;
CKEDITOR.config.resize_enabled = true;
