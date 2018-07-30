/* bender-tags: editor */
/* bender-ckeditor-plugins: colorbutton,toolbar,wysiwygarea */

( function() {
	'use strict';

	bender.editors = {
		normalizeBackground: {
			creator: 'inline',
			name: 'normalizeBackground',
			config: {
				colorButton_normalizeBackground: false,
				extraAllowedContent: 'span{background}'
			}
		},
		colorLabels: {
			creator: 'inline',
			name: 'colorLabels',
			config: {
				colorButton_colors: 'FontColor1/FF9900,FontColor2/0066CC,F00',
				language: 'en'
			}
		}
	};

	bender.test( {
		'test config.normalizeBackground': function() {
			var input = '<p><span style="background:#ff0000">foo</span><span style="background:yellow">bar</span></p>';

			assert.areSame( input, this.editors.normalizeBackground.dataProcessor.toHtml( input ) );
		},

		// (#2271)
		'test config.colorButton_colors labels': function() {
			var editor = this.editors.colorLabels,
				bgColorBtn = editor.ui.get( 'BGColor' ),
				expectedLabels = [ 'FontColor1', 'FontColor2', 'Red' ];

			resume( function() {
				var colorOptions = bgColorBtn._.panel.getBlock( bgColorBtn._.id ).element.find( 'a.cke_colorbox' );

				CKEDITOR.tools.array.map( colorOptions.toArray(), function( el, index ) {
					assert.areSame( expectedLabels[ index ], colorOptions.getItem( index ).getAttribute( 'title' ), 'Title for color at index ' + index );
				} );
			} );

			bender.tools.selection.setWithHtml( editor, '<h1 style="background: #999999">{Moo}</h1>' );
			bgColorBtn.click( editor );

			wait();
		}
	} );
} )();
