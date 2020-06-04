/* bender-tags: editor */
/* bender-ckeditor-plugins: panelbutton,toolbar */

bender.editor = {
	config: {
		toolbar: [ [ 'custom_panel' ] ],
		on: {
			pluginsLoaded: function( evt ) {
				var ed = evt.editor;
				ed.ui.add( 'custom_panel', CKEDITOR.UI_PANELBUTTON, {
				} );
			}
		}
	}
};

bender.test( {
	'test aria-haspopup': function() {
		var panelButton = this.editor.ui.get( 'custom_panel' ),
			anchorEl = CKEDITOR.document.getById( panelButton._.id );

		assert.areEqual( anchorEl.getAttribute( 'aria-haspopup' ), 'listbox' );
	}
} );
