﻿/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

/**
 * @fileOverview [Widget](https://ckeditor.com/cke4/addon/widget) plugin.
 */

'use strict';

( function() {
	var DRAG_HANDLER_SIZE = 15;

	CKEDITOR.plugins.add( 'widget', {
		// jscs:disable maximumLineLength
		lang: 'af,ar,az,bg,ca,cs,cy,da,de,de-ch,el,en,en-au,en-gb,eo,es,es-mx,et,eu,fa,fi,fr,gl,he,hr,hu,id,it,ja,km,ko,ku,lt,lv,nb,nl,no,oc,pl,pt,pt-br,ro,ru,sk,sl,sq,sr,sr-latn,sv,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		// jscs:enable maximumLineLength
		requires: 'lineutils,clipboard,widgetselection',
		onLoad: function() {
			// Widgets require querySelectorAll for proper work (#1319).
			if ( CKEDITOR.document.$.querySelectorAll === undefined ) {
				return;
			}
			CKEDITOR.addCss(
				'.cke_widget_wrapper{' +
					'position:relative;' +
					'outline:none' +
				'}' +
				'.cke_widget_inline{' +
					'display:inline-block' +
				'}' +
				'.cke_widget_wrapper:hover>.cke_widget_element{' +
					'outline:2px solid #ffd25c;' +
					'cursor:default' +
				'}' +
				'.cke_widget_wrapper:hover .cke_widget_editable{' +
					'outline:2px solid #ffd25c' +
				'}' +
				'.cke_widget_wrapper.cke_widget_focused>.cke_widget_element,' +
				// We need higher specificity than hover style.
				'.cke_widget_wrapper .cke_widget_editable.cke_widget_editable_focused{' +
					'outline:2px solid #47a4f5' +
				'}' +
				'.cke_widget_editable{' +
					'cursor:text' +
				'}' +
				'.cke_widget_drag_handler_container{' +
					'position:absolute;' +
					'width:' + DRAG_HANDLER_SIZE + 'px;' +
					'height:0;' +
					'display:block;' +
					'opacity:0.75;' +
					'transition:height 0s 0.2s;' + // Delay hiding drag handler.
					// Prevent drag handler from being misplaced (https://dev.ckeditor.com/ticket/11198).
					'line-height:0' +
				'}' +
				'.cke_widget_wrapper:hover>.cke_widget_drag_handler_container{' +
					'height:' + DRAG_HANDLER_SIZE + 'px;' +
					'transition:none' +
				'}' +
				'.cke_widget_drag_handler_container:hover{' +
					'opacity:1' +
				'}' +
				'.cke_editable[contenteditable="false"] .cke_widget_drag_handler_container{' + // Hide drag handler in read only mode (#3260).
					'display:none;' +
				'}' +
				'img.cke_widget_drag_handler{' +
					'cursor:move;' +
					'width:' + DRAG_HANDLER_SIZE + 'px;' +
					'height:' + DRAG_HANDLER_SIZE + 'px;' +
					'display:inline-block' +
				'}' +
				'.cke_widget_mask{' +
					'position:absolute;' +
					'top:0;' +
					'left:0;' +
					'width:100%;' +
					'height:100%;' +
					'display:block' +
				'}' +
				'.cke_widget_partial_mask{' +
					'position:absolute;' +
					'display:block' +
				'}' +
				'.cke_editable.cke_widget_dragging, .cke_editable.cke_widget_dragging *{' +
					'cursor:move !important' +
				'}'
			);

			addCustomStyleHandler();
		},

		beforeInit: function( editor ) {
			// Widgets require querySelectorAll for proper work (#1319).
			if ( CKEDITOR.document.$.querySelectorAll === undefined ) {
				return;
			}
			/**
			 * An instance of widget repository. It contains all
			 * {@link CKEDITOR.plugins.widget.repository#registered registered widget definitions} and
			 * {@link CKEDITOR.plugins.widget.repository#instances initialized instances}.
			 *
			 *		editor.widgets.add( 'someName', {
			 *			// Widget definition...
			 *		} );
			 *
			 *		editor.widgets.registered.someName; // -> Widget definition
			 *
			 * @since 4.3.0
			 * @readonly
			 * @property {CKEDITOR.plugins.widget.repository} widgets
			 * @member CKEDITOR.editor
			 */
			editor.widgets = new Repository( editor );
		},

		afterInit: function( editor ) {
			// Widgets require querySelectorAll for proper work (#1319).
			if ( CKEDITOR.document.$.querySelectorAll === undefined ) {
				return;
			}
			addWidgetButtons( editor );
			setupContextMenu( editor );
			setupUndoFilter( editor.undoManager );
		}
	} );

	/**
	 * Widget repository. It keeps track of all {@link #registered registered widget definitions} and
	 * {@link #instances initialized instances}. An instance of the repository is available under
	 * the {@link CKEDITOR.editor#widgets} property.
	 *
	 * @class CKEDITOR.plugins.widget.repository
	 * @mixins CKEDITOR.event
	 * @constructor Creates a widget repository instance. Note that the widget plugin automatically
	 * creates a repository instance which is available under the {@link CKEDITOR.editor#widgets} property.
	 * @param {CKEDITOR.editor} editor The editor instance for which the repository will be created.
	 */
	function Repository( editor ) {
		/**
		 * The editor instance for which this repository was created.
		 *
		 * @readonly
		 * @property {CKEDITOR.editor} editor
		 */
		this.editor = editor;

		/**
		 * A hash of registered widget definitions (definition name => {@link CKEDITOR.plugins.widget.definition}).
		 *
		 * To register a definition use the {@link #add} method.
		 *
		 * @readonly
		 */
		this.registered = {};

		/**
		 * An object containing initialized widget instances (widget id => {@link CKEDITOR.plugins.widget}).
		 *
		 * @readonly
		 */
		this.instances = {};

		/**
		 * An array of selected widget instances.
		 *
		 * @readonly
		 * @property {CKEDITOR.plugins.widget[]} selected
		 */
		this.selected = [];

		/**
		 * The focused widget instance. See also {@link CKEDITOR.plugins.widget#event-focus}
		 * and {@link CKEDITOR.plugins.widget#event-blur} events.
		 *
		 *		editor.on( 'selectionChange', function() {
		 *			if ( editor.widgets.focused ) {
		 *				// Do something when a widget is focused...
		 *			}
		 *		} );
		 *
		 * @readonly
		 * @property {CKEDITOR.plugins.widget} focused
		 */
		this.focused = null;

		/**
		 * The widget instance that contains the nested editable which is currently focused.
		 *
		 * @readonly
		 * @property {CKEDITOR.plugins.widget} widgetHoldingFocusedEditable
		 */
		this.widgetHoldingFocusedEditable = null;

		this._ = {
			nextId: 0,
			upcasts: [],
			upcastCallbacks: [],
			filters: {}
		};

		setupWidgetsLifecycle( this );
		setupSelectionObserver( this );
		setupMouseObserver( this );
		setupKeyboardObserver( this );
		setupDragAndDrop( this );
		setupNativeCutAndCopy( this );
	}

	Repository.prototype = {
		/**
		 * Minimum interval between selection checks.
		 *
		 * @private
		 */
		MIN_SELECTION_CHECK_INTERVAL: 500,

		/**
		 * Adds a widget definition to the repository. Fires the {@link CKEDITOR.editor#widgetDefinition} event
		 * which allows to modify the widget definition which is going to be registered.
		 *
		 * @param {String} name The name of the widget definition.
		 * @param {CKEDITOR.plugins.widget.definition} widgetDef Widget definition.
		 * @returns {CKEDITOR.plugins.widget.definition}
		 */
		add: function( name, widgetDef ) {
			var editor = this.editor;

			// Create prototyped copy of original widget definition, so we won't modify it.
			widgetDef = CKEDITOR.tools.prototypedCopy( widgetDef );
			widgetDef.name = name;

			widgetDef._ = widgetDef._ || {};

			editor.fire( 'widgetDefinition', widgetDef );

			if ( widgetDef.template )
				widgetDef.template = new CKEDITOR.template( widgetDef.template );

			addWidgetCommand( editor, widgetDef );
			addWidgetProcessors( this, widgetDef );

			this.registered[ name ] = widgetDef;

			// Define default `getMode` member for widget dialog definition (#2423).
			if ( widgetDef.dialog && editor.plugins.dialog ) {
				var dialogListener = CKEDITOR.on( 'dialogDefinition', function( evt ) {
					var definition = evt.data.definition,
						dialog = definition.dialog;

					if ( !definition.getMode && dialog.getName() === widgetDef.dialog ) {
						definition.getMode = function() {
							var model = dialog.getModel( editor );
							return model && model instanceof CKEDITOR.plugins.widget && model.ready ?
								CKEDITOR.dialog.EDITING_MODE : CKEDITOR.dialog.CREATION_MODE;
						};
					}

					dialogListener.removeListener();
				} );
			}

			return widgetDef;
		},

		/**
		 * Adds a callback for element upcasting. Each callback will be executed
		 * for every element which is later tested by upcast methods. If a callback
		 * returns `false`, the element will not be upcasted.
		 *
		 *		// Images with the "banner" class will not be upcasted (e.g. to the image widget).
		 *		editor.widgets.addUpcastCallback( function( element ) {
		 *			if ( element.name == 'img' && element.hasClass( 'banner' ) )
		 *				return false;
		 *		} );
		 *
		 * @param {Function} callback
		 * @param {CKEDITOR.htmlParser.element} callback.element
		 */
		addUpcastCallback: function( callback ) {
			this._.upcastCallbacks.push( callback );
		},

		/**
		 * Checks the selection to update widget states (selection and focus).
		 *
		 * This method is triggered by the {@link #event-checkSelection} event.
		 */
		checkSelection: function() {
			if ( !this.editor.getSelection() ) {
				return;
			}

			var sel = this.editor.getSelection(),
				selectedElement = sel.getSelectedElement(),
				updater = stateUpdater( this ),
				widget;

			// Widget is focused so commit and finish checking.
			if ( selectedElement && ( widget = this.getByElement( selectedElement, true ) ) )
				return updater.focus( widget ).select( widget ).commit();

			var range = sel.getRanges()[ 0 ];

			// No ranges or collapsed range mean that nothing is selected, so commit and finish checking.
			if ( !range || range.collapsed )
				return updater.commit();

			// Range is not empty, so create walker checking for wrappers.
			var walker = new CKEDITOR.dom.walker( range ),
				wrapper;

			walker.evaluator = Widget.isDomWidgetWrapper;

			while ( ( wrapper = walker.next() ) )
				updater.select( this.getByElement( wrapper ) );

			updater.commit();
		},

		/**
		 * Checks if all widget instances are still present in the DOM.
		 * Destroys those instances that are not present.
		 * Reinitializes widgets on widget wrappers for which widget instances
		 * cannot be found. Takes nested widgets into account, too.
		 *
		 * This method triggers the {@link #event-checkWidgets} event whose listeners
		 * can cancel the method's execution or modify its options.
		 *
		 * @param [options] The options object.
		 * @param {Boolean} [options.initOnlyNew] Initializes widgets only on newly wrapped
		 * widget elements (those which still have the `cke_widget_new` class). When this option is
		 * set to `true`, widgets which were invalidated (e.g. by replacing with a cloned DOM structure)
		 * will not be reinitialized. This makes the check faster.
		 * @param {Boolean} [options.focusInited] If only one widget is initialized by
		 * the method, it will be focused.
		 */
		checkWidgets: function( options ) {
			this.fire( 'checkWidgets', CKEDITOR.tools.copy( options || {} ) );
		},

		/**
		 * Removes the widget from the editor and moves the selection to the closest
		 * editable position if the widget was focused before.
		 *
		 * @param {CKEDITOR.plugins.widget} widget The widget instance to be deleted.
		 */
		del: function( widget ) {
			if ( this.focused === widget ) {
				var editor = widget.editor,
					range = editor.createRange(),
					found;

				// If haven't found place for caret on the default side,
				// try to find it on the other side.
				if ( !( found = range.moveToClosestEditablePosition( widget.wrapper, true ) ) )
					found = range.moveToClosestEditablePosition( widget.wrapper, false );

				if ( found )
					editor.getSelection().selectRanges( [ range ] );
			}

			widget.wrapper.remove();
			this.destroy( widget, true );
		},

		/**
		 * Destroys the widget instance and all its nested widgets (widgets inside its nested editables).
		 *
		 * @param {CKEDITOR.plugins.widget} widget The widget instance to be destroyed.
		 * @param {Boolean} [offline] Whether the widget is offline (detached from the DOM tree) &mdash;
		 * in this case the DOM (attributes, classes, etc.) will not be cleaned up.
		 */
		destroy: function( widget, offline ) {
			if ( this.widgetHoldingFocusedEditable === widget )
				setFocusedEditable( this, widget, null, offline );

			widget.destroy( offline );
			delete this.instances[ widget.id ];
			this.fire( 'instanceDestroyed', widget );
		},

		/**
		 * Destroys all widget instances.
		 *
		 * @param {Boolean} [offline] Whether the widgets are offline (detached from the DOM tree) &mdash;
		 * in this case the DOM (attributes, classes, etc.) will not be cleaned up.
		 * @param {CKEDITOR.dom.element} [container] The container within widgets will be destroyed.
		 * This option will be ignored if the `offline` flag was set to `true`, because in such case
		 * it is not possible to find widgets within the passed block.
		 */
		destroyAll: function( offline, container ) {
			var widget,
				id,
				instances = this.instances;

			if ( container && !offline ) {
				var wrappers = container.find( '.cke_widget_wrapper' ),
					l = wrappers.count(),
					i = 0;

				// Length is constant, because this is not a live node list.
				// Note: since querySelectorAll returns nodes in document order,
				// outer widgets are always placed before their nested widgets and therefore
				// are destroyed before them.
				for ( ; i < l; ++i ) {
					widget = this.getByElement( wrappers.getItem( i ), true );
					// Widget might not be found, because it could be a nested widget,
					// which would be destroyed when destroying its parent.
					if ( widget )
						this.destroy( widget );
				}

				return;
			}

			for ( id in instances ) {
				widget = instances[ id ];
				this.destroy( widget, offline );
			}
		},

		/**
		 * Finalizes a process of widget creation. This includes:
		 *
		 * * inserting widget element into editor,
		 * * marking widget instance as ready (see {@link CKEDITOR.plugins.widget#event-ready}),
		 * * focusing widget instance.
		 *
		 * This method is used by the default widget's command and is called
		 * after widget's dialog (if set) is closed. It may also be used in a
		 * customized process of widget creation and insertion.
		 *
		 *		widget.once( 'edit', function() {
		 *			// Finalize creation only of not ready widgets.
		 *			if ( widget.isReady() )
		 *				return;
		 *
		 *			// Cancel edit event to prevent automatic widget insertion.
		 *			evt.cancel();
		 *
		 *			CustomDialog.open( widget.data, function saveCallback( savedData ) {
		 *				// Cache the container, because widget may be destroyed while saving data,
		 *				// if this process will require some deep transformations.
		 *				var container = widget.wrapper.getParent();
		 *
		 *				widget.setData( savedData );
		 *
		 *				// Widget will be retrieved from container and inserted into editor.
		 *				editor.widgets.finalizeCreation( container );
		 *			} );
		 *		} );
		 *
		 * @param {CKEDITOR.dom.element/CKEDITOR.dom.documentFragment} container The element
		 * or document fragment which contains widget wrapper. The container is used, so before
		 * finalizing creation the widget can be freely transformed (even destroyed and reinitialized).
		 */
		finalizeCreation: function( container ) {
			var wrapper = container.getFirst();
			if ( wrapper && Widget.isDomWidgetWrapper( wrapper ) ) {
				this.editor.insertElement( wrapper );

				var widget = this.getByElement( wrapper );
				// Fire postponed #ready event.
				widget.ready = true;
				widget.fire( 'ready' );
				widget.focus();
			}
		},

		/**
		 * Finds a widget instance which contains a given element. The element will be the {@link CKEDITOR.plugins.widget#wrapper wrapper}
		 * of the returned widget or a descendant of this {@link CKEDITOR.plugins.widget#wrapper wrapper}.
		 *
		 *		editor.widgets.getByElement( someWidget.wrapper ); // -> someWidget
		 *		editor.widgets.getByElement( someWidget.parts.caption ); // -> someWidget
		 *
		 *		// Check wrapper only:
		 *		editor.widgets.getByElement( someWidget.wrapper, true ); // -> someWidget
		 *		editor.widgets.getByElement( someWidget.parts.caption, true ); // -> null
		 *
		 * @param {CKEDITOR.dom.element} element The element to be checked.
		 * @param {Boolean} [checkWrapperOnly] If set to `true`, the method will not check wrappers' descendants.
		 * @returns {CKEDITOR.plugins.widget} The widget instance or `null`.
		 */
		getByElement: ( function() {
			var validWrapperElements = { div: 1, span: 1 };
			function getWidgetId( element ) {
				return element.is( validWrapperElements ) && element.data( 'cke-widget-id' );
			}

			return function( element, checkWrapperOnly ) {
				if ( !element )
					return null;

				var id = getWidgetId( element );

				// There's no need to check element parents if element is a wrapper.
				if ( !checkWrapperOnly && !id ) {
					var limit = this.editor.editable();

					// Try to find a closest ascendant which is a widget wrapper.
					do {
						element = element.getParent();
					} while ( element && !element.equals( limit ) && !( id = getWidgetId( element ) ) );
				}

				return this.instances[ id ] || null;
			};
		} )(),

		/**
		 * Initializes a widget on a given element if the widget has not been initialized on it yet.
		 *
		 * @param {CKEDITOR.dom.element} element The future widget element.
		 * @param {String/CKEDITOR.plugins.widget.definition} [widgetDef] Name of a widget or a widget definition.
		 * The widget definition should be previously registered by using the
		 * {@link CKEDITOR.plugins.widget.repository#add} method.
		 * @param [startupData] Widget startup data (has precedence over default one).
		 * @returns {CKEDITOR.plugins.widget} The widget instance or `null` if a widget could not be initialized on
		 * a given element.
		 */
		initOn: function( element, widgetDef, startupData ) {
			if ( !widgetDef )
				widgetDef = this.registered[ element.data( 'widget' ) ];
			else if ( typeof widgetDef == 'string' )
				widgetDef = this.registered[ widgetDef ];

			if ( !widgetDef )
				return null;

			// Wrap element if still wasn't wrapped (was added during runtime by method that skips dataProcessor).
			var wrapper = this.wrapElement( element, widgetDef.name );

			if ( wrapper ) {
				// Check if widget wrapper is new (widget hasn't been initialized on it yet).
				// This class will be removed by widget constructor to avoid locking snapshot twice.
				if ( wrapper.hasClass( 'cke_widget_new' ) ) {
					var widget = new Widget( this, this._.nextId++, element, widgetDef, startupData );

					// Widget could be destroyed when initializing it.
					if ( widget.isInited() ) {
						this.instances[ widget.id ] = widget;

						return widget;
					} else {
						return null;
					}
				}

				// Widget already has been initialized, so try to get widget by element.
				// Note - it may happen that other instance will returned than the one created above,
				// if for example widget was destroyed and reinitialized.
				return this.getByElement( element );
			}

			// No wrapper means that there's no widget for this element.
			return null;
		},

		/**
		 * Initializes widgets on all elements which were wrapped by {@link #wrapElement} and
		 * have not been initialized yet.
		 *
		 * @param {CKEDITOR.dom.element} [container=editor.editable()] The container which will be checked for not
		 * initialized widgets. Defaults to editor's {@link CKEDITOR.editor#editable editable} element.
		 * @returns {CKEDITOR.plugins.widget[]} Array of widget instances which have been initialized.
		 * Note: Only first-level widgets are returned &mdash; without nested widgets.
		 */
		initOnAll: function( container ) {
			var newWidgets = ( container || this.editor.editable() ).find( '.cke_widget_new' ),
				newInstances = [],
				instance;

			for ( var i = newWidgets.count(); i--; ) {
				instance = this.initOn( newWidgets.getItem( i ).getFirst( Widget.isDomWidgetElement ) );
				if ( instance )
					newInstances.push( instance );
			}

			return newInstances;
		},

		/**
		 * Allows to listen to events on specific types of widgets, even if they are not created yet.
		 *
		 * Please note that this method inherits parameters from the {@link CKEDITOR.event#method-on} method with one
		 * extra parameter at the beginning which is the widget name.
		 *
		 *		editor.widgets.onWidget( 'image', 'action', function( evt ) {
		 *			// Event `action` occurs on `image` widget.
		 *		} );
		 *
		 * @since 4.5.0
		 * @param {String} widgetName
		 * @param {String} eventName
		 * @param {Function} listenerFunction
		 * @param {Object} [scopeObj]
		 * @param {Object} [listenerData]
		 * @param {Number} [priority=10]
		 */
		onWidget: function( widgetName ) {
			var args = Array.prototype.slice.call( arguments );

			args.shift();

			for ( var i in this.instances ) {
				var instance = this.instances[ i ];

				if ( instance.name == widgetName ) {
					instance.on.apply( instance, args );
				}
			}

			this.on( 'instanceCreated', function( evt ) {
				var widget = evt.data;

				if ( widget.name == widgetName ) {
					widget.on.apply( widget, args );
				}
			} );
		},

		/**
		 * Parses element classes string and returns an object
		 * whose keys contain class names. Skips all `cke_*` classes.
		 *
		 * This method is used by the {@link CKEDITOR.plugins.widget#getClasses} method and
		 * may be used when overriding that method.
		 *
		 * @since 4.4.0
		 * @param {String} classes String (value of `class` attribute).
		 * @returns {Object} Object containing classes or `null` if no classes found.
		 */
		parseElementClasses: function( classes ) {
			if ( !classes )
				return null;

			classes = CKEDITOR.tools.trim( classes ).split( /\s+/ );

			var cl,
				obj = {},
				hasClasses = 0;

			while ( ( cl = classes.pop() ) ) {
				if ( cl.indexOf( 'cke_' ) == -1 )
					obj[ cl ] = hasClasses = 1;
			}

			return hasClasses ? obj : null;
		},

		/**
		 * Wraps an element with a widget's non-editable container.
		 *
		 * If this method is called on an {@link CKEDITOR.htmlParser.element}, then it will
		 * also take care of fixing the DOM after wrapping (the wrapper may not be allowed in element's parent).
		 *
		 * @param {CKEDITOR.dom.element/CKEDITOR.htmlParser.element} element The widget element to be wrapped.
		 * @param {String} [widgetName] The name of the widget definition. Defaults to element's `data-widget`
		 * attribute value.
		 * @returns {CKEDITOR.dom.element/CKEDITOR.htmlParser.element} The wrapper element or `null` if
		 * the widget definition of this name is not registered.
		 */
		wrapElement: function( element, widgetName ) {
			var wrapper = null,
				widgetDef,
				isInline;

			if ( element instanceof CKEDITOR.dom.element ) {
				widgetName = widgetName || element.data( 'widget' );
				widgetDef = this.registered[ widgetName ];

				if ( !widgetDef )
					return null;

				// Do not wrap already wrapped element.
				wrapper = element.getParent();
				if ( wrapper && wrapper.type == CKEDITOR.NODE_ELEMENT && wrapper.data( 'cke-widget-wrapper' ) )
					return wrapper;

				// If attribute isn't already set (e.g. for pasted widget), set it.
				if ( !element.hasAttribute( 'data-cke-widget-keep-attr' ) )
					element.data( 'cke-widget-keep-attr', element.data( 'widget' ) ? 1 : 0 );

				element.data( 'widget', widgetName );

				isInline = isWidgetInline( widgetDef, element.getName() );

				// Preserve initial and trailing space by replacing white space with &nbsp; (#605).
				if ( isInline ) {
					preserveSpaces( element );
				}

				wrapper = new CKEDITOR.dom.element( isInline ? 'span' : 'div', element.getDocument() );
				wrapper.setAttributes( getWrapperAttributes( isInline, widgetName ) );

				wrapper.data( 'cke-display-name', widgetDef.pathName ? widgetDef.pathName : element.getName() );

				// Replace element unless it is a detached one.
				if ( element.getParent( true ) )
					wrapper.replace( element );
				element.appendTo( wrapper );
			}
			else if ( element instanceof CKEDITOR.htmlParser.element ) {
				widgetName = widgetName || element.attributes[ 'data-widget' ];
				widgetDef = this.registered[ widgetName ];

				if ( !widgetDef )
					return null;

				wrapper = element.parent;
				if ( wrapper && wrapper.type == CKEDITOR.NODE_ELEMENT && wrapper.attributes[ 'data-cke-widget-wrapper' ] )
					return wrapper;

				// If attribute isn't already set (e.g. for pasted widget), set it.
				if ( !( 'data-cke-widget-keep-attr' in element.attributes ) )
					element.attributes[ 'data-cke-widget-keep-attr' ] = element.attributes[ 'data-widget' ] ? 1 : 0;
				if ( widgetName )
					element.attributes[ 'data-widget' ] = widgetName;

				isInline = isWidgetInline( widgetDef, element.name );

				// Preserve initial and trailing space by replacing white space with &nbsp; (#605).
				if ( isInline ) {
					preserveSpaces( element );
				}

				wrapper = new CKEDITOR.htmlParser.element( isInline ? 'span' : 'div', getWrapperAttributes( isInline, widgetName ) );
				wrapper.attributes[ 'data-cke-display-name' ] = widgetDef.pathName ? widgetDef.pathName : element.name;

				var parent = element.parent,
					index;

				// Don't detach already detached element.
				if ( parent ) {
					index = element.getIndex();
					element.remove();
				}

				wrapper.add( element );

				// Insert wrapper fixing DOM (splitting parents if wrapper is not allowed inside them).
				parent && insertElement( parent, index, wrapper );
			}

			return wrapper;
		},

		// Expose for tests.
		_tests_createEditableFilter: createEditableFilter
	};

	CKEDITOR.event.implementOn( Repository.prototype );

	/**
	 * An event fired when a widget instance is created, but before it is fully initialized.
	 *
	 * @event instanceCreated
	 * @param {CKEDITOR.plugins.widget} data The widget instance.
	 */

	/**
	 * An event fired when a widget instance was destroyed.
	 *
	 * See also {@link CKEDITOR.plugins.widget#event-destroy}.
	 *
	 * @event instanceDestroyed
	 * @param {CKEDITOR.plugins.widget} data The widget instance.
	 */

	/**
	 * An event fired to trigger the selection check.
	 *
	 * See the {@link #method-checkSelection} method.
	 *
	 * @event checkSelection
	 */

	/**
	 * An event fired by the the {@link #method-checkWidgets} method.
	 *
	 * It can be canceled in order to stop the {@link #method-checkWidgets}
	 * method execution or the event listener can modify the method's options.
	 *
	 * @event checkWidgets
	 * @param [data]
	 * @param {Boolean} [data.initOnlyNew] Initialize widgets only on newly wrapped
	 * widget elements (those which still have the `cke_widget_new` class). When this option is
	 * set to `true`, widgets which were invalidated (e.g. by replacing with a cloned DOM structure)
	 * will not be reinitialized. This makes the check faster.
	 * @param {Boolean} [data.focusInited] If only one widget is initialized by
	 * the method, it will be focused.
	 */


	/**
	 * An instance of a widget. Together with {@link CKEDITOR.plugins.widget.repository} these
	 * two classes constitute the core of the Widget System.
	 *
	 * Note that neither the repository nor the widget instances can be created by using their constructors.
	 * A repository instance is automatically set up by the Widget plugin and is accessible under
	 * {@link CKEDITOR.editor#widgets}, while widget instances are created and destroyed by the repository.
	 *
	 * To create a widget, first you need to {@link CKEDITOR.plugins.widget.repository#add register} its
	 * {@link CKEDITOR.plugins.widget.definition definition}:
	 *
	 *		editor.widgets.add( 'simplebox', {
	 *			upcast: function( element ) {
	 *				// Defines which elements will become widgets.
	 *				if ( element.hasClass( 'simplebox' ) )
	 *					return true;
	 *			},
	 *			init: function() {
	 *				// ...
	 *			}
	 *		} );
	 *
	 * Once the widget definition is registered, widgets will be automatically
	 * created when loading data:
	 *
	 *		editor.setData( '<div class="simplebox">foo</div>', function() {
	 *			console.log( editor.widgets.instances ); // -> An object containing one instance.
	 *		} );
	 *
	 * It is also possible to create instances during runtime by using a command
	 * (if a {@link CKEDITOR.plugins.widget.definition#template} property was defined):
	 *
	 *		// You can execute an automatically defined command to
	 *		// insert a new simplebox widget or edit the one currently focused.
	 *		editor.execCommand( 'simplebox' );
	 *
	 * Note: Since CKEditor 4.5.0 widget's `startupData` can be passed as the command argument:
	 *
	 *		editor.execCommand( 'simplebox', {
	 *			startupData: {
	 *				align: 'left'
	 *			}
	 *		} );
	 *
	 * A widget can also be created in a completely custom way:
	 *
	 *		var element = editor.document.createElement( 'div' );
	 *		editor.insertElement( element );
	 *		var widget = editor.widgets.initOn( element, 'simplebox' );
	 *
	 * @since 4.3.0
	 * @class CKEDITOR.plugins.widget
	 * @mixins CKEDITOR.event
	 * @extends CKEDITOR.plugins.widget.definition
	 * @constructor Creates an instance of the widget class. Do not use it directly, but instead initialize widgets
	 * by using the {@link CKEDITOR.plugins.widget.repository#initOn} method or by the upcasting system.
	 * @param {CKEDITOR.plugins.widget.repository} widgetsRepo
	 * @param {Number} id Unique ID of this widget instance.
	 * @param {CKEDITOR.dom.element} element The widget element.
	 * @param {CKEDITOR.plugins.widget.definition} widgetDef Widget's registered definition.
	 * @param [startupData] Initial widget data. This data object will overwrite the default data and
	 * the data loaded from the DOM.
	 */
	function Widget( widgetsRepo, id, element, widgetDef, startupData ) {
		var editor = widgetsRepo.editor;

		// Extend this widget with widgetDef-specific methods and properties.
		CKEDITOR.tools.extend( this, widgetDef, {
			/**
			 * The editor instance.
			 *
			 * @readonly
			 * @property {CKEDITOR.editor}
			 */
			editor: editor,

			/**
			 * This widget's unique (per editor instance) ID.
			 *
			 * @readonly
			 * @property {Number}
			 */
			id: id,

			/**
			 * Whether this widget is an inline widget (based on an inline element unless
			 * forced otherwise by {@link CKEDITOR.plugins.widget.definition#inline}).
			 *
			 * **Note:** This option does not allow to turn a block element into an inline widget.
			 * However, it makes it possible to turn an inline element into a block widget or to
			 * force a correct type in case when automatic recognition fails.
			 *
			 * @readonly
			 * @property {Boolean}
			 */
			inline: element.getParent().getName() == 'span',

			/**
			 * The widget element &mdash; the element on which the widget was initialized.
			 *
			 * @readonly
			 * @property {CKEDITOR.dom.element} element
			 */
			element: element,

			/**
			 * Widget's data object.
			 *
			 * The data can only be set by using the {@link #setData} method.
			 * Changes made to the data fire the {@link #event-data} event.
			 *
			 * @readonly
			 */
			data: CKEDITOR.tools.extend( {}, typeof widgetDef.defaults == 'function' ? widgetDef.defaults() : widgetDef.defaults ),

			/**
			 * Indicates if a widget is data-ready. Set to `true` when data from all sources
			 * ({@link CKEDITOR.plugins.widget.definition#defaults}, set in the
			 * {@link #init} method, loaded from the widget's element and startup data coming from the constructor)
			 * are finally loaded. This is immediately followed by the first {@link #event-data}.
			 *
			 * @readonly
			 */
			dataReady: false,

			/**
			 * Whether a widget instance was initialized. This means that:
			 *
			 * * An instance was created,
			 * * Its properties were set,
			 * * The `init` method was executed.
			 *
			 * **Note**: The first {@link #event-data} event could not be fired yet which
			 * means that the widget's DOM has not been set up yet. Wait for the {@link #event-ready}
			 * event to be notified when a widget is fully initialized and ready.
			 *
			 * **Note**: Use the {@link #isInited} method to check whether a widget is initialized and
			 * has not been destroyed.
			 *
			 * @readonly
			 */
			inited: false,

			/**
			 * Whether a widget instance is ready. This means that the widget is {@link #inited} and
			 * that its DOM was finally set up.
			 *
			 * **Note:** Use the {@link #isReady} method to check whether a widget is ready and
			 * has not been destroyed.
			 *
			 * @readonly
			 */
			ready: false,

			// Revert what widgetDef could override (automatic #edit listener).
			edit: Widget.prototype.edit,

			/**
			 * The nested editable element which is currently focused.
			 *
			 * @readonly
			 * @property {CKEDITOR.plugins.widget.nestedEditable}
			 */
			focusedEditable: null,

			/**
			 * The widget definition from which this instance was created.
			 *
			 * @readonly
			 * @property {CKEDITOR.plugins.widget.definition} definition
			 */
			definition: widgetDef,

			/**
			 * Link to the widget repository which created this instance.
			 *
			 * @readonly
			 * @property {CKEDITOR.plugins.widget.repository} repository
			 */
			repository: widgetsRepo,

			draggable: widgetDef.draggable !== false,

			// WAAARNING: Overwrite widgetDef's priv object, because otherwise violent unicorn's gonna visit you.
			_: {
				downcastFn: ( widgetDef.downcast && typeof widgetDef.downcast == 'string' ) ?
					widgetDef.downcasts[ widgetDef.downcast ] : widgetDef.downcast
			}
		}, true );

		/**
		 * An object of widget component elements.
		 *
		 * For every `partName => selector` pair in {@link CKEDITOR.plugins.widget.definition#parts},
		 * one `partName => element` pair is added to this object during the widget initialization.
		 * Parts can be reinitialized with the {@link #refreshParts} method.
		 *
		 * @readonly
		 * @property {Object} parts
		 */

		/**
		 * An object containing definitions of widget parts (`part name => CSS selector`).
		 *
		 * Unlike the {@link #parts} object, it stays unchanged throughout the widget lifecycle
		 * and is used in the {@link #refreshParts} method.
		 *
		 * @readonly
		 * @property {Object} partSelectors
		 * @since 4.14.0
		 */

		/**
		 * The template which will be used to create a new widget element (when the widget's command is executed).
		 * It will be populated with {@link #defaults default values}.
		 *
		 * @readonly
		 * @property {CKEDITOR.template} template
		 */

		/**
		 * The widget wrapper &mdash; a non-editable `div` or `span` element (depending on {@link #inline})
		 * which is a parent of the {@link #element} and widget compontents like the drag handler and the {@link #mask}.
		 * It is the outermost widget element.
		 *
		 * @readonly
		 * @property {CKEDITOR.dom.element} wrapper
		 */

		widgetsRepo.fire( 'instanceCreated', this );

		setupWidget( this, widgetDef );

		this.init && this.init();

		// Finally mark widget as inited.
		this.inited = true;

		setupWidgetData( this, startupData );

		// If at some point (e.g. in #data listener) widget hasn't been destroyed
		// and widget is already attached to document then fire #ready.
		if ( this.isInited() && editor.editable().contains( this.wrapper ) ) {
			this.ready = true;
			this.fire( 'ready' );
		}
	}

	Widget.prototype = {
		/**
		 * Adds a class to the widget element. This method is used by
		 * the {@link #applyStyle} method and should be overridden by widgets
		 * which should handle classes differently (e.g. add them to other elements).
		 *
		 * Since 4.6.0 this method also adds a corresponding class prefixed with {@link #WRAPPER_CLASS_PREFIX}
		 * to the widget wrapper element.
		 *
		 * **Note**: This method should not be used directly. Use the {@link #setData} method to
		 * set the `classes` property. Read more in the {@link #setData} documentation.
		 *
		 * See also: {@link #removeClass}, {@link #hasClass}, {@link #getClasses}.
		 *
		 * @since 4.4.0
		 * @param {String} className The class name to be added.
		 */
		addClass: function( className ) {
			this.element.addClass( className );
			this.wrapper.addClass( Widget.WRAPPER_CLASS_PREFIX + className );
		},

		/**
		 * Applies the specified style to the widget. It is highly recommended to use the
		 * {@link CKEDITOR.editor#applyStyle} or {@link CKEDITOR.style#apply} methods instead of
		 * using this method directly, because unlike editor's and style's methods, this one
		 * does not perform any checks.
		 *
		 * By default this method handles only classes defined in the style. It clones existing
		 * classes which are stored in the {@link #property-data widget data}'s `classes` property,
		 * adds new classes, and calls the {@link #setData} method if at least one new class was added.
		 * Then, using the {@link #event-data} event listener widget applies modifications passing
		 * new classes to the {@link #addClass} method.
		 *
		 * If you need to handle classes differently than in the default way, you can override the
		 * {@link #addClass} and related methods. You can also handle other style properties than `classes`
		 * by overriding this method.
		 *
		 * See also: {@link #checkStyleActive}, {@link #removeStyle}.
		 *
		 * @since 4.4.0
		 * @param {CKEDITOR.style} style The custom widget style to be applied.
		 */
		applyStyle: function( style ) {
			applyRemoveStyle( this, style, 1 );
		},

		/**
		 * Checks if the specified style is applied to this widget. It is highly recommended to use the
		 * {@link CKEDITOR.style#checkActive} method instead of using this method directly,
		 * because unlike style's method, this one does not perform any checks.
		 *
		 * By default this method handles only classes defined in the style and passes
		 * them to the {@link #hasClass} method. You can override these methods to handle classes
		 * differently or to handle more of the style properties.
		 *
		 * See also: {@link #applyStyle}, {@link #removeStyle}.
		 *
		 * @since 4.4.0
		 * @param {CKEDITOR.style} style The custom widget style to be checked.
		 * @returns {Boolean} Whether the style is applied to this widget.
		 */
		checkStyleActive: function( style ) {
			var classes = getStyleClasses( style ),
				cl;

			if ( !classes )
				return false;

			while ( ( cl = classes.pop() ) ) {
				if ( !this.hasClass( cl ) )
					return false;
			}
			return true;
		},

		/**
		 * Destroys this widget instance.
		 *
		 * Use {@link CKEDITOR.plugins.widget.repository#destroy} when possible instead of this method.
		 *
		 * This method fires the {#event-destroy} event.
		 *
		 * @param {Boolean} [offline] Whether a widget is offline (detached from the DOM tree) &mdash;
		 * in this case the DOM (attributes, classes, etc.) will not be cleaned up.
		 */
		destroy: function( offline ) {
			this.fire( 'destroy' );

			if ( this.editables ) {
				for ( var name in this.editables )
					this.destroyEditable( name, offline );
			}

			if ( !offline ) {
				if ( this.element.data( 'cke-widget-keep-attr' ) == '0' )
					this.element.removeAttribute( 'data-widget' );
				this.element.removeAttributes( [ 'data-cke-widget-data', 'data-cke-widget-keep-attr' ] );
				this.element.removeClass( 'cke_widget_element' );
				this.element.replace( this.wrapper );
			}

			this.wrapper = null;
		},

		/**
		 * Destroys a nested editable and all nested widgets.
		 *
		 * @param {String} editableName Nested editable name.
		 * @param {Boolean} [offline] See {@link #method-destroy} method.
		 */
		destroyEditable: function( editableName, offline ) {
			var editable = this.editables[ editableName ],
				canDestroyFilter = true;

			editable.removeListener( 'focus', onEditableFocus );
			editable.removeListener( 'blur', onEditableBlur );
			this.editor.focusManager.remove( editable );

			// Destroy filter if it's no longer used by other editables (#1722).
			if ( editable.filter ) {
				for ( var widgetName in this.repository.instances ) {
					var widget = this.repository.instances[ widgetName ];

					if ( !widget.editables ) {
						continue;
					}

					var widgetEditable = widget.editables[ editableName ];

					if ( !widgetEditable || widgetEditable === editable ) {
						continue;
					}

					if ( editable.filter === widgetEditable.filter ) {
						canDestroyFilter = false;
					}
				}

				if ( canDestroyFilter ) {
					editable.filter.destroy();

					var filters = this.repository._.filters[ this.name ];
					if ( filters ) {
						delete filters[ editableName ];
					}
				}
			}

			if ( !offline ) {
				this.repository.destroyAll( false, editable );
				editable.removeClass( 'cke_widget_editable' );
				editable.removeClass( 'cke_widget_editable_focused' );
				editable.removeAttributes( [ 'contenteditable', 'data-cke-widget-editable', 'data-cke-enter-mode' ] );
			}

			delete this.editables[ editableName ];
		},

		/**
		 * Starts widget editing.
		 *
		 * This method fires the {@link CKEDITOR.plugins.widget#event-edit} event
		 * which may be canceled in order to prevent it from opening a dialog window.
		 *
		 * The dialog window name is obtained from the event's data `dialog` property or
		 * from {@link CKEDITOR.plugins.widget.definition#dialog}.
		 *
		 * @returns {Boolean} Returns `true` if a dialog window was opened.
		 */
		edit: function() {
			var evtData = { dialog: this.dialog },
				that = this;

			// Edit event was blocked or there's no dialog to be automatically opened.
			if ( this.fire( 'edit', evtData ) === false || !evtData.dialog )
				return false;

			this.editor.openDialog( evtData.dialog, function( dialog ) {
				var showListener,
					okListener;

				// Allow to add a custom dialog handler.
				if ( that.fire( 'dialog', dialog ) === false )
					return;

				showListener = dialog.on( 'show', function() {
					dialog.setupContent( that );
				} );

				okListener = dialog.on( 'ok', function() {
					// Commit dialog's fields, but prevent from
					// firing data event for every field. Fire only one,
					// bulk event at the end.
					var dataChanged,
						dataListener = that.on( 'data', function( evt ) {
							dataChanged = 1;
							evt.cancel();
						}, null, null, 0 );

					// Create snapshot preceeding snapshot with changed widget...
					// TODO it should not be required, but it is and I found similar
					// code in dialog#ok listener in dialog/plugin.js.
					that.editor.fire( 'saveSnapshot' );
					dialog.commitContent( that );

					dataListener.removeListener();
					if ( dataChanged ) {
						that.fire( 'data', that.data );
						that.editor.fire( 'saveSnapshot' );
					}
				} );

				dialog.once( 'hide', function() {
					showListener.removeListener();
					okListener.removeListener();
				} );
			}, that );

			return true;
		},

		/**
		 * Returns widget element classes parsed to an object. This method
		 * is used to populate the `classes` property of widget's {@link #property-data}.
		 *
		 * This method reuses {@link CKEDITOR.plugins.widget.repository#parseElementClasses}.
		 * It should be overriden if a widget should handle classes differently (e.g. on other elements).
		 *
		 * See also: {@link #removeClass}, {@link #addClass}, {@link #hasClass}.
		 *
		 * @since 4.4.0
		 * @returns {Object}
		 */
		getClasses: function() {
			return this.repository.parseElementClasses( this.element.getAttribute( 'class' ) );
		},

		/**
		 * Returns the HTML of the widget. Can be overridden by
		 * {@link CKEDITOR.plugins.widget.definition#getClipboardHtml widgetDefinition.getClipboardHtml()}
		 * to customize the HTML copied to the clipboard during copy, cut and drag events.
		 *
		 * @since 4.13.0
		 * @returns {String} Widget HTML.
		 */
		getClipboardHtml: function() {
			var range = this.editor.createRange();

			range.setStartBefore( this.wrapper );
			range.setEndAfter( this.wrapper );

			return this.editor.editable().getHtmlFromRange( range ).getHtml();
		},

		/**
		 * Checks if the widget element has specified class. This method is used by
		 * the {@link #checkStyleActive} method and should be overriden by widgets
		 * which should handle classes differently (e.g. on other elements).
		 *
		 * See also: {@link #removeClass}, {@link #addClass}, {@link #getClasses}.
		 *
		 * @since 4.4.0
		 * @param {String} className The class to be checked.
		 * @param {Boolean} Whether a widget has specified class.
		 */
		hasClass: function( className ) {
			return this.element.hasClass( className );
		},

		/**
		 * Initializes a nested editable.
		 *
		 * **Note**: Only elements from {@link CKEDITOR.dtd#$editable} may become editables.
		 *
		 * @param {String} editableName The nested editable name.
		 * @param {CKEDITOR.plugins.widget.nestedEditable.definition} definition The definition of the nested editable.
		 * @returns {Boolean} Whether an editable was successfully initialized.
		 */
		initEditable: function( editableName, definition ) {
			// Don't fetch just first element which matched selector but look for a correct one. (https://dev.ckeditor.com/ticket/13334)
			var editable = this._findOneNotNested( definition.selector );

			if ( editable && editable.is( CKEDITOR.dtd.$editable ) ) {
				editable = new NestedEditable( this.editor, editable, {
					filter: createEditableFilter.call( this.repository, this.name, editableName, definition )
				} );
				this.editables[ editableName ] = editable;

				editable.setAttributes( {
					contenteditable: 'true',
					'data-cke-widget-editable': editableName,
					'data-cke-enter-mode': editable.enterMode
				} );

				if ( editable.filter )
					editable.data( 'cke-filter', editable.filter.id );

				editable.addClass( 'cke_widget_editable' );
				// This class may be left when d&ding widget which
				// had focused editable. Clean this class here, not in
				// cleanUpWidgetElement for performance and code size reasons.
				editable.removeClass( 'cke_widget_editable_focused' );

				if ( definition.pathName )
					editable.data( 'cke-display-name', definition.pathName );

				this.editor.focusManager.add( editable );
				editable.on( 'focus', onEditableFocus, this );
				CKEDITOR.env.ie && editable.on( 'blur', onEditableBlur, this );

				// Finally, process editable's data. This data wasn't processed when loading
				// editor's data, becuase they need to be processed separately, with its own filters and settings.
				editable._.initialSetData = true;
				editable.setData( editable.getHtml() );

				return true;
			}

			return false;
		},

		/**
		 * Looks inside wrapper element to find a node that
		 * matches given selector and is not nested in other widget. (https://dev.ckeditor.com/ticket/13334)
		 *
		 * @since 4.5.0
		 * @private
		 * @param {String} selector Selector to match.
		 * @returns {CKEDITOR.dom.element} Matched element or `null` if a node has not been found.
		 */
		_findOneNotNested: function( selector ) {
			var matchedElements = this.wrapper.find( selector ),
				match,
				closestWrapper;

			for ( var i = 0; i < matchedElements.count(); i++ ) {
				match = matchedElements.getItem( i );
				closestWrapper = match.getAscendant( Widget.isDomWidgetWrapper );

				// The closest ascendant-wrapper of this match defines to which widget
				// this match belongs. If the ascendant is this widget's wrapper
				// it means that the match is not nested in other widget.
				if ( this.wrapper.equals( closestWrapper ) ) {
					return match;
				}
			}

			return null;
		},

		/**
		 * Checks if a widget has already been initialized and has not been destroyed yet.
		 *
		 * See {@link #inited} for more details.
		 *
		 * @returns {Boolean}
		 */
		isInited: function() {
			return !!( this.wrapper && this.inited );
		},

		/**
		 * Checks if a widget is ready and has not been destroyed yet.
		 *
		 * See {@link #property-ready} for more details.
		 *
		 * @returns {Boolean}
		 */
		isReady: function() {
			return this.isInited() && this.ready;
		},

		/**
		 * Focuses a widget by selecting it.
		 */
		focus: function() {
			var sel = this.editor.getSelection();

			// Fake the selection before focusing editor, to avoid unpreventable viewports scrolling
			// on Webkit/Blink/IE which is done because there's no selection or selection was somewhere else than widget.
			if ( sel ) {
				var isDirty = this.editor.checkDirty();

				sel.fake( this.wrapper );

				!isDirty && this.editor.resetDirty();
			}

			// Always focus editor (not only when focusManger.hasFocus is false) (because of https://dev.ckeditor.com/ticket/10483).
			this.editor.focus();
		},

		/**
		 * Refreshes the widget's mask. It can be used together with the {@link #refreshParts} method to reinitialize the mask
		 * for dynamically created widgets.
		 *
		 * @since 4.14.0
		 */
		refreshMask: function() {
			setupMask( this );
		},

		/**
		 * Reinitializes the widget's {@link #parts}.
		 *
		 * This method can be used to link new DOM elements to widget parts, for example in case when the widget's HTML is created
		 * asynchronously or modified during the widget lifecycle. Note that it uses the {@link #partSelectors} object, so it does not
		 * refresh parts that were created manually.
		 *
		 * @since 4.14.0
		 * @param {Boolean} [refreshInitialized=true] Whether the parts that are already initialized should be reinitialized.
		 */
		refreshParts: function( refreshInitialized ) {
			refreshInitialized = typeof refreshInitialized !== 'undefined' ? refreshInitialized : true;
			setupParts( this, refreshInitialized );
		},

		/**
		 * Removes a class from the widget element. This method is used by
		 * the {@link #removeStyle} method and should be overriden by widgets
		 * which should handle classes differently (e.g. on other elements).
		 *
		 * **Note**: This method should not be used directly. Use the {@link #setData} method to
		 * set the `classes` property. Read more in the {@link #setData} documentation.
		 *
		 * See also: {@link #hasClass}, {@link #addClass}.
		 *
		 * @since 4.4.0
		 * @param {String} className The class to be removed.
		 */
		removeClass: function( className ) {
			this.element.removeClass( className );
			this.wrapper.removeClass( Widget.WRAPPER_CLASS_PREFIX + className );
		},

		/**
		 * Removes the specified style from the widget. It is highly recommended to use the
		 * {@link CKEDITOR.editor#removeStyle} or {@link CKEDITOR.style#remove} methods instead of
		 * using this method directly, because unlike editor's and style's methods, this one
		 * does not perform any checks.
		 *
		 * Read more about how applying/removing styles works in the {@link #applyStyle} method documentation.
		 *
		 * See also {@link #checkStyleActive}, {@link #applyStyle}, {@link #getClasses}.
		 *
		 * @since 4.4.0
		 * @param {CKEDITOR.style} style The custom widget style to be removed.
		 */
		removeStyle: function( style ) {
			applyRemoveStyle( this, style, 0 );
		},

		/**
		 * Sets widget value(s) in the {@link #property-data} object.
		 * If the given value(s) modifies current ones, the {@link #event-data} event is fired.
		 *
		 *		this.setData( 'align', 'left' );
		 *		this.data.align; // -> 'left'
		 *
		 *		this.setData( { align: 'right', opened: false } );
		 *		this.data.align; // -> 'right'
		 *		this.data.opened; // -> false
		 *
		 * Set values are stored in {@link #element}'s attribute (`data-cke-widget-data`),
		 * in a JSON string, therefore {@link #property-data} should contain
		 * only serializable data.
		 *
		 * **Note:** A special data property, `classes`, exists. It contains an object with
		 * classes which were returned by the {@link #getClasses} method during the widget initialization.
		 * This property is then used by the {@link #applyStyle} and {@link #removeStyle} methods.
		 * When it is changed (the reference to object must be changed!), the widget updates its classes by
		 * using the {@link #addClass} and {@link #removeClass} methods.
		 *
		 *		// Adding a new class.
		 *		var classes = CKEDITOR.tools.clone( widget.data.classes );
		 *		classes.newClass = 1;
		 *		widget.setData( 'classes', classes );
		 *
		 *		// Removing a class.
		 *		var classes = CKEDITOR.tools.clone( widget.data.classes );
		 *		delete classes.newClass;
		 *		widget.setData( 'classes', classes );
		 *
		 * @param {String/Object} keyOrData
		 * @param {Object} value
		 * @chainable
		 */
		setData: function( key, value ) {
			var data = this.data,
				modified = 0;

			if ( typeof key == 'string' ) {
				if ( data[ key ] !== value ) {
					data[ key ] = value;
					modified = 1;
				}
			}
			else {
				var newData = key;

				for ( key in newData ) {
					if ( data[ key ] !== newData[ key ] ) {
						modified = 1;
						data[ key ] = newData[ key ];
					}
				}
			}

			// Block firing data event and overwriting data element before setupWidgetData is executed.
			if ( modified && this.dataReady ) {
				writeDataToElement( this );
				this.fire( 'data', data );
			}

			return this;
		},

		/**
		 * Changes the widget's focus state. This method is executed automatically after
		 * a widget was focused by the {@link #method-focus} method or the selection was moved
		 * out of the widget.
		 *
		 * This is a low-level method which is not integrated with e.g. the undo manager.
		 * Use the {@link #method-focus} method instead.
		 *
		 * @param {Boolean} selected Whether to select or deselect this widget.
		 * @chainable
		 */
		setFocused: function( focused ) {
			this.wrapper[ focused ? 'addClass' : 'removeClass' ]( 'cke_widget_focused' );
			this.fire( focused ? 'focus' : 'blur' );
			return this;
		},

		/**
		 * Changes the widget's select state. This method is executed automatically after
		 * a widget was selected by the {@link #method-focus} method or the selection
		 * was moved out of the widget.
		 *
		 * This is a low-level method which is not integrated with e.g. the undo manager.
		 * Use the {@link #method-focus} method instead or simply change the selection.
		 *
		 * @param {Boolean} selected Whether to select or deselect this widget.
		 * @chainable
		 */
		setSelected: function( selected ) {
			this.wrapper[ selected ? 'addClass' : 'removeClass' ]( 'cke_widget_selected' );
			this.fire(  selected ? 'select' : 'deselect' );
			return this;
		},

		/**
		 * Repositions drag handler according to the widget's element position. Should be called from events, like mouseover.
		 */
		updateDragHandlerPosition: function() {
			var editor = this.editor,
				domElement = this.element.$,
				oldPos = this._.dragHandlerOffset,
				newPos = {
					x: domElement.offsetLeft,
					y: domElement.offsetTop - DRAG_HANDLER_SIZE
				};

			if ( oldPos && newPos.x == oldPos.x && newPos.y == oldPos.y )
				return;

			// We need to make sure that dirty state is not changed (https://dev.ckeditor.com/ticket/11487).
			var initialDirty = editor.checkDirty();

			editor.fire( 'lockSnapshot' );
			this.dragHandlerContainer.setStyles( {
				top: newPos.y + 'px',
				left: newPos.x + 'px'
			} );
			this.dragHandlerContainer.removeStyle( 'display' );

			editor.fire( 'unlockSnapshot' );
			!initialDirty && editor.resetDirty();

			this._.dragHandlerOffset = newPos;
		}
	};

	CKEDITOR.event.implementOn( Widget.prototype );

	/**
	 * Gets the {@link #isDomNestedEditable nested editable}
	 * (returned as a {@link CKEDITOR.dom.element}, not as a {@link CKEDITOR.plugins.widget.nestedEditable})
	 * closest to the `node` or the `node` if it is a nested editable itself.
	 *
	 * @since 4.5.0
	 * @static
	 * @param {CKEDITOR.dom.element} guard Stop ancestor search on this node (usually editor's editable).
	 * @param {CKEDITOR.dom.node} node Start the search from this node.
	 * @returns {CKEDITOR.dom.element/null} Element or `null` if not found.
	 */
	Widget.getNestedEditable = function( guard, node ) {
		if ( !node || node.equals( guard ) )
			return null;

		if ( Widget.isDomNestedEditable( node ) )
			return node;

		return Widget.getNestedEditable( guard, node.getParent() );
	};

	/**
	 * Checks whether the `node` is a widget's drag handle element.
	 *
	 * @since 4.5.0
	 * @static
	 * @param {CKEDITOR.dom.node} node
	 * @returns {Boolean}
	 */
	Widget.isDomDragHandler = function( node ) {
		return node.type == CKEDITOR.NODE_ELEMENT && node.hasAttribute( 'data-cke-widget-drag-handler' );
	};

	/**
	 * Checks whether the `node` is a container of the widget's drag handle element.
	 *
	 * @since 4.5.0
	 * @static
	 * @param {CKEDITOR.dom.node} node
	 * @returns {Boolean}
	 */
	Widget.isDomDragHandlerContainer = function( node ) {
		return node.type == CKEDITOR.NODE_ELEMENT && node.hasClass( 'cke_widget_drag_handler_container' );
	};

	/**
	 * Checks whether the `node` is a {@link CKEDITOR.plugins.widget#editables nested editable}.
	 * Note that this function only checks whether it is the right element, not whether
	 * the passed `node` is an instance of {@link CKEDITOR.plugins.widget.nestedEditable}.
	 *
	 * @since 4.5.0
	 * @static
	 * @param {CKEDITOR.dom.node} node
	 * @returns {Boolean}
	 */
	Widget.isDomNestedEditable = function( node ) {
		return node.type == CKEDITOR.NODE_ELEMENT && node.hasAttribute( 'data-cke-widget-editable' );
	};

	/**
	 * Checks whether the `node` is a {@link CKEDITOR.plugins.widget#element widget element}.
	 *
	 * @since 4.5.0
	 * @static
	 * @param {CKEDITOR.dom.node} node
	 * @returns {Boolean}
	 */
	Widget.isDomWidgetElement = function( node ) {
		return node.type == CKEDITOR.NODE_ELEMENT && node.hasAttribute( 'data-widget' );
	};

	/**
	 * Checks whether the `node` is a {@link CKEDITOR.plugins.widget#wrapper widget wrapper}.
	 *
	 * @since 4.5.0
	 * @static
	 * @param {CKEDITOR.dom.element} node
	 * @returns {Boolean}
	 */
	Widget.isDomWidgetWrapper = function( node ) {
		return node.type == CKEDITOR.NODE_ELEMENT && node.hasAttribute( 'data-cke-widget-wrapper' );
	};

	/**
	 * Checks whether the `node` is a DOM widget.
	 *
	 * @since 4.8.0
	 * @static
	 * @param {CKEDITOR.dom.node} node
	 * @returns {Boolean}
	 */
	Widget.isDomWidget = function( node ) {
		return node ? this.isDomWidgetWrapper( node ) || this.isDomWidgetElement( node ) : false;
	};

	/**
	 * Checks whether the `node` is a {@link CKEDITOR.plugins.widget#element widget element}.
	 *
	 * @since 4.5.0
	 * @static
	 * @param {CKEDITOR.htmlParser.node} node
	 * @returns {Boolean}
	 */
	Widget.isParserWidgetElement = function( node ) {
		return node.type == CKEDITOR.NODE_ELEMENT && !!node.attributes[ 'data-widget' ];
	};

	/**
	 * Checks whether the `node` is a {@link CKEDITOR.plugins.widget#wrapper widget wrapper}.
	 *
	 * @since 4.5.0
	 * @static
	 * @param {CKEDITOR.htmlParser.element} node
	 * @returns {Boolean}
	 */
	Widget.isParserWidgetWrapper = function( node ) {
		return node.type == CKEDITOR.NODE_ELEMENT && !!node.attributes[ 'data-cke-widget-wrapper' ];
	};

	/**
	 * Prefix added to wrapper classes. Each class added to the widget element by the {@link #addClass}
	 * method will also be added to the wrapper prefixed with it.
	 *
	 * @since 4.6.0
	 * @static
	 * @readonly
	 * @property {String} [='cke_widget_wrapper_']
	 */
	Widget.WRAPPER_CLASS_PREFIX = 'cke_widget_wrapper_';

	/**
	 * An event fired when a widget is ready (fully initialized). This event is fired after:
	 *
	 * * {@link #init} is called,
	 * * The first {@link #event-data} event is fired,
	 * * A widget is attached to the document.
	 *
	 * Therefore, in case of widget creation with a command which opens a dialog window, this event
	 * will be delayed after the dialog window is closed and the widget is finally inserted into the document.
	 *
	 * **Note**: If your widget does not use automatic dialog window binding (i.e. you open the dialog window manually)
	 * or another situation in which the widget wrapper is not attached to document at the time when it is
	 * initialized occurs, you need to take care of firing {@link #event-ready} yourself.
	 *
	 * See also {@link #property-ready} and {@link #property-inited} properties, and
	 * {@link #isReady} and {@link #isInited} methods.
	 *
	 * @event ready
	 */

	/**
	 * An event fired when a widget is about to be destroyed, but before it is
	 * fully torn down.
	 *
	 * @event destroy
	 */

	/**
	 * An event fired when a widget is focused.
	 *
	 * Widget can be focused by executing {@link #method-focus}.
	 *
	 * @event focus
	 */

	/**
	 * An event fired when a widget is blurred.
	 *
	 * @event blur
	 */

	/**
	 * An event fired when a widget is selected.
	 *
	 * @event select
	 */

	/**
	 * An event fired when a widget is deselected.
	 *
	 * @event deselect
	 */

	/**
	 * An event fired by the {@link #method-edit} method. It can be canceled
	 * in order to stop the default action (opening a dialog window and/or
	 * {@link CKEDITOR.plugins.widget.repository#finalizeCreation finalizing widget creation}).
	 *
	 * @event edit
	 * @param data
	 * @param {String} data.dialog Defaults to {@link CKEDITOR.plugins.widget.definition#dialog}
	 * and can be changed or set by the listener.
	 */

	/**
	 * An event fired when a dialog window for widget editing is opened.
	 * This event can be canceled in order to handle the editing dialog in a custom manner.
	 *
	 * @event dialog
	 * @param {CKEDITOR.dialog} data The opened dialog window instance.
	 */

	/**
	 * An event fired when a key is pressed on a focused widget.
	 * This event is forwarded from the {@link CKEDITOR.editor#key} event and
	 * has the ability to block editor keystrokes if it is canceled.
	 *
	 * @event key
	 * @param data
	 * @param {Number} data.keyCode A number representing the key code (or combination).
	 */

	/**
	 * An event fired when a widget is double clicked.
	 *
	 * **Note:** If a default editing action is executed on double click (i.e. a widget has a
	 * {@link CKEDITOR.plugins.widget.definition#dialog dialog} defined and the {@link #event-doubleclick} event was not
	 * canceled), this event will be automatically canceled, so a listener added with the default priority (10)
	 * will not be executed. Use a listener with low priority (e.g. 5) to be sure that it will be executed.
	 *
	 *		widget.on( 'doubleclick', function( evt ) {
	 *			console.log( 'widget#doubleclick' );
	 *		}, null, null, 5 );
	 *
	 * If your widget handles double click in a special way (so the default editing action is not executed),
	 * make sure you cancel this event, because otherwise it will be propagated to {@link CKEDITOR.editor#doubleclick}
	 * and another feature may step in (e.g. a Link dialog window may be opened if your widget was inside a link).
	 *
	 * @event doubleclick
	 * @param data
	 * @param {CKEDITOR.dom.element} data.element The double-clicked element.
	 */

	/**
	 * An event fired when the context menu is opened for a widget.
	 *
	 * @event contextMenu
	 * @param data The object containing context menu options to be added
	 * for this widget. See {@link CKEDITOR.plugins.contextMenu#addListener}.
	 */

	/**
	 * An event fired when the widget data changed. See the {@link #setData} method and the {@link #property-data} property.
	 *
	 * @event data
	 */



	/**
	 * The wrapper class for editable elements inside widgets.
	 *
	 * Do not use directly. Use {@link CKEDITOR.plugins.widget.definition#editables} or
	 * {@link CKEDITOR.plugins.widget#initEditable}.
	 *
	 * @class CKEDITOR.plugins.widget.nestedEditable
	 * @extends CKEDITOR.dom.element
	 * @constructor
	 * @param {CKEDITOR.editor} editor
	 * @param {CKEDITOR.dom.element} element
	 * @param config
	 * @param {CKEDITOR.filter} [config.filter]
	 */
	function NestedEditable( editor, element, config ) {
		// Call the base constructor.
		CKEDITOR.dom.element.call( this, element.$ );
		this.editor = editor;
		this._ = {};
		var filter = this.filter = config.filter;

		// If blockless editable - always use BR mode.
		if ( !CKEDITOR.dtd[ this.getName() ].p )
			this.enterMode = this.shiftEnterMode = CKEDITOR.ENTER_BR;
		else {
			this.enterMode = filter ? filter.getAllowedEnterMode( editor.enterMode ) : editor.enterMode;
			this.shiftEnterMode = filter ? filter.getAllowedEnterMode( editor.shiftEnterMode, true ) : editor.shiftEnterMode;
		}
	}

	NestedEditable.prototype = CKEDITOR.tools.extend( CKEDITOR.tools.prototypedCopy( CKEDITOR.dom.element.prototype ), {
		/**
		 * Sets the editable data. The data will be passed through the {@link CKEDITOR.editor#dataProcessor}
		 * and the {@link CKEDITOR.editor#filter}. This ensures that the data was filtered and prepared to be
		 * edited like the {@link CKEDITOR.editor#method-setData editor data}.
		 *
		 * Before content is changed, all nested widgets are destroyed. Afterwards, after new content is loaded,
		 * all nested widgets are initialized.
		 *
		 * @param {String} data
		 */
		setData: function( data ) {
			// For performance reasons don't call destroyAll when initializing a nested editable,
			// because there are no widgets inside.
			if ( !this._.initialSetData ) {
				// Destroy all nested widgets before setting data.
				this.editor.widgets.destroyAll( false, this );
			}
			this._.initialSetData = false;

			// Unprotect comments, to get rid of additional characters (#4777).
			data = this.editor.dataProcessor.unprotectRealComments( data );

			// Unescape protected content to prevent double escaping and corruption of content (#4060, #4509).
			data = this.editor.dataProcessor.unprotectSource( data );
			data = this.editor.dataProcessor.toHtml( data, {
				context: this.getName(),
				filter: this.filter,
				enterMode: this.enterMode
			} );

			this.setHtml( data );

			this.editor.widgets.initOnAll( this );
		},

		/**
		 * Gets the editable data. Like {@link #setData}, this method will process and filter the data.
		 *
		 * @returns {String}
		 */
		getData: function() {
			return this.editor.dataProcessor.toDataFormat( this.getHtml(), {
				context: this.getName(),
				filter: this.filter,
				enterMode: this.enterMode
			} );
		}
	} );

	/**
	 * The editor instance.
	 *
	 * @readonly
	 * @property {CKEDITOR.editor} editor
	 */

	/**
	 * The filter instance if allowed content rules were defined.
	 *
	 * @readonly
	 * @property {CKEDITOR.filter} filter
	 */

	/**
	 * The enter mode active in this editable.
	 * It is determined from editable's name (whether it is a blockless editable),
	 * its allowed content rules (if defined) and the default editor's mode.
	 *
	 * @readonly
	 * @property {Number} enterMode
	 */

	/**
	 * The shift enter move active in this editable.
	 *
	 * @readonly
	 * @property {Number} shiftEnterMode
	 */


	//
	// REPOSITORY helpers -----------------------------------------------------
	//

	function addWidgetButtons( editor ) {
		var widgets = editor.widgets.registered,
			widget,
			widgetName,
			widgetButton;

		for ( widgetName in widgets ) {
			widget = widgets[ widgetName ];

			// Create button if defined.
			widgetButton = widget.button;
			if ( widgetButton && editor.ui.addButton ) {
				editor.ui.addButton( CKEDITOR.tools.capitalize( widget.name, true ), {
					label: widgetButton,
					command: widget.name,
					toolbar: 'insert,10'
				} );
			}
		}
	}

	// Create a command creating and editing widget.
	//
	// @param editor
	// @param {CKEDITOR.plugins.widget.definition} widgetDef
	function addWidgetCommand( editor, widgetDef ) {
		editor.addCommand( widgetDef.name, {
			exec: function( editor, commandData ) {
				var focused = editor.widgets.focused;
				if ( focused && focused.name == widgetDef.name ) {
					// If a widget of the same type is focused, start editing.
					focused.edit();
				} else if ( widgetDef.insert ) {
					// ... use insert method is was defined.
					widgetDef.insert( {
						editor: editor,
						commandData: commandData
					} );
				} else if ( widgetDef.template ) {
					// ... or create a brand-new widget from template.
					var defaults = typeof widgetDef.defaults == 'function' ? widgetDef.defaults() : widgetDef.defaults,
						templateData = CKEDITOR.tools.object.merge( defaults || {}, commandData && commandData.startupData || {} ),
						element = CKEDITOR.dom.element.createFromHtml( widgetDef.template.output( templateData ), editor.document ),
						instance,
						wrapper = editor.widgets.wrapElement( element, widgetDef.name ),
						temp = new CKEDITOR.dom.documentFragment( wrapper.getDocument() );

					// Append wrapper to a temporary document. This will unify the environment
					// in which #data listeners work when creating and editing widget.
					temp.append( wrapper );
					instance = editor.widgets.initOn( element, widgetDef, commandData && commandData.startupData );

					// Instance could be destroyed during initialization.
					// In this case finalize creation if some new widget
					// was left in temporary document fragment.
					if ( !instance ) {
						finalizeCreation();
						return;
					}

					// Listen on edit to finalize widget insertion.
					//
					// * If dialog was set, then insert widget after dialog was successfully saved or destroy this
					// temporary instance.
					// * If dialog wasn't set and edit wasn't canceled, insert widget.
					var editListener = instance.once( 'edit', function( evt ) {
						if ( evt.data.dialog ) {
							instance.once( 'dialog', function( evt ) {
								var dialog = evt.data,
									okListener,
									cancelListener;

								// Finalize creation AFTER (20) new data was set.
								okListener = dialog.once( 'ok', finalizeCreation, null, null, 20 );

								cancelListener = dialog.once( 'cancel', function( evt ) {
									if ( !( evt.data && evt.data.hide === false ) ) {
										editor.widgets.destroy( instance, true );
									}
								} );

								dialog.once( 'hide', function() {
									okListener.removeListener();
									cancelListener.removeListener();
								} );
							} );
						} else {
							// Dialog hasn't been set, so insert widget now.
							finalizeCreation();
						}
					}, null, null, 999 );

					instance.edit();

					// Remove listener in case someone canceled it before this
					// listener was executed.
					editListener.removeListener();
				}

				function finalizeCreation() {
					editor.widgets.finalizeCreation( temp );
				}
			},

			allowedContent: widgetDef.allowedContent,
			requiredContent: widgetDef.requiredContent,
			contentForms: widgetDef.contentForms,
			contentTransformations: widgetDef.contentTransformations
		} );
	}

	function addWidgetProcessors( widgetsRepo, widgetDef ) {
		var upcast = widgetDef.upcast,
			priority = widgetDef.upcastPriority || 10;

		function multipleUpcastsHandler( element, data ) {
			var upcasts = widgetDef.upcast.split( ',' ),
				upcast,
				i;

			for ( i = 0; i < upcasts.length; i++ ) {
				upcast = upcasts[ i ];

				if ( upcast === element.name ) {
					return widgetDef.upcasts[ upcast ].call( this, element, data );
				}
			}

			return false;
		}

		if ( !upcast )
			return;

		// Multiple upcasts defined in string.
		if ( typeof upcast == 'string' ) {
			// This handler ensures that upcast method is fired only for appropriate element (#1094).
			addUpcast( multipleUpcastsHandler, widgetDef, priority );
		}
		// Single rule which is automatically activated.
		else {
			addUpcast( upcast, widgetDef, priority );
		}

		function addUpcast( upcast, def, priority ) {
			// Find index of the first higher (in terms of value) priority upcast.
			var index = CKEDITOR.tools.getIndex( widgetsRepo._.upcasts, function( element ) {
				return element[ 2 ] > priority;
			} );
			// Add at the end if it is the highest priority so far.
			if ( index < 0 ) {
				index = widgetsRepo._.upcasts.length;
			}

			widgetsRepo._.upcasts.splice( index, 0, [ CKEDITOR.tools.bind( upcast, def ), def.name, priority ] );
		}
	}

	function blurWidget( widgetsRepo, widget ) {
		widgetsRepo.focused = null;

		if ( widget.isInited() ) {
			var isDirty = widget.editor.checkDirty();

			// Widget could be destroyed in the meantime - e.g. data could be set.
			widgetsRepo.fire( 'widgetBlurred', { widget: widget } );
			widget.setFocused( false );

			!isDirty && widget.editor.resetDirty();
		}
	}

	function checkWidgets( evt ) {
		var options = evt.data;

		if ( this.editor.mode != 'wysiwyg' )
			return;

		var editable = this.editor.editable(),
			instances = this.instances,
			newInstances, i, count, wrapper, notYetInitialized;

		if ( !editable )
			return;

		// Remove widgets which have no corresponding elements in DOM.
		for ( i in instances ) {
			// https://dev.ckeditor.com/ticket/13410 Remove widgets that are ready. This prevents from destroying widgets that are during loading process.
			if ( instances[ i ].isReady() && !editable.contains( instances[ i ].wrapper ) )
				this.destroy( instances[ i ], true );
		}

		// Init on all (new) if initOnlyNew option was passed.
		if ( options && options.initOnlyNew )
			newInstances = this.initOnAll();
		else {
			var wrappers = editable.find( '.cke_widget_wrapper' );
			newInstances = [];

			// Create widgets on existing wrappers if they do not exists.
			for ( i = 0, count = wrappers.count(); i < count; i++ ) {
				wrapper = wrappers.getItem( i );
				notYetInitialized = !this.getByElement( wrapper, true );

				// Check if:
				// * there's no instance for this widget
				// * wrapper is not inside some temporary element like copybin (https://dev.ckeditor.com/ticket/11088)
				// * it was a nested widget's wrapper which has been detached from DOM,
				// when nested editable has been initialized (it overwrites its innerHTML
				// and initializes nested widgets).
				if ( notYetInitialized && !findParent( wrapper, isDomTemp ) && editable.contains( wrapper ) ) {
					// Add cke_widget_new class because otherwise
					// widget will not be created on such wrapper.
					wrapper.addClass( 'cke_widget_new' );
					newInstances.push( this.initOn( wrapper.getFirst( Widget.isDomWidgetElement ) ) );
				}
			}
		}

		// If only single widget was initialized and focusInited was passed, focus it.
		if ( options && options.focusInited && newInstances.length == 1 )
			newInstances[ 0 ].focus();
	}

	// Unwraps widget element and clean up element.
	//
	// This function is used to clean up pasted widgets.
	// It should have similar result to widget#destroy plus
	// some additional adjustments, specific for pasting.
	//
	// @param {CKEDITOR.htmlParser.element} el
	function cleanUpWidgetElement( el ) {
		var parent = el.parent;

		if ( parent.type == CKEDITOR.NODE_ELEMENT && parent.attributes[ 'data-cke-widget-wrapper' ] ) {
			parent.replaceWith( el );
		}
	}

	// Preserves white spaces in widget element.
	//
	// This function is replacing white spaces with &nbsp;
	// at the beginning of the first text node
	// and at the end of the last text node.
	//
	// @param {CKEDITOR.htmlParser.element} el
	function preserveSpaces( el ) {
		if ( typeof el.attributes != 'undefined' && el.attributes[ 'data-widget' ] ) {
			var firstTextNode = getFirstTextNode( el ),
				lastTextNode = getLastTextNode( el ),
				spacesReplaced = false;

			// Check whether the value of the first text node contains white space at the beginning and replace it with &nbsp;.
			if ( firstTextNode && firstTextNode.value && firstTextNode.value.match( /^\s/g ) ) {
				firstTextNode.parent.attributes[ 'data-cke-white-space-first' ] = 1;
				firstTextNode.value = firstTextNode.value.replace( /^\s/g, '&nbsp;' );
				spacesReplaced = true;
			}

			// Check whether the value of the last text node contains white space at the end and replace it with &nbsp;.
			if ( lastTextNode && lastTextNode.value && lastTextNode.value.match( /\s$/g ) ) {
				lastTextNode.parent.attributes[ 'data-cke-white-space-last' ] = 1;
				lastTextNode.value = lastTextNode.value.replace( /\s$/g, '&nbsp;' );
				spacesReplaced = true;
			}

			if ( spacesReplaced ) {
				el.attributes[ 'data-cke-widget-white-space' ] = 1;
			}
		}
	}

	// Returns first child text node of the given element.
	//
	// @param {CKEDITOR.htmlParser.element} el.
	// @returns {CKEDITOR.htmlParser.text}
	function getFirstTextNode( el ) {
		return el.find( function( node ) {
			return node.type === 3;
		}, true ).shift();
	}


	// Returns last child text node of the given element.
	//
	// @param {CKEDITOR.htmlParser.element} el.
	// @returns {CKEDITOR.htmlParser.text}
	function getLastTextNode( el ) {
		return el.find( function( node ) {
			return node.type === 3;
		}, true ).pop();
	}

	// Similar to cleanUpWidgetElement, but works on DOM and finds
	// widget elements by its own.
	//
	// Unlike cleanUpWidgetElement it will wrap element back.
	//
	// @param {CKEDITOR.dom.element} container
	function cleanUpAllWidgetElements( widgetsRepo, container ) {
		var wrappers = container.find( '.cke_widget_wrapper' ),
			wrapper, element,
			i = 0,
			l = wrappers.count();

		for ( ; i < l; ++i ) {
			wrapper = wrappers.getItem( i );
			element = wrapper.getFirst( Widget.isDomWidgetElement );
			// If wrapper contains widget element - unwrap it and wrap again.
			if ( element.type == CKEDITOR.NODE_ELEMENT && element.data( 'widget' ) ) {
				element.replace( wrapper );
				widgetsRepo.wrapElement( element );
			} else {
				// Otherwise - something is wrong... clean this up.
				wrapper.remove();
			}
		}
	}

	// Creates {@link CKEDITOR.filter} instance for given widget, editable and rules.
	//
	// Once filter for widget-editable pair is created it is cached, so the same instance
	// will be returned when method is executed again.
	//
	// @param {String} widgetName
	// @param {String} editableName
	// @param {CKEDITOR.plugins.widget.nestedEditableDefinition} editableDefinition The nested editable definition.
	// @returns {CKEDITOR.filter} Filter instance or `null` if rules are not defined.
	// @context CKEDITOR.plugins.widget.repository
	function createEditableFilter( widgetName, editableName, editableDefinition ) {
		if ( !editableDefinition.allowedContent && !editableDefinition.disallowedContent )
			return null;

		var editables = this._.filters[ widgetName ];

		if ( !editables )
			this._.filters[ widgetName ] = editables = {};

		var filter = editables[ editableName ];

		if ( !filter ) {
			filter = editableDefinition.allowedContent ? new CKEDITOR.filter( editableDefinition.allowedContent ) : this.editor.filter.clone();

			editables[ editableName ] = filter;

			if ( editableDefinition.disallowedContent ) {
				filter.disallow( editableDefinition.disallowedContent );
			}
		}

		return filter;
	}

	// Creates an iterator function which when executed on all
	// elements in DOM tree will gather elements that should be wrapped
	// and initialized as widgets.
	function createUpcastIterator( widgetsRepo ) {
		var toBeWrapped = [],
			upcasts = widgetsRepo._.upcasts,
			upcastCallbacks = widgetsRepo._.upcastCallbacks;

		return {
			toBeWrapped: toBeWrapped,

			iterator: function( element ) {
				var upcast, upcasted,
					data,
					i,
					upcastsLength,
					upcastCallbacksLength;

				// Wrapper found - find widget element, add it to be
				// cleaned up (unwrapped) and wrapped and stop iterating in this branch.
				if ( 'data-cke-widget-wrapper' in element.attributes ) {
					element = element.getFirst( Widget.isParserWidgetElement );

					if ( element )
						toBeWrapped.push( [ element ] );

					// Do not iterate over descendants.
					return false;
				}
				// Widget element found - add it to be cleaned up (just in case)
				// and wrapped and stop iterating in this branch.
				else if ( 'data-widget' in element.attributes ) {
					toBeWrapped.push( [ element ] );

					// Do not iterate over descendants.
					return false;
				}
				else if ( ( upcastsLength = upcasts.length ) ) {
					// Ignore elements with data-cke-widget-upcasted to avoid multiple upcasts (https://dev.ckeditor.com/ticket/11533).
					// Do not iterate over descendants.
					if ( element.attributes[ 'data-cke-widget-upcasted' ] )
						return false;

					// Check element with upcast callbacks first.
					// If any of them return false abort upcasting.
					for ( i = 0, upcastCallbacksLength = upcastCallbacks.length; i < upcastCallbacksLength; ++i ) {
						if ( upcastCallbacks[ i ]( element ) === false )
							return;
						// Return nothing in order to continue iterating over ascendants.
						// See https://dev.ckeditor.com/ticket/11186#comment:6
					}

					for ( i = 0; i < upcastsLength; ++i ) {
						upcast = upcasts[ i ];
						data = {};

						if ( ( upcasted = upcast[ 0 ]( element, data ) ) ) {
							// If upcast function returned element, upcast this one.
							// It can be e.g. a new element wrapping the original one.
							if ( upcasted instanceof CKEDITOR.htmlParser.element )
								element = upcasted;

							// Set initial data attr with data from upcast method.
							element.attributes[ 'data-cke-widget-data' ] = encodeURIComponent( JSON.stringify( data ) );
							element.attributes[ 'data-cke-widget-upcasted' ] = 1;

							toBeWrapped.push( [ element, upcast[ 1 ] ] );

							// Do not iterate over descendants.
							return false;
						}
					}
				}
			}
		};
	}

	// Finds a first parent that matches query.
	//
	// @param {CKEDITOR.dom.element} element
	// @param {Function} query
	function findParent( element, query ) {
		var parent = element;

		while ( ( parent = parent.getParent() ) ) {
			if ( query( parent ) )
				return true;
		}
		return false;
	}

	function getWrapperAttributes( inlineWidget, name ) {
		return {
			// tabindex="-1" means that it can receive focus by code.
			tabindex: -1,
			contenteditable: 'false',
			'data-cke-widget-wrapper': 1,
			'data-cke-filter': 'off',
			// Class cke_widget_new marks widgets which haven't been initialized yet.
			'class': 'cke_widget_wrapper cke_widget_new cke_widget_' +
				( inlineWidget ? 'inline' : 'block' ) +
				( name ? ' cke_widget_' + name : '' )
		};
	}

	// Inserts element at given index.
	// It will check DTD and split ancestor elements up to the first
	// that can contain this element.
	//
	// @param {CKEDITOR.htmlParser.element} parent
	// @param {Number} index
	// @param {CKEDITOR.htmlParser.element} element
	function insertElement( parent, index, element ) {
		// Do not split doc fragment...
		if ( parent.type == CKEDITOR.NODE_ELEMENT ) {
			var parentAllows = CKEDITOR.dtd[ parent.name ];
			// Parent element is known (included in DTD) and cannot contain
			// this element.
			if ( parentAllows && !parentAllows[ element.name ] ) {
				var parent2 = parent.split( index ),
					parentParent = parent.parent;

				// Element will now be inserted at right parent's index.
				index = parent2.getIndex();

				// If left part of split is empty - remove it.
				if ( !parent.children.length ) {
					index -= 1;
					parent.remove();
				}

				// If right part of split is empty - remove it.
				if ( !parent2.children.length )
					parent2.remove();

				// Try inserting as grandpas' children.
				return insertElement( parentParent, index, element );
			}
		}

		// Finally we can add this element.
		parent.add( element, index );
	}

	// Checks whether for the given widget definition and element widget should be created in inline or block mode.
	//
	// See also: {@link CKEDITOR.plugins.widget.definition#inline} and {@link CKEDITOR.plugins.widget#element}.
	//
	// @param {CKEDITOR.plugins.widget.definition} widgetDef The widget definition.
	// @param {String} elementName The name of the widget element.
	// @returns {Boolean}
	function isWidgetInline( widgetDef, elementName ) {
		return typeof widgetDef.inline == 'boolean' ? widgetDef.inline : !!CKEDITOR.dtd.$inline[ elementName ];
	}

	// @param {CKEDITOR.dom.element}
	// @returns {Boolean}
	function isDomTemp( element ) {
		return element.hasAttribute( 'data-cke-temp' );
	}

	function onEditableKey( widget, keyCode ) {
		var focusedEditable = widget.focusedEditable,
			range;

		// CTRL+A.
		if ( keyCode == CKEDITOR.CTRL + 65 ) {
			var bogus = focusedEditable.getBogus();

			range = widget.editor.createRange();
			range.selectNodeContents( focusedEditable );
			// Exclude bogus if exists.
			if ( bogus )
				range.setEndAt( bogus, CKEDITOR.POSITION_BEFORE_START );

			range.select();
			// Cancel event - block default.
			return false;
		}
		// DEL or BACKSPACE.
		else if ( keyCode == 8 || keyCode == 46 ) {
			var ranges = widget.editor.getSelection().getRanges();

			range = ranges[ 0 ];

			// Block del or backspace if at editable's boundary.
			return !( ranges.length == 1 && range.collapsed &&
				range.checkBoundaryOfElement( focusedEditable, CKEDITOR[ keyCode == 8 ? 'START' : 'END' ] ) );
		}
	}

	function setFocusedEditable( widgetsRepo, widget, editableElement, offline ) {
		var editor = widgetsRepo.editor;

		editor.fire( 'lockSnapshot' );

		if ( editableElement ) {
			var editableName = editableElement.data( 'cke-widget-editable' ),
				editableInstance = widget.editables[ editableName ];

			widgetsRepo.widgetHoldingFocusedEditable = widget;
			widget.focusedEditable = editableInstance;
			editableElement.addClass( 'cke_widget_editable_focused' );

			if ( editableInstance.filter )
				editor.setActiveFilter( editableInstance.filter );
			editor.setActiveEnterMode( editableInstance.enterMode, editableInstance.shiftEnterMode );
		} else {
			if ( !offline )
				widget.focusedEditable.removeClass( 'cke_widget_editable_focused' );

			widget.focusedEditable = null;
			widgetsRepo.widgetHoldingFocusedEditable = null;
			editor.setActiveFilter( null );
			editor.setActiveEnterMode( null, null );
		}

		editor.fire( 'unlockSnapshot' );
	}

	function setupContextMenu( editor ) {
		if ( !editor.contextMenu )
			return;

		editor.contextMenu.addListener( function( element ) {
			var widget = editor.widgets.getByElement( element, true );

			if ( widget )
				return widget.fire( 'contextMenu', {} );
		} );
	}

	// And now we've got two problems - original problem and RegExp.
	// Some softeners:
	// * FF tends to copy all blocks up to the copybin container.
	// * IE tends to copy only the copybin, without its container.
	// * We use spans on IE and blockless editors, but divs in other cases.
	var pasteReplaceRegex = new RegExp(
		'^' +
		'(?:<(?:div|span)(?: data-cke-temp="1")?(?: id="cke_copybin")?(?: data-cke-temp="1")?>)?' +
			'(?:<(?:div|span)(?: style="[^"]+")?>)?' +
				'<span [^>]*data-cke-copybin-start="1"[^>]*>.?</span>([\\s\\S]+)<span [^>]*data-cke-copybin-end="1"[^>]*>.?</span>' +
			'(?:</(?:div|span)>)?' +
		'(?:</(?:div|span)>)?' +
		'$',
		// IE8 prefers uppercase when browsers stick to lowercase HTML (https://dev.ckeditor.com/ticket/13460).
		'i'
	);

	function pasteReplaceFn( match, wrapperHtml ) {
		// Avoid polluting pasted data with any whitspaces,
		// what's going to break check whether only one widget was pasted.
		return CKEDITOR.tools.trim( wrapperHtml );
	}

	function setupDragAndDrop( widgetsRepo ) {
		var editor = widgetsRepo.editor,
			lineutils = CKEDITOR.plugins.lineutils;

		// These listeners handle inline and block widgets drag and drop.
		// The only thing we need to do to make block widgets custom drag and drop functionality
		// is to fire those events with the right properties (like the target which must be the drag handle).
		editor.on( 'dragstart', function( evt ) {
			var target = evt.data.target;

			if ( Widget.isDomDragHandler( target ) ) {
				var widget = widgetsRepo.getByElement( target );

				evt.data.dataTransfer.setData( 'cke/widget-id', widget.id );

				// IE needs focus.
				editor.focus();

				// and widget need to be focused on drag start (https://dev.ckeditor.com/ticket/12172#comment:10).
				widget.focus();
			}

		} );

		editor.on( 'drop', function( evt ) {
			var dataTransfer = evt.data.dataTransfer,
				id = dataTransfer.getData( 'cke/widget-id' ),
				transferType = dataTransfer.getTransferType( editor ),
				dragRange = editor.createRange(),
				dropRange = evt.data.dropRange,
				dropWidget = getWidgetFromRange( dropRange ),
				sourceWidget;

			// Disable cross-editor drag & drop for widgets - https://dev.ckeditor.com/ticket/13599.
			if ( id !== '' && transferType === CKEDITOR.DATA_TRANSFER_CROSS_EDITORS ) {
				evt.cancel();
				return;
			}

			if ( transferType != CKEDITOR.DATA_TRANSFER_INTERNAL ) {
				return;
			}

			// Add support for dropping selection containing more than widget itself
			// or more than one widget (#3441).
			if ( id === '' && editor.widgets.selected.length > 0 ) {
				evt.data.dataTransfer.setData( 'text/html', getClipboardHtml( editor ) );
				return;
			}

			sourceWidget = widgetsRepo.instances[ id ];
			if ( !sourceWidget ) {
				return;
			}

			// Disable dropping into itself or nested widgets (#4509).
			if ( isTheSameWidget( sourceWidget, dropWidget ) ) {
				evt.cancel();

				return;
			}

			dragRange.setStartBefore( sourceWidget.wrapper );
			dragRange.setEndAfter( sourceWidget.wrapper );
			evt.data.dragRange = dragRange;

			// [IE8-9] Reset state of the clipboard#fixSplitNodesAfterDrop fix because by setting evt.data.dragRange
			// (see above) after drop happened we do not need it. That fix is needed only if dragRange was created
			// before drop (before text node was split).
			delete CKEDITOR.plugins.clipboard.dragStartContainerChildCount;
			delete CKEDITOR.plugins.clipboard.dragEndContainerChildCount;

			evt.data.dataTransfer.setData( 'text/html', sourceWidget.getClipboardHtml() );
			editor.widgets.destroy( sourceWidget, true );

			// In case of dropping widget, the fake selection should be on the widget itself.
			// Thanks to that we should always get widget from range's boundary nodes.
			function getWidgetFromRange( range ) {
				var startElement = range.getBoundaryNodes().startNode;

				if ( startElement.type !== CKEDITOR.NODE_ELEMENT ) {
					startElement = startElement.getParent();
				}

				return editor.widgets.getByElement( startElement );
			}

			function isTheSameWidget( widget1, widget2 ) {
				if ( !widget1 || !widget2 ) {
					return false;
				}

				return widget1.wrapper.equals( widget2.wrapper ) || widget1.wrapper.contains( widget2.wrapper );
			}
		} );

		editor.on( 'contentDom', function() {
			var editable = editor.editable();

			// Register Lineutils's utilities as properties of repo.
			CKEDITOR.tools.extend( widgetsRepo, {
				finder: new lineutils.finder( editor, {
					lookups: {
						// Element is block but not list item and not in nested editable.
						'default': function( el ) {
							if ( el.is( CKEDITOR.dtd.$listItem ) )
								return;

							if ( !el.is( CKEDITOR.dtd.$block ) )
								return;

							// Allow drop line inside, but never before or after nested editable (https://dev.ckeditor.com/ticket/12006).
							if ( Widget.isDomNestedEditable( el ) )
								return;

							// Do not allow droping inside the widget being dragged (https://dev.ckeditor.com/ticket/13397).
							if ( widgetsRepo._.draggedWidget.wrapper.contains( el ) ) {
								return;
							}

							// If element is nested editable, make sure widget can be dropped there (https://dev.ckeditor.com/ticket/12006).
							var nestedEditable = Widget.getNestedEditable( editable, el );
							if ( nestedEditable ) {
								var draggedWidget = widgetsRepo._.draggedWidget;

								// Don't let the widget to be dropped into its own nested editable.
								if ( widgetsRepo.getByElement( nestedEditable ) == draggedWidget )
									return;

								var filter = CKEDITOR.filter.instances[ nestedEditable.data( 'cke-filter' ) ],
									draggedRequiredContent = draggedWidget.requiredContent;

								// There will be no relation if the filter of nested editable does not allow
								// requiredContent of dragged widget.
								if ( filter && draggedRequiredContent && !filter.check( draggedRequiredContent ) )
									return;
							}

							return CKEDITOR.LINEUTILS_BEFORE | CKEDITOR.LINEUTILS_AFTER;
						}
					}
				} ),
				locator: new lineutils.locator( editor ),
				liner: new lineutils.liner( editor, {
					lineStyle: {
						cursor: 'move !important',
						'border-top-color': '#666'
					},
					tipLeftStyle: {
						'border-left-color': '#666'
					},
					tipRightStyle: {
						'border-right-color': '#666'
					}
				} )
			}, true );
		} );
	}

	// Setup mouse observer which will trigger:
	// * widget focus on widget click,
	// * widget#doubleclick forwarded from editor#doubleclick.
	function setupMouseObserver( widgetsRepo ) {
		var editor = widgetsRepo.editor;

		editor.on( 'contentDom', function() {
			var editable = editor.editable(),
				evtRoot = editable.isInline() ? editable : editor.document,
				widget,
				mouseDownOnDragHandler;

			editable.attachListener( evtRoot, 'mousedown', function( evt ) {
				var target = evt.data.getTarget();

				// Clicking scrollbar in Chrome will invoke event with target object of document type (#663).
				// In IE8 the target object will be empty (https://dev.ckeditor.com/ticket/10887).
				// We need to check if target is a proper element.
				widget = ( target instanceof CKEDITOR.dom.element ) ? widgetsRepo.getByElement( target ) : null;

				mouseDownOnDragHandler = 0; // Reset.

				// Widget was clicked, but not editable nested in it.
				if ( widget ) {
					// Ignore mousedown on drag and drop handler if the widget is inline.
					// Block widgets are handled by Lineutils.
					if ( widget.inline && target.type == CKEDITOR.NODE_ELEMENT && target.hasAttribute( 'data-cke-widget-drag-handler' ) ) {
						mouseDownOnDragHandler = 1;

						// When drag handler is pressed we have to clear current selection if it wasn't already on this widget.
						// Otherwise, the selection may be in a fillingChar, which prevents dragging a widget. (https://dev.ckeditor.com/ticket/13284, see comment 8 and 9.)
						if ( widgetsRepo.focused != widget )
							editor.getSelection().removeAllRanges();

						return;
					}

					if ( !Widget.getNestedEditable( widget.wrapper, target ) ) {
						evt.data.preventDefault();
						if ( !CKEDITOR.env.ie )
							widget.focus();
					} else {
						// Reset widget so mouseup listener is not confused.
						widget = null;
					}
				}
			} );

			// Focus widget on mouseup if mousedown was fired on drag handler.
			// Note: mouseup won't be fired at all if widget was dragged and dropped, so
			// this code will be executed only when drag handler was clicked.
			editable.attachListener( evtRoot, 'mouseup', function() {
				// Check if widget is not destroyed (if widget is destroyed the wrapper will be null).
				if ( mouseDownOnDragHandler && widget && widget.wrapper ) {
					mouseDownOnDragHandler = 0;
					widget.focus();
				}
			} );

			// On IE it is not enough to block mousedown. If widget wrapper (element with
			// contenteditable=false attribute) is clicked directly (it is a target),
			// then after mouseup/click IE will select that element.
			// It is not possible to prevent that default action,
			// so we force fake selection after everything happened.
			if ( CKEDITOR.env.ie ) {
				editable.attachListener( evtRoot, 'mouseup', function() {
					setTimeout( function() {
						// Check if widget is not destroyed (if widget is destroyed the wrapper will be null) and
						// in editable contains widget (it could be dragged and removed).
						if ( widget && widget.wrapper && editable.contains( widget.wrapper ) ) {
							widget.focus();
							widget = null;
						}
					} );
				} );
			}
		} );

		editor.on( 'doubleclick', function( evt ) {
			var widget = widgetsRepo.getByElement( evt.data.element );

			// Not in widget or in nested editable.
			if ( !widget || Widget.getNestedEditable( widget.wrapper, evt.data.element ) )
				return;

			return widget.fire( 'doubleclick', { element: evt.data.element } );
		}, null, null, 1 );
	}

	// Setup editor#key observer which will forward it
	// to focused widget.
	function setupKeyboardObserver( widgetsRepo ) {
		var editor = widgetsRepo.editor;

		editor.on( 'key', function( evt ) {
			var focused = widgetsRepo.focused,
				widgetHoldingFocusedEditable = widgetsRepo.widgetHoldingFocusedEditable,
				ret;

			if ( focused )
				ret = focused.fire( 'key', { keyCode: evt.data.keyCode } );
			else if ( widgetHoldingFocusedEditable )
				ret = onEditableKey( widgetHoldingFocusedEditable, evt.data.keyCode );

			return ret;
		}, null, null, 1 );
	}

	// Setup copybin on native copy and cut events in order to handle copy and cut commands
	// if the user accepted the security alert on IEs.
	// Note: When copying or cutting using keystroke, copyWidgets will be executed first
	// by the keydown listener. A conflict between two calls will be resolved by the copy_bin existence check.
	function setupNativeCutAndCopy( widgetsRepo ) {
		var editor = widgetsRepo.editor;

		editor.on( 'contentDom', function() {
			var editable = editor.editable();

			editable.attachListener( editable, 'copy', eventListener );
			editable.attachListener( editable, 'cut', eventListener );
		} );

		function eventListener( evt ) {
			if ( widgetsRepo.selected.length < 1 ) {
				return;
			}

			copyWidgets( editor, evt.name === 'cut' );
		}
	}

	// Setup selection observer which will trigger:
	// * widget select & focus on selection change,
	// * nested editable focus (related properties and classes) on selection change,
	// * deselecting and blurring all widgets on data,
	// * blurring widget on editor blur.
	function setupSelectionObserver( widgetsRepo ) {
		var editor = widgetsRepo.editor;

		editor.on( 'selectionCheck', fireCheckSelection );

		// The selectionCheck event is fired on keyup, so we must force refreshing
		// widgets selection on key event. Also fire it only in WYSIWYG mode (#3352, #3704).
		editor.on( 'contentDom', function() {
			editor.editable().attachListener( editor, 'key', function() {
				setTimeout( fireCheckSelection, 10 );
			} );
		} );

		// (#3498)
		if ( !CKEDITOR.env.ie ) {
			widgetsRepo.on( 'checkSelection', fixCrossContentSelection );
		}

		widgetsRepo.on( 'checkSelection', widgetsRepo.checkSelection, widgetsRepo );

		editor.on( 'selectionChange', function( evt ) {
			var nestedEditable = Widget.getNestedEditable( editor.editable(), evt.data.selection.getStartElement() ),
				newWidget = nestedEditable && widgetsRepo.getByElement( nestedEditable ),
				oldWidget = widgetsRepo.widgetHoldingFocusedEditable;

			if ( oldWidget ) {
				if ( oldWidget !== newWidget || !oldWidget.focusedEditable.equals( nestedEditable ) ) {
					setFocusedEditable( widgetsRepo, oldWidget, null );

					if ( newWidget && nestedEditable )
						setFocusedEditable( widgetsRepo, newWidget, nestedEditable );
				}
			}
			// It may happen that there's no widget even if editable was found -
			// e.g. if selection was automatically set in editable although widget wasn't initialized yet.
			else if ( newWidget && nestedEditable ) {
				setFocusedEditable( widgetsRepo, newWidget, nestedEditable );
			}
		} );

		// Invalidate old widgets early - immediately on dataReady.
		editor.on( 'dataReady', function() {
			// Deselect and blur all widgets.
			stateUpdater( widgetsRepo ).commit();
		} );

		editor.on( 'blur', function() {
			var widget;

			if ( ( widget = widgetsRepo.focused ) )
				blurWidget( widgetsRepo, widget );

			if ( ( widget = widgetsRepo.widgetHoldingFocusedEditable ) )
				setFocusedEditable( widgetsRepo, widget, null );
		} );

		// Selection is fixed only when it starts in content and ends in a widget (and vice versa).
		// It's not possible to manually create selection which starts inside one widget and ends in another,
		// so we are skipping this case to simplify implementation (#3498).
		function fixCrossContentSelection() {
			var selection = editor.getSelection();
			if ( !selection ) {
				return;
			}

			var range = selection.getRanges()[ 0 ];
			if ( !range || range.collapsed ) {
				return;
			}

			var startWidget = findWidget( range.startContainer ),
				endWidget = findWidget( range.endContainer );

			if ( !startWidget && endWidget ) {
				range.setEndBefore( endWidget.wrapper );
				range.select();
			} else if ( startWidget && !endWidget ) {
				range.setStartAfter( startWidget.wrapper );
				range.select();
			}
		}

		function findWidget( node ) {
			if ( !node ) {
				return null;
			}

			if ( node.type == CKEDITOR.NODE_TEXT ) {
				return findWidget( node.getParent() );
			}

			return editor.widgets.getByElement( node );
		}

		function fireCheckSelection() {
			widgetsRepo.fire( 'checkSelection' );
		}
	}

	// Set up actions like:
	// * processing in toHtml/toDataFormat,
	// * pasting handling,
	// * insertion handling,
	// * editable reload handling (setData, mode switch, undo/redo),
	// * DOM invalidation handling,
	// * widgets checks.
	function setupWidgetsLifecycle( widgetsRepo ) {
		setupWidgetsLifecycleStart( widgetsRepo );
		setupWidgetsLifecycleEnd( widgetsRepo );

		widgetsRepo.on( 'checkWidgets', checkWidgets );
		widgetsRepo.editor.on( 'contentDomInvalidated', widgetsRepo.checkWidgets, widgetsRepo );
	}

	function setupWidgetsLifecycleEnd( widgetsRepo ) {
		var editor = widgetsRepo.editor,
			downcastingSessions = {};

		// Listen before htmlDP#htmlFilter is applied to cache all widgets, because we'll
		// loose data-cke-* attributes.
		editor.on( 'toDataFormat', function( evt ) {
			// To avoid conflicts between htmlDP#toDF calls done at the same time
			// (e.g. nestedEditable#getData called during downcasting some widget)
			// mark every toDataFormat event chain with the downcasting session id.
			var id = CKEDITOR.tools.getNextNumber(),
				toBeDowncasted = [];
			evt.data.downcastingSessionId = id;
			downcastingSessions[ id ] = toBeDowncasted;

			evt.data.dataValue.forEach( function( element ) {
				var attrs = element.attributes,
					widget, widgetElement;

				// Reset initial and trailing space by replacing &nbsp; with white space (#605).
				if ( 'data-cke-widget-white-space' in attrs ) {
					var firstTextNode = getFirstTextNode( element ),
						lastTextNode = getLastTextNode( element );

					// Check whether the value of the text node contains &nbsp; at the beginning and replace it with white space.
					if ( firstTextNode.parent.attributes[ 'data-cke-white-space-first' ] ) {
						firstTextNode.value = firstTextNode.value.replace( /^&nbsp;/g, ' ' );
					}

					// Check whether the value of the text node contains &nbsp; at the end and replace it with white space.
					if ( lastTextNode.parent.attributes[ 'data-cke-white-space-last' ] ) {
						lastTextNode.value = lastTextNode.value.replace( /&nbsp;$/g, ' ' );
					}
				}

				// Wrapper.
				// Perform first part of downcasting (cleanup) and cache widgets,
				// because after applying DP's filter all data-cke-* attributes will be gone.
				if ( 'data-cke-widget-id' in attrs ) {
					widget = widgetsRepo.instances[ attrs[ 'data-cke-widget-id' ] ];
					if ( widget ) {
						widgetElement = element.getFirst( Widget.isParserWidgetElement );
						toBeDowncasted.push( {
							wrapper: element,
							element: widgetElement,
							widget: widget,
							editables: {}
						} );

						// If widget did not have data-cke-widget attribute before upcasting remove it.
						if ( widgetElement && widgetElement.attributes[ 'data-cke-widget-keep-attr' ] != '1' ) {
							delete widgetElement.attributes[ 'data-widget' ];
						}
					}
				}
				// Nested editable.
				else if ( 'data-cke-widget-editable' in attrs ) {
					// Save the reference to this nested editable in the closest widget to be downcasted.
					// Nested editables are downcasted in the successive toDataFormat to create an opportunity
					// for dataFilter's "excludeNestedEditable" option to do its job (that option relies on
					// contenteditable="true" attribute) (https://dev.ckeditor.com/ticket/11372).
					// There is possibility that nested editable is detected during pasting, when widget
					// containing it is not yet upcasted (#1469).
					if ( toBeDowncasted.length > 0 ) {
						toBeDowncasted[ toBeDowncasted.length - 1 ].editables[ attrs[ 'data-cke-widget-editable' ] ] = element;
					}

					// Don't check children - there won't be next wrapper or nested editable which we
					// should process in this session.
					return false;
				}
			}, CKEDITOR.NODE_ELEMENT, true );
		}, null, null, 8 );

		// Listen after dataProcessor.htmlFilter and ACF were applied
		// so wrappers securing widgets' contents are removed after all filtering was done.
		editor.on( 'toDataFormat', function( evt ) {
			// Ignore some unmarked sessions.
			if ( !evt.data.downcastingSessionId )
				return;

			var toBeDowncasted = downcastingSessions[ evt.data.downcastingSessionId ],
				toBe, widget, widgetElement, retElement, editableElement, e, parserFragment;

			while ( ( toBe = toBeDowncasted.shift() ) ) {
				widget = toBe.widget;
				widgetElement = toBe.element;
				retElement = widget._.downcastFn && widget._.downcastFn.call( widget, widgetElement );

				// In case of copying widgets, we replace the widget with clipboard data (#3138).
				if ( evt.data.widgetsCopy && widget.getClipboardHtml ) {
					parserFragment = CKEDITOR.htmlParser.fragment.fromHtml( widget.getClipboardHtml() );

					retElement = parserFragment.children[ 0 ];
				}

				// Replace nested editables' content with their output data.
				for ( e in toBe.editables ) {
					editableElement = toBe.editables[ e ];

					delete editableElement.attributes.contenteditable;
					editableElement.setHtml( widget.editables[ e ].getData() );
				}

				// Returned element always defaults to widgetElement.
				if ( !retElement )
					retElement = widgetElement;

				// In some edge cases (especially applying formating
				// at the boundary of the inline editable) the widget
				// is going to be duplicated (split in half).
				// In that case there won't be a retElement
				// and we can safely remove such doppelganger widget (#698).
				if ( retElement ) {
					toBe.wrapper.replaceWith( retElement );
				} else {
					toBe.wrapper.remove();
				}
			}
		}, null, null, 13 );


		editor.on( 'contentDomUnload', function() {
			widgetsRepo.destroyAll( true );
		} );
	}

	function setupWidgetsLifecycleStart( widgetsRepo ) {
		var editor = widgetsRepo.editor,
			processedWidgetOnly,
			snapshotLoaded;

		// Listen after ACF (so data are filtered),
		// but before dataProcessor.dataFilter was applied (so we can secure widgets' internals).
		editor.on( 'toHtml', function( evt ) {
			var upcastIterator = createUpcastIterator( widgetsRepo ),
				toBeWrapped;

			evt.data.dataValue.forEach( upcastIterator.iterator, CKEDITOR.NODE_ELEMENT, true );

			// Clean up and wrap all queued elements.
			while ( ( toBeWrapped = upcastIterator.toBeWrapped.pop() ) ) {
				cleanUpWidgetElement( toBeWrapped[ 0 ] );
				widgetsRepo.wrapElement( toBeWrapped[ 0 ], toBeWrapped[ 1 ] );
			}

			// Used to determine whether only widget was pasted.
			if ( evt.data.protectedWhitespaces ) {
				// Whitespaces are protected by wrapping content with spans. Take the middle node only.
				processedWidgetOnly = evt.data.dataValue.children.length == 3 &&
					Widget.isParserWidgetWrapper( evt.data.dataValue.children[ 1 ] );
			} else {
				processedWidgetOnly = evt.data.dataValue.children.length == 1 &&
					Widget.isParserWidgetWrapper( evt.data.dataValue.children[ 0 ] );
			}
		}, null, null, 8 );

		editor.on( 'dataReady', function() {
			// Clean up all widgets loaded from snapshot.
			if ( snapshotLoaded ) {
				cleanUpAllWidgetElements( widgetsRepo, editor.editable() );
			}
			snapshotLoaded = 0;

			// Some widgets were destroyed on contentDomUnload,
			// some on loadSnapshot, but that does not include
			// e.g. setHtml on inline editor or widgets removed just
			// before setting data.
			widgetsRepo.destroyAll( true );
			widgetsRepo.initOnAll();
		} );

		// Set flag so dataReady will know that additional
		// cleanup is needed, because snapshot containing widgets was loaded.
		editor.on( 'loadSnapshot', function( evt ) {
			// Primitive but sufficient check which will prevent from executing
			// heavier cleanUpAllWidgetElements if not needed.
			if ( ( /data-cke-widget/ ).test( evt.data ) ) {
				snapshotLoaded = 1;
			}

			widgetsRepo.destroyAll( true );
		}, null, null, 9 );

		// Handle pasted single widget.
		editor.on( 'paste', function( evt ) {
			var data = evt.data;

			data.dataValue = data.dataValue.replace( pasteReplaceRegex, pasteReplaceFn );

			// If drag'n'drop kind of paste into nested editable (data.range), selection is set AFTER
			// data is pasted, which means editor has no chance to change activeFilter's context.
			// As a result, pasted data is filtered with default editor's filter instead of NE's and
			// funny things get inserted. Changing the filter by analysis of the paste range below (https://dev.ckeditor.com/ticket/13186).
			if ( data.range ) {
				// Check if pasting into nested editable.
				var nestedEditable = Widget.getNestedEditable( editor.editable(), data.range.startContainer );

				if ( nestedEditable ) {
					// Retrieve the filter from NE's data and set it active before editor.insertHtml is done
					// in clipboard plugin.
					var filter = CKEDITOR.filter.instances[ nestedEditable.data( 'cke-filter' ) ];

					if ( filter ) {
						editor.setActiveFilter( filter );
					}
				}
			}
		} );

		// Listen with high priority to check widgets after data was inserted.
		editor.on( 'afterInsertHtml', function( evt ) {
			if ( evt.data.intoRange ) {
				widgetsRepo.checkWidgets( { initOnlyNew: true } );
			} else {
				editor.fire( 'lockSnapshot' );
				// Init only new for performance reason.
				// Focus inited if only widget was processed.
				widgetsRepo.checkWidgets( { initOnlyNew: true, focusInited: processedWidgetOnly } );

				editor.fire( 'unlockSnapshot' );
			}
		} );
	}

	// Helper for coordinating which widgets should be
	// selected/deselected and which one should be focused/blurred.
	function stateUpdater( widgetsRepo ) {
		var currentlySelected = widgetsRepo.selected,
			toBeSelected = [],
			toBeDeselected = currentlySelected.slice( 0 ),
			focused = null;

		return {
			select: function( widget ) {
				if ( CKEDITOR.tools.indexOf( currentlySelected, widget ) < 0 ) {
					toBeSelected.push( widget );
				}

				var index = CKEDITOR.tools.indexOf( toBeDeselected, widget );
				if ( index >= 0 ) {
					toBeDeselected.splice( index, 1 );
				}

				return this;
			},

			focus: function( widget ) {
				focused = widget;
				return this;
			},

			commit: function() {
				var focusedChanged = widgetsRepo.focused !== focused,
					widget, isDirty;

				widgetsRepo.editor.fire( 'lockSnapshot' );

				if ( focusedChanged && ( widget = widgetsRepo.focused ) ) {
					blurWidget( widgetsRepo, widget );
				}

				while ( ( widget = toBeDeselected.pop() ) ) {
					currentlySelected.splice( CKEDITOR.tools.indexOf( currentlySelected, widget ), 1 );
					// Widget could be destroyed in the meantime - e.g. data could be set.
					if ( widget.isInited() ) {
						isDirty = widget.editor.checkDirty();

						widget.setSelected( false );

						!isDirty && widget.editor.resetDirty();
					}
				}

				if ( focusedChanged && focused ) {
					isDirty = widgetsRepo.editor.checkDirty();

					widgetsRepo.focused = focused;
					widgetsRepo.fire( 'widgetFocused', { widget: focused } );
					focused.setFocused( true );

					!isDirty && widgetsRepo.editor.resetDirty();
				}

				while ( ( widget = toBeSelected.pop() ) ) {
					currentlySelected.push( widget );
					widget.setSelected( true );
				}

				widgetsRepo.editor.fire( 'unlockSnapshot' );
			}
		};
	}

	function setupUndoFilter( undoManager ) {
		if ( !undoManager ) {
			return;
		}

		undoManager.addFilterRule( function( data ) {
			return data.replace( /\s*cke_widget_selected/g, '' )
				.replace( /\s*cke_widget_focused/g, '' );
		} );
	}

	//
	// WIDGET helpers ---------------------------------------------------------
	//

	// LEFT, RIGHT, UP, DOWN, DEL, BACKSPACE - unblock default fake sel handlers.
	var keystrokesNotBlockedByWidget = { 37: 1, 38: 1, 39: 1, 40: 1, 8: 1, 46: 1 };

	// Do not block SHIFT + F10 which opens context menu (#1901).
	keystrokesNotBlockedByWidget[ CKEDITOR.SHIFT + 121 ] = 1;

	// Applies or removes style's classes from widget.
	// @param {CKEDITOR.style} style Custom widget style.
	// @param {Boolean} apply Whether to apply or remove style.
	function applyRemoveStyle( widget, style, apply ) {
		var changed = 0,
			classes = getStyleClasses( style ),
			updatedClasses = widget.data.classes || {},
			cl;

		// Ee... Something is wrong with this style.
		if ( !classes ) {
			return;
		}

		// Clone, because we need to break reference.
		updatedClasses = CKEDITOR.tools.clone( updatedClasses );

		while ( ( cl = classes.pop() ) ) {
			if ( apply ) {
				if ( !updatedClasses[ cl ] ) {
					changed = updatedClasses[ cl ] = 1;
				}
			} else {
				if ( updatedClasses[ cl ] ) {
					delete updatedClasses[ cl ];
					changed = 1;
				}
			}
		}
		if ( changed ) {
			widget.setData( 'classes', updatedClasses );
		}
	}

	function cancel( evt ) {
		evt.cancel();
	}

	var CopyBin = CKEDITOR.tools.createClass( {
		$: function( editor, options ) {
			this._.createCopyBin( editor, options );
			this._.createListeners( options );
		},

		_: {
			createCopyBin: function( editor ) {
				// [IE] Use span for copybin and its container to avoid bug with expanding
				// editable height by absolutely positioned element.
				// For Edge 16+ always use div, as span causes scrolling to the end of the document
				// on widget cut (also for blockless editor) (#1160).
				// Edge 16+ workaround could be safetly removed after #1169 is fixed.
				var doc = editor.document,
					isEdge16 = CKEDITOR.env.edge && CKEDITOR.env.version >= 16,
					copyBinName = ( ( editor.blockless || CKEDITOR.env.ie ) && !isEdge16 ) ? 'span' : 'div',
					copyBin = doc.createElement( copyBinName ),
					container = doc.createElement( copyBinName );

				container.setAttributes( {
					id: 'cke_copybin',
					'data-cke-temp': '1'
				} );

				// Position copybin element outside current viewport.
				copyBin.setStyles( {
					position: 'absolute',
					width: '1px',
					height: '1px',
					overflow: 'hidden'
				} );

				copyBin.setStyle( editor.config.contentsLangDirection == 'ltr' ? 'left' : 'right', '-5000px' );

				this.editor = editor;
				this.copyBin = copyBin;
				this.container = container;
			},

			createListeners: function( options ) {
				if ( !options ) {
					return;
				}

				if ( options.beforeDestroy ) {
					this.beforeDestroy = options.beforeDestroy;
				}

				if ( options.afterDestroy ) {
					this.afterDestroy = options.afterDestroy;
				}
			}
		},

		proto: {
			handle: function( html ) {
				var copyBin = this.copyBin,
					editor = this.editor,
					container = this.container,
					// IE8 always jumps to the end of document.
					needsScrollHack = CKEDITOR.env.ie && CKEDITOR.env.version < 9,
					docElement = editor.document.getDocumentElement().$,
					range = editor.createRange(),
					that = this,
					// We need 100ms timeout for Chrome on macOS so it will be able to grab the content on cut.
					isMacWebkit = CKEDITOR.env.mac && CKEDITOR.env.webkit,
					copyTimeout = isMacWebkit ? 100 : 0,
					waitForContent = window.requestAnimationFrame && !isMacWebkit ? requestAnimationFrame : setTimeout,
					listener1,
					listener2,
					scrollTop;

				copyBin.setHtml(
					'<span data-cke-copybin-start="1">\u200b</span>' +
					html +
					'<span data-cke-copybin-end="1">\u200b</span>' );

				// Ignore copybin.
				editor.fire( 'lockSnapshot' );


				container.append( copyBin );
				editor.editable().append( container );

				listener1 = editor.on( 'selectionChange', cancel, null, null, 0 );
				listener2 = editor.widgets.on( 'checkSelection', cancel, null, null, 0 );

				if ( needsScrollHack ) {
					scrollTop = docElement.scrollTop;
				}

				// Once the clone of the widget is inside of copybin, select
				// the entire contents. This selection will be copied by the
				// native browser's clipboard system.
				range.selectNodeContents( copyBin );
				range.select();

				if ( needsScrollHack ) {
					docElement.scrollTop = scrollTop;
				}

				return new CKEDITOR.tools.promise( function( resolve ) {
					waitForContent( function() {
						if ( that.beforeDestroy ) {
							that.beforeDestroy();
						}

						container.remove();

						listener1.removeListener();
						listener2.removeListener();

						editor.fire( 'unlockSnapshot' );

						if ( that.afterDestroy ) {
							that.afterDestroy();
						}

						resolve();
					}, copyTimeout );
				} );
			}
		},

		statics: {
			hasCopyBin: function( editor ) {
				return !!CopyBin.getCopyBin( editor );
			},

			getCopyBin: function( editor ) {
				return editor.document.getById( 'cke_copybin' );
			}
		}
	} );

	function insertLine( widget, position ) {
		var elementTag = decodeEnterMode( widget.editor.config.enterMode ),
			newElement = new CKEDITOR.dom.element( elementTag );

		// Avoid nesting <br> inside <br>.
		if ( elementTag !== 'br' ) {
			newElement.appendBogus();
		}

		if ( position === 'after' ) {
			newElement.insertAfter( widget.wrapper );
		} else {
			newElement.insertBefore( widget.wrapper );
		}

		select( newElement );

		function decodeEnterMode( option ) {
			if ( option == CKEDITOR.ENTER_BR ) {
				return 'br';
			} else if ( option == CKEDITOR.ENTER_DIV ) {
				return 'div';
			}

			// Default option - CKEDITOR.ENTER_P.
			return 'p';
		}

		function select( element ) {
			var newRange = widget.editor.createRange();

			newRange.setStart( element, 0 );
			widget.editor.getSelection().selectRanges( [ newRange ] );
		}
	}

	function copyWidgets( editor, isCut ) {
		var focused = editor.widgets.focused,
			isWholeSelection,
			copyBin,
			bookmarks;

		// We're still handling previous copy/cut.
		// When keystroke is used to copy/cut this will also prevent
		// conflict with copyWidgets called again for native copy/cut event.
		if ( CopyBin.hasCopyBin( editor ) ) {
			return;
		}

		copyBin = new CopyBin( editor, {
			beforeDestroy: function() {
				if ( !isCut && focused ) {
					focused.focus();
				}

				if ( bookmarks ) {
					editor.getSelection().selectBookmarks( bookmarks );
				}

				if ( isWholeSelection ) {
					CKEDITOR.plugins.widgetselection.addFillers( editor.editable() );
				}
			},

			afterDestroy: function() {
				// Prevent cutting in read-only editor (#1570).
				if ( isCut && !editor.readOnly ) {
					handleCut();
				}
			}
		} );

		// When more than one widget is selected, we must save selection to restore it
		// after destroying copybin. Additionally we have to work around issue with selecting all in
		// Blink and WebKit, when widgets are at the beginning and at the end of the content (#3138).
		if ( !focused ) {
			isWholeSelection = CKEDITOR.env.webkit && CKEDITOR.plugins.widgetselection.isWholeContentSelected( editor.editable() );
			bookmarks = editor.getSelection().createBookmarks( true );
		}

		copyBin.handle( getClipboardHtml( editor ) );

		function handleCut() {
			if ( focused ) {
				editor.widgets.del( focused );
			} else {
				editor.extractSelectedHtml();
			}

			editor.fire( 'saveSnapshot' );
		}
	}

	// Extracts classes array from style instance.
	function getStyleClasses( style ) {
		var attrs = style.getDefinition().attributes,
			classes = attrs && attrs[ 'class' ];

		return classes ? classes.split( /\s+/ ) : null;
	}

	// [IE] Force keeping focus because IE sometimes forgets to fire focus on main editable
	// when blurring nested editable.
	// @context widget
	function onEditableBlur() {
		var active = CKEDITOR.document.getActive(),
			editor = this.editor,
			editable = editor.editable();

		// If focus stays within editor override blur and set currentActive because it should be
		// automatically changed to editable on editable#focus but it is not fired.
		if ( ( editable.isInline() ? editable : editor.document.getWindow().getFrame() ).equals( active ) ) {
			editor.focusManager.focus( editable );
		}
	}

	// Force selectionChange when editable was focused.
	// Similar to hack in selection.js#~620.
	// @context widget
	function onEditableFocus() {
		// Gecko does not support 'DOMFocusIn' event on which we unlock selection
		// in selection.js to prevent selection locking when entering nested editables.
		if ( CKEDITOR.env.gecko ) {
			this.editor.unlockSelection();
		}

		// We don't need to force selectionCheck on Webkit, because on Webkit
		// we do that on DOMFocusIn in selection.js.
		if ( !CKEDITOR.env.webkit ) {
			this.editor.forceNextSelectionCheck();
			this.editor.selectionChange( 1 );
		}
	}

	function getClipboardHtml( editor ) {
		var selectedHtml = editor.getSelectedHtml( true );

		if ( editor.widgets.focused ) {
			return editor.widgets.focused.getClipboardHtml();
		}

		editor.once( 'toDataFormat', function( evt ) {
			evt.data.widgetsCopy = true;
		}, null, null, -1 );

		return editor.dataProcessor.toDataFormat( selectedHtml );
	}

	function setupWidget( widget, widgetDef ) {
		var keystrokeInsertLineBefore = widget.editor.config.widget_keystrokeInsertLineBefore,
			keystrokeInsertLineAfter = widget.editor.config.widget_keystrokeInsertLineAfter;

		setupWrapper( widget );
		setupParts( widget );
		setupEditables( widget );
		setupMask( widget );
		setupDragHandler( widget );
		setupDataClassesListener( widget );
		setupA11yListener( widget );

		// https://dev.ckeditor.com/ticket/11145: [IE8] Non-editable content of widget is draggable.
		if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
			widget.wrapper.on( 'dragstart', function( evt ) {
				var target = evt.data.getTarget();

				// Allow text dragging inside nested editables or dragging inline widget's drag handler.
				if ( !Widget.getNestedEditable( widget, target ) &&
					!( widget.inline &&
					Widget.isDomDragHandler( target ) ) ) {
					evt.data.preventDefault();
				}
			} );
		}

		widget.wrapper.removeClass( 'cke_widget_new' );
		widget.element.addClass( 'cke_widget_element' );

		widget.on( 'key', function( evt ) {
			var keyCode = evt.data.keyCode;

			// Insert a new paragraph before the widget (#4467).
			if ( keyCode == keystrokeInsertLineBefore ) {
				insertLine( widget, 'before' );
				widget.editor.fire( 'saveSnapshot' );
			}
			// Insert a new paragraph after the widget (#4467).
			else if ( keyCode == keystrokeInsertLineAfter ) {
				insertLine( widget, 'after' );
				widget.editor.fire( 'saveSnapshot' );
			}
			// ENTER.
			else if ( keyCode == 13 ) {
				widget.edit();
			}
			// CTRL+C or CTRL+X.
			else if ( keyCode == CKEDITOR.CTRL + 67 || keyCode == CKEDITOR.CTRL + 88 ) {
				copyWidgets( widget.editor, keyCode == CKEDITOR.CTRL + 88 );
				return; // Do not preventDefault.
			}
			// Pass all CTRL/ALT keystrokes.
			// Pass chosen keystrokes to other plugins or default fake sel handlers.
			else if ( keyCode in keystrokesNotBlockedByWidget ||
				( CKEDITOR.CTRL & keyCode ) ||
				( CKEDITOR.ALT & keyCode ) ) {
				return;
			}
			return false;
		}, null, null, 999 );

		// Listen with high priority so it's possible
		// to overwrite this callback.

		widget.on( 'doubleclick', function( evt ) {
			if ( widget.edit() ) {
				// We have to cancel event if edit method opens a dialog, otherwise
				// link plugin may open extra dialog (https://dev.ckeditor.com/ticket/12140).
				evt.cancel();
			}
		} );

		if ( widgetDef.data ) {
			widget.on( 'data', widgetDef.data );
		}

		if ( widgetDef.edit ) {
			widget.on( 'edit', widgetDef.edit );
		}
	}

	function setupWrapper( widget ) {
		// Retrieve widget wrapper. Assign an id to it.
		var wrapper = widget.wrapper = widget.element.getParent();
		wrapper.setAttribute( 'data-cke-widget-id', widget.id );
	}

	// Replace parts object containing:
	// partName => selector pairs
	// with:
	// partName => element pairs
	function setupParts( widget, refreshInitialized ) {
		if ( !widget.partSelectors ) {
			widget.partSelectors = widget.parts;
		}

		if ( widget.parts ) {
			var parts = {},
				el,
				partName;

			for ( partName in widget.partSelectors ) {
				if ( refreshInitialized || !widget.parts[ partName ] || typeof widget.parts[ partName ] == 'string' ) {
					el = widget.wrapper.findOne( widget.partSelectors[ partName ] );
					parts[ partName ] = el;
				} else {
					parts[ partName ] = widget.parts[ partName ];
				}
			}
			widget.parts = parts;
		}
	}

	function setupEditables( widget ) {
		var definedEditables = widget.editables,
			editableName,
			editableDef;

		widget.editables = {};

		if ( !widget.editables ) {
			return;
		}

		for ( editableName in definedEditables ) {
			editableDef = definedEditables[ editableName ];
			widget.initEditable( editableName, typeof editableDef == 'string' ? { selector: editableDef } : editableDef );
		}
	}

	function setupMask( widget ) {
		if ( widget.mask === true ) {
			setupFullMask( widget );
		} else if ( widget.mask ) {
			// Buffer to limit number of separate calls to 'refreshPartialMask()', e.g. during writing.
			var maskBuffer = new CKEDITOR.tools.buffers.throttle( 250, refreshPartialMask, widget ),
				timeout = ( CKEDITOR.env.gecko ? 300 : 0 ),
				changeListener,
				blurListener;

			// First listener is the most obvious, refresh mask after every change that could affect widget.
			widget.on( 'focus', function() {
				// Refresh widget mask on initial focus. This handle cases when widget can be resized without
				// being focused and is focused right after (e.g. `image2` on Edge/IE browsers).
				maskBuffer.input();

				changeListener = widget.editor.on( 'change', maskBuffer.input );
				blurListener = widget.on( 'blur', function() {
					changeListener.removeListener();
					blurListener.removeListener();
				} );
			} );

			// Another insurance policy vs FF but this time also Chrome (the latter is just a bit better here).
			// This time setup mask after editor is ready (in FF it doesn't mean that widgets are fully loaded
			// so timeout is needed) and after switching from source mode (same story).
			widget.editor.on( 'instanceReady', function() {
				setTimeout( function() {
					maskBuffer.input();
				}, timeout );
			} );

			widget.editor.on( 'mode', function() {
				setTimeout( function() {
					maskBuffer.input();
				}, timeout );
			} );

			// FF renders image-like widget very late, so mask has to be create asynchronously after
			// image is loaded.
			if ( CKEDITOR.env.gecko ) {
				var imgs = widget.element.find( 'img' );
				CKEDITOR.tools.array.forEach( imgs.toArray(), function( img ) {
					img.on( 'load', function() {
						maskBuffer.input();
					} );
				} );
			}

			// Focusing editable doesn't trigger focus on widget, so listen to those events separately.
			for ( var editable in widget.editables ) {
				widget.editables[ editable ].on( 'focus', function() {
					widget.editor.on( 'change', maskBuffer.input );
					// If widget was focused before focusing editable, the 'blur' event has to be removed.
					// Otherwise on Chrome it will trigger after the focus event and cancel listening to
					// changes (on FF it works inversely).
					if ( blurListener ) {
						blurListener.removeListener();
					}
				} );
				widget.editables[ editable ].on( 'blur', function() {
					widget.editor.removeListener( 'change', maskBuffer.input );
				} );
			}

			// Trigger initial setup.
			maskBuffer.input();
		}
	}

	function setupFullMask( widget ) {
		// Reuse mask if already exists (https://dev.ckeditor.com/ticket/11281).
		var mask = widget.wrapper.findOne( '.cke_widget_mask' );

		if ( !mask ) {
			mask = new CKEDITOR.dom.element( 'img', widget.editor.document );
			mask.setAttributes( {
				src: CKEDITOR.tools.transparentImageData,
				'class': 'cke_reset cke_widget_mask'
			} );
			widget.wrapper.append( mask );
		}

		widget.mask = mask;
	}

	function refreshPartialMask() {
		if ( !this.wrapper ) {
			return;
		}

		// Original value of 'widget.mask' is substituted with actual mask element, so
		// 'widget.maskPart' property was added to be able to adjust partial mask e.g. after resizing.
		this.maskPart = this.maskPart || this.mask;

		var part = this.parts[ this.maskPart ],
			mask;

		// If requested part is invalid or wasn't fetched yet (#3775), don't create mask.
		if ( !part || typeof part == 'string' ) {
			return;
		}

		mask = this.wrapper.findOne( '.cke_widget_partial_mask' );

		if ( !mask ) {
			mask = new CKEDITOR.dom.element( 'img', this.editor.document );
			mask.setAttributes( {
				src: CKEDITOR.tools.transparentImageData,
				'class': 'cke_reset cke_widget_partial_mask'
			} );
			this.wrapper.append( mask );
		}

		this.mask = mask;

		if ( !isMaskFitting( mask, part ) ) {
			setMaskSizeAndPosition( mask, part );
		}
	}

	function isMaskFitting( oldElement, newElement ) {
		var oldEl = oldElement.$,
			newEl = newElement.$,
			dimensionsChanged = !( oldEl.offsetWidth == newEl.offsetWidth && oldEl.offsetHeight == newEl.offsetHeight ),
			positionChanged = !( oldEl.offsetTop == newEl.offsetTop && oldEl.offsetLeft == newEl.offsetLeft );

		return !( dimensionsChanged || positionChanged );
	}

	function setMaskSizeAndPosition( mask, maskedPart ) {
		// Widgets with resize feature are messing with default widget structure,
		// so it needs to be taken into account and mask's position will be adjusted.
		// The problem was appearing after dragging the widget in FF.
		var parent = maskedPart.getParent(),
			isDomWidget = CKEDITOR.plugins.widget.isDomWidget( parent );

		mask.setStyles( {
			top: maskedPart.$.offsetTop + ( !isDomWidget ? parent.$.offsetTop : 0 ) + 'px',
			left: maskedPart.$.offsetLeft + ( !isDomWidget ? parent.$.offsetLeft : 0 ) + 'px',
			width: maskedPart.$.offsetWidth + 'px',
			height: maskedPart.$.offsetHeight + 'px'
		} );
	}

	function setupDragHandler( widget ) {
		if ( !widget.draggable ) {
			return;
		}

		var editor = widget.editor,
			// Use getLast to find wrapper's direct descendant (https://dev.ckeditor.com/ticket/12022).
			container = widget.wrapper.getLast( Widget.isDomDragHandlerContainer ),
			img;

		// Reuse drag handler if already exists (https://dev.ckeditor.com/ticket/11281).
		if ( container ) {
			img = container.findOne( 'img' );
		} else {
			container = new CKEDITOR.dom.element( 'span', editor.document );
			container.setAttributes( {
				'class': 'cke_reset cke_widget_drag_handler_container',
				// Split background and background-image for IE8 which will break on rgba().
				// Initially drag handler should not be visible, until its position will be
				// calculated (https://dev.ckeditor.com/ticket/11177).
				// We need to hide unpositined handlers, so they don't extend
				// widget's outline far to the left (https://dev.ckeditor.com/ticket/12024).
				style: 'background:rgba(220,220,220,0.5);background-image:url(' + editor.plugins.widget.path + 'images/handle.png);' +
					'display:none;'
			} );

			img = new CKEDITOR.dom.element( 'img', editor.document );
			img.setAttributes( {
				'class': 'cke_reset cke_widget_drag_handler',
				'data-cke-widget-drag-handler': '1',
				src: CKEDITOR.tools.transparentImageData,
				width: DRAG_HANDLER_SIZE,
				title: editor.lang.widget.move,
				height: DRAG_HANDLER_SIZE,
				role: 'presentation'
			} );
			widget.inline && img.setAttribute( 'draggable', 'true' );

			container.append( img );
			widget.wrapper.append( container );
		}

		// Preventing page reload when dropped content on widget wrapper (https://dev.ckeditor.com/ticket/13015).
		// Widget is not editable so by default drop on it isn't allowed what means that
		// browser handles it (there's no editable#drop event). If there's no drop event we cannot block
		// the drop, so page is reloaded. This listener enables drop on widget wrappers.
		widget.wrapper.on( 'dragover', function( evt ) {
			evt.data.preventDefault();
		} );

		widget.wrapper.on( 'mouseenter', widget.updateDragHandlerPosition, widget );
		setTimeout( function() {
			widget.on( 'data', widget.updateDragHandlerPosition, widget );
		}, 50 );

		if ( !widget.inline ) {
			img.on( 'mousedown', onBlockWidgetDrag, widget );

			// On IE8 'dragstart' is propagated to editable, so editor#dragstart is fired twice on block widgets.
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
				img.on( 'dragstart', function( evt ) {
					evt.data.preventDefault( true );
				} );
			}
		}

		widget.dragHandlerContainer = container;
	}

	function onBlockWidgetDrag( evt ) {
		// Allow to drag widget only with left mouse button (#711).
		if ( CKEDITOR.tools.getMouseButton( evt ) !== CKEDITOR.MOUSE_BUTTON_LEFT ) {
			return;
		}

		var finder = this.repository.finder,
			locator = this.repository.locator,
			liner = this.repository.liner,
			editor = this.editor,
			editable = editor.editable(),
			listeners = [],
			sorted = [],
			locations,
			y;

		// Mark dragged widget for repository#finder.
		this.repository._.draggedWidget = this;

		// Harvest all possible relations and display some closest.
		var relations = finder.greedySearch(),
			buffer = CKEDITOR.tools.eventsBuffer( 50, function() {
				locations = locator.locate( relations );

				// There's only a single line displayed for D&D.
				sorted = locator.sort( y, 1 );

				if ( sorted.length ) {
					liner.prepare( relations, locations );
					liner.placeLine( sorted[ 0 ] );
					liner.cleanup();
				}
			} );

		// Let's have the "dragging cursor" over entire editable.
		editable.addClass( 'cke_widget_dragging' );

		// Cache mouse position so it is re-used in events buffer.
		listeners.push( editable.on( 'mousemove', function( evt ) {
			y = evt.data.$.clientY;
			buffer.input();
		} ) );

		// Fire drag start as it happens during the native D&D.
		editor.fire( 'dragstart', { target: evt.sender } );

		function onMouseUp() {
			var l;

			buffer.reset();

			// Stop observing events.
			while ( ( l = listeners.pop() ) )
				l.removeListener();

			onBlockWidgetDrop.call( this, sorted, evt.sender );
		}

		// Mouseup means "drop". This is when the widget is being detached
		// from DOM and placed at range determined by the line (location).
		listeners.push( editor.document.once( 'mouseup', onMouseUp, this ) );

		// Prevent calling 'onBlockWidgetDrop' twice in the inline editor.
		// `removeListener` does not work if it is called at the same time event is fired.
		if ( !editable.isInline() ) {
			// Mouseup may occur when user hovers the line, which belongs to
			// the outer document. This is, of course, a valid listener too.
			listeners.push( CKEDITOR.document.once( 'mouseup', onMouseUp, this ) );
		}
	}

	function onBlockWidgetDrop( sorted, dragTarget ) {
		var finder = this.repository.finder,
			liner = this.repository.liner,
			editor = this.editor,
			editable = this.editor.editable();

		if ( !CKEDITOR.tools.isEmpty( liner.visible ) ) {
			// Retrieve range for the closest location.
			var dropRange = finder.getRange( sorted[ 0 ] );

			// Focus widget (it could lost focus after mousedown+mouseup)
			// and save this state as the one where we want to be taken back when undoing.
			this.focus();

			// Drag range will be set in the drop listener.
			editor.fire( 'drop', {
				dropRange: dropRange,
				target: dropRange.startContainer
			} );
		}

		// Clean-up custom cursor for editable.
		editable.removeClass( 'cke_widget_dragging' );

		// Clean-up all remaining lines.
		liner.hideVisible();

		// Clean-up drag & drop.
		editor.fire( 'dragend', { target: dragTarget } );
	}

	// Setup listener on widget#data which will update (remove/add) classes
	// by comparing newly set classes with the old ones.
	function setupDataClassesListener( widget ) {
		// Note: previousClasses and newClasses may be null!
		// Tip: for ( cl in null ) is correct.
		var previousClasses = null;

		widget.on( 'data', function() {
			var newClasses = this.data.classes,
				cl;

			// When setting new classes one need to remember
			// that he must break reference.
			if ( previousClasses == newClasses ) {
				return;
			}

			for ( cl in previousClasses ) {
				// Avoid removing and adding classes again.
				if ( !( newClasses && newClasses[ cl ] ) ) {
					this.removeClass( cl );
				}
			}
			for ( cl in newClasses ) {
				this.addClass( cl );
			}

			previousClasses = newClasses;
		} );
	}

	// Add a listener to data event that will set/change widget's label (https://dev.ckeditor.com/ticket/14539).
	function setupA11yListener( widget ) {
		// Note, the function gets executed in a context of widget instance.
		function getLabelDefault() {
			return this.editor.lang.widget.label.replace( /%1/, this.pathName || this.element.getName() );
		}

		// Setting a listener on data is enough, there's no need to perform it on widget initialization, as
		// setupWidgetData fires this event anyway.
		widget.on( 'data', function() {
			// In some cases widget might get destroyed in an earlier data listener. For instance, image2 plugin, does
			// so when changing its internal state.
			if ( !widget.wrapper ) {
				return;
			}

			var label = this.getLabel ? this.getLabel() : getLabelDefault.call( this );

			widget.wrapper.setAttribute( 'role', 'region' );
			widget.wrapper.setAttribute( 'aria-label', label );
		}, null, null, 9999 );
	}

	function setupWidgetData( widget, startupData ) {
		var widgetDataAttr = widget.element.data( 'cke-widget-data' );

		if ( widgetDataAttr ) {
			widget.setData( JSON.parse( decodeURIComponent( widgetDataAttr ) ) );
		}
		if ( startupData ) {
			widget.setData( startupData );
		}

		// Populate classes if they are not preset.
		if ( !widget.data.classes ) {
			widget.setData( 'classes', widget.getClasses() );
		}

		// Unblock data and...
		widget.dataReady = true;

		// Write data to element because this was blocked when data wasn't ready.
		writeDataToElement( widget );

		// Fire data event first time, because this was blocked when data wasn't ready.
		widget.fire( 'data', widget.data );
	}

	function writeDataToElement( widget ) {
		widget.element.data( 'cke-widget-data', encodeURIComponent( JSON.stringify( widget.data ) ) );
	}

	//
	// WIDGET STYLE HANDLER ---------------------------------------------------
	//

	function addCustomStyleHandler() {
		// Styles categorized by group. It is used to prevent applying styles for the same group being used together.
		var styleGroups = {};

		/**
		 * The class representing a widget style. It is an {@link CKEDITOR#STYLE_OBJECT object} like
		 * the styles handler for widgets.
		 *
		 * **Note:** This custom style handler does not support all methods of the {@link CKEDITOR.style} class.
		 * Not supported methods: {@link #applyToRange}, {@link #removeFromRange}, {@link #applyToObject}.
		 *
		 * @since 4.4.0
		 * @class CKEDITOR.style.customHandlers.widget
		 * @extends CKEDITOR.style
		 */
		CKEDITOR.style.addCustomHandler( {
			type: 'widget',

			setup: function( styleDefinition ) {
				/**
				 * The name of widget to which this style can be applied.
				 * It is extracted from style definition's `widget` property.
				 *
				 * @property {String} widget
				 */
				this.widget = styleDefinition.widget;

				/**
				 * An array of groups that this style belongs to.
				 * Styles assigned to the same group cannot be combined.
				 *
				 * @since 4.6.2
				 * @property {Array} group
				 */
				this.group = typeof styleDefinition.group == 'string' ? [ styleDefinition.group ] : styleDefinition.group;

				// Store style categorized by its group.
				// It is used to prevent enabling two styles from same group.
				if ( this.group ) {
					saveStyleGroup( this );
				}
			},

			apply: function( editor ) {
				var widget;

				// Before CKEditor 4.4.0 wasn't a required argument, so we need to
				// handle a case when it wasn't provided.
				if ( !( editor instanceof CKEDITOR.editor ) ) {
					return;
				}

				// Theoretically we could bypass checkApplicable, get widget from
				// widgets.focused and check its name, what would be faster, but then
				// this custom style would work differently than the default style
				// which checks if it's applicable before applying or removing itself.
				if ( this.checkApplicable( editor.elementPath(), editor ) ) {
					widget = editor.widgets.focused;

					// Remove other styles from the same group.
					if ( this.group ) {
						this.removeStylesFromSameGroup( editor );
					}

					widget.applyStyle( this );
				}
			},

			remove: function( editor ) {
				// Before CKEditor 4.4.0 wasn't a required argument, so we need to
				// handle a case when it wasn't provided.
				if ( !( editor instanceof CKEDITOR.editor ) ) {
					return;
				}

				if ( this.checkApplicable( editor.elementPath(), editor ) ) {
					editor.widgets.focused.removeStyle( this );
				}
			},

			/**
			 * Removes all styles that belong to the same group as this style. This method will neither add nor remove
			 * the current style.
			 * Returns `true` if any style was removed, otherwise returns `false`.
			 *
			 * @since 4.6.2
			 * @param {CKEDITOR.editor} editor
			 * @returns {Boolean}
			 */
			removeStylesFromSameGroup: function( editor ) {
				var removed = false,
					stylesFromSameGroup,
					path;

				// Before CKEditor 4.4.0 wasn't a required argument, so we need to
				// handle a case when it wasn't provided.
				if ( !( editor instanceof CKEDITOR.editor ) ) {
					return false;
				}

				path = editor.elementPath();
				if ( this.checkApplicable( path, editor ) ) {
					// Iterate over each group.
					for ( var i = 0, l = this.group.length; i < l; i++ ) {
						stylesFromSameGroup = styleGroups[ this.widget ][ this.group[ i ] ];
						// Iterate over each style from group.
						for ( var j = 0; j < stylesFromSameGroup.length; j++ ) {
							if ( stylesFromSameGroup[ j ] !== this && stylesFromSameGroup[ j ].checkActive( path, editor ) ) {
								editor.widgets.focused.removeStyle( stylesFromSameGroup[ j ] );
								removed = true;
							}
						}
					}
				}

				return removed;
			},

			checkActive: function( elementPath, editor ) {
				return this.checkElementMatch( elementPath.lastElement, 0, editor );
			},

			checkApplicable: function( elementPath, editor ) {
				// Before CKEditor 4.4.0 wasn't a required argument, so we need to
				// handle a case when it wasn't provided.
				if ( !( editor instanceof CKEDITOR.editor ) ) {
					return false;
				}

				return this.checkElement( elementPath.lastElement );
			},

			checkElementMatch: checkElementMatch,

			checkElementRemovable: checkElementMatch,

			/**
			 * Checks if an element is a {@link CKEDITOR.plugins.widget#wrapper wrapper} of a
			 * widget whose name matches the {@link #widget widget name} specified in the style definition.
			 *
			 * @param {CKEDITOR.dom.element} element
			 * @returns {Boolean}
			 */
			checkElement: function( element ) {
				if ( !Widget.isDomWidgetWrapper( element ) ) {
					return false;
				}

				var widgetElement = element.getFirst( Widget.isDomWidgetElement );
				return widgetElement && widgetElement.data( 'widget' ) == this.widget;
			},

			buildPreview: function( label ) {
				return label || this._.definition.name;
			},

			/**
			 * Returns allowed content rules which should be registered for this style.
			 * Uses widget's {@link CKEDITOR.plugins.widget.definition#styleableElements} to make a rule
			 * allowing classes on specified elements or use widget's
			 * {@link CKEDITOR.plugins.widget.definition#styleToAllowedContentRules} method to transform a style
			 * into allowed content rules.
			 *
			 * @param {CKEDITOR.editor} The editor instance.
			 * @returns {CKEDITOR.filter.allowedContentRules}
			 */
			toAllowedContentRules: function( editor ) {
				if ( !editor ) {
					return null;
				}

				var widgetDef = editor.widgets.registered[ this.widget ],
					classes,
					rule = {};

				if ( !widgetDef ) {
					return null;
				}

				if ( widgetDef.styleableElements ) {
					classes = this.getClassesArray();
					if ( !classes ) {
						return null;
					}

					rule[ widgetDef.styleableElements ] = {
						classes: classes,
						propertiesOnly: true
					};
					return rule;
				}

				if ( widgetDef.styleToAllowedContentRules ) {
					return widgetDef.styleToAllowedContentRules( this );
				}
				return null;
			},

			/**
			 * Returns classes defined in the style in form of an array.
			 *
			 * @returns {String[]}
			 */
			getClassesArray: function() {
				var classes = this._.definition.attributes && this._.definition.attributes[ 'class' ];

				return classes ? CKEDITOR.tools.trim( classes ).split( /\s+/ ) : null;
			},

			/**
			 * Not implemented.
			 *
			 * @method applyToRange
			 */
			applyToRange: notImplemented,

			/**
			 * Not implemented.
			 *
			 * @method removeFromRange
			 */
			removeFromRange: notImplemented,

			/**
			 * Not implemented.
			 *
			 * @method applyToObject
			 */
			applyToObject: notImplemented
		} );

		function notImplemented() {}

		// @context style
		function checkElementMatch( element, fullMatch, editor ) {
			// Before CKEditor 4.4.0 wasn't a required argument, so we need to
			// handle a case when it wasn't provided.
			if ( !editor ) {
				return false;
			}

			if ( !this.checkElement( element ) ) {
				return false;
			}

			var widget = editor.widgets.getByElement( element, true );
			return widget && widget.checkStyleActive( this );
		}

		// Save and categorize style by its group.
		function saveStyleGroup( style ) {
			var widgetName = style.widget,
				groupName,
				group;

			if ( !styleGroups[ widgetName ] ) {
				styleGroups[ widgetName ] = {};
			}

			for ( var i = 0, l = style.group.length; i < l; i++ ) {
				groupName = style.group[ i ];

				if ( !styleGroups[ widgetName ][ groupName ] ) {
					styleGroups[ widgetName ][ groupName ] = [];
				}

				group = styleGroups[ widgetName ][ groupName ];

				// Don't push the style if it's already stored (#589).
				if ( !find( group, getCompareFn( style ) ) ) {
					group.push( style );
				}
			}

			// Copied `CKEDITOR.tools.array` from major branch.
			function find( array, fn, thisArg ) {
				var length = array.length,
					i = 0;

				while ( i < length ) {
					if ( fn.call( thisArg, array[ i ], i, array ) ) {
						return array[ i ];
					}
					i++;
				}

				return undefined;
			}

			function getCompareFn( left ) {
				return function( right ) {
					return deepCompare( left.getDefinition(), right.getDefinition() );
				};

				function deepCompare( left, right ) {
					var leftKeys = CKEDITOR.tools.object.keys( left ),
						rightKeys = CKEDITOR.tools.object.keys( right );

					if ( leftKeys.length !== rightKeys.length ) {
						return false;
					}

					for ( var key in left ) {
						var areSameObjects = typeof left[ key ] === 'object' && typeof right[ key ] === 'object' && deepCompare( left[ key ], right[ key ] );

						if ( !areSameObjects && left[ key ] !== right[ key ] ) {
							return false;
						}
					}

					return true;
				}
			}
		}

	}

	//
	// EXPOSE PUBLIC API ------------------------------------------------------
	//

	CKEDITOR.plugins.widget = Widget;
	Widget.repository = Repository;
	Widget.nestedEditable = NestedEditable;
} )();

/**
 * An event fired when a widget definition is registered by the {@link CKEDITOR.plugins.widget.repository#add} method.
 * It is possible to modify the definition being registered.
 *
 * @event widgetDefinition
 * @member CKEDITOR.editor
 * @param {CKEDITOR.plugins.widget.definition} data Widget definition.
 */

/**
 * This is an abstract class that describes the definition of a widget.
 * It is a type of {@link CKEDITOR.plugins.widget.repository#add} method's second argument.
 *
 * Widget instances inherit from registered widget definitions, although not in a prototypal way.
 * They are simply extended with corresponding widget definitions. Note that not all properties of
 * the widget definition become properties of a widget. Some, like {@link #data} or {@link #edit}, become
 * widget's events listeners.
 *
 * @class CKEDITOR.plugins.widget.definition
 * @abstract
 * @mixins CKEDITOR.feature
 */

/**
 * Widget definition name. It is automatically set when the definition is
 * {@link CKEDITOR.plugins.widget.repository#add registered}.
 *
 * @property {String} name
 */

/**
 * The method executed while initializing a widget, after a widget instance
 * is created, but before it is ready. It is executed before the first
 * {@link CKEDITOR.plugins.widget#event-data} is fired so it is common to
 * use the `init` method to populate widget data with information loaded from
 * the DOM, like for exmaple:
 *
 *		init: function() {
 *			this.setData( 'width', this.element.getStyle( 'width' ) );
 *
 *			if ( this.parts.caption.getStyle( 'display' ) != 'none' )
 *				this.setData( 'showCaption', true );
 *		}
 *
 * @property {Function} init
 */

/**
 * The function to be used to upcast an element to this widget or a
 * comma-separated list of upcast methods from the {@link #upcasts} object.
 *
 * The upcast function **is not** executed in the widget context (because the widget
 * does not exist yet), however, it is executed in the
 * {@link CKEDITOR.plugins.widget#definition widget's definition} context.
 * Two arguments are passed to the upcast function:
 *
 * * `element` ({@link CKEDITOR.htmlParser.element}) &ndash; The element to be checked.
 * * `data` (`Object`) &ndash; The object which can be extended with data which will then be passed to the widget.
 *
 * An element will be upcasted if a function returned `true` or an instance of
 * a {@link CKEDITOR.htmlParser.element} if upcasting meant DOM structure changes
 * (in this case the widget will be initialized on the returned element).
 *
 * @property {String/Function} upcast
 */

/**
 * The object containing functions which can be used to upcast this widget.
 * Only those pointed by the {@link #upcast} property will be used.
 *
 * In most cases it is appropriate to use {@link #upcast} directly,
 * because majority of widgets need just one method.
 * However, in some cases the widget author may want to expose more than one variant
 * and then this property may be used.
 *
 *		upcasts: {
 *			// This function may upcast only figure elements.
 *			figure: function() {
 *				// ...
 *			},
 *			// This function may upcast only image elements.
 *			image: function() {
 *				// ...
 *			},
 *			// More variants...
 *		}
 *
 *		// Then, widget user may choose which upcast methods will be enabled.
 *		editor.on( 'widgetDefinition', function( evt ) {
 *			if ( evt.data.name == 'image' )
 * 				evt.data.upcast = 'figure,image'; // Use both methods.
 *		} );
 *
 * @property {Object} upcasts
 */

/**
 * The {@link #upcast} method(s) priority. The upcast with a lower priority number will be called before
 * the one with a higher number. The default priority is `10`.
 *
 * @since 4.5.0
 * @property {Number} [upcastPriority=10]
 */

/**
 * The function to be used to downcast this widget or
 * a name of the downcast option from the {@link #downcasts} object.
 *
 * The downcast function will be executed in the {@link CKEDITOR.plugins.widget} context
 * and with `widgetElement` ({@link CKEDITOR.htmlParser.element}) argument which is
 * the widget's main element.
 *
 * The function may return an instance of the {@link CKEDITOR.htmlParser.node} class if the widget
 * needs to be downcasted to a different node than the widget's main element.
 *
 * @property {String/Function} downcast
 */

/**
 * The object containing functions which can be used to downcast this widget.
 * Only the one pointed by the {@link #downcast} property will be used.
 *
 * In most cases it is appropriate to use {@link #downcast} directly,
 * because majority of widgets have just one variant of downcasting (or none at all).
 * However, in some cases the widget author may want to expose more than one variant
 * and then this property may be used.
 *
 *		downcasts: {
 *			// This downcast may transform the widget into the figure element.
 *			figure: function() {
 *				// ...
 *			},
 *			// This downcast may transform the widget into the image element with data-* attributes.
 *			image: function() {
 *				// ...
 *			}
 *		}
 *
 *		// Then, the widget user may choose one of the downcast options when setting up his editor.
 *		editor.on( 'widgetDefinition', function( evt ) {
 *			if ( evt.data.name == 'image' )
 * 				evt.data.downcast = 'figure';
 *		} );
 *
 * @property downcasts
 */

/**
 * If set, it will be added as the {@link CKEDITOR.plugins.widget#event-edit} event listener.
 * This means that it will be executed when a widget is being edited.
 * See the {@link CKEDITOR.plugins.widget#method-edit} method.
 *
 * @property {Function} edit
 */

/**
 * If set, it will be added as the {@link CKEDITOR.plugins.widget#event-data} event listener.
 * This means that it will be executed every time the {@link CKEDITOR.plugins.widget#property-data widget data} changes.
 *
 * @property {Function} data
 */

/**
 * The method to be executed when the widget's command is executed in order to insert a new widget
 * (widget of this type is not focused). If not defined, then the default action will be
 * performed which means that:
 *
 * * An instance of the widget will be created in a detached {@link CKEDITOR.dom.documentFragment document fragment},
 * * The {@link CKEDITOR.plugins.widget#method-edit} method will be called to trigger widget editing,
 * * The widget element will be inserted into DOM.
 *
 * @property {Function} insert
 * @param {Object} options Options object added in **4.11.0**.
 * @param {CKEDITOR.editor} options.editor The editor where the widget is going to be inserted to.
 * @param {Object} [options.commandData] Command data passed to the invoking command, if any.
 */

/**
 * The name of a dialog window which will be opened on {@link CKEDITOR.plugins.widget#method-edit}.
 * If not defined, then the {@link CKEDITOR.plugins.widget#method-edit} method will not perform any action and
 * widget's command will insert a new widget without opening a dialog window first.
 *
 * @property {String} dialog
 */

/**
 * The template which will be used to create a new widget element (when the widget's command is executed).
 * This string is populated with {@link #defaults default values} by using the {@link CKEDITOR.template} format.
 * Therefore it has to be a valid {@link CKEDITOR.template} argument.
 *
 * @property {String} template
 */

/**
 * The data object which will be used to populate the data of a newly created widget.
 * See {@link CKEDITOR.plugins.widget#property-data}.
 *
 *		defaults: {
 *			showCaption: true,
 *			align: 'none'
 *		}
 *
 * @property defaults
 */

/**
 * An object containing definitions of widget components (part name => CSS selector).
 *
 *		parts: {
 *			image: 'img',
 *			caption: 'div.caption'
 *		}
 *
 * @property parts
 */

/**
 * An object containing definitions of nested editables (editable name => {@link CKEDITOR.plugins.widget.nestedEditable.definition}).
 * Note that editables *have to* be defined in the same order as they are in DOM / {@link CKEDITOR.plugins.widget.definition#template template}.
 * Otherwise errors will occur when nesting widgets inside each other.
 *
 *		editables: {
 *			header: 'h1',
 *			content: {
 *				selector: 'div.content',
 *				allowedContent: 'p strong em; a[!href]'
 *			}
 *		}
 *
 * @property editables
 */

/**
 * The function used to obtain an accessibility label for the widget. It might be used to make
 * the widget labels as precise as possible, since it has access to the widget instance.
 *
 * If not specified, the default implementation will use the {@link #pathName} or the main
 * {@link CKEDITOR.plugins.widget#element element} tag name.
 *
 * @property {Function} getLabel
 */

/**
 * The widget name displayed in the elements path.
 *
 * @property {String} pathName
 */

/**
 * If set to `true`, the widget's element will be covered with a transparent mask.
 * This will prevent its content from being clickable, which matters in case
 * of special elements like embedded iframes that generate a separate "context".
 *
 * If the value is a `string` type, then the partial mask covering only the given widget part
 * is created instead. The `string` mask should point to the name of one of the widget {@link CKEDITOR.plugins.widget#parts parts}.
 *
 * **Note**: Partial mask is available since the `4.13.0` version.
 *
 * @property {Boolean/String} mask
 */

/**
 * If set to `true`/`false`, it will force the widget to be either an inline or a block widget.
 * If not set, the widget type will be determined from the widget element.
 *
 * Widget type influences whether a block (`<div>`) or an inline (`<span>`) element is used
 * for the wrapper.
 *
 * @property {Boolean} inline
 */

/**
 * The label for the widget toolbar button.
 *
 *		editor.widgets.add( 'simplebox', {
 *			button: 'Create a simple box'
 *		} );
 *
 *		editor.widgets.add( 'simplebox', {
 *			button: editor.lang.simplebox.title
 *		} );
 *
 * @property {String} button
 */

/**
 * Customizes widget HTML copied to the clipboard
 * during copy, cut and drop operations.
 *
 * If not set, the current widget HTML will be used instead.
 *
 * Note: This method will overwrite the HTML for the whole widget, **including**
 * any nested widgets.
 *
 * @method getClipboardHtml
 * @since 4.13.0
 * @returns {String} Widget HTML.
 */

/**
 * Whether the widget should be draggable. Defaults to `true`.
 * If set to `false`, the drag handler will not be displayed when hovering the widget.
 *
 * @property {Boolean} draggable
 */

/**
 * Names of element(s) (separated by spaces) for which the {@link CKEDITOR.filter} should allow classes
 * defined in the widget styles. For example, if your widget is upcasted from a simple `<div>`
 * element, then in order to make it styleable you can set:
 *
 *		editor.widgets.add( 'customWidget', {
 *			upcast: function( element ) {
 *				return element.name == 'div';
 *			},
 *
 *			// ...
 *
 *			styleableElements: 'div'
 *		} );
 *
 * Then, when the following style is defined:
 *
 *		{
 *			name: 'Thick border', type: 'widget', widget: 'customWidget',
 *			attributes: { 'class': 'thickBorder' }
 *		}
 *
 * a rule allowing the `thickBorder` class for `div` elements will be registered in the {@link CKEDITOR.filter}.
 *
 * If you need to have more freedom when transforming widget style to allowed content rules,
 * you can use the {@link #styleToAllowedContentRules} callback.
 *
 * @since 4.4.0
 * @property {String} styleableElements
 */

/**
 * Function transforming custom widget's {@link CKEDITOR.style} instance into
 * {@link CKEDITOR.filter.allowedContentRules}. It may be used when a static
 * {@link #styleableElements} property is not enough to inform the {@link CKEDITOR.filter}
 * what HTML features should be enabled when allowing the given style.
 *
 * In most cases, when style's classes just have to be added to element name(s) used by
 * the widget element, it is recommended to use simpler {@link #styleableElements} property.
 *
 * In order to get parsed classes from the style definition you can use
 * {@link CKEDITOR.style.customHandlers.widget#getClassesArray}.
 *
 * For example, if you want to use the [object format of allowed content rules](#!/guide/dev_allowed_content_rules-section-object-format),
 * to specify `match` validator, your implementation could look like this:
 *
 *		editor.widgets.add( 'customWidget', {
 *			// ...
 *
 *			styleToAllowedContentRules: funciton( style ) {
 *				// Retrieve classes defined in the style.
 *				var classes = style.getClassesArray();
 *
 *				// Do something crazy - for example return allowed content rules in object format,
 *				// with custom match property and propertiesOnly flag.
 *				return {
 *					h1: {
 *						match: isWidgetElement,
 *						propertiesOnly: true,
 *						classes: classes
 *					}
 *				};
 *			}
 *		} );
 *
 * @since 4.4.0
 * @property {Function} styleToAllowedContentRules
 * @param {CKEDITOR.style.customHandlers.widget} style The style to be transformed.
 * @returns {CKEDITOR.filter.allowedContentRules}
 */

/**
 * This is an abstract class that describes the definition of a widget's nested editable.
 * It is a type of values in the {@link CKEDITOR.plugins.widget.definition#editables} object.
 *
 * In the simplest case the definition is a string which is a CSS selector used to
 * find an element that will become a nested editable inside the widget. Note that
 * the widget element can be a nested editable, too.
 *
 * In the more advanced case a definition is an object with a required `selector` property.
 *
 *		editables: {
 *			header: 'h1',
 *			content: {
 *				selector: 'div.content',
 *				allowedContent: 'p strong em; a[!href]'
 *			}
 *		}
 *
 * @class CKEDITOR.plugins.widget.nestedEditable.definition
 * @abstract
 */

/**
 * The CSS selector used to find an element which will become a nested editable.
 *
 * @property {String} selector
 */

/**
 * The {@glink guide/dev_advanced_content_filter Advanced Content Filter} rules
 * which will be used to limit the content allowed in this nested editable.
 * This option is similar to {@link CKEDITOR.config#allowedContent} and one can
 * use it to limit the editor features available in the nested editable.
 *
 * If no `allowedContent` is specified, the editable will use the editor default
 * {@link CKEDITOR.editor#filter}.
 *
 * @property {CKEDITOR.filter.allowedContentRules} allowedContent
 */

/**
 * The {@glink guide/dev_advanced_content_filter Advanced Content Filter} rules
 * which will be used to blacklist elements within this nested editable.
 * This option is similar to {@link CKEDITOR.config#disallowedContent}.
 *
 * Note that `disallowedContent` work on top of the definition's {@link #allowedContent}.
 *
 * @since 4.7.3
 * @property {CKEDITOR.filter.disallowedContentRules} disallowedContent
 */

/**
 * Nested editable name displayed in the elements path.
 *
 * @property {String} pathName
 */

/**
 * Defines the keyboard shortcut for inserting a line before selected widget. Default combination
 * is `Shift+Alt+Enter`. New element tag is based on {@link CKEDITOR.config#enterMode} option.
 *
 *		config.widget_keystrokeInsertLineBefore = 'CKEDITOR.SHIFT + 38'; // Shift + Arrow Up
 *
 * @since 4.17.0
 * @cfg {Number} [widget_keystrokeInsertLineBefore=CKEDITOR.SHIFT+CKEDITOR.ALT+13]
 * @member CKEDITOR.config
 */
CKEDITOR.config.widget_keystrokeInsertLineBefore = CKEDITOR.SHIFT + CKEDITOR.ALT + 13;

/**
 * Defines the keyboard shortcut for inserting a line after selected widget. Default combination
 * is `Shift+Enter`. New element tag is based on {@link CKEDITOR.config#enterMode} option.
 *
 *		config.widget_keystrokeInsertLineAfter = 'CKEDITOR.SHIFT + 40'; // Shift + Arrow Down
 *
 * @since 4.17.0
 * @cfg {Number} [widget_keystrokeInsertLineAfter=CKEDITOR.SHIFT+13]
 * @member CKEDITOR.config
 */
CKEDITOR.config.widget_keystrokeInsertLineAfter = CKEDITOR.SHIFT + 13;
