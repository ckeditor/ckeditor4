/* bender-tags: copyformatting */
/* bender-ckeditor-plugins: wysiwygarea, toolbar, copyformatting */

( function() {
	'use strict';

	bender.editors = {
		classic: {
			config: {
				allowedContent: true
			}
		},

		inline: {
			creator: 'inline',
			config: {
				allowedContent: true
			}
		}
	};

	bender.test( {
		'test that for classic editor, the editable parent is returned': function() {
			var editor = this.editors.classic;

			assert.areSame( editor.editable().getParent(), CKEDITOR.plugins.copyformatting._getCursorContainer( editor ) );
		},

		'test that for inline editor, the editable is returned': function() {
			var editor = this.editors.inline;

			assert.areSame( editor.editable(), CKEDITOR.plugins.copyformatting._getCursorContainer( editor ) );
		}
	} );
}() );
