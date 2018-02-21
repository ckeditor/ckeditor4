/* bender-tags: editor */
/* bender-ckeditor-plugins: autocomplete */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		'test API exists': function() {
			assert.isFunction( CKEDITOR.plugins.autocomplete, 'autocomplete' );
			assert.isFunction( CKEDITOR.plugins.autocomplete.view, 'autocomplete.view' );
			assert.isFunction( CKEDITOR.plugins.autocomplete.model, 'autocomplete.model' );
		}
	} );
} )();
