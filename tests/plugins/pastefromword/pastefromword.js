/* bender-tags: editor,unit,clipboard */
/* bender-ckeditor-plugins: pastefromword */

( function() {
	'use strict';

	bender.editor = true;

	var stub;

	bender.test( {
		tearDown: function() {
			if ( stub ) {
				stub.restore();
				stub = null;
			}
		},

		'test whether default filter is loaded': function() {
			var editor = this.editor;

			editor.once( 'paste', function( evt ) {
				resume( function() {
					assert.areSame( '<p>text <strong>text</strong></p>', evt.data.dataValue, 'Basic filter was applied' );
				} );
			}, null, null, 999 );

			editor.fire( 'paste', {
				type: 'auto',
				// This data will be recognized as pasted from Word.
				dataValue: '<p>text <strong class="MsoNormal">text</strong></p>'
			} );

			wait();
		},

		// #10032
		'test reset forceFromWord': function() {
			var editor = this.editor;

			stub = sinon.stub( editor, 'getClipboardData', function( options, callback ) {
				if ( callback ) {
					callback( { dataValue: '<p><span style="font-family:arial">foo</span></p>' } );
				}
			} );

			editor.once( 'paste', firstPaste, null, null, 999 );

			editor.execCommand( 'pastefromword' );

			wait();

			function firstPaste( evt ) {
				resume( function() {
					assert.areSame( '<p>foo</p>', evt.data.dataValue, 'First paste should be from word.' );

					editor.once( 'paste', secondPaste, null, null, 999 );

					editor.fire( 'paste', {
						dataValue: '<p><span style="font-family:arial">foo</span></p>'
					} );

					wait();
				} );
			}

			function secondPaste( evt ) {
				resume( function() {
					assert.areSame( '<p><span style="font-family:arial">foo</span></p>',
						evt.data.dataValue, 'Second paste should NOT be from word.' );
				} );
			}
		}
	} );

} )();