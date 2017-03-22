/* exported assertPasteEvent, pasteFiles, assertPasteCommand, assertPasteNotification */

'use strict';

function assertPasteEvent( editor, eventData, expected, message, async, skipCancel ) {
	var priority = 999,
		executed = false;

	message = message ? message + ' - ' : '';

	// Listener's priority can be specified.
	if ( 'priority' in expected ) {
		priority = expected.priority;
		delete expected.priority;
	}

	// Type doesn't have to be specified.
	if ( !eventData.type )
		eventData.type = 'auto';

	eventData.method = 'paste';
	// Allow passing a dataTransfer mock.
	if ( !eventData.dataTransfer ) {
		eventData.dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer();
	}

	editor.once( 'paste', onPaste, null, null, priority );
	editor.fire( 'paste', eventData );

	if ( async )
		wait();
	else
		assert.isTrue( executed, message + 'paste listener was executed' );

	function assertPaste( data ) {
		if ( typeof expected == 'function' )
			expected( data, message );
		else {
			// Compare all expected values.
			for ( var name in expected )
				assert.areSame( expected[ name ], data[ name ], message + 'data.' + name );
		}
	}

	function onPaste( evt ) {
		var data = evt.data;
		evt.removeListener();

		if ( !skipCancel ) {
			evt.cancel(); // Cancel for performance reason - we don't need insertion happen.
		}

		executed = true;

		if ( async )
			resume( function() {
				assertPaste( data );
			} );
		else
			assertPaste( data );
	}
}

function pasteFiles( editor, files, dataValue ) {
	var	nativeData = bender.tools.mockNativeDataTransfer();

	nativeData.files = files;

	var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

	editor.fire( 'paste', {
		dataTransfer: dataTransfer,
		dataValue: dataValue ? dataValue : ''
	} );
}

function mockGetClipboardData( editor, pasteData ) {
	var oldGetClipboardData = editor.getClipboardData;

	editor.getClipboardData = function( options, callback ) {
		if ( !callback ) {
			callback = options;
		}

		if ( pasteData.prevent ) {
			callback( null );
		} else {
			callback( {
				dataValue: pasteData.dataValue,
				dataTransfer: pasteData.dataTransfer || ( new CKEDITOR.plugins.clipboard.dataTransfer() )
			} );
		}

		editor.getClipboardData = oldGetClipboardData;
	};
}

function simulatePasteCommand( editor, cmdData, pasteData, callback ) {
	mockGetClipboardData( editor, pasteData );

	editor.once( pasteData.prevent ? 'afterCommandExec' : 'paste', function( evt ) {
		resume( function() {

			callback( evt );
		} );
	}, null, null, pasteData.priority || 1000 );

	editor.execCommand( cmdData.name || 'paste', cmdData );
	wait();
}

function assertPasteCommand( editor, expected, cmdData, pasteData ) {
	simulatePasteCommand( editor, cmdData, pasteData, function( evt ) {
		assert.areSame( expected.type, evt.data.type, 'Paste event has correct data type.' );
		assert.areSame( expected.content, editor.getData(), 'Editor contains correct content.' );
	} );
}

function assertPasteNotification( editor, expected, cmdData, pasteData ) {
	var spy = sinon.spy( editor, 'showNotification' );

	simulatePasteCommand( editor, cmdData, pasteData, function() {
		assert.areSame( expected.count, spy.callCount, 'showNotification was called corrent number of times.' );
		assert.areSame( expected.content, editor.getData(), 'Editor contains correct content.' );

		spy.restore();
	} );
}
