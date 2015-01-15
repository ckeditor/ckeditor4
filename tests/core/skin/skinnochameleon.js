/* bender-tags: editor,unit,skin */

( function(){
	'use strict';

	var error = null;

	var origErrorFunc = bender.error;
	bender.error = function( e ) {
		error = e;
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
			}, function ( e ) {
				tc.editor = e.editor;
				setTimeout( tc.callback, 0 );
			} );
		},

		'test skin with no chameleon functionality and custom uiColor': function() {
			// If we are here, it means that there are no errors, so everything is fine.
			assert.isNull( error );

			bender.error = origErrorFunc;

			assert.areSame( 'ready', this.editor.status );
			assert.areSame( 'skinnochameleon', CKEDITOR.skin );
		}

	} );

}() );
