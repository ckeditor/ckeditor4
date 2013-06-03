/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

'use strict';

CKEDITOR.plugins.add( 'widgettime', {
	requires: 'widget',
	icons: 'widgettime',

	init: function( editor ) {
		editor.widgets.add( 'time', {
			inline: true,

			init: function() {
			},

			upcasts: {
				// Upcast all time elements.
				time: function( el ) {
					return el.name == 'time';
				}
			},

			downcasts: {
				// Downcast to normal time element, without data-widget attribute.
				time: function( el ) {
					delete el.attributes[ 'data-widget' ];
					delete el.attributes[ 'data-widget-data' ];
					return el;
				}
			}
		} );
	}
} );