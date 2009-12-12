/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview The "wysiwygarea" plugin. It registers the "wysiwyg" editing
 *		mode, which handles the main editing area space.
 */

(function() {
	/**
	 * List of elements in which has no way to move editing focus outside.
	 */
	var nonExitableElementNames = { table:1,pre:1 };
	// Matching an empty paragraph at the end of document.
	var emptyParagraphRegexp = /\s*<(p|div|address|h\d|center)[^>]*>\s*(?:<br[^>]*>|&nbsp;|\u00A0|&#160;)?\s*(:?<\/\1>)?\s*$/gi;

	function onInsertHtml( evt ) {
		if ( this.mode == 'wysiwyg' ) {
			this.focus();

			var selection = this.getSelection(),
				data = evt.data;

			if ( this.dataProcessor )
				data = this.dataProcessor.toHtml( data );

			if ( CKEDITOR.env.ie ) {
				var selIsLocked = selection.isLocked;

				if ( selIsLocked )
					selection.unlock();

				var $sel = selection.getNative();
				if ( $sel.type == 'Control' )
					$sel.clear();
				$sel.createRange().pasteHTML( data );

				if ( selIsLocked )
					this.getSelection().lock();
			} else
				this.document.$.execCommand( 'inserthtml', false, data );
		}
	}

	function onInsertElement( evt ) {
		if ( this.mode == 'wysiwyg' ) {
			this.focus();
			this.fire( 'saveSnapshot' );

			var element = evt.data,
				elementName = element.getName(),
				isBlock = CKEDITOR.dtd.$block[ elementName ];

			var selection = this.getSelection(),
				ranges = selection.getRanges();

			var selIsLocked = selection.isLocked;

			if ( selIsLocked )
				selection.unlock();

			var range, clone, lastElement, bookmark;

			for ( var i = ranges.length - 1; i >= 0; i-- ) {
				range = ranges[ i ];

				// Remove the original contents.
				range.deleteContents();

				clone = !i && element || element.clone( true );

				// If we're inserting a block at dtd-violated position, split
				// the parent blocks until we reach blockLimit.
				var current, dtd;
				if ( isBlock ) {
					while ( ( current = range.getCommonAncestor( false, true ) ) && ( dtd = CKEDITOR.dtd[ current.getName() ] ) && !( dtd && dtd[ elementName ] ) ) {
						// Split up inline elements.
						if ( current.getName() in CKEDITOR.dtd.span )
							range.splitElement( current );
						// If we're in an empty block which indicate a new paragraph,
						// simply replace it with the inserting block.(#3664)
						else if ( range.checkStartOfBlock() && range.checkEndOfBlock() ) {
							range.setStartBefore( current );
							range.collapse( true );
							current.remove();
						} else
							range.splitBlock();
					}
				}

				// Insert the new node.
				range.insertNode( clone );

				// Save the last element reference so we can make the
				// selection later.
				if ( !lastElement )
					lastElement = clone;
			}

			range.moveToPosition( lastElement, CKEDITOR.POSITION_AFTER_END );

			var next = lastElement.getNextSourceNode( true );
			if ( next && next.type == CKEDITOR.NODE_ELEMENT )
				range.moveToElementEditStart( next );

			selection.selectRanges( [ range ] );

			if ( selIsLocked )
				this.getSelection().lock();

			// Save snaps after the whole execution completed.
			// This's a workaround for make DOM modification's happened after
			// 'insertElement' to be included either, e.g. Form-based dialogs' 'commitContents'
			// call.
			CKEDITOR.tools.setTimeout( function() {
				this.fire( 'saveSnapshot' );
			}, 0, this );
		}
	}

	// DOM modification here should not bother dirty flag.(#4385)
	function restoreDirty( editor ) {
		if ( !editor.checkDirty() )
			setTimeout( function() {
			editor.resetDirty();
		});
	}

	var isNotWhitespace = CKEDITOR.dom.walker.whitespaces( true ),
		isNotBookmark = CKEDITOR.dom.walker.bookmark( false, true );

	function isNotEmpty( node ) {
		return isNotWhitespace( node ) && isNotBookmark( node );
	}

	function isNbsp( node ) {
		return node.type == CKEDITOR.NODE_TEXT && CKEDITOR.tools.trim( node.getText() ).match( /^(?:&nbsp;|\xa0)$/ );
	}

	/**
	 *  Auto-fixing block-less content by wrapping paragraph (#3190), prevent
	 *  non-exitable-block by padding extra br.(#3189)
	 */
	function onSelectionChangeFixBody( evt ) {
		var editor = evt.editor,
			path = evt.data.path,
			blockLimit = path.blockLimit,
			selection = evt.data.selection,
			range = selection.getRanges()[ 0 ],
			body = editor.document.getBody(),
			enterMode = editor.config.enterMode;

		// When enterMode set to block, we'll establing new paragraph only if we're
		// selecting inline contents right under body. (#3657)
		if ( enterMode != CKEDITOR.ENTER_BR && range.collapsed && blockLimit.getName() == 'body' && !path.block ) {
			restoreDirty( editor );
			var fixedBlock = range.fixBlock( true, editor.config.enterMode == CKEDITOR.ENTER_DIV ? 'div' : 'p' );

			// For IE, we should remove any filler node which was introduced before.
			if ( CKEDITOR.env.ie ) {
				var first = fixedBlock.getFirst( isNotEmpty );
				first && isNbsp( first ) && first.remove();
			}

			// If the fixed block is blank and already followed by a exitable
			// block, we should revert the fix. (#3684)
			if ( fixedBlock.getOuterHtml().match( emptyParagraphRegexp ) ) {
				var previousElement = fixedBlock.getPrevious( isNotWhitespace ),
					nextElement = fixedBlock.getNext( isNotWhitespace );


				if ( previousElement && previousElement.getName && !( previousElement.getName() in nonExitableElementNames ) && range.moveToElementEditStart( previousElement ) || nextElement && nextElement.getName && !( nextElement.getName() in nonExitableElementNames ) && range.moveToElementEditStart( nextElement ) ) {
					fixedBlock.remove();
				}
			}

			range.select();
			// Notify non-IE that selection has changed.
			if ( !CKEDITOR.env.ie )
				editor.selectionChange();
		}

		// All browsers are incapable to moving cursor out of certain non-exitable
		// blocks (e.g. table, list, pre) at the end of document, make this happen by
		// place a bogus node there, which would be later removed by dataprocessor.  
		var lastNode = body.getLast( CKEDITOR.dom.walker.whitespaces( true ) );
		if ( lastNode && lastNode.getName && ( lastNode.getName() in nonExitableElementNames ) ) {
			restoreDirty( editor );
			if ( !CKEDITOR.env.ie )
				body.appendBogus();
			else
				body.append( editor.document.createText( '\xa0' ) );
		}
	}

	CKEDITOR.plugins.add( 'wysiwygarea', {
		requires: [ 'editingblock' ],

		init: function( editor ) {
			var fixForBody = ( editor.config.enterMode != CKEDITOR.ENTER_BR ) ? editor.config.enterMode == CKEDITOR.ENTER_DIV ? 'div' : 'p' : false;

			editor.on( 'editingBlockReady', function() {
				var mainElement, fieldset, iframe, isLoadingData, isPendingFocus, frameLoaded, fireMode;

				// Support for custom document.domain in IE.
				var isCustomDomain = CKEDITOR.env.isCustomDomain();

				// Creates the iframe that holds the editable document.
				var createIFrame = function() {
						if ( iframe )
							iframe.remove();
						if ( fieldset )
							fieldset.remove();

						frameLoaded = 0;
						// The document domain must be set within the src
						// attribute;
						// Defer the script execution until iframe
						// has been added to main window, this is needed for some
						// browsers which will begin to load the frame content
						// prior to it's presentation in DOM.(#3894)
						var src = 'void( ' + ( CKEDITOR.env.gecko ? 'setTimeout' : '' ) + '( function(){' +
															'document.open();' +
															( CKEDITOR.env.ie && isCustomDomain ? 'document.domain="' + document.domain + '";' : '' ) +
															'document.write( window.parent[ "_cke_htmlToLoad_' + editor.name + '" ] );' +
															'document.close();' +
															'window.parent[ "_cke_htmlToLoad_' + editor.name + '" ] = null;' +
															'}'
															+ ( CKEDITOR.env.gecko ? ', 0 )' : ')()' )
															+ ' )';

						// Loading via src attribute does not work in Opera.
						if ( CKEDITOR.env.opera )
							src = 'void(0);';

						iframe = CKEDITOR.dom.element.createFromHtml( '<iframe' +
							' style="width:100%;height:100%"' +
							' frameBorder="0"' +
							' tabIndex="-1"' +
							' allowTransparency="true"' +
							' src="javascript:' + encodeURIComponent( src ) + '"' +
							'></iframe>' );

						var accTitle = editor.lang.editorTitle.replace( '%1', editor.name );

						if ( CKEDITOR.env.gecko ) {
							// Double checking the iframe will be loaded properly(#4058).
							iframe.on( 'load', function( ev ) {
								ev.removeListener();
								contentDomReady( iframe.$.contentWindow );
							});

							// Accessibility attributes for Firefox.
							mainElement.setAttributes({
								role: 'region',
								title: accTitle
							});
							iframe.setAttributes({
								role: 'region',
								title: ' '
							});
						} else if ( CKEDITOR.env.webkit ) {
							iframe.setAttribute( 'title', accTitle ); // Safari 4
							iframe.setAttribute( 'name', accTitle ); // Safari 3
						} else if ( CKEDITOR.env.ie ) {
							// Accessibility label for IE.
							fieldset = CKEDITOR.dom.element.createFromHtml( '<fieldset style="height:100%' +
								( CKEDITOR.env.ie && CKEDITOR.env.quirks ? ';position:relative' : '' ) +
								'">' +
									'<legend style="display:block;width:0;height:0;overflow:hidden;' +
									( CKEDITOR.env.ie && CKEDITOR.env.quirks ? 'position:absolute' : '' ) +
									'">' +
										CKEDITOR.tools.htmlEncode( accTitle ) +
									'</legend>' +
								'</fieldset>'
								, CKEDITOR.document );
							iframe.appendTo( fieldset );
							fieldset.appendTo( mainElement );
						}

						if ( !CKEDITOR.env.ie )
							mainElement.append( iframe );
					};

				// The script that launches the bootstrap logic on 'domReady', so the document
				// is fully editable even before the editing iframe is fully loaded (#4455).
				var activationScript = '<script id="cke_actscrpt" type="text/javascript">' +
					'window.parent.CKEDITOR._["contentDomReady' + editor.name + '"]( window );' +
					'</script>';

				// Editing area bootstrap code.
				var contentDomReady = function( domWindow ) {
						if ( frameLoaded )
							return;

						frameLoaded = 1;

						var domDocument = domWindow.document,
							body = domDocument.body;

						// Remove this script from the DOM.
						var script = domDocument.getElementById( "cke_actscrpt" );
						script.parentNode.removeChild( script );

						delete CKEDITOR._[ 'contentDomReady' + editor.name ];

						body.spellcheck = !editor.config.disableNativeSpellChecker;

						if ( CKEDITOR.env.ie ) {
							// Don't display the focus border.
							body.hideFocus = true;

							// Disable and re-enable the body to avoid IE from
							// taking the editing focus at startup. (#141 / #523)
							body.disabled = true;
							body.contentEditable = true;
							body.removeAttribute( 'disabled' );
						} else
							domDocument.designMode = 'on';

						// IE, Opera and Safari may not support it and throw
						// errors.
						try {
							domDocument.execCommand( 'enableObjectResizing', false, !editor.config.disableObjectResizing );
						} catch ( e ) {}
						try {
							domDocument.execCommand( 'enableInlineTableEditing', false, !editor.config.disableNativeTableHandles );
						} catch ( e ) {}

						domWindow = editor.window = new CKEDITOR.dom.window( domWindow );
						domDocument = editor.document = new CKEDITOR.dom.document( domDocument );

						// Gecko/Webkit need some help when selecting control type elements. (#3448)
						if ( !( CKEDITOR.env.ie || CKEDITOR.env.opera ) ) {
							domDocument.on( 'mousedown', function( ev ) {
								var control = ev.data.getTarget();
								if ( control.is( 'img', 'hr', 'input', 'textarea', 'select' ) )
									editor.getSelection().selectElement( control );
							});
						}

						// Webkit: avoid from editing form control elements content.
						if ( CKEDITOR.env.webkit ) {
							// Prevent from tick checkbox/radiobox/select
							domDocument.on( 'click', function( ev ) {
								if ( ev.data.getTarget().is( 'input', 'select' ) )
									ev.data.preventDefault();
							});

							// Prevent from editig textfield/textarea value.
							domDocument.on( 'mouseup', function( ev ) {
								if ( ev.data.getTarget().is( 'input', 'textarea' ) )
									ev.data.preventDefault();
							});
						}

						// IE standard compliant in editing frame doesn't focus the editor when
						// clicking outside actual content, manually apply the focus. (#1659)
						if ( CKEDITOR.env.ie && domDocument.$.compatMode == 'CSS1Compat' ) {
							var htmlElement = domDocument.getDocumentElement();
							htmlElement.on( 'mousedown', function( evt ) {
								// Setting focus directly on editor doesn't work, we
								// have to use here a temporary element to 'redirect'
								// the focus. 
								if ( evt.data.getTarget().equals( htmlElement ) )
									ieFocusGrabber.focus();
							});
						}

						var focusTarget = ( CKEDITOR.env.ie || CKEDITOR.env.webkit ) ? domWindow : domDocument;

						focusTarget.on( 'blur', function() {
							editor.focusManager.blur();
						});

						focusTarget.on( 'focus', function() {
							// Gecko need a key event to 'wake up' the editing
							// ability when document is empty.(#3864)
							if ( CKEDITOR.env.gecko ) {
								var first = body;
								while ( first.firstChild )
									first = first.firstChild;

								if ( !first.nextSibling && ( 'BR' == first.tagName ) && first.hasAttribute( '_moz_editor_bogus_node' ) ) {
									var keyEventSimulate = domDocument.$.createEvent( "KeyEvents" );
									keyEventSimulate.initKeyEvent( 'keypress', true, true, domWindow.$, false, false, false, false, 0, 32 );
									domDocument.$.dispatchEvent( keyEventSimulate );
									var bogusText = domDocument.getBody().getFirst();
									// Compensate the line maintaining <br> if enterMode is not block.
									if ( editor.config.enterMode == CKEDITOR.ENTER_BR )
										domDocument.createElement( 'br', {
										attributes: { '_moz_dirty': "" } } ).replace( bogusText );
									else
										bogusText.remove();
								}
							}

							editor.focusManager.focus();
						});

						var keystrokeHandler = editor.keystrokeHandler;
						if ( keystrokeHandler )
							keystrokeHandler.attach( domDocument );

						if ( CKEDITOR.env.ie ) {
							// Cancel default action for backspace in IE on control types. (#4047)
							domDocument.on( 'keydown', function( evt ) {
								// Backspace.
								var control = evt.data.getKeystroke() == 8 && editor.getSelection().getSelectedElement();
								if ( control ) {
									// Make undo snapshot.
									editor.fire( 'saveSnapshot' );
									// Remove manually.
									control.remove();
									editor.fire( 'saveSnapshot' );
									evt.cancel();
								}
							});

							// PageUp/PageDown scrolling is broken in document
							// with standard doctype, manually fix it. (#4736)
							if ( domDocument.$.compatMode == 'CSS1Compat' ) {
								var pageUpDownKeys = { 33:1,34:1 };
								domDocument.on( 'keydown', function( evt ) {
									if ( evt.data.getKeystroke() in pageUpDownKeys ) {
										setTimeout( function() {
											editor.getSelection().scrollIntoView();
										}, 0 );
									}
								});
							}
						}

						// Adds the document body as a context menu target.
						if ( editor.contextMenu )
							editor.contextMenu.addTarget( domDocument, editor.config.browserContextMenuOnCtrl !== false );

						setTimeout( function() {
							editor.fire( 'contentDom' );

							if ( fireMode ) {
								editor.mode = 'wysiwyg';
								editor.fire( 'mode' );
								fireMode = false;
							}

							isLoadingData = false;

							if ( isPendingFocus ) {
								editor.focus();
								isPendingFocus = false;
							}
							setTimeout( function() {
								editor.fire( 'dataReady' );
							}, 0 );

							/*
							 * IE BUG: IE might have rendered the iframe with invisible contents.
							 * (#3623). Push some inconsequential CSS style changes to force IE to
							 * refresh it.
							 *
							 * Also, for some unknown reasons, short timeouts (e.g. 100ms) do not
							 * fix the problem. :(
							 */
							if ( CKEDITOR.env.ie ) {
								setTimeout( function() {
									if ( editor.document ) {
										var $body = editor.document.$.body;
										$body.runtimeStyle.marginBottom = '0px';
										$body.runtimeStyle.marginBottom = '';
									}
								}, 1000 );
							}
						}, 0 );
					};

				editor.addMode( 'wysiwyg', {
					load: function( holderElement, data, isSnapshot ) {
						mainElement = holderElement;

						if ( CKEDITOR.env.ie && CKEDITOR.env.quirks )
							holderElement.setStyle( 'position', 'relative' );

						// The editor data "may be dirty" after this
						// point.
						editor.mayBeDirty = true;

						fireMode = true;

						if ( isSnapshot )
							this.loadSnapshotData( data );
						else
							this.loadData( data );
					},

					loadData: function( data ) {
						isLoadingData = true;

						// Get the HTML version of the data.
						if ( editor.dataProcessor ) {
							data = editor.dataProcessor.toHtml( data, fixForBody );
						}

						data = editor.config.docType + '<html dir="' + editor.config.contentsLangDirection + '">' +
																'<head>' +
																	'<link type="text/css" rel="stylesheet" href="' +
																	[].concat( editor.config.contentsCss ).join( '"><link type="text/css" rel="stylesheet" href="' ) +
																	'">' +
																	'<style type="text/css" _fcktemp="true">' +
																		editor._.styles.join( '\n' ) +
																	'</style>' +
																'</head>' +
																'<body>' +
																	data +
																'</body>' +
																'</html>' +
																activationScript;

						window[ '_cke_htmlToLoad_' + editor.name ] = data;
						CKEDITOR._[ 'contentDomReady' + editor.name ] = contentDomReady;
						createIFrame();

						// Opera must use the old method for loading contents.
						if ( CKEDITOR.env.opera ) {
							var doc = iframe.$.contentWindow.document;
							doc.open();
							doc.write( data );
							doc.close();
						}
					},

					getData: function() {
						var data = iframe.getFrameDocument().getBody().getHtml();

						if ( editor.dataProcessor )
							data = editor.dataProcessor.toDataFormat( data, fixForBody );

						// Strip the last blank paragraph within document.
						if ( editor.config.ignoreEmptyParagraph )
							data = data.replace( emptyParagraphRegexp, '' );

						return data;
					},

					getSnapshotData: function() {
						return iframe.getFrameDocument().getBody().getHtml();
					},

					loadSnapshotData: function( data ) {
						iframe.getFrameDocument().getBody().setHtml( data );
					},

					unload: function( holderElement ) {
						editor.window = editor.document = iframe = mainElement = isPendingFocus = null;

						editor.fire( 'contentDomUnload' );
					},

					focus: function() {
						if ( isLoadingData )
							isPendingFocus = true;
						else if ( editor.window ) {
							editor.window.focus();
							editor.selectionChange();
						}
					}
				});

				editor.on( 'insertHtml', onInsertHtml, null, null, 20 );
				editor.on( 'insertElement', onInsertElement, null, null, 20 );
				// Auto fixing on some document structure weakness to enhance usabilities. (#3190 and #3189)
				editor.on( 'selectionChange', onSelectionChangeFixBody, null, null, 1 );
			});

			// Create an invisible element to grab focus.
			if ( CKEDITOR.env.ie ) {
				var ieFocusGrabber;
				editor.on( 'uiReady', function() {
					ieFocusGrabber = editor.container.append( CKEDITOR.dom.element.createFromHtml( '<input tabindex="-1" style="position:absolute; left:-10000">' ) );

					ieFocusGrabber.on( 'focus', function() {
						editor.focus();
					});
				});
			}
		}
	});

	// Fixing Firefox 'Back-Forward Cache' break design mode. (#4514)
	if ( CKEDITOR.env.gecko ) {
		var topWin = window.top;

		(function() {
			var topBody = topWin.document.body;

			if ( !topBody )
				topWin.addEventListener( 'load', arguments.callee, false );
			else {
				topBody.setAttribute( 'onpageshow', topBody.getAttribute( 'onpageshow' ) + ';event.persisted && CKEDITOR.tools.callFunction(' +
					CKEDITOR.tools.addFunction( function() {
					var allInstances = CKEDITOR.instances,
						editor, doc;
					for ( var i in allInstances ) {
						editor = allInstances[ i ];
						doc = editor.document;
						if ( doc ) {
							doc.$.designMode = 'off';
							doc.$.designMode = 'on';
						}
					}
				}) + ')' );
			}
		})();

	}
})();

/**
 * Disables the ability of resize objects (image and tables) in the editing
 * area.
 * @type Boolean
 * @default false
 * @example
 * config.disableObjectResizing = true;
 */
CKEDITOR.config.disableObjectResizing = false;

/**
 * Disables the "table tools" offered natively by the browser (currently
 * Firefox only) to make quick table editing operations, like adding or
 * deleting rows and columns.
 * @type Boolean
 * @default true
 * @example
 * config.disableNativeTableHandles = false;
 */
CKEDITOR.config.disableNativeTableHandles = true;

/**
 * Disables the built-in spell checker while typing natively available in the
 * browser (currently Firefox and Safari only).<br /><br />
 *
 * Even if word suggestions will not appear in the CKEditor context menu, this
 * feature is useful to help quickly identifying misspelled words.<br /><br />
 *
 * This setting is currently compatible with Firefox only due to limitations in
 * other browsers.
 * @type Boolean
 * @default true
 * @example
 * config.disableNativeSpellChecker = false;
 */
CKEDITOR.config.disableNativeSpellChecker = true;

/**
 * Whether the editor must output an empty value ("") if it's contents is made
 * by an empty paragraph only.
 * @type Boolean
 * @default true
 * @example
 * config.ignoreEmptyParagraph = false;
 */
CKEDITOR.config.ignoreEmptyParagraph = true;
