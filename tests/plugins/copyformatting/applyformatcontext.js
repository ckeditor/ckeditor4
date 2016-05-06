/* bender-tags: copyformatting */
/* bender-ckeditor-plugins: wysiwygarea, toolbar, copyformatting */
/* bender-include: _helpers/tools.js */
/* global testApplyingFormat */

( function() {
	'use strict';

	var styles = [
			new CKEDITOR.style( {
				element: 's',
				type: CKEDITOR.STYLE_INLINE
			} ),

			new CKEDITOR.style( {
				element: 'b',
				type: CKEDITOR.STYLE_INLINE
			} ),

			new CKEDITOR.style( {
				element: 'span',
				styles: {
					'font-weight': 'bold'
				},
				type: CKEDITOR.STYLE_INLINE
			} )
		],
		copyFormattingNamespace;

	bender.editor = {
		config: {
			allowedContent: true
		}
	};

	bender.test( {
		setUp: function() {
			copyFormattingNamespace = CKEDITOR.plugins.copyformatting;
			this.editorConfig = this.editor.config;

			// Store initial copyFormatting_allowedContexts value, so that it could be automatically restored in tearDown.
			this.initialAllowedContexts = this.editorConfig.copyFormatting_allowedContexts;
		},

		tearDown: function() {
			this.editorConfig.copyFormatting_allowedContexts = this.initialAllowedContexts;
		},

		'test context - text only': function() {
			// Text only
			this.editorConfig.copyFormatting_allowedContexts = [ copyFormattingNamespace.CONTEXT_TEXT ];
			testApplyingFormat( this.editor, '<p>Apply her{}e</p>', 'here', styles );
			testApplyingFormat( this.editor, '<ul><li>Apply her{}e</li></ul>', 'here', styles, [], [] );
			testApplyingFormat( this.editor, '<table><tr><td>Apply her{}e</td></tr></table>', 'here', styles, [], [] );
		},

		'test context - list only': function() {
			// List only
			this.editorConfig.copyFormatting_allowedContexts = [ copyFormattingNamespace.CONTEXT_LIST ];
			testApplyingFormat( this.editor, '<p>Apply her{}e</p>', 'here', styles, [], [] );
			testApplyingFormat( this.editor, '<ul><li>Apply her{}e</li></ul>', 'here', styles );
			testApplyingFormat( this.editor, '<table><tr><td>Apply her{}e</td></tr></table>', 'here', styles, [], [] );
		},

		'test context - table only': function() {
			// Table only
			this.editorConfig.copyFormatting_allowedContexts = [ copyFormattingNamespace.CONTEXT_TABLE ];
			testApplyingFormat( this.editor, '<p>Apply her{}e</p>', 'here', styles, [], [] );
			testApplyingFormat( this.editor, '<ul><li>Apply her{}e</li></ul>', 'here', styles, [], [] );
			testApplyingFormat( this.editor, '<table><tr><td>Apply her{}e</td></tr></table>', 'here', styles );
		},

		'test context - text and list only': function() {
			// Text and list only
			this.editorConfig.copyFormatting_allowedContexts = [ copyFormattingNamespace.CONTEXT_TEXT, copyFormattingNamespace.CONTEXT_LIST ];
			testApplyingFormat( this.editor, '<p>Apply her{}e</p>', 'here', styles );
			testApplyingFormat( this.editor, '<ul><li>Apply her{}e</li></ul>', 'here', styles );
			testApplyingFormat( this.editor, '<table><tr><td>Apply her{}e</td></tr></table>', 'here', styles, [], [] );
		},

		'test context - text and table only': function() {
			// Text and table only
			this.editorConfig.copyFormatting_allowedContexts = [ copyFormattingNamespace.CONTEXT_TEXT, copyFormattingNamespace.CONTEXT_TABLE ];
			testApplyingFormat( this.editor, '<p>Apply her{}e</p>', 'here', styles );
			testApplyingFormat( this.editor, '<ul><li>Apply her{}e</li></ul>', 'here', styles, [], [] );
			testApplyingFormat( this.editor, '<table><tr><td>Apply her{}e</td></tr></table>', 'here', styles );
		},

		'test context - list and table only': function() {
			// List and table only
			this.editorConfig.copyFormatting_allowedContexts = [ copyFormattingNamespace.CONTEXT_LIST, copyFormattingNamespace.CONTEXT_TABLE ];
			testApplyingFormat( this.editor, '<p>Apply her{}e</p>', 'here', styles, [], [] );
			testApplyingFormat( this.editor, '<ul><li>Apply her{}e</li></ul>', 'here', styles );
			testApplyingFormat( this.editor, '<table><tr><td>Apply her{}e</td></tr></table>', 'here', styles );
		},

		'test context - all contexts': function() {
			// All contexts
			this.editorConfig.copyFormatting_allowedContexts = [ copyFormattingNamespace.CONTEXT_TEXT, copyFormattingNamespace.CONTEXT_LIST, copyFormattingNamespace.CONTEXT_TABLE ];
			testApplyingFormat( this.editor, '<p>Apply her{}e</p>', 'here', styles );
			testApplyingFormat( this.editor, '<ul><li>Apply her{}e</li></ul>', 'here', styles );
			testApplyingFormat( this.editor, '<table><tr><td>Apply her{}e</td></tr></table>', 'here', styles );
		}
	} );
}() );
