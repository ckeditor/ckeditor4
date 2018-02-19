/* bender-tags: balloontoolbar */
/* bender-ckeditor-plugins: balloontoolbar, richcombo, toolbar, button, stylescombo */


( function() {
	'use strict';

	bender.editor = {};

	var tests = {
		init: function() {
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 || bender.tools.env.mobile ) {
				bender.ignore();
			}
		},
		'test stylescombo state': function() {
			var editor = this.editor,
				panel,
				comboButton;
			this.editorBot.setHtmlWithSelection( '<div><p>[Test]</p></div>' );
			panel = new CKEDITOR.ui.balloonToolbar( this.editor, {
				width: 'auto',
				height: 40
			} );

			panel.addItems( {
				Styles: editor.ui.create( 'Styles' )
			} );
			panel.attach( editor.editable() );
			comboButton = panel._view.parts.content.findOne( '.cke_combo_button' );
			assert.isNotNull( panel._view.parts.content.findOne( '.cke_combo_off' ) );
			assert.isTrue( panel._items.Styles.getState() === 2 );

			// On Edge and IE the button element has 'onmouseup' instead of 'onclick' so calling `$.click()` will not work there.
			if ( CKEDITOR.env.ie || CKEDITOR.env.edge ) {
				CKEDITOR.tools.callFunction( 4, comboButton.$ );
			} else {
				comboButton.$.click();
			}
			assert.isNotNull( panel._view.parts.content.findOne( '.cke_combo_on' ) );
			assert.isTrue( panel._items.Styles.getState() === 1 );
		}
	};

	bender.test( tests );
} )();
