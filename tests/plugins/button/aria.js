/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: button,toolbar */

bender.editor = {
	config: {
		toolbar: [ [ 'custom_btn', 'disabled_btn' ] ],
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
			}
		}
	}
};

bender.test( {
	setUp: function() {
		// Standard aria attributes for button element.
		this.typicalButtonAttributes = {
			'aria-disabled': 'false',
			'role': 'button',
			'aria-haspopup': 'false',
			'aria-labelledby': /^cke_\d+_label$/
		};
	},

	'test default button attributes': function() {
		var btn = this.getUiItem( 'custom_btn' ),
			expectedAttributes = this.typicalButtonAttributes;

		this.assertAttribtues( expectedAttributes, btn );
	},

	'test disabled button': function() {
		var btn = this.getUiItem( 'disabled_btn' ),
			expectedAttributes = this.typicalButtonAttributes;

		expectedAttributes[ 'aria-disabled' ] = 'true';
		this.assertAttribtues( expectedAttributes, btn );
	},

	'test button label': function() {
		var btn = this.getButtonDomElement( this.getUiItem( 'custom_btn' ) ),
			label = CKEDITOR.document.getById( btn.getAttribute( 'aria-labelledby' ) );

		assert.isTrue( !!label, 'Label element not found' );
		assert.areEqual( 'aria label', label.getText(), 'innerText of label doesn\'t match' );
	},

	// Asserts that button has given attributes, with given values.
	// Expected attribute value may be a regexp.
	// @param {Object} expectedAttributes
	// @param {CKEDITOR.ui.button} button UI button to be tested.
	assertAttribtues: function( expectedAttributes, button ) {
		var buttonElement = this.getButtonDomElement( button ),
			expectedValue,
			attributeValue;

		for ( var attrName in expectedAttributes ) {
			assert.isTrue( buttonElement.hasAttribute( attrName ), 'Button HTML element does not contain ' + attrName + ' attribute.' );

			expectedValue = expectedAttributes[ attrName ];
			attributeValue = buttonElement.getAttribute( attrName );

			if ( expectedValue instanceof RegExp )
				assert.isTrue( expectedValue.test( attributeValue ), 'Attribute ' + attrName + ' did not matched expected ' + expectedValue + ' regex' );
			else
				assert.areSame( expectedValue, attributeValue, 'Invalid value for attribute ' + attrName + '.' );
		}
	},

	// Returns button object.
	// @param {String} name Name of the button in ui.
	// @return {CKEDITOR.ui.button}
	getUiItem: function( name ) {
		return this.editor.ui.get( name );
	},

	// Returns html element for given menu.
	// @param {CKEDITOR.ui.button} uiButton
	// @return {CKEDITOR.dom.element}
	getButtonDomElement: function( uiButton ) {
		return CKEDITOR.document.getById( uiButton._.id );
	}
} );