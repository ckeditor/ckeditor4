/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
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
	/**
	 * The language reading direction. Possible values are "rtl" for
	 * Right-To-Left languages (like Arabic) and "ltr" for Left-To-Right
	 * languages (like English).
	 * @default 'ltr'
	 */
	dir: 'rtl',

	// ARIA description.
	editor: 'ویرایشگر متن غنی',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'کلید Alt+0 را برای راهنمایی بفشارید',

		browseServer: 'فهرست​نمایی سرور',
		url: 'URL',
		protocol: 'پروتکل',
		upload: 'انتقال به سرور',
		uploadSubmit: 'به سرور بفرست',
		image: 'تصویر',
		flash: 'فلش',
		form: 'فرم',
		checkbox: 'خانهٴ گزینه​ای',
		radio: 'دکمهٴ رادیویی',
		textField: 'فیلد متنی',
		textarea: 'ناحیهٴ متنی',
		hiddenField: 'فیلد پنهان',
		button: 'دکمه',
		select: 'فیلد چند گزینه​ای',
		imageButton: 'دکمهٴ تصویری',
		notSet: '<تعین نشده>',
		id: 'شناسه',
		name: 'نام',
		langDir: 'جهت​نمای زبان',
		langDirLtr: 'چپ به راست (LTR)',
		langDirRtl: 'راست به چپ (RTL)',
		langCode: 'کد زبان',
		longDescr: 'URL توصیف طولانی',
		cssClass: 'کلاس​های شیوه​نامه(Stylesheet)',
		advisoryTitle: 'عنوان کمکی',
		cssStyle: 'شیوه(style)',
		ok: 'پذیرش',
		cancel: 'انصراف',
		close: 'بستن',
		preview: 'پیش نمایش',
		resize: 'کشیدن برای تغییر اندازه',
		generalTab: 'عمومی',
		advancedTab: 'پیشرفته',
		validateNumberFailed: 'این مقدار یک عدد نیست.',
		confirmNewPage: 'هر تغییر ایجاد شده​ی ذخیره نشده از بین خواهد رفت. آیا اطمینان دارید که قصد بارگیری صفحه جدیدی را دارید؟',
		confirmCancel: 'برخی از گزینه​ها تغییر کردهاند. آیا واقعا قصد بستن این پنجره را دارید؟',
		options: 'گزینه​ها',
		target: 'مسیر',
		targetNew: 'پنجره جدید (_blank)',
		targetTop: 'بالاترین پنجره (_top)',
		targetSelf: 'همان پنجره (_self)',
		targetParent: 'پنجره والد (_parent)',
		langDirLTR: 'چپ به راست (LTR)',
		langDirRTL: 'راست به چپ (RTL)',
		styles: 'سبک',
		cssClasses: 'کلاس​های شیوه​نامه',
		width: 'پهنا',
		height: 'درازا',
		align: 'چینش',
		alignLeft: 'چپ',
		alignRight: 'راست',
		alignCenter: 'وسط',
		alignTop: 'بالا',
		alignMiddle: 'وسط',
		alignBottom: 'پائین',
		invalidValue	: 'مقدار نامعتبر',
		invalidHeight: 'ارتفاع باید یک عدد باشد.',
		invalidWidth: 'پهنا باید یک عدد باشد.',
		invalidCssLength: 'عدد تعیین شده برای فیلد "%1" باید یک عدد مثبت با یا بدون یک واحد اندازه گیری CSS معتبر باشد (px, %, in, cm, mm, em, ex, pt, or pc).',
		invalidHtmlLength: 'عدد تعیین شده برای فیلد "%1" باید یک عدد مثبت با یا بدون یک واحد اندازه گیری HTML معتبر باشد (px or %).',
		invalidInlineStyle: 'عدد تعیین شده برای سبک درون​خطی(Inline Style) باید دارای یک یا چند چندتایی با شکلی شبیه "name : value" که باید با یک ","(semi-colons) از هم جدا شوند.',
		cssLengthTooltip: 'یک عدد برای یک مقدار بر حسب پیکسل و یا یک عدد با یک واحد CSS معتبر وارد کنید (px, %, in, cm, mm, em, ex, pt, or pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">، غیر قابل دسترس</span>'
	}
};
