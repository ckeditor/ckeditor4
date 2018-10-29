/* bender-tags: editor */
/* bender-ckeditor-plugins: button,toolbar */

var customCls = 'my_btn';

bender.editor = {
	config: {
		toolbar: [ [ 'custom_btn', 'expandable_btn' ] ],
		on: {
			pluginsLoaded: function( evt ) {
				var ed = evt.editor;
				ed.ui.addButton( 'custom_btn', {
					label: 'button with custom class',
					className: customCls
				} );

				ed.ui.addButton( 'expandable_btn', {
					label: 'expandable button',
					hasArrow: true
				} );
			}
		}
	}
};

bender.test( {
	'test button class names': function() {
		var btn = this.editor.ui.get( 'custom_btn' ),
		btnEl = CKEDITOR.document.getById( btn._.id );

		assert.isTrue( btnEl.hasClass( 'cke_button' ), 'check ui type class name' );
		assert.isTrue( btnEl.hasClass( 'cke_button__custom_btn' ), 'check named ui type class name' );
		assert.isTrue( btnEl.hasClass( customCls ), 'check ui item custom class name' );
		// (#2483)
		assert.isFalse( btnEl.hasClass( 'cke_button_expandable' ), 'check ui item expandable class name' );
	},

	// (#2483)
	'test expandable button class name': function() {
		var btn = this.editor.ui.get( 'expandable_btn' ),
		btnEl = CKEDITOR.document.getById( btn._.id );

		assert.isTrue( btnEl.hasClass( 'cke_button_expandable' ), 'check ui item expandable class name' );
	}
} );
