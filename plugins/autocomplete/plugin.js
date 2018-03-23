/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

( function() {

	// This flag prevents appending stylesheet more than once.
	var stylesLoaded = false;

	CKEDITOR.plugins.add( 'autocomplete', {
		requires: 'textwatcher,caretposition',
		init: function() {
			if ( !stylesLoaded ) {
				CKEDITOR.document.appendStyleSheet( this.path + 'skins/' + CKEDITOR.skin.name + '/autocomplete.css' );
				stylesLoaded = true;
			}
		}
	} );

	/**
	 * The main class implementing a generic autocomplete feature in the editor.
	 * It is a controller which works with {@link CKEDITOR.plugins.autocomplete.model model} and
	 * {@link CKEDITOR.plugins.autocomplete.view view} classes.
	 *
	 * In order to initialize the autocomplete feature it is enough to instantiate this class with
	 * two important callbacks:
	 *
	 * * A text test callback &ndash; a function which should return a fragment of text (typed in the editor) that
	 * should be autocompleted (best to use the {@link CKEDITOR.plugins.textMatch#match} function).
	 * * A data callback &ndash; a function which should return (through its callback) a suggestion data for the current
	 * query string.
	 *
	 * ## Creating an autocomplete instance
	 *
	 * Depending on your use case, put this code in the {@link CKEDITOR.pluginDefinition#init} callback of your
	 * plugin or for example in the {@link CKEDITOR.editor#instanceReady} event listener.
	 *
	 * ```javascript
	 *	// Called when the user types in the editor or moves the caret.
	 *	// The range represents the caret position.
	 *	function textTestCallback( range ) {
	 *		// We don't want to autocomplete a non-empty selection.
	 *		if ( !range.collapsed ) {
	 *			return null;
	 *		}
	 *
	 *		// Use the textmatch plugin which does the tricky job of doing
	 *		// a text search in the DOM. The matchCallback function should return
	 *		// a matching fragment of the text.
	 *		return CKEDITOR.plugins.textMatch.match( range, matchCallback );
	 *	}
	 *
	 *	// Returns a position of the matching text.
	 *	// It matches with text starting from the '@' character
	 *	// followed by spaces, up to the caret position.
	 *	function matchCallback( text, offset ) {
	 *			// Get the text before the caret.
	 *		var left = text.slice( 0, offset ),
	 *			// Will look for an '@' character followed by word characters.
	 *			match = left.match( /@\w*$/ );
	 *
	 *		if ( !match ) {
	 *			return null;
	 *		}
	 *		return { start: match.index, end: offset };
	 *	}
	 *
	 *	// Returns (through its callback) the suggestions for the current query.
	 *	// Note: the itemsArray variable is our example "database".
	 *	function dataCallback( query, range, callback ) {
	 *		// Simple search.
	 *		// Filter the entire items array so only the items that start
	 *		// with the query remain.
	 *		var suggestions = itemsArray.filter( function( item ) {
	 *			return item.name.indexOf( query ) === 0;
	 *		} );
	 *
	 *		// Note - the callback function can also be executed asynchronously
	 *		// so dataCallback can do an XHR requests or use any other asynchronous API.
	 *		callback( suggestions );
	 *	}
	 *
	 *	// Finally, instantiate the autocomplete class.
	 *	new CKEDITOR.plugins.autocomplete( editor, textTestCallback, dataCallback );
	 * ```
	 *
	 * ## Changing the behavior of the autocomplete class by subclassing it
	 *
	 * This plugin will expose a `CKEDITOR.plugins.customAutocomplete` class which uses
	 * a custom view that positions the panel relative to the {@link CKEDITOR.editor#container}.
	 *
	 * ```javascript
	 *	CKEDITOR.plugins.add( 'customautocomplete', {
	 *		requires: 'autocomplete',
	 *
	 *		onLoad: function() {
	 *			var View = CKEDITOR.plugins.autocomplete.view,
	 *				Autocomplete = CKEDITOR.plugins.autocomplete;
	 *
	 *			function CustomView( editor ) {
	 *				// Call the parent class constructor.
	 *				View.call( this, editor );
	 *			}
	 *			// Inherit the view methods.
	 *			CustomView.prototype = CKEDITOR.tools.prototypedCopy( View.prototype );
	 *
	 *			// Change the positioning of the panel, so it is stretched
	 *			// to 100% of the editor container width and is positioned
	 *			// relative to the editor container.
	 *			CustomView.prototype.updatePosition = function() {
	 *				var caretRect = this.getCaretRect(),
	 *					container = this.editor.container;
	 *
	 *				this.setPosition( {
	 *					// Position the panel relative to the editor container.
	 *					left: container.$.offsetLeft,
	 *					top: caretRect.top,
	 *					bottom: caretRect.bottom
	 *				} );
	 *				// Stretch the panel to 100% of the editor container width.
	 *				this.element.setStyle( 'width', container.getSize( 'width' ) + 'px' );
	 *			};
	 *
	 *			function CustomAutocomplete( editor, textTestCallback, dataCallback ) {
	 *				// Call the parent class constructor.
	 *				Autocomplete.call( this, editor, textTestCallback, dataCallback );
	 *			}
	 *			// Inherit the autocomplete methods.
	 *			CustomAutocomplete.prototype = CKEDITOR.tools.prototypedCopy( Autocomplete.prototype );
	 *
	 *			CustomAutocomplete.prototype.getView = function() {
	 *				return new CustomView( this.editor );
	 *			}
	 *
	 *			// Expose the custom autocomplete so it can be used later.
	 *			CKEDITOR.plugins.customAutocomplete = CustomAutocomplete;
	 *		}
	 *	} );
	 * ```
	 *
	 * @class CKEDITOR.plugins.autocomplete
	 * @since 4.10.0
	 * @constructor Creates the new instance of autocomplete and attaches it to the editor.
	 * @param {CKEDITOR.editor} editor The editor to watch.
	 * @param {Function} textTestCallback Callback executed to check if a text next to the selection should open
	 * the autocomplete. See the {@link CKEDITOR.plugins.textWatcher}'s `callback` argument.
	 * @param {Function} dataCallback Callback executed to get suggestion data based on search query. The returned data will be
	 * displayed in the autocomplete view.
	 * @param {String} dataCallback.query The query string that was accepted by the `textTestCallback`.
	 * @param {CKEDITOR.dom.range} dataCallback.range The range in the DOM where the query text is.
	 * @param {Function} dataCallback.callback The callback which should be executed with the data.
	 * @param {CKEDITOR.plugins.autocomplete.model.item[]} dataCallback.callback.data The suggestion data that should be
	 * displayed in the autocomplete view for a given query. The data items should implement the
	 * {@link CKEDITOR.plugins.autocomplete.model.item} interface.
	 */
	function Autocomplete( editor, textTestCallback, dataCallback ) {
		var configKeystroke = editor.config.autocomplete_commitKeystroke || CKEDITOR.config.autocomplete_commitKeystroke;

		/**
		 * The editor instance to which this autocomplete is attached (meaning &mdash; on which it listens).
		 *
		 * @readonly
		 * @property {CKEDITOR.editor}
		 */
		this.editor = editor;

		/**
		 * The autocomplete view instance.
		 *
		 * @readonly
		 * @property {CKEDITOR.plugins.autocomplete.view}
		 */
		this.view = this.getView();

		/**
		 * The autocomplete model instance.
		 *
		 * @readonly
		 * @property {CKEDITOR.plugins.autocomplete.model}
		 */
		this.model = this.getModel( dataCallback );

		/**
		 * The autocomplete text watcher instance.
		 *
		 * @readonly
		 * @property {CKEDITOR.plugins.textWatcher}
		 */
		this.textWatcher = this.getTextWatcher( textTestCallback );

		/**
		 * The autocomplete keystrokes used to finish autocompletion with selected view item.
		 * The property is using {@link CKEDITOR.config#autocomplete_commitKeystroke} configuration option as default keystrokes.
		 * You can change this property to set individual keystrokes for plugin instance.
		 *
		 * @property {Number[]}
		 */
		this.commitKeystroke = CKEDITOR.tools.array.isArray( configKeystroke ) ? configKeystroke.slice() : [ configKeystroke ];

		/**
		 * Listeners registered by this autocomplete instance.
		 *
		 * @private
		 */
		this._listeners = [];

		this.attach();
	}

	Autocomplete.prototype = {
		/**
		 * Attaches the autocomplete to the {@link #editor}.
		 *
		 * * The view is appended to the DOM and the listeners are attached.
		 * * The {@link #textWatcher text watcher} is attached to the editor.
		 * * The listeners on the {@link #model} and {@link #view} events are added.
		 * * The listeners on the DOM events are added.
		 */
		attach: function() {
			var editor = this.editor,
				win = CKEDITOR.document.getWindow(),
				editorDocument = editor.editable().getDocument();

			this.view.append();
			this.view.attach();
			this.textWatcher.attach();

			this._listeners.push( this.textWatcher.on( 'matched', this.onTextMatched, this ) );
			this._listeners.push( this.textWatcher.on( 'unmatched', this.onTextUnmatched, this ) );
			this._listeners.push( this.model.on( 'change-data', this.onData, this ) );
			this._listeners.push( this.model.on( 'change-selectedItemId', this.onSelectedItemId, this ) );
			this._listeners.push( this.view.on( 'click-item', this.onItemClick, this ) );

			// Update view position on viewport change.
			this._listeners.push( win.on( 'scroll', function() {
				this.onChange();
			}, this ) );
			this._listeners.push( editorDocument.on( 'scroll', function() {
				this.onChange();
			}, this ) );

			this._listeners.push( editor.on( 'contentDom', onContentDom, this ) );
			// CKEditor's event system has a limitation that one function (in this case this.check)
			// cannot be used as listener for the same event more than once. Hence, wrapper function.
			this._listeners.push( editor.on( 'change', function() {
				this.onChange();
			}, this ) );

			// Attach if editor is already initialized.
			if ( editor.editable() ) {
				onContentDom.call( this );
			}

			function onContentDom() {
				// Priority 5 to get before the enterkey.
				// Note: CKEditor's event system has a limitation that one function (in this case this.onKeyDown)
				// cannot be used as listener for the same event more than once. Hence, wrapper function.
				this._listeners.push( editor.editable().on( 'keydown', function( evt ) {
					this.onKeyDown( evt );
				}, this, null, 5 ) );
			}
		},

		/**
		 * Closes the view and sets its {@link CKEDITOR.plugins.autocomplete.model#isActive state} to inactive.
		 */
		close: function() {
			this.model.setActive( false );
			this.view.close();
		},

		/**
		 * Commits the currently chosen or given item. HTML is generated for this item using the
		 * {@link #getHtmlToInsert} method and then it is inserted into the editor. The item is inserted
		 * into the {@link CKEDITOR.plugins.autocomplete.model#range query's range}, so the query text is
		 * replaced by the inserted HTML.
		 *
		 * @param {Number/String} [itemId] If given, then the specified item will be inserted into the editor
		 * instead of the currently chosen one.
		 */
		commit: function( itemId ) {
			if ( !this.model.isActive ) {
				return;
			}

			this.close();

			if ( itemId == null ) {
				itemId = this.model.selectedItemId;

				// If non item is selected abort commit.
				if ( itemId == null ) {
					return;
				}
			}

			var item = this.model.getItemById( itemId ),
				editor = this.editor;

			editor.fire( 'saveSnapshot' );
			editor.getSelection().selectRanges( [ this.model.range ] );
			editor.insertHtml( this.getHtmlToInsert( item ), 'text' );
			editor.fire( 'saveSnapshot' );
		},

		/**
		 * Destroys the autocomplete instance.
		 * View element and event listeners will be removed from the DOM.
		 */
		destroy: function() {
			CKEDITOR.tools.array.forEach( this._listeners, function( obj ) {
				obj.removeListener();
			} );

			this._listeners = [];

			this.view.element.remove();
		},

		/**
		 * Returns HTML that should be inserted into the editor when the item is committed.
		 *
		 * See also the {@link #commit} method.
		 *
		 * @param {CKEDITOR.plugins.autocomplete.model.item} item
		 * @returns {String} The HTML to insert.
		 */
		getHtmlToInsert: function( item ) {
			return item.name;
		},

		/**
		 * Creates and returns the model instance. This method is used while
		 * initializing the autocomplete and can be overwritten in order to
		 * return an instance of a different class than the default model.
		 *
		 * @param {Function} dataCallback See {@link CKEDITOR.plugins.autocomplete} arguments.
		 * @returns {CKEDITOR.plugins.autocomplete.model} The model instance.
		 */
		getModel: function( dataCallback ) {
			return new Model( dataCallback );
		},

		/**
		 * Creates and returns the text watcher instance. This method is used while
		 * initializing the autocomplete and can be overwritten in order to
		 * return an instance of a different class than the default text watcher.
		 *
		 * @param {Function} textTestCallback See {@link CKEDITOR.plugins.autocomplete} arguments.
		 * @returns {CKEDITOR.plugins.textWatcher} The text watcher instance.
		 */
		getTextWatcher: function( textTestCallback ) {
			return new CKEDITOR.plugins.textWatcher( this.editor, textTestCallback );
		},

		/**
		 * Creates and returns the view instance. This method is used while
		 * initializing the autocomplete and can be overwritten in order to
		 * return an instance of a different class than the default view.
		 *
		 * @returns {CKEDITOR.plugins.autocomplete.view} The view instance.
		 */
		getView: function() {
			return new View( this.editor );
		},

		/**
		 * Opens the panel if {@link CKEDITOR.plugins.autocomplete.model#hasData there is any data available}.
		 */
		open: function() {
			if ( this.model.hasData() ) {
				this.model.setActive( true );
				this.view.open();
				this.model.selectFirst();
				this.view.updatePosition();
			}
		},

		// LISTENERS ------------------

		/**
		 * The function registered by the {@link #attach} method as the
		 * {@link CKEDITOR.editor#change} event listener.
		 */
		onChange: function() {
			if ( this.model.isActive ) {
				this.view.updatePosition();
			}
		},

		/**
		 * The function registered by the {@link #attach} method as the
		 * {@link CKEDITOR.plugins.autocomplete.model#change-data} event listener.
		 *
		 * @param {CKEDITOR.eventInfo} evt
		 */
		onData: function( evt ) {
			if ( this.model.hasData() ) {
				this.view.updateItems( evt.data );
				this.open();
			} else {
				this.close();
			}
		},

		/**
		 * The function registered by the {@link #attach} method as the
		 * {@link CKEDITOR.plugins.autocomplete.view#click-item} event listener.
		 *
		 * @param {CKEDITOR.eventInfo} evt
		 */
		onItemClick: function( evt ) {
			this.commit( evt.data );
		},

		/**
		 * The function registered by the {@link #attach} method as the `keydown` event listener.
		 *
		 * @param {CKEDITOR.dom.event} evt
		 */
		onKeyDown: function( evt ) {
			if ( !this.model.isActive ) {
				return;
			}

			var keyCode = evt.data.getKey(),
				handled = false;

			// Esc key.
			if ( keyCode == 27 ) {
				this.close();
				this.textWatcher.unmatch();
				handled = true;
			// Down Arrow.
			} else if ( keyCode == 40 ) {
				this.model.selectNext();
				handled = true;
			// Up Arrow.
			} else if ( keyCode == 38 ) {
				this.model.selectPrevious();
				handled = true;
			// Completion keys.
			} else if ( CKEDITOR.tools.indexOf( this.commitKeystroke, keyCode ) != -1 ) {
				this.commit();
				this.textWatcher.unmatch();
				handled = true;
			}

			if ( handled ) {
				evt.cancel();
				evt.data.preventDefault();
				this.textWatcher.consumeNext();
			}
		},

		/**
		 * The function registered by the {@link #attach} method as the
		 * {@link CKEDITOR.plugins.autocomplete.model#change-selectedItemId} event listener.
		 *
		 * @param {CKEDITOR.eventInfo} evt
		 */
		onSelectedItemId: function( evt ) {
			this.view.selectItem( evt.data );
		},

		/**
		 * The function registered by the {@link #attach} method as the
		 * {@link CKEDITOR.plugins.textWatcher#matched} event listener.
		 *
		 * @param {CKEDITOR.eventInfo} evt
		 */
		onTextMatched: function( evt ) {
			this.model.setActive( false );
			this.model.setQuery( evt.data.text, evt.data.range );
		},

		/**
		 * The function registered by the {@link #attach} method as the
		 * {@link CKEDITOR.plugins.textWatcher#unmatched} event listener.
		 *
		 * @param {CKEDITOR.eventInfo} evt
		 */
		onTextUnmatched: function() {
			this.close();
		}
	};

	/**
	 * Class representing the autocomplete view.
	 *
	 * In order to use a different view, implement a new view class and override
	 * the {@link CKEDITOR.plugins.autocomplete#getView} method.
	 *
	 * ```javascript
	 *	myAutocomplete.prototype.getView = function() {
	 *		return new myView( this.editor );
	 *	};
	 * ```
	 *
	 * You can also modify this class on the fly.
	 *
	 * ```javascript
	 *	myAutocomplete.prototype.getView = function() {
	 *		// Call the original getView method.
	 *		var view = CKEDITOR.plugins.autocomplete.prototype.getView.call( this );
	 *
	 *		// Override one property.
	 *		view.itemTemplate = new CKEDITOR.template( '<li data-id={id}><img src="{iconSrc}" alt="..."> {name}</li>' );
	 *
	 *		return view;
	 *	};
	 * ```
	 *
	 * @class CKEDITOR.plugins.autocomplete.view
	 * @since 4.10.0
	 * @mixins CKEDITOR.event
	 * @constructor Creates the autocomplete view instance.
	 * @param {CKEDITOR.editor} editor The editor instance.
	 */
	function View( editor ) {
		/**
		 * The panel's item template.
		 *
		 * @readonly
		 * @property {CKEDITOR.template}
		 */
		this.itemTemplate = new CKEDITOR.template( '<li data-id="{id}">{name}</li>' );

		/**
		 * The editor instance.
		 *
		 * @readonly
		 * @property {CKEDITOR.editor}
		 */
		this.editor = editor;

		/**
		 * The ID of the selected item.
		 *
		 * @readonly
		 * @property {Number/String} selectedItemId
		 */

		/**
		 * The document to which the view is attached. It is set by the {@link #append} method.
		 *
		 * @readonly
		 * @property {CKEDITOR.dom.document} document
		 */

		/**
		 * The view's main element. It is set by the {@link #append} method.
		 *
		 * @readonly
		 * @property {CKEDITOR.dom.element} element
		 */

		/**
		 * Event fired when an item in the panel is clicked.
		 *
		 * @event click-item
		 * @param {String} The clicked item {@link CKEDITOR.plugins.autocomplete.model.item#id}. Note: the id
		 * is stringified due to the way how it is stored in the DOM.
		 */
	}

	View.prototype = {
		/**
		 * Appends the {@link #element main element} to the DOM.
		 */
		append: function() {
			this.document = CKEDITOR.document;
			this.element = this.createElement();

			this.document.getBody().append( this.element );
		},

		/**
		 * Removes existing items and appends given items to the {@link #element}.
		 *
		 * @param {CKEDITOR.dom.documentFragment} itemsFragment Document fragment with items elements.
		 */
		appendItems: function( itemsFragment ) {
			this.element.setHtml( '' );
			this.element.append( itemsFragment );
		},

		/**
		 * Attaches the view's listeners to the DOM elements.
		 */
		attach: function() {
			this.element.on( 'click', function( evt ) {
				var target = evt.data.getTarget(),
					itemElement = target.getAscendant( this.isItemElement, true );

				if ( itemElement ) {
					this.fire( 'click-item', itemElement.data( 'id' ) );
				}
			}, this );
		},

		/**
		 * Closes the panel.
		 */
		close: function() {
			this.element.removeClass( 'cke_autocomplete_opened' );
		},

		/**
		 * Creates and returns the view's main element.
		 *
		 * @returns {CKEDITOR.dom.element}
		 */
		createElement: function() {
			var el = new CKEDITOR.dom.element( 'ul', this.document );

			el.addClass( 'cke_autocomplete_panel' );
			// Below float panels and context menu, but above maximized editor (-5).
			el.setStyle( 'z-index', this.editor.config.baseFloatZIndex - 3 );

			return el;
		},

		/**
		 * Creates the item element based on the {@link #itemTemplate}.
		 *
		 * @param {CKEDITOR.plugins.autocomplete.model.item} item The item for which an element will be created.
		 * @returns {CKEDITOR.dom.element}
		 */
		createItem: function( item ) {
			return CKEDITOR.dom.element.createFromHtml( this.itemTemplate.output( item ), this.document );
		},

		/**
		 * Returns the caret position relative to the panel's offset parent (the `body` element of the host document).
		 * The value returned by this function is passed to the {@link #setPosition} method
		 * by the {@link #updatePosition} method.
		 *
		 * @returns {Object} Represents the position of the caret.
		 * @returns {Number} rect.left
		 * @returns {Number} rect.top
		 * @returns {Number} rect.bottom
		 */
		getCaretRect: function() {
			var caretClientRect = this.editor.getSelection().getCaretPosition(),
				offset,
				editable = this.editor.editable();

			if ( editable.isInline() ) {
				offset = CKEDITOR.document.getWindow().getScrollPosition();
			} else {
				offset = editable.getParent().getDocumentPosition( CKEDITOR.document );
			}

			return {
				top: ( caretClientRect.top + offset.y ),
				bottom: ( caretClientRect.top + caretClientRect.height + offset.y ),
				left: ( caretClientRect.left + offset.x )
			};
		},

		/**
		 * Gets the item element by the item ID.
		 *
		 * @param {Number/String} itemId
		 * @returns {CKEDITOR.dom.element} The item element.
		 */
		getItemById: function( itemId ) {
			return this.element.findOne( 'li[data-id="' + itemId + '"]' );
		},

		/**
		 * Checks whether a given node is the item element.
		 *
		 * @param {CKEDITOR.dom.node} node
		 * @returns {Boolean}
		 */
		isItemElement: function( node ) {
			return node.type == CKEDITOR.NODE_ELEMENT &&
				Boolean( node.data( 'id' ) );
		},

		/**
		 * Opens the panel.
		 */
		open: function() {
			this.element.addClass( 'cke_autocomplete_opened' );
		},

		/**
		 * Selects the item in the panel and scrolls the list to show it if needed.
		 * The {@link #selectedItemId currently selected item} is deselected first.
		 *
		 * @param {Number/String} itemId The ID of the item that should be selected.
		 */
		selectItem: function( itemId ) {
			if ( this.selectedItemId != null ) {
				this.getItemById( this.selectedItemId ).removeClass( 'cke_autocomplete_selected' );
			}

			var itemElement = this.getItemById( itemId );
			itemElement.addClass( 'cke_autocomplete_selected' );
			this.selectedItemId = itemId;

			this.scrollElementTo( itemElement );
		},

		/**
		 * Sets the position of the panel. This method only performs the check
		 * for the available space below and above the specified `rect` and
		 * positions the panel in the best place.
		 *
		 * This method is used by the {@link #updatePosition} method which
		 * controls how the panel should be positioned on the screen for example
		 * based on the caret position and/or the editor position.
		 *
		 * @param {Object} rect Represents the position of a vertical (e.g. a caret) line relative to which
		 * the panel should be positioned.
		 * @param {Number} rect.left The position relative to the panel's offset parent in pixels.
		 * For example: the position of the caret.
		 * @param {Number} rect.top The position relative to the panel's offset parent in pixels.
		 * For example: the position of the upper end of the caret.
		 * @param {Number} rect.bottom The position relative to the panel's offset parent in pixels.
		 * For example: the position of the bottom end of the caret.
		 */
		setPosition: function( rect ) {
			var editor = this.editor,
				viewPanelHeight = this.element.getSize( 'height' ),
				windowFrame = editor.window.getFrame(),
				editable = editor.editable(),
				// Bounding rect where view should fit (visible editor viewport).
				editorViewportRect = editable.isInline() ? editable.getClientRect( true ) : windowFrame.getClientRect( true ),
				// How much space is there for the panel above and below the specified rect.
				spaceAbove = rect.top - editorViewportRect.top,
				spaceBelow = rect.bottom - editorViewportRect.bottom,
				top;

			// If panel does not fit below the rect and fits above, set it there.
			// This means that position below the rect is preferred.
			// Skip changing position above if a caret position is not visible an editor viewport.
			if (
				viewPanelHeight > spaceBelow &&
				viewPanelHeight < spaceAbove &&
				editorViewportRect.top < rect.top &&
				editorViewportRect.bottom > rect.bottom
				) {
				top = rect.top - viewPanelHeight;
			} else {
				// Keep panel inside editor viewport.
				top = rect.top < editorViewportRect.top ? editorViewportRect.top : Math.min( editorViewportRect.bottom, rect.bottom );
			}

			this.element.setStyles( {
				left: rect.left + 'px',
				top: top + 'px'
			} );
		},

		/**
		 * Scrolls the list so the item element is visible in it.
		 *
		 * @param {CKEDITOR.dom.element} itemElement
		 */
		scrollElementTo: function( itemElement ) {
			itemElement.scrollIntoParent( this.element );
		},

		/**
		 * Updates the list of items in the panel.
		 *
		 * @param {CKEDITOR.plugins.autocomplete.model.item[]} items.
		 */
		updateItems: function( items ) {
			var i,
				frag = new CKEDITOR.dom.documentFragment( this.document );

			for ( i = 0; i < items.length; ++i ) {
				frag.append( this.createItem( items[ i ] ) );
			}

			this.appendItems( frag );
			this.selectedItemId = null;
		},

		/**
		 * Updates the position of the panel.
		 *
		 * By default this method finds the position of the caret and uses
		 * {@link #setPosition} to move the panel to the best position close
		 * to the caret.
		 */
		updatePosition: function() {
			this.setPosition( this.getCaretRect() );
		}
	};

	CKEDITOR.event.implementOn( View.prototype );

	/**
	 * Class representing the autocomplete model.
	 *
	 * In case you want to modify model behavior, check out the
	 * {@link CKEDITOR.plugins.autocomplete.view} documentation. It contains
	 * examples of how to easily override the default behavior.
	 *
	 * Model instance is created by the {@link CKEDITOR.plugins.autocomplete#getModel} method.
	 *
	 * @class CKEDITOR.plugins.autocomplete.model
	 * @since 4.10.0
	 * @mixins CKEDITOR.event
	 * @constructor Creates the autocomplete model instance.
	 * @param {Function} dataCallback See {@link CKEDITOR.plugins.autocomplete} arguments.
	 */
	function Model( dataCallback ) {
		/**
		 * The callback executed by the model when requesting data.
		 * See {@link CKEDITOR.plugins.autocomplete} arguments.
		 *
		 * @readonly
		 * @property {Function}
		 */
		this.dataCallback = dataCallback;

		/**
		 * Whether the autocomplete is active (i.e. can receive user input like click, key press).
		 * Can be modified by the {@link #setActive} method which fires the {@link #change-isActive} event.
		 *
		 * @readonly
		 */
		this.isActive = false;

		/**
		 * ID of the last request for data. Used by the {@link #setQuery} method.
		 *
		 * @readonly
		 * @property {Number} lastRequestId
		 */

		/**
		 * The query string set by the {@link #setQuery} method.
		 *
		 * The query string always has a corresponding {@link #range}.
		 *
		 * @readonly
		 * @property {String} query
		 */

		/**
		 * The range in the DOM where the {@link #query} text is.
		 *
		 * The range always has a corresponding {@link #query}. Both can be set by the {@link #setQuery} method.
		 *
		 * @readonly
		 * @property {CKEDITOR.dom.range} range
		 */

		/**
		 * The query results &mdash; items to be displayed in the autocomplete panel.
		 *
		 * @readonly
		 * @property {CKEDITOR.plugins.autocomplete.model.item[]} data
		 */

		/**
		 * ID of the item currently selected in the panel.
		 *
		 * @readonly
		 * @property {Number/String} selectedItemId
		 */

		/**
		 * Event fired when the {@link #data} array changes.
		 *
		 * @event change-data
		 * @param {CKEDITOR.plugins.autocomplete.model.item[]} data The new value.
		 */

		/**
		 * Event fired when the {@link #selectedItemId} property changes.
		 *
		 * @event change-selectedItemId
		 * @param {Number/String} data The new value.
		 */

		/**
		 * Event fired when the {@link #isActive} property changes.
		 *
		 * @event change-isActive
		 * @param {Boolean} data The new value
		 */
	}

	Model.prototype = {
		/**
		 * Gets an index from the {@link #data} array of the item by its ID.
		 *
		 * @param {Number/String} itemId
		 * @returns {Number}
		 */
		getIndexById: function( itemId ) {
			if ( !this.hasData() ) {
				return -1;
			}

			for ( var data = this.data, i = 0, l = data.length; i < l; i++ ) {
				if ( data[ i ].id == itemId ) {
					return i;
				}
			}

			return -1;
		},

		/**
		 * Gets the item from the {@link #data} array by its ID.
		 *
		 * @param {Number/String} itemId
		 * @returns {CKEDITOR.plugins.autocomplete.model.item}
		 */
		getItemById: function( itemId ) {
			var index = this.getIndexById( itemId );
			return ~index && this.data[ index ] || null;
		},

		/**
		 * Whether the model contains a non-empty {@link #data}.
		 *
		 * @returns {Boolean}
		 */
		hasData: function() {
			return Boolean( this.data && this.data.length );
		},

		/**
		 * Selects an item. Sets the {@link #selectedItemId} property and
		 * fires the {@link #change-selectedItemId} event.
		 *
		 * @param {Number/String} itemId
		 */
		select: function( itemId ) {
			if ( this.getIndexById( itemId ) < 0 ) {
				throw new Error( 'Item with given id does not exist' );
			}

			this.selectedItemId = itemId;
			this.fire( 'change-selectedItemId', itemId );
		},

		/**
		 * Selects the first item. See also the {@link #select} method.
		 */
		selectFirst: function() {
			if ( this.hasData() ) {
				this.select( this.data[ 0 ].id );
			}
		},

		/**
		 * Selects the last item. See also the {@link #select} method.
		 */
		selectLast: function() {
			if ( this.hasData() ) {
				this.select( this.data[ this.data.length - 1 ].id );
			}
		},

		/**
		 * Selects the next item in the {@link #data} array. If no item is selected, then
		 * it selects the first one. If the last one is selected, then it selects the first one.
		 *
		 * See also the {@link #select} method.
		 */
		selectNext: function() {
			if ( this.selectedItemId == null ) {
				this.selectFirst();
				return;
			}

			var index = this.getIndexById( this.selectedItemId );

			if ( index < 0 || index + 1 == this.data.length ) {
				this.selectFirst();
			} else {
				this.select( this.data[ index + 1 ].id );
			}
		},

		/**
		 * Selects the previous item in the {@link #data} array. If no item is selected, then
		 * it selects the last one. If the first one is selected, then it selects the last one.
		 *
		 * See also the {@link #select} method.
		 */
		selectPrevious: function() {
			if ( this.selectedItemId == null ) {
				this.selectLast();
				return;
			}

			var index = this.getIndexById( this.selectedItemId );

			if ( index <= 0 ) {
				this.selectLast();
			} else {
				this.select( this.data[ index - 1 ].id );
			}
		},

		/**
		 * Sets the {@link #isActive} property and fires the {@link #change-isActive} event.
		 *
		 * @param {Boolean} isActive
		 */
		setActive: function( isActive ) {
			this.isActive = isActive;
			this.fire( 'change-isActive', isActive );
		},

		/**
		 * Sets the {@link #query} and {@link #range} and makes a request for the query results
		 * by executing the {@link #dataCallback} function. When the data is returned (synchronously or
		 * asynchronously, because {@link #dataCallback} exposes a callback function), the {@link #data}
		 * property is set and the {@link #change-data} event is fired.
		 *
		 * This method controls that only the response for the current query is handled.
		 *
		 * @param {String} query
		 * @param {CKEDITOR.dom.range} range
		 */
		setQuery: function( query, range ) {
			var that = this,
				requestId = CKEDITOR.tools.getNextId();

			this.lastRequestId = requestId;
			this.query = query;
			this.range = range;
			this.data = null;
			this.selectedItemId = null;

			this.dataCallback( query, range, function( data ) {
				// Handle only the response for the most recent setQuery call.
				if ( requestId == that.lastRequestId ) {
					that.data = data;
					that.fire( 'change-data', data );
				}
			} );
			// Note: don't put any code here because the callback passed to
			// this.dataCallback may be executed synchronously or asynchronously
			// so execution order will differ.
		}
	};

	CKEDITOR.event.implementOn( Model.prototype );

	/**
	 * An abstract class representing one {@link CKEDITOR.plugins.autocomplete.model#data data item}.
	 * Item can be understood as a one position in the autocomplete panel.
	 *
	 * Item must have a unique {@link #id} and may have more properties which can then be used for example in
	 * the {@link CKEDITOR.plugins.autocomplete.view#itemTemplate} template or the
	 * {@link CKEDITOR.plugins.autocomplete#getHtmlToInsert} method.
	 *
	 * Example items:
	 *
	 * ```javascript
	 *	{ id: 345, name: '@ckeditor' }
	 *	{ id: 'smile1', alt: 'smile', emojiSrc: 'emojis/smile.png' }
	 * ```
	 *
	 * @abstract
	 * @class CKEDITOR.plugins.autocomplete.model.item
	 * @since 4.10.0
	 */

	/**
	 * The unique ID of the item. The ID should not change with time, so two
	 * {@link CKEDITOR.plugins.autocomplete.model#dataCallback}
	 * calls should always result in the same ID for the same logical item.
	 * This can for example allow to keep the same item selected when
	 * the data changes.
	 *
	 * **Note:** When using a string as an item make sure that the string does not
	 * contain any special characters (above all `"[]` characters). This limitation is
	 * due to the simplified way the {@link CKEDITOR.plugins.autocomplete.view}
	 * stores IDs in the DOM.
	 *
	 * @readonly
	 * @property {Number/String} id
	 */

	CKEDITOR.plugins.autocomplete = Autocomplete;
	Autocomplete.view = View;
	Autocomplete.model = Model;

	/**
	 * The autocomplete keystrokes used to finish autocompletion with selected view item.
	 * This setting will set completing keystrokes for each autocomplete plugin respectively.
	 *
	 * To change completing keystrokes individually use {@link CKEDITOR.plugins.autocomplete#commitKeystroke} plugin property.
	 *
	 * ```javascript
	 * // Default config (9 = tab, 13 = enter).
	 * config.autocomplete_commitKeystroke = [ 9, 13 ];
	 * ```
	 *
	 * Commit keystroke can be also disabled by setting it to an empty array.
	 *
	 * ```javascript
	 * // Disable autocomplete commit keystroke.
	 * config.autocomplete_commitKeystroke = [];
	 * ```
	 *
	 * @since 4.10.0
	 * @cfg {Number/Number[]} [autocomplete_commitKeystroke=[9, 13]]
	 * @member CKEDITOR.config
	 */
	CKEDITOR.config.autocomplete_commitKeystroke = [ 9, 13 ];
} )();
