/* bender-tags: editor */
/* bender-ckeditor-plugins: button,toolbar */

var customCls = 'my_btn';

bender.editor = {
	config: {
		toolbar: [ [ 'custom_btn', 'custom_style_btn', 'iconless_btn' ] ],
		on: {
			pluginsLoaded: function( evt ) {
				var ed = evt.editor;
				ed.ui.addButton( 'custom_btn', {
					label: 'button with custom class',
					className: customCls
				} );
				ed.ui.addButton( 'custom_style_btn', {
					label: 'button with custom style',
					style: 'background-color: red'
				} );
				ed.ui.addButton( 'iconless_btn', {
					label: 'button without icon',
					noicon: true
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
	},
	'test button inline style': function() {
		var btn = this.editor.ui.get( 'custom_style_btn' ),
			btnEl = CKEDITOR.document.getById( btn._.id );
		assert.isTrue( btnEl.getStyle( 'background-color' ) === 'red' );
	},
	'test button iconless': function() {
		var btn = this.editor.ui.get( 'iconless_btn' ),
			btnEl = CKEDITOR.document.getById( btn._.id );
		assert.isNull( btnEl.findOne( '.cke_button_icon' ) );
	}
} );
