/* bender-tags: copyformatting */
/* bender-ckeditor-plugins: wysiwygarea, toolbar, copyformatting */
( function() {
	'use strict';

	var plugin;

	bender.editor = {
		config: {
			allowedContent: true
		}
	};

	bender.test( {
		setUp: function() {
			plugin = CKEDITOR.plugins.copyformatting;
		},

		'test applyFormat with collapsed selection': function() {
			bender.tools.selection.setWithHtml( this.editor, '<p>Apply format h{}ere</p>' );

			plugin._applyFormat( [
				new CKEDITOR.style( {
					element: 's',
					type: CKEDITOR.STYLE_INLINE
				} )
			], this.editor );

			assert.areSame( 1, this.editor.editable().find( 's' ).count() );
			assert.areSame( 'here', this.editor.editable().findOne( 's' ).getHtml() );
		},

		'test applyFormat with uncollapsed selection': function() {
			bender.tools.selection.setWithHtml( this.editor, '<p>Apply format {her}e</p>' );

			plugin._applyFormat( [
				new CKEDITOR.style( {
					element: 's',
					type: CKEDITOR.STYLE_INLINE
				} )
			], this.editor );

			assert.areSame( 1, this.editor.editable().find( 's' ).count() );
			assert.areSame( 'her', this.editor.editable().findOne( 's' ).getHtml() );
		},

		'test applyFormat with multiple styles': function() {
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
					}
				} )
			],
			applied = 0,
			range, i;

			bender.tools.selection.setWithHtml( this.editor, '<p>Apply format her{}e</p>' );
			plugin._applyFormat( styles, this.editor );
			range = this.editor.getSelection().getRanges()[ 0 ];

			for ( i = 0; i < styles.length; i++ ) {
				if ( styles[ i ].checkActive( range.startPath(), this.editor ) ) {
					++applied;
				}
			}

			assert.areSame( 3, applied );
		}
	} );
}() );
