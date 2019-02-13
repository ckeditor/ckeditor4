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
	'test combo initial state': testComboState( [ {
		expected: CKEDITOR.TRISTATE_OFF
	} ] ),

	// (#1268)
	'test combo state when editor is read only': testComboState( [
		{
			callback: function( combo ) {
				combo.setState( CKEDITOR.TRISTATE_ON );
			},
			expected: CKEDITOR.TRISTATE_ON
		}, {
			callback: function( combo ) {
				combo.setState( CKEDITOR.TRISTATE_OFF );
			},
			expected: CKEDITOR.TRISTATE_OFF
		}
	] ),

	// (#1268)
	'test combo state when editor mode changes': testComboState( [
		{
			callback: function( combo, editor, next ) {
				editor.setMode( 'source', next );
			},
			expected: CKEDITOR.TRISTATE_DISABLED
		}, {
			callback: function( combo, editor, next ) {
				editor.setMode( 'wysiwyg', next );
			},
			expected: CKEDITOR.TRISTATE_OFF
		}
	], true ),

	// (#1268)
	'test combo state when combo is on': testComboState( [
		{
			callback: function( combo ) {
				combo.setState( CKEDITOR.TRISTATE_ON );
			},
			expected: CKEDITOR.TRISTATE_ON
		}, {
			callback: function( combo ) {
				combo.setState( CKEDITOR.TRISTATE_OFF );
			},
			expected: CKEDITOR.TRISTATE_OFF
		}
	] )
} );

function testComboState( steps, async ) {
	return function() {
		var editor = this.editor,
			combo = editor.ui.get( 'custom_combo' );

		var i = 0;

		if ( async ) {
			performAsyncSteps();
		} else {
			CKEDITOR.tools.array.forEach( steps, function( step ) {
				step.callback && step.callback( combo, editor, assertComboState );
				step.expected && assertComboState( step.expected );
			} );
		}

		function performAsyncSteps() {
			steps[ i ].callback( combo, editor, function() {
				resume( function() {
					assertComboState( steps[ i ].expected );
					steps[ ++i ] && performAsyncSteps();
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
