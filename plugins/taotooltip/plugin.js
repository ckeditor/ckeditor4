CKEDITOR.plugins.add('taotooltip', {
	init: function (editor) {
		'use strict';

		var commandName = 'insertTaoTooltip';

		var allowedTagsInTooltips = [
			'b', 'strong',
			'i', 'em',
			's',
			// 'span', // WARNING: do not blindly add span without also checking that the selection does not already contain a tooltip...
			'sub',
			'sup',
			'u'
		];
		var containForbiddenTag;


	    /**
	     * @param {CkEditor} editor - ckEditor instance
	     */
		function tooltipCanBeCreated(editor) {
			var selection = editor.getSelection();
			var nativeSelection = selection.getNative();

			return nativeSelection !== null && (canInsert(nativeSelection) || isWrappable(nativeSelection));
		}

	    /**
	     * @param {Selection} selection
	     * @returns {boolean}
	     */
		function canInsert(selection) {
			var range = selection.getRangeAt(0)
			return isSelectionEmpty(selection) && !isInTooltip(selection.getRangeAt(range.startContainer));
		}

	    /**
	     * @param {Selection} selection
	     * @returns {boolean}
	     */
		function isSelectionEmpty(selection) {
			return selection && selection.isCollapsed;
		}

	    /**
	     * @param {Selection} selection
	     * @returns {boolean}
	     */
		function isWrappable(selection) {
			var range = !selection.isCollapsed && selection.getRangeAt(0);

			if (range) {
				containForbiddenTag = false;
				searchForbiddenTags(range.cloneContents());

				return range.toString().trim() !== ''
					&& isValidRange(range)
					&& !containForbiddenTag
					&& !isInTooltip(range.startContainer);
			}
			return false;
		}

	    /**
	     * Recursively traverse a DOM tree to check if it contains a forbidden tag
	     * @param {Node} rootNode
	     */
		function searchForbiddenTags(rootNode) {
			var childNodes = rootNode.childNodes,
				currentNode, i;

			for (i = 0; i < childNodes.length; i++) {
				currentNode = childNodes[i];
				if (!containForbiddenTag && isElement(currentNode)) {
					if (isForbiddenTag(currentNode)) {
						containForbiddenTag = true;
					} else {
						searchForbiddenTags(currentNode);
					}
				}
			}
		}

	    /**
	     * @param {Node} node
	     * @returns {boolean}
	     */
		function isForbiddenTag(node) {
			var tag = node.nodeName && node.nodeName.toLowerCase();
			return allowedTagsInTooltips.indexOf(tag) === -1;
		}

	    /**
	     * We check for partially selected nodes
	     * @param range
	     * @returns {boolean}
	     */
		function isValidRange(range) {
			var start = getContainerElement(range.startContainer),
				end = getContainerElement(range.endContainer);

			return start.isSameNode(end);
		}

	    /**
	     * Return containing Element if current node is of type text
	     * @param {Node} node
	     * @returns {Node}
	     */
		function getContainerElement(node) {
			return isTextNode(node) ? node.parentNode : node;
		}

	    /**
	     * Make sure that the current selection is not already inside a tooltip
	     * @param {Node} node
	     * @returns {CKEDITOR.dom.node|null}
	     */
		function isInTooltip(node) {
			var ckNode = new CKEDITOR.dom.element(node);
			return ckNode.getAscendant(function (el) {
				return el.$
					&& el.$.dataset
					&& el.$.dataset.qtiClass === '_tooltip';
			});
		}

	    /**
	     * @param {CKEDITOR.dom.selection} selection
	     * @returns {CKEDITOR.dom.element}
	     */
		function getSelectionContent(selection) {
			var range = selection.getRanges()[0],
				content = range.extractContents().$;
			return new CKEDITOR.dom.element(content);
		}

	    /**
	     * @param {Node} node
	     * @returns {boolean}
	     */
		function isElement(node) {
			return node.nodeType === window.Node.ELEMENT_NODE;
		}

	    /**
	     * @param {Node} node
	     * @returns {boolean}
	     */
		function isTextNode(node) {
			return node.nodeType === window.Node.TEXT_NODE;
		}

	    /**
	     * Change command state according to the current selection content
	     * @param {CkEditor} editor - ckEditor instance
	     */
		function refreshCommandState(editor) {
			var command = editor.getCommand(commandName);

			if (command) {
				if (tooltipCanBeCreated(editor)) {
					command.setState(CKEDITOR.TRISTATE_OFF);
				} else {
					command.setState(CKEDITOR.TRISTATE_DISABLED);
				}
			}
		}

		editor.addCommand(commandName, {
			exec: function (editor) {
				var config = editor.config.taoQtiItem,
					selection = editor.getSelection(),
					nativeSelection = selection.getNative(),
					taoWidgetWrapper;

				if (tooltipCanBeCreated(editor) && typeof (config.insert) === 'function') {
					taoWidgetWrapper = new CKEDITOR.dom.element('span', editor.document);
					taoWidgetWrapper.setAttributes({
						'data-new': true,
						'data-qti-class': '_tooltip',
						'class': 'widget-box'
					});
					if (isSelectionEmpty(nativeSelection)) {
						// For some profound reason, editor.getData() will not return an inserted <span> if that <span> is empty.
						// So we add a space if nothing was selected!
						taoWidgetWrapper.appendHtml('&nbsp;');
					} else {
						taoWidgetWrapper.append(getSelectionContent(selection));
					}

					editor.insertElement(taoWidgetWrapper);

					config.insert.call(editor, taoWidgetWrapper.$);
				}
			}
		});

		editor.on('instanceReady', function () {
			var editable = editor.editable();

			editable.attachListener(editable, 'mouseup', function () {
				refreshCommandState(editor);
			});
			editable.attachListener(editable, 'keyup', function () {
				refreshCommandState(editor);
			});
		});

		editor.ui.addButton('TaoTooltip', {
			label: editor.lang[commandName].button,
			command: commandName,
			icon: this.path + 'images/taotooltip.png'
		});
	}
});
