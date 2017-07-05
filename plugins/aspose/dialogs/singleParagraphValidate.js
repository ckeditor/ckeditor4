(function () {
	CKEDITOR.dialog.add( 'singleParagraphValidate', function( editor ) {
		return {
			title:          'Multiple types of content warning',
			resizable:      CKEDITOR.DIALOG_RESIZE_BOTH,
			minWidth:       300,
			minHeight:      100,
			onShow: function() {
				// var errors = document.getElementById('singleparagraphValidate_errors');
                //
				// errors.innerHTML = CKEDITOR._.errors.join('\n');

				var buttonOk = document.querySelector('a.cke_dialog_ui_button_ok');

				buttonOk.style.backgroundColor = '#1487f5';
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
								'<h3>Multiple types of content are detected (text, tables, multiple paragraphs).</h3>' +
								'<h3>Only one of these can be inserted in a single action. First section will be</h3>' +
								'<h3>inserted. Please insert remainder as separate discussions.</h3>' +
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
	var innerHTML = '';
	var children = $html.children();

	children = $html.children();

	if (children.length > 1 || ['DIV'].indexOf(children[0].tagName) !== -1) {
		if (['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7'].indexOf(children[0].tagName) !== -1) {
			$html.find('table').remove();
			children = $html.children();

			children.each(function(index) {
				if (['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7'].indexOf(this.tagName) !== -1) {
					innerHTML += this.innerHTML;
				} else {
					innerHTML += this.outerHTML;
				}

				if (index !== children.length - 1) {
					if (this.innerHTML !== '<br>' && this.innerText.trim().length) {
						innerHTML += '<br>'
					}
				}

				if (index) {
					this.parentNode.removeChild(this);
				}
			});

			children[0].innerHTML = innerHTML;
		} else {
			children = $html.children();
			children.each(function(index) {
				if (index) {
					this.parentNode.removeChild(this);
				}
			});
		}

	} else if (['OL', 'UL'].indexOf(children[0].tagName) !== -1 && children[0].children.length > 1) {
		$(children[0]).children().each(function(index) {
			if (index) {
				this.parentNode.removeChild(this);
			}
		})
	}

	editor.setData($html.html());
}
