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
	// (#2723)
	'test getMenu when created with constructor without editor': function() {
		var menuButton = new CKEDITOR.ui.menuButton( {} );

		assert.isNull( menuButton.getMenu() );
	},

	// (#2723)
	'test getMenu when created with constructor with editor': function() {
		var menuButton = new CKEDITOR.ui.menuButton( {}, this.editor );

		assert.isTrue( menuButton.getMenu() instanceof CKEDITOR.menu );
	},

	// (#2723)
	'test getMenu when created by toolbar handler': function() {
		var menuButton = this.editor.ui.get( 'custom_menu' );

		assert.isTrue( menuButton.getMenu() instanceof CKEDITOR.menu );
	}
} );
