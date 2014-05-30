/* bender-tags: editor,unit */

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: 'p',
			tabSpaces: 3,
			plugins: 'tab'
		}
	};

	bender.test( {
		'test tabSpaces setting': function() {
			this.editorBot.setHtmlWithSelection( '<p>foo^bar</p>' );

			this.editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: 9 } ) );

			assert.areSame( '<p>foo&nbsp;&nbsp;&nbsp;bar</p>', this.editorBot.getData( true ), '3 spaces were inserted' );
		}
	} );

} )();