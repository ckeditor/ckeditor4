/* bender-tags: balloontoolbar, 1477 */
/* bender-ckeditor-plugins: balloontoolbar,button,basicstyles,list,richcombo,stylescombo,wysiwygarea,toolbar */

( function() {
	'use strict';

	bender.editor = {
	};

	var tests = {
		'test destroy toolbar with richcombo': function() {
			var bot = this.editorBot,
				editor = this.editor,
				panel = new CKEDITOR.ui.balloonToolbar( this.editor, {
					width: 'auto',
					height: 40
				} );

			// Creating some editor content and attaching balloonToolbar to it in order to create some event listeners related to richCombo
			bot.setHtmlWithSelection( '<div><p>[Text]</p></div>' );
			var p = editor.editable().findOne( 'p' ) ;

			panel.addItems( {
				bold: new CKEDITOR.ui.button( {
					label: 'test',
					command: 'bold'
				} ),
				Styles: editor.ui.create( 'Styles' )
			} );
			panel.attach( p );

			// Pushing items from panel to another variable, because calling destroy() on panel will remove all item references.
			var items = [];
			for ( var key in panel._items ) {
				items.push( panel._items[ key ] );
			}
			panel.destroy();

			items.forEach( function( item ) {
				if ( item instanceof CKEDITOR.ui.richCombo ) {
					assert.isTrue( item._listeners.length === 0 );
				}
			} );
			assert.isTrue( CKEDITOR.tools.isEmpty( panel._items ) );
		}
	};

	bender.test( tests );
} )();
