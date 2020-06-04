/* bender-tags: editor */
/* bender-ckeditor-plugins: list,justify,bidi,table,forms,toolbar */
/* bender-ckeditor-remove-plugins: entities */

bender.editors = {
	classic: {
		creator: 'replace',
		name: 'classic'
	},
	divarea: {
		name: 'divarea',
		creator: 'replace',
		config: {
			extraPlugins: 'divarea'
		}
	},
	inline: {
		name: 'inline',
		creator: 'inline'
	}
};

var tests = {
	'test conversion of embedded unordered list and paragraphs to numbered list': function( editor, bot ) {
		// Strange test result for: 0, 8
		var testesLength = 9,
			testPrefix = 'test_single_',
			i;

		for ( i = 0; i < testesLength; i++ ) {
			bender.tools.testInputOut( testPrefix + i, function( input, expected ) {
				bot.setHtmlWithSelection( input );
				bot.execCommand( 'numberedlist' );
				assert.beautified.html( expected, bot.getData( false, true ), 'Problem with test case: "' + testPrefix + i + '"' );
			} );
		}
	},
	'test double conversion lists': function( editor, bot ) {
		bender.tools.testInputOut( 'test_double_0', function( input, expected ) {
			bot.setHtmlWithSelection( input );
			bot.execCommand( 'numberedlist' );
			bot.execCommand( 'numberedlist' );
			assert.beautified.html( expected, bot.getData( false, true ), 'Problem with test case: "test_double_0"' );
		} );
	},
	'test lists which generates error during conversion': function( editor, bot ) {
		var testesLength = 3,
			testPrefix = 'test_errors_',
			i;

		for ( i = 0; i < testesLength; i++ ) {
			bender.tools.testInputOut( testPrefix + i, function( input, expected ) {
				bot.setHtmlWithSelection( input );
				bot.execCommand( 'numberedlist' );
				assert.beautified.html( expected, bot.getData( false, true ), 'Problem with test case: "' + testPrefix + i + '"' );
			} );
		}
	}
};

tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

bender.test( tests );
