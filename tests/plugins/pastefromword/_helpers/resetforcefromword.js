/* exported testScenario */

'use strict';

// Scenario is a sequence (array) of pasted to be fired. True (1) means paste from word, false (0) means regular paste.
function testScenario( scenario, filterPath ) {
	bender.editor = {
		config: {
			pasteFromWordCleanupFile: filterPath
		}
	};

	var stub;

	bender.test( {
		tearDown: function() {
			if ( stub ) {
				stub.restore();
				stub = null;
			}
		},

		// #10032
		'test reset forceFromWord': function() {
			var editor = this.editor,
				pasteHtml = '<p>foo</p>',
				i = 0;


			stub = sinon.stub( editor, 'getClipboardData', function( options, callback ) {
				if ( callback ) {
					callback( { dataValue: pasteHtml } );
				}
			} );

			editor.once( 'paste', paste, null, null, 999 );

			firePaste( editor, scenario[ i ] );

			wait();

			function paste( evt ) {
				resume( function() {
					assertPaste( evt.data.dataValue, scenario[ i ], i );

					if ( i == scenario.length ) {
						return;
					}

					editor.once( 'paste', paste, null, null, 999 );

					i++;

					firePaste( editor, scenario[ i ] );

					wait();
				} );
			}

			function firePaste( editor, fromWord ) {
				if ( fromWord ) {
					editor.execCommand( 'pastefromword' );
				} else {
					editor.fire( 'paste', { dataValue: pasteHtml } );
				}
			}

			function assertPaste( value, fromWord, index ) {
				var expectedFromWord = 'ok',
					expectedNotFromWord = '<p>foo</p>';

				if ( fromWord ) {
					assert.areSame( expectedFromWord, value, 'Paste nr ' + index + ' should be from word.' );
				} else {
					assert.areSame( expectedNotFromWord, value, 'Paste nr ' + index + ' should NOT be from word.' );
				}
			}
		}
	} );
}