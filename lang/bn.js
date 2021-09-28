/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Bengali/Bangla language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'bn' ] = {
	// ARIA description.
	editor: 'Rich Text Editor', // MISSING
	editorPanel: 'Rich Text Editor panel', // MISSING

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Press ALT 0 for help', // MISSING

		browseServer: 'ব্রাউজ সার্ভার',
		url: 'URL',
		protocol: 'প্রোটোকল',
		upload: 'আপলোড',
		uploadSubmit: 'ইহাকে সার্ভারে প্রেরন কর',
		image: 'ছবির লেবেল যুক্ত কর',
		form: 'ফর্ম',
		checkbox: 'চেক বাক্স',
		radio: 'রেডিও বাটন',
		textField: 'টেক্সট ফীল্ড',
		textarea: 'টেক্সট এরিয়া',
		hiddenField: 'গুপ্ত ফীল্ড',
		button: 'বাটন',
		select: 'বাছাই ফীল্ড',
		imageButton: 'ছবির বাটন',
		notSet: '<সেট নেই>',
		id: 'আইডি',
		name: 'নাম',
		langDir: 'ভাষা লেখার দিক',
		langDirLtr: 'বাম থেকে ডান (LTR)',
		langDirRtl: 'ডান থেকে বাম (RTL)',
		langCode: 'ভাষা কোড',
		longDescr: 'URL এর লম্বা বর্ণনা',
		cssClass: 'স্টাইল-শীট ক্লাস',
		advisoryTitle: 'পরামর্শ শীর্ষক',
		cssStyle: 'স্টাইল',
		ok: 'ওকে',
		cancel: 'বাতিল',
		close: 'Close', // MISSING
		preview: 'প্রিভিউ',
		resize: 'Resize', // MISSING
		generalTab: 'General', // MISSING
		advancedTab: 'এডভান্সড',
		validateNumberFailed: 'This value is not a number.', // MISSING
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?', // MISSING
		confirmCancel: 'You have changed some options. Are you sure you want to close the dialog window?', // MISSING
		options: 'Options', // MISSING
		target: 'টার্গেট',
		targetNew: 'New Window (_blank)', // MISSING
		targetTop: 'Topmost Window (_top)', // MISSING
		targetSelf: 'Same Window (_self)', // MISSING
		targetParent: 'Parent Window (_parent)', // MISSING
		langDirLTR: 'বাম থেকে ডান (LTR)',
		langDirRTL: 'ডান থেকে বাম (RTL)',
		styles: 'স্টাইল',
		cssClasses: 'স্টাইল-শীট ক্লাস',
		width: 'প্রস্থ',
		height: 'দৈর্ঘ্য',
		align: 'এলাইন',
		left: 'বামে',
		right: 'ডানে',
		center: 'মাঝখানে',
		justify: 'ব্লক জাস্টিফাই',
		alignLeft: 'বা দিকে ঘেঁষা',
		alignRight: 'ডান দিকে ঘেঁষা',
		alignCenter: 'Align Center', // MISSING
		alignTop: 'উপর',
		alignMiddle: 'মধ্য',
		alignBottom: 'নীচে',
		alignNone: 'None', // MISSING
		invalidValue: 'Invalid value.', // MISSING
		invalidHeight: 'Height must be a number.', // MISSING
		invalidWidth: 'Width must be a number.', // MISSING
		invalidLength: 'Value specified for the "%1" field must be a positive number with or without a valid measurement unit (%2).', // MISSING
		invalidCssLength: 'Value specified for the "%1" field must be a positive number with or without a valid CSS measurement unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING
		invalidHtmlLength: 'Value specified for the "%1" field must be a positive number with or without a valid HTML measurement unit (px or %).', // MISSING
		invalidInlineStyle: 'Value specified for the inline style must consist of one or more tuples with the format of "name : value", separated by semi-colons.', // MISSING
		cssLengthTooltip: 'Enter a number for a value in pixels or a number with a valid CSS unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, unavailable</span>', // MISSING

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Backspace', // MISSING
			13: 'Enter', // MISSING
			16: 'Shift', // MISSING
			17: 'Ctrl', // MISSING
			18: 'Alt', // MISSING
			32: 'Space', // MISSING
			35: 'End', // MISSING
			36: 'Home', // MISSING
			46: 'Delete', // MISSING
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
