/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'smiley', {
	init: function( editor, pluginPath ) {
		editor.addCommand( 'smiley', new CKEDITOR.dialogCommand( 'smiley' ) );
		editor.ui.addButton( 'Smiley', {
			label: editor.lang.smiley.toolbar,
			command: 'smiley'
		});
		CKEDITOR.dialog.add( 'smiley', this.path + 'dialogs/smiley.js' );
	},

	lang: [ 'en' ]
});

CKEDITOR.config.smiley = {
	// TODO: update descriptions, fix coding style.
	/**
	 * List of smiley images displayed in the Smiley dialog.
	 * @type Array
	 * @default ['regular_smile.gif','sad_smile.gif','wink_smile.gif','teeth_smile.gif','confused_smile.gif','tounge_smile.gif','embaressed_smile.gif','omg_smile.gif','whatchutalkingabout_smile.gif','angry_smile.gif','angel_smile.gif','shades_smile.gif','devil_smile.gif','cry_smile.gif','lightbulb.gif','thumbs_down.gif','thumbs_up.gif','heart.gif','broken_heart.gif','kiss.gif','envelope.gif']
	 * @example
	 * config.smileyImages = [ 'tounge.gif', 'smile.gif', 'laugh.gif' ];
	 */
	images: [ 'regular_smile.gif', 'sad_smile.gif', 'wink_smile.gif', 'teeth_smile.gif', 'confused_smile.gif', 'tounge_smile.gif',
			'embaressed_smile.gif', 'omg_smile.gif', 'whatchutalkingabout_smile.gif', 'angry_smile.gif', 'angel_smile.gif', 'shades_smile.gif',
			'devil_smile.gif', 'cry_smile.gif', 'lightbulb.gif', 'thumbs_down.gif', 'thumbs_up.gif', 'heart.gif',
			'broken_heart.gif', 'kiss.gif', 'envelope.gif' ],
	descriptions: [ ':)', ':(', ';)', ':D', ':/', ':P', '', '', '', '', '', '', '', ';(', '', '', '', '', ':kiss', '', ],

	//TODO: update path
	path: CKEDITOR.basePath + '_source/plugins/smiley/images/',
	windowWidth: 320,
	windowHeight: 210,
	columns: 8
};
