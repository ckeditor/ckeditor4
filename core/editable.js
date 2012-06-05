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
						// Remove the original contents, merge split nodes.
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
		isNotBookmark = CKEDITOR.dom.walker.bookmark( false, true ),
		isNotEmpty = function( node ) {
			return isNotWhitespace( node ) && isNotBookmark( node );
		};

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

		var DTD = CKEDITOR.dtd;

		/**
		 * Inserts the given (valid) HTML into the range position (with range content deleted),
		 * guarantee it's result to be a valid DOM tree.
		 */
		function insert( editable, type, data ) {
			beforeInsert( editable );

			var editor = editable.editor,
				doc = editable.getDocument(),
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
				// Let root be the nearest block that's impossible to be split
				// during html processing.
				blockLimit = path.blockLimit || range.root,
				// The "state" value.
				that = {
					type: type,
					editable: editable,
					editor: editor,
					range: range,
					blockLimit: blockLimit,
					// During pre-processing / preparations startContainer of affectedRange should be placed
					// in this element in which inserted or moved (in case when we merge blocks) content
					// could create situation that will need merging inline elements.
					// Examples:
					// <div><b>A</b>^B</div> + <b>C</b> => <div><b>A</b><b>C</b>B</div> - affected container is <div>.
					// <p><b>A[B</b></p><p><b>C]D</b></p> + E => <p><b>AE</b></p><p><b>D</b></p> =>
					//		<p><b>AE</b><b>D</b></p> - affected container is <p> (in text mode).
					mergeCandidates: [],
					zombies: []
				};

			prepareRangeToDataInsertion( that );

			// DATA PROCESSING

			// Select range and stop execution.
			if ( data ) {
				processDataForInsertion( that, data );

				// DATA INSERTION
				insertDataIntoRange( that );
			}

			// FINAL CLEANUP
			// Set final range position and clean up.

			cleanupAfterInsertion( that );

			// Make the final range selection.
			range.select();
			selection.scrollIntoView();

			afterInsert( editable );
		}

		function beforeInsert( editable ) {
			// TODO: For unknown reason we must call directly on the editable to put the focus immediately.
			editable.editor.focus();

			editable.editor.fire( 'saveSnapshot' );
		}

		// Prepare range to its data deletion.
		// Delete its contents.
		// Prepare it to insertion.
		function prepareRangeToDataInsertion( that ) {
			var range = that.range,
				mergeCandidates = that.mergeCandidates,
				node, marker, path, startPath, endPath, previous, bm;

			// If range starts in inline element then insert a marker, so empty
			// inline elements won't be removed while range.deleteContents
			// and we will be able to move range back into this element.
			// E.g. 'aa<b>[bb</b>]cc' -> (after deleting) 'aa<b><span/></b>cc'
			if ( that.type == 'text' && range.shrink( CKEDITOR.SHRINK_ELEMENT, true, false ) ) {
				marker = CKEDITOR.dom.element.createFromHtml( '<span>&nbsp;</span>' );
				range.insertNode( marker );
				range.setStartAfter( marker );
			}

			// By using path we can recover in which element was startContainer
			// before deleting contents.
			// Start and endPathElements will be used to squash selected blocks, after removing
			// selection contents. See rule 5.
			startPath = new CKEDITOR.dom.elementPath( range.startContainer );
			that.endPath = endPath = new CKEDITOR.dom.elementPath( range.endContainer );

			if ( !range.collapsed ) {
				// Anticipate the possibly empty block at the end of range after deletion.
				node = endPath.block;
				if ( node && !node.equals( startPath.block ) && range.checkEndOfBlock() )
					that.zombies.push( node );

				range.deleteContents();
			}

			// Rule 4.
			// Move range into the previous block.
			while ( ( previous = getRangePrevious( range ) ) && checkIfElement( previous ) && previous.isBlockBoundary() &&
			// Check if previousNode was parent of range's startContainer before deleteContents.
			startPath.contains( previous ) ) {
				range.moveToPosition( previous, CKEDITOR.POSITION_BEFORE_END );
			}

			// Rule 5.
			mergeAncestorElementsOfSelectionEnds( range, that.blockLimit, startPath, endPath );

			// Rule 1.
			if ( marker ) {
				// If marker was created then move collapsed range into its place.
				range.setEndBefore( marker );
				range.collapse();
				marker.remove();
			}

			// Split inline elements so HTML will be inserted with its own styles.
			path = range.startPath();
			if ( node = path.contains( isInline, false, 1 ) ) {
				range.splitElement( node );
				that.inlineStylesRoot = node;
				that.inlineStylesPeak = path.lastElement;
			}

			// Record inline merging candidates for later cleanup in place.
			bm = range.createBookmark();

			// 1. Inline siblings.
			node = bm.startNode.getPrevious( isNotEmpty );
			node && checkIfElement( node ) && isInline( node ) && mergeCandidates.push( node );
			node = bm.startNode.getNext( isNotEmpty );
			node && checkIfElement( node ) && isInline( node ) && mergeCandidates.push( node );

			// 2. Inline parents.
			node = bm.startNode;
			while ( ( node = node.getParent() ) && isInline( node ) )
				mergeCandidates.push( node );

			range.moveToBookmark( bm );
		}

		function processDataForInsertion( that, data ) {
			var range = that.range;

			// Rule 8. - wrap entire data in inline styles.
			// (e.g. <p><b>x^z</b></p> + <p>a</p><p>b</p> -> <b><p>a</p><p>b</p></b>)
			// Incorrect tags order will be fixed by htmlDataProcessor.
			if ( that.type == 'text' && that.inlineStylesRoot )
				data = wrapDataWithInlineStyles( data, that );

			// Process the inserted html, in context of the insertion root.
			var processor = that.editor.dataProcessor;

			// Don't use the "fix for body" feature as auto paragraphing must
			// be handled during insertion.
			data = processor.toHtml( data, that.blockLimit.getName(), false );

			// Build the node list for insertion.
			var doc = range.document,
				tmp = doc.createElement( 'body' ),
				frag = new CKEDITOR.dom.documentFragment( range.document );

			tmp.setHtml( data );
			tmp.moveChildren( frag );

			// Rule 7. - apply when there exists path block after deleting selection's content.
			if ( range.startPath().block )
				stripBlockTagIfSingleLine( frag, data );

			that.dataWrapper = frag;
		}

		function insertDataIntoRange( that ) {
			var range = that.range,
				doc = range.document,
				path,
				blockLimit = that.blockLimit,
				nodesData, nodeData, node,
				nodeIndex = 0,
				bogusNeededBlocks = [],
				pathBlock,
				splittingContainer = 0,
				dontMoveCaret = 0,
				insertionContainer, toSplit, newContainer,
				startContainer = range.startContainer,
				endContainer = that.endPath.elements[ 0 ],
				filteredNodes,
				// If endContainer was merged into startContainer: <p>a[b</p><p>c]d</p>
				// or it's equal to startContainer: <p>a^b</p>
				// or different situation happened :P
				// then there's no separate container for the end of selection.
				pos = endContainer.getPosition( startContainer ),
				separateEndContainer = !!endContainer.getCommonAncestor( startContainer ) // endC is not detached.
				&& pos != CKEDITOR.POSITION_IDENTICAL && !( pos & CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_IS_CONTAINED ); // endC & endS are in separate branches.

			nodesData = extractNodesData( that.dataWrapper, startContainer );

			for ( ; nodeIndex < nodesData.length; nodeIndex++ ) {
				nodeData = nodesData[ nodeIndex ];

				// Ignore trailing <brs>
				if ( nodeData.isLineBreak && splitOnLineBreak( range, blockLimit, nodeData ) ) {
					// Do not move caret towards the text (in cleanupAfterInsertion),
					// because caret was placed after a line break.
					dontMoveCaret = nodeIndex > 0;
					continue;
				}

				path = range.startPath();

				var fixBlock;
				// Auto paragraphing.
				if ( !nodeData.isBlock && ( fixBlock = autoParagraphTag( that.editor.config ) ) && !path.block && path.blockLimit && path.blockLimit.equals( range.root ) ) {
					fixBlock = doc.createElement( fixBlock );
					!CKEDITOR.env.ie && fixBlock.appendBogus();
					range.insertNode( fixBlock );
					!CKEDITOR.env.ie && fixBlock.getBogus().remove();
					range.moveToPosition( fixBlock, CKEDITOR.POSITION_BEFORE_END );
				}

				node = range.startPath().block;

				// Remove any bogus element on the current path block for now, and mark
				// it for later compensation.
				if ( node && !node.equals( pathBlock ) ) {
					var bogus = node.getBogus();
					if ( bogus ) {
						bogus.remove();
						bogusNeededBlocks.push( node );
					}

					pathBlock = node;
				}

				// First not allowed node reached - start splitting original container
				if ( nodeData.firstNotAllowed )
					splittingContainer = 1;

				if ( splittingContainer && nodeData.isElement ) {
					insertionContainer = range.startContainer;
					toSplit = null;

					// Find the first ancestor that can contain current node.
					// This one won't be split.
					while ( insertionContainer && !DTD[ insertionContainer.getName() ][ nodeData.name ] ) {
						if ( insertionContainer.equals( blockLimit ) ) {
							insertionContainer = null;
							break;
						}

						toSplit = insertionContainer;
						insertionContainer = insertionContainer.getParent();
					}

					// If split has to be done - do it and mark both ends as a possible zombies.
					if ( insertionContainer ) {
						if ( toSplit ) {
							newContainer = range.splitElement( toSplit );
							that.zombies.push( newContainer );
							that.zombies.push( toSplit );
						}
					}
					// Unable to make the insertion happen in place, resort to the content filter.
					else {
						// If everything worked fine insertionContainer == blockLimit here.
						filteredNodes = filterElement( nodeData.node, blockLimit.getName(), nodeIndex == 0, nodeIndex == nodesData.length - 1 );
					}
				}

				if ( filteredNodes ) {
					while ( node = filteredNodes.pop() )
						range.insertNode( node );
					filteredNodes = 0;
				} else
					// Insert current node at the start of range.
					range.insertNode( nodeData.node );

				// Move range to the endContainer for the final allowed elements.
				if ( nodeData.lastNotAllowed && nodeIndex < nodesData.length - 1 ) {
					// If separateEndContainer exists move range there.
					// Otherwise try to move range to container created during splitting.
					// If this doesn't work - don't move range.
					newContainer = separateEndContainer ? endContainer : newContainer;
					newContainer && range.setEndAt( newContainer, CKEDITOR.POSITION_AFTER_START );
					splittingContainer = 0;
				}

				// Collapse range after insertion to end.
				range.collapse();
			}

			// Bring back all block bogus nodes.
			while ( node = bogusNeededBlocks.pop() )
				node.append( CKEDITOR.env.ie ? range.document.createText( '\u00a0' ) : range.document.createElement( 'br' ) );

			that.dontMoveCaret = dontMoveCaret;
		}

		function cleanupAfterInsertion( that ) {
			var range = that.range,
				node, testRange, parent, movedIntoInline,
				// Create a bookmark to defend against the following range deconstructing operations.
				bm = range.createBookmark();

			// Remove all elements that could be created while splitting nodes
			// with ranges at its start|end.
			// E.g. remove <div><p></p></div>
			// But not <div><p> </p></div>
			// And replace <div><p><span data="cke-bookmark"/></p></div> with found bookmark.
			while ( node = that.zombies.pop() ) {
				// Detached element.
				if ( !node.getParent() )
					continue;

				testRange = range.clone();
				testRange.moveToPosition( node, CKEDITOR.POSITION_AFTER_START );
				if ( testRange.checkStartOfBlock() && testRange.checkEndOfBlock() ) {
					parent = node.getParent();
					node.remove( 1 );
					if ( parent.is( DTD.$list ) )
						parent.remove( 1 );
				}
			}

			// Eventually merge identical inline elements.
			while ( node = that.mergeCandidates.pop() )
				node.mergeSiblings();

			range.moveToBookmark( bm );

			// Rule 3.
			// Shrink range to the BEFOREEND of previous innermost editable node in source order.

			if ( !that.dontMoveCaret ) {
				node = getRangePrevious( range );

				while ( node && checkIfElement( node ) && !node.is( DTD.$empty ) ) {
					if ( node.isBlockBoundary() )
						range.moveToPosition( node, CKEDITOR.POSITION_BEFORE_END );
					else {
						// Don't move into inline element (which ends with a text node)
						// found which contains white-space at its end.
						// If not - move range's end to the end of this element.
						if ( isInline( node ) && node.getHtml().match( /(\s|&nbsp;)$/g ) ) {
							movedIntoInline = null;
							break;
						}

						movedIntoInline = range.clone();
						movedIntoInline.moveToPosition( node, CKEDITOR.POSITION_BEFORE_END );
					}

					node = node.getLast( isNotEmpty );
				}

				movedIntoInline && range.moveToRange( movedIntoInline );
			}

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

		//
		// HELPERS ------------------------------------------------------------
		//

		function checkIfElement( node ) {
			return node.type == CKEDITOR.NODE_ELEMENT;
		}

		function isInline( node ) {
			return node && checkIfElement( node ) && ( node.is( DTD.$removeEmpty ) || node.is( 'a' ) && !node.isBlockBoundary() );
		}

		function extractNodesData( dataWrapper, startContainer ) {
			var node, sibling, nodeName, allowed,
				nodesData = [],
				allowedNames = DTD[ startContainer.getName() ],
				nodeIndex = 0,
				nodesList = dataWrapper.getChildren(),
				nodesCount = nodesList.count(),
				firstNotAllowed = -1,
				lastNotAllowed = -1,
				lineBreak = 0,
				blockSibling;

			for ( ; nodeIndex < nodesCount; ++nodeIndex ) {
				node = nodesList.getItem( nodeIndex );

				if ( checkIfElement( node ) ) {
					nodeName = node.getName();
					allowed = !!allowedNames[ nodeName ];

					// Mark <brs data-cke-eol="1"> at the beginning and at the end.
					if ( nodeName == 'br' && node.data( 'cke-eol' ) && ( nodeIndex == 0 || nodeIndex == nodesCount - 1 ) ) {
						sibling = nodeIndex ? nodesData[ nodeIndex - 1 ].node : nodesList.getItem( nodeIndex + 1 );

						// Line break has to have sibling which is not an <br>.
						lineBreak = sibling && ( !checkIfElement( sibling ) || !sibling.is( 'br' ) );
						// Line break has block element as a sibling.
						blockSibling = sibling && checkIfElement( sibling ) && DTD.$block[ sibling.getName() ];
					}

					if ( firstNotAllowed == -1 && !allowed )
						firstNotAllowed = nodeIndex;
					if ( !allowed )
						lastNotAllowed = nodeIndex;

					nodesData.push({
						isElement: 1,
						isLineBreak: lineBreak,
						isBlock: node.isBlockBoundary(),
						hasBlockSibling: blockSibling,
						node: node,
						name: nodeName,
						allowed: allowed
					});

					lineBreak = 0;
					blockSibling = 0;
				} else
					nodesData.push( { isElement:0,node:node,allowed:1 } );
			}

			// Mark first node that cannot be inserted directly into startContainer
			// and last node for which startContainer has to be split.
			if ( firstNotAllowed > -1 )
				nodesData[ firstNotAllowed ].firstNotAllowed = 1;
			if ( lastNotAllowed > -1 )
				nodesData[ lastNotAllowed ].lastNotAllowed = 1;

			return nodesData;
		}

		// TODO: Review content transformation rules on filtering element.
		function filterElement( element, parentName, isFirst, isLast ) {
			var nodes = filterElementInner( element, parentName ),
				nodes2 = [],
				nodesCount = nodes.length,
				nodeIndex = 0,
				node,
				afterSpace = 0,
				lastSpaceIndex = -1;

			// Remove duplicated spaces and spaces at the:
			// * beginnig if filtered element isFirst (isFirst that's going to be inserted)
			// * end if filtered element isLast.
			for ( ; nodeIndex < nodesCount; nodeIndex++ ) {
				node = nodes[ nodeIndex ];

				if ( node == ' ' ) {
					// Don't push doubled space and if it's leading space for insertion.
					if ( !afterSpace && !( isFirst && nodeIndex == 0 ) ) {
						nodes2.push( new CKEDITOR.dom.text( ' ' ) );
						lastSpaceIndex = nodes2.length;
					}
					afterSpace = 1;
				} else {
					nodes2.push( node );
					afterSpace = 0;
				}

			}

			// Remove trailing space.
			if ( isLast && lastSpaceIndex == nodes2.length )
				nodes2.pop();

			return nodes2;
		}

		function filterElementInner( element, parentName ) {
			var nodes = [],
				children = element.getChildren(),
				childrenCount = children.count(),
				child,
				childIndex = 0,
				allowedNames = DTD[ parentName ],
				surroundBySpaces = !element.is( DTD.$inline ) || element.is( 'br' );

			if ( surroundBySpaces )
				nodes.push( ' ' );

			for ( ; childIndex < childrenCount; childIndex++ ) {
				child = children.getItem( childIndex );

				if ( checkIfElement( child ) && !child.is( allowedNames ) )
					nodes = nodes.concat( filterElementInner( child, parentName ) );
				else
					nodes.push( child );
			}

			if ( surroundBySpaces )
				nodes.push( ' ' );

			return nodes;
		}

		function getRangePrevious( range ) {
			return checkIfElement( range.startContainer ) && range.startContainer.getChild( range.startOffset - 1 );
		}

		var blockMergedTags = { p:1,div:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1,ul:1,ol:1,li:1,pre:1,dl:1,blockquote:1 };

		// See rule 5. in TCs.
		// Initial situation:
		// <ul><li>AA^</li></ul><ul><li>BB</li></ul>
		// We're looking for 2nd <ul>, comparing with 1st <ul> and merging.
		// We're not merging if caret is between these elements.
		function mergeAncestorElementsOfSelectionEnds( range, blockLimit, startPath, endPath ) {
			var walkerRange = range.clone(),
				walker, nextNode, previousNode;

			walkerRange.setEndAt( blockLimit, CKEDITOR.POSITION_BEFORE_END );
			walker = new CKEDITOR.dom.walker( walkerRange );

			if ( ( nextNode = walker.next() ) // Find next source node
			&& checkIfElement( nextNode ) // which is an element
			&& blockMergedTags[ nextNode.getName() ] // that can be merged.
			&& ( previousNode = nextNode.getPrevious() ) // Take previous one
			&& checkIfElement( previousNode ) // which also has to be an element.
			&& !previousNode.getParent().equals( range.startContainer ) // Fail if caret is on the same level.
			// This means that caret is between these nodes.
			&& startPath.contains( previousNode ) // Elements path of start of selection has
			&& endPath.contains( nextNode ) // to contain prevNode and vice versa.
			&& nextNode.isIdentical( previousNode ) ) // Check if elements are identical.
			{
				// Merge blocks and repeat.
				nextNode.moveChildren( previousNode );
				nextNode.remove();
				mergeAncestorElementsOfSelectionEnds( range, blockLimit, startPath, endPath );
			}
		}

		function autoParagraphTag( config ) {
			return ( config.enterMode != CKEDITOR.ENTER_BR && config.autoParagraph !== false ) ? config.enterMode == CKEDITOR.ENTER_DIV ? 'div' : 'p' : false;
		}

		// Return 1 if <br> should be skipped when inserting, 0 otherwise.
		function splitOnLineBreak( range, blockLimit, nodeData ) {
			var firstBlockAscendant, pos;

			if ( nodeData.hasBlockSibling )
				return 1;

			firstBlockAscendant = range.startContainer.getAscendant( DTD.$block, 1 );
			if ( !firstBlockAscendant || !( firstBlockAscendant.getName() in { div:1,p:1 } ) )
				return 0;

			pos = firstBlockAscendant.getPosition( blockLimit );

			if ( pos == CKEDITOR.POSITION_IDENTICAL || pos == CKEDITOR.POSITION_CONTAINS )
				return 0;

			var newContainer = range.splitElement( firstBlockAscendant );
			range.moveToPosition( newContainer, CKEDITOR.POSITION_AFTER_START );

			return 1;
		}

		var stripSingleBlockTags = { p:1,div:1,h1:1,h2:1,h3:1,h4:1,h5:1,h6:1 },
			inlineButNotBr = CKEDITOR.tools.extend( {}, DTD.$inline );
		delete inlineButNotBr.br;

		// Rule 7.
		function stripBlockTagIfSingleLine( dataWrapper ) {
			var block, children;

			if ( dataWrapper.getChildCount() == 1 && // Only one node bein inserted.
			checkIfElement( block = dataWrapper.getFirst() ) && // And it's an element.
			block.is( stripSingleBlockTags ) ) // That's <p> or <div> or header.
			{
				// Check children not containing block.
				children = block.getElementsByTag( '*' );
				for ( var i = 0, child, count = children.count(); i < count; i++ ) {
					child = children.getItem( i );
					if ( !child.is( inlineButNotBr ) )
						return;
				}

				block.moveChildren( block.getParent( 1 ) );
				block.remove();
			}
		}

		function wrapDataWithInlineStyles( data, that ) {
			var element = that.inlineStylesPeak,
				doc = element.getDocument(),
				wrapper = doc.createText( '{cke-peak}' ),
				limit = that.inlineStylesRoot.getParent();

			while ( !element.equals( limit ) ) {
				wrapper = wrapper.appendTo( element.clone() );
				element = element.getParent();
			}

			return wrapper.getOuterHtml().replace( '{cke-peak}', data );
		}

		return insert;
	})();

})();
