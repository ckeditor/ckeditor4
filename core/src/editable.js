/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function() {
	/**
	 *  Abstract class which presents all editing related activities provided by an element, dynamically attached to the editor,
	 *  subclass of it should provide concrete implementation of all defined interfaces.
	 * @class
	 */
	CKEDITOR.editable = CKEDITOR.tools.createClass({
		base: CKEDITOR.dom.element,
		_: {},

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
			this.attachListener( editor, 'beforeFocus', this.focus, this );

			// Handle editor's html/element/text insertion.
			this.attachListener( editor, 'insertHtml', onInsert( this.insertHtml ), this, null, 20 );
			this.attachListener( editor, 'insertElement', onInsert( this.insertElement ), this, null, 20 );
			this.attachListener( editor, 'insertText', onInsert( this.insertText ), this, null, 20 );
		},
		proto: {
			/**
			 * @name insertHtml
			 * @function
			 * @see CKEDITOR.editor.prototype.insertHtml
			 */

			/**
			 * @name insertElement
			 * @function
			 * @see CKEDITOR.editor.prototype.insertElement
			 */

			/**
			 *@name insertText
			 * @function
			 * @see CKEDITOR.editor.prototype.insertText
			 */

			/**
			 * @name setData
			 * @function
			 * @see CKEDITOR.editor.prototype.setData
			 */

			/**
			 * @name getData
			 * @function
			 * @see CKEDITOR.editor.prototype.getData
			 */

			/**
			 *  How the editable is detached from the
			 *  editor instance and eventually get destroyed.
			 */
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

				// Free up the editor reference.
				delete this.editor;
			},

			/**
			 * Registers an event listener that needs to be removed on detaching.
			 * @param obj
			 * @param event
			 * @param fn
			 * @param scope
			 */
			attachListener: function( obj, event, fn, scope ) {
				!this._.listeners && ( this._.listeners = [] );
				// Register the listener..
				this._.listeners.push( obj.on( event, fn, scope ) );
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
			editable = this._.editable = element ? ( element instanceof CKEDITOR.editable ? element : new CKEDITOR.wysiwyg( this, element ) ) :
			// Detach the editable from editor.
			( editable && editable.detach(), null );
		}

		// Just retrieve the editable.
		return editable;
	};

	/**
	 * Editable class which provides DOM based "contenteditable" editing host.
	 * @class
	 */
	CKEDITOR.wysiwyg = CKEDITOR.tools.createClass({
		$: function() {
			this.base.apply( this, arguments );
			this.setup();
		},
		_: {},
		base: CKEDITOR.editable,
		proto: {
			// Editable element bootstrapping.
			setup: function() {
				// The editable class.
				this.addClass( 'ckeditor-editable' );

				var editor = this.editor;
				// The DOM document which the editing acts upon.
				editor.document = this.getDocument();
				editor.window = this.getWindow();

				// Setup editor keystroke handlers on this element.
				var keystrokeHandler = editor.keystrokeHandler;
				keystrokeHandler.blockedKeystrokes[ 8 ] = !editor.readOnly;
				editor.keystrokeHandler.attach( this );

				this.attachListener( this, 'focus', function() {
					editor.focusManager.focus();
				});
				this.attachListener( this, 'blur', function() {
					editor.focusManager.blur();
				});

				var doc = editor.document;
				// Fire doubleclick event for double-clicks.
				!editor.readOnly && this.attachListener( this, 'dblclick', function( evt ) {
					var data = { element: evt.data.getTarget() };
					editor.fire( 'doubleclick', data );

					// TODO: Make the following work at the proper place (from v3).
					// data.dialog && editor.openDialog( data.dialog );
				});

				// TODO: check if this is effective.
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

				if ( CKEDITOR.env.gecko ) {
					// TODO: check if this is effective.
					this.attachListener( this, 'mouseup', function( ev ) {
						if ( ev.data.$.button == 2 ) {
							var target = ev.data.getTarget();

							// Prevent right click from selecting an empty block even
							// when selection is anchored inside it. (#5845)
							if ( !target.getOuterHtml().replace( emptyParagraphRegexp, '' ) ) {
								var range = new CKEDITOR.dom.range( doc );
								range.moveToElementEditStart( target );
								range.select( true );
							}
						}
					});
				}

				// TODO: check if this is effective.
				// Prevent the browser opening links in read-only blocks. (#6032)
				this.attachListener( this, 'click', function( ev ) {
					ev = ev.data;
					if ( ev.getTarget().is( 'a' ) && ev.$.button != 2 )
						ev.preventDefault();
				});

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

				!editor.readOnly && this.attachListener( this, 'keydown', function( evt ) {
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
						this.attachListener( this, 'keydown', function( evt ) {
							if ( evt.data.getKeystroke() in { 33:1,34:1 } ) {
								setTimeout( function() {
									editor.getSelection().scrollIntoView();
								}, 0 );
							}
						});
					}
				}

				// Auto fixing on some document structure weakness to enhance usabilities. (#3190 and #3189)
				this.attachListener( editor, 'selectionChange', function( evt ) {
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
				this.attachListener( editor, 'insertElement', function( evt ) {
					var element = evt.data;
					if ( element.type == CKEDITOR.NODE_ELEMENT && ( element.is( 'input' ) || element.is( 'textarea' ) ) ) {
						// // The element is still not inserted yet, force attribute-based check.
						if ( !element.isReadOnly( 1 ) )
							element.data( 'cke-editable', element.hasAttribute( 'contenteditable' ) ? 'true' : '1' );
						element.setAttribute( 'contentEditable', false );
					}
				});
			},

			focus: function() {
				this._super.call( this );
				// Always fire the selection change, even on focus re-enter.
				this.editor.forceNextSelectionCheck();
				this.editor.selectionChange();
			},

			/**
			 * @see CKEDITOR.editor.prototype.insertHtml
			 */
			insertHtml: function( data ) {
				var editor = this.editor;

				if ( editor.dataProcessor )
					data = editor.dataProcessor.toHtml( data );

				if ( !data )
					return;

				// HTML insertion only considers the first range.
				var selection = editor.getSelection(),
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
								range.splitBlock( editor.enterMode == CKEDITOR.ENTER_DIV ? 'div' : 'p' );
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
						editor.getSelection().lock();
				} else
					editor.document.$.execCommand( 'inserthtml', false, data );

				// Webkit does not scroll to the cursor position after pasting (#5558)
				if ( CKEDITOR.env.webkit ) {
					selection = editor.getSelection();
					selection.scrollIntoView();
				}
			},

			/**
			 * @see CKEDITOR.editor.prototype.insertText
			 */
			insertText: function( text ) {
				var editor = this.editor,
					selection = editor.getSelection(),
					mode = selection.getStartElement().hasAscendant( 'pre', true ) ? CKEDITOR.ENTER_BR : editor.config.enterMode,
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

				this.insertHtml( html );
			},

			/**
			 * @see CKEDITOR.editor.prototype.insertElement
			 */
			insertElement: function( element ) {
				var editor = this.editor,
					selection = editor.getSelection(),
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
					editor.getSelection().lock();
			},

			/**
			 * @see CKEDITOR.editor.prototype.setData
			 */
			setData: function( data, isSnapshot ) {
				this.setHtml( data );
				this.editor.fire( 'dataReady' );
			},

			/**
			 * @see CKEDITOR.editor.prototype.getData
			 */
			getData: function( isSnapshot ) {
				return this.getHtml();
			},

			detach: function() {
				// Cleanup the element.
				this.removeClass( 'ckeditor-editable' );

				// Save the editor reference which will be lost after
				// calling detach from super class.
				var editor = this.editor;

				this._super();

				// Memory leak proof.
				this.clearCustomData();

				delete editor.document;
				delete editor.window;
			}
		}
	});

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
			// v3: check if this is needed.
			// activateEditing( editor );

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

	function blockInputClick( evt ) {
		var element = evt.data.getTarget();
		if ( element.is( 'input' ) ) {
			var type = element.getAttribute( 'type' );
			if ( type == 'submit' || type == 'reset' )
				evt.data.preventDefault();
		}
	}

	// Common routine for all insertion.
	function onInsert( insertFunc ) {
		return function( evt ) {
			// TODO: For unknown reason we must call directly on the editable to put the focus immediately.
			this.focus();

			this.editor.fire( 'saveSnapshot' );

			insertFunc.call( this, evt.data );

			// Save snaps after the whole execution completed.
			// This's a workaround for make DOM modification's happened after
			// 'insertElement' to be included either, e.g. Form-based dialogs' 'commitContents'
			// call.
			CKEDITOR.tools.setTimeout( function() {
				this.editor.fire( 'saveSnapshot' );
			}, 0, this );
		};
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
