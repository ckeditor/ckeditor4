/* bender-tags: balloontoolbar,context */
/* bender-ckeditor-plugins: balloontoolbar */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		'test queue of toolbars initialization': function() {
			var editor = this.editor;
			var context = new CKEDITOR.plugins.balloontoolbar.context( editor, {} );

			assert.areEqual( 1, context._lifoQueue.length );

			context._lifoPush( new CKEDITOR.ui.balloonToolbar( editor ) );
			assert.areEqual( 2, context._lifoQueue.length );

			context._lifoPop();
			context._lifoPop();
			assert.areEqual( 0, context._lifoQueue.length );
		}
	} );
} )();
