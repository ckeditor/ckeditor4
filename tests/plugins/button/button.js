/* bender-tags: editor */
/* bender-ckeditor-plugins: button,toolbar */

var customCls = 'my_btn';

bender.editor = {
	config: {
		toolbar: [ [ 'custom_btn', 'expandable_btn', 'custom_style_btn', 'iconless_btn' ] ],
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

				ed.ui.addButton( 'custom_style_btn', {
					label: 'button with custom style',
					style: 'background-color: red'
				} );

				ed.ui.addButton( 'iconless_btn', {
					label: 'button without icon',
					icon: false
				} );
				ed.ui.addButton( 'hidden_btn', {
					label: 'hidden button'
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
	},

	// (#1679)
	'test button inline style': function() {
		var btn = this.editor.ui.get( 'custom_style_btn' ),
			btnEl = CKEDITOR.document.getById( btn._.id );
		assert.isTrue( btnEl.getStyle( 'background-color' ) === 'red' );
	},

	// (#1679)
	'test button iconless': function() {
		var btn = this.editor.ui.get( 'iconless_btn' ),
			btnEl = CKEDITOR.document.getById( btn._.id );
		assert.isNull( btnEl.findOne( '.cke_button_icon' ) );
	},

	// (#2091)
	'test hiding button from toolbar': function() {
		var btn = this.editor.ui.get( 'custom_btn' ),
			btnEl = CKEDITOR.document.getById( btn._.id );
		assert.areEqual( btnEl.getStyle( 'display' ), '' );
		assert.isUndefined( btn.hidden );

		btn.hide();

		assert.areEqual( btnEl.getStyle( 'display' ), 'none' );
		assert.isTrue( btn.hidden );

		btn.show();

		assert.areEqual( btnEl.getStyle( 'display' ), '' );
		assert.isUndefined( btn.hidden );
	}
} );
