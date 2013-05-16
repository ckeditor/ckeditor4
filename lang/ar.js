/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Arabic language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'ar' ] = {
	/**
	 * The language reading direction. Possible values are "rtl" for
	 * Right-To-Left languages (like Arabic) and "ltr" for Left-To-Right
	 * languages (like English).
	 * @default 'ltr'
	 */
	dir: 'rtl',

	// ARIA description.
	editor: 'Rich Text Editor', // MISSING

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Press ALT 0 for help', // MISSING

		browseServer: 'تصفح',
		url: 'الرابط',
		protocol: 'البروتوكول',
		upload: 'رفع',
		uploadSubmit: 'أرسل',
		image: 'صورة',
		flash: 'فلاش',
		form: 'نموذج',
		checkbox: 'خانة إختيار',
		radio: 'زر اختيار',
		textField: 'مربع نص',
		textarea: 'مساحة نصية',
		hiddenField: 'إدراج حقل خفي',
		button: 'زر ضغط',
		select: 'اختار',
		imageButton: 'زر صورة',
		notSet: '<بدون تحديد>',
		id: 'الرقم',
		name: 'الاسم',
		langDir: 'إتجاه النص',
		langDirLtr: 'اليسار لليمين (LTR)',
		langDirRtl: 'اليمين لليسار (RTL)',
		langCode: 'رمز اللغة',
		longDescr: 'الوصف التفصيلى',
		cssClass: 'فئات التنسيق',
		advisoryTitle: 'عنوان التقرير',
		cssStyle: 'نمط',
		ok: 'موافق',
		cancel: 'إلغاء الأمر',
		close: 'أغلق',
		preview: 'استعراض',
		resize: 'اسحب لتغيير الحجم',
		generalTab: 'عام',
		advancedTab: 'متقدم',
		validateNumberFailed: 'لايوجد نتيجة',
		confirmNewPage: 'ستفقد أي متغييرات اذا لم تقم بحفظها اولا. هل أنت متأكد أنك تريد صفحة جديدة؟',
		confirmCancel: 'بعض الخيارات قد تغيرت. هل أنت متأكد من إغلاق مربع النص؟',
		options: 'خيارات',
		target: 'هدف الرابط',
		targetNew: 'New Window (_blank)', // MISSING
		targetTop: 'Topmost Window (_top)', // MISSING
		targetSelf: 'Same Window (_self)', // MISSING
		targetParent: 'Parent Window (_parent)', // MISSING
		langDirLTR: 'اليسار لليمين (LTR)',
		langDirRTL: 'اليمين لليسار (RTL)',
		styles: 'نمط',
		cssClasses: 'فئات التنسيق',
		width: 'العرض',
		height: 'الإرتفاع',
		align: 'محاذاة',
		alignLeft: 'يسار',
		alignRight: 'يمين',
		alignCenter: 'وسط',
		alignTop: 'أعلى',
		alignMiddle: 'وسط',
		alignBottom: 'أسفل',
		invalidValue	: 'Invalid value.', // MISSING
		invalidHeight: 'الارتفاع يجب أن يكون عدداً.',
		invalidWidth: 'العرض يجب أن يكون عدداً.',
		invalidCssLength: 'Value specified for the "%1" field must be a positive number with or without a valid CSS measurement unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING
		invalidHtmlLength: 'Value specified for the "%1" field must be a positive number with or without a valid HTML measurement unit (px or %).', // MISSING
		invalidInlineStyle: 'Value specified for the inline style must consist of one or more tuples with the format of "name : value", separated by semi-colons.', // MISSING
		cssLengthTooltip: 'Enter a number for a value in pixels or a number with a valid CSS unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, غير متاح</span>'
	}
};
