/* bender-tags: editor */

( function() {
	'use strict';

	bender.editor = {
		config: {
			language: 'en'
		}
	};

	bender.test( {
		'test keystrokeToString': function() {
			var tests = [
				[ CKEDITOR.CTRL + 65 /*A*/, 'Ctrl+A', '⌘+A', 'Ctrl+A', 'Command+A' ],
				[ CKEDITOR.ALT + 66 /*B*/, 'Alt+B', '⌥+B', 'Alt+B', 'Alt+B' ],
				[ CKEDITOR.SHIFT + 67 /*C*/, 'Shift+C', '⇧+C', 'Shift+C', 'Shift+C' ],
				[ CKEDITOR.CTRL + CKEDITOR.ALT + 68 /*D*/, 'Ctrl+Alt+D', '⌘+⌥+D', 'Ctrl+Alt+D', 'Command+Alt+D' ],
				[ CKEDITOR.CTRL + CKEDITOR.SHIFT + 69 /*E*/, 'Ctrl+Shift+E', '⌘+⇧+E', 'Ctrl+Shift+E', 'Command+Shift+E' ],
				[ CKEDITOR.ALT + CKEDITOR.SHIFT + 70 /*F*/, 'Alt+Shift+F', '⌥+⇧+F', 'Alt+Shift+F', 'Alt+Shift+F' ],
				[ CKEDITOR.CTRL + CKEDITOR.ALT + CKEDITOR.SHIFT + 71 /*G*/, 'Ctrl+Alt+Shift+G', '⌘+⌥+⇧+G', 'Ctrl+Alt+Shift+G', 'Command+Alt+Shift+G' ],
				[ CKEDITOR.CTRL + 32 /*SPACE*/, 'Ctrl+Space', '⌘+Space', 'Ctrl+Space', 'Command+Space' ],
				[ CKEDITOR.ALT + 13 /*ENTER*/, 'Alt+Enter', '⌥+Enter', 'Alt+Enter', 'Alt+Enter' ],
				[ CKEDITOR.CTRL + 117 /*F6*/, 'Ctrl+F6', '⌘+F6', 'Ctrl+F6', 'Command+F6' ],
				[ CKEDITOR.ALT + 112 /*F1*/, 'Alt+F1', '⌥+F1', 'Alt+F1', 'Alt+F1' ],
				[ CKEDITOR.SHIFT + 124 /*F13*/, 'Shift+F13', '⇧+F13', 'Shift+F13', 'Shift+F13' ],
				[ CKEDITOR.CTRL + 135 /*F24*/, 'Ctrl+F24', '⌘+F24', 'Ctrl+F24', 'Command+F24' ]
			];

			this._assertKeyboardMatrix( 'keystrokeToString', tests );
		},

		'test keystrokeToArray': function() {
			var tests = [
				[ CKEDITOR.CTRL + 65 /*A*/, [ 'Ctrl', 'A' ], [ '⌘', 'A' ], [ 'Ctrl', 'A' ], [ 'Command', 'A' ] ],
				[ CKEDITOR.ALT + 66 /*B*/, [ 'Alt', 'B' ], [ '⌥', 'B' ], [ 'Alt', 'B' ], [ 'Alt', 'B' ] ],
				[ CKEDITOR.SHIFT + 67 /*C*/, [ 'Shift', 'C' ], [ '⇧', 'C' ], [ 'Shift', 'C' ], [ 'Shift', 'C' ] ],
				[ CKEDITOR.CTRL + CKEDITOR.ALT + 68 /*D*/, [ 'Ctrl', 'Alt', 'D' ], [ '⌘', '⌥', 'D' ], [ 'Ctrl', 'Alt', 'D' ], [ 'Command', 'Alt', 'D' ] ],
				[ CKEDITOR.CTRL + CKEDITOR.SHIFT + 69 /*E*/, [ 'Ctrl', 'Shift', 'E' ], [ '⌘', '⇧', 'E' ], [ 'Ctrl', 'Shift', 'E' ], [ 'Command', 'Shift', 'E' ] ],
				[ CKEDITOR.ALT + CKEDITOR.SHIFT + 70 /*F*/, [ 'Alt', 'Shift', 'F' ], [ '⌥', '⇧', 'F' ], [ 'Alt', 'Shift', 'F' ], [ 'Alt', 'Shift', 'F' ] ],
				[ CKEDITOR.CTRL + 32 /*SPACE*/, [ 'Ctrl', 'Space' ], [ '⌘', 'Space' ], [ 'Ctrl', 'Space' ], [ 'Command', 'Space' ] ],
				[ CKEDITOR.ALT + 13 /*ENTER*/, [ 'Alt', 'Enter' ], [ '⌥', 'Enter' ], [ 'Alt', 'Enter' ], [ 'Alt', 'Enter' ] ],
				[ CKEDITOR.CTRL + CKEDITOR.ALT + CKEDITOR.SHIFT + 71 /*G*/, [ 'Ctrl', 'Alt', 'Shift', 'G' ], [ '⌘', '⌥', '⇧', 'G' ], [ 'Ctrl', 'Alt', 'Shift', 'G' ], [ 'Command', 'Alt', 'Shift', 'G' ] ]
			];

			this._assertKeyboardMatrix( 'keystrokeToArray', tests, true );
		},

		/*
		 * Calls `methodName` in `CKEDITOR.tools`, using each entry given in `tests`.
		 *
		 * Each entry in `tests` should have the structure as follows:
		 *
		 * [
		 * 	[ <keystroke>, <display>, <macDisplay>, <aria>, <macAria> ],
		 * 	(...)
		 * ]
		 *
		 * e.g. [ [ CKEDITOR.CTRL + 65, 'Ctrl+A', '⌘+A', 'Ctrl+A', 'Command+A' ] ]
		 *
		 * @param {String} methodName Name of method to be called in `CKEDITOR.tools`.
		 * @param {Array[]} tests An object containing the tests.
		 * @param {Boolean} [compareAsArray]
		 */
		_assertKeyboardMatrix: function( methodName, tests, compareAsArray ) {
			var assertValue = compareAsArray ? arrayAssert.itemsAreEqual : assert.areEqual,
				expIndex = CKEDITOR.env.mac ? 2 : 1,
				lang = this.editor.lang.common.keyboard,
				test;

			for ( var i = 0, l = tests.length; i < l; i++ ) {
				test = tests[ i ];

				assertValue( test[ expIndex ], CKEDITOR.tools[ methodName ]( lang, test[ 0 ] ).display,
					'Keystroke display string representation is invalid.' );
				assertValue( test[ expIndex + 2 ], CKEDITOR.tools[ methodName ]( lang, test[ 0 ] ).aria,
					'Keystroke ARIA string representation is invalid.' );
			}
		}
	} );
} )();
