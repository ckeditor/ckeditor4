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
		},

		'test applyFormat on already styled element': function() {
			testApplyingFormat( this.editor, '<p>Apply format <em>her{}e</em></p>', 'here', styles, [
				new CKEDITOR.style( {
					element: 'em',
					type: CKEDITOR.STYLE_INLINE
				} )
			] );
		},

		'test filter styles': function() {
			var styles = [
					new CKEDITOR.style( {
						element: 'span',
						type: CKEDITOR.STYLE_INLINE
					} ),

					new CKEDITOR.style( {
						element: 'h1',
						styles: {
							color: '#f00'
						},
						type: CKEDITOR.STYLE_INLINE
					} )
				],
				filteredStyles = CKEDITOR.plugins.copyformatting._filterStyles( styles );

			assert.areSame( 1, filteredStyles.length );
			assert.areSame( 'span', filteredStyles[ 0 ].element );
			assert.areSame( '#f00', filteredStyles[ 0 ]._.definition.styles.color );
		}
	} );
}() );
