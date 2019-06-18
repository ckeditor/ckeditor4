/* bender-tags: tableselection, clipboard */
/* bender-ckeditor-plugins: undo,tableselection */
/* bender-include: ../../_helpers/tableselection.js */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			config: {
				allowedContent: 'img[*]'
			}
		},
		inline: {
			creator: 'inline',
			config: {
				allowedContent: 'img[*]'
			}
		}
	};

	var tests = {
		setUp: function() {
			if ( CKEDITOR.env.ie || CKEDITOR.env.iOS ) {
				assert.ignore();
			}

			bender.tools.ignoreUnsupportedEnvironment( 'tableselection' );

			window.attack = sinon.spy();
		},

		tearDown: function() {
			delete window.attack;
		},

		'test JS code is not executed on paste': function( editor ) {
			bender.tools.setHtmlWithSelection( editor, '<p>foobar^</p>' );
			bender.tools.emulatePaste( editor, '<img src="x" onerror="window.parent.attack();">' );

			editor.once( 'afterPaste', function() {
				resume( function() {
					assert.areSame( 0, window.attack.callCount, 'Function was not invoked' );
				} );
			} );

			wait();
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	bender.test( tests );
} )();
