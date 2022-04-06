function switchMe(editor, callback) {

	window.isToolbarChange = true;
	window.editorInstance = editor;

	var toolbarSize = editor.config.toolbarStatus;
	var toolbarStatus = '';
	var origSmallToolbar = editor.config.smallToolbar;
	var origMaximizedToolbar = editor.config.maximizedToolbar;
	var newToolbar;
	if (toolbarSize === 'smallToolbar') {
		editor.config.toolbar = origMaximizedToolbar;
		editor.config.toolbarStatus = 'maximizedToolbar';
	} else {
		editor.config.toolbar = origSmallToolbar;
		editor.config.toolbarStatus = 'smallToolbar';
	}

	var customConfig = editor.config;

	// Copy data to original text element before getting rid of the old editor
	var data = editor.getData();
	var domTextElement = editor.element.$;
	domTextElement.value = data;
	if (domTextElement.name === '') {
		domTextElement.name = editor.name;
	}
	// Remove old editor and the DOM elements, else you get two editors
	var editorUniqId = editor.name;
	var variable = editor.config.currentVariable;
	var elementTrigger = editor.config.elementTrigger;
	var elementTriggerIndex = editor.config.elementTriggerIndex;
	//var editorElement = document.querySelector('#editorToolbar');
	editor.destroy(true);
	if (editor.config.isWysiwyg) {
		CKEDITOR.inline(editorUniqId, customConfig);
		editor = CKEDITOR.instances[editorUniqId];
		var warnings = null;

		var counterElement = document.querySelector('.' + editorUniqId + '-counter');
		var notificationsElement = document.querySelector('.' + editorUniqId + '-notification');

		editor.on('instanceReady', function (e) {
			if (callback) {
				callback.call(null, e);
			}
			//add notification to editor
			var notifications_area = document.querySelector('.cke_notifications_area');
			if (notifications_area !== null) {
				notifications_area.innerHTML = '';
			}
			warnings = window.checkEditorValidation(editor, variable, counterElement, notificationsElement);
			window.editorInstance = editor;
		});
		editor.on('change', function () {
			var notifications_area = document.querySelector('.cke_notifications_area');
			if (notifications_area !== null) {
				notifications_area.innerHTML = '';
			}
			warnings = window.checkEditorValidation(editor, variable, counterElement, notificationsElement);
			window.trackCKEditorsChange(editor, elementTrigger, elementTriggerIndex, variable, false);
			window.editorInstance = editor;
		});
		editor.on('afterCommandExec', function () {
			window.isToolbarChange = true;
			window.editorInstance = editor;
		});
	}
	// else {
	// when using toolbarswitch on angular ckeditor
	// 	CKEDITOR.replace(editorUniqId, customConfig);
	// 	editor = CKEDITOR.instances[editorUniqId];
	// 	editor.on('instanceReady', function (e) {
	// 		CKeditor_OnComplete(e.editor);
	// 		if (callback) {
	// 			callback.call(null, e);
	// 		}
	// 		if (editor.config.toolbarStatus === 'maximizedToolbar') {
	// 			document.querySelector('.cke_button__toolbarswitch_icon').classList.add('bigToolbar');
	// 		} else {
	// 			document.querySelector('.cke_button__toolbarswitch_icon').classList.remove('bigToolbar');
	// 		}
	// 	});
	// }
}

CKEDITOR.plugins.add('toolbarswitch', {
	requires: ['button', 'toolbar', 'maximize'],
	lang: 'af,ar,bg,bn,bs,ca,cs,cy,da,de,el,en,en-au,en-ca,en-gb,eo,es,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
	icons: 'about', // %REMOVE_LINE_CORE%
	hidpi: true, // %REMOVE_LINE_CORE%
	init: function (editor) {
		var lang = editor.lang;
		var commandFunction = {
			exec: function (editor) {
				switchMe(editor, function (e) {
					var newEditor = e.editor;
					newEditor.fire('triggerResize');
				});
			}
		}
		var command = editor.addCommand('toolbarswitch', commandFunction);
		command.modes = {wysiwyg: 1, source: 1};
		command.canUndo = false;
		command.readOnly = 1;

		editor.ui.addButton && editor.ui.addButton('Toolbarswitch', {
			label: editor.config.toolbarStatus,
			command: 'toolbarswitch',
			toolbar: 'tools,10',
			icon: this.path + 'icons/toolbarswitch.svg'
		});
	}
});
