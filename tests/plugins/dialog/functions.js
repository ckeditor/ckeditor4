/* bender-tags: editor, dialog */
/* bender-ckeditor-plugins: dialog */

bender.test( {
	'test functions invoke all passed validators joined with default VALIDATE_AND with value': function() {
		var testValue = 'value',
			stubValidator = sinon.stub().returns( true );

		CKEDITOR.dialog.validate.functions(
			stubValidator,
			stubValidator,
			stubValidator
		)( testValue );

		assert.areSame( stubValidator.callCount, 3, 'Validator should be called 3 times.' );
		assert.isTrue( stubValidator.calledWith( testValue ), 'Validator should be called with "' + testValue + '".' );
	},

	'test functions returns true if all inner validators returns true - joined with default VALIDATE_AND': function() {
		var stubValidator = sinon.stub().returns( true );

		var result = CKEDITOR.dialog.validate.functions(
			stubValidator,
			stubValidator,
			stubValidator
		)( 'any value' );

		assert.isTrue( result );
	},

	// (#4449)
	'test functions returns error message if any inner validator returns not true - joined with default VALIDATE_AND': function() {
		var stubTrueValidator = sinon.stub().returns( true ),
			stubFalseValidator = sinon.stub().returns( 'error message' ),
			errorMsg = 'error!';

		var result = CKEDITOR.dialog.validate.functions(
			stubTrueValidator,
			stubFalseValidator,
			errorMsg
		)( 'any value' );

		assert.areSame( errorMsg, result );
	},

	'test functions returns true if any inner validator returns true - joined with VALIDATE_OR': function() {
		var stubTrueValidator = sinon.stub().returns( true ),
			stubFalseValidator = sinon.stub().returns( false );

		var result = CKEDITOR.dialog.validate.functions(
			stubTrueValidator,
			stubFalseValidator,
			'error message',
			CKEDITOR.VALIDATE_OR
		)( 'any value' );

		assert.isTrue( result );
	},

	'test functions returns error message if all inner validator returns not true - joined with VALIDATE_OR': function() {
		var stubFalseValidator = sinon.stub().returns( 'error message' ),
			errorMsg = 'error!';

		var result = CKEDITOR.dialog.validate.functions(
			stubFalseValidator,
			stubFalseValidator,
			errorMsg,
			CKEDITOR.VALIDATE_OR
		)( 'any value' );

		assert.areSame( errorMsg, result );
	},

	'test functions favor getValue context method instead of value parameter': function() {
		var stubValidator = sinon.stub().returns( true ),
			context = {
				getValue: function() {
					return 'getValue';
				}
			};

		CKEDITOR.dialog.validate.functions( stubValidator ).call( context, 'value' );

		assert.areSame( stubValidator.callCount, 1, 'Validator should be called once.' );
		assert.isTrue( stubValidator.calledWith( 'getValue' ), 'Validator should use "getValue" value.' );
	}
} );
