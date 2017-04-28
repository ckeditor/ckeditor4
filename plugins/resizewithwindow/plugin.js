/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview The "resizewithwindow" plugin is an alternative to the 'resize' plugin.
 *               Managing the ckeditor height through a percentage of a window does not work.
 *               This plugin provides an alternative.
 *               
 *               The plugin 'resize' must be disabled for this plugin to work correctly.
 *               
 *               Also you need to add the following css to your css files:
 *               .cke_chrome {
 *                   padding: 0 !important;
 *               }
 *               Otherwise the height of the ckeditor content is not calculated correctly.
 *               That is a point of improvement.
 *               
 *               Currently only tested with the Kama skin.
 */

CKEDITOR.plugins.add( 'resizewithwindow', {
	init: function( editor ) {
		var baseEditorInnerGrey;
		
		editor.on( 'instanceReady', function() {
			jQuery( function() {
				jQuery( window ).resize( function() {
					resizeTriggered();
				});
				resizeTriggered();
			})
		});
		
		editor.on( 'afterCommandExec', function( ev ) {
			if (ev.data.name == 'toolbarCollapse' || ev.data.name == 'maximize' || ev.data.name == 'source') {
				resizeTriggered();
			}
		});
		
		editor.on( 'dataReady', function( ev ) {
			resizeTriggered();
		});
		
		editor.on( 'triggerResize', function( ev ) {
			resizeTriggered();
		});
		
		/**
		 * Resizes editor components that in the vertical direction that do not
		 * do so automatically.
		 */
		function resizeTriggered() {
			var maximizestate = editor.getCommand( 'maximize' ).state;
			var referencedheight = 50;
			
			if ( maximizestate == CKEDITOR.TRISTATE_ON ) {
				referencedheight = jQuery( window ).height();
			} else {
				var textarea = editor.element.$;
				var editorFrame = jQuery( textarea ).parents( "div:first" ); 
				baseEditorInnerGrey = jQuery( ".cke_inner", editorFrame );
				referencedheight = editorFrame.height();
			}
			
			var content = jQuery( ".cke_contents", baseEditorInnerGrey );
			var toolbar = jQuery( ".cke_top", baseEditorInnerGrey );
			
			// Browser quirks: this correction prevents a vertical scroll bar in the window.
			var extraheightCorrection = 8;
			if ( jQuery.browser.mozilla ) {
				extraheightCorrection = 11;
			}
			if ( jQuery.browser.webkit ) {
				extraheightCorrection = 12;
			}
			if ( jQuery.browser.msie ) {
				extraheightCorrection = 10;
			}
			baseEditorInnerGrey.height( referencedheight - extraheightCorrection );
			
			var toolbarHeight = toolbar.outerHeight( true );
			// The text area height depends on the enabling of the charcount plugin.
			// Correct the height of the text area in java script because css does not work.
			var heightCorrection = 13;
			if ( editor.config.extraPlugins.indexOf( 'wordcount' ) > -1 ) {
				var wordcount = jQuery( ".cke_bottom", baseEditorInnerGrey );
				heightCorrection = wordcount.outerHeight( true );
				// Extra height correction is needed on the content component.
				// Otherwise the characters of the wordcount component will not
				// stay within the grey (in case of the kama skin) background
				// component.
				heightCorrection += 7;
			}
			var newHeight = referencedheight - ( toolbarHeight + heightCorrection );
			content.height( newHeight + "px" );
		}
	}
});
