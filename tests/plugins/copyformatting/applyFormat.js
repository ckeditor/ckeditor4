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
	listStyles = [
		new CKEDITOR.style( {
			element: 'b',
			type: CKEDITOR.STYLE_INLINE
		} ),

		new CKEDITOR.style( {
			element: 'li',
			styles: {
				'text-decoration': 'underline'
			},
			type: CKEDITOR.STYLE_INLINE
		} ),

		new CKEDITOR.style( {
			element: 'ol',
			attributes: {
				start: 3
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

		'test applyFormat on plain text with list styles': function() {
			var expectedStyles = listStyles.slice( 0, 2 );

			expectedStyles[ 1 ].element = expectedStyles[ 1 ]._.definition.element = 'span';

			testApplyingFormat( this.editor, '<p>Apply format h{}ere</p>', 'here', listStyles, [], expectedStyles );

			listStyles[ 1 ].element = listStyles[ 1 ]._.definition.element = 'li';
		},

		'test applyFormat on list context with list styles': function() {
			var expectedStyles = listStyles.slice();
			expectedStyles.splice( 1, 1 );

			testApplyingFormat( this.editor, '<ul><li>Apply format h{}ere</li></ul>', 'here', listStyles, [],
				expectedStyles );

			// We must check styles for `li` element separately as our `CKEDITOR.style.checkActive`
			// is apparently not working with it due to `li` being a block.
			assert.isTrue( this.editor.editable().findOne( 'li' ).getStyle( 'text-decoration' ) === 'underline' );
		},

		'test applyFormat on mixed context with list styles': function() {
			var editor = this.editor,
				editable = editor.editable(),
				expectedStyles = listStyles,
				applied = 0,
				elementPath,
				i;

			bender.tools.selection.setWithHtml( editor, '<p>Apply for{mat</p><ul><li>Maybe h}ere</li></ul>' );

			CKEDITOR.plugins.copyformatting._applyFormat( editor, expectedStyles );

			// Now check if all new styles were applied to the listitem.
			elementPath = new CKEDITOR.dom.elementPath( editable.findOne( 'li' ).findOne( 'b' ), editable );

			for ( i = 0; i < expectedStyles.length; i++ ) {
				if ( expectedStyles[ i ].checkActive( elementPath, editor ) ) {
					++applied;
				}
			}

			assert.areSame( 2, applied, 'New styles were applied correctly.' );

			// We must check styles for `li` element separately as our `CKEDITOR.style.checkActive`
			// is apparently not working with it due to `li` being a block.
			assert.isTrue( editable.findOne( 'li' ).getStyle( 'text-decoration' ) === 'underline' );

			// Now check if all new styles were applied to the paragraph.
			applied = 0;
			elementPath = new CKEDITOR.dom.elementPath( editable.findOne( 'p' ).findOne( 'b' ), editable );

			for ( i = 0; i < expectedStyles.length; i++ ) {
				if ( expectedStyles[ i ].checkActive( elementPath, editor ) ) {
					++applied;
				}
			}

			assert.areSame( 1, applied, 'New styles were applied correctly.' );
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
		},

		'test determining context': function() {
			var editor = this.editor;

			function determineContext() {
				var range = editor.getSelection().getRanges()[ 0 ];

				return CKEDITOR.plugins.copyformatting._determineContext( range );
			}

			bender.tools.selection.setWithHtml( editor, '<p>Paragra{}ph</p><ul><li>And a list</li></ul>' );
			assert.areSame( 0, determineContext(), 'Caret in text before list item' );

			bender.tools.selection.setWithHtml( editor, '<p>Paragraph</p><ul><li>And a l{}ist</li></ul>' );
			assert.areSame( 1, determineContext(), 'Caret in first list item' );

			bender.tools.selection.setWithHtml( editor, '<p>Paragrap{h</p><ul><li>And a l}ist</li></ul>' );
			assert.areSame( 1, determineContext(), 'Selection started in text, ended inside of a list item' );

			bender.tools.selection.setWithHtml( editor, '<ul><li>L{ist</li></ul><p>And a par}agraph</p>' );
			assert.areSame( 1, determineContext(), 'Selection started in list item, ended inside of a text' );

			bender.tools.selection.setWithHtml( editor, '<ul><li>Fiz{z</li><li>Boo}m</li></ul>' );
			assert.areSame( 1, determineContext(), 'Selection within two list items' );
		}
	} );
}() );
