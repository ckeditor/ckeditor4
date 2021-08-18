/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// Register a templates definition set named "default".
CKEDITOR.addTemplates( 'default', {
	// The name of sub folder which hold the shortcut preview images of the
	// templates.
	imagesPath: CKEDITOR.getUrl( CKEDITOR.plugins.getPath( 'templates' ) + 'templates/images/' ),

	// The templates definitions.
	templates: [ {
		title: 'Image and Title',
		image: 'template1.gif',
		description: 'One main image with a title and text that surround the image.',
		html: getHtml('image-and-title.html')
	},
	{
		title: 'Strange Template',
		image: 'template2.gif',
		description: 'A template that defines two columns, each one with a title, and some text.',
		html: getHtml('strange-template.html')
	},
	{
		title: 'Text and Table',
		image: 'template3.gif',
		description: 'A title with some text and a table.',
		html: getHtml('text-and-table.html')
	}
	]
});

// Get the contents of the given html file.
function getHtml(fileName) {
	let path = CKEDITOR.getUrl(CKEDITOR.plugins.getPath('templates') + 'templates/html/' + fileName);
	return fetch(path)
		.then(response => {
			if (!response.ok) {
				throw Error(response.statusText);
			}
			return response;
		}).then(html => html.text())
		.catch(error => {
			console.log(error);
			return '';
		});
}