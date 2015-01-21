/* bender-tags: editor,unit,skin */

( function() {
	'use strict';

	var caughtError = null,
		originalErrorFunc = bender.error;

	bender.error = function( e ) {
		caughtError = e;
	};

	bender.test( {
		'async:init': function() {
			var tc = this;

			bender.tools.setUpEditors( {
				editor: {
					startupData: '<p>foo</p>',
					config: {
						skin: 'skinnochameleon,%TEST_DIR%/_assets/skins/skinnochameleon/',
						uiColor: '#333888'
					}
				}
			}, function( editors ) {
				tc.editor = editors.editor;
				setTimeout( tc.callback, 0 );
			} );
		},

		'test skin with no chameleon functionality and custom uiColor': function() {
			bender.error = originalErrorFunc;

			assert.isNull( caughtError, 'An error is not thrown during editor initialisation' );
			assert.areSame( 'ready', this.editor.status, 'Editor is really ready' );
			assert.areSame( 'skinnochameleon', CKEDITOR.skin.name );
		}
	} );
}() );
