/* bender-tags: editor */
/* bender-ckeditor-plugins: flash */

( function() {

	bender.editor = true;

	bender.test( {
		'test create editor with deprecated flash plugin': function() {
			var spy = sinon.spy( CKEDITOR, 'error' );

			bender.editorBot.create( {
				name: 'editor'
			}, function() {
				spy.restore();

				assert.areSame( 1, spy.callCount, 'Error was thrown' );
				assert.isTrue( spy.calledWith( 'editor-plugin-deprecated' ), 'The error code is invalid' );
				assert.isTrue( spy.calledWithExactly( 'editor-plugin-deprecated', sinon.match( {
					plugin: 'flash'
				} ) ), 'Appropriate error code and additional data should be used' );
			} );
		}
	} );
} )();
