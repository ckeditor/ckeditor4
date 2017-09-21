/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	function isSideImage( widget ) {
		return widget.element.hasClass( 'easyimage-side' );
	}

	function isFullImage( widget ) {
		return !isSideImage( widget );
	}

	var stylesLoaded = false;

	CKEDITOR.plugins.add( 'easyimage', {
		requires: 'image2,contextmenu,dialog',
		lang: 'en',

		onLoad: function() {
			CKEDITOR.dialog.add( 'easyimageAlt', this.path + 'dialogs/easyimagealt.js' );
		},

		init: function( editor ) {
			if ( !stylesLoaded ) {
				CKEDITOR.document.appendStyleSheet( this.path + 'styles/easyimage.css' );
				stylesLoaded = true;
			}

			if ( editor.addContentsCss ) {
				editor.addContentsCss( this.path + 'styles/easyimage.css' );
			}

			editor.addCommand( 'easyimageFull', {
				exec: function() {
					var widget = editor.widgets.focused;

					widget.element.removeClass( 'easyimage-side' );
				}
			} );

			editor.addCommand( 'easyimageSide', {
				exec: function() {
					var widget = editor.widgets.focused;

					widget.element.addClass( 'easyimage-side' );
				}
			} );

			editor.addCommand( 'easyimageAlt', new CKEDITOR.dialogCommand( 'easyimageAlt' ) );

			editor.addMenuGroup( 'easyimage' );
			editor.addMenuItems( {
				easyimageFull: {
					label: editor.lang.easyimage.commands.fullImage,
					command: 'easyimageFull',
					group: 'easyimage',
					order: 1
				},

				easyimageSide: {
					label: editor.lang.easyimage.commands.sideImage,
					command: 'easyimageSide',
					group: 'easyimage',
					order: 2
				},

				easyimageAlt: {
					label: editor.lang.easyimage.commands.altText,
					command: 'easyimageAlt',
					group: 'easyimage',
					order: 3
				}
			} );

			// Overwrite some image2 defaults
			editor.on( 'widgetDefinition', function( evt ) {
				var oldInit = evt.data.init;

				if ( evt.data.name !== 'image' ) {
					return;
				}

				evt.data.allowedContent.figure.classes += ',!easyimage,easyimage-side';

				// Block default image dialog.
				evt.data.dialog = null;

				evt.data.init = function() {
					oldInit.call( this );

					this.on( 'contextMenu', function( evt ) {
						// Remove "Image Properties" option.
						delete evt.data.image;

						evt.data.easyimageFull = isFullImage( this ) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF;
						evt.data.easyimageSide = isSideImage( this ) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF;
						evt.data.easyimageAlt = CKEDITOR.TRISTATE_OFF;
					} );
				};
			} );
		}
	} );
}() );
