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

	// TODO
	// Is this the best place to put this function
	// http://stackoverflow.com/questions/12676023/ckeditor-link-dialog-removing-protocol
	CKEDITOR.on('dialogDefinition', function(e) {
		// NOTE: this is an instance of CKEDITOR.dialog.definitionObject
		var dd = e.data.definition;

		if (e.data.name === 'link') {
			dd.minHeight = 30;

			// remove the unwanted tabs
			dd.removeContents('advanced');
			dd.removeContents('target');
			dd.removeContents('upload');

			var infoTab = dd.getContents('info');
			// TODO
			// not working due to a bug in 4.4.3
			// http://ckeditor.com/forums/Plugins/Problems-removing-dialog-fields-of-link-plugin-in-4.4.3
			//
			// remove some elements from the 'info' tab
			// http://rev.ckeditor.com/ckeditor/trunk/7596/_samples/api_dialog.html
			// infoTab.remove( 'linkType' );
			// infoTab.remove( 'protocol' );

			// Set the default value for the URL field.
			var urlField = infoTab.get( 'url' );
			urlField['default'] = 'www.example.com';

		}
	});
};

// %LEAVE_UNMINIFIED% %REMOVE_LINE%
