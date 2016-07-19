/* bender-tags: editor, embed, 14538 */
/* bender-ckeditor-plugins: embed */
/* bender-include: ../embedbase/_helpers/tools.js */
/* global embedTools */

bender.editor = {
	config: {
		allowedContent: true
	}
};

embedTools.mockJsonp( function( template, data, callback ) {
	callback( {
		type: 'rich',
		html: '<iframe src="http://video"></iframe>'
	} );
} );

bender.test( {
	'test support for removing Tab stop on iframes': function() {
		var bot = this.editorBot,
			editor = bot.editor;

		editor.widgets.once( 'instanceCreated', function( evt ) {
			evt.data.once( 'handleResponse', function() {
				resume( function() {
					assert.areSame( '-1', editor.editable().findOne( 'iframe' ).getAttribute( 'tabindex' ) );
				} );
			} );
		} );

		bot.setData( '', function() {
			bot.dialog( 'embed', function( dialog ) {
				dialog.setValueOf( 'info', 'url', 'http://video' );
				dialog.getButton( 'ok' ).click();

				wait();
			} );
		} );
	}
} );
