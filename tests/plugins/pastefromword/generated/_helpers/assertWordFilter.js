/* global promisePasteEvent */
/* exported assertWordFilter */
function assertWordFilter( editor, compareRawData ) {
	return function( input, output ) {
		return promisePasteEvent( editor, { dataValue: input } )
			.then( function( data ) {
				return [
					// Lowercase, since old IE versions paste the HTML tags in uppercase.
					output.toLowerCase(),
					// Work on as raw data as possible, if you'd like to see what actually would be output by the
					// editor use editor.dataProcessor.toHtml( data.dataValue ).
					compareRawData ? data.dataValue.toLowerCase() : editor.dataProcessor.toHtml( data.dataValue ).toLowerCase()
				];
			} );
	};
}
