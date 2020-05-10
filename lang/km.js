/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
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
	// ARIA description.
	editor: 'ឧបករណ៍​សរសេរ​អត្ថបទ​សម្បូរ​បែប',
	editorPanel: 'ផ្ទាំង​ឧបករណ៍​សរសេរ​អត្ថបទ​សម្បូរ​បែប',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'ចុច ALT 0 សម្រាប់​ជំនួយ',

		browseServer: 'រក​មើល​ក្នុង​ម៉ាស៊ីន​បម្រើ',
		url: 'URL',
		protocol: 'ពិធីការ',
		upload: 'ផ្ទុក​ឡើង',
		uploadSubmit: 'បញ្ជូនទៅកាន់ម៉ាស៊ីន​បម្រើ',
		image: 'រូបភាព',
		flash: 'Flash',
		form: 'បែបបទ',
		checkbox: 'ប្រអប់​ធីក',
		radio: 'ប៊ូតុង​មូល',
		textField: 'វាល​អត្ថបទ',
		textarea: 'Textarea',
		hiddenField: 'វាល​កំបាំង',
		button: 'ប៊ូតុង',
		select: 'វាល​ជម្រើស',
		imageButton: 'ប៊ូតុង​រូបភាព',
		notSet: '<មិនកំណត់>',
		id: 'Id',
		name: 'ឈ្មោះ',
		langDir: 'ទិសដៅភាសា',
		langDirLtr: 'ពីឆ្វេងទៅស្តាំ (LTR)',
		langDirRtl: 'ពីស្តាំទៅឆ្វេង (RTL)',
		langCode: 'លេខ​កូដ​ភាសា',
		longDescr: 'URL អធិប្បាយ​វែង',
		cssClass: 'Stylesheet Classes',
		advisoryTitle: 'ចំណង​ជើង​ណែនាំ',
		cssStyle: 'រចនាបថ',
		ok: 'ព្រម',
		cancel: 'បោះបង់',
		close: 'បិទ',
		preview: 'មើល​ជា​មុន',
		resize: 'ប្ដូរ​ទំហំ',
		generalTab: 'ទូទៅ',
		advancedTab: 'កម្រិត​ខ្ពស់',
		validateNumberFailed: 'តម្លៃ​នេះ​ពុំ​មែន​ជា​លេខ​ទេ។',
		confirmNewPage: 'រាល់​បន្លាស់​ប្ដូរ​នានា​ដែល​មិន​ទាន់​រក្សា​ទុក​ក្នុង​មាតិកា​នេះ នឹង​ត្រូវ​បាត់​បង់។ តើ​អ្នក​ពិត​ជា​ចង់​ផ្ទុក​ទំព័រ​ថ្មី​មែនទេ?',
		confirmCancel: 'ការ​កំណត់​មួយ​ចំនួន​ត្រូ​វ​បាន​ផ្លាស់​ប្ដូរ។ តើ​អ្នក​ពិត​ជា​ចង់​បិទ​ប្រអប់​នេះ​មែនទេ?',
		options: 'ការ​កំណត់',
		target: 'គោលដៅ',
		targetNew: 'វីនដូ​ថ្មី (_blank)',
		targetTop: 'វីនដូ​លើ​គេ (_top)',
		targetSelf: 'វីនដូ​ដូច​គ្នា (_self)',
		targetParent: 'វីនដូ​មេ (_parent)',
		langDirLTR: 'ពីឆ្វេងទៅស្តាំ(LTR)',
		langDirRTL: 'ពីស្តាំទៅឆ្វេង(RTL)',
		styles: 'រចនាបថ',
		cssClasses: 'Stylesheet Classes',
		width: 'ទទឹង',
		height: 'កំពស់',
		align: 'កំណត់​ទីតាំង',
		left: 'ខាងឆ្វង',
		right: 'ខាងស្តាំ',
		center: 'កណ្តាល',
		justify: 'តំរឹមសងខាង',
		alignLeft: 'តម្រឹម​ឆ្វេង',
		alignRight: 'តម្រឹម​ស្ដាំ',
		alignCenter: 'Align Center', // MISSING
		alignTop: 'ខាងលើ',
		alignMiddle: 'កណ្តាល',
		alignBottom: 'ខាងក្រោម',
		alignNone: 'គ្មាន',
		invalidValue: 'តម្លៃ​មិន​ត្រឹម​ត្រូវ។',
		invalidHeight: 'តម្លៃ​កំពស់​ត្រូវ​តែ​ជា​លេខ។',
		invalidWidth: 'តម្លៃ​ទទឹង​ត្រូវ​តែ​ជា​លេខ។',
		invalidLength: 'Value specified for the "%1" field must be a positive number with or without a valid measurement unit (%2).', // MISSING
		invalidCssLength: 'តម្លៃ​កំណត់​សម្រាប់​វាល "%1" ត្រូវ​តែ​ជា​លេខ​វិជ្ជមាន​ ដោយ​ភ្ជាប់ឬ​មិន​ភ្ជាប់​ជាមួយ​នឹង​ឯកតា​រង្វាស់​របស់ CSS (px, %, in, cm, mm, em, ex, pt ឬ pc) ។',
		invalidHtmlLength: 'តម្លៃ​កំណត់​សម្រាប់​វាល "%1" ត្រូវ​តែ​ជា​លេខ​វិជ្ជមាន ដោយ​ភ្ជាប់​ឬ​មិន​ភ្ជាប់​ជាមួយ​នឹង​ឯកតា​រង្វាស់​របស់ HTML (px ឬ %) ។',
		invalidInlineStyle: 'តម្លៃ​កំណត់​សម្រាប់​រចនាបថ​ក្នុង​តួ ត្រូវ​តែ​មាន​មួយ​ឬ​ធាតុ​ច្រើន​ដោយ​មាន​ទ្រង់ទ្រាយ​ជា "ឈ្មោះ : តម្លៃ" ហើយ​ញែក​ចេញ​ពី​គ្នា​ដោយ​ចុច​ក្បៀស។',
		cssLengthTooltip: 'បញ្ចូល​លេខ​សម្រាប់​តម្លៃ​ជា​ភិចសែល ឬ​លេខ​ដែល​មាន​ឯកតា​ត្រឹមត្រូវ​របស់ CSS (px, %, in, cm, mm, em, ex, pt ឬ pc) ។',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, មិន​មាន</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'លុបថយក្រោយ',
			13: 'Enter', // MISSING
			16: 'Shift', // MISSING
			17: 'Ctrl', // MISSING
			18: 'Alt', // MISSING
			32: 'Space', // MISSING
			35: 'ចុង',
			36: 'ផ្ទះ',
			46: 'លុប',
			112: 'F1', // MISSING
			113: 'F2', // MISSING
			114: 'F3', // MISSING
			115: 'F4', // MISSING
			116: 'F5', // MISSING
			117: 'F6', // MISSING
			118: 'F7', // MISSING
			119: 'F8', // MISSING
			120: 'F9', // MISSING
			121: 'F10', // MISSING
			122: 'F11', // MISSING
			123: 'F12', // MISSING
			124: 'F13', // MISSING
			125: 'F14', // MISSING
			126: 'F15', // MISSING
			127: 'F16', // MISSING
			128: 'F17', // MISSING
			129: 'F18', // MISSING
			130: 'F19', // MISSING
			131: 'F20', // MISSING
			132: 'F21', // MISSING
			133: 'F22', // MISSING
			134: 'F23', // MISSING
			135: 'F24', // MISSING
			224: 'Command' // MISSING
		},

		// Prepended to ARIA labels with shortcuts.
		keyboardShortcut: 'Keyboard shortcut', // MISSING

		optionDefault: 'Default' // MISSING
	}
};
