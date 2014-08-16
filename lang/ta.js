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
		image: 'படம்',
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
		id: 'அடையாளம்',
		name: 'பெயர்',
		langDir: 'மொழி எழுதப்பட்டது இயக்கம்',
		langDirLtr: 'வலம்',
		langDirRtl: 'இடது (வலமிருந்து இடமாக) வலது',
		langCode: 'மொழி குறியீட்டைப்',
		longDescr: 'நீண்ட விளக்கம்',
		cssClass: 'ஸ்டைல்ஷீட் வகுப்புகள்',
		advisoryTitle: 'ஆலோசனைக் தலைப்பு',
		cssStyle: 'ஸ்டைல்',
		ok: 'சரி (OK)',
		cancel: 'ரத்து',
		close: 'மூடு',
		preview: 'முன்னோட்டம்',
		resize: 'அளவை',
		generalTab: 'பொது',
		advancedTab: 'மேலும் விருப்பங்கள்',
		validateNumberFailed: 'இந்த மதிப்பு ஒரு எண் அல்ல.',
		confirmNewPage: 'இந்த உள்ளடக்கத்தை சேமிக்கப்படாத மாற்றங்கள் இழக்கப்படும். நீங்கள் புதிய பக்கம் ஏற்ற வேண்டும் என்று உறுதியாக இருக்கிறீர்களா? ',
		confirmCancel: 'நீங்கள் சில விருப்பங்கள் மாறிவிட்டது. நீங்கள் உரையாடல் சாளரத்தை மூட வேண்டுமா?',
		options: 'விருப்பங்கள்',
		target: 'இலக்கு',
		targetNew: 'புதிய சாளரம் (_blank)',
		targetTop: 'உயர்ந்த விண்டோ/சாளரம் (_top)',
		targetSelf: 'அதே சாளரம் (_self)',
		targetParent: 'முந்தைய சாளரம் (_parent)',
		langDirLTR: 'வலம்',
		langDirRTL: 'இடது (வலமிருந்து இடமாக) வலது',
		styles: 'ஸ்டைல்',
		cssClasses: 'ஸ்டைல் ஸ்டைல்',
		width: 'அகலம்',
        height: 'உயரம்',
        align: 'சீரமைப்பு',
        alignLeft: 'இடது',
        alignRight: 'வலது',
        aligncenter: 'மையம்',
        alignJustify: 'நியாயப்படுத்த',
        alignTop: 'சிறந்த',
        alignMiddle: 'மத்திய',
        alignBottom: 'பாட்டம்',
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
