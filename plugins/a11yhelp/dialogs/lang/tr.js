/**
 * @license Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.plugins.setLang( 'a11yhelp', 'tr', {
	title: 'Erişilebilirlik Talimatları',
	contents: 'Yardım içeriği. Bu pencereyi kapatmak için ESC tuşuna basın.',
	legend: [
		{
		name: 'Genel',
		items: [
			{
			name: 'Düzenleyici Araç Çubuğu',
			legend: 'Araç çubuğunda gezinmek için ${toolbarFocus} basın. TAB ve SHIFT-TAB ile önceki ve sonraki araç çubuğu grubuna taşıyın. SAĞ OK veya SOL OK ile önceki ve sonraki bir araç çubuğu düğmesini hareket ettirin. SPACE tuşuna basın veya araç çubuğu düğmesini etkinleştirmek için ENTER tuşna basın.'
		},

			{
			name: 'Diyalog Düzenleyici',
			legend: 'Dialog penceresi içinde, sonraki iletişim alanına gitmek için SEKME tuşuna basın, önceki alana geçmek için SHIFT + TAB tuşuna basın, pencereyi göndermek için ENTER tuşuna basın, dialog penceresini iptal etmek için ESC tuşuna basın. Birden çok sekme sayfaları olan diyalogların, sekme listesine gitmek için ALT + F10 tuşlarına basın. Sonra TAB veya SAĞ OK sonraki sekmeye taşıyın. SHIFT + TAB veya SOL OK ile önceki sekmeye geçin. Sekme sayfayı seçmek için SPACE veya ENTER tuşuna basın.'
		},

			{
			name: 'İçerik Menü Editörü',
			legend: 'İçerik menüsünü açmak için ${contextMenu} veya UYGULAMA TUŞU\'na basın. Daha sonra SEKME veya AŞAĞI OK ile bir sonraki menü seçeneği taşıyın. SHIFT + TAB veya YUKARI OK ile önceki seçeneğe gider. Menü seçeneğini seçmek için SPACE veya ENTER tuşuna basın. Seçili seçeneğin alt menüsünü SPACE ya da ENTER veya SAĞ OK açın. Üst menü öğesini geçmek için ESC veya SOL OK ile geri dönün. ESC ile bağlam menüsünü kapatın.'
		},

			{
			name: 'Liste Kutusu Editörü',
			legend: 'Liste kutusu içinde, bir sonraki liste öğesine SEKME VEYA AŞAĞI OK ile taşıyın. SHIFT + TAB veya YUKARI önceki liste öğesi taşıyın. Liste seçeneği seçmek için SPACE veya ENTER tuşuna basın. Liste kutusunu kapatmak için ESC tuşuna basın.'
		},

			{
			name: 'Element Yol Çubuğu Editörü',
			legend: 'Elementlerin yol çubuğunda gezinmek için ${ElementsPathFocus} basın. SEKME veya SAĞ OK ile sonraki element düğmesine taşıyın. SHIFT + TAB veya SOL OK önceki düğmeye hareket ettirin. Editör içindeki elementi seçmek için ENTER veya SPACE tuşuna basın.'
		}
		]
	},
		{
		name: 'Komutlar',
		items: [
			{
			name: 'Komutu geri al',
			legend: '$(undo)\'ya basın'
		},
			{
			name: 'Komutu geri al',
			legend: '${redo} basın'
		},
			{
			name: ' Kalın komut',
			legend: '${bold} basın'
		},
			{
			name: ' İtalik komutu',
			legend: '${italic} basın'
		},
			{
			name: ' Alttan çizgi komutu',
			legend: '${underline} basın'
		},
			{
			name: ' Bağlantı komutu',
			legend: '${link} basın'
		},
			{
			name: ' Araç çubuğu Toplama komutu',
			legend: '${toolbarCollapse} basın'
		},
			{
			name: 'Önceki komut alanına odaklan',
			legend: 'Düzeltme imleçinden önce, en yakın uzaktaki alana erişmek için ${accessPreviousSpace} basın, örneğin: iki birleşik HR elementleri. Aynı tuş kombinasyonu tekrarıyla diğer alanlarada ulaşın.'
		},
			{
			name: 'Sonraki komut alanına odaklan',
			legend: 'Düzeltme imleçinden sonra, en yakın uzaktaki alana erişmek için ${accessNextSpace} basın, örneğin: iki birleşik HR elementleri. Aynı tuş kombinasyonu tekrarıyla diğer alanlarada ulaşın.'
		},
			{
			name: 'Erişilebilirlik Yardımı',
			legend: '${a11yHelp}\'e basın'
		}
		]
	}
	],
	backspace: 'Backspace', // MISSING
	tab: 'Tab', // MISSING
	enter: 'Enter', // MISSING
	shift: 'Shift', // MISSING
	ctrl: 'Ctrl', // MISSING
	alt: 'Alt', // MISSING
	pause: 'Pause', // MISSING
	capslock: 'Caps Lock', // MISSING
	escape: 'Escape', // MISSING
	pageUp: 'Sayfa Yukarı',
	pageDown: 'Sayfa Aşağı',
	end: 'End', // MISSING
	home: 'Home', // MISSING
	leftArrow: 'Sol ok',
	upArrow: 'Yukarı ok',
	rightArrow: 'Sağ ok',
	downArrow: 'Aşağı ok',
	insert: 'Insert', // MISSING
	'delete': 'Silme',
	leftWindowKey: 'Sol windows tuşu',
	rightWindowKey: 'Sağ windows tuşu',
	selectKey: 'Select key', // MISSING
	numpad0: 'Numpad 0', // MISSING
	numpad1: 'Numpad 1', // MISSING
	numpad2: 'Numpad 2', // MISSING
	numpad3: 'Numpad 3', // MISSING
	numpad4: 'Numpad 4', // MISSING
	numpad5: 'Numpad 5', // MISSING
	numpad6: 'Numpad 6', // MISSING
	numpad7: 'Numpad 7', // MISSING
	numpad8: 'Numpad 8', // MISSING
	numpad9: 'Numpad 9', // MISSING
	multiply: 'Çarpma',
	add: 'Toplama',
	subtract: 'Çıkarma',
	decimalPoint: 'Ondalık işareti',
	divide: 'Bölme',
	f1: 'F1',
	f2: 'F2',
	f3: 'F3',
	f4: 'F4',
	f5: 'F5',
	f6: 'F6',
	f7: 'F7',
	f8: 'F8',
	f9: 'F9',
	f10: 'F10',
	f11: 'F11',
	f12: 'F12',
	numLock: 'Num Lock', // MISSING
	scrollLock: 'Scroll Lock', // MISSING
	semiColon: 'Noktalı virgül',
	equalSign: 'Eşittir',
	comma: 'Virgül',
	dash: 'Eksi',
	period: 'Nokta',
	forwardSlash: 'Forward Slash', // MISSING
	graveAccent: 'Grave Accent', // MISSING
	openBracket: 'Parantez aç',
	backSlash: 'Backslash', // MISSING
	closeBracket: 'Parantez kapa',
	singleQuote: 'Tek tırnak'
} );
