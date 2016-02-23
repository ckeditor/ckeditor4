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
	];

	bender.editor = {
		config: {
			allowedContent: true
		}
	};

	bender.test( {
		'test applyFormat with collapsed selection': function() {
			testApplyingFormat( this.editor, '<p>Apply format h{}ere</p>', 'here', [ styles[ 0 ] ] );
		},

		'test applyFormat with uncollapsed selection': function() {
			testApplyingFormat( this.editor, '<p>Apply format {her}e</p>', 'her', [ styles[ 1 ] ] );
		},

		'test applyFormat with multiple styles': function() {
			testApplyingFormat( this.editor, '<p>Apply format her{}e</p>', 'here', styles );
		}
	} );
}() );
