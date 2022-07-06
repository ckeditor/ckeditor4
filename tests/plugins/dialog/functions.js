/* bender-tags: editor, dialog */
/* bender-ckeditor-plugins: dialog */

bender.test( {
	'test functions invoke all passed validators joined with default VALIDATE_AND with value': function() {
		var testValue = 'value',
			stubValidator = sinon.stub().returns( true );

		validateFunctions( testValue, [
			stubValidator,
			stubValidator,
			stubValidator
		] );

		assert.areSame( stubValidator.callCount, 3, 'Validator should be called 3 times.' );
		assert.isTrue( stubValidator.calledWith( testValue ), 'Validator should be called with "' + testValue + '".' );
	},

	'test functions returns true if all inner validators returns true - joined with default VALIDATE_AND': function() {
		var stubValidator = sinon.stub().returns( true );

		var result = validateFunctions( 'any value', [
			stubValidator,
			stubValidator,
			stubValidator
		] );

		assert.isTrue( result );
	},

	// (#4449)
	'test functions returns error message if any inner validator returns not true - joined with default VALIDATE_AND': function() {
		var stubTrueValidator = sinon.stub().returns( true ),
			stubFalseValidator = sinon.stub().returns( 'error message' ),
			errorMsg = 'error!';

		var result = validateFunctions( 'any value', [
			stubTrueValidator,
			stubFalseValidator,
			errorMsg
		] );

		assert.areSame( errorMsg, result );
	},

	'test functions returns true if any inner validator returns true - joined with VALIDATE_OR': function() {
		var stubTrueValidator = sinon.stub().returns( true ),
			stubFalseValidator = sinon.stub().returns( false );

		var result = validateFunctions( 'any value', [
			stubTrueValidator,
			stubFalseValidator,
			'error message',
			CKEDITOR.VALIDATE_OR
		] );

		assert.isTrue( result );
	},

	'test functions returns error message if all inner validator returns not true - joined with VALIDATE_OR': function() {
		var stubFalseValidator = sinon.stub().returns( 'error message' ),
			errorMsg = 'error!';

		var result = validateFunctions( 'any value', [
			stubFalseValidator,
			stubFalseValidator,
			errorMsg,
			CKEDITOR.VALIDATE_OR
		] );

		assert.areSame( errorMsg, result );
	}
} );

function validateFunctions( value, functions ) {
	// Use that validator context to stub `getValue` method.
	var context = {
		getValue: function() {
			return value;
		}
	};

	var validator = CKEDITOR.dialog.validate.functions.apply( null, functions );

	return validator.apply( context );
}
