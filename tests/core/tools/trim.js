/* bender-tags: editor */

( function() {
	'use strict';

	var tests = {
		'test trim leave empty string if contains only spaces': function() {
			assert.areSame( '', CKEDITOR.tools.trim( '   ' ), 'Trim does not remove spaces only.' );
		}

	};

	createTrimTest( '   ', 'both side spaces', false );
	createTrimTest( '\r', 'carret feed', false );
	createTrimTest( ' \n \t  ', 'mixed spaces, tabs, new line', false );
	createTrimTest( '\u0020', 'space u0020', false );

	createTrimTest( '\u00A0', 'non breakable space u00A0', true );
	createTrimTest( '\u1680', 'OGHAM SPACE MARK u1680', true );
	createTrimTest( '\u2000', 'EN QUAD u2000', true );
	createTrimTest( '\u2001', 'EM QUAD u2001', true );
	createTrimTest( '\u2002', 'EN SPACE u2002', true );
	createTrimTest( '\u2003', 'EM SPACE u2003', true );
	createTrimTest( '\u2004', 'THREE-PER_EM SPACE u2004', true );
	createTrimTest( '\u2005', 'FOUR-PER_EM SPACE u2005', true );
	createTrimTest( '\u2006', 'SIX-PER_EM SPACE u2006', true );
	createTrimTest( '\u2007', 'FIGURE SPACE u2007', true );
	createTrimTest( '\u2008', 'PUNCTUATION SPACE u2008', true );
	createTrimTest( '\u2009', 'THIN SPACE u2009', true );
	createTrimTest( '\u200A', 'HAIR SPACE u200A', true );
	createTrimTest( '\u202F', 'NARROW NO-BREAK SPACE u202F', true );
	createTrimTest( '\u205F', 'MEDIUM MATHEMATICAL u205F', true );
	createTrimTest( '\u3000', 'IDEOGRAPHIC SPACE u3000', true );

	bender.test( tests );

	function createTrimTest( characters, charactersNaming, preserve ) {
		var expected = preserve ? characters + 'test' + characters : 'test';
		var testActionName = preserve ? 'preserve' : 'removes';

		tests[ 'test trim ' + testActionName + ' characters ' + charactersNaming ] = function() {
			assert.areSame(
				expected,
				CKEDITOR.tools.trim( characters + 'test' + characters ),
				'Trimming string not ' + testActionName + ' characters: ' + charactersNaming
			);
		};
	}
} )();
