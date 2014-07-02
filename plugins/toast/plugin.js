/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.add( 'toast', {
	init: function( editor ) {

	}
} );

CKEDITOR.plugins.toast = {
	make: function() {

	}
}

CKEDITOR.DURATION_LONG = 3000;
CKEDITOR.DURATION_SHORT = 700;

var toast = CKEDITOR.plugins.toast.make( {
	title: 'Text',
	message: 'Text',
	progress: '0.23',
	type: CKEDITOR.DURATION_LONG,
	icon: 'http://someicon.',
	duration: 100
} );

var warning = CKEDITOR.plugins.toast.makeWarning( {
	title: 'Text',
	message: 'Text',
	progress: '0.23',
	type: INFO,
	icon: FILE,
	duration: 100 } );

toast.update( {
	message: 'Text 2',
	important: true
} );

toast.hide();