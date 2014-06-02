/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: link,button,htmlwriter,toolbar */

bender.editor = { config :
{
	autoParagraph : false,
	forceSimpleAmpersand : true,
	emailProtection : 'encode'
} };

var protectedMailLink = '<a href=\"javascript:void(location.href=\'mailto:\'+String.fromCharCode(106,111,98,64,99,107,115,111,117,114,99,101,46,99,111,109)+\'?subject=Job%20Request&body=I\\\'m%20looking%20for%20the%20AJD%20position.\')\">AJD</a>';

bender.test(
{
	'test created protected mail link' : function() {
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