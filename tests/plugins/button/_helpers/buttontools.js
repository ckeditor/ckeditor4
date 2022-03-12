window.buttonTools = {
	// Standard aria attributes for button element.
	typicalButtonAttributes: {
		'aria-disabled': 'false',
		'role': 'button',
		'aria-haspopup': 'false',
		'aria-labelledby': /^cke_\d+_label$/
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
	// @param {CKEDITOR.editor} editor
	// @param {String} name Name of the button in ui.
	// @return {CKEDITOR.ui.button}
	getUiItem: function( editor, name ) {
		return editor.ui.get( name );
	},

	// Returns html element for given menu.
	// @param {CKEDITOR.ui.button} uiButton
	// @return {CKEDITOR.dom.element}
	getButtonDomElement: function( uiButton ) {
		return CKEDITOR.document.getById( uiButton._.id );
	}
};
