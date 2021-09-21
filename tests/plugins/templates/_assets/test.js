/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// Register a templates definition set named "default".
CKEDITOR.addTemplates( 'test', {
	// The name of sub folder which hold the shortcut preview images of the
	// templates.
	imagesPath: '/tests/plugins/templates/_assets/images/',

	// The templates definitions.
	templates: [ {
		title: 'Title and Text',
		image: 'titleAndText.gif',
		description: 'A title and a text',
		htmlFile: '/tests/plugins/templates/_assets/html/titleAndText.html'
	},
	{
		title: 'Some text',
		image: 'titleAndText.gif',
		description: 'A text in two paragraphs',
		html: '<p>I am a text</p><p>Here is some more text</p>'
	}
	]
});
