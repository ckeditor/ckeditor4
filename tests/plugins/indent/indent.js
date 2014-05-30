/* bender-tags: editor,unit */

( function() {
	'use strict';

	var cfg = {
			indentOffset: 10,
			indentUnit: 'px',
			autoParagraph: true,
			plugins: 'toolbar,list,indentlist,indentblock,undo'
		},
		editors = {},
		enterModeAbbr = {};

	enterModeAbbr[ CKEDITOR.ENTER_P ] = 'P';
	enterModeAbbr[ CKEDITOR.ENTER_BR ] = 'BR';
	enterModeAbbr[ CKEDITOR.ENTER_DIV ] = 'DIV';

	function setUpEditors() {
		var toDo = {
				enterBR: {
					name: 'test_enterBR',
					config: {
						enterMode: CKEDITOR.ENTER_BR
					}
				},
				enterP: {
					name: 'test_enterP',
					config: {
						enterMode: CKEDITOR.ENTER_P
					}
				},

				// Indent configuration.
				indentClasses: {
					name: 'test_indentClasses',
					config: {
						enterMode: CKEDITOR.ENTER_P,
						indentClasses: [ '1st', '2nd' ]
					}
				},
				indentClassesBR: {
					name: 'test_indentClassesBR',
					config: {
						enterMode: CKEDITOR.ENTER_BR,
						indentClasses: [ '1st', '2nd' ]
					}
				},
				indentUnit: {
					name: 'test_indentUnit',
					config: {
						enterMode: CKEDITOR.ENTER_P,
						indentUnit: 'em'
					}
				},

				// Startup behaviour.
				startupBlock: {
					name: 'test_startupBlock',
					startupData: '<p>startupBlock</p>'
				},
				startupBlockIndented: {
					name: 'test_startupBlockIndented',
					startupData: '<p style="margin-left:10px;">startupBlockIndented</p>'
				},
				startupList: {
					name: 'test_startupList',
					startupData: '<ul><li>startupList</li></ul>',
					config: {
						removePlugins: 'indentblock'
					}
				},

				// Indent specific only.
				indentList: {
					name: 'test_indentList',
					config: {
						removePlugins: 'indentblock'
					}
				},
				indentBlock: {
					name: 'test_indentBlock',
					config: {
						// Currently it is not possible to have list plugin without indentlist.
						removePlugins: 'list,indentlist'
					}
				}
			},
			names = [];

		for ( var name in toDo )
			names.push( name );

		next();

		function next() {
			var name = names.shift();

			if ( !name ) {
				bender.test( tests );
				return;
			}

			// Extend editor's config with global one.
			toDo[ name ].config = CKEDITOR.tools.extend( toDo[ name ].config || {}, cfg );

			bender.editorBot.create( toDo[ name ], function( bot ) {
				editors[ name ] = bot.editor;
				next();
			} );
		}
	}

	function createIndentOutdentTester( editor, html ) {
		html && bender.tools.setHtmlWithSelection( editor, html );

		var modeAbbr = enterModeAbbr[ editor.config.enterMode ],
			iCmd = editor.getCommand( 'indent' ),
			oCmd = editor.getCommand( 'outdent' ),
			stateCounter = 1;

		function assertContents( expected, msg ) {
			assert[ typeof expected == 'string' ? 'areEqual' : 'isMatching' ](
				expected,
				bender.tools.fixHtml( bender.tools.getHtmlWithSelection( editor ), true, true ),
				[ modeAbbr, ' | ', msg ].join( '' ) || '' );
		}

		function command( editor, expected, msg, outdent ) {
			editor.execCommand( outdent ? 'outdent' : 'indent' );
			assertContents( expected, msg );
		}

		function keystroke( editor, expected, msg, outdent ) {
			editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 9, shiftKey: outdent } ) );
			assertContents( expected, msg );
		}

		return {
			i: function( expected, msg ) {	// indent
				command( editor, expected, msg );
			},
			o: function( expected, msg ) {	// outdent
				command( editor, expected, msg, true );
			},
			s: function( indent, outdent, msg ) {
				assert.areSame( indent, iCmd.state, msg || '(' + stateCounter + ') Indent command state' );
				assert.areSame( outdent, oCmd.state, msg || '(' + stateCounter + ') Outdent command state' );

				stateCounter++;
			},
			u: function( expected, msg ) {
				editor.execCommand( 'undo' );
				assertContents( expected, msg );
			},
			r: function( expected, msg ) {
				editor.execCommand( 'redo' );
				assertContents( expected, msg );
			},
			ki: function( expected, msg ) {
				keystroke( editor, expected, msg );
			},
			ko: function( expected, msg ) {
				keystroke( editor, expected, msg, true );
			}
		};
	}

	setUpEditors();

	var tests = {
		'test block': function() {
			var t = createIndentOutdentTester( editors.enterP, '<p>x^</p>' );

			t.s( 2, 0 );
			t.i( '<p style="margin-left:10px;">x^</p>', 													'Indent it once.' );
			t.s( 2, 2 );
			t.i( '<p style="margin-left:20px;">x^</p>', 													'Indent it twice.' );
			t.s( 2, 2 );
			t.o( '<p style="margin-left:10px;">x^</p>', 													'Outdent it back.' );
			t.s( 2, 2 );
			t.o( '<p>x^</p>', 																				'Outdent it back again.' );
			t.s( 2, 0 );
			t.o( '<p>x^</p>', 																				'Remaining at minimum intent level.' );
			t.s( 2, 0 );
		},

		'test block (cross-sel between blocks)': function() {
			var t = createIndentOutdentTester( editors.enterP, '<p>xx[x</p><p>yy]y</p>' );

			t.s( 2, 0 );
			t.i( '<p style="margin-left:10px;">xx[x</p><p style="margin-left:10px;">yy]y</p>', 				'Indent it once.' );
			t.s( 2, 2 );
			t.i( '<p style="margin-left:20px;">xx[x</p><p style="margin-left:20px;">yy]y</p>', 				'Indent it twice.' );
			t.s( 2, 2 );
			t.o( '<p style="margin-left:10px;">xx[x</p><p style="margin-left:10px;">yy]y</p>', 				'Outdent it back.' );
			t.s( 2, 2 );
			t.o( '<p>xx[x</p><p>yy]y</p>', 																	'Outdent it back again.' );
			t.s( 2, 0 );
			t.o( '<p>xx[x</p><p>yy]y</p>', 																	'Remaining at minimum intent level.' );
			t.s( 2, 0 );
		},

		// This might be similar to #2
		'test list (first li element, indent full list)': function() {
			var t = createIndentOutdentTester( editors.enterP, '<ul><li>x^</li><li>y</li></ul>' );

			t.s( 2, 2 );
			t.i( '<ul style="margin-left:10px;"><li>x^</li><li>y</li></ul>', 								'Indent it once.' );
			t.s( 2, 2 );
			t.i( '<ul style="margin-left:20px;"><li>x^</li><li>y</li></ul>', 								'Indent it twice.' );
			t.s( 2, 2 );
			t.o( '<ul style="margin-left:10px;"><li>x^</li><li>y</li></ul>', 								'Outdent it back.' );
			t.s( 2, 2 );
			t.o( '<ul><li>x^</li><li>y</li></ul>', 															'Outdent it back again.' );
			t.s( 2, 2 );
			t.o( '<p>x^</p><ul><li>y</li></ul>', 															'Extract paragraph from list element.' );
			t.s( 2, 0 );
		},

		'test list (next li element, nesting lists)': function() {
			var t = createIndentOutdentTester( editors.enterP, '<ul><li>x</li><li>y^</li></ul>' );

			t.s( 2, 2 );
			t.i( '<ul><li>x<ul><li>y^</li></ul></li></ul>',					 								'First indent is nesting.' );
			t.s( 2, 2 );
			t.i( '<ul><li>x<ul style="margin-left:10px;"><li>y^</li></ul></li></ul>', 						'Second indent is margin.' );
			t.s( 2, 2 );
			t.i( '<ul><li>x<ul style="margin-left:20px;"><li>y^</li></ul></li></ul>', 						'Third indent is margin.' );
			t.s( 2, 2 );
			t.o( '<ul><li>x<ul style="margin-left:10px;"><li>y^</li></ul></li></ul>', 						'Outdent margin back.' );
			t.s( 2, 2 );
			t.o( '<ul><li>x<ul><li>y^</li></ul></li></ul>', 												'Outdent margin back.' );
			t.s( 2, 2 );
			t.o( '<ul><li>x</li><li>y^</li></ul>', 															'Outdent nesting back.' );
			t.s( 2, 2 );
			t.o( '<ul><li>x</li></ul><p>y^</p>', 															'Extract paragraph from list element.' );
			t.s( 2, 0 );
		},

		'test list (nesting multiple li elements)': function() {
			var t = createIndentOutdentTester( editors.enterP, '<ul><li>x</li><li>y[y</li><li>z]z</li></ul>' );

			t.s( 2, 2 );
			t.i( '<ul><li>x<ul><li>y[y</li><li>z]z</li></ul></li></ul>',					 				'First indent is nesting two elements.' );
			t.s( 2, 2 );
			t.i( '<ul><li>x<ul style="margin-left:10px;"><li>y[y</li><li>z]z</li></ul></li></ul>', 			'Second indent is margin to nested list.' );
			t.s( 2, 2 );
			t.o( '<ul><li>x<ul><li>y[y</li><li>z]z</li></ul></li></ul>',									'Outdent margin back.' );
			t.s( 2, 2 );
			t.o( '<ul><li>x</li><li>y[y</li><li>z]z</li></ul>',												'Outdent nesting back.' );
			t.s( 2, 2 );
			t.o( '<ul><li>x</li></ul><p>y[y</p><p>z]z</p>', 												'Extract paragraphs from selected elements.' );
			t.s( 2, 0 );
		},

		'test list (cross-sel, nesting nested li elements)': function() {
			var t = createIndentOutdentTester( editors.enterP, '<ul><li>x</li><li>x[x<ol><li>y]y</li></ol></li><li>x</li></ul>' );

			t.s( 2, 2 );
			t.i( '<ul><li>x<ul><li>x[x<ol><li>y]y</li></ol></li></ul></li><li>x</li></ul>',					'First indent creates 2nd level nesting.' );
			t.s( 2, 2 );
			t.i( '<ul><li>x<ul style="margin-left:10px;"><li>x[x<ol><li>y]y</li></ol></li></ul></li><li>x</li></ul>',
																											'Second indent is margin to 1st level nested list.' );
			t.s( 2, 2 );
			t.o( '<ul><li>x<ul><li>x[x<ol><li>y]y</li></ol></li></ul></li><li>x</li></ul>',					'Outdent margin back.' );
			t.s( 2, 2 );
			t.o( '<ul><li>x</li><li>x[x<ol><li>y]y</li></ol></li><li>x</li></ul>',							'Outdent nesting back.' );
			t.s( 2, 2 );
			t.o( '<ul><li>x</li></ul><p>x[x</p><ol><li>y]y</li></ol><ul><li>x</li></ul>',					'Extract paragraphs.' );
			t.s( 2, 0 );
		},

		'test list (cross-sel, selection start hooked in first li)': function() {
			var t = createIndentOutdentTester( editors.enterP, '<ul><li>x[x</li><li>xx<ol><li>y]y</li></ol></li><li>x</li></ul>' );

			t.s( 2, 2 );
			t.i( '<ul style="margin-left:10px;"><li>x[x</li><li>xx<ol><li>y]y</li></ol></li><li>x</li></ul>',
																											'First indent increases margin.' );
			t.s( 2, 2 );
			t.i( '<ul style="margin-left:20px;"><li>x[x</li><li>xx<ol><li>y]y</li></ol></li><li>x</li></ul>',
																											'Second indent increases margin.' );
			t.s( 2, 2 );
			t.o( '<ul style="margin-left:10px;"><li>x[x</li><li>xx<ol><li>y]y</li></ol></li><li>x</li></ul>',
																											'First outdent reduces margin.' );
			t.s( 2, 2 );
			t.o( '<ul><li>x[x</li><li>xx<ol><li>y]y</li></ol></li><li>x</li></ul>',							'Second outdent reduces margin.' );
			t.s( 2, 2 );
			t.o( '<p>x[x</p><p>xx</p><ol><li>y]y</li></ol><ul><li>x</li></ul>',								'Extract paragraphs.' );
			t.s( 2, 0 );
		},

		'test list (cross-sel between two li elements)': function() {
			var t = createIndentOutdentTester( editors.enterP, '<ul><li>x[x</li><li>y]y</li></ul>' );

			t.s( 2, 2 );
			t.i( '<ul style="margin-left:10px;"><li>x[x</li><li>y]y</li></ul>', 							'Indent it once.' );
			t.s( 2, 2 );
			t.i( '<ul style="margin-left:20px;"><li>x[x</li><li>y]y</li></ul>', 							'Indent it twice.' );
			t.s( 2, 2 );
			t.o( '<ul style="margin-left:10px;"><li>x[x</li><li>y]y</li></ul>', 							'Outdent it back.' );
			t.s( 2, 2 );
			t.o( '<ul><li>x[x</li><li>y]y</li></ul>', 														'Outdent it back again.' );
			t.s( 2, 2 );
			t.o( '<p>x[x</p><p>y]y</p>', 																	'Extract paragraph from list element.' );
			t.s( 2, 0 );
		},

		// Entire test is freaky. See #1 above.
		'test list (outer-sel#2, sel hooked in sibling blocks)': function() {
			var t = createIndentOutdentTester( editors.enterP, '<p>[x</p><ul><li>x</li><li>y</li></ul><p>x]</p>' );

			t.s( 2, 0 );
			t.i( '<p style="margin-left:10px;">[x</p><ul><li><p style="margin-left:10px;">x</p></li><li><p style="margin-left:10px;">y</p></li></ul><p style="margin-left:10px;">x]</p>',
																											'Indent it once.' );
			t.s( 2, 2 );
			t.i( '<p style="margin-left:20px;">[x</p><ul><li><p style="margin-left:20px;">x</p></li><li><p style="margin-left:20px;">y</p></li></ul><p style="margin-left:20px;">x]</p>',
																											'Indent it twice.' );
			t.s( 2, 2 );
			t.o( '<p style="margin-left:10px;">[x</p><ul><li><p style="margin-left:10px;">x</p></li><li><p style="margin-left:10px;">y</p></li></ul><p style="margin-left:10px;">x]</p>',
																											'Outdent it back.' );
			t.s( 2, 2 );
			t.o( '<p>[x</p><ul><li><p>x</p></li><li><p>y</p></li></ul><p>x]</p>', 							'Outdent it back again.' );
			t.s( 2, 0 );
		},

		'test list (outer-sel#3, mixed sel block->list)': function() {
			var t = createIndentOutdentTester( editors.enterP, '<p>x[x</p><ul><li>x]</li><li>y</li></ul>' );

			t.s( 2, 0 );
			t.i( '<p style="margin-left:10px;">x[x</p><ul><li><p style="margin-left:10px;">x]</p></li><li>y</li></ul>',
																											'Indent it once.' );
			t.s( 2, 2 );
			t.i( '<p style="margin-left:20px;">x[x</p><ul><li><p style="margin-left:20px;">x]</p></li><li>y</li></ul>',
																											'Indent it twice.' );
			t.s( 2, 2 );
			t.o( '<p style="margin-left:10px;">x[x</p><ul><li><p style="margin-left:10px;">x]</p></li><li>y</li></ul>',
																											'Outdent it back.' );
			t.s( 2, 2 );
			t.o( '<p>x[x</p><ul><li><p>x]</p></li><li>y</li></ul>', 										'Outdent it back again.' );
			t.s( 2, 0 );
		},

		'test list (outer-sel#3, mixed sel list->block)': function() {
			var t = createIndentOutdentTester( editors.enterP, '<ul><li>x</li><li>[y</li></ul><p>x]x</p>' );

			t.s( 2, 2 );
			t.i( '<ul><li>x<ul><li>[y</li></ul></li></ul><p>x]x</p>',										'Indent it once.' );
			t.s( 2, 2 );
			t.i( '<ul><li>x<ul style="margin-left:10px;"><li>[y</li></ul></li></ul><p>x]x</p>',				'Indent it twice.' );
			t.s( 2, 2 );
			t.o( '<ul><li>x<ul><li>[y</li></ul></li></ul><p>x]x</p>',										'Outdent it back.' );
			t.s( 2, 2 );
			t.o( '<ul><li>x</li><li>[y</li></ul><p>x]x</p>', 												'Outdent it back again.' );
			t.s( 2, 2 );
		},

		'test list (first li in nested list)': function() {
			var t = createIndentOutdentTester( editors.enterP, '<ul><li><ol><li>x^</li></ol></li><li>y</li></ul>' );

			t.s( 2, 2 );
			t.i( '<ul><li><ol style="margin-left:10px;"><li>x^</li></ol></li><li>y</li></ul>', 				'Indent it once.' );
			t.s( 2, 2 );
			t.i( '<ul><li><ol style="margin-left:20px;"><li>x^</li></ol></li><li>y</li></ul>', 				'Indent it twice.' );
			t.s( 2, 2 );
			t.o( '<ul><li><ol style="margin-left:10px;"><li>x^</li></ol></li><li>y</li></ul>', 				'Outdent it back.' );
			t.s( 2, 2 );
			t.o( '<ul><li><ol><li>x^</li></ol></li><li>y</li></ul>', 										'Outdent it back again.' );
			t.s( 2, 2 );
			t.o( '<ul><li>&nbsp;</li><li>x^</li><li>y</li></ul>', 											'Collapse the inner list.' );
			t.s( 2, 2 );
		},

		'test list (first li in nested list, same type)': function() {
			var t = createIndentOutdentTester( editors.enterP, '<ul><li><ul><li>x^</li></ul></li><li>y</li></ul>' );

			t.s( 2, 2 );
			t.i( '<ul><li><ul style="margin-left:10px;"><li>x^</li></ul></li><li>y</li></ul>', 				'Indent it once.' );
			t.s( 2, 2 );
			t.i( '<ul><li><ul style="margin-left:20px;"><li>x^</li></ul></li><li>y</li></ul>', 				'Indent it twice.' );
			t.s( 2, 2 );
			t.o( '<ul><li><ul style="margin-left:10px;"><li>x^</li></ul></li><li>y</li></ul>', 				'Outdent it back.' );
			t.s( 2, 2 );
			t.o( '<ul><li><ul><li>x^</li></ul></li><li>y</li></ul>', 										'Outdent it back again.' );
			t.s( 2, 2 );
			t.o( '<ul><li>&nbsp;</li><li>x^</li><li>y</li></ul>', 											'Collapse the inner list.' );
			t.s( 2, 2 );
		},

		'test list (first li in nested list, cross-sel between lists)': function() {
			var t = createIndentOutdentTester( editors.enterP, '<ul><li><ol><li>x[x</li></ol></li><li>y]y</li></ul>' );

			t.s( 2, 2 );
			t.i( '<ul><li><ol style="margin-left:10px;"><li>x[x</li></ol></li><li>y]y</li></ul>', 			'Indent it once.' );
			t.s( 2, 2 );
			t.i( '<ul><li><ol style="margin-left:20px;"><li>x[x</li></ol></li><li>y]y</li></ul>', 			'Indent it twice.' );
			t.s( 2, 2 );
			t.o( '<ul><li><ol style="margin-left:10px;"><li>x[x</li></ol></li><li>y]y</li></ul>', 			'Outdent it back.' );
			t.s( 2, 2 );
			t.o( '<ul><li><ol><li>x[x</li></ol></li><li>y]y</li></ul>', 									'Outdent it back again.' );
			t.s( 2, 2 );
			t.o( /<ol><li>x\[x<\/li><\/ol><p>y\]y<\/p>/, 													'Collapse the outer list.' );
			t.s( 2, 2 );
		},

		'test table': function() {
			var t = createIndentOutdentTester( editors.enterP, '<table><tbody><tr><td>y^</td><td></td></tr></tbody></table>' );

			t.s( 2, 0 );
			t.i( '<table><tbody><tr><td><p style="margin-left:10px;">y^</p></td><td>&nbsp;</td></tr></tbody></table>',
																											'Indent it once.' );
			t.s( 2, 2 );
			t.i( '<table><tbody><tr><td><p style="margin-left:20px;">y^</p></td><td>&nbsp;</td></tr></tbody></table>',
																											'Indent it twice.' );
			t.s( 2, 2 );
			t.o( '<table><tbody><tr><td><p style="margin-left:10px;">y^</p></td><td>&nbsp;</td></tr></tbody></table>',
																											'Outdent it back.' );
			t.s( 2, 2 );
			t.o( '<table><tbody><tr><td><p>y^</p></td><td>&nbsp;</td></tr></tbody></table>',
																											'Outdent it back again.' );
			t.s( 2, 0 );
		},

		'test table (outer-sel between sibling blocks)': function() {
			var t = createIndentOutdentTester( editors.enterP, '<p>[x</p><table><tbody><tr><td>y</td><td></td></tr></tbody></table><p>z]</p>' );

			t.s( 2, 0 );
			t.i( '<p style="margin-left:10px;">[x</p><table><tbody><tr><td><p style="margin-left:10px;">y</p></td><td style="margin-left:10px;">&nbsp;</td></tr></tbody></table><p style="margin-left:10px;">z]</p>',
																											'Indent it once.' );
			t.s( 2, 2 );
			t.i( '<p style="margin-left:20px;">[x</p><table><tbody><tr><td><p style="margin-left:20px;">y</p></td><td style="margin-left:20px;">&nbsp;</td></tr></tbody></table><p style="margin-left:20px;">z]</p>',
																											'Indent it twice.' );
			t.s( 2, 2 );
			t.o( '<p style="margin-left:10px;">[x</p><table><tbody><tr><td><p style="margin-left:10px;">y</p></td><td style="margin-left:10px;">&nbsp;</td></tr></tbody></table><p style="margin-left:10px;">z]</p>',
																											'Outdent it back.' );
			t.s( 2, 2 );
			t.o( '<p>[x</p><table><tbody><tr><td><p>y</p></td><td>&nbsp;</td></tr></tbody></table><p>z]</p>',
																											'Outdent it back again.' );
			t.s( 2, 0 );
		},

		'test div': function() {
			var t = createIndentOutdentTester( editors.enterP, '<div>x^</div>' );

			t.s( 2, 0 );
			t.i( '<div style="margin-left:10px;">x^</div>', 												'Indent it once.' );
			t.s( 2, 2 );
			t.i( '<div style="margin-left:20px;">x^</div>', 												'Indent it twice.' );
			t.s( 2, 2 );
			t.o( '<div style="margin-left:10px;">x^</div>', 												'Outdent it back.' );
			t.s( 2, 2 );
			t.o( '<div>x^</div>', 																			'Outdent it back again.' );
			t.s( 2, 0 );
			t.o( '<div>x^</div>', 																			'Remaining at minimum intent level.' );
			t.s( 2, 0 );
		},

		'test div (indent nested div)': function() {
			var t = createIndentOutdentTester( editors.enterP, '<div><div>x^</div></div>' );

			t.s( 2, 0 );
			t.i( '<div><div style="margin-left:10px;">x^</div></div>', 										'Indent it once.' );
			t.s( 2, 2 );
			t.i( '<div><div style="margin-left:20px;">x^</div></div>', 										'Indent it twice.' );
			t.s( 2, 2 );
			t.o( '<div><div style="margin-left:10px;">x^</div></div>', 										'Outdent it back.' );
			t.s( 2, 2 );
			t.o( '<div><div>x^</div></div>', 																'Outdent it back again.' );
			t.s( 2, 0 );
			t.o( '<div><div>x^</div></div>', 																'Remaining at minimum intent level.' );
			t.s( 2, 0 );
		},

		'test div (indent nested div, cross-sel between divs)': function() {
			var t = createIndentOutdentTester( editors.enterP, '<div>x[x<div>y]y</div></div>' );

			t.s( 2, 0 );
			t.i( '<div><p style="margin-left:10px;">x[x</p><div style="margin-left:10px;">y]y</div></div>', 'Indent it once.' );
			t.s( 2, 2 );
			t.i( '<div><p style="margin-left:20px;">x[x</p><div style="margin-left:20px;">y]y</div></div>', 'Indent it twice.' );
			t.s( 2, 2 );
			t.o( '<div><p style="margin-left:10px;">x[x</p><div style="margin-left:10px;">y]y</div></div>', 'Outdent it back.' );
			t.s( 2, 2 );
			t.o( '<div><p>x[x</p><div>y]y</div></div>', 													'Outdent it back again.' );
			t.s( 2, 0 );
			t.o( '<div><p>x[x</p><div>y]y</div></div>', 													'Remaining at minimum intent level.' );
			t.s( 2, 0 );
		},

		'test deflist': function() {
			var t = createIndentOutdentTester( editors.enterP, '<dl><dt>x^</dt><dd>y</dd></dl>' );

			t.s( 2, 0 );
			t.i( '<dl style="margin-left:10px;"><dt>x^</dt><dd>y</dd></dl>',								'Indent it once.' );
			t.s( 2, 2 );
			t.i( '<dl style="margin-left:20px;"><dt>x^</dt><dd>y</dd></dl>', 								'Indent it twice.' );
			t.s( 2, 2 );
			t.o( '<dl style="margin-left:10px;"><dt>x^</dt><dd>y</dd></dl>', 								'Outdent it back.' );
			t.s( 2, 2 );
			t.o( '<dl><dt>x^</dt><dd>y</dd></dl>', 															'Outdent it back again.' );
			t.s( 2, 0 );
			t.o( '<dl><dt>x^</dt><dd>y</dd></dl>', 															'Remaining at minimum intent level.' );
			t.s( 2, 0 );
		},

		'test deflist (cross-sel)': function() {
			var t = createIndentOutdentTester( editors.enterP, '<dl><dt>x[x</dt><dd>y]y</dd></dl>' );

			t.s( 2, 0 );
			t.i( '<dl style="margin-left:10px;"><dt>x[x</dt><dd>y]y</dd></dl>',								'Indent it once.' );
			t.s( 2, 2 );
			t.i( '<dl style="margin-left:20px;"><dt>x[x</dt><dd>y]y</dd></dl>',								'Indent it twice.' );
			t.s( 2, 2 );
			t.o( '<dl style="margin-left:10px;"><dt>x[x</dt><dd>y]y</dd></dl>',								'Outdent it back.' );
			t.s( 2, 2 );
			t.o( '<dl><dt>x[x</dt><dd>y]y</dd></dl>', 														'Outdent it back again.' );
			t.s( 2, 0 );
			t.o( '<dl><dt>x[x</dt><dd>y]y</dd></dl>', 														'Remaining at minimum intent level.' );
			t.s( 2, 0 );
		},

		'test indent classes': function() {
			var t = createIndentOutdentTester( editors.indentClasses, '<p>x^</p>' );

			t.s( 2, 0 );
			t.i( '<p class="1st">x^</p>',																	'Indent it once.' );
			t.s( 2, 2 );
			t.i( '<p class="2nd">x^</p>',																	'Indent it again.' );
			t.s( 0, 2 );
			t.i( '<p class="2nd">x^</p>',																	'Can\'t indent any further.' );
			t.s( 0, 2 );
			t.o( '<p class="1st">x^</p>',																	'Outdent it once.' );
			t.s( 2, 2 );
			t.o( '<p>x^</p>',																				'Outdent it again.' );
			t.s( 2, 0 );
		},

		'test indent classes - list': function() {
			var t = createIndentOutdentTester( editors.indentClasses, '<ul><li>x</li><li>y^</li></ul>' );

			t.s( 2, 2 );
			t.i( '<ul><li>x<ul><li>y^</li></ul></li></ul>', 												'Indent it once.' );
			t.s( 2, 2 );
			t.i( '<ul><li>x<ul class="1st"><li>y^</li></ul></li></ul>', 									'Indent it again.' );
			t.s( 2, 2 );
			t.i( '<ul><li>x<ul class="2nd"><li>y^</li></ul></li></ul>', 									'Indent it again.' );
			t.s( 0, 2 );
			t.i( '<ul><li>x<ul class="2nd"><li>y^</li></ul></li></ul>', 									'Can\'t indent any further.' );
			t.s( 0, 2 );
			t.o( '<ul><li>x<ul class="1st"><li>y^</li></ul></li></ul>', 									'Outdent it once.' );
			t.s( 2, 2 );
			t.o( '<ul><li>x<ul><li>y^</li></ul></li></ul>', 												'Outdent it again.' );
			t.s( 2, 2 );
			t.o( '<ul><li>x</li><li>y^</li></ul>', 															'Outdent it again.' );
			t.s( 2, 2 );
			t.o( '<ul><li>x</li></ul><p>y^</p>', 															'Extract paragraph.' );
			t.s( 2, 0 );
		},

		'test indent units': function() {
			var t = createIndentOutdentTester( editors.indentUnit, '<p>x^</p>' );

			t.s( 2, 0 );
			t.i( '<p style="margin-left:10em;">x^</p>', 													'Indent it once.' );
			t.s( 2, 2 );
			t.i( '<p style="margin-left:20em;">x^</p>', 													'Indent it twice.' );
			t.s( 2, 2 );
			t.o( '<p style="margin-left:10em;">x^</p>', 													'Outdent it back.' );
			t.s( 2, 2 );
			t.o( '<p>x^</p>', 																				'Outdent it back again.' );
			t.s( 2, 0 );
			t.o( '<p>x^</p>', 																				'Remaining at minimum intent level.' );
			t.s( 2, 0 );
		},

		'test indent lists-only: states, indent block': function() {
			var t = createIndentOutdentTester( editors.indentList, '<p>fo^o</p><ul><li>x</li><li>y</li></ul>' );

			t.s( 0, 0 );
			t.i( '<p>fo^o</p><ul><li>x</li><li>y</li></ul>', 												'Cannot indent blocks.' );
			t.s( 0, 0 );
		},

		'test indent lists-only: states, indent block (#2)': function() {
			var t = createIndentOutdentTester( editors.indentList, '<ul><li>x^</li><li>y</li></ul>' );

			t.s( 0, 2 );
			t.i( '<ul><li>x^</li><li>y</li></ul>', 															'Cannot indent blocks.' );
			t.s( 0, 2 );
			t.o( '<p>x^</p><ul><li>y</li></ul>', 															'Collapse the list into paragraph.' );
			t.s( 0, 0 );
		},

		'test indent lists-only: states, nested list': function() {
			var t = createIndentOutdentTester( editors.indentList, '<ul><li>x</li><li>y^</li></ul>' );

			t.s( 2, 2 );
			t.i( '<ul><li>x<ul><li>y^</li></ul></li></ul>', 												'Can nest lists.' );
			t.s( 0, 2 );
			t.o( '<ul><li>x</li><li>y^</li></ul>', 															'Can outdent nested lists.' );
			t.s( 2, 2 );
		},

		'test indent lists-only: selections, start in list, cross': function() {
			var t = createIndentOutdentTester( editors.indentList, '<p>foo</p><ul><li>[x</li><li>y]</li></ul>' );

			t.s( 0, 2 );
			t.o( '<p>foo</p><p>[x</p><p>y]</p>', 															'Collapse list when cross-selection.' );
			t.s( 0, 0 );
		},

		'test indent lists-only: selections, start in block': function() {
			var t = createIndentOutdentTester( editors.indentList, '<p>fo[o</p><ul><li>x</li><li>y]</li></ul>' );

			t.s( 0, 0,																						'Path is in block. Nothing to do for indentlist.' );
		},

		'test indent lists-only: selections, start in list element': function() {
			var t = createIndentOutdentTester( editors.indentList, '<ul><li>x</li><li>[y</li></ul><p>fo]o</p>' );

			t.s( 2, 2,																						'Can indent and outdent since path is in list.' );
			t.i( '<ul><li>x<ul><li>[y</li></ul></li></ul><p>fo]o</p>', 										'Indent list once.' );
			t.s( 0, 2,																						'Cannot indent again - first element of a list.' );
			t.o( '<ul><li>x</li><li>[y</li></ul><p>fo]o</p>', 												'Outdent list once.' );
			t.s( 2, 2,																						'Can indent and outdent since path is in list.' );
			t.o( '<ul><li>x</li></ul><p>[y</p><p>fo]o</p>', 												'Outdented and collapsed list element.' );
			t.s( 0, 0 );
		},

		'test indent lists-only: margins': function() {
			var t = createIndentOutdentTester( editors.indentList, '<ul style="margin-left:10px;"><li>x</li><li>^y</li></ul>' );

			t.s( 2, 2 );
			t.i( '<ul style="margin-left:10px;"><li>x<ul><li>^y</li></ul></li></ul>',						'Indent list once. Don\'t touch list margin.' );
			t.s( 0, 2 );
			t.o( '<ul style="margin-left:10px;"><li>x</li><li>^y</li></ul>',								'Outdent nested list. Don\'t touch parents list margin.' );
			t.s( 2, 2 );
			t.o( '<ul style="margin-left:10px;"><li>x</li></ul><p>^y</p>',									'Collapse list despite of margin if not first element.' );
			t.s( 0, 0 );
		},

		'test indent block-only: paragraph': function() {
			var t = createIndentOutdentTester( editors.indentBlock, '<p>fo[o</p><ul><li>x]</li><li>y</li></ul>' );

			t.s( 2, 0 );
			t.i( '<p style="margin-left:10px;">fo[o</p><ul><li><p style="margin-left:10px;">x]</p></li><li>y</li></ul>',							'Create indented paragraphs.' );
			t.s( 2, 2 );
			t.o( '<p>fo[o</p><ul><li><p>x]</p></li><li>y</li></ul>',										'Outdent paragraphs.' );
			t.s( 2, 0 );
		},

		'test ENTER_BR': function() {
			var t = createIndentOutdentTester( editors.enterBR, 'f^oo' );

			t.s( 2, 0 );
			t.i( '<div style="margin-left:10px;">f^oo</div>', 													'Indent entire block.' );
			t.s( 2, 2 );
			t.i( '<div style="margin-left:20px;">f^oo</div>', 													'Indent entire block twice.' );
			t.s( 2, 2 );
			t.o( '<div style="margin-left:10px;">f^oo</div>', 													'Outdent entire block.' );
			t.s( 2, 2 );
			t.o( '<div>f^oo</div>', 																			'Outdent entire block again.' );
			t.s( 2, 0 );
		},

		'test ENTER_BR (#2)': function() {
			var t = createIndentOutdentTester( editors.enterBR, 'x<ul><li>y^</li></ul>z' );

			t.s( 2, 2 );
			t.o( /xy\^(<br \/>)?z/, 																						'Collapse entire list.' );
			t.s( 2, 0 );
		},

		'test ENTER_BR with indent classes': function() {
			var t = createIndentOutdentTester( editors.indentClassesBR, 'f^oo' );

			t.s( 2, 0 );
			t.i( '<div class="1st">f^oo</div>', 																'Indent entire block.' );
			t.s( 2, 2 );
			t.i( '<div class="2nd">f^oo</div>', 																'Indent entire block twice.' );
			t.s( 0, 2 );
			t.o( '<div class="1st">f^oo</div>', 																'Outdent entire block.' );
			t.s( 2, 2 );
			t.o( '<div>f^oo</div>', 																			'Outdent entire block again.' );
			t.s( 2, 0 );
		},

		'test undo manager': function() {
			var t = createIndentOutdentTester( editors.enterP, '<ul><li>x</li><li>y^</li></ul>' );

			// We'd love to have undoManager clean for this test - this editor is shared with
			// other tests.
			editors.enterP.resetUndo();

			t.i( '<ul><li>x<ul><li>y^</li></ul></li></ul>', 													'Indent entire list.' );
			t.i( '<ul><li>x<ul style="margin-left:10px;"><li>y^</li></ul></li></ul>', 							'Indent entire list twice.' );
			t.u( '<ul><li>x<ul><li>y^</li></ul></li></ul>',														'Undo once.' );
			t.u( '<ul><li>x</li><li>y^</li></ul>', 																'Undo twice.' );
			t.u( '<ul><li>x</li><li>y^</li></ul>', 																'Undo - nothing more can be undone.' );
			t.r( '<ul><li>x<ul><li>y^</li></ul></li></ul>',														'Redo once.' );
			t.r( '<ul><li>x<ul style="margin-left:10px;"><li>y^</li></ul></li></ul>', 							'Redo twice.' );
			t.r( '<ul><li>x<ul style="margin-left:10px;"><li>y^</li></ul></li></ul>', 							'Redo - nothing more can be redone.' );
		},

		'test keystrokes - paragraph': function() {
			var t = createIndentOutdentTester( editors.enterP, '<p>x^</p>' );

			t.ki( '<p>x^</p>', 																					'Keystrokes indent lists only.' );
			t.ko( '<p>x^</p>', 																					'Keystrokes outdent lists only.' );
		},

		'test keystrokes - list, non-first element': function() {
			var t = createIndentOutdentTester( editors.enterP, '<ul><li>x</li><li>y^</li></ul>' );

			t.ki( '<ul><li>x<ul><li>y^</li></ul></li></ul>', 													'Nest list once.' );
			t.ki( '<ul><li>x<ul><li>y^</li></ul></li></ul>', 													'Cannot indent list more.' );
			t.ko( '<ul><li>x</li><li>y^</li></ul>', 															'Outdent list once.' );
			t.ko( '<ul><li>x</li></ul><p>y^</p>', 																'Collapse list.' );
			t.ko( '<ul><li>x</li></ul><p>y^</p>', 																'Cannot outdent any more.' );
		},

		'test keystrokes - list, first element': function() {
			var t = createIndentOutdentTester( editors.indentList, '<ul><li>x^</li></ul>' );

			t.ki( '<ul><li>x^</li></ul>', 																		'Indentlist doesn\'t indent entire lists.' );
			t.ko( '<p>x^</p>', 																					'Indentlist collapses entire lists.' );
		},

		'test indent next to inline non-editable': function() {
			var t1 = createIndentOutdentTester( editors.enterP, '<p><span contenteditable="false">xxx</span>^</p>' );

			t1.s( 2, 0 );
			t1.i( '<p style="margin-left:10px;"><span contenteditable="false">xxx</span>^</p>',					'Indent it once.' );
			t1.s( 2, 2 );

			var t2 = createIndentOutdentTester( editors.enterP, '<p>a<span contenteditable="false">bb</span>c^</p>' );

			t2.s( 2, 0 );
			t2.i( '<p style="margin-left:10px;">a<span contenteditable="false">bb</span>c^</p>',				'Indent it once.' );
			t2.s( 2, 2 );
			t2.u( '<p>a<span contenteditable="false">bb</span>c^</p>',											'Undo once.' );
			t2.s( 2, 0 );
		}
	};
} )();