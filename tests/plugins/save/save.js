/* bender-tags: editor */
/* bender-ckeditor-plugins: toolbar,save,wysiwygarea,sourcearea */

bender.test( {
	'test save event in WYSIWYG mode': function() {
		var editor = CKEDITOR.replace( 'editor1' ),
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
	},

	'test save event in source mode': function() {
		var editor = CKEDITOR.replace( 'editor2' , { startupMode: 'source' } ),
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
