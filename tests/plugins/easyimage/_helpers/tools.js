'use strict';

/* exported easyImageTools */

var easyImageTools = {
	assertCommandsState: function( editor, asserts ) {
		var command;

		for ( command in asserts ) {
			assert.areSame( asserts[ command ], editor.getCommand( command ).state,
				'Command ' + command + ' has appropriate state' );
		}
	}
};