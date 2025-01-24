﻿/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

( function() {
	function protectFormStyles( formElement ) {
		if ( !formElement || formElement.type != CKEDITOR.NODE_ELEMENT || formElement.getName() != 'form' )
			return [];

		var hijackRecord = [],
			hijackNames = [ 'style', 'className' ];
		for ( var i = 0; i < hijackNames.length; i++ ) {
			var name = hijackNames[ i ];
			var $node = formElement.$.elements.namedItem( name );
			if ( $node ) {
				var hijackNode = new CKEDITOR.dom.element( $node );
				hijackRecord.push( [ hijackNode, hijackNode.nextSibling ] );
				hijackNode.remove();
			}
		}

		return hijackRecord;
	}

	function restoreFormStyles( formElement, hijackRecord ) {
		if ( !formElement || formElement.type != CKEDITOR.NODE_ELEMENT || formElement.getName() != 'form' )
			return;

		if ( hijackRecord.length > 0 ) {
			for ( var i = hijackRecord.length - 1; i >= 0; i-- ) {
				var node = hijackRecord[ i ][ 0 ];
				var sibling = hijackRecord[ i ][ 1 ];
				if ( sibling )
					node.insertBefore( sibling );
				else
					node.appendTo( formElement );
			}
		}
	}

	function saveStyles( element, isInsideEditor ) {
		var data = protectFormStyles( element );
		var retval = {};

		var $element = element.$;

		if ( !isInsideEditor ) {
			retval[ 'class' ] = $element.className || '';
			$element.className = '';
		}

		retval.inline = $element.style.cssText || '';
		if ( !isInsideEditor ) // Reset any external styles that might interfere. (https://dev.ckeditor.com/ticket/2474)
		$element.style.cssText = 'position: static; overflow: visible';

		restoreFormStyles( data );
		return retval;
	}

	function restoreStyles( element, savedStyles ) {
		var data = protectFormStyles( element );
		var $element = element.$;
		if ( 'class' in savedStyles )
			$element.className = savedStyles[ 'class' ];
		if ( 'inline' in savedStyles )
			$element.style.cssText = savedStyles.inline;
		restoreFormStyles( data );
	}

	function refreshCursor( editor ) {
		if ( editor.editable().isInline() )
			return;

		// Refresh all editor instances on the page (https://dev.ckeditor.com/ticket/5724).
		var all = CKEDITOR.instances;
		for ( var i in all ) {
			var one = all[ i ];
			if ( one.mode == 'wysiwyg' && !one.readOnly ) {
				var body = one.document.getBody();
				// Refresh 'contentEditable' otherwise
				// DOM lifting breaks design mode. (https://dev.ckeditor.com/ticket/5560)
				body.setAttribute( 'contentEditable', false );
				body.setAttribute( 'contentEditable', true );
			}
		}

		if ( editor.editable().hasFocus ) {
			editor.toolbox.focus();
			editor.focus();
		}
	}

	CKEDITOR.plugins.add( 'maximize', {
		// jscs:disable maximumLineLength
		lang: 'af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		// jscs:enable maximumLineLength
		icons: 'maximize', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		init: function( editor ) {
			// Maximize plugin isn't available in inline mode yet.
			if ( editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE )
				return;

			var lang = editor.lang;
			var mainDocument = CKEDITOR.document,
				mainWindow = mainDocument.getWindow();

			// Saved selection and scroll position for the editing area.
			var savedSelection, savedScroll;

			// Saved scroll position for the outer window.
			var outerScroll;

			// Saved resize handler function.
			function resizeHandler() {
				var viewPaneSize = mainWindow.getViewPaneSize();
				editor.resize( viewPaneSize.width, viewPaneSize.height, null, true );
			}

			function handleHistoryApi() {
				var command = editor.getCommand( 'maximize' );

				if ( command.state === CKEDITOR.TRISTATE_ON ) {
					command.exec();
				}
			}

			// Retain state after mode switches.
			var savedState = CKEDITOR.TRISTATE_OFF;

			editor.addCommand( 'maximize', {
				// Disabled on iOS (https://dev.ckeditor.com/ticket/8307).
				modes: { wysiwyg: !CKEDITOR.env.iOS, source: !CKEDITOR.env.iOS },
				readOnly: 1,
				editorFocus: false,
				exec: function() {
					var container = editor.container.getFirst( function( node ) {
						return node.type == CKEDITOR.NODE_ELEMENT && node.hasClass( 'cke_inner' );
					} );
					var contents = editor.ui.space( 'contents' );

					// Save current selection and scroll position in editing area.
					if ( editor.mode == 'wysiwyg' ) {
						var selection = editor.getSelection();
						savedSelection = selection && selection.getRanges();
						savedScroll = mainWindow.getScrollPosition();
					} else {
						var $textarea = editor.editable().$;
						savedSelection = !CKEDITOR.env.ie && [ $textarea.selectionStart, $textarea.selectionEnd ];
						savedScroll = [ $textarea.scrollLeft, $textarea.scrollTop ];
					}

					// Go fullscreen if the state is off.
					if ( this.state == CKEDITOR.TRISTATE_OFF ) {
						// Add event handler for resizing.
						mainWindow.on( 'resize', resizeHandler );

						// Save the scroll bar position.
						outerScroll = mainWindow.getScrollPosition();

						// Save and reset the styles for the entire node tree.
						var currentNode = editor.container;
						while ( ( currentNode = currentNode.getParent() ) ) {
							currentNode.setCustomData( 'maximize_saved_styles', saveStyles( currentNode ) );
							// Show under floatpanels (-1) and context menu (-2).
							currentNode.setStyle( 'z-index', editor.config.baseFloatZIndex - 5 );
						}
						contents.setCustomData( 'maximize_saved_styles', saveStyles( contents, true ) );
						container.setCustomData( 'maximize_saved_styles', saveStyles( container, true ) );

						// Hide scroll bars.
						var styles = {
							overflow: CKEDITOR.env.webkit ? '' : 'hidden', // https://dev.ckeditor.com/ticket/6896
							width: 0,
							height: 0
						};

						mainDocument.getDocumentElement().setStyles( styles );
						!CKEDITOR.env.gecko && mainDocument.getDocumentElement().setStyle( 'position', 'fixed' );
						!( CKEDITOR.env.gecko && CKEDITOR.env.quirks ) && mainDocument.getBody().setStyles( styles );

						// Scroll to the top left (IE needs some time for it - https://dev.ckeditor.com/ticket/4923).
						CKEDITOR.env.ie ? setTimeout( function() {
							mainWindow.$.scrollTo( 0, 0 );
						}, 0 ) : mainWindow.$.scrollTo( 0, 0 );

						// Resize and move to top left.
						// Special treatment for FF Quirks (https://dev.ckeditor.com/ticket/7284)
						container.setStyle( 'position', CKEDITOR.env.gecko && CKEDITOR.env.quirks ? 'fixed' : 'absolute' );
						container.$.offsetLeft; // SAFARI BUG: See https://dev.ckeditor.com/ticket/2066.
						container.setStyles( {
							// Show under floatpanels (-1) and context menu (-2).
							'z-index': editor.config.baseFloatZIndex - 5,
							left: '0px',
							top: '0px'
						} );

						// Add cke_maximized class before resize handle since that will change things sizes (https://dev.ckeditor.com/ticket/5580)
						container.addClass( 'cke_maximized' );

						resizeHandler();

						// Still not top left? Fix it. (Bug https://dev.ckeditor.com/ticket/174)
						var offset = container.getDocumentPosition();
						container.setStyles( {
							left: ( -1 * offset.x ) + 'px',
							top: ( -1 * offset.y ) + 'px'
						} );

						// Fixing positioning editor chrome in Firefox break design mode. (https://dev.ckeditor.com/ticket/5149)
						CKEDITOR.env.gecko && refreshCursor( editor );
					}
					// Restore from fullscreen if the state is on.
					else if ( this.state == CKEDITOR.TRISTATE_ON ) {
						// Remove event handler for resizing.
						mainWindow.removeListener( 'resize', resizeHandler );

						// Restore CSS styles for the entire node tree.
						var editorElements = [ contents, container ];
						for ( var i = 0; i < editorElements.length; i++ ) {
							restoreStyles( editorElements[ i ], editorElements[ i ].getCustomData( 'maximize_saved_styles' ) );
							editorElements[ i ].removeCustomData( 'maximize_saved_styles' );
						}

						currentNode = editor.container;
						while ( ( currentNode = currentNode.getParent() ) ) {
							restoreStyles( currentNode, currentNode.getCustomData( 'maximize_saved_styles' ) );
							currentNode.removeCustomData( 'maximize_saved_styles' );
						}

						// Restore the window scroll position.
						CKEDITOR.env.ie ? setTimeout( function() {
							mainWindow.$.scrollTo( outerScroll.x, outerScroll.y );
						}, 0 ) : mainWindow.$.scrollTo( outerScroll.x, outerScroll.y );

						// Remove cke_maximized class.
						container.removeClass( 'cke_maximized' );

						// Webkit requires a re-layout on editor chrome. (https://dev.ckeditor.com/ticket/6695)
						if ( CKEDITOR.env.webkit ) {
							container.setStyle( 'display', 'inline' );
							setTimeout( function() {
								container.setStyle( 'display', 'block' );
							}, 0 );
						}

						// Emit a resize event, because this time the size is modified in
						// restoreStyles.
						editor.fire( 'resize', {
							outerHeight: editor.container.$.offsetHeight,
							contentsHeight: contents.$.offsetHeight,
							outerWidth: editor.container.$.offsetWidth
						} );
					}

					this.toggleState();

					// Restore selection and scroll position in editing area.
					if ( editor.mode == 'wysiwyg' ) {
						if ( savedSelection ) {
							// Fixing positioning editor chrome in Firefox break design mode. (https://dev.ckeditor.com/ticket/5149)
							CKEDITOR.env.gecko && refreshCursor( editor );

							editor.getSelection().selectRanges( savedSelection );
							var element = editor.getSelection().getStartElement();
							element && element.scrollIntoView( true );
						} else {
							mainWindow.$.scrollTo( savedScroll.x, savedScroll.y );
						}
					} else {
						if ( savedSelection ) {
							$textarea.selectionStart = savedSelection[ 0 ];
							$textarea.selectionEnd = savedSelection[ 1 ];
						}
						$textarea.scrollLeft = savedScroll[ 0 ];
						$textarea.scrollTop = savedScroll[ 1 ];
					}

					savedSelection = savedScroll = null;
					savedState = this.state;

					editor.fire( 'maximize', this.state );
				},
				canUndo: false
			} );

			editor.ui.addButton && editor.ui.addButton( 'Maximize', {
				isToggle: true,
				label: lang.maximize.maximize,
				command: 'maximize',
				toolbar: 'tools,10'
			} );

			// Restore the command state after mode change, unless it has been changed to disabled (https://dev.ckeditor.com/ticket/6467)
			editor.on( 'mode', function() {
				var command = editor.getCommand( 'maximize' );
				command.setState( command.state == CKEDITOR.TRISTATE_DISABLED ? CKEDITOR.TRISTATE_DISABLED : savedState );
			}, null, null, 100 );

			// Add support for History API (#4374).
			if ( editor.config.maximize_historyIntegration ) {
				var historyEvent = editor.config.maximize_historyIntegration === CKEDITOR.HISTORY_NATIVE ?
					'popstate' : 'hashchange';

				mainWindow.on( historyEvent, handleHistoryApi );

				// Remove the history listener when destroying an editor instance (#5396).
				editor.on( 'destroy', function() {
					mainWindow.removeListener( historyEvent, handleHistoryApi );
				} );
			}
		}
	} );

	/**
	 * Informs plugin how it should integrate with browser's "Go back" and "Go forward" buttons.
	 *
	 * If it's set to {@link CKEDITOR#HISTORY_NATIVE}, the plugin will use native History API and
	 * [`popstate`](https://developer.mozilla.org/en-US/docs/Web/API/Window/popstate_event) event.
	 *
	 * If it's set to {@link CKEDITOR#HISTORY_HASH}, the plugin will use
	 * [`hashchange`](https://developer.mozilla.org/en-US/docs/Web/API/Window/hashchange_event) event.
	 *
	 * If it's set to {@link CKEDITOR#HISTORY_OFF}, the plugin will not integrate
	 * with browser's "Go back" and "Go forward" buttons.
	 *
	 * @cfg {Number} [maximize_historyIntegration=CKEDITOR.HISTORY_NATIVE]
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.maximize_historyIntegration = CKEDITOR.HISTORY_NATIVE;
} )();

/**
 * Event fired when the maximize command is called.
 * It also indicates whether an editor is maximized or not.
 *
 * @event maximize
 * @member CKEDITOR.editor
 * @param {CKEDITOR.editor} editor This editor instance.
 * @param {Number} data Current state of the command. See {@link CKEDITOR#TRISTATE_ON} and {@link CKEDITOR#TRISTATE_OFF}.
 */
