(function () {
	CKEDITOR.plugins.add('generatepassage', {
		lang: 'en',
		icons: 'awesome',
		hidpi: false,
		requires: 'widget,qti_common',
		onLoad: function() {
			CKEDITOR.addCss('.cke_button_label.cke_button__generatepassage { display: inline; }');
		},
		init: function (editor) {
			editor.addCommand('generatePassage', {
				exec: function(editor) {
					editor.insertText('Generated passage here.');
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
