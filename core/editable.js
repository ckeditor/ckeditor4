/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function() {
	/**
	 *  Editable class which provides all editing related activities by
	 *  the "contenteditable" element, dynamically get attached to editor instance.
	 * @class
	 */
	CKEDITOR.editable = CKEDITOR.tools.createClass({
		base: CKEDITOR.dom.element,
		/**
		 * The constructor hold only generic editable creation logic that are commonly shared among all different editable elements.
		 * @param editor The editor instance on which the editable operates.
		 * @param element Any DOM element that been used as the editor's editing container, e.g. it could be either
		 * an HTML element with the "contenteditable" attribute set to the true that handles wysiwyg editing
		 * or a &lt;textarea&gt; element that handles source editing.
		 */
		$: function( editor, element ) {
			// Transform the element into a CKEDITOR.dom.element instance.
			this.base( element.$ || element );

			this.editor = editor;

			// Handle the load/read of editor data/snapshot.
			this.attachListener( editor, 'beforeGetData', function() {
				editor.setData( this.getData(), null, 1 );
			}, this );
			this.attachListener( editor, 'getSnapshot', function( evt ) {
				evt.data = this.getData( 1 );
			}, this );
			this.attachListener( editor, 'afterSetData', function() {
				this.setData( editor.getData( 1 ) );
			}, this );
			this.attachListener( editor, 'loadSnapshot', function( evt ) {
				this.setData( evt.data, 1 );
			}, this );

			// Delegate editor focus/blur to editable.
			this.attachListener( editor, 'beforeFocus', function() {
				this.focus();
			}, this );

			/**
			 * Indicate whether the editable element has gained focus.
			 * @name CKEDITOR.editable.prototype.hasFocus
			 */
			this.hasFocus = false;

			// The bootstrapping logic.
			this.setup();
		},
		proto: {
			/**
			 * Override {@link CKEDITOR.dom.element.prototype.on} to have special focus/blur handling.
			 * The "focusin/focusout" events are used in IE to replace regular "focus/blur" events
			 * because we want to avoid the asynchronous nature of later ones.
			 */
			on: function( name, fn ) {
				var args = Array.prototype.slice.call( arguments, 0 );

				if ( CKEDITOR.env.ie && /^focus|blur$/.exec( name ) ) {
					name = name == 'focus' ? 'focusin' : 'focusout';

					// The "focusin/focusout" events bubbled, e.g. If there are elements with layout
					// they fire this event when clicking in to edit them but it must be ignored
					// to allow edit their contents. (#4682)
					fn = isNotBubbling( fn, this );
					args[ 0 ] = name;
					args[ 1 ] = fn;
				}

				return CKEDITOR.dom.element.prototype.on.apply( this, args );
			},

			/**
			 * Registers an event listener that needs to be removed on detaching.
			 * @param obj
			 * @param event
			 * @param fn
			 * @param scope
			 */
			attachListener: function( obj, event, fn, scope, priority ) {
				!this._.listeners && ( this._.listeners = [] );
				// Register the listener.
				var args = Array.prototype.slice.call( arguments, 1 );
				this._.listeners.push( obj.on.apply( obj, args ) );
			},

			/**
			 * Adds a CSS class name to this editable that needs to be removed on detaching.
			 * @param {String} className The class name to be added.
			 * @see CKEDITOR.dom.element.prototype.addClass
			 */
			attachClass: function( cls ) {
				var classes = this.getCustomData( 'classes' );
				if ( !this.hasClass( cls ) ) {
					!classes && ( classes = [] ), classes.push( cls );
					this.setCustomData( 'classes', classes );
					this.addClass( cls );
				}
			},

			/**
			 * @see CKEDITOR.editor.prototype.insertHtml
			 */
			insertHtml: function( data ) {
				insert( this, 'html', data );
			},

			/**
			 * @see CKEDITOR.editor.prototype.insertText
			 */
			insertText: function( text, dontEncodeHtml ) {
				insert( this, 'text', dontEncodeHtml ? text : CKEDITOR.tools.htmlEncode( text.replace( /\r\n|\r/g, '\n' ) ) );
			},

			/**
			 * @see CKEDITOR.editor.prototype.insertElement
			 */
			insertElement: function( element ) {
				// TODO this should be gone after refactoring insertElement.
				// TODO: For unknown reason we must call directly on the editable to put the focus immediately.
				this.editor.focus();
				this.editor.fire( 'saveSnapshot' );

				var editor = this.editor,
					selection = editor.getSelection(),
					ranges = selection.getRanges(),
					elementName = element.getName(),
					isBlock = CKEDITOR.dtd.$block[ elementName ],
					selIsLocked = selection.isLocked;

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
									range.splitBlock( editor.enterMode == CKEDITOR.ENTER_DIV ? 'div' : 'p', editor.editable() );
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
					editor.getSelection().lock();

				// TODO this should be gone after refactoring insertElement.
				// Save snaps after the whole execution completed.
				// This's a workaround for make DOM modification's happened after
				// 'insertElement' to be included either, e.g. Form-based dialogs' 'commitContents'
				// call.
				setTimeout( function() {
					editable.editor.fire( 'saveSnapshot' );
				}, 0 );
			},

			/**
			 * @see CKEDITOR.editor.prototype.setData
			 */
			setData: function( data, isSnapshot ) {
				if ( !isSnapshot && this.editor.dataProcessor )
					data = this.editor.dataProcessor.toHtml( data );

				this.setHtml( data );
				this.editor.fire( 'dataReady' );
			},

			/**
			 * @see CKEDITOR.editor.prototype.getData
			 */
			getData: function( isSnapshot ) {
				var data = this.getHtml();

				if ( !isSnapshot && this.editor.dataProcessor )
					data = this.editor.dataProcessor.toDataFormat( data );

				return data;
			},

			/**
			 * Change the read-only state on this editable.
			 * @param {Boolean} isReadOnly
			 */
			setReadOnly: function( isReadOnly ) {
				this.setAttribute( 'contenteditable', !isReadOnly );
			},

			detach: function() {
				// Cleanup the element.
				this.removeClass( 'cke_editable' );

				// Save the editor reference which will be lost after
				// calling detach from super class.
				var editor = this.editor;

				this._.detach();

				// Memory leak proof.
				this.clearCustomData();

				delete editor.document;
				delete editor.window;
			},

			// Editable element bootstrapping.
			setup: function() {
				var editor = this.editor;

				// Update editable state.
				this.setReadOnly( editor.readOnly );

				// The editable class.
				this.attachClass( 'cke_editable' );
				this.attachClass( 'cke_contents_' + editor.config.contentsLangDirection );

				// Setup editor keystroke handlers on this element.
				var keystrokeHandler = editor.keystrokeHandler;
				keystrokeHandler.blockedKeystrokes[ 8 ] = editor.readOnly;
				editor.keystrokeHandler.attach( this );

				// Update focus states.
				this.on( 'blur', function() {
					this.hasFocus = false;
				});
				this.on( 'focus', function() {
					this.hasFocus = true;
				});

				// Register to focus manager.
				editor.focusManager.addFocusable( this );

				// Inherit the initial focus on editable element.
				if ( this.equals( CKEDITOR.document.getActive() ) ) {
					this.hasFocus = true;
					editor.focusManager.focus();
				}

				// The above is all we'll be doing for a <textarea> editable.
				if ( this.is( 'textarea' ) )
					return;

				// The DOM document which the editing acts upon.
				editor.document = this.getDocument();
				editor.window = this.getWindow();

				var doc = editor.document;

				// Apply contents direction on demand, with original direction saved.
				var dir = editor.config.contentsLangDirection;
				if ( this.getDirection( 1 ) != dir ) {
					var orgDir = this.getAttribute( 'dir' ) || '';
					this.setCustomData( 'org_dir_saved', orgDir );
					this.setAttribute( 'dir', dir );
				}

				// Apply tab index on demand, with original direction saved.
				if ( editor.document.equals( CKEDITOR.document ) && this.getAttribute( 'tabIndex' ) != editor.tabIndex ) {
					this.setCustomData( 'org_tabindex_saved', this.getAttribute( 'tabIndex' ) );
					this.setAttribute( 'tabIndex', editor.tabIndex );
				}

				// Create the content stylesheet for this document.
				var styles = CKEDITOR.getCss();
				if ( styles ) {
					var head = doc.getHead();
					if ( !head.getCustomData( 'stylesheet' ) )
						head.setCustomData( 'stylesheet', doc.appendStyleText( styles ) );
				}

				// Update the stylesheet sharing count.
				var ref = doc.getCustomData( 'stylesheet_ref' ) || 0;
				doc.setCustomData( 'stylesheet_ref', ref + 1 );

				// Prevent the browser opening read-only links. (#6032)
				this.attachListener( this, 'click', function( ev ) {
					ev = ev.data;
					var target = ev.getTarget();
					if ( target.is( 'a' ) && ev.$.button != 2 && target.isReadOnly() )
						ev.preventDefault();
				});

				// Override keystrokes which should have deletion behavior
				//  on fully selected element . (#4047) (#7645)
				this.attachListener( this, 'keydown', function( evt ) {
					if ( editor.readOnly )
						return false;

					var keyCode = evt.data.getKeystroke();

					// Backspace OR Delete.
					if ( keyCode in { 8:1,46:1 } ) {
						var sel = editor.getSelection(),
							selected = sel.getSelectedElement(),
							range = sel.getRanges()[ 0 ];

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
						}
					}
				});

				// Prevent automatic submission in IE #6336
				CKEDITOR.env.ie && this.attachListener( this, 'click', blockInputClick );

				// Gecko/Webkit need some help when selecting control type elements. (#3448)
				if ( !( CKEDITOR.env.ie || CKEDITOR.env.opera ) ) {
					this.attachListener( this, 'mousedown', function( ev ) {
						var control = ev.data.getTarget();
						if ( control.is( 'img', 'hr', 'input', 'textarea', 'select' ) )
							editor.getSelection().selectElement( control );
					});
				}

				// Prevent right click from selecting an empty block even
				// when selection is anchored inside it. (#5845)
				if ( CKEDITOR.env.gecko ) {
					this.attachListener( this, 'mouseup', function( ev ) {
						if ( ev.data.$.button == 2 ) {
							var target = ev.data.getTarget();

							if ( !target.getOuterHtml().replace( emptyParagraphRegexp, '' ) ) {
								var range = editor.createRange();
								range.moveToElementEditStart( target );
								range.select( true );
							}
						}
					});
				}

				// Webkit: avoid from editing form control elements content.
				if ( CKEDITOR.env.webkit ) {
					// Prevent from tick checkbox/radiobox/select
					this.attachListener( this, 'click', function( ev ) {
						if ( ev.data.getTarget().is( 'input', 'select' ) )
							ev.data.preventDefasult();
					});

					// Prevent from editig textfield/textarea value.
					this.attachListener( this, 'mouseup', function( ev ) {
						if ( ev.data.getTarget().is( 'input', 'textarea' ) )
							ev.data.preventDefault();
					});
				}

			}
		},
		_: {
			detach: function() {
				// Update the editor cached data with current data.
				this.editor.setData( this.editor.getData(), 0, 1 );

				// Remove all event listeners.
				var listeners = this._.listeners;

				// dont get broken by this.
				try {
					while ( listeners.length )
						listeners.pop().removeListener();
				} catch ( e ) {}

				// Restore original text direction.
				var orgDir = this.removeCustomData( 'org_dir_saved' );
				if ( orgDir !== null )
					orgDir ? this.setAttribute( 'dir', orgDir ) : this.removeAttribute( 'dir' );

				// Restore original tab index.
				var orgTabIndex = this.removeCustomData( 'org_tabindex_saved' );
				if ( orgTabIndex !== null )
					orgTabIndex ? this.setAttribute( 'tabIndex', orgTabIndex ) : this.removeAttribute( 'tabIndex' );

				// Cleanup our custom classes.
				var classes;
				if ( classes = this.removeCustomData( 'classes' ) ) {
					while ( classes.length )
						this.removeClass( classes.pop() );
				}

				// Remove contents stylesheet from document if it's the last usage.
				var doc = this.getDocument(),
					head = doc.getHead();
				if ( head.getCustomData( 'stylesheet' ) ) {
					var refs = doc.getCustomData( 'stylesheet_ref' );
					if ( !( --refs ) ) {
						doc.removeCustomData( 'stylesheet_ref' );
						var sheet = head.removeCustomData( 'stylesheet' );
						sheet = new CKEDITOR.dom.element( sheet.ownerNode || sheet.owningElement );
						sheet.remove();
					} else
						doc.setCustomData( 'stylesheet_ref', refs );
				}

				// Free up the editor reference.
				delete this.editor;
			}
		}
	});

	/**
	 * Create, retrieve or detach an editable element of the editor,
	 * this method should always be used instead of calling directly {@link CKEDITOR.editable}.
	 * @param {CKEDITOR.dom.element|CKEDITOR.editable} elementOrEditable The
	 *		DOM element to become the editable or a {@link CKEDITOR.editable} object.
	 */
	CKEDITOR.editor.prototype.editable = function( element, type ) {
		var editable = this._.editable;

		// This editor has already associated with
		// an editable element, sliently fails.
		if ( editable && element )
			return;

		if ( arguments.length ) {
			editable = this._.editable = element ? ( element instanceof CKEDITOR.editable ? element : new CKEDITOR.editable( this, element ) ) :
			// Detach the editable from editor.
			( editable && editable.detach(), null );
		}

		// Just retrieve the editable.
		return editable;
	};

	// Auto-fixing block-less content by wrapping paragraph (#3190), prevent
	// non-exitable-block by padding extra br.(#3189)
	function fixDom( evt ) {
		var editor = evt.editor,
			editable = editor.editable(),
			path = evt.data.path,
			blockLimit = path.blockLimit,
			selection = evt.data.selection,
			range = selection.getRanges()[ 0 ],
			enterMode = editor.config.enterMode;

		if ( CKEDITOR.env.gecko ) {
			// v3: check if this is needed.
			// activateEditing( editor );

			// Ensure bogus br could help to move cursor (out of styles) to the end of block. (#7041)
			var pathBlock = path.block || path.blockLimit || path.root,
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
		// to encapsulate inline contents inside editable. (#3657)
		if ( editor.config.autoParagraph !== false && enterMode != CKEDITOR.ENTER_BR && range.collapsed && editable.equals( blockLimit ) && !path.block ) {
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

		if ( editor.config.autoPaddingBlock !== false ) {
			// Browsers are incapable of moving cursor out of certain block elements (e.g. table, div, pre)
			// at the end of document, makes it unable to continue adding content, we have to make this
			// easier by opening an new empty paragraph.
			var testRange = editor.createRange();
			testRange.moveToElementEditEnd( editable );
			var testPath = editor.elementPath( testRange.startContainer );
			if ( testPath.blockLimit && !testPath.blockLimit.equals( editable ) ) {
				var paddingBlock;
				if ( enterMode != CKEDITOR.ENTER_BR )
					paddingBlock = editable.append( editor.document.createElement( enterMode == CKEDITOR.ENTER_P ? 'p' : 'div' ) );
				else
					paddingBlock = editable;

				if ( !CKEDITOR.env.ie )
					paddingBlock.appendBogus();
			}
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

	function isNotBubbling( fn, src ) {
		return function( evt ) {
			var target = evt.data.getTarget(),
				other = evt.data.$.toElement || evt.data.$.fromElement || evt.data.$.relatedTarget;
			other = other ? CKEDITOR.dom.element.get( other ) : null;
			if ( target.equals( src ) && !( other && src.contains( other ) ) )
				fn.call( this, evt );
		}
	}


	// Matching an empty paragraph at the end of document.
	var emptyParagraphRegexp = /(^|<body\b[^>]*>)\s*<(p|div|address|h\d|center|pre)[^>]*>\s*(?:<br[^>]*>|&nbsp;|\u00A0|&#160;)?\s*(:?<\/\2>)?\s*(?=$|<\/body>)/gi;

	var isNotWhitespace = CKEDITOR.dom.walker.whitespaces( true ),
		isNotBookmark = CKEDITOR.dom.walker.bookmark( false, true );

	CKEDITOR.on( 'instanceLoaded', function( evt ) {
		var editor = evt.editor;

		// and flag that the element was locked by our code so it'll be editable by the editor functions (#6046).
		editor.on( 'insertElement', function( evt ) {
			var element = evt.data;
			if ( element.type == CKEDITOR.NODE_ELEMENT && ( element.is( 'input' ) || element.is( 'textarea' ) ) ) {
				// // The element is still not inserted yet, force attribute-based check.
				if ( !element.isReadOnly( 1 ) )
					element.data( 'cke-editable', element.hasAttribute( 'contenteditable' ) ? 'true' : '1' );
				element.setAttribute( 'contentEditable', false );
			}
		});

		editor.on( 'selectionChange', function( evt ) {
			if ( editor.readOnly )
				return;

			// Auto fixing on some document structure weakness to enhance usabilities. (#3190 and #3189)
			var sel = editor.getSelection();
			// Do it only when selection is not locked. (#8222)
			if ( sel && !sel.isLocked ) {
				var isDirty = editor.checkDirty();
				editor.fire( 'saveSnapshot', { contentOnly:1 } );
				fixDom.call( this, evt );
				editor.fire( 'updateSnapshot' );
				!isDirty && editor.resetDirty();
			}
		});

	});


	//
	// Functions related to insertXXX methods
	//
	var insert = (function() {
		'use strict';

		/**
		 * Inserts the given (valid) HTML into the range position (with range content deleted),
		 * guarantee it's result to be a valid DOM tree.
		 *
		 * @param data The HTML to be inserted into this range.
		 *
		 * TODOs & Qs:
		 * 		* #cked_paste_end not allowed in selection place or concatenated at the end of
		 *			invalid html.
		 *		* {cke_paste_marker} not allowed in selection place.
		 * 		* Can we lost bookmarks while processing the data?
		 */
		function insert( editable, type, data ) {
			'use strict';

			beforeInsert( editable );

			var editor = editable.editor,
				doc = editable.document,
				selection = editor.getSelection(),
				// HTML insertion only considers the first range.
				// Note: getRanges will be overwritten for tests since we want to test
				// 		custom ranges and bypass native selections.
				// TODO what should we do with others? Remove?
				range = selection.getRanges()[ 0 ];

			// Check range spans in non-editable.
			if ( range.checkReadOnly() )
				return;

			// RANGE PREPARATIONS

			var path = new CKEDITOR.dom.elementPath( range.startContainer, range.root ),
				// Let root be the nearest block that's impossible to be splitted
				// during html processing.
				blockLimit = path.blockLimit || range.root,
				affectedRange = new CKEDITOR.dom.range( doc ),
				node;

			prepareRangeToDataInsertion( type, range, affectedRange, blockLimit );

			// DATA PROCESSING

			// Select range and stop execution.
			if ( !data ) {
				//bookmark = range.createBookmark();
				//mergeAdjacentInlineElements( range );
				//range.moveToBookmark( bookmark );
				return selection.selectRanges( [ range ] );
			}

			data = processDataForInsertion( editor, range, data, blockLimit );

			// DATA INSERTION

			insertDataIntoRange( range, data );

			// FINAL CLEANUP
			// Set final range position and clean up.

			cleanupAfterInsertion( type, selection, range, affectedRange );

			afterInsert( editable );
		}

		function beforeInsert( editable ) {
			// TODO: For unknown reason we must call directly on the editable to put the focus immediately.
			editable.editor.focus();

			editable.editor.fire( 'saveSnapshot' );
		}

		function afterInsert( editable ) {
			// Save snaps after the whole execution completed.
			// This's a workaround for make DOM modification's happened after
			// 'insertElement' to be included either, e.g. Form-based dialogs' 'commitContents'
			// call.
			setTimeout( function() {
				editable.editor.fire( 'saveSnapshot' );
			}, 0 );
		}

		// Range cannot starts/ends inside text node. Ends have to be elements.
		// Will merge only nodes that are children of range ends containers.
		// range.startContainer === range.endContainer
		function mergeAdjacentInlineElements( range ) {
			var doc = range.document,
				node, previousNode, nextNode,
				dtd = CKEDITOR.dtd;

			// TODO remove
			if ( !range.startContainer.equals( range.endContainer ) || range.startContainer.type != CKEDITOR.NODE_ELEMENT )
				throw new Error( 'U do sth wrong! Papa don\'t like you any more!' );

			//console.log( type, range.startContainer.$, range.startOffset, range.endOffset );
			//console.log( type, CKTESTER.tools.getHtmlWithRanges( blockLimit, new CKEDITOR.dom.rangeList([ range ]) ) );
			//return;

			node = range.startContainer.getChild( range.startOffset );

			// No nodes after range start ('aa[</b>cc').
			if ( !node )
				return;

			// Skip bookmark.
			if ( isBookmark( node ) )
				node = node.getNext();

			// Iterate to the end of range + one node further.
			while ( node && node.getIndex() < range.endOffset + 1 ) {
				// Find previous node (not bookmark).
				previousNode = node.getPrevious();
				if ( previousNode && isBookmark( previousNode ) )
					previousNode = previousNode.getPrevious();

				//console.log( type, node.$, previousNode && previousNode.$ );

				// Get next node here, because merging will move node.
				nextNode = getNext( node );

				if ( previousNode && previousNode.type == CKEDITOR.NODE_ELEMENT && node.type == CKEDITOR.NODE_ELEMENT // both are elements
				&& dtd.$inline[ previousNode.getName() ] // inline
				&& !dtd.$empty[ previousNode.getName() ] // not-empty
				&& previousNode.isIdentical( node ) ) // and are identical
				{
					merge( previousNode, node );
				}

				node = nextNode;
			}

			// Move nodeR contents into nodeL.
			function merge( nodeL, nodeR ) {
				// <b>a</b>[<b>c</b> -> <b>a[</b><b>c</b>
				var prev = nodeR.getPrevious();
				if ( prev && isBookmark( prev ) )
					nodeL.append( prev );

				nodeR.moveChildren( nodeL );
				nodeR.remove();

				// <b><u>a</u></b><b><u>c</u></b> was merged to: <b><u>a</u><u>c</u></b>
				// so now merge with range: <b>[<u>a</u><u>c</u>]</b>
				var range = new CKEDITOR.dom.range( doc );
				range.selectNodeContents( nodeL );
				mergeAdjacentInlineElements( range );
			}

			function isBookmark( node ) {
				return !!( node.type == CKEDITOR.NODE_ELEMENT && node.data( 'cke-bookmark' ) );
			}

			function getNext( node ) {
				var node = node.getNext();
				return ( node && isBookmark( node ) ) ? node.getNext() : node;
			}

			function getPrevious( node ) {
				var node = node.getPrevious();
				return ( node && isBookmark( node ) ) ? node.getPrevious() : node;
			}
		}

		// TODO for many reasons:
		// * maybe we can use one of exsisting range method?
		// * maybe we can use walkers?
		// * maybe we should think of some white spaces?
		// * maybe we should think of block elements?
		function shrinkRange( range, end ) {
			var node;

			if ( end == 'left' || end == 'both' ) {
				while ( !range.collapsed && range.startContainer.type == CKEDITOR.NODE_ELEMENT // If range starts in element
				&& ( node = range.startContainer.getChild( range.startOffset ) ) // and just before ('aa[<b>')
				&& node.type == CKEDITOR.NODE_ELEMENT // an element
				&& !CKEDITOR.dtd.$empty[ node.getName() ] ) // which is not an empty one
				{
					range.setStart( node, 0 ); // move start point into this element.
				}
			}

			// TODO probably not needed any more.
			if ( end == 'right' || end == 'both' ) {
				while ( !range.collapsed && range.endContainer.type == CKEDITOR.NODE_ELEMENT // If range ends in element
				&& ( node = range.endContainer.getChild( range.endOffset - 1 ) ) // and just after ('</b>]aa')
				&& node.type == CKEDITOR.NODE_ELEMENT // an element
				&& !CKEDITOR.dtd.$empty[ node.getName() ] ) // which is not an empty one
				{
					range.setEnd( node, node.getChildCount() ); // move end point into this element.
				}
			}
		}

		// Prepare range to its data deletion.
		// Delete its contents.
		// Prepare it to insertion.
		function prepareRangeToDataInsertion( type, range, affectedRange, blockLimit ) {
			var marker, node, parentNode,
				inlineNames = CKEDITOR.dtd.$inline;

			// Optimize range so ends are not located in text nodes if it's possible.
			range.optimize();

			if ( type == 'text' ) {
				// Shrink range.
				shrinkRange( range, 'left' );

				// TODO maybe we can try with bookmark?

				// If range starts in element then insert a marker, so empty
				// inline elements won't be removed while range.deleteContents
				// and we will be able to return with range back inside to elements
				// which boundaries where moved while deleting content.
				// E.g. 'aa<b>[bb</b>]cc' -> (after deleting) 'aa<b><span/></b>cc'
				if ( range.startContainer.type == CKEDITOR.NODE_ELEMENT ) {
					marker = CKEDITOR.dom.element.createFromHtml( '<span>&nbsp;</span>' );
					range.insertNode( marker );
					range.setStartAfter( marker );
				}
			} else // type == 'html'
			{
				// TODO could this be replaced by enlarge()?

				// Enlarge range if starts just after element opening tag ('aa<b>[aa' -> 'aa[<b>aa').
				while ( range.startOffset == 0 // If offset is 0 then startContainer is
				// an element (because range is optimized).
				&& inlineNames[ range.startContainer.getName() ] // StartContainer is an inline element.
				&& !range.startContainer.equals( blockLimit ) ) {
					range.setStartBefore( range.startContainer );
				}
				// The same but for the end.
				while ( range.endOffset == range.endContainer.getChildCount() && inlineNames[ range.endContainer.getName() ] && !range.endContainer.equals( blockLimit ) ) {
					range.setEndAfter( range.endContainer );
				}
			}

			// Delete contents of this range.
			if ( !range.collapsed )
				range.deleteContents();

			if ( type == 'text' ) {
				node = range.startContainer.getChild( range.startOffset - 1 );
				if ( node )
					affectedRange.setStartBefore( node ); // <b><br/>[<br/>^<br/></b>
				else
					affectedRange.setStart( range.startContainer, 0 ); // <b>[^<br/></b>
			}

			// If marker was created then move collapsed range into its place.
			if ( marker ) {
				range.setEndBefore( marker );
				range.collapse();
				marker.remove();
			}

			if ( type == 'html' ) {
				// Split inline elements so HTML will be inserted with its own styles.

				node = range.startContainer;
				if ( inlineNames[ node.getName() ] && !node.equals( blockLimit ) ) {
					// Find the oldest element that can be splitted.
					while ( ( parentNode = node.getParent() ) && inlineNames[ parentNode.getName() ] // Split only inline elements.
					&& !parentNode.equals( blockLimit ) )
						node = parentNode;

					range.splitElement( node );
				}
			}
		}

		function processDataForInsertion( editor, range, data, blockLimit ) {
			// Mark both ends of inserted content.
			var bmTpl = '<span id="cke_paste_%" data-cke-bookmark="1">\ufeff</span>';
			data = bmTpl.replace( '%', 'S' ) + data + bmTpl.replace( '%', 'E' );

			// Process the inserted html, in context of the insertion root.
			var args = [ data, blockLimit.getName() ],
				processor = editor.dataProcessor;
			// Don't fix for body if insertion not directly into body.
			// Otherwise let htmlDataProcessor decide.
			range.startContainer.getName() != 'body' && args.push( false );

			data = processor.toHtml.apply( processor, args );

			return data;
		}

		function insertDataIntoRange( range, data ) {
			// Insert processed data into the safest place in the world - body.
			var dataWrapper = new CKEDITOR.dom.element( 'body' ),
				node;

			dataWrapper.setHtml( data );

			// Move all nodes from data to range.
			while ( node = dataWrapper.getLast() )
				range.insertNode( node );
		}

		function cleanupAfterInsertion( type, selection, range, affectedRange ) {
			var node, previousNode, walker;

			if ( type == 'text' ) {
				node = range.endContainer;
				while ( !node.equals( affectedRange.startContainer ) )
					node = node.getParent();

				// TODO Improve this!
				affectedRange.setEnd( node, node.getChildCount() );
			}
			mergeAdjacentInlineElements( type == 'text' ? affectedRange : range );

			range.moveToBookmark({
				startNode: 'cke_paste_S',
				endNode: 'cke_paste_E',
				serializable: 1
			});

			// Rule 3.
			// Shrink range to the BEFOREEND of previous innermost editable node in source order.

			// Rule 3. applies only when HTML is being pasted because only then inline
			// elements like b, i, span are being inserted.
			if ( type == 'html' ) {
				// We can safely use walker because range is created from bookmark,
				// so boundary text nodes are already splitted.
				walker = new CKEDITOR.dom.walker( range );
				walker.guard = function( node ) {
					// Non-empty element.
					return node.type == CKEDITOR.NODE_ELEMENT && !CKEDITOR.dtd.$empty[ node.getName() ];
				};

				// Reset and walk up to the first text node.
				node = null;
				while ( previousNode = walker.previous() )
					node = previousNode;

				// Check if found element (which ends with a text node)
				// doesn't contain white-space at its end.
				// If not - move range's end to the end of this element.
				if ( node && !node.getHtml().match( /(\s|&nbsp;)$/g ) )
					range.setEndAt( node, CKEDITOR.POSITION_BEFORE_END );
			}

			range.collapse();

			// Move selection to proper place.
			// Note: selectRanges method is overwritten in tests because it creates special text nodes \u200B
			// 		what breaks assertions.
			selection.selectRanges( [ range ] );
		}

		return insert;
	})();

})();
