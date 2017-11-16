/* bender-tags: inlinetoolbar */
/* bender-ckeditor-plugins: toolbar,inlinetoolbar,basicstyles */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			name: 'editor1',
			creator: 'replace',
			startupData: '<p>Hello World</p>',
			config: {
				skin: 'moono'
			}
		},
		divarea: {
			name: 'divarea',
			creator: 'replace',
			startupData: '<p>Hello World</p>',
			config: {
				skin: 'moono',
				extraPlugins: 'divarea'
			}
		},
		inline: {
			name: 'inline',
			creator: 'inline',
			startupData: '<p>Hello World</p>',
			config: {
				skin: 'moono'
			}
		}
	};

	// We need to set up skin at the very beginning befor files start to load.
	CKEDITOR.skinName = 'moono';

	var tests = {
		'test check moono skin usage': function( editor ) {
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 11 ) {
				assert.ignore();
			}

			var panel = new CKEDITOR.ui.inlineToolbar( editor );
			panel.addItems( {
				bold: new CKEDITOR.ui.button( {
					label: 'test',
					command: 'bold'
				} )
			} );
			panel.attach( editor.editable().findOne( 'p' ) );
			// IE use cke_reset styles, that' why there is transparent.
			assert.areSame( CKEDITOR.env.ie ? 'background-color:transparent;' : 'background-color:#000000;',
				CKEDITOR.tools.normalizeCssText( 'background-color:' + panel._view.parts.panel.getComputedStyle( 'background-color' ) + ';' ),
				'Background color is incorrect.' );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );
	bender.test( tests );
} )();
