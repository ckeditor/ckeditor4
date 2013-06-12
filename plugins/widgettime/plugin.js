/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

'use strict';

CKEDITOR.plugins.add( 'widgettime', {
	// Require the "widget" plugin, which provides the Widget System and its API.
	requires: 'widget,dialog',

	// Let CKEditor know about the plugin icon.
	icons: 'widgettime',

	onLoad: function() {
		// Styles used for widget editing. Do this "onLoad" because it should be
		// executed just once on plugin loading, not for each editor instance.
		CKEDITOR.addCss(
			'time {' +
				'background: rgba(0,0,0,0.1);' +
				'border-radius: 2px;' +
				'padding: 1px;' +
			'}' );
	},

	init: function( editor ) {
		// Register the widget with a unique name "time".
		editor.widgets.add( 'time', {
			// This is an "inline" widget. It defaults to "block".
			inline: true,

			// We have a dialog to edit this widget, so here we set its name.
			dialog: 'widgettime',

			// Let the Widget System create the toolbar button automatically.
			button: 'Time',

			// The HTML template used for new widgets creation.
			template: '<time datetime="{dateTime}">{text}</time>',

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
				// Convert all <time> elements.
				return el.name == 'time';
			}
		} );

		// Register the editing dialog.
		CKEDITOR.dialog.add( 'widgettime', this.path + 'dialogs/widgettime.js' );
	}
} );