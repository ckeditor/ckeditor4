(function() {
	var removePgbrReg = /<pgbr[^>][^>]*>(.*?)<\/pgbr>/g;
	var STYLES_THAT_NEED_SET_AS_DEFAULT = ['font-size', 'font-weight', 'font-family', 'font-style'];
	var throttle = false;

	function defaultStyle(editor, defaultStyles) {
		var self = this;

		this.defaultStyles = defaultStyles || {};
		this.styleNamesThatNeedSet = [];
		this.editor = editor;

		for(var i = 0; i < STYLES_THAT_NEED_SET_AS_DEFAULT.length; i++) {
			if (this.defaultStyles[STYLES_THAT_NEED_SET_AS_DEFAULT[i]]) {
				this.styleNamesThatNeedSet.push(STYLES_THAT_NEED_SET_AS_DEFAULT[i]);
			}
		}

		this.styleNamesThatNeedSet.length && editor.on('key', function(event) {
			if (event.data.domEvent.$.key.length === 1) {
				self.setDefaultStyles();
			}
		})
	}

	function validateParagraph($editor) {
		var POSSIBLE_ERRORS = [
			'more than one element first level',
			'have table inside',
			'have div inside',
			'have more than one list'
			// 'have list inside'
		];
		var errors = [];
		var children = $editor.children();

		if ($editor.children().length > 1) {
			errors.push(POSSIBLE_ERRORS[0])
		}

		if ($editor.find('* table').length && $editor.text().length > $editor.find('table').text().length) {
			errors.push(POSSIBLE_ERRORS[1])
		}

		if ($editor.find('div').length) {
			errors.push(POSSIBLE_ERRORS[2])
		}

		if (['OL', 'UL'].indexOf(children[0].tagName) !== -1 && children[0].children.length > 1) {
			errors.push(POSSIBLE_ERRORS[3])
		}

		// if ($editor.find('p ol, p ul').length) {
		// 	errors.push(POSSIBLE_ERRORS[4])
		// }

		return errors;
	}

	defaultStyle.prototype = {
		/**
		 * make style name from dash to camelCase
		 * example: "font-size" => "fontSize"
		 * @param name
		 */
		normalizeStyleName: function(name) {
			return name.replace(/-([a-z])/, function(match, letter) {
				return letter.toUpperCase();
			});
		},


		getStylesThatNeedApply: function() {
			var range = this.editor.getSelection().getRanges()[0];
			var editorDOMContainer = this.editor.editable().$;
			var container = range.startContainer.$;
			var stylesThatNeedApply = this.styleNamesThatNeedSet.slice(0);

			if (container === range.endContainer.$ && container !== editorDOMContainer) {
				while(container !== editorDOMContainer && container !== range.document && stylesThatNeedApply.length) {
					if (container.nodeType === 1) {
						for(var i = 0; i < stylesThatNeedApply.length; i++) {
							if (this.hasStyle(container, stylesThatNeedApply[i])) {
								stylesThatNeedApply.splice(i--, 1);
							}
						}
					}

					container = container.parentNode;
				}
			}

			return stylesThatNeedApply;
		},

		hasStyle: function(element, style) {
			return element.style[this.normalizeStyleName(style)];
		},

		makeStyleObject: function(styleNames) {
			var styleObj = {};

			for(var i = 0; i < styleNames.length; i++) {
				styleObj[styleNames[i]] = this.defaultStyles[styleNames[i]];
			}

			return styleObj;
		},

		setDefaultStyles: function() {
			var styles = this.getStylesThatNeedApply();

			if (styles.length) {
				var style = new CKEDITOR.style({
					element: 'span',
					styles: this.makeStyleObject(styles)
				});

				this.editor.applyStyle(style);
			}
		}
	};

	CKEDITOR.plugins.add('aspose', {
		init: function (editor) {
			var config = editor.config;

			new defaultStyle(editor, config.defaultStyles);

			// Disable adding pagebreak into table
			editor.on('selectionChange', function (event) {
				var path = event.data.path;

				if (path.elements && path.elements.some(function(element) { return element.getName() === 'table'; })) {
					editor.getCommand('pagebreak').disable();
				} else {
					editor.getCommand('pagebreak').enable();
				}

				if (config.singleParagraphEdit) {
					var $editor = $(editor.editable().$);

					if ($editor.children().length === 1 && $editor.text().length === $editor.find('ol, ul').text().length) {
						editor.getCommand('numberedlist').enable();
						editor.getCommand('bulletedlist').enable();
					}

					if ($editor.find('ol').length) {
						editor.getCommand('bulletedlist').disable();
					} else {
						editor.getCommand('bulletedlist').enable();
					}

					if ($editor.find('ul').length) {
						editor.getCommand('numberedlist').disable();
					} else {
						editor.getCommand('numberedlist').enable();
					}
				}
			});

			// Remove page break on paste
			editor.on('paste', function(event) {
				event.data.dataValue = event.data.dataValue.replace(removePgbrReg, '');
			});

			if (config.singleParagraphEdit) {
				editor.on('change', function() {
					var $editor = $(editor.editable().$);
					var errors = validateParagraph($editor);

					if (errors.length && !throttle) {
						throttle = true;

						setTimeout(function() {throttle = false}, 2000);

						CKEDITOR._.errors = errors;
						CKEDITOR.dialog.getCurrent() || editor.openDialog('singleParagraphValidate');
					}
				});

				CKEDITOR.dialog.add( 'singleParagraphValidate', this.path + 'dialogs/singleParagraphValidate.js' );
			}

			editor.element.$.parentNode.addEventListener('keydown', function(e) {
				if (e.keyCode !== 46 && e.keyCode !== 8) {
					return
				}

				var selection = editor.getSelection();
				var range = selection.getRanges();
				var elem;

				if (range[0]) {
					if (range[0].startContainer.$.nodeType === 1) {
						elem = range[0].startContainer.$;
					} else {
						elem = range[0].startContainer.$.parentNode;
					}

					if (elem && !elem.getAttribute('content-editable') && elem.firstElementChild) {
						elem = elem.firstElementChild;
					}

					if (e.keyCode === 8 && elem && !elem.getAttribute('content-editable')) {
						elem = elem.previousElementSibling;
					} else if (e.keyCode === 46 && elem && !elem.getAttribute('content-editable')) {
						elem = elem.nextElementSibling;
					}
				}

				if (elem && elem.getAttribute('content-editable') === 'false') {
					var parent = elem.parentNode;
					e.preventDefault();
					e.stopImmediatePropagation();
					parent.removeChild(elem);
					editor.fire('change');
					parent.style['margin-left'] = '';
					parent.style['text-indent'] = '';
				}
			}, true);
		}
	});
})();

