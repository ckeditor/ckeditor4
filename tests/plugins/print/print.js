/* bender-tags: editor */
/* bender-ckeditor-plugins: print */

bender.editor = {
	startupData: '<p>Foo</p>'
};

bender.test( {
	// (#3661)
	'test print command uses CKEDITOR.plugins.preview#createPreview()': function() {
		var editor = this.editor,
			createPreviewStub = sinon.stub( CKEDITOR.plugins.preview, 'createPreview', function() {
				return {
					$: {
						print: function() {},
						document: {
							execCommand: function() {}
						}
					}
				};
			} );

		editor.once( 'afterCommandExec', function() {
			resume( function() {
				createPreviewStub.restore();

				assert.areSame( 1, createPreviewStub.callCount );
			} );
		} );

		editor.execCommand( 'print' );
		wait();
	}
} );
