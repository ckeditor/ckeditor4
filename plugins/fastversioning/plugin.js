CKEDITOR.config.allowedContent = true;
CKEDITOR.config.extraAllowedContent = 'span(fast-versioning)';

window.addEventListener('message', function (event) {
	if (event.data.hasOwnProperty('action') && event.data.hasOwnProperty('activeTrigger')) {
		if (event.data.action === 'closeAngularDialog' && event.data.angularModal === 'fastVersioning') {
			var editorInstance = event.data.editor;
			var selectedEditor = CKEDITOR.instances[editorInstance];
			var displayText = event.data.value;
			if(displayText) {
				var tag = selectedEditor.document.createElement('span', {
					attributes: {
						'class': 'fast-versioning'
					}
				});
				tag.setAttribute('contentEditable', false);
				tag.setHtml(displayText);
				selectedEditor.insertElement(tag);
			}
			selectedEditor.focus();
		}
	}
});

CKEDITOR.addCss(
	'.fast-versioning {' +
	'padding: 3px 5px;' +
	'background: #F7F9FC;' +
	'border: 1px solid #E4E9F2;' +
	'border-radius: 4px;' +
	'user-select: none;' +
	'color: #000' +
	'}'
);

if (!window.isWYSIWYG) {
// on variable selection - add it to the content
	var subscription;

	function subscribeToChanges() {
		if (!window.ckeditorSubscriber) return;
		if (subscription && subscription.unsubscribe) subscription.unsubscribe();
		subscription = window.ckeditorSubscriber.subscribe(function (data) {
			var selectedEditor = data.editor;
			var displayText = data.value;
			if(displayText) {
				var tag = selectedEditor.document.createElement('span', {
					attributes: {
						'class': 'fast-versioning'
					}
				});
				tag.setAttribute('contentEditable', false);
				tag.setHtml(displayText);
				selectedEditor.insertElement(tag);
			}
			selectedEditor.focus();
		});
	}

	subscribeToChanges();
}

CKEDITOR.plugins.add('fastversioning', {
	icons: 'about',
	lang: 'en',
	init: function (editor) {
		if (window.versionId) return; // on version edit - dont show this
		// Add button
		editor.ui.addButton('Fastversioning', {
			label: 'Insert dynamic variables',
			command: 'insertFastversioning',
			toolbar: 'colors',
			icon: this.path + 'icons/fastversioning.svg'
		});

		// click will open fast versioning dialog
		editor.addCommand('insertFastversioning', {
			exec: function (editor) {
				if (window.isWYSIWYG) {
					var dataMassage = {
						action: 'openAngularDialog',
						editorInstance: editor.name,
						angularDialog: 'fastVersioning',
						activeTrigger: 'ckeditorPlugin',
						activeTriggerIndex: null
					}

					window.postMessage(dataMassage, "*");
					window.isToolbarChange = true;
				}
				else {
					window.showFastVersioningDialog(editor);
					window.ckeditorSubscriber = editor;
				}
			}
		})

	}
});

