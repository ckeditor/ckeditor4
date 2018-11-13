/* bender-tags: editor,dom,range */

( function() {
	'use strict';

	var doc = CKEDITOR.document,
		playground = doc.getById( 'playground' );

	function insertTable( names ) {
		var html = [],
			i;

		if ( !CKEDITOR.tools.array.isArray( names ) ) {
			names = [ names ];
		}

		for ( i = 0; i < names.length; i++ ) {
			html.push( doc.getById( 'table-' + names[ i ] ).clone( true ).getOuterHtml() );
		}

		playground.setHtml( html.join( '\n' ) );
	}

	function createRange( options ) {
		var range = new CKEDITOR.dom.range( options.root || doc );

		if ( options.element ) {
			range.setStartBefore( options.element );
			range.setEndAfter( options.element );
		} else {
			range.setStart( options.start, options.startOffset || 0 );

			if ( options.end ) {
				range.setEnd( options.end, options.endOffset || 0 );
			}
		}

		if ( options.collapse ) {
			range.collapse();
		}

		return range;
	}

	function assertElements( expected, range, selectors ) {
		if ( !expected ) {
			assert.isNull( range._getTableElement() );
		} else {
			assert.isTrue( expected.equals( range._getTableElement( selectors ) ), 'Correct element is returned' );
		}
	}

	bender.test( {
		'get cell (collapsed selection inside)': function() {
			var range,
				cell;

			insertTable( 'simple' );
			cell = playground.findOne( 'td' );
			range = createRange( { start: cell.getChild( 0 ), startOffset: 2, collapse: true } );

			assertElements( cell, range );
		},

		'get cell (selected text node inside)': function() {
			var range,
				cell;

			insertTable( 'simple' );
			cell = playground.findOne( 'td' );
			range = createRange( { element: cell.getChild( 0 ) } );

			assertElements( cell, range );
		},

		'get cell (selected cell)': function() {
			var range,
				cell;

			insertTable( 'simple' );
			cell = playground.findOne( 'td' );
			range = createRange( { element: cell } );

			assertElements( cell, range );
		},

		'get row (collapsed selection inside)': function() {
			var range,
				cell,
				row;

			insertTable( 'simple' );
			row = playground.findOne( 'tr' );
			cell = playground.findOne( 'td' );
			range = createRange( { start: cell.getChild( 0 ), startOffset: 3, collapse: true } );

			assertElements( row, range, 'tr' );
		},

		'get table (collapsed selection inside)': function() {
			var range,
				cell,
				table;

			insertTable( 'simple' );
			table = playground.findOne( 'table' );
			cell = playground.findOne( 'td' );
			range = createRange( { start: cell.getChild( 0 ), startOffset: 3, collapse: true } );

			assertElements( table, range, 'table' );
		},

		'get row (selected text node inside)': function() {
			var range,
				cell,
				row;

			insertTable( 'simple' );
			row = playground.findOne( 'tr' );
			cell = playground.findOne( 'td' );
			range = createRange( { element: cell.getChild( 0 ) } );

			assertElements( row, range, 'tr' );
		},

		'get row (selected cell)': function() {
			var range,
				cell,
				row;

			insertTable( 'simple' );
			row = playground.findOne( 'tr' );
			cell = playground.findOne( 'td' );
			range = createRange( { element: cell } );

			assertElements( row, range, 'tr' );
		},

		'get row (collapsed selection inside with multiple selectors passed)': function() {
			var range,
				cell,
				row;

			insertTable( 'simple' );
			row = playground.findOne( 'tr' );
			cell = playground.findOne( 'td' );
			range = createRange( { start: cell.getChild( 0 ), startOffset: 3, collapse: true } );

			assertElements( row, range, { table: 1, tr: 1 } );
		},

		'get row (row selected)': function() {
			var range,
				row;

			insertTable( 'simple' );
			row = playground.findOne( 'tr' );
			range = createRange( { element: row } );

			assertElements( row, range );
		},

		'get table (table selected)': function() {
			var range,
				table;

			insertTable( 'simple' );
			table = playground.findOne( 'table' );
			range = createRange( { element: table } );

			assertElements( table, range );
		},

		'get cell from one-cell table (Safari edge case)': function() {
			var range,
				cell;

			insertTable( 'one-cell' );
			cell = playground.findOne( 'td' );
			range = createRange( { element: cell } );

			assertElements( cell, range );
		},

		'get nested cell (collapsed selection)': function() {
			var range,
				cell;

			insertTable( 'nested' );
			cell = playground.find( 'td' ).getItem( 1 );
			range = createRange( { start: cell.getChild( 0 ), startOffset: 2, collapse: true } );

			assertElements( cell, range );
		},

		'get nested cell (cell selected)': function() {
			var range,
				cell;

			insertTable( 'nested' );
			cell = playground.find( 'td' ).getItem( 1 );
			range = createRange( { element: cell } );

			assertElements( cell, range );
		},

		'get nested row from selected cell': function() {
			var range,
				row,
				cell;

			insertTable( 'nested' );
			row = playground.find( 'tr' ).getItem( 1 );
			cell = row.findOne( 'td' );
			range = createRange( { element: cell } );

			assertElements( row, range, 'tr' );
		},

		'get nested table from selected cell': function() {
			var range,
				table,
				cell;

			insertTable( 'nested' );
			table = playground.findOne( 'table table' );
			cell = table.findOne( 'td' );
			range = createRange( { element: cell } );

			assertElements( table, range, 'table' );
		},

		'get parent cell from selected nested table': function() {
			var range,
				table,
				cell;

			insertTable( 'nested' );
			cell = playground.findOne( 'td' );
			table = playground.findOne( 'table table' );
			range = createRange( { element: table } );

			assertElements( cell, range, 'td' );
		},

		// (#2403)
		'get cell from outer scope': function() {
			var root = doc.getById( 'inner' ),
				range = createRange( {
					element: root.getChild( 0 ),
					root: root
				} );

			assertElements( null, range );
		},

		'multi-table range': function() {
			var range,
				startCell,
				endCell;

			insertTable( [ 'simple', 'simple' ] );
			startCell = playground.findOne( 'td' );
			endCell = playground.find( 'table' ).getItem( 1 ).findOne( 'td' );
			range = createRange( { start: startCell.getChild( 0 ), startOffset: 2,
				end: endCell.getChild( 0 ), endOffset: 3 } );

			assertElements( null, range );
		},

		'mixed (paragraph + table) range': function() {
			var range,
				start,
				end;

			insertTable( [ 'paragraph', 'simple' ] );
			start = playground.findOne( 'p' );
			end = playground.findOne( 'td' );
			range = createRange( { start: start.getChild( 0 ), startOffset: 2,
				end: end.getChild( 0 ), endOffset: 3 } );

			assertElements( null, range );
		},

		'mixed (table + paragraph) range': function() {
			var range,
				start,
				end;

			insertTable( [ 'simple', 'paragraph' ] );
			start = playground.findOne( 'td' );
			end = playground.findOne( 'p' );
			range = createRange( { start: start.getChild( 0 ), startOffset: 2,
				end: end.getChild( 0 ), endOffset: 3 } );

			assertElements( null, range );
		},

		'mixed (paragraph + table + paragraph) range': function() {
			var range,
				start,
				end;

			insertTable( [ 'paragraph', 'simple', 'paragraph' ] );
			start = playground.findOne( 'p' );
			end = playground.find( 'p' ).getItem( 1 );
			range = createRange( { start: start.getChild( 0 ), startOffset: 2,
				end: end.getChild( 0 ), endOffset: 3 } );

			assertElements( null, range );
		}
	} );
} )();
