/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object for the
 * Persian language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'fa' ] = {
	// ARIA description.
	editor: 'ویرایش‌گر متن غنی',
	editorPanel: 'پنل ویرایشگر متن غنی',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'کلید Alt+0 را برای راهنمایی بفشارید',

		browseServer: 'فهرست​نمایی سرور',
		url: 'URL',
		protocol: 'قرارداد',
		upload: 'بالاگذاری',
		uploadSubmit: 'به سرور بفرست',
		image: 'تصویر',
		form: 'فرم',
		checkbox: 'چک‌باکس',
		radio: 'دکمه‌ی رادیویی',
		textField: 'فیلد متنی',
		textarea: 'ناحیهٴ متنی',
		hiddenField: 'فیلد پنهان',
		button: 'دکمه',
		select: 'فیلد انتخاب چند گزینه​ای',
		imageButton: 'دکمه‌ی تصویری',
		notSet: '<تعیین‌نشده>',
		id: 'شناسه',
		name: 'نام',
		langDir: 'جهت زبان',
		langDirLtr: 'چپ به راست',
		langDirRtl: 'راست به چپ',
		langCode: 'کد زبان',
		longDescr: 'URL توصیف طولانی',
		cssClass: 'کلاس​های شیوه​نامه (Stylesheet)',
		advisoryTitle: 'عنوان کمکی',
		cssStyle: 'سبک',
		ok: 'پذیرش',
		cancel: 'انصراف',
		close: 'بستن',
		preview: 'پیش‌نمایش',
		resize: 'تغییر اندازه',
		generalTab: 'عمومی',
		advancedTab: 'پیش‌رفته',
		validateNumberFailed: 'این مقدار یک عدد نیست.',
		confirmNewPage: 'هر تغییر ایجاد شده​ی ذخیره نشده از بین خواهد رفت. آیا اطمینان دارید که قصد بارگیری صفحه جدیدی را دارید؟',
		confirmCancel: 'برخی از گزینه‌ها تغییر کرده‌اند. آیا واقعا قصد بستن این پنجره را دارید؟',
		options: 'گزینه​ها',
		target: 'مقصد',
		targetNew: 'پنجره جدید',
		targetTop: 'بالاترین پنجره',
		targetSelf: 'همان پنجره',
		targetParent: 'پنجره والد',
		langDirLTR: 'چپ به راست',
		langDirRTL: 'راست به چپ',
		styles: 'سبک',
		cssClasses: 'کلاس‌های سبک‌نامه',
		width: 'عرض',
		height: 'طول',
		align: 'چینش',
		left: 'چپ',
		right: 'راست',
		center: 'وسط',
		justify: 'بلوک چین',
		alignLeft: 'چپ چین',
		alignRight: 'راست چین',
		alignCenter: 'مرکز قرار بده',
		alignTop: 'بالا',
		alignMiddle: 'میانه',
		alignBottom: 'پائین',
		alignNone: 'هیچ',
		invalidValue: 'مقدار نامعتبر.',
		invalidHeight: 'ارتفاع باید یک عدد باشد.',
		invalidWidth: 'عرض باید یک عدد باشد.',
		invalidLength: 'عدد تعیین شده برای فیلد "%1" باید یک عدد مثبت با یا بدون یک واحد اندازه گیری معتبر ("%2") باشد.',
		invalidCssLength: 'عدد تعیین شده برای فیلد "%1" باید یک عدد مثبت با یا بدون یک واحد اندازه گیری CSS معتبر باشد (px, %, in, cm, mm, em, ex, pt, or pc).',
		invalidHtmlLength: 'عدد تعیین شده برای فیلد "%1" باید یک عدد مثبت با یا بدون یک واحد اندازه گیری HTML معتبر باشد (px or %).',
		invalidInlineStyle: 'عدد تعیین شده برای سبک درون​خطی -Inline Style- باید دارای یک یا چند چندتایی با شکلی شبیه "name : value" که باید با یک ";" از هم جدا شوند.',
		cssLengthTooltip: 'یک عدد برای یک مقدار بر حسب پیکسل و یا یک عدد با یک واحد CSS معتبر وارد کنید (px, %, in, cm, mm, em, ex, pt, or pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">، غیر قابل دسترس</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'عقبگرد',
			13: 'ورود',
			16: 'تعویض',
			17: 'کنترل',
			18: 'دگرساز',
			32: 'فاصله',
			35: 'پایان',
			36: 'خانه',
			46: 'حذف',
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
			224: 'فرمان'
		},

		// Prepended to ARIA labels with shortcuts.
		keyboardShortcut: 'میانبر صفحه کلید',

		optionDefault: 'پیش فرض'
	}
};
