/* bender-tags: editor, dialog */
/* bender-ckeditor-plugins: dialog */

var validator = {};

bender.test( {
	// (#4449)
	'test functions returns error message if inner validator fails': function() {
		var errorMsg = 'error!';
		validator.notEmptyNumberValidator = CKEDITOR.dialog.validate.functions(
			CKEDITOR.dialog.validate.notEmpty( 'Value is required.' ),
			CKEDITOR.dialog.validate.number( 'Value is not a number.' ),
			errorMsg
		);

		setupValueGetter( 'not a number', validator );

		var result = validator.notEmptyNumberValidator();
		assert.areSame( errorMsg, result );
	}
} );


function setupValueGetter( value, context ) {
	context.getValue = function() {
		return value;
	};
}
