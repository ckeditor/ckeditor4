/* bender-tags: editor,a11yhelp */
/* bender-ckeditor-plugins: toolbar */

( function() {
	'use strict';

	bender.editors = {
		withA11y: {
			name: 'editor1',
			creator: 'inline',
			config: {
				extraPlugins: 'a11yhelp'
			}
		},
		withoutA11y: {
			name: 'editor2',
			creator: 'inline',
			config: {
				removePlugins: 'a11yhelp'
			}
		}
	};

	bender.test( {
		'test editor with a11y plugin has aria-describedby': function() {
			var editor = this.editors.withA11y,
				describedBy = editor.editable().getAttribute( 'aria-describedby' );

			assert.isNotNull( describedBy, 'editable has aria-describedby attribute' );
			var label = CKEDITOR.document.getById( describedBy );
			assert.isNotNull( label, 'label element exists' );
			assert.areSame( editor.lang.common.editorHelp, label.getHtml(), 'label\'s content' );
		},

		'test editor without a11y plugin has aria-describedby': function() {
			var editor = this.editors.withoutA11y,
				describedBy = editor.editable().getAttribute( 'aria-describedby' );

			assert.isNull( describedBy, 'editable does not have aria-describedby attribute' );
		}
	} );
} )();
