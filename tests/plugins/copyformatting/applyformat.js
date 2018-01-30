/* bender-tags: copyformatting */
/* bender-ckeditor-plugins: wysiwygarea, toolbar, copyformatting */
/* bender-include: _helpers/tools.js */
/* global testApplyingFormat, fixHtml */

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
			attributes: {},
			type: CKEDITOR.STYLE_INLINE
		} ),

		new CKEDITOR.style( {
			element: 'ol',
			attributes: {
				start: 3
			},
			type: CKEDITOR.STYLE_INLINE
		} )
	],

	tableStyles = [
		new CKEDITOR.style( {
			element: 'b',
			type: CKEDITOR.STYLE_INLINE
		} ),

		new CKEDITOR.style( {
			element: 'td',
			styles: {
				'text-decoration': 'underline'
			},
			attributes: {},
			type: CKEDITOR.STYLE_INLINE
		} ),

		new CKEDITOR.style( {
			element: 'tr',
			styles: {
				'background-color': CKEDITOR.tools.normalizeCssText( '#f00', true )
			},
			attributes: {},
			type: CKEDITOR.STYLE_INLINE
		} ),

		new CKEDITOR.style( {
			element: 'tbody',
			attributes: {
				'class': 'body'
			},
			type: CKEDITOR.STYLE_INLINE
		} ),

		new CKEDITOR.style( {
			element: 'table',
			attributes: {
				border: 3
			},
			type: CKEDITOR.STYLE_INLINE
		} )
	],
	clone = CKEDITOR.tools.clone;

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
			var expectedStyles = clone( listStyles ).slice( 0, 2 );

			expectedStyles[ 1 ].element = expectedStyles[ 1 ]._.definition.element = 'span';

			testApplyingFormat( this.editor, '<p>Apply format h{}ere</p>', 'here', listStyles, [], expectedStyles );

			listStyles[ 1 ].element = listStyles[ 1 ]._.definition.element = 'li';
		},

		'test applyFormat on plain text with list styles and specific listitems attributes': function() {
			var expectedStyles = clone( listStyles ).slice( 0, 2 );

			expectedStyles[ 1 ].element = expectedStyles[ 1 ]._.definition.element = 'span';
			listStyles[ 1 ]._.definition.attributes = {
				value: 4,
				type: 'a'
			};

			testApplyingFormat( this.editor, '<p>Apply format h{}ere</p>', 'here', listStyles, [], expectedStyles );

			listStyles[ 1 ].element = listStyles[ 1 ]._.definition.element = 'li';
			listStyles[ 1 ]._.definition.attributes = {};
		},

		'test applyFormat on list context with list styles': function() {
			var expectedStyles = clone( listStyles );
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
				expectedStyles = clone( listStyles ),
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

		'test applyFormat on plain text with table styles': function() {
			var expectedStyles = clone( tableStyles ).slice( 0, 1 );

			testApplyingFormat( this.editor, '<p>Apply format h{}ere</p>', 'here', tableStyles, [], expectedStyles );
		},

		'test applyFormat on table context with table styles': function() {
			var expectedStyles = clone( tableStyles );
			expectedStyles.splice( 1, 1 );

			testApplyingFormat( this.editor, '<table><tr><td>Apply format h{}ere</td></tr>', 'here', tableStyles,
				[], expectedStyles );

			// We must check styles for `td` element separately as our `CKEDITOR.style.checkActive`
			// is apparently not working with it due to `li` being a block.
			assert.isTrue( this.editor.editable().findOne( 'td' ).getStyle( 'text-decoration' ) === 'underline' );
		},

		'test applyFormat on table context with table styles (within thead)': function() {
			var expectedStyles = clone( tableStyles );
			expectedStyles.splice( 1, 1 );

			expectedStyles[ 2 ].element = expectedStyles[ 2 ]._.definition.element = 'thead';

			testApplyingFormat( this.editor, '<table><thead><tr><th>Apply format h{}ere</th></tr></thead>', 'here',
				tableStyles, [], expectedStyles );

			// We must check styles for `th` element separately as our `CKEDITOR.style.checkActive`
			// is apparently not working with it due to `li` being a block.
			assert.isTrue( this.editor.editable().findOne( 'th' ).getStyle( 'text-decoration' ) === 'underline' );
		},

		'test applyFormat on mixed context with table styles': function() {
			var editor = this.editor,
				editable = editor.editable(),
				expectedStyles = clone( tableStyles ),
				applied = 0,
				elementPath,
				i;

			bender.tools.selection.setWithHtml( editor, '<p>Apply for{mat</p><table><tr><td>Maybe h}ere</td></tr></table>' );

			CKEDITOR.plugins.copyformatting._applyFormat( editor, expectedStyles );

			// Now check if all new styles were applied to the table .
			elementPath = new CKEDITOR.dom.elementPath( editable.findOne( 'td' ).findOne( 'b' ), editable );

			for ( i = 0; i < expectedStyles.length; i++ ) {
				if ( expectedStyles[ i ].checkActive( elementPath, editor ) ) {
					++applied;
				}
			}

			assert.areSame( 4, applied, 'New styles were applied correctly.' );

			// We must check styles for `td` element separately as our `CKEDITOR.style.checkActive`
			// is apparently not working with it due to `li` being a block.
			assert.isTrue( editable.findOne( 'td' ).getStyle( 'text-decoration' ) === 'underline' );

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

		'test applyFormat on skipped elements': function() {
			var editor = this.editor,
				input = [
					'[<img src="http://xxx">]',
					'[<iframe src="http://xxx"></iframe>]',
					'[<input type="text">]',
					'[<textarea>Test</textarea>]',
					'[<button type="button">Test</button>]',
					'[<span data-cke-realelement="">Test</span>]',
					'[<span data-cke-widget-id="0">Test</span>]'
				],
				elements = [
					'img',
					'iframe',
					'input',
					'textarea',
					'button',
					'span',
					'span'
				],
				i;

			// In IE and Edge test with iframe is failing.
			if ( CKEDITOR.env.ie ) {
				input.splice( 1, 1 );
				elements.splice( 1, 1 );
			}

			//Additionaly in IE8 button and textarea are also failing.
			if ( CKEDITOR.env.ie && CKEDITOR.env.version === 8 ) {
				input.splice( 2, 2 );
				elements.splice( 2, 2 );
			}

			for ( i = 0; i < input.length; i++ ) {
				bender.tools.selection.setWithHtml( editor, input[ i ] );

				CKEDITOR.plugins.copyformatting._applyFormat( editor, styles.slice( 0, 2 ) );

				assert.areSame( 1, editor.editable().find( elements[ i ] ).count(), elements[ i ] + ' element count' );
			}
		},

		'test removing formatting from list while applying plain-text styles': function() {
			var editor = this.editor,
				content = '<ol start="5">' +
						'<li style="text-decoration: underline;">' +
							'Fo[]o<br>' +
						'</li>' +
					'</ol>';

			bender.tools.selection.setWithHtml( editor, content );

			CKEDITOR.plugins.copyformatting._applyFormat( editor, [] );

			assert.areSame( fixHtml( content ), fixHtml( bender.tools.selection.getWithHtml( editor ) ) );
		},

		'test removing formatting from table while applying plain-text styles': function() {
			var editor = this.editor,
				content = '<table border="1">' +
						'<tbody style="font-weight: bold;">' +
							'<tr style="text-decoration: underline;">' +
								'<td style="background: green;">' +
									'Fo[]o<br>' +
								'</td>' +
							'</tr>' +
						'</tbody>' +
					'</table>';

			bender.tools.setHtmlWithSelection( editor, content );

			CKEDITOR.plugins.copyformatting._applyFormat( editor, [] );

			assert.areSame( fixHtml( content ), fixHtml( bender.tools.selection.getWithHtml( editor ) ) );
		},

		'test removing formatting from skipped elements': function() {
			var editor = this.editor,
				content = [
					'[<img src="http://xxx">]<br>',
					'[<iframe src="http://xxx"></iframe>]<br>',
					'[<input type="text">]<br>',
					'[<textarea>Test</textarea>]<br>',
					CKEDITOR.env.webkit && !CKEDITOR.env.chrome ? '<button>[Test]</button><br>' : '[<button type="submit">Test</button>]<br>',
					( CKEDITOR.env.webkit && !CKEDITOR.env.chrome ) || ( CKEDITOR.env.ie && CKEDITOR.env.version === 8 ) ?
						'<span data-cke-realelement="">[Test]</span><br>' : '[<span data-cke-realelement="">Test</span>]<br>',
					( CKEDITOR.env.webkit && !CKEDITOR.env.chrome ) || ( CKEDITOR.env.ie && CKEDITOR.env.version === 8 ) ?
						'<span data-cke-widget-id="0">[Test]</span><br>' : '[<span data-cke-widget-id="0">Test</span>]<br>'
				],
				i;

			for ( i = 0; i < content.length; i++ ) {
				bender.tools.selection.setWithHtml( editor, content[ i ] );

				CKEDITOR.plugins.copyformatting._applyFormat( editor, [] );

				assert.areSame( fixHtml( content[ i ] ), fixHtml( bender.tools.selection.getWithHtml( editor ) ) );
			}

		},

		'test filter styles': function() {
			var filterStyles = [
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
				filteredStyles = CKEDITOR.plugins.copyformatting._filterStyles( filterStyles );

			assert.areSame( 1, filteredStyles.length );
			assert.areSame( 'span', filteredStyles[ 0 ].element );
			assert.areSame( '#f00', filteredStyles[ 0 ]._.definition.styles.color );
		},

		'test determining context': function() {
			var editor = this.editor,
				textConstant = 'text',
				listConstant = 'list',
				tableConstant = 'table';

			function determineContext() {
				var range = editor.getSelection().getRanges()[ 0 ];

				return CKEDITOR.plugins.copyformatting._determineContext( range );
			}

			bender.tools.selection.setWithHtml( editor, '<p>Paragra{}ph</p><ul><li>And a list</li></ul>' );
			assert.areSame( textConstant, determineContext(), 'Caret in text before list item' );

			bender.tools.selection.setWithHtml( editor, '<p>Paragraph</p><ul><li>And a l{}ist</li></ul>' );
			assert.areSame( listConstant, determineContext(), 'Caret in first list item' );

			bender.tools.selection.setWithHtml( editor, '<p>Paragrap{h</p><ul><li>And a l}ist</li></ul>' );
			assert.areSame( listConstant, determineContext(), 'Selection started in text, ended inside of a list item' );

			bender.tools.selection.setWithHtml( editor, '<ul><li>L{ist</li></ul><p>And a par}agraph</p>' );
			assert.areSame( listConstant, determineContext(), 'Selection started in list item, ended inside of a text' );

			bender.tools.selection.setWithHtml( editor, '<ul><li>Fiz{z</li><li>Boo}m</li></ul>' );
			assert.areSame( listConstant, determineContext(), 'Selection within two list items' );

			bender.tools.selection.setWithHtml( editor, '<p>Parag{}raph</p><table><tr><td>Cell 1</td></tr></table>' );
			assert.areSame( textConstant, determineContext(), 'Caret in text before table' );

			bender.tools.selection.setWithHtml( editor, '<p>Paragraph</p><table><tr><td>Ce{}ll 1</td></tr></table>' );
			assert.areSame( tableConstant, determineContext(), 'Caret in first table cell' );

			bender.tools.selection.setWithHtml( editor, '<p>Parag{raph</p><table><tr><td>Ce}ll 1</td></tr></table>' );
			assert.areSame( tableConstant, determineContext(), 'Selection started in text, ended inside of a table cell' );

			bender.tools.selection.setWithHtml( editor, '<table><tr><td>Ce{ll 1</td></tr></table><p>Parag}raph</p>' );
			assert.areSame( tableConstant, determineContext(), 'Selection started in table cell, ended inside of a text' );

			bender.tools.selection.setWithHtml( editor, '<table><tr><td>Ce{ll 1</td><td>Cel}l 2</td></tr></table>' );
			assert.areSame( tableConstant, determineContext(), 'Selection within two cells' );

			bender.tools.selection.setWithHtml( editor, '<table><tr><td>Ce{ll 1</td></tr><tr><td>Ce}ll 2</td></tr></table>' );
			assert.areSame( tableConstant, determineContext(), 'Selection within two rows' );
		}
	} );
}() );
