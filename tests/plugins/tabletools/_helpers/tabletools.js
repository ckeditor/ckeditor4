/* exported tableToolsHelpers */

( function() {
	'use strict';

	window.tableToolsHelpers = {
		getRangesForCells: function( editor, cellsIndexes ) {
			var ranges = [],
				cells = editor.editable().find( 'td, th' ),
				range,
				cell,
				i;

			for ( i = 0; i < cellsIndexes.length; i++ ) {
				range = editor.createRange();
				cell = cells.getItem( cellsIndexes[ i ] );

				range.setStartBefore( cell );
				range.setEndAfter( cell );

				ranges.push( range );
			}

			return ranges;
		}
	};
} )();
