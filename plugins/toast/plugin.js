/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.add( 'toast', {
	init: function( editor ) {
		editor.makeToast = function( message, type, progress ) {
			var toast = new CKEDITOR.plugins.toast( editor, {
				message: message,
				type: type,
				progress: progress
			} );

			toast.show();

			return toast;
		};

		editor.on( 'key', function( evt ) {
			if ( evt.data.keyCode == 27 /* ESC */ ) {
				var toastArea = editor.container.findOne( '.cke_toasts_area' );

				if ( !toastArea ) {
					return;
				}

				var lastToast = toastArea.getLast();

				if ( !lastToast ) {
					return;
				}

				lastToast.remove();

				evt.cancel();
			}
		} );
	}
} );

function toast( editor, options ) {
	this.editor = editor;
	this.message = options.message;
	this.type = options.type ? options.type : 'info';
	this.progress = options.progress;
	this.id = CKEDITOR.tools.getUniqueId();
}

toast.prototype = {
	show: function() {
		var toast = this,
			progress = this.getPrecentageProgress(),
			toastElement;

		if ( !this.toastArea ) {
			this.toastArea = this.getToastArea();

			if ( !this.toastArea ) {
				this.toastArea = this.createToastArea();
			}
		}

		toastElement = CKEDITOR.dom.element.createFromHtml(
			'<div class="cke_toast ' + this.getClass() + '" id="' + this.id + '">' +
				( progress ? this.createProgressElement().getOuterHtml() : '' ) +
				'<p class="cke_toast_message">' + this.getDisplayMessage() + '</p>' +
				'<a class="cke_toast_close" href="javascript:void(0)" title="Close" role="button" tabindex="-1">' +
					'<span class="cke_label">X</span>' +
				'</a>' +
			'</div>' );

		toastElement.findOne( '.cke_toast_close' ).on( 'click', function() {
			toast.hide();
		} );

		this.toastArea.append( toastElement );

		this.layout();
	},

	getToastArea: function() {
		return this.editor.container.getDocument().findOne( '.cke_toasts_area_' + this.editor.name );
	},

	createToastArea: function() {
		var editor = this.editor,
			config = editor.config,
			toastArea = new CKEDITOR.dom.element( 'div' );

		toastArea.addClass( 'cke_toasts_area' );
		toastArea.addClass( 'cke_toasts_area_' + editor.name );
		toastArea.setStyle( 'z-index', config.baseFloatZIndex - 2 );

		CKEDITOR.document.getBody().append( toastArea );

		this.attachListeners();

		return toastArea;
	},

	attachListeners: function() {
		var win = CKEDITOR.document.getWindow(),
			toast = this,
			editor = this.editor;

		this.uiBuffer = CKEDITOR.tools.eventsBuffer( 10, this.layout, this ),
		this.changeBuffer = CKEDITOR.tools.eventsBuffer( 500, this.layout, this ),

		win.on( 'scroll', this.uiBuffer.input );
		win.on( 'resize', this.uiBuffer.input );
		editor.on( 'change', this.changeBuffer.input );
		editor.on( 'floatingSpaceLayout', toast.layout, toast, null, 20 );
		editor.on( 'blur', this.layout, toast, null, 20 );

		editor.on( 'destroy', function() {
			toast.detachListeners();
			toast.toastArea.remove();
		} );
	},

	detachListeners: function() {
		var win = CKEDITOR.document.getWindow(),
			editor = this.editor;

		win.removeListener( 'scroll', this.uiBuffer.input );
		win.removeListener( 'resize', this.uiBuffer.input );
		editor.removeListener( 'change', this.changeBuffer.input );
		editor.removeListener( 'floatingSpaceLayout', this.layout );
		editor.removeListener( 'blur', this.layout );
	},

	layout: function() {
		var toastArea = this.toastArea,
			win = CKEDITOR.document.getWindow(),
			editor = this.editor,
			scrollPosition = win.getScrollPosition(),
			contentsRect = editor.contents.getClientRect(),
			contentsPosition = editor.contents.getDocumentPosition(),
			top = editor.ui.space( 'top' ),
			topRect = top.getClientRect(),
			toastAreaRect = toastArea.getClientRect(),
			viewRect = win.getViewPaneSize(),
			toastWidth = this.toastWidth,
			toastMargin = this.toastMargin,
			element,
			cssLength = CKEDITOR.tools.cssLength;

		// Cache for optimization
		if ( !toastWidth || !toastMargin ) {
			element = this.getElement();
			toastWidth = this.toastWidth = element.getClientRect().width;
			toastMargin = this.toastMargin = parseInt( element.getComputedStyle( 'margin-left' ), 10 ) +
				parseInt( element.getComputedStyle( 'margin-right' ), 10 );
		}

		// Horizontal layout
		if ( top.isVisible() && topRect.bottom > contentsRect.top && topRect.bottom < contentsRect.bottom - toastAreaRect.height ) {
			setBelowToolbar();
		} else if ( contentsRect.top > 0 ) {
			setTopStandard();
		} else if ( contentsPosition.y + contentsRect.height - toastAreaRect.height > scrollPosition.y ) {
			setTopFixed();
		} else {
			setBottom();
		}

		function setTopStandard() {
			toastArea.setStyle( 'position', 'absolute' );
			toastArea.setStyle( 'top', cssLength( contentsPosition.y ) );
		}

		function setBelowToolbar() {
			toastArea.setStyle( 'position', 'fixed' );
			toastArea.setStyle( 'top', cssLength( topRect.bottom ) );
		}

		function setTopFixed() {
			toastArea.setStyle( 'position', 'fixed' );
			toastArea.setStyle( 'top', 0 );
		}

		function setBottom() {
			toastArea.setStyle( 'position', 'absolute' );
			toastArea.setStyle( 'top', cssLength( contentsPosition.y + contentsRect.height - toastAreaRect.height ) );
		}

		// Vertical layout
		var leftBase = toastArea.getStyle( 'position' ) == 'fixed' ? contentsRect.left : contentsPosition.x;

		if ( contentsRect.width < toastWidth + toastMargin ) {
			// Content is narrower than toast
			if ( contentsPosition.x + toastWidth + toastMargin > scrollPosition.x + viewRect.width ) {
				setRight();
			} else {
				setLeft();
			}
		} else {
			// Content is wider than toast
			if ( contentsPosition.x + toastWidth + toastMargin > scrollPosition.x + viewRect.width ) {
				setLeft();
			} else if ( contentsPosition.x + contentsRect.width / 2 + toastWidth / 2 + toastMargin > scrollPosition.x + viewRect.width ) {
				setRightFixed();
			} else if ( contentsRect.left + contentsRect.width - toastWidth - toastMargin < 0 ) {
				setRight();
			} else if ( contentsRect.left + contentsRect.width / 2 - toastWidth / 2 < 0 ) {
				setLeftFixed();
			} else {
				setCenter();
			}
		}

		function setLeft() {
			toastArea.setStyle( 'left', cssLength( leftBase ) );
		}

		function setLeftFixed() {
			toastArea.setStyle( 'left', cssLength( leftBase - contentsPosition.x + scrollPosition.x ) );
		}

		function setCenter() {
			toastArea.setStyle( 'left', cssLength( leftBase + contentsRect.width / 2 - toastWidth / 2 ) );
		}

		function setRight() {
			toastArea.setStyle( 'left', cssLength( leftBase + contentsRect.width - toastWidth - toastMargin ) );
		}

		function setRightFixed() {
			toastArea.setStyle( 'left', cssLength( leftBase - contentsPosition.x + scrollPosition.x + viewRect.width - toastWidth - toastMargin ) );
		}
	},

	getClass: function() {
		if ( this.type == 'progress' ) {
			return 'cke_toast_info';
		} else {
			return 'cke_toast_' + this.type;
		}
	},

	getPrecentageProgress: function() {
		if ( this.type == 'progress' ) {
			return Math.round( this.progress * 100 ) + '%';
		} else {
			return 0;
		}
	},

	createProgressElement: function() {
		var element = new CKEDITOR.dom.element( 'span' );
		element.addClass( 'cke_toast_progress' );
		element.setStyle( 'width', this.getPrecentageProgress() );
		return element;
	},

	getDisplayMessage: function() {
		if ( this.type == 'progress' ) {
			return this.message +  ' ' + this.getPrecentageProgress() + '... ';
		} else {
			return this.message;
		}
	},

	hide: function() {
		var element = this.getElement();

		if ( element ) {
			element.remove();
		}
	},

	update: function( options ) {
		var element = this.getElement(),
			messageElement, progressElement;

		if ( element ) {
			messageElement = element.findOne( '.cke_toast_message' );
			progressElement = element.findOne( '.cke_toast_progress' );
		}

		if ( options.type ) {
			if ( element ) {
				element.removeClass( this.getClass() );
			}

			this.type = options.type;

			if ( element ) {
				element.addClass( this.getClass() );
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
				messageElement.setHtml( this.getDisplayMessage() );
			}

			if ( options.progress ) {
				if ( progressElement ) {
					progressElement.setStyle( 'width', this.getPrecentageProgress() );
				} else if ( element && !progressElement ) {
					progressElement = this.createProgressElement();
					progressElement.insertBefore( messageElement );
				}
			}
		}

		if ( !element && options.important ) {
			this.show();
		}
	},

	getElement: function() {
		return this.editor.container.getDocument().getById( this.id );
	}
};

CKEDITOR.plugins.toast = toast;