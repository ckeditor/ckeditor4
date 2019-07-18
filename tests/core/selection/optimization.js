/* bender-tags: editor, selection */
/* bender-ckeditor-plugins: table, basicstyles, list, colorbutton */

( function() {
	'use strict';

	bender.editors = {
		classic: {},
		divarea: {
			config: {
				extraPlugins: 'divarea'
			}
		},
		inline: {
			creator: 'inline'
		}
	};

	// (#3175)
	var tests = {
		'test selection optimization case 1': testSelection( {
			initial: '<p>foo</p><p>[bar</p><p>]baz</p>',
			expected: '<p>foo</p><p>[bar]@</p><p>baz</p>'
		} ),

		'test selection optimization case 2': testSelection( {
			initial: '<p>foo[</p><p>bar]</p><p>baz</p>',
			expected: '<p>foo</p><p>[bar]@</p><p>baz</p>'
		} ),

		'test selection optimization case 3': testSelection( {
			initial: '<p>foo[</p><p>bar</p><p>]baz</p>',
			expected: '<p>foo</p><p>[bar]@</p><p>baz</p>'
		} ),

		'test selection optimization case 4': testSelection( {
			initial: '<p>foo</p><p>[bar</p><p>b]az</p>',
			expected: '<p>foo</p><p>[bar@</p><p>b]az</p>'
		} ),

		'test selection optimization case 5': testSelection( {
			initial: '<p>fo[o</p><p>bar]</p><p>baz</p>',
			expected: '<p>fo[o@</p><p>bar]</p><p>baz</p>'
		} ),

		'test selection optimization case 6': testSelection( {
			initial: '<p>foo</p><p>[bar</p><p>]baz</p>',
			expected: '<p>foo</p><p>[bar]@</p><p>baz</p>'
		} ),

		'test selection optimization case 7': testSelection( {
			initial: '<p>foo</p><p>[]bar</p><p>baz</p>',
			expected: '<p>foo</p><p>^bar@</p><p>baz</p>'
		} ),

		'test selection optimization case 8': testSelection( {
			initial: '<ul><li>[foo</li><li>]bar</li></ul>',
			expected: '<ul><li>[foo]@</li><li>bar</li></ul>'
		} ),

		'test selection optimization case 9': testSelection( {
			initial: '<ul><li>foo</li><li>[bar</li></ul><p>]baz</p>',
			expected: '<ul><li>foo</li><li>[bar]@</li></ul><p>baz</p>'
		} ),

		'test selection optimization case 10': testSelection( {
			initial: '<p><strong>[Foo</strong> bar</p><p>]baz</p>',
			expected: '<p><strong>[Foo</strong> bar]@</p><p>baz</p>'
		} ),

		'test selection optimization case 11': testSelection( {
			initial: '<p>Foo[</p><p><strong>bar]</strong> baz</p>',
			expected: '<p>Foo</p><p><strong>[bar]</strong> baz@</p>'
		} ),

		'test selection optimization case 12': testSelection( {
			initial:
				'<table border="1" cellpadding="1" cellspacing="1" style="width:500px"><tbody>' +
				'<tr><td>foo</td><td>bar</td></tr>' +
				'<tr><td>baz</td><td><span style="color:#e74c3c">[faz</span></td></tr>' +
				'</tbody></table><p>]Paragraph</p>',
			expected:
				'<table border="1" cellpadding="1" cellspacing="1" style="width:500px"><tbody>' +
				'<tr><td>foo</td><td>bar</td></tr>' +
				'<tr><td>baz</td><td><span style="color:#e74c3c">[faz]</span>@</td></tr>' +
				'</tbody></table><p>Paragraph</p>'
		} ),

		'test keystroke and range are saved on shift+left': testKeystroke( {
			keyCode: 37,
			stored: true
		} ),

		'test keystroke and range are saved on shift+up': testKeystroke( {
			keyCode: 38,
			stored: true
		} ),

		'test keystroke and range are saved on shift+right': testKeystroke( {
			keyCode: 39,
			stored: true
		} ),

		'test keystroke and range are saved on shift+down': testKeystroke( {
			keyCode: 40,
			stored: true
		} ),

		'test keystroke and range are not saved on shift+a': testKeystroke( {
			keyCode: 65,
			stored: false
		} ),

		'test saved keystroke and range are cleaned when selectionCheck is prevented': function( editor ) {
			var mock = sinon.stub( CKEDITOR.dom.selection.prototype, 'getType' ).returns( CKEDITOR.SELECTION_NONE );

			testKeystroke( {
				keyCode: 37,
				stored: false,
				callback: function( assertSoredKeystroke ) {
					editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

					setTimeout( function() {
						resume( function() {
							mock.restore();
							assertSoredKeystroke();
						} );
					}, 220 );

					wait();
				}
			} )( editor );

			mock.restore();
		},

		'test selection optimization when left key stored': testSelectionWithKeystroke( {
			keyCode: 37,
			initial: '<p>foo[</p><p>bar]</p><p>baz</p>',
			expected: '<p>fo[o</p><p>bar]@</p><p>baz</p>',
			ignore: CKEDITOR.env.gecko
		} ),

		'test selection optimization when up key stored': testSelectionWithKeystroke( {
			keyCode: 38,
			initial: '<p>foo[</p><p>bar]</p><p>baz</p>',
			expected: '<p>fo[o</p><p>bar]@</p><p>baz</p>',
			ignore: CKEDITOR.env.gecko
		} ),

		'test selection optimization when right key stored': testSelectionWithKeystroke( {
			keyCode: 39,
			initial: '<p>foo</p><p>[bar</p><p>]baz</p>',
			expected: '<p>foo</p><p>[bar@</p><p>b]az</p>'
		} ),

		'test selection optimization when down key stored': testSelectionWithKeystroke( {
			keyCode: 40,
			initial: '<p>foo</p><p>[bar</p><p>]baz</p>',
			expected: '<p>foo</p><p>[bar@</p><p>b]az</p>'
		} )
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	bender.test( tests );

	function testSelection( options ) {
		return function( editor ) {
			bender.tools.selection.setWithHtml( editor, options.initial );

			if ( options.callback ) {
				options.callback( editor, function() {
					assertEditorHtml( options.expected );
				} );
			} else {
				assertEditorHtml( options.expected );
			}

			function assertEditorHtml( expected ) {
				var actual = bender.tools.selection.getWithHtml( editor );

				assert.isInnerHtmlMatching( expected, actual, {
					compareSelection: true,
					normalizeSelection: true,
					sortAttributes: true,
					fixStyles: true
				} );
			}
		};
	}

	function testKeystroke( options ) {
		return function( editor ) {
			editor._lastKeystrokeSelection = null;

			editor.focus();

			var range = editor.getSelection().getRanges()[ 0 ],
				SHIFT = CKEDITOR.SHIFT,
				keyCode = options.keyCode;

			editor.fire( 'key', {
				keyCode: keyCode + SHIFT,
				domEvent: {
					getKey: function() {
						return keyCode + SHIFT;
					}
				}
			} );

			if ( options.callback ) {
				options.callback( function() {
					assertSoredKeystroke( options.stored );
				} );
			} else {
				assertSoredKeystroke( options.stored );
			}

			function assertSoredKeystroke( stored ) {
				if ( stored ) {
					assert.areSame( keyCode, editor._lastKeystrokeSelection.keyCode, 'keyCode stored' );
					assert.isTrue( range.equals( editor._lastKeystrokeSelection.range ), 'range stored' );
				} else {
					assert.isNull( editor._lastKeystrokeSelection, 'editor._lastKeystrokeSelection' );
				}
			}
		};
	}

	function testSelectionWithKeystroke( options ) {
		return function( editor ) {
			options.ignore && assert.ignore();

			// Prevent initial optimization.
			var listener = editor.on( 'selectionCheck', function( evt ) {
				evt.cancel();
			}, null, null, -5 );

			testSelection( {
				initial: options.initial,
				expected: options.expected,
				callback: function( editor, assertEditorHtml ) {
					var selection = editor.getSelection(),
						range = selection.getRanges()[ 0 ];

					editor._lastKeystrokeSelection = {
						range: range,
						keyCode: options.keyCode
					};

					listener.removeListener();

					editor.fire( 'selectionCheck', selection );

					assertEditorHtml();
				}
			} )( editor );
		};
	}
} )();
