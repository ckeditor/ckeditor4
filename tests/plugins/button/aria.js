/* bender-tags: editor */
/* bender-ckeditor-plugins: button,toolbar */
/* bender-include: _helpers/buttontools.js */
/* global buttonTools */

bender.editor = {
	config: {
		toolbar: [ [ 'custom_btn', 'disabled_btn', 'haspopup_btn', 'arrow_btn', 'toggle_btn' ] ],
		on: {
			'pluginsLoaded': function( evt ) {
				var editor = evt.editor;
				editor.ui.addButton( 'custom_btn', {
					label: 'aria label'
				} );
				editor.ui.addButton( 'disabled_btn', {
					label: 'disabled button',
					modes: {} // This button should be disabled because it does not work in any of modes.
				} );

				editor.ui.addButton( 'haspopup_btn', {
					hasArrow: 'menu'
				} );

				editor.ui.addButton( 'arrow_btn', {
					label: 'arrow button'
				} );

				editor.ui.addButton( 'toggle_btn', {
					label: 'toggle button',
					isToggle: true
				} );
			}
		}
	}
};

bender.test( {
	'test default button attributes': function() {
		var btn = buttonTools.getUiItem( this.editor, 'custom_btn' ),
			expectedAttributes = buttonTools.typicalButtonAttributes;

		buttonTools.assertAttribtues( expectedAttributes, btn );
	},

	'test disabled button': function() {
		var btn = buttonTools.getUiItem( this.editor, 'disabled_btn' ),
			expectedAttributes = buttonTools.typicalButtonAttributes;

		expectedAttributes[ 'aria-disabled' ] = 'true';
		buttonTools.assertAttribtues( expectedAttributes, btn );
	},

	'test button label': function() {
		var btn = buttonTools.getButtonDomElement( buttonTools.getUiItem( this.editor, 'custom_btn' ) ),
			label = CKEDITOR.document.getById( btn.getAttribute( 'aria-labelledby' ) );

		assert.isTrue( !!label, 'Label element not found' );
		assert.areEqual( 'aria label', label.getText(), 'innerText of label doesn\'t match' );
	},

	// WAI-ARIA 1.1 has added new values for aria-haspopup property (#2072).
	'test aria-haspopup': function() {
		var btn = buttonTools.getUiItem( this.editor, 'haspopup_btn' ),
			btnEl = CKEDITOR.document.getById( btn._.id );
		assert.areEqual( btnEl.getAttribute( 'aria-haspopup' ), 'menu' );
	},

	// (#421)
	'test button label with arrow': function() {
		var button = buttonTools.getUiItem( this.editor, 'arrow_btn' ),
			expectedAttributes = {
				'aria-expanded': 'true'
			};

		button.hasArrow = true;
		button.setState( CKEDITOR.TRISTATE_ON );

		var buttonEl = buttonTools.getButtonDomElement( button ),
			label = CKEDITOR.document.getById( buttonEl.getAttribute( 'aria-labelledby' ) );

		buttonTools.assertAttribtues( expectedAttributes, button );
		assert.areEqual( 'arrow button', label.getText(), 'innerText of label doesn\'t match' );
	},

	// (#2444)
	'test toggle button initial state': function() {
		var button = buttonTools.getUiItem( this.editor, 'toggle_btn' ),
			expectedAttributes = {
				'aria-pressed': 'false'
			};

		buttonTools.assertAttribtues( expectedAttributes, button );
	},

	// (#2444)
	'test toggle button state after switching on': function() {
		var button = buttonTools.getUiItem( this.editor, 'toggle_btn' ),
			expectedAttributes = {
				'aria-pressed': 'true'
			};

		button.setState( CKEDITOR.TRISTATE_ON );

		buttonTools.assertAttribtues( expectedAttributes, button );
	},

	// (#2444)
	'test toggle button state after switching off': function() {
		var button = buttonTools.getUiItem( this.editor, 'toggle_btn' ),
			expectedAttributes = {
				'aria-pressed': 'false'
			};

		button.setState( CKEDITOR.TRISTATE_OFF );

		buttonTools.assertAttribtues( expectedAttributes, button );
	},

	// (#2444)
	'test toggle button state after disabling while being switched on': function() {
		var button = buttonTools.getUiItem( this.editor, 'toggle_btn' ),
			expectedAttributes = {
				'aria-pressed': 'false'
			};

		button.setState( CKEDITOR.TRISTATE_ON );
		button.setState( CKEDITOR.TRISTATE_DISABLED );

		buttonTools.assertAttribtues( expectedAttributes, button );
	}
} );
