/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	/**
	 * Class representing view of inline toolbar, used by {@link CKEDITOR.ui.inlineToolbar}.
	 *
	 * @class
	 * @private
	 * @extends CKEDITOR.ui.balloonPanel
	 * @constructor Creates an inline toolbar view instance.
	 * @since 4.8
	 * @param {CKEDITOR.editor} editor The editor instance for which the toolbar is created.
	 * @param {Object} definition An object containing the toolbar definition. See {@link CKEDITOR.ui.balloonPanel}
	 * docs for an example definition.
	 */
	CKEDITOR.ui.inlineToolbarView = function( editor, definition ) {
		definition = CKEDITOR.tools.extend( definition || {}, {
			width: 'auto',
			triangleWidth: 10,
			triangleHeight: 10
		} );
		CKEDITOR.ui.balloonPanel.call( this, editor, definition );

		/**
		 * Listeners registered by this toolbar view.
		 *
		 * @private
		 */
		this._listeners = [];
	};

	/**
	 * Class representing instance of inline toolbar.
	 *
	 *		// Following example will show an inline toolbar on any selection change. The toolbar is anchored to the
	 *		// last element in selection, assuming that editor variable is an instance of CKEDITOR.editor.
	 *		editor.on( 'instanceReady', function() {
	 *			var toolbar = new CKEDITOR.ui.inlineToolbar( editor );
	 *
	 *			toolbar.addItems( {
	 *				link: new CKEDITOR.ui.button( {
	 *					command: 'link'
	 *				} ),
	 *				unlink: new CKEDITOR.ui.button( {
	 *					command: 'unlink'
	 *				} )
	 *			} );
	 *
	 *			editor.on( 'selectionChange', function( evt ) {
	 *				var lastElement = evt.data.path.lastElement;
	 *
	 *				if ( lastElement ) {
	 *					toolbar.attach( lastElement );
	 *				}
	 *			} );
	 *		} );
	 *
	 * @class
	 * @constructor Creates an inline toolbar instance.
	 * @since 4.8
	 * @param {CKEDITOR.editor} editor The editor instance for which the toolbar is created.
	 * @param {Object} definition An object containing the panel definition. See {@link CKEDITOR.ui.balloonPanel}
	 * docs for an example definition.
	 */
	CKEDITOR.ui.inlineToolbar = function( editor, definition ) {
		/**
		 * View instance of inline toolbar.
		 *
		 * @private
		 * @property {CKEDITOR.ui.inlineToolbarView}
		 */
		this._view = new CKEDITOR.ui.inlineToolbarView( editor, definition );

		/**
		 * Menu items added to inline toolbar.
		 *
		 * @private
		 * @property {CKEDITOR.ui.button[]/CKEDITOR.ui.richCombo[]}
		 */
		this._items = [];
	};

	/**
	 * Class representing inline toolbar context in the editor.
	 *
	 * @class CKEDITOR.plugins.inlinetoolbar.context
	 * @constructor Creates an inline toolbar context instance.
	 * @since 4.8
	 * @param {CKEDITOR.editor} editor The editor instance for which the toolbar is created.
	 * @param {Object} options Options object passed in the {@link CKEDITOR.editor.plugins.inlinetoolbar#create} method.
	 */
	function Context( editor, options ) {
		/**
		 * Editor instance.
		 *
		 * @property {CKEDITOR.editor}
		 */
		this.editor = editor;

		/**
		 * Options passed to the constructor.
		 *
		 * @property {Object}
		 */
		this.options = options;

		/**
		 * Toolbar instance pointed by context.
		 *
		 * @property {CKEDITOR.ui.inlineToolbar}
		 */
		this.toolbar = new CKEDITOR.ui.inlineToolbar( editor );

		/**
		 * A filter based on `options.elements` property. It's created only once at context construction time and cached.
		 *
		 * @private
		 * @property {CKEDITOR.filter}
		 */
		this._filter = this.options.elements ? new CKEDITOR.filter( this.options.elements ) : null;

		if ( this.options && typeof this.options.priority === 'undefined' ) {
			this.options.priority = CKEDITOR.plugins.inlinetoolbar.PRIORITY.MEDIUM;
		}

		this._loadButtons();
	}

	Context.prototype = {
		/**
		 * Destroy inline toolbar context
		 */
		destroy: function() {
			if ( this.toolbar ) {
				this.toolbar.destroy();
			}
		},

		/**
		 * @param {CKEDITOR.dom.element} [pointedElement] Element that should be pointed by the inline toolbar.
		 */
		show: function( pointedElement ) {
			if ( pointedElement ) {
				this.toolbar.attach( pointedElement );
			}

			this.toolbar.show();
		},

		hide: function() {
			this.toolbar.hide();
		},

		/**
		 * Performs matching against `options.refresh`.
		 *
		 * @param {CKEDITOR.dom.elementPath} path Element path to be checked.
		 * @param {CKEDITOR.dom.selection} selection Selection object to be passed to the `refresh` function.
		 * @returns {Boolean/CKEDITOR.dom.element} Returns the result of a `options.refresh`. It is expected to be
		 * `true` if current path matches the context.
		 * It may also return {@link CKEDITOR.dom.element} instance, that the toolbar should point to.
		 */
		_matchRefresh: function( path, selection ) {
			if ( this.options.refresh ) {
				return this.options.refresh( this.editor, path, selection );
			}
		},

		/**
		 * Checks if any of `options.widgets` widgets is currently focused.
		 *
		 * @private
		 * @returns {Boolean/CKEDITOR.dom.element} `true` if currently selected widget matches any tracked by this
		 * context. It may also return {@link CKEDITOR.dom.element} instance, that the toolbar should point to.
		 */
		_matchWidget: function() {
			if ( !this.options.widgets ) {
				return;
			}

			var widgetNames = this.options.widgets,
				curWidgetName = this.editor.widgets && this.editor.widgets.focused && this.editor.widgets.focused.name;

			if ( typeof widgetNames === 'string' ) {
				widgetNames = widgetNames.split( ',' );
			}

			if ( CKEDITOR.tools.array.indexOf( widgetNames, curWidgetName ) !== -1 ) {
				return this.editor.widgets.focused.element;
			} else {
				return false;
			}
		},

		/**
		 * Checks if given `element` matches `options.elements` selector.
		 *
		 * @private
		 * @param {CKEDITOR.dom.element} `elem` Element to be tested.
		 * @returns {Boolean/CKEDITOR.dom.element} `true` if a given element matches the selector.
		 * It may also return {@link CKEDITOR.dom.element} instance, that the toolbar should point to.
		 */
		_matchElement: function( elem ) {
			if ( !this.options.elements ) {
				return;
			}

			var styleDef = CKEDITOR.plugins.inlinetoolbar._convertElementToStyleDef( elem );

			return this._filter.check( new CKEDITOR.style( styleDef ), false, false );
		},

		/**
		 * Loads button from `options.buttons`.
		 *
		 * @private
		 */
		_loadButtons: function() {
			var buttons = this.options.buttons;

			if ( buttons ) {
				buttons = buttons.split( ',' );
				CKEDITOR.tools.array.forEach( buttons, function( name ) {
					this.toolbar.addItem( name, this.editor.ui.create( name ) );
				}, this );
			}
		}
	};


	/**
	 * Class for managers that take care of handling multiple contexts.
	 *
	 * Making sure that only one is active at a time and implementing the logic, used to determine
	 * best fitting context for a given selection.
	 *
	 * Context manager also implements logic for matching the best context. Priorities are as follows:
	 *
	 * 1. Callback - `options.refresh`
	 * 1. Widgets matching - `options.widgets`
	 * 1. ACF matching - `options.elements`
	 *
	 * @class CKEDITOR.plugins.inlinetoolbar.contextManager
	 * @constructor
	 * @since 4.8
	 * @param {CKEDITOR.editor} editor The editor instance which the toolbar is created for.
	 */
	function ContextManager( editor ) {
		/**
		 * Editor for which the manager was created for.
		 *
		 * @property {CKEDITOR.editor}
		 */
		this.editor = editor;

		/**
		 * List of contexts controlled by this manager.
		 *
		 * @private
		 * @property {CKEDITOR.plugins.inlinetoolbar.context}
		 */
		this._contexts = [];

		/**
		 * Array of event listener references, created by the manager.
		 *
		 * @private
		 * @property {Object[]} _listeners An array of objects returned by {@link CKEDITOR.event#on} method.
		 */
		this._listeners = [];

		this._attachListeners();
	}

	ContextManager.prototype = {
		/**
		 * Adds a `context` to the tracked contexts list.
		 *
		 * @param {CKEDITOR.plugins.inlinetoolbar.context} context
		 */
		add: function( context ) {
			this._contexts.push( context );
		},

		/**
		 * Check each registered context against `selection` to find the best match. By default only one
		 * toolbar per manager will be shown.
		 *
		 * @param {CKEDITOR.dom.selection/null} [selection=null] Selection to be used for probing toolbar. If none provided, a
		 * _shrunk_ selection of current editor will be used.
		 */
		check: function( selection ) {
			if ( !selection ) {
				selection = this.editor.getSelection();

				// Shrink the selection so that we're ensured innermost elements are available.
				CKEDITOR.tools.array.forEach( selection.getRanges(), function( range ) {
					range.shrink( CKEDITOR.SHRINK_ELEMENT, true );
				} );
			}

			if ( !selection ) {
				return;
			}

			var forEach = CKEDITOR.tools.array.forEach,
				mainRange = selection.getRanges()[ 0 ],
				path = mainRange && mainRange.startPath(),
				highlightElement = ( path && path.lastElement ) || this.editor.editable(),
				contextMatched;

			// This function encapsulates matching algorithm.
			function matchEachContext( contexts, matchingFunction, matchingArg1 ) {
				forEach( contexts, function( curContext ) {
					// Execute only if there's no picked context yet, or if probed context has a higher priority than
					// currently matched one.
					if ( !contextMatched || contextMatched.options.priority > curContext.options.priority ) {
						var result = matchingFunction( curContext, matchingArg1 );

						if ( !!result ) {
							if ( result instanceof CKEDITOR.dom.element ) {
								highlightElement = result;
							}

							contextMatched = curContext;
						}
					}
				} );
			}

			function elementsMatcher( curContext, curElement ) {
				return curContext._matchElement( curElement );
			}

			// Match callbacks.
			matchEachContext( this._contexts, function( curContext ) {
				return curContext._matchRefresh( path, selection );
			} );

			// Match widgets.
			matchEachContext( this._contexts, function( curContext ) {
				return curContext._matchWidget();
			} );

			// Match element selectors.
			if ( path ) {
				for ( var i = 0; i < path.elements.length; i++ ) {
					var curElement = path.elements[ i ];
					// Skip non-editable elements (e.g. widget internal structure).
					if ( !curElement.isReadOnly() ) {
						matchEachContext( this._contexts, elementsMatcher, curElement );
					}
				}
			}

			this.hide();

			if ( contextMatched ) {
				contextMatched.show( highlightElement );
			}
		},

		/**
		 * Hides every visible context controlled by manager.
		 */
		hide: function() {
			CKEDITOR.tools.array.forEach( this._contexts, function( curContext ) {
				curContext.hide();
			} );
		},

		/**
		 * Destroys every context controlled by the manager and clears the context list.
		 */
		destroy: function() {
			CKEDITOR.tools.array.forEach( this._listeners, function( listener ) {
				listener.removeListener();
			} );

			this._listeners.splice( 0, this._listeners.length );

			this._clear();
		},

		/**
		 * Destroys any context in {@link #_contexts} and empties the managed contexts list.
		 */
		_clear: function() {
			CKEDITOR.tools.array.forEach( this._contexts, function( curContext ) {
				curContext.destroy();
			} );

			this._contexts.splice( 0, this._contexts.length );
		},

		/**
		 * Adds a set of listeners integrating manager with the {@link #editor}, like {@link CKEDITOR.editor#event-selectionChange} listener.
		 *
		 * @private
		 */
		_attachListeners: function() {
			this._listeners.push(
				this.editor.on( 'destroy', function() {
					this.destroy();
				}, this ),
				this.editor.on( 'selectionChange', function() {
					this.check();
				}, this ),
				this.editor.on( 'mode', function() {
					this.hide();
				}, this, null, 9999 ),
				this.editor.on( 'blur', function() {
					this.hide();
				}, this, null, 9999 )
			);
		}
	};

	CKEDITOR.plugins.add( 'inlinetoolbar', {
		requires: 'balloonpanel',
		onLoad: function() {
			CKEDITOR.document.appendStyleSheet( this.path + 'skins/' + CKEDITOR.skinName + '/inlinetoolbar.css' );
		},

		init: function( editor ) {
			CKEDITOR.ui.inlineToolbarView.prototype = CKEDITOR.tools.extend( {}, CKEDITOR.ui.balloonPanel.prototype );

			/**
			 * Set of instance-specific public APIs exposed by Inline Toolbar plugin.
			 *
			 * @class CKEDITOR.editor.plugins.inlinetoolbar
	 		 * @singleton
			 */
			editor.plugins.inlinetoolbar = {
				/**
				 * @private
				 * @property {CKEDITOR.plugins.inlinetoolbar.contextManager} manager
				 */
				_manager: new CKEDITOR.plugins.inlinetoolbar.contextManager( editor ),

				/**
				 * The simplest way to create an Inline Toolbar. The conditions to display the toolbar are configurable using `options` object.
				 *
				 * Following example will add a toolbar containing link/unlink buttons for any anchor or image:
				 *
				 *		editor.plugins.inlinetoolbar.create( {
				 *			buttons: 'Link,Unlink',
				 *			elements: 'a[href];img[*]'
				 *		} );
				 *
				 * @param {Object} options Config object for Inline Toolbar.
				 * @param {String} [options.elements] ACF selector. If any elements in the path matches against it, the toolbar will be shown.
				 * @param {String[]/String} [options.widgets] An array of widget names that should trigger this toolbar. Alternatively can be passed as a comma-separated string.
				 * @param {Function} [options.refresh] A function that determines whether the toolbar should be visible for a given `elementPath`.
				 *
				 * It gets following parameters:
				 *
				 * * `editor` - {@link CKEDITOR.editor} an editor that controls this context.
				 * * `elementPath` - {@link CKEDITOR.dom.elementPath} path for probed selection.
				 * * `selection` - {@link CKEDITOR.dom.selection} selection object used for probing.
				 *
				 * Function is expected to return `Boolean` value. Returning `true` means that the inline toolbar should be shown.
				 *
				 * An example below will show the toolbar only for paths containing `<strong>` elements.
				 *
				 *		// Assuming that editor is an CKEDITOR.editor instance.
				 *		editor.plugins.inlinetoolbar.create( {
				 *			buttons: 'Bold,Underline',
				 *			refresh: function( editor, path ) {
				 *				return path.contains( 'strong' );
				 *			}
				 *		} );
				 *
				 * **Note that context options have a different priority**, see more details in
				 * {@link CKEDITOR.plugins.inlinetoolbar.contextManager}.
				 *
				 * @param {Number} [options.priority] A number based on {@link CKEDITOR.plugins.inlinetoolbar#PRIORITY}.
				 * @returns {CKEDITOR.plugins.inlinetoolbar.context} A context object created for this inline toolbar configuration.
				 */
				create: function( options ) {
					var ret = new CKEDITOR.plugins.inlinetoolbar.context( editor, options );

					this._manager.add( ret );

					return ret;
				}
			};

			/**
			 * Build inline toolbar DOM representation.
			 *
			 * @member CKEDITOR.ui.inlineToolbarView
			 */
			CKEDITOR.ui.inlineToolbarView.prototype.build = function() {
				CKEDITOR.ui.balloonPanel.prototype.build.call( this );
				this.parts.panel.addClass( 'cke_inlinetoolbar' );
				this.parts.title.remove();
				this.parts.close.remove();
			};

			CKEDITOR.ui.inlineToolbarView.prototype.show = function() {
				if ( this.rect.visible ) {
					return;
				}
				var editable = this.editor.editable();
				this._detachListeners();

				this._listeners.push( this.editor.on( 'resize', function() {
					this.attach( this._pointedElement, {
						focusElement: false
					} );
				}, this ) );
				this._listeners.push( editable.attachListener( editable.getDocument(), 'scroll', function() {
					this.attach( this._pointedElement, {
						focusElement: false
					} );
				}, this ) );
				CKEDITOR.ui.balloonPanel.prototype.show.call( this );
			};

			CKEDITOR.ui.inlineToolbarView.prototype.hide = function() {
				this._detachListeners();
				CKEDITOR.ui.balloonPanel.prototype.hide.call( this );
			};

			/**
			 * @inheritdoc CKEDITOR.ui.balloonPanel#blur
			 * @param {Boolean} [focusEditor=false] Whether the editor should be focused after blurring.
			 * @member CKEDITOR.ui.inlineToolbarView
			 */
			CKEDITOR.ui.inlineToolbarView.prototype.blur = function( focusEditor ) {
				if ( !!focusEditor ) {
					// This is actually different behavior from standard balloonpanel, where it always puts the focus back to editor.
					// We don't want to do it here, as e.g. we hide the toolbar as user leaves the editor (tabs out). Forcing focus
					// back to the editor would trap end user inside of the editor, and show the toolbar... again.
					this.editor.focus();
				}
			};

			CKEDITOR.ui.inlineToolbarView.prototype._getAlignments = function( elementRect, panelWidth, panelHeight ) {
				var filter = [ 'top hcenter', 'bottom hcenter' ],
					alignments = CKEDITOR.ui.balloonPanel.prototype._getAlignments.call( this, elementRect, panelWidth, panelHeight );
				for ( var a in alignments ) {
					if ( CKEDITOR.tools.indexOf( filter, a ) === -1 ) {
						delete alignments[ a ];
					}
				}
				return alignments;
			};

			/**
			 * Detaches all listeners.
			 *
			 * @private
			 * @member CKEDITOR.ui.inlineToolbarView
			 */
			CKEDITOR.ui.inlineToolbarView.prototype._detachListeners = function() {
				if ( this._listeners.length ) {
					CKEDITOR.tools.array.forEach( this._listeners, function( listener ) {
						listener.removeListener();
					} );
					this._listeners = [];
				}
			};

			CKEDITOR.ui.inlineToolbarView.prototype.destroy = function() {
				CKEDITOR.ui.balloonPanel.prototype.destroy.call( this );
				this._detachListeners();
			};

			/**
			 * Renders provided UI elements inside of the view.
			 *
			 * @param {CKEDITOR.ui.button[]/CKEDITOR.ui.richCombo[]} items Array of UI elements objects.
			 * @member CKEDITOR.ui.inlineToolbarView
			 */
			CKEDITOR.ui.inlineToolbarView.prototype.renderItems = function( items ) {
				var output = [],
					keys = CKEDITOR.tools.objectKeys( items ),
					groupStarted = false;

				CKEDITOR.tools.array.forEach( keys, function( itemKey ) {

					// If next element to render is richCombo and we have already opened group we have to close it.
					if ( CKEDITOR.ui.richCombo && items[ itemKey ] instanceof CKEDITOR.ui.richCombo && groupStarted ) {
						groupStarted = false;
						output.push( '</span>' );
					} else if ( !( CKEDITOR.ui.richCombo && items[ itemKey ] instanceof CKEDITOR.ui.richCombo ) && !groupStarted ) {
						// If we have closed group and element that is not richBox we have to open group.
						groupStarted = true;
						output.push( '<span class="cke_toolgroup">' );
					}

					// Now we can render element.
					items[ itemKey ].render( this.editor, output );
				}, this );

				// We have to check if last group is closed.
				if ( groupStarted ) {
					output.push( '</span>' );
				}

				this.parts.content.setHtml( output.join( '' ) );
			};

			/**
			 * @inheritdoc CKEDITOR.ui.balloonPanel#attach
			 * @member CKEDITOR.ui.inlineToolbarView
			 */
			CKEDITOR.ui.inlineToolbarView.prototype.attach = function( element, options ) {

				/**
				 * DOM element used by inline toolbar to attach to.
				 *
				 * @private
				 * @member CKEDITOR.ui.inlineToolbarView
				 */
				this._pointedElement = element;

				CKEDITOR.ui.balloonPanel.prototype.attach.call( this, element, options );
			};

			/**
			 * Displays the inline toolbar, pointing it to the `element`.
			 *
			 * @param {CKEDITOR.dom.element} element The element to which the panel is attached.
			 * @param {Boolean} [hidden=false] Do not show inline toolbar after attach.
			 * @member CKEDITOR.ui.inlineToolbar
			 */
			CKEDITOR.ui.inlineToolbar.prototype.attach = function( element, hidden ) {
				this._view.renderItems( this._items );
				this._view.attach( element, {
					focusElement: false,
					show: !hidden
				} );
			};

			/**
			 * Show inline toolbar.
			 *
			 * @member CKEDITOR.ui.inlineToolbar
			 */
			CKEDITOR.ui.inlineToolbar.prototype.show = function() {
				this._view.show();
			};

			/**
			 * Hide inline toolbar.
			 *
			 * @member CKEDITOR.ui.inlineToolbar
			 */
			CKEDITOR.ui.inlineToolbar.prototype.hide = function() {
				this._view.hide();
			};

			/**
			 * Adds an item to the inline toolbar.
			 *
			 * @param {String} name The menu item name.
			 * @param {CKEDITOR.ui.button/CKEDITOR.ui.richCombo} element Instance of ui element.
			 * @member CKEDITOR.ui.inlineToolbar
			 */
			CKEDITOR.ui.inlineToolbar.prototype.addItem = function( name, element ) {
				this._items[ name ] = element;
			};

			/**
			 * Adds one or more items to the inline toolbar.
			 *
			 * @param {Object} elements Object where keys are used as itemName and corresponding values as definition for a {@link #addItem} call.
			 * @member CKEDITOR.ui.inlineToolbar
			 */
			CKEDITOR.ui.inlineToolbar.prototype.addItems = function( elements ) {
				for ( var itemName in elements ) {
					this.addItem( itemName, elements[ itemName ] );
				}
			};

			/**
			 * Retrieves a particular menu item from the inline toolbar.
			 *
			 * @param {String} name The name of the desired menu item.
			 * @returns {CKEDITOR.ui.button/CKEDITOR.ui.richCombo}
			 * @member CKEDITOR.ui.inlineToolbar
			 */
			CKEDITOR.ui.inlineToolbar.prototype.getItem = function( name ) {
				return this._items[ name ];
			};

			/**
			 * Removes a particular menu item from the inline toolbar.
			 *
			 * @param {String} name The name of the item menu to be deleted.
			 * @member CKEDITOR.ui.inlineToolbar
			 */
			CKEDITOR.ui.inlineToolbar.prototype.deleteItem = function( name ) {
				if ( this._items[ name ] ) {
					delete this._items[ name ];
				}
			};

			/**
			 * Hides the toolbar and removes it from the DOM.
			 *
			 * @member CKEDITOR.ui.inlineToolbar
			 */
			CKEDITOR.ui.inlineToolbar.prototype.destroy = function() {
				this._pointedElement = null;
				this._view.destroy();
			};
		}
	} );

	/**
	 * Static API exposed by the [Inline Toolbar](https://ckeditor.com/cke4/addon/inlinetoolbar) plugin.
	 *
	 * @class
	 * @singleton
	 */
	CKEDITOR.plugins.inlinetoolbar = {
		context: Context,
		contextManager: ContextManager,

		/**
		 * Context priority enumeration. `HIGH` priority context are checked first.
		 *
		 * @property
		 */
		PRIORITY: {
			LOW: 999,
			MEDIUM: 500,
			HIGH: 10
		},

		/**
		 * Converts a given element into a style definition that could be used to create an instance of {@link CKEDITOR.style}.
		 *
		 * @param {CKEDITOR.dom.element} element The element to be converted.
		 * @returns {Object} The style definition created from the element.
		 * @private
		 */
		_convertElementToStyleDef: function( element ) {
			// @todo: this function is taken out from Copy Formatting plugin. It should be extracted to a common place.
			// Note that this function already has some modifications compared to the original.
			var attributes = element.getAttributes(),
				styles = CKEDITOR.tools.parseCssText( element.getAttribute( 'style' ), true, true );

			return {
				element: element.getName(),
				type: CKEDITOR.dtd.$block[ element.getName() ] ? CKEDITOR.STYLE_BLOCK : CKEDITOR.STYLE_INLINE,
				attributes: attributes,
				styles: styles
			};
		}
	};
}() );
