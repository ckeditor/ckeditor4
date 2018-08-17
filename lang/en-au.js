/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * English (Australia) language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'en-au' ] = {
	// ARIA description.
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
		flash: 'Flash',
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
		styles: 'Style',
		cssClasses: 'Stylesheet Classes',
		width: 'Width',
		height: 'Height',
		align: 'Align',
		left: 'Left',
		right: 'Right',
		center: 'Centre',
		justify: 'Justify',
		alignLeft: 'Align Left',
		alignRight: 'Align Right',
		alignCenter: 'Align Centre',
		alignTop: 'Top',
		alignMiddle: 'Middle',
		alignBottom: 'Bottom',
		alignNone: 'None',
		invalidValue: 'Invalid value.',
		invalidHeight: 'Height must be a number.',
		invalidWidth: 'Width must be a number.',
		invalidLength: 'Value specified for the "%1" field must be a positive number with or without a valid measurement unit (%2).',
		invalidCssLength: 'Value specified for the "%1" field must be a positive number with or without a valid CSS measurement unit (px, %, in, cm, mm, em, ex, pt, or pc).',
		invalidHtmlLength: 'Value specified for the "%1" field must be a positive number with or without a valid HTML measurement unit (px or %).',
		invalidInlineStyle: 'Value specified for the inline style must consist of one or more tuples with the format of "name : value", separated by semi-colons.',
		cssLengthTooltip: 'Enter a number for a value in pixels or a number with a valid CSS unit (px, %, in, cm, mm, em, ex, pt, or pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, unavailable</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Backspace',
			13: 'Enter',
			16: 'Shift',
			17: 'Ctrl',
			18: 'Alt',
			32: 'Space',
			35: 'End',
			36: 'Home',
			46: 'Delete',
			112: 'F1',
			113: 'F2',
			114: 'F3',
			115: 'F4',
			116: 'F5',
			117: 'F6',
			118: 'F7',
			119: 'F8',
			120: 'F9',
			121: 'F10',
			122: 'F11',
			123: 'F12',
			124: 'F13',
			125: 'F14',
			126: 'F15',
			127: 'F16',
			128: 'F17',
			129: 'F18',
			130: 'F19',
			131: 'F20',
			132: 'F21',
			133: 'F22',
			134: 'F23',
			135: 'F24',
			224: 'Command'
		},

		// Prepended to ARIA labels with shortcuts.
		keyboardShortcut: 'Keyboard shortcut',

		optionDefault: 'Default'
	}
};
