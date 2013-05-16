/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Korean language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'ko' ] = {
	/**
	 * The language reading direction. Possible values are "rtl" for
	 * Right-To-Left languages (like Arabic) and "ltr" for Left-To-Right
	 * languages (like English).
	 * @default 'ltr'
	 */
	dir: 'ltr',

	// ARIA description.
	editor: 'Rich Text Editor', // MISSING

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Press ALT 0 for help', // MISSING

		browseServer: '서버 보기',
		url: 'URL',
		protocol: '프로토콜',
		upload: '업로드',
		uploadSubmit: '서버로 전송',
		image: '이미지',
		flash: '플래쉬',
		form: '폼',
		checkbox: '체크박스',
		radio: '라디오버튼',
		textField: '입력필드',
		textarea: '입력영역',
		hiddenField: '숨김필드',
		button: '버튼',
		select: '펼침목록',
		imageButton: '이미지버튼',
		notSet: '<설정되지 않음>',
		id: 'ID',
		name: 'Name',
		langDir: '쓰기 방향',
		langDirLtr: '왼쪽에서 오른쪽 (LTR)',
		langDirRtl: '오른쪽에서 왼쪽 (RTL)',
		langCode: '언어 코드',
		longDescr: 'URL 설명',
		cssClass: 'Stylesheet Classes',
		advisoryTitle: 'Advisory Title',
		cssStyle: 'Style',
		ok: '예',
		cancel: '아니오',
		close: 'Close', // MISSING
		preview: '미리보기',
		resize: 'Resize', // MISSING
		generalTab: 'General', // MISSING
		advancedTab: '자세히',
		validateNumberFailed: 'This value is not a number.', // MISSING
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?', // MISSING
		confirmCancel: 'Some of the options have been changed. Are you sure to close the dialog?', // MISSING
		options: 'Options', // MISSING
		target: '타겟',
		targetNew: 'New Window (_blank)', // MISSING
		targetTop: 'Topmost Window (_top)', // MISSING
		targetSelf: 'Same Window (_self)', // MISSING
		targetParent: 'Parent Window (_parent)', // MISSING
		langDirLTR: '왼쪽에서 오른쪽 (LTR)',
		langDirRTL: '오른쪽에서 왼쪽 (RTL)',
		styles: 'Style',
		cssClasses: 'Stylesheet Classes',
		width: '너비',
		height: '높이',
		align: '정렬',
		alignLeft: '왼쪽',
		alignRight: '오른쪽',
		alignCenter: '가운데',
		alignTop: '위',
		alignMiddle: '중간',
		alignBottom: '아래',
		invalidValue	: 'Invalid value.', // MISSING
		invalidHeight: 'Height must be a number.', // MISSING
		invalidWidth: 'Width must be a number.', // MISSING
		invalidCssLength: 'Value specified for the "%1" field must be a positive number with or without a valid CSS measurement unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING
		invalidHtmlLength: 'Value specified for the "%1" field must be a positive number with or without a valid HTML measurement unit (px or %).', // MISSING
		invalidInlineStyle: 'Value specified for the inline style must consist of one or more tuples with the format of "name : value", separated by semi-colons.', // MISSING
		cssLengthTooltip: 'Enter a number for a value in pixels or a number with a valid CSS unit (px, %, in, cm, mm, em, ex, pt, or pc).', // MISSING

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, unavailable</span>' // MISSING
	}
};
