/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

/* exported CKEDITOR_LANGS */

var CKEDITOR_LANGS = ( function() {
	var langs = {
		af: 'Afrikaans',
		ar: 'Arabic',
		az: 'Azerbaijani',
		bg: 'Bulgarian',
		bn: 'Bengali/Bangla',
		bs: 'Bosnian',
		ca: 'Catalan',
		cs: 'Czech',
		cy: 'Welsh',
		da: 'Danish',
		de: 'German',
		'de-ch': 'German (Switzerland)',
		el: 'Greek',
		en: 'English',
		'en-au': 'English (Australia)',
		'en-ca': 'English (Canadian)',
		'en-gb': 'English (United Kingdom)',
		eo: 'Esperanto',
		es: 'Spanish',
		'es-mx': 'Spanish (Mexico)',
		et: 'Estonian',
		eu: 'Basque',
		fa: 'Persian',
		fi: 'Finnish',
		fo: 'Faroese',
		fr: 'French',
		'fr-ca': 'French (Canada)',
		gl: 'Galician',
		gu: 'Gujarati',
		he: 'Hebrew',
		hi: 'Hindi',
		hr: 'Croatian',
		hu: 'Hungarian',
		id: 'Indonesian',
		is: 'Icelandic',
		it: 'Italian',
		ja: 'Japanese',
		ka: 'Georgian',
		km: 'Khmer',
		ko: 'Korean',
		ku: 'Kurdish',
		lt: 'Lithuanian',
		lv: 'Latvian',
		mk: 'Macedonian',
		mn: 'Mongolian',
		ms: 'Malay',
		nb: 'Norwegian Bokmal',
		nl: 'Dutch',
		no: 'Norwegian',
		oc: 'Occitan',
		pl: 'Polish',
		pt: 'Portuguese (Portugal)',
		'pt-br': 'Portuguese (Brazil)',
		ro: 'Romanian',
		ru: 'Russian',
		si: 'Sinhala',
		sk: 'Slovak',
		sq: 'Albanian',
		sl: 'Slovenian',
		sr: 'Serbian (Cyrillic)',
		'sr-latn': 'Serbian (Latin)',
		sv: 'Swedish',
		th: 'Thai',
		tr: 'Turkish',
		tt: 'Tatar',
		ug: 'Uighur',
		uk: 'Ukrainian',
		vi: 'Vietnamese',
		zh: 'Chinese Traditional',
		'zh-cn': 'Chinese Simplified'
	};

	var langsArray = [];

	for ( var code in CKEDITOR.lang.languages ) {
		langsArray.push( { code: code, name: ( langs[ code ] || code ) } );
	}

	langsArray.sort( function( a, b ) {
		return ( a.name < b.name ) ? -1 : 1;
	} );

	return langsArray;
} )();
