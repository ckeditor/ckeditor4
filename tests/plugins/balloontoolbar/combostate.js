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
				balloonToolbar,
				comboButton;
			this.editorBot.setHtmlWithSelection( '<div><p>[Test]</p></div>' );
			balloonToolbar = new CKEDITOR.ui.balloonToolbar( this.editor, {
				width: 'auto',
				height: 40
			} );

			balloonToolbar.addItems( {
				Styles: editor.ui.create( 'Styles' )
			} );
			balloonToolbar.attach( editor.editable() );
			comboButton = balloonToolbar._view.parts.content.findOne( '.cke_combo_button' );
			assert.isNotNull( balloonToolbar._view.parts.content.findOne( '.cke_combo_off' ) );
			assert.isTrue( balloonToolbar._items.Styles.getState() === 2 );

			// On Edge and IE the button element has 'onmouseup' instead of 'onclick' so calling `$.click()` will not work there.
			if ( CKEDITOR.env.ie || CKEDITOR.env.edge ) {
				comboButton.$.onmouseup();
			} else {
				comboButton.$.click();
			}
			assert.isNotNull( balloonToolbar._view.parts.content.findOne( '.cke_combo_on' ) );
			assert.isTrue( balloonToolbar._items.Styles.getState() === 1 );
		}
	};

	bender.test( tests );
} )();
