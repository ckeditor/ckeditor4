/**
* Copyright (c) 2014, M. Annamalai
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object for the Tamil
 *		language. This is the base file for all translations.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'ta' ] = {
	// ARIA description.
	editor: 'நிறைந்த உரை திருத்தி',
	editorPanel: 'நிறைந்த உரை திருத்தி தளம்',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'உதவி பிரஸ் ALT 0',
		browseServer: 'உலவ சேவையகம்',
		url: 'இணைய முகவரி',
		protocol: 'நெறிமுறை',
		upload: 'பதிவேற்று',
		uploadSubmit: 'இது சர்வர் அனுப்பு',
		image: 'படம்'',
		flash: 'ஃப்ளாஷ் (Flash)',
		form: 'படிவம்',
		checkbox: 'உடன்பாடு பெட்டி',
		radio: 'ரேடியோ பொத்தான்',
		textField: 'உரை புலம்',
		textarea: 'உரை பகுதி',
		hiddenField: 'மறைக்கப்பட்ட பகுதி',
		button: 'பட்டன்',
		select: 'தேர்வு பகுதி',
		imageButton: 'பட பட்டன்',
		notSet: '<அமைக்கப்படவில்லை>',
		id: 'Id',
		name: 'Name',
		langDir: 'Language Direction',
		langDirLtr: 'Left to Right (LTR)',
		langDirRtl: 'Right to Left (RTL)',
		langCode: 'Language Code',
		longDescr: 'Long Description URL',
		cssClass: 'Stylesheet Classes',
		advisoryTitle: 'Advisory Title',
		cssStyle: 'Style',
		ok: 'OK',
		cancel: 'Cancel',
		close: 'Close',
		preview: 'Preview',
		resize: 'Resize',
		generalTab: 'General',
		advancedTab: 'Advanced',
		validateNumberFailed: 'This value is not a number.',
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?',
		confirmCancel: 'You have changed some options. Are you sure you want to close the dialog window?',
		options: 'Options',
		target: 'Target',
		targetNew: 'New Window (_blank)',
		targetTop: 'Topmost Window (_top)',
		targetSelf: 'Same Window (_self)',
		targetParent: 'Parent Window (_parent)',
		langDirLTR: 'Left to Right (LTR)',
		langDirRTL: 'Right to Left (RTL)',
		styles: 'ஸ்டைல்'',
		cssClasses: 'ஸ்டைல் ஸ்டைல்',
		width: 'Width',
		height: 'Height',		
		width: 'அகலம்'
        height: 'உயரம்'
        align: 'சீரமைப்பு',
        alignLeft: 'இடது',
        alignRight: 'வலது',
        aligncenter: 'மையம்',
        alignJustify: 'நியாயப்படுத்த',
        alignTop: 'சிறந்த',
        alignMiddle: 'மத்திய'
        alignBottom: 'பாட்டம்'
        alignNone: 'இல்லை',
		invalidValue	: 'தவறான மதிப்பு.',
		invalidHeight: 'உயரம் ஒரு எண் இருக்க வேண்டும்.',
		invalidWidth: 'அகலம் ஒரு எண் இருக்க வேண்டும்.',
		invalidCssLength: 'Value specified for the "%1" field must be a positive number with or without a valid CSS measurement unit (px, %, in, cm, mm, em, ex, pt, or pc).',
		invalidHtmlLength: 'Value specified for the "%1" field must be a positive number with or without a valid HTML measurement unit (px or %).',
		invalidInlineStyle: 'Value specified for the inline style must consist of one or more tuples with the format of "name : value", separated by semi-colons.',
		cssLengthTooltip: 'Enter a number for a value in pixels or a number with a valid CSS unit (px, %, in, cm, mm, em, ex, pt, or pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, unavailable</span>'
	}
};
