(function () {
	CKEDITOR.plugins.add('generatepassage', {
		lang: 'en',
		icons: 'awesome',
		hidpi: false,
		requires: '',
		init: function (editor) {
			editor.addCommand('generatePassage', {
				exec: function(editor) {
					editor.insertText('Generated passage here.');
				}
			});

			// required to override ckeditor's display: none for text
			CKEDITOR.on('instanceReady', function(event) {
				let button = event.editor.container.$.querySelector('.cke_button__generatepassage');
				if (button) {
					let label = button.querySelector('.cke_button_label');
					if (label) {
						label.style.display = 'inline';
						label.style.cursor = 'pointer';
					}
				}
			});

			editor.ui.addButton('generatepassage', {
				label: 'Generate Passage',
				command: 'generatePassage',
				toolbar: 'generatepassage',
				icon: 'awesome'
			});
		}
	});
})();
