/* bender-tags: editor,unit */

( function() {
	'use strict';

	bender.editor = {};

	bender.test( {
		'test beforeCommandExec canceling': function() {
			var cmdCalled = false;

			this.editor.once( 'beforeCommandExec', function( evt ) {
				evt.cancel();
			}, null, null, 1 );

			this.editor.addCommand( 'mockupCommand', {
				exec: function() {
					cmdCalled = true;
				}
			} );

			this.editor.execCommand( 'mockupCommand' );
			assert.isFalse( cmdCalled, 'Command should not be called if beforeCommandExec evt was canceled' );
		},

		'test no beforeCommandExec listeners': function() {
			var cmdCalled = false;

			this.editor.addCommand( 'mockupCommand', {
				exec: function() {
					cmdCalled = true;
				}
			} );

			this.editor.execCommand( 'mockupCommand' );
			assert.isTrue( cmdCalled, 'Command should be called' );
		}
	} );
} )();