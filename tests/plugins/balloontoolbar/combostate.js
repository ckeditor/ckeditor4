/* bender-tags: balloontoolbar, 1268 */
/* bender-ckeditor-plugins: balloontoolbar, toolbar, stylescombo */


( function() {
	'use strict';

	bender.editor = {};

	var tests = {
		'test stylescombo state': function() {
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 || bender.tools.env.mobile ) {
				assert.ignore();
			}

			var editor = this.editor,
				balloonToolbar = new CKEDITOR.ui.balloonToolbar( this.editor, {
						width: 'auto',
						height: 40
					} ),
				comboButton;

			this.editorBot.setHtmlWithSelection( '<div><p>[Test]</p></div>' );

			balloonToolbar.addItems( {
				Styles: editor.ui.create( 'Styles' )
			} );
			balloonToolbar.attach( editor.editable() );
			comboButton = balloonToolbar._view.parts.content.findOne( '.cke_combo_button' );
			assert.isTrue( balloonToolbar._items.Styles.getState() === 2 );

			// On Edge and IE the button element has 'onmouseup' instead of 'onclick' so calling `$.click()` will not work there.
			comboButton.$[ CKEDITOR.env.ie ? 'onmouseup' : 'onclick' ]();

			assert.isTrue( balloonToolbar._items.Styles.getState() === 1 );
		}
	};

	bender.test( tests );
} )();
