/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Ukrainian language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'uk' ] = {
	// ARIA description.
	editor: 'Текстовий редактор',
	editorPanel: 'Панель розширеного текстового редактора',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'натисніть ALT 0 для довідки',

		browseServer: 'Огляд Сервера',
		url: 'URL',
		protocol: 'Протокол',
		upload: 'Надіслати',
		uploadSubmit: 'Надіслати на сервер',
		image: 'Зображення',
		flash: 'Flash',
		form: 'Форма',
		checkbox: 'Галочка',
		radio: 'Кнопка вибору',
		textField: 'Текстове поле',
		textarea: 'Текстова область',
		hiddenField: 'Приховане поле',
		button: 'Кнопка',
		select: 'Список',
		imageButton: 'Кнопка із зображенням',
		notSet: '<не визначено>',
		id: 'Ідентифікатор',
		name: 'Ім\'я',
		langDir: 'Напрямок мови',
		langDirLtr: 'Зліва направо (LTR)',
		langDirRtl: 'Справа наліво (RTL)',
		langCode: 'Код мови',
		longDescr: 'Довгий опис URL',
		cssClass: 'Клас CSS',
		advisoryTitle: 'Заголовок',
		cssStyle: 'Стиль CSS',
		ok: 'ОК',
		cancel: 'Скасувати',
		close: 'Закрити',
		preview: 'Попередній перегляд',
		resize: 'Потягніть для зміни розмірів',
		generalTab: 'Основне',
		advancedTab: 'Додаткове',
		validateNumberFailed: 'Значення не є цілим числом.',
		confirmNewPage: 'Всі незбережені зміни будуть втрачені. Ви впевнені, що хочете завантажити нову сторінку?',
		confirmCancel: 'Деякі опції змінено. Закрити вікно без збереження змін?',
		options: 'Опції',
		target: 'Ціль',
		targetNew: 'Нове вікно (_blank)',
		targetTop: 'Поточне вікно (_top)',
		targetSelf: 'Поточний фрейм/вікно (_self)',
		targetParent: 'Батьківський фрейм/вікно (_parent)',
		langDirLTR: 'Зліва направо (LTR)',
		langDirRTL: 'Справа наліво (RTL)',
		styles: 'Стиль CSS',
		cssClasses: 'Клас CSS',
		width: 'Ширина',
		height: 'Висота',
		align: 'Вирівнювання',
		left: 'По лівому краю',
		right: 'По правому краю',
		center: 'По центру',
		justify: 'По ширині',
		alignLeft: 'По лівому краю',
		alignRight: 'По правому краю',
		alignCenter: 'Align Center', // MISSING
		alignTop: 'По верхньому краю',
		alignMiddle: 'По середині',
		alignBottom: 'По нижньому краю',
		alignNone: 'Нема',
		invalidValue: 'Невірне значення.',
		invalidHeight: 'Висота повинна бути цілим числом.',
		invalidWidth: 'Ширина повинна бути цілим числом.',
		invalidLength: 'Value specified for the "%1" field must be a positive number with or without a valid measurement unit (%2).', // MISSING
		invalidCssLength: 'Значення, вказане для "%1" в полі повинно бути позитивним числом або без дійсного виміру CSS блоку (px, %, in, cm, mm, em, ex, pt або pc).',
		invalidHtmlLength: 'Значення, вказане для "%1" в полі повинно бути позитивним числом або без дійсного виміру HTML блоку (px або %).',
		invalidInlineStyle: 'Значення, вказане для вбудованого стилю повинне складатися з одного чи кількох кортежів у форматі "ім\'я : значення", розділених крапкою з комою.',
		cssLengthTooltip: 'Введіть номер значення в пікселях або число з дійсною одиниці CSS (px, %, in, cm, mm, em, ex, pt або pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, не доступне</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Backspace',
			13: 'Enter',
			16: 'Shift',
			17: 'Ctrl',
			18: 'Alt',
			32: 'Space', // MISSING
			35: 'End',
			36: 'Home',
			46: 'Видалити',
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
