/* bender-tags: editor */
/* bender-ckeditor-plugins: print */

bender.editor = {
	startupData: '<p>Foo</p>'
};

var printStub;

bender.test( {
	setUp: function() {
		printStub = sinon.stub( this.editor.window.$, 'print' );
	},

	tearDown: function() {
		printStub.restore();
	},

	// (#3661)
	'test print command fires contentPreview': function() {
		var editor = this.editor,
			spy = sinon.spy();

		editor.on( 'contentPreview', spy );

		editor.once( 'afterCommandExec', function() {
			resume( function() {
				assert.areSame( 1, spy.callCount, 'Event was invoked correctly' );
				editor.removeListener( 'contentPreview', spy );
			} );
		} );

		editor.execCommand( 'print' );
		wait();
	}
} );
