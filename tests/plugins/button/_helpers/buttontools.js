window.buttonTools = {
	// Standard aria attributes for button element.
	buttonStandardAriaAttributes: {
		'aria-disabled': 'false',
		'role': 'button',
		'aria-haspopup': 'false',
		'aria-labelledby': /^cke_\d+_label$/
	},

	// Asserts that button has given attributes, with given values.
	// Expected attribute value may be a regexp.
	// @param {Object} expectedAttributes
	// @param {CKEDITOR.ui.button} button UI button to be tested.
	assertAttributes: function( expectedAttributes, button ) {
		var buttonElement = this.getButtonDomElement( button ),
			expectedValue,
			attributeValue;

		for ( var attrName in expectedAttributes ) {
			assert.isTrue( buttonElement.hasAttribute( attrName ), 'Button HTML element does not contain ' +
				attrName + ' attribute.' );

			expectedValue = expectedAttributes[ attrName ];
			attributeValue = buttonElement.getAttribute( attrName );

			if ( expectedValue instanceof RegExp ) {
				assert.isTrue( expectedValue.test( attributeValue ), 'Attribute ' + attrName +
					' did not matched expected ' + expectedValue + ' regex' );
			}
			else {
				assert.areSame( expectedValue, attributeValue, 'Invalid value for attribute ' + attrName + '.' );
			}
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
	},

	createAriaPressedTests: function( editorName, buttons ) {
		var tests = {};

		CKEDITOR.tools.array.forEach( buttons, function( button ) {
			createTestCasesForButton( button );
		} );

		return tests;

		function createTestCasesForButton( button ) {
			tests[ 'test ' + button + ' button initial state' ] = createTestCase( button, 'false' );

			tests[ 'test ' + button + ' button state after switching on' ] = createTestCase( button, 'true', [
				CKEDITOR.TRISTATE_ON
			] );

			tests[ 'test ' + button + ' button state after switching off' ] = createTestCase( button, 'false', [
				CKEDITOR.TRISTATE_OFF
			] );

			tests[ 'test ' + button + ' button state after disabling while being switched on' ] = createTestCase(
				button,
				'false', [
					CKEDITOR.TRISTATE_ON,
					CKEDITOR.TRISTATE_DISABLED
				] );
		}

		function createTestCase( buttonName, expected, stateChanges ) {
			return function() {
				var button = window.buttonTools.getUiItem( CKEDITOR.instances[ editorName ], buttonName ),
					expectedAttributes = {
						'aria-pressed': expected
					};

				CKEDITOR.tools.array.forEach( stateChanges || [], function( state ) {
					button.setState( state );
				} );

				window.buttonTools.assertAttributes( expectedAttributes, button );
			};
		}
	}
};
