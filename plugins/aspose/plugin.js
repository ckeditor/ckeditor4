CKEDITOR.plugins.add('aspose', {

	init: function (editor) {
		editor.on('selectionChange', function (event) {
			var path = event.data.path;

			if (path.elements && path.elements.some(function(element) { return element.getName() === 'table'; })) {
				editor.getCommand('pagebreak').disable();
			} else {
				editor.getCommand('pagebreak').enable();
			}
		});
	}
});
