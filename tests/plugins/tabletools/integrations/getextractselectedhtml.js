/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: entities,dialog,tabletools,toolbar,undo,floatingspace */
/* bender-include: ../_helpers/tabletools.js */
/* global tableToolsHelpers */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			config: {
				tableImprovements: true
			},
			allowedForTests: 'table[width];td[id]'
		},

		inline: {
			config: {
				tableImprovements: true
			},
			allowedForTests: 'table[width];td[id]',
			creator: 'inline'
		}
	};

	var tests = {
		// #13884.
		'test getSelectedHtml with multiple ranges': function( editor ) {
			var input = '<p>' +
						'<table>' +
							'<tr>' +
								'<td>11</td>' +
								'<td>22</td>' +
							'</tr>' +
							'<tr>' +
								'<td>44</td>' +
								'<td>55</td>' +
							'</tr>' +
						'</table>' +
					'</p>',
					sel = editor.getSelection(),
					ranges = [];

			bender.tools.selection.setWithHtml( editor, input );

			// Get ranges for cells in the first row.
			ranges = tableToolsHelpers.getRangesForCells( editor, [ 0, 1 ] );

			sel.selectRanges( ranges );

			assert.isInnerHtmlMatching( '<table class="cke_table-faked-selection-table"><tbody><tr><td class="cke_table-faked-selection">11@</td>' +
				'<td class="cke_table-faked-selection">22</td></tr></tbody></table>', editor.getSelectedHtml( true ) );
		},

		'test getSelectedHtml with multiple ranges (Safari/IE8 case)': function( editor ) {
			var input = '<p>' +
						'<table>' +
							'<tr>' +
								'<td>11</td>' +
								'<td>22</td>' +
							'</tr>' +
							'<tr>' +
								'<td>44</td>' +
								'<td>55</td>' +
							'</tr>' +
						'</table>' +
					'</p>',
					sel = editor.getSelection(),
					ranges = [];

			bender.tools.selection.setWithHtml( editor, input );

			// Get ranges for cells in the first row.
			ranges = tableToolsHelpers.getRangesForCells( editor, [ 0, 1 ] );

			sel.selectRanges( ranges );

			assert.isInnerHtmlMatching( '<table class="cke_table-faked-selection-table"><tbody><tr><td class="cke_table-faked-selection">11@</td>' +
				'<td class="cke_table-faked-selection">22</td></tr></tbody></table>', editor.getSelectedHtml( true ) );
		},

		// #13884.
		'test getSelectedHtml with partial table selection': function( editor ) {
			var input = '<p>' +
						'<table>' +
							'<tr>' +
								'<td>11</td>' +
								'<td>22</td>' +
							'</tr>' +
							'<tr>' +
								'<td>44</td>' +
								'<td>55</td>' +
							'</tr>' +
						'</table>' +
					'</p>',
					sel = editor.getSelection(),
					ranges = [];

			bender.tools.selection.setWithHtml( editor, input );

			// Get ranges for first cells in rows.
			ranges = tableToolsHelpers.getRangesForCells( editor, [ 0, 2 ] );

			sel.selectRanges( ranges );

			assert.isInnerHtmlMatching( '<table class="cke_table-faked-selection-table"><tbody><tr><td class="cke_table-faked-selection">11@</td></tr>' +
				'<tr><td class="cke_table-faked-selection">44</td></tr></tbody></table>', editor.getSelectedHtml( true ) );
		},

		'test getSelectedHtml with [colspan] and [rowspan]': function( editor ) {
			var input = '<table>' +
							'<tr>' +
								'<td colspan="2">11</td>' +
								'<td rowspan="2">22</td>' +
								'<td>33</td>' +
							'</tr>' +
							'<tr>' +
								'<td>44</td>' +
								'<td>55</td>' +
								'<td>66</td>' +
							'</tr>' +
						'</table>',
					sel = editor.getSelection(),
					ranges = [];

			bender.tools.selection.setWithHtml( editor, input );

			// Get ranges for all cells.
			ranges = tableToolsHelpers.getRangesForCells( editor, [ 0, 1, 2, 3, 4, 5 ] );

			sel.selectRanges( ranges );

			assert.isInnerHtmlMatching( '<table class="cke_table-faked-selection-table"><tbody><tr><td class="cke_table-faked-selection" colspan="2">11@</td>' +
				'<td class="cke_table-faked-selection" rowspan="2">22</td><td class="cke_table-faked-selection">33</td></tr><tr><td class="cke_table-faked-selection">44</td>' +
				'<td class="cke_table-faked-selection">55</td><td class="cke_table-faked-selection">66</td></tr></tbody></table>',
				editor.getSelectedHtml( true ) );
		}
	};

	bender.test( bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests ) );
}() );
