/* bender-tags: editor, dialog, 4473 */
/* bender-ckeditor-plugins: dialog */

var errorMsg = 'error!';

bender.test( {
	// (#4473)
	'test validator cssLength should accept passed argument': function() {
		var positiveResult = CKEDITOR.dialog.validate.cssLength( errorMsg )( '10pt' );
		var negativeResult = CKEDITOR.dialog.validate.cssLength( errorMsg )( 'solid' );

		assert.isTrue( positiveResult );
		assert.areSame( errorMsg, negativeResult );
	},

	// (#4473)
	'test validator htmlLength should accept passed argument': function() {
		var result = CKEDITOR.dialog.validate.htmlLength( errorMsg )( '10px' );
		var negativeResult = CKEDITOR.dialog.validate.htmlLength( errorMsg )( 'solid' );

		assert.isTrue( result );
		assert.areSame( errorMsg, negativeResult );
	},

	// (#4473)
	'test validator equals should accept passed argument': function() {
		var result = CKEDITOR.dialog.validate.equals( 'foo', errorMsg )( 'foo' );
		var negativeResult = CKEDITOR.dialog.validate.equals( 'foo', errorMsg )( 'baz' );

		assert.isTrue( result );
		assert.areSame( errorMsg, negativeResult );
	},

	// (#4473)
	'test validator notEqual should accept passed argument': function() {
		var result = CKEDITOR.dialog.validate.notEqual( 'foo', errorMsg )( 'baz' );
		var negativeResult = CKEDITOR.dialog.validate.notEqual( 'foo', errorMsg )( 'foo' );

		assert.isTrue( result );
		assert.areSame( errorMsg, negativeResult );
	},

	// (#4473)
	'test validator inlineStyle should accept passed argument': function() {
		var result = CKEDITOR.dialog.validate.inlineStyle( errorMsg )( 'height: 10px; width: 20px;' );
		var resultFromEmpty = CKEDITOR.dialog.validate.inlineStyle( errorMsg )( '' );
		var negativeResult = CKEDITOR.dialog.validate.inlineStyle( errorMsg )( 'test' );

		assert.isTrue( result );
		assert.isTrue( resultFromEmpty );
		assert.areSame( errorMsg, negativeResult );
	},

	'test validator integer should accept passed argument': function() {
		var result = CKEDITOR.dialog.validate.integer( errorMsg )( '123' );
		var negativeResult = CKEDITOR.dialog.validate.integer( errorMsg )( '123.321' );

		assert.isTrue( result );
		assert.areSame( errorMsg, negativeResult );
	},

	'test validator notEmpty should accept passed argument': function() {
		var result = CKEDITOR.dialog.validate.notEmpty( errorMsg )( 'test' );
		var negativeResult = CKEDITOR.dialog.validate.notEmpty( errorMsg )( '  ' );

		assert.isTrue( result );
		assert.areSame( errorMsg, negativeResult );
	},

	'test validator number should accept passed argument': function() {
		var result = CKEDITOR.dialog.validate.number( errorMsg )( '123' );
		var negativeResult = CKEDITOR.dialog.validate.number( errorMsg )( 'test' );

		assert.isTrue( result );
		assert.areSame( errorMsg, negativeResult );
	},

	'test validator regex should accept passed argument': function() {
		var result = CKEDITOR.dialog.validate.regex( /^\d*$/, errorMsg )( '123' );
		var negativeResult = CKEDITOR.dialog.validate.regex( /^\d*$/, errorMsg )( '123.321' );

		assert.isTrue( result );
		assert.areSame( errorMsg, negativeResult );
	}
} );


