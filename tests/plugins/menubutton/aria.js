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
	},

	// (#5144)
	'test initial aria-expanded value set to false': function() {
		var menuButton = this.editor.ui.get( 'custom_menu' ),
			buttonElement = CKEDITOR.document.getById( menuButton._.id );

		assert.areEqual( 'false', buttonElement.getAttribute( 'aria-expanded' ),
			'The initial value of [aria-expanded] is different than false' );
	},

	// (#5144)
	'test switching aria-expanded while opening and closing the menu': function() {
		var menuButton = this.editor.ui.get( 'custom_menu' ),
			buttonElement = CKEDITOR.document.getById( menuButton._.id );

		setTimeout( function() {
			resume( function() {
				assert.areEqual( 'true', buttonElement.getAttribute( 'aria-expanded' ),
					'[aria-expanded] is not set to true when menu is open' );

				setTimeout( function() {
					resume( function() {
						assert.areEqual( 'false', buttonElement.getAttribute( 'aria-expanded' ),
							'[aria-expanded] is not set to false when menu is closed' );
					} );
				}, 50 );

				menuButton._.menu.hide();
				wait();
			} );
		}, 50 );

		menuButton.click( this.editor );
		wait();
	}
} );
