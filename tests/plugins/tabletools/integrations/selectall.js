/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: selectall,toolbar,table,tabletools */
/* bender-include: ../_helpers/tabletools.js */
/* global tableToolsHelpers */

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

	function getFixtureHtml( id ) {
		return CKEDITOR.document.getById( id ).getHtml();
	}

	var getRangesForCells = tableToolsHelpers.getRangesForCells,
		table = CKEDITOR.document.findOne( '#table table' ),
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

			// Ignore these two tests till tp2156 is resolved.
			// Note _should.ignore does not play well with createTestsForEditors.
			//
			// 'test selectAll command after table selection (only table with collapsed selection)': function( editor, bot ) {
			// 	var editable = editor.editable(),
			// 		ranges;

			// 	bot.setHtmlWithSelection( getFixtureHtml( 'tableCollapsedSelection' ) );

			// 	editor.once( 'afterCommandExec', function() {
			// 		resume( function() {
			// 			wait( function() {
			// 				ranges = editor.getSelection().getRanges();

			// 				assert.areSame( 1, ranges.length, 'Range count' );
			// 				assert.areSame( 4, editable.find( 'td[class=cke_table-faked-selection]' ).count(),
			// 					'Fake selected cells count' );
			// 				assert.isTrue( editable.hasClass( 'cke_table-faked-selection-editor' ),
			// 					'Editable has fake selection class' );
			// 			}, 200 );
			// 		} );
			// 	} );

			// 	editor.execCommand( 'selectAll' );
			// 	wait();
			// },

			// 'test selectAll command after table selection (only table with ranged selection)': function( editor, bot ) {
			// 	var editable = editor.editable(),
			// 		ranges;

			// 	bot.setHtmlWithSelection( getFixtureHtml( 'tableCollapsedSelection' ) );

			// 	editor.once( 'afterCommandExec', function() {
			// 		resume( function() {
			// 			wait( function() {
			// 				ranges = editor.getSelection().getRanges();

			// 				assert.areSame( 1, ranges.length, 'Range count' );
			// 				assert.areSame( 4, editable.find( 'td[class=cke_table-faked-selection]' ).count(),
			// 					'Fake selected cells count' );
			// 				assert.isTrue( editable.hasClass( 'cke_table-faked-selection-editor' ),
			// 					'Editable has fake selection class' );
			// 			}, 200 );
			// 		} );
			// 	} );

			// 	editor.execCommand( 'selectAll' );
			// 	wait();
			// }
		};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );

	bender.test( tests );
} )();
