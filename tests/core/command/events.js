/* bender-tags: editor */

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
		},

		// https://dev.ckeditor.com/ticket/17027
		'test default event data value': function() {
			var beforeExecData;

			this.editor.once( 'beforeCommandExec', function( evt ) {
				beforeExecData = evt.data.commandData;

				assert.isObject( beforeExecData, 'Event data is initialized as an empty object' );
			} );

			this.editor.once( 'afterCommandExec', function( evt ) {
				assert.areSame( beforeExecData, evt.data.commandData, 'The same object is passed to afterCommandExec' );
			} );

			this.editor.addCommand( 'dataFlow', {
				exec: function( editor, data ) {
					assert.areSame( beforeExecData, data, 'Same object is given as data' );
				}
			} );

			this.editor.execCommand( 'dataFlow' );
		}
	} );
} )();
