/* bender-tags: 13790, 4.5.5 */
/* bender-ckeditor-plugins: toolbar, wysiwygarea */



bender.editor = true;

bender.test( {
	'test destroying editor when iframe is removed': function() {
		var editor = this.editor,
			frame = editor.window.getFrame(),
			warnSpy = sinon.stub( CKEDITOR, 'warn' ),
			destroySpy = sinon.spy( editor, 'destroy' );


		frame.remove();
		try {
			editor.destroy();
		} catch ( e ) {}

		warnSpy.restore();
		destroySpy.restore();

		assert.isFalse( destroySpy.threw(), 'Editor.destroy() method should not throw an exception when iframe is already removed.' );
		assert.isFalse( warnSpy.called, 'CKEDITOR.warn shouldn\'t be called.' );
	}
} );
