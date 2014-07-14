/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: toolbar,clipboard,undo */

'use strict';

var setWithHtml = bender.tools.selection.setWithHtml,
	getWithHtml = bender.tools.selection.getWithHtml,
	htmlMatchOpts = {
		compareSelection: true,
		normalizeSelection: true,
		fixStyles: true
	},
	pasteListener,
	dropListener;

CKEDITOR.disableAutoInline = true;

function createDragDropEventMock() {
	return {
		$: {
			dataTransfer: {
				_dataTypes : [],

				// Emulate browsers native behavior for getDeta/setData.
				setData: function( type, data ) {
					this._dataTypes[ type ] = data;
				},
				getData: function( type ) {
					return this._dataTypes[ type ];
				}
			}
		},
		preventDefault: function() {
			// noop
		}
	}
}

function drag( editor, evt ) {
	var editable = editor.editable(),
		dropTarget = ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) || editable.isInline() ? editable : editor.document;

	dropTarget.fire( 'dragstart', evt );
}

function drop( editor, evt, config, onDrop, onPaste ) {
	var editable = editor.editable(),
		dropTarget = ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) || editable.isInline() ? editable : editor.document,
		range = new CKEDITOR.dom.range( editor.document ),
		pasteEventCounter = 0,
		dropEventCounter = 0,
		expectedPasteEventCount = typeof config.expectedPasteEventCount !== 'undefined' ?
			config.expectedPasteEventCount :
			1;

	range.setStart( config.element, config.offset );
	range.collapse( true );
	range.select();

	editor.focus();

	evt.testRange = range;

	pasteListener = function( evt ) {
		resume( function() {
			assert.areSame( config.expectedTransferType, evt.data.dataTransfer.getTransferType(), 'transferType' );
			// Do not check Text data on IE10+.
			if ( !CKEDITOR.env.ie || CKEDITOR.env.version < 10 ) {
				assert.areSame( config.expectedText, evt.data.dataTransfer.getData( 'text/plain' ), 'text data' );
			}
			// isInnerHtmlMatching remove space from the end of strings we compare, adding 'x' fix this problem.
			assert.isInnerHtmlMatching( 'x' + config.expectedHtml + 'x', 'x' + evt.data.dataTransfer.getData( 'text/html' ) + 'x', 'html data' );
			assert.areSame( CKEDITOR.CLIPBOARD_DROP, evt.data.method, 'method should be drop' );
			assert.areSame( config.expectedDataType, evt.data.type, 'data type' );
			assert.isInnerHtmlMatching( 'x' + config.expectedDataValue + 'x', 'x' + evt.data.dataValue + 'x', 'data value' );

			pasteEventCounter++;

			editor.once( 'afterPaste', function() {
				resume( finish );
			} );

			wait();
		} );
	};

	dropListener = function( dropEvt ) {
		resume( function() {
			dropEventCounter++;

			assert.isInstanceOf( CKEDITOR.plugins.clipboard.dataTransfer, dropEvt.data.dataTransfer );
			assert.areSame( config.element, dropEvt.data.dropRange.startContainer );
			assert.areSame( config.offset, dropEvt.data.dropRange.startOffset );
			assert.areSame( evt.$, dropEvt.data.nativeEvent );

			onDrop && onDrop( dropEvt );

			wait();
		} );
	};

	editor.on( 'drop', dropListener );
	editor.on( 'paste', pasteListener );

	if ( !expectedPasteEventCount ) {
		wait( finish, 300 );
	}

	// Ensure async.
	wait( function() {
		dropTarget.fire( 'drop', evt );
	} );

	function finish() {
		assert.areSame( expectedPasteEventCount, pasteEventCounter, 'paste event should be called ' + expectedPasteEventCount + ' time(s)' );
		assert.areSame( expectedPasteEventCount, dropEventCounter, 'There should be as many drop events as paste events.' );
		onPaste();
	}
}

var editors, editorBots,
	editorsDefinitions = {
		framed: {
			name: 'framed',
			creator: 'replace',
			config: {
				allowedContent: true
			}
		},
		inline: {
			name: 'inline',
			creator: 'inline',
			config: {
				allowedContent: true
			}
		},
		divarea: {
			name: 'divarea',
			creator: 'replace',
			config: {
				extraPlugins: 'divarea',
				allowedContent: true
			}
		},
		cross: {
			name: 'cross',
			creator: 'replace',
			config: {
				allowedContent: true
			}
		}
	},
	testsForMultipleEditor = {
		'tearDown': function() {
			CKEDITOR.plugins.clipboard.resetDragDataTransfer();

			editors.framed.removeListener( 'paste', pasteListener );
			editors.inline.removeListener( 'paste', pasteListener );
			editors.divarea.removeListener( 'paste', pasteListener );

			editors.framed.removeListener( 'drop', dropListener );
			editors.inline.removeListener( 'drop', dropListener );
			editors.divarea.removeListener( 'drop', dropListener );
		},

		'test drop to header': function( editor ) {
			var bot = editorBots[ editor.name ],
				evt = createDragDropEventMock();

			bot.setHtmlWithSelection( '<h1 id="h1">Header1</h1>' +
			'<p>Lorem ipsum [dolor] sit amet.</p>' );
			editor.resetUndo();

			drag( editor, evt );

			drop( editor, evt, {
				element: editor.document.getById( 'h1' ).getChild( 0 ),
				offset: 7,
				expectedTransferType: CKEDITOR.DATA_TRANSFER_INTERNAL,
				expectedText: 'dolor',
				expectedHtml: 'dolor',
				expectedDataType: 'html',
				expectedDataValue: 'dolor'
			}, null, function() {
				assert.areSame( '<h1 id="h1">Header1dolor^</h1><p>Lorem ipsum sit amet.</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );

				editor.execCommand( 'undo' );

				assert.areSame( '<h1 id="h1">Header1</h1><p>Lorem ipsum dolor sit amet.</p>', editor.getData(), 'after undo' );
			} );
		},

		'test drop the same line, before': function( editor ) {
			var bot = editorBots[ editor.name ],
				evt = createDragDropEventMock();

			bot.setHtmlWithSelection( '<p id="p">Lorem ipsum [dolor] sit amet.</p>' );
			editor.resetUndo();

			drag( editor, evt );

			drop( editor, evt, {
				element: editor.document.getById( 'p' ).getChild( 0 ),
				offset: 6,
				expectedTransferType: CKEDITOR.DATA_TRANSFER_INTERNAL,
				expectedText: 'dolor',
				expectedHtml: 'dolor',
				expectedDataType: 'html',
				expectedDataValue: 'dolor'
			}, null, function() {
				assert.areSame( '<p id="p">Lorem dolor^ipsum sit amet.</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );

				editor.execCommand( 'undo' );

				assert.areSame( '<p id="p">Lorem ipsum dolor sit amet.</p>', editor.getData(), 'after undo' );
			} );
		},

		'test drop the same line, after': function( editor ) {
			var bot = editorBots[ editor.name ],
				evt = createDragDropEventMock();

			bot.setHtmlWithSelection( '<p id="p">Lorem [ipsum] dolor sit amet.</p>' );
			editor.resetUndo();

			drag( editor, evt );

			drop( editor, evt, {
				element: editor.document.getById( 'p' ).getChild( 2 ),
				offset: 11,
				expectedTransferType: CKEDITOR.DATA_TRANSFER_INTERNAL,
				expectedText: 'ipsum',
				expectedHtml: 'ipsum',
				expectedDataType: 'html',
				expectedDataValue: 'ipsum'
			}, null, function() {
				assert.areSame( '<p id="p">Lorem dolor sit ipsum^amet.</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );

				editor.execCommand( 'undo' );

				assert.areSame( '<p id="p">Lorem ipsum dolor sit amet.</p>', editor.getData(), 'after undo' );
			} );
		},

		'test drop after range end': function( editor ) {
			var bot = editorBots[ editor.name ],
				evt = createDragDropEventMock();

			setWithHtml( editor, '<p id="p"><b>lor{em</b> ipsum} dolor sit amet.</p>' );
			editor.resetUndo();

			drag( editor, evt );

			drop( editor, evt, {
				// IE8 split text node anyway so we need different drop position there.
				element: CKEDITOR.env.ie && CKEDITOR.env.version == 8 ?
					editor.document.getById( 'p' ).getChild( 2 ) :
					editor.document.getById( 'p' ).getChild( 1 ),
				offset: CKEDITOR.env.ie && CKEDITOR.env.version == 8 ?
					11 :
					17,
				expectedTransferType: CKEDITOR.DATA_TRANSFER_INTERNAL,
				expectedText: 'em ipsum',
				expectedHtml: '<b>em</b> ipsum',
				expectedDataType: 'html',
				expectedDataValue: '<b>em</b> ipsum'
			}, null, function() {
				assert.isInnerHtmlMatching( '<p id="p"><b>lor</b> dolor sit <b>em</b> ipsum^amet.@</p>', getWithHtml( editor ), htmlMatchOpts, 'after drop' );

				editor.execCommand( 'undo' );

				assert.isInnerHtmlMatching( '<p id="p"><b>lorem</b> ipsum dolor sit ^amet.@</p>', getWithHtml( editor ), htmlMatchOpts, 'after undo' );
			} );
		},

		'test drop after paragraph': function( editor ) {
			var bot = editorBots[ editor.name ],
				evt = createDragDropEventMock();

			bot.setHtmlWithSelection( '<p id="p">Lorem [ipsum] dolor sit amet.</p>' );
			editor.resetUndo();

			drag( editor, evt );

			drop( editor, evt, {
				element: editor.document.getById( 'p' ).getChild( 2 ),
				offset: 16,
				expectedTransferType: CKEDITOR.DATA_TRANSFER_INTERNAL,
				expectedText: 'ipsum',
				expectedHtml: 'ipsum',
				expectedDataType: 'html',
				expectedDataValue: 'ipsum'
			}, null, function() {
				assert.areSame( '<p id="p">Lorem dolor sit amet.ipsum^</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );

				editor.execCommand( 'undo' );

				assert.areSame( '<p id="p">Lorem ipsum dolor sit amet.</p>', editor.getData(), 'after undo' );
			} );
		},

		'test drop on the left from paragraph': function( editor ) {
			var bot = editorBots[ editor.name ],
				evt = createDragDropEventMock();

			bot.setHtmlWithSelection( '<p id="p" style="margin-left: 20px">Lorem [ipsum] dolor sit amet.</p>' );
			editor.resetUndo();

			drag( editor, evt );

			drop( editor, evt, {
				element: editor.document.getById( 'p' ).getChild( 0 ),
				offset: 0,
				expectedTransferType: CKEDITOR.DATA_TRANSFER_INTERNAL,
				expectedText: 'ipsum',
				expectedHtml: 'ipsum',
				expectedDataType: 'html',
				expectedDataValue: 'ipsum'
			}, null, function() {
				assert.isInnerHtmlMatching( '<p id="p" style="margin-left:20px">ipsum^Lorem dolor sit amet.@</p>', getWithHtml( editor ), htmlMatchOpts, 'after drop' );

				editor.execCommand( 'undo' );

				assert.isInnerHtmlMatching( '<p id="p" style="margin-left:20px">Lorem ipsum dolor sit amet.@</p>', editor.getData(), htmlMatchOpts, 'after undo' );
			} );
		},

		'test drop text from external source': function( editor ) {
			var bot = editorBots[ editor.name ],
				evt = createDragDropEventMock();

			bot.setHtmlWithSelection( '<p id="p">Lorem ipsum sit amet.</p>' );
			editor.resetUndo();

			evt.$.dataTransfer.setData( 'Text', 'dolor' );

			drop( editor, evt, {
				element: editor.document.getById( 'p' ).getChild( 0 ),
				offset: 6,
				expectedTransferType: CKEDITOR.DATA_TRANSFER_EXTERNAL,
				expectedText: 'dolor',
				expectedHtml: '',
				expectedDataType: 'text',
				expectedDataValue: 'dolor'
			}, null, function() {
				assert.areSame( '<p id="p">Lorem dolor^ipsum sit amet.</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );

				editor.execCommand( 'undo' );

				assert.areSame( '<p id="p">Lorem ipsum sit amet.</p>', editor.getData(), 'after undo' );
			} );
		},

		'test drop html from external source': function( editor ) {
			var bot = editorBots[ editor.name ],
				evt = createDragDropEventMock();

			bot.setHtmlWithSelection( '<p id="p">Lorem ipsum sit amet.</p>' );
			editor.resetUndo();

			if ( CKEDITOR.env.ie ) {
				evt.$.dataTransfer.setData( 'Text', '<b>dolor</b>' );
			} else {
				evt.$.dataTransfer.setData( 'text/html', '<b>dolor</b>' );
			}

			drop( editor, evt, {
				element: editor.document.getById( 'p' ).getChild( 0 ),
				offset: 6,
				expectedTransferType: CKEDITOR.DATA_TRANSFER_EXTERNAL,
				expectedText: CKEDITOR.env.ie ? '<b>dolor</b>' : '',
				expectedHtml: CKEDITOR.env.ie ? '' : '<b>dolor</b>',
				expectedDataType: CKEDITOR.env.ie ? 'text' : 'html',
				expectedDataValue: CKEDITOR.env.ie ? '&lt;b&gt;dolor&lt;/b&gt;' : '<b>dolor</b>'
			}, null, function() {
				if ( CKEDITOR.env.ie ) {
					assert.areSame( '<p id="p">Lorem &lt;b&gt;dolor&lt;/b&gt;^ipsum sit amet.</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );
				} else {
					assert.areSame( '<p id="p">Lorem <b>dolor^</b>ipsum sit amet.</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );
				}

				editor.execCommand( 'undo' );

				assert.areSame( '<p id="p">Lorem ipsum sit amet.</p>', editor.getData(), 'after undo' );
			} );
		},

		'test drop empty element from external source': function( editor ) {
			var bot = editorBots[ editor.name ],
				evt = createDragDropEventMock();

			bot.setHtmlWithSelection( '<p id="p">Lorem ^ipsum sit amet.</p>' );
			editor.resetUndo();

			drop( editor, evt, {
				element: editor.document.getById( 'p' ).getChild( 0 ),
				offset: 6,
				expectedPasteEventCount: 0
			}, null, function() {
				assert.areSame( '<p id="p">Lorem ^ipsum sit amet.</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );
			} );
		},

		'test cross editor drop': function( editor ) {
			var bot = editorBots[ editor.name ],
				evt = createDragDropEventMock(),
				botCross = editorBots[ 'cross' ],
				editorCross = botCross.editor;

			setWithHtml( bot.editor, '<p id="p">{}Lorem ipsum sit amet.</p>' );
			setWithHtml( botCross.editor, '<p id="p">Lorem {ipsum <b>dolor</b> }sit amet.</p>' );
			bot.editor.resetUndo();
			botCross.editor.resetUndo();

			drag( editorCross, evt );

			drop( editor, evt, {
				element: editor.document.getById( 'p' ).getChild( 0 ),
				offset: 6,
				expectedTransferType: CKEDITOR.DATA_TRANSFER_CROSS_EDITORS,
				expectedText: 'ipsum dolor ',
				expectedHtml: 'ipsum <b>dolor</b> ',
				expectedDataType: 'html',
				expectedDataValue: 'ipsum <b>dolor</b> '
			}, null, function() {
				assert.areSame( '<p id="p">Lorem ipsum <b>dolor</b> ^ipsum sit amet.</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );
				assert.areSame( '<p id="p">Lorem sit amet.</p>', editorCross.getData(), 'after drop - editor cross' );

				editor.execCommand( 'undo' );
				editorCross.execCommand( 'undo' );

				assert.areSame( '<p id="p">Lorem ipsum sit amet.</p>', editor.getData(), 'after undo' );
				assert.areSame( '<p id="p">Lorem ipsum <b>dolor</b> sit amet.</p>', editorCross.getData(), 'after undo - editor cross' );
			} );
		},

		'test change drag and drop range on drop': function( editor ) {
			var bot = editorBots[ editor.name ],
				evt = createDragDropEventMock();

			bot.setHtmlWithSelection( '<p>x' +
				'<b id="drag1">x[drag1]x</b>x' +
				'<b id="drag2">drag2</b>x' +
				'<b id="drop1">drop1</b>x' +
				'<b id="drop2">drop2</b>x</p>' );
			editor.resetUndo();

			drag( editor, evt );

			drop( editor, evt, {
				element: editor.document.getById( 'drop1' ).getChild( 0 ),
				offset: 0
			}, function( evt ) {
				evt.data.dragRange.selectNodeContents( editor.document.getById( 'drag2' ) );
				evt.data.dropRange.setStart( editor.document.getById( 'drop2' ), 4 );
				evt.data.dropRange.collapse( true );
			}, function() {
				assert.areSame( '<p>x<b id="drag1">xdrag1x</b>xx<b id="drop1">drop1</b>x<b id="drop2">drop2</b>drag1^x</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );

				editor.execCommand( 'undo' );

				assert.areSame( '<p>x<b id="drag1">xdrag1x</b>x<b id="drag2">drag2</b>x<b id="drop1">drop1</b>x<b id="drop2">drop2</b>x</p>', editor.getData(), 'after undo' );
			} );
		}
	},
	testsForOneEditor = {
		'test fixIESplittedNodes': function() {
			var editor = editors.framed,
				bot = editorBots[ editor.name ],
				dragRange = editor.createRange(),
				dropRange = editor.createRange(),
				p, text;

			// Create DOM
			bot.setHtmlWithSelection( '<p id="p">lorem ipsum sit amet.</p>' );
			p = editor.document.getById( 'p' );

			// Set drag range.
			dragRange.setStart( p.getChild( 0 ), 11 );
			dragRange.collapse( true );

			// Break content like IE do.
			p.getChild( 0 ).setText( 'lorem' );
			text = new CKEDITOR.dom.text( ' ipsum sit amet.' );
			text.insertAfter( p.getChild( 0 ) );

			// Set drop range.
			dropRange.setStart( p, 1 );
			dropRange.collapse( true );

			// Fix nodes.
			CKEDITOR.plugins.clipboard.fixIESplitNodesAfterDrop( dragRange, dropRange );

			// Asserts.
			assert.areSame( 1, p.getChildCount() );
			dragRange.select();
			assert.isInnerHtmlMatching( '<p id="p">lorem ipsum^ sit amet\.@</p>', getWithHtml( editor ), htmlMatchOpts );
			dropRange.select();
			assert.isInnerHtmlMatching( '<p id="p">lorem^ ipsum sit amet.@</p>', getWithHtml( editor ), htmlMatchOpts );
		},

		'test isRangeBefore 1': function() {
			var editor = editors.framed,
				bot = editorBots[ editor.name ],
				firstRange = editor.createRange(),
				secondRange = editor.createRange(),
				p;

			// "Lorem[1] ipsum[2] sit amet."
			bot.setHtmlWithSelection( '<p id="p">Lorem ipsum sit amet.</p>' );
			p = editor.document.getById( 'p' );

			firstRange.setStart( p.getChild( 0 ), 5 );
			firstRange.collapse( true );

			secondRange.setStart( p.getChild( 0 ), 11 );
			secondRange.collapse( true );

			assert.isTrue( CKEDITOR.plugins.clipboard.isRangeBefore( firstRange, secondRange ) );
		},

		'test isRangeBefore 2': function() {
			var editor = editors.framed,
				bot = editorBots[ editor.name ],
				firstRange = editor.createRange(),
				secondRange = editor.createRange(),
				p, text;

			// "Lorem " [1] " ipsum" [2] "sit amet."
			bot.setHtmlWithSelection( '<p id="p">Lorem </p>' );
			p = editor.document.getById( 'p' );
			text = new CKEDITOR.dom.text( ' ipsum' );
			text.insertAfter( p.getChild( 0 ) );
			text = new CKEDITOR.dom.text( ' sit amet.' );
			text.insertAfter( p.getChild( 0 ) );

			firstRange.setStart( p, 1 );
			firstRange.collapse( true );

			secondRange.setStart( p, 2 );
			secondRange.collapse( true );

			assert.isTrue( CKEDITOR.plugins.clipboard.isRangeBefore( firstRange, secondRange ) );
		},

		'test isRangeBefore 3': function() {
			var editor = editors.framed,
				bot = editorBots[ editor.name ],
				firstRange = editor.createRange(),
				secondRange = editor.createRange(),
				p, text;

			// "Lorem[1] ipsum" [2] "sit amet."
			bot.setHtmlWithSelection( '<p id="p">Lorem ipsum</p>' );
			p = editor.document.getById( 'p' );
			text = new CKEDITOR.dom.text( ' sit amet.' );
			text.insertAfter( p.getChild( 0 ) );

			firstRange.setStart( p.getChild( 0 ), 5 );
			firstRange.collapse( true );

			secondRange.setStart( p, 1 );
			secondRange.collapse( true );

			assert.isTrue( CKEDITOR.plugins.clipboard.isRangeBefore( firstRange, secondRange ) );
		}
	};

bender.tools.setUpEditors( editorsDefinitions, function( e, eb ) {
	editors = e;
	editorBots = eb;

	for ( var name in editors ) {
		editors[ name ].dataProcessor.writer.sortAttributes = true;
	}

	bender.test( CKEDITOR.tools.extend(
		bender.tools.createTestsForEditors(
			[ editors.framed, editors.inline, editors.divarea ],
			testsForMultipleEditor ),
		testsForOneEditor )
	);
} );