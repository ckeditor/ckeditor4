/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview The Balloon Panel plugin that provides an ability to create a floating, balloon-shaped
 * container capable of presenting content at a precise position in the document.
 */

( function() {
	'use strict';

	// This flag prevents appending stylesheet more than once.
	var stylesLoaded = false;

	CKEDITOR.plugins.add( 'balloonpanel', {
		init: function() {
			if ( !stylesLoaded ) {
				CKEDITOR.document.appendStyleSheet( this.path + 'skins/' + CKEDITOR.skin.name + '/balloonpanel.css' );
				stylesLoaded = true;
			}
		}
	} );

	/**
	 * A class that represents a floating, balloon-shaped panel capable of presenting defined
	 * content at a precise position in the document. It can be used to represent
	 * contextual data or forms i.e. related to an element in the editor's editable.
	 *
	 *		// Create an instance of the balloon panel.
	 *		var panel = new CKEDITOR.ui.balloonPanel( editor, {
	 *			title: 'My Panel',
	 *			content: '<p>This is my panel</p>'
	 *		} );
	 *
	 *		// Attach the panel to an element in DOM and show it immediately.
	 *		panel.attach( domElement );
	 *
	 * @class
	 * @since 4.6
	 * @param {CKEDITOR.editor} editor The editor instance for which the panel is created.
	 * @param {Object} definition An object containing the panel definition.
	 */
	CKEDITOR.ui.balloonPanel = function( editor, definition ) {
		/**
		 * The editor for this balloon panel.
		 */
		this.editor = editor;

		CKEDITOR.tools.extend( this, {
			/**
			 * The default width of the balloon panel.
			 */
			width: 360,

			/**
			 * The default height of the balloon panel.
			 */
			height: 'auto',

			/**
			 * The default width of the triangle that points to the element in the editable.
			 */
			triangleWidth: 20,

			/**
			 * The default height of the triangle that points to the element in the editable.
			 */
			triangleHeight: 20,

			/**
			 * The default distance between the triangle and the vertical edge of the panel.
			 */
			triangleMinDistance: 40
		}, definition, true );

		/**
		 * Templates for UI elements in this balloon panel.
		 * See {@link #templateDefinitions}, {@link #parts}.
		 */
		this.templates = {};

		for ( var t in this.templateDefinitions ) {
			this.templates[ t ] = new CKEDITOR.template( this.templateDefinitions[ t ] );
		}

		/**
		 * @property parts The UI elements of the balloon panel.
		 * @property {CKEDITOR.dom.element} parts.title The title bar of the panel.
		 * @property {CKEDITOR.dom.element} parts.close The Close button.
		 * @property {CKEDITOR.dom.element} parts.content The element that stores the content of the panel.
		 * @property {CKEDITOR.dom.element} parts.panel The undermost element that stores all other elements. The panel is positioned absolutely.
		 * @property {CKEDITOR.dom.element} parts.triangle The panel's triangle.
		 * @property {CKEDITOR.dom.element} parts.triangleOuter The outer element of the triangle.
		 * @property {CKEDITOR.dom.element} parts.triangleInner The inner element of the triangle.
		 */
		this.parts = {};

		/**
		 * Focusable elements in this balloon panel.
		 * See {@link #registerFocusable}, {@link #deregisterFocusable} and {@link CKEDITOR.focusManager}.
		 */
		this.focusables = {};

		/**
		 * Event listeners associated with this balloon panel, activated on panel show.
		 * See {@link #addShowListener}, {@link #activateShowListeners}, {@link #deactivateShowListeners}.
		 */
		this.showListeners = {};

		/**
		 * Event listeners associated with this balloon panel, active as long as the panel is shown.
		 * See {@link #addShowListener}, {@link #activateShowListeners}, {@link #deactivateShowListeners}.
		 */
		this.activeShowListeners = {};

		/**
		 * @property rect Contains panel properties as {@link #move}, {@link #resize},
		 * {@link #method-show} and {@link #method-hide} are called. It stores values and avoids unnecessary
		 * and expensive checks in the future.
		 *
		 * @property {Number} rect.width
		 * @property {Number} rect.height
		 * @property {Number} rect.top
		 * @property {Number} rect.left
		 * @property {Boolean} rect.visible
		 */
		this.rect = {
			visible: false
		};

		// Build the UI of the balloon panel.
		this.build();

		// Handle panel destruction.
		editor.on( 'destroy', function() {
			this.destroy();
		}, this );

		/**
		 * Event fired when the balloon panel is shown.
		 *
		 * @event show
		 */

		/**
		 * Event fired when the balloon panel is hidden.
		 *
		 * @event hide
		 */

		/**
		 * Event fired when the balloon panel is attached to an element.
		 *
		 * @event attach
		 */
	};

	CKEDITOR.ui.balloonPanel.prototype = {
		/**
		 * @property templateDefinitions Balloon panel templates. Automatically converted into a {@link CKEDITOR.template} in the panel constructor.
		 * @property {String} templateDefinitions.panel The template for the panel outermost container.
		 * @property {String} templateDefinitions.content The template for the panel content container.
		 * @property {String} templateDefinitions.title The template for the panel title bar.
		 * @property {String} templateDefinitions.close The template for the panel Close button.
		 * @property {String} templateDefinitions.triangleOuter The template for the panel outer triangle.
		 * @property {String} templateDefinitions.triangleInner The template for the panel inner triangle.
		 */
		templateDefinitions: {
			panel:
				'<div' +
					' class="cke {id} cke_reset_all cke_chrome cke_balloon cke_editor_{name} cke_{langDir} ' + CKEDITOR.env.cssClass + '"' +
					' dir="{langDir}"' +
					' title="' + ( CKEDITOR.env.gecko ? ' ' : '' ) + '"' +
					' lang="{langCode}"' +
					' role="dialog"' +
					' style="{style}"' +
					' tabindex="-1"' +	// Needed to make the panel focusable.
					' aria-labelledby="cke_{name}_arialbl"' +
				'></div>',

			content: '<div class="cke_balloon_content">{content}</div>',

			title: '<div class="cke_balloon_title" role="presentation">{title}</div>',

			close:
				'<a class="cke_balloon_close_button" href="javascript:void(0)" title="Close" role="button" tabindex="-1">' +
					'<span class="cke_label">X</span>' +
				'</a>',

			triangleOuter: '<span class="cke_balloon_triangle cke_balloon_triangle_outer"></span>',

			triangleInner: '<span class="cke_balloon_triangle cke_balloon_triangle_inner">&#8203;</span>'
		},

		/**
		 * Builds the UI of the balloon panel.
		 */
		build: function() {
			var editor = this.editor;

			this.parts = {
				title: CKEDITOR.dom.element.createFromHtml( this.templates.title.output( {
					title: this.title
				} ) ),

				close: CKEDITOR.dom.element.createFromHtml( this.templates.close.output() ),

				panel: CKEDITOR.dom.element.createFromHtml( this.templates.panel.output( {
					id: editor.id,
					langDir: editor.lang.dir,
					langCode: editor.langCode,
					name: editor.name,
					style: 'display:none;',
					voiceLabel: editor.lang.editorPanel + ', ' + editor.name
				} ) ),

				content: CKEDITOR.dom.element.createFromHtml( this.templates.content.output( {
					content: this.content || ''
				} ) ),

				triangleOuter: CKEDITOR.dom.element.createFromHtml( this.templates.triangleOuter.output() ),

				triangleInner: CKEDITOR.dom.element.createFromHtml( this.templates.triangleInner.output() )
			};

			// Append UI elements to create a panel.
			this.parts.panel.append( this.parts.title, 1 );
			this.parts.panel.append( this.parts.close, 1 );
			this.parts.panel.append( this.parts.triangleOuter );
			this.parts.panel.append( this.parts.content );
			this.parts.triangleOuter.append( this.parts.triangleInner );

			// Register panel children to focusManager (prevent from blurring the editor).
			this.registerFocusable( this.parts.panel );
			this.registerFocusable( this.parts.close );

			// Panel title and close button are not to be selected.
			this.parts.title.unselectable();
			this.parts.close.unselectable();

			// Append the panel to the global document.
			CKEDITOR.document.getBody().append( this.parts.panel );

			// Set default dimensions of the panel.
			this.resize( this.width, this.height );

			// Activates listeners on panel show.
			// All listeners will be deactivated on panel hide.
			this.on( 'show', this.activateShowListeners, this );

			// Deactivate all listeners on panel hide.
			this.on( 'hide', this.deactivateShowListeners, this );

			this.parts.close.on( 'click', function( evt ) {
				this.hide();
				evt.data.preventDefault();
			}, this );
		},

		/**
		 * Shows the balloon panel.
		 */
		show: function() {
			if ( this.rect.visible ) {
				return;
			}

			this.rect.visible = true;
			this.parts.panel.show();

			this.fire( 'show' );
		},

		/**
		 * Hides the balloon panel and moves the focus back to the editable.
		 */
		hide: function() {
			if ( !this.rect.visible ) {
				return;
			}

			this.rect.visible = false;
			this.parts.panel.hide();
			this.blur();

			this.fire( 'hide' );
		},

		/**
		 * Moves the focus back to the editor's editable.
		 *
		 * @method blur
		 * @member CKEDITOR.ui.balloonPanel
		 */
		blur: function() {
			this.editor.focus();
		},

		/**
		 * Moves the **upper-left** balloon panel corner to the specified absolute position.
		 *
		 * @param {Number} top
		 * @param {Number} left
		 */
		move: function( top, left ) {
			this.rect.left = left;
			this.rect.top = top;

			this.parts.panel.setStyles( {
				left: CKEDITOR.tools.cssLength( left ),
				top: CKEDITOR.tools.cssLength( top )
			} );
		},

		/**
		 * Places the balloon panel next to a specified element so the tip of the balloon's triangle
		 * touches that element. Once the panel is attached it gains focus.
		 *
		 * @method attach
		 * @param {CKEDITOR.dom.element} element The element to which the panel is attached.
		 * @param {Object/CKEDITOR.dom.element/Boolean} [options] **Since 4.8.0** this parameter works as an `options` object.
		 *
		 * If a `{@link CKEDITOR.dom.element}/Boolean` instance is given, this parameter acts as an `options.focusElement`.
		 * @param {CKEDITOR.dom.element/Boolean} [options.focusElement] The element to be focused after the panel
		 * is attached. By default the `panel` property of {@link #parts} will be focused. You might specify the element
		 * to be focused by passing any {@link CKEDITOR.dom.element} instance.
		 * You can also prevent changing focus at all by setting it to `false`.
		 * @param {Boolean} [options.show=true] Defines if the balloon panel should be shown after being attached.
		 */
		attach: ( function() {
			var winGlobal, frame, editable, isInline;

			function rectIntersectArea( rect1, rect2 ) {
				var hOverlap = Math.max( 0, Math.min( rect1.right, rect2.right ) - Math.max( rect1.left, rect2.left ) ),
					vOverlap = Math.max( 0, Math.min( rect1.bottom, rect2.bottom ) - Math.max( rect1.top, rect2.top ) );

				return hOverlap * vOverlap;
			}

			function newPanelRect( top, left, panelWidth, panelHeight ) {
				var newRect = {
					top: top,
					left: left
				};

				newRect.right = newRect.left + panelWidth;
				newRect.bottom = newRect.top + panelHeight;

				return newRect;
			}

			var triangleRelativePosition = {
				right: 'left',
				top: 'bottom',
				topLeft: 'bottomLeft',
				topRight: 'bottomRight',
				bottom: 'top',
				bottomLeft: 'topLeft',
				bottomRight: 'topRight',
				left: 'right'
			};

			return function( element, options ) {
				if ( options instanceof CKEDITOR.dom.element || !options ) {
					options = { focusElement: options };
				}

				options = CKEDITOR.tools.extend( options, {
					show: true
				} );

				if ( options.show === true ) {
					this.show();
				}

				this.fire( 'attach' );

				winGlobal = CKEDITOR.document.getWindow();
				frame = this.editor.window.getFrame();
				editable = this.editor.editable();
				isInline = editable.isInline();

				var panelWidth = this.getWidth(),
					panelHeight = this.getHeight(),

					elementRect = this._getAbsoluteRect( element ),
					editorRect = this._getAbsoluteRect( isInline ? editable : frame ),

					viewPaneSize = winGlobal.getViewPaneSize(),
					winGlobalScroll = winGlobal.getScrollPosition();

				// allowedRect is the rect into which the panel should fit to remain
				// both within the visible area of the editor and the viewport, i.e.
				// the rect area covered by "#":
				//
				// 	[Viewport]
				// 	+-------------------------------------+
				// 	|                        [Editor]     |
				// 	|                        +--------------------+
				// 	|                        |############|       |
				// 	|                        |############|       |
				// 	|                        |############|       |
				// 	|                        +--------------------+
				// 	|                                     |
				// 	+-------------------------------------+
				var allowedRect = {
					top: Math.max( editorRect.top, winGlobalScroll.y ),
					left: Math.max( editorRect.left, winGlobalScroll.x ),
					right: Math.min( editorRect.right, viewPaneSize.width + winGlobalScroll.x ),
					bottom: Math.min( editorRect.bottom, viewPaneSize.height + winGlobalScroll.y )
				};

				// Position balloon on entire view port only when it's real inline mode (#1048).
				if ( isInline && this.editor.elementMode === CKEDITOR.ELEMENT_MODE_INLINE ) {
					// In inline we want to limit position within the window.
					allowedRect = this._getViewPaneRect( winGlobal );

					// We need also consider triangle.
					allowedRect.right += this.triangleWidth;
					allowedRect.bottom += this.triangleHeight;
				}

				// This method will modify elementRect if the element is outside of allowedRect / editorRect.
				// If it's outside then in
				this._adjustElementRect( elementRect, isInline ? allowedRect : editorRect );

				// The area of the panel.
				var panelArea = panelWidth * panelHeight,
					alignments = this._getAlignments( elementRect, panelWidth, panelHeight ),
					minDifferenceAlignment, alignmentRect, areaDifference;

				// Iterate over all possible alignments to find the optimal one.
				for ( var a in alignments ) {
					// Create a rect which would represent the panel in such alignment.
					alignmentRect = newPanelRect( alignments[ a ].top, alignments[ a ].left, panelWidth, panelHeight );

					// Calculate the difference between the area of the panel and intersection of allowed rect and alignment rect.
					// It is the area of the panel, which would be OUT of allowed rect if such alignment was used. Less is better.
					areaDifference = alignments[ a ].areaDifference = panelArea - rectIntersectArea( alignmentRect, allowedRect );

					// If the difference is 0, it means that the panel is fully within allowed rect. That's great!
					if ( areaDifference === 0 ) {
						minDifferenceAlignment = a;
						break;
					}

					// If there's no alignment of a minimal area difference, use the first available.
					if ( !minDifferenceAlignment ) {
						minDifferenceAlignment = a;
					}

					// Determine the alignment of a minimal area difference. It will be used as a fallback
					// if no aligment provides a perfect fit into allowed rect.
					if ( areaDifference < alignments[ minDifferenceAlignment ].areaDifference ) {
						minDifferenceAlignment = a;
					}
				}

				// For non-static parent elements we need to remove its margin offset from balloon panel (#1048).
				var parent = this.parts.panel.getAscendant( function( el ) {
						return el instanceof CKEDITOR.dom.document ? false : el.getComputedStyle( 'position' ) !== 'static';
					} ),
					parentMargin = {
						left: parent ? parseInt( parent.getComputedStyle( 'margin-left' ), 10 ) : 0,
						top: parent ? parseInt( parent.getComputedStyle( 'margin-top' ), 10 ) : 0
					};

				this.move( alignments[ minDifferenceAlignment ].top - parentMargin.top , alignments[ minDifferenceAlignment ].left - parentMargin.left );

				minDifferenceAlignment = minDifferenceAlignment.split( ' ' );
				this.setTriangle( triangleRelativePosition[ minDifferenceAlignment[ 0 ] ], minDifferenceAlignment[ 1 ] );

				// Set focus to proper element.
				if ( options.focusElement !== false ) {
					( options.focusElement || this.parts.panel ).focus();
				}
			};
		} )(),

		/**
		 * Resizes the balloon panel container to given dimensions. Use `'auto'` to
		 * make the dimensions of the panel flexible.
		 *
		 * @param {Number} width
		 * @param {Number} height
		 */
		resize: function( width, height ) {
			this.rect.width = width;
			this.rect.height = height;

			this.parts.panel.setStyles( {
				width: CKEDITOR.tools.cssLength( width ),
				height: CKEDITOR.tools.cssLength( height )
			} );
		},

		/**
		 * Returns the balloon panel width.
		 *
		 * @returns {Number}
		 */
		getWidth: function() {
			return this.rect.width === 'auto' ? this.parts.panel.getClientRect().width : this.rect.width;
		},

		/**
		 * Returns the balloon panel height.
		 *
		 * @returns {Number}
		 */
		getHeight: function() {
			return this.rect.height === 'auto' ? this.parts.panel.getClientRect().height : this.rect.height;
		},

		/**
		 * Changes the position of the balloon's triangle that points to the element in the editable.
		 *
		 * @param {String} side One of 'left', 'right', 'top' or 'bottom'.
		 */
		setTriangle: function( side, align ) {
			var outer = this.parts.triangleOuter,
				inner = this.parts.triangleInner;

			if ( this.triangleSide ) {
				outer.removeClass( 'cke_balloon_triangle_' + this.triangleSide );
				outer.removeClass( 'cke_balloon_triangle_align_' + this.triangleAlign );
				inner.removeClass( 'cke_balloon_triangle_' + this.triangleSide );
			}

			this.triangleSide = side;
			this.triangleAlign = align;

			outer.addClass( 'cke_balloon_triangle_' + side );
			outer.addClass( 'cke_balloon_triangle_align_' + align );
			inner.addClass( 'cke_balloon_triangle_' + side );
		},

		/**
		 * Registers a new focusable element in the editor's focus manager so the instance
		 * does not blur once the child of the balloon panel gains focus.
		 * See {@link #focusables}.
		 *
		 * @param {CKEDITOR.dom.element} element An element to be registered.
		 */
		registerFocusable: function( element ) {
			this.editor.focusManager.add( element );

			this.focusables[ element.getUniqueId() ] = element;
		},

		/**
		 * Unregisters an element from editor's focus manager.
		 * See {@link #focusables}.
		 *
		 * @param {CKEDITOR.dom.element} element An element to be registered.
		 */
		deregisterFocusable: function( element ) {
			this.editor.focusManager.remove( element );

			delete this.focusables[ element.getUniqueId() ];
		},

		/**
		 * Adds an event listener associated with this balloon panel. This listener
		 * will be activated on panel `show` and deactivated on panel `hide`.
		 * See {@link #showListeners}, {@link #activeShowListeners}, {@link #activateShowListeners},
		 * {@link #deactivateShowListeners}.
		 *
		 * @param {Function} listener A function that, if called, attaches the listener
		 * and returns the listener object.
		 * @returns {Object} An object containing the `removeListener` method that removes
		 * the listener from the collection.
		 */
		addShowListener: function( listener ) {
			var id = CKEDITOR.tools.getNextNumber();

			// Adds the listener to the register of on-show-activated listeners.
			this.showListeners[ id ] = listener;

			// Activate listener immediately if panel is already visible.
			if ( this.rect.visible ) {
				this.activateShowListener( id );
			}

			var that = this;

			return {
				removeListener: function() {
					that.removeShowListener( id );
				}
			};
		},

		/**
		 * Removes an event listener associated with this balloon panel visible state.
		 * See {@link #addShowListener}.
		 *
		 * @param {Number} id An ID of the listener.
		 */
		removeShowListener: function( id ) {
			this.deactivateShowListener( id );
			delete this.showListeners[ id ];
		},

		/**
		 * Activates an event listener associated with this balloon panel.
		 * See {@link #showListeners}, {@link #activeShowListeners}, {@link #deactivateShowListener},
		 * {@link #addShowListener}, {@link #removeShowListener}.
		 */
		activateShowListener: function( id ) {
			this.activeShowListeners[ id ] = this.showListeners[ id ].call( this );
		},

		/**
		 * Deactivates an event listener associated with this balloon panel.
		 * See {@link #activateShowListener}.
		 */
		deactivateShowListener: function( id ) {
			if ( this.activeShowListeners[ id ] ) {
				this.activeShowListeners[ id ].removeListener();
			}

			delete this.activeShowListeners[ id ];
		},

		/**
		 * Activates all event listeners associated with this balloon panel.
		 * See {@link #showListeners}, {@link #activeShowListeners}, {@link #deactivateShowListeners},
		 * {@link #addShowListener}, {@link #removeShowListener}.
		 */
		activateShowListeners: function() {
			for ( var id in this.showListeners ) {
				this.activateShowListener( id );
			}
		},

		/**
		 * Removes all event listeners associated with this balloon panel.
		 * See {@link #activateShowListeners}.
		 */
		deactivateShowListeners: function() {
			for ( var id in this.activeShowListeners ) {
				this.deactivateShowListener( id );
			}
		},

		/**
		 * Destroys the balloon panel by removing it from DOM and purging
		 * all associated event listeners.
		 */
		destroy: function() {
			this.deactivateShowListeners();
			this.parts.panel.remove();
		},

		/**
		 * Sets the balloon panel title.
		 *
		 * @param {String} title A new panel title.
		 */
		setTitle: function( title ) {
			this.parts.title.setHtml( title );
		},

		/**
		 * Returns a dictionary containing different alignment positions.
		 *
		 * Keys tell where the balloon is positioned relative to the element, e.g. this would be the result for "top center":
		 *
		 *		[Editor]
		 *		+-------------------------------------+
		 *		|         [Panel]                     |
		 *		|         +-----------------+         |
		 *		|         |                 |         |
		 *		|  [El.]  +--------v--------+         |
		 *		|  +-------------------------------+  |
		 *		|  |                               |  |
		 *		|  |                               |  |
		 *		+--+-------------------------------+--+
		 *
		 * Sample result:
		 *
		 *		{
		 *			"right vcenter": { top: 529.5, left: 175 },
		 *			"left vcenter": { top: 529.5, left: 10},
		 *			"top hcenter": { top: 402, left: 92.5},
		 *			"top left": { top: 402, left: 102.5},
		 *			"top right": { top: 402, left: 82.5},
		 *			"bottom hcenter": { top: 643, left: 92.5},
		 *			"bottom left": { top: 643, left: 102.5},
		 *			"bottom right": { top: 643, left: 82.5}
		 *		}
		 *
		 * @private
		 * @param elementRect
		 * @param {Number} panelWidth
		 * @param {Number} panelHeight
		 * @returns {Object}
		 */
		_getAlignments: function( elementRect, panelWidth, panelHeight ) {
			return {
				'right vcenter': {
					top: elementRect.top + elementRect.height / 2 - panelHeight / 2,
					left: elementRect.right + this.triangleWidth
				},
				'left vcenter': {
					top: elementRect.top + elementRect.height / 2 - panelHeight / 2,
					left: elementRect.left - panelWidth - this.triangleWidth
				},
				'top hcenter': {
					top: elementRect.top - panelHeight - this.triangleHeight,
					left: elementRect.left + elementRect.width / 2 - panelWidth / 2
				},
				'top left': {
					top: elementRect.top - panelHeight - this.triangleHeight,
					left: elementRect.left + elementRect.width / 2 - this.triangleMinDistance
				},
				'top right': {
					top: elementRect.top - panelHeight - this.triangleHeight,
					left: elementRect.right - elementRect.width / 2 - panelWidth + this.triangleMinDistance
				},
				'bottom hcenter': {
					top: elementRect.bottom + this.triangleHeight,
					left: elementRect.left + elementRect.width / 2 - panelWidth / 2
				},
				'bottom left': {
					top: elementRect.bottom + this.triangleHeight,
					left: elementRect.left + elementRect.width / 2 - this.triangleMinDistance
				},
				'bottom right': {
					top: elementRect.bottom + this.triangleHeight,
					left: elementRect.right - elementRect.width / 2 - panelWidth + this.triangleMinDistance
				}
			};
		},

		/**
		 * This method will modify `elementRect` if the element is outside of `editorRect`. If it is outside, it is
		 * going to change it into a rectangle that is within `editorRect`.
		 *
		 * For example here `elementRect` is going to be changed into a very narrow rectangle (with unmodified height)
		 * representation within `editorRect`.
		 *
		 *		+------------------------------------------+
		 *		|                                          |
		 *		|                                         #|          +----------+
		 *		|                                         #|          |          |
		 *		|                                         #|          |          |
		 *		|               editorRect                #|          |elmentRect|
		 *		|                                         #|          |          |
		 *		|                                         #|          |          |
		 *		|                                         #|          +----------+
		 *		|                                          |
		 *		+------------------------------------------+
		 *
		 * @private
		 * @param elementRect Rectangle object that should be contained within `editorRect`. **This object might be modified.**
		 * @param editorRect Reference container that should contain `elementRect`.
		 */
		_adjustElementRect: function( elementRect, editorRect ) {
			elementRect.left = numberInRange( editorRect.left, editorRect.right - 1, elementRect.left );
			elementRect.right = numberInRange( editorRect.left, editorRect.right, elementRect.right );
			elementRect.top = numberInRange( editorRect.top, editorRect.bottom - 1, elementRect.top );
			elementRect.bottom = numberInRange( editorRect.top, editorRect.bottom, elementRect.bottom );
		},

		/**
		 * @param {CKEDITOR.dom.window} window
		 * @returns {Object} Returns viewport position, taking scroll offset into account.
		 * @returns {Number} return.top
		 * @returns {Number} return.bottom
		 * @returns {Number} return.left
		 * @returns {Number} return.right
		 */
		_getViewPaneRect: function( window ) {
			var pos = window.getScrollPosition(),
				viewSize = window.getViewPaneSize();

			return {
				top: pos.y,
				bottom: pos.y + viewSize.height,
				left: pos.x,
				right: pos.x + viewSize.width
			};
		},

		/**
		 * Returns the position of the element on the screen.
		 *
		 * @since 4.9.0
		 * @private
		 * @param {CKEDITOR.dom.element} element The element whose position is calculated.
		 * @returns {Object} The element position (scroll position included).
		 * @returns {Number} return.top Top offset.
		 * @returns {Number} return.bottom Bottom offset.
		 * @returns {Number} return.left Left offset.
		 * @returns {Number} return.right Right offset.
		 */
		_getAbsoluteRect: function( element ) {
			var elementRect = element.getClientRect(),
				winGlobalScroll = CKEDITOR.document.getWindow().getScrollPosition(),
				frame = this.editor.window.getFrame(),
				frameRect;

			if ( this.editor.editable().isInline() || element.equals( frame ) ) {
				elementRect.top = elementRect.top + winGlobalScroll.y;
				elementRect.left = elementRect.left + winGlobalScroll.x;
				elementRect.right = elementRect.left + elementRect.width;
				elementRect.bottom = elementRect.top + elementRect.height;
			} else {
				frameRect = frame.getClientRect();

				elementRect.top = frameRect.top + elementRect.top + winGlobalScroll.y;
				elementRect.left = frameRect.left + elementRect.left + winGlobalScroll.x;
				elementRect.right = elementRect.left + elementRect.width;
				elementRect.bottom = elementRect.top + elementRect.height;
			}

			return elementRect;
		}
	};

	function numberInRange( min, max, num ) {
		return Math.max( min, Math.min( max, num ) );
	}

	CKEDITOR.event.implementOn( CKEDITOR.ui.balloonPanel.prototype );

	/**
	 * The definition of a balloon panel.
	 *
	 * This virtual class illustrates the properties that developers can use to define and create
	 * balloon panels.
	 *
	 *		CKEDITOR.ui.balloonPanel( editor, {
	 *			title: 'My Panel',
	 *			onShow: function() {
	 *				...
	 *			}
	 *		} );
	 *
	 * @class CKEDITOR.ui.balloonPanel.definition
	 */

	/**
	 * The title of the balloon panel.
	 *
	 * @member CKEDITOR.ui.balloonPanel.definition
	 * @property {String} title
	 */

	/**
	 * The static content of the balloon panel.
	 *
	 * @member CKEDITOR.ui.balloonPanel.definition
	 * @property {String} content
	 */
} )();
