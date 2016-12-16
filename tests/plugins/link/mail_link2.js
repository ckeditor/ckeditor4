/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: link,button,toolbar */

bender.editor = {
	config: {
		autoParagraph: false,
		forceSimpleAmpersand: true,
		emailProtection: 'mt(BODY,SUBJECT,NAME,DOMAIN)'
	}
};

var protectedMailLink = '<a href=\"javascript:mt(\'I\\\'m%20looking%20for%20the%20AJD%20position.\',\'Job%20Request\',\'job\',\'cksource.com\')\">AJD</a>';

bender.test( {
	'test created protected mail link': function() {
		var bot = this.editorBot;
		bot.setHtmlWithSelection( '<a href="#">[AJD]</a>' );
		bot.dialog( 'link', function( dialog ) {
			var linkTypeField = dialog.getContentElement( 'info', 'linkType' ),
			addressField = dialog.getContentElement( 'info', 'emailAddress' ),
			subjectField = dialog.getContentElement( 'info', 'emailSubject' ),
			bodyField = dialog.getContentElement( 'info', 'emailBody' );

			linkTypeField.setValue( 'email' );
			addressField.setValue( 'job@cksource.com' );
			subjectField.setValue( 'Job Request' );
			bodyField.setValue( 'I\'m looking for the AJD position.' );

			dialog.fire( 'ok' );
			dialog.hide();

			assert.areSame( protectedMailLink, bot.getData( false, true ) );
		} );
	},

	'test read from protected mail link': function() {
		var bot = this.editorBot;
		bot.setHtmlWithSelection( '[' + protectedMailLink + ']' );
		bot.dialog( 'link', function( dialog ) {
			var linkTypeField = dialog.getContentElement( 'info', 'linkType' ),
			addressField = dialog.getContentElement( 'info', 'emailAddress' ),
			subjectField = dialog.getContentElement( 'info', 'emailSubject' ),
			bodyField = dialog.getContentElement( 'info', 'emailBody' );

			assert.areEqual( 'email', linkTypeField.getValue() );
			assert.areEqual( 'job@cksource.com', addressField.getValue() );
			assert.areEqual( 'Job Request', subjectField.getValue() );
			assert.areEqual( 'I\'m looking for the AJD position.', bodyField.getValue() );

			dialog.fire( 'ok' );
			dialog.hide();
		} );
	}
} );

//]]>