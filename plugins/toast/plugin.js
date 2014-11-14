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
			toastArea = getToastArea(),
			progress = this.getPrecentageProgress(),
			toastElement;

		if ( !toastArea ) {
			toastArea = createToastArea();
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

		toastArea.append( toastElement );

		function getToastArea() {
			return toast.editor.container.getDocument().findOne( '.cke_toasts_area_' + toast.editor.name );
		}

		function createToastArea() {
			var editor = this.editor,
				config = editor.config,
				contents = editor.contents,
				win = CKEDITOR.document.getWindow(),

				// Use event buffers to reduce CPU load when tons of events are fired.
				uiBuffer = CKEDITOR.tools.eventsBuffer( 100, layout ),
				changeBuffer = CKEDITOR.tools.eventsBuffer( 500, layout ),

				documentPosition = contents.getDocumentPosition(),
				cssLength = CKEDITOR.tools.cssLength,

				toastArea = new CKEDITOR.dom.element( 'div' );

			toastArea.addClass( 'cke_toasts_area' );
			toastArea.addClass( 'cke_toasts_area_' + editor.name );

			toastArea.setStyle( 'z-index', config.baseFloatZIndex );
			toastArea.setStyle( 'left', cssLength( documentPosition.x ) );
			toastArea.setStyle( 'top', cssLength( documentPosition.y ) );

			toastArea.insertAfter( contents );

			win.on( 'scroll', uiBuffer.input );
			win.on( 'resize', uiBuffer.input );
			editor.on( 'change', changeBuffer.input );

			editor.on( 'destroy', function() {
				win.removeListener( 'scroll', uiBuffer.input );
				win.removeListener( 'resize', uiBuffer.input );
				toastArea.remove();
			} );

			function layout() {
			}

			return toastArea;
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