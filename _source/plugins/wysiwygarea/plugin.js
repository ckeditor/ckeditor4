/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview The "wysiwygarea" plugin. It registers the "wysiwyg" editing
 *		mode, which handles the main editing area space.
 */

(function() {
	// List of elements in which has no way to move editing focus outside.
	var nonExitableElementNames = { table:1,pre:1 };

	// Matching an empty paragraph at the end of document.
	var emptyParagraphRegexp = /\s*<(p|div|address|h\d|center|li)[^>]*>\s*(?:<br[^>]*>|&nbsp;|\u00A0|&#160;)?\s*(:?<\/\1>)?\s*(?=$|<\/body>)/gi;

	var notWhitespaceEval = CKEDITOR.dom.walker.whitespaces( true );

	function onInsertHtml( evt ) {
		if ( this.mode == 'wysiwyg' ) {
			this.focus();
			this.fire( 'saveSnapshot' );

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

			// Webkit does not scroll to the cursor position after pasting (#5558)
			if ( CKEDITOR.env.webkit ) {
				this.document.$.execCommand( 'inserthtml', false, '<span id="cke_paste_marker" cke_temp="1"></span>' );
				var marker = this.document.getById( 'cke_paste_marker' );
				marker.scrollIntoView();
				marker.remove();
			}

			CKEDITOR.tools.setTimeout( function() {
				this.fire( 'saveSnapshot' );
			}, 0, this );
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

			// If we're inserting a block element immediatelly followed by
			// another block element, the selection must move there. (#3100,#5436)
			if ( isBlock ) {
				var next = lastElement.getNext( notWhitespaceEval ),
					nextName = next && next.type == CKEDITOR.NODE_ELEMENT && next.getName();

				// Check if it's a block element that accepts text.
				if ( nextName && CKEDITOR.dtd.$block[ nextName ] && CKEDITOR.dtd[ nextName ][ '#' ] )
					range.moveToElementEditStart( next );
			}

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

	function restoreSelection( selection ) {
		if ( selection.isLocked ) {
			selection.unlock();
			setTimeout( function() {
				selection.lock();
			}, 0 );
		}
	}

	function isBlankParagraph( block ) {
		return block.getOuterHtml().match( emptyParagraphRegexp );
	}

	isNotWhitespace = CKEDITOR.dom.walker.whitespaces( true );

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
			editor.fire( 'updateSnapshot' );
			restoreDirty( editor );
			CKEDITOR.env.ie && restoreSelection( selection );

			var fixedBlock = range.fixBlock( true, editor.config.enterMode == CKEDITOR.ENTER_DIV ? 'div' : 'p' );

			// For IE, we should remove any filler node which was introduced before.
			if ( CKEDITOR.env.ie ) {
				var first = fixedBlock.getFirst( isNotEmpty );
				first && isNbsp( first ) && first.remove();
			}

			// If the fixed block is actually blank and is already followed by an exitable blank
			// block, we should revert the fix and move into the existed one. (#3684)
			if ( isBlankParagraph( fixedBlock ) ) {
				var previousElement = fixedBlock.getPrevious( isNotWhitespace ),
					nextElement = fixedBlock.getNext( isNotWhitespace );

				if ( previousElement && previousElement.getName && !( previousElement.getName() in nonExitableElementNames ) && isBlankParagraph( previousElement ) && range.moveToElementEditStart( previousElement ) || nextElement && nextElement.getName && !( nextElement.getName() in nonExitableElementNames ) && isBlankParagraph( nextElement ) && range.moveToElementEditStart( nextElement ) ) {
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
		var walkerRange = new CKEDITOR.dom.range( editor.document ),
			walker = new CKEDITOR.dom.walker( walkerRange );
		walkerRange.selectNodeContents( body );
		walker.evaluator = function( node ) {
			return node.type == CKEDITOR.NODE_ELEMENT && ( node.getName() in nonExitableElementNames );
		};
		walker.guard = function( node, isMoveout ) {
			return !( ( node.type == CKEDITOR.NODE_TEXT && isNotWhitespace( node ) ) || isMoveout );
		};

		if ( walker.previous() ) {
			editor.fire( 'updateSnapshot' );
			restoreDirty( editor );
			CKEDITOR.env.ie && restoreSelection( selection );

			var paddingBlock;
			if ( enterMode != CKEDITOR.ENTER_BR )
				paddingBlock = body.append( new CKEDITOR.dom.element( enterMode == CKEDITOR.ENTER_P ? 'p' : 'div' ) );
			else
				paddingBlock = body;

			if ( !CKEDITOR.env.ie )
				paddingBlock.appendBogus();
		}
	}

	CKEDITOR.plugins.add( 'wysiwygarea', {
		requires: [ 'editingblock' ],

		init: function( editor ) {
			var fixForBody = ( editor.config.enterMode != CKEDITOR.ENTER_BR ) ? editor.config.enterMode == CKEDITOR.ENTER_DIV ? 'div' : 'p' : false;

			var frameLabel = editor.lang.editorTitle.replace( '%1', editor.name );

			var contentDomReadyHandler;
			editor.on( 'editingBlockReady', function() {
				var mainElement, iframe, isLoadingData, isPendingFocus, frameLoaded, fireMode;


				// Support for custom document.domain in IE.
				var isCustomDomain = CKEDITOR.env.isCustomDomain();

				// Creates the iframe that holds the editable document.
				var createIFrame = function( data ) {
						if ( iframe )
							iframe.remove();


						var srcScript = 'document.open();' +

							// The document domain must be set any time we
						// call document.open().
						( isCustomDomain ? ( 'document.domain="' + document.domain + '";' ) : '' ) +

							'document.close();';

						iframe = CKEDITOR.dom.element.createFromHtml( '<iframe' +
							' style="width:100%;height:100%"' +
							' frameBorder="0"' +
							' title="' + frameLabel + '"' +
							// With IE, the custom domain has to be taken care at first,
						// for other browers, the 'src' attribute should be left empty to
						// trigger iframe's 'load' event.
													' src="' + ( CKEDITOR.env.ie ? 'javascript:void(function(){' + encodeURIComponent( srcScript ) + '}())' : '' ) + '"' +
							' tabIndex="' + ( CKEDITOR.env.webkit ? -1 : editor.tabIndex ) + '"' +
							' allowTransparency="true"' +
							'></iframe>' );

						// With FF, it's better to load the data on iframe.load. (#3894,#4058)
						iframe.on( 'load', function( ev ) {
							frameLoaded = 1;
							ev.removeListener();

							var doc = iframe.getFrameDocument().$;

							// Don't leave any history log in IE. (#5657)
							doc.open( "text/html", "replace" );
							doc.write( data );
							doc.close();
						});

						mainElement.append( iframe );
					};

				// The script that launches the bootstrap logic on 'domReady', so the document
				// is fully editable even before the editing iframe is fully loaded (#4455).
				contentDomReadyHandler = CKEDITOR.tools.addFunction( contentDomReady );
				var activationScript = '<script id="cke_actscrpt" type="text/javascript" cke_temp="1">' +
					( isCustomDomain ? ( 'document.domain="' + document.domain + '";' ) : '' ) +
					'window.parent.CKEDITOR.tools.callFunction( ' + contentDomReadyHandler + ', window );' +
					'</script>';

				// Editing area bootstrap code.
				function contentDomReady( domWindow ) {
					if ( !frameLoaded )
						return;
					frameLoaded = 0;

					editor.fire( 'ariaWidget', iframe );

					var domDocument = domWindow.document,
						body = domDocument.body;

					// Remove this script from the DOM.
					var script = domDocument.getElementById( "cke_actscrpt" );
					script.parentNode.removeChild( script );

					body.spellcheck = !editor.config.disableNativeSpellChecker;

					if ( CKEDITOR.env.ie ) {
						// Don't display the focus border.
						body.hideFocus = true;

						// Disable and re-enable the body to avoid IE from
						// taking the editing focus at startup. (#141 / #523)
						body.disabled = true;
						body.contentEditable = true;
						body.removeAttribute( 'disabled' );
					} else {
						// Avoid opening design mode in a frame window thread,
						// which will cause host page scrolling.(#4397)
						setTimeout( function() {
							// Prefer 'contentEditable' instead of 'designMode'. (#3593)
							if ( CKEDITOR.env.gecko && CKEDITOR.env.version >= 10900 || CKEDITOR.env.opera )
								domDocument.$.body.contentEditable = true;
							else if ( CKEDITOR.env.webkit )
								domDocument.$.body.parentNode.contentEditable = true;
							else
								domDocument.$.designMode = 'on';
						}, 0 );
					}

					// Gecko need a key event to 'wake up' the editing
					// ability when document is empty.(#3864)
					if ( CKEDITOR.env.gecko && !body.childNodes.length ) {
						setTimeout( function() {
							restoreDirty( editor );

							// Simulating keyboard character input by dispatching a keydown of white-space text.
							var keyEventSimulate = domDocument.$.createEvent( "KeyEvents" );
							keyEventSimulate.initKeyEvent( 'keypress', true, true, domWindow.$, false, false, false, false, 0, 32 );
							domDocument.$.dispatchEvent( keyEventSimulate );

							// Restore the original document status by placing the cursor before a bogus br created (#5021).
							domDocument.createElement( 'br', {
								attributes: { '_moz_editor_bogus_node': 'TRUE', '_moz_dirty': "" } } ).replace( domDocument.getBody().getFirst() );
							var nativeRange = new CKEDITOR.dom.range( domDocument );
							nativeRange.setStartAt( new CKEDITOR.dom.element( body ), CKEDITOR.POSITION_AFTER_START );
							nativeRange.select();
						}, 0 );
					}

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

					domDocument.on( 'dblclick', function( evt ) {
						var element = evt.data.getTarget(),
							data = { element: element, dialog: '' };
						editor.fire( 'doubleclick', data );
						data.dialog && editor.openDialog( data.dialog );
					});

					// Gecko/Webkit need some help when selecting control type elements. (#3448)
					if ( !( CKEDITOR.env.ie || CKEDITOR.env.opera ) ) {
						domDocument.on( 'mousedown', function( ev ) {
							var control = ev.data.getTarget();
							if ( control.is( 'img', 'hr', 'input', 'textarea', 'select' ) )
								editor.getSelection().selectElement( control );
						});
					}

					if ( CKEDITOR.env.gecko ) {
						domDocument.on( 'mouseup', function( ev ) {
							if ( ev.data.$.button == 2 ) {
								var target = ev.data.getTarget();

								// Prevent right click from selecting an empty block even
								// when selection is anchored inside it. (#5845)
								if ( !target.getOuterHtml().replace( emptyParagraphRegexp, '' ) ) {
									var range = new CKEDITOR.dom.range( domDocument );
									range.moveToElementEditStart( target );
									range.select( true );
								}
							}
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
					if ( CKEDITOR.env.ie && domDocument.$.compatMode == 'CSS1Compat' || CKEDITOR.env.gecko || CKEDITOR.env.opera ) {
						var htmlElement = domDocument.getDocumentElement();
						htmlElement.on( 'mousedown', function( evt ) {
							// Setting focus directly on editor doesn't work, we
							// have to use here a temporary element to 'redirect'
							// the focus.
							if ( evt.data.getTarget().equals( htmlElement ) ) {
								if ( CKEDITOR.env.gecko && CKEDITOR.env.version >= 10900 )
									blinkCursor();
								focusGrabber.focus();
							}
						});
					}

					domWindow.on( 'blur', function() {
						editor.focusManager.blur();
					});

					domWindow.on( 'focus', function() {
						var doc = editor.document;

						if ( CKEDITOR.env.gecko && CKEDITOR.env.version >= 10900 )
							blinkCursor();
						else if ( CKEDITOR.env.opera )
							doc.getBody().focus();
						else if ( CKEDITOR.env.webkit ) {
							// Selection will get lost after move focus
							// to document element, save it first.
							var sel = editor.getSelection(),
								type = sel.getType(),
								range = ( type != CKEDITOR.SELECTION_NONE ) && sel.getRanges()[ 0 ];

							doc.getDocumentElement().focus();
							range && range.select();
						}

						editor.focusManager.focus();
					});

					var keystrokeHandler = editor.keystrokeHandler;
					if ( keystrokeHandler )
						keystrokeHandler.attach( domDocument );

					if ( CKEDITOR.env.ie ) {
						domDocument.getDocumentElement().addClass( domDocument.$.compatMode );
						// Override keystrokes which should have deletion behavior
						//  on control types in IE . (#4047)
						domDocument.on( 'keydown', function( evt ) {
							var keyCode = evt.data.getKeystroke();

							// Backspace OR Delete.
							if ( keyCode in { 8:1,46:1 } ) {
								var sel = editor.getSelection(),
									control = sel.getSelectedElement();

								if ( control ) {
									// Make undo snapshot.
									editor.fire( 'saveSnapshot' );

									// Delete any element that 'hasLayout' (e.g. hr,table) in IE8 will
									// break up the selection, safely manage it here. (#4795)
									var bookmark = sel.getRanges()[ 0 ].createBookmark();
									// Remove the control manually.
									control.remove();
									sel.selectBookmarks( [ bookmark ] );

									editor.fire( 'saveSnapshot' );

									evt.data.preventDefault();
								}
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
				}

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

						var config = editor.config,
							fullPage = config.fullPage,
							docType = config.docType;

						// Build the additional stuff to be included into <head>.
						var headExtra = '<style type="text/css" cke_temp="1">' +
							editor._.styles.join( '\n' ) +
							'</style>';

						!fullPage && ( headExtra = CKEDITOR.tools.buildStyleHtml( editor.config.contentsCss ) + headExtra );

						var baseTag = config.baseHref ? '<base href="' + config.baseHref + '" cke_temp="1" />' : '';

						if ( fullPage ) {
							// Search and sweep out the doctype declaration.
							data = data.replace( /<!DOCTYPE[^>]*>/i, function( match ) {
								editor.docType = docType = match;
								return '';
							});
						}

						// Get the HTML version of the data.
						if ( editor.dataProcessor )
							data = editor.dataProcessor.toHtml( data, fixForBody );

						if ( fullPage ) {
							// Check if the <body> tag is available.
							if ( !( /<body[\s|>]/ ).test( data ) )
								data = '<body>' + data;

							// Check if the <html> tag is available.
							if ( !( /<html[\s|>]/ ).test( data ) )
								data = '<html>' + data + '</html>';

							// Check if the <head> tag is available.
							if ( !( /<head[\s|>]/ ).test( data ) )
								data = data.replace( /<html[^>]*>/, '$&<head><title></title></head>' );
							else if ( !( /<title[\s|>]/ ).test( data ) )
								data = data.replace( /<head[^>]*>/, '$&<title></title>' );

							// The base must be the first tag in the HEAD, e.g. to get relative
							// links on styles.
							baseTag && ( data = data.replace( /<head>/, '$&' + baseTag ) );

							// Inject the extra stuff into <head>.
							// Attention: do not change it before testing it well. (V2)
							// This is tricky... if the head ends with <meta ... content type>,
							// Firefox will break. But, it works if we place our extra stuff as
							// the last elements in the HEAD.
							data = data.replace( /<\/head\s*>/, headExtra + '$&' );

							// Add the DOCTYPE back to it.
							data = docType + data;
						} else {
							data = config.docType + '<html dir="' + config.contentsLangDirection + '"' +
																			' lang="' + ( config.contentsLanguage || editor.langCode ) + '">' +
																		'<head>' +
																			'<title>' + frameLabel + '</title>' +
																			baseTag +
																			headExtra +
																		'</head>' +
																		'<body' + ( config.bodyId ? ' id="' + config.bodyId + '"' : '' ) +
																					( config.bodyClass ? ' class="' + config.bodyClass + '"' : '' ) +
																					'>' +
																			data +
																		'</html>';
						}

						data += activationScript;


						// The iframe is recreated on each call of setData, so we need to clear DOM objects
						this.onDispose();
						createIFrame( data );
					},

					getData: function() {
						var config = editor.config,
							fullPage = config.fullPage,
							docType = fullPage && editor.docType,
							doc = iframe.getFrameDocument();

						var data = fullPage ? doc.getDocumentElement().getOuterHtml() : doc.getBody().getHtml();

						if ( editor.dataProcessor )
							data = editor.dataProcessor.toDataFormat( data, fixForBody );

						// Strip the last blank paragraph within document.
						if ( config.ignoreEmptyParagraph )
							data = data.replace( emptyParagraphRegexp, '' );

						if ( docType )
							data = docType + '\n' + data;

						return data;
					},

					getSnapshotData: function() {
						return iframe.getFrameDocument().getBody().getHtml();
					},

					loadSnapshotData: function( data ) {
						iframe.getFrameDocument().getBody().setHtml( data );
					},

					onDispose: function() {
						if ( !editor.document )
							return;

						editor.document.getDocumentElement().clearCustomData();
						editor.document.getBody().clearCustomData();

						editor.window.clearCustomData();
						editor.document.clearCustomData();

						iframe.clearCustomData();

						/*
						 * IE BUG: When destroying editor DOM with the selection remains inside
						 * editing area would break IE7/8's selection system, we have to put the editing
						 * iframe offline first. (#3812 and #5441)
						 */
						iframe.remove();
					},

					unload: function( holderElement ) {
						this.onDispose();

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

			var titleBackup;
			// Setting voice label as window title, backup the original one
			// and restore it before running into use.
			editor.on( 'contentDom', function() {
				var title = editor.document.getElementsByTag( 'title' ).getItem( 0 );
				title.setAttribute( '_cke_title', editor.document.$.title );
				editor.document.$.title = frameLabel;
			});

			// IE8 stricts mode doesn't have 'contentEditable' in effect
			// on element unless it has layout. (#5562)
			if ( CKEDITOR.env.ie8Compat ) {
				editor.addCss( 'html.CSS1Compat [contenteditable=false]{ min-height:0 !important;}' );

				var selectors = [];
				for ( var tag in CKEDITOR.dtd.$removeEmpty )
					selectors.push( 'html.CSS1Compat ' + tag + '[contenteditable=false]' );
				editor.addCss( selectors.join( ',' ) + '{ display:inline-block;}' );
			}

			// Switch on design mode for a short while and close it after then.
			function blinkCursor( retry ) {
				CKEDITOR.tools.tryThese( function() {
					editor.document.$.designMode = 'on';
					setTimeout( function() {
						editor.document.$.designMode = 'off';
						editor.document.getBody().focus();
					}, 50 );
				}, function() {
					// The above call is known to fail when parent DOM
					// tree layout changes may break design mode. (#5782)
					// Refresh the 'contentEditable' is a cue to this.
					editor.document.$.designMode = 'off';
					var body = editor.document.getBody();
					body.setAttribute( 'contentEditable', false );
					body.setAttribute( 'contentEditable', true );
					// Try it again once..
					!retry && blinkCursor( 1 );
				});
			}

			// Create an invisible element to grab focus.
			if ( CKEDITOR.env.gecko || CKEDITOR.env.ie || CKEDITOR.env.opera ) {
				var focusGrabber;
				editor.on( 'uiReady', function() {
					focusGrabber = editor.container.append( CKEDITOR.dom.element.createFromHtml(
					// Use 'span' instead of anything else to fly under the screen-reader radar. (#5049)
					'<span tabindex="-1" style="position:absolute; left:-10000" role="presentation"></span>' ) );

					focusGrabber.on( 'focus', function() {
						editor.focus();
					});
				});
				editor.on( 'destroy', function() {
					CKEDITOR.tools.removeFunction( contentDomReadyHandler );
					focusGrabber.clearCustomData();
				});
			}

			// Disable form elements editing mode provided by some browers. (#5746)
			editor.on( 'insertElement', function( evt ) {
				var element = evt.data;
				if ( element.type == CKEDITOR.NODE_ELEMENT && ( element.is( 'input' ) || element.is( 'textarea' ) ) ) {
					element.setAttribute( 'contentEditable', false );
				}
			});

		}
	});

	// Fixing Firefox 'Back-Forward Cache' break design mode. (#4514)
	if ( CKEDITOR.env.gecko ) {
		(function() {
			var body = document.body;

			if ( !body )
				window.addEventListener( 'load', arguments.callee, false );
			else {
				var currentHandler = body.getAttribute( 'onpageshow' );
				body.setAttribute( 'onpageshow', ( currentHandler ? currentHandler + ';' : '' ) + 'event.persisted && (function(){' +
					'var allInstances = CKEDITOR.instances, editor, doc;' +
					'for ( var i in allInstances )' +
					'{' +
					'	editor = allInstances[ i ];' +
					'	doc = editor.document;' +
					'	if ( doc )' +
					'	{' +
					'		doc.$.designMode = "off";' +
					'		doc.$.designMode = "on";' +
					'	}' +
					'}' +
					'})();' );
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

/**
 * Fired when data is loaded and ready for retrieval in an editor instance.
 * @name CKEDITOR.editor#dataReady
 * @event
 */
