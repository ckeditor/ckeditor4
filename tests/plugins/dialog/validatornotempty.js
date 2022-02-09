/* bender-tags: editor, dialog */
/* bender-ckeditor-plugins: dialog */

bender.test( {
	setUp: function() {
		this.msg = 'Given string is empty!';
		this.notEmptyValidator = CKEDITOR.dialog.validate.notEmpty( this.msg );
	},

	tearDown: function() {
		this.notEmptyValidator = null;
		this.getValue = null;
	},

	'test notEmptyValidator immediate call': function() {
		assert.isTrue( CKEDITOR.dialog.validate.notEmpty( this.msg )( 'not empty' ) );
	},

	'test notEmptyValidator immediate call empty': function() {
		assert.areSame( CKEDITOR.dialog.validate.notEmpty( this.msg )( '' ), this.msg );
	},
	// Next two tests prove - that value could be received in `getValue` way
	// and validator treat them differently, not as some hardcoded manner
	// all edge cases are performed on local value - less code -and we validate the
	// logic - not the way the value is received
	'test notEmptyValidator analyze value from inner getter': function() {
		setupValueGetter( 'not empty value', this );
		assert.isTrue( this.notEmptyValidator() );
	},

	'test notEmptyValidator analyze empty value from inner getter': function() {
		setupValueGetter( '', this );
		assert.areSame( this.notEmptyValidator(), this.msg );
	},

	'test notEmptyValidator returns error message for zero length string': function() {
		assert.areSame( this.notEmptyValidator( '' ), this.msg );
	},

	'test notEmptyValidator returns true for string with spaces only': function() {
		assert.isTrue( this.notEmptyValidator( '   ' ) );
	},

	'test notEmptyValidator returns error message with multiple calls': function() {
		var value = 'a';
		this.notEmptyValidator( value );
		assert.isTrue( this.notEmptyValidator( value ) );
	},

	'test notEmptyValidator returns true for unicode u0020 SPACE ': function() {
		assert.isTrue( this.notEmptyValidator( '\u0020' ) );
	},

	'test notEmptyValidator returns true for unicode u00A0 NO-BREAK SPACE': function() {
		assert.isTrue( this.notEmptyValidator( '\u00A0' ) );
	},

	'test notEmptyValidator returns true for unicode u1680 OGHAM SPACE MARK': function() {
		assert.isTrue( this.notEmptyValidator( '\u1680' ) );
	},

	'test notEmptyValidator returns true for unicode u2000 EN QUAD': function() {
		assert.isTrue( this.notEmptyValidator( '\u2000' ) );
	},

	'test notEmptyValidator returns true for unicode u2001 EM QUAD': function() {
		assert.isTrue( this.notEmptyValidator( '\u2001' ) );
	},

	'test notEmptyValidator returns true for unicode u02002 EN SPACE': function() {
		assert.isTrue( this.notEmptyValidator( '\u2002' ) );
	},

	'test notEmptyValidator returns true for unicode u2003 EM SPACE ': function() {
		assert.isTrue( this.notEmptyValidator( '\u2003' ) );
	},

	'test notEmptyValidator returns true for unicode u2004 THREE-PER-EM SPACE ': function() {
		assert.isTrue( this.notEmptyValidator( '\u2004' ) );
	},

	'test notEmptyValidator returns true for unicode u2005 FOUR-PER-EM SPACE ': function() {
		assert.isTrue( this.notEmptyValidator( '\u2005' ) );
	},

	'test notEmptyValidator returns true for unicode u2006 SIX-PER-EM SPACE ': function() {
		assert.isTrue( this.notEmptyValidator( '\u2006' ) );
	},

	'test notEmptyValidator returns true for unicode u2007 FIGURE SPACE ': function() {
		assert.isTrue( this.notEmptyValidator( '\u2007' ) );
	},

	'test notEmptyValidator returns true for unicode u2008 PUNCTUATION SPACE': function() {
		assert.isTrue( this.notEmptyValidator( '\u2008' ) );
	},

	'test notEmptyValidator returns true for unicode u00A0 ': function() {
		assert.isTrue( this.notEmptyValidator( '\u00A0' ) );
	},

	'test notEmptyValidator returns true for unicode u2009 THIN SPACE ': function() {
		assert.isTrue( this.notEmptyValidator( '\u2009' ) );
	},

	'test notEmptyValidator returns true for unicode u2000A HAIR SPACE': function() {
		assert.isTrue( this.notEmptyValidator( '\u200A' ) );
	},

	'test notEmptyValidator returns true for unicode u202F NARROW NO-BREAK SPACE': function() {
		assert.isTrue( this.notEmptyValidator( '\u202F' ) );
	},

	'test notEmptyValidator returns true for unicode u205F MEDIUM MATHEMATICAL SPACE': function() {
		assert.isTrue( this.notEmptyValidator( '\u205F' ) );
	},

	'test notEmptyValidator returns true for unicode u3000 IDEOGRAPHIC SPACE ': function() {
		assert.isTrue( this.notEmptyValidator( '\u3000' ) );
	}
} );

function setupValueGetter( value, context ) {
	context.getValue = function() {
		return value;
	};
}
