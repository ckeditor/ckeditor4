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
			var toString = CKEDITOR.tools.keystrokeToString,
				lang = this.editor.lang.common.keyboard,
				tests = [
					// [ Keystroke, display string, display string on Mac, ARIA string, ARIA string on Mac ]
					[ CKEDITOR.CTRL + 65 /*A*/, 'Ctrl+A', '⌘+A', 'Ctrl+A', 'Command+A' ],
					[ CKEDITOR.ALT + 66 /*B*/, 'Alt+B', '⌥+B', 'Alt+B', 'Alt+B' ],
					[ CKEDITOR.SHIFT + 67 /*C*/, 'Shift+C', '⇧+C', 'Shift+C', 'Shift+C' ],
					[ CKEDITOR.CTRL + CKEDITOR.ALT + 68 /*D*/, 'Ctrl+Alt+D', '⌘+⌥+D', 'Ctrl+Alt+D', 'Command+Alt+D' ],
					[ CKEDITOR.CTRL + CKEDITOR.SHIFT + 69 /*E*/, 'Ctrl+Shift+E', '⌘+⇧+E', 'Ctrl+Shift+E', 'Command+Shift+E' ],
					[ CKEDITOR.ALT + CKEDITOR.SHIFT + 70 /*F*/, 'Alt+Shift+F', '⌥+⇧+F', 'Alt+Shift+F', 'Alt+Shift+F' ],
					[ CKEDITOR.CTRL + CKEDITOR.ALT + CKEDITOR.SHIFT + 71 /*G*/, 'Ctrl+Alt+Shift+G', '⌘+⌥+⇧+G', 'Ctrl+Alt+Shift+G', 'Command+Alt+Shift+G' ],
					[ CKEDITOR.CTRL + 32 /*SPACE*/, 'Ctrl+Space', '⌘+Space', 'Ctrl+Space', 'Command+Space' ],
					[ CKEDITOR.ALT + 13 /*ENTER*/, 'Alt+Enter', '⌥+Enter', 'Alt+Enter', 'Alt+Enter' ]
				],
				test,
				expIndex = CKEDITOR.env.mac ? 2 : 1;

			for ( var i = 0, l = tests.length; i < l; i++ ) {
				test = tests[ i ];
				assert.areEqual( test[ expIndex ], toString( lang, test[ 0 ] ).display, 'Keystroke display string representation is invalid.' );
				assert.areEqual( test[ expIndex + 2 ], toString( lang, test[ 0 ] ).aria, 'Keystroke ARIA string representation is invalid.' );
			}
		},

		'test keystrokeToArray': function() {
			var toArray = CKEDITOR.tools.keystrokeToArray,
				lang = this.editor.lang.common.keyboard,
				tests = [
					// [ Keystroke, display string, display string on Mac, ARIA string, ARIA string on Mac ]
					[ CKEDITOR.CTRL + 65 /*A*/, ['Ctrl', 'A'], ['⌘', 'A'], ['Ctrl', 'A'], ['Command', 'A'] ],
					[ CKEDITOR.ALT + 66 /*B*/, ['Alt', 'B'], ['⌥', 'B'], ['Alt', 'B'], ['Alt', 'B'] ],
					// [ CKEDITOR.SHIFT + 67 /*C*/, 'Shift+C', '⇧+C', 'Shift+C', 'Shift+C' ],
					// [ CKEDITOR.CTRL + CKEDITOR.ALT + 68 /*D*/, 'Ctrl+Alt+D', '⌘+⌥+D', 'Ctrl+Alt+D', 'Command+Alt+D' ],
					// [ CKEDITOR.CTRL + CKEDITOR.SHIFT + 69 /*E*/, 'Ctrl+Shift+E', '⌘+⇧+E', 'Ctrl+Shift+E', 'Command+Shift+E' ],
					// [ CKEDITOR.ALT + CKEDITOR.SHIFT + 70 /*F*/, 'Alt+Shift+F', '⌥+⇧+F', 'Alt+Shift+F', 'Alt+Shift+F' ],
					// [ CKEDITOR.CTRL + CKEDITOR.ALT + CKEDITOR.SHIFT + 71 /*G*/, 'Ctrl+Alt+Shift+G', '⌘+⌥+⇧+G', 'Ctrl+Alt+Shift+G', 'Command+Alt+Shift+G' ],
					// [ CKEDITOR.CTRL + 32 /*SPACE*/, 'Ctrl+Space', '⌘+Space', 'Ctrl+Space', 'Command+Space' ],
					// [ CKEDITOR.ALT + 13 /*ENTER*/, 'Alt+Enter', '⌥+Enter', 'Alt+Enter', 'Alt+Enter' ]
				],
				test,
				expIndex = CKEDITOR.env.mac ? 2 : 1;

			for ( var i = 0, l = tests.length; i < l; i++ ) {
				test = tests[ i ];
				console.log( test[ expIndex ], toArray( lang, test[ 0 ] ).display );
				console.log( test[ expIndex + 2 ], toArray( lang, test[ 0 ] ).aria );
				arrayAssert.itemsAreEqual( test[ expIndex ], toArray( lang, test[ 0 ] ).display,
					'Keystroke display string representation is invalid.' );
				arrayAssert.itemsAreEqual( test[ expIndex + 2 ], toArray( lang, test[ 0 ] ).aria,
					'Keystroke ARIA string representation is invalid.' );
			}
		}
	} );
} )();
