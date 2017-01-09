/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'mk' ] = {
	// ARIA description.
	editor: 'Rich Text Editor', // MISSING
	editorPanel: 'Rich Text Editor panel', // MISSING

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Притисни ALT 0 за помош',

		browseServer: 'Пребарај низ серверот',
		url: 'URL',
		protocol: 'Протокол',
		upload: 'Прикачи',
		uploadSubmit: 'Прикачи на сервер',
		image: 'Слика',
		flash: 'Flash', // MISSING
		form: 'Form', // MISSING
		checkbox: 'Checkbox', // MISSING
		radio: 'Radio Button', // MISSING
		textField: 'Поле за текст',
		textarea: 'Големо поле за текст',
		hiddenField: 'Скриено поле',
		button: 'Button',
		select: 'Selection Field', // MISSING
		imageButton: 'Копче-слика',
		notSet: '<not set>',
		id: 'Id',
		name: 'Name',
		langDir: 'Насока на јазик',
		langDirLtr: 'Лево кон десно',
		langDirRtl: 'Десно кон лево',
		langCode: 'Код на јазик',
		longDescr: 'Long Description URL', // MISSING
		cssClass: 'Stylesheet Classes', // MISSING
		advisoryTitle: 'Advisory Title', // MISSING
		cssStyle: 'Стил',
		ok: 'OK',
		cancel: 'Cancel', // MISSING
		close: 'Close', // MISSING
		preview: 'Preview', // MISSING
		resize: 'Resize', // MISSING
		generalTab: 'Општо',
		advancedTab: 'Advanced', // MISSING
		validateNumberFailed: 'This value is not a number.', // MISSING
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?', // MISSING
		confirmCancel: 'You have changed some options. Are you sure you want to close the dialog window?', // MISSING
		options: 'Опции',
		target: 'Target', // MISSING
		targetNew: 'Нов прозорец (_blank)',
		targetTop: 'Најгорниот прозорец (_top)',
		targetSelf: 'Истиот прозорец (_self)',
		targetParent: 'Прозорец-родител (_parent)',
		langDirLTR: 'Лево кон десно',
		langDirRTL: 'Десно кон лево',
		styles: 'Стил',
		cssClasses: 'Stylesheet Classes', // MISSING
		width: 'Широчина',
		height: 'Височина',
		align: 'Alignment', // MISSING
		alignLeft: 'Лево',
		alignRight: 'Десно',
		alignCenter: 'Во средина',
		alignJustify: 'Justify', // MISSING
		alignTop: 'Горе',
		alignMiddle: 'Средина',
		alignBottom: 'Доле',
		alignNone: 'Никое',
		invalidValue: 'Невалидна вредност',
		invalidHeight: 'Височината мора да биде број.',
		invalidWidth: 'Широчината мора да биде број.',
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
			224: 'Command' // MISSING
		},

		// Prepended to ARIA labels with shortcuts.
		keyboardShortcut: 'Keyboard shortcut' // MISSING
	}
};
