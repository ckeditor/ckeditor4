/* bender-tags: editor, balloontoolbar, 1346 */
/* bender-include: _helpers/default.js */
/* bender-ckeditor-plugins: balloontoolbar */

( function() {
	'use strict';

	var tests = {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'balloontoolbar' );
		},
		'test context api is available in plugin.init()': function() {
			CKEDITOR.plugins.add( 'testplugin', {
				requires: 'balloontoolbar',
				init: function( editor ) {
					assert.isNotUndefined( editor.balloonToolbars );
				}
			} );

			bender.editorBot.create( { name: 'editor2', config: { extraPlugins: 'testplugin' } }, function() {} );
		}
	};

	bender.test( tests );
} )();
