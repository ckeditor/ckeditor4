/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.focusManager} class, which is used
 *		to handle the focus on editor instances..
 */

(function() {
	/**
	 * Creates a focusManager class instance.
	 * @class Manages the focus activity in an editor instance. This class is to be
	 * used mainly by UI elements coders when adding interface elements that need
	 * to set the focus state of the editor.
	 * @param {CKEDITOR.editor} editor The editor instance.
	 * @example
	 * var focusManager = <b>new CKEDITOR.focusManager( editor )</b>;
	 * focusManager.focus();
	 */
	CKEDITOR.focusManager = function( editor ) {
		if ( editor.focusManager )
			return editor.focusManager;

		/**
		 * Indicates that the editor instance has focus.
		 * @type Boolean
		 * @example
		 * alert( CKEDITOR.instances.editor1.focusManager.hasFocus );  // e.g. true
		 */
		this.hasFocus = false;

		/**
		 * Indicate the currently focused DOM element that makes the editor activated.
		 * @type {CKEDITOR.dom.domObject}
		 */
		this.currentActive = null;

		/**
		 * Object used to hold private stuff.
		 * @private
		 */
		this._ = {
			editor: editor
		};

		return this;
	};

	var SLOT_NAME = 'focusmanager',
		SLOT_NAME_LISTENERS = 'focusmanager_handlers';

	CKEDITOR.focusManager.prototype = {
		/**
		 * Indicate this editor instance is activated (due to DOM focus change),
		 * the "activated" state is a symbolic indicator of an active user
		 * interaction session.
		 *
		 * <strong>Note:</strong> This method will not introduce UI focus
		 * impact on DOM, it's here to record editor UI focus state internally.
		 * If you want to make the cursor blink inside of the editable, use
		 * {@link CKEDITOR.editor#focus} instead.
		 *
		 * @example
		 * var editor = CKEDITOR.instances.editor1;
		 * <b>editor.focusManage.focus( editor.editable() )</b>;
		 */
		focus: function() {
			if ( this._.timer )
				clearTimeout( this._.timer );

			if ( ! ( this.hasFocus || this._.locked ) ) {
				// If another editor has the current focus, we first "blur" it. In
				// this way the events happen in a more logical sequence, like:
				//		"focus 1" > "blur 1" > "focus 2"
				// ... instead of:
				//		"focus 1" > "focus 2" > "blur 1"
				var current = CKEDITOR.currentInstance;
				current && current.focusManager.blur( 1 );

				this.hasFocus = true;

				var ct = this._.editor.container
				ct && ct.addClass( 'cke_focus' );
				this._.editor.fire( 'focus' );
			}
		},

		/**
		 * Prevent from changing the focus manager state until next {@link #unlock} is called.
		 */
		lock: function() {
			this._.locked = 1;
		},

		/**
		 * Restore the automatic focus management, if {@link #lock} is called.
		 */
		unlock: function() {
			delete this._.locked;
		},

		/**
		 * Used to indicate that the editor instance has been deactivated by the specified
		 * element which has just lost focus.
		 * @param noDelay Deactivate immediately the editor instance synchronously.
		 *
		 * <strong>Note:</strong> that this functions acts asynchronously with a delay of 100ms to
		 * avoid temporary deactivation. Use instead the {@link #forceBlur} function instead
		 * to deactivate immediately.
		 * @example
		 * var editor = CKEDITOR.instances.editor1;
		 * <b>editor.focusManager.blur()</b>;
		 */
		blur: function( noDelay ) {

			if ( this._.locked )
				return;

			function doBlur() {
				if ( this.hasFocus ) {
					this.hasFocus = false;

					var ct = this._.editor.container;
					ct && ct.removeClass( 'cke_focus' );
					this._.editor.fire( 'blur' );
				}
			}

			if ( this._.timer )
				clearTimeout( this._.timer );

			if ( noDelay ) {
				doBlur.call( this );
			} else {
				this._.timer = CKEDITOR.tools.setTimeout( function() {
					delete this._.timer;
					doBlur.call( this );
				}, 200, this );
			}
		},

		/**
		 * Register an UI DOM element to the focus manager, which will make the focus manager "hasFocus"
		 * once input focus is relieved on the element, it's to be used by plugins to expand the jurisdiction of the editor focus.
		 *
		 * @param {CKEDITOR.dom.element} element The container (top most) element of one UI part.
		 * @param {Boolean} isCapture If specified {@link CKEDITOR.event.useCapture} will be used when listening to the focus event.
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
					// No capture support for focus/blur in old IEs, resort to
					// focusin/out instead.
					if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
						focusEvent = 'focusin';
						blurEvent = 'focusout';
					} else
						CKEDITOR.event.useCapture = 1;
				}

				var listeners = {
					blur: function() {
						if ( element.equals( this.currentActive ) )
							this.blur();
					},
					focus: function() {
						this.currentActive = element;
						this.focus();
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
		 * Dismiss an element from the the focus manager delegations added by {@link #add}
		 * @param {CKEDITOR.dom.element} element The element to be removed from the focusmanager.
		 */
		remove: function( element ) {
			element.removeCustomData( SLOT_NAME );
			var listeners = element.removeCustomData( SLOT_NAME_LISTENERS );
			element.removeListener( 'blur', listeners.blur );
			element.removeListener( 'focus', listeners.focus );
		}

	};

})();

/**
 * Fired when the editor instance receives the input focus.
 * @name CKEDITOR.editor#focus
 * @event
 * @param {CKEDITOR.editor} editor The editor instance.
 * @example
 * editor.on( 'focus', function( e )
 *     {
 *         alert( 'The editor named ' + e.editor.name + ' is now focused' );
 *     });
 */

/**
 * Fired when the editor instance loses the input focus.
 * <strong>Note:</strong> This event will NOT be triggered when focus is moved internally, e.g. from the editable to other part of the editor UI like dialog.
 * If you're interested on only the editable focus state listen to the {@link CKEDITOR.editable#focus} and {@link CKEDITOR.editable#blur} events instead.
 * @name CKEDITOR.editor#blur
 * @event
 * @param {CKEDITOR.editor} editor The editor instance.
 * @example
 * editor.on( 'blur', function( e )
 *     {
 *         alert( 'The editor named ' + e.editor.name + ' lost the focus' );
 *     });
 */
