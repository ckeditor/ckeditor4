/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
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
	editor: '富文本編輯器',
	editorPanel: 'Rich Text Editor panel', // MISSING

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: '按 ALT+0 以獲得幫助',

		browseServer: '瀏覽伺服器端',
		url: 'URL',
		protocol: '通訊協定',
		upload: '上傳',
		uploadSubmit: '上傳至伺服器',
		image: '圖片',
		flash: 'Flash',
		form: '表單',
		checkbox: '確認方塊',
		radio: '選項按鈕',
		textField: '文字方塊',
		textarea: '文字區域',
		hiddenField: '隱藏欄位',
		button: '按鈕',
		select: '清單/選單',
		imageButton: '圖片按鈕',
		notSet: '<尚未設定>',
		id: 'ID',
		name: '名稱',
		langDir: '語言方向',
		langDirLtr: '由左而右 (LTR)',
		langDirRtl: '由右而左 (RTL)',
		langCode: '語言代碼',
		longDescr: '詳細 URL',
		cssClass: '樣式表類別',
		advisoryTitle: '標題',
		cssStyle: '樣式',
		ok: '確定',
		cancel: '取消',
		close: '關閉',
		preview: '預覽',
		resize: '拖拽改變大小',
		generalTab: '一般',
		advancedTab: '進階',
		validateNumberFailed: '需要輸入數字格式',
		confirmNewPage: '現存的修改尚未儲存，要開新檔案？',
		confirmCancel: '部份選項尚未儲存，要關閉對話框？',
		options: '選項',
		target: '目標',
		targetNew: '新視窗(_blank)',
		targetTop: '整頁(_top)',
		targetSelf: '目前視窗(_self)',
		targetParent: '父視窗(_parent)',
		langDirLTR: '由左而右 (LTR)',
		langDirRTL: '由右而左 (RTL)',
		styles: '樣式',
		cssClasses: '樣式表類別',
		width: '寬度',
		height: '高度',
		align: '對齊',
		alignLeft: '靠左對齊',
		alignRight: '靠右對齊',
		alignCenter: '置中',
		alignTop: '靠上對齊',
		alignMiddle: '置中對齊',
		alignBottom: '靠下對齊',
		invalidValue	: '無效數值',
		invalidHeight: '高度必須為數字格式',
		invalidWidth: '寬度必須為數字格式',
		invalidCssLength: '在 "%1" 欄位所指定的長度設定值必須是正數，後面加上 CSS 樣式的有效單位（ px、%、in、cm、mm、em、ex、pt、或 pc），也可以不加單位。',
		invalidHtmlLength: '在 "%1" 欄位所指定的長度設定值必須是正數，後面加上 HTML 規範中的有效單位（ px 或 % ），也可以不加單位。',
		invalidInlineStyle: '行內樣式由一組或多組屬性設定值所構成，樣式的語法為"屬性: 設定值"，並使用分號格開。',
		cssLengthTooltip: '輸入一個以像素（pixels）為單位的數值，或是一個使用 CSS 單位的數值（ px、%、in、cm、mm、em、ex、pt、或 pc）。',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, 已關閉</span>'
	}
};
