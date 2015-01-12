/* bender-tags: editor,unit */
/* bender-ckeditor-plugins: link,toolbar */

( function() {
	'use strict';

	var jsContent = 'javascript:someFunction();', // jshint ignore:line
		linkContent = 'http://ckeditor.com';

	bender.editors = {
		allowedJS: {
			name: 'allowedJS',
			config: {
				linkJavaScriptLinksAllowed: true
			}
		},
		notAllowedJS: {
			name: 'notAllowedJS'
		}
	};

	bender.test( {
		tearDown: function() {
			var currentDialog = CKEDITOR.dialog.getCurrent();

			if ( currentDialog )
				currentDialog.hide();
		},

		'test blocked JavaScript content in href attribute': function() {
			var bot = this.editorBots.notAllowedJS;

			bot.setData( '', function() {
				bot.editor.focus();
				bot.dialog( 'link', function( dialog ) {
					dialog.setValueOf( 'info', 'url', jsContent );

					assert.throwsError( Error, function() {
						bot.dialog.getButton( 'ok' ).click();
					}, 'Validation error (alert) should be thrown' );

					assert.areEqual( '', bot.editor.getData(), 'Content should not be set' );

					dialog.setValueOf( 'info', 'url', linkContent );
					dialog.getButton( 'ok' ).click();

					assert.areEqual( null, CKEDITOR.dialog.getCurrent(), 'Dialog should be closed' );
				} );
			} );
		},

		'test not blocked JavaScript content in href attribute': function() {
			var bot = this.editorBots.allowedJS;

			bot.setData( '', function() {
				bot.editor.focus();
				bot.dialog( 'link', function( dialog ) {
					dialog.setValueOf( 'info', 'url', jsContent );
					dialog.getButton( 'ok' ).click();

					var hrefValue = bot.editor.document.getElementsByTag( 'a' ).getItem( 0 ).getAttribute( 'href' );
					assert.areEqual( jsContent, hrefValue, 'Href should contain JS link' );
				} );
			} );
		}
	} );
} )();