/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

( function() {
	var win = CKEDITOR.document.getWindow(),
		pixelate = CKEDITOR.tools.cssLength;

	CKEDITOR.plugins.add( 'floatingspace', {
		init: function( editor ) {
			// Add listener with lower priority than that in themedui creator.
			// Thereby floatingspace will be created only if themedui wasn't used.
			editor.on( 'loaded', function() {
				attach( this );
			}, null, null, 20 );
		}
	} );

	function scrollOffset( side ) {
		var pageOffset = side == 'left' ? 'pageXOffset' : 'pageYOffset',
			docScrollOffset = side == 'left' ? 'scrollLeft' : 'scrollTop';

		return ( pageOffset in win.$ ) ? win.$[ pageOffset ] : CKEDITOR.document.$.documentElement[ docScrollOffset ];
	}

	function attach( editor ) {
		var config = editor.config,

			// Get the HTML for the predefined spaces.
			topHtml = editor.fire( 'uiSpace', { space: 'top', html: '' } ).html,

			// Re-positioning of the space.
			layout = ( function() {
				// Mode indicates the vertical aligning mode.
				var mode, editable,
					spaceRect, editorRect, viewRect, spaceHeight, pageScrollX,

					// Allow minor adjustments of the float space from custom configs.
					dockedOffsetX = config.floatSpaceDockedOffsetX || 0,
					dockedOffsetY = config.floatSpaceDockedOffsetY || 0,
					pinnedOffsetX = config.floatSpacePinnedOffsetX || 0,
					pinnedOffsetY = config.floatSpacePinnedOffsetY || 0;

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

				return function( evt ) {
					// https://dev.ckeditor.com/ticket/10112 Do not fail on editable-less editor.
					if ( !( editable = editor.editable() ) )
						return;

					var show = ( evt && evt.name == 'focus' );

					// Show up the space on focus gain.
					if ( show ) {
						floatSpace.show();
					}

					editor.fire( 'floatingSpaceLayout', { show: show } );

					// Reset the horizontal position for below measurement.
					floatSpace.removeStyle( 'left' );
					floatSpace.removeStyle( 'right' );

					// Compute the screen position from the TextRectangle object would
					// be very simple, even though the "width"/"height" property is not
					// available for all, it's safe to figure that out from the rest.

					// http://help.dottoro.com/ljgupwlp.php
					spaceRect = floatSpace.getClientRect();
					editorRect = editable.getClientRect();
					viewRect = win.getViewPaneSize();
					spaceHeight = spaceRect.height;
					pageScrollX = scrollOffset( 'left' );

					// We initialize it as pin mode.
					if ( !mode ) {
						mode = 'pin';
						changeMode( 'pin' );
						// Call for a refresh to the actual layout.
						layout( evt );
						return;
					}

					// +------------------------ Viewport -+ \
					// |                                   |  |-> floatSpaceDockedOffsetY
					// | ................................. | /
					// |                                   |
					// |   +------ Space -+                |
					// |   |              |                |
					// |   +--------------+                |
					// |   +------------------ Editor -+   |
					// |   |                           |   |
					//
					if ( spaceHeight + dockedOffsetY <= editorRect.top )
						changeMode( 'top' );

					//     +- - - - - - - - -  Editor -+
					//     |                           |
					// +------------------------ Viewport -+ \
					// |   |                           |   |  |-> floatSpacePinnedOffsetY
					// | ................................. | /
					// |   +------ Space -+            |   |
					// |   |              |            |   |
					// |   +--------------+            |   |
					// |   |                           |   |
					// |   +---------------------------+   |
					// +-----------------------------------+
					//
					else if ( spaceHeight + dockedOffsetY > viewRect.height - editorRect.bottom )
						changeMode( 'pin' );

					//     +- - - - - - - - -  Editor -+
					//     |                           |
					// +------------------------ Viewport -+ \
					// |   |                           |   |  |-> floatSpacePinnedOffsetY
					// | ................................. | /
					// |   |                           |   |
					// |   |                           |   |
					// |   +---------------------------+   |
					// |   +------ Space -+                |
					// |   |              |                |
					// |   +--------------+                |
					//
					else
						changeMode( 'bottom' );

					var mid = viewRect.width / 2,
						alignSide, offset;

					if ( config.floatSpacePreferRight ) {
						alignSide = 'right';
					} else if ( editorRect.left > 0 && editorRect.right < viewRect.width && editorRect.width > spaceRect.width ) {
						alignSide = config.contentsLangDirection == 'rtl' ? 'right' : 'left';
					} else {
						alignSide = mid - editorRect.left > editorRect.right - mid ? 'left' : 'right';
					}

					// (https://dev.ckeditor.com/ticket/9769) If viewport width is less than space width,
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

						// (https://dev.ckeditor.com/ticket/9769) Finally, stick the space to the opposite side of
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
					// (https://dev.ckeditor.com/ticket/9903) For mode is "top" or "bottom", add opposite scroll-x for right-aligned space.
					var scroll = mode == 'pin' ? 0 : alignSide == 'left' ? pageScrollX : -pageScrollX;

					floatSpace.setStyle( alignSide, pixelate( ( mode == 'pin' ? pinnedOffsetX : dockedOffsetX ) + offset + scroll ) );
				};
			} )();

		if ( topHtml ) {
			var floatSpaceTpl = new CKEDITOR.template(
				'<div' +
					' id="cke_{name}"' +
					' class="cke {id} cke_reset_all cke_chrome cke_editor_{name} cke_float cke_{langDir} ' + CKEDITOR.env.cssClass + '"' +
					' dir="{langDir}"' +
					' title="' + ( CKEDITOR.env.gecko ? ' ' : '' ) + '"' +
					' lang="{langCode}"' +
					' role="application"' +
					' style="{style}"' +
					( editor.applicationTitle ? ' aria-labelledby="cke_{name}_arialbl"' : ' ' ) +
					'>' +
					( editor.applicationTitle ? '<span id="cke_{name}_arialbl" class="cke_voice_label">{voiceLabel}</span>' : ' ' ) +
					'<div class="cke_inner">' +
						'<div id="{topId}" class="cke_top" role="presentation">{content}</div>' +
					'</div>' +
				'</div>' ),
				floatSpace = CKEDITOR.document.getBody().append( CKEDITOR.dom.element.createFromHtml( floatSpaceTpl.output( {
					content: topHtml,
					id: editor.id,
					langDir: editor.lang.dir,
					langCode: editor.langCode,
					name: editor.name,
					style: 'display:none;z-index:' + ( config.baseFloatZIndex - 1 ),
					topId: editor.ui.spaceId( 'top' ),
					voiceLabel: editor.applicationTitle
				} ) ) ),

				// Use event buffers to reduce CPU load when tons of events are fired.
				changeBuffer = CKEDITOR.tools.eventsBuffer( 500, layout ),
				uiBuffer = CKEDITOR.tools.eventsBuffer( 100, layout );

			// There's no need for the floatSpace to be selectable.
			floatSpace.unselectable();

			// Prevent clicking on non-buttons area of the space from blurring editor.
			floatSpace.on( 'mousedown', function( evt ) {
				evt = evt.data;
				if ( !evt.getTarget().hasAscendant( 'a', 1 ) )
					evt.preventDefault();
			} );

			editor.on( 'focus', function( evt ) {
				layout( evt );
				editor.on( 'change', changeBuffer.input );
				win.on( 'scroll', uiBuffer.input );
				win.on( 'resize', uiBuffer.input );
			} );

			editor.on( 'blur', function() {
				floatSpace.hide();
				editor.removeListener( 'change', changeBuffer.input );
				win.removeListener( 'scroll', uiBuffer.input );
				win.removeListener( 'resize', uiBuffer.input );
			} );

			editor.on( 'destroy', function() {
				win.removeListener( 'scroll', uiBuffer.input );
				win.removeListener( 'resize', uiBuffer.input );
				floatSpace.clearCustomData();
				floatSpace.remove();
			} );

			// Handle initial focus.
			if ( editor.focusManager.hasFocus )
				floatSpace.show();

			// Register this UI space to the focus manager.
			editor.focusManager.add( floatSpace, 1 );
		}
	}
} )();

/**
 * Along with {@link #floatSpaceDockedOffsetY} it defines the
 * amount of offset (in pixels) between the float space and the editable left/right
 * boundaries when the space element is docked on either side of the editable.
 *
 *		config.floatSpaceDockedOffsetX = 10;
 *
 * @cfg {Number} [floatSpaceDockedOffsetX=0]
 * @member CKEDITOR.config
 */

/**
 * Along with {@link #floatSpaceDockedOffsetX} it defines the
 * amount of offset (in pixels) between the float space and the editable top/bottom
 * boundaries when the space element is docked on either side of the editable.
 *
 *		config.floatSpaceDockedOffsetY = 10;
 *
 * @cfg {Number} [floatSpaceDockedOffsetY=0]
 * @member CKEDITOR.config
 */

/**
 * Along with {@link #floatSpacePinnedOffsetY} it defines the
 * amount of offset (in pixels) between the float space and the viewport boundaries
 * when the space element is pinned.
 *
 *		config.floatSpacePinnedOffsetX = 20;
 *
 * @cfg {Number} [floatSpacePinnedOffsetX=0]
 * @member CKEDITOR.config
 */

/**
 * Along with {@link #floatSpacePinnedOffsetX} it defines the
 * amount of offset (in pixels) between the float space and the viewport boundaries
 * when the space element is pinned.
 *
 *		config.floatSpacePinnedOffsetY = 20;
 *
 * @cfg {Number} [floatSpacePinnedOffsetY=0]
 * @member CKEDITOR.config
 */

/**
 * Indicates that the float space should be aligned to the right side
 * of the editable area rather than to the left (if possible).
 *
 *		config.floatSpacePreferRight = true;
 *
 * @since 4.5.0
 * @cfg {Boolean} [floatSpacePreferRight=false]
 * @member CKEDITOR.config
 */

/**
 * Fired when the viewport or editor parameters change and the floating space needs to check and
 * eventually update its position and dimensions.
 *
 * @since 4.5.0
 * @event floatingSpaceLayout
 * @member CKEDITOR.editor
 * @param {CKEDITOR.editor} editor The editor instance.
 * @param data
 * @param {Boolean} data.show True if the float space should show up as a result of this event.
 */
