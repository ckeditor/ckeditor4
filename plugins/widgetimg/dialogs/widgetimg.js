/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

'use strict';

CKEDITOR.dialog.add( 'widgetimg', function( editor ) {
	return {
		title: 'Edit image',
		minWidth: 250,
		minHeight: 100,
		contents: [
			{
				id: 'info',
				elements: [
					{
						id: 'caption',
						type: 'checkbox',
						label: 'Caption',
						'default': '',
						setup: function( element ) {
							// this.setValue( element.getAttribute( 'checked' ) );
						},
						commit: function( data ) {
							//
						}
					}
				]
			}
		]
	};
} );