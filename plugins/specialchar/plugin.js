﻿/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

/**
 * @fileOverview Special Character plugin
 */

CKEDITOR.plugins.add( 'specialchar', {
	// List of available localizations.
	// jscs:disable
	availableLangs: { af:1,ar:1,az:1,bg:1,ca:1,cs:1,cy:1,da:1,de:1,'de-ch':1,el:1,en:1,'en-au':1,'en-ca':1,'en-gb':1,eo:1,es:1,'es-mx':1,et:1,eu:1,fa:1,fi:1,fr:1,'fr-ca':1,gl:1,he:1,hr:1,hu:1,id:1,it:1,ja:1,km:1,ko:1,ku:1,lt:1,lv:1,nb:1,nl:1,no:1,oc:1,pl:1,pt:1,'pt-br':1,ro:1,ru:1,si:1,sk:1,sl:1,sq:1,sr:1,'sr-latn':1,sv:1,th:1,tr:1,tt:1,ug:1,uk:1,vi:1,zh:1,'zh-cn':1 },
	lang: 'af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
	// jscs:enable
	requires: 'dialog',
	icons: 'specialchar', // %REMOVE_LINE_CORE%
	hidpi: true, // %REMOVE_LINE_CORE%
	init: function( editor ) {
		var pluginName = 'specialchar',
			plugin = this;

		// Register the dialog.
		CKEDITOR.dialog.add( pluginName, this.path + 'dialogs/specialchar.js' );

		editor.addCommand( pluginName, {
			exec: function() {
				var langCode = editor.langCode;
				langCode =
					plugin.availableLangs[ langCode ] ? langCode :
					plugin.availableLangs[ langCode.replace( /-.*/, '' ) ] ? langCode.replace( /-.*/, '' ) :
					'en';

				CKEDITOR.scriptLoader.load( CKEDITOR.getUrl( plugin.path + 'dialogs/lang/' + langCode + '.js' ), function() {
					CKEDITOR.tools.extend( editor.lang.specialchar, plugin.langEntries[ langCode ] );
					editor.openDialog( pluginName );
				} );
			},
			modes: { wysiwyg: 1 },
			canUndo: false
		} );

		// Register the toolbar button.
		editor.ui.addButton && editor.ui.addButton( 'SpecialChar', {
			label: editor.lang.specialchar.toolbar,
			command: pluginName,
			toolbar: 'insert,50'
		} );
	}
} );

/**
 * The list of special characters visible in the "Special Character" dialog window.
 *
 *		config.specialChars = [ '&quot;', '&rsquo;', [ '&custom;', 'Custom label' ] ];
 *		config.specialChars = config.specialChars.concat( [ '&quot;', [ '&rsquo;', 'Custom label' ] ] );
 *
 * @cfg
 * @member CKEDITOR.config
 */
CKEDITOR.config.specialChars = [
	'!', '&quot;', '#', '$', '%', '&amp;', "'", '(', ')', '*', '+', '-', '.', '/',
	'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':', ';',
	'&lt;', '=', '&gt;', '?', '@',
	'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
	'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
	'[', ']', '^', '_', '`',
	'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
	'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
	'{', '|', '}', '~',
	'&euro;', '&lsquo;', '&rsquo;', '&ldquo;', '&rdquo;', '&ndash;', '&mdash;', '&iexcl;', '&cent;', '&pound;',
	'&curren;', '&yen;', '&brvbar;', '&sect;', '&uml;', '&copy;', '&ordf;', '&laquo;', '&not;', '&reg;', '&macr;',
	'&deg;', '&sup2;', '&sup3;', '&acute;', '&micro;', '&para;', '&middot;', '&cedil;', '&sup1;', '&ordm;', '&raquo;',
	'&frac14;', '&frac12;', '&frac34;', '&iquest;', '&Agrave;', '&Aacute;', '&Acirc;', '&Atilde;', '&Auml;', '&Aring;',
	'&AElig;', '&Ccedil;', '&Egrave;', '&Eacute;', '&Ecirc;', '&Euml;', '&Igrave;', '&Iacute;', '&Icirc;', '&Iuml;',
	'&ETH;', '&Ntilde;', '&Ograve;', '&Oacute;', '&Ocirc;', '&Otilde;', '&Ouml;', '&times;', '&Oslash;', '&Ugrave;',
	'&Uacute;', '&Ucirc;', '&Uuml;', '&Yacute;', '&THORN;', '&szlig;', '&agrave;', '&aacute;', '&acirc;', '&atilde;',
	'&auml;', '&aring;', '&aelig;', '&ccedil;', '&egrave;', '&eacute;', '&ecirc;', '&euml;', '&igrave;', '&iacute;',
	'&icirc;', '&iuml;', '&eth;', '&ntilde;', '&ograve;', '&oacute;', '&ocirc;', '&otilde;', '&ouml;', '&divide;',
	'&oslash;', '&ugrave;', '&uacute;', '&ucirc;', '&uuml;', '&yacute;', '&thorn;', '&yuml;', '&OElig;', '&oelig;',
	'&#372;', '&#374', '&#373', '&#375;', '&sbquo;', '&#8219;', '&bdquo;', '&hellip;', '&trade;', '&#9658;', '&bull;',
	'&rarr;', '&rArr;', '&hArr;', '&diams;', '&asymp;'
];
