/* exported promisePasteEvent, pasteFiles */
/* global Q */

'use strict';

function promisePasteEvent( editor, eventData ) {
	var priority = 999,
		deferred = Q.defer();
	// Type doesn't have to be specified.
	if ( !eventData.type )
		eventData.type = 'auto';

	eventData.method = 'paste';
	// Allow passing a dataTransfer mock.
	if ( !eventData.dataTransfer ) {
		eventData.dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer();
	}

	editor.once( 'paste', onPaste, null, null, priority );
	// WARNING: this code is synchronously called and it resolves the promise.
	editor.fire( 'paste', eventData );

	function onPaste( evt ) {
		var data = evt.data;
		evt.removeListener();
		evt.cancel(); // Cancel for performance reason - we don't need insertion happen.

		deferred.resolve( data );
	}

	return deferred.promise;
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
