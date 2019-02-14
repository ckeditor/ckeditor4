/* bender-tags: editor */
/* bender-ckeditor-plugins: autolink */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		// (#2208)
		'test autolink plugin is enabled for non IE browsers': function() {
			if ( !CKEDITOR.env.edge && CKEDITOR.env.ie ) {
				assert.ignore();
			}

			assert.isTrue( !!this.editor.plugins.autolink._loaded );
		},

		// (#2208)
		'test autolink plugin is disabled for IE browsers': function() {
			if ( CKEDITOR.env.edge || !CKEDITOR.env.ie ) {
				assert.ignore();
			}

			assert.isFalse( !!this.editor.plugins.autolink._loaded );
		}
	} );

} )();
