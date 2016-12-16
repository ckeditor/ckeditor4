/* bender-tags: editor,unit */

CKEDITOR.addCss( 'p{float:left;}' );

bender.editor = {
	startupData: '<p>foo</p>',
	config: {
		contentsLangDirection: 'rtl'
	}
};

bender.test( {
	'test content styles': function() {
		var editable = this.editor.editable();
		var p = editable.getFirst();
		assert.isTrue( editable.hasClass( 'cke_contents_rtl' ) );
		assert.areSame( 'left', p.getComputedStyle( 'float' ) );
	}
} );