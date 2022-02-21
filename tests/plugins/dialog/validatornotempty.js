/* bender-tags: editor, dialog */
/* bender-ckeditor-plugins: dialog */

var validator = {},
	msg = 'Given string is empty!';

bender.test( {

	setUp: function() {
		validator.notEmptyValidator = CKEDITOR.dialog.validate.notEmpty( msg );
	},

	tearDown: function() {
		validator.notEmptyValidator = null;
		validator.getValue = null;
	},

	'test notEmptyValidator immediate call': function() {
		assert.isTrue( CKEDITOR.dialog.validate.notEmpty( msg )( 'not empty' ) );
	},

	'test notEmptyValidator immediate call empty': function() {
		assert.areSame( CKEDITOR.dialog.validate.notEmpty( msg )( '' ), msg );
	},

	// Next two tests prove - that value could be received in `getValue` way
	// and validator treat them differently, not as some hardcoded manner
	// all edge cases are performed on local value - less code -and we validate the
	// logic - not the way the value is received
	'test notEmptyValidator analyze value from inner getter': function() {
		setupValueGetter( 'not empty value', validator );
		assert.isTrue( validator.notEmptyValidator() );
	},

	'test notEmptyValidator analyze empty value from inner getter': function() {
		setupValueGetter( '', validator );
		assert.areSame( validator.notEmptyValidator(), msg );
	},

	'test notEmptyValidator returns error message for zero length string': function() {
		assert.areSame( validator.notEmptyValidator( '' ), msg );
	},

	'test notEmptyValidator returns error message for string with spaces only': function() {
		assert.areSame( validator.notEmptyValidator( '   ' ), msg );
	},

	'test notEmptyValidator returns true called multiple times on not empty value': function() {
		var value = 'a';
		validator.notEmptyValidator( value );
		assert.isTrue( validator.notEmptyValidator( value ) );
	},

	'test notEmptyValidator returns error msg called multiple times on empty value': function() {
		var value = '   ';
		validator.notEmptyValidator( value );
		assert.areSame( validator.notEmptyValidator( value ), msg );
	},

	'test notEmptyValidator returns error message for unicode u0020 SPACE ': function() {
		assert.areSame( validator.notEmptyValidator( '\u0020' ), msg );
	},

	'test notEmptyValidator returns error message for unicode u00A0 NO-BREAK SPACE': function() {
		assert.areSame( validator.notEmptyValidator( '\u00A0' ), msg );
	},

	'test notEmptyValidator returns error message for unicode u1680 OGHAM SPACE MARK': function() {
		assert.areSame( validator.notEmptyValidator( '\u1680' ), msg );
	},

	'test notEmptyValidator returns error message for unicode u2000 EN QUAD': function() {
		assert.areSame( validator.notEmptyValidator( '\u2000' ), msg );
	},

	'test notEmptyValidator returns error message for unicode u2001 EM QUAD': function() {
		assert.areSame( validator.notEmptyValidator( '\u2001' ), msg );
	},

	'test notEmptyValidator returns error message for unicode u02002 EN SPACE': function() {
		assert.areSame( validator.notEmptyValidator( '\u2002' ), msg );
	},

	'test notEmptyValidator returns error message for unicode u2003 EM SPACE ': function() {
		assert.areSame( validator.notEmptyValidator( '\u2003' ), msg );
	},

	'test notEmptyValidator returns error message for unicode u2004 THREE-PER-EM SPACE ': function() {
		assert.areSame( validator.notEmptyValidator( '\u2004' ), msg );
	},

	'test notEmptyValidator returns error message for unicode u2005 FOUR-PER-EM SPACE ': function() {
		assert.areSame( validator.notEmptyValidator( '\u2005' ), msg );
	},

	'test notEmptyValidator returns error message for unicode u2006 SIX-PER-EM SPACE ': function() {
		assert.areSame( validator.notEmptyValidator( '\u2006' ), msg );
	},

	'test notEmptyValidator returns error message for unicode u2007 FIGURE SPACE ': function() {
		assert.areSame( validator.notEmptyValidator( '\u2007' ), msg );
	},

	'test notEmptyValidator returns error message for unicode u2008 PUNCTUATION SPACE': function() {
		assert.areSame( validator.notEmptyValidator( '\u2008' ), msg );
	},

	'test notEmptyValidator returns error message for unicode u2009 THIN SPACE ': function() {
		assert.areSame( validator.notEmptyValidator( '\u2009' ), msg );
	},

	'test notEmptyValidator returns error message for unicode u2000A HAIR SPACE': function() {
		assert.areSame( validator.notEmptyValidator( '\u200A' ), msg );
	},

	'test notEmptyValidator returns error message for unicode u202F NARROW NO-BREAK SPACE': function() {
		assert.areSame( validator.notEmptyValidator( '\u202F' ), msg );
	},

	'test notEmptyValidator returns error message for unicode u205F MEDIUM MATHEMATICAL SPACE': function() {
		assert.areSame( validator.notEmptyValidator( '\u205F' ), msg );
	},

	'test notEmptyValidator returns error message for unicode u3000 IDEOGRAPHIC SPACE ': function() {
		assert.areSame( validator.notEmptyValidator( '\u3000' ), msg );
	}
} );

function setupValueGetter( value, context ) {
	context.getValue = function() {
		return value;
	};
}
