/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Thai language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'th' ] = {
	// ARIA description.
	editor: 'Rich Text Editor', // MISSING
	editorPanel: 'Rich Text Editor panel', // MISSING

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'กด ALT 0 หากต้องการความช่วยเหลือ',

		browseServer: 'เปิดหน้าต่างจัดการไฟล์อัพโหลด',
		url: 'ที่อยู่อ้างอิง URL',
		protocol: 'โปรโตคอล',
		upload: 'อัพโหลดไฟล์',
		uploadSubmit: 'อัพโหลดไฟล์ไปเก็บไว้ที่เครื่องแม่ข่าย (เซิร์ฟเวอร์)',
		image: 'รูปภาพ',
		form: 'แบบฟอร์ม',
		checkbox: 'เช็คบ๊อก',
		radio: 'เรดิโอบัตตอน',
		textField: 'เท็กซ์ฟิลด์',
		textarea: 'เท็กซ์แอเรีย',
		hiddenField: 'ฮิดเดนฟิลด์',
		button: 'ปุ่ม',
		select: 'แถบตัวเลือก',
		imageButton: 'ปุ่มแบบรูปภาพ',
		notSet: '<ไม่ระบุ>',
		id: 'ไอดี',
		name: 'ชื่อ',
		langDir: 'การเขียน-อ่านภาษา',
		langDirLtr: 'จากซ้ายไปขวา (LTR)',
		langDirRtl: 'จากขวามาซ้าย (RTL)',
		langCode: 'รหัสภาษา',
		longDescr: 'คำอธิบายประกอบ URL',
		cssClass: 'คลาสของไฟล์กำหนดลักษณะการแสดงผล',
		advisoryTitle: 'คำเกริ่นนำ',
		cssStyle: 'ลักษณะการแสดงผล',
		ok: 'ตกลง',
		cancel: 'ยกเลิก',
		close: 'ปิด',
		preview: 'ดูหน้าเอกสารตัวอย่าง',
		resize: 'ปรับขนาด',
		generalTab: 'ทั่วไป',
		advancedTab: 'ขั้นสูง',
		validateNumberFailed: 'ค่านี้ไม่ใช่ตัวเลข',
		confirmNewPage: 'การเปลี่ยนแปลงใดๆ ในเนื้อหานี้ ที่ไม่ได้ถูกบันทึกไว้ จะสูญหายทั้งหมด คุณแน่ใจว่าจะเรียกหน้าใหม่?',
		confirmCancel: 'ตัวเลือกบางตัวมีการเปลี่ยนแปลง คุณแน่ใจว่าจะปิดกล่องโต้ตอบนี้?',
		options: 'ตัวเลือก',
		target: 'การเปิดหน้าลิงค์',
		targetNew: 'หน้าต่างใหม่ (_blank)',
		targetTop: 'Topmost Window (_top)', // MISSING
		targetSelf: 'หน้าต่างเดียวกัน (_self)',
		targetParent: 'Parent Window (_parent)', // MISSING
		langDirLTR: 'จากซ้ายไปขวา (LTR)',
		langDirRTL: 'จากขวามาซ้าย (RTL)',
		styles: 'ลักษณะการแสดงผล',
		cssClasses: 'คลาสของไฟล์กำหนดลักษณะการแสดงผล',
		width: 'ความกว้าง',
		height: 'ความสูง',
		align: 'การจัดวาง',
		left: 'ชิดซ้าย',
		right: 'ชิดขวา',
		center: 'กึ่งกลาง',
		justify: 'நியாயப்படுத்தவும்',
		alignLeft: 'จัดชิดซ้าย',
		alignRight: 'จัดชิดขวา',
		alignCenter: 'Align Center', // MISSING
		alignTop: 'บนสุด',
		alignMiddle: 'กึ่งกลางแนวตั้ง',
		alignBottom: 'ชิดด้านล่าง',
		alignNone: 'None', // MISSING
		invalidValue: 'ค่าไม่ถูกต้อง',
		invalidHeight: 'ความสูงต้องเป็นตัวเลข',
		invalidWidth: 'ความกว้างต้องเป็นตัวเลข',
		invalidLength: 'Value specified for the "%1" field must be a positive number with or without a valid measurement unit (%2).', // MISSING
		invalidCssLength: 'Value specified for the "%1" field must be a positive number with or without a valid CSS measurement unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING
		invalidHtmlLength: 'Value specified for the "%1" field must be a positive number with or without a valid HTML measurement unit (px or %).', // MISSING
		invalidInlineStyle: 'Value specified for the inline style must consist of one or more tuples with the format of "name : value", separated by semi-colons.', // MISSING
		cssLengthTooltip: 'Enter a number for a value in pixels or a number with a valid CSS unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, unavailable</span>', // MISSING

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
