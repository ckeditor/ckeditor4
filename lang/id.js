/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
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
CKEDITOR.lang[ 'id' ] = {
	// ARIA description.
	editor: 'Rich Text Editor',
	editorPanel: 'Panel Rich Text Editor',

	// Common messages and labels.
	common: {
		// Screenreader titles. Please note that screenreaders are not always capable
		// of reading non-English words. So be careful while translating it.
		editorHelp: 'Tekan ALT 0 untuk bantuan.',

		browseServer: 'Jelajah Server',
		url: 'URL',
		protocol: 'Protokol',
		upload: 'Unggah',
		uploadSubmit: 'Kirim ke Server',
		image: 'Gambar',
		flash: 'Flash',
		form: 'Formulir',
		checkbox: 'Kotak Cek',
		radio: 'Tombol Radio',
		textField: 'Kolom Teks',
		textarea: 'Area Teks',
		hiddenField: 'Kolom Tersembunyi',
		button: 'Tombol',
		select: 'Kolom Seleksi',
		imageButton: 'Tombol Gambar',
		notSet: '<tidak diatur>',
		id: 'Id',
		name: 'Nama',
		langDir: 'Arah Bahasa',
		langDirLtr: 'Kiri ke Kanan (LTR)',
		langDirRtl: 'Kanan ke Kiri',
		langCode: 'Kode Bahasa',
		longDescr: 'Deskripsi URL Panjang',
		cssClass: 'Kelas Stylesheet',
		advisoryTitle: 'Penasehat Judul',
		cssStyle: 'Gaya',
		ok: 'OK',
		cancel: 'Batal',
		close: 'Tutup',
		preview: 'Pratinjau',
		resize: 'Ubah ukuran',
		generalTab: 'Umum',
		advancedTab: 'Lebih Lanjut',
		validateNumberFailed: 'Nilai ini tidak sebuah angka',
		confirmNewPage: 'Semua perubahan yang tidak disimpan di konten ini akan hilang. Apakah anda yakin ingin memuat halaman baru?',
		confirmCancel: 'Beberapa opsi telah berubah. Apakah anda yakin ingin menutup dialog?',
		options: 'Opsi',
		target: 'Sasaran',
		targetNew: 'Jendela Baru (_blank)',
		targetTop: 'Laman Atas (_top)',
		targetSelf: 'Jendela yang Sama (_self)',
		targetParent: 'Jendela Induk (_parent)',
		langDirLTR: 'Kiri ke Kanan (LTR)',
		langDirRTL: 'Kanan ke Kiri (RTL)',
		styles: 'Gaya',
		cssClasses: 'Kelas Stylesheet',
		width: 'Lebar',
		height: 'Tinggi',
		align: 'Penjajaran',
		alignLeft: 'Kiri',
		alignRight: 'Kanan',
		alignCenter: 'Tengah',
		alignJustify: 'Rata kiri-kanan',
		alignTop: 'Atas',
		alignMiddle: 'Tengah',
		alignBottom: 'Bawah',
		alignNone: 'Tidak ada',
		invalidValue: 'Nilai tidak sah.',
		invalidHeight: 'Tinggi harus sebuah angka.',
		invalidWidth: 'Lebar harus sebuah angka.',
		invalidCssLength: 'Nilai untuk "%1" harus sebuah angkat positif dengan atau tanpa pengukuran unit CSS yang sah (px, %, in, cm, mm, em, ex, pt, or pc).',
		invalidHtmlLength: 'Nilai yang dispesifikasian untuk kolom "%1" harus sebuah angka positif dengan atau tanpa sebuah unit pengukuran HTML (px atau %) yang valid.',
		invalidInlineStyle: 'Nilai pada inline style merupakan pasangan nama dan nilai dengan format "nama : nilai", yang dipisahkan dengan titik dua.',
		cssLengthTooltip: 'Masukkan sebuah angka untuk sebuah nilai dalam pixel atau sebuah angka dengan unit CSS yang sah (px, %, in, cm, mm, em, ex, pt, or pc).',

		// Put the voice-only part of the label in the span.
		unavailable: '%1<span class="cke_accessibility">, tidak tersedia</span>',

		// Keyboard keys translations used for creating shortcuts descriptions in tooltips, context menus and ARIA labels.
		keyboard: {
			8: 'Backspace',
			13: 'Enter',
			16: 'Shift',
			17: 'Ctrl',
			18: 'Alt',
			32: 'Spasi',
			35: 'End',
			36: 'Home',
			46: 'Hapus',
			224: 'Command'
		},

		// Prepended to ARIA labels with shortcuts.
		keyboardShortcut: 'Pintasan Keyboard'
	}
};
