/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

'use strict';

(function() {

	var wrapperDef = {
		// tabindex="-1" means that it can receive focus by code.
		'tabindex': -1,
		'data-widget-wrapper': 1,
		'style': 'position:relative;' + ( !CKEDITOR.env.gecko ?
			CKEDITOR.tools.cssVendorPrefix( 'user-select', 'none', 1 ) : '' ),
		'class': 'cke_widget_wrapper'
	};

	CKEDITOR.plugins.add( 'widget', {
		requires: 'dialog,menubutton',
		icons: 'widget',

		onLoad: function() {
			CKEDITOR.addCss(
				'.cke_widget_wrapper:hover{' +
					'outline:2px solid yellow;' +
					'cursor:default;' +
				'}' +
				'.cke_widget_wrapper:hover .cke_widget_editable{' +
					'outline:2px solid yellow;' +
				'}' +
				'.cke_widget_editable:focus,' +
				'.cke_widget_wrapper:hover .cke_widget_editable:focus,' +
				'.cke_widget_wrapper:focus{' +
					'outline:2px solid Highlight;' +
				'}'
			);
		},

		beforeInit: function( editor ) {
			editor.widgets = new Repository( editor );
			CKEDITOR.event.implementOn( editor.widgets );
		},

		afterInit: function( editor ) {
			var toBeWrapped = [];

			addWidgetButtons( editor );

			// We cannot change DOM structure during processing with filter,
			// so first - cache all elements in data-widget attribute and then,
			// just after filter has been applied, wrap all widgets.
			// We could use frag.forEach() in 'toHtml' listener, but it's better to
			// avoid another loop.
			editor.on( 'toHtml', function( evt ) {
				var el;

				while ( ( el = toBeWrapped.pop() ) ) {
					// Wrap only if still has parent (hasn't been removed).
					el.parent && editor.widgets.wrapElement( el );
				}
			}, null, null, 11 );
			editor.dataProcessor.dataFilter.addRules( {
				elements: {
					$: function( element ) {
						if ( 'data-widget' in element.attributes )
							toBeWrapped.push( element );
					}
				}
			} );

			editor.dataProcessor.htmlFilter.addRules( {
				elements: {
					$: function( element ) {
						if ( 'data-widget-id' in element.attributes ) {
							// We assume that widget consist of a single element wrapping its contents.
							var widget = editor.widgets.getById( element.attributes[ 'data-widget-id' ] );

							return widget ? CKEDITOR.htmlParser.fragment.fromHtml( widget.getHtml() ).children[ 0 ] : '';
						}
					}
				}
			} );

			editor.on( 'afterPaste', function() {
				initializeWidgets( editor );
			});

			editor.on( 'mode', function( event ) {
				if ( editor.mode != 'wysiwyg' )
					return;

				initializeWidgetClick( editor );
			});

			editor.on( 'dataReady', function() {
				initializeWidgets( editor );
			});

			editor.on( 'loadSnapshot', function() {
				initializeWidgets( editor );
			}, null, null, 11 );

			editor.on( 'paste', function( event ) {
				var data = event.data.dataValue;

				if ( data.match( /data-widget-cbin-direct/g ) ) {
					// Clean DIV wrapper added by FF when copying.
					data = data.replace( /^<div>(.*)<\/div>$/g, '$1' );

					// Clean widget markers.
					data = data.replace( /^(<span[^>]*>)?cke-dummy-before\[(<\/span>)?/g, '' );
					data = data.replace( /(<span[^>]*>)?\]cke-dummy-after(<\/span>|<br>)?$/g, '' );

					event.data.dataValue = data;
				}
			});

			editor.on( 'key', function( evt ) {
				var sel = editor.widgets.selected,
					key = evt.data.keyCode,
					editable = editor.editable(),
					range = new CKEDITOR.dom.range( editor.document );

				if ( sel ) {
					// When there's a selected widget instance.
					switch ( key ) {
						// BACKSPACE and DEL
						case 8:
						case 46:
							editor.fire( 'saveSnapshot' );

							range.moveToClosestEditablePosition( sel.wrapper );
							range.select();

							// Remove the element from the DOM.
							sel.wrapper.remove();

							// Cleanup the selection pointer.
							delete editor.widgets.selected;

							// Stop these keys here.
							evt.cancel();
							editor.focus();

							editor.fire( 'saveSnapshot' );
							break;

						case 13:	// RETURN
							sel.edit && sel.edit();
							evt.cancel();
							break;

						case CKEDITOR.CTRL + 88:	// CTRL+X
						case CKEDITOR.CTRL + 67:	// CTRL+C
							copyDataByCopyBin( evt, editor, editable, sel, key );
							break;

						// De-select selected widget with arrow keys.
						// Move the caret to the closest focus space according
						// to which key has been pressed.
						case 37:	// ARROW LEFT
						case 39:	// ARROW RIGHT
						case 38: 	// ARROW UP
						case 40: 	// ARROW BOTTOM
							var siblingWidget;


							// Firefox needs focus to be called. Otherwise,
							// it won't move the caret. It looks like it's confused
							// by the fact, that there are no ranges in editable
							// when the widget is selected (see: widget.focus()).
							if ( CKEDITOR.env.gecko )
								editor.focus();

							if ( siblingWidget = getSiblingWidget( editor, sel.wrapper, key in { 39:1, 40:1 } ) ) {
								siblingWidget.select();
							}
							else if ( range.moveToClosestEditablePosition( sel.wrapper, key in { 39:1, 40:1 } ) ) {
								range.select();
								sel.blur();
							}

							// Always cancel this kind of keyboard event if widget is selected.
							evt.cancel();
					}
				}
				else {
					// When there's no selected widget.
					switch ( key ) {
						// Observe where does the caret go when ARROW UP|DOWN key
						// is pressed. If it goes into an existing widget instance,
						// select this instance.
						case 38: 	// ARROW UP
						case 40: 	// ARROW BOTTOM
							var range = editor.getSelection().getRanges()[ 0 ],
								startContainer = range.startContainer;

							// If startContainer before the caret moves belongs to some
							// editable, then we navigate INSIDE of the widget.
							// Abort widget selection procedure in such case.
							if ( inEditables( editor, startContainer ) )
								return;

							setTimeout( function() {
								range = editor.getSelection().getRanges()[ 0 ];

								var widget = editor.widgets.getByElement( range.startContainer );
								widget && widget.select();
							}, 0 );
							break;

						// Navigate thorough widgets with ARROW LEFT|RIGHT keys.
						case 37: 	// ARROW LEFT
						case 39: 	// ARROW RIGHT
							var instances = editor.widgets.instances,
								selRange = editor.getSelection().getRanges()[ 0 ],
								startContainer = selRange.startContainer,
								wrapper;

							// If startContainer before the caret moves belongs to some
							// editable, then we navigate INSIDE of the widget.
							// Abort widget selection procedure in such case.
							if ( inEditables( editor, startContainer ) )
								return;

							selRange.collapse();
							selRange.optimize();

							// Iterate over all widget instances and check whether
							// current selection range matches some of the closest
							// focus spaces.
							for ( var i = instances.length; i-- ; ) {
								wrapper = instances[ i ].wrapper;

								if ( range.moveToClosestEditablePosition( wrapper, key == 37 ) &&
									 range.startContainer.equals( selRange.startContainer ) &&
									 range.startOffset == selRange.startOffset ) {
									instances[ i ].select();
									evt.cancel();
								}
							}
					}
				}

				switch ( key ) {
					case CKEDITOR.CTRL + 65:	// CTRL+A
						var element = editor.getSelection().getStartElement();

						if ( !element )
							return;

						while ( element ) {
							if ( element.equals( editable ) )
								return;

							if ( element.hasClass( 'cke_widget_editable' ) )
								break;

							element = element.getParent();
						}

						range.selectNodeContents( element );
						range.select();

						evt.cancel();
				}
			} );
		}
	});

	/**
	 * @class CKEDITOR.plugins.widget.repository
	 */
	function Repository( editor ) {
		this.editor = editor;
		this.registered = {};
		this.instances = [];
	}

	Repository.prototype = {
		/**
		 * Adds widget definition to the repository.
		 *
		 * @param {String} name
		 * @param {CKEDITOR.plugins.widget.definition} widgetDef
		 */
		add: function( name, widgetDef ) {
			this.registered[ name ] = widgetDef;
			widgetDef.name = name;
			widgetDef.commandName = 'widget' + CKEDITOR.tools.capitalize( name );

			addWidgetDialog( widgetDef );
			addWidgetCommand( this.editor, widgetDef );
		},

		/**
		 * Gets widget instance by element which may be
		 * widget's wrapper or any of its children.
		 *
		 * @param {CKEDITOR.dom.element} element
		 * @returns {CKEDITOR.plugins.widget} Widget instance or `null`.
		 */
		getByElement: function( element ) {
			if ( !element )
				return null;

			var wrapper;

			for ( var i = this.instances.length; i--; ) {
				wrapper = this.instances[ i ].wrapper;
				if ( wrapper.equals( element ) || wrapper.contains( element ) )
					return this.instances[ i ];
			}

			return null;
		},

		/**
		 * TODO is it needed?
		 */
		remove: function( widgetObj ) {
			this.instances.splice( this.instances.indexOf( widgetObj ), 1 );
		},

		/**
		 * Gets widget instance by its id.
		 *
		 * @param {Number} id
		 * @returns {CKEDITOR.plugins.widget}
		 */
		getById: function( id ) {
			for ( var i = this.instances.length ; i-- ; ) {
				if ( this.instances[ i ].id == id )
					return this.instances[ i ];
			}

			return null;
		},

		/**
		 * Initializes widget for given element.
		 *
		 * @param {CKEDITOR.dom.element} element
		 * @param {String/CKEDITOR.plugins.widget.definition} widget Name of a widget type or a widget definition.
		 * Widget definition should be previously registered by {@link CKEDITOR.plugins.widget.repository#add}.
		 * @returns {CKEDITOR.plugins.widget} The widget instance.
		 */
		init: function( element, widgetDef ) {
			if ( !widgetDef )
				widgetDef = this.registered[ element.data( 'widget' ) ];
			else if ( typeof widgetDef == 'string' )
				widgetDef = this.registered[ widgetDef ];

			// Wrap element if still wasn't wrapped (was added during runtime by method that skips dataProcessor).
			this.wrapElement( element );

			var widget = new Widget( this.editor, this.instances.length, element, widgetDef );
			this.instances.push( widget );
			return widget;
		},

		/**
		 * Wraps element with a widget container.
		 *
		 * @param {CKEDITOR.dom.element/CKEDITOR.htmlParser.element} The widget element to be wrapperd.
		 * @param {String} [widgetName]
		 * @returns {CKEDITOR.dom.element/CKEDITOR.htmlParser.element} The wrapper element or `null` if
		 * widget of this type is not registered.
		 */
		wrapElement: function( element, widgetName ) {
			var wrapper = null;

			if ( element instanceof CKEDITOR.dom.element ) {
				var widget = this.registered[ widgetName || element.data( 'widget' ) ];
				if ( !widget )
					return null;

				// Do not wrap already wrapped element.
				wrapper = element.getParent();
				if ( wrapper && wrapper.type == CKEDITOR.NODE_ELEMENT && wrapper.data( 'widget-wrapper' ) )
					return wrapper;

				wrapper = new CKEDITOR.dom.element( widget.inline ? 'span' : 'div' );
				wrapper.setAttributes( wrapperDef );
				wrapper.replace( element );
				element.appendTo( wrapper );
			}
			else if ( element instanceof CKEDITOR.htmlParser.element ) {
				var widget = this.registered[ widgetName || element.attributes[ 'data-widget' ] ];
				if ( !widget )
					return null;

				wrapper = element.parent;
				if ( wrapper && wrapper.type == CKEDITOR.NODE_ELEMENT && wrapper.attributes[ 'data-widget-wrapper' ] )
					return wrapper;

				wrapper = new CKEDITOR.htmlParser.element( widget.inline ? 'span' : 'div', wrapperDef );
				element.replaceWith( wrapper );
				wrapper.add( element );
			}

			return wrapper;
		}
	};

	/**
	 * @class CKEDITOR.plugins.widget
	 */
	function Widget( editor, id, element, widgetObj ) {

		// Extend this widget with widgetObj-specific
		// methods and properties.
		CKEDITOR.tools.extend( this, widgetObj, {
			editor: editor,
			id: id,
			element: element,
			parts: findParts( element ),
			blurListeners: []
		}, true );


		editor.widgets.fire( 'beforeWidgetCreated', this );

		// We don't want all the dirty things we do to the widget to be recorded
		// by the undo manager because double (empty) snapshots are produced
		// (selection goes nuts). Better lock it and never let it know what's going on below
		// so eventually we have a single snapshot.
		editor.fire( 'lockSnapshot' );

		this.setupWrapper();
		this.setupEditables();
		this.setupMask();
		this.removeOutline();
		this.setupHidden();
		this.setupSelected();
		this.setupPasted();

		this.init && this.init();
		editor.widgets.fire( 'widgetInited', this );

		this.updateData();


		// Remember that this widget has already been initialized.
		var wasInited = this.setInit();

		// Disable contenteditable on the wrapper once the initialization process
		// is over and selection is set (i.e. after setupPasted). This prevents
		// from selection being put at the beginning of editable.
		this.wrapper.setAttribute( 'contenteditable', false );
		editor.widgets.fire( 'widgetDeeditable', this );

		// Since widget is ready, we can unlock the undo system so it operates
		// normally. Now we basically overwrite the last snapshot with the latest one
		// so it feels like nothing happened.
		editor.fire( 'unlockSnapshot' );
		!wasInited && editor.fire( 'updateSnapshot' );

		editor.widgets.fire( 'widgetCreated', this );
	}

	Widget.prototype = {
		updateData: function() {
			// By default do nothing.
		},

		blur: function() {
			if ( this.editor.widgets.selected == this ) {
				this.removeOutline();
				delete this.editor.widgets.selected;
				this.element.removeAttribute( 'data-widget-selected' );

				this.editor.widgets.fire( 'widgetBlur', this );
			}
		},

		destroy: function() {
			// Remove editables from focusmanager.
			if ( this.editables ) {
				for ( var name in this.editables )
					this.editor.focusManager.remove( this.editables[ name ] );
			}

			CKEDITOR.dom.element.createFromHtml( this.getHtml() ).replace( this.wrapper );
		},

		edit: function() {
			if ( !this.dialog )
				return;

			var that = this;

			this.editor.widgets.fire( 'widgetEdit', this );

			this.editor.openDialog( this.dialogName, function( dialog ) {
				this.on( 'show', function( event ) {
					that.editor.fire( 'saveSnapshot' );
					that.updateData();
					this.setupContent( that );
					event.removeListener();
				});
				this.on( 'ok', function( event ) {
					this.commitContent( that );
					that.updateData();
					that.editor.fire( 'saveSnapshot' );
					event.removeListener();
				});
				this.on( 'hide', function( event ) {
					that.select( 1 );
					that.updateData();
					event.removeListener();
				});
			} );
		},

		// Returns clean, stripped, HTML version of the widget.
		getHtml: function() {
			this.updateData();
			return this.template.output( this.data );
		},

 		// Check if widget has already been initialized. This means, for example,
		// that widget has mask, element styles have been transferred to wrapper etc.
		isInit: function() {
			if ( !this.wrapper )
				return false;

			return this.wrapper.hasAttribute( 'data-widget-wrapper-init' );
		},

		removeOutline: function() {
			this.wrapper.removeStyle( 'outline' );
		},

		removeBlurListeners: function() {
			var listener;
			while ( ( listener = this.blurListeners.pop() ) )
				listener.removeListener();
		},

		select: function( force ) {
			var that = this,
				widgets = this.editor.widgets;

			if ( !force && widgets.selected && widgets.selected == this )
				return;

			// If clicked again without blurring - remove old listeners
			// before attaching the new ones.
			this.removeBlurListeners();

			// If one of the widgets is selected, then blur it and
			// mark this widget as selected.
			if ( widgets.selected && widgets.selected != this )
				widgets.selected.blur();

			widgets.selected = this;

			this.element.setAttribute( 'data-widget-selected' );

			this.setOutline();

			if ( CKEDITOR.env.ie )
				setTimeout( function() {
					!that.editor.focusManager.hasFocus && that.editor.focus();
				}, 0 );
			else
				that.wrapper.focus();

			that.editor.getSelection().fake( that.wrapper );

			widgets.fire( 'widgetSelected', this );

			setTimeout( function() {
				blurOn( 'selectionChange' );
				blurOn( 'blur' );
			}, 0 );

			function blurOn( eventName ) {
				that.blurListeners.push( that.editor.on( eventName, callback, that.editor ) );
			}

			function callback( event ) {
				// Do not blur if widget remains selected on selectionChange.
				if ( event.name == 'selectionChange' && that == getWidgetFromSelection( that.editor, event.data.selection ) )
					return false;

				that.removeBlurListeners();
				that.blur();
			}
		},

		// Marks widget initialized.
		setInit: function() {
			if ( !this.wrapper.hasAttribute( 'data-widget-wrapper-init' ) ) {
				this.wrapper.setAttribute( 'data-widget-wrapper-init', 1 );
				return false;
			}

			return true;
		},

		setOutline: function() {
			this.wrapper.setStyle( 'outline', '2px solid Highlight' );
		},

		setupWrapper: function() {
			// Retrieve widget wrapper. Assign an id to it.
			var wrapper = this.element.getParent();
			wrapper.setAttribute( 'data-widget-id', this.id );

			this.wrapper = wrapper;
			this.editor.focusManager.add( wrapper );
		},

		// Makes widget editables editable, selectable, etc.
		// Adds necessary classes, properties, and styles.
		// Also adds editables to focusmanager.
		setupEditables: function() {
			if ( !this.editables )
				return;

			var editables = this.editables(),
				that = this,
				editable;

			// Initialize nested editables.
			for ( var name in editables ) {
				editable = editables[ name ];
				editable.setAttribute( 'contenteditable', true );
				editable.setStyle( 'cursor', 'text' );
				editable.setStyles( CKEDITOR.tools.cssVendorPrefix( 'user-select', 'text' ) );
				editable.addClass( 'cke_widget_editable' );
				editable.setAttribute( 'data-widget-editable' );
				this.editor.focusManager.add( editable );

				// Fix DEL and BACKSPACE behaviour in widget editables. Make sure
				// that pressing BACKSPACE|DEL at the very beginning|end of editable
				// won't move caret outside of editable.
				if ( !this.isInit() ) {
					( function( editable ) {
						editable.on( 'keydown', function( event ) {
							var key = event.data.getKey(),
								range = that.editor.getSelection().getRanges()[ 0 ];

							if ( key in { 8:1, 46:1 } ) {
								if ( range.collapsed &&
									range.checkBoundaryOfElement( editable, CKEDITOR[ key == 8 ? 'START' : 'END' ] ) ) {
										event.data.preventDefault();
								}

								event.data.stopPropagation();
							}
						});
					} )( editable );
				}
			}

			this.editables = editables;
		},

		// Since browser clipboard ignores hidden elements, widgets mark such elements
		// with a specific attribute and remove CSS. This method reverts this
		// process: elements with a specific attribute are being hidden with CSS styles.
		// Eventually an attribute is removed as well.
		setupHidden: function() {
			var elements = this.wrapper.getElementsByTag( '*' ),
				i = 0,
				element;

			while ( ( element = elements.getItem( i++ ) ) ) {
				if ( element.hasAttribute( 'data-widget-hidden' ) ) {
					element.removeAttribute( 'data-widget-hidden' );
					element.setStyle( 'display', 'none' );
				}
			}
		},

		// Since webkit (also FF) destroys the selection when pasting a widget (only a widget,
		// NOTHING more), we can detect this case since we marked such widget with
		// and attribute. We restore the caret after the widget once it is ready and
		// remove the attribute so it looks pretty much like a regular, non-pathological paste.
		setupPasted: function() {
			if ( this.element.hasAttribute( 'data-widget-cbin-direct' ) ) {
				var range = new CKEDITOR.dom.range( this.editor.document ),
					siblingWidget;

				// If there's a widget right after this one, we cannot move the caret after it.
				// Select this widget in such case.
				if ( getSiblingWidget( this.editor, this.wrapper, 1 ) )
					this.select();

				// Also if, somehow, there's no space to move caret (i.e. first and only child
				// of editable), basically select this widget.
				else if ( !range.moveToClosestEditablePosition( this.wrapper, 1 ) )
					this.select();

				// If there's a possibility to move the caret, let's do it.
				else
					range.select();

				// Clean-up the mess we did. The better is, the less attributes we have.
				this.element.removeAttribute( 'data-widget-cbin-direct' );

				this.editor.widgets.fire( 'widgetSetupPasted', this );
			}
		},

		// If the widget has an appropriate attribute, i.e. it was selected when
		// being deleted, this attribute allows re-selecting it on undo.
		setupSelected: function() {
			if ( this.element.hasAttribute( 'data-widget-selected' ) ) {
				this.element.removeAttribute( 'data-widget-selected' );
				this.editor.widgets.fire( 'widgetSetupSelected', this );
				this.select();
			}
		},

		setupMask: function() {
			if ( this.isInit() )
				return;

			// When initialized for the first time.
			if ( this.needsMask ) {
				var img = CKEDITOR.dom.element.createFromHtml(
					'<img src="data:image/gif;base64,R0lGODlhAQABAPABAP///wAAACH5BAEKAAAALAAAAAABAAEAAAICRAEAOw%3D%3D" ' +
					'style="position:absolute;width:100%;height:100%;top:0;left:0;" draggable="false">' );

				img.appendTo( this.wrapper );
			}
		}
	};

	var whitespaceEval = new CKEDITOR.dom.walker.whitespaces(),
		bookmarkEval = new CKEDITOR.dom.walker.bookmark();

	function nonWhitespaceOrBookmarkEval( node ) {
		// Whitespaces and bookmark nodes are to be ignored.
		return !whitespaceEval( node ) && !bookmarkEval( node );
	}

	function findParts( element ) {
		var parts = {};

		forEachChild( element, function( node ) {
			if ( node.type == CKEDITOR.NODE_ELEMENT && node.hasAttribute( 'data-widget-property' ) )
				parts[ node.getAttribute( 'data-widget-property' ) ] = node;
		});

		return parts;
	}

	function inEditable( widget, target ) {
		var editables = widget.editables,
			inEditable,
			name, editable;

		if ( editables ) {
			for ( name in editables ) {
				if ( ( editable = editables[ name ] ).equals( target ) || editable.contains( target ) )
					return true;
			}
		}

		return false;
	}

	// Iterates over all widgets and all widget editables
	// to check if the element is is a child of editable or editable itself.
	function inEditables( editor, element ) {
		if ( !element )
			return false;

		var instances = editor.widgets.instances;

		for ( var i = instances.length ; i-- ; ) {
			if ( inEditable( instances[ i ], element ) )
				return true;
		}

		return false;
	}

	function getSelectedWidget( editor, element ) {
		var initialElement = element;

		if ( element.type == CKEDITOR.NODE_TEXT )
			element = element.getParent();

		var editable = editor.editable();

		while ( element && !element.hasAttribute( 'data-widget-wrapper' ) ) {
			if ( element.equals( editable ) )
				return null;

			element = element.getParent();
		}

		if ( element && element.hasAttribute( 'data-widget-id' ) ) {
			var widget = editor.widgets.getByElement( element );

			if ( !inEditable( widget, initialElement ) )
				return widget;
		}

		return null;
	}

	function getWidgetFromSelection( editor, selection ) {
		var selectionInstance = selection || editor.getSelection();

		// FF moves the caret to the inside of the widget and getSelectedElement is null.
		// Retrieve widget via getStartElement then.
		var element = selectionInstance.getSelectedElement() || selectionInstance.getStartElement(),
			widget;

		if ( !element )
			return null;

		if ( ( widget = getSelectedWidget( editor, element ) ) )
			return widget;

		return null;
	}

	// Check if there's a widget instance in the neighbourhood
	// of the element (previous or next node, ignoring whitespaces and bookmarks).
	// If found, such instance is returned.
	function getSiblingWidget( editor, element, getNext ) {
		var widget;

		if ( ( widget = editor.widgets.getByElement( element[ getNext ? 'getNext' : 'getPrevious' ]( nonWhitespaceOrBookmarkEval ) ) ) )
			return widget;

		return null;
	}

	var initializeWidgetClick = ( function() {
		function callback( event ) {

			var element = event.data.getTarget(),
				widget = getSelectedWidget( this, element );

			// Check if the widget is selected.
			if ( widget ) {
				event.data.preventDefault();

				widget.select();

				if ( event.name == 'dblclick' )
					widget.edit && widget.edit();

				// Always return false except contextmenu event.
				// This is since we want contextmenu for widgets.
				return event.name == 'contextmenu';
			}
		}

		function removeListeners( editor ) {
			var listeners = editor.widgets.listeners;

			if ( !listeners )
				return;

			var listener;

			while ( ( listener = listeners.pop() ) )
				listener.removeListener();
		}

		function attachListener( editor ) {
			var listeners = editor.widgets.listeners,
				editable = editor.editable();

			if ( !listeners )
				listeners = [];

			listeners.push( editable.on.apply( editable, Array.prototype.slice.call( arguments, 1 ) ) );
		}

		return function( editor ) {
			removeListeners( editor );

			// Select widget when double-click to open dialog.
			attachListener( editor, 'dblclick', callback, editor, null, 1 );

			// Click on the widget wrapper to select it as a whole.
			attachListener( editor, 'click', callback, editor, null, 1 );

			// Also select widget when showing contextmenu.
			attachListener( editor, 'contextmenu', callback, editor, null, 1 );

			// Make sure that no double selectionChange is fired. Cancel mousedown before
			// selection system catches it when widget is selected.
			attachListener( editor, 'mousedown', callback, editor, null, 1 );
		}
	})();

	function addContextMenu( editor, widgetName, commandName ) {
		if ( editor.contextMenu ) {
			var groupName = 'widget' + CKEDITOR.tools.capitalize( widgetName ) + 'Group';

			editor.addMenuGroup( groupName );
			editor.addMenuItem( commandName, {
				label: 'Edit ' + CKEDITOR.tools.capitalize( widgetName ),
				icon: 'icons/foo.png',
				command: commandName,
				group: groupName
			});

			editor.contextMenu.addListener( function( element ) {
				if ( !element )
					return null;

				var selected = getWidgetFromSelection( editor ) || editor.widgets.selected;

				if ( selected && selected.name == widgetName ) {
					var menu = {};
					menu[ commandName ] = CKEDITOR.TRISTATE_OFF;
					return menu;
				}
			});
		}
	}
	function copyDataByCopyBin( evt, editor, editable, selected, key ) {
		var copybin = new CKEDITOR.dom.element( 'div', editor.document ),
			isCut = key == CKEDITOR.CTRL + 88;

		editable.append( copybin );

		var clone = CKEDITOR.dom.element.createFromHtml( selected.getHtml() ),
			cloneElements = clone.getElementsByTag( '*' ),
			i = 0,
			element;


		// By default, web browsers ignore hidden elements when copying
		// to the clipboard. To have them copied and properly pasted, they must
		// be marked by an attribute and have display:none style removed.
		while ( ( element = cloneElements.getItem( i++ ) ) ) {
			if ( element.getStyle( 'display' ) == 'none' ) {
				element.setAttribute( 'data-widget-hidden', 1 );
				element.removeStyle( 'display' );
			}
		}

		// Mark the widget with an attribute to let know that widget was the ONLY
		// thing copied to the clipboard. Since webkit (and FF as well) destroys selection when
		// pasting the widget (and only a single widget, nothing more), this will help
		// us with moving the caret after the widget once it is ready.
		clone.setAttribute( 'data-widget-cbin-direct', 1 );

		// (#9909) insert dummy nodes to fix webkit issues. This will also
		// let us extract the widget in Firefox, since it's copied with additional
		// wrapper.
		copybin.setHtml( 'cke-dummy-before[' + clone.getOuterHtml() + ']cke-dummy-after' );

		// Don't let the selected widget call blur when being removed during cutting.
		isCut && selected.removeBlurListeners();

		// Once the clone of the widget is inside of copybin, select
		// the entire contents. This selection will be copied by the
		// native browser's clipboard system.
		var range = new CKEDITOR.dom.range( editor.document );
		range.selectNodeContents( copybin );
		range.select();

		setTimeout( function() {
			// Fool the undo system. Make all the changes a single snapshot.
			editor.fire( 'lockSnapshot' );

			copybin.remove();

			// In case of CTRL+X, put selection to the closest previous
			// editable position to simulate a real, native cutting process.
			if ( isCut ) {
				range.moveToClosestEditablePosition( selected.wrapper );
				range.select();

				delete editor.widgets.selected;

				// Remove widget from DOM when cutting.
				selected.wrapper.remove();

				if ( CKEDITOR.env.gecko )
					editor.focus();
			} else
				selected.select();

 			// Unlock the undo so it operates normally.
			editor.fire( 'unlockSnapshot' );
		}, 0 );
	}

	//
	// REPOSITORY helpers -----------------------------------------------------
	//

	function addWidgetButtons( editor ) {
		var widgets = editor.widgets.registered,
			widget,
			widgetName,
			widgetButton,
			commandName,
			allowedContent = [],
			rule,
			buttons = {},
			buttonsStates = {},
			hasButtons = 0,
			menuGroup = 'widgetButton';

		for ( widgetName in widgets ) {
			widget = widgets[ widgetName ];
			commandName = widget.commandName;

			// Create button if defined.
			widgetButton = widget.button;
			if ( widgetButton ) {
				buttons[ commandName ] = {
					label: widgetButton.label,
					group: menuGroup,
					command: commandName
				};
				buttonsStates[ commandName ] = CKEDITOR.TRISTATE_OFF;
				hasButtons = 1;

				if ( widget.allowedContent )
					allowedContent.push( widget.allowedContent );
				if ( widget.widgetTags ) {
					rule = {};
					rule[ widget.widgetTags ] = {
						attributes: /^data-widget/
					};
					allowedContent.push( rule );
				}
			}

			addContextMenu( editor, widgetName, commandName );
		}

		if ( hasButtons ) {
			editor.addMenuGroup( menuGroup );
			editor.addMenuItems( buttons );

			editor.ui.add( 'Widget', CKEDITOR.UI_MENUBUTTON, {
				allowedContent: allowedContent,
				label: 'Widget',
				title: 'Widgets',
				modes: { wysiwyg:1 },
				toolbar: 'insert,1',
				onMenu: function() {
					return buttonsStates;
				}
			});
		}
	}

	// Create command - first check if widget.command is defined,
	// if not - try to create generic one based on widget.template
	function addWidgetCommand( editor, widget ) {
		if ( widget.command )
			editor.addCommand( widget.commandName, widget.command );
		else {
			editor.addCommand( widget.commandName, {
				exec: function() {
					var selected = editor.widgets.selected;
					// If a widget of the same type is selected, start editing.
					if ( selected && selected.name == widget.name )
						selected.edit && selected.edit();

					// Otherwise, create a brand-new widget from template.
					else if ( widget.template ) {
						var	element = CKEDITOR.dom.element.createFromHtml( widget.template.output( widget.defaults ) ),
							wrapper = new CKEDITOR.dom.element( widget.inline ? 'span' : 'div' ),
							instance;

						wrapper.setAttributes( wrapperDef );
						wrapper.append( element );

						editor.insertElement( wrapper );
						instance = editor.widgets.init( element, widget )
						instance.select();
						instance.edit && instance.edit();
					}
				}
			});
		}
	}

	function addWidgetDialog( widgetDef ) {
		// If necessary, Create dialog for this registered widget.
		if ( widgetDef.dialog ) {
			// Generate the name for this dialog.
			var dialogName = widgetDef.dialogName = 'widget' +
				CKEDITOR.tools.capitalize( widgetDef.name ) + 'Dialog';

			CKEDITOR.dialog.add( dialogName, function( editor ) {
				// Widget dialog definition is extended with generic
				// properties and methods.
				var dialog = widgetDef.dialog,
					elements = dialog.elements;

				delete dialog.elements;

				return CKEDITOR.tools.extend( {
						minWidth: 200,
						minHeight: 100
					}, {
						contents: [
							{ elements: elements }
						]
					},
					dialog,
				true );
			} );
		}
	}

	function findElementsByType( root, type ) {
		var elements = [],
			typeAttr;

		// Walker used to traverse DOM tree.
		forEachChild( root, function( node ) {
			if ( node.type == CKEDITOR.NODE_ELEMENT &&
					( typeAttr = node.getAttribute( 'data-widget' ) ) &&
					( typeAttr == type ) )
				elements.push( node );
		} );

		return elements;
	}

	function forEachChild( element, callback ) {
		var elements = element.getElementsByTag( '*' );

		for ( var i = 0, l = elements.count(); i < l; ++i ) {
			callback( elements.getItem( i ) );
		}
	}

	function initializeWidget( repo, widgetObj, widgets ) {
		var elements = findElementsByType( repo.editor.editable(), widgetObj.name ),
			newElements = [],
			element;

		// Initialize only widgets by elements that don't belong to existing widget.
		while ( ( element = elements.pop() ) )
			!widgets.getByElement( element ) && newElements.push( element );

		while ( ( element = newElements.pop() ) )
			repo.init( element, widgetObj );
	}

	function initializeWidgets( editor ) {
		var widgets = editor.widgets,
			registered = widgets.registered,
			name, instance;

		// Get rid of non-existing instances first.
		for ( var i = widgets.instances.length ; i-- ; ) {
			if ( !widgets.instances[ i ].wrapper.isVisible() ) {
				if ( widgets.instances[ i ] == widgets.selected )
					delete widgets.selected;

				widgets.instances.splice( i, 1 );
			}
		}

		for ( name in registered )
			initializeWidget( widgets, registered[ name ], widgets );

		editor.fire( 'widgetsInitialized' );
	}

	//
	// EXPOSE PUBLIC API ------------------------------------------------------
	//
	CKEDITOR.plugins.widget = Widget;
	Widget.repository = Repository;
})();
