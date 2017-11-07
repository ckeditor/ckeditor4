CKEDITOR.plugins.add('taotooltip', {
    init : function(editor){
        'use strict';

        var commandName = 'insertTaoTooltip';

	    var allowedTagsInTooltips = [
	    	'em',
	    	'strong',
		    // 'span', // WARNING: do not blindly add span without also checking that the selection does not already contain a tooltip...
		    'sub',
		    'sup'
	    ];
	    var containForbiddenTag;

	    /**
	     * @param {Selection} selection
	     * @returns {boolean}
	     */
	    function isSelectionEmpty(selection) {
	    	return selection.isCollapsed;
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
				    if(isForbiddenTag(currentNode)) {
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
			    end   = getContainerElement(range.endContainer);

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
		    return ckNode.getAscendant(function(el) {
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


		editor.addCommand(commandName, {
			exec: function(editor) {
				var config = editor.config.taoQtiItem,
				    selection = editor.getSelection(),
				    taoWidgetWrapper;

					if(typeof(config.insert) === 'function') {
						if (isSelectionEmpty(selection.getNative()) || isWrappable(selection.getNative())) {
							taoWidgetWrapper = new CKEDITOR.dom.element('span', editor.document);
							taoWidgetWrapper.setAttributes({
								'data-new': true,
								'data-qti-class': '_tooltip',
								'class': 'widget-box'
							});
							taoWidgetWrapper.append(getSelectionContent(selection));

							editor.insertElement(taoWidgetWrapper);

							config.insert.call(editor, taoWidgetWrapper.$);

						} else {
							if (typeof(config.alert) === 'function') {
								config.alert.call(editor, 'tooltip_create_warning');
							}
						}
					}
			}
		});

        editor.ui.addButton('TaoTooltip', {
            label : 'Tooltip',
            command : commandName,
            icon : this.path + 'images/taotooltip.png'
        });
    }
});
