/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Chinese Traditional language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'zh' ] = {
	// ARIA description.
	editor: 'RTF 編輯器',
	editorPanel: 'RTF 編輯器面板',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: '按下 ALT 0 取得說明。',

		browseServer: '瀏覽伺服器',
		url: 'URL',
		protocol: '通訊協定',
		upload: '上傳',
		uploadSubmit: '傳送至伺服器',
		image: '圖像',
		flash: 'Flash',
		form: '表格',
		checkbox: '核取方塊',
		radio: '選項按鈕',
		textField: '文字欄位',
		textarea: '文字區域',
		hiddenField: '隱藏欄位',
		button: '按鈕',
		select: '選取欄位',
		imageButton: '影像按鈕',
		notSet: '<未設定>',
		id: 'ID',
		name: '名稱',
		langDir: '語言方向',
		langDirLtr: '由左至右 (LTR)',
		langDirRtl: '由右至左 (RTL)',
		langCode: '語言代碼',
		longDescr: '完整描述 URL',
		cssClass: '樣式表類別',
		advisoryTitle: '標題',
		cssStyle: '樣式',
		ok: '確定',
		cancel: '取消',
		close: '關閉',
		preview: '預覽',
		resize: '調整大小',
		generalTab: '一般',
		advancedTab: '進階',
		validateNumberFailed: '此值不是數值。',
		confirmNewPage: '現存的修改尚未儲存，要開新檔案？',
		confirmCancel: '部份選項尚未儲存，要關閉對話框？',
		options: '選項',
		target: '目標',
		targetNew: '開新視窗 (_blank)',
		targetTop: '最上層視窗 (_top)',
		targetSelf: '相同視窗 (_self)',
		targetParent: '父視窗 (_parent)',
		langDirLTR: '由左至右 (LTR)',
		langDirRTL: '由右至左 (RTL)',
		styles: '樣式',
		cssClasses: '樣式表類別',
		width: '寬度',
		height: '高度',
		align: '對齊方式',
		left: '靠左對齊',
		right: '靠右對齊',
		center: '置中對齊',
		justify: '左右對齊',
		alignLeft: '靠左對齊',
		alignRight: '靠右對齊',
		alignCenter: '置中對齊',
		alignTop: '頂端',
		alignMiddle: '中間對齊',
		alignBottom: '底端',
		alignNone: '無',
		invalidValue: '無效值。',
		invalidHeight: '高度必須為數字。',
		invalidWidth: '寬度必須為數字。',
		invalidLength: '為「%1」欄位指定的值必須為正值，可包含或不包含測量單位（%2）。',
		invalidCssLength: '「%1」的值應為正數，並可包含有效的 CSS 單位 (px, %, in, cm, mm, em, ex, pt, 或 pc)。',
		invalidHtmlLength: '「%1」的值應為正數，並可包含有效的 HTML 單位 (px 或 %)。',
		invalidInlineStyle: '行內樣式的值應包含一個以上的變數值組，其格式如「名稱:值」，並以分號區隔之。',
		cssLengthTooltip: '請輸入數值，單位是像素或有效的 CSS 單位 (px, %, in, cm, mm, em, ex, pt, 或 pc)。',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">，無法使用</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: '退格鍵',
			13: 'Enter',
			16: 'Shift',
			17: 'Ctrl',
			18: 'Alt',
			32: '空白鍵',
			35: 'End',
			36: 'Home',
			46: '刪除',
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
			224: 'Command 鍵'
		},

		// Prepended to ARIA labels with shortcuts.
		keyboardShortcut: '鍵盤快捷鍵',

		optionDefault: '預設'
	}
};
