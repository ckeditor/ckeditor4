/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

(function() {
	var floatSpaceTpl = CKEDITOR.addTemplate( 'floatcontainer', '<div' +
		' id="cke_{name}"' +
		' class="cke {id} cke_reset_all cke_chrome cke_editor_{name} cke_float cke_{langDir} ' + CKEDITOR.env.cssClass + '"' +
		' dir="{langDir}"' +
		' title="' + ( CKEDITOR.env.gecko ? ' ' : '' ) + '"' +
		' lang="{langCode}"' +
		' role="presentation"' +
		' style="{style}"' +
		'>' +
			'<div class="cke_inner">' +
				'<div id="{topId}" class="cke_top" role="presentation">{content}</div>' +
			'</div>' +
		'</div>' );

	CKEDITOR.plugins.add( 'floatingspace', {
		init: function( editor ) {
			editor.on( 'contentDom', function() {
				attach( editor );
			});
		}
	});

	var win = CKEDITOR.document.getWindow();
	var pixelate = CKEDITOR.tools.cssLength;

	function scrollOffset( side ) {
		var pageOffset = side == 'left' ? 'pageXOffset' : 'pageYOffset',
			docScrollOffset = side == 'left' ? 'scrollLeft' : 'scrollTop';
		return ( pageOffset in win.$ ) ? win.$[ pageOffset ] : CKEDITOR.document.$.documentElement[ docScrollOffset ];
	}

	function attach( editor ) {
		// Indicates the vertical aligning mode.
		var mode;

		// Allow minor adjustments of the float space from custom configs.
		var config = editor.config;
		var dockedOffsetX = config.floatSpaceDockedOffsetX || 0,
			dockedOffsetY = config.floatSpaceDockedOffsetY || 0,
			pinnedOffsetX = config.floatSpacePinnedOffsetX || 0,
			pinnedOffsetY = config.floatSpacePinnedOffsetY || 0;

		var layout = function( evt ) {
				// Update the float space position.
				function updatePos( pos, prop, val ) {
					floatSpace.setStyle( prop, pixelate( val ) );
					floatSpace.setStyle( 'position', pos );
				}

				// Change the current mode and update float space position accordingly.
				function changeMode( newMode ) {
					var editorPos = editable.getDocumentPosition();
					switch ( newMode ) {
						case 'top':
							updatePos( 'absolute', 'top', editorPos.y - spaceHeight - dockedOffsetY );
							break;
						case 'pin':
							updatePos( 'fixed', 'top', pinnedOffsetY );
							break;
						case 'bottom':
							updatePos( 'absolute', 'top', editorPos.y + ( editorRect.height || editorRect.bottom - editorRect.top ) + dockedOffsetY );
							break;
					}

					mode = newMode;
				}

				// Show up the space on focus gain.
				evt.name == 'focus' && floatSpace.show();

				// Resize is not required when scrolling.
				var resize = evt.name != 'scroll';
				if ( resize ) {
					// Reset the horizontal position for below measurement.
					floatSpace.removeStyle( 'left' );
					floatSpace.removeStyle( 'right' );
				}

				// Compute the screen position from the TextRectangle object would
				// be very simple, even though the "width"/"height" property is not
				// available for all, it's safe to figure that out from the rest.

				// http://help.dottoro.com/ljgupwlp.php
				var editable = editor.editable(),
					spaceRect = floatSpace.getClientRect(),
					editorRect = editable.getClientRect(),
					spaceHeight = spaceRect.height,
					pageScrollX = scrollOffset( 'left' );

				// We initialize it as pin mode.
				if ( !mode ) {
					mode = 'pin';
					changeMode( 'pin' );
					// Call for a refresh to the actual layout.
					layout( evt );
					return;
				}
				// Pin the space element while page scrolls down to pull it off the view port.
				else if ( mode == 'top' && spaceRect.top < pinnedOffsetY )
					changeMode( 'pin' );
				else if ( mode == 'pin' ) {
					// Restore into docked top from pin.
					if ( editorRect.top > dockedOffsetY + spaceHeight )
						changeMode( 'top' );
					// Docked the space below editable when page scrolls down and the space masks
					// the final few lines of the content.
					else if ( editorRect.bottom - spaceRect.bottom < spaceHeight )
						changeMode( 'bottom' );
				} else if ( mode == 'bottom' ) {
					// Jump to top mode. ( with pin mode skipped)
					if ( editorRect.top > dockedOffsetY + spaceHeight )
						changeMode( 'top' );
					// Restore into pin mode from docked bottom.
					else if ( editorRect.bottom > 2 * spaceHeight + pinnedOffsetY )
						changeMode( 'pin' );
				}

				if ( resize ) {
					var viewRect = win.getViewPaneSize();
					var mid = viewRect.width / 2;
					var alignSide = ( editorRect.left > 0 && editorRect.right < viewRect.width && editorRect.width > spaceRect.width ) ? ( editor.lang.dir == 'rtl' ? 'right' : 'left' ) : ( mid - editorRect.left > editorRect.right - mid ? 'left' : 'right' );

					// Horizontally aligned with editable or view port left otherwise right boundary.
					var newLeft = alignSide == 'left' ? ( editorRect.left > 0 ? editorRect.left : 0 ) : ( editorRect.right < viewRect.width ? viewRect.width - editorRect.right : 0 );

					floatSpace.setStyle( alignSide, pixelate( ( mode == 'pin' ? pinnedOffsetX : dockedOffsetX ) + newLeft + pageScrollX ) );
				}
			};

		var body = CKEDITOR.document.getBody();


		var vars = {
			id : editor.id,
			name: editor.name,
			langDir: editor.lang.dir,
			langCode: editor.langCode
		};

		// Get the HTML for the predefined spaces.
		var topHtml = editor.fire( 'uiSpace', { space: 'top', html: '' } ).html;
		if ( topHtml ) {
			var floatSpace = body.append( CKEDITOR.dom.element.createFromHtml( floatSpaceTpl.output( CKEDITOR.tools.extend({
				topId: editor.ui.spaceId( 'top' ),
				content: topHtml,
				style: 'display:none;z-index:' + ( editor.config.baseFloatZIndex - 1 )
			}, vars ) ) ) );

			// There's no need for the floatSpace to be selectable.
			floatSpace.unselectable();

			editor.on( 'focus', function( evt ) {
				layout( evt );
				win.on( 'scroll', layout );
				win.on( 'resize', layout );
			});

			editor.on( 'blur', function() {
				floatSpace.hide();
				win.removeListener( 'scroll', layout );
				win.removeListener( 'resize', layout );
			});

			editor.on( 'destroy', function() {
				win.removeListener( 'scroll', layout );
				win.removeListener( 'resize', layout );
				floatSpace.clearCustomData();
				floatSpace.remove();
			});

			// Handle initial focus.
			if ( editor.focusManager.hasFocus )
				floatSpace.show();

			// Register this UI space to the focus manager.
			editor.focusManager.add( floatSpace, 1 );
		}
	}

})();

/**
 * Along with {@link #floatSpaceDockedOffsetY} it defines the
 * amount of offset (in pixels) between float space and the editable left/right
 * boundaries when space element is docked at either side of the editable.
 *
 *		config.floatSpaceDockedOffsetX = 10;
 *
 * @cfg {Number} [floatSpaceDockedOffsetX=0]
 * @member CKEDITOR.config
 */

/**
 * Along with {@link #floatSpaceDockedOffsetX} it defines the
 * amount of offset (in pixels) between float space and the editable top/bottom
 * boundaries when space element is docked at either side of the editable.
 *
 * config.floatSpaceDockedOffsetY = 10;
 *
 * @cfg {Number} [floatSpaceDockedOffsetY=0]
 * @member CKEDITOR.config
 */

/**
 * Along with {@link #floatSpacePinnedOffsetY} it defines the
 * amount of offset (in pixels) between float space and the view port boundaries
 * when space element is pinned.
 *
 *		config.floatSpacePinnedOffsetX = 20;
 *
 * @cfg {Number} [floatSpacePinnedOffsetX=10]
 * @member CKEDITOR.config
 */

/**
 * Along with {@link #floatSpacePinnedOffsetX} it defines the
 * amount of offset (in pixels) between float space and the view port boundaries
 * when space element is pinned.
 *
 *		config.floatSpacePinnedOffsetY = 20;
 *
 * @cfg {Number} [floatSpacePinnedOffsetY=0]
 * @member CKEDITOR.config
 */
