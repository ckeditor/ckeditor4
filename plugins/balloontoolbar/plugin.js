/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	var matchingFunctionName = getElementMatchFunctionName();

	/**
	 * Class representing a view of Balloon Toolbar, used by {@link CKEDITOR.ui.balloonToolbar}.
	 *
	 * @class
	 * @private
	 * @extends CKEDITOR.ui.balloonPanel
	 * @constructor Creates a Balloon Toolbar view instance.
	 * @since 4.8
	 * @param {CKEDITOR.editor} editor The editor instance for which the toolbar is created.
	 * @param {Object} definition An object containing the toolbar definition. See {@link CKEDITOR.ui.balloonPanel}
	 * docs for an example definition.
	 */
	CKEDITOR.ui.balloonToolbarView = function( editor, definition ) {
		definition = CKEDITOR.tools.extend( definition || {}, {
			width: 'auto',
			triangleWidth: 7,
			triangleHeight: 7
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
	 * Class representing instance of Balloon Toolbar.
	 *
	 * The easiest way to create a Balloon Toolbar is by using {@link CKEDITOR.editor#balloonToolbars} `create` method.
	 *
	 * However it's possible to maintain it manually, like below:
	 *
	 *		// Following example will show a Balloon Toolbar on any selection change. The toolbar is anchored to the
	 *		// last element in selection, assuming that editor variable is an instance of CKEDITOR.editor.
	 *		editor.on( 'instanceReady', function() {
	 *			var toolbar = new CKEDITOR.ui.balloonToolbar( editor );
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
	 * @constructor Creates a Balloon Toolbar instance.
	 * @since 4.8
	 * @param {CKEDITOR.editor} editor The editor instance for which the toolbar is created.
	 * @param {Object} definition An object containing the panel definition. See {@link CKEDITOR.ui.balloonPanel}
	 * docs for an example definition.
	 */
	CKEDITOR.ui.balloonToolbar = function( editor, definition ) {
		/**
		 * View instance of Balloon Toolbar.
		 *
		 * @private
		 * @property {CKEDITOR.ui.balloonToolbarView}
		 */
		this._view = new CKEDITOR.ui.balloonToolbarView( editor, definition );

		/**
		 * Menu items added to Balloon Toolbar.
		 *
		 * @private
		 * @property {Object.<String, CKEDITOR.ui.button/CKEDITOR.ui.richCombo>}
		 */
		this._items = {};
	};

	/**
	 * Displays the Balloon Toolbar, pointing it to the `element`.
	 *
	 * @param {CKEDITOR.dom.element} element The element to which the panel is attached.
	 * @param {Boolean} [hidden=false] Do not show Balloon Toolbar after attach.
	 * @member CKEDITOR.ui.balloonToolbar
	 */
	CKEDITOR.ui.balloonToolbar.prototype.attach = function( element, hidden ) {
		this._view.renderItems( this._items );
		this._view.attach( element, {
			focusElement: false,
			show: !hidden
		} );
	};

	/**
	 * Shows the Balloon Toolbar.
	 *
	 * @member CKEDITOR.ui.balloonToolbar
	 */
	CKEDITOR.ui.balloonToolbar.prototype.show = function() {
		this._view.show();
	};

	/**
	 * Hides the Balloon Toolbar.
	 *
	 * @member CKEDITOR.ui.balloonToolbar
	 */
	CKEDITOR.ui.balloonToolbar.prototype.hide = function() {
		this._view.hide();
	};

	/**
	 * Adds an item to the Balloon Toolbar.
	 *
	 * @param {String} name The menu item name.
	 * @param {CKEDITOR.ui.button/CKEDITOR.ui.richCombo} element Instance of ui element.
	 */
	CKEDITOR.ui.balloonToolbar.prototype.addItem = function( name, element ) {
		this._items[ name ] = element;
	};

	/**
	 * Adds one or more items to the Balloon Toolbar.
	 *
	 * @param {Object} elements Object where keys are used as itemName and corresponding values as definition for a {@link #addItem} call.
	 */
	CKEDITOR.ui.balloonToolbar.prototype.addItems = function( elements ) {
		for ( var itemName in elements ) {
			this.addItem( itemName, elements[ itemName ] );
		}
	};

	/**
	 * Retrieves a particular menu item from the Balloon Toolbar.
	 *
	 * @param {String} name The name of the desired menu item.
	 * @returns {CKEDITOR.ui.button/CKEDITOR.ui.richCombo}
	 */
	CKEDITOR.ui.balloonToolbar.prototype.getItem = function( name ) {
		return this._items[ name ];
	};

	/**
	 * Removes a particular menu item from the Balloon Toolbar.
	 *
	 * @param {String} name The name of the item menu to be deleted.
	 */
	CKEDITOR.ui.balloonToolbar.prototype.deleteItem = function( name ) {
		if ( this._items[ name ] ) {
			delete this._items[ name ];
			// Redraw balloon toolbar when item is removed.
			this._view.renderItems( this._items );
		}
	};

	/**
	 * Hides the toolbar and removes it from the DOM.
	 */
	CKEDITOR.ui.balloonToolbar.prototype.destroy = function() {
		this._pointedElement = null;
		this._view.destroy();
	};

	/**
	 * Class representing a single Balloon Toolbar context in the editor.
	 *
	 * It can be configured with a various of conditions for showing up the toolbar using `options` parameter.
	 *
	 * Multiple contexts are handled by the {@link CKEDITOR.plugins.balloontoolbar.contextManager Context Manager}.
	 *
	 * @class CKEDITOR.plugins.balloontoolbar.context
	 * @constructor Creates a Balloon Toolbar context instance.
	 * @since 4.8
	 * @param {CKEDITOR.editor} editor The editor instance for which the toolbar is created.
	 * @param {CKEDITOR.plugins.balloontoolbar.contextDefinition} options A set of options, defining context behavior.
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
		 * @property {CKEDITOR.plugins.balloontoolbar.contextDefinition}
		 */
		this.options = options;

		/**
		 * Toolbar instance pointed by context.
		 *
		 * @property {CKEDITOR.ui.balloonToolbar}
		 */
		this.toolbar = new CKEDITOR.ui.balloonToolbar( editor );

		if ( this.options && typeof this.options.priority === 'undefined' ) {
			this.options.priority = CKEDITOR.plugins.balloontoolbar.PRIORITY.MEDIUM;
		}

		this._loadButtons();
	}

	Context.prototype = {
		/**
		 * Destroys the toolbar maintained by this context.
		 */
		destroy: function() {
			if ( this.toolbar ) {
				this.toolbar.destroy();
			}
		},

		/**
		 * Shows the toolbar controlled by this context.
		 *
		 * @param {CKEDITOR.dom.element} [pointedElement] Element that should be pointed by the Balloon Toolbar.
		 */
		show: function( pointedElement ) {
			if ( pointedElement ) {
				this.toolbar.attach( pointedElement );
			}

			this.toolbar.show();
		},

		/**
		 * Hides the toolbar controlled by this context.
		 */
		hide: function() {
			this.toolbar.hide();
		},

		/**
		 * Performs matching against `options.refresh`.
		 *
		 * @private
		 * @param {CKEDITOR.dom.elementPath} path Element path to be checked.
		 * @param {CKEDITOR.dom.selection} selection Selection object to be passed to the `refresh` function.
		 * @returns {CKEDITOR.dom.element/null} Returns a {@link CKEDITOR.dom.element} if matched by `options.refresh`, `null` otherwise.
		 */
		_matchRefresh: function( path, selection ) {
			var ret = null;

			if ( this.options.refresh ) {
				ret = this.options.refresh( this.editor, path, selection ) || null;

				if ( ret && ret instanceof CKEDITOR.dom.element === false ) {
					ret = ( path && path.lastElement ) || this.editor.editable();
				}
			}

			return ret;
		},

		/**
		 * Checks if any of `options.widgets` widgets is currently focused.
		 *
		 * @private
		 * @returns {CKEDITOR.dom.element/null} Returns {@link CKEDITOR.dom.element} instance that toolbar should
		 * point to, if any matched widget is focused. `false` otherwise, meaning no tracked widget was matched.
		 */
		_matchWidget: function() {
			var widgetNames = this.options.widgets,
				ret = null;

			if ( widgetNames ) {
				var curWidgetName = this.editor.widgets && this.editor.widgets.focused && this.editor.widgets.focused.name;

				if ( typeof widgetNames === 'string' ) {
					widgetNames = widgetNames.split( ',' );
				}

				if ( CKEDITOR.tools.array.indexOf( widgetNames, curWidgetName ) !== -1 ) {
					ret = this.editor.widgets.focused.element;
				}
			}

			return ret;
		},

		/**
		 * Checks if given `element` matches `options.cssSelector` selector.
		 *
		 * @private
		 * @param {CKEDITOR.dom.element} elem Element to be tested.
		 * @returns {CKEDITOR.dom.element/null} {@link CKEDITOR.dom.element} instance if an element was matched,
		 * `null` otherwise.
		 */
		_matchElement: function( elem ) {
			// Note that IE8 doesn't have matching function at all.
			return this.options.cssSelector && matchingFunctionName && !!elem.$[ matchingFunctionName ]( this.options.cssSelector ) ?
				elem : null;
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
					var newUiItem = this.editor.ui.create( name );

					if ( newUiItem ) {
						this.toolbar.addItem( name, newUiItem );
					}
				}, this );
			}
		}
	};


	/**
	 * Class for managers that take care of handling multiple contexts.
	 *
	 * Manager also make sure that only one toolbar is active (per manager) at a time and implement the logic used to
	 * determine the best fitting context for a given selection. Default priorities are as follows:
	 *
	 * 1. Callback - `options.refresh`
	 * 1. Widgets matching - `options.widgets`
	 * 1. CSS matching - `options.cssSelector`
	 *
	 * It's worth noting that priorities could be further customized by explicitly providing {@link CKEDITOR.plugins.balloontoolbar.contextDefinition#priority},
	 * so that it's possible to match a widget over a refresh callback.
	 *
	 * @class CKEDITOR.plugins.balloontoolbar.contextManager
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
		 * @property {CKEDITOR.plugins.balloontoolbar.context[]}
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
		 * Creates a toolbar context based on provided `options`, registers it in the manager and returns.
		 *
		 *		// Shows bold and underline button for any selection.
		 *		var context = contextManager.create( {
		 *			buttons: 'Bold,Underline',
		 *			refresh: function() {
		 *			 	return true;
		 *			}
		 *		} );
		 *
		 * @param {CKEDITOR.plugins.balloontoolbar.contextDefinition} options Config object that determines the conditions used to display the toolbar.
		 * @returns {CKEDITOR.plugins.balloontoolbar.context} A context object created for this Balloon Toolbar configuration.
		 */
		create: function( options ) {
			var context = new CKEDITOR.plugins.balloontoolbar.context( this.editor, options );

			this.add( context );

			return context;
		},

		/**
		 * Adds a `context` to the tracked contexts list.
		 *
		 * @param {CKEDITOR.plugins.balloontoolbar.context} context
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

				// Shrink the selection so that we're ensured innermost elements are available, so that path for
				// selection like `foo [<em>bar</em>] baz` also contains `em` element.
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
				highlightElement,
				contextMatched;

			// This function encapsulates matching algorithm.
			function matchEachContext( contexts, matchingFunction, matchingArg1 ) {
				forEach( contexts, function( curContext ) {
					// Execute only if there's no picked context yet, or if probed context has a higher priority than
					// currently matched one.
					if ( !contextMatched || contextMatched.options.priority > curContext.options.priority ) {
						var result = matchingFunction( curContext, matchingArg1 );

						if ( result instanceof CKEDITOR.dom.element ) {
							highlightElement = result;
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
				// First check the outermost element (if any was selected), since the selection got shrinked
				// it would be otherwise skipped (#1274).
				var selectedElem = selection.getSelectedElement();

				if ( selectedElem && !selectedElem.isReadOnly() ) {
					matchEachContext( this._contexts, elementsMatcher, selectedElem );
				}

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
		 *
		 * @private
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

	var pluginInit = false,
		cssLoaded = false;

	CKEDITOR.plugins.add( 'balloontoolbar', {
		requires: 'balloonpanel',

		beforeInit: function() {
			if ( !cssLoaded ) {
				// Load fallback styles.
				CKEDITOR.document.appendStyleSheet( this.path + 'skins/default.css' );
				CKEDITOR.document.appendStyleSheet( this.path + 'skins/' + CKEDITOR.skin.name + '/balloontoolbar.css' );
				cssLoaded = true;
			}
		},

		init: function( editor ) {
			/**
			 * Balloon Toolbar manager for a given editor instance. It ensures that there's only one toolbar visible at a time.
			 *
			 * Use {@link CKEDITOR.plugins.balloontoolbar.contextManager#create} method to register a new toolbar context.
			 *
			 * Following example will add a toolbar containing link and unlink buttons for any anchor or image:
			 *
			 *		editor.balloonToolbars.create( {
			 *			buttons: 'Link,Unlink',
			 *			cssSelector: 'a[href], img'
			 *		} );
			 *
			 * @since 4.8
			 * @readonly
			 * @property {CKEDITOR.plugins.balloontoolbar.contextManager} balloonToolbars
			 * @member CKEDITOR.editor
			 */
			editor.balloonToolbars = new CKEDITOR.plugins.balloontoolbar.contextManager( editor );

			// Awful hack for overwriting prototypes of balloonToolbarView (#1142).
			if ( pluginInit ) {
				return;
			}
			pluginInit = true;
			CKEDITOR.ui.balloonToolbarView.prototype = CKEDITOR.tools.extend( {}, CKEDITOR.ui.balloonPanel.prototype );

			/**
			 * Builds Balloon Toolbar DOM representation.
			 *
			 * @member CKEDITOR.ui.balloonToolbarView
			 */
			CKEDITOR.ui.balloonToolbarView.prototype.build = function() {
				CKEDITOR.ui.balloonPanel.prototype.build.call( this );
				this.parts.panel.addClass( 'cke_balloontoolbar' );
				this.parts.title.remove();
				// Following workaround is needed until #1370 is resolved.
				this.deregisterFocusable( this.parts.close );
				this.parts.close.remove();
			};

			CKEDITOR.ui.balloonToolbarView.prototype.show = function() {
				if ( this.rect.visible ) {
					return;
				}
				var editable = this.editor.editable();
				this._detachListeners();

				function attachListener() {
					this.attach( this._pointedElement, {
						focusElement: false
					} );
				}

				this._listeners.push( this.editor.on( 'change', attachListener, this ) );
				this._listeners.push( this.editor.on( 'resize', attachListener, this ) );
				this._listeners.push( CKEDITOR.document.getWindow().on( 'resize', attachListener, this ) );
				this._listeners.push( editable.attachListener( editable.getDocument(), 'scroll', attachListener, this ) );

				CKEDITOR.ui.balloonPanel.prototype.show.call( this );
			};

			CKEDITOR.ui.balloonToolbarView.prototype.hide = function() {
				this._detachListeners();
				CKEDITOR.ui.balloonPanel.prototype.hide.call( this );
			};

			/**
			 * @inheritdoc CKEDITOR.ui.balloonPanel#blur
			 * @param {Boolean} [focusEditor=false] Whether the editor should be focused after blurring.
			 * @member CKEDITOR.ui.balloonToolbarView
			 */
			CKEDITOR.ui.balloonToolbarView.prototype.blur = function( focusEditor ) {
				if ( !!focusEditor ) {
					// This is actually different behavior from standard balloonpanel, where it always puts the focus back to editor.
					// We don't want to do it here, as e.g. we hide the toolbar as user leaves the editor (tabs out). Forcing focus
					// back to the editor would trap end user inside of the editor, and show the toolbar... again.
					this.editor.focus();
				}
			};

			CKEDITOR.ui.balloonToolbarView.prototype._getAlignments = function( elementRect, panelWidth, panelHeight ) {
				var alignments = CKEDITOR.ui.balloonPanel.prototype._getAlignments.call( this, elementRect, panelWidth, panelHeight );

				return {
					'bottom hcenter': alignments[ 'bottom hcenter' ],
					'top hcenter': alignments[ 'top hcenter' ]
				};
			};

			/**
			 * Detaches all listeners.
			 *
			 * @private
			 * @member CKEDITOR.ui.balloonToolbarView
			 */
			CKEDITOR.ui.balloonToolbarView.prototype._detachListeners = function() {
				if ( this._listeners.length ) {
					CKEDITOR.tools.array.forEach( this._listeners, function( listener ) {
						listener.removeListener();
					} );
					this._listeners = [];
				}
			};

			CKEDITOR.ui.balloonToolbarView.prototype.destroy = function() {
				this._deregisterItemFocusables();
				CKEDITOR.ui.balloonPanel.prototype.destroy.call( this );
				this._detachListeners();
			};

			/**
			 * Renders provided UI elements inside of the view.
			 *
			 * @param {CKEDITOR.ui.button[]/CKEDITOR.ui.richCombo[]} items Array of UI elements objects.
			 * @member CKEDITOR.ui.balloonToolbarView
			 */
			CKEDITOR.ui.balloonToolbarView.prototype.renderItems = function( items ) {
				var output = [],
					keys = CKEDITOR.tools.objectKeys( items ),
					groupStarted = false;

				// When we rerender toolbar we want to clear focusable in case of removing some items.
				this._deregisterItemFocusables();

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
				this.parts.content.unselectable();
				CKEDITOR.tools.array.forEach( this.parts.content.find( 'a' ).toArray(), function( element ) {
					element.setAttribute( 'draggable', 'false' );
					this.registerFocusable( element );
				}, this );
			};

			/**
			 * @inheritdoc CKEDITOR.ui.balloonPanel#attach
			 * @member CKEDITOR.ui.balloonToolbarView
			 */
			CKEDITOR.ui.balloonToolbarView.prototype.attach = function( element, options ) {

				/**
				 * DOM element used by Balloon Toolbar to attach to.
				 *
				 * @private
				 * @member CKEDITOR.ui.balloonToolbarView
				 */
				this._pointedElement = element;

				CKEDITOR.ui.balloonPanel.prototype.attach.call( this, element, options );
			};

			/**
			 * Method deregisters {@link #focusables} registered by UI items, like buttons.
			 *
			 * @private
			 * @since 4.8.1
			 * @member CKEDITOR.ui.balloonToolbarView
			 */
			CKEDITOR.ui.balloonToolbarView.prototype._deregisterItemFocusables = function() {
				var focusables = this.focusables;
				for ( var id in focusables ) {
					if ( this.parts.content.contains( focusables[ id ] ) ) {
						this.deregisterFocusable( focusables[ id ] );
					}
				}
			};
		}
	} );

	/**
	 * Static API exposed by the [Balloon Toolbar](https://ckeditor.com/cke4/addon/balloontoolbar) plugin.
	 *
	 * @class
	 * @singleton
	 */
	CKEDITOR.plugins.balloontoolbar = {
		context: Context,
		contextManager: ContextManager,

		/**
		 * Context priority enumeration. `HIGH` priority context are checked first.
		 *
		 * @readonly
		 * @property
		 */
		PRIORITY: {
			LOW: 999,
			MEDIUM: 500,
			HIGH: 10
		}
	};

	function getElementMatchFunctionName() {
		// Temporary here, until #1205 is not resolved.
		return CKEDITOR.tools.array.filter( [ 'matches', 'msMatchesSelector', 'webkitMatchesSelector', 'mozMatchesSelector', 'oMatchesSelector' ], function( fnName ) {
			// Note that only IE8 doesn't know HTMLElement,  nor it has msMatchesSelector so we can return false.
			return window.HTMLElement ? fnName in HTMLElement.prototype : false;
		} )[ 0 ];
	}

	/**
	 * This is an abstract class that describes the definition of a {@link CKEDITOR.plugins.balloontoolbar.context Balloon Toolbar Context}.
	 *
	 * **Note that context matching options have a different priority by default**, see more details in {@link CKEDITOR.plugins.balloontoolbar.contextManager}.
	 *
	 * @class CKEDITOR.plugins.balloontoolbar.contextDefinition
	 * @abstract
	 */

	/**
	 * A CSS selector. If any element in the path matches against it, the toolbar will be shown.
	 *
	 * @property {String/null} [cssSelector=null]
	 */

	/**
	 * An array of widget names that should show related toolbar. Alternatively can be passed as a comma-separated string.
	 *
	 * @property {String[]/String/null} [widgets=null]
	 */

	/**
	 * An **optional** function that determines whether the toolbar should be visible for a given `path`.
	 *
	 * An example below will show the toolbar only for paths containing `<strong>` elements.
	 *
	 *		// Assuming that editor is an CKEDITOR.editor instance.
	 *		// Show the toolbar only if there's a strong in the path.
	 *		editor.balloontoolbar.create( {
	 *			buttons: 'Bold,Underline',
	 *			refresh: function( editor, path ) {
	 *				return path.contains( 'strong' );
	 *			}
	 *		} );
	 *
	 *		// In this case toolbar will be always visible, pointing at the editable, despite the selection.
	 *		editor.balloontoolbar.create( {
	 *			buttons: 'Bold,Underline',
	 *			refresh: function( editor, path ) {
	 *				return editor.editable();
	 *			}
	 *		} );
	 *
	 * @method refresh
	 * @param {CKEDITOR.editor} editor An editor that controls this context.
	 * @param {CKEDITOR.dom.elementPath} path Path for a currently probed selection.
	 * @param {CKEDITOR.dom.selection} selection Selection object used for probing.
	 * @returns {Boolean/CKEDITOR.dom.element} Returning `true` means that the Balloon Toolbar should be shown, pointing
	 * at the last element in the selection. `false` means no toolbar should be shown.
	 * It may also return a {@link CKEDITOR.dom.element} instance, in that case toolbar will be shown and point at given
	 * element.
	 */

	/**
	 * A number based on {@link CKEDITOR.plugins.balloontoolbar#PRIORITY}.
	 *
	 *		var defA = {
	 *			buttons: 'Bold',
	 *			refresh: function() { return true; }
	 *		};
	 *
	 *		// Even though previous definition uses refresh function, it will not take priority
	 *		// over this definition, as it explicitly states high priority.
	 *		var defB = {
	 *			buttons: 'NumberedList,BulletedList',
	 *			cssSelector: 'li',
	 *			priority: CKEDITOR.plugins.balloontoolbar.PRIORITY.HIGH
	 *		};
	 *
	 *
	 * @property {Number} [priority=CKEDITOR.plugins.balloontoolbar.PRIORITY.MEDIUM]
	 */
}() );
