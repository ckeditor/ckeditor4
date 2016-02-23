/* bender-tags: editor, dom */
/* bender-ckeditor-plugins: wysiwygarea, toolbar, copyformatting */
/* bender-include: _helpers/tools.js */
/* global testAttributes */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		'test element with no attributes': function() {
			testAttributes( 'b', {} );
		},

		'test element with 2 attributes': function() {
			testAttributes( 'p', {
				id: 'simple-id',
				'data-attr': 'bogus'
			} );
		},

		'test element with duplicated attribute': function() {
			testAttributes( 'span', {
				'bogus-attr': 1
			} );
		},

		'test unicode in attributes': function() {
			testAttributes( 'em', {
				'data-unicode': '☃'
			} );
		},

		'test exclude': function() {
			testAttributes( 'p', {
				'data-attr': 'bogus'
			}, [ 'id' ] );
		},

		'test exclude (wrong format)': function() {
			testAttributes( 'p', {
				id: 'simple-id',
				'data-attr': 'bogus'
			}, 'id' );
		}
	} );
}() );
