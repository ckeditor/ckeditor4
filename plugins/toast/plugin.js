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
}

toast.prototype = {
	show: function() {
		var container = this.editor.container,
			toastArea = container.findOne( '.cke_toasts_area' ),
			progress, message, type;

		if ( this.progress ) {
			progress = Math.round( this.progress * 100 );
			message = this.message +  ' ' + progress + '%... ';
			type = 'info';
		} else {
			progress = false,
			message = this.message,
			type = this.type;
		}

		if ( !toastArea ) {
			toastArea = new CKEDITOR.dom.element( 'div' );
			toastArea.addClass( 'cke_toasts_area' );
			container.findOne( '.cke_contents' ).append( toastArea );
		}

		toastArea.appendHtml(
			'<div class="cke_toast cke_toast_' + type + '">' +
				( progress ? '<span style="width: ' + progress + '%" class="cke_toast_progress"></span>' : '' ) +
				'<p class="cke_toast_message">' + message + '</p>' +
				'<a class="cke_toast_close" href="javascript:void(0)" title="Close" role="button">' +
					'<span class="cke_label">X</span>' +
				'</a>' +
			'</div>' );
	}
};

CKEDITOR.plugins.toast = toast;