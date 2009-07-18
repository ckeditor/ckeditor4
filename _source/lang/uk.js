/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
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
	editorTitle: 'Rich text editor, %1', // MISSING

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
		generalTab: 'Загальна',
		advancedTab: 'Розширений',
		validateNumberFailed: 'This value is not a number.', // MISSING
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?', // MISSING
		confirmCancel: 'Some of the options have been changed. Are you sure to close the dialog?', // MISSING

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, unavailable</span>' // MISSING
	},

	// Special char dialog.
	specialChar: {
		toolbar: 'Вставити спеціальний символ',
		title: 'Оберіть спеціальний символ'
	},

	// Link dialog.
	link: {
		toolbar: 'Вставити/Редагувати посилання',
		menu: 'Вставити посилання',
		title: 'Посилання',
		info: 'Інформація посилання',
		target: 'Ціль',
		upload: 'Закачати',
		advanced: 'Розширений',
		type: 'Тип посилання',
		toAnchor: 'Якір на цю сторінку',
		toEmail: 'Эл. пошта',
		target: 'Ціль',
		targetNotSet: '<не визначено>',
		targetFrame: '<фрейм>',
		targetPopup: '<спливаюче вікно>',
		targetNew: 'Нове вікно (_blank)',
		targetTop: 'Найвище вікно (_top)',
		targetSelf: 'Теж вікно (_self)',
		targetParent: 'Батьківське вікно (_parent)',
		targetFrameName: 'Ім\'я целевого фрейма',
		targetPopupName: 'Ім\'я спливаючого вікна',
		popupFeatures: 'Властивості спливаючого вікна',
		popupResizable: 'Resizable', // MISSING
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
		id: 'Id', // MISSING
		langDir: 'Напрямок мови',
		langDirNotSet: '<не визначено>',
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

	// Find And Replace Dialog
	findAndReplace: {
		title: 'Знайти і замінити',
		find: 'Пошук',
		replace: 'Заміна',
		findWhat: 'Шукати:',
		replaceWith: 'Замінити на:',
		notFoundMsg: 'Вказаний текст не знайдений.',
		matchCase: 'Учитывать регистр',
		matchWord: 'Збіг цілих слів',
		matchCyclic: 'Match cyclic', // MISSING
		replaceAll: 'Замінити все',
		replaceSuccessMsg: '%1 occurrence(s) replaced.' // MISSING
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
		alignNotSet: '<Не вст.>',
		alignLeft: 'Зліва',
		alignCenter: 'По центру',
		alignRight: 'Зправа',
		width: 'Ширина',
		widthPx: 'пікселів',
		widthPc: 'відсотків',
		height: 'Висота',
		cellSpace: 'Проміжок (spacing)',
		cellPad: 'Відступ (padding)',
		caption: 'Заголовок',
		summary: 'Резюме',
		headers: 'Headers', // MISSING
		headersNone: 'None', // MISSING
		headersColumn: 'First column', // MISSING
		headersRow: 'First Row', // MISSING
		headersBoth: 'Both', // MISSING
		invalidRows: 'Number of rows must be a number greater than 0.', // MISSING
		invalidCols: 'Number of columns must be a number greater than 0.', // MISSING
		invalidBorder: 'Border size must be a number.', // MISSING
		invalidWidth: 'Table width must be a number.', // MISSING
		invalidHeight: 'Table height must be a number.', // MISSING
		invalidCellSpacing: 'Cell spacing must be a number.', // MISSING
		invalidCellPadding: 'Cell padding must be a number.', // MISSING

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
			title: 'Cell Properties', // MISSING
			cellType: 'Cell Type', // MISSING
			rowSpan: 'Rows Span', // MISSING
			colSpan: 'Columns Span', // MISSING
			wordWrap: 'Word Wrap', // MISSING
			hAlign: 'Horizontal Alignment', // MISSING
			vAlign: 'Vertical Alignment', // MISSING
			alignTop: 'Top', // MISSING
			alignMiddle: 'Middle', // MISSING
			alignBottom: 'Bottom', // MISSING
			alignBaseline: 'Baseline', // MISSING
			bgColor: 'Background Color', // MISSING
			borderColor: 'Border Color', // MISSING
			data: 'Data', // MISSING
			header: 'Header', // MISSING
			yes: 'Yes', // MISSING
			no: 'No', // MISSING
			invalidWidth: 'Cell width must be a number.', // MISSING
			invalidHeight: 'Cell height must be a number.', // MISSING
			invalidRowSpan: 'Rows span must be a whole number.', // MISSING
			invalidColSpan: 'Columns span must be a whole number.' // MISSING
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
		encoding: 'Encoding', // MISSING
		target: 'Ціль',
		targetNotSet: '<не визначено>',
		targetNew: 'Нове вікно (_blank)',
		targetTop: 'Найвище вікно (_top)',
		targetSelf: 'Теж вікно (_self)',
		targetParent: 'Батьківське вікно (_parent)'
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
		url: 'URL',
		upload: 'Закачати',
		alt: 'Альтернативний текст',
		width: 'Ширина',
		height: 'Висота',
		lockRatio: 'Зберегти пропорції',
		resetSize: 'Скинути розмір',
		border: 'Бордюр',
		hSpace: 'Горизонтальний відступ',
		vSpace: 'Вертикальний відступ',
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
		preview: 'Попередній перегляд',
		alertUrl: 'Будь ласка, введіть URL зображення',
		linkTab: 'Посилання',
		button2Img: 'Do you want to transform the selected image button on a simple image?', // MISSING
		img2Button: 'Do you want to transform the selected image on a image button?' // MISSING
	},

	// Flash Dialog
	flash: {
		properties: 'Властивості Flash',
		propertiesTab: 'Properties', // MISSING
		title: 'Властивості Flash',
		chkPlay: 'Авто програвання',
		chkLoop: 'Зациклити',
		chkMenu: 'Дозволити меню Flash',
		chkFull: 'Allow Fullscreen', // MISSING
		scale: 'Масштаб',
		scaleAll: 'Показати всі',
		scaleNoBorder: 'Без рамки',
		scaleFit: 'Дійсний розмір',
		access: 'Script Access', // MISSING
		accessAlways: 'Always', // MISSING
		accessSameDomain: 'Same domain', // MISSING
		accessNever: 'Never', // MISSING
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
		quality: 'Quality', // MISSING
		qualityBest: 'Best', // MISSING
		qualityHigh: 'High', // MISSING
		qualityAutoHigh: 'Auto High', // MISSING
		qualityMedium: 'Medium', // MISSING
		qualityAutoLow: 'Auto Low', // MISSING
		qualityLow: 'Low', // MISSING
		windowModeWindow: 'Window', // MISSING
		windowModeOpaque: 'Opaque', // MISSING
		windowModeTransparent: 'Transparent', // MISSING
		windowMode: 'Window mode', // MISSING
		flashvars: 'Variables for Flash', // MISSING
		bgcolor: 'Колір фону',
		width: 'Ширина',
		height: 'Висота',
		hSpace: 'Горизонтальний відступ',
		vSpace: 'Вертикальний відступ',
		validateSrc: 'Будь ласка, занесіть URL посилання',
		validateWidth: 'Width must be a number.', // MISSING
		validateHeight: 'Height must be a number.', // MISSING
		validateHSpace: 'HSpace must be a number.', // MISSING
		validateVSpace: 'VSpace must be a number.' // MISSING
	},

	// Speller Pages Dialog
	spellCheck: {
		toolbar: 'Перевірити орфографію',
		title: 'Spell Check', // MISSING
		notAvailable: 'Sorry, but service is unavailable now.', // MISSING
		errorLoading: 'Error loading application service host: %s.', // MISSING
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
		title: 'Вставити смайлик'
	},

	elementsPath: {
		eleTitle: '%1 element' // MISSING
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
		cutError: 'Настройки безпеки вашого браузера не дозволяють редактору автоматично виконувати операції вирізування. Будь ласка, використовуйте клавіатуру для цього (Ctrl+X).',
		copyError: 'Настройки безпеки вашого браузера не дозволяють редактору автоматично виконувати операції копіювання. Будь ласка, використовуйте клавіатуру для цього (Ctrl+C).',
		pasteMsg: 'Будь-ласка, вставте з буфера обміну в цю область, користуючись комбінацією клавіш (<STRONG>Ctrl+V</STRONG>) та натисніть <STRONG>OK</STRONG>.',
		securityMsg: 'Редактор не може отримати прямий доступ до буферу обміну у зв\'язку з налаштуваннями вашого браузера. Вам потрібно вставити інформацію повторно в це вікно.'
	},

	pastefromword: {
		toolbar: 'Вставити з Word',
		title: 'Вставити з Word',
		advice: 'Будь-ласка, вставте з буфера обміну в цю область, користуючись комбінацією клавіш (<STRONG>Ctrl+V</STRONG>) та натисніть <STRONG>OK</STRONG>.',
		ignoreFontFace: 'Ігнорувати налаштування шрифтів',
		removeStyle: 'Видалити налаштування стилів'
	},

	pasteText: {
		button: 'Вставити тільки текст',
		title: 'Вставити тільки текст'
	},

	templates: {
		button: 'Шаблони',
		title: 'Шаблони змісту',
		insertOption: 'Замінити поточний вміст',
		selectPromptMsg: 'Оберіть, будь ласка, шаблон для відкриття в редакторі<br>(поточний зміст буде втрачено):',
		emptyListMsg: '(Не визначено жодного шаблону)'
	},

	showBlocks: 'Показувати блоки',

	stylesCombo: {
		label: 'Стиль',
		voiceLabel: 'Styles', // MISSING
		panelVoiceLabel: 'Select a style', // MISSING
		panelTitle1: 'Block Styles', // MISSING
		panelTitle2: 'Inline Styles', // MISSING
		panelTitle3: 'Object Styles' // MISSING
	},

	format: {
		label: 'Форматування',
		voiceLabel: 'Format', // MISSING
		panelTitle: 'Форматування',
		panelVoiceLabel: 'Select a paragraph format', // MISSING

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

	font: {
		label: 'Шрифт',
		voiceLabel: 'Font', // MISSING
		panelTitle: 'Шрифт',
		panelVoiceLabel: 'Select a font' // MISSING
	},

	fontSize: {
		label: 'Розмір',
		voiceLabel: 'Font Size', // MISSING
		panelTitle: 'Розмір',
		panelVoiceLabel: 'Select a font size' // MISSING
	},

	colorButton: {
		textColorTitle: 'Колір тексту',
		bgColorTitle: 'Колір фону',
		auto: 'Автоматичний',
		more: 'Кольори...'
	},

	colors: {
		'000': 'Black',
		'800000': 'Maroon',
		'8B4513': 'Saddle Brown',
		'2F4F4F': 'Dark Slate Gray',
		'008080': 'Teal',
		'000080': 'Navy',
		'4B0082': 'Indigo',
		'696969': 'Dim Gray',
		'B22222': 'Fire Brick',
		'A52A2A': 'Brown',
		'DAA520': 'Golden Rod',
		'006400': 'Dark Green',
		'40E0D0': 'Turquoise',
		'0000CD': 'Medium Blue',
		'800080': 'Purple',
		'808080': 'Gray',
		'F00': 'Red',
		'FF8C00': 'Dark Orange',
		'FFD700': 'Gold',
		'008000': 'Green',
		'0FF': 'Cyan',
		'00F': 'Blue',
		'EE82EE': 'Violet',
		'A9A9A9': 'Dark Gray',
		'FFA07A': 'Light Salmon',
		'FFA500': 'Orange',
		'FFFF00': 'Yellow',
		'00FF00': 'Lime',
		'AFEEEE': 'Pale Turquoise',
		'ADD8E6': 'Light Blue',
		'DDA0DD': 'Plum',
		'D3D3D3': 'Light Grey',
		'FFF0F5': 'Lavender Blush',
		'FAEBD7': 'Antique White',
		'FFFFE0': 'Light Yellow',
		'F0FFF0': 'Honeydew',
		'F0FFFF': 'Azure',
		'F0F8FF': 'Alice Blue',
		'E6E6FA': 'Lavender',
		'FFF': 'White'
	},

	scayt: {
		title: 'Spell Check As You Type', // MISSING
		enable: 'Enable SCAYT', // MISSING
		disable: 'Disable SCAYT', // MISSING
		about: 'About SCAYT', // MISSING
		toggle: 'Toggle SCAYT', // MISSING
		options: 'Options', // MISSING
		langs: 'Languages', // MISSING
		moreSuggestions: 'More suggestions', // MISSING
		ignore: 'Ignore', // MISSING
		ignoreAll: 'Ignore All', // MISSING
		addWord: 'Add Word', // MISSING
		emptyDic: 'Dictionary name should not be empty.', // MISSING
		optionsTab: 'Options', // MISSING
		languagesTab: 'Languages', // MISSING
		dictionariesTab: 'Dictionaries', // MISSING
		aboutTab: 'About' // MISSING
	},

	about: {
		title: 'About CKEditor', // MISSING
		dlgTitle: 'About CKEditor', // MISSING
		moreInfo: 'For licensing information please visit our web site:', // MISSING
		copy: 'Copyright &copy; $1. All rights reserved.' // MISSING
	},

	maximize: 'Maximize', // MISSING

	fakeobjects: {
		anchor: 'Anchor', // MISSING
		flash: 'Flash Animation', // MISSING
		div: 'Page Break', // MISSING
		unknown: 'Unknown Object' // MISSING
	},

	resize: 'Drag to resize' // MISSING
};
