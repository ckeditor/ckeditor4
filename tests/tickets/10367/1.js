/* bender-tags: editor,unit */

var tests = {},
	cases = [ '$$', '$&', '$', '$\'', '$0' ];

for ( var i = 0; i < cases.length; i++ )
	tests[ 'test ' + cases[ i ] ] = getTest( cases[ i ] );

function getTest( casee ) {
	return function() {
		var bot = this.editorBot,
			editor = bot.editor;

		bot.setHtmlWithSelection( '<p>A<strong>B^C</strong>D</p>' );

		editor.insertText( casee );

		assert.areSame( '<p>A<strong>B' + casee.replace( '&', '&amp;' ) + 'C</strong>D</p>', bot.getData() );
	};
}

bender.editor = { creator: 'replace', config: {
	extraAllowedContent: 'strong',
	removePlugins: 'entities'
} };
bender.test( tests );