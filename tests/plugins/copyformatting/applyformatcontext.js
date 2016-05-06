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
		},

		'test enabling/disabled contexts - text only': function() {
			// Text only
			this.editor.config.copyFormatting_allowedContexts = [ copyFormattingNamespace.CONTEXT_TEXT ];
			testApplyingFormat( this.editor, '<p>Apply her{}e</p>', 'here', styles );
			testApplyingFormat( this.editor, '<ul><li>Apply her{}e</li></ul>', 'here', styles, [], [] );
			testApplyingFormat( this.editor, '<table><tr><td>Apply her{}e</td></tr></table>', 'here', styles, [], [] );
		},

		'test enabling/disabled contexts - list only': function() {
			// List only
			this.editor.config.copyFormatting_allowedContexts = [ copyFormattingNamespace.CONTEXT_LIST ];
			testApplyingFormat( this.editor, '<p>Apply her{}e</p>', 'here', styles, [], [] );
			testApplyingFormat( this.editor, '<ul><li>Apply her{}e</li></ul>', 'here', styles );
			testApplyingFormat( this.editor, '<table><tr><td>Apply her{}e</td></tr></table>', 'here', styles, [], [] );
		},

		'test enabling/disabled contexts - table only': function() {
			// Table only
			this.editor.config.copyFormatting_allowedContexts = [ copyFormattingNamespace.CONTEXT_TABLE ];
			testApplyingFormat( this.editor, '<p>Apply her{}e</p>', 'here', styles, [], [] );
			testApplyingFormat( this.editor, '<ul><li>Apply her{}e</li></ul>', 'here', styles, [], [] );
			testApplyingFormat( this.editor, '<table><tr><td>Apply her{}e</td></tr></table>', 'here', styles );
		},

		'test enabling/disabled contexts - text and list only': function() {
			// Text and list only
			this.editor.config.copyFormatting_allowedContexts = [ copyFormattingNamespace.CONTEXT_TEXT, copyFormattingNamespace.CONTEXT_LIST ];
			testApplyingFormat( this.editor, '<p>Apply her{}e</p>', 'here', styles );
			testApplyingFormat( this.editor, '<ul><li>Apply her{}e</li></ul>', 'here', styles );
			testApplyingFormat( this.editor, '<table><tr><td>Apply her{}e</td></tr></table>', 'here', styles, [], [] );
		},

		'test enabling/disabled contexts - text and table only': function() {
			// Text and table only
			this.editor.config.copyFormatting_allowedContexts = [ copyFormattingNamespace.CONTEXT_TEXT, copyFormattingNamespace.CONTEXT_TABLE ];
			testApplyingFormat( this.editor, '<p>Apply her{}e</p>', 'here', styles );
			testApplyingFormat( this.editor, '<ul><li>Apply her{}e</li></ul>', 'here', styles, [], [] );
			testApplyingFormat( this.editor, '<table><tr><td>Apply her{}e</td></tr></table>', 'here', styles );
		},

		'test enabling/disabled contexts - list and table only': function() {
			// List and table only
			this.editor.config.copyFormatting_allowedContexts = [ copyFormattingNamespace.CONTEXT_LIST, copyFormattingNamespace.CONTEXT_TABLE ];
			testApplyingFormat( this.editor, '<p>Apply her{}e</p>', 'here', styles, [], [] );
			testApplyingFormat( this.editor, '<ul><li>Apply her{}e</li></ul>', 'here', styles );
			testApplyingFormat( this.editor, '<table><tr><td>Apply her{}e</td></tr></table>', 'here', styles );
		},

		'test enabling/disabled contexts - all contexts': function() {
			// All contexts
			this.editor.config.copyFormatting_allowedContexts = [ copyFormattingNamespace.CONTEXT_TEXT, copyFormattingNamespace.CONTEXT_LIST, copyFormattingNamespace.CONTEXT_TABLE ];
			testApplyingFormat( this.editor, '<p>Apply her{}e</p>', 'here', styles );
			testApplyingFormat( this.editor, '<ul><li>Apply her{}e</li></ul>', 'here', styles );
			testApplyingFormat( this.editor, '<table><tr><td>Apply her{}e</td></tr></table>', 'here', styles );
		}
	} );
}() );
