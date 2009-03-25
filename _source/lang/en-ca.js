/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object, for the
 * English (Canadian) language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Constains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'en-ca' ] = {
	/**
	 * The language reading direction. Possible values are "rtl" for
	 * Right-To-Left languages (like Arabic) and "ltr" for Left-To-Right
	 * languages (like English).
	 * @default 'ltr'
	 */
	dir: 'ltr',

	// Toolbar buttons without dialogs.
	source: 'Source',
	newPage: 'New Page',
	save: 'Save',
	preview: 'Preview',
	cut: 'Cut',
	copy: 'Copy',
	paste: 'Paste',
	print: 'Print',
	underline: 'Underline',
	bold: 'Bold',
	italic: 'Italic',
	selectAll: 'Select All',
	removeFormat: 'Remove Format',
	strike: 'Strike Through',
	subscript: 'Subscript',
	superscript: 'Superscript',
	horizontalrule: 'Insert Horizontal Line',
	pagebreak: 'Insert Page Break',
	unlink: 'Remove Link',
	undo: 'Undo',
	redo: 'Redo',

	// Common messages and labels.
	common: {
		browseServer: 'Browse Server',
		url: 'URL',
		protocol: 'Protocol',
		upload: 'Upload',
		uploadSubmit: 'Send it to the Server',
		image: 'Image',
		flash: 'Flash',
		form: 'Form',
		checkbox: 'Checkbox',
		radio: 'Radio Button',
		textField: 'Text Field',
		textarea: 'Textarea',
		hiddenField: 'Hidden Field',
		button: 'Button',
		select: 'Selection Field',
		imageButton: 'Image Button',
		notSet: '<not set>',
		id: 'Id',
		name: 'Name',
		langDir: 'Language Direction',
		langDirLtr: 'Left to Right (LTR)',
		langDirRtl: 'Right to Left (RTL)',
		langCode: 'Language Code',
		longDescr: 'Long Description URL',
		cssClass: 'Stylesheet Classes',
		advisoryTitle: 'Advisory Title',
		cssStyle: 'Style',
		ok: 'OK',
		cancel: 'Cancel',
		generalTab: 'General',
		advancedTab: 'Advanced',
		validateNumberFailed: 'This value is not a number.', // MISSING
		confirmNewPage: 'Any unsaved changes to this content will be lost. Are you sure you want to load new page?', // MISSING
		confirmCancel: 'Some of the options have been changed. Are you sure to close the dialog?' // MISSING
	},

	// Special char dialog.
	specialChar: {
		toolbar: 'Insert Special Character',
		title: 'Select Special Character'
	},

	// Link dialog.
	link: {
		toolbar: 'Insert/Edit Link', // IE6 BUG: A title called "Link" in an <A> tag would invalidate its padding!!
		menu: 'Edit Link',
		title: 'Link',
		info: 'Link Info',
		target: 'Target',
		upload: 'Upload',
		advanced: 'Advanced',
		type: 'Link Type',
		toAnchor: 'Link to anchor in the text',
		toEmail: 'E-Mail',
		target: 'Target',
		targetNotSet: '<not set>',
		targetFrame: '<frame>',
		targetPopup: '<popup window>',
		targetNew: 'New Window (_blank)',
		targetTop: 'Topmost Window (_top)',
		targetSelf: 'Same Window (_self)',
		targetParent: 'Parent Window (_parent)',
		targetFrameName: 'Target Frame Name',
		targetPopupName: 'Popup Window Name',
		popupFeatures: 'Popup Window Features',
		popupResizable: 'Resizable', // MISSING
		popupStatusBar: 'Status Bar',
		popupLocationBar: 'Location Bar',
		popupToolbar: 'Toolbar',
		popupMenuBar: 'Menu Bar',
		popupFullScreen: 'Full Screen (IE)',
		popupScrollBars: 'Scroll Bars',
		popupDependent: 'Dependent (Netscape)',
		popupWidth: 'Width',
		popupLeft: 'Left Position',
		popupHeight: 'Height',
		popupTop: 'Top Position',
		id: 'Id', // MISSING
		langDir: 'Language Direction',
		langDirNotSet: '<not set>',
		langDirLTR: 'Left to Right (LTR)',
		langDirRTL: 'Right to Left (RTL)',
		acccessKey: 'Access Key',
		name: 'Name',
		langCode: 'Language Direction',
		tabIndex: 'Tab Index',
		advisoryTitle: 'Advisory Title',
		advisoryContentType: 'Advisory Content Type',
		cssClasses: 'Stylesheet Classes',
		charset: 'Linked Resource Charset',
		styles: 'Style',
		selectAnchor: 'Select an Anchor',
		anchorName: 'By Anchor Name',
		anchorId: 'By Element Id',
		emailAddress: 'E-Mail Address',
		emailSubject: 'Message Subject',
		emailBody: 'Message Body',
		noAnchors: '(No anchors available in the document)',
		noUrl: 'Please type the link URL',
		noEmail: 'Please type the e-mail address'
	},

	// Anchor dialog
	anchor: {
		toolbar: 'Insert/Edit Anchor',
		menu: 'Anchor Properties',
		title: 'Anchor Properties',
		name: 'Anchor Name',
		errorName: 'Please type the anchor name'
	},

	// Find And Replace Dialog
	findAndReplace: {
		title: 'Find and Replace',
		find: 'Find',
		replace: 'Replace',
		findWhat: 'Find what:',
		replaceWith: 'Replace with:',
		notFoundMsg: 'The specified text was not found.',
		matchCase: 'Match case',
		matchWord: 'Match whole word',
		matchCyclic: 'Match cyclic', // MISSING
		replaceAll: 'Replace All',
		replaceSuccessMsg: '%1 occurrence(s) replaced.' // MISSING
	},

	// Table Dialog
	table: {
		toolbar: 'Table',
		title: 'Table Properties',
		menu: 'Table Properties',
		deleteTable: 'Delete Table',
		rows: 'Rows',
		columns: 'Columns',
		border: 'Border size',
		align: 'Alignment',
		alignNotSet: '<Not set>',
		alignLeft: 'Left',
		alignCenter: 'Centre',
		alignRight: 'Right',
		width: 'Width',
		widthPx: 'pixels',
		widthPc: 'percent',
		height: 'Height',
		cellSpace: 'Cell spacing',
		cellPad: 'Cell padding',
		caption: 'Caption',
		summary: 'Summary',
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
			menu: 'Cell',
			insertBefore: 'Insert Cell Before',
			insertAfter: 'Insert Cell After',
			deleteCell: 'Delete Cells',
			merge: 'Merge Cells',
			mergeRight: 'Merge Right',
			mergeDown: 'Merge Down',
			splitHorizontal: 'Split Cell Horizontally',
			splitVertical: 'Split Cell Vertically'
		},

		row: {
			menu: 'Row',
			insertBefore: 'Insert Row Before',
			insertAfter: 'Insert Row After',
			deleteRow: 'Delete Rows'
		},

		column: {
			menu: 'Column',
			insertBefore: 'Insert Column Before',
			insertAfter: 'Insert Column After',
			deleteColumn: 'Delete Columns'
		}
	},

	// Button Dialog.
	button: {
		title: 'Button Properties',
		text: 'Text (Value)',
		type: 'Type',
		typeBtn: 'Button',
		typeSbm: 'Submit',
		typeRst: 'Reset'
	},

	// Checkbox and Radio Button Dialogs.
	checkboxAndRadio: {
		checkboxTitle: 'Checkbox Properties',
		radioTitle: 'Radio Button Properties',
		value: 'Value',
		selected: 'Selected'
	},

	// Form Dialog.
	form: {
		title: 'Form Properties',
		menu: 'Form Properties',
		action: 'Action',
		method: 'Method',
		encoding: 'Encoding', // MISSING
		target: 'Target',
		targetNotSet: '<not set>',
		targetNew: 'New Window (_blank)',
		targetTop: 'Topmost Window (_top)',
		targetSelf: 'Same Window (_self)',
		targetParent: 'Parent Window (_parent)'
	},

	// Select Field Dialog.
	select: {
		title: 'Selection Field Properties',
		selectInfo: 'Info',
		opAvail: 'Available Options',
		value: 'Value',
		size: 'Size',
		lines: 'lines',
		chkMulti: 'Allow multiple selections',
		opText: 'Text',
		opValue: 'Value',
		btnAdd: 'Add',
		btnModify: 'Modify',
		btnUp: 'Up',
		btnDown: 'Down',
		btnSetValue: 'Set as selected value',
		btnDelete: 'Delete'
	},

	// Textarea Dialog.
	textarea: {
		title: 'Textarea Properties',
		cols: 'Columns',
		rows: 'Rows'
	},

	// Text Field Dialog.
	textfield: {
		title: 'Text Field Properties',
		name: 'Name',
		value: 'Value',
		charWidth: 'Character Width',
		maxChars: 'Maximum Characters',
		type: 'Type',
		typeText: 'Text',
		typePass: 'Password'
	},

	// Hidden Field Dialog.
	hidden: {
		title: 'Hidden Field Properties',
		name: 'Name',
		value: 'Value'
	},

	// Image Dialog.
	image: {
		title: 'Image Properties',
		titleButton: 'Image Button Properties',
		menu: 'Image Properties',
		infoTab: 'Image Info',
		btnUpload: 'Send it to the Server',
		url: 'URL',
		upload: 'Upload',
		alt: 'Alternative Text',
		width: 'Width',
		height: 'Height',
		lockRatio: 'Lock Ratio',
		resetSize: 'Reset Size',
		border: 'Border',
		hSpace: 'HSpace',
		vSpace: 'VSpace',
		align: 'Align',
		alignLeft: 'Left',
		alignAbsBottom: 'Abs Bottom',
		alignAbsMiddle: 'Abs Middle',
		alignBaseline: 'Baseline',
		alignBottom: 'Bottom',
		alignMiddle: 'Middle',
		alignRight: 'Right',
		alignTextTop: 'Text Top',
		alignTop: 'Top',
		preview: 'Preview',
		alertUrl: 'Please type the image URL',
		linkTab: 'Link',
		button2Img: 'Do you want to transform the selected image button on a simple image?', // MISSING
		img2Button: 'Do you want to transform the selected image on a image button?' // MISSING
	},

	// Flash Dialog
	flash: {
		properties: 'Flash Properties',
		propertiesTab: 'Properties', // MISSING
		title: 'Flash Properties',
		chkPlay: 'Auto Play',
		chkLoop: 'Loop',
		chkMenu: 'Enable Flash Menu',
		chkFull: 'Allow Fullscreen', // MISSING
		scale: 'Scale',
		scaleAll: 'Show all',
		scaleNoBorder: 'No Border',
		scaleFit: 'Exact Fit',
		access: 'Script Access', // MISSING
		accessAlways: 'Always', // MISSING
		accessSameDomain: 'Same domain', // MISSING
		accessNever: 'Never', // MISSING
		align: 'Align',
		alignLeft: 'Left',
		alignAbsBottom: 'Abs Bottom',
		alignAbsMiddle: 'Abs Middle',
		alignBaseline: 'Baseline',
		alignBottom: 'Bottom',
		alignMiddle: 'Middle',
		alignRight: 'Right',
		alignTextTop: 'Text Top',
		alignTop: 'Top',
		quality: 'Quality', // MISSING
		windowMode: 'Window mode', // MISSING
		flashvars: 'Variables for Flash', // MISSING
		bgcolor: 'Background Colour',
		width: 'Width',
		height: 'Height',
		hSpace: 'HSpace',
		vSpace: 'VSpace',
		validateSrc: 'Please type the link URL',
		validateWidth: 'Width must be a number.', // MISSING
		validateHeight: 'Height must be a number.', // MISSING
		validateHSpace: 'HSpace must be a number.', // MISSING
		validateVSpace: 'VSpace must be a number.' // MISSING
	},

	// Speller Pages Dialog
	spellCheck: {
		toolbar: 'Check Spelling',
		title: 'Spell Check', // MISSING
		notAvailable: 'Sorry, but service is unavailable now.', // MISSING
		errorLoading: 'Error loading application service host: %s.', // MISSING
		notInDic: 'Not in dictionary',
		changeTo: 'Change to',
		btnIgnore: 'Ignore',
		btnIgnoreAll: 'Ignore All',
		btnReplace: 'Replace',
		btnReplaceAll: 'Replace All',
		btnUndo: 'Undo',
		noSuggestions: '- No suggestions -',
		progress: 'Spell check in progress...',
		noMispell: 'Spell check complete: No misspellings found',
		noChanges: 'Spell check complete: No words changed',
		oneChange: 'Spell check complete: One word changed',
		manyChanges: 'Spell check complete: %1 words changed',
		ieSpellDownload: 'Spell checker not installed. Do you want to download it now?'
	},

	smiley: {
		toolbar: 'Smiley',
		title: 'Insert a Smiley'
	},

	elementsPath: {
		eleTitle: '%1 element' // MISSING
	},

	numberedlist: 'Numbered List',
	bulletedlist: 'Bulleted List',
	indent: 'Increase Indent',
	outdent: 'Decrease Indent',

	justify: {
		left: 'Left Justify',
		center: 'Centre Justify',
		right: 'Right Justify',
		block: 'Block Justify'
	},

	outdent: 'Decrease Indent',
	blockquote: 'Blockquote',

	clipboard: {
		title: 'Paste',
		cutError: 'Your browser security settings don\'t permit the editor to automatically execute cutting operations. Please use the keyboard for that (Ctrl+X).',
		copyError: 'Your browser security settings don\'t permit the editor to automatically execute copying operations. Please use the keyboard for that (Ctrl+C).',
		pasteMsg: 'Please paste inside the following box using the keyboard (<strong>Ctrl+V</strong>) and hit <strong>OK</strong>.',
		securityMsg: 'Because of your browser security settings, the editor is not able to access your clipboard data directly. You are required to paste it again in this window.'
	},

	pastefromword: {
		toolbar: 'Paste from Word',
		title: 'Paste from Word',
		advice: 'Please paste inside the following box using the keyboard (<strong>Ctrl+V</strong>) and hit <strong>OK</strong>.',
		ignoreFontFace: 'Ignore Font Face definitions',
		removeStyle: 'Remove Styles definitions'
	},

	pasteText: {
		button: 'Paste as Plain Text',
		title: 'Paste as Plain Text'
	},

	templates: {
		button: 'Templates',
		title: 'Content Templates',
		insertOption: 'Replace actual contents',
		selectPromptMsg: 'Please select the template to open in the editor<br />(the actual contents will be lost):',
		emptyListMsg: '(No templates defined)'
	},

	showBlocks: 'Show Blocks',

	stylesCombo: {
		label: 'Style',
		panelTitle1: 'Block Styles', // MISSING
		panelTitle2: 'Inline Styles', // MISSING
		panelTitle3: 'Object Styles' // MISSING
	},

	format: {
		label: 'Format',
		panelTitle: 'Format',

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
		label: 'Font',
		panelTitle: 'Font'
	},

	fontSize: {
		label: 'Size',
		panelTitle: 'Size'
	},

	colorButton: {
		textColorTitle: 'Text Colour',
		bgColorTitle: 'Background Colour',
		auto: 'Automatic',
		more: 'More Colours...'
	}
};
