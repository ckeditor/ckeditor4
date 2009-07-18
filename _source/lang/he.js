/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Hebrew language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Constains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'he' ] = {
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
	source: 'מקור',
	newPage: 'דף חדש',
	save: 'שמירה',
	preview: 'תצוגה מקדימה',
	cut: 'גזירה',
	copy: 'העתקה',
	paste: 'הדבקה',
	print: 'הדפסה',
	underline: 'קו תחתון',
	bold: 'מודגש',
	italic: 'נטוי',
	selectAll: 'בחירת הכל',
	removeFormat: 'הסרת העיצוב',
	strike: 'כתיב מחוק',
	subscript: 'כתיב תחתון',
	superscript: 'כתיב עליון',
	horizontalrule: 'הוספת קו אופקי',
	pagebreak: 'הוסף שבירת דף',
	unlink: 'הסרת הקישור',
	undo: 'ביטול צעד אחרון',
	redo: 'חזרה על צעד אחרון',

	// Common messages and labels.
	common: {
		browseServer: 'סייר השרת',
		url: 'כתובת (URL)',
		protocol: 'פרוטוקול',
		upload: 'העלאה',
		uploadSubmit: 'שליחה לשרת',
		image: 'תמונה',
		flash: 'פלאש',
		form: 'טופס',
		checkbox: 'תיבת סימון',
		radio: 'לחצן אפשרויות',
		textField: 'שדה טקסט',
		textarea: 'איזור טקסט',
		hiddenField: 'שדה חבוי',
		button: 'כפתור',
		select: 'שדה בחירה',
		imageButton: 'כפתור תמונה',
		notSet: '<לא נקבע>',
		id: 'זיהוי (Id)',
		name: 'שם',
		langDir: 'כיוון שפה',
		langDirLtr: 'שמאל לימין (LTR)',
		langDirRtl: 'ימין לשמאל (RTL)',
		langCode: 'קוד שפה',
		longDescr: 'קישור לתיאור מפורט',
		cssClass: 'גיליונות עיצוב קבוצות',
		advisoryTitle: 'כותרת מוצעת',
		cssStyle: 'סגנון',
		ok: 'אישור',
		cancel: 'ביטול',
		generalTab: 'כללי',
		advancedTab: 'אפשרויות מתקדמות',
		validateNumberFailed: 'This value is not a number.', // MISSING
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?', // MISSING
		confirmCancel: 'Some of the options have been changed. Are you sure to close the dialog?', // MISSING

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, unavailable</span>' // MISSING
	},

	// Special char dialog.
	specialChar: {
		toolbar: 'הוספת תו מיוחד',
		title: 'בחירת תו מיוחד'
	},

	// Link dialog.
	link: {
		toolbar: 'הוספת/עריכת קישור',
		menu: 'עריכת קישור',
		title: 'קישור',
		info: 'מידע על הקישור',
		target: 'מטרה',
		upload: 'העלאה',
		advanced: 'אפשרויות מתקדמות',
		type: 'סוג קישור',
		toAnchor: 'עוגן בעמוד זה',
		toEmail: 'דוא\'\'ל',
		target: 'מטרה',
		targetNotSet: '<לא נקבע>',
		targetFrame: '<מסגרת>',
		targetPopup: '<חלון קופץ>',
		targetNew: 'חלון חדש (_blank)',
		targetTop: 'חלון ראשי (_top)',
		targetSelf: 'באותו החלון (_self)',
		targetParent: 'חלון האב (_parent)',
		targetFrameName: 'שם מסגרת היעד',
		targetPopupName: 'שם החלון הקופץ',
		popupFeatures: 'תכונות החלון הקופץ',
		popupResizable: 'Resizable', // MISSING
		popupStatusBar: 'סרגל חיווי',
		popupLocationBar: 'סרגל כתובת',
		popupToolbar: 'סרגל הכלים',
		popupMenuBar: 'סרגל תפריט',
		popupFullScreen: 'מסך מלא (IE)',
		popupScrollBars: 'ניתן לגלילה',
		popupDependent: 'תלוי (Netscape)',
		popupWidth: 'רוחב',
		popupLeft: 'מיקום צד שמאל',
		popupHeight: 'גובה',
		popupTop: 'מיקום צד עליון',
		id: 'Id', // MISSING
		langDir: 'כיוון שפה',
		langDirNotSet: '<לא נקבע>',
		langDirLTR: 'שמאל לימין (LTR)',
		langDirRTL: 'ימין לשמאל (RTL)',
		acccessKey: 'מקש גישה',
		name: 'שם',
		langCode: 'כיוון שפה',
		tabIndex: 'מספר טאב',
		advisoryTitle: 'כותרת מוצעת',
		advisoryContentType: 'Content Type מוצע',
		cssClasses: 'גיליונות עיצוב קבוצות',
		charset: 'קידוד המשאב המקושר',
		styles: 'סגנון',
		selectAnchor: 'בחירת עוגן',
		anchorName: 'עפ\'\'י שם העוגן',
		anchorId: 'עפ\'\'י זיהוי (Id) הרכיב',
		emailAddress: 'כתובת הדוא\'\'ל',
		emailSubject: 'נושא ההודעה',
		emailBody: 'גוף ההודעה',
		noAnchors: '(אין עוגנים זמינים בדף)',
		noUrl: 'נא להקליד את כתובת הקישור (URL)',
		noEmail: 'נא להקליד את כתובת הדוא\'\'ל'
	},

	// Anchor dialog
	anchor: {
		toolbar: 'הוספת/עריכת נקודת עיגון',
		menu: 'מאפייני נקודת עיגון',
		title: 'מאפייני נקודת עיגון',
		name: 'שם לנקודת עיגון',
		errorName: 'אנא הזן שם לנקודת עיגון'
	},

	// Find And Replace Dialog
	findAndReplace: {
		title: 'חפש והחלף',
		find: 'חיפוש',
		replace: 'החלפה',
		findWhat: 'חיפוש מחרוזת:',
		replaceWith: 'החלפה במחרוזת:',
		notFoundMsg: 'הטקסט המבוקש לא נמצא.',
		matchCase: 'התאמת סוג אותיות (Case)',
		matchWord: 'התאמה למילה המלאה',
		matchCyclic: 'Match cyclic', // MISSING
		replaceAll: 'החלפה בכל העמוד',
		replaceSuccessMsg: '%1 occurrence(s) replaced.' // MISSING
	},

	// Table Dialog
	table: {
		toolbar: 'טבלה',
		title: 'תכונות טבלה',
		menu: 'תכונות טבלה',
		deleteTable: 'מחק טבלה',
		rows: 'שורות',
		columns: 'עמודות',
		border: 'גודל מסגרת',
		align: 'יישור',
		alignNotSet: '<לא נקבע>',
		alignLeft: 'שמאל',
		alignCenter: 'מרכז',
		alignRight: 'ימין',
		width: 'רוחב',
		widthPx: 'פיקסלים',
		widthPc: 'אחוז',
		height: 'גובה',
		cellSpace: 'מרווח תא',
		cellPad: 'ריפוד תא',
		caption: 'כיתוב',
		summary: 'סיכום',
		headers: 'כותרות',
		headersNone: 'אין',
		headersColumn: 'עמודה ראשונה',
		headersRow: 'שורה ראשונה',
		headersBoth: 'שניהם',
		invalidRows: 'Number of rows must be a number greater than 0.', // MISSING
		invalidCols: 'Number of columns must be a number greater than 0.', // MISSING
		invalidBorder: 'Border size must be a number.', // MISSING
		invalidWidth: 'Table width must be a number.', // MISSING
		invalidHeight: 'Table height must be a number.', // MISSING
		invalidCellSpacing: 'Cell spacing must be a number.', // MISSING
		invalidCellPadding: 'Cell padding must be a number.', // MISSING

		cell: {
			menu: 'תא',
			insertBefore: 'הוסף תא אחרי',
			insertAfter: 'הוסף תא אחרי',
			deleteCell: 'מחיקת תאים',
			merge: 'מיזוג תאים',
			mergeRight: 'מזג ימינה',
			mergeDown: 'מזג למטה',
			splitHorizontal: 'פצל תא אופקית',
			splitVertical: 'פצל תא אנכית',
			title: 'תכונות התא',
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
			menu: 'שורה',
			insertBefore: 'הוסף שורה לפני',
			insertAfter: 'הוסף שורה אחרי',
			deleteRow: 'מחיקת שורות'
		},

		column: {
			menu: 'עמודה',
			insertBefore: 'הוסף עמודה לפני',
			insertAfter: 'הוסף עמודה אחרי',
			deleteColumn: 'מחיקת עמודות'
		}
	},

	// Button Dialog.
	button: {
		title: 'מאפייני כפתור',
		text: 'טקסט (ערך)',
		type: 'סוג',
		typeBtn: 'כפתור',
		typeSbm: 'שלח',
		typeRst: 'אפס'
	},

	// Checkbox and Radio Button Dialogs.
	checkboxAndRadio: {
		checkboxTitle: 'מאפייני תיבת סימון',
		radioTitle: 'מאפייני לחצן אפשרויות',
		value: 'ערך',
		selected: 'בחור'
	},

	// Form Dialog.
	form: {
		title: 'מאפיני טופס',
		menu: 'מאפיני טופס',
		action: 'שלח אל',
		method: 'סוג שליחה',
		encoding: 'Encoding', // MISSING
		target: 'מטרה',
		targetNotSet: '<לא נקבע>',
		targetNew: 'חלון חדש (_blank)',
		targetTop: 'חלון ראשי (_top)',
		targetSelf: 'באותו החלון (_self)',
		targetParent: 'חלון האב (_parent)'
	},

	// Select Field Dialog.
	select: {
		title: 'מאפייני שדה בחירה',
		selectInfo: 'מידע',
		opAvail: 'אפשרויות זמינות',
		value: 'ערך',
		size: 'גודל',
		lines: 'שורות',
		chkMulti: 'אפשר בחירות מרובות',
		opText: 'טקסט',
		opValue: 'ערך',
		btnAdd: 'הוסף',
		btnModify: 'שנה',
		btnUp: 'למעלה',
		btnDown: 'למטה',
		btnSetValue: 'קבע כברירת מחדל',
		btnDelete: 'מחק'
	},

	// Textarea Dialog.
	textarea: {
		title: 'מאפיני איזור טקסט',
		cols: 'עמודות',
		rows: 'שורות'
	},

	// Text Field Dialog.
	textfield: {
		title: 'מאפייני שדה טקסט',
		name: 'שם',
		value: 'ערך',
		charWidth: 'רוחב באותיות',
		maxChars: 'מקסימות אותיות',
		type: 'סוג',
		typeText: 'טקסט',
		typePass: 'סיסמה'
	},

	// Hidden Field Dialog.
	hidden: {
		title: 'מאפיני שדה חבוי',
		name: 'שם',
		value: 'ערך'
	},

	// Image Dialog.
	image: {
		title: 'תכונות התמונה',
		titleButton: 'מאפיני כפתור תמונה',
		menu: 'תכונות התמונה',
		infoTab: 'מידע על התמונה',
		btnUpload: 'שליחה לשרת',
		url: 'כתובת (URL)',
		upload: 'העלאה',
		alt: 'טקסט חלופי',
		width: 'רוחב',
		height: 'גובה',
		lockRatio: 'נעילת היחס',
		resetSize: 'איפוס הגודל',
		border: 'מסגרת',
		hSpace: 'מרווח אופקי',
		vSpace: 'מרווח אנכי',
		align: 'יישור',
		alignLeft: 'לשמאל',
		alignAbsBottom: 'לתחתית האבסולוטית',
		alignAbsMiddle: 'מרכוז אבסולוטי',
		alignBaseline: 'לקו התחתית',
		alignBottom: 'לתחתית',
		alignMiddle: 'לאמצע',
		alignRight: 'לימין',
		alignTextTop: 'לראש הטקסט',
		alignTop: 'למעלה',
		preview: 'תצוגה מקדימה',
		alertUrl: 'נא להקליד את כתובת התמונה',
		linkTab: 'קישור',
		button2Img: 'Do you want to transform the selected image button on a simple image?', // MISSING
		img2Button: 'Do you want to transform the selected image on a image button?' // MISSING
	},

	// Flash Dialog
	flash: {
		properties: 'מאפייני פלאש',
		propertiesTab: 'Properties', // MISSING
		title: 'מאפיני פלאש',
		chkPlay: 'נגן אוטומטי',
		chkLoop: 'לולאה',
		chkMenu: 'אפשר תפריט פלאש',
		chkFull: 'Allow Fullscreen', // MISSING
		scale: 'גודל',
		scaleAll: 'הצג הכל',
		scaleNoBorder: 'ללא גבולות',
		scaleFit: 'התאמה מושלמת',
		access: 'Script Access', // MISSING
		accessAlways: 'Always', // MISSING
		accessSameDomain: 'Same domain', // MISSING
		accessNever: 'Never', // MISSING
		align: 'יישור',
		alignLeft: 'לשמאל',
		alignAbsBottom: 'לתחתית האבסולוטית',
		alignAbsMiddle: 'מרכוז אבסולוטי',
		alignBaseline: 'לקו התחתית',
		alignBottom: 'לתחתית',
		alignMiddle: 'לאמצע',
		alignRight: 'לימין',
		alignTextTop: 'לראש הטקסט',
		alignTop: 'למעלה',
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
		bgcolor: 'צבע רקע',
		width: 'רוחב',
		height: 'גובה',
		hSpace: 'מרווח אופקי',
		vSpace: 'מרווח אנכי',
		validateSrc: 'נא להקליד את כתובת הקישור (URL)',
		validateWidth: 'Width must be a number.', // MISSING
		validateHeight: 'Height must be a number.', // MISSING
		validateHSpace: 'HSpace must be a number.', // MISSING
		validateVSpace: 'VSpace must be a number.' // MISSING
	},

	// Speller Pages Dialog
	spellCheck: {
		toolbar: 'בדיקת איות',
		title: 'Spell Check', // MISSING
		notAvailable: 'Sorry, but service is unavailable now.', // MISSING
		errorLoading: 'Error loading application service host: %s.', // MISSING
		notInDic: 'לא נמצא במילון',
		changeTo: 'שנה ל',
		btnIgnore: 'התעלם',
		btnIgnoreAll: 'התעלם מהכל',
		btnReplace: 'החלף',
		btnReplaceAll: 'החלף הכל',
		btnUndo: 'החזר',
		noSuggestions: '- אין הצעות -',
		progress: 'בדיקות איות בתהליך ....',
		noMispell: 'בדיקות איות הסתיימה: לא נמצאו שגיעות כתיב',
		noChanges: 'בדיקות איות הסתיימה: לא שונתה אף מילה',
		oneChange: 'בדיקות איות הסתיימה: שונתה מילה אחת',
		manyChanges: 'בדיקות איות הסתיימה: %1 מילים שונו',
		ieSpellDownload: 'בודק האיות לא מותקן, האם אתה מעוניין להוריד?'
	},

	smiley: {
		toolbar: 'סמיילי',
		title: 'הוספת סמיילי'
	},

	elementsPath: {
		eleTitle: '%1 element' // MISSING
	},

	numberedlist: 'רשימה ממוספרת',
	bulletedlist: 'רשימת נקודות',
	indent: 'הגדלת אינדנטציה',
	outdent: 'הקטנת אינדנטציה',

	justify: {
		left: 'יישור לשמאל',
		center: 'מרכוז',
		right: 'יישור לימין',
		block: 'יישור לשוליים'
	},

	blockquote: 'בלוק ציטוט',

	clipboard: {
		title: 'הדבקה',
		cutError: 'הגדרות האבטחה בדפדפן שלך לא מאפשרות לעורך לבצע פעולות גזירה  אוטומטיות. יש להשתמש במקלדת לשם כך (Ctrl+X).',
		copyError: 'הגדרות האבטחה בדפדפן שלך לא מאפשרות לעורך לבצע פעולות העתקה אוטומטיות. יש להשתמש במקלדת לשם כך (Ctrl+C).',
		pasteMsg: 'אנא הדבק בתוך הקופסה באמצעות  (<STRONG>Ctrl+V</STRONG>) ולחץ על  <STRONG>אישור</STRONG>.',
		securityMsg: 'עקב הגדרות אבטחה בדפדפן, לא ניתן לגשת אל לוח הגזירים (clipboard) בצורה ישירה.אנא בצע הדבק שוב בחלון זה.'
	},

	pastefromword: {
		toolbar: 'הדבקה מ-וורד',
		title: 'הדבקה מ-וורד',
		advice: 'אנא הדבק בתוך הקופסה באמצעות  (<STRONG>Ctrl+V</STRONG>) ולחץ על  <STRONG>אישור</STRONG>.',
		ignoreFontFace: 'התעלם מהגדרות סוג פונט',
		removeStyle: 'הסר הגדרות סגנון'
	},

	pasteText: {
		button: 'הדבקה כטקסט פשוט',
		title: 'הדבקה כטקסט פשוט'
	},

	templates: {
		button: 'תבניות',
		title: 'תביות תוכן',
		insertOption: 'החלפת תוכן ממשי',
		selectPromptMsg: 'אנא בחר תבנית לפתיחה בעורך <BR>התוכן המקורי ימחק:',
		emptyListMsg: '(לא הוגדרו תבניות)'
	},

	showBlocks: 'הצג בלוקים',

	stylesCombo: {
		label: 'סגנון',
		voiceLabel: 'Styles', // MISSING
		panelVoiceLabel: 'Select a style', // MISSING
		panelTitle1: 'Block Styles', // MISSING
		panelTitle2: 'Inline Styles', // MISSING
		panelTitle3: 'Object Styles' // MISSING
	},

	format: {
		label: 'עיצוב',
		voiceLabel: 'Format', // MISSING
		panelTitle: 'עיצוב',
		panelVoiceLabel: 'Select a paragraph format', // MISSING

		tag_p: 'נורמלי',
		tag_pre: 'קוד',
		tag_address: 'כתובת',
		tag_h1: 'כותרת',
		tag_h2: 'כותרת 2',
		tag_h3: 'כותרת 3',
		tag_h4: 'כותרת 4',
		tag_h5: 'כותרת 5',
		tag_h6: 'כותרת 6',
		tag_div: 'Normal (DIV)' // MISSING
	},

	font: {
		label: 'גופן',
		voiceLabel: 'Font', // MISSING
		panelTitle: 'גופן',
		panelVoiceLabel: 'Select a font' // MISSING
	},

	fontSize: {
		label: 'גודל',
		voiceLabel: 'Font Size', // MISSING
		panelTitle: 'גודל',
		panelVoiceLabel: 'Select a font size' // MISSING
	},

	colorButton: {
		textColorTitle: 'צבע טקסט',
		bgColorTitle: 'צבע רקע',
		auto: 'אוטומטי',
		more: 'צבעים נוספים...'
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
