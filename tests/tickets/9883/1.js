/* bender-tags: editor */
/* bender-ckeditor-plugins: maximize,divarea */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		'test leaking inline instances when maximizing': function() {
			var bot = this.editorBot;

			bot.execCommand( 'maximize' );

			wait( function() {
				bot.execCommand( 'maximize' );

				wait( function() {
					assert.isFalse( CKEDITOR.document.getBody().hasAttribute( 'contenteditable' ), 'Topmost body isn\'t contenteditable.' );
				}, 0 );
			}, 0 );
		}
	} );
} )();
