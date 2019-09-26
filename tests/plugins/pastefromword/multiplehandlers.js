/* bender-tags: editor,clipboard */
/* bender-ckeditor-plugins: pastetools, pastefromword */
/* bender-include: generated/_helpers/pfwTools.js, ../pastetools/_helpers/ptTools.js */
/* global ptTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			pasteFromWordCleanupFile: '%TEST_DIR%_assets/customfilter.js',

			on: {
				pluginsLoaded: function( evt ) {
					evt.editor.pasteTools.register( {
						canHandle: function() {
							return true;
						},

						handle: function( evt ) {
							evt.data.dataValue = 'nope';
						}
					} );
				}
			}
		}
	};

	var tests = {
		'test allowing subsequent handlers when Word content is pasted': function() {
			var editor = this.editor;

			editor.once( 'paste', function( evt ) {
				resume( function() {
					assert.areSame( 'nope', evt.data.dataValue, 'Transformed content' );
				} );
			}, null, null, 999 );

			editor.fire( 'paste', {
				type: 'auto',
				dataValue: '<html><head><meta name=Generator content="Microsoft Word 15"></head><body><p>foo <strong>bar</strong></p></body></html>',
				method: 'paste'
			} );

			wait();
		}
	};

	ptTools.ignoreTestsOnMobiles( tests );

	bender.test( tests );
} )();
