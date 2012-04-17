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
			element._ = { editor: editor, listeners: [] };

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

	// Registers an event that needs to be dettached (on dettach()).
	function attachListener( editable, obj, event, fn, scope ) {
		// Register the listerner.
		editable._.listeners.push( obj.on( event, fn, scope ) );
	}

	function attach( editor, element ) {
		var doc = editor.document = element.getDocument(),
			isWindow = element.is( 'body' );

		// Setup focus/blur.
		var focusElement = isWindow ? doc.getWindow() : element;
		attachListener( element, focusElement, 'focus', editorFocus, editor );
		attachListener( element, focusElement, 'blur', editorBlur, editor );

		var keystrokeHandler = editor.keystrokeHandler;
		keystrokeHandler.blockedKeystrokes[ 8 ] = !editor.readOnly;
		editor.keystrokeHandler.attach( element );

		// IE standard compliant in editing frame doesn't focus the editor when
		// clicking outside actual content, manually apply the focus. (#1659)
		if ( !editor.readOnly && isWindow && (
		( CKEDITOR.env.ie && doc.$.compatMode == 'CSS1Compat' ) || CKEDITOR.env.gecko || CKEDITOR.env.opera ) ) {
			var htmlElement = doc.getDocumentElement();
			attachListener( element, htmlElement, 'mousedown', function( evt ) {
				// Setting focus directly on editor doesn't work, we
				// have to use here a temporary element to 'redirect'
				// the focus.
				if ( evt.data.getTarget().equals( htmlElement ) ) {
					if ( CKEDITOR.env.gecko && CKEDITOR.env.version >= 10900 )
						blinkCursor( editor );
					editor.focus();
				}
			});
		}

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
				attachListener( element, element, CKEDITOR.env.ie ? 'resizestart' : 'resize', function( evt ) {
					evt.data.preventDefault();
				});
			}
		}

		// ## END

		// Gecko needs a key event to 'wake up' editing when the document is
		// empty. (#3864, #5781)
		!editor.readOnly && CKEDITOR.env.gecko && isWindow && CKEDITOR.tools.setTimeout( activateEditing, 0, element, editor );

		// Fire doubleclick event for double-clicks.
		!editor.readOnly && attachListener( element, element, 'dblclick', function( evt ) {
			var data = { element: evt.data.getTarget() };
			editor.fire( 'doubleclick', data );

			// TODO: Make the following work at the proper place (from v3).
			// data.dialog && editor.openDialog( data.dialog );
		});

		// TODO: check if this is effective.
		// Prevent automatic submission in IE #6336
		CKEDITOR.env.ie && attachListener( element, element, 'click', blockInputClick );

		// Gecko/Webkit need some help when selecting control type elements. (#3448)
		if ( !( CKEDITOR.env.ie || CKEDITOR.env.opera ) ) {
			attachListener( element, element, 'mousedown', function( ev ) {
				var control = ev.data.getTarget();
				if ( control.is( 'img', 'hr', 'input', 'textarea', 'select' ) )
					editor.getSelection().selectElement( control );
			});
		}

		if ( CKEDITOR.env.gecko ) {
			// TODO: check if this is effective.
			attachListener( element, element, 'mouseup', function( ev ) {
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
		attachListener( element, element, 'click', function( ev ) {
			ev = ev.data;
			if ( ev.getTarget().is( 'a' ) && ev.$.button != 2 )
				ev.preventDefault();
		});

		// Webkit: avoid from editing form control elements content.
		if ( CKEDITOR.env.webkit ) {
			// Mark that cursor will right blinking (#7113).
			attachListener( element, element, 'mousedown', function() {
				editor._.wasFocused = 1;
			});

			// Prevent from tick checkbox/radiobox/select
			attachListener( element, element, 'click', function( ev ) {
				if ( ev.data.getTarget().is( 'input', 'select' ) )
					ev.data.preventDefasult();
			});

			// Prevent from editig textfield/textarea value.
			attachListener( element, element, 'mouseup', function( ev ) {
				if ( ev.data.getTarget().is( 'input', 'textarea' ) )
					ev.data.preventDefault();
			});
		}

		!editor.readOnly && attachListener( element, element, 'keydown', function( evt ) {
			var keyCode = evt.data.getKeystroke();

			// Backspace OR Delete.
			if ( keyCode in { 8:1,46:1 } ) {
				var sel = editor.getSelection(),
					selected = sel.getSelectedElement(),
					range = sel.getRanges()[ 0 ];

				// Override keystrokes which should have deletion behavior
				//  on fully selected element . (#4047) (#7645)
				if ( selected ) {
					// Make undo snapshot.
					editor.fire( 'saveSnapshot' );

					// Delete any element that 'hasLayout' (e.g. hr,table) in IE8 will
					// break up the selection, safely manage it here. (#4795)
					range.moveToPosition( selected, CKEDITOR.POSITION_BEFORE_START );
					// Remove the control manually.
					selected.remove();
					range.select();

					editor.fire( 'saveSnapshot' );

					evt.data.preventDefault();
					return;
				}
			}
		});

		if ( CKEDITOR.env.ie ) {
			// v3: check if this is needed.
			// editor.document.getDocumentElement().addClass( domDocument.$.compatMode );

			// PageUp/PageDown scrolling is broken in document
			// with standard doctype, manually fix it. (#4736)
			if ( editor.document.$.compatMode == 'CSS1Compat' ) {
				attachListener( element, element, 'keydown', function( evt ) {
					if ( evt.data.getKeystroke() in { 33:1,34:1 } ) {
						setTimeout( function() {
							editor.getSelection().scrollIntoView();
						}, 0 );
					}
				});
			}
		}

		// Auto fixing on some document structure weakness to enhance usabilities. (#3190 and #3189)
		attachListener( element, editor, 'selectionChange', function( evt ) {
			if ( editor.readOnly )
				return;

			var sel = editor.getSelection();
			// Do it only when selection is not locked. (#8222)
			if ( sel && !sel.isLocked ) {
				var isDirty = editor.checkDirty();
				editor.fire( 'saveSnapshot', { contentOnly:1 } );
				onSelectionChangeFixBody.call( this, evt );
				editor.fire( 'updateSnapshot' );
				!isDirty && editor.resetDirty();
			}
		});

		// Disable form elements editing mode provided by some browers, (#5746)
		// and flag that the element was locked by our code so it'll be editable by the editor functions (#6046).
		attachListener( element, editor, 'insertElement', function( evt ) {
			var element = evt.data;
			if ( element.type == CKEDITOR.NODE_ELEMENT && ( element.is( 'input' ) || element.is( 'textarea' ) ) ) {
				// The element is still not inserted yet, force attribute-based check.
				if ( !element.isReadOnly( 1 ) )
					element.data( 'cke-editable', element.hasAttribute( 'contenteditable' ) ? 'true' : '1' );
				element.setAttribute( 'contentEditable', false );
			}
		});
	}

	function detach( editable ) {
		// Remove all event listeners.
		var listeners = editable._.listeners;

		while ( listeners.length )
			listeners.pop().removeListener();

		// Cleanup the element.
		editable.removeClass( 'ckeditor-editable' );

		// Free up the editor reference.
		delete editable._.editor;
	}

	function editorFocus() {
		var doc = this.document;

		if ( !this.readOnly && CKEDITOR.env.gecko && CKEDITOR.env.version >= 10900 )
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

			// Check some specialities of the current path block:
			// 1. It is really displayed as block; (#7221)
			// 2. It doesn't end with one inner block; (#7467)
			// 3. It doesn't have bogus br yet.
			if ( pathBlock && pathBlock.isBlockBoundary() && !( lastNode && lastNode.type == CKEDITOR.NODE_ELEMENT && lastNode.isBlockBoundary() ) && !pathBlock.is( 'pre' ) && !pathBlock.getBogus() ) {
				pathBlock.appendBogus();
			}
		}

		// When we're in block enter mode, a new paragraph will be established
		// to encapsulate inline contents right under body. (#3657)
		if ( editor.config.autoParagraph !== false && enterMode != CKEDITOR.ENTER_BR && range.collapsed && blockLimit.getName() == 'body' && !path.block ) {
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
				if ( element && element.type == CKEDITOR.NODE_ELEMENT && !nonEditable( element ) ) {
					range.moveToElementEditStart( element );
					fixedBlock.remove();
				} else {
					element = fixedBlock.getPrevious( isNotWhitespace );
					if ( element && element.type == CKEDITOR.NODE_ELEMENT && !nonEditable( element ) ) {
						range.moveToElementEditEnd( element );
						fixedBlock.remove();
					}
				}
			}

			range.select();
			// Cancel this selection change in favor of the next (correct).  (#6811)
			evt.cancel();
		}

		// Browsers are incapable of moving cursor out of certain block elements (e.g. table, div, pre)
		// at the end of document, makes it unable to continue adding content, we have to make this
		// easier by opening an new empty paragraph.
		var testRange = new CKEDITOR.dom.range( editor.document );
		testRange.moveToElementEditEnd( editor.document.getBody() );
		var testPath = new CKEDITOR.dom.elementPath( testRange.startContainer );
		if ( !testPath.blockLimit.is( 'body' ) ) {
			var paddingBlock;
			if ( enterMode != CKEDITOR.ENTER_BR )
				paddingBlock = body.append( editor.document.createElement( enterMode == CKEDITOR.ENTER_P ? 'p' : 'div' ) );
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
		if ( editor.readOnly || !editor.editable().is( 'body' ) )
			return;

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

		if ( !data )
			return;

		// HTML insertion only considers the first range.
		var selection = this.getSelection(),
			range = selection.getRanges()[ 0 ];

		if ( range.checkReadOnly() )
			return;

		// Opera: force block splitting when pasted content contains block. (#7801)
		if ( CKEDITOR.env.opera ) {
			var path = new CKEDITOR.dom.elementPath( range.startContainer );
			if ( path.block ) {
				var nodes = CKEDITOR.htmlParser.fragment.fromHtml( data, false ).children;
				for ( var i = 0, count = nodes.length; i < count; i++ ) {
					if ( nodes[ i ]._.isBlockLike ) {
						range.splitBlock( this.enterMode == CKEDITOR.ENTER_DIV ? 'div' : 'p' );
						range.insertNode( range.document.createText( '' ) );
						range.select();
						break;
					}
				}
			}
		}

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

			$sel.createRange().pasteHTML( data );

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

	// Elements that could blink the cursor anchoring beside it, like hr, page-break. (#6554)
	function nonEditable( element ) {
		return element.isBlockBoundary() && CKEDITOR.dtd.$empty[ element.getName() ];
	}

	// Matching an empty paragraph at the end of document.
	var emptyParagraphRegexp = /(^|<body\b[^>]*>)\s*<(p|div|address|h\d|center|pre)[^>]*>\s*(?:<br[^>]*>|&nbsp;|\u00A0|&#160;)?\s*(:?<\/\2>)?\s*(?=$|<\/body>)/gi;

	var isNotWhitespace = CKEDITOR.dom.walker.whitespaces( true ),
		isNotBookmark = CKEDITOR.dom.walker.bookmark( false, true );
})();
