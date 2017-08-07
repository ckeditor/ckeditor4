/* bender-ckeditor-plugins: clipboard */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		'test if toolbar plugins is not loaded when clipboard is available': function() {
			var editor = this.editor;

			assert.isNotUndefined( editor.plugins.clipboard );
			assert.isUndefined( editor.plugins.toolbar );
			assert.isNull( editor.ui.space( 'top' ) );
		}
	} );
} )();
