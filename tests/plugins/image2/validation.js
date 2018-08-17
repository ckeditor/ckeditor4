/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: image2,toolbar */

( function() {
	'use strict';

	bender.editors = {
		defaultConfig: {
			name: 'default'
		},
		altRequired: {
			name: 'altRequired',
			config: {
				image2_altRequired: true
			}
		}
	};

	bender.test( {
		spies: [],

		tearDown: function() {
			var currentDialog = CKEDITOR.dialog.getCurrent(),
				spy;

			if ( currentDialog ) {
				currentDialog.hide();
			}

			while ( spy = this.spies.pop() ) {
				spy.restore();
			}

		},

		'test altRequired not set and empty alt is used': function() {
			var bot = this.editorBots.defaultConfig;

			bot.setData( '', function() {
				bot.editor.focus();
				bot.dialog( 'image', function( dialog ) {
					dialog.setValueOf( 'info', 'src', '_assets/foo.png' );
					dialog.getButton( 'ok' ).click();
					assert.areEqual( null, CKEDITOR.dialog.getCurrent(), 'Dialog should be closed' );
				} );
			} );
		},

		'test altRequired is set and empty alt is used': function() {
			var bot = this.editorBots.altRequired,
				spy = sinon.stub( window, 'alert' );

			this.spies.push( spy );

			bot.setData( '', function() {
				bot.editor.focus();
				bot.dialog( 'image', function( dialog ) {
					dialog.setValueOf( 'info', 'src', '_assets/foo.png' );
					dialog.getButton( 'ok' ).click();
					assert.isTrue( spy.calledOnce );
					assert.areEqual( spy.args[0][0], bot.editor.lang.image2.altMissing, 'Should have proper alert message' );

					assert.areEqual( '', bot.editor.getData(), 'Content should not be set' );
					assert.areNotEqual( null, CKEDITOR.dialog.getCurrent(), 'Dialog should be not be closed' );
				} );
			} );
		},

		'test altRequired is set and non-empty alt is used': function() {
			var bot = this.editorBots.altRequired;

			bot.setData( '', function() {
				bot.editor.focus();
				bot.dialog( 'image', function( dialog ) {
					dialog.setValueOf( 'info', 'src', '_assets/foo.png' );
					dialog.setValueOf( 'info', 'alt', 'bar' );
					dialog.getButton( 'ok' ).click();
					assert.areEqual( null, CKEDITOR.dialog.getCurrent(), 'Dialog should be closed' );
				} );
			} );
		}

	} );
} )();
