/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	CKEDITOR.plugins.add( 'easyimage', {
		requires: 'image2,contextmenu,dialog',
		lang: 'en',

		onLoad: function() {
			CKEDITOR.dialog.add( 'eiAltText', this.path + 'dialogs/eiAltText.js' );
		},

		init: function( editor ) {
			editor.addCommand( 'eiFullImage', {
				exec: function() {}
			} );
			editor.addCommand( 'eiSideImage', {
				exec: function() {}
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

				// Block default image dialog.
				evt.data.dialog = null;

				evt.data.init = function() {
					oldInit.call( this );

					this.on( 'contextMenu', function( evt ) {
						// Remove "Image Properties" option.
						delete evt.data.image;

						evt.data.eiFullImage = CKEDITOR.TRISTATE_OFF;
						evt.data.eiSideImage = CKEDITOR.TRISTATE_OFF;
						evt.data.eiAltText = CKEDITOR.TRISTATE_OFF;
					} );
				};
			} );
		}
	} );
}() );
