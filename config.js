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
		// 'contextmenu,' +
		'dialogadvtab,' +
		'div,' +
		'elementspath,' +
		'enterkey,' +
		'entities,' +
		'filebrowser,' +
		'find,' +
		'flash,' +
		// 'floatingspace,' +
		'font,' +
		'format,' +
		'forms,' +
		'horizontalrule,' +
		'htmlwriter,' +
		// 'image,' +
		'iframe,' +
		'indentlist,' +
		'indentblock,' +
		'justify,' +
		'language,' +
		'link,' +
		'linkutils,' +
		'list,' +
		// 'liststyle,' +
		'magicline,' +
		'maximize,' +
		'newpage,' +
		'pagebreak,' +
		'pastefromword,' +
		'pastetext,' +
		// 'preview,' +
		// 'print,' +
		'removeformat,' +
		// 'resize,' +
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
		// 'table,' +
		// 'tabletools,' +
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

	config.disallowedContent = 'a{*}';

	// TODO
	// Is this the best place to put this function
	// http://stackoverflow.com/questions/12676023/ckeditor-link-dialog-removing-protocol
	CKEDITOR.on('dialogDefinition', function(e) {
		// NOTE: this is an instance of CKEDITOR.dialog.definitionObject
		var dd = e.data.definition;

		// 1. remove other tabs and hide some input fields
		if (e.data.name === 'link') {
			dd.minHeight = 30;

			// remove the unwanted tabs
			dd.removeContents('advanced');
			dd.removeContents('target');
			dd.removeContents('upload');

			var infoTab = dd.getContents('info');
			// a workaround because of this bug
			// http://dev.ckeditor.com/ticket/12287
			// http://ckeditor.com/forums/Plugins/Problems-removing-dialog-fields-of-link-plugin-in-4.4.3
			infoTab.get( 'linkType' ).style = 'display: none';
			infoTab.get( 'urlOptions' ).children[ 0 ].children[ 0 ].style = 'display: none';

			// Set the default value for the URL field.
			var urlField = infoTab.get( 'url' );
			urlField['default'] = 'www.example.com';

		}

		// 2. Move the dialog to the center of the editor
		// Save a copy of the onshow function
		var onShowSaved = function(){};
		if (typeof dd.onShow !== 'undefined' && typeof dd.onShow.call === 'function') {
			onShowSaved = dd.onShow;
		}

		// http://stackoverflow.com/questions/4984338/ckeditor-dialog-positioning
		// somehow moving this into the dialog.on('show', callback) does NOT work
		dd.onShow = function() {
			// Make sure the onShowSaved is called
			var result = onShowSaved.call(this);

			var dialogSize = this.getSize(),
				container = e.editor.container.$, // $ is The native DOM object
				editor = container.getBoundingClientRect(),
				newPos;

			// When the editor fits into one screen
			if ( editor.top > 0 ) {
				newPos = {
					top: editor.top + editor.height/2 - dialogSize.height/2,
					left: editor.left + editor.width/2 - dialogSize.width/2
				};
			} else {
				var adjustedHeight = editor.top + editor.height;
				newPos = {
					top: adjustedHeight/2 - dialogSize.height/2,
					left: editor.left + editor.width/2 - dialogSize.width/2
				};
			}

			this.move(newPos.left, newPos.top);
			return result;
		};

		// 3. stopPropagation is necessary to prevent player from firing toggleEdit events
		// presumably, stopPropagation on body should be sufficient by itself
		var dialog = e.data.definition.dialog;
		var stopPropagation = function(e){
			e.stopPropagation();
		};
		dialog.on('show', function () {
			document.body.addEventListener('click', stopPropagation);
		});
		// needs to delay it by using setTimeout zero
		dialog.on('hide', function () {
			setTimeout(function(){
				document.body.removeEventListener('click', stopPropagation);
			}, 0);
		});
	});
};

// %LEAVE_UNMINIFIED% %REMOVE_LINE%
