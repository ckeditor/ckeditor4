/* exported assertPasteEvent, pasteFiles, assertPasteCommand, assertPasteNotification, testResetScenario,
getDefaultNotification, createFixtures */

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

	editor.once( 'paste', onPaste, null, null, priority );
	paste( editor, eventData );

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

function paste( editor, eventData ) {
	// Type doesn't have to be specified.
	if ( !eventData.type ) {
		eventData.type = 'auto';
	}

	eventData.method = 'paste';
	// Allow passing a dataTransfer mock.
	if ( !eventData.dataTransfer ) {
		eventData.dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer();
	}

	editor.fire( 'paste', eventData );
}

function pasteFiles( editor, files, dataValue, pasteData ) {
	var	nativeData = bender.tools.mockNativeDataTransfer();

	nativeData.files = files;

	var dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

	editor.fire( 'paste', CKEDITOR.tools.extend( {
		dataTransfer: dataTransfer,
		dataValue: dataValue ? dataValue : ''
	}, pasteData || {} ) );
}

function mockGetClipboardData( editor, pasteData ) {
	var stub;

	stub = sinon.stub( editor, 'getClipboardData', function( options, callback ) {
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

		stub.restore();
	} );

	return stub;
}

function simulatePasteCommand( editor, cmdData, pasteData, callback, timeout ) {
	var cmdName = ( cmdData && cmdData.name ) || 'paste',
		eventName = ( !pasteData || pasteData.prevent ) ? 'afterCommandExec' : 'paste',
		stub;

	pasteData = pasteData || {};

	stub = mockGetClipboardData( editor, pasteData );

	if ( timeout ) {
		CKEDITOR.tools.setTimeout( function() {
			resume( function() {
				stub.restore();
				callback();
			} );
		}, timeout );
	} else {
		editor.once( eventName, function( evt ) {
			resume( function() {
				stub.restore();
				callback( evt );
			} );
		}, null, null, pasteData.priority || 1000 );
	}

	editor.execCommand( cmdName, cmdData );
	wait();
}

function assertPasteCommand( editor, expected, cmdData, pasteData ) {
	simulatePasteCommand( editor, cmdData, pasteData, function( evt ) {
		assert.areSame( expected.method || 'paste', evt.data.method, 'Paste event has correct method.' );
		assert.areSame( expected.type, evt.data.type, 'Paste event has correct data type.' );
		assert.areSame( expected.content, editor.getData(), 'Editor contains correct content.' );
	} );
}

function assertPasteNotification( editor, expected, cmdData, pasteData ) {
	var spy = sinon.spy( editor, 'showNotification' );

	simulatePasteCommand( editor, cmdData, pasteData, function() {
		spy.restore();

		assert.areSame( expected.count, spy.callCount, 'showNotification was called correct number of times.' );
		assert.areSame( expected.content, editor.getData(), 'Editor contains correct content.' );

		if ( expected.count && expected.msg ) {
			assert.areSame( expected.msg, spy.firstCall.args[ 0 ], 'Correct message was shown.' );
		}
	} );
}

function testResetScenario( editor, queue ) {
	var i = 0;
	function assertPaste( evt, expected, index ) {
		assert.areSame( evt.dataValue, expected.dataValue, 'Paste #' + index + ' should have correct value.' );
		assert.areSame( evt.type, expected.type, 'Paste #' + index + ' should have correct type.' );
		assert.isUndefined( editor._.nextPasteType, 'Forced type after paste #' + index + ' should be deleted.' );
	}

	function onPaste( evt ) {
		assertPaste( evt.data, queue[ i ] );

		if ( ++i === queue.length ) {
			return;
		}

		firePaste( queue[ i ] );
	}

	function firePaste( task ) {
		simulatePasteCommand( editor, { name: task.cmd }, { dataValue: task.dataValue }, onPaste );
	}

	firePaste( queue[ i ] );
}

function getDefaultNotification( editor, command, keyInfo ) {
	var keystroke = keyInfo || CKEDITOR.tools.keystrokeToString( editor.lang.common.keyboard,
		editor.getCommandKeystroke( editor.commands[ command ] ) ),
		msg = editor.lang[ command === 'paste' ? 'clipboard' : command ].pasteNotification
			.replace( /%1/, '<kbd aria-label="' + keystroke.aria + '">' + keystroke.display + '</kbd>' );

	return msg;
}

function createFixtures( fixtures ) {
	return {
		get: function( name ) {
			return CKEDITOR.tools.copy( fixtures[ name ] );
		}
	};
}
