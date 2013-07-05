/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

(function() {
	var floatSpaceTpl = CKEDITOR.addTemplate( 'floatcontainer', '<div' +
		' id="cke_{name}"' +
		' class="cke {id} cke_reset_all cke_chrome cke_editor_{name} cke_float cke_{langDir} ' + CKEDITOR.env.cssClass + '"' +
		' dir="{langDir}"' +
		' title="' + ( CKEDITOR.env.gecko ? ' ' : '' ) + '"' +
		' lang="{langCode}"' +
		' role="application"' +
		' style="{style}"' +
		'>' +
			'<div class="cke_inner">' +
				'<div id="{topId}" class="cke_top" role="presentation">{content}</div>' +
			'</div>' +
		'</div>' );

	CKEDITOR.plugins.add( 'floatingspace', {
		init: function( editor ) {
			// Add listener with lower priority than that in themedui creator.
			// Thereby floatingspace will be created only if themedui wasn't used.
			editor.on( 'loaded', function() {
				attach( editor );
			}, null, null, 20 );
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

				var editable = editor.editable();
				// #10112 Do not fail on editable-less editor.
				if ( !editable )
					return;

				// Show up the space on focus gain.
				evt.name == 'focus' && floatSpace.show();

				// Reset the horizontal position for below measurement.
				floatSpace.removeStyle( 'left' );
				floatSpace.removeStyle( 'right' );

				// Compute the screen position from the TextRectangle object would
				// be very simple, even though the "width"/"height" property is not
				// available for all, it's safe to figure that out from the rest.

				// http://help.dottoro.com/ljgupwlp.php
				var spaceRect = floatSpace.getClientRect(),
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

				var viewRect = win.getViewPaneSize();
				var mid = viewRect.width / 2;
				var alignSide =
							( editorRect.left > 0 && editorRect.right < viewRect.width &&
								editorRect.width > spaceRect.width ) ?
							( editor.config.contentsLangDirection == 'rtl' ? 'right' : 'left' ) :
							( mid - editorRect.left > editorRect.right - mid ? 'left' :
							 'right' ),
					offset;

				// (#9769) If viewport width is less than space width,
				// make sure space never cross the left boundary of the viewport.
				// In other words: top-left corner of the space is always visible.
				if ( spaceRect.width > viewRect.width ) {
					alignSide = 'left';
					offset = 0;
				}
				else {
					if ( alignSide == 'left' ) {
						// If the space rect fits into viewport, align it
						// to the left edge of editor:
						//
						// +------------------------ Viewport -+
						// |                                   |
						// |   +------------- Space -+         |
						// |   |                     |         |
						// |   +---------------------+         |
						// |   +------------------ Editor -+   |
						// |   |                           |   |
						//
						if ( editorRect.left > 0 )
							offset = editorRect.left;

						// If the left part of the editor is cut off by the left
						// edge of the viewport, stick the space to the viewport:
						//
						//       +------------------------ Viewport -+
						//       |                                   |
						//       +---------------- Space -+          |
						//       |                        |          |
						//       +------------------------+          |
						//  +----|------------- Editor -+            |
						//  |    |                      |            |
						//
						else
							offset = 0;
					}
					else {
						// If the space rect fits into viewport, align it
						// to the right edge of editor:
						//
						// +------------------------ Viewport -+
						// |                                   |
						// |         +------------- Space -+   |
						// |         |                     |   |
						// |         +---------------------+   |
						// |   +------------------ Editor -+   |
						// |   |                           |   |
						//
						if ( editorRect.right < viewRect.width )
							offset = viewRect.width - editorRect.right;

						// If the right part of the editor is cut off by the right
						// edge of the viewport, stick the space to the viewport:
						//
						// +------------------------ Viewport -+
						// |                                   |
						// |             +------------- Space -+
						// |             |                     |
						// |             +---------------------+
						// |                 +-----------------|- Editor -+
						// |                 |                 |          |
						//
						else
							offset = 0;
					}

					// (#9769) Finally, stick the space to the opposite side of
					// the viewport when it's cut off horizontally on the left/right
					// side like below.
					//
					// This trick reveals cut off space in some edge cases and
					// hence it improves accessibility.
					//
					// +------------------------ Viewport -+
					// |                                   |
					// |              +--------------------|-- Space -+
					// |              |                    |          |
					// |              +--------------------|----------+
					// |              +------- Editor -+   |
					// |              |                |   |
					//
					//				becomes:
					//
					// +------------------------ Viewport -+
					// |                                   |
					// |   +----------------------- Space -+
					// |   |                               |
					// |   +-------------------------------+
					// |              +------- Editor -+   |
					// |              |                |   |
					//
					if ( offset + spaceRect.width > viewRect.width ) {
						alignSide = alignSide == 'left' ? 'right' : 'left';
						offset = 0;
					}
				}

				// Pin mode is fixed, so don't include scroll-x.
				// (#9903) For mode is "top" or "bottom", add opposite scroll-x for right-aligned space.
				var scroll = mode == 'pin' ? 0 : alignSide == 'left' ? pageScrollX : -pageScrollX;

				floatSpace.setStyle( alignSide, pixelate( ( mode == 'pin' ? pinnedOffsetX : dockedOffsetX ) + offset + scroll ) );
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

			// Prevent clicking on non-buttons area of the space from blurring editor.
			floatSpace.on( 'mousedown', function( evt ) {
				evt = evt.data;
				if ( !evt.getTarget().hasAscendant( 'a', 1 ) )
					evt.preventDefault();
			});

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
 *		config.floatSpaceDockedOffsetY = 10;
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
 * @cfg {Number} [floatSpacePinnedOffsetX=0]
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
