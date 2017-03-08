(function() {
	var removePgbrReg = /<pgbr[^>][^>]*>(.*?)<\/pgbr>/g;

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

			editor.on('paste', function(event) {
				event.data.dataValue = event.data.dataValue.replace(removePgbrReg, '');
			});
		}
	});
})();

