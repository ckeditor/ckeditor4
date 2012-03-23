/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/*
 * EXECUTION FLOWS:
 * -- CTRL+C
 *		* browser's default behaviour
 * -- CTRL+V
 *		* listen onKey (onkeydown)
 *		* simulate 'beforepaste' for non-IEs on editable
 *		* simulate 'paste' for Fx2/Opera on editable
 *		* listen 'onpaste' on editable ('onbeforepaste' for IE)
 *		* fire 'beforePaste' on editor
 *		* !canceled && getClipboardDataByPastebin
 *		* fire 'paste' on editor
 *		* !canceled && fire 'afterPaste' on editor
 * -- CTRL+X
 *		* listen onKey (onkeydown)
 *		* fire 'saveSnapshot' on editor
 *		* browser's default behaviour
 *		* deferred second 'saveSnapshot' event
 * -- Copy command
 *		* tryToCutCopy
 *			* execCommand
 *		* !success && alert
 * -- Cut command
 *		* fixCut
 *		* tryToCutCopy
 *			* execCommand
 *		* !success && alert
 * -- Paste command
 *		* fire 'paste' on editable ('beforepaste' for IE)
 *		* !canceled && execCommand 'paste'
 *		* !success && fire 'pasteDialog' on editor
 * -- Paste from native context menu & menubar
 *		(Fx & Webkits are handled in 'paste' default listner.
 *		Opera cannot be handled at all because it doesn't fire any events
 *		Special treatment is needed for IE, for which is this part of doc)
 *		* listen 'onpaste'
 *		* cancel native event
 *		* fire 'beforePaste' on editor
 *		* !canceled && getClipboardDataByPastebin
 *		* execIECommand( 'paste' ) -> this fires another 'paste' event, so cancel it
 *		* fire 'paste' on editor
 *		* !canceled && fire 'afterPaste' on editor
 *
 *
 * PASTE EVENT - PREPROCESSING:
 * -- Possible data types: auto, text, html.
 * -- Possible data contents:
 *		* text (possible \n\r)
 *		* htmled text (text + br,div,p - no presentional markup & attrs - depends on browser)
 *		* html
 *
 * -- Type: auto:
 *		* content: text ->				filter, htmlise, set type: text
 *		* content: htmled text ->		filter, unify text markup (brs, ps, divs), set type: text
 *		* content: html ->				filter, set type: html
 * -- Type: text:
 *		* content: text ->				filter, htmlise
 *		* content: htmled text ->		filter, unify text markup
 *		* content: html ->				filter, strip presentional markup, unify text markup
 * -- Type: html:
 *		* content: text ->				filter
 *		* content: htmled text ->		filter
 *		* content: html ->				filter
 *
 * -- Phases:
 *		* filtering (priorities 3-5) - e.g. pastefromword filters
 *		* content type sniffing (priority 6)
 *		* markup transformations for text (priority 6)
 */

/**
 * @file Clipboard support
 */

'use strict';

(function() {
	// Register the plugin.
	CKEDITOR.plugins.add( 'clipboard', {
		requires: [ 'dialog' ],
		init: function( editor ) {
			initClipboard( editor );

			CKEDITOR.dialog.add( 'paste', CKEDITOR.getUrl( this.path + 'dialogs/paste.js' ) );

			editor.on( 'paste', function( evt ) {
				var dataObj = evt.data,
					type = dataObj.type,
					data = dataObj.data,
					trueType;

				// If forced type is 'html' we don't need to know true data type.
				if ( type == 'auto' || type == 'text' )
					trueType = recogniseContentType( data );

				// Htmlise.
				if ( trueType == 'text' )
					data = text2Html( editor, data );
				// Strip presentional markup & unify text markup.
				else if ( trueType == 'htmledtext' || ( type == 'text' && trueType == 'html' ) )
					data = htmledText2Html( trueType, data );

				if ( type == 'auto' )
					type = ( trueType == 'html' ? 'html' : 'text' );
				if ( type == 'text' )
					dataObj.dontEncodeHtml = true;

				dataObj.type = type;
				dataObj.data = data;
			}, null, null, 6 );

			// Inserts processed data into the editor at the end of the
			// events chain.
			editor.on( 'paste', function( evt ) {
				var data = evt.data;
				if ( data.type == 'html' )
					editor.insertHtml( data.data );
				else if ( data.type == 'text' )
					editor.insertText( data.data, data.dontEncodeHtml );

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
					editor.openDialog( 'paste' );
				}, 0 );
			});
		}
	});

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
		 * Paste data into the editor.
		 * Editor will:
		 * 		* Fire paste events (beforePaste, paste, afterPaste).
		 *		* Recognise data type (html or text).
		 * 		* If text is pasted then it will be "htmlisated".
		 *			* <strong>Note:</strong> two subsequent line-breaks will introduce one paragraph. This depends on <code>{@link CKEDITOR.config.enterMode}</code>;
		 * 			* A single line-break will be instead translated into one &lt;br /&gt;.
		 * @name CKEDITOR.editor.paste
		 * @param {String} data Data (text or html) to be pasted.
		 */
		editor.paste = function( data ) {
			return firePasteEvents( 'auto', data, true );
		};

		/**
		 * Get clipboard data by direct access to the clipboard (IE only) or opening paste dialog.
		 * @param {Function} callback Function that will be executed with data.type and data.data or null if none
		 * 		of the capturing method succeeded.
		 * @example
		 * editor.getClipboardData( function( data )
		 * {
		 *		if ( data )
		 *			alert( data.type + ' ' + data.data );
		 * });
		 */
		editor.getClipboardData = function( callback ) {
			var beforePasteNotCanceled = false,
				dataType = 'auto',
				dialogCommited = false;

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
				if ( beforePasteNotCanceled && editor.fire( 'pasteDialog' ) ) {
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
					});
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
				callback({ type: dataType, data: evt.data } );
			}
		};

		function addButtonsCommands() {
			addButtonCommand( 'Cut', 'cut', createCutCopyCmd( 'cut' ), 1 );
			addButtonCommand( 'Copy', 'copy', createCutCopyCmd( 'copy' ), 4 );
			addButtonCommand( 'Paste', 'paste', createPasteCmd(), 8 );

			function addButtonCommand( buttonName, commandName, command, ctxMenuOrder ) {
				var lang = editor.lang[ commandName ];

				editor.addCommand( commandName, command );
				editor.ui.addButton && editor.ui.addButton( buttonName, {
					label: lang,
					command: commandName
				});

				// If the "menu" plugin is loaded, register the menu item.
				if ( editor.addMenuItems ) {
					editor.addMenuItem( commandName, {
						label: lang,
						command: commandName,
						group: 'clipboard',
						order: ctxMenuOrder
					});
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
			});

			// If the "contextmenu" plugin is loaded, register the listeners.
			if ( editor.contextMenu ) {
				editor.contextMenu.addListener( function( element, selection ) {
					inReadOnly = selection.getRanges()[ 0 ].checkReadOnly();
					return {
						cut: stateFromNamedCommand( 'Cut' ),
						copy: stateFromNamedCommand( 'Copy' ),
						paste: stateFromNamedCommand( 'Paste' )
					};
				});
			}
		}

		/**
		 * Add events listeners to editable.
		 */
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
			});

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
			});

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
			});

			editable.on( 'mouseup', function() {
				setTimeout( function() {
					setToolbarStates();
				}, 0 );
			});

			editable.on( 'keyup', setToolbarStates );
		}

		/**
		 * Create object representing Cut or Copy commands.
		 */
		function createCutCopyCmd( type ) {
			return {
				type: type,
				canUndo: type == 'cut', // We can't undo copy to clipboard.
				startDisabled: true,
				exec: function( data ) {
					this.type == 'cut' && fixCut();

					var success = tryToCutCopy( this.type );

					if ( !success )
						alert( editor.lang.clipboard[ this.type + 'Error' ] ); // Show cutError or copyError.

					return success;

					/**
					 * Attempts to execute the Cut and Copy operations.
					 */
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
				}
			}
		}

		function createPasteCmd() {
			return {
				// Snapshots are done manually by editable.insertXXX methods.
				canUndo: false,
				async: true,

				exec: function() {
					var cmd = this;

					editor.getClipboardData( function( data ) {
						data && firePasteEvents( data.type, data.data );

						editor.fire( 'afterCommandExec', {
							name: 'paste',
							command: cmd,
							returnValue: !!data
						});
					});
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

		/**
		 * Tries to execute any of the paste, cut or copy commands in IE. Returns a
		 * boolean indicating that the operation succeeded.
		 * @param {String} command *LOWER CASED* name of command ('paste', 'cut', 'copy').
		 */
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

			// IE6/7: document.execCommand has problem to paste into positioned element.
			( CKEDITOR.env.version > 7 ? doc.$ : doc.$.selection.createRange() )[ 'execCommand' ]( command );

			body.removeListener( command, onExec );

			return enabled;
		}

		function firePasteEvents( type, data, withBeforePaste ) {
			var eventData = { type: type };

			if ( withBeforePaste ) {
				// Fire 'beforePaste' event so clipboard flavor get customized
				// by other plugins.
				if ( !editor.fire( 'beforePaste', eventData ) )
					return false; // Event canceled
			}

			// The very last guard to make sure the paste has successfully happened.
			// Moved here from editable#paste event listener to unify editor.paste() and
			// user paste behavior.
			// This guard should be after firing 'beforePaste' because for native pasting
			// 'beforePaste' is by default fired even for empty clipboard.
			if ( !data )
				return;

			// Reuse eventData.type because the default one could be changed by beforePaste listeners.
			eventData.data = data;

			return editor.fire( 'paste', eventData );
		}

		/**
		 * Cutting off control type element in IE standards breaks the selection entirely. (#4881)
		 */
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

		/**
		 * Allow to peek clipboard content by redirecting the
		 * pasting content into a temporary bin and grab the content of it.
		 */
		function getClipboardDataByPastebin( evt, callback ) {
			var doc = editor.document,
				editable = editor.editable(),
				cancel = function( evt ) {
					evt.cancel();
				};

			// Avoid recursions on 'paste' event or consequent paste too fast. (#5730)
			if ( doc.getById( 'cke_pastebin' ) )
				return;

			var sel = editor.getSelection(),
				range = editor.createRange();

			// Create container to paste into.
			// For rich content we prefer to use "body" since it holds
			// the least possibility to be splitted by pasted content, while this may
			// breaks the text selection on a frame-less editable, "div" would be
			// the best one in that case, also in another case on old IEs moving the
			// selection into a "body" paste bin causes error panic.
			var pastebin = new CKEDITOR.dom.element( editable.is( 'body' ) && !CKEDITOR.env.ie ? 'body' : 'div', doc );

			pastebin.setAttribute( 'id', 'cke_pastebin' );
			editable.append( pastebin );

			pastebin.setStyles({
				position: 'absolute',
				// Position the bin exactly at the position of the selected element
				// to avoid any subsequent document scroll.
				top: sel.getStartElement().getDocumentPosition().y + 'px',
				width: '1px',
				height: '1px',
				overflow: 'hidden'
			});

			// Pull the paste bin off screen (when possible) since a small resize handler will be displayed around it.
			if ( editor.editable().is( 'body' ) )
				pastebin.setStyle( editor.config.contentsLangDirection == 'ltr' ? 'left' : 'right', '-1000px' );

			var bms = sel.createBookmarks();

			editor.on( 'selectionChange', cancel, null, null, 0 );

			// Temporarily move selection to the pastebin.
			range.setStartAt( pastebin, CKEDITOR.POSITION_AFTER_START );
			range.setEndAt( pastebin, CKEDITOR.POSITION_BEFORE_END );
			range.select( true );

			// Wait a while and grab the pasted contents.
			setTimeout( function() {
				// Restore properly the document focus. (#5684, #8849)
				editable.focus();

				// Grab the HTML contents.
				// We need to look for a apple style wrapper on webkit it also adds
				// a div wrapper if you copy/paste the body of the editor.
				// Remove hidden div and restore selection.
				var bogusSpan;
				pastebin = ( CKEDITOR.env.webkit && ( bogusSpan = pastebin.getFirst() ) && ( bogusSpan.is && bogusSpan.hasClass( 'Apple-style-span' ) ) ? bogusSpan : pastebin );

				// IE7: selection must go before removing pastebin. (#8691)
				sel.selectBookmarks( bms );

				editor.removeListener( 'selectionChange', cancel );

				pastebin.remove();
				callback( pastebin.getHtml() );
			}, 0 );
		}

		// Try to get content directly from clipboard, without native event
		// being fired before. In other words - synthetically get clipboard data
		// if it's possible.
		function getClipboardDataDirectly() {
			if ( CKEDITOR.env.ie ) {
				// Prevent IE from pasting at the begining of the document.
				editor.focus();

				// Command will be handled by 'beforepaste', but as
				// execIECommand( 'paste' ) will fire also 'paste' event
				// we're canceling it.
				preventPasteEventNow();

				if ( editor.editable().fire( mainPasteEvent ) && !execIECommand( 'paste' ) ) {
					return false;
				}
			} else {
				try {
					if ( editor.editable().fire( mainPasteEvent ) && !editor.document.$.execCommand( 'Paste', false, null ) ) {
						throw 0;
					}
				} catch ( e ) {
					return false;
				}
			}
		}

		/**
		 * Listens for some clipboard related keystrokes, so they get customized.
		 * Needs to be bind to keydown event.
		 */
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

					// Simulate 'paste' event for Opera/Firefox2.
					if ( CKEDITOR.env.opera || CKEDITOR.env.gecko && CKEDITOR.env.version < 10900 )
						editable.fire( 'paste' );
					return;

					// Cut
				case CKEDITOR.CTRL + 88: // CTRL+X
				case CKEDITOR.SHIFT + 46: // SHIFT+DEL
					// Save Undo snapshot.
					editor.fire( 'saveSnapshot' ); // Save before cut
					setTimeout( function() {
						editor.fire( 'saveSnapshot' ); // Save after cut
					}, 0 );
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
				// Content can be trimmed because pasting space produces '&nbsp;'.
				data = CKEDITOR.tools.trim( data.replace( /<span[^>]+data-cke-bookmark[^<]*?<\/span>/ig, '' ) );

				// Fire remaining events (without beforePaste)
				beforePasteNotCanceled && firePasteEvents( eventData.type, data );
			});
		}

		function setToolbarStates() {
			if ( editor.mode != 'wysiwyg' )
				return;

			var pasteState = stateFromNamedCommand( 'Paste' );

			editor.getCommand( 'cut' ).setState( stateFromNamedCommand( 'Cut' ) );
			editor.getCommand( 'copy' ).setState( stateFromNamedCommand( 'Copy' ) );
			editor.getCommand( 'paste' ).setState( pasteState );
			editor.fire( 'pasteState', pasteState );
		}

		function stateFromNamedCommand( command ) {
			var retval;

			if ( inReadOnly && command in { Paste:1,Cut:1 } )
				return CKEDITOR.TRISTATE_DISABLED;

			if ( command == 'Paste' ) {
				// IE Bug: queryCommandEnabled('paste') fires also 'beforepaste(copy/cut)',
				// guard to distinguish from the ordinary sources (either
				// keyboard paste or execCommand) (#4874).
				CKEDITOR.env.ie && ( preventBeforePasteEvent = 1 );
				try {
					// Always return true for Webkit (which always returns false)
					retval = editor.document.$.queryCommandEnabled( command ) || CKEDITOR.env.webkit;
				} catch ( er ) {}
				preventBeforePasteEvent = 0;
			}
			// Cut, Copy - check if the selection is not empty
			else {
				var ranges = editor.getSelection().getRanges();
				retval = !( ranges.length == 1 && ranges[ 0 ].collapsed );
			}

			return retval ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED;
		}
	}

	// TODO dooooooo!
	// Returns:
	// * 'text' if no html markup at all.
	// * 'htmledtext' if content looks like transformed by browser from plain text.
	//		See clipboard/paste.html TCs for more info.
	// * 'html' if it's neither 'text' nor 'htmledtext'.
	// Data passed to this function should be already filtered from
	// msword's stuff and things like <span class="Apple-tab-span" style="white-space:pre">
	function recogniseContentType( data ) {
		var parser = new CKEDITOR.htmlParser(),
			isHtmledText = false,
			acceptableTextTags = { p:1,br:1,div:1 },
			isEmpty = CKEDITOR.tools.isEmpty;

		parser.onTagOpen = parser.onTagClose = function( tagName, attributes ) {
			if ( acceptableTextTags[ tagName ] && isEmpty( attributes ) )
				isHtmledText = true;
			else
				throw 0;
		};
		parser.onComment = parser.onCDATA = function() {
			throw 0;
		};

		try {
			parser.parse( data );
		} catch ( e ) {
			// Make sure we caught a right exception.
			if ( e !== 0 )
				throw e;
			// For performance reason stop parsing if HTML found.
			return 'html';
		}

		return isHtmledText ? 'htmledtext' : 'text';
	}

	// TODO Function shouldn't check selection - context will be fixed later.
	function text2Html( editor, text ) {
		var selection = editor.getSelection(),
			mode = selection.getStartElement().hasAscendant( 'pre', true ) ? CKEDITOR.ENTER_BR : editor.config.enterMode,
			isEnterBrMode = mode == CKEDITOR.ENTER_BR,
			tools = CKEDITOR.tools;

		var html = tools.htmlEncode( text.replace( /\r\n|\r/g, '\n' ) );

		// Convert leading and trailing whitespaces into &nbsp;
		html = html.replace( /^[ \t]+|[ \t]+$/g, function( match, offset, s ) {
			if ( match.length == 1 ) // one space, preserve it
			return '&nbsp;';
			else if ( !offset ) // beginning of block
			return tools.repeat( '&nbsp;', match.length - 1 ) + ' ';
			else // end of block
			return ' ' + tools.repeat( '&nbsp;', match.length - 1 );
		});

		// Convert subsequent whitespaces into &nbsp;
		html = html.replace( /[ \t]{2,}/g, function( match ) {
			return tools.repeat( '&nbsp;', match.length - 1 ) + ' ';
		});

		var paragraphTag = mode == CKEDITOR.ENTER_P ? 'p' : 'div';

		// Two line-breaks create one paragraph.
		if ( !isEnterBrMode ) {
			html = html.replace( /(\n{2})([\s\S]*?)(?:$|\1)/g, function( match, group1, text ) {
				return '<' + paragraphTag + '>' + text + '</' + paragraphTag + '>';
			});
		}

		// One <br> per line-break.
		html = html.replace( /\n/g, '<br>' );

		// Compensate padding <br> for non-IE.
		if ( !( isEnterBrMode || CKEDITOR.env.ie ) ) {
			html = html.replace( new RegExp( '<br>(?=</' + paragraphTag + '>)' ), function( match ) {
				return tools.repeat( match, 2 );
			});
		}

		return html;
	}

	// TODO dooooo!
	// This function should transform what browsers produce when
	// pasting plain text into editable element (see clipboard/paste.html TCs
	// for more info) into correct HTML (similar to that produced by text2Html).
	function htmledText2Html( trueType, data ) {
		// If trueType == 'html' this function should strip presentional markup
		// and all attributes.

		// Then it should unify HTML between browsers. Resulted should be similar
		// to that produced by text2Html. In fact in laziest impl it can use
		// text2Html, but that may bring more performance issues.

		return data;
	}
})();

/**
 * Fired when a clipboard operation is about to be taken into the editor.
 * Listeners can manipulate the data to be pasted before having it effectively
 * inserted into the document.
 * @name CKEDITOR.editor#paste
 * @since 3.1
 * @event
 * @param {String} data.type Type of data in data.data. Usually 'html' or 'text', but for listeners
 * 		with priority less than 6 it can be also 'auto', what means that content type has to be recognised
 * 		(this will be done by content type sniffer that listens with priority 6).
 * @param {String} data.data Data to be pasted - html or text.
 */

/**
 * Internal event to open the Paste dialog
 * @name CKEDITOR.editor#pasteDialog
 * @event
 */
