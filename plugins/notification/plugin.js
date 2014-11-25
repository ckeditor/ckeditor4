/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.add( 'notification', {
	lang: 'en', // %REMOVE_LINE_CORE%

	init: function( editor ) {
		editor.showNotification = function( message, type, progress ) {
			var notification = new CKEDITOR.plugins.notification( editor, {
				message: message,
				type: type,
				progress: progress
			} );

			notification.show();

			return notification;
		};

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

				say( editor.lang.notification.closed );

				var notification = CKEDITOR.plugins.notification.getByElement( element );

				notification.hide();

				evt.cancel();
			}
		} );

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

function notification( editor, options ) {
	this.editor = editor;
	this.message = options.message;
	this.type = options.type ? options.type : 'info';
	this.progress = options.progress;
	this.id = CKEDITOR.tools.getUniqueId();
}

notification.prototype = {
	show: function() {
		if ( this.editor.fire( 'notificationShow', { notification: this } ) === false ) {
			return;
		}

		var notification = this,
			progress = this.getPrecentageProgress(),
			notificationElement,
			close = this.editor.lang.common.close;

		if ( !this.notificationArea ) {
			this.notificationArea = this._getNotificationArea();

			if ( !this.notificationArea ) {
				this.notificationArea = this._createNotificationArea();
			}
		}

		notificationElement = CKEDITOR.dom.element.createFromHtml(
			'<div class="cke_notification ' + this.getClass() + '" id="' + this.id + '" role="alert" aria-label="' + this.type + '">' +
				( progress ? this._createProgressElement().getOuterHtml() : '' ) +
				'<p class="cke_notification_message">' + this.message + '</p>' +
				'<a class="cke_notification_close" href="javascript:void(0)" title="' + close + '" role="button" tabindex="-1">' +
					'<span class="cke_label">X</span>' +
				'</a>' +
			'</div>' );

		notificationElement.findOne( '.cke_notification_close' ).on( 'click', function() {
			notification.hide();
		} );

		this.notificationArea.append( notificationElement );

		CKEDITOR.plugins.notification.repository[ this.id ] = this;

		this._layout();
	},

	_getNotificationArea: function() {
		return this.editor.container.getDocument().getById( 'cke_notifications_area_' + this.editor.name );
	},

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
			if ( notification.notificationArea ) {
				notification.notificationArea.remove();
			}
		} );
	},

	_detachListeners: function() {
		var win = CKEDITOR.document.getWindow(),
			editor = this.editor;

		win.removeListener( 'scroll', this._uiBuffer.input );
		win.removeListener( 'resize', this._uiBuffer.input );
		editor.removeListener( 'change', this._changeBuffer.input );
		editor.removeListener( 'floatingSpaceLayout', this._layout );
		editor.removeListener( 'blur', this._layout );
	},

	_layout: function() {
		var notificationArea = this.notificationArea,
			win = CKEDITOR.document.getWindow(),
			editor = this.editor,
			scrollPos = win.getScrollPosition(),
			contentsRect = editor.contents.getClientRect(),
			contentsPos = editor.contents.getDocumentPosition(),
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

		// Horizontal layout
		if ( top.isVisible() && topRect.bottom > contentsRect.top && topRect.bottom < contentsRect.bottom - notificationAreaRect.height ) {
			setBelowToolbar();
		} else if ( contentsRect.top > 0 ) {
			setTopStandard();
		} else if ( contentsPos.y + contentsRect.height - notificationAreaRect.height > scrollPos.y ) {
			setTopFixed();
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

		// Vertical layout
		var leftBase = notificationArea.getStyle( 'position' ) == 'fixed' ? contentsRect.left : contentsPos.x;

		if ( contentsRect.width < notificationWidth + notificationMargin ) {
			// Content is narrower than notification
			if ( contentsPos.x + notificationWidth + notificationMargin > scrollPos.x + viewRect.width ) {
				setRight();
			} else {
				setLeft();
			}
		} else {
			// Content is wider than notification
			if ( contentsPos.x + notificationWidth + notificationMargin > scrollPos.x + viewRect.width ) {
				setLeft();
			} else if ( contentsPos.x + contentsRect.width / 2 + notificationWidth / 2 + notificationMargin > scrollPos.x + viewRect.width ) {
				setRightFixed();
			} else if ( contentsRect.left + contentsRect.width - notificationWidth - notificationMargin < 0 ) {
				setRight();
			} else if ( contentsRect.left + contentsRect.width / 2 - notificationWidth / 2 < 0 ) {
				setLeftFixed();
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
			notificationArea.setStyle( 'left', cssLength( leftBase - contentsPos.x + scrollPos.x + viewRect.width - notificationWidth - notificationMargin ) );
		}
	},

	getClass: function() {
		if ( this.type == 'progress' ) {
			return 'cke_notification_info';
		} else {
			return 'cke_notification_' + this.type;
		}
	},

	getPrecentageProgress: function() {
		if ( this.type == 'progress' ) {
			return Math.round( this.progress * 100 ) + '%';
		} else {
			return 0;
		}
	},

	_createProgressElement: function() {
		var element = new CKEDITOR.dom.element( 'span' );
		element.addClass( 'cke_notification_progress' );
		element.setStyle( 'width', this.getPrecentageProgress() );
		return element;
	},

	hide: function() {
		if ( this.editor.fire( 'notificationHide', { notification: this } ) === false ) {
			return;
		}

		var element = this.getElement();

		if ( element ) {
			element.remove();
		}

		if ( this.notificationArea && !this.notificationArea.getChildCount() ) {
			this._detachListeners();
			this.notificationArea.remove();
			this.notificationArea = null;
		}

		delete CKEDITOR.plugins.notification.repository[ this.id ];
	},

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
					progressElement.setStyle( 'width', this.getPrecentageProgress() );
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

	getElement: function() {
		return this.editor.container.getDocument().getById( this.id );
	}
};

CKEDITOR.plugins.notification = notification;
CKEDITOR.plugins.notification.repository = {};

CKEDITOR.plugins.notification.getByElement = function( element ) {
	return CKEDITOR.plugins.notification.repository[ element.getId() ];
};