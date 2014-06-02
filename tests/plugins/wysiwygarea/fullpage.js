/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: basicstyles,toolbar */

// Editor styles must be removed before the comparison occurs.
// It is due the fact that different browsers use different styles.
// The following regex handles the problem.
var removeStyle = /<style[\s\S]+style>/g;

bender.editor = {
	creator: 'replace',
	config: {
		docType: '',
		contentsLangDirection: 'ltr',
		fullPage: true,
		contentsCss: []
	}
};

bender.test(
{
	'test load full-page data' : function() {
		var bot = this.editorBot;
		bender.tools.testInputOut( 'fullpage1', function( source, expected ) {
			bot.setData( source, function() {
				assert.areSame( bender.tools.compatHtml( expected ),
					bot.getData( true ).replace( removeStyle, '' ) );	// remove styles from data
			} );
		} );
	},

	'test load full-page data (with doctype)': function() {
		var bot = this.editorBot;
		bender.tools.testInputOut( 'fullpage2', function( source, expected ) {
			bot.setData( source, function() {
				assert.areSame( bender.tools.compatHtml( expected ),
					bot.getData( true, true ).replace( removeStyle, '' ) );	// remove styles from data
			} );
		} );
	}
} );

//]]>