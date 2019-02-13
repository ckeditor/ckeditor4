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
			assert.areSame( CKEDITOR.TRISTATE_OFF, balloonToolbar._items.Styles.getState(), 'State at the beginning' );

			// On Edge and IE the button element has 'onmouseup' instead of 'onclick' so calling `$.click()` will not work there.
			comboButton.$[ CKEDITOR.env.ie ? 'onmouseup' : 'onclick' ]();

			assert.areSame( CKEDITOR.TRISTATE_ON, balloonToolbar._items.Styles.getState(), 'State after opening' );
		}
	};

	bender.test( tests );
} )();
