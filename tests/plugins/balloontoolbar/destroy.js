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
				} ),
				items,
				p;

			// Creating some editor content and attaching balloonToolbar to it in order to create some event listeners related to richCombo
			bot.setHtmlWithSelection( '<div><p>[Text]</p></div>' );
			p = editor.editable().findOne( 'p' ) ;

			panel.addItems( {
				bold: new CKEDITOR.ui.button( {
					label: 'test',
					command: 'bold'
				} ),
				Styles: editor.ui.create( 'Styles' )
			} );
			panel.attach( p );


			// Storing items from panel in another variable, because calling destroy() on panel will remove all item references.
			items = CKEDITOR.tools.array.map( CKEDITOR.tools.object.keys( panel._items ), function( key ) {
				return panel._items[ key ];
			} );

			panel.destroy();

			var listenersDeleted = CKEDITOR.tools.array.every( items, function( item ) {
				return !( item instanceof CKEDITOR.ui.richCombo ) || item._.listeners.length === 0;
			} );
			assert.isTrue( listenersDeleted, 'All listeners are deleted' );
		}
	};

	bender.test( tests );
} )();
