/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Tatar language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'tt' ] = {
	// ARIA description.
	editor: 'Форматлаулы текст өлкәсе',
	editorPanel: 'Rich Text Editor panel', // MISSING

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Ярдәм өчен ALT 0 басыгыз',

		browseServer: 'Сервер карап чыгу',
		url: 'Сылталама',
		protocol: 'Протокол',
		upload: 'Йөкләү',
		uploadSubmit: 'Серверга җибәрү',
		image: 'Рәсем',
		flash: 'Флеш',
		form: 'Форма',
		checkbox: 'Чекбокс',
		radio: 'Радио төймә',
		textField: 'Текст кыры',
		textarea: 'Текст мәйданы',
		hiddenField: 'Яшерен кыр',
		button: 'Төймə',
		select: 'Сайлау кыры',
		imageButton: 'Рәсемле төймə',
		notSet: '<билгеләнмәгән>',
		id: 'Id',
		name: 'Исем',
		langDir: 'Язылыш юнəлеше',
		langDirLtr: 'Сулдан уңга язылыш (LTR)',
		langDirRtl: 'Уңнан сулга язылыш (RTL)',
		langCode: 'Тел коды',
		longDescr: 'Җентекле тасвирламага сылталама',
		cssClass: 'Стильләр класслары',
		advisoryTitle: 'Киңәш исем',
		cssStyle: 'Стиль',
		ok: 'Тәмам',
		cancel: 'Баш тарту',
		close: 'Чыгу',
		preview: 'Карап алу',
		resize: 'Зурлыкны үзгәртү',
		generalTab: 'Төп',
		advancedTab: 'Киңәйтелгән көйләүләр',
		validateNumberFailed: 'Әлеге кыйммәт сан түгел',
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?', // MISSING
		confirmCancel: 'You have changed some options. Are you sure you want to close the dialog window?', // MISSING
		options: 'Үзлекләр',
		target: 'Максат',
		targetNew: 'Яңа тәрәзә (_blank)',
		targetTop: 'Өске тәрәзә (_top)',
		targetSelf: 'Шул үк тәрәзә (_self)',
		targetParent: 'Ана тәрәзә (_parent)',
		langDirLTR: 'Сулдан уңга язылыш (LTR)',
		langDirRTL: 'Уңнан сулга язылыш (RTL)',
		styles: 'Стиль',
		cssClasses: 'Стильләр класслары',
		width: 'Киңлек',
		height: 'Биеклек',
		align: 'Тигезләү',
		alignLeft: 'Сул якка',
		alignRight: 'Уң якка',
		alignCenter: 'Үзәккә',
		alignJustify: 'Киңлеккә карап тигезләү',
		alignTop: 'Өскә',
		alignMiddle: 'Уртага',
		alignBottom: 'Аска',
		alignNone: 'None', // MISSING
		invalidValue	: 'Дөрес булмаган кыйммәт',
		invalidHeight: 'Биеклек сан булырга тиеш',
		invalidWidth: 'Киңлек сан булырга тиеш',
		invalidCssLength: 'Value specified for the "%1" field must be a positive number with or without a valid CSS measurement unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING
		invalidHtmlLength: 'Value specified for the "%1" field must be a positive number with or without a valid HTML measurement unit (px or %).', // MISSING
		invalidInlineStyle: 'Value specified for the inline style must consist of one or more tuples with the format of "name : value", separated by semi-colons.', // MISSING
		cssLengthTooltip: 'Enter a number for a value in pixels or a number with a valid CSS unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, unavailable</span>' // MISSING
	}
};
