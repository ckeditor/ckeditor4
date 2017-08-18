/* bender-tags: editor,13421 */
/* bender-ckeditor-plugins: embed,autoembed,enterkey,undo,link */
/* bender-include: ../embedbase/_helpers/tools.js */

/* global embedTools */

'use strict';

var jsonpCallback;

embedTools.mockJsonp( function() {
	jsonpCallback.apply( this, arguments );
} );

bender.editor = {
	creator: 'inline'
};

bender.test( {
	'test notifications showed when embedding is finished correctly': function() {
		var bot = this.editorBot,
			editor = bot.editor,
			pastedText = 'https://foo.bar/notifiacation/finish/correct',
			showNotificationSpy = sinon.spy( editor, 'showNotification' );

		jsonpCallback = function( urlTemplate, urlParams, callback ) {
			resume( function() {
				callback( {
					'url': decodeURIComponent( urlParams.url ),
					'type': 'rich',
					'version': '1.0',
					'html': '<img src="' + decodeURIComponent( urlParams.url ) + '">'
				} );

				showNotificationSpy.restore();
				assert.isTrue( showNotificationSpy.calledOnce, 'Notification should be showed once.' );
				assert.areEqual( showNotificationSpy.firstCall.returnValue.type, 'info', 'Notification should be "info" type.' );
			} );
		};

		bot.setData( '', function() {
			bot.editor.focus();
			this.editor.execCommand( 'paste', pastedText );
			wait();
		} );
	},

	'test notifications showed when embedding is finished with error': function() {
		var bot = this.editorBot,
			editor = bot.editor,
			pastedText = 'https://foo.bar/notifiacation/finish/error',
			showNotificationSpy = sinon.spy( editor, 'showNotification' );

		jsonpCallback = function( urlTemplate, urlParams, callback, errorCallback ) {
			resume( function() {
				errorCallback();

				showNotificationSpy.restore();
				assert.isTrue( showNotificationSpy.calledTwice, 'Notification was showed twice.' );
				assert.areEqual( showNotificationSpy.firstCall.returnValue.type, 'info', 'First notification should have "info" type.' );
				assert.areEqual( showNotificationSpy.secondCall.returnValue.type, 'info', 'Second notification should have "info" type.' );
			} );
		};

		bot.setData( '', function() {
			bot.editor.focus();
			this.editor.execCommand( 'paste', pastedText );
			wait();
		} );
	}
} );
