/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Serbian (Cyrillic) language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'sr' ] = {
	// ARIA description.
	editor: 'ХТМЛ уређивач текста',
	editorPanel: 'ХТМЛ уређивач панел',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'За помоћ притисните АЛТ 0',

		browseServer: 'Претражи на серверу',
		url: 'УРЛ',
		protocol: 'Протокол',
		upload: 'Пошаљи',
		uploadSubmit: 'Пошаљи на сервер',
		image: 'Слика',
		flash: 'Флеш елемент',
		form: 'Формулар',
		checkbox: 'Поље за потврду',
		radio: 'Радио-дугме',
		textField: 'Текстуално поље',
		textarea: 'Зона текста',
		hiddenField: 'Скривено поље',
		button: 'Дугме',
		select: 'Падајућа листа',
		imageButton: 'Дугме са сликом',
		notSet: '<није постављено>',
		id: 'Ид',
		name: 'Назив',
		langDir: 'Смер писања',
		langDirLtr: 'С лева на десно (LTR)',
		langDirRtl: 'С десна на лево (RTL)',
		langCode: 'Kôд језика',
		longDescr: 'Пун опис УРЛ',
		cssClass: 'ЦСС класе',
		advisoryTitle: 'Advisory наслов',
		cssStyle: 'Стил',
		ok: 'OK',
		cancel: 'Oткажи',
		close: 'Затвори',
		preview: 'Изглед странице',
		resize: 'Промена величине',
		generalTab: 'Општи',
		advancedTab: 'Далје опције',
		validateNumberFailed: 'Ова вредност није број.',
		confirmNewPage: 'Несачуване промене овог садржаја ће бити изгублјене. Јесте ли сигурни да желите да учитате нову страну',
		confirmCancel: 'Нека подешавања су променјена. Сигурмо желите затворити обај прозор?',
		options: 'Подешавања',
		target: 'Циљ',
		targetNew: 'Ноби прозор (_blank)',
		targetTop: 'Прозор на врху странице (_top)',
		targetSelf: 'Исти прозор (_self)',
		targetParent: 'Матични прозор(_parent)',
		langDirLTR: 'С лева на десно (LTR)',
		langDirRTL: 'С десна на лево (RTL)',
		styles: 'Стил',
		cssClasses: 'ЦСС класе',
		width: 'Ширина',
		height: 'Висина',
		align: 'Равнање',
		left: 'Лево',
		right: 'Десно',
		center: 'Средина',
		justify: 'Обострано равнање',
		alignLeft: 'Лево равнање',
		alignRight: 'Десно равнање',
		alignCenter: 'Централно равнанје',
		alignTop: 'Врх',
		alignMiddle: 'Средина',
		alignBottom: 'Доле',
		alignNone: 'Ништа',
		invalidValue: 'Неважећа вредност.',
		invalidHeight: 'У поље висина могу се уписати само бројеви.',
		invalidWidth: 'У поље ширина могу се уписати само бројеви.',
		invalidLength: 'У "%1" полју дата вредност треба да будепозитиван број са валидном мерном јединицом или без ње (%2).',
		invalidCssLength: 'За "%1" дата вредност мора бити позитиван број, могуће означити са валидним ЦСС вредошћу (px, %, in, cm, mm, em, ex, pt, or pc).',
		invalidHtmlLength: 'Зa "%1" дата вредност мора бити позитиван број, могуће означити са валидним ХТМЛ вредношћу (px or %).',
		invalidInlineStyle: 'Вреднодст у инлине стилу мора да садржи барем један рекорд у формату "name : value", раздељени са тачказапетом.',
		cssLengthTooltip: 'Одредите број у пикселима или у валидним ЦСС вредностима (px, %, in, cm, mm, em, ex, pt, or pc).',

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
		keyboardShortcut: 'Tастер за пречицу',

		optionDefault: 'Основни'
	}
};
