/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

    (function(){
        var win = CKEDITOR.document.getWindow(),
            pixelate = CKEDITOR.tools.cssLength;

        CKEDITOR.plugins.add('floatingspace', {
            init : function(editor){
                // Add listener with lower priority than that in themedui creator.
                // Thereby floatingspace will be created only if themedui wasn't used.
                editor.on('loaded', function(){
                    attach(this);
                }, null, null, 20);
            }
        });

        function scrollOffset(side){
            var pageOffset = side == 'left' ? 'pageXOffset' : 'pageYOffset',
                docScrollOffset = side == 'left' ? 'scrollLeft' : 'scrollTop';

            return (pageOffset in win.$) ? win.$[ pageOffset ] : CKEDITOR.document.$.documentElement[ docScrollOffset ];
        }

        function attach(editor){
            
            var config = editor.config,
                //config of the plugin
                floatSpaceConfig = config.floatSpace || {on : {}},
                //control the visibility of the toolbar
                hidden = false,
                // Get the HTML for the predefined spaces.
                topHtml = editor.fire('uiSpace', {space : 'top', html : ''}).html,
                // Re-positioning of the space.
                layout = (function(){
                // Mode indicates the vertical aligning mode.
                var mode, centerElement,
                    spaceRect, editorRect, viewRect, spaceHeight, pageScrollX,
                    // Allow minor adjustments of the float space from custom configs.
                    dockedOffsetX = config.floatSpaceDockedOffsetX || 0,
                    dockedOffsetY = config.floatSpaceDockedOffsetY || 0,
                    pinnedOffsetX = config.floatSpacePinnedOffsetX || 0,
                    pinnedOffsetY = config.floatSpacePinnedOffsetY || 0;

                // Update the float space position.
                function updatePos(pos, prop, val){
                    floatSpace.setStyle(prop, pixelate(val));
                    floatSpace.setStyle('position', pos);
                }

                // Change the current mode and update float space position accordingly.
                function changeMode(newMode){
                    var editorPos = centerElement.getDocumentPosition();

                    switch(newMode){
                        case 'top':
                            updatePos('absolute', 'top', editorPos.y - spaceHeight - dockedOffsetY);
                            break;
                        case 'pin':
                            updatePos('fixed', 'top', pinnedOffsetY);
                            break;
                        case 'bottom':
                            updatePos('absolute', 'top', editorPos.y + (editorRect.height || editorRect.bottom - editorRect.top) + dockedOffsetY);
                            break;
                    }

                    if(floatSpaceConfig.on && typeof(floatSpaceConfig.on.changeMode) === 'function'){
                        floatSpaceConfig.on.changeMode.call(floatSpace.$, mode, newMode);
                    }

                    mode = newMode;
                }

                return function(evt){

                    if(!centerElement){//get centerElement once

                        if(floatSpaceConfig.centerElement){
                            var elt;
                            if(typeof(floatSpaceConfig.centerElement) === 'function'){
                                elt = floatSpaceConfig.centerElement.call(null);
                            }else{
                                elt = floatSpaceConfig.centerElement;
                            }
                            centerElement = new CKEDITOR.dom.element(elt);

                            //prevent blurring
                            centerElement.on('mousedown', function(evt){
                                evt = evt.data.preventDefault();
                            });
                        }else if(!(centerElement = editor.editable())){
                            // #10112 Do not fail on editable-less editor.
                            return;
                        }
                    }

                    if(hidden){
                        return;
                    }

                    // Show up the space on focus gain.
                    evt && evt.name === 'focus' && floatSpace.show();

                    // Reset the horizontal position for below measurement.
                    floatSpace.removeStyle('left');
                    floatSpace.removeStyle('right');

                    // Compute the screen position from the TextRectangle object would
                    // be very simple, even though the "width"/"height" property is not
                    // available for all, it's safe to figure that out from the rest.

                    // http://help.dottoro.com/ljgupwlp.php
                    spaceRect = floatSpace.getClientRect();
                    editorRect = centerElement.getClientRect();
                    viewRect = win.getViewPaneSize();
                    spaceHeight = spaceRect.height;
                    pageScrollX = scrollOffset('left');

                    // We initialize it as pin mode.
                    if(!mode){
                        mode = 'pin';
                        changeMode('pin');
                        // Call for a refresh to the actual layout.
                        layout(evt);
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
                    if(spaceHeight + dockedOffsetY <= editorRect.top)
                        changeMode('top');

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
                    else if(spaceHeight + dockedOffsetY > viewRect.height - editorRect.bottom)
                        changeMode('pin');

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
                        changeMode('bottom');

                    var mid = viewRect.width / 2,
                        alignSide =
                        (editorRect.left > 0 && editorRect.right < viewRect.width && editorRect.width > spaceRect.width) ?
                        (editor.config.contentsLangDirection == 'rtl' ? 'right' : 'left')
                        :
                        (mid - editorRect.left > editorRect.right - mid ? 'left' : 'right'),
                        offset;

                    // (#9769) If viewport width is less than space width,
                    // make sure space never cross the left boundary of the viewport.
                    // In other words: top-left corner of the space is always visible.
                    if(spaceRect.width > viewRect.width){
                        alignSide = 'left';
                        offset = 0;
                    }
                    else{
                        if(alignSide == 'left'){
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
                            if(editorRect.left > 0)
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
                        else{
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
                            if(editorRect.right < viewRect.width)
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
                        if(offset + spaceRect.width > viewRect.width){
                            alignSide = alignSide == 'left' ? 'right' : 'left';
                            offset = 0;
                        }
                    }

                    // Pin mode is fixed, so don't include scroll-x.
                    // (#9903) For mode is "top" or "bottom", add opposite scroll-x for right-aligned space.
                    var scroll = mode == 'pin' ?
                        0
                        :
                        alignSide == 'left' ? pageScrollX : -pageScrollX;

                    floatSpace.setStyle(alignSide, pixelate((mode == 'pin' ? pinnedOffsetX : dockedOffsetX) + offset + scroll));
                };
            })();

            if(topHtml){
                var floatSpaceTpl = new CKEDITOR.template(
                    '<div' +
                        ' id="cke_{name}"' +
                        ' class="cke {id} cke_reset_all cke_chrome cke_editor_{name} cke_float cke_{langDir} ' + CKEDITOR.env.cssClass + '"' +
                        ' dir="{langDir}"' +
                        ' title="' + (CKEDITOR.env.gecko ? ' ' : '') + '"' +
                        ' lang="{langCode}"' +
                        ' role="application"' +
                        ' style="{style}"' +
                        (editor.title ? ' aria-labelledby="cke_{name}_arialbl"' : ' ') +
                            '>' +
                        (editor.title ? '<span id="cke_{name}_arialbl" class="cke_voice_label">{voiceLabel}</span>' : ' ') +
                        '<div class="cke_inner">' +
                        '<div id="{topId}" class="cke_top" role="presentation">{content}</div>' +
                        '</div>' +
                        '<span class="cke_nose"><span>' +
                    '</div>'),
                    floatSpace = CKEDITOR.document.getBody().append(CKEDITOR.dom.element.createFromHtml(floatSpaceTpl.output({
                    content : topHtml,
                    id : editor.id,
                    langDir : editor.lang.dir,
                    langCode : editor.langCode,
                    name : editor.name,
                    style : 'display:none;z-index:' + (config.baseFloatZIndex - 1),
                    topId : editor.ui.spaceId('top'),
                    voiceLabel : editor.title
                }))),
                    // Use event buffers to reduce CPU load when tons of events are fired.
                    changeBuffer = CKEDITOR.tools.eventsBuffer(500, layout),
                    uiBuffer = CKEDITOR.tools.eventsBuffer(100, layout);

                // There's no need for the floatSpace to be selectable.
                floatSpace.unselectable();

                // Prevent clicking on non-buttons area of the space from blurring editor.
                floatSpace.on('mousedown', function(evt){
                    evt = evt.data;
                    if(!evt.getTarget().hasAscendant('a', 1))
                        evt.preventDefault();
                });

                editor.on('focus', function(evt){
                    layout(evt);
                    editor.on('change', changeBuffer.input);
                    win.on('scroll', uiBuffer.input);
                    win.on('resize', uiBuffer.input);
                });

                editor.on('blur', function(){
                    floatSpace.hide();
                    editor.removeListener('change', changeBuffer.input);
                    win.removeListener('scroll', uiBuffer.input);
                    win.removeListener('resize', uiBuffer.input);
                });

                editor.on('destroy', function(){
                    win.removeListener('scroll', uiBuffer.input);
                    win.removeListener('resize', uiBuffer.input);
                    floatSpace.clearCustomData();
                    floatSpace.remove();
                });

                // Handle initial focus.
                if(editor.focusManager.hasFocus){
                    floatSpace.show();
                }

                // Register this UI space to the focus manager.
                editor.focusManager.add(floatSpace, 1);

                if(floatSpaceConfig.on && typeof(floatSpaceConfig.on.ready) === 'function'){
                    var api = {
                        show : function(){
                            hidden = false;
                            floatSpace.show();
                            layout();
                        },
                        hide : function(){
                            floatSpace.hide();
                            hidden = true;
                        }
                    };
                    floatSpaceConfig.on.ready.call(floatSpace.$, api);
                }
            }
        }
    })();

/**
 * Along with {@link #floatSpaceDockedOffsetY} it defines the
 * amount of offset (in pixels) between float space and the centerElement left/right
 * boundaries when space element is docked at either side of the centerElement.
 *
 *		config.floatSpaceDockedOffsetX = 10;
 *
 * @cfg {Number} [floatSpaceDockedOffsetX=0]
 * @member CKEDITOR.config
 */

/**
 * Along with {@link #floatSpaceDockedOffsetX} it defines the
 * amount of offset (in pixels) between float space and the centerElement top/bottom
 * boundaries when space element is docked at either side of the centerElement.
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

/**
 * It allows using another dom element to use for flatspacing calculation
 *
 *		config.floatSpace.centerElement = document.getElementById('trigger-button');
 *
 * @cfg {DomElement} [floatSpace.centerElement=null]
 * @member CKEDITOR.config
 */