/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Khmer language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'km' ] = {
	/**
	 * The language reading direction. Possible values are "rtl" for
	 * Right-To-Left languages (like Arabic) and "ltr" for Left-To-Right
	 * languages (like English).
	 * @default 'ltr'
	 */
	dir: 'ltr',

	// ARIA description.
	editor: 'Rich Text Editor', // MISSING

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Press ALT 0 for help', // MISSING

		browseServer: 'មើល',
		url: 'URL',
		protocol: 'ប្រូតូកូល',
		upload: 'ទាញយក',
		uploadSubmit: 'បញ្ជូនទៅកាន់ម៉ាស៊ីនផ្តល់សេវា',
		image: 'រូបភាព',
		flash: 'Flash',
		form: 'បែបបទ',
		checkbox: 'ប្រអប់ជ្រើសរើស',
		radio: 'ប៉ូតុនរង្វង់មូល',
		textField: 'ជួរសរសេរអត្ថបទ',
		textarea: 'តំបន់សរសេរអត្ថបទ',
		hiddenField: 'ជួរលាក់',
		button: 'ប៉ូតុន',
		select: 'ជួរជ្រើសរើស',
		imageButton: 'ប៉ូតុនរូបភាព',
		notSet: '<មិនមែន>',
		id: 'Id',
		name: 'ឈ្មោះ',
		langDir: 'ទិសដៅភាសា',
		langDirLtr: 'ពីឆ្វេងទៅស្តាំ(LTR)',
		langDirRtl: 'ពីស្តាំទៅឆ្វេង(RTL)',
		langCode: 'លេខកូតភាសា',
		longDescr: 'អធិប្បាយ URL វែង',
		cssClass: 'Stylesheet Classes',
		advisoryTitle: 'ចំណងជើង ប្រឹក្សា',
		cssStyle: 'ម៉ូត',
		ok: 'យល់ព្រម',
		cancel: 'មិនយល់ព្រម',
		close: 'Close', // MISSING
		preview: 'មើលសាកល្បង',
		resize: 'Resize', // MISSING
		generalTab: 'General', // MISSING
		advancedTab: 'កំរិតខ្ពស់',
		validateNumberFailed: 'This value is not a number.', // MISSING
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?', // MISSING
		confirmCancel: 'Some of the options have been changed. Are you sure to close the dialog?', // MISSING
		options: 'Options', // MISSING
		target: 'គោលដៅ',
		targetNew: 'New Window (_blank)', // MISSING
		targetTop: 'Topmost Window (_top)', // MISSING
		targetSelf: 'Same Window (_self)', // MISSING
		targetParent: 'Parent Window (_parent)', // MISSING
		langDirLTR: 'ពីឆ្វេងទៅស្តាំ(LTR)',
		langDirRTL: 'ពីស្តាំទៅឆ្វេង(RTL)',
		styles: 'ម៉ូត',
		cssClasses: 'Stylesheet Classes',
		width: 'ទទឹង',
		height: 'កំពស់',
		align: 'កំណត់ទីតាំង',
		alignLeft: 'ខាងឆ្វង',
		alignRight: 'ខាងស្តាំ',
		alignCenter: 'កណ្តាល',
		alignTop: 'ខាងលើ',
		alignMiddle: 'កណ្តាល',
		alignBottom: 'ខាងក្រោម',
		invalidValue	: 'Invalid value.', // MISSING
		invalidHeight: 'Height must be a number.', // MISSING
		invalidWidth: 'Width must be a number.', // MISSING
		invalidCssLength: 'Value specified for the "%1" field must be a positive number with or without a valid CSS measurement unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING
		invalidHtmlLength: 'Value specified for the "%1" field must be a positive number with or without a valid HTML measurement unit (px or %).', // MISSING
		invalidInlineStyle: 'Value specified for the inline style must consist of one or more tuples with the format of "name : value", separated by semi-colons.', // MISSING
		cssLengthTooltip: 'Enter a number for a value in pixels or a number with a valid CSS unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, unavailable</span>' // MISSING
	}
};
