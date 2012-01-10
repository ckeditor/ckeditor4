/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function() {
	CKEDITOR.plugins.add( 'floatingspace', {
		requires: [],

		init: function( editor ) {
			editor.on( 'loaded', function() {
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
							updatePos( 'absolute', 'top', editorPos.y - spaceHeight - dockedOffsetY, 'top' );
							break;
						case 'pin':
							updatePos( 'fixed', 'top', pinnedOffsetY, 'pin' );
							break;
						case 'bottom':
							updatePos( 'absolute', 'top', editorPos.y + ( editorRect.height || editorRect.bottom - editorRect.top ) + dockedOffsetY, 'bottom' );
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
					rect = floatSpace.$.getBoundingClientRect(),
					editorRect = editable.$.getBoundingClientRect(),
					spaceWidth = rect.width || rect.right - rect.left,
					spaceHeight = rect.height || rect.bottom - rect.top,
					pageScrollX = scrollOffset( 'left' );

				// Small amount of extra to avoid the "indecision moment".
				var buffer = 10;

				// We initialize it as pin mode.
				if ( !mode ) {
					mode = 'pin';
					changeMode( 'pin' );
					// Call for a refresh to the actual layout.
					layout( evt );
					return;
				}
				// Pin the space element while page scrolls down to pull it off the view port.
				else if ( mode == 'top' && rect.top < pinnedOffsetY - buffer )
					changeMode( 'pin' );
				else if ( mode == 'pin' ) {
					// Restore into docked top from pin.
					if ( editorRect.top > dockedOffsetY + spaceHeight )
						changeMode( 'top' );
					// Docked the space below editable when page scrolls down and the space masks
					// the final few lines of the content.
					else if ( editorRect.bottom - rect.bottom < spaceHeight )
						changeMode( 'bottom' );
				} else if ( mode == 'bottom' ) {
					// Jump to top mode. ( with pin mode skipped)
					if ( editorRect.top > dockedOffsetY + spaceHeight )
						changeMode( 'top' );
					// Restore into pin mode from docked bottom.
					else if ( editorRect.bottom > 2 * spaceHeight + pinnedOffsetY + buffer )
						changeMode( 'pin' );
				}

				if ( resize ) {
					var viewRect = win.getViewPaneSize();
					var mid = viewRect.width / 2;
					var alignSide = ( editorRect.left > 0 && editorRect.right < viewRect.width && editorRect.width > spaceWidth ) ? ( editor.lang.dir == 'rtl' ? 'right' : 'left' ) : ( mid - editorRect.left > editorRect.right - mid ? 'left' : 'right' );

					// Horizontally aligned with editable or view port left otherwise right boundary.
					var newLeft = alignSide == 'left' ? ( editorRect.left > 0 ? editorRect.left : 0 ) : ( editorRect.right < viewRect.width ? viewRect.width - editorRect.right : 0 );

					floatSpace.setStyle( alignSide, pixelate( ( mode == 'pin' ? pinnedOffsetX : dockedOffsetX ) + newLeft + pageScrollX ) );
				}
			};

		var body = CKEDITOR.document.getBody();

		var floatSpace,
			template = CKEDITOR.addTemplate( 'floatcontainer', '<div' +
			' id="' + editor.ui.spaceId( 'top' ) + '"' +
			' class="cke cke_chrome cke_editor_{name}"' +
			' dir="{langDir}"' +
			' title="' + ( CKEDITOR.env.gecko ? ' ' : '' ) + '"' +
			' lang="{langCode}"' +
			' role="presentation"' +
			' style="{style}"' +
			'>' +
				'<div class="' + CKEDITOR.env.cssClass + '" role="presentation">' +
					'<div class="cke_' + editor.lang.dir + '" role="presentation">' +
						'<div class="cke_inner">' +
							'<div class="cke_contents" role="presentation">{content}</div>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>' );

		var vars = {
			langDir: editor.lang.dir,
			langCode: editor.langCode,
			'z-index': editor.config.baseFloatZIndex - 1
		};

		// Get the HTML for the predefined spaces.
		var topHtml = editor.fire( 'uiSpace', { space: 'top', html: '' } ).html;
		if ( topHtml ) {
			floatSpace = body.append( CKEDITOR.dom.element.createFromHtml( template.output( CKEDITOR.tools.extend({
				content: topHtml,
				style: 'display:none;'
			}, vars ) ) ) );

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
		}
	}

})();

/**
 * Along with {@link CKEDITOR.config.floatSpaceDockedOffsetY} it defines the
 * amount of offset (in pixels) between float space and the editable left/right
 * boundaries when space element is docked at either side of the editable.
 * @name CKEDITOR.config.floatSpaceDockedOffsetX
 * @type Number
 * @default 0
 * @example
 * config.floatSpaceDockedOffsetX = 10;
 */

/**
 * Along with {@link CKEDITOR.config.floatSpaceDockedOffsetX} it defines the
 * amount of offset (in pixels) between float space and the editable top/bottom
 * boundaries when space element is docked at either side of the editable.
 * @name CKEDITOR.config.floatSpaceDockedOffsetY
 * @type Number
 * @default 0
 * @example
 * config.floatSpaceDockedOffsetY = 10;
 */

/**
 * Along with {@link CKEDITOR.config.floatSpacePinnedOffsetY} it defines the
 * amount of offset (in pixels) between float space and the view port boundaries
 * when space element is pinned.
 * @name CKEDITOR.config.floatSpacePinnedOffsetX
 * @type Number
 * @default 10
 * @example
 * config.floatSpacePinnedOffsetX = 20;
 */

/**
 * Along with {@link CKEDITOR.config.floatSpacePinnedOffsetX} it defines the
 * amount of offset (in pixels) between float space and the view port boundaries
 * when space element is pinned.
 * @name CKEDITOR.config.floatSpacePinnedOffsetY
 * @type Number
 * @default 0
 * @example
 * config.floatSpacePinnedOffsetY = 20;
 */
