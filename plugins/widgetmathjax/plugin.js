/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

'use strict';

CKEDITOR.plugins.add( 'widgetmathjax', {
	// Require the "widget" plugin, which provides the Widget System and its API.
	requires: 'widget,dialog',

	// Let CKEditor know about the plugin icon.
	icons: 'widgetmathjax',

	onLoad: function() {
	},

	init: function( editor ) {
		editor.widgets.add( 'mathjax', {
			// This is an "inline" widget. It defaults to "block".
			inline: true,

			// We have a dialog to edit this widget, so here we set its name.
			dialog: 'widgetmathjax',

			// Let the Widget System create the toolbar button automatically.
			button: 'MathJax',

			// The HTML template used for new widgets creation.
			template: '<script type="math/tex">{text}</script>',

			allowedContent: 'script[!type]',

			// The default data used to fill the above template.
			defaults: function() {
				return {
					dateTime: ( new Date() )[ Date.prototype.toISOString ? 'toISOString' : 'toUTCString' ](),
					text: ( new Date() ).toDateString()
				};
			},

			// Initialization code, called for each widget instance created.
			init: function() {
				// Take the widget data out of the DOM.
				this.setData( {
					dateTime: this.element.getAttribute( 'datetime' ),
					text: this.element.getText()
				} );
			},

			// Called whenever changes to the widget data happens.
			data: function() {
				// Transport the data changes to the DOM.
				this.element.setAttribute( 'datetime', this.data.dateTime );
				this.element.setText( this.data.text );
			},

			// Check the elements that need to be converted to widgets.
			upcast: function( el ) {
				//console.log( el.name );
				return el.name == 'script';
			}
		} );

		// Register the editing dialog.
		CKEDITOR.dialog.add( 'widgetmathjax', this.path + 'dialogs/widgetmathjax.js' );
	}
} );