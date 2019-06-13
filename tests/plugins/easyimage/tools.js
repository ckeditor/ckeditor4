/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: easyimage,toolbar */

( function() {
	'use strict';

	bender.editor = true;

	var tools;

	bender.test( {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'easyimage' );
			tools = CKEDITOR.plugins.easyimage;
		},

		'test _parseSrcSet function': function() {
			var srcs = {
					100: 'https://test/100',
					243: 'https://tests/243',
					404: 'http://tests/404',
					600: 'http://tests/600'
				},
				srcset = 'https://test/100 100w, https://tests/243 243w, http://tests/404 404w, http://tests/600 600w';

			srcs[ 'default' ] = 'http://test/default';

			assert.areSame( srcset, tools._parseSrcSet( srcs ) );
		}
	} );
} )();
