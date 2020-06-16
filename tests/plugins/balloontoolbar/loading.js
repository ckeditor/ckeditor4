/* bender-tags: balloontoolbar */
/* bender-ckeditor-plugins: balloontoolbar */
/* bender-include: _helpers/default.js */

( function() {
	'use strict';

	bender.editor = {};

	var tests = {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'balloontoolbar' );
		},

		'test prototype overwriting': function() {
			CKEDITOR.ui.balloonToolbarView.prototype.isItOk = true;
			bender.editorBot.create( { name: 'editor1' }, function() {
				assert.isTrue( CKEDITOR.ui.balloonToolbarView.prototype.isItOk, 'prototype is overwritten' );
			} );
		}

	};

	bender.test( tests );
} )();
