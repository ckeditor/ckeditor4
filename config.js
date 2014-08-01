/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
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
		'bidi,' +
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
		'filebrowser,'+
		'find,' +
		'flash,' +
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
		'language,' +
		'link,' +
		'list,' +
		'liststyle,' +
		'magicline,' +
		'maximize,' +
		'newpage,' +
		'pagebreak,' +
		'pastefromword,' +
		'pastetext,' +
		'preview,' +
		'print,' +
		'removeformat,' +
		'resize,' +
		'save,' +
		'selectall,' +
		'sharedspace,' +
		'showblocks,' +
		'showborders,' +
		'smiley,' +
		'sourcearea,' +
		'specialchar,' +
		'stylescombo,' +
		'tab,' +
		'table,' +
		'tabletools,' +
		'templates,' +
		'toolbar,' +
		'undo,' +
		'wysiwygarea';
	// %REMOVE_END%

	//http://ckeditor.com/forums/CKEditor/Complete-list-of-toolbar-items
	config.toolbar_Full = [
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ],
			items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'Subscript',
					'Superscript', 'RemoveAllFormat' ] },
		{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align' ],
			items: [ 'NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote',
					'JustifyLeft', 'JustifyRight', 'BidiLtr', 'BidiRtl' ] },
		{ name: 'styles', items: [ 'Link', 'Font', 'Styles' ] }
	];

	config.toolbar = "Full";

	config.extraPlugins = 'removeallformat';

	config.skin = 'versal';

	config.stylesSet = [
		{ name: 'Small', element: 'span', styles: {'font-size':'12px'} },
		{ name: 'Normal', element: 'span', styles: {'font-size':'16px'} },
		{ name: 'Large', element: 'span', styles: {'font-size':'24px'} },
		{ name: 'Special Container',
			element: 'div',
			styles: {
				padding: '5px 10px',
				background: '#eee',
				border: '1px solid #ccc'
			}
		}
	];
};

// %LEAVE_UNMINIFIED% %REMOVE_LINE%
