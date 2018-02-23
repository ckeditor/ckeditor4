/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
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
	// ARIA description.
	editor: 'Текстов редактор за форматиран текст',
	editorPanel: 'Панел на текстовия редактор',

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
		generalTab: 'Общи',
		advancedTab: 'Разширено',
		validateNumberFailed: 'Тази стойност не е число',
		confirmNewPage: 'Всички незапазени промени ще бъдат изгубени. Сигурни ли сте, че желаете да заредите нова страница?',
		confirmCancel: 'Някои от опциите са променени. Сигурни ли сте, че желаете да затворите прозореца?',
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
		left: 'Ляво',
		right: 'Дясно',
		center: 'Център',
		justify: 'Двустранно подравняване',
		alignLeft: 'Подравни в ляво',
		alignRight: 'Подравни в дясно',
		alignCenter: 'Align Center', // MISSING
		alignTop: 'Горе',
		alignMiddle: 'По средата',
		alignBottom: 'Долу',
		alignNone: 'Без подравняване',
		invalidValue: 'Невалидна стойност.',
		invalidHeight: 'Височината трябва да е число.',
		invalidWidth: 'Ширина требе да е число.',
		invalidLength: 'Value specified for the "%1" field must be a positive number with or without a valid measurement unit (%2).', // MISSING
		invalidCssLength: 'Стойността на полето "%1" трябва да бъде положително число с или без валидна CSS измервателна единица (px, %, in, cm, mm, em, ex, pt, или pc).',
		invalidHtmlLength: 'Стойността на полето "%1" трябва да бъде положително число с или без валидна HTML измервателна единица (px или %).',
		invalidInlineStyle: 'Стойността на стилa трябва да съдържат една или повече двойки във формат "name : value", разделени с двоеточие.',
		cssLengthTooltip: 'Въведете числена стойност в пиксели или друга валидна CSS единица (px, %, in, cm, mm, em, ex, pt, или pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, недостъпно</span>',

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
