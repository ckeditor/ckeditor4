/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.focusManager} class, which is used
 *		to handle the focus in editor instances.
 */

( function() {
	/**
	 * Manages the focus activity in an editor instance. This class is to be
	 * used mainly by UI element coders when adding interface elements that need
	 * to set the focus state of the editor.
	 *
	 *		var focusManager = new CKEDITOR.focusManager( editor );
	 *		focusManager.focus();
	 *
	 * @class
	 * @constructor Creates a focusManager class instance.
	 * @param {CKEDITOR.editor} editor The editor instance.
	 */
	CKEDITOR.focusManager = function( editor ) {
		if ( editor.focusManager )
			return editor.focusManager;

		/**
		 * Indicates that the editor instance has focus.
		 *
		 *		alert( CKEDITOR.instances.editor1.focusManager.hasFocus ); // e.g. true
		 */
		this.hasFocus = false;

		/**
		 * Indicates the currently focused DOM element that makes the editor activated.
		 *
		 * @property {CKEDITOR.dom.domObject}
		 */
		this.currentActive = null;

		/**
		 * Object used to store private stuff.
		 *
		 * @private
		 */
		this._ = {
			editor: editor
		};

		return this;
	};

	var SLOT_NAME = 'focusmanager',
		SLOT_NAME_LISTENERS = 'focusmanager_handlers';

	/**
	 * Object used to store private stuff.
	 *
	 * @private
	 * @class
	 * @singleton
	 */
	CKEDITOR.focusManager._ = {
		/**
		 * The delay (in milliseconds) to deactivate the editor when a UI DOM element has lost focus.
		 *
		 * @private
		 * @property {Number} [blurDelay=200]
		 * @member CKEDITOR.focusManager._
		 */
		blurDelay: 200
	};

	CKEDITOR.focusManager.prototype = {

		/**
		 * Indicates that this editor instance is activated (due to a DOM focus change).
		 * The `activated` state is a symbolic indicator of an active user
		 * interaction session.
		 *
		 * **Note:** This method will not introduce UI focus
		 * impact on DOM, it is here to record the editor UI focus state internally.
		 * If you want to make the cursor blink inside the editable, use
		 * {@link CKEDITOR.editor#method-focus} instead.
		 *
		 *		var editor = CKEDITOR.instances.editor1;
		 *		editor.focusManage.focus( editor.editable() );
		 *
		 * @param {CKEDITOR.dom.element} [currentActive] The new value of the {@link #currentActive} property.
		 * @member CKEDITOR.focusManager
		 */
		focus: function( currentActive ) {
			if ( this._.timer )
				clearTimeout( this._.timer );

			if ( currentActive )
				this.currentActive = currentActive;

			if ( !( this.hasFocus || this._.locked ) ) {
				// If another editor has the current focus, we first "blur" it. In
				// this way the events happen in a more logical sequence, like:
				//		"focus 1" > "blur 1" > "focus 2"
				// ... instead of:
				//		"focus 1" > "focus 2" > "blur 1"
				var current = CKEDITOR.currentInstance;
				current && current.focusManager.blur( 1 );

				this.hasFocus = true;

				var ct = this._.editor.container;
				ct && ct.addClass( 'cke_focus' );
				this._.editor.fire( 'focus' );
			}
		},

		/**
		 * Prevents from changing the focus manager state until the next {@link #unlock} is called.
		 *
		 * @member CKEDITOR.focusManager
		 */
		lock: function() {
			this._.locked = 1;
		},

		/**
		 * Restores the automatic focus management if {@link #lock} is called.
		 *
		 * @member CKEDITOR.focusManager
		 */
		unlock: function() {
			delete this._.locked;
		},

		/**
		 * Used to indicate that the editor instance has been deactivated by the specified
		 * element which has just lost focus.
		 *
		 * **Note:** This function acts asynchronously with a delay of 100ms to
		 * avoid temporary deactivation. Use the `noDelay` parameter instead
		 * to deactivate immediately.
		 *
		 *		var editor = CKEDITOR.instances.editor1;
		 *		editor.focusManager.blur();
		 *
		 * @param {Boolean} [noDelay=false] Immediately deactivate the editor instance synchronously.
		 * @member CKEDITOR.focusManager
		 */
		blur: function( noDelay ) {
			if ( this._.locked )
				return;

			function doBlur() {
				var editor = this._.editor;

				if ( this.hasFocus ) {
					this.hasFocus = false;

					// Blink browsers leave selection in `[contenteditable=true]`
					// when it's blurred and it's neccessary to remove it manually for inline editor. (#13446)
					if ( CKEDITOR.env.chrome && editor.editable().isInline() ) {
						editor.window.$.getSelection().removeAllRanges();
					}

					var ct = this._.editor.container;
					ct && ct.removeClass( 'cke_focus' );
					this._.editor.fire( 'blur' );
				}
			}

			if ( this._.timer )
				clearTimeout( this._.timer );

			var delay = CKEDITOR.focusManager._.blurDelay;
			if ( noDelay || !delay )
				doBlur.call( this );
			else {
				this._.timer = CKEDITOR.tools.setTimeout( function() {
					delete this._.timer;
					doBlur.call( this );
				}, delay, this );
			}
		},

		/**
		 * Registers a UI DOM element to the focus manager, which will make the focus manager "hasFocus"
		 * once the input focus is relieved on the element.
		 * This method is designed to be used by plugins to expand the jurisdiction of the editor focus.
		 *
		 * @param {CKEDITOR.dom.element} element The container (topmost) element of one UI part.
		 * @param {Boolean} isCapture If specified, {@link CKEDITOR.event#useCapture} will be used when listening to the focus event.
		 * @member CKEDITOR.focusManager
		 */
		add: function( element, isCapture ) {
			var fm = element.getCustomData( SLOT_NAME );
			if ( !fm || fm != this ) {
				// If this element is already taken by another instance, dismiss it first.
				fm && fm.remove( element );

				var focusEvent = 'focus',
					blurEvent = 'blur';

				// Bypass the element's internal DOM focus change.
				if ( isCapture ) {

					// Use "focusin/focusout" events instead of capture phase in IEs,
					// which fires synchronously.
					if ( CKEDITOR.env.ie ) {
						focusEvent = 'focusin';
						blurEvent = 'focusout';
					} else {
						CKEDITOR.event.useCapture = 1;
					}
				}

				var listeners = {
					blur: function() {
						if ( element.equals( this.currentActive ) )
							this.blur();
					},
					focus: function() {
						this.focus( element );
					}
				};

				element.on( focusEvent, listeners.focus, this );
				element.on( blurEvent, listeners.blur, this );

				if ( isCapture )
					CKEDITOR.event.useCapture = 0;

				element.setCustomData( SLOT_NAME, this );
				element.setCustomData( SLOT_NAME_LISTENERS, listeners );
			}
		},

		/**
		 * Dismisses an element from the focus manager delegations added by {@link #add}.
		 *
		 * @param {CKEDITOR.dom.element} element The element to be removed from the focus manager.
		 * @member CKEDITOR.focusManager
		 */
		remove: function( element ) {
			element.removeCustomData( SLOT_NAME );
			var listeners = element.removeCustomData( SLOT_NAME_LISTENERS );
			element.removeListener( 'blur', listeners.blur );
			element.removeListener( 'focus', listeners.focus );
		}

	};

} )();

/**
 * Fired when the editor instance receives the input focus.
 *
 *		editor.on( 'focus', function( e ) {
 *			alert( 'The editor named ' + e.editor.name + ' is now focused' );
 *		} );
 *
 * @event focus
 * @member CKEDITOR.editor
 * @param {CKEDITOR.editor} editor The editor instance.
 */

/**
 * Fired when the editor instance loses the input focus.
 *
 * **Note:** This event will **NOT** be triggered when focus is moved internally, e.g. from
 * an editable to another part of the editor UI like a dialog window.
 * If you are interested only in the focus state of the editable, listen to the `focus`
 * and `blur` events of the {@link CKEDITOR.editable} instead.
 *
 *		editor.on( 'blur', function( e ) {
 *			alert( 'The editor named ' + e.editor.name + ' lost the focus' );
 *		} );
 *
 * @event blur
 * @member CKEDITOR.editor
 * @param {CKEDITOR.editor} editor The editor instance.
 */
