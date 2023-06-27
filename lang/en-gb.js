/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * English (United Kingdom) language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'en-gb' ] = {
	// ARIA description.
	application: 'Rich Text Editor', // MISSING
	editor: 'Rich Text Editor',
	editorPanel: 'Rich Text Editor panel',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Press ALT 0 for help',

		browseServer: 'Browse Server',
		url: 'URL',
		protocol: 'Protocol',
		upload: 'Upload',
		uploadSubmit: 'Send it to the Server',
		image: 'Image',
		form: 'Form',
		checkbox: 'Checkbox',
		radio: 'Radio Button',
		textField: 'Text Field',
		textarea: 'Textarea',
		hiddenField: 'Hidden Field',
		button: 'Button',
		select: 'Selection Field',
		imageButton: 'Image Button',
		notSet: '<not set>',
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
		resize: 'Drag to resize',
		generalTab: 'General',
		advancedTab: 'Advanced',
		validateNumberFailed: 'This value is not a number.',
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?',
		confirmCancel: 'You have changed some options. Are you sure you want to close the dialogue window?',
		options: 'Options',
		target: 'Target',
		targetNew: 'New Window (_blank)',
		targetTop: 'Topmost Window (_top)',
		targetSelf: 'Same Window (_self)',
		targetParent: 'Parent Window (_parent)',
		langDirLTR: 'Left to Right (LTR)',
		langDirRTL: 'Right to Left (RTL)',
		styles: 'Style',
		cssClasses: 'Stylesheet Classes',
		width: 'Width',
		height: 'Height',
		align: 'Align',
		left: 'Left', // MISSING
		right: 'Right', // MISSING
		center: 'Centre',
		justify: 'Justify', // MISSING
		alignLeft: 'Align Left', // MISSING
		alignRight: 'Align Right', // MISSING
		alignCenter: 'Align Centre',
		alignTop: 'Top',
		alignMiddle: 'Middle',
		alignBottom: 'Bottom',
		alignNone: 'None',
		invalidValue: 'Invalid value.',
		invalidHeight: 'Height must be a number.',
		invalidWidth: 'Width must be a number.',
		invalidLength: 'Value specified for the "%1" field must be a positive number with or without a valid measurement unit (%2).', // MISSING
		invalidCssLength: 'Value specified for the "%1" field must be a positive number with or without a valid CSS measurement unit (px, %, in, cm, mm, em, ex, pt, or pc).',
		invalidHtmlLength: 'Value specified for the "%1" field must be a positive number with or without a valid HTML measurement unit (px or %).',
		invalidInlineStyle: 'Value specified for the inline style must consist of one or more tuples with the format of "name : value", separated by semi-colons.',
		cssLengthTooltip: 'Enter a number for a value in pixels or a number with a valid CSS unit (px, %, in, cm, mm, em, ex, pt, or pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, unavailable</span>',

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
	},

	versionCheck: {
		notificationMessage: 'This CKEditor %current version is not secure. Consider <a target="_blank" href="%link">upgrading to the latest one</a>, %latest.', // MISSING
		consoleMessage: 'This CKEditor %current version is not secure. Consider upgrading to the latest one, %latest: %link', // MISSING
		aboutDialogInsecureMessage: 'This CKEditor %current version is not secure.<br>Consider upgrading to the latest one, %latest:<br><a target="_blank" href="%link">%link</a>', // MISSING
		aboutDialogUpgradeMessage: 'Consider upgrading to the latest editor version, %latest:<br><a target="_blank" href="%link">%link</a>' // MISSING
	}
};
