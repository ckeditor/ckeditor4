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
					plugins: 'image,easyimage'
				}
			}, function( bot ) {
				var editor = bot.editor;
				spy.restore();

				bender.tools.ignoreUnsupportedEnvironment( 'easyimage', editor );

				assert.isTrue( spy.calledWith( 'editor-plugin-conflict', { plugin: 'image', replacedWith: 'easyimage' } ) );
				assert.isUndefined( editor.commands.image, 'Command: Image' );
				assert.isNotUndefined( editor.commands.easyimage, 'Command: Easyimage' );
			} );
		},

		// (#1791)
		'test plugin init when image2 is active': function() {
			var spy = sinon.spy( CKEDITOR, 'warn' );

			bender.editorBot.create( {
				name: 'image2',
				config: {
					plugins: 'image,image2,contextmenu'
				}
			}, function( bot ) {
				var editor = bot.editor;

				spy.restore();

				assert.isTrue( spy.calledWith( 'editor-plugin-conflict', { plugin: 'image', replacedWith: 'image2' } ) );
				assert.isNotUndefined( editor.commands.image, 'Command' );
				assert.isNotUndefined( editor.widgets.registered.image, 'Widget' );
				assert.isNotUndefined( editor.getMenuItem( 'image' ), 'Context menu' );
			} );
		}
	} );

} )();
