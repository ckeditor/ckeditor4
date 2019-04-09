/* bender-tags: editor */
/* bender-ckeditor-plugins: table*/
/* bender-include: ./_helpers/headersCorrectness.js */
/* global assertHeadersCorrectnesssAfterManipulation */

( function() {
	'use strict';

	bender.editors = {
		editor: {
			name: 'editor1'
		}
	};

	bender.test( {
		_should: {
			ignore: {
				// (#2881), (#2996).
				'2 rows, 2 cols, none -> both': true,
				'2 rows, 2 cols, row -> both': true,
				'2 rows, 2 cols, both -> col': true
			}
		},

		'2 rows, 2 cols, none -> none': assertHeadersCorrectnesssAfterManipulation( 'none', 'none' ),

		'2 rows, 2 cols, none -> col': assertHeadersCorrectnesssAfterManipulation( 'none', 'col' ),

		'2 rows, 2 cols, none -> row': assertHeadersCorrectnesssAfterManipulation( 'none', 'row' ),

		'2 rows, 2 cols, none -> both': assertHeadersCorrectnesssAfterManipulation( 'none', 'both' ),

		'2 rows, 2 cols, col -> none': assertHeadersCorrectnesssAfterManipulation( 'col', 'none' ),

		'2 rows, 2 cols, col -> col': assertHeadersCorrectnesssAfterManipulation( 'col', 'col' ),

		'2 rows, 2 cols, col -> row': assertHeadersCorrectnesssAfterManipulation( 'col', 'row' ),

		'2 rows, 2 cols, col -> both': assertHeadersCorrectnesssAfterManipulation( 'col', 'both' ),

		'2 rows, 2 cols, row -> none': assertHeadersCorrectnesssAfterManipulation( 'row', 'none' ),

		'2 rows, 2 cols, row -> col': assertHeadersCorrectnesssAfterManipulation( 'row', 'col' ),

		'2 rows, 2 cols, row -> row': assertHeadersCorrectnesssAfterManipulation( 'row', 'row' ),

		'2 rows, 2 cols, row -> both': assertHeadersCorrectnesssAfterManipulation( 'row', 'both' ),

		'2 rows, 2 cols, both -> none': assertHeadersCorrectnesssAfterManipulation( 'both', 'none' ),

		'2 rows, 2 cols, both -> col': assertHeadersCorrectnesssAfterManipulation( 'both', 'col' ),

		'2 rows, 2 cols, both -> row': assertHeadersCorrectnesssAfterManipulation( 'both', 'row' ),

		'2 rows, 2 cols, both -> both': assertHeadersCorrectnesssAfterManipulation( 'both', 'both' )
	} );

} )();
