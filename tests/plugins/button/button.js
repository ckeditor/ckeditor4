/* bender-tags: editor */
/* bender-ckeditor-plugins: button,toolbar */

var customCls = 'my_btn';

bender.editor = {
	config: {
		toolbar: [ [ 'custom_btn', 'expandable_btn', 'clickable_btn' ] ],
		on: {
			pluginsLoaded: function( evt ) {
				var ed = evt.editor,
					buttonCmd = new CKEDITOR.command( ed, {
						exec: function() {}
					} );

				ed.addCommand( 'buttonCmd', buttonCmd );

				ed.ui.addButton( 'custom_btn', {
					label: 'button with custom class',
					className: customCls
				} );

				ed.ui.addButton( 'expandable_btn', {
					label: 'expandable button',
					hasArrow: true
				} );

				ed.ui.addButton( 'clickable_btn', {
					label: 'clickable button',
					command: 'buttonCmd'
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

	// (#2565)
	'test right-clicking button': function() {
		if ( !CKEDITOR.env.ie ) {
			assert.ignore();
		}

		var editor = this.editor,
			btn = editor.ui.get( 'clickable_btn' ),
			btnEl = CKEDITOR.document.getById( btn._.id ),
			buttonCmd = editor.getCommand( 'buttonCmd' ),
			spy = sinon.spy( buttonCmd, 'exec' );

		bender.tools.dispatchMouseEvent( btnEl, 'mouseup', CKEDITOR.MOUSE_BUTTON_RIGHT );

		assert.areSame( 0, spy.callCount );
	}
} );
