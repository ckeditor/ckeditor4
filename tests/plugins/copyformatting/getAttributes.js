/* bender-tags: editor, copyformatting */
/* bender-ckeditor-plugins: wysiwygarea, toolbar, copyformatting */
/* bender-include: _helpers/tools.js */

( function() {
	'use strict';

	bender.editor = true;

	function testAttributes( element, expected, exclude ) {
		var attributes;

		element = new CKEDITOR.dom.element( document.getElementsByTagName( element )[ 0 ] );
		attributes = CKEDITOR.plugins.copyformatting._getAttributes( element, exclude );

		assert.isObject( attributes );
		objectAssert.areEqual( expected, attributes );
	}

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
