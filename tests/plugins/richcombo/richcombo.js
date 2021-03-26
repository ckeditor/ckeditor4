/* bender-tags: editor */
/* bender-ckeditor-plugins: richcombo,toolbar */

var customCls = 'my_combo',
	initialLabel = 'Combo Label';

bender.editor = {
	config: {
		toolbar: [ [ 'custom_combo', 'custom_combo_with_options' ] ],
		on: {
			pluginsLoaded: function( evt ) {
				var ed = evt.editor,
					items = {
						'one': 'ONE',
						'two': 'TWO',
						'three': 'THREE'
					};

				ed.ui.addRichCombo( 'custom_combo', {
					className: customCls,
					label: initialLabel,
					panel: {
						css: [],
						multiSelect: false
					},
					init: function() {},
					onClick: function() {},
					onRender: function() {}
				} );

				ed.ui.addRichCombo( 'custom_combo_with_options', {
					className: customCls,
					label: initialLabel,
					panel: {
						css: [],
						multiSelect: false
					},
					init: function() {
						for ( var key in items ) {
							this.add( key, '<span style="color:red">' + key + '</span>', items[ key ] );
						}
					},
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

	// (#4007)
	'test richcombo has aria-expanded=false attribute set at initialisation': function() {
		var editor = this.editor,
			combo = editor.ui.get( 'custom_combo' ),
			comboBtn = CKEDITOR.document.findOne( '#cke_' + combo.id + ' .cke_combo_button' );

		combo.createPanel( editor );

		assert.areEqual( 'false', comboBtn.getAttribute( 'aria-expanded' ), 'Aria-expanded attribute should be set at the element creation.' );
	},

	// (#4007)
	'test richcombo has aria-expanded=true attribute set when opened': function() {
		var editor = this.editor,
			bot = this.editorBot,
			activeCombo = editor.ui.get( 'custom_combo' ),
			inactiveCombo = editor.ui.get( 'custom_combo_with_options' ),
			activeComboBtn = CKEDITOR.document.findOne( '#cke_' + activeCombo.id + ' .cke_combo_button' ),
			inactiveComboBtn = CKEDITOR.document.findOne( '#cke_' + inactiveCombo.id + ' .cke_combo_button' );

		activeCombo.createPanel( editor );

		bot.combo( 'custom_combo', function() {
			assert.areEqual( 'true', activeComboBtn.getAttribute( 'aria-expanded' ), 'Aria-expanded attribute was not set to true.' );
			assert.areEqual( 'false', inactiveComboBtn.getAttribute( 'aria-expanded' ), 'Aria-expanded attribute of different combo was changed' );
		} );
	},

	// (#4493)
	'test richcombo aria-labelledby attribute points to label element of the combobox': function() {
		var editor = this.editor,
			combo = editor.ui.get( 'custom_combo' ),
			comboBtnSelector = '#cke_' + combo.id,
			comboBtn = CKEDITOR.document.findOne( comboBtnSelector + ' .cke_combo_button' ),
			comboBtnLabelElementId = comboBtnSelector.substr( 1 ) + '_label';

		combo.createPanel( editor );

		assert.areEqual( comboBtnLabelElementId, comboBtn.getAttribute( 'aria-labelledby' ), 'Aria-labelledby attribute should point to element with the combo label.' );
	},

	// (#4493)
	'test richcombo label elements contains initial label by default': function() {
		var editor = this.editor,
			combo = editor.ui.get( 'custom_combo' ),
			comboBtnSelector = '#cke_' + combo.id,
			comboBtnLabelSelector = comboBtnSelector + '_label',
			comboBtnLabel = CKEDITOR.document.findOne( comboBtnLabelSelector );

		combo.createPanel( editor );

		assert.areEqual( initialLabel, comboBtnLabel.getHtml() );
	},

	// (#4493)
	'test richcombo label element contains text from selected option': function() {
		var editor = this.editor,
			combo = editor.ui.get( 'custom_combo_with_options' ),
			comboBtnSelector = '#cke_' + combo.id,
			comboBtnLabelSelector = comboBtnSelector + '_label',
			comboBtnLabel = CKEDITOR.document.findOne( comboBtnLabelSelector ),
			expectedLabel = 'ONE, ' + initialLabel;

		combo.createPanel( editor );
		combo.setValue( 'one', 'ONE' );

		assert.areEqual( expectedLabel, comboBtnLabel.getHtml() );
	},

	// (#4493)
	'test richcombo label element contains initial label after richcombo returns to default value': function() {
		var editor = this.editor,
			combo = editor.ui.get( 'custom_combo_with_options' ),
			comboBtnSelector = '#cke_' + combo.id,
			comboBtnLabelSelector = comboBtnSelector + '_label',
			comboBtnLabel = CKEDITOR.document.findOne( comboBtnLabelSelector );

		combo.createPanel( editor );
		combo.setValue( 'one' );
		combo.setValue( '' );

		assert.areEqual( initialLabel, comboBtnLabel.getHtml() );
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

	// (#2565)
	'test right-clicking combo': function() {
		if ( !CKEDITOR.env.ie ) {
			assert.ignore();
		}

		var editor = this.editor,
			combo = editor.ui.get( 'custom_combo' ),
			comboBtn = CKEDITOR.document.findOne( '#cke_' + combo.id + ' .cke_combo_button' ),
			spy;

		combo.createPanel( editor );
		spy = sinon.spy( combo._.panel, 'onShow' );
		bender.tools.dispatchMouseEvent( comboBtn, 'mouseup', CKEDITOR.MOUSE_BUTTON_RIGHT );
		spy.restore();

		assert.areSame( 0, spy.callCount, 'rich combo was no opened' );
	},

	// (#3387)
	'test richcombo.select() should select proper value in combo': function() {
		var editor = this.editor,
			combo = editor.ui.get( 'custom_combo_with_options' );

		combo.createPanel( editor );

		combo.setValue( 'one' );
		assert.areEqual( 'one', combo.getValue() );

		combo.select( function( item ) {
			return item.value === 'three';
		} );
		assert.areEqual( 'three', combo.getValue() );

		combo.select( function( item ) {
			return item.text === 'TWO';
		} );
		assert.areEqual( 'two', combo.getValue() );
	},

	// (#3387)
	'test richcombo.select() should do nothing for combo without options': function() {
		var editor = this.editor,
			combo = editor.ui.get( 'custom_combo' );

		combo.createPanel( editor );

		combo.setValue( 'one' );
		assert.areEqual( 'one', combo.getValue() );

		combo.select( function( option ) {
			return option.value === 'three';
		} );
		assert.areEqual( 'one', combo.getValue() );
	}
} );
