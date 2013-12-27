/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	// %REMOVE_START%
	config.plugins =
		'about,' +
		'a11yhelp,' +
		'basicstyles,' +
		//'bidi,' +
		'blockquote,' +
		'clipboard,' +
		'colorbutton,' +
		'colordialog,' +
		'contextmenu,' +
		'dialogadvtab,' +
		'div,' +
		'elementspath,' +
		'enterkey,' +
		'entities,' +
		//'filebrowser,'+
		'find,' +
		//'flash,' +
		'floatingspace,' +
		'font,' +
		'format,' +
		'forms,' +
		'horizontalrule,' +
		'htmlwriter,' +
		'image,' +
		'iframe,' +
		'indentlist,' +
		'indentblock,' +
		'justify,' +
		//'language,' +
		//'link,' +
		'list,' +
		'liststyle,' +
		'magicline,' +
		'maximize,' +
		//'newpage,' +
		//'pagebreak,' +
		'pastefromword,' +
		'pastetext,' +
		'preview,' +
		'print,' +
		'removeformat,' +
		'resize,' +
		'save,' +
		'selectall,' +
		'showblocks,' +
		'showborders,' +
		//'smiley,' +
		'sourcearea,' +
		'specialchar,' +
		'stylescombo,' +
		'tab,' +
		'table,' +
		'tabletools,' +
		//'templates,' +
		'toolbar,' +
		'undo,' +
		'wsc,' +
		'wysiwygarea';
	config.keystrokes=[
		                 	[ CKEDITOR.ALT + 121 /*F10*/, 'toolbarFocus' ],
		                	[ CKEDITOR.ALT + 122 /*F11*/, 'elementsPathFocus' ],

		                	[ CKEDITOR.SHIFT + 121 /*F10*/, 'contextMenu' ],
		                	[ CKEDITOR.CTRL + CKEDITOR.SHIFT + 121 /*F10*/, 'contextMenu' ],

		                	[ CKEDITOR.CTRL + 90 /*Z*/, 'undo' ],
		                	[ CKEDITOR.CTRL + 89 /*Y*/, 'redo' ],
		                	[ CKEDITOR.CTRL + CKEDITOR.SHIFT + 90 /*Z*/, 'redo' ],
		                	
		                	[ CKEDITOR.ALT + 69 /*E*/, 'pastetext' ],
		                	[ CKEDITOR.CTRL + CKEDITOR.SHIFT + 86 /*V*/, 'pastetext' ],
		                	
		                	[ CKEDITOR.CTRL + 66 /*B*/, 'save' ],
		                	
		                	[ CKEDITOR.CTRL + 76 /*L*/, 'find' ],
		                	[ CKEDITOR.CTRL + 85 /*U*/, 'replace' ],

		                	[ CKEDITOR.CTRL + 82 /*R*/, 'removeFormat' ],
		                	
		                	[ CKEDITOR.CTRL + 71 /*G*/, 'bold' ],
		                	[ CKEDITOR.CTRL + 78 /*N*/, 'bold' ],
		                	[ CKEDITOR.CTRL + 73 /*I*/, 'italic' ],
		                	[ CKEDITOR.CTRL + 85 /*U*/, 'underline' ],
		                	
		                	[ CKEDITOR.CTRL + CKEDITOR.ALT + 119 /*F8*/, 'source'],
		                	
		                	[ CKEDITOR.ALT + ( CKEDITOR.env.ie || CKEDITOR.env.webkit ? 189 : 109 ) /*-*/, 'toolbarCollapse' ],
		                	[ CKEDITOR.ALT + 48 /*0*/, 'a11yHelp' ]
		                ];
	  config.scayt_autoStartup = true;        
		
	  config.scayt_maxSuggestions = 4;       
	  config.scayt_defLang ="pt_BR";
	  config.scayt_sLang ="pt_BR";
	// %REMOVE_END%
};

// %LEAVE_UNMINIFIED% %REMOVE_LINE%
