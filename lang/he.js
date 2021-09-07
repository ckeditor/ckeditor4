/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
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
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'he' ] = {
	// ARIA description.
	editor: 'עורך טקסט עשיר',
	editorPanel: 'Rich Text Editor panel', // MISSING

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'לחץ אלט ALT + 0 לעזרה',

		browseServer: 'סייר השרת',
		url: 'כתובת (URL)',
		protocol: 'פרוטוקול',
		upload: 'העלאה',
		uploadSubmit: 'שליחה לשרת',
		image: 'תמונה',
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
		id: 'זיהוי (ID)',
		name: 'שם',
		langDir: 'כיוון שפה',
		langDirLtr: 'שמאל לימין (LTR)',
		langDirRtl: 'ימין לשמאל (RTL)',
		langCode: 'קוד שפה',
		longDescr: 'קישור לתיאור מפורט',
		cssClass: 'מחלקת עיצוב (CSS Class)',
		advisoryTitle: 'כותרת מוצעת',
		cssStyle: 'סגנון',
		ok: 'אישור',
		cancel: 'ביטול',
		close: 'סגירה',
		preview: 'תצוגה מקדימה',
		resize: 'יש לגרור בכדי לשנות את הגודל',
		generalTab: 'כללי',
		advancedTab: 'אפשרויות מתקדמות',
		validateNumberFailed: 'הערך חייב להיות מספרי.',
		confirmNewPage: 'כל השינויים שלא נשמרו יאבדו. האם להעלות דף חדש?',
		confirmCancel: 'חלק מהאפשרויות שונו, האם לסגור את הדיאלוג?',
		options: 'אפשרויות',
		target: 'מטרה',
		targetNew: 'חלון חדש (_blank)',
		targetTop: 'החלון העליון ביותר (_top)',
		targetSelf: 'אותו חלון (_self)',
		targetParent: 'חלון האב (_parent)',
		langDirLTR: 'שמאל לימין (LTR)',
		langDirRTL: 'ימין לשמאל (RTL)',
		styles: 'סגנון',
		cssClasses: 'מחלקות גליונות סגנון',
		width: 'רוחב',
		height: 'גובה',
		align: 'יישור',
		left: 'לשמאל',
		right: 'לימין',
		center: 'מרכז',
		justify: 'יישור לשוליים',
		alignLeft: 'יישור לשמאל',
		alignRight: 'יישור לימין',
		alignCenter: 'Align Center', // MISSING
		alignTop: 'למעלה',
		alignMiddle: 'לאמצע',
		alignBottom: 'לתחתית',
		alignNone: 'None', // MISSING
		invalidValue: 'ערך לא חוקי.',
		invalidHeight: 'הגובה חייב להיות מספר.',
		invalidWidth: 'הרוחב חייב להיות מספר.',
		invalidLength: 'Value specified for the "%1" field must be a positive number with or without a valid measurement unit (%2).', // MISSING
		invalidCssLength: 'הערך שצוין לשדה "%1" חייב להיות מספר חיובי עם או ללא יחידת מידה חוקית של CSS (px, %, in, cm, mm, em, ex, pt, או pc).',
		invalidHtmlLength: 'הערך שצוין לשדה "%1" חייב להיות מספר חיובי עם או ללא יחידת מידה חוקית של HTML (px או %).',
		invalidInlineStyle: 'הערך שצויין לשדה הסגנון חייב להכיל זוג ערכים אחד או יותר בפורמט "שם : ערך", מופרדים על ידי נקודה-פסיק.',
		cssLengthTooltip: 'יש להכניס מספר המייצג פיקסלים או מספר עם יחידת גליונות סגנון תקינה (px, %, in, cm, mm, em, ex, pt, או pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, לא זמין</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Backspace',
			13: 'Enter',
			16: 'Shift',
			17: 'Ctrl',
			18: 'Alt',
			32: 'Space', // MISSING
			35: 'End',
			36: 'Home',
			46: 'מחק',
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
