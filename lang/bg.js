/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Bulgarian language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'bg' ] = {
	/**
	 * The language reading direction. Possible values are "rtl" for
	 * Right-To-Left languages (like Arabic) and "ltr" for Left-To-Right
	 * languages (like English).
	 * @default 'ltr'
	 */
	dir: 'ltr',

	// ARIA description.
	editor: 'Текстов редактор за форматиран текст',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'натиснете ALT 0 за помощ',

		browseServer: 'Избор от сървъра',
		url: 'URL',
		protocol: 'Протокол',
		upload: 'Качване',
		uploadSubmit: 'Изпращане към сървъра',
		image: 'Снимка',
		flash: 'Флаш',
		form: 'Форма',
		checkbox: 'Поле за избор',
		radio: 'Радио бутон',
		textField: 'Текстово поле',
		textarea: 'Текстова зона',
		hiddenField: 'Скрито поле',
		button: 'Бутон',
		select: 'Поле за избор',
		imageButton: 'Бутон за снимка',
		notSet: '<не е избрано>',
		id: 'ID',
		name: 'Име',
		langDir: 'Посока на езика',
		langDirLtr: 'Ляво на дясно (ЛнД)',
		langDirRtl: 'Дясно на ляво (ДнЛ)',
		langCode: 'Код на езика',
		longDescr: 'Уеб адрес за дълго описание',
		cssClass: 'Класове за CSS',
		advisoryTitle: 'Препоръчително заглавие',
		cssStyle: 'Стил',
		ok: 'ОК',
		cancel: 'Отказ',
		close: 'Затвори',
		preview: 'Преглед',
		resize: 'Влачете за да оразмерите',
		generalTab: 'Общо',
		advancedTab: 'Разширено',
		validateNumberFailed: 'Тази стойност не е число',
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?', // MISSING
		confirmCancel: 'Some of the options have been changed. Are you sure to close the dialog?', // MISSING
		options: 'Опции',
		target: 'Цел',
		targetNew: 'Нов прозорец (_blank)',
		targetTop: 'Горна позиция (_top)',
		targetSelf: 'Текущия прозорец (_self)',
		targetParent: 'Основен прозорец (_parent)',
		langDirLTR: 'Ляво на дясно (ЛнД)',
		langDirRTL: 'Дясно на ляво (ДнЛ)',
		styles: 'Стил',
		cssClasses: 'Класове за CSS',
		width: 'Ширина',
		height: 'Височина',
		align: 'Подравняване',
		alignLeft: 'Ляво',
		alignRight: 'Дясно',
		alignCenter: 'Център',
		alignTop: 'Горе',
		alignMiddle: 'По средата',
		alignBottom: 'Долу',
		invalidValue	: 'Invalid value.', // MISSING
		invalidHeight: 'Височината трябва да е число.',
		invalidWidth: 'Ширина требе да е число.',
		invalidCssLength: 'Value specified for the "%1" field must be a positive number with or without a valid CSS measurement unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING
		invalidHtmlLength: 'Value specified for the "%1" field must be a positive number with or without a valid HTML measurement unit (px or %).', // MISSING
		invalidInlineStyle: 'Value specified for the inline style must consist of one or more tuples with the format of "name : value", separated by semi-colons.', // MISSING
		cssLengthTooltip: 'Enter a number for a value in pixels or a number with a valid CSS unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, unavailable</span>' // MISSING
	}
};
