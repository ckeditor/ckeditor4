/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'ku' ] = {
	// ARIA description.
	editor: 'سەرنووسەی دەقی تەواو',
	editorPanel: 'بڕگەی سەرنووسەی دەقی تەواو',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'کلیکی ALT لەگەڵ 0 بکه‌ بۆ یارمەتی',

		browseServer: 'هێنانی ڕاژە',
		url: 'ناونیشانی بەستەر',
		protocol: 'پڕۆتۆکۆڵ',
		upload: 'بارکردن',
		uploadSubmit: 'ناردنی بۆ ڕاژە',
		image: 'وێنە',
		flash: 'فلاش',
		form: 'داڕشتە',
		checkbox: 'خانەی نیشانکردن',
		radio: 'جێگرەوەی دوگمە',
		textField: 'خانەی دەق',
		textarea: 'ڕووبەری دەق',
		hiddenField: 'شاردنەوی خانە',
		button: 'دوگمە',
		select: 'هەڵبژاردەی خانە',
		imageButton: 'دوگمەی وێنە',
		notSet: '<هیچ دانەدراوە>',
		id: 'ناسنامە',
		name: 'ناو',
		langDir: 'ئاراستەی زمان',
		langDirLtr: 'چەپ بۆ ڕاست (LTR)',
		langDirRtl: 'ڕاست بۆ چەپ (RTL)',
		langCode: 'هێمای زمان',
		longDescr: 'پێناسەی درێژی بەستەر',
		cssClass: 'شێوازی چینی په‌ڕە',
		advisoryTitle: 'ڕاوێژکاری سەردێڕ',
		cssStyle: 'شێواز',
		ok: 'باشە',
		cancel: 'پاشگەزبوونەوە',
		close: 'داخستن',
		preview: 'پێشبینین',
		resize: 'گۆڕینی ئەندازە',
		generalTab: 'گشتی',
		advancedTab: 'پەرەسەندوو',
		validateNumberFailed: 'ئەم نرخە ژمارە نیە، تکایە نرخێکی ژمارە بنووسە.',
		confirmNewPage: 'سەرجەم گۆڕانکاریەکان و پێکهاتەکانی ناووەوە لەدەست دەدەی گەر بێتوو پاشکەوتی نەکەی یەکەم جار، تۆ هەر دڵنیایی لەکردنەوەی پەنجەرەکی نوێ؟',
		confirmCancel: 'هەندێك هەڵبژاردە گۆڕدراوە. تۆ دڵنیایی لە داخستنی ئەم دیالۆگە؟',
		options: 'هەڵبژاردەکان',
		target: 'ئامانج',
		targetNew: 'پەنجەرەیەکی نوێ (_blank)',
		targetTop: 'لووتکەی پەنجەرە (_top)',
		targetSelf: 'لەهەمان پەنجەرە (_self)',
		targetParent: 'پەنجەرەی باوان (_parent)',
		langDirLTR: 'چەپ بۆ ڕاست (LTR)',
		langDirRTL: 'ڕاست بۆ چەپ (RTL)',
		styles: 'شێواز',
		cssClasses: 'شێوازی چینی پەڕە',
		width: 'پانی',
		height: 'درێژی',
		align: 'ڕێککەرەوە',
		left: 'چەپ',
		right: 'ڕاست',
		center: 'ناوەڕاست',
		justify: 'هاوستوونی',
		alignLeft: 'بەهێڵ کردنی چەپ',
		alignRight: 'بەهێڵ کردنی ڕاست',
		alignCenter: 'بەهێڵ کردنی ناوەڕاست',
		alignTop: 'سەرەوە',
		alignMiddle: 'ناوەند',
		alignBottom: 'ژێرەوە',
		alignNone: 'هیچ',
		invalidValue: 'نرخێکی نادرووست.',
		invalidHeight: 'درێژی دەبێت ژمارە بێت.',
		invalidWidth: 'پانی دەبێت ژمارە بێت.',
		invalidLength: 'ئەم نرخەی دراوە بۆ خانەی "%1" دەبێت ژمارەکی درووست لەگەڵ بێت یان بە بێ پێوانەی یەکەی ( %2)',
		invalidCssLength: 'ئەم نرخەی دراوە بۆ خانەی "%1" دەبێت ژمارەکی درووست بێت یان بێ ناونیشانی ئامرازی (px, %, in, cm, mm, em, ex, pt, یان pc).',
		invalidHtmlLength: 'ئەم نرخەی دراوە بۆ خانەی "%1" دەبێت ژمارەکی درووست بێت یان بێ ناونیشانی ئامرازی HTML (px یان %).',
		invalidInlineStyle: 'دانەی نرخی شێوازی ناوهێڵ دەبێت پێکهاتبێت لەیەك یان زیاتری داڕشتە "ناو : نرخ", جیاکردنەوەی بە فاریزە و خاڵ',
		cssLengthTooltip: 'ژمارەیەك بنووسه‌ بۆ نرخی piksel یان ئامرازێکی درووستی CSS (px, %, in, cm, mm, em, ex, pt, یان pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, ئامادە نیە</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Backspace',
			13: 'Enter',
			16: 'Shift',
			17: 'Ctrl',
			18: 'Alt',
			32: 'Space',
			35: 'End',
			36: 'Home',
			46: 'Delete',
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
			224: 'فەرمان'
		},

		// Prepended to ARIA labels with shortcuts.
		keyboardShortcut: 'کورتبڕی تەختەکلیل',

		optionDefault: 'هەمیشەیی'
	}
};
