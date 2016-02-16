/* bender-tags: editor, dom */
/* bender-ckeditor-plugins: wysiwygarea, toolbar, copyformatting */
( function() {
	'use strict';

	var plugin;

	bender.editor = true;

	bender.test( {
		setUp: function() {
			plugin = CKEDITOR.plugins.copyformatting;
		},

		'test element with no attributes': function() {
			var element = new CKEDITOR.dom.element( document.getElementsByTagName( 'b' )[ 0 ] ),
				attributes = plugin._getAttributes( element );

			assert.isObject( attributes );
			objectAssert.areEqual( {}, attributes );
		},

		'test element with 2 attributes': function() {
			var element = new CKEDITOR.dom.element( document.getElementsByTagName( 'p' )[ 0 ] ),
				attributes = plugin._getAttributes( element );

			assert.isObject( attributes );
			objectAssert.areEqual( {
				id: 'simple-id',
				'data-attr': 'bogus'
			}, attributes );
		},

		'test element with duplicated attribute': function() {
			var element = new CKEDITOR.dom.element( document.getElementsByTagName( 'span' )[ 0 ] ),
				attributes = plugin._getAttributes( element );

			assert.isObject( attributes );
			objectAssert.areEqual( {
				'bogus-attr': 1
			}, attributes );
		},

		'test unicode in attributes': function() {
			var element = new CKEDITOR.dom.element( document.getElementsByTagName( 'em' )[ 0 ] ),
				attributes = plugin._getAttributes( element );

			assert.isObject( attributes );
			objectAssert.areEqual( {
				'data-unicode': '☃'
			}, attributes );
		},

		'test exclude': function() {
			var element = new CKEDITOR.dom.element( document.getElementsByTagName( 'p' )[ 0 ] ),
				attributes = plugin._getAttributes( element, [ 'id' ] );

			assert.isObject( attributes );
			objectAssert.areEqual( {
				'data-attr': 'bogus'
			}, attributes );
		},

		'test exclude (wrong format)': function() {
			var element = new CKEDITOR.dom.element( document.getElementsByTagName( 'p' )[ 0 ] ),
				attributes = plugin._getAttributes( element, 'id' );

			assert.isObject( attributes );
			objectAssert.areEqual( {
				'id': 'simple-id',
				'data-attr': 'bogus'
			}, attributes );
		}
	} );
}() );
