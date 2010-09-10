/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Ukrainian language. Translated by Alexander Pervak.
 */

/**#@+
   @type String
   @example
*/

/**
 * Constains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'uk' ] = {
	/**
	 * The language reading direction. Possible values are "rtl" for
	 * Right-To-Left languages (like Arabic) and "ltr" for Left-To-Right
	 * languages (like English).
	 * @default 'ltr'
	 */
	dir: 'ltr',

	/*
	 * Screenreader titles. Please note that screenreaders are not always capable
	 * of reading non-English words. So be careful while translating it.
	 */
	editorTitle: 'Rich text editor, %1, press ALT 0 for help.', // MISSING

	// ARIA descriptions.
	toolbar: 'Toolbar', // MISSING
	editor: 'Rich Text Editor', // MISSING

	// Toolbar buttons without dialogs.
	source: 'Джерело',
	newPage: 'Нова сторінка',
	save: 'Зберегти',
	preview: 'Попередній перегляд',
	cut: 'Вирізати',
	copy: 'Копіювати',
	paste: 'Вставити',
	print: 'Друк',
	underline: 'Підкреслений',
	bold: 'Жирний',
	italic: 'Курсив',
	selectAll: 'Виділити все',
	removeFormat: 'Прибрати форматування',
	strike: 'Закреслений',
	subscript: 'Підрядковий індекс',
	superscript: 'Надрядковий индекс',
	horizontalrule: 'Вставити горизонтальну лінію',
	pagebreak: 'Вставити розривши сторінки',
	unlink: 'Знищити посилання',
	undo: 'Повернути',
	redo: 'Повторити',

	// Common messages and labels.
	common: {
		browseServer: 'Передивитися на сервері',
		url: 'URL',
		protocol: 'Протокол',
		upload: 'Закачати',
		uploadSubmit: 'Надіслати на сервер',
		image: 'Зображення',
		flash: 'Flash',
		form: 'Форма',
		checkbox: 'Флагова кнопка',
		radio: 'Кнопка вибору',
		textField: 'Текстове поле',
		textarea: 'Текстова область',
		hiddenField: 'Приховане поле',
		button: 'Кнопка',
		select: 'Список',
		imageButton: 'Кнопка із зображенням',
		notSet: '<не визначено>',
		id: 'Ідентифікатор',
		name: 'Им\'я',
		langDir: 'Напрямок мови',
		langDirLtr: 'Зліва на право (LTR)',
		langDirRtl: 'Зправа на ліво (RTL)',
		langCode: 'Мова',
		longDescr: 'Довгий опис URL',
		cssClass: 'Клас CSS',
		advisoryTitle: 'Заголовок',
		cssStyle: 'Стиль CSS',
		ok: 'ОК',
		cancel: 'Скасувати',
		close: 'Close', // MISSING
		preview: 'Preview', // MISSING
		generalTab: 'Загальна',
		advancedTab: 'Розширений',
		validateNumberFailed: 'Значення не є числом.',
		confirmNewPage: 'Всі не збережені зміни будуть втрачені. Ви впевнені, що хочете завантажити нову сторінку?',
		confirmCancel: 'Деякі опції були змінені. Закрити вікно?',
		options: 'Options', // MISSING
		target: 'Target', // MISSING
		targetNew: 'New Window (_blank)', // MISSING
		targetTop: 'Topmost Window (_top)', // MISSING
		targetSelf: 'Same Window (_self)', // MISSING
		targetParent: 'Parent Window (_parent)', // MISSING
		langDirLTR: 'Left to Right (LTR)', // MISSING
		langDirRTL: 'Right to Left (RTL)', // MISSING
		styles: 'Style', // MISSING
		cssClasses: 'Stylesheet Classes', // MISSING

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, не доступне</span>'
	},

	contextmenu: {
		options: 'Context Menu Options' // MISSING
	},

	// Special char dialog.
	specialChar: {
		toolbar: 'Вставити спеціальний символ',
		title: 'Оберіть спеціальний символ',
		options: 'Special Character Options' // MISSING
	},

	// Link dialog.
	link: {
		toolbar: 'Вставити/Редагувати посилання',
		other: '<інший>',
		menu: 'Вставити посилання',
		title: 'Посилання',
		info: 'Інформація посилання',
		target: 'Ціль',
		upload: 'Закачати',
		advanced: 'Розширений',
		type: 'Тип посилання',
		toUrl: 'URL', // MISSING
		toAnchor: 'Якір на цю сторінку',
		toEmail: 'Эл. пошта',
		targetFrame: '<фрейм>',
		targetPopup: '<спливаюче вікно>',
		targetFrameName: 'Ім\'я целевого фрейма',
		targetPopupName: 'Ім\'я спливаючого вікна',
		popupFeatures: 'Властивості спливаючого вікна',
		popupResizable: 'Масштабоване',
		popupStatusBar: 'Строка статусу',
		popupLocationBar: 'Панель локації',
		popupToolbar: 'Панель інструментів',
		popupMenuBar: 'Панель меню',
		popupFullScreen: 'Повний екран (IE)',
		popupScrollBars: 'Полоси прокрутки',
		popupDependent: 'Залежний (Netscape)',
		popupWidth: 'Ширина',
		popupLeft: 'Позиція зліва',
		popupHeight: 'Висота',
		popupTop: 'Позиція зверху',
		id: 'Ідентифікатор (Id)',
		langDir: 'Напрямок мови',
		langDirLTR: 'Зліва на право (LTR)',
		langDirRTL: 'Зправа на ліво (RTL)',
		acccessKey: 'Гаряча клавіша',
		name: 'Им\'я',
		langCode: 'Напрямок мови',
		tabIndex: 'Послідовність переходу',
		advisoryTitle: 'Заголовок',
		advisoryContentType: 'Тип вмісту',
		cssClasses: 'Клас CSS',
		charset: 'Кодировка',
		styles: 'Стиль CSS',
		selectAnchor: 'Оберіть якір',
		anchorName: 'За ім\'ям якоря',
		anchorId: 'За ідентифікатором елемента',
		emailAddress: 'Адреса ел. пошти',
		emailSubject: 'Тема листа',
		emailBody: 'Тіло повідомлення',
		noAnchors: '(Немає якорів доступних в цьому документі)',
		noUrl: 'Будь ласка, занесіть URL посилання',
		noEmail: 'Будь ласка, занесіть адрес эл. почты'
	},

	// Anchor dialog
	anchor: {
		toolbar: 'Вставити/Редагувати якір',
		menu: 'Властивості якоря',
		title: 'Властивості якоря',
		name: 'Ім\'я якоря',
		errorName: 'Будь ласка, занесіть ім\'я якоря'
	},

	// List style dialog
	list: {
		numberedTitle: 'Numbered List Properties', // MISSING
		bulletedTitle: 'Bulleted List Properties', // MISSING
		type: 'Type', // MISSING
		start: 'Start', // MISSING
		validateStartNumber: 'List start number must be a whole number.', // MISSING
		circle: 'Circle', // MISSING
		disc: 'Disc', // MISSING
		square: 'Square', // MISSING
		none: 'None', // MISSING
		notset: '<not set>', // MISSING
		armenian: 'Armenian numbering', // MISSING
		georgian: 'Georgian numbering (an, ban, gan, etc.)', // MISSING
		lowerRoman: 'Lower Roman (i, ii, iii, iv, v, etc.)', // MISSING
		upperRoman: 'Upper Roman (I, II, III, IV, V, etc.)', // MISSING
		lowerAlpha: 'Lower Alpha (a, b, c, d, e, etc.)', // MISSING
		upperAlpha: 'Upper Alpha (A, B, C, D, E, etc.)', // MISSING
		lowerGreek: 'Lower Greek (alpha, beta, gamma, etc.)', // MISSING
		decimal: 'Decimal (1, 2, 3, etc.)', // MISSING
		decimalLeadingZero: 'Decimal leading zero (01, 02, 03, etc.)' // MISSING
	},

	// Find And Replace Dialog
	findAndReplace: {
		title: 'Знайти і замінити',
		find: 'Пошук',
		replace: 'Заміна',
		findWhat: 'Шукати:',
		replaceWith: 'Замінити на:',
		notFoundMsg: 'Вказаний текст не знайдений.',
		matchCase: 'Враховувати регістр',
		matchWord: 'Збіг цілих слів',
		matchCyclic: 'Циклічна заміна',
		replaceAll: 'Замінити все',
		replaceSuccessMsg: '%1 співпадінь(я) замінено.'
	},

	// Table Dialog
	table: {
		toolbar: 'Таблиця',
		title: 'Властивості таблиці',
		menu: 'Властивості таблиці',
		deleteTable: 'Видалити таблицю',
		rows: 'Строки',
		columns: 'Колонки',
		border: 'Розмір бордюра',
		align: 'Вирівнювання',
		alignLeft: 'Зліва',
		alignCenter: 'По центру',
		alignRight: 'Зправа',
		width: 'Ширина',
		widthPx: 'пікселів',
		widthPc: 'відсотків',
		widthUnit: 'width unit', // MISSING
		height: 'Висота',
		cellSpace: 'Проміжок (spacing)',
		cellPad: 'Відступ (padding)',
		caption: 'Заголовок',
		summary: 'Резюме',
		headers: 'Заголовки',
		headersNone: 'Жодного',
		headersColumn: 'Перша колонка',
		headersRow: 'Перший рядок',
		headersBoth: 'Обидва',
		invalidRows: 'Кількість рядків повинна бути числом більше за 0.',
		invalidCols: 'Кількість колонок повинна бути числом більше за  0.',
		invalidBorder: 'Розмір бордюра повинен бути числом.',
		invalidWidth: 'Ширина таблиці повинна бути числом.',
		invalidHeight: 'Висота таблиці повинна бути числом.',
		invalidCellSpacing: 'Проміжок (spacing) комірки повинен бути числом.',
		invalidCellPadding: 'Відступ (padding) комірки повинен бути числом.',

		cell: {
			menu: 'Осередок',
			insertBefore: 'Вставити комірку до',
			insertAfter: 'Вставити комірку після',
			deleteCell: 'Видалити комірки',
			merge: 'Об\'єднати комірки',
			mergeRight: 'Об\'єднати зправа',
			mergeDown: 'Об\'єднати до низу',
			splitHorizontal: 'Розділити комірку по горизонталі',
			splitVertical: 'Розділити комірку по вертикалі',
			title: 'Властивості комірки',
			cellType: 'Тип комірки',
			rowSpan: 'Обєднання рядків (Rows Span)',
			colSpan: 'Обєднання стовпчиків (Columns Span)',
			wordWrap: 'Авто згортання тексту (Word Wrap)',
			hAlign: 'Горизонтальне вирівнювання',
			vAlign: 'Вертикальне вирівнювання',
			alignTop: 'До верху',
			alignMiddle: 'Посередині',
			alignBottom: 'До низу',
			alignBaseline: 'По базовій лінії',
			bgColor: 'Колір фону',
			borderColor: 'Колір бордюру',
			data: 'Дані',
			header: 'Заголовок',
			yes: 'Так',
			no: 'Ні',
			invalidWidth: 'Ширина комірки повинна бути числом.',
			invalidHeight: 'Висота комірки повинна бути числом.',
			invalidRowSpan: 'Кількість обєднуваних рядків повинна бути цілим числом.',
			invalidColSpan: 'Кількість обєднуваних стовпчиків повинна бути цілим числом.',
			chooseColor: 'Choose' // MISSING
		},

		row: {
			menu: 'Рядок',
			insertBefore: 'Вставити рядок до',
			insertAfter: 'Вставити рядок після',
			deleteRow: 'Видалити строки'
		},

		column: {
			menu: 'Колонка',
			insertBefore: 'Вставити колонку до',
			insertAfter: 'Вставити колонку після',
			deleteColumn: 'Видалити колонки'
		}
	},

	// Button Dialog.
	button: {
		title: 'Властивості кнопки',
		text: 'Текст (Значення)',
		type: 'Тип',
		typeBtn: 'Кнопка',
		typeSbm: 'Відправити',
		typeRst: 'Скинути'
	},

	// Checkbox and Radio Button Dialogs.
	checkboxAndRadio: {
		checkboxTitle: 'Властивості флагової кнопки',
		radioTitle: 'Властивості кнопки вибору',
		value: 'Значення',
		selected: 'Обрана'
	},

	// Form Dialog.
	form: {
		title: 'Властивості форми',
		menu: 'Властивості форми',
		action: 'Дія',
		method: 'Метод',
		encoding: 'Кодування'
	},

	// Select Field Dialog.
	select: {
		title: 'Властивості списку',
		selectInfo: 'Інфо',
		opAvail: 'Доступні варіанти',
		value: 'Значення',
		size: 'Розмір',
		lines: 'лінії',
		chkMulti: 'Дозволити обрання декількох позицій',
		opText: 'Текст',
		opValue: 'Значення',
		btnAdd: 'Добавити',
		btnModify: 'Змінити',
		btnUp: 'Вгору',
		btnDown: 'Вниз',
		btnSetValue: 'Встановити як вибране значення',
		btnDelete: 'Видалити'
	},

	// Textarea Dialog.
	textarea: {
		title: 'Властивості текстової області',
		cols: 'Колонки',
		rows: 'Строки'
	},

	// Text Field Dialog.
	textfield: {
		title: 'Властивості текстового поля',
		name: 'Ім\'я',
		value: 'Значення',
		charWidth: 'Ширина',
		maxChars: 'Макс. кіл-ть символів',
		type: 'Тип',
		typeText: 'Текст',
		typePass: 'Пароль'
	},

	// Hidden Field Dialog.
	hidden: {
		title: 'Властивості прихованого поля',
		name: 'Ім\'я',
		value: 'Значення'
	},

	// Image Dialog.
	image: {
		title: 'Властивості зображення',
		titleButton: 'Властивості кнопки із зображенням',
		menu: 'Властивості зображення',
		infoTab: 'Інформація про изображении',
		btnUpload: 'Надіслати на сервер',
		upload: 'Закачати',
		alt: 'Альтернативний текст',
		width: 'Ширина',
		height: 'Висота',
		lockRatio: 'Зберегти пропорції',
		unlockRatio: 'Unlock Ratio', // MISSING
		resetSize: 'Скинути розмір',
		border: 'Бордюр',
		hSpace: 'Горизонтальний відступ',
		vSpace: 'Вертикальний відступ',
		align: 'Вирівнювання',
		alignLeft: 'По лівому краю',
		alignRight: 'По правому краю',
		alertUrl: 'Будь ласка, введіть URL зображення',
		linkTab: 'Посилання',
		button2Img: 'Ви хочете перетворити обрану кнопку-зображення на просте зображення?',
		img2Button: 'Ви хочете перетворити обране зображення на кнопку-зображення?',
		urlMissing: 'Image source URL is missing.', // MISSING
		validateWidth: 'Width must be a whole number.', // MISSING
		validateHeight: 'Height must be a whole number.', // MISSING
		validateBorder: 'Border must be a whole number.', // MISSING
		validateHSpace: 'HSpace must be a whole number.', // MISSING
		validateVSpace: 'VSpace must be a whole number.' // MISSING
	},

	// Flash Dialog
	flash: {
		properties: 'Властивості Flash',
		propertiesTab: 'Властивості',
		title: 'Властивості Flash',
		chkPlay: 'Авто програвання',
		chkLoop: 'Зациклити',
		chkMenu: 'Дозволити меню Flash',
		chkFull: 'Дозволити повноекранний перегляд',
		scale: 'Масштаб',
		scaleAll: 'Показати всі',
		scaleNoBorder: 'Без рамки',
		scaleFit: 'Дійсний розмір',
		access: 'Доступ до скрипта',
		accessAlways: 'Завжди',
		accessSameDomain: 'З того ж домена',
		accessNever: 'Ніколи',
		align: 'Вирівнювання',
		alignLeft: 'По лівому краю',
		alignAbsBottom: 'Абс по низу',
		alignAbsMiddle: 'Абс по середині',
		alignBaseline: 'По базовій лінії',
		alignBottom: 'По низу',
		alignMiddle: 'По середині',
		alignRight: 'По правому краю',
		alignTextTop: 'Текст на верху',
		alignTop: 'По верху',
		quality: 'Якість',
		qualityBest: 'Відмінна',
		qualityHigh: 'Висока',
		qualityAutoHigh: 'Авто відмінна',
		qualityMedium: 'Середня',
		qualityAutoLow: 'Авто низька',
		qualityLow: 'Низька',
		windowModeWindow: 'Вікно',
		windowModeOpaque: 'Непрозорість (Opaque)',
		windowModeTransparent: 'Прозорість (Transparent)',
		windowMode: 'Режим вікна',
		flashvars: 'Змінні Flash',
		bgcolor: 'Колір фону',
		width: 'Ширина',
		height: 'Висота',
		hSpace: 'Горизонтальний відступ',
		vSpace: 'Вертикальний відступ',
		validateSrc: 'Будь ласка, занесіть URL посилання',
		validateWidth: 'Ширина повинна бути числом.',
		validateHeight: 'Висота повинна бути числом.',
		validateHSpace: 'HSpace повинна бути числом.',
		validateVSpace: 'VSpace повинна бути числом.'
	},

	// Speller Pages Dialog
	spellCheck: {
		toolbar: 'Перевірити орфографію',
		title: 'Перевірка орфографії',
		notAvailable: 'Вибачте, але сервіс наразі недоступний.',
		errorLoading: 'Помилка завантаження : %s.',
		notInDic: 'Не має в словнику',
		changeTo: 'Замінити на',
		btnIgnore: 'Ігнорувати',
		btnIgnoreAll: 'Ігнорувати все',
		btnReplace: 'Замінити',
		btnReplaceAll: 'Замінити все',
		btnUndo: 'Назад',
		noSuggestions: '- Немає припущень -',
		progress: 'Виконується перевірка орфографії...',
		noMispell: 'Перевірку орфографії завершено: помилок не знайдено',
		noChanges: 'Перевірку орфографії завершено: жодне слово не змінено',
		oneChange: 'Перевірку орфографії завершено: змінено одно слово',
		manyChanges: 'Перевірку орфографії завершено: 1% слів змінено',
		ieSpellDownload: 'Модуль перевірки орфографії не встановлено. Бажаєтн завантажити його зараз?'
	},

	smiley: {
		toolbar: 'Смайлик',
		title: 'Вставити смайлик',
		options: 'Smiley Options' // MISSING
	},

	elementsPath: {
		eleLabel: 'Elements path', // MISSING
		eleTitle: '%1 елемент'
	},

	numberedlist: 'Нумерований список',
	bulletedlist: 'Маркований список',
	indent: 'Збільшити відступ',
	outdent: 'Зменшити відступ',

	justify: {
		left: 'По лівому краю',
		center: 'По центру',
		right: 'По правому краю',
		block: 'По ширині'
	},

	blockquote: 'Цитата',

	clipboard: {
		title: 'Вставити',
		cutError: 'Настройки безпеки вашого браузера не дозволяють редактору автоматично виконувати операції вирізування. Будь ласка, використовуйте клавіатуру для цього (Ctrl/Cmd+X).',
		copyError: 'Настройки безпеки вашого браузера не дозволяють редактору автоматично виконувати операції копіювання. Будь ласка, використовуйте клавіатуру для цього (Ctrl/Cmd+C).',
		pasteMsg: 'Будь ласка, вставте з буфера обміну в цю область, користуючись комбінацією клавіш (<STRONG>Ctrl/Cmd+V</STRONG>) та натисніть <STRONG>OK</STRONG>.',
		securityMsg: 'Редактор не може отримати прямий доступ до буферу обміну у зв\'язку з налаштуваннями вашого браузера. Вам потрібно вставити інформацію повторно в це вікно.',
		pasteArea: 'Paste Area' // MISSING
	},

	pastefromword: {
		confirmCleanup: 'Текст, що ви хочете вставити, схожий на копійований з Word. Ви хочете очистити його перед вставкою?',
		toolbar: 'Вставити з Word',
		title: 'Вставити з Word',
		error: 'It was not possible to clean up the pasted data due to an internal error' // MISSING
	},

	pasteText: {
		button: 'Вставити тільки текст',
		title: 'Вставити тільки текст'
	},

	templates: {
		button: 'Шаблони',
		title: 'Шаблони змісту',
		options: 'Template Options', // MISSING
		insertOption: 'Замінити поточний вміст',
		selectPromptMsg: 'Оберіть, будь ласка, шаблон для відкриття в редакторі<br>(поточний зміст буде втрачено):',
		emptyListMsg: '(Не визначено жодного шаблону)'
	},

	showBlocks: 'Показувати блоки',

	stylesCombo: {
		label: 'Стиль',
		panelTitle: 'Formatting Styles', // MISSING
		panelTitle1: 'Block стилі',
		panelTitle2: 'Inline стилі',
		panelTitle3: 'Object стилі'
	},

	format: {
		label: 'Форматування',
		panelTitle: 'Форматування',

		tag_p: 'Нормальний',
		tag_pre: 'Форматований',
		tag_address: 'Адреса',
		tag_h1: 'Заголовок 1',
		tag_h2: 'Заголовок 2',
		tag_h3: 'Заголовок 3',
		tag_h4: 'Заголовок 4',
		tag_h5: 'Заголовок 5',
		tag_h6: 'Заголовок 6',
		tag_div: 'Нормальний (DIV)'
	},

	div: {
		title: 'Create Div Container', // MISSING
		toolbar: 'Create Div Container', // MISSING
		cssClassInputLabel: 'Stylesheet Classes', // MISSING
		styleSelectLabel: 'Style', // MISSING
		IdInputLabel: 'Id', // MISSING
		languageCodeInputLabel: ' Language Code', // MISSING
		inlineStyleInputLabel: 'Inline Style', // MISSING
		advisoryTitleInputLabel: 'Advisory Title', // MISSING
		langDirLabel: 'Language Direction', // MISSING
		langDirLTRLabel: 'Left to Right (LTR)', // MISSING
		langDirRTLLabel: 'Right to Left (RTL)', // MISSING
		edit: 'Edit Div', // MISSING
		remove: 'Remove Div' // MISSING
	},

	font: {
		label: 'Шрифт',
		voiceLabel: 'Шрифт',
		panelTitle: 'Шрифт'
	},

	fontSize: {
		label: 'Розмір',
		voiceLabel: 'Розмір шрифта',
		panelTitle: 'Розмір'
	},

	colorButton: {
		textColorTitle: 'Колір тексту',
		bgColorTitle: 'Колір фону',
		panelTitle: 'Colors', // MISSING
		auto: 'Автоматичний',
		more: 'Кольори...'
	},

	colors: {
		'000': 'Black', // MISSING
		'800000': 'Maroon', // MISSING
		'8B4513': 'Saddle Brown', // MISSING
		'2F4F4F': 'Dark Slate Gray', // MISSING
		'008080': 'Teal', // MISSING
		'000080': 'Navy', // MISSING
		'4B0082': 'Indigo', // MISSING
		'696969': 'Dark Gray', // MISSING
		'B22222': 'Fire Brick', // MISSING
		'A52A2A': 'Brown', // MISSING
		'DAA520': 'Golden Rod', // MISSING
		'006400': 'Dark Green', // MISSING
		'40E0D0': 'Turquoise', // MISSING
		'0000CD': 'Medium Blue', // MISSING
		'800080': 'Purple', // MISSING
		'808080': 'Gray', // MISSING
		'F00': 'Red', // MISSING
		'FF8C00': 'Dark Orange', // MISSING
		'FFD700': 'Gold', // MISSING
		'008000': 'Green', // MISSING
		'0FF': 'Cyan', // MISSING
		'00F': 'Blue', // MISSING
		'EE82EE': 'Violet', // MISSING
		'A9A9A9': 'Dim Gray', // MISSING
		'FFA07A': 'Light Salmon', // MISSING
		'FFA500': 'Orange', // MISSING
		'FFFF00': 'Yellow', // MISSING
		'00FF00': 'Lime', // MISSING
		'AFEEEE': 'Pale Turquoise', // MISSING
		'ADD8E6': 'Light Blue', // MISSING
		'DDA0DD': 'Plum', // MISSING
		'D3D3D3': 'Light Grey', // MISSING
		'FFF0F5': 'Lavender Blush', // MISSING
		'FAEBD7': 'Antique White', // MISSING
		'FFFFE0': 'Light Yellow', // MISSING
		'F0FFF0': 'Honeydew', // MISSING
		'F0FFFF': 'Azure', // MISSING
		'F0F8FF': 'Alice Blue', // MISSING
		'E6E6FA': 'Lavender', // MISSING
		'FFF': 'White' // MISSING
	},

	scayt: {
		title: 'Перефірка орфографії по мірі набору',
		opera_title: 'Not supported by Opera', // MISSING
		enable: 'Включити SCAYT',
		disable: 'Відключити SCAYT',
		about: 'Про SCAYT',
		toggle: 'Перемкнути SCAYT',
		options: 'Опції',
		langs: 'Мови',
		moreSuggestions: 'Більше пропозицій',
		ignore: 'Ігнорувати',
		ignoreAll: 'Ігнорувати всі',
		addWord: 'Додати слово',
		emptyDic: 'Назва словника повинна бути заповнена.',

		optionsTab: 'Опції',
		allCaps: 'Ignore All-Caps Words', // MISSING
		ignoreDomainNames: 'Ignore Domain Names', // MISSING
		mixedCase: 'Ignore Words with Mixed Case', // MISSING
		mixedWithDigits: 'Ignore Words with Numbers', // MISSING

		languagesTab: 'Мови',

		dictionariesTab: 'Словники',
		dic_field_name: 'Dictionary name', // MISSING
		dic_create: 'Create', // MISSING
		dic_restore: 'Restore', // MISSING
		dic_delete: 'Delete', // MISSING
		dic_rename: 'Rename', // MISSING
		dic_info: 'Initially the User Dictionary is stored in a Cookie. However, Cookies are limited in size. When the User Dictionary grows to a point where it cannot be stored in a Cookie, then the dictionary may be stored on our server. To store your personal dictionary on our server you should specify a name for your dictionary. If you already have a stored dictionary, please type its name and click the Restore button.', // MISSING

		aboutTab: 'Про'
	},

	about: {
		title: 'Про CKEditor',
		dlgTitle: 'Про CKEditor',
		moreInfo: 'Щодо інформації з ліцензування завітайте до нашого сайту:',
		copy: 'Copyright &copy; $1. Всі права застережено.'
	},

	maximize: 'Максимізувати',
	minimize: 'Minimize', // MISSING

	fakeobjects: {
		anchor: 'Якір',
		flash: 'Flash анімація',
		div: 'Розрив сторінки',
		unknown: 'Невідомий об`єкт'
	},

	resize: 'Пересувайте для зміни розміру',

	colordialog: {
		title: 'Select color', // MISSING
		options: 'Color Options', // MISSING
		highlight: 'Highlight', // MISSING
		selected: 'Selected Color', // MISSING
		clear: 'Clear' // MISSING
	},

	toolbarCollapse: 'Collapse Toolbar', // MISSING
	toolbarExpand: 'Expand Toolbar', // MISSING

	bidi: {
		ltr: 'Text direction from left to right', // MISSING
		rtl: 'Text direction from right to left' // MISSING
	}
};
