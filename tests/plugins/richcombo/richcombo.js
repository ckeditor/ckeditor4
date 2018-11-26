/* bender-tags: editor */
/* bender-ckeditor-plugins: richcombo,toolbar,sourcearea */

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
	},

	// (#1268)
	'test combo state when editor is read only': testComboState( {
		readOnly: true,
		expected: CKEDITOR.TRISTATE_DISABLED
	} ),

	// (#1268)
	'test combo state when editor mode changes': testComboState( {
		mode: 'source',
		expected: CKEDITOR.TRISTATE_DISABLED
	} ),

	// (#1268)
	'test combo state when combo is on': testComboState( {
		comboOn: true,
		expected: CKEDITOR.TRISTATE_ON
	} )
} );

function testComboState( options ) {
	return function() {
		var editor = this.editor,
			combo = editor.ui.get( 'custom_combo' ),
			expected = options.expected,
			originalMode;

		assert.areEqual( CKEDITOR.TRISTATE_OFF, combo.getState() );

		if ( options.comboOn ) {
			assertComboStateWhenComboIsOn( expected );
		}

		if ( options.readOnly ) {
			assertComboStateWhenReadOnly( expected );
		}

		if ( options.mode && options.mode !== editor.mode ) {
			assertComboStateWhenEditorModeChanges( expected );
		}

		function assertComboStateWhenComboIsOn( expected ) {
			combo.setState( CKEDITOR.TRISTATE_ON );
			assertComboState( expected );

			combo.setState( CKEDITOR.TRISTATE_OFF );
			assertComboState( CKEDITOR.TRISTATE_OFF );
		}

		function assertComboStateWhenReadOnly( expected ) {
			editor.setReadOnly( true );
			assertComboState( expected );

			editor.setReadOnly( false );
			assertComboState( CKEDITOR.TRISTATE_OFF );
		}

		function assertComboStateWhenEditorModeChanges( expected ) {
			originalMode = editor.mode;
			editor.setMode( options.mode, function() {
				resume( function() {
					assertComboState( expected );

					editor.setMode( 'wysiwyg', function() {
						resume( function() {
							assertComboState( CKEDITOR.TRISTATE_OFF );
						} );
					} );
					wait();
				} );
			} );
			wait();
		}

		function assertComboState( expected ) {
			combo.updateState( editor );
			assert.areEqual( expected, combo.getState() );
		}
	};
}
