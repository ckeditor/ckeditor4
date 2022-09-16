/* bender-tags: editor, selection */
/* bender-ckeditor-plugins: table, basicstyles, list, colorbutton */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			config: {
				removePlugins: 'tableselection'
			}
		},
		divarea: {
			config: {
				extraPlugins: 'divarea',
				removePlugins: 'tableselection'
			}
		},
		inline: {
			creator: 'inline',
			config: {
				removePlugins: 'tableselection'
			}
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

		// (#4931) do not expect optimization in list
		'test selection optimization case 8': testSelection( {
			initial: '<ul><li>[foo</li><li>]bar</li></ul>',
			expected: '<ul><li>[foo@</li><li>]bar</li></ul>'
		} ),

		// (#4931)
		'test selection optimization skips optimization if last list element is empty': testSelection( {
			initial: '<ul><li>[foo</li><li>]</li></ul>',
			expected: '<ul><li>[foo@</li><li>]</li></ul>'
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

		'test selection optimization is prevented when shift key is pressed': testSelection( {
			initial: '<p>foo</p><p>[bar</p><p>]baz</p>',
			expected: '<p>foo</p><p>[bar@</p><p>]baz</p>',
			callback: function( editor, assertEditorHtml ) {
				editor._.shiftPressed = true;
				assertEditorHtml();
				editor._.shiftPressed = false;
			}
		} ),

		// (#3493)
		'test selection optimization key listeners after setData() with keydown': function( editor, bot ) {
			editor._.shiftPressed = null;

			bot.setData( '<p>Foo</p><p><strong>bar</strong> baz</p>', function() {
				bot.editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { shiftKey: true } ) );

				assert.isTrue( editor._.shiftPressed );
			} );
		},

		// (#3493)
		'test selection optimization key listeners after setData() with keyup': function( editor, bot ) {
			editor._.shiftPressed = null;

			bot.setData( '<p>Foo</p><p><strong>bar</strong> baz</p>', function() {
				bot.editor.editable().fire( 'keyup', new CKEDITOR.dom.event( { shiftKey: false } ) );

				assert.isFalse( editor._.shiftPressed );
			} );
		},

		// (#3705)
		'test deleting blocks': function( editor, bot ) {
			bot.setData( '<p>&nbsp;</p><p>Whatever</p>', function() {
				var range = editor.createRange(),
					// In Safari the same selection has different range offsets and endContainer. Because of that it is automatically fixed
					// and empty paragraph is converted to <br/> element.
					expectedExtraction = CKEDITOR.env.safari ? '<br data-cke-eol="1" /><p>Whatever</p>' : '<p>@</p><p>Whatever</p>',
					// And in IE8 only node content is removed.
					expectedContent = CKEDITOR.env.ie && CKEDITOR.env.version == 8 ? '<p>@@</p><p></p>' : '<p>@</p>',
					extractedHtml;

				range.selectNodeContents( editor.editable() );
				range.select();
				extractedHtml = editor.extractSelectedHtml( true );

				assert.isInnerHtmlMatching( expectedExtraction, extractedHtml, 'Extracted HTML is incorrect.' );
				assert.isInnerHtmlMatching( expectedContent, editor.editable().getHtml(), 'Editor content after extraction is incorrect.' );
			} );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	bender.test( tests );

	function testSelection( options ) {
		return function( editor ) {
			if ( options.callback ) {
				options.callback( editor, assertEditorHtml );
			} else {
				assertEditorHtml();
			}

			function assertEditorHtml() {
				bender.tools.selection.setWithHtml( editor, options.initial );

				var expected = options.expected,
					actual = bender.tools.selection.getWithHtml( editor );

				assert.isInnerHtmlMatching( expected, actual, {
					compareSelection: true,
					normalizeSelection: true,
					sortAttributes: true,
					fixStyles: true
				} );
			}
		};
	}
} )();
