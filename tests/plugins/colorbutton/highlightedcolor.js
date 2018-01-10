/* bender-tags: editor, colorbutton, 1008 */
/* bender-ckeditor-plugins: colorbutton,toolbar,wysiwygarea */

( function() {
	'use strict';

	bender.editor = true;

	bender.editor = {
		config: {
			colorButton_colors: '999,000,DDD,FFF,A1a1A1,00F',
			language: 'en'
		}
	};

	function assertSelectedColor( colorButton, colorName, colorValue, colorIndex ) {
		assert.areSame( 'true', colorButton._.panel.getBlock( colorButton._.id ).element.find( 'a.cke_colorbox' ).getItem( colorIndex ).getAttribute( 'aria-selected' ) );
		assert.areSame( colorName, colorButton._.panel.getBlock( colorButton._.id ).element.find( 'a.cke_colorbox' ).getItem( colorIndex ).$.title );
		assert.areSame( colorValue, colorButton._.panel.getBlock( colorButton._.id ).element.find( 'a.cke_colorbox' ).getItem( colorIndex ).getAttribute( 'data-value' ) );
	}

	bender.test( {
		'test highlighted color with background color button': function() {
			var editor = this.editor,
				bgColorBtn = editor.ui.get( 'BGColor' );

			resume( function() {
				assertSelectedColor( bgColorBtn, 'Dark Gray', '999', 0 );
			} );

			bender.tools.selection.setWithHtml( editor, '<h1 style="background: #999999">{Moo}</h1>' );
			bgColorBtn.click( editor );

			wait();
		},

		'test highlighted color with text color button': function() {
			var editor = this.editor,
				txtColorBtn = editor.ui.get( 'TextColor' );

			resume( function() {
				assertSelectedColor( txtColorBtn, 'Black', '000', 1 );
			} );

			bender.tools.selection.setWithHtml( editor, '<h1 style="color: #000000;">{Moo}</h1>' );
			txtColorBtn.click( editor );

			wait();
		},

		'test highlighted color with background and text color button': function() {
			var editor = this.editor,
				txtColorBtn = editor.ui.get( 'TextColor' ),
				bgColorBtn = editor.ui.get( 'BGColor' );

			resume( function() {
				assertSelectedColor( bgColorBtn, 'Light Gray', 'DDD', 2 );

				txtColorBtn.click( editor );
				assertSelectedColor( txtColorBtn, 'White', 'FFF', 3 );
			} );

			bender.tools.selection.setWithHtml( editor, '<h1 style="color: #ffffff; background: #dddddd">{Moo}</h1>' );
			bgColorBtn.click( editor );

			wait();
		},

		'test highlighted various color with background and text color button': function() {
			var editor = this.editor,
				txtColorBtn = editor.ui.get( 'TextColor' ),
				bgColorBtn = editor.ui.get( 'BGColor' );

			resume( function() {
				assertSelectedColor( bgColorBtn, 'A1a1A1', 'A1a1A1', 4 );

				txtColorBtn.click( editor );
				assertSelectedColor( txtColorBtn, 'Blue', '00F', 5 );
			} );

			bender.tools.selection.setWithHtml( editor, '<h1 style="color: #0000FF; background: #a1a1a1">{Moo}</h1>' );
			bgColorBtn.click( editor );

			wait();
		}
	} );
} )();
