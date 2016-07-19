/* global promisePasteEvent */
/* exported assertWordFilter */
function assertWordFilter( editor ) {
	return function( input, output ) {
		return promisePasteEvent( editor, { dataValue: input } )
			.then( function( data ) {
				var compat = bender.tools.compatHtml,
					// Old IE versions paste the HTML tags in uppercase.
					value = [
						compat( output ).toLowerCase(),
						compat( editor.dataProcessor.toHtml( data.dataValue ) ).toLowerCase()
					];

				return value;
			} );
	};
}
