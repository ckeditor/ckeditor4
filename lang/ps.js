/**
 * @license Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

/**
 * @fileOverview Defines the {@link CKEDITOR.lang} object for the
 * Pashto language.
 */

/**#@+
   @type String
   @example
*/

/**
 * Contains the dictionary of language entries.
 * @namespace
 */
CKEDITOR.lang[ 'ps' ] = {
	// ARIA description.
	editor: 'شتمن متن ليکونکی',
	editorPanel: 'د شتمن متن ليکونکي پنل',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'د مرستې لپاره Alt+0 تڼی کښېکاږی',

		browseServer: 'سرور را خلاص کړئ',
		url: 'لېنک يا (URL)',
		protocol: 'تړونی',
		upload: 'پورته کول',
		uploadSubmit: 'سرور ته يې ولېږئ',
		image: 'انځور',
		flash: 'فلش',
		form: 'فورم',
		checkbox: 'چېک باکس',
		radio: 'دايروي ټنۍ',
		textField: 'ليکنيزه خانه',
		textarea: 'د دېر متن خانه',
		hiddenField: 'پټه خانه',
		button: 'ټنۍ يا بټن',
		select: 'د خوښولو لېست',
		imageButton: 'انځوريزه تڼۍ',
		notSet: '<نه دی په نښه شوی>',
		id: 'پېژاند',
		name: 'نوم',
		langDir: 'د ژبې جهت',
		langDirLtr: 'له کېڼ نه ښي ته',
		langDirRtl: 'له ښي نه کېڼ ته',
		langCode: 'د ژبې کود',
		longDescr: 'اوږده تشرېح',
		cssClass: 'د (Stylesheet) کلاسونه',
		advisoryTitle: 'مرستندوی سرليک',
		cssStyle: 'سټايل',
		ok: 'منل',
		cancel: 'ردول',
		close: 'تړل',
		preview: 'مخکې ښودنه',
		resize: 'اندازه تغيرول',
		generalTab: 'عمومي',
		advancedTab: 'پرمختللي',
		validateNumberFailed: 'دا يو عدد نه دی.',
		confirmNewPage: 'هغه کړنې مو چې ثبت نه وي له منځه ځي. آيا غواړئ نوې پاڼې ته لاړ شی؟',
		confirmCancel: 'تاسو تغيرات راوستلي. آيا غواړئ دا کړکۍ وتړئ؟',
		options: 'آپشنونه',
		target: 'هدف',
		targetNew: 'نوې کړکۍ',
		targetTop: 'لوړه ترينه کړکۍ',
		targetSelf: 'همدا کړکۍ',
		targetParent: 'سربېرنه کړکۍ',
		langDirLTR: 'له کېڼ نه ښي ته',
		langDirRTL: 'له ښي نه کېڼ ته',
		styles: 'سټايل',
		cssClasses: 'د CSS کلاسونه',
		width: 'بر',
		height: 'اوږدوالی',
		align: 'ځای ټاکنه',
		alignLeft: 'کېن لور ته',
		alignRight: 'ښي لور ته',
		alignCenter: 'منځ کې',
		alignJustify: 'برابر سر او آخر',
		alignTop: 'سرته',
		alignMiddle: 'منځ کې',
		alignBottom: 'ښکته',
		alignNone: 'هېڅ يو',
		invalidValue: 'ناسمه اندازه.',
		invalidHeight: 'اوږدوالی بايد يو عدد وي.',
		invalidWidth: 'بر بايد يو عدد وي.',
		invalidCssLength: 'د "%1" خانې لپاره اندازه بايد مثبت اعداد وي که د CSS واحدات (px, %, in, cm, mm, em, ex, pt, or pc) ولري يا نه.',
		invalidHtmlLength: 'د "%1" خانې لپاره اندازه بايد مثبت اعداد وي که د HTML واحدات (px or %) ولري يا نه.',
		invalidInlineStyle: 'د -Inline Style- ډول بايد د يوې يا زياتو داسې جوړو څخه تشکيل شوي وي لکه: "name: value"، چې بايد د سيمي کالنونو ; مرته بېلې شوي وي.',
		cssLengthTooltip: 'اندازه بايد په عددي شکل وليکل شي يا د عدد سره د CSS له واحداتو (px, %, in, cm, mm, em, ex, pt, or pc) نه يو وکارول شي.',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">، لاسرسی نه شي کېدای</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'بک سپېس',
			13: 'انټر',
			16: 'شېفټ',
			17: 'کنټرول',
			18: 'الټ',
			32: 'سپېس',
			35: 'اېنډ',
			36: 'هوم',
			46: 'ډېلېټ',
			224: 'کمنډ'
		},

		// Prepended to ARIA labels with shortcuts.
		keyboardShortcut: 'د کيبورډ لنډيز'
	}
};
