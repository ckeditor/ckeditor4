/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.add( 'notification', {
	lang: 'en', // %REMOVE_LINE_CORE%

	init: function( editor ) {
		/**
		 * Create and show the notification. By default the notification is shown over the editors contents, in the
		 * viewport if it is possible.
		 *
		 * @see CKEDITOR.plugins.notification
		 *
		 * @since 4.5
		 * @member CKEDITOR.editor
		 * @param {String} message Message displayed on the notification.
		 * @param {String} [type='info'] Type of the notification. Can be 'info', 'warning', 'success' or 'progress'.
		 * @param {Number} [progress=0] If the type is `progress` the third parameter may be a progress from 0 to 1.
		 * @returns {CKEDITOR.plugins.notification} Created and shown notification.
		 */
		editor.showNotification = function( message, type, progress ) {
			var notification = new CKEDITOR.plugins.notification( editor, {
				message: message,
				type: type,
				progress: progress
			} );

			notification.show();

			return notification;
		};

		// Close the last notification on ESC.
		editor.on( 'key', function( evt ) {
			if ( evt.data.keyCode == 27 /* ESC */ ) {
				var notificationArea = editor.container.getDocument().getById( 'cke_notifications_area_' + editor.name );

				if ( !notificationArea ) {
					return;
				}

				var element = notificationArea.getLast();

				if ( !element ) {
					return;
				}

				// As long as this is not a common practice to inform screen-reader users about actions, in this case
				// this is the best solution (unfortunately there is no standard for accessibility for notifications).
				// Notification has an `alert` aria role what means that it does not get a focus nor is needed to be
				// closed (unlike `alertdialog`). However notification will capture ESC key so we need to inform user
				// why it does not do other actions.
				say( editor.lang.notification.closed );

				var notification = CKEDITOR.plugins.notification.getByElement( element );

				notification.hide();

				evt.cancel();
			}
		} );

		// Send the message to the screen readers.
		function say( text ) {
			var message = new CKEDITOR.dom.element( 'div' );
			message.setStyle( 'position', 'fixed' );
			message.setStyle( 'margin-left', '-9999' );
			message.setAttribute( 'aria-live', 'assertive' );
			message.setAttribute( 'aria-atomic', 'true' );
			message.setText( text );

			CKEDITOR.document.getBody().append( message );

			setTimeout( function() {
				message.remove();
			}, 100 );
		}
	}
} );

/**
 * Notification class. Notifications are uses to show user short messages. They might be used to show result of
 * asynchronous actions or informations about changes in the editors content. They should be used instead of
 * alert dialogs. They should NOT be used if user response is required nor used with dialogs (ex. dialog validation).
 *
 * There are four types, see {@link #type}.
 *
 * Note that constructor just create a `notification` object. To show it use {@link #show show} method:
 *
 * 		var notification = new CKEDITOR.plugins.notification( editor, { message: 'Foo' } );
 * 		notification.show();
 *
 * Or use can use {@link CKEDITOR.editor#showNotification editor.showNotification} method:
 *
 * 		editor.showNotification( 'Foo' );
 *
 * All of the notification actions (`show`, `update` and `hide`) fires cancelable events so you can integrate editor
 * notifications with the website notifications.
 *
 * @since 4.5
 * @class CKEDITOR.plugins.notification
 * @constructor Create a notification object. Call `show` to show created notification.
 * @param {CKEDITOR.editor} editor The editor instance.
 * @param {Object} options
 * @param {String} options.message Message displayed on the notification.
 * @param {String} [options.type='info'] Type of the notification. Might be 'info', 'warning', 'success' or 'progress'.
 * @param {Number} [options.progress=0] If the type is `progress` this may be a progress from 0 to 1.
 */
function notification( editor, options ) {
	this.editor = editor;
	this.message = options.message;
	this.type = options.type ? options.type : 'info';
	this.progress = options.progress;
	this.id = CKEDITOR.tools.getUniqueId();
}

/**
 * The editor instance.
 *
 * @property {CKEDITOR.editor} editor
 */

/**
 * Message displayed on the notification.
 *
 * @property {String} message
 */

/**
 * Notification type. There are four types:
 *
 * * `info` (default) - Information for the user (ex. "File is uploading", "ACF modified content."),
 * * `warning` - Warning or error messages (ex. "This type of files is not supported",
 *		"You cannot paste script."),
 * * `success` - Information that operation finish successfully (ex. "File uploaded.", "Data imported.").
 * * `progress` - Show user progress of the operation.
 *
 * @property {String} type
 */

/**
 * If the type is `progress` this is the progress from 0 to 1.
 *
 * @property {Number} progress
 */

/**
 * Notification unique id.
 *
 * @property {Number} id
 */

/**
 * Area where notifications are put. Its position is set dynamically by `_layout` method.
 *
 * @private
 * @property {CKEDITOR.dom.element} _notificationArea
 */

/**
 * Width of the notification. Cached for the performance.
 *
 * @private
 * @property {CKEDITOR.dom.element} _notificationWidth
 */

/**
 * Margin of the notification. Cached for the performance.
 *
 * @private
 * @property {CKEDITOR.dom.element} _notificationMargin
 */

/**
 * Event buffer object for UI events to optimize performance.
 *
 * @private
 * @property {Object} _uiBuffer
 */

/**
 * Event buffer object for editor change events to optimize performance.
 *
 * @private
 * @property {Object} _changeBuffer
 */


notification.prototype = {
	/**
	 * Create notification element and show it. This method create also notification area if needed.
	 *
	 * Fire {@link CKEDITOR.editor#notificationShow} event.
	 */
	show: function() {
		if ( this.editor.fire( 'notificationShow', { notification: this } ) === false ) {
			return;
		}

		var notification = this,
			notificationElement, notificationMessageElement, notificationCloseElement,
			close = this.editor.lang.common.close;

		if ( !this._notificationArea ) {
			this._notificationArea = this.editor.container.getDocument().getById( 'cke_notifications_area_' + this.editor.name );

			if ( !this._notificationArea ) {
				this._notificationArea = this._createNotificationArea();
			}
		}

		notificationElement = new CKEDITOR.dom.element( 'div' );
		notificationElement.addClass( 'cke_notification' );
		notificationElement.addClass( this.getClass() );
		notificationElement.setAttribute( 'id', this.id );
		notificationElement.setAttribute( 'role', 'alert' );
		notificationElement.setAttribute( 'aria-label', this.type );

		if ( this.type == 'progress' )
			notificationElement.append( this._createProgressElement() );

		notificationMessageElement = new CKEDITOR.dom.element( 'p' );
		notificationMessageElement.addClass( 'cke_notification_message' );
		notificationMessageElement.setHtml( this.message );
		notificationElement.append( notificationMessageElement );

		notificationCloseElement = CKEDITOR.dom.element.createFromHtml(
			'<a class="cke_notification_close" href="javascript:void(0)" title="' + close + '" role="button" tabindex="-1">' +
				'<span class="cke_label">X</span>' +
			'</a>' );
		notificationElement.append( notificationCloseElement );

		notificationElement.findOne( '.cke_notification_close' ).on( 'click', function() {
			notification.hide();
		} );

		this._notificationArea.append( notificationElement );

		CKEDITOR.plugins.notification.repository[ this.id ] = this;

		this._layout();
	},

	/**
	 * Update notification object and element.
	 *
	 * Fire {@link CKEDITOR.editor#notificationUpdate} event.
	 *
	 * @param {Object} options
	 * @param {String} [options.message] {@link CKEDITOR.plugins.notification#constructor}
	 * @param {String} [options.type] {@link CKEDITOR.plugins.notification#constructor}
	 * @param {Number} [options.progress] {@link CKEDITOR.plugins.notification#constructor}
	 * @param {Boolean} [options.important=false] If update is important, notification will be shown
	 * if it was hidden and read by screen readers.
	 */
	update: function( options ) {
		if ( this.editor.fire( 'notificationUpdate', { notification: this, options: options } ) === false ) {
			return;
		}

		var element = this.getElement(),
			messageElement, progressElement;

		if ( element ) {
			messageElement = element.findOne( '.cke_notification_message' );
			progressElement = element.findOne( '.cke_notification_progress' );

			element.removeAttribute( 'role' );
		}

		if ( options.type ) {
			if ( element ) {
				element.removeClass( this.getClass() );
				element.removeAttribute( 'aria-label' );
			}

			this.type = options.type;

			if ( element ) {
				element.addClass( this.getClass() );
				element.setAttribute( 'aria-label', this.type );
			}
		}

		if ( options.message || options.progress ) {
			if ( options.message ) {
				this.message = options.message;
			}

			if ( options.progress ) {
				this.progress = options.progress;
			}

			if ( messageElement ) {
				messageElement.setHtml( this.message );
			}

			if ( options.progress ) {
				if ( progressElement ) {
					progressElement.setStyle( 'width', this.getPercentageProgress() );
				} else if ( element && !progressElement ) {
					progressElement = this._createProgressElement();
					progressElement.insertBefore( messageElement );
				}
			}
		}

		if ( !element && options.important ) {
			this.show();
		} else if ( element && options.important ) {
			element.setAttribute( 'role', 'alert' );
		}
	},

	/**
	 * Remove notification element. This method also remove notification area and detach listeners if it was the last
	 * notification.
	 *
	 * Fire {@link CKEDITOR.editor#notificationHide} event.
	 */
	hide: function() {
		if ( this.editor.fire( 'notificationHide', { notification: this } ) === false ) {
			return;
		}

		var element = this.getElement();

		if ( element ) {
			element.remove();
		}

		if ( this._notificationArea && !this._notificationArea.getChildCount() ) {
			this._detachListeners();
			this._notificationArea.remove();
			this._notificationArea = null;
		}

		delete CKEDITOR.plugins.notification.repository[ this.id ];
	},

	/**
	 * Get notification DOM element or `null` if not found.
	 *
	 * @returns {CKEDITOR.dom.element} element Notification DOM element.
	 */
	getElement: function() {
		return this.editor.container.getDocument().getById( this.id );
	},

	/**
	 * Get notification CSS class.
	 *
	 * @returns {String} Notification CSS class.
	 */
	getClass: function() {
		if ( this.type == 'progress' ) {
			return 'cke_notification_info';
		} else {
			return 'cke_notification_' + this.type;
		}
	},

	/**
	 * Get progress as a percentage (ex. `0.3` -> `30%`).
	 *
	 * @returns {String} Progress as a percentage.
	 */
	getPercentageProgress: function() {
		if ( this.type == 'progress' ) {
			return Math.round( this.progress * 100 ) + '%';
		} else {
			return 0;
		}
	},

	/**
	 * Create progress element for the notification element.
	 *
	 * @returns {CKEDITOR.dom.element} [description]
	 */
	_createProgressElement: function() {
		var element = new CKEDITOR.dom.element( 'span' );
		element.addClass( 'cke_notification_progress' );
		element.setStyle( 'width', this.getPercentageProgress() );
		return element;
	},

	/**
	 * Creates the notification area element, where all notifications are placed and attach all listeners to it.
	 *
	 * @private
	 * @returns {CKEDITOR.dom.element} Notification area element.
	 */
	_createNotificationArea: function() {
		var editor = this.editor,
			config = editor.config,
			notificationArea = new CKEDITOR.dom.element( 'div' );

		notificationArea.addClass( 'cke_notifications_area' );
		notificationArea.setAttribute( 'id', 'cke_notifications_area_' + editor.name );
		notificationArea.setStyle( 'z-index', config.baseFloatZIndex - 2 );

		CKEDITOR.document.getBody().append( notificationArea );

		this._attachListeners();

		return notificationArea;
	},

	/**
	 * Attach listeners to the notification area.
	 *
	 * @private
	 */
	_attachListeners: function() {
		var win = CKEDITOR.document.getWindow(),
			notification = this,
			editor = this.editor;

		this._uiBuffer = CKEDITOR.tools.eventsBuffer( 10, this._layout, this ),
		this._changeBuffer = CKEDITOR.tools.eventsBuffer( 500, this._layout, this ),

		win.on( 'scroll', this._uiBuffer.input );
		win.on( 'resize', this._uiBuffer.input );
		editor.on( 'change', this._changeBuffer.input );
		editor.on( 'floatingSpaceLayout', notification._layout, notification, null, 20 );
		editor.on( 'blur', this._layout, notification, null, 20 );

		editor.on( 'destroy', function() {
			notification._detachListeners();
			if ( notification._notificationArea ) {
				notification._notificationArea.remove();
			}
		} );
	},

	/**
	 * Detach listeners from the notification area.
	 *
	 * @private
	 */
	_detachListeners: function() {
		var win = CKEDITOR.document.getWindow(),
			editor = this.editor;

		win.removeListener( 'scroll', this._uiBuffer.input );
		win.removeListener( 'resize', this._uiBuffer.input );
		editor.removeListener( 'change', this._changeBuffer.input );
		editor.removeListener( 'floatingSpaceLayout', this._layout );
		editor.removeListener( 'blur', this._layout );
	},

	/**
	 * Set the position of the notification area based on the editor content, toolbar and viewport position and dimensions.
	 *
	 * @private
	 */
	_layout: function() {
		var notificationArea = this._notificationArea,
			win = CKEDITOR.document.getWindow(),
			editor = this.editor,
			scrollPos = win.getScrollPosition(),
			contentsRect = editor.ui.contentsElement.getClientRect(),
			contentsPos = editor.ui.contentsElement.getDocumentPosition(),
			top = editor.ui.space( 'top' ),
			topRect = top.getClientRect(),
			notificationAreaRect = notificationArea.getClientRect(),
			viewRect = win.getViewPaneSize(),
			notificationWidth = this._notificationWidth,
			notificationMargin = this._notificationMargin,
			element,
			cssLength = CKEDITOR.tools.cssLength;

		// Cache for optimization
		if ( !notificationWidth || !notificationMargin ) {
			element = this.getElement();
			notificationWidth = this._notificationWidth = element.getClientRect().width;
			notificationMargin = this._notificationMargin = parseInt( element.getComputedStyle( 'margin-left' ), 10 ) +
				parseInt( element.getComputedStyle( 'margin-right' ), 10 );
		}

		// --------------------------------------- Horizontal layout ----------------------------------------

		// +---Viewport-------------------------------+          +---Viewport-------------------------------+
		// |                                          |          |                                          |
		// | +---Toolbar----------------------------+ |          | +---Content----------------------------+ |
		// | |                                      | |          | |                                      | |
		// | +---Content----------------------------+ |          | |                                      | |
		// | |                                      | |          | +---Toolbar----------------------+     | |
		// | |      +------Notification------+      | |          | |                                |     | |
		// | |                                      | |    OR    | +--------------------------------+     | |
		// | |                                      | |          | |                                      | |
		// | |                                      | |          | |      +------Notification------+      | |
		// | |                                      | |          | |                                      | |
		// | |                                      | |          | |                                      | |
		// | +--------------------------------------+ |          | +--------------------------------------+ |
		// +------------------------------------------+          +------------------------------------------+
		if ( top.isVisible() &&
			topRect.bottom > contentsRect.top &&
			topRect.bottom < contentsRect.bottom - notificationAreaRect.height ) {
			setBelowToolbar();

		// +---Viewport-------------------------------+
		// |                                          |
		// | +---Content----------------------------+ |
		// | |                                      | |
		// | |      +------Notification------+      | |
		// | |                                      | |
		// | |                                      | |
		// | |                                      | |
		// | +--------------------------------------+ |
		// |                                          |
		// +------------------------------------------+
		} else if ( contentsRect.top > 0 ) {
			setTopStandard();

		//   +---Content----------------------------+
		//   |                                      |
		// +---Viewport-------------------------------+
		// | |                                      | |
		// | |      +------Notification------+      | |
		// | |                                      | |
		// | |                                      | |
		// | |                                      | |
		// | +--------------------------------------+ |
		// |                                          |
		// +------------------------------------------+
		} else if ( contentsPos.y + contentsRect.height - notificationAreaRect.height > scrollPos.y ) {
			setTopFixed();

		//   +---Content----------------------------+              +---Content----------------------------+
		//   |                                      |              |                                      |
		//   |                                      |              |                                      |
		//   |                                      |              |      +------Notification------+      |
		//   |                                      |              |                                      |
		//   |                                      |      OR      +--------------------------------------+
		// +---Viewport-------------------------------+
		// | |      +------Notification------+      | |          +---Viewport-------------------------------+
		// | |                                      | |          |                                          |
		// | +--------------------------------------+ |          |                                          |
		// |                                          |          |                                          |
		// +------------------------------------------+          +------------------------------------------+
		} else {
			setBottom();
		}

		function setTopStandard() {
			notificationArea.setStyle( 'position', 'absolute' );
			notificationArea.setStyle( 'top', cssLength( contentsPos.y ) );
		}

		function setBelowToolbar() {
			notificationArea.setStyle( 'position', 'fixed' );
			notificationArea.setStyle( 'top', cssLength( topRect.bottom ) );
		}

		function setTopFixed() {
			notificationArea.setStyle( 'position', 'fixed' );
			notificationArea.setStyle( 'top', 0 );
		}

		function setBottom() {
			notificationArea.setStyle( 'position', 'absolute' );
			notificationArea.setStyle( 'top', cssLength( contentsPos.y + contentsRect.height - notificationAreaRect.height ) );
		}

		// ---------------------------------------- Vertical layout -----------------------------------------

		var leftBase = notificationArea.getStyle( 'position' ) == 'fixed' ? contentsRect.left : contentsPos.x;

		// Content is narrower than notification
		if ( contentsRect.width < notificationWidth + notificationMargin ) {

			// +---Viewport-------------------------------+
			// |                                          |
			// |                 +---Content------------+ |
			// |                 |                      | |
			// |             +------Notification------+ | |
			// |                 |                      | |
			// |                 +----------------------+ |
			// |                                          |
			// +------------------------------------------+
			if ( contentsPos.x + notificationWidth + notificationMargin > scrollPos.x + viewRect.width ) {
				setRight();

			// +---Viewport-------------------------------+               +---Viewport--------------------------+
			// |                                          |               |                                     |
			// |     +---Content------------+             |            +---Content------------+                 |
			// |     |                      |             |            |  |                   |                 |
			// |     | +------Notification------+         |    OR      | +------Notification------+             |
			// |     |                      |             |            |  |                   |                 |
			// |     +----------------------+             |            +----------------------+                 |
			// |                                          |               |                                     |
			// +------------------------------------------+               +-------------------------------------+
			} else {
				setLeft();
			}
		// Content is wider than notification
		} else {

			//                       +--+Viewport+------------------------+
			//                       |                                    |
			//                       |             +---Content-----------------------------------------+
			//                       |             |                      |                            |
			//                       |             | +-----+Notification+-----+                        |
			//                       |             |                      |                            |
			//                       |             |                      |                            |
			//                       |             |                      |                            |
			//                       |             +---------------------------------------------------+
			//                       |                                    |
			//                       +------------------------------------+
			if ( contentsPos.x + notificationWidth + notificationMargin > scrollPos.x + viewRect.width ) {
				setLeft();

			//                       +---Viewport-------------------------+
			//                       |                                    |
			//                       |  +---Content----------------------------------------------+
			//                       |  |                                 |                      |
			//                       |  |      +------Notification------+ |                      |
			//                       |  |                                 |                      |
			//                       |  |                                 |                      |
			//                       |  +--------------------------------------------------------+
			//                       |                                    |
			//                       +------------------------------------+
			} else if ( contentsPos.x + contentsRect.width / 2 +
				notificationWidth / 2 + notificationMargin > scrollPos.x + viewRect.width ) {
				setRightFixed();

			//                       +---Viewport-------------------------+
			//                       |                                    |
			//   +---Content----------------------------+                 |
			//   |                   |                  |                 |
			//   |           +------Notification------+ |                 |
			//   |                   |                  |                 |
			//   |                   |                  |                 |
			//   +--------------------------------------+                 |
			//                       |                                    |
			//                       +------------------------------------+
			} else if ( contentsRect.left + contentsRect.width - notificationWidth - notificationMargin < 0 ) {
				setRight();

			//                       +---Viewport-------------------------+
			//                       |                                    |
			// +---Content---------------------------------------------+  |
			// |                     |                                 |  |
			// |                     | +------Notification------+      |  |
			// |                     |                                 |  |
			// |                     |                                 |  |
			// +-------------------------------------------------------+  |
			//                       |                                    |
			//                       +------------------------------------+
			} else if ( contentsRect.left + contentsRect.width / 2 - notificationWidth / 2 < 0 ) {
				setLeftFixed();

			//                       +---Viewport-------------------------+
			//                       |                                    |
			//                       | +---Content----------------------+ |
			//                       | |                                | |
			//                       | |    +-----Notification-----+    | |
			//                       | |                                | |
			//                       | |                                | |
			//                       | +--------------------------------+ |
			//                       |                                    |
			//                       +------------------------------------+
			} else {
				setCenter();
			}
		}

		function setLeft() {
			notificationArea.setStyle( 'left', cssLength( leftBase ) );
		}

		function setLeftFixed() {
			notificationArea.setStyle( 'left', cssLength( leftBase - contentsPos.x + scrollPos.x ) );
		}

		function setCenter() {
			notificationArea.setStyle( 'left', cssLength( leftBase + contentsRect.width / 2 - notificationWidth / 2 ) );
		}

		function setRight() {
			notificationArea.setStyle( 'left', cssLength( leftBase + contentsRect.width - notificationWidth - notificationMargin ) );
		}

		function setRightFixed() {
			notificationArea.setStyle( 'left', cssLength( leftBase - contentsPos.x + scrollPos.x + viewRect.width -
				notificationWidth - notificationMargin ) );
		}
	}
};

CKEDITOR.plugins.notification = notification;

/**
 * Map of the visible notifications needed to get notification object by element. Elements ids are keys,
 * notification objects are values.
 *
 * @private
 * @static
 * @type {Object}
 */
CKEDITOR.plugins.notification.repository = {};

/**
 * Get notification object by its element. Note that element must exists in the notification area.
 *
 * @static
 * @param {CKEDITOR.dom.element} element Notification DOM element.
 * @returns {CKEDITOR.plugins.notification} Notification object.
 */
CKEDITOR.plugins.notification.getByElement = function( element ) {
	return CKEDITOR.plugins.notification.repository[ element.getId() ];
};

/**
 * This event is fired when the {@link CKEDITOR.plugins.notification#show} method is called, before the notification is shown.
 * If this event will be canceled, notification will be not shown. It is created to modify notification before it is shown,
 * execute additional actions or prevent editor notifications and handle then in the custom way.
 *
 * @since 4.5
 * @event notificationShow
 * @member CKEDITOR.editor
 * @param data
 * @param {CKEDITOR.plugins.notification} data.notification Notification which will be shown.
 * @param {CKEDITOR.editor} editor The editor instance.
 */

/**
 * This event is fired when the {@link CKEDITOR.plugins.notification#update} method is called, before the notification is updated.
 * If this event will be canceled, notification will be not updated. It is created to execute additional actions on notification
 * update or handle notifications in the custom way.
 *
 * @since 4.5
 * @event notificationUpdate
 * @member CKEDITOR.editor
 * @param data
 * @param {CKEDITOR.plugins.notification} data.notification Notification which will be updated. Node that it contains not updated data.
 * @param {Object} data.options Update options, see {@link CKEDITOR.plugins.notification#update}.
 * @param {CKEDITOR.editor} editor The editor instance.
 */

/**
 * This event is fired when the {@link CKEDITOR.plugins.notification#hide} method is called, before the notification is hidden.
 * If this event will be canceled, notification will be not hidden. It is created to execute additional actions on hide
 * or handle notifications in the custom way.
 *
 * @since 4.5
 * @event notificationHide
 * @member CKEDITOR.editor
 * @param data
 * @param {CKEDITOR.plugins.notification} data.notification Notification which will be hidden.
 * @param {CKEDITOR.editor} editor The editor instance.
 */