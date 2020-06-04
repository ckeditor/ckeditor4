/* bender-tags: editor,skin */

( function() {
	'use strict';

	var caughtError = null,
		originalErrorFunc = bender.error;

	bender.error = function( e ) {
		caughtError = e;
	};

	bender.editors = {
		editor: {
			startupData: '<p>foo</p>',
			config: {
				skin: 'skinnochameleon,%TEST_DIR%/_assets/skins/skinnochameleon/',
				uiColor: '#333888'
			}
		}
	};

	bender.test( {
		'test skin with no chameleon functionality and custom uiColor': function() {
			bender.error = originalErrorFunc;

			assert.isNull( caughtError, 'An error is not thrown during editor initialisation' );
			assert.areSame( 'ready', this.editors.editor.status, 'Editor is really ready' );
			assert.areSame( 'skinnochameleon', CKEDITOR.skin.name );
		}
	} );
}() );
