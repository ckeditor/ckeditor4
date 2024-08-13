/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
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
