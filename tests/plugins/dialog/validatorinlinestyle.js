/* bender-tags: editor, dialog */
/* bender-ckeditor-plugins: dialog */

bender.test( {
	setUp: function() {
		this.inlineStyleValidator = CKEDITOR.dialog.validate.inlineStyle( 'Invalid inline styles!' );
	},

	tearDown: function() {
		this.inlineStyleValidator = null;
	},

	'test empty styles validates to true': function() {
		assert.isTrue( this.inlineStyleValidator( '' ) );
	},

	'test valid styles validates to true': function() {
		assert.isTrue( this.inlineStyleValidator( 'height: 10px; width: 20px;' ) );
	},

	'test valid styles (no spacing) validates to true': function() {
		assert.isTrue( this.inlineStyleValidator( 'height:10px;width:20px;' ) );
	},

	'test valid styles (additional spacing, missing ; at the end) validates to true': function() {
		assert.isTrue( this.inlineStyleValidator( '  height:     10px; width:         20px' ) );
	},

	'test valid styles (long version) validates to true': function() {
		assert.isTrue( this.inlineStyleValidator(
			'font-family: \'Arial\', \'Helvetica\', sans-serif; font-size: 14px; position: absolute; top: 0; right: 0;' +
			'width: 100%; list-style-type: none; margin: 0; padding: 56px 0 0; z-index: 1000; text-shadow: none;'
		) );
	},

	'test valid styles (long version with no \' escaping) validates to true': function() {
		assert.isTrue( this.inlineStyleValidator(
			"font-family: 'Arial', 'Helvetica', sans-serif; font-size: 14px; position: absolute; top: 0; right: 0;" +
			'width: 100%; list-style-type: none; margin: 0; padding: 56px 0 0; z-index: 1000; text-shadow: none;'
		) );
	},

	'test valid styles validates to true (edge case #1)': function() {
		assert.isTrue( this.inlineStyleValidator( '\\9: bar;' ) );
	},

	'test invalid styles returns error message': function() {
		assert.areEqual( this.inlineStyleValidator( 'test' ), 'Invalid inline styles!' );
	},

	'test valid styles but with duplicated ; returns error message': function() {
		assert.areEqual( this.inlineStyleValidator( 'height: 10px;; width: 20px;' ), 'Invalid inline styles!' );
	},

	'test valid styles but with duplicated : returns error message': function() {
		assert.areEqual( this.inlineStyleValidator( 'height:: 10px;' ), 'Invalid inline styles!' );
	},

	'test invalid styles returns error message (edge case #1)': function() {
		assert.areEqual( this.inlineStyleValidator( '-: foo;' ), 'Invalid inline styles!' );
	},

	'test invalid styles returns error message (edge case #2)': function() {
		assert.areEqual( this.inlineStyleValidator( '9: bar;' ), 'Invalid inline styles!' );
	},

	'test invalid styles returns error message (edge case #3)': function() {
		assert.areEqual( this.inlineStyleValidator( 'foo: ;' ), 'Invalid inline styles!' );
	},

	'test invalid styles returns error message (edge case #4)': function() {
		assert.areEqual( this.inlineStyleValidator( 'foo' ), 'Invalid inline styles!' );
	}
} );
