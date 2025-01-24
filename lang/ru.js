/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object for the
 * Russian language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'ru' ] = {
	// ARIA description.
	application: 'Rich Text Editor', // MISSING
	editor: 'Визуальный текстовый редактор',
	editorPanel: 'Визуальный редактор текста',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Нажмите ALT-0 для открытия справки',

		browseServer: 'Выбор на сервере',
		url: 'Ссылка',
		protocol: 'Протокол',
		upload: 'Загрузка файла',
		uploadSubmit: 'Загрузить на сервер',
		image: 'Изображение',
		form: 'Форма',
		checkbox: 'Чекбокс',
		radio: 'Радиокнопка',
		textField: 'Текстовое поле',
		textarea: 'Многострочное текстовое поле',
		hiddenField: 'Скрытое поле',
		button: 'Кнопка',
		select: 'Выпадающий список',
		imageButton: 'Кнопка-изображение',
		notSet: '<не указано>',
		id: 'Идентификатор',
		name: 'Имя',
		langDir: 'Направление текста',
		langDirLtr: 'Слева направо (LTR)',
		langDirRtl: 'Справа налево (RTL)',
		langCode: 'Код языка',
		longDescr: 'Длинное описание ссылки',
		cssClass: 'Класс CSS',
		advisoryTitle: 'Заголовок',
		cssStyle: 'Стиль',
		ok: 'ОК',
		cancel: 'Отмена',
		close: 'Закрыть',
		preview: 'Предпросмотр',
		resize: 'Перетащите для изменения размера',
		generalTab: 'Основное',
		advancedTab: 'Дополнительно',
		validateNumberFailed: 'Это значение не является числом.',
		confirmNewPage: 'Несохранённые изменения будут потеряны! Вы действительно желаете перейти на другую страницу?',
		confirmCancel: 'Некоторые параметры были изменены. Вы уверены, что желаете закрыть без сохранения?',
		options: 'Параметры',
		target: 'Цель',
		targetNew: 'Новое окно (_blank)',
		targetTop: 'Главное окно (_top)',
		targetSelf: 'Текущее окно (_self)',
		targetParent: 'Родительское окно (_parent)',
		langDirLTR: 'Слева направо (LTR)',
		langDirRTL: 'Справа налево (RTL)',
		styles: 'Стиль',
		cssClasses: 'CSS классы',
		width: 'Ширина',
		height: 'Высота',
		align: 'Выравнивание',
		left: 'По левому краю',
		right: 'По правому краю',
		center: 'По центру',
		justify: 'По ширине',
		alignLeft: 'По левому краю',
		alignRight: 'По правому краю',
		alignCenter: 'По центру',
		alignTop: 'Поверху',
		alignMiddle: 'Посередине',
		alignBottom: 'Понизу',
		alignNone: 'Нет',
		invalidValue: 'Недопустимое значение.',
		invalidHeight: 'Высота задается числом.',
		invalidWidth: 'Ширина задается числом.',
		invalidLength: 'Указанное значение для поля "%1" должно быть положительным числом без или с корректным символом единицы измерения (%2)',
		invalidCssLength: 'Значение, указанное в поле "%1", должно быть положительным целым числом. Допускается указание единиц меры CSS (px, %, in, cm, mm, em, ex, pt или pc).',
		invalidHtmlLength: 'Значение, указанное в поле "%1", должно быть положительным целым числом. Допускается указание единиц меры HTML (px или %).',
		invalidInlineStyle: 'Значение, указанное для стиля элемента, должно состоять из одной или нескольких пар данных в формате "параметр : значение", разделённых точкой с запятой.',
		cssLengthTooltip: 'Введите значение в пикселях, либо число с корректной единицей меры CSS (px, %, in, cm, mm, em, ex, pt или pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, недоступно</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Backspace',
			13: 'Ввод',
			16: 'Shift',
			17: 'Ctrl',
			18: 'Alt',
			32: 'Пробел',
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
		keyboardShortcut: 'Комбинация клавиш',

		optionDefault: 'По умолчанию'
	},

	versionCheck: {
		notificationMessage: 'This CKEditor %current version is not secure. Consider <a target="_blank" href="%link">upgrading to the latest one</a>, %latest.', // MISSING
		consoleMessage: 'This CKEditor %current version is not secure. Consider upgrading to the latest one, %latest: %link', // MISSING
		aboutDialogInsecureMessage: 'This CKEditor %current version is not secure.<br>Consider upgrading to the latest one, %latest:<br><a target="_blank" href="%link">%link</a>', // MISSING
		aboutDialogUpgradeMessage: 'Consider upgrading to the latest editor version, %latest:<br><a target="_blank" href="%link">%link</a>' // MISSING
	}
};
