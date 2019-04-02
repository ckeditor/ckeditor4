/* bender-tags: editor,insertion */

( function() {
	'use strict';

	var doc = CKEDITOR.document,
		tools = bender.tools;

	bender.editor = {
		config: {
			autoParagraph: false,
			allowedContent: true
		}
	};

	var tests = {
			testInsertElement: function() {
				var editor = this.editor;

				// When editor has focus.
				var ins = CKEDITOR.dom.element.createFromHtml( '<strong>baz</strong>', editor.document );
				bender.tools.setHtmlWithSelection( editor, 'foo^bar' );
				editor.insertElement( ins );
				assert.areSame( 'foo<strong>baz</strong>bar', tools.compatHtml( editor.getData() ), 'insert element with existing selection, editor focused' );

				// When editor loose focus.
				bender.tools.setHtmlWithSelection( editor, 'foo^bar' );
				ins = CKEDITOR.dom.element.createFromHtml( '<strong>baz</strong>', editor.document );
				doc.getById( 'text_input' ).focus();
				editor.insertElement( ins );
				assert.areSame( 'foo<strong>baz</strong>bar', tools.compatHtml( editor.getData() ), 'insert element with existing selection, editor blurred' );
			},

			testInsertHtml: function() {
				var editor = this.editor;

				// When editor has focus.
				bender.tools.setHtmlWithSelection( editor, 'foo^bar' );
				editor.insertHtml( 'baz' );
				assert.areSame( 'foobazbar', tools.compatHtml( editor.getData() ), 'insert html with existing selection, editor focused' );

				// When editor loose focus.
				bender.tools.setHtmlWithSelection( editor, 'foo^bar' );
				doc.getById( 'text_input' ).focus();
				editor.insertHtml( 'baz' );
				assert.areSame( 'foobazbar', tools.compatHtml( editor.getData() ), 'insert html with existing selection, editor blurred' );
			},

			testInsertText: function() {
				var editor = this.editor;

				// When editor has focus.
				bender.tools.setHtmlWithSelection( editor, 'foo^bar' );
				editor.insertText( 'baz' );
				assert.areSame( 'foobazbar', tools.compatHtml( editor.getData() ), 'insert text with existing selection, editor focused' );

				// When editor loose focus.
				bender.tools.setHtmlWithSelection( editor, 'foo^bar' );
				doc.getById( 'text_input' ).focus();
				editor.insertText( 'baz' );
				assert.areSame( 'foobazbar', tools.compatHtml( editor.getData() ), 'insert text with existing selection, editor blurred' );
			},

			'test insertHtml without filter': function() {
				bender.editorBot.create( {
					name: 'test_inserthtml_no_acf',
					config: {
						removePlugins: 'basicstyles'
					}
				}, function( bot ) {
					var editor = bot.editor;
					editor.focus();

					editor.insertHtml( '<em>A</em>B' );
					assert.areSame( '<p>AB</p>', bot.getData(), '<em> has been filtered out' );

					editor.insertHtml( '<em>C</em>D', 'unfiltered_html' );
					assert.areSame( '<p>AB<em>C</em>D</p>', bot.getData(), '<em> has been inserted' );
				} );
			},

			'test insertHtml uses editor.activeEnterMode': function() {
				bender.editorBot.create( {
					name: 'test_inserthtml_entermode',
					config: {
						allowedContent: true
					}
				}, function( bot ) {
					var editor = bot.editor,
						toHtml = 0,
						mode;

					editor.focus();

					editor.on( 'toHtml', function( evt ) {
						toHtml += 1;
						mode = evt.data.enterMode;
					} );

					editor.setActiveEnterMode( CKEDITOR.ENTER_BR );
					editor.insertHtml( 'foo' );
					assert.areSame( CKEDITOR.ENTER_BR, mode, 'dynamic enter mode was used - BR' );

					editor.setActiveEnterMode( null );
					editor.insertHtml( 'foo' );
					assert.areSame( CKEDITOR.ENTER_P, mode, 'dynamic enter mode was used - P' );

					// Just to be sure that test is correct.
					assert.areSame( 2, toHtml, 'toHtml was fired twice' );
				} );
			},

			'test insertHtml without focus': function() {
				bender.editorBot.create( {
					name: 'test_inserthtml_no_focus',
					config: {
						allowedContent: true
					}
				}, function( bot ) {
					bot.editor.insertHtml( '<p>foo</p>' );

					assert.areSame( '<p>foo</p>', bot.editor.getData(), 'HTML was inserted' );
				} );
			},

			'test insertText without focus': function() {
				bender.editorBot.create( {
					name: 'test_inserttext_no_focus',
					config: {
						allowedContent: true
					}
				}, function( bot ) {
					bot.editor.insertText( 'bar' );

					assert.areSame( '<p>bar</p>', bot.editor.getData(), 'text was inserted' );
				} );
			},

			'test insertHtml sets options.protectedWhitespaces of dP.toHtml': function() {
				var editor = this.editor;

				editor.once( 'toHtml', function( evt ) {
					assert.isTrue( evt.data.protectedWhitespaces );
				} );

				editor.insertHtml( '  foo  ' );
			},

			'test insertHtml with range': function() {
				var bot = this.editorBot,
					editor = this.editor;

				bot.setHtmlWithSelection( '<p id="p1">foo</p><p>bar^</p>' );

				var range = editor.createRange();
				range.setStartAfter( editor.document.getById( 'p1' ) );
				range.collapse( true );

				editor.insertHtml( '<p>bam</p>', 'html', range );

				assert.isInnerHtmlMatching( '<p id="p1">foo</p><p>bam^@</p><p>bar@</p>',
					bender.tools.selection.getWithHtml( editor ), { compareSelection: true, normalizeSelection: true } );
			}
		},

		// Add tests for (#2813).
		elementHtml = '<div>div</div>',
		methods = {
				'insertHtml': {
						data: elementHtml
					},
				'insertHtmlIntoRange': {
						data: elementHtml,
						range: true
					},
				'insertElement': {
						data: createElement
					},
				'insertElementIntoRange': {
						data: createElement,
						range: true
					},
				'insertText': {
						data: 'text',
						inside: true
					}
			},
		positions = {
				'start': {
						initial: '<span>{foo}bar</span>',
						msgEnd: 'starts at the beginning of span'
					},
				'end': {
						initial: '<span>foo{bar}</span>',
						msgEnd: 'ends at the end of span'
					},
				'cover': {
						initial: '<span>{foobar}</span>',
						msgEnd: 'covers span'
					}
			};

	for ( var methodKey in methods ) {
		for ( var positionKey in positions ) {
			( function() {
				var methodName = methodKey,
					positionName = positionKey,
					method = methods[ methodName ],
					position = positions[ positionName ],
					element = typeof method.data === 'function' && method.data(),
					data = element ? element.getOuterHtml() : method.data,
					regex = /{.*}/g,
					expected;

				if ( method.inside ) {
					expected = position.initial.replace( regex, data );
				} else {
					expected = position.initial.replace( regex, '' );

					if ( positionName === 'start' ) {
						expected = data + expected;
					} else if ( positionName === 'end' ) {
						expected += data;
					} else {
						expected = data;
					}
				}

				tests[ 'test ' + methodName + ' when selection ' + positions[ positionName ].msgEnd ] = function() {
					var editor = this.editorBot.editor,
						range;

					bender.tools.selection.setWithHtml( editor, position.initial );

					if ( method.range ) {
						range = editor.getSelection().getRanges()[ 0 ];
						editor.editable()[ methodName ]( element || data, range );
					} else {
						editor[ methodName ]( element || data );
					}

					// Paragraph is removed because of (#3011).
					assert.areSame( expected, editor.editable().getHtml().toLowerCase().replace( /(<br>|\s|\u200B|<p>.*<\/p>)/g, '' ) );
				};
			} )();
		}
	}

	bender.test( tests );

	function createElement() {
		return CKEDITOR.dom.element.createFromHtml( elementHtml );
	}
} )();
