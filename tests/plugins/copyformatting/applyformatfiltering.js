/* bender-tags: copyformatting */
/* bender-ckeditor-plugins: wysiwygarea, toolbar, copyformatting */
/* bender-include: _helpers/tools.js */
/* global fixHtml */

( function() {
	'use strict';

	bender.editors = {
		images_with_src_only: {
			config: {
				copyFormatting_allowRules: 'img[src]'
			}
		},

		allow_all_explicitly: {
			config: {
				copyFormatting_allowRules: true
			}
		}
	};

	bender.test( {
		'test removing formatting with custom config.copyFormatting_allowRules': function() {
			var editor = this.editors.images_with_src_only;

			bender.tools.selection.setWithHtml( editor, '<p>[<img src="http://foo">]<br></p>' );
			CKEDITOR.plugins.copyformatting._applyFormat( editor, [] );

			assert.areSame( fixHtml( '<p>[]<br></p>' ), fixHtml( bender.tools.selection.getWithHtml( editor ) ) );
		},

		'test removing formatting from everything': function() {
			var editor = this.editors.allow_all_explicitly;

			bender.tools.selection.setWithHtml( editor, '<p>[<img src="http://foo"><strong>aa</strong>]<br></p>' );
			CKEDITOR.plugins.copyformatting._applyFormat( editor, [] );
			assert.areSame( fixHtml( '<p>[aa]<br></p>' ), fixHtml( bender.tools.selection.getWithHtml( editor ) ) );
		}
	} );
}() );
