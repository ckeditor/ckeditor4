/* bender-tags: editor */
/* bender-ckeditor-plugins: richcombo,toolbar */

var customCls = 'my_combo';
bender.editor = {
	config: {
		toolbar: [ [ 'custom_combo' ] ],
		on: {
			pluginsLoaded: function( evt ) {
				var ed = evt.editor;
				ed.ui.addRichCombo( 'custom_combo', {
					className: customCls,
					panel: {
						css: [],
						multiSelect: false
					},
					init: function() {},
					onClick: function() {},
					onRender: function() {}
				} );
			}
		}
	}
};

bender.test( {
	'test combo class names': function() {
		var combo = this.editor.ui.get( 'custom_combo' ),
			btnEl = CKEDITOR.document.getById( 'cke_' + combo.id );

		assert.isTrue( btnEl.hasClass( 'cke_combo' ), 'check ui type class name' );
		assert.isTrue( btnEl.hasClass( 'cke_combo__custom_combo' ), 'check named ui type class name' );
		assert.isTrue( btnEl.hasClass( customCls ), 'check ui item custom class name' );
	},
	// WAI-ARIA 1.1 has added new values for aria-haspopup property (#2072).
	'test aria-haspopup': function() {
		var combo = this.editor.ui.get( 'custom_combo' ),
			anchorEl = CKEDITOR.document.getById( 'cke_' + combo.id ).findOne( 'a' );

		assert.areEqual( anchorEl.getAttribute( 'aria-haspopup' ), 'listbox' );
	},

	// (#1477)
	'test destroy removes combo listeners': function() {
		var combo = this.editor.ui.get( 'custom_combo' ),
			spies = CKEDITOR.tools.array.map( combo._.listeners, function( listener ) {
				return sinon.spy( listener, 'removeListener' );
			} ),
			listenersRemoved;

		combo.destroy();

		listenersRemoved = CKEDITOR.tools.array.every( spies, function( spy ) {
			return spy.called;
		} );

		assert.areEqual( 0, combo._.listeners.length, 'Listeners array is empty.' );
		assert.isTrue( listenersRemoved, 'All listeners are removed.' );
	}
} );
