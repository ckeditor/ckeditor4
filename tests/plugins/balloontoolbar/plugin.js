/* bender-tags: balloontoolbar, 1346, context */
/* bender-include: _helpers/default.js */
/* global ignoreUnsupportedEnvironment */

( function() {
	'use strict';

	bender.editor = {};

	var tests = {
		'test context api is available in plugin.init()': function() {
			CKEDITOR.plugins.add( 'testplugin', {
				requires: 'balloontoolbar',
				init: function( editor ) {
					assert.isNotUndefined( editor.balloonToolbars );
				}
			} );

			bender.editorBot.create(
			{ name: 'editor2', config: { extraPlugins: 'testplugin' } }, function noop(  ) {} );
		}
	};

	ignoreUnsupportedEnvironment( tests );
	bender.test( tests );
} )();
