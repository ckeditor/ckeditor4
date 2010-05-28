/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'resize', {
	init: function( editor ) {
		var config = editor.config;

		if ( config.resize_enabled ) {
			var container = null,
				origin, startSize,
				resizeHorizontal = ( config.resize_dir == 'both' || config.resize_dir == 'horizontal' ) && ( config.resize_minWidth != config.resize_maxWidth ),
				resizeVertical = ( config.resize_dir == 'both' || config.resize_dir == 'vertical' ) && ( config.resize_minHeight != config.resize_maxHeight );

			function dragHandler( evt ) {
				var dx = evt.data.$.screenX - origin.x,
					dy = evt.data.$.screenY - origin.y,
					width = startSize.width,
					height = startSize.height,
					internalWidth = width + dx * ( editor.lang.dir == 'rtl' ? -1 : 1 ),
					internalHeight = height + dy;

				if ( resizeHorizontal )
					width = Math.max( config.resize_minWidth, Math.min( internalWidth, config.resize_maxWidth ) );

				if ( resizeVertical )
					height = Math.max( config.resize_minHeight, Math.min( internalHeight, config.resize_maxHeight ) );

				editor.resize( width, height );
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
				if ( !container )
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

			editor.on( 'destroy', function() {
				CKEDITOR.tools.removeFunction( mouseDownFn );
			});

			editor.on( 'themeSpace', function( event ) {
				if ( event.data.space == 'bottom' ) {
					var direction = '';
					if ( resizeHorizontal && !resizeVertical )
						direction = ' cke_resizer_horizontal';
					if ( !resizeHorizontal && resizeVertical )
						direction = ' cke_resizer_vertical';

					event.data.html += '<div class="cke_resizer' + direction + '"' +
													' title="' + CKEDITOR.tools.htmlEncode( editor.lang.resize ) + '"' +
													' onmousedown="CKEDITOR.tools.callFunction(' + mouseDownFn + ', event)"' +
													'></div>';
				}
			}, editor, null, 100 );
		}
	}
});

/**
 * The minimum editor width, in pixels, when resizing it with the resize handle.
 * @type Number
 * @default 750
 * @example
 * config.resize_minWidth = 500;
 */
CKEDITOR.config.resize_minWidth = 750;

/**
 * The minimum editor height, in pixels, when resizing it with the resize handle.
 * @type Number
 * @default 250
 * @example
 * config.resize_minHeight = 600;
 */
CKEDITOR.config.resize_minHeight = 250;

/**
 * The maximum editor width, in pixels, when resizing it with the resize handle.
 * @type Number
 * @default 3000
 * @example
 * config.resize_maxWidth = 750;
 */
CKEDITOR.config.resize_maxWidth = 3000;

/**
 * The maximum editor height, in pixels, when resizing it with the resize handle.
 * @type Number
 * @default 3000
 * @example
 * config.resize_maxHeight = 600;
 */
CKEDITOR.config.resize_maxHeight = 3000;

/**
 * Whether to enable the resizing feature. If disabled the resize handler will not be visible.
 * @type Boolean
 * @default true
 * @example
 * config.resize_enabled = false;
 */
CKEDITOR.config.resize_enabled = true;

/**
 * The directions to which the editor resizing is enabled. Possible values
 * are "both", "vertical" and "horizontal".
 * @type String
 * @default 'both'
 * @since 3.3
 * @example
 * config.resize_dir = 'vertical';
 */
CKEDITOR.config.resize_dir = 'both';
