/* bender-tags: editor,unit,a11yhelp */
/* bender-ckeditor-plugins: toolbar */

( function() {
	'use strict';

	bender.test( {
		'async:init': function() {
			var that = this;

			bender.tools.setUpEditors( {
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
			}, function( editors, bots ) {
				that.editorBots = bots;
				that.editors = editors;
				that.callback();
			} );
		},

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