/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * Vietnamese language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'vi' ] = {
	// ARIA description.
	application: 'Rich Text Editor', // MISSING
	editor: 'Bộ soạn thảo văn bản có định dạng',
	editorPanel: 'Bảng điều khiển Rich Text Editor',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Nhấn ALT + 0 để được giúp đỡ',

		browseServer: 'Duyệt máy chủ',
		url: 'URL',
		protocol: 'Giao thức',
		upload: 'Tải lên',
		uploadSubmit: 'Tải lên máy chủ',
		image: 'Hình ảnh',
		form: 'Biểu mẫu',
		checkbox: 'Nút kiểm',
		radio: 'Nút chọn',
		textField: 'Trường văn bản',
		textarea: 'Vùng văn bản',
		hiddenField: 'Trường ẩn',
		button: 'Nút',
		select: 'Ô chọn',
		imageButton: 'Nút hình ảnh',
		notSet: '<không thiết lập>',
		id: 'Định danh',
		name: 'Tên',
		langDir: 'Hướng ngôn ngữ',
		langDirLtr: 'Trái sang phải (LTR)',
		langDirRtl: 'Phải sang trái (RTL)',
		langCode: 'Mã ngôn ngữ',
		longDescr: 'Mô tả URL',
		cssClass: 'Lớp Stylesheet',
		advisoryTitle: 'Nhan đề hướng dẫn',
		cssStyle: 'Kiểu ',
		ok: 'Đồng ý',
		cancel: 'Bỏ qua',
		close: 'Đóng',
		preview: 'Xem trước',
		resize: 'Kéo rê để thay đổi kích cỡ',
		generalTab: 'Tab chung',
		advancedTab: 'Tab mở rộng',
		validateNumberFailed: 'Giá trị này không phải là số.',
		confirmNewPage: 'Mọi thay đổi không được lưu lại, nội dung này sẽ bị mất. Bạn có chắc chắn muốn tải một trang mới?',
		confirmCancel: 'Một vài tùy chọn đã bị thay đổi. Bạn có chắc chắn muốn đóng hộp thoại?',
		options: 'Tùy chọn',
		target: 'Đích đến',
		targetNew: 'Cửa sổ mới (_blank)',
		targetTop: 'Cửa sổ trên cùng (_top)',
		targetSelf: 'Tại trang (_self)',
		targetParent: 'Cửa sổ cha (_parent)',
		langDirLTR: 'Trái sang phải (LTR)',
		langDirRTL: 'Phải sang trái (RTL)',
		styles: 'Kiểu',
		cssClasses: 'Lớp CSS',
		width: 'Chiều rộng',
		height: 'Chiều cao',
		align: 'Vị trí',
		left: 'Trái',
		right: 'Phải',
		center: 'Giữa',
		justify: 'Sắp chữ',
		alignLeft: 'Canh trái',
		alignRight: 'Canh phải',
		alignCenter: 'Canh giữa',
		alignTop: 'Trên',
		alignMiddle: 'Giữa',
		alignBottom: 'Dưới',
		alignNone: 'Không',
		invalidValue: 'Giá trị không hợp lệ.',
		invalidHeight: 'Chiều cao phải là số nguyên.',
		invalidWidth: 'Chiều rộng phải là số nguyên.',
		invalidLength: 'Giá trị cho trường "%1" phải là một số dương có hoặc không có đơn vị đo lường hợp lệ (%2)',
		invalidCssLength: 'Giá trị quy định cho trường "%1" phải là một số dương có hoặc không có một đơn vị đo CSS hợp lệ (px, %, in, cm, mm, em, ex, pt, hoặc pc).',
		invalidHtmlLength: 'Giá trị quy định cho trường "%1" phải là một số dương có hoặc không có một đơn vị đo HTML hợp lệ (px hoặc %).',
		invalidInlineStyle: 'Giá trị quy định cho kiểu nội tuyến phải bao gồm một hoặc nhiều dữ liệu với định dạng "tên:giá trị", cách nhau bằng dấu chấm phẩy.',
		cssLengthTooltip: 'Nhập một giá trị theo pixel hoặc một số với một đơn vị CSS hợp lệ (px, %, in, cm, mm, em, ex, pt, hoặc pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, không có</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Phím Backspace',
			13: 'Enter',
			16: 'Shift',
			17: 'Ctrl',
			18: 'Alt',
			32: 'Cách',
			35: 'End',
			36: 'Home',
			46: 'Xóa',
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
			224: 'Command'
		},

		// Prepended to ARIA labels with shortcuts.
		keyboardShortcut: 'Phím tắt',

		optionDefault: 'Mặc định'
	},

	versionCheck: {
		notificationMessage: 'This CKEditor %current version is not secure. Consider <a target="_blank" href="%link">upgrading to the latest one</a>, %latest.', // MISSING
		consoleMessage: 'This CKEditor %current version is not secure. Consider upgrading to the latest one, %latest: %link', // MISSING
		aboutDialogInsecureMessage: 'This CKEditor %current version is not secure.<br>Consider upgrading to the latest one, %latest:<br><a target="_blank" href="%link">%link</a>', // MISSING
		aboutDialogUpgradeMessage: 'Consider upgrading to the latest editor version, %latest:<br><a target="_blank" href="%link">%link</a>' // MISSING
	}
};
