/* bender-tags: editor, dialog */
/* bender-ckeditor-plugins: dialog */

var validator = {};

bender.test( {
	tearDown: function() {
		validator.composedValidator = null;
		validator.getValue = null;
	},

	'test functions invoke all passed validators joined with default VALIDATE_AND with value': function() {
		var testValue = 'value',
			stubValidator = sinon.stub().returns( true );

		validator.composedValidator = CKEDITOR.dialog.validate.functions(
			stubValidator,
			stubValidator,
			stubValidator
		);

		setupValueGetter( testValue, validator );
		validator.composedValidator();

		assert.areSame( stubValidator.callCount, 3 );
		assert.isTrue( stubValidator.calledWith( testValue ) );
	},

	'test functions returns true if all inner validators returns true - joined with default VALIDATE_AND': function() {
		var stubValidator = sinon.stub().returns( true );

		validator.composedValidator = CKEDITOR.dialog.validate.functions(
			stubValidator,
			stubValidator,
			stubValidator
		);

		setupValueGetter( 'any value', validator );
		var result = validator.composedValidator();

		assert.isTrue( result );
	},

	// (#4449)
	'test functions returns error message if any inner validator returns not true - joined with default VALIDATE_AND': function() {
		var stubTrueValidator = sinon.stub().returns( true ),
			stubFalseValidator = sinon.stub().returns( 'error message' ),
			errorMsg = 'error!';

		validator.composedValidator = CKEDITOR.dialog.validate.functions(
			stubTrueValidator,
			stubFalseValidator,
			errorMsg
		);

		setupValueGetter( 'any value', validator );
		var result = validator.composedValidator();

		assert.areSame( errorMsg, result );
	},

	'test functions returns true if any inner validator returns true - joined with VALIDATE_OR': function() {
		var stubTrueValidator = sinon.stub().returns( true ),
			stubFalseValidator = sinon.stub().returns( false );

		validator.composedValidator = CKEDITOR.dialog.validate.functions(
			stubTrueValidator,
			stubFalseValidator,
			'error message',
			CKEDITOR.VALIDATE_OR
		);

		setupValueGetter( 'any value', validator );
		var result = validator.composedValidator();

		assert.isTrue( result );
	},

	'test functions returns error message if all inner validator returns not true - joined with VALIDATE_OR': function() {
		var stubFalseValidator = sinon.stub().returns( 'error message' ),
			errorMsg = 'error!';

		validator.composedValidator = CKEDITOR.dialog.validate.functions(
			stubFalseValidator,
			stubFalseValidator,
			errorMsg,
			CKEDITOR.VALIDATE_OR
		);

		setupValueGetter( 'any value', validator );
		var result = validator.composedValidator();

		assert.areSame( errorMsg, result );
	}

} );

function setupValueGetter( value, context ) {
	context.getValue = function() {
		return value;
	};
}
