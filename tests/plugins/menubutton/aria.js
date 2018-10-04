/* bender-tags: editor */
/* bender-ckeditor-plugins: menubutton,toolbar */

bender.editor = {
	config: {
		toolbar: [ [ 'custom_menu' ] ],
		on: {
			pluginsLoaded: function( evt ) {
				var ed = evt.editor;
				ed.ui.add( 'custom_menu', CKEDITOR.UI_MENUBUTTON, {
				} );
			}
		}
	}
};

bender.test( {
	'test aria-haspopup': function() {
		var menuButton = this.editor.ui.get( 'custom_menu' ),
			anchorEl = CKEDITOR.document.getById( menuButton._.id );

		assert.areEqual( anchorEl.getAttribute( 'aria-haspopup' ), 'menu' );
	}
} );
