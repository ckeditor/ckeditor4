/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.add( 'toast', {
	init: function( editor ) {
		editor.makeToast = function( message, type, durationOrProgress ) {
			var duration, progress;

			if ( type == 'progress' ) {
				progress = durationOrProgress;
			} else {
				duration = durationOrProgress;
			}

			var toast = new CKEDITOR.plugins.toast( editor, {
				message: message,
				type: type,
				duration: duration,
				progress: progress
			} );

			toast.show();

			return toast;
		};
	}
} );

CKEDITOR.DURATION_LONG = 5000;
CKEDITOR.DURATION_SHORT = 2000;

function toast( editor, options ) {
	this.editor = editor;
	this.message = options.message;
	this.type = options.type;
	this.duration = options.duration;
	this.progress = options.progress;
	this.id = CKEDITOR.tools.getUniqueId();
}

toast.prototype = {
	show: function() {
		var toast = this,
			container = this.editor.container,
			toastArea = container.findOne( '.cke_toasts_area' ),
			progress = this.getPrecentageProgress(),
			toastElement;

		if ( !toastArea ) {
			toastArea = new CKEDITOR.dom.element( 'div' );
			toastArea.addClass( 'cke_toasts_area' );
			container.findOne( '.cke_contents' ).append( toastArea );
		}

		toastElement = CKEDITOR.dom.element.createFromHtml(
			'<div class="cke_toast ' + this.getClass() + '" id="' + this.id + '">' +
				( progress ? this.createProgressElement().getOuterHtml() : '' ) +
				'<p class="cke_toast_message">' + this.getDisplayMessage() + '</p>' +
				'<a class="cke_toast_close" href="javascript:void(0)" title="Close" role="button">' +
					'<span class="cke_label">X</span>' +
				'</a>' +
			'</div>' );

		toastElement.findOne( '.cke_toast_close' ).on( 'click', function() {
			toast.hide();
		} );

		toastArea.append( toastElement );
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