/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: entities,dialog,tabletools,clipboard,toolbar */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		'test doesnt break regular paste': function() {
			var editor = this.editor;

			bender.tools.setHtmlWithSelection( editor, '<p>foo^bar</p>' );
			bender.tools.emulatePaste( this.editor, '<p>bam</p>' );

			editor.once( 'afterPaste', function() {
				resume( function() {
					assert.areSame( '<p>foobambar</p>', editor.getData() );
				} );
			} );

			wait();
		}
	} );
} )();
