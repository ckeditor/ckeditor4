/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

( function() {
	var isNotWhitespace, isNotBookmark, isEmpty, isBogus, emptyParagraphRegexp,
		insert, fixTableAfterContentsDeletion, fixListAfterContentsDelete, getHtmlFromRangeHelpers, extractHtmlFromRangeHelpers;

	/**
	 * Editable class which provides all editing related activities by
	 * the `contenteditable` element, dynamically get attached to editor instance.
	 *
	 * @class CKEDITOR.editable
	 * @extends CKEDITOR.dom.element
	 */
	CKEDITOR.editable = CKEDITOR.tools.createClass( {
		base: CKEDITOR.dom.element,
		/**
		 * The constructor only stores generic editable creation logic that is commonly shared among
		 * all different editable elements.
		 *
		 * @constructor Creates an editable class instance.
		 * @param {CKEDITOR.editor} editor The editor instance on which the editable operates.
		 * @param {HTMLElement/CKEDITOR.dom.element} element Any DOM element that was as the editor's
		 * editing container, e.g. it could be either an HTML element with the `contenteditable` attribute
		 * set to the `true` that handles WYSIWYG editing or a `<textarea>` element that handles source editing.
		 */
		$: function( editor, element ) {
			// Transform the element into a CKEDITOR.dom.element instance.
			this.base( element.$ || element );

			this.editor = editor;

			/**
			 * Indicates the initialization status of the editable element. The following statuses are available:
			 *
			 *	* **unloaded** &ndash; the initial state. The editable's instance was created but
			 *	is not fully loaded (in particular it has no data).
			 *	* **ready** &ndash; the editable is fully initialized. The `ready` status is set after
			 *	the first {@link CKEDITOR.editor#method-setData} is called.
			 *	* **detached** &ndash; the editable was detached.
			 *
			 * @since 4.3.3
			 * @readonly
			 * @property {String}
			 */
			this.status = 'unloaded';

			/**
			 * Indicates whether the editable element gained focus.
			 *
			 * @property {Boolean} hasFocus
			 */
			this.hasFocus = false;

			// The bootstrapping logic.
			this.setup();
		},

		proto: {
			focus: function() {

				var active;

				// [Webkit] When DOM focus is inside of nested contenteditable elements,
				// apply focus on the main editable will compromise it's text selection.
				if ( CKEDITOR.env.webkit && !this.hasFocus ) {
					// Restore focus on element which we cached (on selectionCheck) as previously active.
					active = this.editor._.previousActive || this.getDocument().getActive();
					if ( this.contains( active ) ) {
						active.focus();
						return;
					}
				}

				// [Edge] Starting from EdgeHTML 14.14393, it does not support `setActive`. We need to use focus which
				// causes unexpected scroll. Store scrollTop value so it can be restored after focusing editor.
				// Scroll only happens if the editor is focused for the first time. (https://dev.ckeditor.com/ticket/14825)
				if ( CKEDITOR.env.edge && CKEDITOR.env.version > 14 && !this.hasFocus && this.getDocument().equals( CKEDITOR.document ) ) {
					this.editor._.previousScrollTop = this.$.scrollTop;
				}

				// [IE] Use instead "setActive" method to focus the editable if it belongs to the host page document,
				// to avoid bringing an unexpected scroll.
				try {
					if ( CKEDITOR.env.ie && !( CKEDITOR.env.edge && CKEDITOR.env.version > 14 ) && this.getDocument().equals( CKEDITOR.document ) ) {
						this.$.setActive();
					} else {
						// We have no control over exactly what happens when the native `focus` method is called,
						// so save the scroll position and restore it later.
						if ( CKEDITOR.env.chrome ) {
							var scrollPos = this.$.scrollTop;
							this.$.focus();
							this.$.scrollTop = scrollPos;
						} else {
							this.$.focus();
						}
					}
				} catch ( e ) {
					// IE throws unspecified error when focusing editable after closing dialog opened on nested editable.
					if ( !CKEDITOR.env.ie )
						throw e;
				}

				// Remedy if Safari doens't applies focus properly. (https://dev.ckeditor.com/ticket/279)
				if ( CKEDITOR.env.safari && !this.isInline() ) {
					active = CKEDITOR.document.getActive();
					if ( !active.equals( this.getWindow().getFrame() ) )
						this.getWindow().focus();

				}
			},

			/**
			 * Overrides {@link CKEDITOR.dom.element#on} to have special `focus/blur` handling.
			 * The `focusin/focusout` events are used in IE to replace regular `focus/blur` events
			 * because we want to avoid the asynchronous nature of later ones.
			 */
			on: function( name, fn ) {
				var args = Array.prototype.slice.call( arguments, 0 );

				if ( CKEDITOR.env.ie && ( /^focus|blur$/ ).exec( name ) ) {
					name = name == 'focus' ? 'focusin' : 'focusout';

					// The "focusin/focusout" events bubbled, e.g. If there are elements with layout
					// they fire this event when clicking in to edit them but it must be ignored
					// to allow edit their contents. (https://dev.ckeditor.com/ticket/4682)
					fn = isNotBubbling( fn, this );
					args[ 0 ] = name;
					args[ 1 ] = fn;
				}

				return CKEDITOR.dom.element.prototype.on.apply( this, args );
			},

			/**
			 * Registers an event listener that needs to be removed when detaching this editable.
			 * This means that it will be automatically removed when {@link #detach} is executed,
			 * for example on {@link CKEDITOR.editor#setMode changing editor mode} or destroying editor.
			 *
			 * Except for `obj` all other arguments have the same meaning as in {@link CKEDITOR.event#on}.
			 *
			 * This method is strongly related to the {@link CKEDITOR.editor#contentDom} and
			 * {@link CKEDITOR.editor#contentDomUnload} events, because they are fired
			 * when an editable is being attached and detached. Therefore, this method is usually used
			 * in the following way:
			 *
			 *		editor.on( 'contentDom', function() {
			 *			var editable = editor.editable();
			 *			editable.attachListener( editable, 'mousedown', function() {
			 *				// ...
			 *			} );
			 *		} );
			 *
			 * This code will attach the `mousedown` listener every time a new editable is attached
			 * to the editor, which in classic (`iframe`-based) editor happens every time the
			 * data or the mode is set. This listener will also be removed when that editable is detached.
			 *
			 * It is also possible to attach a listener to another object (e.g. to a document).
			 *
			 *		editor.on( 'contentDom', function() {
			 *			editor.editable().attachListener( editor.document, 'mousedown', function() {
			 *				// ...
			 *			} );
			 *		} );
			 *
			 * @param {CKEDITOR.event} obj The element/object to which the listener will be attached. Every object
			 * which inherits from {@link CKEDITOR.event} may be used including {@link CKEDITOR.dom.element},
			 * {@link CKEDITOR.dom.document}, and {@link CKEDITOR.editable}.
			 * @param {String} eventName The name of the event that will be listened to.
			 * @param {Function} listenerFunction The function listening to the
			 * event. A single {@link CKEDITOR.eventInfo} object instance
			 * containing all the event data is passed to this function.
			 * @param {Object} [scopeObj] The object used to scope the listener
			 * call (the `this` object). If omitted, the current object is used.
			 * @param {Object} [listenerData] Data to be sent as the
			 * {@link CKEDITOR.eventInfo#listenerData} when calling the listener.
			 * @param {Number} [priority=10] The listener priority. Lower priority
			 * listeners are called first. Listeners with the same priority
			 * value are called in the registration order.
			 * @returns {Object} An object containing the `removeListener`
			 * function that can be used to remove the listener at any time.
			 */
			attachListener: function( obj /*, event, fn, scope, listenerData, priority*/ ) {
				!this._.listeners && ( this._.listeners = [] );
				// Register the listener.
				var args = Array.prototype.slice.call( arguments, 1 ),
					listener = obj.on.apply( obj, args );

				this._.listeners.push( listener );

				return listener;
			},

			/**
			 * Remove all event listeners registered from {@link #attachListener}.
			 */
			clearListeners: function() {
				var listeners = this._.listeners;
				// Don't get broken by this.
				try {
					while ( listeners.length )
						listeners.pop().removeListener();
				} catch ( e ) {}
			},

			/**
			 * Restore all attribution changes made by {@link #changeAttr}.
			 */
			restoreAttrs: function() {
				var changes = this._.attrChanges, orgVal;
				for ( var attr in changes ) {
					if ( changes.hasOwnProperty( attr ) ) {
						orgVal = changes[ attr ];
						// Restore original attribute.
						orgVal !== null ? this.setAttribute( attr, orgVal ) : this.removeAttribute( attr );
					}
				}
			},

			/**
			 * Adds a CSS class name to this editable that needs to be removed on detaching.
			 *
			 * @param {String} className The class name to be added.
			 * @see CKEDITOR.dom.element#addClass
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
			 * Make an attribution change that would be reverted on editable detaching.
			 * @param {String} attr The attribute name to be changed.
			 * @param {String} val The value of specified attribute.
			 */
			changeAttr: function( attr, val ) {
				var orgVal = this.getAttribute( attr );
				if ( val !== orgVal ) {
					!this._.attrChanges && ( this._.attrChanges = {} );

					// Saved the original attribute val.
					if ( !( attr in this._.attrChanges ) )
						this._.attrChanges[ attr ] = orgVal;

					this.setAttribute( attr, val );
				}
			},

			/**
			 * Low-level method for inserting text into the editable.
			 * See the {@link CKEDITOR.editor#method-insertText} method which is the editor-level API
			 * for this purpose.
			 *
			 * @param {String} text
			 */
			insertText: function( text ) {
				// Focus the editor before calling transformPlainTextToHtml. (https://dev.ckeditor.com/ticket/12726)
				this.editor.focus();
				this.insertHtml( this.transformPlainTextToHtml( text ), 'text' );
			},

			/**
			 * Transforms plain text to HTML based on current selection and {@link CKEDITOR.editor#activeEnterMode}.
			 *
			 * @since 4.5.0
			 * @param {String} text Text to transform.
			 * @returns {String} HTML generated from the text.
			 */
			transformPlainTextToHtml: function( text ) {
				var enterMode = this.editor.getSelection().getStartElement().hasAscendant( 'pre', true ) ?
					CKEDITOR.ENTER_BR :
					this.editor.activeEnterMode;

				return CKEDITOR.tools.transformPlainTextToHtml( text, enterMode );
			},

			/**
			 * Low-level method for inserting HTML into the editable.
			 * See the {@link CKEDITOR.editor#method-insertHtml} method which is the editor-level API
			 * for this purpose.
			 *
			 * This method will insert HTML into the current selection or a given range. It also creates an undo snapshot,
			 * scrolls the viewport to the insertion and selects the range next to the inserted content.
			 * If you want to insert HTML without additional operations use {@link #method-insertHtmlIntoRange}.
			 *
			 * Fires the {@link CKEDITOR.editor#event-afterInsertHtml} event.
			 *
			 * @param {String} data The HTML to be inserted.
			 * @param {String} [mode='html'] See {@link CKEDITOR.editor#method-insertHtml}'s param.
			 * @param {CKEDITOR.dom.range} [range] If specified, the HTML will be inserted into the range
			 * instead of into the selection. The selection will be placed at the end of the insertion (like in the normal case).
			 * Introduced in CKEditor 4.5.0.
			 */
			insertHtml: function( data, mode, range ) {
				var editor = this.editor;

				editor.focus();
				editor.fire( 'saveSnapshot' );

				if ( !range ) {
					// HTML insertion only considers the first range.
					// Note: getRanges will be overwritten for tests since we want to test
					// custom ranges and bypass native selections.
					range = editor.getSelection().getRanges()[ 0 ];
				}

				// Default mode is 'html'.
				insert( this, mode || 'html', data, range );

				// Make the final range selection.
				range.select();

				afterInsert( this );

				this.editor.fire( 'afterInsertHtml', {} );
			},

			/**
			 * Inserts HTML into the position in the editor determined by the range.
			 *
			 * **Note:** This method does not {@link CKEDITOR.editor#saveSnapshot save undo snapshots} nor selects inserted
			 * HTML. If you want to do it, use {@link #method-insertHtml}.
			 *
			 * Fires the {@link CKEDITOR.editor#event-afterInsertHtml} event.
			 *
			 * @since 4.5.0
			 * @param {String} data HTML code to be inserted into the editor.
			 * @param {CKEDITOR.dom.range} range The range as a place of insertion.
			 * @param {String} [mode='html'] Mode in which HTML will be inserted.
			 * See {@link CKEDITOR.editor#method-insertHtml}.
			 */
			insertHtmlIntoRange: function( data, range, mode ) {
				// Default mode is 'html'
				insert( this, mode || 'html', data, range );

				this.editor.fire( 'afterInsertHtml', { intoRange: range } );
			},

			/**
			 * Low-level method for inserting an element into the editable.
			 * See the {@link CKEDITOR.editor#method-insertElement} method which is the editor-level API
			 * for this purpose.
			 *
			 * This method will insert the element into the current selection or a given range. It also creates an undo
			 * snapshot, scrolls the viewport to the insertion and selects the range next to the inserted content.
			 * If you want to insert an element without additional operations use {@link #method-insertElementIntoRange}.
			 *
			 * @param {CKEDITOR.dom.element} element The element to insert.
			 * @param {CKEDITOR.dom.range} [range] If specified, the element will be inserted into the range
			 * instead of into the selection.
			 */
			insertElement: function( element, range ) {
				var editor = this.editor;

				// Prepare for the insertion. For example - focus editor (https://dev.ckeditor.com/ticket/11848).
				editor.focus();
				editor.fire( 'saveSnapshot' );

				var enterMode = editor.activeEnterMode,
					selection = editor.getSelection(),
					elementName = element.getName(),
					isBlock = CKEDITOR.dtd.$block[ elementName ];

				if ( !range ) {
					range = selection.getRanges()[ 0 ];
				}

				// Insert element into first range only and ignore the rest (https://dev.ckeditor.com/ticket/11183).
				if ( this.insertElementIntoRange( element, range ) ) {
					range.moveToPosition( element, CKEDITOR.POSITION_AFTER_END );

					// If we're inserting a block element, the new cursor position must be
					// optimized. (https://dev.ckeditor.com/ticket/3100,https://dev.ckeditor.com/ticket/5436,https://dev.ckeditor.com/ticket/8950)
					if ( isBlock ) {
						// Find next, meaningful element.
						var next = element.getNext( function( node ) {
							return isNotEmpty( node ) && !isBogus( node );
						} );

						if ( next && next.type == CKEDITOR.NODE_ELEMENT && next.is( CKEDITOR.dtd.$block ) ) {
							// If the next one is a text block, move cursor to the start of it's content.
							if ( next.getDtd()[ '#' ] )
								range.moveToElementEditStart( next );
							// Otherwise move cursor to the before end of the last element.
							else
								range.moveToElementEditEnd( element );
						}
						// Open a new line if the block is inserted at the end of parent.
						else if ( !next && enterMode != CKEDITOR.ENTER_BR ) {
							next = range.fixBlock( true, enterMode == CKEDITOR.ENTER_DIV ? 'div' : 'p' );
							range.moveToElementEditStart( next );
						}
					}
				}

				// Set up the correct selection.
				selection.selectRanges( [ range ] );

				afterInsert( this );
			},

			/**
			 * Alias for {@link #insertElement}.
			 *
			 * @deprecated
			 * @param {CKEDITOR.dom.element} element The element to be inserted.
			 */
			insertElementIntoSelection: function( element ) {
				this.insertElement( element );
			},

			/**
			 * Inserts an element into the position in the editor determined by the range.
			 *
			 * **Note:** This method does not {@link CKEDITOR.editor#saveSnapshot save undo snapshots} nor selects the inserted
			 * element. If you want to do it, use the {@link #method-insertElement} method.
			 *
			 * @param {CKEDITOR.dom.element} element The element to be inserted.
			 * @param {CKEDITOR.dom.range} range The range as a place of insertion.
			 * @returns {Boolean} Informs whether the insertion was successful.
			 */
			insertElementIntoRange: function( element, range ) {
				var editor = this.editor,
					enterMode = editor.config.enterMode,
					elementName = element.getName(),
					isBlock = CKEDITOR.dtd.$block[ elementName ];

				if ( range.checkReadOnly() )
					return false;

				// Remove the original contents, merge split nodes.
				range.deleteContents( 1 );

				if ( range.startContainer.type == CKEDITOR.NODE_ELEMENT ) {
					// If range is placed in intermediate element (not td or th), we need to do three things:
					// * fill emptied <td/th>s with if browser needs them,
					// * remove empty text nodes so IE8 won't crash
					// (https://dev.ckeditor.com/ticket/11183#comment:8),
					// * fix structure and move range into the <td/th> element.
					if ( range.startContainer.is( { tr: 1, table: 1, tbody: 1, thead: 1, tfoot: 1 } ) ) {
						fixTableAfterContentsDeletion( range );
					} else if ( range.startContainer.is( CKEDITOR.dtd.$list ) ) {
						// Similarly there's a need for lists.
						fixListAfterContentsDelete( range );
					}
				}

				// If we're inserting a block at dtd-violated position, split
				// the parent blocks until we reach blockLimit.
				var current, dtd;

				if ( isBlock ) {
					while ( ( current = range.getCommonAncestor( 0, 1 ) ) &&
							( dtd = CKEDITOR.dtd[ current.getName() ] ) &&
							!( dtd && dtd[ elementName ] ) ) {
						// Split up inline elements.
						if ( current.getName() in CKEDITOR.dtd.span ) {
							var endNode = range.splitElement( current ),
								bookmark = range.createBookmark();

							// Remove empty element created after splitting (#2813).
							// The range.splitElement() method splits the given element in two and places the selection
							// in-between in such way that <div>F^oo</div> becomes <div>F</div>^<div>oo</div>.
							// Then removeEmptyInlineElement() method removes any of these elements if they are empty.
							removeEmptyInlineElement( current );
							removeEmptyInlineElement( endNode );

							range.moveToBookmark( bookmark );

						// If we're in an empty block which indicate a new paragraph,
						// simply replace it with the inserting block (https://dev.ckeditor.com/ticket/3664).
						} else if ( range.checkStartOfBlock() && range.checkEndOfBlock() ) {
							range.setStartBefore( current );
							range.collapse( true );
							current.remove();
						} else {
							range.splitBlock( enterMode == CKEDITOR.ENTER_DIV ? 'div' : 'p', editor.editable() );
						}
					}
				}

				// Insert the new node.
				range.insertNode( element );

				// Return true if insertion was successful.
				return true;
			},

			/**
			 * @see CKEDITOR.editor#setData
			 */
			setData: function( data, isSnapshot ) {
				if ( !isSnapshot )
					data = this.editor.dataProcessor.toHtml( data );

				this.setHtml( data );
				this.fixInitialSelection();

				// Editable is ready after first setData.
				if ( this.status == 'unloaded' )
					this.status = 'ready';

				this.editor.fire( 'dataReady' );
			},

			/**
			 * @see CKEDITOR.editor#getData
			 */
			getData: function( isSnapshot ) {
				var data = this.getHtml();

				if ( !isSnapshot )
					data = this.editor.dataProcessor.toDataFormat( data );

				return data;
			},

			/**
			 * Changes the read-only state of this editable.
			 *
			 * @param {Boolean} isReadOnly
			 */
			setReadOnly: function( isReadOnly ) {
				this.setAttribute( 'contenteditable', !isReadOnly );
			},

			/**
			 * Detaches this editable object from the DOM (removes classes, listeners, etc.)
			 */
			detach: function() {
				this.status = 'detached';

				// Update the editor cached data with current data.
				this.editor.setData( this.editor.getData(), {
					internal: true
				} );

				this.clearListeners();

				// Edge randomly throws permission denied when trying to access native elements of detached editor (#3115, #3419).
				try {
					this._.cleanCustomData();
				} catch ( error ) {
					if ( !CKEDITOR.env.ie || error.number !== -2146828218 ) {
						throw( error );
					}
				}

				this.editor.fire( 'contentDomUnload' );

				delete this.editor.document;
				delete this.editor.window;
				delete this.editor;
			},

			/**
			 * Checks if the editable is one of the host page elements, indicates
			 * an inline editing environment.
			 *
			 * @returns {Boolean}
			 */
			isInline: function() {
				return this.getDocument().equals( CKEDITOR.document );
			},

			/**
			 * Fixes the selection and focus which may be in incorrect state after
			 * editable's inner HTML was overwritten.
			 *
			 * If the editable did not have focus, then the selection will be fixed when the editable
			 * is focused for the first time. If the editable already had focus, then the selection will
			 * be fixed immediately.
			 *
			 * To understand the problem see:
			 *
			 * * http://tests.ckeditor.dev:1030/tests/core/selection/manual/focusaftersettingdata
			 * * http://tests.ckeditor.dev:1030/tests/core/selection/manual/focusafterundoing
			 * * http://tests.ckeditor.dev:1030/tests/core/selection/manual/selectionafterfocusing
			 * * http://tests.ckeditor.dev:1030/tests/plugins/newpage/manual/selectionafternewpage
			 *
			 * @since 4.4.6
			 * @private
			 */
			fixInitialSelection: function() {
				var that = this;

				// Deal with IE8- IEQM (the old MS selection) first.
				if ( CKEDITOR.env.ie && ( CKEDITOR.env.version < 9 || CKEDITOR.env.quirks ) ) {
					if ( this.hasFocus ) {
						this.focus();
						fixMSSelection();
					}

					return;
				}

				// If editable did not have focus, fix the selection when it is first focused.
				if ( !this.hasFocus ) {
					this.once( 'focus', function() {
						fixSelection();
					}, null, null, -999 );
				// If editable had focus, fix the selection immediately.
				} else {
					this.focus();
					fixSelection();
				}

				function fixSelection() {
					var $doc = that.getDocument().$,
						$sel = $doc.getSelection();

					if ( requiresFix( $sel ) ) {
						var range = new CKEDITOR.dom.range( that );
						range.moveToElementEditStart( that );

						var $range = $doc.createRange();
						$range.setStart( range.startContainer.$, range.startOffset );
						$range.collapse( true );

						$sel.removeAllRanges();
						$sel.addRange( $range );
					}
				}

				function requiresFix( $sel ) {
					// This condition covers most broken cases after setting data.
					if ( $sel.anchorNode && $sel.anchorNode == that.$ ) {
						return true;
					}

					// Fix for:
					// http://tests.ckeditor.dev:1030/tests/core/selection/manual/focusaftersettingdata
					// (the inline editor TC)
					if ( CKEDITOR.env.webkit ) {
						var active = that.getDocument().getActive();
						if ( active && active.equals( that ) && !$sel.anchorNode ) {
							return true;
						}
					}
				}

				function fixMSSelection() {
					var $doc = that.getDocument().$,
						$sel = $doc.selection,
						active = that.getDocument().getActive();

					if ( $sel.type == 'None' && active.equals( that ) ) {
						var range = new CKEDITOR.dom.range( that ),
							parentElement,
							$range = $doc.body.createTextRange();

						range.moveToElementEditStart( that );

						parentElement = range.startContainer;
						if ( parentElement.type != CKEDITOR.NODE_ELEMENT ) {
							parentElement = parentElement.getParent();
						}

						$range.moveToElementText( parentElement.$ );
						$range.collapse( true );
						$range.select();
					}
				}
			},

			/**
			 * The base of the {@link CKEDITOR.editor#getSelectedHtml} method.
			 *
			 * @since 4.5.0
			 * @method getHtmlFromRange
			 * @param {CKEDITOR.dom.range} range
			 * @returns {CKEDITOR.dom.documentFragment}
			 */
			getHtmlFromRange: function( range ) {
				// There's nothing to return if range is collapsed.
				if ( range.collapsed )
					return new CKEDITOR.dom.documentFragment( range.document );

				// Info object passed between methods.
				var that = {
					doc: this.getDocument(),
					// Leave original range object untouched.
					range: range.clone()
				};

				getHtmlFromRangeHelpers.eol.detect( that, this );
				getHtmlFromRangeHelpers.bogus.exclude( that );
				getHtmlFromRangeHelpers.cell.shrink( that );

				that.fragment = that.range.cloneContents();

				getHtmlFromRangeHelpers.tree.rebuild( that, this );
				getHtmlFromRangeHelpers.eol.fix( that, this );

				return new CKEDITOR.dom.documentFragment( that.fragment.$ );
			},

			/**
			 * The base of the {@link CKEDITOR.editor#extractSelectedHtml} method.
			 *
			 * **Note:** The range is modified so it matches the desired selection after extraction
			 * even though the selection is not made.
			 *
			 * @since 4.5.0
			 * @param {CKEDITOR.dom.range} range
			 * @param {Boolean} [removeEmptyBlock=false] See {@link CKEDITOR.editor#extractSelectedHtml}'s parameter.
			 * Note that the range will not be modified if this parameter is set to `true`.
			 * @returns {CKEDITOR.dom.documentFragment} The extracted fragment of the editable content.
			 */
			extractHtmlFromRange: function( range, removeEmptyBlock ) {
				var helpers = extractHtmlFromRangeHelpers,
					that = {
						range: range,
						doc: range.document
					},
					// Since it is quite hard to build a valid documentFragment
					// out of extracted contents because DOM changes, let's mimic
					// extracted HTML with #getHtmlFromRange. Yep. It's a hack.
					extractedFragment = this.getHtmlFromRange( range );

				// Collapsed range means that there's nothing to extract.
				if ( range.collapsed ) {
					range.optimize();
					return extractedFragment;
				}

				// Include inline element if possible.
				range.enlarge( CKEDITOR.ENLARGE_INLINE, 1 );

				// This got to be done before bookmarks are created because purging
				// depends on the position of the range at the boundaries of the table,
				// usually distorted by bookmark spans.
				helpers.table.detectPurge( that );

				// We'll play with DOM, let's hold the position of the range.
				that.bookmark = range.createBookmark();
				// While bookmarked, make unaccessible, to make sure that none of the methods
				// will try to use it (they should use that.bookmark).
				// This is done because ranges get desynchronized with the DOM when more bookmarks
				// is created (as for instance that.targetBookmark).
				delete that.range;

				// The range to be restored after extraction should be kept
				// outside of the range, so it's not removed by range.extractContents.
				var targetRange = this.editor.createRange();
				targetRange.moveToPosition( that.bookmark.startNode, CKEDITOR.POSITION_BEFORE_START );
				that.targetBookmark = targetRange.createBookmark();

				// Execute content-specific detections.
				helpers.list.detectMerge( that, this );
				helpers.table.detectRanges( that, this );
				helpers.block.detectMerge( that, this );

				// Simply, do the job.
				if ( that.tableContentsRanges ) {
					helpers.table.deleteRanges( that );

					// Done here only to remove bookmark's spans.
					range.moveToBookmark( that.bookmark );
					that.range = range;
				} else {
					// To use the range we need to restore the bookmark and make
					// the range accessible again.
					range.moveToBookmark( that.bookmark );
					that.range = range;
					range.extractContents( helpers.detectExtractMerge( that ) );
				}

				// Move working range to desired, pre-computed position.
				range.moveToBookmark( that.targetBookmark );

				// Make sure range is always anchored in an element. For consistency.
				range.optimize();

				// It my happen that the uncollapsed range which referred to a valid selection,
				// will be placed in an uneditable location after being collapsed:
				// <tr>[<td>x</td>]</tr> -> <tr>[]<td>x</td></tr> -> <tr><td>[]x</td></tr>
				helpers.fixUneditableRangePosition( range );

				// Execute content-specific post-extract routines.
				helpers.list.merge( that, this );
				helpers.table.purge( that, this );
				helpers.block.merge( that, this );

				// Remove empty block, duh!
				if ( removeEmptyBlock ) {
					var path = range.startPath();

					// <p><b>^</b></p> is empty block.
					if (
						range.checkStartOfBlock() &&
						range.checkEndOfBlock() &&
						path.block &&
						!range.root.equals( path.block ) &&
						// Do not remove a block with bookmarks. (https://dev.ckeditor.com/ticket/13465)
						!hasBookmarks( path.block ) ) {
						range.moveToPosition( path.block, CKEDITOR.POSITION_BEFORE_START );
						path.block.remove();
					}
				} else {
					// Auto paragraph, if needed.
					helpers.autoParagraph( this.editor, range );

					// Let's have a bogus next to the caret, if needed.
					if ( isEmpty( range.startContainer ) )
						range.startContainer.appendBogus();
				}

				// Merge inline siblings if any around the caret.
				range.startContainer.mergeSiblings();

				return extractedFragment;
			},

			/**
			 * Editable element bootstrapping.
			 *
			 * @private
			 */
			setup: function() {
				var editor = this.editor;

				// Handle the load/read of editor data/snapshot.
				this.attachListener( editor, 'beforeGetData', function() {
					var data = this.getData();

					// Post processing html output of wysiwyg editable.
					if ( !this.is( 'textarea' ) ) {
						// Reset empty if the document contains only one empty paragraph.
						if ( editor.config.ignoreEmptyParagraph !== false )
							data = data.replace( emptyParagraphRegexp, function( match, lookback ) {
								return lookback;
							} );
					}

					editor.setData( data, null, 1 );
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
					var sel = editor.getSelection(),
						ieSel = sel && sel.getNative();

					// IE considers control-type element as separate
					// focus host when selected, avoid destroying the
					// selection in such case. (https://dev.ckeditor.com/ticket/5812) (https://dev.ckeditor.com/ticket/8949)
					if ( ieSel && ieSel.type == 'Control' )
						return;

					this.focus();
				}, this );

				this.attachListener( editor, 'insertHtml', function( evt ) {
					this.insertHtml( evt.data.dataValue, evt.data.mode, evt.data.range );
				}, this );
				this.attachListener( editor, 'insertElement', function( evt ) {
					this.insertElement( evt.data );
				}, this );
				this.attachListener( editor, 'insertText', function( evt ) {
					this.insertText( evt.data );
				}, this );

				// Update editable state.
				this.setReadOnly( editor.readOnly );

				// The editable class.
				this.attachClass( 'cke_editable' );

				// The element mode css class.
				if ( editor.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ) {
					this.attachClass( 'cke_editable_inline' );
				} else if ( editor.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE ||
					editor.elementMode == CKEDITOR.ELEMENT_MODE_APPENDTO ) {
					this.attachClass( 'cke_editable_themed' );
				}

				this.attachClass( 'cke_contents_' + editor.config.contentsLangDirection );

				// Setup editor keystroke handlers on this element.
				var keystrokeHandler = editor.keystrokeHandler;

				// If editor is read-only, then make sure that BACKSPACE key
				// is blocked to prevent browser history navigation.
				keystrokeHandler.blockedKeystrokes[ 8 ] = +editor.readOnly;

				editor.keystrokeHandler.attach( this );

				// Update focus states.
				this.on( 'blur', function() {
					this.hasFocus = false;
				}, null, null, -1 );

				this.on( 'focus', function() {
					this.hasFocus = true;
				}, null, null, -1 );

				if ( CKEDITOR.env.webkit ) {
					// [WebKit] Save scrollTop value so it can be used when restoring locked selection. (https://dev.ckeditor.com/ticket/14659)
					this.on( 'scroll', function() {
						editor._.previousScrollTop = editor.editable().$.scrollTop;
					}, null, null, -1 );
				}

				// [Edge] This is the other part of the workaround for Edge which restores saved
				// scrollTop value and removes listener which is not needed anymore. (https://dev.ckeditor.com/ticket/14825)
				if ( CKEDITOR.env.edge && CKEDITOR.env.version > 14 ) {

					var fixScrollOnFocus = function() {
						var editable = editor.editable();

						if ( editor._.previousScrollTop != null && editable.getDocument().equals( CKEDITOR.document ) ) {
							editable.$.scrollTop = editor._.previousScrollTop;
							editor._.previousScrollTop = null;
							this.removeListener( 'scroll', fixScrollOnFocus );
						}
					};

					this.on( 'scroll', fixScrollOnFocus );
				}

				// Register to focus manager.
				editor.focusManager.add( this );

				// Inherit the initial focus on editable element.
				if ( this.equals( CKEDITOR.document.getActive() ) ) {
					this.hasFocus = true;
					// Pending until this editable has attached.
					editor.once( 'contentDom', function() {
						editor.focusManager.focus( this );
					}, this );
				}

				// Apply tab index on demand, with original direction saved.
				if ( this.isInline() ) {

					// tabIndex of the editable is different than editor's one.
					// Update the attribute of the editable.
					this.changeAttr( 'tabindex', editor.tabIndex );
				}

				// The above is all we'll be doing for a <textarea> editable.
				if ( this.is( 'textarea' ) )
					return;

				// The DOM document which the editing acts upon.
				editor.document = this.getDocument();
				editor.window = this.getWindow();

				var doc = editor.document;

				this.changeAttr( 'spellcheck', !editor.config.disableNativeSpellChecker );

				// Apply contents direction on demand, with original direction saved.
				var dir = editor.config.contentsLangDirection;
				if ( this.getDirection( 1 ) != dir )
					this.changeAttr( 'dir', dir );

				// Create the content stylesheet for this document.
				var styles = CKEDITOR.getCss();
				if ( styles ) {
					var head = doc.getHead(),
						stylesElement = head.getCustomData( 'stylesheet' );

					if ( !stylesElement ) {
						var sheet = doc.appendStyleText( styles );
						sheet = new CKEDITOR.dom.element( sheet.ownerNode || sheet.owningElement );
						head.setCustomData( 'stylesheet', sheet );
						sheet.data( 'cke-temp', 1 );
					} else if ( styles != stylesElement.getText() ) {
						CKEDITOR.env.ie && CKEDITOR.env.version < 9 ? stylesElement.$.styleSheet.cssText = styles : stylesElement.setText( styles );
					}
				}

				// Update the stylesheet sharing count.
				var ref = doc.getCustomData( 'stylesheet_ref' ) || 0;
				doc.setCustomData( 'stylesheet_ref', ref + 1 );

				// Pass this configuration to styles system.
				this.setCustomData( 'cke_includeReadonly', !editor.config.disableReadonlyStyling );

				// Prevent the browser opening read-only links. (https://dev.ckeditor.com/ticket/6032 & https://dev.ckeditor.com/ticket/10912)
				this.attachListener( this, 'click', function( evt ) {
					evt = evt.data;

					var link = new CKEDITOR.dom.elementPath( evt.getTarget(), this ).contains( 'a' );

					if ( link && evt.$.button != 2 && link.isReadOnly() )
						evt.preventDefault();
				} );

				var backspaceOrDelete = { 8: 1, 46: 1 };

				// Override keystrokes which should have deletion behavior
				//  on fully selected element . (https://dev.ckeditor.com/ticket/4047) (https://dev.ckeditor.com/ticket/7645)
				this.attachListener( editor, 'key', function( evt ) {
					if ( editor.readOnly )
						return true;

					// Use getKey directly in order to ignore modifiers.
					// Justification: https://dev.ckeditor.com/ticket/11861#comment:13
					var keyCode = evt.data.domEvent.getKey(),
						isHandled;

					// Prevent of reading path of empty range (https://dev.ckeditor.com/ticket/13096, #457).
					var sel = editor.getSelection();
					if ( sel.getRanges().length === 0 ) {
						return;
					}

					// Backspace OR Delete.
					if ( keyCode in backspaceOrDelete ) {
						var selected,
							range = sel.getRanges()[ 0 ],
							path = range.startPath(),
							block,
							parent,
							next,
							rtl = keyCode == 8;


						if (
								// [IE<11] Remove selected image/anchor/etc here to avoid going back in history. (https://dev.ckeditor.com/ticket/10055)
								( CKEDITOR.env.ie && CKEDITOR.env.version < 11 && ( selected = sel.getSelectedElement() ) ) ||
								// Remove the entire list/table on fully selected content. (https://dev.ckeditor.com/ticket/7645)
								( selected = getSelectedTableList( sel ) ) ) {
							// Make undo snapshot.
							editor.fire( 'saveSnapshot' );

							// Delete any element that 'hasLayout' (e.g. hr,table) in IE8 will
							// break up the selection, safely manage it here. (https://dev.ckeditor.com/ticket/4795)
							range.moveToPosition( selected, CKEDITOR.POSITION_BEFORE_START );
							// Remove the control manually.
							selected.remove();
							range.select();

							editor.fire( 'saveSnapshot' );

							isHandled = 1;
						} else if ( range.collapsed ) {
							// Handle the following special cases: (https://dev.ckeditor.com/ticket/6217)
							// 1. Del/Backspace key before/after table;
							// 2. Backspace Key after start of table.
							if ( ( block = path.block ) &&
									( next = block[ rtl ? 'getPrevious' : 'getNext' ]( isNotWhitespace ) ) &&
									( next.type == CKEDITOR.NODE_ELEMENT ) &&
									next.is( 'table' ) &&
									range[ rtl ? 'checkStartOfBlock' : 'checkEndOfBlock' ]() ) {
								editor.fire( 'saveSnapshot' );

								// Remove the current empty block.
								if ( range[ rtl ? 'checkEndOfBlock' : 'checkStartOfBlock' ]() )
									block.remove();

								// Move cursor to the beginning/end of table cell.
								range[ 'moveToElementEdit' + ( rtl ? 'End' : 'Start' ) ]( next );
								range.select();

								editor.fire( 'saveSnapshot' );

								isHandled = 1;
							}
							else if ( path.blockLimit && path.blockLimit.is( 'td' ) &&
									( parent = path.blockLimit.getAscendant( 'table' ) ) &&
									range.checkBoundaryOfElement( parent, rtl ? CKEDITOR.START : CKEDITOR.END ) &&
									( next = parent[ rtl ? 'getPrevious' : 'getNext' ]( isNotWhitespace ) ) ) {
								editor.fire( 'saveSnapshot' );

								// Move cursor to the end of previous block.
								range[ 'moveToElementEdit' + ( rtl ? 'End' : 'Start' ) ]( next );

								// Remove any previous empty block.
								if ( range.checkStartOfBlock() && range.checkEndOfBlock() )
									next.remove();
								else
									range.select();

								editor.fire( 'saveSnapshot' );

								isHandled = 1;
							}
							// BACKSPACE/DEL pressed at the start/end of table cell.
							else if ( ( parent = path.contains( [ 'td', 'th', 'caption' ] ) ) &&
									range.checkBoundaryOfElement( parent, rtl ? CKEDITOR.START : CKEDITOR.END ) ) {
								isHandled = 1;
							}
						}

					}

					return !isHandled;
				} );

				// On IE>=11 we need to fill blockless editable with <br> if it was deleted.
				if ( editor.blockless && CKEDITOR.env.ie && CKEDITOR.env.needsBrFiller ) {
					this.attachListener( this, 'keyup', function( evt ) {
						if ( evt.data.getKeystroke() in backspaceOrDelete && !this.getFirst( isNotEmpty ) ) {
							this.appendBogus();

							// Set the selection before bogus, because IE tends to put it after.
							var range = editor.createRange();
							range.moveToPosition( this, CKEDITOR.POSITION_AFTER_START );
							range.select();
						}
					} );
				}

				this.attachListener( this, 'dblclick', function( evt ) {
					if ( editor.readOnly )
						return false;

					var data = { element: evt.data.getTarget() };
					editor.fire( 'doubleclick', data );
				} );

				// Prevent automatic submission in IE https://dev.ckeditor.com/ticket/6336
				CKEDITOR.env.ie && this.attachListener( this, 'click', blockInputClick );

				// Gecko/Webkit need some help when selecting control type elements. (https://dev.ckeditor.com/ticket/3448)
				// We apply same behavior for IE Edge. (https://dev.ckeditor.com/ticket/13386)
				if ( !CKEDITOR.env.ie || CKEDITOR.env.edge ) {
					this.attachListener( this, 'mousedown', function( ev ) {
						var control = ev.data.getTarget();
						// https://dev.ckeditor.com/ticket/11727. Note: htmlDP assures that input/textarea/select have contenteditable=false
						// attributes. However, they also have data-cke-editable attribute, so isReadOnly() returns false,
						// and therefore those elements are correctly selected by this code.
						if ( control.is( 'img', 'hr', 'input', 'textarea', 'select' ) && !control.isReadOnly() ) {
							editor.getSelection().selectElement( control );

							// Prevent focus from stealing from the editable. (https://dev.ckeditor.com/ticket/9515)
							if ( control.is( 'input', 'textarea', 'select' ) )
								ev.data.preventDefault();
						}
					} );
				}

				// For some reason, after click event is done, IE Edge loses focus on the selected element. (https://dev.ckeditor.com/ticket/13386)
				// Additional check for readonly disabled selecting of non-editable images (#2129).
				if ( CKEDITOR.env.edge ) {
					this.attachListener( this, 'mouseup', function( ev ) {
						var selectedElement = ev.data.getTarget();
						if ( selectedElement && selectedElement.is( 'img' ) && !selectedElement.isReadOnly() ) {
							editor.getSelection().selectElement( selectedElement );
						}
					} );
				}

				// Prevent right click from selecting an empty block even
				// when selection is anchored inside it. (https://dev.ckeditor.com/ticket/5845)
				if ( CKEDITOR.env.gecko ) {
					this.attachListener( this, 'mouseup', function( ev ) {
						if ( ev.data.$.button == 2 ) {
							var target = ev.data.getTarget();

							if ( !target.getAscendant( 'table' ) && !target.getOuterHtml().replace( emptyParagraphRegexp, '' ) ) {
								var range = editor.createRange();
								range.moveToElementEditStart( target );
								range.select( true );
							}
						}
					} );
				}

				// Webkit: avoid from editing form control elements content.
				if ( CKEDITOR.env.webkit ) {
					// Prevent from tick checkbox/radiobox/select
					this.attachListener( this, 'click', function( ev ) {
						if ( ev.data.getTarget().is( 'input', 'select' ) )
							ev.data.preventDefault();
					} );

					// Prevent from editig textfield/textarea value.
					this.attachListener( this, 'mouseup', function( ev ) {
						if ( ev.data.getTarget().is( 'input', 'textarea' ) )
							ev.data.preventDefault();
					} );
				}

				// Prevent Webkit/Blink from going rogue when joining
				// blocks on BACKSPACE/DEL (https://dev.ckeditor.com/ticket/11861,https://dev.ckeditor.com/ticket/9998).
				if ( CKEDITOR.env.webkit ) {
					this.attachListener( editor, 'key', function( evt ) {
						if ( editor.readOnly ) {
							return true;
						}

						// Use getKey directly in order to ignore modifiers.
						// Justification: https://dev.ckeditor.com/ticket/11861#comment:13
						var key = evt.data.domEvent.getKey();

						if ( !( key in backspaceOrDelete ) )
							return;

						// Prevent of reading path of empty range (https://dev.ckeditor.com/ticket/13096, #457).
						var sel = editor.getSelection();
						if ( sel.getRanges().length === 0 ) {
							return;
						}

						var backspace = key == 8,
							range = sel.getRanges()[ 0 ],
							startPath = range.startPath();

						if ( range.collapsed ) {
							if ( !mergeBlocksCollapsedSelection( editor, range, backspace, startPath ) )
								return;
						} else {
							if ( !mergeBlocksNonCollapsedSelection( editor, range, startPath ) )
								return;
						}

						// Scroll to the new position of the caret (https://dev.ckeditor.com/ticket/11960).
						editor.getSelection().scrollIntoView();
						editor.fire( 'saveSnapshot' );

						return false;
					}, this, null, 100 ); // Later is better – do not override existing listeners.
				}
			},

			/**
			 * @inheritdoc CKEDITOR.dom.domObject#getUniqueId
			 */
			getUniqueId: function() {
				var expandoNumber;
				// Editable is cached unlike other elements, so we can use it to store expando number.
				// We need it to properly cleanup custom data in case of permission denied
				// thrown by Edge when accessing native element of detached editable (#3115).
				try {
					this._.expandoNumber = expandoNumber = CKEDITOR.dom.domObject.prototype.getUniqueId.call( this );
				} catch ( e ) {
					expandoNumber = this._ && this._.expandoNumber;
				}

				return expandoNumber;
			}
		},

		_: {
			cleanCustomData: function() {
				// Update the editor cached data with current data.
				this.removeClass( 'cke_editable' );
				this.restoreAttrs();

				// Cleanup our custom classes.
				var classes = this.removeCustomData( 'classes' );

				while ( classes && classes.length ) {
					this.removeClass( classes.pop() );
				}

				if ( this.is( 'textarea' ) ) {
					return;
				}

				var doc = this.getDocument(),
					head = doc.getHead();

				if ( !head.getCustomData( 'stylesheet' ) ) {
					return;
				}

				var refs = doc.getCustomData( 'stylesheet_ref' );

				// Remove contents stylesheet from document if it's the last usage.
				if ( !--refs ) {
					doc.removeCustomData( 'stylesheet_ref' );
					head.removeCustomData( 'stylesheet' ).remove();
				} else {
					doc.setCustomData( 'stylesheet_ref', refs );
				}
			}
		}
	} );

	/**
	 * Creates, retrieves or detaches an editable element of the editor.
	 * This method should always be used instead of calling {@link CKEDITOR.editable} directly.
	 *
	 * @method editable
	 * @member CKEDITOR.editor
	 * @param {CKEDITOR.dom.element/CKEDITOR.editable} [elementOrEditable] The
	 * DOM element to become the editable or a {@link CKEDITOR.editable} object.
	 * @returns {CKEDITOR.dom.element/null} The editor's editable element, or `null` if not available.
	 */
	CKEDITOR.editor.prototype.editable = function( element ) {
		var editable = this._.editable;

		// This editor has already associated with
		// an editable element, silently fails.
		if ( editable && element )
			return 0;

		if ( !arguments.length ) {
			return editable;
		}

		if ( element ) {
			editable = element instanceof CKEDITOR.editable ? element : new CKEDITOR.editable( this, element );
		} else {
			editable && editable.detach();
			editable = null;
		}

		return this._.editable = editable;
	};

	CKEDITOR.on( 'instanceLoaded', function( evt ) {
		var editor = evt.editor;

		// and flag that the element was locked by our code so it'll be editable by the editor functions (https://dev.ckeditor.com/ticket/6046).
		editor.on( 'insertElement', function( evt ) {
			var element = evt.data;
			if ( element.type == CKEDITOR.NODE_ELEMENT && ( element.is( 'input' ) || element.is( 'textarea' ) ) ) {
				// // The element is still not inserted yet, force attribute-based check.
				if ( element.getAttribute( 'contentEditable' ) != 'false' )
					element.data( 'cke-editable', element.hasAttribute( 'contenteditable' ) ? 'true' : '1' );
				element.setAttribute( 'contentEditable', false );
			}
		} );

		editor.on( 'selectionChange', function( evt ) {
			if ( editor.readOnly )
				return;

			// Auto fixing on some document structure weakness to enhance usabilities. (https://dev.ckeditor.com/ticket/3190 and https://dev.ckeditor.com/ticket/3189)
			var sel = editor.getSelection();
			// Do it only when selection is not locked. (https://dev.ckeditor.com/ticket/8222)
			if ( sel && !sel.isLocked ) {
				var isDirty = editor.checkDirty();

				// Lock undoM before touching DOM to prevent
				// recording these changes as separate snapshot.
				editor.fire( 'lockSnapshot' );
				fixDom( evt );
				editor.fire( 'unlockSnapshot' );

				!isDirty && editor.resetDirty();
			}
		} );
	} );

	CKEDITOR.on( 'instanceCreated', function( evt ) {
		var editor = evt.editor;

		editor.on( 'mode', function() {

			var editable = editor.editable();

			// Setup proper ARIA roles and properties for inline editable, classic
			// (iframe-based) editable is instead handled by plugin.
			if ( editable && editable.isInline() ) {

				var ariaLabel = editor.title;

				editable.changeAttr( 'role', 'textbox' );
				editable.changeAttr( 'aria-multiline', 'true' ); // (#1034)
				editable.changeAttr( 'aria-label', ariaLabel );

				if ( ariaLabel )
					editable.changeAttr( 'title', ariaLabel );

				var helpLabel = editor.fire( 'ariaEditorHelpLabel', {} ).label;
				if ( helpLabel ) {
					// Put the voice label in different spaces, depending on element mode, so
					// the DOM element get auto detached on mode reload or editor destroy.
					var ct = this.ui.space( this.elementMode == CKEDITOR.ELEMENT_MODE_INLINE ? 'top' : 'contents' );
					if ( ct ) {
						var ariaDescId = CKEDITOR.tools.getNextId(),
							desc = CKEDITOR.dom.element.createFromHtml( '<span id="' + ariaDescId + '" class="cke_voice_label">' + helpLabel + '</span>' );
						ct.append( desc );
						editable.changeAttr( 'aria-describedby', ariaDescId );
					}
				}
			}
		} );
	} );

	// https://dev.ckeditor.com/ticket/9222: Show text cursor in Gecko.
	// Show default cursor over control elements on all non-IEs.
	CKEDITOR.addCss( '.cke_editable{cursor:text}.cke_editable img,.cke_editable input,.cke_editable textarea{cursor:default}' );

	//
	//
	// Bazillion helpers for the editable class and above listeners.
	//
	//

	isNotWhitespace = CKEDITOR.dom.walker.whitespaces( true ),
	isNotBookmark = CKEDITOR.dom.walker.bookmark( false, true ),
	isEmpty = CKEDITOR.dom.walker.empty(),
	isBogus = CKEDITOR.dom.walker.bogus(),
	// Matching an empty paragraph at the end of document.
	emptyParagraphRegexp = /(^|<body\b[^>]*>)\s*<(p|div|address|h\d|center|pre)[^>]*>\s*(?:<br[^>]*>|&nbsp;|\u00A0|&#160;)?\s*(:?<\/\2>)?\s*(?=$|<\/body>)/gi;

	// Auto-fixing block-less content by wrapping paragraph (https://dev.ckeditor.com/ticket/3190), prevent
	// non-exitable-block by padding extra br.(https://dev.ckeditor.com/ticket/3189)
	// Returns truly value when dom was changed, falsy otherwise.
	function fixDom( evt ) {
		var editor = evt.editor,
			path = evt.data.path,
			blockLimit = path.blockLimit,
			selection = evt.data.selection,
			range = selection.getRanges()[ 0 ],
			selectionUpdateNeeded;

		if ( CKEDITOR.env.gecko || ( CKEDITOR.env.ie && CKEDITOR.env.needsBrFiller ) ) {
			var blockNeedsFiller = needsBrFiller( selection, path );
			if ( blockNeedsFiller ) {
				blockNeedsFiller.appendBogus();
				// IE tends to place selection after appended bogus, so we need to
				// select the original range (placed before bogus).
				// In Edge update selection only if editor has gained focus before (#504).
				selectionUpdateNeeded = ( CKEDITOR.env.ie && !CKEDITOR.env.edge ) ||
					( CKEDITOR.env.edge && editor._.previousActive );
			}
		}

		// When we're in block enter mode, a new paragraph will be established
		// to encapsulate inline contents inside editable. (https://dev.ckeditor.com/ticket/3657)
		// Don't autoparagraph if browser (namely - IE) incorrectly anchored selection
		// inside non-editable content. This happens e.g. if non-editable block is the only
		// content of editable.
		if ( shouldAutoParagraph( editor, path.block, blockLimit ) && range.collapsed && !range.getCommonAncestor().isReadOnly() ) {
			var testRng = range.clone();
			testRng.enlarge( CKEDITOR.ENLARGE_BLOCK_CONTENTS );
			var walker = new CKEDITOR.dom.walker( testRng );
			walker.guard = function( node ) {
				return !isNotEmpty( node ) ||
					node.type == CKEDITOR.NODE_COMMENT ||
					node.isReadOnly();
			};

			// 1. Inline content discovered under cursor;
			// 2. Empty editable.
			if ( !walker.checkForward() || testRng.checkStartOfBlock() && testRng.checkEndOfBlock() ) {
				var fixedBlock = range.fixBlock( true, editor.activeEnterMode == CKEDITOR.ENTER_DIV ? 'div' : 'p' );

				// For IE<11, we should remove any filler node which was introduced before.
				if ( !CKEDITOR.env.needsBrFiller ) {
					var first = fixedBlock.getFirst( isNotEmpty );
					if ( first && isNbsp( first ) )
						first.remove();
				}

				selectionUpdateNeeded = 1;

				// Cancel this selection change in favor of the next (correct). (https://dev.ckeditor.com/ticket/6811)
				evt.cancel();
			}
		}

		if ( selectionUpdateNeeded )
			range.select();
	}

	// Checks whether current selection requires br filler to be appended.
	// @returns Block which needs filler or falsy value.
	function needsBrFiller( selection, path ) {
		// Fake selection does not need filler, because it is fake.
		if ( selection.isFake )
			return 0;

		// Ensure bogus br could help to move cursor (out of styles) to the end of block. (https://dev.ckeditor.com/ticket/7041)
		var pathBlock = path.block || path.blockLimit,
			lastNode = pathBlock && pathBlock.getLast( isNotEmpty );

		// Check some specialities of the current path block:
		// 1. It is really displayed as block; (https://dev.ckeditor.com/ticket/7221)
		// 2. It doesn't end with one inner block; (https://dev.ckeditor.com/ticket/7467)
		// 3. It doesn't have bogus br yet.
		if (
			pathBlock && pathBlock.isBlockBoundary() &&
			!( lastNode && lastNode.type == CKEDITOR.NODE_ELEMENT && lastNode.isBlockBoundary() ) &&
			!pathBlock.is( 'pre' ) && !pathBlock.getBogus()
		)
			return pathBlock;
	}

	function blockInputClick( evt ) {
		var element = evt.data.getTarget();
		if ( element.is( 'input' ) ) {
			var type = element.getAttribute( 'type' );
			if ( type == 'submit' || type == 'reset' )
				evt.data.preventDefault();
		}
	}

	function isNotEmpty( node ) {
		return isNotWhitespace( node ) && isNotBookmark( node );
	}

	function isNbsp( node ) {
		return node.type == CKEDITOR.NODE_TEXT && CKEDITOR.tools.trim( node.getText() ).match( /^(?:&nbsp;|\xa0)$/ );
	}

	function isNotBubbling( fn, src ) {
		return function( evt ) {
			var other = evt.data.$.toElement || evt.data.$.fromElement || evt.data.$.relatedTarget;

			// First of all, other may simply be null/undefined.
			// Second of all, at least early versions of Spartan returned empty objects from evt.relatedTarget,
			// so let's also check the node type.
			other = ( other && other.nodeType == CKEDITOR.NODE_ELEMENT ) ? new CKEDITOR.dom.element( other ) : null;

			if ( !( other && ( src.equals( other ) || src.contains( other ) ) ) )
				fn.call( this, evt );
		};
	}

	function hasBookmarks( element ) {
		// We use getElementsByTag() instead of find() to retain compatibility with IE quirks mode.
		var potentialBookmarks = element.getElementsByTag( 'span' ),
			i = 0,
			child;

		if ( potentialBookmarks ) {
			while ( ( child = potentialBookmarks.getItem( i++ ) ) ) {
				if ( !isNotBookmark( child ) ) {
					return true;
				}
			}
		}

		return false;
	}

	// Check if the entire table/list contents is selected.
	function getSelectedTableList( sel ) {
		var selected,
			range = sel.getRanges()[ 0 ],
			editable = sel.root,
			path = range.startPath(),
			structural = { table: 1, ul: 1, ol: 1, dl: 1 };

		if ( path.contains( structural ) ) {
			// Clone the original range.
			var walkerRng = range.clone();

			// Enlarge the range: X<ul><li>[Y]</li></ul>X => [X<ul><li>]Y</li></ul>X
			walkerRng.collapse( 1 );
			walkerRng.setStartAt( editable, CKEDITOR.POSITION_AFTER_START );

			// Create a new walker.
			var walker = new CKEDITOR.dom.walker( walkerRng );

			// Assign a new guard to the walker.
			walker.guard = guard();

			// Go backwards checking for selected structural node.
			walker.checkBackward();

			// If there's a selected structured element when checking backwards,
			// then check the same forwards.
			if ( selected ) {
				// Clone the original range.
				walkerRng = range.clone();

				// Enlarge the range (assuming <ul> is selected element from guard):
				//
				// 	   X<ul><li>[Y]</li></ul>X    =>    X<ul><li>Y[</li></ul>]X
				//
				// If the walker went deeper down DOM than a while ago when traversing
				// backwards, then it doesn't make sense: an element must be selected
				// symmetrically. By placing range end **after previously selected node**,
				// we make sure we don't go no deeper in DOM when going forwards.
				walkerRng.collapse();
				walkerRng.setEndAt( selected, CKEDITOR.POSITION_AFTER_END );

				// Create a new walker.
				walker = new CKEDITOR.dom.walker( walkerRng );

				// Assign a new guard to the walker.
				walker.guard = guard( true );

				// Reset selected node.
				selected = false;

				// Go forwards checking for selected structural node.
				walker.checkForward();

				return selected;
			}
		}

		return null;

		function guard( forwardGuard ) {
			return function( node, isWalkOut ) {
				// Save the encountered node as selected if going down the DOM structure
				// and the node is structured element.
				if ( isWalkOut && node.type == CKEDITOR.NODE_ELEMENT && node.is( structural ) )
					selected = node;

				// Stop the walker when either traversing another non-empty node at the same
				// DOM level as in previous step.
				// NOTE: When going forwards, stop if encountered a bogus.
				if ( !isWalkOut && isNotEmpty( node ) && !( forwardGuard && isBogus( node ) ) )
					return false;
			};
		}
	}

	// Whether in given context (pathBlock, pathBlockLimit and editor settings)
	// editor should automatically wrap inline contents with blocks.
	function shouldAutoParagraph( editor, pathBlock, pathBlockLimit ) {
		// Check whether pathBlock equals pathBlockLimit to support nested editable (https://dev.ckeditor.com/ticket/12162).
		return editor.config.autoParagraph !== false &&
			editor.activeEnterMode != CKEDITOR.ENTER_BR &&
			(
				( editor.editable().equals( pathBlockLimit ) && !pathBlock ) ||
				( pathBlock && pathBlock.getAttribute( 'contenteditable' ) == 'true' )
			);
	}

	function autoParagraphTag( editor ) {
		return ( editor.activeEnterMode != CKEDITOR.ENTER_BR && editor.config.autoParagraph !== false ) ? editor.activeEnterMode == CKEDITOR.ENTER_DIV ? 'div' : 'p' : false;
	}

	//
	// Functions related to insertXXX methods
	//
	insert = ( function() {
		'use strict';

		var DTD = CKEDITOR.dtd;

		// Inserts the given (valid) HTML into the range position (with range content deleted),
		// guarantee it's result to be a valid DOM tree.
		function insert( editable, type, data, range ) {
			var editor = editable.editor,
				dontFilter = false;

			if ( type == 'unfiltered_html' ) {
				type = 'html';
				dontFilter = true;
			}

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
					dontFilter: dontFilter,
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

			// When enter mode is set to div and content wrapped with div is pasted,
			// we must ensure that no additional divs are created (#2751, #3379).
			if ( editor.enterMode === CKEDITOR.ENTER_DIV && editor.getData( true ) === '' ) {
				clearEditable( editable, range );
			}

			// DATA PROCESSING

			// Select range and stop execution.
			// If data has been totally emptied after the filtering,
			// any insertion is pointless (https://dev.ckeditor.com/ticket/10339).
			if ( data && processDataForInsertion( that, data ) ) {
				// DATA INSERTION
				insertDataIntoRange( that );
			}

			// FINAL CLEANUP
			// Set final range position and clean up.

			cleanupAfterInsertion( that );
		}

		function clearEditable( editable, range ) {
			var first = editable.getFirst();
			first && first.remove();
			range.setStartAt( editable, CKEDITOR.POSITION_AFTER_START );
			range.collapse( true );
		}

		// Prepare range to its data deletion.
		// Delete its contents.
		// Prepare it to insertion.
		function prepareRangeToDataInsertion( that ) {
			var range = that.range,
				mergeCandidates = that.mergeCandidates,
				isHtml = that.type === 'html',
				node, marker, path, startPath, endPath, previous, bm, endNode;

			// If range starts in inline element then insert a marker, so empty
			// inline elements won't be removed while range.deleteContents
			// and we will be able to move range back into this element.
			// E.g. 'aa<b>[bb</b>]cc' -> (after deleting) 'aa<b><span/></b>cc'
			if ( that.type == 'text' && range.shrink( CKEDITOR.SHRINK_ELEMENT, true, false ) ) {
				marker = CKEDITOR.dom.element.createFromHtml( '<span>&nbsp;</span>', range.document );
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
				node = endPath.block || endPath.blockLimit;
				var ancestor = range.getCommonAncestor();
				if ( node && !( node.equals( ancestor ) || node.contains( ancestor ) ) && range.checkEndOfBlock() ) {
					that.zombies.push( node );
				}

				range.deleteContents();
			}

			// Rule 4.
			// Move range into the previous block.
			while (
				( previous = getRangePrevious( range ) ) && checkIfElement( previous ) && previous.isBlockBoundary() &&
				// Check if previousNode was parent of range's startContainer before deleteContents.
				startPath.contains( previous )
			)
				range.moveToPosition( previous, CKEDITOR.POSITION_BEFORE_END );

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
			if ( ( node = path.contains( isInline, false, 1 ) ) ) {
				endNode = range.splitElement( node );
				that.inlineStylesRoot = node;
				that.inlineStylesPeak = path.lastElement;
			}

			// Record inline merging candidates for later cleanup in place.
			bm = range.createBookmark();

			// When called by insertHtml remove empty element created after splitting (#2813).
			if ( isHtml ) {
				removeEmptyInlineElement( node );
				removeEmptyInlineElement( endNode );
			}

			// 1. Inline siblings.
			node = bm.startNode.getPrevious( isNotEmpty );
			node && checkIfElement( node ) && isInline( node ) && mergeCandidates.push( node );
			node = bm.startNode.getNext( isNotEmpty );
			node && checkIfElement( node ) && isInline( node ) && mergeCandidates.push( node );

			// 2. Inline parents.
			node = bm.startNode;
			while ( ( node = node.getParent() ) && isInline( node ) ) {
				mergeCandidates.push( node );
			}

			range.moveToBookmark( bm );
		}

		function processDataForInsertion( that, data ) {
			var range = that.range;

			// Rule 8. - wrap entire data in inline styles.
			// (e.g. <p><b>x^z</b></p> + <p>a</p><p>b</p> -> <b><p>a</p><p>b</p></b>)
			// Incorrect tags order will be fixed by htmlDataProcessor.
			if ( that.type == 'text' && that.inlineStylesRoot )
				data = wrapDataWithInlineStyles( data, that );


			var context = that.blockLimit.getName();

			// Wrap data to be inserted, to avoid losing leading whitespaces
			// when going through the below procedure.
			if ( /^\s+|\s+$/.test( data ) && 'span' in CKEDITOR.dtd[ context ] ) {
				var protect = '<span data-cke-marker="1">&nbsp;</span>';
				data =  protect + data + protect;
			}

			// Process the inserted html, in context of the insertion root.
			// Don't use the "fix for body" feature as auto paragraphing must
			// be handled during insertion.
			data = that.editor.dataProcessor.toHtml( data, {
				context: null,
				fixForBody: false,
				protectedWhitespaces: !!protect,
				dontFilter: that.dontFilter,
				// Use the current, contextual settings.
				filter: that.editor.activeFilter,
				enterMode: that.editor.activeEnterMode
			} );


			// Build the node list for insertion.
			var doc = range.document,
				wrapper = doc.createElement( 'body' );

			wrapper.setHtml( data );

			// Eventually remove the temporaries.
			if ( protect ) {
				wrapper.getFirst().remove();
				wrapper.getLast().remove();
			}

			// Rule 7.
			var block = range.startPath().block;
			if ( block &&													// Apply when there exists path block after deleting selection's content...
				!( block.getChildCount() == 1 && block.getBogus() ) ) {		// ... and the only content of this block isn't a bogus.
				stripBlockTagIfSingleLine( wrapper );
			}

			that.dataWrapper = wrapper;

			return data;
		}

		function insertDataIntoRange( that ) {
			var range = that.range,
				doc = range.document,
				path,
				blockLimit = that.blockLimit,
				nodesData, nodeData, node,
				nodeIndex = 0,
				bogus,
				bogusNeededBlocks = [],
				pathBlock, fixBlock,
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
				separateEndContainer = !!endContainer.getCommonAncestor( startContainer ) && // endC is not detached.
					pos != CKEDITOR.POSITION_IDENTICAL && !( pos & CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_IS_CONTAINED ); // endC & endS are in separate branches.

			nodesData = extractNodesData( that.dataWrapper, that );

			removeBrsAdjacentToPastedBlocks( nodesData, range );

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

				// Auto paragraphing.
				if ( !nodeData.isBlock && shouldAutoParagraph( that.editor, path.block, path.blockLimit ) && ( fixBlock = autoParagraphTag( that.editor ) ) ) {
					fixBlock = doc.createElement( fixBlock );
					fixBlock.appendBogus();
					range.insertNode( fixBlock );
					if ( CKEDITOR.env.needsBrFiller && ( bogus = fixBlock.getBogus() ) )
						bogus.remove();
					range.moveToPosition( fixBlock, CKEDITOR.POSITION_BEFORE_END );
				}

				node = range.startPath().block;

				// Remove any bogus element on the current path block for now, and mark
				// it for later compensation.
				if ( node && !node.equals( pathBlock ) ) {
					bogus = node.getBogus();
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
						filteredNodes = filterElement( nodeData.node, blockLimit.getName(), !nodeIndex, nodeIndex == nodesData.length - 1 );
					}
				}

				if ( filteredNodes ) {
					while ( ( node = filteredNodes.pop() ) )
						range.insertNode( node );
					filteredNodes = 0;
				} else {
					// Insert current node at the start of range.
					range.insertNode( nodeData.node );
				}

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

			// Rule 9. Non-editable content should be selected as a whole.
			if ( isSingleNonEditableElement( nodesData ) ) {
				dontMoveCaret = true;
				node = nodesData[ 0 ].node;
				range.setStartAt( node, CKEDITOR.POSITION_BEFORE_START );
				range.setEndAt( node, CKEDITOR.POSITION_AFTER_END );
			}

			that.dontMoveCaret = dontMoveCaret;
			that.bogusNeededBlocks = bogusNeededBlocks;
		}

		function cleanupAfterInsertion( that ) {
			var range = that.range,
				node, testRange, movedIntoInline,
				bogusNeededBlocks = that.bogusNeededBlocks,
				// Create a bookmark to defend against the following range deconstructing operations.
				bm = range.createBookmark();

			// Remove all elements that could be created while splitting nodes
			// with ranges at its start|end.
			// E.g. remove <div><p></p></div>
			// But not <div><p> </p></div>
			// And replace <div><p><span data="cke-bookmark"/></p></div> with found bookmark.
			while ( ( node = that.zombies.pop() ) ) {
				// Detached element.
				if ( !node.getParent() )
					continue;

				testRange = range.clone();
				testRange.moveToElementEditStart( node );
				testRange.removeEmptyBlocksAtEnd();
			}

			if ( bogusNeededBlocks ) {
				// Bring back all block bogus nodes.
				while ( ( node = bogusNeededBlocks.pop() ) ) {
					if ( CKEDITOR.env.needsBrFiller )
						node.appendBogus();
					else
						node.append( range.document.createText( '\u00a0' ) );
				}
			}

			// Eventually merge identical inline elements.
			while ( ( node = that.mergeCandidates.pop() ) )
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

		//
		// HELPERS ------------------------------------------------------------
		//

		function checkIfElement( node ) {
			return node.type == CKEDITOR.NODE_ELEMENT;
		}

		function extractNodesData( dataWrapper, that ) {
			var node, sibling, nodeName, allowed,
				nodesData = [],
				startContainer = that.range.startContainer,
				path = that.range.startPath(),
				allowedNames = DTD[ startContainer.getName() ],
				nodeIndex = 0,
				nodesList = dataWrapper.getChildren(),
				nodesCount = nodesList.count(),
				firstNotAllowed = -1,
				lastNotAllowed = -1,
				lineBreak = 0,
				blockSibling;

			// Selection start within a list.
			var insideOfList = path.contains( DTD.$list );

			for ( ; nodeIndex < nodesCount; ++nodeIndex ) {
				node = nodesList.getItem( nodeIndex );

				if ( checkIfElement( node ) ) {
					nodeName = node.getName();

					// Extract only the list items, when insertion happens
					// inside of a list, reads as rearrange list items. (https://dev.ckeditor.com/ticket/7957)
					if ( insideOfList && nodeName in CKEDITOR.dtd.$list ) {
						nodesData = nodesData.concat( extractNodesData( node, that ) );
						continue;
					}

					allowed = !!allowedNames[ nodeName ];

					// Mark <brs data-cke-eol="1"> at the beginning and at the end.
					if ( nodeName == 'br' && node.data( 'cke-eol' ) && ( !nodeIndex || nodeIndex == nodesCount - 1 ) ) {
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

					nodesData.push( {
						isElement: 1,
						isLineBreak: lineBreak,
						isBlock: node.isBlockBoundary(),
						hasBlockSibling: blockSibling,
						node: node,
						name: nodeName,
						allowed: allowed
					} );

					lineBreak = 0;
					blockSibling = 0;
				} else {
					nodesData.push( { isElement: 0, node: node, allowed: 1 } );
				}
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
					if ( !afterSpace && !( isFirst && !nodeIndex ) ) {
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

		function isInline( node ) {
			return node && checkIfElement( node ) && ( node.is( DTD.$removeEmpty ) || node.is( 'a' ) && !node.isBlockBoundary() );
		}

		// Checks if only non-editable element is being inserted.
		function isSingleNonEditableElement( nodesData ) {
			if ( nodesData.length != 1 )
				return false;

			var nodeData = nodesData[ 0 ];

			return nodeData.isElement && ( nodeData.node.getAttribute( 'contenteditable' ) == 'false' );
		}

		var blockMergedTags = { p: 1, div: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, ul: 1, ol: 1, li: 1, pre: 1, dl: 1, blockquote: 1 };

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

			if ( ( nextNode = walker.next() ) &&							// Find next source node
				checkIfElement( nextNode ) &&								// which is an element
				blockMergedTags[ nextNode.getName() ] &&					// that can be merged.
				( previousNode = nextNode.getPrevious() ) &&				// Take previous one
				checkIfElement( previousNode ) &&							// which also has to be an element.
				!previousNode.getParent().equals( range.startContainer ) && // Fail if caret is on the same level.
																			// This means that caret is between these nodes.
				startPath.contains( previousNode ) &&						// Elements path of start of selection has
				endPath.contains( nextNode ) &&								// to contain prevNode and vice versa.
				nextNode.isIdentical( previousNode )						// Check if elements are identical.
			) {
				// Merge blocks and repeat.
				nextNode.moveChildren( previousNode );
				nextNode.remove();
				mergeAncestorElementsOfSelectionEnds( range, blockLimit, startPath, endPath );
			}
		}

		// If last node that will be inserted is a block (but not a <br>)
		// and it will be inserted right before <br> remove this <br>.
		// Do the same for the first element that will be inserted and preceding <br>.
		function removeBrsAdjacentToPastedBlocks( nodesData, range ) {
			var succeedingNode = range.endContainer.getChild( range.endOffset ),
				precedingNode = range.endContainer.getChild( range.endOffset - 1 );

			if ( succeedingNode )
				remove( succeedingNode, nodesData[ nodesData.length - 1 ] );

			if ( precedingNode && remove( precedingNode, nodesData[ 0 ] ) ) {
				// If preceding <br> was removed - move range left.
				range.setEnd( range.endContainer, range.endOffset - 1 );
				range.collapse();
			}

			function remove( maybeBr, maybeBlockData ) {
				if ( maybeBlockData.isBlock && maybeBlockData.isElement && !maybeBlockData.node.is( 'br' ) &&
					checkIfElement( maybeBr ) && maybeBr.is( 'br' ) ) {
					maybeBr.remove();
					return 1;
				}
			}
		}

		// Return 1 if <br> should be skipped when inserting, 0 otherwise.
		function splitOnLineBreak( range, blockLimit, nodeData ) {
			var firstBlockAscendant, pos;

			if ( nodeData.hasBlockSibling )
				return 1;

			firstBlockAscendant = range.startContainer.getAscendant( DTD.$block, 1 );
			if ( !firstBlockAscendant || !firstBlockAscendant.is( { div: 1, p: 1 } ) )
				return 0;

			pos = firstBlockAscendant.getPosition( blockLimit );

			if ( pos == CKEDITOR.POSITION_IDENTICAL || pos == CKEDITOR.POSITION_CONTAINS )
				return 0;

			var newContainer = range.splitElement( firstBlockAscendant );
			range.moveToPosition( newContainer, CKEDITOR.POSITION_AFTER_START );

			return 1;
		}

		var stripSingleBlockTags = { p: 1, div: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1 },
			inlineButNotBr = CKEDITOR.tools.extend( {}, DTD.$inline );
		delete inlineButNotBr.br;

		// Rule 7.
		function stripBlockTagIfSingleLine( dataWrapper ) {
			var block, children;

			if ( dataWrapper.getChildCount() == 1 &&					// Only one node bein inserted.
				checkIfElement( block = dataWrapper.getFirst() ) &&		// And it's an element.
				block.is( stripSingleBlockTags ) &&						// That's <p> or <div> or header.
				!block.hasAttribute( 'contenteditable' )				// It's not a non-editable block or nested editable.
			) {
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

			// Don't use String.replace because it fails in IE7 if special replacement
			// characters ($$, $&, etc.) are in data (https://dev.ckeditor.com/ticket/10367).
			return wrapper.getOuterHtml().split( '{cke-peak}' ).join( data );
		}

		return insert;
	} )();

	function removeEmptyInlineElement( element ) {
		if ( element && element.isEmptyInlineRemoveable() ) {
			element.remove();
		}
	}

	function afterInsert( editable ) {
		var editor = editable.editor;

		// Scroll using selection, not ranges, to affect native pastes.
		editor.getSelection().scrollIntoView();

		// Save snaps after the whole execution completed.
		// This's a workaround for make DOM modification's happened after
		// 'insertElement' to be included either, e.g. Form-based dialogs' 'commitContents'
		// call.
		setTimeout( function() {
			editor.fire( 'saveSnapshot' );
		}, 0 );
	}

	// 1. Fixes a range which is a result of deleteContents() and is placed in an intermediate element (see dtd.$intermediate),
	// inside a table. A goal is to find a closest <td> or <th> element and when this fails, recreate the structure of the table.
	// 2. Fixes empty cells by appending bogus <br>s or deleting empty text nodes in IE<=8 case.
	fixTableAfterContentsDeletion = ( function() {
		// Creates an element walker which can only "go deeper". It won't
		// move out from any element. Therefore it can be used to find <td>x</td> in cases like:
		// <table><tbody><tr><td>x</td></tr></tbody>^<tfoot>...
		function getFixTableSelectionWalker( testRange ) {
			var walker = new CKEDITOR.dom.walker( testRange );
			walker.guard = function( node, isMovingOut ) {
				if ( isMovingOut )
					return false;
				if ( node.type == CKEDITOR.NODE_ELEMENT )
					return node.is( CKEDITOR.dtd.$tableContent );
			};
			walker.evaluator = function( node ) {
				return node.type == CKEDITOR.NODE_ELEMENT;
			};

			return walker;
		}

		function fixTableStructure( element, newElementName, appendToStart ) {
			var temp = element.getDocument().createElement( newElementName );
			element.append( temp, appendToStart );
			return temp;
		}

		// Fix empty cells. This means:
		// * add bogus <br> if browser needs it
		// * remove empty text nodes on IE8, because it will crash (https://dev.ckeditor.com/ticket/11183#comment:8).
		function fixEmptyCells( cells ) {
			var i = cells.count(),
				cell;

			for ( i; i-- > 0; ) {
				cell = cells.getItem( i );

				if ( !CKEDITOR.tools.trim( cell.getHtml() ) ) {
					cell.appendBogus();
					if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 && cell.getChildCount() )
						cell.getFirst().remove();
				}
			}
		}

		return function( range ) {
			var container = range.startContainer,
				table = container.getAscendant( 'table', 1 ),
				testRange,
				deeperSibling,
				appendToStart = false;

			fixEmptyCells( table.getElementsByTag( 'td' ) );
			fixEmptyCells( table.getElementsByTag( 'th' ) );

			// Look left.
			testRange = range.clone();
			testRange.setStart( container, 0 );
			deeperSibling = getFixTableSelectionWalker( testRange ).lastBackward();

			// If left is empty, look right.
			if ( !deeperSibling ) {
				testRange = range.clone();
				testRange.setEndAt( container, CKEDITOR.POSITION_BEFORE_END );
				deeperSibling = getFixTableSelectionWalker( testRange ).lastForward();
				appendToStart = true;
			}

			// If there's no deeper nested element in both direction - container is empty - we'll use it then.
			if ( !deeperSibling )
				deeperSibling = container;

			// Fix structure...

			// We found a table what means that it's empty - remove it completely.
			if ( deeperSibling.is( 'table' ) ) {
				range.setStartAt( deeperSibling, CKEDITOR.POSITION_BEFORE_START );
				range.collapse( true );
				deeperSibling.remove();
				return;
			}

			// Found an empty txxx element - append tr.
			if ( deeperSibling.is( { tbody: 1, thead: 1, tfoot: 1 } ) )
				deeperSibling = fixTableStructure( deeperSibling, 'tr', appendToStart );

			// Found an empty tr element - append td/th.
			if ( deeperSibling.is( 'tr' ) )
				deeperSibling = fixTableStructure( deeperSibling, deeperSibling.getParent().is( 'thead' ) ? 'th' : 'td', appendToStart );

			// To avoid setting selection after bogus, remove it from the current cell.
			// We can safely do that, because we'll insert element into that cell.
			var bogus = deeperSibling.getBogus();
			if ( bogus )
				bogus.remove();

			range.moveToPosition( deeperSibling, appendToStart ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END );
		};
	} )();

	fixListAfterContentsDelete = ( function() {
		// Creates an element walker which operates only within lists.
		function getFixListSelectionWalker( testRange ) {
			var walker = new CKEDITOR.dom.walker( testRange );
			walker.guard = function( node, isMovingOut ) {
				if ( isMovingOut )
					return false;
				if ( node.type == CKEDITOR.NODE_ELEMENT )
					return node.is( CKEDITOR.dtd.$list ) || node.is( CKEDITOR.dtd.$listItem );
			};
			walker.evaluator = function( node ) {
				return node.type == CKEDITOR.NODE_ELEMENT && node.is( CKEDITOR.dtd.$listItem );
			};

			return walker;
		}

		return function( range ) {
			var container = range.startContainer,
				appendToStart = false,
				testRange,
				deeperSibling;

			// Look left.
			testRange = range.clone();
			testRange.setStart( container, 0 );
			deeperSibling = getFixListSelectionWalker( testRange ).lastBackward();

			// If left is empty, look right.
			if ( !deeperSibling ) {
				testRange = range.clone();
				testRange.setEndAt( container, CKEDITOR.POSITION_BEFORE_END );
				deeperSibling = getFixListSelectionWalker( testRange ).lastForward();
				appendToStart = true;
			}

			// If there's no deeper nested element in both direction - container is empty - we'll use it then.
			if ( !deeperSibling )
				deeperSibling = container;

			// We found a list what means that it's empty - remove it completely.
			if ( deeperSibling.is( CKEDITOR.dtd.$list ) ) {
				range.setStartAt( deeperSibling, CKEDITOR.POSITION_BEFORE_START );
				range.collapse( true );
				deeperSibling.remove();
				return;
			}

			// To avoid setting selection after bogus, remove it from the target list item.
			// We can safely do that, because we'll insert element into that cell.
			var bogus = deeperSibling.getBogus();
			if ( bogus )
				bogus.remove();

			range.moveToPosition( deeperSibling, appendToStart ? CKEDITOR.POSITION_AFTER_START : CKEDITOR.POSITION_BEFORE_END );
			range.select();
		};
	} )();

	function mergeBlocksCollapsedSelection( editor, range, backspace, startPath ) {
		var startBlock = startPath.block;

		// Selection must be collapsed and to be anchored in a block.
		if ( !startBlock )
			return false;

		// Exclude cases where, i.e. if pressed arrow key, selection
		// would move within the same block (merge inside a block).
		if ( !range[ backspace ? 'checkStartOfBlock' : 'checkEndOfBlock' ]() )
			return false;

		// Make sure, there's an editable position to put selection,
		// which i.e. would be used if pressed arrow key, but abort
		// if such position exists but means a selected non-editable element.
		if ( !range.moveToClosestEditablePosition( startBlock, !backspace ) || !range.collapsed )
			return false;

		// Handle special case, when block's sibling is a <hr>. Delete it and keep selection
		// in the same place (https://dev.ckeditor.com/ticket/11861#comment:9).
		if ( range.startContainer.type == CKEDITOR.NODE_ELEMENT ) {
			var touched = range.startContainer.getChild( range.startOffset - ( backspace ? 1 : 0 ) );
			if ( touched && touched.type  == CKEDITOR.NODE_ELEMENT && touched.is( 'hr' ) ) {
				editor.fire( 'saveSnapshot' );
				touched.remove();
				return true;
			}
		}

		var siblingBlock = range.startPath().block;

		// Abort if an editable position exists, but either it's not
		// in a block or that block is the parent of the start block
		// (merging child into parent).
		if ( !siblingBlock || ( siblingBlock && siblingBlock.contains( startBlock ) ) )
			return;

		editor.fire( 'saveSnapshot' );

		// Remove bogus to avoid duplicated boguses.
		var bogus;
		if ( ( bogus = ( backspace ? siblingBlock : startBlock ).getBogus() ) )
			bogus.remove();

		// Save selection. It will be restored.
		var selection = editor.getSelection(),
			bookmarks = selection.createBookmarks();

		// Merge blocks.
		( backspace ? startBlock : siblingBlock ).moveChildren( backspace ? siblingBlock : startBlock, false );

		// Also merge children along with parents.
		startPath.lastElement.mergeSiblings();

		// Cut off removable branch of the DOM tree.
		pruneEmptyDisjointAncestors( startBlock, siblingBlock, !backspace );

		// Restore selection.
		selection.selectBookmarks( bookmarks );

		return true;
	}

	function mergeBlocksNonCollapsedSelection( editor, range, startPath ) {
		var startBlock = startPath.block,
			endPath = range.endPath(),
			endBlock = endPath.block;

		// Selection must be anchored in two different blocks.
		if ( !startBlock || !endBlock || startBlock.equals( endBlock ) )
			return false;

		editor.fire( 'saveSnapshot' );

		// Remove bogus to avoid duplicated boguses.
		var bogus;
		if ( ( bogus = startBlock.getBogus() ) )
			bogus.remove();

		// Changing end container to element from text node (https://dev.ckeditor.com/ticket/12503).
		range.enlarge( CKEDITOR.ENLARGE_INLINE );

		// Delete range contents. Do NOT merge. Merging is weird.
		range.deleteContents();

		// If something has left of the block to be merged, clean it up.
		// It may happen when merging with list items.
		if ( endBlock.getParent() ) {
			// Move children to the first block.
			endBlock.moveChildren( startBlock, false );

			// ...and merge them if that's possible.
			startPath.lastElement.mergeSiblings();

			// If expanded selection, things are always merged like with BACKSPACE.
			pruneEmptyDisjointAncestors( startBlock, endBlock, true );
		}

		// Make sure the result selection is collapsed.
		range = editor.getSelection().getRanges()[ 0 ];
		range.collapse( 1 );

		// Optimizing range containers from text nodes to elements (https://dev.ckeditor.com/ticket/12503).
		range.optimize();
		if ( range.startContainer.getHtml() === '' ) {
			range.startContainer.appendBogus();
		}

		range.select();

		return true;
	}

	// Finds the innermost child of common parent, which,
	// if removed, removes nothing but the contents of the element.
	//
	//	before: <div><p><strong>first</strong></p><p>second</p></div>
	//	after:  <div><p>second</p></div>
	//
	//	before: <div><p>x<strong>first</strong></p><p>second</p></div>
	//	after:  <div><p>x</p><p>second</p></div>
	//
	//	isPruneToEnd=true
	//	before: <div><p><strong>first</strong></p><p>second</p></div>
	//	after:  <div><p><strong>first</strong></p></div>
	//
	// @param {CKEDITOR.dom.element} first
	// @param {CKEDITOR.dom.element} second
	// @param {Boolean} isPruneToEnd
	function pruneEmptyDisjointAncestors( first, second, isPruneToEnd ) {
		var commonParent = first.getCommonAncestor( second ),
			node = isPruneToEnd ? second : first,
			removableParent = node;

		while ( ( node = node.getParent() ) && !commonParent.equals( node ) && node.getChildCount() == 1 )
			removableParent = node;

		removableParent.remove();
	}

	//
	// Helpers for editable.getHtmlFromRange.
	//
	getHtmlFromRangeHelpers = {
		eol: {
			detect: function( that, editable ) {
				var range = that.range,
					rangeStart = range.clone(),
					rangeEnd = range.clone(),

					startPath = new CKEDITOR.dom.elementPath( range.startContainer, editable ),
					endPath = new CKEDITOR.dom.elementPath( range.endContainer, editable );

				// Note: checkBoundaryOfElement will not work on original range as CKEDITOR.START|END
				// means that range start|end must be literally anchored at block start|end, e.g.
				//
				// 		<p>a{</p><p>}b</p>
				//
				// will return false for both paragraphs but two similar ranges
				//
				// 		<p>a{}</p><p>{}b</p>
				//
				// will return true if checked separately.
				rangeStart.collapse( 1 );
				rangeEnd.collapse();

				if ( startPath.block && rangeStart.checkBoundaryOfElement( startPath.block, CKEDITOR.END ) ) {
					range.setStartAfter( startPath.block );
					that.prependEolBr = 1;
				}

				if ( endPath.block && rangeEnd.checkBoundaryOfElement( endPath.block, CKEDITOR.START ) ) {
					range.setEndBefore( endPath.block );
					that.appendEolBr = 1;
				}
			},

			fix: function( that, editable ) {
				var doc = editable.getDocument(),
					appended;

				// Append <br data-cke-eol="1"> to the fragment.
				if ( that.appendEolBr ) {
					appended = this.createEolBr( doc );
					that.fragment.append( appended );
				}

				// Prepend <br data-cke-eol="1"> to the fragment but avoid duplicates. Such
				// elements should never follow each other in DOM.
				if ( that.prependEolBr && ( !appended || appended.getPrevious() ) ) {
					that.fragment.append( this.createEolBr( doc ), 1 );
				}
			},

			createEolBr: function( doc ) {
				return doc.createElement( 'br', {
					attributes: {
						'data-cke-eol': 1
					}
				} );
			}
		},

		bogus: {
			exclude: function( that ) {
				var boundaryNodes = that.range.getBoundaryNodes(),
					startNode = boundaryNodes.startNode,
					endNode = boundaryNodes.endNode;

				// If bogus is the last node in range but not the only node, exclude it.
				if ( endNode && isBogus( endNode ) && ( !startNode || !startNode.equals( endNode ) ) )
					that.range.setEndBefore( endNode );
			}
		},

		tree: {
			rebuild: function( that, editable ) {
				var range = that.range,
					node = range.getCommonAncestor(),

					// A path relative to the common ancestor.
					commonPath = new CKEDITOR.dom.elementPath( node, editable ),
					startPath = new CKEDITOR.dom.elementPath( range.startContainer, editable ),
					endPath = new CKEDITOR.dom.elementPath( range.endContainer, editable ),
					limit;

				if ( node.type == CKEDITOR.NODE_TEXT )
					node = node.getParent();

				// Fix DOM of partially enclosed tables
				// 		<table><tbody><tr><td>a{b</td><td>c}d</td></tr></tbody></table>
				// Full table is returned
				// 		<table><tbody><tr><td>b</td><td>c</td></tr></tbody></table>
				// instead of
				// 		<td>b</td><td>c</td>
				if ( commonPath.blockLimit.is( { tr: 1, table: 1 } ) ) {
					var tableParent = commonPath.contains( 'table' ).getParent();

					limit = function( node ) {
						return !node.equals( tableParent );
					};
				}

				// Fix DOM in the following case
				// 		<ol><li>a{b<ul><li>c}d</li></ul></li></ol>
				// Full list is returned
				// 		<ol><li>b<ul><li>c</li></ul></li></ol>
				// instead of
				// 		b<ul><li>c</li></ul>
				else if ( commonPath.block && commonPath.block.is( CKEDITOR.dtd.$listItem ) ) {
					var startList = startPath.contains( CKEDITOR.dtd.$list ),
						endList = endPath.contains( CKEDITOR.dtd.$list );

					if ( !startList.equals( endList ) ) {
						var listParent = commonPath.contains( CKEDITOR.dtd.$list ).getParent();

						limit = function( node ) {
							return !node.equals( listParent );
						};
					}
				}

				// If not defined, use generic limit function.
				if ( !limit ) {
					limit = function( node ) {
						return !node.equals( commonPath.block ) && !node.equals( commonPath.blockLimit );
					};
				}

				this.rebuildFragment( that, editable, node, limit );
			},

			rebuildFragment: function( that, editable, node, checkLimit ) {
				var clone;

				while ( node && !node.equals( editable ) && checkLimit( node ) ) {
					// Don't clone children. Preserve element ids.
					clone = node.clone( 0, 1 );
					that.fragment.appendTo( clone );
					that.fragment = clone;

					node = node.getParent();
				}
			}
		},

		cell: {
			// Handle range anchored in table row with a single cell enclosed:
			// 		<table><tbody><tr>[<td>a</td>]</tr></tbody></table>
			// becomes
			// 		<table><tbody><tr><td>{a}</td></tr></tbody></table>
			shrink: function( that ) {
				var range = that.range,
					startContainer = range.startContainer,
					endContainer = range.endContainer,
					startOffset = range.startOffset,
					endOffset = range.endOffset;

				if ( startContainer.type == CKEDITOR.NODE_ELEMENT && startContainer.equals( endContainer ) && startContainer.is( 'tr' ) && ++startOffset == endOffset ) {
					range.shrink( CKEDITOR.SHRINK_TEXT );
				}
			}
		}
	};

	//
	// Helpers for editable.extractHtmlFromRange.
	//
	extractHtmlFromRangeHelpers = ( function() {
		function optimizeBookmarkNode( node, toStart ) {
			var parent = node.getParent();

			if ( parent.is( CKEDITOR.dtd.$inline ) )
				node[ toStart ? 'insertBefore' : 'insertAfter' ]( parent );
		}

		function mergeElements( merged, startBookmark, endBookmark ) {
			optimizeBookmarkNode( startBookmark );
			optimizeBookmarkNode( endBookmark, 1 );

			var next;
			while ( ( next = endBookmark.getNext() ) ) {
				next.insertAfter( startBookmark );

				// Update startBookmark after insertion to avoid the reversal of nodes (https://dev.ckeditor.com/ticket/13449).
				startBookmark = next;
			}

			if ( isEmpty( merged ) )
				merged.remove();
		}

		function getPath( startElement, root ) {
			return new CKEDITOR.dom.elementPath( startElement, root );
		}

		// Creates a range from a bookmark without removing the bookmark.
		function createRangeFromBookmark( root, bookmark ) {
			var range = new CKEDITOR.dom.range( root );
			range.setStartAfter( bookmark.startNode );
			range.setEndBefore( bookmark.endNode );
			return range;
		}

		var list = {
			detectMerge: function( that, editable ) {
				var range = createRangeFromBookmark( editable, that.bookmark ),
					startPath = range.startPath(),
					endPath = range.endPath(),

					startList = startPath.contains( CKEDITOR.dtd.$list ),
					endList = endPath.contains( CKEDITOR.dtd.$list );

				that.mergeList =
					// Both lists must exist
					startList && endList &&
					// ...and be of the same type
					// startList.getName() == endList.getName() &&
					// ...and share the same parent (same level in the tree)
					startList.getParent().equals( endList.getParent() ) &&
					// ...and must be different.
					!startList.equals( endList );

				that.mergeListItems =
					startPath.block && endPath.block &&
					// Both containers must be list items
					startPath.block.is( CKEDITOR.dtd.$listItem ) && endPath.block.is( CKEDITOR.dtd.$listItem );

				// Create merge bookmark.
				if ( that.mergeList || that.mergeListItems ) {
					var rangeClone = range.clone();

					rangeClone.setStartBefore( that.bookmark.startNode );
					rangeClone.setEndAfter( that.bookmark.endNode );

					that.mergeListBookmark = rangeClone.createBookmark();
				}
			},

			merge: function( that, editable ) {
				if ( !that.mergeListBookmark )
					return;

				var startNode = that.mergeListBookmark.startNode,
					endNode = that.mergeListBookmark.endNode,

					startPath = getPath( startNode, editable ),
					endPath = getPath( endNode, editable );

				if ( that.mergeList ) {
					var firstList = startPath.contains( CKEDITOR.dtd.$list ),
						secondList = endPath.contains( CKEDITOR.dtd.$list );

					if ( !firstList.equals( secondList ) ) {
						secondList.moveChildren( firstList );
						secondList.remove();
					}
				}

				if ( that.mergeListItems ) {
					var firstListItem = startPath.contains( CKEDITOR.dtd.$listItem ),
						secondListItem = endPath.contains( CKEDITOR.dtd.$listItem );

					if ( !firstListItem.equals( secondListItem ) ) {
						mergeElements( secondListItem, startNode, endNode );
					}
				}

				// Remove bookmark nodes.
				startNode.remove();
				endNode.remove();
			}
		};

		var block = {
			// Detects whether blocks should be merged once contents are extracted.
			detectMerge: function( that, editable ) {
				// Don't merge blocks if lists or tables are already involved.
				if ( that.tableContentsRanges || that.mergeListBookmark )
					return;

				var rangeClone = new CKEDITOR.dom.range( editable );

				rangeClone.setStartBefore( that.bookmark.startNode );
				rangeClone.setEndAfter( that.bookmark.endNode );

				that.mergeBlockBookmark = rangeClone.createBookmark();
			},

			merge: function( that, editable ) {
				if ( !that.mergeBlockBookmark || that.purgeTableBookmark )
					return;

				var startNode = that.mergeBlockBookmark.startNode,
					endNode = that.mergeBlockBookmark.endNode,

					startPath = getPath( startNode, editable ),
					endPath = getPath( endNode, editable ),

					firstBlock = startPath.block,
					secondBlock = endPath.block;

				if ( firstBlock && secondBlock && !firstBlock.equals( secondBlock ) ) {
					mergeElements( secondBlock, startNode, endNode );
				}

				// Remove bookmark nodes.
				startNode.remove();
				endNode.remove();
			}
		};

		var table = ( function() {
			var tableEditable = { td: 1, th: 1, caption: 1 };

			// Returns an array of ranges which should be entirely extracted.
			//
			// <table><tr>[<td>xx</td><td>y}y</td></tr></table>
			// will find:
			// <table><tr><td>[xx]</td><td>[y}y</td></tr></table>
			function findTableContentsRanges( range ) {
				// Leaving the below for debugging purposes.
				//
				// console.log( 'findTableContentsRanges' );
				// console.log( bender.tools.range.getWithHtml( range.root, range ) );

				var contentsRanges = [],
					editableRange,
					walker = new CKEDITOR.dom.walker( range ),
					startCell = range.startPath().contains( tableEditable ),
					endCell = range.endPath().contains( tableEditable ),
					database = {};

				walker.guard = function( node, leaving ) {
					// Guard may be executed on some node boundaries multiple times,
					// what results in creating more than one range for each selected cell. (https://dev.ckeditor.com/ticket/12964)
					if ( node.type == CKEDITOR.NODE_ELEMENT ) {
						var key = 'visited_' + ( leaving ? 'out' : 'in' );
						if ( node.getCustomData( key ) ) {
							return;
						}

						CKEDITOR.dom.element.setMarker( database, node, key, 1 );
					}

					// Handle partial selection in a cell in which the range starts:
					// <td><p>x{xx</p></td>...
					// will store:
					// <td><p>x{xx</p>]</td>
					if ( leaving && startCell && node.equals( startCell ) ) {
						editableRange = range.clone();
						editableRange.setEndAt( startCell, CKEDITOR.POSITION_BEFORE_END );
						contentsRanges.push( editableRange );
						return;
					}

					// Handle partial selection in a cell in which the range ends.
					if ( !leaving && endCell && node.equals( endCell ) ) {
						editableRange = range.clone();
						editableRange.setStartAt( endCell, CKEDITOR.POSITION_AFTER_START );
						contentsRanges.push( editableRange );
						return;
					}

					// Handle all other cells visited by the walker.
					// We need to check whether the cell is disjoint with
					// the start and end cells to correctly handle case like:
					// <td>x{x</td><td><table>..<td>y}y</td>..</table></td>
					// without the check the second cell's content would be entirely removed.
					// We also handle all nested cells (#787).
					if ( ( !leaving && checkRemoveCellContents( node ) ) ||
						( leaving && checkNested( node ) ) ) {
						editableRange = range.clone();
						editableRange.selectNodeContents( node );
						contentsRanges.push( editableRange );
					}
				};

				walker.lastForward();

				// Clear all markers so next extraction will not be affected by this one.
				CKEDITOR.dom.element.clearAllMarkers( database );

				return contentsRanges;

				// #787
				function checkNested( node ) {
					// Check only table cells, not every node inside table.
					if ( !node.is( tableEditable ) ) {
						return;
					}

					var startTable = startCell && startCell.getAscendant( 'table', true ),
						endTable = endCell && endCell.getAscendant( 'table', true ),
						nodeTable = node.getAscendant( 'table', true );

					return ( startTable && startTable.contains( nodeTable ) ) ||
						( endTable && endTable.contains( nodeTable ) );
				}

				function checkRemoveCellContents( node ) {
					return (
						// Must be a cell.
						node.type == CKEDITOR.NODE_ELEMENT && node.is( tableEditable ) &&
						// Must be disjoint with the range's startCell if exists.
						( !startCell || checkDisjointNodes( node, startCell ) ) &&
						// Must be disjoint with the range's endCell if exists.
						( !endCell || checkDisjointNodes( node, endCell ) )
					);
				}
			}

			// Returns a normalized common ancestor of a range.
			// If the real common ancestor is located somewhere in between a table and a td/th/caption,
			// then the table will be returned.
			function getNormalizedAncestor( range ) {
				var common = range.getCommonAncestor();

				if ( common.is( CKEDITOR.dtd.$tableContent ) && !common.is( tableEditable ) ) {
					common = common.getAscendant( 'table', true );
				}

				return common;
			}

			// Check whether node1 and node2 are disjoint, so are:
			// * not identical,
			// * not contained in each other.
			function checkDisjointNodes( node1, node2 ) {
				var disallowedPositions = CKEDITOR.POSITION_CONTAINS + CKEDITOR.POSITION_IS_CONTAINED,
					pos = node1.getPosition( node2 );

				// Baaah... IDENTICAL is 0, so we can't simplify this ;/.
				return pos === CKEDITOR.POSITION_IDENTICAL ?
					false :
					( ( pos & disallowedPositions ) === 0 );
			}

			return {
				// Detects whether to purge entire list.
				detectPurge: function( that ) {
					var range = that.range,
						walkerRange = range.clone();

					walkerRange.enlarge( CKEDITOR.ENLARGE_ELEMENT );

					var walker = new CKEDITOR.dom.walker( walkerRange ),
						editablesCount = 0;

					// Count the number of table editables in the range. If there's more than one,
					// table MAY be removed completely (it's a cross-cell range). Otherwise, only
					// the contents of the cell are usually removed.
					walker.evaluator = function( node ) {
						if ( node.type == CKEDITOR.NODE_ELEMENT && node.is( tableEditable ) ) {
							++editablesCount;
						}
					};

					walker.checkForward();

					if ( editablesCount > 1 ) {
						var startTable = range.startPath().contains( 'table' ),
							endTable = range.endPath().contains( 'table' );

						if ( startTable && endTable && range.checkBoundaryOfElement( startTable, CKEDITOR.START ) && range.checkBoundaryOfElement( endTable, CKEDITOR.END ) ) {
							var rangeClone = that.range.clone();

							rangeClone.setStartBefore( startTable );
							rangeClone.setEndAfter( endTable );

							that.purgeTableBookmark = rangeClone.createBookmark();
						}
					}
				},

				// The magic.
				//
				// This method tries to discover whether the range starts or ends somewhere in a table
				// (it is not interested whether the range contains a table, because in such case
				// the extractContents() methods does the job correctly).
				// If the range meets these criteria, then the method tries to discover and store the following:
				//
				// * that.tableSurroundingRange - a part of the range which is located outside of any table which
				// will be touched (note: when range is located in a single cell it does not touch the table).
				// This range can be placed at:
				//		* at the beginning: <p>he{re</p><table>..]..</table>
				//		* in the middle: <table>..[..</table><p>here</p><table>..]..</table>
				//		* at the end: <table>..[..</table><p>he}re</p>
				// * that.tableContentsRanges - an array of ranges with contents of td/th/caption that should be removed.
				// This assures that calling extractContents() does not change the structure of the table(s).
				detectRanges: function( that, editable ) {
					var range = createRangeFromBookmark( editable, that.bookmark ),
						surroundingRange = range.clone(),
						leftRange,
						rightRange,

						// Find a common ancestor and normalize it (so the following paths contain tables).
						commonAncestor = getNormalizedAncestor( range ),

						// Create paths using the normalized ancestor, so tables beyond the context
						// of the input range are not found.
						startPath = new CKEDITOR.dom.elementPath( range.startContainer, commonAncestor ),
						endPath = new CKEDITOR.dom.elementPath( range.endContainer, commonAncestor ),

						startTable = startPath.contains( 'table' ),
						endTable = endPath.contains( 'table' ),

						tableContentsRanges;

					// Nothing to do here - the range doesn't touch any table or
					// it contains a table, but that table is fully selected so it will be simply fully removed
					// by the normal algorithm.
					if ( !startTable && !endTable ) {
						return;
					}

					// Handle two disjoint tables case:
					// <table>..[..</table><p>ab</p><table>..]..</table>
					// is handled as (respectively: findTableContents( left ), surroundingRange, findTableContents( right )):
					// <table>..[..</table>][<p>ab</p>][<table>..]..</table>
					// Check that tables are disjoint to exclude a case when start equals end or one is contained
					// in the other.
					if ( startTable && endTable && checkDisjointNodes( startTable, endTable ) ) {
						that.tableSurroundingRange = surroundingRange;
						surroundingRange.setStartAt( startTable, CKEDITOR.POSITION_AFTER_END );
						surroundingRange.setEndAt( endTable, CKEDITOR.POSITION_BEFORE_START );

						leftRange = range.clone();
						leftRange.setEndAt( startTable, CKEDITOR.POSITION_AFTER_END );

						rightRange = range.clone();
						rightRange.setStartAt( endTable, CKEDITOR.POSITION_BEFORE_START );

						tableContentsRanges = findTableContentsRanges( leftRange ).concat( findTableContentsRanges( rightRange ) );
					}
					// Divide the initial range into two parts:
					// * range which contains the part containing the table,
					// * surroundingRange which contains the part outside the table.
					//
					// The surroundingRange exists only if one of the range ends is
					// located outside the table.
					//
					// <p>a{b</p><table>..]..</table><p>cd</p>
					// becomes (respectively: surroundingRange, range):
					// <p>a{b</p>][<table>..]..</table><p>cd</p>
					else if ( !startTable ) {
						that.tableSurroundingRange = surroundingRange;
						surroundingRange.setEndAt( endTable, CKEDITOR.POSITION_BEFORE_START );

						range.setStartAt( endTable, CKEDITOR.POSITION_AFTER_START );
					}
					// <p>ab</p><table>..[..</table><p>c}d</p>
					// becomes (respectively range, surroundingRange):
					// <p>ab</p><table>..[..</table>][<p>c}d</p>
					else if ( !endTable ) {
						that.tableSurroundingRange = surroundingRange;
						surroundingRange.setStartAt( startTable, CKEDITOR.POSITION_AFTER_END );

						range.setEndAt( startTable, CKEDITOR.POSITION_AFTER_END );
					}

					// Use already calculated or calculate for the remaining range.
					that.tableContentsRanges = tableContentsRanges ? tableContentsRanges : findTableContentsRanges( range );

					// Leaving the below for debugging purposes.
					//
					// if ( that.tableSurroundingRange ) {
					// 	console.log( 'tableSurroundingRange' );
					// 	console.log( bender.tools.range.getWithHtml( that.tableSurroundingRange.root, that.tableSurroundingRange ) );
					// }
					//
					// console.log( 'tableContentsRanges' );
					// that.tableContentsRanges.forEach( function( range ) {
					// 	console.log( bender.tools.range.getWithHtml( range.root, range ) );
					// } );
				},

				deleteRanges: function( that ) {
					var range;

					// Delete table cell contents.
					while ( ( range = that.tableContentsRanges.pop() ) ) {
						range.extractContents();

						if ( isEmpty( range.startContainer ) )
							range.startContainer.appendBogus();
					}

					// Finally delete surroundings of the table.
					if ( that.tableSurroundingRange ) {
						that.tableSurroundingRange.extractContents();
					}
				},

				purge: function( that ) {
					if ( !that.purgeTableBookmark )
						return;

					var doc = that.doc,
						range = that.range,
						rangeClone = range.clone(),
						// How about different enter modes?
						block = doc.createElement( 'p' );

					block.insertBefore( that.purgeTableBookmark.startNode );

					rangeClone.moveToBookmark( that.purgeTableBookmark );
					rangeClone.deleteContents();

					that.range.moveToPosition( block, CKEDITOR.POSITION_AFTER_START );
				}
			};
		} )();

		return {
			list: list,
			block: block,
			table: table,

			// Detects whether use "mergeThen" argument in range.extractContents().
			detectExtractMerge: function( that ) {
				// Don't merge if playing with lists.
				return !(
					that.range.startPath().contains( CKEDITOR.dtd.$listItem ) &&
					that.range.endPath().contains( CKEDITOR.dtd.$listItem )
				);
			},

			fixUneditableRangePosition: function( range ) {
				if ( !range.startContainer.getDtd()[ '#' ] ) {
					range.moveToClosestEditablePosition( null, true );
				}
			},

			// Perform auto paragraphing if needed.
			autoParagraph: function( editor, range ) {
				var path = range.startPath(),
					fixBlock;

				if ( shouldAutoParagraph( editor, path.block, path.blockLimit ) && ( fixBlock = autoParagraphTag( editor ) ) ) {
					fixBlock = range.document.createElement( fixBlock );
					fixBlock.appendBogus();
					range.insertNode( fixBlock );
					range.moveToPosition( fixBlock, CKEDITOR.POSITION_AFTER_START );
				}
			}
		};
	} )();

} )();

/**
 * Whether the editor must output an empty value (`''`) if its content only consists
 * of an empty paragraph.
 *
 *		config.ignoreEmptyParagraph = false;
 *
 * @cfg {Boolean} [ignoreEmptyParagraph=true]
 * @member CKEDITOR.config
 */

/**
 * Event fired by the editor in order to get accessibility help label.
 * The event is responded to by a component which provides accessibility
 * help (i.e. the `a11yhelp` plugin) hence the editor is notified whether
 * accessibility help is available.
 *
 * Providing info:
 *
 *		editor.on( 'ariaEditorHelpLabel', function( evt ) {
 *				evt.data.label = editor.lang.common.editorHelp;
 *		} );
 *
 * Getting label:
 *
 *		var helpLabel = editor.fire( 'ariaEditorHelpLabel', {} ).label;
 *
 * @since 4.4.3
 * @event ariaEditorHelpLabel
 * @param {String} label The label to be used.
 * @member CKEDITOR.editor
 */

/**
 * Event fired when the user double-clicks in the editable area.
 * The event allows to open a dialog window for a clicked element in a convenient way:
 *
 *		editor.on( 'doubleclick', function( evt ) {
 *			var element = evt.data.element;
 *
 *			if ( element.is( 'table' ) )
 *				evt.data.dialog = 'tableProperties';
 *		} );
 *
 * **Note:** To handle double-click on a widget use {@link CKEDITOR.plugins.widget#doubleclick}.
 *
 * @event doubleclick
 * @param data
 * @param {CKEDITOR.dom.element} data.element The double-clicked element.
 * @param {String} data.dialog The dialog window to be opened. If set by the listener,
 * the specified dialog window will be opened.
 * @member CKEDITOR.editor
 */
