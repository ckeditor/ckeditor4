/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: elementspath */

( function() {
	'use strict';
	// Elements path feature is only available in themed UI creators.
	bender.editor = { creator : 'replace' };

	bender.test( {
		// Assertion picked from elementspathTestsTools.
		assertPath: elementspathTestsTools.assertPath,

		'test elements path on selection change' : function() {
			var bot = this.editorBot;
			bot.setHtmlWithSelection( '<table><tr><td><p>^</p></td></tr></table>' );
			this.assertPath( 'table,tbody,tr,td,p' );
			bot.setHtmlWithSelection( '<div><p><span><b><i><u>^</u></i></b></span></p></div>' );
			this.assertPath( 'div,p,span,b,i,u' );
		},

		'test elements path with contenteditable' : function() {
			this.editorBot.setHtmlWithSelection( bender.tools.getValueAsHtml( 'mixedContentEditableTree' ) );
			this.assertPath( 'div,p,strong,span' );
		},

		'test widget mockup element path': function() {
			this.editorBot.setHtmlWithSelection( bender.tools.getValueAsHtml( 'testWidgetSample' ) );
			this.assertPath( 'div,figcaption' );
		}
	} );
} )();