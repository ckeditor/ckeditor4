/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
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
	// ARIA description.
	editor: 'محرر النص الغني',
	editorPanel: 'لائحة محرر النص المنسق',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'إضغط على ALT + 0 للحصول على المساعدة.',

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
		name: 'إسم',
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
		resize: 'تغيير الحجم',
		generalTab: 'عام',
		advancedTab: 'متقدم',
		validateNumberFailed: 'لايوجد نتيجة',
		confirmNewPage: 'ستفقد أي متغييرات اذا لم تقم بحفظها اولا. هل أنت متأكد أنك تريد صفحة جديدة؟',
		confirmCancel: 'بعض الخيارات قد تغيرت. هل أنت متأكد من إغلاق مربع النص؟',
		options: 'خيارات',
		target: 'هدف الرابط',
		targetNew: 'نافذة جديدة',
		targetTop: 'النافذة الأعلى',
		targetSelf: 'داخل النافذة',
		targetParent: 'النافذة الأم',
		langDirLTR: 'اليسار لليمين (LTR)',
		langDirRTL: 'اليمين لليسار (RTL)',
		styles: 'نمط',
		cssClasses: 'فئات التنسيق',
		width: 'العرض',
		height: 'الإرتفاع',
		align: 'محاذاة',
		left: 'يسار',
		right: 'يمين',
		center: 'وسط',
		justify: 'ضبط',
		alignLeft: 'محاذاة إلى اليسار',
		alignRight: 'محاذاة إلى اليمين',
		alignCenter: 'Align Center', // MISSING
		alignTop: 'أعلى',
		alignMiddle: 'وسط',
		alignBottom: 'أسفل',
		alignNone: 'None', // MISSING
		invalidValue: 'قيمة غير مفبولة.',
		invalidHeight: 'الارتفاع يجب أن يكون عدداً.',
		invalidWidth: 'العرض يجب أن يكون عدداً.',
		invalidLength: 'Value specified for the "%1" field must be a positive number with or without a valid measurement unit (%2).', // MISSING
		invalidCssLength: 'قيمة الخانة المخصصة لـ "%1" يجب أن تكون رقما موجبا، باستخدام أو من غير استخدام وحدة CSS قياس مقبولة (px, %, in, cm, mm, em, ex, pt, or pc).',
		invalidHtmlLength: 'قيمة الخانة المخصصة لـ "%1" يجب أن تكون رقما موجبا، باستخدام أو من غير استخدام وحدة HTML قياس مقبولة (px or %).',
		invalidInlineStyle: 'قيمة الخانة المخصصة لـ  Inline Style يجب أن تختوي على مجموع واحد أو أكثر بالشكل التالي: "name : value", مفصولة بفاصلة منقزطة.',
		cssLengthTooltip: 'أدخل رقما للقيمة بالبكسل أو رقما بوحدة CSS مقبولة (px, %, in, cm, mm, em, ex, pt, or pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, غير متاح</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Backspace', // MISSING
			13: 'Enter', // MISSING
			16: 'Shift', // MISSING
			17: 'Ctrl', // MISSING
			18: 'Alt', // MISSING
			32: 'Space', // MISSING
			35: 'End', // MISSING
			36: 'Home', // MISSING
			46: 'Delete', // MISSING
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
