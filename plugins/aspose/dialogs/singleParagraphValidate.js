(function () {
	CKEDITOR.dialog.add( 'singleParagraphValidate', function( editor ) {
		return {
			title:          'Test Dialog',
			resizable:      CKEDITOR.DIALOG_RESIZE_BOTH,
			minWidth:       300,
			minHeight:      100,
			onShow: function() {
				var errors = document.getElementById('singleparagraphValidate_errors');

				errors.innerHTML = CKEDITOR._.errors.join('\n');
			},
			contents: [
				{
					id:         'singlepv',
					label:      'First Tab',
					accessKey:  'Q',
					elements: [
						{
							id: 'msg',
							type: 'html',
							html: '<div>' +
								'<h3>This is some sample HTML content.</h3>' +
								'<h3>Errors list</h3>' +
								'<div id="singleparagraphValidate_errors"></div>' +
							'</div>'
						}
					]
				}
			],
			onOk: function() {
				var $editor = $(editor.editable().$).clone();

				useOnlyOneParagraph(editor, $editor);
			},
			onCancel: function() {
				editor.execCommand('undo');
			}
		};
	} );
})();

function useOnlyOneParagraph(editor, $html) {
	$html.find('div').replaceWith(function() {
		return this.innerHTML;
	});

	var innerHTML = '';
	var children = $html.children();

	children = $html.children();

	if (children.length > 1 && ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7'].indexOf(children[0].tagName) !== -1) {
		$html.find('table').remove();
		children = $html.children();
		children.each(function(index) {
			if (['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7'].indexOf(this.tagName) !== -1) {
				innerHTML += this.innerHTML;
			} else if (['UL', 'OL'].indexOf(this.tagName) !== -1) {
				for(var i = 0; i < this.children.length; i++) {
					innerHTML += this.children[i].innerHTML;
				}
			} else {
				innerHTML += this.outerHTML;
			}

			if (index !== children.length - 1) {
				if (this.innerHTML !== '<br>') {
					innerHTML += '<br>'
				}
			}

			if (index) {
				this.parentNode.removeChild(this);
			}
		});

		children[0].innerHTML = innerHTML;
	} else if(children[0].tagName !== 'table' && $html.text().length > $html.find('table').text().length) {
		$html.find('table').remove();
	}

	editor.setData($html.html());
}
