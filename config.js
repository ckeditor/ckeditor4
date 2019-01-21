/**
 * Copyright (c) 2003-2017, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	// %REMOVE_START%
	config.plugins =
		'aspose,' +
		'tableresize,' +
		'copyformatting,' +
		'pagebreak,' +
		'placeholder,' +
		'base64image,' +
		'basicstyles,' +
		'blockquote,' +
		'cancelChanges,' +
		'clipboard,' +
		'sharedspace,' +
		'colorbutton,' +
		'confighelper,' +
		'contextmenu,' +
		'divarea,' +
		'enterkey,' +
		'entities,' +
		'filebrowser,' +
		'find,' +
		'floatingspace,' +
		'font,' +
		'format,' +
		'horizontalrule,' +
		'htmlwriter,' +
		'indentblock,' +
		'indentlist,' +
		'indenttab,' +
		'justify,' +
		'link,' +
		'list,' +
		'lite,' +
		'maximize,' +
		'panelbutton,' +
		'pastefromword,' +
		'pastefromexcel,' +
		'pastetext,' +
		'removeformat,' +
		'showborders,' +
		'sourcearea,' +
		'specialchar,' +
		'stylescombo,' +
		'tab,' +
		'table,' +
		'tabletools,' +
		'tabletoolstoolbar,' +
    'toolbar,' +
    'smartfields,' +
		'undo';
	config.languages = {
		en : 1
	};

	config.format_tags = 'p;h1;h2;h3;h4;h5;h6;pre;div';
	config.title = false;

	// indents for correct table with calculation when create
	config.editor_indents = 100;

	// '*(*);*{*}' allows any class and any inline style.
	config.extraAllowedContent = '*[data-placeholder-id, data-style, data-id, list-item, table-parent-id, par-style, start, type, contenteditable, href, content-editable]; *(*); *{*}; span(*); table[cellspacing, cellpadding]; tr; td; tbody; div;h1;h2;h3;h4;h5;h6; a;pgbr;';

	// Disable auto remove empty span
	CKEDITOR.dtd.$removeEmpty.span = 0;

	// Simplify the dialog windows.
	config.removeDialogTabs = 'image:advanced;link:advanced';
	config.colorButton_colors = '000000,434343,666666,999999,B7B7B7,CCCCCC,D9D9D9,EFEFEF,F3F3F3,F2F3F4,980000,FF0000,FF9901,FFFF02,00FF00,00FFFF,4A86E8,0000FF,9900FF,FF00FF,E6B8AF,F4CCCB,FC35CD,FFF2CC,D9E9D3,CF30E3,C8DAF8,CEE2F3,D9D2E9,EAD1DC,DD7E6B,EA9999,F9CA9C,FFE599,B6D7A8,A2C4C9,A4C2F4,9FC4E7,B4A7D5,D5A6BD,cc4125,e06666,f6b269,ffd966,93c47d,75a5af,6d9deb,6fa8dc,8e7cc3,c27b9f,a61c00,cb1b00,e69037,f1c232,6aa84e,44818e,3b78d8,3d85c6,674fa7,a54d79,84200c,991201,b45f05,bf9000,38761d,144f5c,1255cc,0a5293,341c75,741b47,5b0f00,660800,784005,7f6000,264f13,0d333d,1c4487,073763,20124d,4c1330';
	config.coreStyles_bold = { element: 'span', styles: { 'font-weight': 'bold' }, overrides: 'b' };
	config.coreStyles_italic = { element: 'span', styles: { 'font-style': 'italic' }, overrides: 'em' };
	config.coreStyles_underline = { element: 'span', styles: { 'text-decoration': 'underline' }, overrides: 'u' };

	config.pasteDisallowContent = '*[data-id, table-parent-id, table-id, par-style, class, data-placeholder-id]; p';
	config.pasteFromWordRemoveFontStyles = false;
	config.pasteFromWordRemoveStyles = false;

	config.fontSize_sizes="5/5pt;" +
		"5.5/5.5pt;" +
		"6/6pt;" +
		"6.5/6.5pt;" +
		"7/7pt;" +
		"7.5/7.5pt;" +
		"8/8pt;" +
		"8.5/8.5pt;" +
		"9/9pt;" +
		"10/10pt;" +
		"10.5/10.5pt;" +
		"11/11pt;" +
		"12/12pt;" +
		"13/13pt;" +
		"14/14pt;" +
		"16/16pt;" +
		"18/18pt;" +
		"20/20pt;" +
		"22/22pt;" +
		"24/24pt;" +
		"26/26pt;" +
		"28/28pt;" +
		"36/36pt;" +
		"48/48pt;" +
		"72/72pt";

	config.fontSize_style = {
		element: 'span',
		styles: { 'font-size': '#(size)' },
		elements: ['p', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
		overrides: [ {
			element: 'font', attributes: { 'size': null }
		} ]
	};

	config.font_names = 'Arial;' +
		'Comic Sans MS;' +
		'Lucida Console;' +
		'Calibri;' +
		'Calibri Light;' +
		'Courier New;' +
		'Georgia;' +
		'Lucida Sans Unicode;' +
		'Railroad Gothic;' +
		'Railroad Gothic Com;' +
		'Tahoma;' +
		'Times New Roman;' +
		'Times;' +
		'Trebuchet MS;' +
    'Verdana;' + 
    'Lato;';

	config.font_style = {
		element: 'span',
		elements: ['p', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
		styles: { 'font-family': '#(family)' },
		overrides: [ {
			element: 'font', attributes: { 'face': null }
		} ]
	};

	config.indentOffset = 36;
	config.indentUnit = 'pt';

	var lite = config.lite = config.lite || {};

	lite.isTracking = false;
	lite.userStyles = {
		"21": 3,
		"15": 1,
		"18": 2
	};
	lite.tooltips = {
		show: false
	}
};
