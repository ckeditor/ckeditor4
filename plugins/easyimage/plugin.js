/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	function addCommands( editor ) {
		var commandsToRefresh = [ 'easyimageFull', 'easyimageSide' ];

		function isSideImage( widget ) {
			return widget.element.hasClass( 'easyimage-side' );
		}

		function isFullImage( widget ) {
			return !isSideImage( widget );
		}

		function refreshCommands( editor, commands ) {
			CKEDITOR.tools.array.forEach( commands, function( command ) {
				editor.getCommand( command ).refresh( editor );
			} );
		}

		function createCommandRefresh( enableCheck ) {
			return function( editor ) {
				var widget = editor.widgets.focused;

				if ( widget && widget.name === 'image' ) {
					this.setState( ( enableCheck && enableCheck( widget ) ) ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF );
				} else {
					this.setState( CKEDITOR.TRISTATE_DISABLED );
				}
			};
		}

		function createCommand( exec, refreshCheck ) {
			return {
				startDisabled: true,
				contextSensitive: true,

				exec: function( editor ) {
					var widget = editor.widgets.focused;

					exec( widget );

					// We have to manually refresh commands as refresh seems
					// to be executed prior to exec.
					refreshCommands( editor, commandsToRefresh );
				},

				refresh: createCommandRefresh( refreshCheck )
			};
		}

		editor.addCommand( 'easyimageFull', createCommand( function( widget ) {
			widget.element.removeClass( 'easyimage-side' );
		}, function( widget ) {
			return isFullImage( widget );
		} ) );

		editor.addCommand( 'easyimageSide', createCommand( function( widget ) {
			widget.element.addClass( 'easyimage-side' );
		}, function( widget ) {
			return isSideImage( widget );
		} ) );

		editor.addCommand( 'easyimageAlt', new CKEDITOR.dialogCommand( 'easyimageAlt', {
			startDisabled: true,
			contextSensitive: true,
			refresh: createCommandRefresh()
		} ) );
	}

	function addMenuItems( editor ) {
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

			addCommands( editor );
			addMenuItems( editor );

			// Overwrite some image2 defaults.
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

						evt.data.easyimageFull = editor.getCommand( 'easyimageFull' ).state;
						evt.data.easyimageSide = editor.getCommand( 'easyimageSide' ).state;
						evt.data.easyimageAlt = editor.getCommand( 'easyimageAlt' ).state;
					} );
				};
			} );
		}
	} );
}() );
