/* global assertPasteEvent */
/* exported assertWordFilter */
function assertWordFilter( editor ) {
	return function( input, output ) {
		assertPasteEvent( editor, { dataValue: input }, function( data ) {
			var compat = bender.tools.compatHtml;
			// Old IE versions paste the HTML tags in uppercase.
			assert.areSame( compat( output ).toLowerCase(), compat( editor.dataProcessor.toHtml( data.dataValue ) ).toLowerCase() );
			editor.destroy();
		}, null, true );
	};
}
