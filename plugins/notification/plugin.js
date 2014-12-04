/*
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.add( 'notification', {
	lang: 'en', // %REMOVE_LINE_CORE%

	init: function( editor ) {
		/**
		 * {@link CKEDITOR.plugins.notification.area Notification area} instance.
		 *
		 * @member CKEDITOR.editor
		 * @property {CKEDITOR.plugins.notification.area} notificationArea
		 */
		editor.notificationArea = new CKEDITOR.plugins.notification.area( editor );

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
		 * @param {Number} [progressOrDuration] If the type is `progress` the third parameter may be a progress from 0 to 1
		 * (default 0). Otherwise the the third parameter may be a notification duration: how many miliseconds after the
		 * next change event notification should be closed automatically. 0 means that notification will not be closed
		 * automatically, user needs to close it manually. See {@link CKEDITOR.plugins.notification#duration}.
		 *
		 * @returns {CKEDITOR.plugins.notification} Created and shown notification.
		 */
		editor.showNotification = function( message, type, progressOrDuration ) {
			var progress, duration;

			if ( type == 'progress' ) {
				progress = progressOrDuration;
			} else {
				duration = progressOrDuration;
			}

			var notification = new CKEDITOR.plugins.notification( editor, {
				message: message,
				type: type,
				progress: progress,
				duration: duration
			} );

			notification.show();

			return notification;
		};

		// Close the last notification on ESC.
		editor.on( 'key', function( evt ) {
			if ( evt.data.keyCode == 27 /* ESC */ ) {
				var notifications = editor.notificationArea.notifications;

				if ( !notifications.length ) {
					return;
				}

				// As long as this is not a common practice to inform screen-reader users about actions, in this case
				// this is the best solution (unfortunately there is no standard for accessibility for notifications).
				// Notification has an `alert` aria role what means that it does not get a focus nor is needed to be
				// closed (unlike `alertdialog`). However notification will capture ESC key so we need to inform user
				// why it does not do other actions.
				say( editor.lang.notification.closed );

				// Hide last.
				notifications[ notifications.length - 1 ].hide();

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
 * There are four types of notifications, see {@link #type}.
 *
 * Note that constructor just create a `notification` object. To show it use {@link #show show} method:
 *
 * 		var notification = new CKEDITOR.plugins.notification( editor, { message: 'Foo' } );
 * 		notification.show();
 *
 * Or user can use {@link CKEDITOR.editor#showNotification editor.showNotification} method:
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
 * @param {String} [options.type='info'] Type of the notificationsee {@link #type}.
 * @param {Number} [options.progress=0] If the type is `progress` this may be a progress from 0 to 1.
 * @param {Number} [options.duration] How long notification will be visible, see {@link #duration}.
 */
function notification( editor, options ) {
	this.editor = editor;
	this.message = options.message;
	this.type = options.type ? options.type : 'info';
	this.progress = options.progress;
	this.duration = options.duration;
	this.id = 'cke-' + CKEDITOR.tools.getUniqueId();
	this.element = this._createElement();
	this.area = this.editor.notificationArea;
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
 * * `progress` - Show user progress of the operation. When operations id done the type of the notification
 * 		should be changed to `success`.
 *
 * @property {String} type
 */

/**
 * If the type is `progress` this is the progress from 0 to 1.
 *
 * @property {Number} progress
 */

/**
 * Notification duration, how many miliseconds after the next change event notification should be closed automatically.
 * 0 means that notification will not be closed automatically, user needs to close it manually.
 * By default it is 0 for `warning` and `progress`. For `info` and `success` value it is the of
 * {@link CKEDITOR.config#notification_duration notification_duration} configuration option or 5000 if not set.
 *
 * @property {Number} duration
 */

/**
 * Notification unique id.
 *
 * @property {Number} id
 */

/**
 * Notification DOM element. There is one element per notification. It is created when the notification is created,
 * even if it not shown. If notification is hidden element is detached from document but not deleted, it will be reused if
 * notification will be shown again.
 *
 * @private
 * @property {CKEDITOR.dom.element} element
 */

/**
 * {@link CKEDITOR.plugins.notification.area Notifications area} reference.
 *
 * @private
 * @property {CKEDITOR.plugins.notification.area} area
 */

notification.prototype = {
	/**
	 * Add notification element to the notification area. Notification will be hidden automatically if {@link #duration}
	 * was set.
	 *
	 * Fire {@link CKEDITOR.editor#notificationShow} event.
	 */
	show: function() {
		if ( this.editor.fire( 'notificationShow', { notification: this } ) === false ) {
			return;
		}

		this.area.add( this );

		this._hideAfterTimeout();
	},

	/**
	 * Update notification object and element.
	 *
	 * Fire {@link CKEDITOR.editor#notificationUpdate} event.
	 *
	 * @param {Object} options
	 * @param {String} [options.message] {@link #message}
	 * @param {String} [options.type] {@link #type}
	 * @param {Number} [options.progress] {@link #progress}
	 * @param {Number} [options.duration] {@link #duration}
	 * @param {Boolean} [options.important=false] If update is important, notification will be shown
	 * if it was hidden and read by screen readers.
	 */
	update: function( options ) {
		if ( this.editor.fire( 'notificationUpdate', { notification: this, options: options } ) === false ) {
			return;
		}

		var element = this.element,
			messageElement = element.findOne( '.cke_notification_message' ),
			progressElement = element.findOne( '.cke_notification_progress' );

		element.removeAttribute( 'role' );

		if ( options.type ) {
			element.removeClass( this._getClass() );
			element.removeAttribute( 'aria-label' );

			this.type = options.type;

			element.addClass( this._getClass() );
			element.setAttribute( 'aria-label', this.type );

			if ( this.type == 'progress' && !progressElement ) {
				progressElement = this._createProgressElement();
				progressElement.insertBefore( messageElement );
			} else if ( this.type != 'progress' && progressElement ) {
				progressElement.remove();
			}
		}

		if ( options.message !== undefined ) {
			this.message = options.message;
			messageElement.setHtml( this.message );
		}

		if ( options.progress  !== undefined ) {
			this.progress = options.progress;
			if ( progressElement ) {
				progressElement.setStyle( 'width', this._getPercentageProgress() );
			}
		}

		if ( options.important ) {
			element.setAttribute( 'role', 'alert' );

			if ( !this.isVisible() ) {
				this.area.add( this );
			}
		}

		// Overwrite even if it is undefined.
		this.duration = options.duration;

		this._hideAfterTimeout();
	},

	/**
	 * Remove notification element from notification area.
	 *
	 * Fire {@link CKEDITOR.editor#notificationHide} event.
	 */
	hide: function() {
		if ( this.editor.fire( 'notificationHide', { notification: this } ) === false ) {
			return;
		}

		this.area.remove( this );
	},

	/**
	 * Returns true if notification is in the notification area.
	 *
	 * @returns {Boolean} true if notification is in the notification area.
	 */
	isVisible: function() {
		return CKEDITOR.tools.indexOf( this.area.notifications, this ) >= 0;
	},

	/**
	 * Creates notification DOM element.
	 *
	 * @private
	 * @returns {CKEDITOR.dom.element} Notification DOM element.
	 */
	_createElement: function() {
		var notification = this,
			notificationElement, notificationMessageElement, notificationCloseElement,
			close = this.editor.lang.common.close;

		notificationElement = new CKEDITOR.dom.element( 'div' );
		notificationElement.addClass( 'cke_notification' );
		notificationElement.addClass( this._getClass() );
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

		return notificationElement;
	},

	/**
	 * Get notification CSS class.
	 *
	 * @private
	 * @returns {String} Notification CSS class.
	 */
	_getClass: function() {
		if ( this.type == 'progress' ) {
			return 'cke_notification_info';
		} else {
			return 'cke_notification_' + this.type;
		}
	},

	/**
	 * Create progress element for the notification element.
	 *
	 * @private
	 * @returns {CKEDITOR.dom.element} Progress element for the notification element.
	 */
	_createProgressElement: function() {
		var element = new CKEDITOR.dom.element( 'span' );
		element.addClass( 'cke_notification_progress' );
		element.setStyle( 'width', this._getPercentageProgress() );
		return element;
	},

	/**
	 * Get progress as a percentage (ex. `0.3` -> `30%`).
	 *
	 * @private
	 * @returns {String} Progress as a percentage.
	 */
	_getPercentageProgress: function() {
		if ( this.progress ) {
			return Math.round( this.progress * 100 ) + '%';
		} else {
			return 0;
		}
	},

	/**
	 * Hide notification after the timeout after the first change event.
	 *
	 * @private
	 */
	_hideAfterTimeout: function() {
		var notification = this,
			duration;

		if ( this._hideTimeoutId ) {
			clearTimeout( this._hideTimeoutId );
		}

		if ( typeof this.duration == 'number' ) {
			duration = this.duration;
		} else if ( this.type == 'info' || this.type == 'success' ) {
			if ( typeof this.editor.config.notification_duration == 'number' ) {
				duration = this.editor.config.notification_duration;
			} else {
				duration = 5000;
			}
		}

		if ( duration ) {
			this.editor.once( 'change', function() {
				notification._hideTimeoutId = setTimeout( function() {
					notification.hide();
				}, duration );
			} );
		}
	}
};

/**
 * Notification area where all notification are put. Area is layout dynamically. When the first notification is added
 * area is shown and all listeners are added. When the last notification is removed area is hidden and all listeners are
 * removed.
 *
 * @since 4.5
 * @class CKEDITOR.plugins.notification.area
 * @constructor
 * @param {CKEDITOR.editor} editor The editor instance.
 */
function area( editor ) {
	var that = this;

	this.editor = editor;
	this.notifications = [];
	this.element = this._createElement(),

	editor.on( 'destroy', function() {
		that._removeListeners();
		that.element.remove();
	} );
}

/**
 * The editor instance.
 *
 * @property {CKEDITOR.editor} editor
 */

/**
 * Array of added notifications.
 *
 * @property {Array} notifications
 */

/**
 * Notification area DOM element. This element is created when area object is created. It will be attached to the document
 * when the first notification is added and removed when the last notification is removed.
 *
 * @private
 * @property {CKEDITOR.dom.element} element
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

area.prototype = {
	/**
	 * Add the notification to the notification area. If it is the first notification then area will be also attached to
	 * the document and listers will be attached.
	 *
	 * Note that the proper way to show notification is to call {@link CKEDITOR.plugins.notification#show} method.
	 *
	 * @param {CKEDITOR.plugins.notification} notification Notification to add.
	 */
	add: function( notification ) {
		this.notifications.push( notification );

		this.element.append( notification.element );

		if ( this.element.getChildCount() == 1 ) {
			CKEDITOR.document.getBody().append( this.element );
			this._attachListeners();
		}

		this._layout();
	},

	/**
	 * Remove the notification from the notification area. If it is the last notification then area will be also
	 * detached from the document and listers will be detached.
	 *
	 * Note that the proper way to hide notification is to call {@link CKEDITOR.plugins.notification#hide} method.
	 *
	 * @param {CKEDITOR.plugins.notification} notification Notification to remove.
	 */
	remove: function( notification ) {
		var i = CKEDITOR.tools.indexOf( this.notifications, notification );

		if ( i < 0 ) {
			return;
		}

		this.notifications.splice( i, 1 );

		notification.element.remove();

		if ( !this.element.getChildCount() ) {
			this._removeListeners();
			this.element.remove();
		}
	},

	/**
	 * Creates the notification area element.
	 *
	 * @private
	 * @returns {CKEDITOR.dom.element} Notification area element.
	 */
	_createElement: function() {
		var editor = this.editor,
			config = editor.config,
			notificationArea = new CKEDITOR.dom.element( 'div' );

		notificationArea.addClass( 'cke_notifications_area' );
		notificationArea.setAttribute( 'id', 'cke_notifications_area_' + editor.name );
		notificationArea.setStyle( 'z-index', config.baseFloatZIndex - 2 );

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
	},

	/**
	 * Detach listeners from the notification area.
	 *
	 * @private
	 */
	_removeListeners: function() {
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
		var area = this.element,
			editor = this.editor,
			contentsRect = editor.ui.contentsElement.getClientRect(),
			contentsPos = editor.ui.contentsElement.getDocumentPosition(),
			top = editor.ui.space( 'top' ),
			topRect = top.getClientRect(),
			areaRect = area.getClientRect(),
			notification,
			notificationWidth = this._notificationWidth,
			notificationMargin = this._notificationMargin,
			win = CKEDITOR.document.getWindow(),
			scrollPos = win.getScrollPosition(),
			viewRect = win.getViewPaneSize(),
			cssLength = CKEDITOR.tools.cssLength;

		// Cache for optimization
		if ( !notificationWidth || !notificationMargin ) {
			notification = this.element.getChild( 0 );
			notificationWidth = this._notificationWidth = notification.getClientRect().width;
			notificationMargin = this._notificationMargin =
				parseInt( notification.getComputedStyle( 'margin-left' ), 10 ) +
				parseInt( notification.getComputedStyle( 'margin-right' ), 10 );
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
			topRect.bottom < contentsRect.bottom - areaRect.height ) {
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
		} else if ( contentsPos.y + contentsRect.height - areaRect.height > scrollPos.y ) {
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
			area.setStyle( 'position', 'absolute' );
			area.setStyle( 'top', cssLength( contentsPos.y ) );
		}

		function setBelowToolbar() {
			area.setStyle( 'position', 'fixed' );
			area.setStyle( 'top', cssLength( topRect.bottom ) );
		}

		function setTopFixed() {
			area.setStyle( 'position', 'fixed' );
			area.setStyle( 'top', 0 );
		}

		function setBottom() {
			area.setStyle( 'position', 'absolute' );
			area.setStyle( 'top', cssLength( contentsPos.y + contentsRect.height - areaRect.height ) );
		}

		// ---------------------------------------- Vertical layout -----------------------------------------

		var leftBase = area.getStyle( 'position' ) == 'fixed' ? contentsRect.left : contentsPos.x;

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
			area.setStyle( 'left', cssLength( leftBase ) );
		}

		function setLeftFixed() {
			area.setStyle( 'left', cssLength( leftBase - contentsPos.x + scrollPos.x ) );
		}

		function setCenter() {
			area.setStyle( 'left', cssLength( leftBase + contentsRect.width / 2 - notificationWidth / 2 ) );
		}

		function setRight() {
			area.setStyle( 'left', cssLength( leftBase + contentsRect.width - notificationWidth - notificationMargin ) );
		}

		function setRightFixed() {
			area.setStyle( 'left', cssLength( leftBase - contentsPos.x + scrollPos.x + viewRect.width -
				notificationWidth - notificationMargin ) );
		}
	}
};

CKEDITOR.plugins.notification = notification;
CKEDITOR.plugins.notification.area = area;

/**
 * How many milliseconds after the `change` event `info` and `success` notifications should be closed automatically.
 * 0 means that notifications will not be closed automatically.
 * Note that `warning` and `progress` notifications will not be closed automatically.
 *
 * @since 4.5
 * @cfg {Function} [notification_duration=5000]
 * @member CKEDITOR.config
 */


/**
 * This event is fired when the {@link CKEDITOR.plugins.notification#show} method is called, before the
 * notification is shown. If this event will be canceled, notification will be not shown. It is created to modify
 * notification before it is shown, execute additional actions or prevent editor notifications and handle then in
 * the custom way.
 *
 * @since 4.5
 * @event notificationShow
 * @member CKEDITOR.editor
 * @param data
 * @param {CKEDITOR.plugins.notification} data.notification Notification which will be shown.
 * @param {CKEDITOR.editor} editor The editor instance.
 */

/**
 * This event is fired when the {@link CKEDITOR.plugins.notification#update} method is called, before the
 * notification is updated. If this event will be canceled, notification will be not updated. It is created to execute
 * additional actions on notification update or handle notifications in the custom way.
 *
 * @since 4.5
 * @event notificationUpdate
 * @member CKEDITOR.editor
 * @param data
 * @param {CKEDITOR.plugins.notification} data.notification Notification which will be updated.
 * Node that it contains not updated data.
 * @param {Object} data.options Update options, see {@link CKEDITOR.plugins.notification#update}.
 * @param {CKEDITOR.editor} editor The editor instance.
 */

/**
 * This event is fired when the {@link CKEDITOR.plugins.notification#hide} method is called, before the
 * notification is hidden. If this event will be canceled, notification will be not hidden. It is created to execute
 * additional actions on hide or handle notifications in the custom way.
 *
 * @since 4.5
 * @event notificationHide
 * @member CKEDITOR.editor
 * @param data
 * @param {CKEDITOR.plugins.notification} data.notification Notification which will be hidden.
 * @param {CKEDITOR.editor} editor The editor instance.
 */
