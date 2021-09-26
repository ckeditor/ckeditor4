/* exported assertPasteEvent, pasteFiles, assertPasteCommand, assertPasteNotification, assertImagePaste,
assertImageDrop, testResetScenario,getDefaultNotification, createFixtures, mockFileReader */

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

function mockFileReader() {
	var fileMockBase64 = ';base64,fileMockBase64=',
		fileMockType,
		readResultMock;

	function FileReaderMock() {
		this.listeners = {};
	}

	// Any MIME type.
	FileReaderMock.setFileMockType = function( type ) {
		fileMockType = type;
	};

	// Result can be: load, abort, error.
	FileReaderMock.setReadResult = function( readResult ) {
		readResultMock = readResult;
		if ( !readResultMock ) {
			readResultMock = 'load';
		}
	};

	FileReaderMock.prototype.addEventListener = function( eventName, callback ) {
		this.listeners[ eventName ] = callback;
	};

	FileReaderMock.prototype.readAsDataURL = function() {
		CKEDITOR.tools.setTimeout( function() {
			this.result = ( readResultMock == 'load' ? 'data:' + fileMockType + fileMockBase64 : null );

			if ( this.listeners[ readResultMock ] ) {
				this.listeners[ readResultMock ]();
			}
		}, 15, this );
	};

	window.FileReader = FileReaderMock;
}

function assertImagePaste( editor, options ) {
	// Mock paste file from clipboard.
	function mockPasteFile( type, additionalData ) {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		nativeData.files.push( {
			name: 'mock.file',
			type: type
		} );
		nativeData.types.push( 'Files' );

		if ( additionalData ) {
			CKEDITOR.tools.array.forEach( additionalData, function( data ) {
				nativeData.setData( data.type, data.data );
			} );
		}

		dataTransfer.cacheData();

		editor.fire( 'paste', {
			dataTransfer: dataTransfer,
			dataValue: '',
			method: 'paste',
			type: 'auto'
		} );
	}

	var type = options.type,
		expected = options.expected,
		additionalData = options.additionalData,
		callback = options.callback;

	editor.once( 'paste', function() {
		resume( function() {
			assert.isInnerHtmlMatching( expected, bender.tools.selection.getWithHtml( editor ), {
				noTempElements: true,
				fixStyles: true,
				compareSelection: true,
				normalizeSelection: true
			} );

			if ( callback ) {
				callback();
			}
		} );
	}, this, null, 9999 );

	mockPasteFile( type, additionalData );

	wait();
}

function assertImageDrop( options ) {
	function mockDropFile( type ) {
		var nativeData = bender.tools.mockNativeDataTransfer(),
			dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer( nativeData );

		nativeData.files.push( {
			name: 'mock.file',
			type: type
		} );

		nativeData.types.push( 'Files' );
		dataTransfer.cacheData();

		return dataTransfer.$;
	}

	var editor = options.editor,
		evt = options.event,
		type = options.type,
		expectedData = options.expectedData,
		callback = options.callback,
		dropRangeOptions = options.dropRange,
		dropTarget = CKEDITOR.plugins.clipboard.getDropTarget( editor ),
		range = new CKEDITOR.dom.range( editor.document );

	range.setStart( dropRangeOptions.dropContainer, dropRangeOptions.dropOffset );
	evt.testRange = range;

	// Push data into clipboard and invoke paste event
	evt.$.dataTransfer = mockDropFile( type );

	var onDrop,
		onPaste,
		tearDown;

	tearDown = function() {
		editor.removeListener( 'drop', onDrop );
		editor.removeListener( 'paste', onPaste );
	};

	onDrop = function( dropEvt ) {
		var dropRange = dropEvt.data.dropRange;

		dropRange.startContainer = dropRangeOptions.dropContainer;
		dropRange.startOffset = dropRangeOptions.dropOffset;
		dropRange.endOffset = dropRangeOptions.dropOffset;
	};

	onPaste = function() {
		resume( function() {
			assert.beautified.html( expectedData, editor.getData() );

			if ( callback ) {
				callback();
			}

			tearDown();
		} );
	};

	editor.on( 'drop', onDrop );
	editor.on( 'paste', onPaste );

	dropTarget.fire( 'drop', evt );

	wait();
}
