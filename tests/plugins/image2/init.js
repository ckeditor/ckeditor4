/* bender-tags: editor,widget */
/* bender-include: ../easyimage/_helpers/tools.js */

( function() {
	'use strict';

	bender.test( {
		// (#1791)
		'test plugin init when easyimage is active': function() {
			var spy = sinon.spy( CKEDITOR, 'warn' );

			bender.editorBot.create( {
				name: 'easyimage',
				config: {
					plugins: 'image2,easyimage,contextmenu'
				}
			}, function( bot ) {
				var editor = bot.editor;

				spy.restore();

				bender.tools.ignoreUnsupportedEnvironment( 'easyimage', editor );

				assert.isTrue( spy.calledWith( 'editor-plugin-conflict', { plugin: 'image2', replacedWith: 'easyimage' } ) );
				assert.isUndefined( editor.commands.image, 'Command' );
				assert.isUndefined( editor.widgets.registered.image, 'Widget' );
				assert.isUndefined( editor.getMenuItem( 'image' ), 'Context menu' );
				assert.isNotUndefined( editor.commands.easyimage, 'Command: Easyimage' );
			} );
		}
	} );

} )();
