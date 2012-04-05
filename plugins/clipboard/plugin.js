/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/*
 * FLOW:
 * -- CTRL+C
 *		* browser's default behaviour
 * -- CTRL+V
 *		* listen onKey (onkeydown)
 *		* simulate 'beforepaste' for non-IEs on editable
 *		* simulate 'paste' for Fx2/Opera on editable
 *		* listen 'onpaste' on editable ('onbeforepaste' for IE)
 *		* fire 'beforePaste' on editor
 *		* !canceled && getClipboardData
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
 *		* !canceled && getClipboardData
 *		* execIECommand( 'paste' ) -> this fires another 'paste' event, so cancel it
 *		* fire 'paste' on editor
 *		* !canceled && fire 'afterPaste' on editor
 */

/**
 * @file Clipboard support
 */

'use strict';

(function() {
	// Register the plugin.
	CKEDITOR.plugins.add( 'clipboard', {
		requires: [ 'dialog', 'htmldataprocessor' ],
		init: function( editor ) {
			initClipboard( editor );

			CKEDITOR.dialog.add( 'paste', CKEDITOR.getUrl( this.path + 'dialogs/paste.js' ) );

			// Inserts processed data into the editor at the end of the
			// events chain.
			editor.on( 'paste', function( evt ) {
				var data = evt.data;
				if ( data.html )
					editor.insertHtml( data.html );
				else if ( data.text )
					editor.insertText( data.text );

				// Deferr 'afterPaste' so all other listeners for 'paste' will be fired first.
				setTimeout( function() {
					editor.fire( 'afterPaste' );
				}, 0 );
			}, null, null, 1000 );

			editor.on( 'pasteDialog', function( evt ) {
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
		 * Fire paste events (beforePaste, paste, afterPaste). By default editor will
		 * insert given HTML.
		 * @name CKEDITOR.editor.paste
		 * @param {String} html HTML code to be pasted.
		 */
		editor.paste = function( html ) {
			return firePasteEvents( 'html', html, true );
		};

		function addButtonsCommands() {
			addButtonCommand( 'Cut', 'cut', createCutCopyCmd( 'cut' ), 1 );
			addButtonCommand( 'Copy', 'copy', createCutCopyCmd( 'copy' ), 4 );
			addButtonCommand( 'Paste', 'paste', createPasteCmd(), 8 );

			function addButtonCommand( buttonName, commandName, command, ctxMenuOrder ) {
				var lang = editor.lang[ commandName ];

				editor.addCommand( commandName, command );
				editor.ui.addButton( buttonName, {
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
			editor.on( 'contentDom', addListenersOnEditable );

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
		function addListenersOnEditable() {
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
			// 'paste' event in IE is being fired before getClipboardData executes its callback.
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
				canUndo: false,
				exec: CKEDITOR.env.ie ?
				function( editor ) {
					// Prevent IE from pasting at the begining of the document.
					editor.focus();

					// Command will be handled by 'beforepaste', but as
					// execIECommand( 'paste' ) will fire also 'paste' event
					// we're canceling it.
					preventPasteEventNow();

					if ( editor.editable().fire( mainPasteEvent ) && !execIECommand( 'paste' ) ) {
						editor.fire( 'pasteDialog' );
						return false;
					}
				} : function( editor ) {
					try {
						if ( editor.editable().fire( mainPasteEvent ) && !editor.document.$.execCommand( 'Paste', false, null ) ) {
							throw 0;
						}
					} catch ( e ) {
						setTimeout( function() {
							editor.fire( 'pasteDialog' );
						}, 0 );
						return false;
					}
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

		function firePasteEvents( mode, data, withBeforePaste ) {
			var eventData = { mode: mode };

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

			// Reuse eventData.mode because the default one could be changed by beforePaste listeners.
			eventData[ eventData.mode ] = data;

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
		function getClipboardData( evt, mode, callback ) {
			var doc = editor.document,
				editable = editor.editable(),
				cancel = function( evt ) {
					evt.cancel();
				};

			// Avoid recursions on 'paste' event or consequent paste too fast. (#5730)
			if ( doc.getById( 'cke_pastebin' ) )
				return;

			// If the browser supports it, get the data directly
			if ( mode == 'text' && evt.data && evt.data.$.clipboardData ) {
				// evt.data.$.clipboardData.types contains all the flavours in Mac's Safari, but not on windows.
				var plain = evt.data.$.clipboardData.getData( 'text/plain' );
				if ( plain ) {
					evt.data.preventDefault();
					callback( plain );
					return;
				}
			}

			var sel = editor.getSelection(),
				range = new CKEDITOR.dom.range( doc );

			// Create container to paste into, there's no doubt to use "textarea" for
			// pure text, for rich content we prefer to use "body" since it holds
			// the least possibility to be splitted by pasted content, while this may
			// breaks the text selection on a frame-less editable, "div" would be
			// the best one in that case, also in another case on old IEs moving the
			// selection into a "body" paste bin causes error panic.
			var pastebin = new CKEDITOR.dom.element( mode == 'text' ? 'textarea' : editable.is( 'body' ) && !CKEDITOR.env.ie ? 'body' : 'div', doc );

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

			// Turn off design mode temporarily before give focus to the paste bin.
			if ( mode == 'text' )
				pastebin.$.focus();
			else {
				range.setStartAt( pastebin, CKEDITOR.POSITION_AFTER_START );
				range.setEndAt( pastebin, CKEDITOR.POSITION_BEFORE_END );
				range.select( true );
			}

			// Wait a while and grab the pasted contents
			setTimeout( function() {
				// Restore properly the document focus. (#5684, #8849)
				editable.focus();
				editor.removeListener( 'selectionChange', cancel );

				// Grab the HTML contents.
				// We need to look for a apple style wrapper on webkit it also adds
				// a div wrapper if you copy/paste the body of the editor.
				// Remove hidden div and restore selection.
				var bogusSpan;
				pastebin = ( CKEDITOR.env.webkit && ( bogusSpan = pastebin.getFirst() ) && ( bogusSpan.is && bogusSpan.hasClass( 'Apple-style-span' ) ) ? bogusSpan : pastebin );


				// IE7: selection must go before removing pastebin. (#8691)
				sel.selectBookmarks( bms );
				pastebin.remove();
				callback( pastebin[ 'get' + ( mode == 'text' ? 'Value' : 'Html' ) ]() );
			}, 0 );
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
			// Default mode is 'html', but can be changed by beforePaste listeners.
			var eventData = { mode: 'html' };
			// Fire 'beforePaste' event so clipboard flavor get customized by other plugins.
			// If 'beforePaste' is canceled continue executing getClipboardData and then do nothing
			// (do not fire 'paste', 'afterPaste' events). This way we can grab all - synthetically
			// and natively pasted content and prevent its insertion into editor
			// after canceling 'beforePaste' event.
			var beforePasteNotCanceled = editor.fire( 'beforePaste', eventData );

			getClipboardData( evt, eventData.mode, function( data ) {
				// Clean up.
				// Content can be trimmed because pasting space produces '&nbsp;'.
				data = CKEDITOR.tools.trim( data.replace( /<span[^>]+data-cke-bookmark[^<]*?<\/span>/ig, '' ) );

				// Fire remaining events (without beforePaste)
				beforePasteNotCanceled && firePasteEvents( eventData.mode, data );
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
	};
})();

/**
 * Fired when a clipboard operation is about to be taken into the editor.
 * Listeners can manipulate the data to be pasted before having it effectively
 * inserted into the document.
 * @name CKEDITOR.editor#paste
 * @since 3.1
 * @event
 * @param {String} [data.html] The HTML data to be pasted. If not available, e.data.text will be defined.
 * @param {String} [data.text] The plain text data to be pasted, available when plain text operations are to used. If not available, e.data.html will be defined.
 */

/**
 * Internal event to open the Paste dialog
 * @name CKEDITOR.editor#pasteDialog
 * @event
 */
