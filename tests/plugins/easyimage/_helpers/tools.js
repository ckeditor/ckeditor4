/* exported easyImageTools */

var easyImageTools = ( function() {
	'use strict';

	function assertCommandsState( editor, asserts ) {
		var command;

		for ( command in asserts ) {
			assert.areSame( asserts[ command ], editor.getCommand( command ).state,
				'Command ' + command + ' has appropriate state' );
		}
	}

	function assertMenuItemsState( items, asserts ) {
		CKEDITOR.tools.array.forEach( items, function( item ) {
			if ( asserts[ item.command ] ) {
				assert.areSame( asserts[ item.command ], item.state,
					'Menu item ' + item.command + ' has appropriate state' );
			}
		} );
	}

	return {
		CLOUD_SERVICES_UPLOAD_GATEWAY: 'https://33333.cke-cs.com/easyimage/upload/',
		CLOUD_SERVICES_TOKEN_URL: 'https://33333.cke-cs.com/token/dev/ijrDsqFix838Gh3wGO3F77FSW94BwcLXprJ4APSp3XQ26xsUHTi0jcb1hoBt',
		assertCommandsState: assertCommandsState,
		assertMenuItemsState: assertMenuItemsState
	};
} )();
