/*
Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
*/
CKEDITOR.plugins.setLang( 'a11yimage', 'en', {

  // URL
  urlTitle: 'URL of the image source file',

  // Alternative text
  altTextLabel: 'Alternative text (spoken by screen reader)',
  // Note: The max. length in the following message should match the
  // value of the alternativeTextMaxLength property defined below.
  altTextTitle: 'A short description of the content and function of the image, \
no longer than 100 characters',
  altTextNotRequiredLabel: 'Image does not require alternative text',

  // Long description
  longDescLabel: 'Is there an adjacent detailed description of the image in the document?',
  longDescTitle: 'Many people benefit from a more detailed description of a \
complex image, including, but not limited to, people with visual impairments',

  longDescOptionNo: 'No',
  longDescOptionYesBefore: 'Yes, before the image',
  longDescOptionYesAfter: 'Yes, after the image',
  longDescOptionYesBoth: 'Yes, before and after the image',

  longDescBefore: 'Long description is located just before the image',
  longDescAfter: 'Long description is located just after the image',
  longDescBoth: 'Long description is located before and after the image',

  imageDescHelpLinkText: 'Describing images for people with visual impairments',

  // Caption
  captionLabel: 'Insert a caption text box below the image',
  captionTitle: 'The caption text is editable within the document',
  captionPlaceholder: 'Caption',

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
  helpNotFound: 'The A11yFirst Help system is not installed. Please contact \
your CMS or CKEditor administrator for more information.',

  // Additional properties used in a11yimage
  alignNone: 'None',
  alignLeft: 'Left',
  alignCenter: 'Center',
  alignRight: 'Right',

  // Validation settings and messaging
  urlMissing: 'Please provide the URL for the image',

  alternativeTextMaxLength: 100,
  altContainsFilename: ['.fpx', '.gif', '.j2c', '.j2k', '.jfif', '.jif', '.jp2',
    '.jpeg', '.jpg', '.jpx', '.pcd', '.pdf', '.png', '.tif', '.tiff'],
  altIsInvalid: ['photo', 'spacer', 'separator', 'nbsp', 'image'],
  altStartsWithInvalid: ['image of', 'graphic of'],
  altEndsWithInvalid: ['bytes'],

  msgAltPrefix: 'The alternative text should succinctly describe the content of the image.',
  msgAltTextNotRequired: 'An image typically requires alternative text (i.e. a short description) \
for people with visual impairments using screen readers.\n\nAre you sure you want to continue?',
  msgAltEmpty: 'Please provide alternative text (i.e. a short description of the image) for \
people with visual impairments using screen readers.',
  msgAltTooLong: 'The alternative text is %s1 characters, which is longer than the recommended \
maximum length of %s2 characters.\n\nAre you sure you want to continue?',
  msgAltContainsFilename: 'Please remove the filename with the extension "%s" from the alternative text.',
  msgAltIsInvalid: 'Please replace "%s" with alternative text that describes the image.',
  msgAltStartsWithInvalid: 'Please remove the unnecessary phrase "%s" from the alternative text.',
  msgAltEndsWithInvalid: 'Please do not include the size of the image in the alternative text.',
} );
