/* bender-tags: tableselection, clipboard, 4.12.0, 547 */
/* bender-ckeditor-plugins: tableselection, clipboard, undo, toolbar, image */
/* bender-include: ../../_helpers/tableselection.js */

var dropListener,
	beforePasteListener,
	pasteListener,
	afterPasteListener;

CKEDITOR.disableAutoInline = true;

function drag( editor, evt ) {
	var dropTarget = CKEDITOR.plugins.clipboard.getDropTarget( editor ),
		dragEventCounter = 0;

	editor.once( 'dragstart', function( dragEvt ) {
		dragEventCounter++;

		assert.isInstanceOf( CKEDITOR.plugins.clipboard.dataTransfer, dragEvt.data.dataTransfer );
		assert.areSame( evt.$, dragEvt.data.$ );
		// Check that it's the mocked dragstart target created by the mockDropEvent().
		assert.areSame( CKEDITOR.NODE_TEXT, dragEvt.data.target.type, 'drag target node type' );
		assert.areSame( 'targetMock', dragEvt.data.target.getText(), 'drag target node' );
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

	range.setStart( config.dropContainer, config.dropOffset );
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
			values.dropRangeStartContainerMatch = config.dropContainer == dropEvt.data.dropRange.startContainer;
			values.dropRangeStartOffsetMatch = config.dropOffset == dropEvt.data.dropRange.startOffset;
		}
		values.dropNativeEventMatch = evt.$ == dropEvt.data.$;
		values.dropTarget = dropEvt.data.target;

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
		values.pasteDataText = evt.data.dataTransfer.getData( 'text/plain' ); //empty for <img/>
		values.pasteDataHtml = evt.data.dataTransfer.getData( 'text/html' );
		values.pasteMethod = evt.data.method;
		values.pasteDataType = evt.data.type;
		values.pasteDataValue = evt.data.dataValue;
	};

	afterPasteListener = function() {
		resume( function() {
			if ( !config.expectedDropPrevented ) {
				// Drop event asserts
				assert.areSame( 1, values.dropEventCounter, 'There should be always one drop.' );

				assert.isTrue( values.dropInstanceOfDataTransfer, 'On drop: dropEvt.data.dataTransfer should be instance of dataTransfer.' );
				if ( config.expectedText && isCustomDataTypesSupported ) {
					assert.areSame( config.expectedText, values.dropDataText, 'On drop: text data should match.' );
				}
				// if ( config.expectedHtml ) {
				// 	// isInnerHtmlMatching remove space from the end of strings we compare, adding 'x' fix this problem.
				// 	console.log( config.expectedHtml );
				// 	assert.isInnerHtmlMatching( 'x' + config.expectedHtml + 'x', 'x' + values.dropDataHtml + 'x', 'On drop: HTML data should match.' );
				// }
				assert.isTrue( values.dropRangeStartContainerMatch, 'On drop: drop range start container should match.' );
				assert.isTrue( values.dropRangeStartContainerMatch, 'On drop: drop range start offset should match.' );

				assert.isTrue( values.dropNativeEventMatch, 'On drop: native event should match.' );
				// Check that it's the mocked drop target created by the mockDropEvent().
				assert.areSame( CKEDITOR.NODE_TEXT, values.dropTarget.type, 'On drop: drop target node type should match.' );
				assert.areSame( 'targetMock', values.dropTarget.getText(), 'On drop: drop target should match.' );
			}

			// Paste event asserts
			assert.areSame( expectedBeforePasteEventCount, values.beforePasteEventCounter, 'Before paste event should be called ' + expectedBeforePasteEventCount + ' time(s).' );
			assert.areSame( expectedPasteEventCount, values.pasteEventCounter, 'Paste event should be called ' + expectedPasteEventCount + ' time(s)' );

			if ( expectedPasteEventCount > 0 ) {
				assert.areSame( config.expectedTransferType, values.pasteTransferType, 'On paste: transferType should match.' );
				// isInnerHtmlMatching remove space from the end of strings we compare, adding 'x' fix this problem.
				// assert.isInnerHtmlMatching( 'x' + config.expectedHtml + 'x', 'x' + values.pasteDataHtml + 'x', 'On paste: HTML data should match.' );
				// assert.areSame( 'drop', values.pasteMethod, 'On paste: method should be drop.' );
				// config.expectedDataType && assert.areSame( config.expectedDataType, values.pasteDataType, 'On paste: data type should match.' );
				// assert.isInnerHtmlMatching( 'x' + config.expectedDataValue + 'x', 'x' + values.pasteDataValue + 'x', 'On paste: data value should match.' );
			}

			if ( onFinish )
				return onFinish();
		} );
	};

	editor.on( 'drop', dropListener );
	editor.on( 'beforePaste', beforePasteListener );
	editor.on( 'paste', pasteListener );
	editor.on( 'afterPaste', afterPasteListener );

	if ( !expectedPasteEventCount || !config.expectedDataValue ) {
		setTimeout( afterPasteListener, 0 );
	}

	dropTarget.fire( 'drop', evt );

	wait();
}

( function() {
	'use strict';

	bender.editors = {
		classic: {}
	};
	var tests = {
		'test drop to header3': function( editor ) {
			var bot = bender.editorBots[ editor.name ],
				evt = bender.tools.mockDropEvent();

			bender.tools.testInputOut( 'test1', function( source, expected ) {
				bot.setHtmlWithSelection( source );

				drag( editor, evt );

				drop( editor, evt, {
					dropContainer: editor.editable().findOne( '.h1' ).getChild( 0 ),
					dropOffset: 7,
					expectedTransferType: CKEDITOR.DATA_TRANSFER_INTERNAL,
					expectedHtml: '<img alt="" src="https://cdn.emojics.com/v1.0.0/emojis/like/symbols/1f60a-color.png" style="height:100px; width:100px" />',
					expectedDataType: 'html',
					expectedDataValue: 'dolor'
				}, null, function() {
					assert.areSame( bender.tools.compatHtml( expected ), bot.getData( true ) );
				} );

			} );

		}

		/*

		'test drop to header2': function( editor ) {
			var bot = bender.editorBots[ editor.name ],
				evt = bender.tools.mockDropEvent();

			bot.setHtmlWithSelection( CKEDITOR.document.getById( 'editor' ).getValue() );
			editor.resetUndo();

			drag( editor, evt );

			drop( editor, evt, {
				dropContainer: editor.editable().findOne( '.h1' ).getChild( 0 ),
				dropOffset: 7,
				expectedTransferType: CKEDITOR.DATA_TRANSFER_INTERNAL,
				expectedText: 'dolor',
				expectedHtml: 'dolor',
				expectedDataType: 'html',
				expectedDataValue: 'dolor'
			}, null, function() {
				assert.areSame( '<h1 class="h1">Header1dolor^</h1><p>Lorem ipsum sit amet.</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );

				editor.execCommand( 'undo' );

				assert.areSame( '<h1 class="h1">Header1</h1><p>Lorem ipsum dolor sit amet.</p>', editor.getData(), 'after undo' );
			} );
		},

		'test drop to header': function( editor ) {
			var bot = bender.editorBots[ editor.name ],
				evt = bender.tools.mockDropEvent();

			bot.setHtmlWithSelection( CKEDITOR.document.getById( 'editor' ).getValue() );
			editor.resetUndo();

			drag( editor, evt );

			drop( editor, evt, {
				dropContainer: editor.editable().findOne( '.drop-target' ).getChild( 0 ),
				dropOffset: 0,
				expectedTransferType: CKEDITOR.DATA_TRANSFER_INTERNAL,
				expectedText: 'dolor',
				expectedHtml: 'dolor',
				expectedDataType: 'html',
				expectedDataValue: 'dolor'
			}, null, function() {
				assert.areSame( '<h1 class="h1">Header1dolor^</h1><p>Lorem ipsum sit amet.</p>', bender.tools.getHtmlWithSelection( editor ), 'after drop' );

				// editor.execCommand( 'undo' );

				// assert.areSame( '<h1 class="h1">Header1</h1><p>Lorem ipsum dolor sit amet.</p>', editor.getData(), 'after undo' );
			} );
		} */
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	bender.test( tests );
} )();
