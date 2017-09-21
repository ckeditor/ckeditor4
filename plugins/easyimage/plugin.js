/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	function isSideImage( widget ) {
		return widget.element.hasClass( 'easyimage--side' );
	}

	function isFullImage( widget ) {
		return !isSideImage( widget );
	}

	var stylesLoaded = false;

	CKEDITOR.plugins.add( 'easyimage', {
		requires: 'image2,contextmenu,dialog',
		lang: 'en',

		onLoad: function() {
			CKEDITOR.dialog.add( 'eiAltText', this.path + 'dialogs/eiAltText.js' );
		},

		init: function( editor ) {
			if ( !stylesLoaded ) {
				CKEDITOR.document.appendStyleSheet( this.path + 'styles/easyimage.css' );
				stylesLoaded = true;
			}

			if ( editor.addContentsCss ) {
				editor.addContentsCss( this.path + 'styles/easyimage.css' );
			}

			editor.addCommand( 'eiFullImage', {
				exec: function() {
					var widget = editor.widgets.focused;

					widget.element.removeClass( 'easyimage--side' );
				}
			} );

			editor.addCommand( 'eiSideImage', {
				exec: function() {
					var widget = editor.widgets.focused;

					widget.element.addClass( 'easyimage--side' );
				}
			} );

			editor.addCommand( 'eiAltText', new CKEDITOR.dialogCommand( 'eiAltText' ) );

			editor.addMenuGroup( 'easyimage' );
			editor.addMenuItems( {
				eiFullImage: {
					label: editor.lang.easyimage.commands.fullImage,
					command: 'eiFullImage',
					group: 'easyimage',
					order: 1
				},

				eiSideImage: {
					label: editor.lang.easyimage.commands.sideImage,
					command: 'eiSideImage',
					group: 'easyimage',
					order: 2
				},

				eiAltText: {
					label: editor.lang.easyimage.commands.altText,
					command: 'eiAltText',
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

				evt.data.allowedContent.figure.classes += ',!easyimage,easyimage--side';

				// Block default image dialog.
				evt.data.dialog = null;

				evt.data.init = function() {
					oldInit.call( this );

					this.on( 'contextMenu', function( evt ) {
						// Remove "Image Properties" option.
						delete evt.data.image;

						evt.data.eiFullImage = isFullImage( this ) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF;
						evt.data.eiSideImage = isSideImage( this ) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF;
						evt.data.eiAltText = CKEDITOR.TRISTATE_OFF;
					} );
				};
			} );
		}
	} );
}() );
