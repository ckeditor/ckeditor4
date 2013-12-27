/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview The "autotexto" plugin.
 *
 */

(function()
{
	
	CKEDITOR.plugins.add( 'autotexto',
	{
		requires : [ 'dialog' ],
		init : function( editor )
		{
			var lang = editor.lang.autotexto;
			var pluginName='autotexto';

			editor.addCommand(pluginName, new CKEDITOR.dialogCommand(pluginName));			
			editor.config.ignoreConfirmCancel= true;
			editor.ui.addButton( 'autotexto',
			{
				label : 'AutoTexto',
				command :pluginName,
				icon : this.path + 'autotexto.gif'
			});

			CKEDITOR.dialog.add( pluginName, this.path + 'dialogs/autotexto.js' );			
		}
	});
})();

