/* bender-tags: editor,unit,clipboard */
/* bender-ckeditor-plugins: toolbar,clipboard,undo */
/* bender-include: _helpers/pasting.js */

'use strict';

var setWithHtml = bender.tools.selection.setWithHtml,
	getWithHtml = bender.tools.selection.getWithHtml,
	htmlMatchOpts = {
		compareSelection: true,
		normalizeSelection: true,
		fixStyles: true
	},
	beforePasteListener,
	pasteListener,
	dropListener,
	finishListener;

CKEDITOR.disableAutoInline = true;

function drag( editor, evt ) {
	var dropTarget = CKEDITOR.plugins.clipboard.getDropTarget( editor ),
		dragEventCounter = 0;

	editor.once( 'dragstart', function( dragEvt ) {
		dragEventCounter++;

		assert.isInstanceOf( CKEDITOR.plugins.clipboard.dataTransfer, dragEvt.data.dataTransfer );
		assert.areSame( evt.$, dragEvt.data.$ );
		assert.areSame( 'targetMock', dragEvt.data.target.$ );
	} );

	dropTarget.fire( 'dragstart', evt );

	assert.areSame( 1, dragEventCounter, 'dragstart event should be called.' );
}

function drop( editor, evt, config, onDrop, onFinish ) {
	var isCustomDataTypesSupported = CKEDITOR.plugins.clipboard.isCustomDataTypesSupported,
		dropTarget = CKEDITOR.plugins.clipboard.getDropTarget( editor ),
		range = new CKEDITOR.dom.range( editor.document ),
		values = { beforePasteEventCounter: 0, pasteEventCounter: 0, dropEventCounter: 0 },
		expectedPasteEventCount = typeof config.expectedPasteEventCount !== 'undefined' ? config.expectedPasteEventCount : 1,
		expectedBeforePasteEventCount = typeof config.expectedBeforePasteEventCount !== 'undefined' ? config.expectedBeforePasteEventCount : expectedPasteEventCount;

	range.setStart( config.element, config.offset );
	range.collapse( true );
	range.select();

	editor.focus();

	evt.testRange = range;

	dropListener = function( dropEvt ) {
		values.dropEventCounter++;
		values.dropInstanceOfDataTransfer = dropEvt.data.dataTransfer instanceof CKEDITOR.plugins.clipboard.dataTransfer;
		values.dropDataText = dropEvt.data.dataTransfer.getData( 'text/plain' );
		values.dropDataHtml = dropEvt.data.dataTransfer.getData( 'text/html' );
		if ( CKEDITOR.env.ie && CKEDITOR.env.version == 8 ) {
			// IE8 modify drop range so we check only if start container and offset exists.
			values.dropRangeStartContainerMatch = !!dropEvt.data.dropRange.startContainer;
			values.dropRangeStartOffsetMatch = !!dropEvt.data.dropRange.startOffset;
		} else {
			values.dropRangeStartContainerMatch = config.element == dropEvt.data.dropRange.startContainer;
			values.dropRangeStartOffsetMatch = config.offset == dropEvt.data.dropRange.startOffset;
		}
		values.dropNativeEventMatch = evt.$ == dropEvt.data.$;
		values.dropTarget = dropEvt.data.target.$;

		if ( onDrop ) {
			return onDrop( dropEvt );
		}
	};

	beforePasteListener = function() {
		values.beforePasteEventCounter++;
	};

	pasteListener = function( evt ) {
		values.pasteEventCounter++;
		values.pasteTransferType = evt.data.dataTransfer.getTransferType( evt.editor );
		values.pasteDataText = evt.data.dataTransfer.getData( 'text/plain' );
		values.pasteDataHtml = evt.data.dataTransfer.getData( 'text/html' );
		values.pasteMethod = evt.data.method;
		values.pasteDataType = evt.data.type;
		values.pasteDataValue = evt.data.dataValue;
	};

	finishListener = function() {
		resume( function() {
			// Drop event asserts
			assert.areSame( 1, values.dropEventCounter, 'There should be always one drop.' );
			assert.isTrue( values.dropInstanceOfDataTransfer, 'On drop: dropEvt.data.dataTransfer should be instance of dataTransfer.' );
			if ( config.expectedText && isCustomDataTypesSupported ) {
				assert.areSame( config.expectedText, values.dropDataText, 'On drop: text data should match.' );
			}
			if ( config.expectedHtml ) {
				// isInnerHtmlMatching remove space from the end of strings we compare, adding 'x' fix this problem.
				assert.isInnerHtmlMatching( 'x' + config.expectedHtml + 'x', 'x' + values.dropDataHtml + 'x', 'On drop: HTML data should match.' );
			}
			assert.isTrue( values.dropRangeStartContainerMatch, 'On drop: drop range start container should match.' );
			assert.isTrue( values.dropRangeStartContainerMatch, 'On drop: drop range start offset should match.' );

			assert.isTrue( values.dropNativeEventMatch, 'On drop: native event should match.' );
			assert.areSame( 'targetMock', values.dropTarget, 'On drop: drop target should match.' );

			// Paste event asserts
			assert.areSame( expectedBeforePasteEventCount, values.beforePasteEventCounter, 'Before paste event should be called ' + expectedBeforePasteEventCount + ' time(s).' );
			assert.areSame( expectedPasteEventCount, values.pasteEventCounter, 'Paste event should be called ' + expectedPasteEventCount + ' time(s)' );

			if ( expectedPasteEventCount > 0 ) {
				assert.areSame( config.expectedTransferType, values.pasteTransferType, 'On paste: transferType should match.' );
				// Do not check Text data on IE.
				if ( isCustomDataTypesSupported ) {
					assert.areSame( config.expectedText, values.pasteDataText, 'On paste: text data should match.' );
				}
				// isInnerHtmlMatching remove space from the end of strings we compare, adding 'x' fix this problem.
				assert.isInnerHtmlMatching( 'x' + config.expectedHtml + 'x', 'x' + values.pasteDataHtml + 'x', 'On paste: HTML data should match.' );
				assert.areSame( 'drop', values.pasteMethod, 'On paste: method should be drop.' );
				config.expectedDataType && assert.areSame( config.expectedDataType, values.pasteDataType, 'On paste: data type should match.' );
				assert.isInnerHtmlMatching( 'x' + config.expectedDataValue + 'x', 'x' + values.pasteDataValue + 'x', 'On paste: data value should match.' );
			}

			if ( onFinish )
				return onFinish();
		} );
	};

	editor.on( 'drop', dropListener );
	editor.on( 'beforePaste', beforePasteListener );
	editor.on( 'paste', pasteListener );
	editor.on( 'afterPaste', finishListener );

	if ( !expectedPasteEventCount || !config.expectedDataValue ) {
		setTimeout( finishListener, 0 );
	}

	dropTarget.fire( 'drop', evt );

	wait();
}

bender.editors = {
	framed: {
		name: 'framed',
		creator: 'replace',
		config: {
			allowedContent: true,
			// Disable pasteFilter on Webkits (pasteFilter defaults semantic-text on Webkits).
			pasteFilter: null
		}
	},
	inline: {
		name: 'inline',
		creator: 'inline',
		config: {
			allowedContent: true,
			// Disable pasteFilter on Webkits (pasteFilter defaults semantic-text on Webkits).
			pasteFilter: null
		}
	},
	divarea: {
		name: 'divarea',
		creator: 'replace',
		config: {
			extraPlugins: 'divarea',
			allowedContent: true,
			// Disable pasteFilter on Webkits (pasteFilter defaults semantic-text on Webkits).
			pasteFilter: null
		}
	},
	cross: {
		name: 'cross',
		creator: 'replace',
		config: {
			allowedContent: true,
			// Disable pasteFilter on Webkits (pasteFilter defaults semantic-text on Webkits).
			pasteFilter: null
		}
	}
};

var testsForMultipleEditor = {
		tearDown: function() {
			CKEDITOR.plugins.clipboard.resetDragDataTransfer();

			for ( var name in this.editors ) {
				this.editors[ name ].removeListener( 'paste', pasteListener );
				this.editors[ name ].removeListener( 'drop', dropListener );
				this.editors[ name ].removeListener( 'afterPaste', finishListener );
			}
		},

		'test drop to header': function( editor ) {
			var bot = bender.editorBots[ editor.name ],
				evt = bender.tools.mockDropEvent();

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
			var bot = bender.editorBots[ editor.name ],
				evt = bender.tools.mockDropEvent();

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
			var bot = bender.editorBots[ editor.name ],
				evt = bender.tools.mockDropEvent();

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
			var evt = bender.tools.mockDropEvent();

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
			var bot = bender.editorBots[ editor.name ],
				evt = bender.tools.mockDropEvent();

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
			var bot = bender.editorBots[ editor.name ],
				evt = bender.tools.mockDropEvent();

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

		// Integration test (#12806).
		'test drop part of the link': function( editor ) {
			var bot = bender.editorBots[ editor.name ],
				evt = bender.tools.mockDropEvent();

			bot.setHtmlWithSelection( '<p id="p" style="margin-left: 20px"><a href="foo">Lorem [ipsum] dolor</a> sit amet.</p>' );
			editor.resetUndo();

			drag( editor, evt );

			drop( editor, evt, {
				element: editor.document.getById( 'p' ).getChild( 1 ),
				offset: 4,
				expectedTransferType: CKEDITOR.DATA_TRANSFER_INTERNAL,
				expectedText: 'ipsum',
				expectedHtml: '<a href="foo">ipsum</a>',
				expectedDataType: 'html',
				expectedDataValue: '<a href="foo">ipsum</a>'
			}, null, function() {
				assert.isInnerHtmlMatching(
					'<p id="p" style="margin-left:20px"><a href="foo">Lorem dolor</a> sit<a data-cke-saved-href="foo" href="foo">' +
					'ipsum' + ( ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) ? '</a>^' : '^</a>' ) + ' amet.@</p>',
					getWithHtml( editor ), htmlMatchOpts, 'after drop' );
			} );
		},

		'test drop text from external source': function( editor ) {
			var bot = bender.editorBots[ editor.name ],
				evt = bender.tools.mockDropEvent();

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

				assert.isNull( CKEDITOR.plugins.clipboard.dragData, 'dragData should be reset' );
			} );
		},

		'test drop html from external source': function( editor ) {
			var isCustomDataTypesSupported = CKEDITOR.plugins.clipboard.isCustomDataTypesSupported,
				bot = bender.editorBots[ editor.name ],
				evt = bender.tools.mockDropEvent();

			bot.setHtmlWithSelection( '<p id="p">Lorem ipsum sit amet.</p>' );
			editor.resetUndo();

			if ( isCustomDataTypesSupported ) {
				evt.$.dataTransfer.setData( 'text/html', '<b>dolor</b>' );
			} else {
				evt.$.dataTransfer.setData( 'Text', '<b>dolor</b>' );
			}

			drop( editor, evt, {
				element: editor.document.getById( 'p' ).getChild( 0 ),
				offset: 6,
				expectedTransferType: CKEDITOR.DATA_TRANSFER_EXTERNAL,
				expectedText: !isCustomDataTypesSupported ? '<b>dolor</b>' : '',
				expectedHtml: !isCustomDataTypesSupported ? '' : '<b>dolor</b>',
				expectedDataType: !isCustomDataTypesSupported ? 'text' : 'html',
				expectedDataValue: !isCustomDataTypesSupported ? '&lt;b&gt;dolor&lt;/b&gt;' : '<b>dolor</b>'
			}, null, function() {
				if ( isCustomDataTypesSupported ) {
					assert.areSame( '<p id="p">Lorem <b>dolor^</b>ipsum sit amet.</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );
				} else {
					assert.areSame( '<p id="p">Lorem &lt;b&gt;dolor&lt;/b&gt;^ipsum sit amet.</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );
				}

				editor.execCommand( 'undo' );

				assert.areSame( '<p id="p">Lorem ipsum sit amet.</p>', editor.getData(), 'after undo' );

				assert.isNull( CKEDITOR.plugins.clipboard.dragData, 'dragData should be reset' );
			} );
		},

		'test drop empty element from external source': function( editor ) {
			var bot = bender.editorBots[ editor.name ],
				evt = bender.tools.mockDropEvent();

			bot.setHtmlWithSelection( '<p id="p">Lorem ^ipsum sit amet.</p>' );
			editor.resetUndo();

			drop( editor, evt, {
				element: editor.document.getById( 'p' ).getChild( 0 ),
				offset: 6,
				expectedBeforePasteEventCount: 1,
				expectedPasteEventCount: 0
			}, null, function() {
				assert.areSame( '<p id="p">Lorem ^ipsum sit amet.</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );

				assert.isNull( CKEDITOR.plugins.clipboard.dragData, 'dragData should be reset' );
			} );
		},

		'test cross editor drop': function( editor ) {
			var bot = bender.editorBots[ editor.name ],
				evt = bender.tools.mockDropEvent(),
				botCross = bender.editorBots.cross,
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
			var bot = bender.editorBots[ editor.name ],
				evt = bender.tools.mockDropEvent();

			bot.setHtmlWithSelection( '<p>x' +
				'<b id="drag1">x[drag1]x</b>x' +
				'<b id="drag2">drag2</b>x' +
				'<b id="drop1">drop1</b>x' +
				'<b id="drop2">drop2</b>x</p>' );
			editor.resetUndo();

			drag( editor, evt );

			drop( editor, evt, {
				element: editor.document.getById( 'drop1' ).getChild( 0 ),
				offset: 0,
				expectedTransferType: CKEDITOR.DATA_TRANSFER_INTERNAL,
				expectedText: 'drag1',
				expectedHtml: '<b id="drag1">drag1</b>',
				expectedDataType: 'html',
				expectedDataValue: '<b id="drag1">drag1</b>'
			}, function( evt ) {
				if ( !( CKEDITOR.env.ie && CKEDITOR.env.version == 8 ) && !CKEDITOR.env.safari ) {
					assert.areSame( editor.document.getById( 'drag1' ), evt.data.dragRange.startContainer, 'dropRange.startContainer' );
					assert.areSame( 1, evt.data.dragRange.startOffset, 'dropRange.startOffset' );
				}

				evt.data.dragRange.selectNodeContents( editor.document.getById( 'drag2' ) );
				evt.data.dropRange.setStart( editor.document.getById( 'drop2' ), 4 );
				evt.data.dropRange.collapse( true );
			}, function() {
				assert.areSame( '<p>x<b id="drag1">xdrag1x</b>xx<b id="drop1">drop1</b>x<b id="drop2">drop2</b><b id="drag1">drag1^</b>x</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );

				editor.execCommand( 'undo' );

				assert.areSame( '<p>x<b id="drag1">xdrag1x</b>x<b id="drag2">drag2</b>x<b id="drop1">drop1</b>x<b id="drop2">drop2</b>x</p>', editor.getData(), 'after undo' );
			} );
		},

		'test cancel drop': function( editor ) {
			var bot = bender.editorBots[ editor.name ],
				evt = bender.tools.mockDropEvent();

			bot.setHtmlWithSelection( '<p id="p">^foo</p>' );
			editor.resetUndo();

			drag( editor, evt );

			drop( editor, evt, {
				element: editor.document.getById( 'p' ).getChild( 0 ),
				offset: 0,
				expectedPasteEventCount: 0
			}, function() {
				return false;
			}, function() {
				assert.areSame( '<p id="p">^foo</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );
			} );
		}
	},
	testsForOneEditor = {
		'init': function() {
			for ( var name in this.editors ) {
				this.editors[ name ].dataProcessor.writer.sortAttributes = true;
			}
		},

		'editable drop fires editor drop': function() {
			var editor = this.editors.framed,
				dropTarget = CKEDITOR.plugins.clipboard.getDropTarget( editor ),
				listener = sinon.stub().returns( false ),
				evt = bender.tools.mockDropEvent();

			editor.once( 'drop', listener, null, null, -1 );

			// dropRange must be not null.
			evt.testRange = {};

			dropTarget.fire( 'drop', evt );

			assert.isTrue( listener.calledOnce );
		},

		'editable dragstart fires editor dragstart': function() {
			var editor = this.editors.framed,
				dropTarget = CKEDITOR.plugins.clipboard.getDropTarget( editor ),
				listener = sinon.stub().returns( false );

			editor.once( 'dragstart', listener, null, null, -1 );

			dropTarget.fire( 'dragstart', bender.tools.mockDropEvent() );

			assert.isTrue( listener.calledOnce );
		},

		'editable dragend fires editor dragend': function() {
			var editor = this.editors.framed,
				dropTarget = CKEDITOR.plugins.clipboard.getDropTarget( editor ),
				listener = sinon.stub().returns( false );

			editor.once( 'dragend', listener, null, null, -1 );

			dropTarget.fire( 'dragend', bender.tools.mockDropEvent() );

			assert.isTrue( listener.calledOnce );
		},

		'test fixIESplittedNodes': function() {
			var editor = this.editors.framed,
				bot = this.editorBots[ editor.name ],
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
			assert.isInnerHtmlMatching( '<p id="p">lorem ipsum^ sit amet.@</p>', getWithHtml( editor ), htmlMatchOpts );
			dropRange.select();
			assert.isInnerHtmlMatching( '<p id="p">lorem^ ipsum sit amet.@</p>', getWithHtml( editor ), htmlMatchOpts );
		},

		'test isDropRangeAffectedByDragRange 1': function() {
			var editor = this.editors.framed,
				bot = this.editorBots[ editor.name ],
				dragRange = editor.createRange(),
				dropRange = editor.createRange(),
				p;

			// "Lorem[1] ipsum[2] sit amet."
			bot.setHtmlWithSelection( '<p id="p">Lorem ipsum sit amet.</p>' );
			p = editor.document.getById( 'p' );

			dragRange.setStart( p.getChild( 0 ), 5 );
			dragRange.collapse( true );

			dropRange.setStart( p.getChild( 0 ), 11 );
			dropRange.collapse( true );

			assert.isTrue( CKEDITOR.plugins.clipboard.isDropRangeAffectedByDragRange( dragRange, dropRange ) );
		},

		'test isDropRangeAffectedByDragRange 2': function() {
			var editor = this.editors.framed,
				bot = this.editorBots[ editor.name ],
				dragRange = editor.createRange(),
				dropRange = editor.createRange(),
				p, text;

			// "Lorem " [1] " ipsum" [2] "sit amet."
			bot.setHtmlWithSelection( '<p id="p">Lorem </p>' );
			p = editor.document.getById( 'p' );
			text = new CKEDITOR.dom.text( ' ipsum' );
			text.insertAfter( p.getChild( 0 ) );
			text = new CKEDITOR.dom.text( ' sit amet.' );
			text.insertAfter( p.getChild( 0 ) );

			dragRange.setStart( p, 1 );
			dragRange.collapse( true );

			dropRange.setStart( p, 2 );
			dropRange.collapse( true );

			assert.isTrue( CKEDITOR.plugins.clipboard.isDropRangeAffectedByDragRange( dragRange, dropRange ) );
		},

		'test isDropRangeAffectedByDragRange 3': function() {
			var editor = this.editors.framed,
				bot = this.editorBots[ editor.name ],
				dragRange = editor.createRange(),
				dropRange = editor.createRange(),
				p, text;

			// "Lorem[1] ipsum" [2] "sit amet."
			bot.setHtmlWithSelection( '<p id="p">Lorem ipsum</p>' );
			p = editor.document.getById( 'p' );
			text = new CKEDITOR.dom.text( ' sit amet.' );
			text.insertAfter( p.getChild( 0 ) );

			dragRange.setStart( p.getChild( 0 ), 5 );
			dragRange.collapse( true );

			dropRange.setStart( p, 1 );
			dropRange.collapse( true );

			assert.isTrue( CKEDITOR.plugins.clipboard.isDropRangeAffectedByDragRange( dragRange, dropRange ) );
		},

		'test isDropRangeAffectedByDragRange 4': function() {
			var editor = this.editors.framed,
				bot = this.editorBots[ editor.name ],
				dragRange = editor.createRange(),
				dropRange = editor.createRange(),
				p, text;

			// <p> [2] "Lorem[1] ipsum" "sit amet." </p>
			bot.setHtmlWithSelection( '<p id="p">Lorem ipsum</p>' );
			p = editor.document.getById( 'p' );
			text = new CKEDITOR.dom.text( ' sit amet.' );
			text.insertAfter( p.getChild( 0 ) );

			dragRange.setStart( p.getChild( 0 ), 5 );
			dragRange.collapse( true );

			dropRange.setStart( p, 0 );
			dropRange.collapse( true );

			assert.isFalse( CKEDITOR.plugins.clipboard.isDropRangeAffectedByDragRange( dragRange, dropRange ) );
		},

		'test isDropRangeAffectedByDragRange adjacent positions (#13140)': function() {
			var editor = this.editors.framed,
				bot = this.editorBots[ editor.name ],
				dragRange = editor.createRange(),
				dropRange = editor.createRange(),
				div;

			bot.setHtmlWithSelection( '<div><p id="foo">foo</p><p id="bar">bar</p></div>' );
			div = editor.document.findOne( 'div' );

			dragRange.setStart( div, 1 );
			dragRange.setEnd( div, 2 );

			dropRange.setStart( div, 2 );
			dropRange.setEnd( div, 2 );

			assert.isTrue( CKEDITOR.plugins.clipboard.isDropRangeAffectedByDragRange( dragRange, dropRange ) );
		},

		'test dragEnd event': function() {
			var editor = this.editors.inline,
				bot = this.editorBots[ editor.name ],
				editable = editor.editable(),
				evt = {},
				dragendCount = 0;

			evt.data = bender.tools.mockDropEvent();

			bot.setHtmlWithSelection( '' );

			CKEDITOR.plugins.clipboard.initDragDataTransfer( evt );
			evt.data.$.dataTransfer.setData( 'Text', 'foo' );

			editor.once( 'dragend', function( dragendEvt ) {
				dragendCount++;

				assert.areSame( 'foo', dragendEvt.data.dataTransfer.getData( 'Text' ), 'cke/custom' );
				assert.areSame( evt.data.$, dragendEvt.data.$, 'nativeEvent' );
				assert.areSame( 'targetMock', dragendEvt.data.target.$, 'target' );
			} );

			editable.fire( 'dragend', evt.data );

			assert.areSame( 1, dragendCount, 'dragend should be fired once.' );
			assert.isNull( CKEDITOR.plugins.clipboard.dragData, 'dragData should be reset' );
		},

		'test dragEnd event - preventDefault': function() {
			var editor = this.editors.inline,
				bot = this.editorBots[ editor.name ],
				editable = editor.editable(),
				evt = {},
				dragendCount = 0;

			evt.data = bender.tools.mockDropEvent();

			bot.setHtmlWithSelection( '' );

			CKEDITOR.plugins.clipboard.initDragDataTransfer( evt );

			editor.once( 'dragend', function() {
				dragendCount++;

				return false;
			} );

			editable.fire( 'dragend', evt.data );

			assert.areSame( 1, dragendCount, 'dragend should be fired once.' );
			assert.isInstanceOf( CKEDITOR.plugins.clipboard.dataTransfer, CKEDITOR.plugins.clipboard.dragData, 'dragData should be not reset' );
		},

		'test dragStart preventDefault': function() {
			var editor = this.editors.inline,
				bot = this.editorBots[ editor.name ],
				evt = bender.tools.mockDropEvent(),
				preventDefaultCount = 0;

			bot.setHtmlWithSelection( '' );

			editor.once( 'dragstart', function() {
				return false;
			}, null, null, 100 );

			evt.preventDefault = function() {
				preventDefaultCount++;
			};

			drag( editor, evt );

			assert.areSame( 1, preventDefaultCount, 'preventDefault should be called' );
		},

		'test set custom data on dragStart': function() {
			var editor = this.editors.inline,
				editable = editor.editable(),
				bot = this.editorBots[ editor.name ],
				evt = bender.tools.mockDropEvent(),
				dragstartData, dropData, dragendData;

			bot.setHtmlWithSelection( '<p id="p">^foo</p>' );
			editor.resetUndo();

			editor.once( 'dragstart', function( evt ) {
				evt.data.dataTransfer.setData( 'cke/custom', 'foo' );
				dragstartData = evt.data.dataTransfer.getData( 'cke/custom' );
			} );

			editor.on( 'drop', function( evt ) {
				dropData = evt.data.dataTransfer.getData( 'cke/custom' );
			} );

			editor.once( 'dragend', function( evt ) {
				dragendData = evt.data.dataTransfer.getData( 'cke/custom' );
			} );

			drag( editor, evt );

			drop( editor, evt, {
				element: editor.document.getById( 'p' ).getChild( 0 ),
				offset: 0,
				expectedPasteEventCount: 0
			}, function() {
				return false;
			}, function() {
				editor.focus();
				editable.fire( 'dragend', evt );

				assert.areSame( 'foo', dragstartData, 'dragstartData' );
				assert.areSame( 'foo', dropData, 'dropData' );
				assert.areSame( 'foo', dragendData, 'dragendData' );
			} );
		},

		'test drop block element at the same position': function() {
			var editor = this.editors.framed,
				evt = bender.tools.mockDropEvent();

			bender.tools.selection.setWithHtml(
				editor,
				'<p>x</p>' +
				'[<p id="middle" contenteditable="false">middle</p>]' +
				'<p>y</p>'
			);

			drag( editor, evt );
			drop( editor, evt, {
				element: editor.editable(),
				offset: 2,
				expectedPasteEventCount: 0
			}, function() {
				return false;
			}, function() {
				assert.isInnerHtmlMatching(
					'<p>x</p><p contenteditable="false" id="middle">middle</p><p>y</p>',
					editor.editable().getHtml()
				);
			} );
		},

		'test set custom data on drop': function() {
			var editor = this.editors.inline,
				editable = editor.editable(),
				bot = this.editorBots[ editor.name ],
				evt = bender.tools.mockDropEvent(),
				dragstartData, dropData, dragendData;

			bot.setHtmlWithSelection( '<p id="p">^foo</p>' );
			editor.resetUndo();

			editor.once( 'dragstart', function( evt ) {
				dragstartData = evt.data.dataTransfer.getData( 'cke/custom' );
			} );

			editor.once( 'drop', function( evt ) {
				evt.data.dataTransfer.setData( 'cke/custom', 'foo' );
				dropData = evt.data.dataTransfer.getData( 'cke/custom' );
			} );

			editor.once( 'dragend', function( evt ) {
				dragendData = evt.data.dataTransfer.getData( 'cke/custom' );
			} );

			drag( editor, evt );

			drop( editor, evt, {
				element: editor.document.getById( 'p' ).getChild( 0 ),
				offset: 0,
				expectedPasteEventCount: 0
			}, function() {
				return false;
			}, function() {
				editor.focus();
				editable.fire( 'dragend', evt );

				assert.areSame( '', dragstartData, 'dragstartData' );
				assert.areSame( 'foo', dropData, 'dropData' );
				assert.areSame( 'foo', dragendData, 'dragendData' );
			} );
		},

		'test cancel beforePaste': function() {
			var editor = this.editors.inline,
				bot = this.editorBots[ editor.name ],
				evt = bender.tools.mockDropEvent();

			bot.setHtmlWithSelection( '<p id="p">^foo</p>' );
			editor.resetUndo();

			editor.once( 'beforePaste', function() {
				return false;
			}, null, null, 11 );

			drag( editor, evt );

			drop( editor, evt, {
				element: editor.document.getById( 'p' ).getChild( 0 ),
				offset: 0,
				expectedBeforePasteEventCount: 1,
				expectedPasteEventCount: 0
			} );
		}
	};

bender.test(
	CKEDITOR.tools.extend(
		bender.tools.createTestsForEditors(
			[ 'framed', 'inline', 'divarea' ], testsForMultipleEditor
		), testsForOneEditor
	)
);
