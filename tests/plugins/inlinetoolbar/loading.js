/* bender-tags: inlinetoolbar */
/* bender-ckeditor-plugins: inlinetoolbar */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		'test prototype overwriting': function() {
			CKEDITOR.ui.balloonToolbarView.prototype.isItOk = true;
			bender.editorBot.create( { name: 'editor1' }, function() {
				assert.isTrue( CKEDITOR.ui.balloonToolbarView.prototype.isItOk, 'prototype is overwritten' );
			} );
		}

	} );
} )();
