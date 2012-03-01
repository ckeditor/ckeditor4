/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/ ( function() {
	CKEDITOR.plugins.add( 'uicolor', {
		requires: [ 'dialog' ],
		lang: [ 'en', 'he' ],

		init: function( editor ) {
			if ( CKEDITOR.env.ie6Compat )
				return;

			editor.addCommand( 'uicolor', new CKEDITOR.dialogCommand( 'uicolor' ) );
			editor.ui.addButton( 'UIColor', {
				label: editor.lang.uicolor.title,
				command: 'uicolor',
				icon: this.path + 'uicolor.gif'
			});
			CKEDITOR.dialog.add( 'uicolor', this.path + 'dialogs/uicolor.js' );

			// Load YUI js files.
			CKEDITOR.scriptLoader.load( CKEDITOR.getUrl( 'plugins/uicolor/yui/yui.js' ) );

			// Load YUI css files.
			editor.element.getDocument().appendStyleSheet( CKEDITOR.getUrl( 'plugins/uicolor/yui/assets/yui.css' ) );
		}
	});

})();

/**
 * The base user interface color to be used by the editor. Not all skins are
 * compatible with this setting.
 * @name CKEDITOR.config.uiColor
 * @type String
 * @default '' (empty)
 * @example
 * // Using a color code.
 * config.uiColor = '#AADC6E';
 * @example
 * // Using an HTML color name.
 * config.uiColor = 'Gold';
 */
