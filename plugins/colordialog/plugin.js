/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.plugins.colordialog = {
	requires: 'dialog',
	// jscs:disable maximumLineLength
	lang: 'af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
	// jscs:enable maximumLineLength
	init: function( editor ) {
		var cmd = new CKEDITOR.dialogCommand( 'colordialog' );
		cmd.editorFocus = false;

		editor.addCommand( 'colordialog', cmd );

		CKEDITOR.dialog.add( 'colordialog', this.path + 'dialogs/colordialog.js' );

		/**
		 * Open up color dialog and to receive the selected color.
		 *
		 * @param {Function} callback The callback when color dialog is closed
		 * @param {String} callback.color The color value received if selected on the dialog.
		 * @param [scope] The scope in which the callback will be bound.
		 * @member CKEDITOR.editor
		 */
		editor.getColorFromDialog = function( callback, scope, options ) {
			var onClose,
				onShow,
				releaseHandlers,
				bindToDialog;

			onClose = function( evt ) {
				releaseHandlers( this );
				var color = evt.name == 'ok' ? this.getValueOf( 'picker', 'selectedColor' ) : null;

				if ( color && !CKEDITOR.tools._isValidColorFormat( color ) ) {
					color = null;
				}

				// Adding `#` character to hexadecimal 3 or 6 digit numbers to have proper color value (#565).
				if ( /^[0-9a-f]{3}([0-9a-f]{3})?$/i.test( color ) ) {
					color = '#' + color;
				}

				callback.call( scope, color );
			};
			onShow = function( evt ) {
				if ( options ) {
					evt.data = options;
				}
			};

			releaseHandlers = function( dialog ) {
				dialog.removeListener( 'ok', onClose );
				dialog.removeListener( 'cancel', onClose );
				dialog.removeListener( 'show', onShow );
			};
			bindToDialog = function( dialog ) {
				dialog.on( 'ok', onClose );
				dialog.on( 'cancel', onClose );
				// Priority is set here to pass the data before actually displaying the dialog.
				dialog.on( 'show', onShow, null, null, 5 );
			};

			editor.execCommand( 'colordialog' );

			if ( editor._.storedDialogs && editor._.storedDialogs.colordialog ) {
				bindToDialog( editor._.storedDialogs.colordialog );
			} else {
				CKEDITOR.on( 'dialogDefinition', function( e ) {
					if ( e.data.name != 'colordialog' ) {
						return;
					}
					var definition = e.data.definition;

					e.removeListener();
					definition.onLoad = CKEDITOR.tools.override( definition.onLoad,
						function( orginal ) {
							return function() {
								bindToDialog( this );
								definition.onLoad = orginal;
								if ( typeof orginal == 'function' ) {
									orginal.call( this );
								}
							};
						} );
				} );
			}
		};
	}
};

CKEDITOR.plugins.add( 'colordialog', CKEDITOR.plugins.colordialog );
