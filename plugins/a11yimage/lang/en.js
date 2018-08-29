/*
Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
*/
CKEDITOR.plugins.setLang( 'a11yimage', 'en', {
	// Type of Image
	typeOfImage: 'Type of Image',

	typeInformative: 'Informative',
	typeInformativeHelp: 'Requires a short description and may require a longer, more detailed description',

	typeDecorative: 'Decorative',
	typeDecorativeHelp: 'Does not require a text description — image adds no additional information to the document',

	// Accessible Descriptions
	imageDesc: 'Accessible Descriptions',

	alt: 'Short description (required)',
	a11yfirstInfo: 'Tips',
	a11yfirstInfoHelp: 'Tips on writing effective short descriptions',

	hasDescription: 'Complex image (requires long description)',
	descriptionHelp: 'More information on describing a complex image',
	descriptionLocation: 'Location of long description in document',

	locationBefore: 'Before image',
	locationBeforeHelp: 'A long description is located just before the image in the document',
	locationBeforeTitle: 'Long description is located just before the image',

	locationAfter:  'After image',
	locationAfterHelp:  'A long description is located just after the image in the document',
	locationAfterTitle: 'Long description is located just after the image',

	locationBoth:   'Before &amp; after',
	locationBothHelp:   'A long description is located before and after the image in the document',
	locationBothTitle: 'Long description is located before and after the image',

	// Image Caption
	captioned: 'Add an editable caption below the image',
	msgCaption: 'Edit the caption in the textbox just below the image',
	captionedHelp: 'Adds an editable textbox below the image with placeholder text \'Caption\'',
	captionPlaceholder: 'Caption',
	captionContent: 'Caption Text',

	// Miscellaneous
	btnUpload: 'Send it to the Server',
	infoTab: 'Image Info',
	lockRatio: 'Lock Ratio',
	menu: 'Image Properties',
	pathName: 'image',
	pathNameCaption: 'caption',
	resetSize: 'Reset Size',
	resizer: 'Click and drag to resize',
	title: 'Image Properties',
	uploadTab: 'Upload',
	urlMissing: 'Please provide the URL for the image',

	// Additional properties used in a11yimage
	alignNone: 'None',
	alignLeft: 'Left',
	alignCenter: 'Center',
	alignRight: 'Right',

	// Validation constraints and messaging
	alternativeTextMaxLength: 100,
	altContainsFilename: ['.tif', '.tiff','.gif','.jpeg', '.jpg', '.jif', '.jfif', '.jp2', '.jpx', '.j2k', '.j2c', '.fpx', '.pcd', '.png', '.pdf'],
	altIsInvalid: ['photo', 'spacer', 'separator', 'nbsp', 'image'],
	altStartsWithInvalid: ['image of', 'graphic of'],
	altEndsWithInvalid: ['bytes'],
	msgAltEmpty: 'Please provide the short description for the image',
	msgAltToLong: 'The short description is %s1 characters, which is longer than the recommended maximum length of %s2 characters.\n\nAre you sure you want to continue?',
	msgAltPrefix: 'The short description should succinctly describe the content of the image.',
	msgAltContainsFilename: 'Please remove the filename with the extension "%s" from the short description.',
	msgAltIsInvalid: 'Please remove "%s" from the short description.',
	msgAltStartsWithInvalid: 'Please remove "%s" from the short description.',
	msgAltEndsWithInvalid: 'Please do not include the size of the image in the short description.',
	msgChooseLocation: 'Please select the location of the long description within the document relative to the complex image.'
} );
