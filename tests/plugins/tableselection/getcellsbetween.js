/* bender-tags: tableselection */
/* bender-ckeditor-plugins: tableselection */
/* bender-include: _helpers/tableselection.js */
/* global tableSelectionHelpers */

( function() {
	'use strict';

	bender.editors = {
		classic: {},
		inline: {
			creator: 'inline'
		}
	};

	var tests = {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'tableselection' );
		},
		'test getCellsBetween': function( editor, bot ) {
			var editable = editor.editable(),
				first,
				last,
				cells;

			bot.setHtmlWithSelection( CKEDITOR.document.getById( 'getCellsBetween' ).getValue() );

			first = editable.findOne( '#first' );
			last = editable.findOne( '#last' );

			cells = CKEDITOR.plugins.tableselection.getCellsBetween( first, last );

			assert.isArray( cells );
			assert.areSame( 4, cells.length );

			assert.isTrue( first.equals( cells[ 0 ] ) );
			assert.isTrue( editable.findOne( '#second' ).equals( cells[ 1 ] ) );
			assert.isTrue( editable.findOne( '#third' ).equals( cells[ 2 ] ) );
			assert.isTrue( last.equals( cells[ 3 ] ) );
		},

		'test getCellsBetween (reversed)': function( editor, bot ) {
			var editable = editor.editable(),
				first,
				last,
				cells;

			bot.setHtmlWithSelection( CKEDITOR.document.getById( 'getCellsBetween' ).getValue() );

			first = editable.findOne( '#first' );
			last = editable.findOne( '#last' );

			cells = CKEDITOR.plugins.tableselection.getCellsBetween( last, first );

			assert.isArray( cells );
			assert.areSame( 4, cells.length );

			assert.isTrue( first.equals( cells[ 0 ] ) );
			assert.isTrue( editable.findOne( '#second' ).equals( cells[ 1 ] ) );
			assert.isTrue( editable.findOne( '#third' ).equals( cells[ 2 ] ) );
			assert.isTrue( last.equals( cells[ 3 ] ) );
		},

		'test getCellsBetween (irregular cells number in rows)': function( editor, bot ) {
			bot.setHtmlWithSelection( CKEDITOR.document.getById( 'getCellsBetween-irregular' ).getValue() );

			var inputCells = editor.editable().find( 'td' ),
				cells;

			cells = CKEDITOR.plugins.tableselection.getCellsBetween( inputCells.getItem( inputCells.count() - 1 ), inputCells.getItem( 0 ) );

			assert.isArray( cells );
			assert.areSame( 13, cells.length );
		},

		// tp2218
		'test getCellsBetween (caption)': function( editor, bot ) {
			bot.setHtmlWithSelection( CKEDITOR.document.getById( 'getCellsBetween-caption' ).getValue() );

			var inputCells = editor.editable().find( 'td' ),
				cells;

			try {
				cells = CKEDITOR.plugins.tableselection.getCellsBetween( inputCells.getItem( 0 ), inputCells.getItem( 2 ) );
			} catch ( e ) {
				assert.fail( 'Invalid indexes for rows were returned.' );
			}

			assert.isArray( cells );
			assert.areSame( 2, cells.length );
		}
	};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	bender.test( tests );
} )();
