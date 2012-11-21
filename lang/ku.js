/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
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
	/**
	 * The language reading direction. Possible values are "rtl" for
	 * Right-To-Left languages (like Arabic) and "ltr" for Left-To-Right
	 * languages (like English).
	 * @default 'ltr'
	 */
	dir: 'rtl',

	// ARIA description.
	editor: 'سەرنووسەی دەقی بەپیت',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'کلیکی ALT له‌گه‌ڵ 0 بکه‌ بۆ یارمه‌تی',

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
		cancel: 'هەڵوەشاندن',
		close: 'داخستن',
		preview: 'پێشبینین',
		resize: 'گۆڕینی ئەندازە',
		generalTab: 'گشتی',
		advancedTab: 'په‌ره‌سه‌ندوو',
		validateNumberFailed: 'ئەم نرخە ژمارە نیه، تکایە نرخێکی ژمارە بنووسە.',
		confirmNewPage: 'سەرجەم گۆڕانکاریەکان و پێکهاتەکانی ناوەووە لەدەست دەدەی گەر بێتوو پاشکەوتی نەکەی یەکەم جار، تۆ هەر دڵنیایی لەکردنەوەی پەنجەرەکی نوێ؟',
		confirmCancel: 'هەندێك هەڵبژاردە گۆڕدراوە. تۆ دڵنیایی له‌داخستنی ئەم دیالۆگە؟',
		options: 'هەڵبژاردە',
		target: 'ئامانج',
		targetNew: 'پەنجەرەیه‌کی نوێ (_blank)',
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
		alignLeft: 'چەپ',
		alignRight: 'ڕاست',
		alignCenter: 'ناوەڕاست',
		alignTop: 'سەرەوە',
		alignMiddle: 'ناوەند',
		alignBottom: 'ژێرەوە',
		invalidValue	: 'نرخێکی نادرووست.',
		invalidHeight: 'درێژی دەبێت ژمارە بێت.',
		invalidWidth: 'پانی دەبێت ژمارە بێت.',
		invalidCssLength: 'ئەم نرخەی دراوە بۆ خانەی "%1" دەبێت ژمارەکی درووست بێت یان بێ ناونیشانی ئامرازی (px, %, in, cm, mm, em, ex, pt, یان pc).',
		invalidHtmlLength: 'ئەم نرخەی دراوە بۆ خانەی "%1" دەبێت ژمارەکی درووست بێت یان بێ ناونیشانی ئامرازی HTML (px یان %).',
		invalidInlineStyle: 'دانه‌ی نرخی شێوازی ناوهێڵ ده‌بێت پێکهاتبێت له‌یه‌ك یان زیاتری داڕشته‌ "ناو : نرخ", جیاکردنه‌وه‌ی به‌فاریزه‌وخاڵ',
		cssLengthTooltip: 'ژماره‌یه‌ك بنووسه‌ بۆ نرخی piksel یان ئامرازێکی درووستی CSS (px, %, in, cm, mm, em, ex, pt, یان pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, ئامادە نیە</span>'
	}
};
