/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
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
 * Constains the dictionary of language entries.
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

	/*
	 * Screenreader titles. Please note that screenreaders are not always capable
	 * of reading non-English words. So be careful while translating it.
	 */
	editorTitle: 'Rich text editor, %1', // MISSING

	// Toolbar buttons without dialogs.
	source: 'شفرة المصدر',
	newPage: 'صفحة جديدة',
	save: 'حفظ',
	preview: 'معاينة الصفحة',
	cut: 'قص',
	copy: 'نسخ',
	paste: 'لصق',
	print: 'طباعة',
	underline: 'تسطير',
	bold: 'غامق',
	italic: 'مائل',
	selectAll: 'تحديد الكل',
	removeFormat: 'إزالة التنسيقات',
	strike: 'يتوسطه خط',
	subscript: 'منخفض',
	superscript: 'مرتفع',
	horizontalrule: 'إدراج خط فاصل',
	pagebreak: 'إدخال صفحة جديدة',
	unlink: 'إزالة رابط',
	undo: 'تراجع',
	redo: 'إعادة',

	// Common messages and labels.
	common: {
		browseServer: 'تصفح الخادم',
		url: 'موقع الصورة',
		protocol: 'البروتوكول',
		upload: 'رفع',
		uploadSubmit: 'أرسلها للخادم',
		image: 'صورة',
		flash: 'فلاش',
		form: 'نموذج',
		checkbox: 'خانة إختيار',
		radio: 'زر خيار',
		textField: 'مربع نص',
		textarea: 'ناحية نص',
		hiddenField: 'إدراج حقل خفي',
		button: 'زر ضغط',
		select: 'قائمة منسدلة',
		imageButton: 'زر صورة',
		notSet: '<بدون تحديد>',
		id: 'الرقم',
		name: 'الاسم',
		langDir: 'إتجاه النص',
		langDirLtr: 'اليسار لليمين (LTR)',
		langDirRtl: 'اليمين لليسار (RTL)',
		langCode: 'رمز اللغة',
		longDescr: 'عنوان الوصف المفصّل',
		cssClass: 'فئات التنسيق',
		advisoryTitle: 'تلميح الشاشة',
		cssStyle: 'نمط',
		ok: 'موافق',
		cancel: 'إلغاء الأمر',
		generalTab: 'عام',
		advancedTab: 'متقدم',
		validateNumberFailed: 'This value is not a number.', // MISSING
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?', // MISSING
		confirmCancel: 'Some of the options have been changed. Are you sure to close the dialog?' // MISSING
	},

	// Special char dialog.
	specialChar: {
		toolbar: 'إدراج  رموز..ِ',
		title: 'إدراج رمز'
	},

	// Link dialog.
	link: {
		toolbar: 'إدراج/تحرير رابط', // IE6 BUG: A title called "Link" in an <A> tag would invalidate its padding!!
		menu: 'تحرير رابط',
		title: 'إرتباط تشعبي',
		info: 'معلومات الرابط',
		target: 'الهدف',
		upload: 'رفع',
		advanced: 'متقدم',
		type: 'نوع الربط',
		toAnchor: 'مكان في هذا المستند',
		toEmail: 'بريد إلكتروني',
		target: 'الهدف',
		targetNotSet: '<بدون تحديد>',
		targetFrame: '<إطار>',
		targetPopup: '<نافذة منبثقة>',
		targetNew: 'إطار جديد (_blank)',
		targetTop: 'صفحة كاملة (_top)',
		targetSelf: 'نفس الإطار (_self)',
		targetParent: 'الإطار الأصل (_parent)',
		targetFrameName: 'اسم الإطار الهدف',
		targetPopupName: 'تسمية النافذة المنبثقة',
		popupFeatures: 'خصائص النافذة المنبثقة',
		popupResizable: 'Resizable', // MISSING
		popupStatusBar: 'شريط الحالة السفلي',
		popupLocationBar: 'شريط العنوان',
		popupToolbar: 'شريط الأدوات',
		popupMenuBar: 'القوائم الرئيسية',
		popupFullScreen: 'ملئ الشاشة (IE)',
		popupScrollBars: 'أشرطة التمرير',
		popupDependent: 'تابع (Netscape)',
		popupWidth: 'العرض',
		popupLeft: 'التمركز لليسار',
		popupHeight: 'الإرتفاع',
		popupTop: 'التمركز للأعلى',
		id: 'Id', // MISSING
		langDir: 'إتجاه النص',
		langDirNotSet: '<بدون تحديد>',
		langDirLTR: 'اليسار لليمين (LTR)',
		langDirRTL: 'اليمين لليسار (RTL)',
		acccessKey: 'مفاتيح الإختصار',
		name: 'الاسم',
		langCode: 'إتجاه النص',
		tabIndex: 'الترتيب',
		advisoryTitle: 'تلميح الشاشة',
		advisoryContentType: 'نوع التلميح',
		cssClasses: 'فئات التنسيق',
		charset: 'ترميز المادة المطلوبة',
		styles: 'نمط',
		selectAnchor: 'اختر علامة مرجعية',
		anchorName: 'حسب اسم العلامة',
		anchorId: 'حسب تعريف العنصر',
		emailAddress: 'عنوان بريد إلكتروني',
		emailSubject: 'موضوع الرسالة',
		emailBody: 'محتوى الرسالة',
		noAnchors: '(لا يوجد علامات مرجعية في هذا المستند)',
		noUrl: 'فضلاً أدخل عنوان الموقع الذي يشير إليه الرابط',
		noEmail: 'فضلاً أدخل عنوان البريد الإلكتروني'
	},

	// Anchor dialog
	anchor: {
		toolbar: 'إدراج/تحرير إشارة مرجعية',
		menu: 'خصائص الإشارة المرجعية',
		title: 'خصائص الإشارة المرجعية',
		name: 'اسم الإشارة المرجعية',
		errorName: 'الرجاء كتابة اسم الإشارة المرجعية'
	},

	// Find And Replace Dialog
	findAndReplace: {
		title: 'بحث واستبدال',
		find: 'بحث',
		replace: 'إستبدال',
		findWhat: 'البحث عن:',
		replaceWith: 'إستبدال بـ:',
		notFoundMsg: 'لم يتم العثور على النص المحدد.',
		matchCase: 'مطابقة حالة الأحرف',
		matchWord: 'الكلمة بالكامل فقط',
		matchCyclic: 'Match cyclic', // MISSING
		replaceAll: 'إستبدال الكل',
		replaceSuccessMsg: '%1 occurrence(s) replaced.' // MISSING
	},

	// Table Dialog
	table: {
		toolbar: 'جدول',
		title: 'إدراج جدول',
		menu: 'إدراج جدول',
		deleteTable: 'حذف الجدول',
		rows: 'صفوف',
		columns: 'أعمدة',
		border: 'سمك الحدود',
		align: 'المحاذاة',
		alignNotSet: '<بدون تحديد>',
		alignLeft: 'يسار',
		alignCenter: 'وسط',
		alignRight: 'يمين',
		width: 'العرض',
		widthPx: 'بكسل',
		widthPc: 'بالمئة',
		height: 'الإرتفاع',
		cellSpace: 'تباعد الخلايا',
		cellPad: 'المسافة البادئة',
		caption: 'الوصف',
		summary: 'الخلاصة',
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
			menu: 'خلية',
			insertBefore: 'إدراج خلية قبل',
			insertAfter: 'إدراج خلية بعد',
			deleteCell: 'حذف خلايا',
			merge: 'دمج خلايا',
			mergeRight: 'دمج لليمين',
			mergeDown: 'دمج للأسفل',
			splitHorizontal: 'تقسيم الخلية أفقياً',
			splitVertical: 'تقسيم الخلية عمودياً',
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
			menu: 'صف',
			insertBefore: 'إدراج صف قبل',
			insertAfter: 'إدراج صف بعد',
			deleteRow: 'حذف صفوف'
		},

		column: {
			menu: 'عمود',
			insertBefore: 'إدراج عمود قبل',
			insertAfter: 'إدراج عمود بعد',
			deleteColumn: 'حذف أعمدة'
		}
	},

	// Button Dialog.
	button: {
		title: 'خصائص زر الضغط',
		text: 'القيمة/التسمية',
		type: 'نوع الزر',
		typeBtn: 'زر',
		typeSbm: 'إرسال',
		typeRst: 'إعادة تعيين'
	},

	// Checkbox and Radio Button Dialogs.
	checkboxAndRadio: {
		checkboxTitle: 'خصائص خانة الإختيار',
		radioTitle: 'خصائص زر الخيار',
		value: 'القيمة',
		selected: 'محدد'
	},

	// Form Dialog.
	form: {
		title: 'خصائص النموذج',
		menu: 'خصائص النموذج',
		action: 'اسم الملف',
		method: 'الأسلوب',
		encoding: 'Encoding', // MISSING
		target: 'الهدف',
		targetNotSet: '<بدون تحديد>',
		targetNew: 'إطار جديد (_blank)',
		targetTop: 'صفحة كاملة (_top)',
		targetSelf: 'نفس الإطار (_self)',
		targetParent: 'الإطار الأصل (_parent)'
	},

	// Select Field Dialog.
	select: {
		title: 'خصائص القائمة المنسدلة',
		selectInfo: 'معلومات',
		opAvail: 'الخيارات المتاحة',
		value: 'القيمة',
		size: 'الحجم',
		lines: 'الأسطر',
		chkMulti: 'السماح بتحديدات متعددة',
		opText: 'النص',
		opValue: 'القيمة',
		btnAdd: 'إضافة',
		btnModify: 'تعديل',
		btnUp: 'تحريك لأعلى',
		btnDown: 'تحريك لأسفل',
		btnSetValue: 'إجعلها محددة',
		btnDelete: 'إزالة'
	},

	// Textarea Dialog.
	textarea: {
		title: 'خصائص ناحية النص',
		cols: 'الأعمدة',
		rows: 'الصفوف'
	},

	// Text Field Dialog.
	textfield: {
		title: 'خصائص مربع النص',
		name: 'الاسم',
		value: 'القيمة',
		charWidth: 'العرض بالأحرف',
		maxChars: 'عدد الحروف الأقصى',
		type: 'نوع المحتوى',
		typeText: 'نص',
		typePass: 'كلمة مرور'
	},

	// Hidden Field Dialog.
	hidden: {
		title: 'خصائص الحقل الخفي',
		name: 'الاسم',
		value: 'القيمة'
	},

	// Image Dialog.
	image: {
		title: 'خصائص الصورة',
		titleButton: 'خصائص زر الصورة',
		menu: 'خصائص الصورة',
		infoTab: 'معلومات الصورة',
		btnUpload: 'أرسلها للخادم',
		url: 'موقع الصورة',
		upload: 'رفع',
		alt: 'الوصف',
		width: 'العرض',
		height: 'الإرتفاع',
		lockRatio: 'تناسق الحجم',
		resetSize: 'إستعادة الحجم الأصلي',
		border: 'سمك الحدود',
		hSpace: 'تباعد أفقي',
		vSpace: 'تباعد عمودي',
		align: 'محاذاة',
		alignLeft: 'يسار',
		alignAbsBottom: 'أسفل النص',
		alignAbsMiddle: 'وسط السطر',
		alignBaseline: 'على السطر',
		alignBottom: 'أسفل',
		alignMiddle: 'وسط',
		alignRight: 'يمين',
		alignTextTop: 'أعلى النص',
		alignTop: 'أعلى',
		preview: 'معاينة',
		alertUrl: 'فضلاً أكتب الموقع الذي توجد عليه هذه الصورة.',
		linkTab: 'الرابط',
		button2Img: 'Do you want to transform the selected image button on a simple image?', // MISSING
		img2Button: 'Do you want to transform the selected image on a image button?' // MISSING
	},

	// Flash Dialog
	flash: {
		properties: 'خصائص فيلم الفلاش',
		propertiesTab: 'Properties', // MISSING
		title: 'خصائص فيلم الفلاش',
		chkPlay: 'تشغيل تلقائي',
		chkLoop: 'تكرار',
		chkMenu: 'تمكين قائمة فيلم الفلاش',
		chkFull: 'Allow Fullscreen', // MISSING
		scale: 'الحجم',
		scaleAll: 'إظهار الكل',
		scaleNoBorder: 'بلا حدود',
		scaleFit: 'ضبط تام',
		access: 'Script Access', // MISSING
		accessAlways: 'Always', // MISSING
		accessSameDomain: 'Same domain', // MISSING
		accessNever: 'Never', // MISSING
		align: 'محاذاة',
		alignLeft: 'يسار',
		alignAbsBottom: 'أسفل النص',
		alignAbsMiddle: 'وسط السطر',
		alignBaseline: 'على السطر',
		alignBottom: 'أسفل',
		alignMiddle: 'وسط',
		alignRight: 'يمين',
		alignTextTop: 'أعلى النص',
		alignTop: 'أعلى',
		quality: 'Quality', // MISSING
		windowMode: 'Window mode', // MISSING
		flashvars: 'Variables for Flash', // MISSING
		bgcolor: 'لون الخلفية',
		width: 'العرض',
		height: 'الإرتفاع',
		hSpace: 'تباعد أفقي',
		vSpace: 'تباعد عمودي',
		validateSrc: 'فضلاً أدخل عنوان الموقع الذي يشير إليه الرابط',
		validateWidth: 'Width must be a number.', // MISSING
		validateHeight: 'Height must be a number.', // MISSING
		validateHSpace: 'HSpace must be a number.', // MISSING
		validateVSpace: 'VSpace must be a number.' // MISSING
	},

	// Speller Pages Dialog
	spellCheck: {
		toolbar: 'تدقيق إملائي',
		title: 'Spell Check', // MISSING
		notAvailable: 'Sorry, but service is unavailable now.', // MISSING
		errorLoading: 'Error loading application service host: %s.', // MISSING
		notInDic: 'ليست في القاموس',
		changeTo: 'التغيير إلى',
		btnIgnore: 'تجاهل',
		btnIgnoreAll: 'تجاهل الكل',
		btnReplace: 'تغيير',
		btnReplaceAll: 'تغيير الكل',
		btnUndo: 'تراجع',
		noSuggestions: '- لا توجد إقتراحات -',
		progress: 'جاري التدقيق إملائياً',
		noMispell: 'تم إكمال التدقيق الإملائي: لم يتم العثور على أي أخطاء إملائية',
		noChanges: 'تم إكمال التدقيق الإملائي: لم يتم تغيير أي كلمة',
		oneChange: 'تم إكمال التدقيق الإملائي: تم تغيير كلمة واحدة فقط',
		manyChanges: 'تم إكمال التدقيق الإملائي: تم تغيير %1 كلماتكلمة',
		ieSpellDownload: 'المدقق الإملائي (الإنجليزي) غير مثبّت. هل تود تحميله الآن؟'
	},

	smiley: {
		toolbar: 'ابتسامات',
		title: 'إدراج إبتسامات '
	},

	elementsPath: {
		eleTitle: '%1 element' // MISSING
	},

	numberedlist: 'تعداد رقمي',
	bulletedlist: 'تعداد نقطي',
	indent: 'زيادة المسافة البادئة',
	outdent: 'إنقاص المسافة البادئة',

	justify: {
		left: 'محاذاة إلى اليسار',
		center: 'توسيط',
		right: 'محاذاة إلى اليمين',
		block: 'ضبط'
	},

	blockquote: 'اقتباس',

	clipboard: {
		title: 'لصق',
		cutError: 'الإعدادات الأمنية للمتصفح الذي تستخدمه تمنع القص التلقائي. فضلاً إستخدم لوحة المفاتيح لفعل ذلك (Ctrl+X).',
		copyError: 'الإعدادات الأمنية للمتصفح الذي تستخدمه تمنع النسخ التلقائي. فضلاً إستخدم لوحة المفاتيح لفعل ذلك (Ctrl+C).',
		pasteMsg: 'الصق داخل الصندوق بإستخدام زرّي (<STRONG>Ctrl+V</STRONG>) في لوحة المفاتيح، ثم اضغط زر  <STRONG>موافق</STRONG>.',
		securityMsg: 'نظراً لإعدادات الأمان الخاصة بمتصفحك، لن يتمكن هذا المحرر من الوصول لمحتوى حافظتك، لذا وجب عليك لصق المحتوى مرة أخرى في هذه النافذة.'
	},

	pastefromword: {
		toolbar: 'لصق من وورد',
		title: 'لصق من وورد',
		advice: 'الصق داخل الصندوق بإستخدام زرّي (<STRONG>Ctrl+V</STRONG>) في لوحة المفاتيح، ثم اضغط زر  <STRONG>موافق</STRONG>.',
		ignoreFontFace: 'تجاهل تعريفات أسماء الخطوط',
		removeStyle: 'إزالة تعريفات الأنماط'
	},

	pasteText: {
		button: 'لصق كنص بسيط',
		title: 'لصق كنص بسيط'
	},

	templates: {
		button: 'القوالب',
		title: 'قوالب المحتوى',
		insertOption: 'استبدال المحتوى',
		selectPromptMsg: 'اختر القالب الذي تود وضعه في المحرر <br>(سيتم فقدان المحتوى الحالي):',
		emptyListMsg: '(لم يتم تعريف أي قالب)'
	},

	showBlocks: 'مخطط تفصيلي',

	stylesCombo: {
		label: 'نمط',
		voiceLabel: 'Styles', // MISSING
		panelVoiceLabel: 'Select a style', // MISSING
		panelTitle1: 'Block Styles', // MISSING
		panelTitle2: 'Inline Styles', // MISSING
		panelTitle3: 'Object Styles' // MISSING
	},

	format: {
		label: 'تنسيق',
		voiceLabel: 'Format', // MISSING
		panelTitle: 'تنسيق',
		panelVoiceLabel: 'Select a paragraph format', // MISSING

		tag_p: 'عادي',
		tag_pre: 'منسّق',
		tag_address: 'دوس',
		tag_h1: 'العنوان 1',
		tag_h2: 'العنوان  2',
		tag_h3: 'العنوان  3',
		tag_h4: 'العنوان  4',
		tag_h5: 'العنوان  5',
		tag_h6: 'العنوان  6',
		tag_div: 'Normal (DIV)' // MISSING
	},

	font: {
		label: 'خط',
		voiceLabel: 'Font', // MISSING
		panelTitle: 'خط',
		panelVoiceLabel: 'Select a font' // MISSING
	},

	fontSize: {
		label: 'حجم الخط',
		voiceLabel: 'Font Size', // MISSING
		panelTitle: 'حجم الخط',
		panelVoiceLabel: 'Select a font size' // MISSING
	},

	colorButton: {
		textColorTitle: 'لون النص',
		bgColorTitle: 'لون الخلفية',
		auto: 'تلقائي',
		more: 'ألوان إضافية...'
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
		moreInfo: 'For licensing information please visit our web site:', // MISSING
		copy: 'Copyright &copy; $1. All rights reserved.' // MISSING
	},

	maximize: 'Maximize' // MISSING
};
