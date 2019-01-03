/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
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
	editor: 'Редактор за форматиран текст',
	editorPanel: 'Панел на текстовия редактор',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'натиснете ALT+0 за помощ',

		browseServer: 'Избор от сървъра',
		url: 'URL адрес',
		protocol: 'Протокол',
		upload: 'Качване',
		uploadSubmit: 'Изпращане към сървъра',
		image: 'Изображение',
		flash: 'Флаш',
		form: 'Форма',
		checkbox: 'Поле за избор',
		radio: 'Радио бутон',
		textField: 'Текстово поле',
		textarea: 'Текстова зона',
		hiddenField: 'Скрито поле',
		button: 'Бутон',
		select: 'Поле за избор',
		imageButton: 'Бутон за изображение',
		notSet: '<не е избрано>',
		id: 'ID',
		name: 'Име',
		langDir: 'Посока на езика',
		langDirLtr: 'От ляво надясно (LTR)',
		langDirRtl: 'От дясно наляво (RTL)',
		langCode: 'Код на езика',
		longDescr: 'Уеб адрес за дълго описание',
		cssClass: 'Класове за CSS',
		advisoryTitle: 'Заглавие',
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
		targetTop: 'Най-горният прозорец (_top)',
		targetSelf: 'Текущият прозорец (_self)',
		targetParent: 'Горният прозорец (_parent)',
		langDirLTR: 'От ляво надясно (LTR)',
		langDirRTL: 'От дясно наляво (RTL)',
		styles: 'Стил',
		cssClasses: 'Класове за CSS',
		width: 'Ширина',
		height: 'Височина',
		align: 'Подравняване',
		left: 'Ляво',
		right: 'Дясно',
		center: 'Център',
		justify: 'Двустранно',
		alignLeft: 'Подравни ляво',
		alignRight: 'Подравни дясно',
		alignCenter: 'Подравни център',
		alignTop: 'Горе',
		alignMiddle: 'По средата',
		alignBottom: 'Долу',
		alignNone: 'Без подравняване',
		invalidValue: 'Невалидна стойност.',
		invalidHeight: 'Височината трябва да е число.',
		invalidWidth: 'Ширина трябва да е число.',
		invalidLength: 'Стойността на полето "%1" трябва да е положително число с или без валидна мерна единица (%2).',
		invalidCssLength: 'Стойността на полето "%1" трябва да е положително число с или без валидна CSS мерна единица (px, %, in, cm, mm, em, ex, pt, или pc).',
		invalidHtmlLength: 'Стойността на полето "%1" трябва да е положително число с или без валидна HTML мерна единица (px или %).',
		invalidInlineStyle: 'Стойността на стилa трябва да съдържат една или повече двойки във формат "name : value", разделени с двоеточие.',
		cssLengthTooltip: 'Въведете числена стойност в пиксели или друга валидна CSS единица (px, %, in, cm, mm, em, ex, pt, или pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, недостъпно</span>',

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
		keyboardShortcut: 'Клавишна комбинация',

		optionDefault: 'По подразбиране'
	}
};
