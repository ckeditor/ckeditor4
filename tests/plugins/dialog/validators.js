/* bender-tags: editor, dialog */
/* bender-ckeditor-plugins: dialog */

bender.test( {
	setUp: function() {
		this.inlineStyleValidator = CKEDITOR.dialog.validate.inlineStyle( 'Invalid inline styles!' );
	},

	tearDown: function() {
		this.inlineStyleValidator = null;
		this.getValue = null;
	},

	'test empty styles validates to true': function() {
		setupValueGetter( '', this );
		assert.isTrue( this.inlineStyleValidator() );
	},

	'test valid styles validates to true': function() {
		setupValueGetter( 'height: 10px; width: 20px;', this );
		assert.isTrue( this.inlineStyleValidator() );
	},

	'test valid styles (no spacing) validates to true': function() {
		setupValueGetter( 'height:10px;width:20px;', this );
		assert.isTrue( this.inlineStyleValidator() );
	},

	'test valid styles (additional spacing, missing ; at the end) validates to true': function() {
		setupValueGetter( '  height:     10px; width:         20px', this );
		assert.isTrue( this.inlineStyleValidator() );
	},

	'test valid styles (long version) validates to true': function() {
		setupValueGetter( 'font-family: \'Arial\', \'Helvetica\', sans-serif; font-size: 14px; position: absolute; top: 0; right: 0;' +
			'width: 100%; list-style-type: none; margin: 0; padding: 56px 0 0; z-index: 1000; text-shadow: none;', this );
		assert.isTrue( this.inlineStyleValidator() );
	},

	'test valid styles (long version with no \' escaping) validates to true': function() {
		setupValueGetter( "font-family: 'Arial', 'Helvetica', sans-serif; font-size: 14px; position: absolute; top: 0; right: 0;" +
			'width: 100%; list-style-type: none; margin: 0; padding: 56px 0 0; z-index: 1000; text-shadow: none;', this );
		assert.isTrue( this.inlineStyleValidator() );
	},

	'test valid styles validates to true (edge case #1)': function() {
		setupValueGetter( '\\9: bar;', this );
		assert.isTrue( this.inlineStyleValidator() );
	},

	'test invalid styles returns error message': function() {
		setupValueGetter( 'test', this );
		assert.areEqual( this.inlineStyleValidator(), 'Invalid inline styles!' );
	},

	'test valid styles but with duplicated ; returns error message': function() {
		setupValueGetter( 'height: 10px;; width: 20px;', this );
		assert.areEqual( this.inlineStyleValidator(), 'Invalid inline styles!' );
	},

	'test valid styles but with duplicated : returns error message': function() {
		setupValueGetter( 'height:: 10px;', this );
		assert.areEqual( this.inlineStyleValidator(), 'Invalid inline styles!' );
	},

	'test invalid styles returns error message (edge case #1)': function() {
		setupValueGetter( '-: foo;', this );
		assert.areEqual( this.inlineStyleValidator(), 'Invalid inline styles!' );
	},

	'test invalid styles returns error message (edge case #2)': function() {
		setupValueGetter( '9: bar;', this );
		assert.areEqual( this.inlineStyleValidator(), 'Invalid inline styles!' );
	},

	'test invalid styles returns error message (edge case #3)': function() {
		setupValueGetter( 'foo: ;', this );
		assert.areEqual( this.inlineStyleValidator(), 'Invalid inline styles!' );
	},

	'test invalid styles returns error message (edge case #4)': function() {
		setupValueGetter( 'foo: ', this );
		assert.areEqual( this.inlineStyleValidator(), 'Invalid inline styles!' );
	}
} );

// Setup `getValue()` method for the current context due to #4473.
function setupValueGetter( value, context ) {
	context.getValue = function() {
		return value;
	};
}
