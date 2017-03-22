/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: selectall,toolbar,table,tabletools */

( function() {
	'use strict';

	bender.editors = {
		classic: {},
		divarea: {
			extraPlugins: 'divarea'
		},
		inline: {
			creator: 'inline'
		}
	};

	function getRangesForCells( editor, cellsIndexes ) {
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

	function getFixtureHtml( id ) {
		return CKEDITOR.document.getById( id ).getHtml();
	}

	var table = CKEDITOR.document.findOne( '#table table' ),
		tests = {
			'test selectAll command after table selection (paragraph + table)': function( editor, bot ) {
				var editable = editor.editable(),
					ranges;

				bot.setData( '<p>Sample text</p>' + table.getOuterHtml(), function() {
					ranges = getRangesForCells( editor, [ 1, 2 ] );

					editor.getSelection().selectRanges( ranges );

					editor.once( 'afterCommandExec', function() {
						resume( function() {
							wait( function() {
								ranges = editor.getSelection().getRanges();

								assert.areSame( 1, ranges.length, 'Range count' );
								assert.areSame( 0, editable.find( '[class*=cke_table-faked-selection]' ).count(),
									'Fake selected cells count' );
								assert.isFalse( editable.hasClass( 'cke_table-faked-selection-editor' ),
									'Editable does not have fake selection class' );
							}, 200 );
						} );
					} );

					editor.execCommand( 'selectAll' );
					wait();
				} );
			},

			'test selectAll command after table selection (only table with cells selected)': function( editor, bot ) {
				var editable = editor.editable(),
					ranges;

				bot.setData( table.getOuterHtml(), function() {
					ranges = getRangesForCells( editor, [ 1, 2 ] );

					editor.getSelection().selectRanges( ranges );

					editor.once( 'afterCommandExec', function() {
						resume( function() {
							wait( function() {
								ranges = editor.getSelection().getRanges();

								assert.areSame( 1, ranges.length, 'Range count' );
								assert.areSame( 4, editable.find( 'td[class=cke_table-faked-selection]' ).count(),
									'Fake selected cells count' );
								assert.isTrue( editable.hasClass( 'cke_table-faked-selection-editor' ),
									'Editable has fake selection class' );
							}, 200 );
						} );
					} );

					editor.execCommand( 'selectAll' );
					wait();
				} );
			},

			'test selectAll command after table selection (only table with collapsed selection)': function( editor, bot ) {
				var editable = editor.editable(),
					ranges;

				bot.setHtmlWithSelection( getFixtureHtml( 'tableCollapsedSelection' ) );

				editor.once( 'afterCommandExec', function() {
					resume( function() {
						wait( function() {
							ranges = editor.getSelection().getRanges();

							assert.areSame( 1, ranges.length, 'Range count' );
							assert.areSame( 4, editable.find( 'td[class=cke_table-faked-selection]' ).count(),
								'Fake selected cells count' );
							assert.isTrue( editable.hasClass( 'cke_table-faked-selection-editor' ),
								'Editable has fake selection class' );
						}, 200 );
					} );
				} );

				editor.execCommand( 'selectAll' );
				wait();
			}
		};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	bender.test( tests );
} )();
