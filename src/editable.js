/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function() {
	var Editable = CKEDITOR.tools.createClass({
		base: CKEDITOR.dom.element,

		$: function( editor, element ) {
			// Transform the element into a CKEDITOR.dom.element instance.
			element = CKEDITOR.dom.element.get( element );
			element._ = { editor: editor };

			element.addClass( 'ckeditor-editable' );

			// Start the CKEditor magic for this element.
			if ( editor.loaded )
				attach( editor, element );
			else {
				editor.on( 'loaded', function() {
					attach( editor, element );
				});
			}

			element.insertHtml = onInsert( doInsertHtml );
			element.insertElement = onInsert( doInsertElement );
			element.insertText = onInsert( doInsertText );

			return CKEDITOR.dom.element.get( element );
		}
	});

	// This method is being defined here because we want to keep the Editable
	// class contructor private, avoiding having it's entire code into editor.js.
	CKEDITOR.editor.prototype.editable = function( element ) {
		var editable = this._.editable;

		if ( arguments.length )
			editable = this._.editable = element ? new Editable( this, element ) : ( detach( editable ), null );

		return editable;
	}

	function attach( editor, element ) {
		editor.document = element.getDocument();

		// TODO: A lot of things are supposed to happen her (good part of the
		// v3 wywiwygarea plugin code).
		// For now, we have just a small part of it, to check if things work.

		var focusElement = element;
		if ( focusElement.is( 'body' ) )
			focusElement = element.getDocument().getWindow();

		focusElement.on( 'focus', editorFocus, editor );
		focusElement.on( 'blur', editorBlur, editor );

		// ## START : disableNativeTableHandles and disableObjectResizing settings.

		// Note that these settings are applied "document wide". It's not
		// possible to limit them to specific editables only.

		// IE, Opera and Safari may not support it and throw errors.
		try {
			editor.document.$.execCommand( 'enableInlineTableEditing', false, !editor.config.disableNativeTableHandles );
		} catch ( e ) {}

		if ( editor.config.disableObjectResizing ) {
			try {
				element.getDocument().$.execCommand( 'enableObjectResizing', false, false );
			} catch ( e ) {
				// For browsers in which the above method failed, we can cancel the resizing on the fly (#4208)
				element.on( CKEDITOR.env.ie ? 'resizestart' : 'resize', function( evt ) {
					evt.data.preventDefault();
				});
			}
		}

		// ## END

		// Gecko needs a key event to 'wake up' editing when the document is
		// empty. (#3864, #5781)
		CKEDITOR.env.gecko && CKEDITOR.tools.setTimeout( activateEditing, 0, element, editor );

		// Fire doubleclick event for double-clicks.
		element.on( 'dblclick', function( evt ) {
			var data = { element: evt.data.getTarget() };
			editor.fire( 'doubleclick', data );

			// TODO: Make the following work at the proper place (from v3).
			// data.dialog && editor.openDialog( data.dialog );
		});

		// TODO: check if this is effective.
		// Prevent automatic submission in IE #6336
		CKEDITOR.env.ie && element.on( 'click', blockInputClick );

		// Gecko/Webkit need some help when selecting control type elements. (#3448)
		if ( !( CKEDITOR.env.ie || CKEDITOR.env.opera ) ) {
			element.on( 'mousedown', function( ev ) {
				var control = ev.data.getTarget();
				if ( control.is( 'img', 'hr', 'input', 'textarea', 'select' ) )
					editor.getSelection().selectElement( control );
			});
		}

		if ( CKEDITOR.env.gecko ) {
			// TODO: check if this is effective.
			element.on( 'mouseup', function( ev ) {
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

		// TODO: check if this is effective.
		// Prevent the browser opening links in read-only blocks. (#6032)
		element.on( 'click', function( ev ) {
			ev = ev.data;
			if ( ev.getTarget().is( 'a' ) && ev.$.button != 2 )
				ev.preventDefault();
		});

		// Webkit: avoid from editing form control elements content.
		if ( CKEDITOR.env.webkit ) {
			// Mark that cursor will right blinking (#7113).
			element.on( 'mousedown', function() {
				editor._.wasFocused = 1;
			});

			// Prevent from tick checkbox/radiobox/select
			element.on( 'click', function( ev ) {
				if ( ev.data.getTarget().is( 'input', 'select' ) )
					ev.data.preventDefault();
			});

			// Prevent from editig textfield/textarea value.
			element.on( 'mouseup', function( ev ) {
				if ( ev.data.getTarget().is( 'input', 'textarea' ) )
					ev.data.preventDefault();
			});
		}

		if ( CKEDITOR.env.ie ) {
			editor.document.getDocumentElement().addClass( domDocument.$.compatMode );

			// Override keystrokes which should have deletion behavior
			// on control types in IE . (#4047)
			element.on( 'keydown', function( evt ) {
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
			if ( editor.document.$.compatMode == 'CSS1Compat' ) {
				element.on( 'keydown', function( evt ) {
					if ( evt.data.getKeystroke() in { 33:1,34:1 } ) {
						setTimeout( function() {
							editor.getSelection().scrollIntoView();
						}, 0 );
					}
				});
			}
		}

		// Auto fixing on some document structure weakness to enhance usabilities. (#3190 and #3189)
		editor.on( 'selectionChange', onSelectionChangeFixBody, null, null, 1 );

		// Disable form elements editing mode provided by some browers. (#5746)
		editor.on( 'insertElement', function( evt ) {
			var element = evt.data;
			if ( element.type == CKEDITOR.NODE_ELEMENT && ( element.is( 'input' ) || element.is( 'textarea' ) ) ) {
				// We should flag that the element was locked by our code so
				// it'll be editable by the editor functions (#6046).
				if ( !element.isReadOnly() )
					element.data( 'cke-editable', element.hasAttribute( 'contenteditable' ) ? 'true' : '1' );
				element.setAttribute( 'contentEditable', false );
			}
		});
	}

	function detach( editable ) {
		editable.removeClass( 'ckeditor-editable' );
		editable.removeListener( 'focus', editorFocus );

		delete editable._.editor;
	}

	function editorFocus() {
		var doc = this.document;

		if ( CKEDITOR.env.gecko && CKEDITOR.env.version >= 10900 )
			blinkCursor( this );
		else if ( CKEDITOR.env.opera )
			doc && doc.getBody().focus();
		// TODO: Check if the following is effective.s
		// Webkit needs focus for the first time on the HTML element. (#6153)
		else if ( CKEDITOR.env.webkit ) {
			if ( !this._.wasFocused ) {
				doc && doc.getDocumentElement().focus();
				this._.wasFocused = 1;
			}
		}

		this.focusManager.focus();
	}

	function editorBlur() {
		this.focusManager.blur();
	}

	function activateEditing( editor ) {
		var editable = editor.editable();

		// TODO: Check whether this is needed on inline mode.
		// Needed for full page only.
		if ( !editable.is( 'body' ) )
			return;

		var win = editor.window,
			doc = editor.document,
			body = doc.getBody(),
			bodyFirstChild = body.getFirst(),
			bodyChildsNum = body.getChildren().count();

		if ( !bodyChildsNum || bodyChildsNum == 1 && bodyFirstChild.type == CKEDITOR.NODE_ELEMENT && bodyFirstChild.hasAttribute( '_moz_editor_bogus_node' ) ) {
			restoreDirty( editor );

			// Memorize scroll position to restore it later (#4472).
			var hostDocument = editor.element.getDocument();
			var hostDocumentElement = hostDocument.getDocumentElement();
			var scrollTop = hostDocumentElement.$.scrollTop;
			var scrollLeft = hostDocumentElement.$.scrollLeft;

			// Simulating keyboard character input by dispatching a keydown of white-space text.
			var keyEventSimulate = doc.$.createEvent( "KeyEvents" );
			keyEventSimulate.initKeyEvent( 'keypress', true, true, win.$, false, false, false, false, 0, 32 );
			doc.$.dispatchEvent( keyEventSimulate );

			if ( scrollTop != hostDocumentElement.$.scrollTop || scrollLeft != hostDocumentElement.$.scrollLeft )
				hostDocument.getWindow().$.scrollTo( scrollLeft, scrollTop );

			// Restore the original document status by placing the cursor before a bogus br created (#5021).
			bodyChildsNum && body.getFirst().remove();
			doc.getBody().appendBogus();
			var nativeRange = new CKEDITOR.dom.range( doc );
			nativeRange.setStartAt( body, CKEDITOR.POSITION_AFTER_START );
			nativeRange.select();
		}
	}


	// Auto-fixing block-less content by wrapping paragraph (#3190), prevent
	// non-exitable-block by padding extra br.(#3189)
	function onSelectionChangeFixBody( evt ) {
		var editor = evt.editor,
			path = evt.data.path,
			blockLimit = path.blockLimit,
			selection = evt.data.selection,
			range = selection.getRanges()[ 0 ],
			body = editor.document.getBody(),
			enterMode = editor.config.enterMode;

		if ( CKEDITOR.env.gecko ) {
			activateEditing( editor );

			// Ensure bogus br could help to move cursor (out of styles) to the end of block. (#7041)
			var pathBlock = path.block || path.blockLimit,
				lastNode = pathBlock && pathBlock.getLast( isNotEmpty );

			// In case it's not ended with block element and doesn't have bogus yet. (#7467)
			if ( pathBlock && !( lastNode && lastNode.type == CKEDITOR.NODE_ELEMENT && lastNode.isBlockBoundary() ) && !pathBlock.is( 'pre' ) && !pathBlock.getBogus() ) {
				editor.fire( 'updateSnapshot' );
				restoreDirty( editor );
				pathBlock.appendBogus();
			}
		}

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
				var element = fixedBlock.getNext( isNotWhitespace );
				if ( element && element.type == CKEDITOR.NODE_ELEMENT && !nonExitable( element ) ) {
					range.moveToElementEditStart( element );
					fixedBlock.remove();
				} else {
					element = fixedBlock.getPrevious( isNotWhitespace );
					if ( element && element.type == CKEDITOR.NODE_ELEMENT && !nonExitable( element ) ) {
						range.moveToElementEditEnd( element );
						fixedBlock.remove();
					}
				}
			}

			range.select();
			// Cancel this selection change in favor of the next (correct).  (#6811)
			evt.cancel();
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

	// DOM modification here should not bother dirty flag.(#4385)
	function restoreDirty( editor ) {
		if ( !editor.checkDirty() )
			setTimeout( function() {
			editor.resetDirty();
		}, 0 );
	}

	function restoreSelection( selection ) {
		if ( selection.isLocked ) {
			selection.unlock();
			setTimeout( function() {
				selection.lock();
			}, 0 );
		}
	}

	function blockInputClick( evt ) {
		var element = evt.data.getTarget();
		if ( element.is( 'input' ) ) {
			var type = element.getAttribute( 'type' );
			if ( type == 'submit' || type == 'reset' )
				evt.data.preventDefault();
		}
	}

	// Switch on design mode for a short while and close it after then.
	function blinkCursor( editor, retry ) {
		CKEDITOR.tools.tryThese( function() {
			editor.document.$.designMode = 'on';
			setTimeout( function() {
				editor.document.$.designMode = 'off';
				if ( CKEDITOR.currentInstance == editor )
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
			!retry && blinkCursor( editor, 1 );
		});
	}

	function onInsert( insertFunc ) {
		return function( data ) {
			var editor = this._.editor;

			if ( editor.mode == 'wysiwyg' ) {
				editor.focus();

				editor.fire( 'saveSnapshot' );

				insertFunc.call( editor, data );

				// Save snaps after the whole execution completed.
				// This's a workaround for make DOM modification's happened after
				// 'insertElement' to be included either, e.g. Form-based dialogs' 'commitContents'
				// call.
				CKEDITOR.tools.setTimeout( function() {
					editor.fire( 'saveSnapshot' );
				}, 0 );
			}
		};
	}

	function doInsertHtml( data ) {
		if ( this.dataProcessor )
			data = this.dataProcessor.toHtml( data );

		// HTML insertion only considers the first range.
		var selection = this.getSelection(),
			range = selection.getRanges()[ 0 ];

		if ( range.checkReadOnly() )
			return;

		if ( CKEDITOR.env.ie ) {
			var selIsLocked = selection.isLocked;

			if ( selIsLocked )
				selection.unlock();

			var $sel = selection.getNative();

			// Delete control selections to avoid IE bugs on pasteHTML.
			if ( $sel.type == 'Control' )
				$sel.clear();
			else if ( selection.getType() == CKEDITOR.SELECTION_TEXT ) {
				// Due to IE bugs on handling contenteditable=false blocks
				// (#6005), we need to make some checks and eventually
				// delete the selection first.

				range = selection.getRanges()[ 0 ];
				var endContainer = range && range.endContainer;

				if ( endContainer && endContainer.type == CKEDITOR.NODE_ELEMENT && endContainer.getAttribute( 'contenteditable' ) == 'false' && range.checkBoundaryOfElement( endContainer, CKEDITOR.END ) ) {
					range.setEndAfter( range.endContainer );
					range.deleteContents();
				}
			}

			try {
				$sel.createRange().pasteHTML( data );
			} catch ( e ) {}

			if ( selIsLocked )
				this.getSelection().lock();
		} else
			this.document.$.execCommand( 'inserthtml', false, data );

		// Webkit does not scroll to the cursor position after pasting (#5558)
		if ( CKEDITOR.env.webkit ) {
			selection = this.getSelection();
			selection.scrollIntoView();
		}
	}

	function doInsertText( text ) {
		var selection = this.getSelection(),
			mode = selection.getStartElement().hasAscendant( 'pre', true ) ? CKEDITOR.ENTER_BR : this.config.enterMode,
			isEnterBrMode = mode == CKEDITOR.ENTER_BR;

		var html = CKEDITOR.tools.htmlEncode( text.replace( /\r\n|\r/g, '\n' ) );

		// Convert leading and trailing whitespaces into &nbsp;
		html = html.replace( /^[ \t]+|[ \t]+$/g, function( match, offset, s ) {
			if ( match.length == 1 ) // one space, preserve it
			return '&nbsp;';
			else if ( !offset ) // beginning of block
			return CKEDITOR.tools.repeat( '&nbsp;', match.length - 1 ) + ' ';
			else // end of block
			return ' ' + CKEDITOR.tools.repeat( '&nbsp;', match.length - 1 );
		});

		// Convert subsequent whitespaces into &nbsp;
		html = html.replace( /[ \t]{2,}/g, function( match ) {
			return CKEDITOR.tools.repeat( '&nbsp;', match.length - 1 ) + ' ';
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
				return CKEDITOR.tools.repeat( match, 2 );
			});
		}

		// Inline styles have to be inherited in Firefox.
		if ( CKEDITOR.env.gecko || CKEDITOR.env.webkit ) {
			var path = new CKEDITOR.dom.elementPath( selection.getStartElement() ),
				context = [];

			for ( var i = 0; i < path.elements.length; i++ ) {
				var tag = path.elements[ i ].getName();
				if ( tag in CKEDITOR.dtd.$inline )
					context.unshift( path.elements[ i ].getOuterHtml().match( /^<.*?>/ ) );
				else if ( tag in CKEDITOR.dtd.$block )
					break;
			}

			// Reproduce the context  by preceding the pasted HTML with opening inline tags.
			html = context.join( '' ) + html;
		}

		doInsertHtml.call( this, html );
	}

	function doInsertElement( element ) {
		var selection = this.getSelection(),
			ranges = selection.getRanges(),
			elementName = element.getName(),
			isBlock = CKEDITOR.dtd.$block[ elementName ];

		var selIsLocked = selection.isLocked;

		if ( selIsLocked )
			selection.unlock();

		var range, clone, lastElement, bookmark;

		for ( var i = ranges.length - 1; i >= 0; i-- ) {
			range = ranges[ i ];

			if ( !range.checkReadOnly() ) {
				// Remove the original contents, merge splitted nodes.
				range.deleteContents( 1 );

				clone = !i && element || element.clone( 1 );

				// If we're inserting a block at dtd-violated position, split
				// the parent blocks until we reach blockLimit.
				var current, dtd;
				if ( isBlock ) {
					while ( ( current = range.getCommonAncestor( 0, 1 ) ) && ( dtd = CKEDITOR.dtd[ current.getName() ] ) && !( dtd && dtd[ elementName ] ) ) {
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
		}

		if ( lastElement ) {
			range.moveToPosition( lastElement, CKEDITOR.POSITION_AFTER_END );

			// If we're inserting a block element immediatelly followed by
			// another block element, the selection must move there. (#3100,#5436)
			if ( isBlock ) {
				var next = lastElement.getNext( isNotWhitespace ),
					nextName = next && next.type == CKEDITOR.NODE_ELEMENT && next.getName();

				// Check if it's a block element that accepts text.
				if ( nextName && CKEDITOR.dtd.$block[ nextName ] && CKEDITOR.dtd[ nextName ][ '#' ] )
					range.moveToElementEditStart( next );
			}
		}

		selection.selectRanges( [ range ] );

		if ( selIsLocked )
			this.getSelection().lock();
	}

	function isBlankParagraph( block ) {
		return block.getOuterHtml().match( emptyParagraphRegexp );
	}

	function isNotEmpty( node ) {
		return isNotWhitespace( node ) && isNotBookmark( node );
	}

	function isNbsp( node ) {
		return node.type == CKEDITOR.NODE_TEXT && CKEDITOR.tools.trim( node.getText() ).match( /^(?:&nbsp;|\xa0)$/ );
	}

	// Elements that could have empty new line around, including table, pre-formatted block, hr, page-break. (#6554)
	function nonExitable( element ) {
		return ( element.getName() in nonExitableElementNames ) || element.isBlockBoundary() && CKEDITOR.dtd.$empty[ element.getName() ];
	}

	// List of elements in which has no way to move editing focus outside.
	var nonExitableElementNames = { table:1,pre:1 };

	// Matching an empty paragraph at the end of document.
	var emptyParagraphRegexp = /(^|<body\b[^>]*>)\s*<(p|div|address|h\d|center)[^>]*>\s*(?:<br[^>]*>|&nbsp;|\u00A0|&#160;)?\s*(:?<\/\2>)?\s*(?=$|<\/body>)/gi;

	var isNotWhitespace = CKEDITOR.dom.walker.whitespaces( true ),
		isNotBookmark = CKEDITOR.dom.walker.bookmark( false, true );
})();
