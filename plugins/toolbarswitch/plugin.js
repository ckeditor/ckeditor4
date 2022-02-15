/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview  Plugin that changes the toolbar and maximizes the editor
 *                for the big toolbar.
 *
 *                You need a custom config to define the small and big toolbars.
 *                Also the maximize plug-in is needed but not the maximize button.
 *                For this plugin you should use the 'Toolbarswitch' button instead.
 *
 *                CKEDITOR.replace('sometextcomponentname', {
 *               		customConfig: '/...custom_ckeditor_config.js'
 *               		toolbar: 'yoursmalltoolbarname',
 *               		smallToolbar: 'yoursmalltoolbarname',
 *               		maximizedToolbar: 'yourbigtoolbarname' });
 *
 *                Requires:
 *                - Maximize plugin. But not the button that goes with it.
 *                - All toolbars used in the ckeditor instance have to use the 'Toolbarswitch' button instead.
 *                - A custom config to define the small and big toolbars.
 *                - function CKeditor_OnComplete(ckEditorInstance){ ... your own custom code or leave empty... }
 *                  This was added to the plugin for those that wrap the ckeditor in other java script to shield
 *                  the rest of their code from ckeditor version particularities.
 *                - jQuery
 */


function switchMe(editor, callback) {

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
			CKeditor_OnComplete(e.editor);
			if (callback) {
				callback.call(null, e);
			}
			if (editor.config.toolbarStatus === 'maximizedToolbar') {
				document.querySelector('.cke_button__toolbarswitch_icon').classList.add('bigToolbar');
			}
			else {
				document.querySelector('.cke_button__toolbarswitch_icon').classList.remove('bigToolbar');
			}
			//add notification to editor
			var notifications_area = document.querySelector('.cke_notifications_area');
			if (notifications_area !== null) {
				notifications_area.innerHTML = '';
			}
			warnings = checkEditorValidation(editor, variable, counterElement, notificationsElement);
		});
		editor.on('change', function () {
			var notifications_area = document.querySelector('.cke_notifications_area');
			if (notifications_area !== null) {
				notifications_area.innerHTML = '';
			}
			warnings = checkEditorValidation(editor, variable, counterElement, notificationsElement);
			trackCKEditorsChange(editor, elementTrigger, elementTriggerIndex, variable, false);
		});
		editor.on('blur', function () {
			trackCKEditorsChange(editor, elementTrigger, elementTriggerIndex, variable, true);
		});
	} else {
		CKEDITOR.replace(editorUniqId, customConfig);
		editor = CKEDITOR.instances[editorUniqId];
		editor.on('instanceReady', function (e) {
			CKeditor_OnComplete(e.editor);
			if (callback) {
				callback.call(null, e);
			}
			if (editor.config.toolbarStatus === 'maximizedToolbar') {
				document.querySelector('.cke_button__toolbarswitch_icon').classList.add('bigToolbar');
			}
			else {
				document.querySelector('.cke_button__toolbarswitch_icon').classList.remove('bigToolbar');
			}
		});
	}
}

function checkEditorValidation(editor, variable, counterElement, notificationsElement) {
	if (variable.type !== 'editor-basic') return null;
	var textLength = getEditorTextLength(editor.getData());
	if (variable.validation.max) {
		counterElement.innerHTML = textLength + '/' + variable.validation.max;
	}
	if (textLength > 0) {
		warnings = getWarnings(variable, textLength);
		if (warnings !== null) {
			notificationsElement.innerText = '👉' + warnings;
			notificationsElement.classList.add('error');
			counterElement.classList.add('error');
		} else {
			notificationsElement.innerText = '';
			notificationsElement.classList.remove('error');
			counterElement.classList.remove('error');
		}
	}
	return warnings;
}

function getWarnings(variable, textLength) {

	if (variable.validation && variable.validation.max && textLength >= +variable.validation.max) {
		return "Recommended max text length: " + variable.validation.max + "characters";
	}
	if (variable.validation && variable.validation.min && textLength <= +variable.validation.min) {
		return "Recommended min text length " + variable.validation.min + "characters";
	}
	return null;
}

function getEditorTextLength(editorData) {
	var el = document.createElement('div');
	el.innerHTML = editorData;
	txtLength = el.innerText.length;
	return txtLength;
}

function trackCKEditorsChange(editor, activeTrigger, activeTriggerIndex, variable, saveChanges) {

	var action = 'editorChanges';
	var value = '';

	value = editor.getData();

	var dataMassage = {
		action: action,
		activeTrigger: activeTrigger,
		activeTriggerIndex: activeTriggerIndex,
		variable: variable.name,
		value: value,
		saveChanges: saveChanges
	}
	window.postMessage(dataMassage, "*");

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
			label: lang.toolbarswitch.toolbarswitch,
			command: 'toolbarswitch',
			toolbar: 'tools,10',
			icon: this.path + 'icons/toolbarswitch.svg'
		});
	}
});


function CKeditor_OnComplete() {
};
