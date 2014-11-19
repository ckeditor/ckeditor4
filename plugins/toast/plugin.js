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
				var toastArea = editor.container.getDocument().getById( 'cke_toasts_area_' + editor.name );

				if ( !toastArea ) {
					return;
				}

				var element = toastArea.getLast();

				if ( !element ) {
					return;
				}

				var toast = CKEDITOR.plugins.toast.getByElement( element );

				toast.hide();

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
				'<p class="cke_toast_message">' + this.message + '</p>' +
				'<a class="cke_toast_close" href="javascript:void(0)" title="Close" role="button" tabindex="-1">' +
					'<span class="cke_label">X</span>' +
				'</a>' +
			'</div>' );

		toastElement.findOne( '.cke_toast_close' ).on( 'click', function() {
			toast.hide();
		} );

		this.toastArea.append( toastElement );

		CKEDITOR.plugins.toast.repository[ this.id ] = this;

		this.layout();
	},

	getToastArea: function() {
		return this.editor.container.getDocument().getById( 'cke_toasts_area_' + this.editor.name );
	},

	createToastArea: function() {
		var editor = this.editor,
			config = editor.config,
			toastArea = new CKEDITOR.dom.element( 'div' );

		toastArea.addClass( 'cke_toasts_area' );
		toastArea.setAttribute( 'id', 'cke_toasts_area_' + editor.name );
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
			if ( toast.toastArea ) {
				toast.toastArea.remove();
			}
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
			scrollPos = win.getScrollPosition(),
			contentsRect = editor.contents.getClientRect(),
			contentsPos = editor.contents.getDocumentPosition(),
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
		} else if ( contentsPos.y + contentsRect.height - toastAreaRect.height > scrollPos.y ) {
			setTopFixed();
		} else {
			setBottom();
		}

		function setTopStandard() {
			toastArea.setStyle( 'position', 'absolute' );
			toastArea.setStyle( 'top', cssLength( contentsPos.y ) );
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
			toastArea.setStyle( 'top', cssLength( contentsPos.y + contentsRect.height - toastAreaRect.height ) );
		}

		// Vertical layout
		var leftBase = toastArea.getStyle( 'position' ) == 'fixed' ? contentsRect.left : contentsPos.x;

		if ( contentsRect.width < toastWidth + toastMargin ) {
			// Content is narrower than toast
			if ( contentsPos.x + toastWidth + toastMargin > scrollPos.x + viewRect.width ) {
				setRight();
			} else {
				setLeft();
			}
		} else {
			// Content is wider than toast
			if ( contentsPos.x + toastWidth + toastMargin > scrollPos.x + viewRect.width ) {
				setLeft();
			} else if ( contentsPos.x + contentsRect.width / 2 + toastWidth / 2 + toastMargin > scrollPos.x + viewRect.width ) {
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
			toastArea.setStyle( 'left', cssLength( leftBase - contentsPos.x + scrollPos.x ) );
		}

		function setCenter() {
			toastArea.setStyle( 'left', cssLength( leftBase + contentsRect.width / 2 - toastWidth / 2 ) );
		}

		function setRight() {
			toastArea.setStyle( 'left', cssLength( leftBase + contentsRect.width - toastWidth - toastMargin ) );
		}

		function setRightFixed() {
			toastArea.setStyle( 'left', cssLength( leftBase - contentsPos.x + scrollPos.x + viewRect.width - toastWidth - toastMargin ) );
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

	hide: function() {
		var element = this.getElement();

		if ( element ) {
			element.remove();
		}

		if ( this.toastArea && !this.toastArea.getChildCount() ) {
			this.detachListeners();
			this.toastArea.remove();
			this.toastArea = null;
		}

		delete CKEDITOR.plugins.toast.repository[ this.id ];
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
				messageElement.setHtml( this.message );
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
CKEDITOR.plugins.toast.repository = {};

CKEDITOR.plugins.toast.getByElement = function( element ) {
	return CKEDITOR.plugins.toast.repository[ element.getId() ];
};