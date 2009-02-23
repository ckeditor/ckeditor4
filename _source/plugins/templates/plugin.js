/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function() {
	CKEDITOR.plugins.add( 'templates', {
		requires: [ 'dialog' ],

		init: function( editor ) {
			CKEDITOR.dialog.add( 'templates', CKEDITOR.getUrl( this.path + 'dialogs/templates.js' ) );

			editor.addCommand( 'templates', new CKEDITOR.dialogCommand( 'templates' ) );

			editor.ui.addButton( 'Templates', {
				label: editor.lang.templates.button,
				command: 'templates'
			});
		}
	});

	var templates = {},
		loadedTemplatesFiles = {};

	CKEDITOR.addTemplates = function( name, definition ) {
		templates[ name ] = definition;
	};

	CKEDITOR.getTemplates = function( name ) {
		return templates[ name ];
	};

	CKEDITOR.loadTemplates = function( templateFiles, callback ) {
		// Holds the templates files to be loaded.
		var toLoad = [];

		// Look for pending template files to get loaded.
		for ( var i = 0; i < templateFiles.length; i++ ) {
			if ( !loadedTemplatesFiles[ templateFiles[ i ] ] ) {
				toLoad.push( templateFiles[ i ] );
				loadedTemplatesFiles[ templateFiles[ i ] ] = 1;
			}
		}

		if ( toLoad.length > 0 )
			CKEDITOR.scriptLoader.load( toLoad, callback );
		else
			setTimeout( callback, 0 );
	};
})();



/**
 * The templates definition set to use. It accepts a list of names separated by
 * comma. It must match definitions loaded with the templates_files setting.
 * @type String
 * @default 'default'
 */
CKEDITOR.config.templates = 'default';

/**
 * The list of templates definition files to load.
 * @type (String) Array
 * @default [ 'plugins/templates/templates/default.js' ]
 */
CKEDITOR.config.templates_files = [
	CKEDITOR.getUrl( '_source/' + // %REMOVE_LINE%
				'plugins/templates/templates/default.js' )
	];

/**
 * Whether replace the current document content OR insert current
 * editing position.
 * @type Boolean
 * @default true
 */
CKEDITOR.config.templates_replaceContent = true;
