/* bender-tags: balloontoolbar */
/* bender-ckeditor-plugins: toolbar,balloontoolbar,basicstyles */
/* bender-include: ./_helpers/default.js */
/* global stubAppendStyleSheet */

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

	// We need to set up skin at the very beginning before loading files.
	CKEDITOR.skinName = 'moono';
	var stub = stubAppendStyleSheet();
	CKEDITOR.once( 'instanceReady', stub.restore );

	var tests = {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'balloontoolbar' );
		},

		'test check default.css file usage when skin miss adequate css': function( editor ) {
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 11 ) {
				assert.ignore();
			}
			var panel = new CKEDITOR.ui.balloonToolbar( editor );
			panel.addItems( {
				bold: new CKEDITOR.ui.button( {
					label: 'test',
					command: 'bold'
				} )
			} );
			panel.attach( editor.editable().findOne( 'p' ) );
			assert.areSame( 'background-color:#f8f8f8;', CKEDITOR.tools.normalizeCssText( 'background-color:' + panel._view.parts.panel.getComputedStyle( 'background-color' ) + ';' ),
				'Default skin background color is incorrect.' );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );
	bender.test( tests );
} )();
