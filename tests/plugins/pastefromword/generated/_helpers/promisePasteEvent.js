/* exported promisePasteEvent, pasteFiles */

'use strict';

function promisePasteEvent( editor, eventData ) {
	var priority = 999;

	// Type doesn't have to be specified.
	if ( !eventData.type )
		eventData.type = 'auto';

	eventData.method = 'paste';
	// Allow passing a dataTransfer mock.
	if ( !eventData.dataTransfer ) {
		eventData.dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer();
	}

	return new CKEDITOR.tools.promise( function( resolve ) {
		editor.once( 'paste', function( evt ) {
			var data = evt.data;

			evt.removeListener();
			evt.cancel(); // Cancel for performance reason - we don't need insertion happen.

			resolve( data );
		}, null, null, priority );

		// WARNING: this code is synchronously called and it resolves the promise.
		editor.fire( 'paste', eventData );
	} );
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
