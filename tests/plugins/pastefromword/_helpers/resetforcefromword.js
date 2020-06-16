/* global simulatePasteCommand */
/* exported testScenario */

'use strict';

// Scenario is a sequence (array) of pasted to be fired. True (1) means paste from word, false (0) means regular paste.
function testScenario( scenario, filterPath ) {
	bender.editor = {
		config: {
			pasteFromWordCleanupFile: filterPath
		}
	};

	var tests = {
		// https://dev.ckeditor.com/ticket/10032
		'test reset forceFromWord': function() {
			var editor = this.editor,
				pasteHtml = '<p>foo</p>',
				i = 0;

			firePaste( editor, scenario[ i ] );

			function onPaste( evt ) {
				assertPaste( evt.data.dataValue, scenario[ i ], i );

				if ( i == scenario.length ) {
					return;
				}

				i++;

				firePaste( editor, scenario[ i ] );
			}

			function firePaste( editor, fromWord ) {
				simulatePasteCommand( editor, { name: fromWord ? 'pastefromword' : 'paste' }, { dataValue: pasteHtml }, onPaste );
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
	};

	return tests;
}
