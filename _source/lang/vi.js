/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
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
 * Constains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'vi' ] = {
	/**
	 * The language reading direction. Possible values are "rtl" for
	 * Right-To-Left languages (like Arabic) and "ltr" for Left-To-Right
	 * languages (like English).
	 * @default 'ltr'
	 */
	dir: 'ltr',

	/*
	 * Screenreader titles. Please note that screenreaders are not always capable
	 * of reading non-English words. So be careful while translating it.
	 */
	editorTitle: 'Rich text editor, %1', // MISSING

	// Toolbar buttons without dialogs.
	source: 'Mã HTML',
	newPage: 'Trang mới',
	save: 'Lưu',
	preview: 'Xem trước',
	cut: 'Cắt',
	copy: 'Sao chép',
	paste: 'Dán',
	print: 'In',
	underline: 'Gạch chân',
	bold: 'Đậm',
	italic: 'Nghiêng',
	selectAll: 'Chọn Tất cả',
	removeFormat: 'Xoá Định dạng',
	strike: 'Gạch xuyên ngang',
	subscript: 'Chỉ số dưới',
	superscript: 'Chỉ số trên',
	horizontalrule: 'Chèn Đường phân cách ngang',
	pagebreak: 'Chèn Ngắt trang',
	unlink: 'Xoá Liên kết',
	undo: 'Khôi phục thao tác',
	redo: 'Làm lại thao tác',

	// Common messages and labels.
	common: {
		browseServer: 'Duyệt trên máy chủ',
		url: 'URL',
		protocol: 'Giao thức',
		upload: 'Tải lên',
		uploadSubmit: 'Tải lên Máy chủ',
		image: 'Hình ảnh',
		flash: 'Flash',
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
		langDir: 'Đường dẫn Ngôn ngữ',
		langDirLtr: 'Trái sang Phải (LTR)',
		langDirRtl: 'Phải sang Trái (RTL)',
		langCode: 'Mã Ngôn ngữ',
		longDescr: 'Mô tả URL',
		cssClass: 'Lớp Stylesheet',
		advisoryTitle: 'Advisory Title',
		cssStyle: 'Mẫu',
		ok: 'Đồng ý',
		cancel: 'Bỏ qua',
		generalTab: 'Chung',
		advancedTab: 'Mở rộng',
		validateNumberFailed: 'This value is not a number.', // MISSING
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?', // MISSING
		confirmCancel: 'Some of the options have been changed. Are you sure to close the dialog?' // MISSING
	},

	// Special char dialog.
	specialChar: {
		toolbar: 'Chèn Ký tự đặc biệt',
		title: 'Hãy chọn Ký tự đặc biệt'
	},

	// Link dialog.
	link: {
		toolbar: 'Chèn/Sửa Liên kết', // IE6 BUG: A title called "Link" in an <A> tag would invalidate its padding!!
		menu: 'Sửa Liên kết',
		title: 'Liên kết',
		info: 'Thông tin Liên kết',
		target: 'Đích',
		upload: 'Tải lên',
		advanced: 'Mở rộng',
		type: 'Kiểu Liên kết',
		toAnchor: 'Neo trong trang này',
		toEmail: 'Thư điện tử',
		target: 'Đích',
		targetNotSet: '<không thiết lập>',
		targetFrame: '<khung>',
		targetPopup: '<cửa sổ popup>',
		targetNew: 'Cửa sổ mới (_blank)',
		targetTop: 'Cửa sổ trên cùng(_top)',
		targetSelf: 'Cùng cửa sổ (_self)',
		targetParent: 'Cửa sổ cha (_parent)',
		targetFrameName: 'Tên Khung đích',
		targetPopupName: 'Tên Cửa sổ Popup',
		popupFeatures: 'Đặc điểm của Cửa sổ Popup',
		popupResizable: 'Resizable', // MISSING
		popupStatusBar: 'Thanh trạng thái',
		popupLocationBar: 'Thanh vị trí',
		popupToolbar: 'Thanh công cụ',
		popupMenuBar: 'Thanh Menu',
		popupFullScreen: 'Toàn màn hình (IE)',
		popupScrollBars: 'Thanh cuộn',
		popupDependent: 'Phụ thuộc (Netscape)',
		popupWidth: 'Rộng',
		popupLeft: 'Vị trí Trái',
		popupHeight: 'Cao',
		popupTop: 'Vị trí Trên',
		id: 'Id', // MISSING
		langDir: 'Đường dẫn Ngôn ngữ',
		langDirNotSet: '<không thiết lập>',
		langDirLTR: 'Trái sang Phải (LTR)',
		langDirRTL: 'Phải sang Trái (RTL)',
		acccessKey: 'Phím Hỗ trợ truy cập',
		name: 'Tên',
		langCode: 'Đường dẫn Ngôn ngữ',
		tabIndex: 'Chỉ số của Tab',
		advisoryTitle: 'Advisory Title',
		advisoryContentType: 'Advisory Content Type',
		cssClasses: 'Lớp Stylesheet',
		charset: 'Bảng mã của tài nguyên được liên kết đến',
		styles: 'Mẫu',
		selectAnchor: 'Chọn một Neo',
		anchorName: 'Theo Tên Neo',
		anchorId: 'Theo Định danh Element',
		emailAddress: 'Thư điện tử',
		emailSubject: 'Tiêu đề Thông điệp',
		emailBody: 'Nội dung Thông điệp',
		noAnchors: '(Không có Neo nào trong tài liệu)',
		noUrl: 'Hãy đưa vào Liên kết URL',
		noEmail: 'Hãy đưa vào địa chỉ thư điện tử'
	},

	// Anchor dialog
	anchor: {
		toolbar: 'Chèn/Sửa Neo',
		menu: 'Thuộc tính Neo',
		title: 'Thuộc tính Neo',
		name: 'Tên của Neo',
		errorName: 'Hãy nhập vào tên của Neo'
	},

	// Find And Replace Dialog
	findAndReplace: {
		title: 'Tìm kiếm và Thay Thế',
		find: 'Tìm kiếm',
		replace: 'Thay thế',
		findWhat: 'Tìm chuỗi:',
		replaceWith: 'Thay bằng:',
		notFoundMsg: 'Không tìm thấy chuỗi cần tìm.',
		matchCase: 'Phân biệt chữ hoa/thường',
		matchWord: 'Đúng toàn bộ từ',
		matchCyclic: 'Match cyclic', // MISSING
		replaceAll: 'Thay thế Tất cả',
		replaceSuccessMsg: '%1 occurrence(s) replaced.' // MISSING
	},

	// Table Dialog
	table: {
		toolbar: 'Bảng',
		title: 'Thuộc tính bảng',
		menu: 'Thuộc tính bảng',
		deleteTable: 'Xóa Bảng',
		rows: 'Hàng',
		columns: 'Cột',
		border: 'Cỡ Đường viền',
		align: 'Canh lề',
		alignNotSet: '<Chưa thiết lập>',
		alignLeft: 'Trái',
		alignCenter: 'Giữa',
		alignRight: 'Phải',
		width: 'Rộng',
		widthPx: 'điểm (px)',
		widthPc: '%',
		height: 'Cao',
		cellSpace: 'Khoảng cách Ô',
		cellPad: 'Đệm Ô',
		caption: 'Đầu đề',
		summary: 'Tóm lược',
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
			menu: 'Ô',
			insertBefore: 'Chèn Ô Phía trước',
			insertAfter: 'Chèn Ô Phía sau',
			deleteCell: 'Xoá Ô',
			merge: 'Kết hợp Ô',
			mergeRight: 'Kết hợp Sang phải',
			mergeDown: 'Kết hợp Xuống dưới',
			splitHorizontal: 'Tách ngang Ô',
			splitVertical: 'Tách dọc Ô',
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
			menu: 'Hàng',
			insertBefore: 'Chèn Hàng Phía trước',
			insertAfter: 'Chèn Hàng Phía sau',
			deleteRow: 'Xoá Hàng'
		},

		column: {
			menu: 'Cột',
			insertBefore: 'Chèn Cột Phía trước',
			insertAfter: 'Chèn Cột Phía sau',
			deleteColumn: 'Xoá Cột'
		}
	},

	// Button Dialog.
	button: {
		title: 'Thuộc tính Nút',
		text: 'Chuỗi hiển thị (Giá trị)',
		type: 'Kiểu',
		typeBtn: 'Nút Bấm',
		typeSbm: 'Nút Gửi',
		typeRst: 'Nút Nhập lại'
	},

	// Checkbox and Radio Button Dialogs.
	checkboxAndRadio: {
		checkboxTitle: 'Thuộc tính Nút kiểm',
		radioTitle: 'Thuộc tính Nút chọn',
		value: 'Giá trị',
		selected: 'Được chọn'
	},

	// Form Dialog.
	form: {
		title: 'Thuộc tính Biểu mẫu',
		menu: 'Thuộc tính Biểu mẫu',
		action: 'Hành động',
		method: 'Phương thức',
		encoding: 'Encoding', // MISSING
		target: 'Đích',
		targetNotSet: '<không thiết lập>',
		targetNew: 'Cửa sổ mới (_blank)',
		targetTop: 'Cửa sổ trên cùng(_top)',
		targetSelf: 'Cùng cửa sổ (_self)',
		targetParent: 'Cửa sổ cha (_parent)'
	},

	// Select Field Dialog.
	select: {
		title: 'Thuộc tính Ô chọn',
		selectInfo: 'Thông tin',
		opAvail: 'Các tùy chọn có thể sử dụng',
		value: 'Giá trị',
		size: 'Kích cỡ',
		lines: 'dòng',
		chkMulti: 'Cho phép chọn nhiều',
		opText: 'Văn bản',
		opValue: 'Giá trị',
		btnAdd: 'Thêm',
		btnModify: 'Thay đổi',
		btnUp: 'Lên',
		btnDown: 'Xuống',
		btnSetValue: 'Giá trị được chọn',
		btnDelete: 'Xoá'
	},

	// Textarea Dialog.
	textarea: {
		title: 'Thuộc tính Vùng văn bản',
		cols: 'Cột',
		rows: 'Hàng'
	},

	// Text Field Dialog.
	textfield: {
		title: 'Thuộc tính Trường văn bản',
		name: 'Tên',
		value: 'Giá trị',
		charWidth: 'Rộng',
		maxChars: 'Số Ký tự tối đa',
		type: 'Kiểu',
		typeText: 'Ký tự',
		typePass: 'Mật khẩu'
	},

	// Hidden Field Dialog.
	hidden: {
		title: 'Thuộc tính Trường ẩn',
		name: 'Tên',
		value: 'Giá trị'
	},

	// Image Dialog.
	image: {
		title: 'Thuộc tính Hình ảnh',
		titleButton: 'Thuộc tính Nút hình ảnh',
		menu: 'Thuộc tính Hình ảnh',
		infoTab: 'Thông tin Hình ảnh',
		btnUpload: 'Tải lên Máy chủ',
		url: 'URL',
		upload: 'Tải lên',
		alt: 'Chú thích Hình ảnh',
		width: 'Rộng',
		height: 'Cao',
		lockRatio: 'Giữ nguyên tỷ lệ',
		resetSize: 'Kích thước gốc',
		border: 'Đường viền',
		hSpace: 'HSpace',
		vSpace: 'VSpace',
		align: 'Vị trí',
		alignLeft: 'Trái',
		alignAbsBottom: 'Dưới tuyệt đối',
		alignAbsMiddle: 'Giữa tuyệt đối',
		alignBaseline: 'Đường cơ sở',
		alignBottom: 'Dưới',
		alignMiddle: 'Giữa',
		alignRight: 'Phải',
		alignTextTop: 'Phía trên chữ',
		alignTop: 'Trên',
		preview: 'Xem trước',
		alertUrl: 'Hãy đưa vào URL của hình ảnh',
		linkTab: 'Liên kết',
		button2Img: 'Do you want to transform the selected image button on a simple image?', // MISSING
		img2Button: 'Do you want to transform the selected image on a image button?' // MISSING
	},

	// Flash Dialog
	flash: {
		properties: 'Thuộc tính Flash',
		propertiesTab: 'Properties', // MISSING
		title: 'Thuộc tính Flash',
		chkPlay: 'Tự động chạy',
		chkLoop: 'Lặp',
		chkMenu: 'Cho phép bật Menu của Flash',
		chkFull: 'Allow Fullscreen', // MISSING
		scale: 'Tỷ lệ',
		scaleAll: 'Hiển thị tất cả',
		scaleNoBorder: 'Không đường viền',
		scaleFit: 'Vừa vặn',
		access: 'Script Access', // MISSING
		accessAlways: 'Always', // MISSING
		accessSameDomain: 'Same domain', // MISSING
		accessNever: 'Never', // MISSING
		align: 'Vị trí',
		alignLeft: 'Trái',
		alignAbsBottom: 'Dưới tuyệt đối',
		alignAbsMiddle: 'Giữa tuyệt đối',
		alignBaseline: 'Đường cơ sở',
		alignBottom: 'Dưới',
		alignMiddle: 'Giữa',
		alignRight: 'Phải',
		alignTextTop: 'Phía trên chữ',
		alignTop: 'Trên',
		quality: 'Quality', // MISSING
		windowMode: 'Window mode', // MISSING
		flashvars: 'Variables for Flash', // MISSING
		bgcolor: 'Màu nền',
		width: 'Rộng',
		height: 'Cao',
		hSpace: 'HSpace',
		vSpace: 'VSpace',
		validateSrc: 'Hãy đưa vào Liên kết URL',
		validateWidth: 'Width must be a number.', // MISSING
		validateHeight: 'Height must be a number.', // MISSING
		validateHSpace: 'HSpace must be a number.', // MISSING
		validateVSpace: 'VSpace must be a number.' // MISSING
	},

	// Speller Pages Dialog
	spellCheck: {
		toolbar: 'Kiểm tra Chính tả',
		title: 'Spell Check', // MISSING
		notAvailable: 'Sorry, but service is unavailable now.', // MISSING
		errorLoading: 'Error loading application service host: %s.', // MISSING
		notInDic: 'Không có trong từ điển',
		changeTo: 'Chuyển thành',
		btnIgnore: 'Bỏ qua',
		btnIgnoreAll: 'Bỏ qua Tất cả',
		btnReplace: 'Thay thế',
		btnReplaceAll: 'Thay thế Tất cả',
		btnUndo: 'Phục hồi lại',
		noSuggestions: '- Không đưa ra gợi ý về từ -',
		progress: 'Đang tiến hành kiểm tra chính tả...',
		noMispell: 'Hoàn tất kiểm tra chính tả: Không có lỗi chính tả',
		noChanges: 'Hoàn tất kiểm tra chính tả: Không có từ nào được thay đổi',
		oneChange: 'Hoàn tất kiểm tra chính tả: Một từ đã được thay đổi',
		manyChanges: 'Hoàn tất kiểm tra chính tả: %1 từ đã được thay đổi',
		ieSpellDownload: 'Chức năng kiểm tra chính tả chưa được cài đặt. Bạn có muốn tải về ngay bây giờ?'
	},

	smiley: {
		toolbar: 'Hình biểu lộ cảm xúc (mặt cười)',
		title: 'Chèn Hình biểu lộ cảm xúc (mặt cười)'
	},

	elementsPath: {
		eleTitle: '%1 element' // MISSING
	},

	numberedlist: 'Danh sách có thứ tự',
	bulletedlist: 'Danh sách không thứ tự',
	indent: 'Dịch vào trong',
	outdent: 'Dịch ra ngoài',

	justify: {
		left: 'Canh trái',
		center: 'Canh giữa',
		right: 'Canh phải',
		block: 'Canh đều'
	},

	blockquote: 'Khối Trích dẫn',

	clipboard: {
		title: 'Dán',
		cutError: 'Các thiết lập bảo mật của trình duyệt không cho phép trình biên tập tự động thực thi lệnh cắt. Hãy sử dụng bàn phím cho lệnh này (Ctrl+X).',
		copyError: 'Các thiết lập bảo mật của trình duyệt không cho phép trình biên tập tự động thực thi lệnh sao chép. Hãy sử dụng bàn phím cho lệnh này (Ctrl+C).',
		pasteMsg: 'Hãy dán nội dung vào trong khung bên dưới, sử dụng tổ hợp phím (<STRONG>Ctrl+V</STRONG>) và nhấn vào nút <STRONG>Đồng ý</STRONG>.',
		securityMsg: 'Because of your browser security settings, the editor is not able to access your clipboard data directly. You are required to paste it again in this window.' // MISSING
	},

	pastefromword: {
		toolbar: 'Dán với định dạng Word',
		title: 'Dán với định dạng Word',
		advice: 'Hãy dán nội dung vào trong khung bên dưới, sử dụng tổ hợp phím (<STRONG>Ctrl+V</STRONG>) và nhấn vào nút <STRONG>Đồng ý</STRONG>.',
		ignoreFontFace: 'Chấp nhận các định dạng phông',
		removeStyle: 'Gỡ bỏ các định dạng Styles'
	},

	pasteText: {
		button: 'Dán theo định dạng văn bản thuần',
		title: 'Dán theo định dạng văn bản thuần'
	},

	templates: {
		button: 'Mẫu dựng sẵn',
		title: 'Nội dung Mẫu dựng sẵn',
		insertOption: 'Thay thế nội dung hiện tại',
		selectPromptMsg: 'Hãy chọn Mẫu dựng sẵn để mở trong trình biên tập<br>(nội dung hiện tại sẽ bị mất):',
		emptyListMsg: '(Không có Mẫu dựng sẵn nào được định nghĩa)'
	},

	showBlocks: 'Hiển thị các Khối',

	stylesCombo: {
		label: 'Mẫu',
		panelTitle1: 'Block Styles', // MISSING
		panelTitle2: 'Inline Styles', // MISSING
		panelTitle3: 'Object Styles' // MISSING
	},

	format: {
		label: 'Định dạng',
		panelTitle: 'Định dạng',

		tag_p: 'Normal',
		tag_pre: 'Formatted',
		tag_address: 'Address',
		tag_h1: 'Heading 1',
		tag_h2: 'Heading 2',
		tag_h3: 'Heading 3',
		tag_h4: 'Heading 4',
		tag_h5: 'Heading 5',
		tag_h6: 'Heading 6',
		tag_div: 'Normal (DIV)'
	},

	font: {
		label: 'Phông',
		panelTitle: 'Phông'
	},

	fontSize: {
		label: 'Cỡ chữ',
		panelTitle: 'Cỡ chữ'
	},

	colorButton: {
		textColorTitle: 'Màu chữ',
		bgColorTitle: 'Màu nền',
		auto: 'Tự động',
		more: 'Màu khác...'
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

	about: {
		title: 'About CKEditor', // MISSING
		moreInfo: 'For licensing information please visit our web site:', // MISSING
		copy: 'Copyright &copy; $1. All rights reserved.' // MISSING
	},

	maximize: 'Maximize' // MISSING
};
