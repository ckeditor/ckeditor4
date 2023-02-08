/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* global alert */

CKEDITOR.dialog.add( 'embedBase', function( editor ) {
	'use strict';

	var lang = editor.lang.embedbase;

	return {
		title: lang.title,
		minWidth: 350,
		minHeight: 50,

		onLoad: function() {
			var that = this,
				loadContentRequest = null;

			this.on( 'ok', function( evt ) {
				// We're going to hide it manually, after remote response is fetched.
				evt.data.hide = false;

				// We don't want the widget system to finalize widget insertion (it happens with priority 20).
				evt.stop();

				// Indicate visually that waiting for the response (https://dev.ckeditor.com/ticket/13213).
				that.setState( CKEDITOR.DIALOG_STATE_BUSY );

				var url = that.getValueOf( 'info', 'url' ),
					widget = that.getModel( editor );

				loadContentRequest = widget.loadContent( url, {
					noNotifications: true,

					callback: function() {
						if ( !widget.isReady() ) {
							editor.widgets.finalizeCreation( widget.wrapper.getParent( true ) );
						}

						editor.fire( 'saveSnapshot' );

						that.hide();
						unlock();
					},

					errorCallback: function( messageTypeOrMessage ) {
						that.getContentElement( 'info', 'url' ).select();

						alert( widget.getErrorMessage( messageTypeOrMessage, url, 'Given' ) );

						unlock();
					}
				} );
			}, null, null, 15 );

			this.on( 'cancel', function( evt ) {
				if ( evt.data.hide && loadContentRequest ) {
					loadContentRequest.cancel();
					unlock();
				}
			} );

			function unlock() {
				// Visual waiting indicator is no longer needed (https://dev.ckeditor.com/ticket/13213).
				that.setState( CKEDITOR.DIALOG_STATE_IDLE );
				loadContentRequest = null;
			}
		},

		contents: [
			{
				id: 'info',

				elements: [
					{
						type: 'text',
						id: 'url',
						label: editor.lang.common.url,
						required: true,

						setup: function( widget ) {
							this.setValue( widget.data.url );
						},

						validate: function() {
							var widget = this.getDialog().getModel( editor );

							if ( !widget.isUrlValid( this.getValue() ) ) {
								return lang.unsupportedUrlGiven;
							}

							return true;
						}
					}
				]
			}
		]
	};
} );
