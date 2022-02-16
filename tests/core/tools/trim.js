/* bender-tags: editor */

( function() {
	'use strict';

	var tests = {
		'test trim leave empty string if contains only spaces': function() {
			assert.areSame( '', CKEDITOR.tools.trim( '   ' ), 'Trim does not remove spaces only' );
		},

		'test trim remove spaces from both sides of the string': function() {
			assert.areSame( 'test', CKEDITOR.tools.trim( '    test   ' ) );
		},

		'test trim remove mixed: new line, tabs and spaces from both sides of the string': function() {
			assert.areSame( 'test', CKEDITOR.tools.trim( ' \n \t  test\n  \t ' ) );
		}
	};

	createUnicodeTrimTest( '\u00A0', 'non breakable space u00A0' );
	createUnicodeTrimTest( '\u0020', 'space u0020' );
	createUnicodeTrimTest( '\u1680', 'OGHAM SPACE MARK u1680' );
	createUnicodeTrimTest( '\u2000', 'EN QUAD u2000' );
	createUnicodeTrimTest( '\u2001', 'EM QUAD u2001' );
	createUnicodeTrimTest( '\u2002', 'EN SPACE u2002' );
	createUnicodeTrimTest( '\u2003', 'EM SPACE u2003' );
	createUnicodeTrimTest( '\u2004', 'THREE-PER_EM SPACE u2004' );
	createUnicodeTrimTest( '\u2005', 'FOUR-PER_EM SPACE u2005' );
	createUnicodeTrimTest( '\u2006', 'SIX-PER_EM SPACE u2006' );
	createUnicodeTrimTest( '\u2007', 'FIGURE SPACE u2007' );
	createUnicodeTrimTest( '\u2008', 'PUNCTUATION SPACE u2008' );
	createUnicodeTrimTest( '\u2009', 'THIN SPACE u2009' );
	createUnicodeTrimTest( '\u200A', 'HAIR SPACE u200A' );
	createUnicodeTrimTest( '\u202F', 'NARROW NO-BREAK SPACE u202F' );
	createUnicodeTrimTest( '\u205F', 'MEDIUM MATHEMATICAL u205F' );
	createUnicodeTrimTest( '\u3000', 'IDEOGRAPHIC SPACE u3000' );

	bender.test( tests );

	function createUnicodeTrimTest( unicode, unicodeName ) {
		var expected = 'test';
		tests[ 'test trim removes unicode characters ' + unicodeName ] = function() {
			assert.areSame(
				expected,
				CKEDITOR.tools.trim( unicode + 'test' + unicode ),
				'Unicode character was not removed: ' + unicodeName
			);
		};
	}
} )();
