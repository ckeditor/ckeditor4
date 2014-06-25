/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @ignore
 * File overview: Clipboard support.
 */

//
// COPY & PASTE EXECUTION FLOWS:
// -- CTRL+C
//		* browser's default behaviour
// -- CTRL+V
//		* listen onKey (onkeydown)
//		* simulate 'beforepaste' for non-IEs on editable
//		* simulate 'paste' for Fx2/Opera on editable
//		* listen 'onpaste' on editable ('onbeforepaste' for IE)
//		* fire 'beforePaste' on editor
//		* !canceled && getClipboardDataByPastebin
//		* fire 'paste' on editor
//		* !canceled && fire 'afterPaste' on editor
// -- CTRL+X
//		* listen onKey (onkeydown)
//		* fire 'saveSnapshot' on editor
//		* browser's default behaviour
//		* deferred second 'saveSnapshot' event
// -- Copy command
//		* tryToCutCopy
//			* execCommand
//		* !success && alert
// -- Cut command
//		* fixCut
//		* tryToCutCopy
//			* execCommand
//		* !success && alert
// -- Paste command
//		* fire 'paste' on editable ('beforepaste' for IE)
//		* !canceled && execCommand 'paste'
//		* !success && fire 'pasteDialog' on editor
// -- Paste from native context menu & menubar
//		(Fx & Webkits are handled in 'paste' default listner.
//		Opera cannot be handled at all because it doesn't fire any events
//		Special treatment is needed for IE, for which is this part of doc)
//		* listen 'onpaste'
//		* cancel native event
//		* fire 'beforePaste' on editor
//		* !canceled && getClipboardDataByPastebin
//		* execIECommand( 'paste' ) -> this fires another 'paste' event, so cancel it
//		* fire 'paste' on editor
//		* !canceled && fire 'afterPaste' on editor
//
//
// PASTE EVENT - PREPROCESSING:
// -- Possible dataValue types: auto, text, html.
// -- Possible dataValue contents:
//		* text (possible \n\r)
//		* htmlified text (text + br,div,p - no presentional markup & attrs - depends on browser)
//		* html
// -- Possible flags:
//		* htmlified - if true then content is a HTML even if no markup inside. This flag is set
//			for content from editable pastebins, because they 'htmlify' pasted content.
//
// -- Type: auto:
//		* content: htmlified text ->	filter, unify text markup (brs, ps, divs), set type: text
//		* content: html ->				filter, set type: html
// -- Type: text:
//		* content: htmlified text ->	filter, unify text markup
//		* content: html ->				filter, strip presentional markup, unify text markup
// -- Type: html:
//		* content: htmlified text ->	filter, unify text markup
//		* content: html ->				filter
//
// -- Phases:
//		* filtering (priorities 3-5) - e.g. pastefromword filters
//		* content type sniffing (priority 6)
//		* markup transformations for text (priority 6)
//
// DRAG & DROP EXECUTION FLOWS:
// -- Drag
//		* save to the global object:
//			* drag timestamp (with 'cke-' prefix),
//			* selected html,
//			* drag range,
//			* editor instance.
//		* put drag timestamp into event.dataTransfer.text
// -- Drop
//		* if events text == saved timestamp && editor == saved editor
//			internal drag & drop occurred
//			* getRangeAtDropPosition
//			* create bookmarks for drag and drop ranges starting from the end of the document
//			* dragRange.deleteContents()
//			* fire 'paste' with saved html
//		* if events text == saved timestamp && editor != saved editor
//			cross editor drag & drop occurred
//			* getRangeAtDropPosition
//			* fire 'paste' with saved html
//			* dragRange.deleteContents()
//			* FF: refreshCursor on afterPaste
//		* if events text != saved timestamp
//			drop form external source occurred
//			* getRangeAtDropPosition
//			* if event contains html data then fire 'paste' with html
//			* else if event contains text data then fire 'paste' with encoded text
//			* FF: refreshCursor on afterPaste

'use strict';

( function() {
	// Register the plugin.
	CKEDITOR.plugins.add( 'clipboard', {
		requires: 'dialog',
		lang: 'af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		icons: 'copy,copy-rtl,cut,cut-rtl,paste,paste-rtl', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		init: function( editor ) {
			var textificationFilter;

			initClipboard( editor );

			CKEDITOR.dialog.add( 'paste', CKEDITOR.getUrl( this.path + 'dialogs/paste.js' ) );

			editor.on( 'paste', function( evt ) {
				var data = evt.data.dataValue,
					blockElements = CKEDITOR.dtd.$block;

				// Filter webkit garbage.
				if ( data.indexOf( 'Apple-' ) > -1 ) {
					// Replace special webkit's &nbsp; with simple space, because webkit
					// produces them even for normal spaces.
					data = data.replace( /<span class="Apple-converted-space">&nbsp;<\/span>/gi, ' ' );

					// Strip <span> around white-spaces when not in forced 'html' content type.
					// This spans are created only when pasting plain text into Webkit,
					// but for safety reasons remove them always.
					if ( evt.data.type != 'html' )
						data = data.replace( /<span class="Apple-tab-span"[^>]*>([^<]*)<\/span>/gi, function( all, spaces ) {
						// Replace tabs with 4 spaces like Fx does.
						return spaces.replace( /\t/g, '&nbsp;&nbsp; &nbsp;' );
					} );

					// This br is produced only when copying & pasting HTML content.
					if ( data.indexOf( '<br class="Apple-interchange-newline">' ) > -1 ) {
						evt.data.startsWithEOL = 1;
						evt.data.preSniffing = 'html'; // Mark as not text.
						data = data.replace( /<br class="Apple-interchange-newline">/, '' );
					}

					// Remove all other classes.
					data = data.replace( /(<[^>]+) class="Apple-[^"]*"/gi, '$1' );
				}

				// Strip editable that was copied from inside. (#9534)
				if ( data.match( /^<[^<]+cke_(editable|contents)/i ) ) {
					var tmp,
						editable_wrapper,
						wrapper = new CKEDITOR.dom.element( 'div' );

					wrapper.setHtml( data );
					// Verify for sure and check for nested editor UI parts. (#9675)
					while ( wrapper.getChildCount() == 1 &&
							( tmp = wrapper.getFirst() ) &&
							tmp.type == CKEDITOR.NODE_ELEMENT &&	// Make sure first-child is element.
							( tmp.hasClass( 'cke_editable' ) || tmp.hasClass( 'cke_contents' ) ) ) {
						wrapper = editable_wrapper = tmp;
					}

					// If editable wrapper was found strip it and bogus <br> (added on FF).
					if ( editable_wrapper )
						data = editable_wrapper.getHtml().replace( /<br>$/i, '' );
				}

				if ( CKEDITOR.env.ie ) {
					// &nbsp; <p> -> <p> (br.cke-pasted-remove will be removed later)
					data = data.replace( /^&nbsp;(?: |\r\n)?<(\w+)/g, function( match, elementName ) {
						if ( elementName.toLowerCase() in blockElements ) {
							evt.data.preSniffing = 'html'; // Mark as not a text.
							return '<' + elementName;
						}
						return match;
					} );
				} else if ( CKEDITOR.env.webkit ) {
					// </p><div><br></div> -> </p><br>
					// We don't mark br, because this situation can happen for htmlified text too.
					data = data.replace( /<\/(\w+)><div><br><\/div>$/, function( match, elementName ) {
						if ( elementName in blockElements ) {
							evt.data.endsWithEOL = 1;
							return '</' + elementName + '>';
						}
						return match;
					} );
				} else if ( CKEDITOR.env.gecko ) {
					// Firefox adds bogus <br> when user pasted text followed by space(s).
					data = data.replace( /(\s)<br>$/, '$1' );
				}

				evt.data.dataValue = data;
			}, null, null, 3 );

			editor.on( 'paste', function( evt ) {
				var dataObj = evt.data,
					type = dataObj.type,
					data = dataObj.dataValue,
					trueType,
					// Default is 'html'.
					defaultType = editor.config.clipboard_defaultContentType || 'html';

				// If forced type is 'html' we don't need to know true data type.
				if ( type == 'html' || dataObj.preSniffing == 'html' )
					trueType = 'html';
				else
					trueType = recogniseContentType( data );

				// Unify text markup.
				if ( trueType == 'htmlifiedtext' )
					data = htmlifiedTextHtmlification( editor.config, data );
				// Strip presentional markup & unify text markup.
				else if ( type == 'text' && trueType == 'html' ) {
					// Init filter only if needed and cache it.
					data = htmlTextification( editor.config, data, textificationFilter || ( textificationFilter = getTextificationFilter( editor ) ) );
				}

				if ( dataObj.startsWithEOL )
					data = '<br data-cke-eol="1">' + data;
				if ( dataObj.endsWithEOL )
					data += '<br data-cke-eol="1">';

				if ( type == 'auto' )
					type = ( trueType == 'html' || defaultType == 'html' ) ? 'html' : 'text';

				dataObj.type = type;
				dataObj.dataValue = data;
				delete dataObj.preSniffing;
				delete dataObj.startsWithEOL;
				delete dataObj.endsWithEOL;
			}, null, null, 6 );

			// Inserts processed data into the editor at the end of the
			// events chain.
			editor.on( 'paste', function( evt ) {
				var data = evt.data;

				editor.insertHtml( data.dataValue, data.type );

				// Deferr 'afterPaste' so all other listeners for 'paste' will be fired first.
				setTimeout( function() {
					editor.fire( 'afterPaste' );
				}, 0 );
			}, null, null, 1000 );

			editor.on( 'pasteDialog', function( evt ) {
				// TODO it's possible that this setTimeout is not needed any more,
				// because of changes introduced in the same commit as this comment.
				// Editor.getClipboardData adds listner to the dialog's events which are
				// fired after a while (not like 'showDialog').
				setTimeout( function() {
					// Open default paste dialog.
					editor.openDialog( 'paste', evt.data );
				}, 0 );
			} );
		}
	} );

	function initClipboard( editor ) {
		var preventBeforePasteEvent = 0,
			preventPasteEvent = 0,
			inReadOnly = 0,
			// Safari doesn't like 'beforepaste' event - it sometimes doesn't
			// properly handles ctrl+c. Probably some race-condition between events.
			// Chrome and Firefox works well with both events, so better to use 'paste'
			// which will handle pasting from e.g. browsers' menu bars.
			// IE7/8 doesn't like 'paste' event for which it's throwing random errors.
			mainPasteEvent = CKEDITOR.env.ie ? 'beforepaste' : 'paste';

		addListeners();
		addButtonsCommands();

		/**
		 * Gets clipboard data by directly accessing the clipboard (IE only) or opening paste dialog.
		 *
		 *		editor.getClipboardData( { title: 'Get my data' }, function( data ) {
		 *			if ( data )
		 *				alert( data.type + ' ' + data.dataValue );
		 *		} );
		 *
		 * @member CKEDITOR.editor
		 * @param {Object} options
		 * @param {String} [options.title] Title of paste dialog.
		 * @param {Function} callback Function that will be executed with `data.type` and `data.dataValue`
		 * or `null` if none of the capturing method succeeded.
		 */
		editor.getClipboardData = function( options, callback ) {
			var beforePasteNotCanceled = false,
				dataType = 'auto',
				dialogCommited = false;

			// Options are optional - args shift.
			if ( !callback ) {
				callback = options;
				options = null;
			}

			// Listen with maximum priority to handle content before everyone else.
			// This callback will handle paste event that will be fired if direct
			// access to the clipboard succeed in IE.
			editor.on( 'paste', onPaste, null, null, 0 );

			// Listen at the end of listeners chain to see if event wasn't canceled
			// and to retrieve modified data.type.
			editor.on( 'beforePaste', onBeforePaste, null, null, 1000 );

			// getClipboardDataDirectly() will fire 'beforePaste' synchronously, so we can
			// check if it was canceled and if any listener modified data.type.

			// If command didn't succeed (only IE allows to access clipboard and only if
			// user agrees) open and handle paste dialog.
			if ( getClipboardDataDirectly() === false ) {
				// Direct access to the clipboard wasn't successful so remove listener.
				editor.removeListener( 'paste', onPaste );

				// If beforePaste was canceled do not open dialog.
				// Add listeners only if dialog really opened. 'pasteDialog' can be canceled.
				if ( beforePasteNotCanceled && editor.fire( 'pasteDialog', onDialogOpen ) ) {
					editor.on( 'pasteDialogCommit', onDialogCommit );

					// 'dialogHide' will be fired after 'pasteDialogCommit'.
					editor.on( 'dialogHide', function( evt ) {
						evt.removeListener();
						evt.data.removeListener( 'pasteDialogCommit', onDialogCommit );

						// Because Opera has to wait a while in pasteDialog we have to wait here.
						setTimeout( function() {
							// Notify even if user canceled dialog (clicked 'cancel', ESC, etc).
							if ( !dialogCommited )
								callback( null );
						}, 10 );
					} );
				} else
					callback( null );
			}

			function onPaste( evt ) {
				evt.removeListener();
				evt.cancel();
				callback( evt.data );
			}

			function onBeforePaste( evt ) {
				evt.removeListener();
				beforePasteNotCanceled = true;
				dataType = evt.data.type;
			}

			function onDialogCommit( evt ) {
				evt.removeListener();
				// Cancel pasteDialogCommit so paste dialog won't automatically fire
				// 'paste' evt by itself.
				evt.cancel();
				dialogCommited = true;
				callback( { type: dataType, dataValue: evt.data } );
			}

			function onDialogOpen() {
				this.customTitle = ( options && options.title );
			}
		};

		function addButtonsCommands() {
			addButtonCommand( 'Cut', 'cut', createCutCopyCmd( 'cut' ), 10, 1 );
			addButtonCommand( 'Copy', 'copy', createCutCopyCmd( 'copy' ), 20, 4 );
			addButtonCommand( 'Paste', 'paste', createPasteCmd(), 30, 8 );

			function addButtonCommand( buttonName, commandName, command, toolbarOrder, ctxMenuOrder ) {
				var lang = editor.lang.clipboard[ commandName ];

				editor.addCommand( commandName, command );
				editor.ui.addButton && editor.ui.addButton( buttonName, {
					label: lang,
					command: commandName,
					toolbar: 'clipboard,' + toolbarOrder
				} );

				// If the "menu" plugin is loaded, register the menu item.
				if ( editor.addMenuItems ) {
					editor.addMenuItem( commandName, {
						label: lang,
						command: commandName,
						group: 'clipboard',
						order: ctxMenuOrder
					} );
				}
			}
		}

		function addListeners() {
			editor.on( 'key', onKey );
			editor.on( 'contentDom', addListenersToEditable );

			// For improved performance, we're checking the readOnly state on selectionChange instead of hooking a key event for that.
			editor.on( 'selectionChange', function( evt ) {
				inReadOnly = evt.data.selection.getRanges()[ 0 ].checkReadOnly();
				setToolbarStates();
			} );

			// If the "contextmenu" plugin is loaded, register the listeners.
			if ( editor.contextMenu ) {
				editor.contextMenu.addListener( function( element, selection ) {
					inReadOnly = selection.getRanges()[ 0 ].checkReadOnly();
					return {
						cut: stateFromNamedCommand( 'cut' ),
						copy: stateFromNamedCommand( 'copy' ),
						paste: stateFromNamedCommand( 'paste' )
					};
				} );
			}
		}

		// Add events listeners to editable.
		function addListenersToEditable() {
			var editable = editor.editable();

			// We'll be catching all pasted content in one line, regardless of whether
			// it's introduced by a document command execution (e.g. toolbar buttons) or
			// user paste behaviors (e.g. CTRL+V).
			editable.on( mainPasteEvent, function( evt ) {
				if ( CKEDITOR.env.ie && preventBeforePasteEvent )
					return;

				// If you've just asked yourself why preventPasteEventNow() is not here, but
				// in listener for CTRL+V and exec method of 'paste' command
				// you've asked the same question we did.
				//
				// THE ANSWER:
				//
				// First thing to notice - this answer makes sense only for IE,
				// because other browsers don't listen for 'paste' event.
				//
				// What would happen if we move preventPasteEventNow() here?
				// For:
				// * CTRL+V - IE fires 'beforepaste', so we prevent 'paste' and pasteDataFromClipboard(). OK.
				// * editor.execCommand( 'paste' ) - we fire 'beforepaste', so we prevent
				//		'paste' and pasteDataFromClipboard() and doc.execCommand( 'Paste' ). OK.
				// * native context menu - IE fires 'beforepaste', so we prevent 'paste', but unfortunately
				//		on IE we fail with pasteDataFromClipboard() here, because of... we don't know why, but
				//		we just fail, so... we paste nothing. FAIL.
				// * native menu bar - the same as for native context menu.
				//
				// But don't you know any way to distinguish first two cases from last two?
				// Only one - special flag set in CTRL+V handler and exec method of 'paste'
				// command. And that's what we did using preventPasteEventNow().

				pasteDataFromClipboard( evt );
			} );

			// It's not possible to clearly handle all four paste methods (ctrl+v, native menu bar
			// native context menu, editor's command) in one 'paste/beforepaste' event in IE.
			//
			// For ctrl+v & editor's command it's easy to handle pasting in 'beforepaste' listener,
			// so we do this. For another two methods it's better to use 'paste' event.
			//
			// 'paste' is always being fired after 'beforepaste' (except of weird one on opening native
			// context menu), so for two methods handled in 'beforepaste' we're canceling 'paste'
			// using preventPasteEvent state.
			//
			// 'paste' event in IE is being fired before getClipboardDataByPastebin executes its callback.
			//
			// QUESTION: Why didn't you handle all 4 paste methods in handler for 'paste'?
			//		Wouldn't this just be simpler?
			// ANSWER: Then we would have to evt.data.preventDefault() only for native
			//		context menu and menu bar pastes. The same with execIECommand().
			//		That would force us to mark CTRL+V and editor's paste command with
			//		special flag, other than preventPasteEvent. But we still would have to
			//		have preventPasteEvent for the second event fired by execIECommand.
			//		Code would be longer and not cleaner.
			CKEDITOR.env.ie && editable.on( 'paste', function( evt ) {
				if ( preventPasteEvent )
					return;
				// Cancel next 'paste' event fired by execIECommand( 'paste' )
				// at the end of this callback.
				preventPasteEventNow();

				// Prevent native paste.
				evt.data.preventDefault();

				pasteDataFromClipboard( evt );

				// Force IE to paste content into pastebin so pasteDataFromClipboard will work.
				if ( !execIECommand( 'paste' ) )
					editor.openDialog( 'paste' );
			} );

			// [IE] Dismiss the (wrong) 'beforepaste' event fired on context/toolbar menu open. (#7953)
			if ( CKEDITOR.env.ie ) {
				editable.on( 'contextmenu', preventBeforePasteEventNow, null, null, 0 );

				editable.on( 'beforepaste', function( evt ) {
					if ( evt.data && !evt.data.$.ctrlKey )
						preventBeforePasteEventNow();
				}, null, null, 0 );

			}

			editable.on( 'beforecut', function() {
				!preventBeforePasteEvent && fixCut( editor );
			} );

			var mouseupTimeout;

			// Use editor.document instead of editable in non-IEs for observing mouseup
			// since editable won't fire the event if selection process started within
			// iframe and ended out of the editor (#9851).
			editable.attachListener( CKEDITOR.env.ie ? editable : editor.document.getDocumentElement(), 'mouseup', function() {
				mouseupTimeout = setTimeout( function() {
					setToolbarStates();
				}, 0 );
			} );

			// Make sure that deferred mouseup callback isn't executed after editor instance
			// had been destroyed. This may happen when editor.destroy() is called in parallel
			// with mouseup event (i.e. a button with onclick callback) (#10219).
			editor.on( 'destroy', function() {
				clearTimeout( mouseupTimeout );
			} );

			editable.on( 'keyup', setToolbarStates );

			// DRAG & DROP

			// #11123 Firefox needs to listen on document, because otherwise event won't be fired.
			// #11086 IE8 cannot listen on document.
			var dropTarget = ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) || editable.isInline() ? editable : editor.document;

			// Listed on dragstart to mark internal and cross-editor D&D
			// and save range and selected HTML.
			editable.attachListener( dropTarget, 'dragstart', function( evt ) {
				// Create a dataTransfer object and save it to the global clipboard.dnd.
				CKEDITOR.plugins.clipboard.initDataTransfer( evt, editor );
			} );

			// Clean up on dragend.
			editable.attachListener( dropTarget, 'dragend', function( evt ) {
				// When DnD is done we need to remove clipboard.dnd so the future
				// external drop will be not recognize as internal.
				CKEDITOR.plugins.clipboard.dnd = undefined;
			} );

			editable.attachListener( dropTarget, 'drop', function( evt ) {
				// Cancel native drop.
				evt.data.preventDefault();

				// Create dataTransfer of get it, if it was created before.
				var dataTransfer = CKEDITOR.plugins.clipboard.initDataTransfer( evt );
				dataTransfer.setTargetEditor( editor );

				// Getting drop position is one of the most complex part of D&D.
				var dropRange = CKEDITOR.plugins.clipboard.getRangeAtDropPosition( evt, editor ),
					dragRange = CKEDITOR.plugins.clipboard.dragRange;

				// Do nothing if it was not possible to get drop range.
				if ( !dropRange )
					return;

				if ( dataTransfer.getTransferType() == CKEDITOR.DATA_TRANSFER_INTERNAL ) {
					internalDnD( dragRange, dropRange, dataTransfer );
				} else if ( dataTransfer.getTransferType() == CKEDITOR.DATA_TRANSFER_CROSS_EDITORS ) {
					crossEditorDnD( dragRange, dropRange, dataTransfer );
				} else {
					externalDnD( dropRange, dataTransfer );
				}
			} );
		}

		// Internal D&D.
		function internalDnD( dragRange, dropRange, dataTransfer ) {
			// Execute D&D with a timeout because otherwise selection, after drop,
			// on IE is in the drag position, instead of drop position.
			setTimeout( function() {
				var dragBookmark, dropBookmark, i,
					rangeBefore = CKEDITOR.plugins.clipboard.rangeBefore,
					fixIESplittedNodes = CKEDITOR.plugins.clipboard.fixIESplittedNodes;

				// Save and lock snapshot so there will be only
				// one snapshot for both remove and insert content.
				editor.fire( 'saveSnapshot' );
				editor.fire( 'lockSnapshot', { dontUpdate: 1 } );

				if ( CKEDITOR.env.ie && CKEDITOR.env.version < 10 ) {
					fixIESplittedNodes( dragRange, dropRange );
				}

				// Because we manipulate multiple ranges we need to do it carefully,
				// changing one range (event creating a bookmark) may make other invalid.
				// We need to change ranges into bookmarks so we can manipulate them easily in the future.
				// We can change the range which is later in the text before we change the preceding range.
				// We call rangeBefore to test the order of ranges.
				if ( !rangeBefore( dragRange, dropRange ) )
					dragBookmark = dragRange.createBookmark( 1 );

				dropBookmark = dropRange.clone().createBookmark( 1 );

				if ( rangeBefore( dragRange, dropRange ) )
					dragBookmark = dragRange.createBookmark( 1 );

				// No we can safely delete content for the drag range...
				dragRange = editor.createRange();
				dragRange.moveToBookmark( dragBookmark );
				dragRange.deleteContents();

				// ...and paste content into the drop position.
				dropRange = editor.createRange();
				dropRange.moveToBookmark( dropBookmark );
				dropRange.select();
				firePasteEvents( 'html', dataTransfer.dataValue );

				editor.fire( 'unlockSnapshot' );
			}, 0 );
		}

		// Cross editor D&D.
		function crossEditorDnD( dragRange, dropRange, dataTransfer ) {
			var i;

			// Because of FF bug we need to use this hack, otherwise cursor is hidden.
			if ( CKEDITOR.env.gecko ) {
				fixGeckoDisappearingCursor( editor );
			}

			// Paste event should be fired before delete contents because otherwise
			// Chrome have a problem with drop range (Chrome split the drop
			// range container so the offset is bigger then container length).
			dropRange.select();
			firePasteEvents( 'html', dataTransfer.dataValue );

			// Remove dragged content and make a snapshot.
			dataTransfer.sourceEditor.fire( 'saveSnapshot' );

			dragRange.deleteContents();

			dataTransfer.sourceEditor.getSelection().reset();
			dataTransfer.sourceEditor.fire( 'saveSnapshot' );
		}

		// Drop from external source.
		function externalDnD( dropRange, dataTransfer ) {
			// Because of FF bug we need to use this hack, otherwise cursor is hidden.
			if ( CKEDITOR.env.gecko ) {
				fixGeckoDisappearingCursor( editor );
			}

			// Paste content into the drop position.
			dropRange.select();

			firePasteEvents( dataTransfer.dataType, dataTransfer.dataValue );
		}

		// Fix for Gecko bug with disappearing cursor.
		function fixGeckoDisappearingCursor() {
			editor.once( 'afterPaste', function() {
				editor.toolbox.focus();
			} );
		}

		// Create object representing Cut or Copy commands.
		function createCutCopyCmd( type ) {
			return {
				type: type,
				canUndo: type == 'cut', // We can't undo copy to clipboard.
				startDisabled: true,
				exec: function( data ) {
					// Attempts to execute the Cut and Copy operations.
					function tryToCutCopy( type ) {
						if ( CKEDITOR.env.ie )
							return execIECommand( type );

						// non-IEs part
						try {
							// Other browsers throw an error if the command is disabled.
							return editor.document.$.execCommand( type, false, null );
						} catch ( e ) {
							return false;
						}
					}

					this.type == 'cut' && fixCut();

					var success = tryToCutCopy( this.type );

					if ( !success )
						alert( editor.lang.clipboard[ this.type + 'Error' ] ); // Show cutError or copyError.

					return success;
				}
			};
		}

		function createPasteCmd() {
			return {
				// Snapshots are done manually by editable.insertXXX methods.
				canUndo: false,
				async: true,

				exec: function( editor, data ) {
					var fire = function( data, withBeforePaste ) {
							data && firePasteEvents( data.type, data.dataValue, !!withBeforePaste );

							editor.fire( 'afterCommandExec', {
								name: 'paste',
								command: cmd,
								returnValue: !!data
							} );
						},
						cmd = this;

					// Check data precisely - don't open dialog on empty string.
					if ( typeof data == 'string' )
						fire( { type: 'auto', dataValue: data }, 1 );
					else
						editor.getClipboardData( fire );
				}
			};
		}

		function preventPasteEventNow() {
			preventPasteEvent = 1;
			// For safety reason we should wait longer than 0/1ms.
			// We don't know how long execution of quite complex getClipboardData will take
			// and in for example 'paste' listner execCommand() (which fires 'paste') is called
			// after getClipboardData finishes.
			// Luckily, it's impossible to immediately fire another 'paste' event we want to handle,
			// because we only handle there native context menu and menu bar.
			setTimeout( function() {
				preventPasteEvent = 0;
			}, 100 );
		}

		function preventBeforePasteEventNow() {
			preventBeforePasteEvent = 1;
			setTimeout( function() {
				preventBeforePasteEvent = 0;
			}, 10 );
		}

		// Tries to execute any of the paste, cut or copy commands in IE. Returns a
		// boolean indicating that the operation succeeded.
		// @param {String} command *LOWER CASED* name of command ('paste', 'cut', 'copy').
		function execIECommand( command ) {
			var doc = editor.document,
				body = doc.getBody(),
				enabled = false,
				onExec = function() {
					enabled = true;
				};

			// The following seems to be the only reliable way to detect that
			// clipboard commands are enabled in IE. It will fire the
			// onpaste/oncut/oncopy events only if the security settings allowed
			// the command to execute.
			body.on( command, onExec );

			// IE7: document.execCommand has problem to paste into positioned element.
			( CKEDITOR.env.version > 7 ? doc.$ : doc.$.selection.createRange() )[ 'execCommand' ]( command );

			body.removeListener( command, onExec );

			return enabled;
		}

		function firePasteEvents( type, data, withBeforePaste ) {
			var eventData = { type: type };

			if ( withBeforePaste ) {
				// Fire 'beforePaste' event so clipboard flavor get customized
				// by other plugins.
				if ( editor.fire( 'beforePaste', eventData ) === false )
					return false; // Event canceled
			}

			// The very last guard to make sure the paste has successfully happened.
			// This check should be done after firing 'beforePaste' because for native paste
			// 'beforePaste' is by default fired even for empty clipboard.
			if ( !data )
				return false;

			// Reuse eventData.type because the default one could be changed by beforePaste listeners.
			eventData.dataValue = data;

			return editor.fire( 'paste', eventData );
		}

		// Cutting off control type element in IE standards breaks the selection entirely. (#4881)
		function fixCut() {
			if ( !CKEDITOR.env.ie || CKEDITOR.env.quirks )
				return;

			var sel = editor.getSelection(),
				control, range, dummy;

			if ( ( sel.getType() == CKEDITOR.SELECTION_ELEMENT ) && ( control = sel.getSelectedElement() ) ) {
				range = sel.getRanges()[ 0 ];
				dummy = editor.document.createText( '' );
				dummy.insertBefore( control );
				range.setStartBefore( dummy );
				range.setEndAfter( control );
				sel.selectRanges( [ range ] );

				// Clear up the fix if the paste wasn't succeeded.
				setTimeout( function() {
					// Element still online?
					if ( control.getParent() ) {
						dummy.remove();
						sel.selectElement( control );
					}
				}, 0 );
			}
		}

		// Allow to peek clipboard content by redirecting the
		// pasting content into a temporary bin and grab the content of it.
		function getClipboardDataByPastebin( evt, callback ) {
			var doc = editor.document,
				editable = editor.editable(),
				cancel = function( evt ) {
					evt.cancel();
				},
				blurListener;

			// Avoid recursions on 'paste' event or consequent paste too fast. (#5730)
			if ( doc.getById( 'cke_pastebin' ) )
				return;

			var sel = editor.getSelection();
			var bms = sel.createBookmarks();

			// #11384. On IE9+ we use native selectionchange (i.e. editor#selectionCheck) to cache the most
			// recent selection which we then lock on editable blur. See selection.js for more info.
			// selectionchange fired before getClipboardDataByPastebin() cached selection
			// before creating bookmark (cached selection will be invalid, because bookmarks modified the DOM),
			// so we need to fire selectionchange one more time, to store current seleciton.
			// Selection will be locked when we focus pastebin.
			if ( CKEDITOR.env.ie )
				sel.root.fire( 'selectionchange' );

			// Create container to paste into.
			// For rich content we prefer to use "body" since it holds
			// the least possibility to be splitted by pasted content, while this may
			// breaks the text selection on a frame-less editable, "div" would be
			// the best one in that case.
			// In another case on old IEs moving the selection into a "body" paste bin causes error panic.
			// Body can't be also used for Opera which fills it with <br>
			// what is indistinguishable from pasted <br> (copying <br> in Opera isn't possible,
			// but it can be copied from other browser).
			var pastebin = new CKEDITOR.dom.element(
				( CKEDITOR.env.webkit || editable.is( 'body' ) ) && !CKEDITOR.env.ie ? 'body' : 'div', doc );

			pastebin.setAttributes( {
				id: 'cke_pastebin',
				'data-cke-temp': '1'
			} );

			var containerOffset = 0,
				offsetParent,
				win = doc.getWindow();

			if ( CKEDITOR.env.webkit ) {
				// It's better to paste close to the real paste destination, so inherited styles
				// (which Webkits will try to compensate by styling span) differs less from the destination's one.
				editable.append( pastebin );
				// Style pastebin like .cke_editable, to minimize differences between origin and destination. (#9754)
				pastebin.addClass( 'cke_editable' );

				// Compensate position of offsetParent.
				if ( !editable.is( 'body' ) ) {
					// We're not able to get offsetParent from pastebin (body element), so check whether
					// its parent (editable) is positioned.
					if ( editable.getComputedStyle( 'position' ) != 'static' )
						offsetParent = editable;
					// And if not - safely get offsetParent from editable.
					else
						offsetParent = CKEDITOR.dom.element.get( editable.$.offsetParent );

					containerOffset = offsetParent.getDocumentPosition().y;
				}
			} else {
				// Opera and IE doesn't allow to append to html element.
				editable.getAscendant( CKEDITOR.env.ie ? 'body' : 'html', 1 ).append( pastebin );
			}

			pastebin.setStyles( {
				position: 'absolute',
				// Position the bin at the top (+10 for safety) of viewport to avoid any subsequent document scroll.
				top: ( win.getScrollPosition().y - containerOffset + 10 ) + 'px',
				width: '1px',
				// Caret has to fit in that height, otherwise browsers like Chrome & Opera will scroll window to show it.
				// Set height equal to viewport's height - 20px (safety gaps), minimum 1px.
				height: Math.max( 1, win.getViewPaneSize().height - 20 ) + 'px',
				overflow: 'hidden',
				// Reset styles that can mess up pastebin position.
				margin: 0,
				padding: 0
			} );

			// Check if the paste bin now establishes new editing host.
			var isEditingHost = pastebin.getParent().isReadOnly();

			if ( isEditingHost ) {
				// Hide the paste bin.
				pastebin.setOpacity( 0 );
				// And make it editable.
				pastebin.setAttribute( 'contenteditable', true );
			}
			// Transparency is not enough since positioned non-editing host always shows
			// resize handler, pull it off the screen instead.
			else
				pastebin.setStyle( editor.config.contentsLangDirection == 'ltr' ? 'left' : 'right', '-1000px' );

			editor.on( 'selectionChange', cancel, null, null, 0 );

			// Webkit fill fire blur on editable when moving selection to
			// pastebin (if body is used). Cancel it because it causes incorrect
			// selection lock in case of inline editor (#10644).
			// The same seems to apply to Firefox (#10787).
			if ( CKEDITOR.env.webkit || CKEDITOR.env.gecko )
				blurListener = editable.once( 'blur', cancel, null, null, -100 );

			// Temporarily move selection to the pastebin.
			isEditingHost && pastebin.focus();
			var range = new CKEDITOR.dom.range( pastebin );
			range.selectNodeContents( pastebin );
			var selPastebin = range.select();

			// If non-native paste is executed, IE will open security alert and blur editable.
			// Editable will then lock selection inside itself and after accepting security alert
			// this selection will be restored. We overwrite stored selection, so it's restored
			// in pastebin. (#9552)
			if ( CKEDITOR.env.ie ) {
				blurListener = editable.once( 'blur', function( evt ) {
					editor.lockSelection( selPastebin );
				} );
			}

			var scrollTop = CKEDITOR.document.getWindow().getScrollPosition().y;

			// Wait a while and grab the pasted contents.
			setTimeout( function() {
				// Restore main window's scroll position which could have been changed
				// by browser in cases described in #9771.
				if ( CKEDITOR.env.webkit )
					CKEDITOR.document.getBody().$.scrollTop = scrollTop;

				// Blur will be fired only on non-native paste. In other case manually remove listener.
				blurListener && blurListener.removeListener();

				// Restore properly the document focus. (#8849)
				if ( CKEDITOR.env.ie )
					editable.focus();

				// IE7: selection must go before removing pastebin. (#8691)
				sel.selectBookmarks( bms );
				pastebin.remove();

				// Grab the HTML contents.
				// We need to look for a apple style wrapper on webkit it also adds
				// a div wrapper if you copy/paste the body of the editor.
				// Remove hidden div and restore selection.
				var bogusSpan;
				if ( CKEDITOR.env.webkit && ( bogusSpan = pastebin.getFirst() ) && ( bogusSpan.is && bogusSpan.hasClass( 'Apple-style-span' ) ) )
					pastebin = bogusSpan;

				editor.removeListener( 'selectionChange', cancel );
				callback( pastebin.getHtml() );
			}, 0 );
		}

		// Try to get content directly from clipboard, without native event
		// being fired before. In other words - synthetically get clipboard data
		// if it's possible.
		// mainPasteEvent will be fired, so if forced native paste:
		// * worked, getClipboardDataByPastebin will grab it,
		// * didn't work, pastebin will be empty and editor#paste won't be fired.
		function getClipboardDataDirectly() {
			if ( CKEDITOR.env.ie ) {
				// Prevent IE from pasting at the begining of the document.
				editor.focus();

				// Command will be handled by 'beforepaste', but as
				// execIECommand( 'paste' ) will fire also 'paste' event
				// we're canceling it.
				preventPasteEventNow();

				// #9247: Lock focus to prevent IE from hiding toolbar for inline editor.
				var focusManager = editor.focusManager;
				focusManager.lock();

				if ( editor.editable().fire( mainPasteEvent ) && !execIECommand( 'paste' ) ) {
					focusManager.unlock();
					return false;
				}
				focusManager.unlock();
			} else {
				try {
					if ( editor.editable().fire( mainPasteEvent ) && !editor.document.$.execCommand( 'Paste', false, null ) )
						throw 0;

				} catch ( e ) {
					return false;
				}
			}

			return true;
		}

		// Listens for some clipboard related keystrokes, so they get customized.
		// Needs to be bind to keydown event.
		function onKey( event ) {
			if ( editor.mode != 'wysiwyg' )
				return;

			switch ( event.data.keyCode ) {
				// Paste
				case CKEDITOR.CTRL + 86: // CTRL+V
				case CKEDITOR.SHIFT + 45: // SHIFT+INS
					var editable = editor.editable();

					// Cancel 'paste' event because ctrl+v is for IE handled
					// by 'beforepaste'.
					preventPasteEventNow();

					// Simulate 'beforepaste' event for all none-IEs.
					!CKEDITOR.env.ie && editable.fire( 'beforepaste' );

					return;

					// Cut
				case CKEDITOR.CTRL + 88: // CTRL+X
				case CKEDITOR.SHIFT + 46: // SHIFT+DEL
					// Save Undo snapshot.
					editor.fire( 'saveSnapshot' ); // Save before cut
					setTimeout( function() {
						editor.fire( 'saveSnapshot' ); // Save after cut
					}, 50 ); // OSX is slow (#11416).
			}
		}

		function pasteDataFromClipboard( evt ) {
			// Default type is 'auto', but can be changed by beforePaste listeners.
			var eventData = { type: 'auto' };
			// Fire 'beforePaste' event so clipboard flavor get customized by other plugins.
			// If 'beforePaste' is canceled continue executing getClipboardDataByPastebin and then do nothing
			// (do not fire 'paste', 'afterPaste' events). This way we can grab all - synthetically
			// and natively pasted content and prevent its insertion into editor
			// after canceling 'beforePaste' event.
			var beforePasteNotCanceled = editor.fire( 'beforePaste', eventData );

			getClipboardDataByPastebin( evt, function( data ) {
				// Clean up.
				data = data.replace( /<span[^>]+data-cke-bookmark[^<]*?<\/span>/ig, '' );

				// Fire remaining events (without beforePaste)
				beforePasteNotCanceled && firePasteEvents( eventData.type, data, 0, 1 );
			} );
		}

		function setToolbarStates() {
			if ( editor.mode != 'wysiwyg' )
				return;

			var pasteState = stateFromNamedCommand( 'paste' );

			editor.getCommand( 'cut' ).setState( stateFromNamedCommand( 'cut' ) );
			editor.getCommand( 'copy' ).setState( stateFromNamedCommand( 'copy' ) );
			editor.getCommand( 'paste' ).setState( pasteState );
			editor.fire( 'pasteState', pasteState );
		}

		function stateFromNamedCommand( command ) {
			if ( inReadOnly && command in { paste: 1, cut: 1 } )
				return CKEDITOR.TRISTATE_DISABLED;

			if ( command == 'paste' )
				return CKEDITOR.TRISTATE_OFF;

			// Cut, copy - check if the selection is not empty.
			var sel = editor.getSelection(),
				ranges = sel.getRanges(),
				selectionIsEmpty = sel.getType() == CKEDITOR.SELECTION_NONE || ( ranges.length == 1 && ranges[ 0 ].collapsed );

			return selectionIsEmpty ? CKEDITOR.TRISTATE_DISABLED : CKEDITOR.TRISTATE_OFF;
		}
	}

	// Returns:
	// * 'htmlifiedtext' if content looks like transformed by browser from plain text.
	//		See clipboard/paste.html TCs for more info.
	// * 'html' if it is not 'htmlifiedtext'.
	function recogniseContentType( data ) {
		if ( CKEDITOR.env.webkit ) {
			// Plain text or ( <div><br></div> and text inside <div> ).
			if ( !data.match( /^[^<]*$/g ) && !data.match( /^(<div><br( ?\/)?><\/div>|<div>[^<]*<\/div>)*$/gi ) )
				return 'html';
		} else if ( CKEDITOR.env.ie ) {
			// Text and <br> or ( text and <br> in <p> - paragraphs can be separated by new \r\n ).
			if ( !data.match( /^([^<]|<br( ?\/)?>)*$/gi ) && !data.match( /^(<p>([^<]|<br( ?\/)?>)*<\/p>|(\r\n))*$/gi ) )
				return 'html';
		} else if ( CKEDITOR.env.gecko ) {
			// Text or <br>.
			if ( !data.match( /^([^<]|<br( ?\/)?>)*$/gi ) )
				return 'html';
		} else
			return 'html';

		return 'htmlifiedtext';
	}

	// This function transforms what browsers produce when
	// pasting plain text into editable element (see clipboard/paste.html TCs
	// for more info) into correct HTML (similar to that produced by text2Html).
	function htmlifiedTextHtmlification( config, data ) {
		function repeatParagraphs( repeats ) {
			// Repeat blocks floor((n+1)/2) times.
			// Even number of repeats - add <br> at the beginning of last <p>.
			return CKEDITOR.tools.repeat( '</p><p>', ~~ ( repeats / 2 ) ) + ( repeats % 2 == 1 ? '<br>' : '' );
		}

			// Replace adjacent white-spaces (EOLs too - Fx sometimes keeps them) with one space.
		data = data.replace( /\s+/g, ' ' )
			// Remove spaces from between tags.
			.replace( /> +</g, '><' )
			// Normalize XHTML syntax and upper cased <br> tags.
			.replace( /<br ?\/>/gi, '<br>' );

		// IE - lower cased tags.
		data = data.replace( /<\/?[A-Z]+>/g, function( match ) {
			return match.toLowerCase();
		} );

		// Don't touch single lines (no <br|p|div>) - nothing to do here.
		if ( data.match( /^[^<]$/ ) )
			return data;

		// Webkit.
		if ( CKEDITOR.env.webkit && data.indexOf( '<div>' ) > -1 ) {
				// One line break at the beginning - insert <br>
			data = data.replace( /^(<div>(<br>|)<\/div>)(?!$|(<div>(<br>|)<\/div>))/g, '<br>' )
				// Two or more - reduce number of new lines by one.
				.replace( /^(<div>(<br>|)<\/div>){2}(?!$)/g, '<div></div>' );

			// Two line breaks create one paragraph in Webkit.
			if ( data.match( /<div>(<br>|)<\/div>/ ) ) {
				data = '<p>' + data.replace( /(<div>(<br>|)<\/div>)+/g, function( match ) {
					return repeatParagraphs( match.split( '</div><div>' ).length + 1 );
				} ) + '</p>';
			}

			// One line break create br.
			data = data.replace( /<\/div><div>/g, '<br>' );

			// Remove remaining divs.
			data = data.replace( /<\/?div>/g, '' );
		}

		// Opera and Firefox and enterMode != BR.
		if ( CKEDITOR.env.gecko && config.enterMode != CKEDITOR.ENTER_BR ) {
			// Remove bogus <br> - Fx generates two <brs> for one line break.
			// For two line breaks it still produces two <brs>, but it's better to ignore this case than the first one.
			if ( CKEDITOR.env.gecko )
				data = data.replace( /^<br><br>$/, '<br>' );

			// This line satisfy edge case when for Opera we have two line breaks
			//data = data.replace( /)

			if ( data.indexOf( '<br><br>' ) > -1 ) {
				// Two line breaks create one paragraph, three - 2, four - 3, etc.
				data = '<p>' + data.replace( /(<br>){2,}/g, function( match ) {
					return repeatParagraphs( match.length / 4 );
				} ) + '</p>';
			}
		}

		return switchEnterMode( config, data );
	}

	// Filter can be editor dependent.
	function getTextificationFilter( editor ) {
		var filter = new CKEDITOR.htmlParser.filter();

		// Elements which creates vertical breaks (have vert margins) - took from HTML5 spec.
		// http://dev.w3.org/html5/markup/Overview.html#toc
		var replaceWithParaIf = { blockquote: 1, dl: 1, fieldset: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, ol: 1, p: 1, table: 1, ul: 1 },

			// All names except of <br>.
			stripInlineIf = CKEDITOR.tools.extend( { br: 0 }, CKEDITOR.dtd.$inline ),

			// What's finally allowed (cke:br will be removed later).
			allowedIf = { p: 1, br: 1, 'cke:br': 1 },

			knownIf = CKEDITOR.dtd,

			// All names that will be removed (with content).
			removeIf = CKEDITOR.tools.extend( { area: 1, basefont: 1, embed: 1, iframe: 1, map: 1, object: 1, param: 1 }, CKEDITOR.dtd.$nonBodyContent, CKEDITOR.dtd.$cdata );

		var flattenTableCell = function( element ) {
				delete element.name;
				element.add( new CKEDITOR.htmlParser.text( ' ' ) );
			},
			// Squash adjacent headers into one. <h1>A</h1><h2>B</h2> -> <h1>A<br>B</h1><h2></h2>
			// Empty ones will be removed later.
			squashHeader = function( element ) {
				var next = element,
					br, el;

				while ( ( next = next.next ) && next.name && next.name.match( /^h\d$/ ) ) {
					// TODO shitty code - waitin' for htmlParse.element fix.
					br = new CKEDITOR.htmlParser.element( 'cke:br' );
					br.isEmpty = true;
					element.add( br );
					while ( ( el = next.children.shift() ) )
						element.add( el );
				}
			};

		filter.addRules( {
			elements: {
				h1: squashHeader,
				h2: squashHeader,
				h3: squashHeader,
				h4: squashHeader,
				h5: squashHeader,
				h6: squashHeader,

				img: function( element ) {
					var alt = CKEDITOR.tools.trim( element.attributes.alt || '' ),
						txt = ' ';

					// Replace image with its alt if it doesn't look like an url or is empty.
					if ( alt && !alt.match( /(^http|\.(jpe?g|gif|png))/i ) )
						txt = ' [' + alt + '] ';

					return new CKEDITOR.htmlParser.text( txt );
				},

				td: flattenTableCell,
				th: flattenTableCell,

				$: function( element ) {
					var initialName = element.name,
						br;

					// Remove entirely.
					if ( removeIf[ initialName ] )
						return false;

					// Remove all attributes.
					element.attributes = {};

					// Pass brs.
					if ( initialName == 'br' )
						return element;

					// Elements that we want to replace with paragraphs.
					if ( replaceWithParaIf[ initialName ] )
						element.name = 'p';

					// Elements that we want to strip (tags only, without the content).
					else if ( stripInlineIf[ initialName ] )
						delete element.name;

					// Surround other known element with <brs> and strip tags.
					else if ( knownIf[ initialName ] ) {
						// TODO shitty code - waitin' for htmlParse.element fix.
						br = new CKEDITOR.htmlParser.element( 'cke:br' );
						br.isEmpty = true;

						// Replace hrs (maybe sth else too?) with only one br.
						if ( CKEDITOR.dtd.$empty[ initialName ] )
							return br;

						element.add( br, 0 );
						br = br.clone();
						br.isEmpty = true;
						element.add( br );
						delete element.name;
					}

					// Final cleanup - if we can still find some not allowed elements then strip their names.
					if ( !allowedIf[ element.name ] )
						delete element.name;

					return element;
				}
			}
		}, {
			// Apply this filter to every element.
			applyToAll: true
		} );

		return filter;
	}

	function htmlTextification( config, data, filter ) {
		var fragment = new CKEDITOR.htmlParser.fragment.fromHtml( data ),
			writer = new CKEDITOR.htmlParser.basicWriter();

		fragment.writeHtml( writer, filter );
		data = writer.getHtml();

		// Cleanup cke:brs.
		data = data.replace( /\s*(<\/?[a-z:]+ ?\/?>)\s*/g, '$1' )	// Remove spaces around tags.
			.replace( /(<cke:br \/>){2,}/g, '<cke:br />' )			// Join multiple adjacent cke:brs
			.replace( /(<cke:br \/>)(<\/?p>|<br \/>)/g, '$2' )		// Strip cke:brs adjacent to original brs or ps.
			.replace( /(<\/?p>|<br \/>)(<cke:br \/>)/g, '$1' )
			.replace( /<(cke:)?br( \/)?>/g, '<br>' )				// Finally - rename cke:brs to brs and fix <br /> to <br>.
			.replace( /<p><\/p>/g, '' );							// Remove empty paragraphs.

		// Fix nested ps. E.g.:
		// <p>A<p>B<p>C</p>D<p>E</p>F</p>G
		// <p>A</p><p>B</p><p>C</p><p>D</p><p>E</p><p>F</p>G
		var nested = 0;
		data = data.replace( /<\/?p>/g, function( match ) {
			if ( match == '<p>' ) {
				if ( ++nested > 1 )
					return '</p><p>';
			} else {
				if ( --nested > 0 )
					return '</p><p>';
			}

			return match;
		} ).replace( /<p><\/p>/g, '' ); // Step before: </p></p> -> </p><p></p><p>. Fix this here.

		return switchEnterMode( config, data );
	}

	function switchEnterMode( config, data ) {
		if ( config.enterMode == CKEDITOR.ENTER_BR ) {
			data = data.replace( /(<\/p><p>)+/g, function( match ) {
				return CKEDITOR.tools.repeat( '<br>', match.length / 7 * 2 );
			} ).replace( /<\/?p>/g, '' );
		} else if ( config.enterMode == CKEDITOR.ENTER_DIV )
			data = data.replace( /<(\/)?p>/g, '<$1div>' );

		return data;
	}

	/**
	 * @private
	 * @singleton
	 * @class CKEDITOR.plugins.clipboard
	 */
	CKEDITOR.plugins.clipboard = {};

	/**
	 * @private
	 *
	 * IE 8 & 9 split text node on drop so the first node contains
	 * text before drop position and the second contains rest. If we
	 * drag the content from the same node we will be not able to get
	 * it (range became invalid), so we need to join them back.
	 *
	 * Notify that first node on IE 8 & 9 is the original node object
	 * but with shortened content.
	 *
	 * Before:
	 *   --- Text Node A ----------------------------------
	 *                                              /\
	 *                                         Drag position
	 *
	 * After (IE 8 & 9):
	 *   --- Text Node A -----  --- Text Node B -----------
	 *                        /\                    /\
	 *                   Drop position        Drag position
	 *                                          (invalid)
	 *
	 * After (other browsers):
	 *   --- Text Node A ----------------------------------
	 *                        /\                    /\
	 *                   Drop position        Drag position
	 *
	 * This function is in the public scope for tests usage only.
	 */
	CKEDITOR.plugins.clipboard.fixIESplittedNodes = function( dragRange, dropRange ) {
		if ( dropRange.startContainer.type == 1 &&
			 dropRange.startContainer.getChildCount() > dropRange.startOffset - 1 &&
			 dropRange.startContainer.getChild( dropRange.startOffset - 1 ).equals( dragRange.startContainer ) ) {
			var nodeBefore = dropRange.startContainer.getChild( dropRange.startOffset - 1 ),
				nodeAfter = dropRange.startContainer.getChild( dropRange.startOffset ),
				offset = nodeBefore.getLength();

			if ( nodeAfter ) {
				nodeBefore.setText( nodeBefore.getText() + nodeAfter.getText() );
				nodeAfter.remove();
			}

			dropRange.startContainer = nodeBefore;
			dropRange.startOffset = offset;
		}
	};

	/**
	 * @private
	 *
	 * Check if the beginning of the firstRange is before the beginning of the secondRange
	 * and modification of the content in the firstRange may break secondRange.
	 *
	 * Notify that this function returns false if these two ranges are in two
	 * separate nodes and do not affect each other (even if firstRange is before secondRange).
	 *
	 * This function is in the public scope for tests usage only.
	 */
	CKEDITOR.plugins.clipboard.rangeBefore = function( firstRange, secondRange ) {
		// Both ranges has the same parent and the first has smaller offset. E.g.:
		//
		// 		"Lorem ipsum dolor sit[1] amet consectetur[2] adipiscing elit."
		// 		"Lorem ipsum dolor sit" [1] "amet consectetur" [2] "adipiscing elit."
		//
		if ( firstRange.startContainer.equals( secondRange.startContainer ) &&
			firstRange.startOffset < secondRange.startOffset )
			return true;

		// First range is inside a text node and the second is not, but if we change the
		// first range into bookmark and split the text node then the seconds node offset
		// will be no longer correct.
		//
		// 		"Lorem ipsum dolor sit [1] amet" "consectetur" [2] "adipiscing elit."
		//
		if ( firstRange.startContainer.getParent().equals( secondRange.startContainer ) &&
			firstRange.startContainer.getIndex() < secondRange.startOffset )
			return true;

		return false;
	};

	/**
	 * Get range from the drop event.
	 *
	 * Copy of getRangeAtDropPosition method from widget plugin.
	 * In #11219 method in widget should be removed and everything be according to DRY.
	 *
	 * @param {Object} domEvent A native DOM drop event object.
	 * @param {CKEDITOR.editor} editor The source editor instance.
	 *
	 * @returns {CKEDITOR.dom.range} range at drop position.
	 *
	 */
	CKEDITOR.plugins.clipboard.getRangeAtDropPosition = function( dropEvt, editor ) {
		var $evt = dropEvt.data.$,
			x = $evt.clientX,
			y = $evt.clientY,
			$range,
			defaultRange = editor.getSelection( true ).getRanges()[ 0 ],
			range = editor.createRange();

		// Make testing possible.
		if ( dropEvt.data.testRange )
			return dropEvt.data.testRange;

		// Webkits.
		if ( document.caretRangeFromPoint ) {
			$range = editor.document.$.caretRangeFromPoint( x, y );
			range.setStart( CKEDITOR.dom.node( $range.startContainer ), $range.startOffset );
			range.collapse( true );
		}
		// FF.
		else if ( $evt.rangeParent ) {
			range.setStart( CKEDITOR.dom.node( $evt.rangeParent ), $evt.rangeOffset );
			range.collapse( true );
		}
		// IEs 9+.
		else if ( CKEDITOR.env.ie && CKEDITOR.env.version > 8 )
			// On IE 9+ range by default is where we expected it.
			return defaultRange;
		// IE 8.
		else if ( document.body.createTextRange ) {
			// If we drop content from the different source we need to call focus on IE8.
			editor.focus();

			$range = editor.document.getBody().$.createTextRange();
			try {
				var sucess = false;

				// If user drop between text line IEs moveToPoint throws exception:
				//
				//		Lorem ipsum pulvinar purus et euismod
				//
				//		dolor sit amet,| consectetur adipiscing
				//		               *
				//		vestibulum tincidunt augue eget tempus.
				//
				// * - drop position
				// | - expected cursor position
				//
				// So we try to call moveToPoint with +-1px up to +-20px above or
				// below original drop position to find nearest good drop position.
 				for ( var i = 0; i < 20 && !sucess; i++ ) {
					if ( !sucess ) {
						try {
							$range.moveToPoint( x, y - i );
							sucess = true;
						} catch ( err ) {
						}
					}
					if ( !sucess ) {
						try {
							$range.moveToPoint( x, y + i );
							sucess = true;
						} catch ( err ) {
						}
					}
				}

				if ( sucess ) {
					var id = 'cke-temp-' + ( new Date() ).getTime();
					$range.pasteHTML( '<span id="' + id + '">\u200b</span>' );

					var span = editor.document.getById( id );
					range.moveToPosition( span, CKEDITOR.POSITION_BEFORE_START );
					span.remove();
				} else {
					// If the fist method does not succeed we might be next to
					// the short element (like header):
					//
					//		Lorem ipsum pulvinar purus et euismod.
					//
					//
					//		SOME HEADER|        *
					//
					//
					//		vestibulum tincidunt augue eget tempus.
					//
					// * - drop position
					// | - expected cursor position
					//
					// In such situation elementFromPoint returns proper element. Using getClientRect
					// it is possible to check if the cursor should be at the beginning or at the end
					// of paragraph.
					var $element = editor.document.$.elementFromPoint( x, y ),
						element = new CKEDITOR.dom.element( $element ),
						rect;

					if ( !element.equals( editor.editable() ) && element.getName() != 'html' ) {
						rect = element.getClientRect();

						if ( x < rect.left ) {
							range.setStartAt( element, CKEDITOR.POSITION_AFTER_START );
							range.collapse( true );
						} else {
							range.setStartAt( element, CKEDITOR.POSITION_BEFORE_END );
							range.collapse( true );
						}
					}
					// If drop happens on no element elementFromPoint returns html or body.
					//
					//		*      |Lorem ipsum pulvinar purus et euismod.
					//
					//		       vestibulum tincidunt augue eget tempus.
					//
					// * - drop position
					// | - expected cursor position
					//
					// In such case we can try to use default selection. If startContainer is not
					// 'editable' element it is probably proper selection.
					else if ( defaultRange && defaultRange.startContainer && !defaultRange.
						startContainer.equals( editor.editable() ) ) {
						return defaultRange;
					}
					// Otherwise we can not find any drop position and we have to return null
					// and cancel D&D event.
					else
						return null;

				}
			} catch ( err ) {
				return null;
			}
		}
		else
			return null;

		return range;
	};

	/**
	 * Initialize dataTransfer object based on the native drop event. If data
	 * transfer object was already initialized on this event then function will
	 * return that object.
	 *
	 * @param {Object} domEvent A native DOM drop event object.
	 * @param {CKEDITOR.editor} [sourceEditor] The source editor instance.
	 * @returns {CKEDITOR.plugins.clipboard.dataTransfer} dataTransfer object
	 *
	 */
	CKEDITOR.plugins.clipboard.initDataTransfer = function( evt, sourceEditor ) {
		// Create a new dataTransfer object based on the drop event.
		// If this event was used on dragstart to create dataTransfer
		// both dataTransfer objects will have the same id.
		var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( evt, sourceEditor );

		// If there is the same id we will replace dataTransfer with the one
		// created on drag, because it contains drag editor, drag content and so on.
		// Otherwise (in case of drag from external source) we save new object to
		// the global clipboard.dnd.
		if ( CKEDITOR.plugins.clipboard.dnd &&
			dataTransfer.id == CKEDITOR.plugins.clipboard.dnd.id ) {
			dataTransfer = CKEDITOR.plugins.clipboard.dnd;
		} else {
			CKEDITOR.plugins.clipboard.dnd = dataTransfer;
		}

		if ( sourceEditor ) {
			CKEDITOR.plugins.clipboard.dragRange = sourceEditor.getSelection().getRanges()[ 0 ];
		}

		return dataTransfer;
	};

	// Data type used to link drag and drop events.
	var	clipboardIdDataType =
		// IE does not support different data types that Text and URL.
		// In IE 9- we can use URL data type to mark that drag comes from the editor.
		( CKEDITOR.env.ie && CKEDITOR.env.version < 10 ) ? 'URL':
		// In IE 10+ URL data type is buggie and there is no way to mark DnD without
		// modifying text data (which would be displayed if user drop content to the textarea)
		// so we just read dragged text.
		CKEDITOR.env.ie ? 'Text' :
		// In Chrome and Firefox we can use custom data types.
		'cke/id';

	/**
	 * Facade for the native `dataTransfer`/`clipboadData` object to hide all differences
	 * between browsers.
	 *
	 * @class CKEDITOR.plugins.clipboard.dataTransfer
	 * @constructor Creates a class instance and .
	 *
	 * @param {Object} domEvent
	 * A native DOM event object.
	 *
	 * @param {CKEDITOR.editor} editor The source editor instance.
	 * If editor is defined then dataValue will be created based on
	 * the editor contents and dataType will be 'html'.
	 */
	CKEDITOR.plugins.clipboard.dataTransfer = function( evt, editor ) {
		this.$ = evt.data.$.dataTransfer;

		// Check if ID is already created.
		this.id = this.$.getData( clipboardIdDataType );

		// If there is no ID we need to create it. Different browsers needs different ID.
		if ( !this.id ) {
			if ( clipboardIdDataType == 'URL' ) {
				// For IEs URL type ID have to look like an URL.
				this.id = 'http://cke.' + ( new Date() ).getTime() +'/';
			} else if ( clipboardIdDataType == 'Text' ) {
				// For IE10+ only Text data type is supported and we have to compare dragged
				// and dropped text. If the ID is not set it means that empty string was dragged
				// (ex. image with no alt). We change null to empty string.
				this.id = "";
			} else {
				// String for custom data type.
				this.id = 'cke-' + ( new Date() ).getTime();
			}
		}

		// In IE10+ we can not use any data type besides text, so we do not call setData.
		if ( evt.name != 'drop' && clipboardIdDataType != 'Text' ) {
			// dataTransfer object will be passed from the drag to the drop event.
			this.$.setData( clipboardIdDataType, this.id );
		}

		// Without setData( 'text', ... ) on dragstart there is no drop event in Safari.
		if ( evt.name == 'dragstart' && CKEDITOR.env.safari ) {
			evt.data.$.dataTransfer.setData( 'text', evt.data.$.dataTransfer.getData( 'text' ) );
		}

		if ( editor ) {
			this.sourceEditor = editor;
			this.dataValue = editor.getSelection().getSelectedHtml();
			this.dataType = 'html';
		} else {
			// IE support only text data and throws exception if we try to get html data.
			// This html data object may also be empty if we drag content of the textarea.
			try {
				this.dataValue = this.getData( 'text/html' );
				this.dataType = 'html';
			} catch ( err ) {
			}

			if ( !this.dataValue ) {
				// Try to get text data otherwise.
				this.dataValue = this.getData( 'Text' );

				if ( this.dataValue ) {
					CKEDITOR.tools.htmlEncode( this.getData( 'Text' ) );
					this.dataType = 'text';
				}
			}
		}
	};

	/**
	 * Facade for the native getData method.
	 *
	 * @param {String} type The type of data to retrieve.
	 *
	 * @returns {String} type
	 * Stored data for the given type or an
	 * empty string if data for that type does not exist.
	 */
	CKEDITOR.plugins.clipboard.dataTransfer.prototype.getData = function( type ) {
		return this.$.getData( type );
	};

	/**
	 * Facade for the native setData method.
	 *
	 * @param {String} type The type of data to retrieve.
	 * @param {String} value The data to add.
	 */
	CKEDITOR.plugins.clipboard.dataTransfer.prototype.setData = function( type, value ) {
		return this.$.setData( type, value );
	};

	/**
	 * Set target editor.
	 *
	 * @param {CKEDITOR.editor} editor The target editor instance.
	 */
	CKEDITOR.plugins.clipboard.dataTransfer.prototype.setTargetEditor = function( editor ) {
		this.targetEditor = editor;
	};

	/**
	 * Data transfer operation (drag and drop or copy and pasted) started and ended in the same
	 * editor instance.
	 *
	 * @readonly
	 * @property {Number} [=0]
	 * @member CKEDITOR
	 */
	CKEDITOR.DATA_TRANSFER_INTERNAL = 0;

	/**
	 * Data transfer operation (drag and drop or copy and pasted) started and ended in the
	 * instance of CKEditor but in two different editors.
	 *
	 * @readonly
	 * @property {Number} [=1]
	 * @member CKEDITOR
	 */
	CKEDITOR.DATA_TRANSFER_CROSS_EDITORS = 1;

	/**
	 * Data transfer operation (drag and drop or copy and pasted) started not in the CKEditor.
	 * The source of the data may be textarea, HTML, another application, etc..
	 *
	 * @readonly
	 * @property {Number} [=2]
	 * @member CKEDITOR
	 */
	CKEDITOR.DATA_TRANSFER_EXTERNAL = 2;

	/**
	 * Get data transfer type.
	 *
	 * @returns {Number} type
	 * Possible options: DATA_TRANSFER_INTERNAL, DATA_TRANSFER_CROSS_EDITORS, DATA_TRANSFER_EXTERNAL.
	 */
	CKEDITOR.plugins.clipboard.dataTransfer.prototype.getTransferType = function() {
		if ( !this.sourceEditor ) {
			return CKEDITOR.DATA_TRANSFER_EXTERNAL;
		} else if ( this.sourceEditor == this.targetEditor ) {
			return CKEDITOR.DATA_TRANSFER_INTERNAL;
		} else {
			return CKEDITOR.DATA_TRANSFER_CROSS_EDITORS;
		}
	};

	/**
	 * ID
	 *
	 * @property {String} id
	 * @member CKEDITOR.plugins.clipboard.dataTransfer
	 */

	/**
	 * $
	 *
	 * @private
	 * @property {Object} $
	 * @member CKEDITOR.plugins.clipboard.dataTransfer
	 */

	/**
	 * sourceEditor
	 *
	 * @property {CKEDITOR.editor} sourceEditor
	 * @member CKEDITOR.plugins.clipboard.dataTransfer
	 */

	/**
	 * targetEditor
	 *
	 * @property {CKEDITOR.editor} targetEditor
	 * @member CKEDITOR.plugins.clipboard.dataTransfer
	 */

	/**
	 * dataValue
	 *
	 * @property {String} dataValue
	 * @member CKEDITOR.plugins.clipboard.dataTransfer
	 */

	/**
	 * dataType
	 *
	 * @property {String} dataType
	 * @member CKEDITOR.plugins.clipboard.dataTransfer
	 */
} )();

/**
 * The default content type is used when pasted data cannot be clearly recognized as HTML or text.
 *
 * For example: `'foo'` may come from a plain text editor or a website. It isn't possible to recognize content
 * type in this case, so default will be used. However, it's clear that `'<b>example</b> text'` is an HTML
 * and its origin is webpage, email or other rich text editor.
 *
 * **Note:** If content type is text, then styles of context of paste are preserved.
 *
 *		CKEDITOR.config.clipboard_defaultContentType = 'text';
 *
 * @since 4.0
 * @cfg {'html'/'text'} [clipboard_defaultContentType='html']
 * @member CKEDITOR.config
 */

/**
 * Fired when a clipboard operation is about to be taken into the editor.
 * Listeners can manipulate the data to be pasted before having it effectively
 * inserted into the document.
 *
 * @since 3.1
 * @event paste
 * @member CKEDITOR.editor
 * @param {CKEDITOR.editor} editor This editor instance.
 * @param data
 * @param {String} data.type Type of data in `data.dataValue`. Usually `html` or `text`, but for listeners
 * with priority less than 6 it may be also `auto`, what means that content type hasn't been recognised yet
 * (this will be done by content type sniffer that listens with priority 6).
 * @param {String} data.dataValue HTML to be pasted.
 */

/**
 * Fired before the {@link #paste} event. Allows to preset data type.
 *
 * **Note:** This event is deprecated. Add a `0` priority listener for the
 * {@link #paste} event instead.
 *
 * @deprecated
 * @event beforePaste
 * @member CKEDITOR.editor
 */

/**
 * Internal event to open the Paste dialog.
 *
 * @private
 * @event pasteDialog
 * @member CKEDITOR.editor
 * @param {CKEDITOR.editor} editor This editor instance.
 * @param {Function} [data] Callback that will be passed to {@link CKEDITOR.editor#openDialog}.
 */
