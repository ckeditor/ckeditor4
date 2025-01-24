﻿/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

/**
 * @fileOverview The "elementspath" plugin. It shows all elements in the DOM
 *		parent tree relative to the current selection in the editing area.
 */

( function() {
	var commands = {
		toolbarFocus: {
			editorFocus: false,
			readOnly: 1,
			exec: function( editor ) {
				var idBase = editor._.elementsPath.idBase;
				var element = CKEDITOR.document.getById( idBase + '0' );

				// Make the first button focus accessible for IE. (https://dev.ckeditor.com/ticket/3417)
				// Adobe AIR instead need while of delay.
				element && element.focus( CKEDITOR.env.ie || CKEDITOR.env.air );
			}
		}
	};

	var emptyHtml = '<span class="cke_path_empty">&nbsp;</span>';

	var extra = '';

	// Some browsers don't cancel key events in the keydown but in the
	// keypress.
	// TODO: Check if really needed.
	if ( CKEDITOR.env.gecko && CKEDITOR.env.mac )
		extra += ' onkeypress="return false;"';

	// With Firefox, we need to force the button to redraw, otherwise it
	// will remain in the focus state.
	if ( CKEDITOR.env.gecko )
		extra += ' onblur="this.style.cssText = this.style.cssText;"';

	var pathItemTpl = CKEDITOR.addTemplate( 'pathItem', '<a' +
		' id="{id}"' +
		' href="{jsTitle}"' +
		' tabindex="-1"' +
		' class="cke_path_item"' +
		' title="{label}"' +
		extra +
		' hidefocus="true" ' +
		' draggable="false" ' +
		' ondragstart="return false;"' + // Required by Firefox (#1191).
		' onkeydown="return CKEDITOR.tools.callFunction({keyDownFn},{index}, event );"' +
		' onclick="CKEDITOR.tools.callFunction({clickFn},{index}); return false;"' +
		' role="button" aria-label="{label}">' +
		'{text}' +
		'</a>' );

	CKEDITOR.plugins.add( 'elementspath', {
		// jscs:disable maximumLineLength
		lang: 'af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		// jscs:enable maximumLineLength
		init: function( editor ) {
			editor._.elementsPath = {
				idBase: 'cke_elementspath_' + CKEDITOR.tools.getNextNumber() + '_',
				filters: []
			};

			editor.on( 'uiSpace', function( event ) {
				if ( event.data.space == 'bottom' )
					initElementsPath( editor, event.data );
			} );
		}
	} );

	function initElementsPath( editor, bottomSpaceData ) {
		var spaceId = editor.ui.spaceId( 'path' ),
			spaceElement,
			getSpaceElement = function() {
				if ( !spaceElement )
					spaceElement = CKEDITOR.document.getById( spaceId );
				return spaceElement;
			},
			elementsPath = editor._.elementsPath,
			idBase = elementsPath.idBase;

		bottomSpaceData.html += '<span id="' + spaceId + '_label" class="cke_voice_label">' + editor.lang.elementspath.eleLabel + '</span>' +
			'<span id="' + spaceId + '" class="cke_path" role="group" aria-labelledby="' + spaceId + '_label">' + emptyHtml + '</span>';

		// Register the ui element to the focus manager.
		editor.on( 'uiReady', function() {
			var element = editor.ui.space( 'path' );
			element && editor.focusManager.add( element, 1 );
		} );

		function onClick( elementIndex ) {
			var element = elementsPath.list[ elementIndex ],
				selection;

			if ( element.equals( editor.editable() ) || element.getAttribute( 'contenteditable' ) == 'true' ) {
				var range = editor.createRange();
				range.selectNodeContents( element );

				selection = range.select();
			} else {
				selection = editor.getSelection();
				selection.selectElement( element );
			}

			// Explicitly fire selectionChange when clicking on an element path button. (https://dev.ckeditor.com/ticket/13548)
			if ( CKEDITOR.env.ie ) {
				editor.fire( 'selectionChange', { selection: selection, path: new CKEDITOR.dom.elementPath( element ) } );
			}

			// It is important to focus() *after* the above selection
			// manipulation, otherwise Firefox will have troubles. https://dev.ckeditor.com/ticket/10119
			editor.focus();
		}

		elementsPath.onClick = onClick;

		var onClickHanlder = CKEDITOR.tools.addFunction( onClick ),
			onKeyDownHandler = CKEDITOR.tools.addFunction( function( elementIndex, ev ) {
				var idBase = elementsPath.idBase,
					element;

				ev = new CKEDITOR.dom.event( ev );

				var rtl = editor.lang.dir == 'rtl';
				switch ( ev.getKeystroke() ) {
					case rtl ? 39 : 37: // LEFT-ARROW
					case 9: // TAB
						element = CKEDITOR.document.getById( idBase + ( elementIndex + 1 ) );
						if ( !element )
							element = CKEDITOR.document.getById( idBase + '0' );
						element.focus();
						return false;

					case rtl ? 37 : 39: // RIGHT-ARROW
					case CKEDITOR.SHIFT + 9: // SHIFT + TAB
						element = CKEDITOR.document.getById( idBase + ( elementIndex - 1 ) );
						if ( !element )
							element = CKEDITOR.document.getById( idBase + ( elementsPath.list.length - 1 ) );
						element.focus();
						return false;

					case 27: // ESC
						editor.focus();
						return false;

					case 13: // ENTER	// Opera
					case 32: // SPACE
						onClick( elementIndex );
						return false;
					case CKEDITOR.ALT + 121: // ALT + F10 (#438).
						editor.execCommand( 'toolbarFocus' );
						return false;
				}
				return true;
			} );

		editor.on( 'selectionChange', function( evt ) {
			var html = [],
				elementsList = elementsPath.list = [],
				namesList = [],
				filters = elementsPath.filters,
				isContentEditable = true,

				// Use elementPath to consider children of editable only (https://dev.ckeditor.com/ticket/11124).
				// Use elementPath from event (instead of editor.elementPath()), which is accurate in all cases (#801).
				elementsChain = evt.data.path.elements,
				name;

			// Starts iteration from body element, skipping html.
			for ( var j = elementsChain.length; j--; ) {
				var element = elementsChain[ j ],
					ignore = 0;

				if ( element.data( 'cke-display-name' ) )
					name = element.data( 'cke-display-name' );
				else if ( element.data( 'cke-real-element-type' ) )
					name = element.data( 'cke-real-element-type' );
				else
					name = element.getName();

				isContentEditable = element.hasAttribute( 'contenteditable' ) ?
					element.getAttribute( 'contenteditable' ) == 'true' : isContentEditable;

				// If elem is non-contenteditable, and it's not specifying contenteditable
				// attribute - then elem should be ignored.
				if ( !isContentEditable && !element.hasAttribute( 'contenteditable' ) )
					ignore = 1;

				for ( var i = 0; i < filters.length; i++ ) {
					var ret = filters[ i ]( element, name );
					if ( ret === false ) {
						ignore = 1;
						break;
					}
					name = ret || name;
				}

				if ( !ignore ) {
					elementsList.unshift( element );
					namesList.unshift( name );
				}
			}

			for ( var iterationLimit = elementsList.length, index = 0; index < iterationLimit; index++ ) {
				name = namesList[ index ];
				var label = editor.lang.elementspath.eleTitle.replace( /%1/, name ),
					item = pathItemTpl.output( {
						id: idBase + index,
						label: label,
						text: name,
						jsTitle: 'javascript:void(\'' + name + '\')', // jshint ignore:line
						index: index,
						keyDownFn: onKeyDownHandler,
						clickFn: onClickHanlder
					} );

				html.unshift( item );
			}

			var space = getSpaceElement();
			space.setHtml( html.join( '' ) + emptyHtml );
			editor.fire( 'elementsPathUpdate', { space: space } );
		} );

		function empty() {
			spaceElement && spaceElement.setHtml( emptyHtml );
			delete elementsPath.list;
		}

		editor.on( 'readOnly', empty );
		editor.on( 'contentDomUnload', empty );

		editor.addCommand( 'elementsPathFocus', commands.toolbarFocus );
		editor.setKeystroke( CKEDITOR.ALT + 122 /*F11*/, 'elementsPathFocus' );
	}
} )();

/**
 * Fired when the contents of the elementsPath are changed.
 *
 * @event elementsPathUpdate
 * @member CKEDITOR.editor
 * @param {CKEDITOR.editor} editor This editor instance.
 * @param data
 * @param {CKEDITOR.dom.element} data.space The elementsPath container.
 */
