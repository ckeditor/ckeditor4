(function () {
	CKEDITOR.dialog.add( 'singleParagraphValidate', function( editor ) {
		return {
			title:          'Test Dialog',
			resizable:      CKEDITOR.DIALOG_RESIZE_BOTH,
			minWidth:       300,
			minHeight:      100,
			contents: [
				{
					id:         'tab1',
					label:      'First Tab',
					accessKey:  'Q',
					elements: [
						{
							type: 'html',
							html: '<h3>This is some sample HTML content.</h3>'
						}
					]
				}
			],
			onOk: function() {
				var $content = $(editor.element.$);

				useOnlyOneParagraph($content);
			},
			onCancel: function() {
				editor.execCommand('undo');
			}
		};
	} );
})();

function useOnlyOneParagraph($html) {
	$html.find('div').replaceWith(function() {
		return this.innerHTML;
	});

	var innerHTML = '';
	var children = $html.children();

	children = $html.children();

	if (children.length > 1 && ['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7'].indexOf(children[0].tagName) !== -1) {
		children.each(function(index) {
			if (['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7'].indexOf(this.tagName) !== -1) {
				innerHTML += this.innerHTML;
			} else if (this.tagName === 'TABLE') {
				// don't copy table
			} else if (['UL', 'OL'].indexOf(this.tagName) !== -1) {
				_.forEach(this.children, function(child, i) {
					innerHTML += child.innerHTML;
				})
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
	}
}
