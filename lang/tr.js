/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
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
CKEDITOR.lang[ 'tr' ] = {
	// ARIA description.
	editor: 'Zengin Metin Editörü',
	editorPanel: 'Zengin Metin Editör Paneli',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Yardım için ALT 0 tuşlarına basın',

		browseServer: 'Sunucuya Gözat',
		url: 'URL',
		protocol: 'Protokol',
		upload: 'Karşıya Yükle',
		uploadSubmit: 'Sunucuya Gönder',
		image: 'Resim',
		flash: 'Flash',
		form: 'Form',
		checkbox: 'Onay Kutusu',
		radio: 'Seçenek Düğmesi',
		textField: 'Metin Kutusu',
		textarea: 'Metin Alanı',
		hiddenField: 'Gizli Alan',
		button: 'Düğme',
		select: 'Seçme Alanı',
		imageButton: 'Resim Düğmesi',
		notSet: '<tanımlanmamış>',
		id: 'Kimlik',
		name: 'İsim',
		langDir: 'Dil Yönü',
		langDirLtr: 'Soldan Sağa (LTR)',
		langDirRtl: 'Sağdan Sola (RTL)',
		langCode: 'Dil Kodlaması',
		longDescr: 'Uzun Tanımlı URL',
		cssClass: 'Biçem Sayfası Sınıfları',
		advisoryTitle: 'Öneri Başlığı',
		cssStyle: 'Biçem',
		ok: 'Tamam',
		cancel: 'İptal',
		close: 'Kapat',
		preview: 'Önizleme',
		resize: 'Yeniden Boyutlandır',
		generalTab: 'Genel',
		advancedTab: 'Gelişmiş',
		validateNumberFailed: 'Bu değer bir sayı değildir.',
		confirmNewPage: 'Bu içerikle ilgili kaydedilmemiş tüm bilgiler kaybolacaktır. Yeni bir sayfa yüklemek istediğinizden emin misiniz?',
		confirmCancel: 'Bazı seçenekleri değiştirdiniz. İletişim penceresini kapatmak istediğinizden emin misiniz?',
		options: 'Seçenekler',
		target: 'Hedef',
		targetNew: 'Yeni Pencere (_blank)',
		targetTop: 'En Üstteki Pencere (_top)',
		targetSelf: 'Aynı Pencere (_self)',
		targetParent: 'Üst Pencere (_parent)',
		langDirLTR: 'Soldan Sağa (LTR)',
		langDirRTL: 'Sağdan Sola (RTL)',
		styles: 'Biçem',
		cssClasses: 'Biçem Sayfası Sınıfları',
		width: 'Genişlik',
		height: 'Yükseklik',
		align: 'Hizalama',
		left: 'Sol',
		right: 'Sağ',
		center: 'Ortala',
		justify: 'İki Kenara Yaslanmış',
		alignLeft: 'Sola Dayalı',
		alignRight: 'Sağa Dayalı',
		alignCenter: 'Align Center', // MISSING
		alignTop: 'Üst',
		alignMiddle: 'Orta',
		alignBottom: 'Alt',
		alignNone: 'Hiçbiri',
		invalidValue: 'Geçersiz değer.',
		invalidHeight: 'Yükseklik değeri bir sayı olmalıdır.',
		invalidWidth: 'Genişlik değeri bir sayı olmalıdır.',
		invalidLength: 'Value specified for the "%1" field must be a positive number with or without a valid measurement unit (%2).', // MISSING
		invalidCssLength: '"%1" alanı için verilen değer, geçerli bir CSS ölçü birimi (px, %, in, cm, mm, em, ex, pt, veya pc) içeren veya içermeyen pozitif bir sayı olmalıdır.',
		invalidHtmlLength: 'Belirttiğiniz sayı "%1" alanı için pozitif bir sayı HTML birim değeri olmalıdır (px veya %).',
		invalidInlineStyle: 'Satıriçi biçem için verilen değer, "isim : değer" biçiminde birbirinden noktalı virgüllerle ayrılan bir veya daha fazla değişkenler grubundan oluşmalıdır.',
		cssLengthTooltip: 'Piksel türünde bir sayı veya geçerli bir CSS ölçü birimi (px, %, in, cm, mm, em, ex, pt veya pc) içeren bir sayı girin.',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, kullanılamaz</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Silme Tuşu',
			13: 'Giriş Tuşu',
			16: 'Üst Karater Tuşu',
			17: 'Kontrol Tuşu',
			18: 'Alt Tuşu',
			32: 'Boşluk Tuşu',
			35: 'En Sona Tuşu',
			36: 'En Başa Tuşu',
			46: 'Silme Tuşu',
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
			224: 'Komut Tuşu'
		},

		// Prepended to ARIA labels with shortcuts.
		keyboardShortcut: 'Klavye Kısayolu',

		optionDefault: 'Default' // MISSING
	}
};
