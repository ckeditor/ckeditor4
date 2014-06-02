/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: toolbar,save,wysiwygarea */

bender.test( {
	'test save event': function() {
		var editor = CKEDITOR.replace( 'editor' ),
			count = 0;

		editor.on( 'instanceReady', function() {
			editor.execCommand( 'save' );

			setTimeout( function() {
				resume( function() {
					assert.areSame( 1, count, 'save was fired once' );
				} );
			} );
		} );

		editor.on( 'save', function() {
			count++;
			return false;
		} );

		wait();
	}
} );