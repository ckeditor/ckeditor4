/* bender-tags: editor */
/* bender-ckeditor-plugins: sourcearea,entities */

bender.editor = {
	startupData: '<br /><br /><br />',
	config: {
		enterMode: CKEDITOR.ENTER_BR
	}
};

bender.test( {
	'test disappearing br when getData': function() {
		var editor = this.editor;

		assert.areSame( '<br /><br />&nbsp;', editor.getData(), 'Last BR turns into NBSP.' );
	},

	'test disappearing br when switching modes': function() {
		var editor = this.editor;

		editor.once( 'mode', function() {
			editor.once( 'mode', function() {
				resume( function() {
					assert.areSame( '<br /><br />&nbsp;', editor.getData(), 'Last BR turns into NBSP.' );
				} );
			} );

			editor.execCommand( 'source' );
		} );

		editor.execCommand( 'source' );
		wait();
	}
} );
