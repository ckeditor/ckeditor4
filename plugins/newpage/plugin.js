/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @file Horizontal Page Break
 */

// Register a plugin named "newpage".
CKEDITOR.plugins.add( 'newpage', {
	lang: [ 'af', 'ar', 'bg', 'bn', 'bs', 'ca', 'cs', 'cy', 'da', 'de', 'el', 'en-au', 'en-ca', 'en-gb', 'en', 'eo', 'es', 'et', 'eu', 'fa', 'fi', 'fo', 'fr-ca', 'fr', 'gl', 'gu', 'he', 'hi', 'hr', 'hu', 'is', 'it', 'ja', 'ka', 'km', 'ko', 'lt', 'lv', 'mk', 'mn', 'ms', 'nb', 'nl', 'no', 'pl', 'pt-br', 'pt', 'ro', 'ru', 'sk', 'sl', 'sr-latn', 'sr', 'sv', 'th', 'tr', 'ug', 'uk', 'vi', 'zh-cn', 'zh' ],
	init: function( editor ) {
		editor.addCommand( 'newpage', { modes:{wysiwyg:1,source:1 },

			exec: function( editor ) {
				var command = this;
				editor.setData( editor.config.newpage_html || '', function() {
					// Save the undo snapshot after all document changes are affected. (#4889)
					setTimeout( function() {
						editor.fire( 'afterCommandExec', {
							name: 'newpage',
							command: command
						});
						editor.selectionChange();

					}, 200 );
				});
				editor.focus();
			},
			async: true
		});

		editor.ui.addButton && editor.ui.addButton( 'NewPage', {
			label: editor.lang.newpage.toolbar,
			command: 'newpage'
		});
	}
});
/**
 * The HTML to load in the editor when the "new page" command is executed.
 * @name CKEDITOR.config.newpage_html
 * @type String
 * @default ''
 * @example
 * config.newpage_html = '&lt;p&gt;Type your text here.&lt;/p&gt;';
 */
