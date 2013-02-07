/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
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
	/**
	 * The language reading direction. Possible values are "rtl" for
	 * Right-To-Left languages (like Arabic) and "ltr" for Left-To-Right
	 * languages (like English).
	 * @default 'ltr'
	 */
	dir: 'ltr',

	// ARIA description.
	editor: 'Визуальный редактор текста',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'нажмите ALT-0 для открытия справки',

		browseServer: 'Выбор на сервере',
		url: 'Ссылка',
		protocol: 'Протокол',
		upload: 'Загрузка',
		uploadSubmit: 'Загрузить на сервер',
		image: 'Изображение',
		flash: 'Flash',
		form: 'Форма',
		checkbox: 'Флаговая кнопка',
		radio: 'Кнопка выбора',
		textField: 'Текстовое поле',
		textarea: 'Многострочное текстовое поле',
		hiddenField: 'Скрытое поле',
		button: 'Кнопка',
		select: 'Список выбора',
		imageButton: 'Изображение-кнопка',
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
		cssClasses: 'Классы CSS',
		width: 'Ширина',
		height: 'Высота',
		align: 'Выравнивание',
		alignLeft: 'По левому краю',
		alignRight: 'По правому краю',
		alignCenter: 'По центру',
		alignTop: 'По верху',
		alignMiddle: 'По середине',
		alignBottom: 'По низу',
		invalidValue	: 'Недопустимое значение.',
		invalidHeight: 'Высота задается числом.',
		invalidWidth: 'Ширина задается числом.',
		invalidCssLength: 'Значение, указанное в поле "%1", должно быть положительным целым числом. Допускается указание единиц меры CSS (px, %, in, cm, mm, em, ex, pt или pc).',
		invalidHtmlLength: 'Значение, указанное в поле "%1", должно быть положительным целым числом. Допускается указание единиц меры HTML (px или %).',
		invalidInlineStyle: 'Значение, указанное для стиля элемента, должно состоять из одной или нескольких пар данных в формате "параметр : значение", разделённых точкой с запятой.',
		cssLengthTooltip: 'Введите значение в пикселях, либо число с корректной единицей меры CSS (px, %, in, cm, mm, em, ex, pt или pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, недоступно</span>'
	}
};
