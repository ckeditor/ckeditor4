/* bender-tags: editor */
/* bender-ckeditor-plugins: panelbutton,floatpanel,toolbar */

bender.editor = {
	config: {
		toolbar: [ [ 'custom_panel' ] ],
		on: {
			pluginsLoaded: function( evt ) {
				var ed = evt.editor;
				ed.ui.add( 'custom_panel', CKEDITOR.UI_PANELBUTTON, {
					panel: {
						attributes: {}
					}
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
	},

	// (#5144)
	'test initial aria-expanded value set to false': function() {
		var panelButton = this.editor.ui.get( 'custom_panel' ),
			buttonElement = CKEDITOR.document.getById( panelButton._.id );

		assert.areEqual( 'false', buttonElement.getAttribute( 'aria-expanded' ),
			'The initial value of [aria-expanded] is different than false' );
	},

	// (#5144)
	'test switching aria-expanded while opening and closing the panel': function() {
		var panelButton = this.editor.ui.get( 'custom_panel' ),
			buttonElement = CKEDITOR.document.getById( panelButton._.id );

		setTimeout( function() {
			resume( function() {
				assert.areEqual( 'true', buttonElement.getAttribute( 'aria-expanded' ),
					'[aria-expanded] is not set to true when panel is open' );

				setTimeout( function() {
					resume( function() {
						assert.areEqual( 'false', buttonElement.getAttribute( 'aria-expanded' ),
							'[aria-expanded] is not set to false when panel is closed' );
					} );
				}, 50 );

				panelButton._.panel.hide();
				wait();
			} );
		}, 50 );

		panelButton.click( this.editor );
		wait();
	}
} );
