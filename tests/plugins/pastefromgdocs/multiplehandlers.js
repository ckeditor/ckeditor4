/* bender-tags: editor,clipboard */
/* bender-ckeditor-plugins: pastetools, pastefromgdocs */

( function() {
	'use strict';

	// Ignored due to lack of support for mobiles (#3451).
	if ( bender.tools.env.mobile ) {
		bender.ignore();
	}

	bender.editor = {
		config: {
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
		'test allowing subsequent handlers when GDocs content is pasted': function() {
			var editor = this.editor;

			editor.once( 'paste', function( evt ) {
				resume( function() {
					assert.areSame( 'nope', evt.data.dataValue, 'Transformed content' );
				} );
			}, null, null, 999 );

			editor.fire( 'paste', {
				type: 'auto',
				dataValue: '<b id="docs-internal-guid-1">foo <strong>bar</strong></b>',
				method: 'paste'
			} );

			wait();
		}
	};

	bender.test( tests );
} )();
