/* bender-tags: embed */
/* bender-ckeditor-plugins: embed,toolbar */

( function() {
	'use strict';

	bender.test( {

		setUp: function() {
			this.errorSpy = sinon.spy( CKEDITOR, 'error' );
		},

		tearDown: function() {
			this.errorSpy && this.errorSpy.restore();
		},

		'test default embed_provider empty and error thrown': function() {
			var spy = this.errorSpy;

			bender.editorBot.create( {
				name: 'editor1'
			}, function( bot ) {
				assert.isTrue( spy.calledWith( 'embed-no-provider-url' ) );
				assert.areSame( '', bot.editor.widgets.registered.embed.providerUrl.source );
			} );
		},

		'test custom embed_provider used when set and no error thrown': function() {
			var spy = this.errorSpy;

			bender.editorBot.create( {
				name: 'editor2',
				config: {
					embed_provider: 'testurl?url{url}&callback={callback}'
				}
			}, function( bot ) {
				assert.isTrue( spy.notCalled );
				assert.areSame( 'testurl?url{url}&callback={callback}', bot.editor.widgets.registered.embed.providerUrl.source );
			} );
		}
	} );
} )();
