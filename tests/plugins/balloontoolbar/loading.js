/* bender-tags: balloontoolbar */
/* bender-ckeditor-plugins: balloontoolbar */
/* bender-include: _helpers/default.js */
/* global ignoreUnsupportedEnvironment */

( function() {
	'use strict';

	bender.editor = {};

	var tests = {
		'test prototype overwriting': function() {
			CKEDITOR.ui.balloonToolbarView.prototype.isItOk = true;
			bender.editorBot.create( { name: 'editor1' }, function() {
				assert.isTrue( CKEDITOR.ui.balloonToolbarView.prototype.isItOk, 'prototype is overwritten' );
			} );
		}

	};

	ignoreUnsupportedEnvironment( tests );
	bender.test( tests );
} )();
