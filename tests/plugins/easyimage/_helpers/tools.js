/* exported easyImageTools */

var easyImageTools = ( function() {
	'use strict';

	// Force Edge to run every test in new CKEditor's instance.
	function createTestsForEditors( editors, tests ) {
		var generatedTests = {},
			test,
			i = 0;

		function generateTest( name ) {
			CKEDITOR.tools.array.forEach( editors, function( editor ) {
				var options = CKEDITOR.tools.object.merge( bender.editors[ editor ], {
					name: editor + i++
				} );

				generatedTests[ name + ' (' + editor + ')' ] = function() {
					bender.editorBot.create( options, function( bot ) {
						tests[ name ]( bot.editor, bot );
					} );
				};
			} );
		}

		if ( !CKEDITOR.env.edge ) {
			return bender.tools.createTestsForEditors( CKEDITOR.tools.objectKeys( bender.editors ), tests );
		}

		for ( test in tests ) {
			if ( test.indexOf( 'test' ) === 0 ) {
				generateTest( test );
			}
		}

		return generatedTests;
	}

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
		CLOUD_SERVICES_UPLOAD_GATEWAY: 'https://files.cke-cs.com/upload/',
		createTestsForEditors: createTestsForEditors,
		assertCommandsState: assertCommandsState,
		assertMenuItemsState: assertMenuItemsState
	};
} )();
