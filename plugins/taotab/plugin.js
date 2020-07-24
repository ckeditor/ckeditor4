CKEDITOR.plugins.add('taotab', {
	lang: 'de,en,fr,nl', // %REMOVE_LINE_CORE%
    init: function(editor) {

        /**
         * Build the tab string by concatenating spaces
         * @param {Number} size - the number of whitespaces for the tab
         * @returns {string}
         */
        function buildSpacedTab(size){
            var i, tabStr = '';
            size = parseInt(size || 4, 10);//default is 4 spaces
            for(i = 0; i< size; i++){
                tabStr += String.fromCharCode(160);
            }
            return tabStr;
        }


        /**
         * Get all text nodes that are children of the given
         * @param {HTMLElement} rootNode - the root node from which the search should start
         * @returns {Array}
         */
        function getTextNodes(rootNode){
            var i, textNodes = [];
            for (i = 0; i < rootNode.childNodes.length; i++) {
                var curNode = rootNode.childNodes[i];
                if (curNode.nodeType === Node.TEXT_NODE) {
                    textNodes.push(curNode);
                } else if(curNode.nodeType === Node.ELEMENT_NODE){
                    textNodes = textNodes.concat(getTextNodes(curNode));
                }
            }
            return textNodes;
        }

        /**
         * Compare 2 arrays of HTMLElement and find the first extra one
         * @param {Array} newNodes - the new list of nodes where we want to search for the new one
         * @param {Array} existingNodes - the existing list of nodes
         * @returns {HTMLElement}
         */
        function findNewNode(newNodes, existingNodes){
            var i;
            for(i = 0; i < newNodes.length; i++){
                if(!existingNodes[i]){
                    return newNodes[i];
                }else if(!newNodes[i].isEqualNode(existingNodes[i])){
                    return newNodes[i];
                }
            }
        }

        editor.addCommand('insertTab', {
            exec: function(editor) {

                //the default tab is 4 whitespaces:
                var tabSize = 4;

                //get selection info
                var sel = editor.getSelection();
                var ranges = sel.getRanges();

                //it is important to use the native selection node as the one provided by ck is somewhat buggy at times
                var focusNode = new CKEDITOR.dom.text(sel._.cache.nativeSel.focusNode);

                //replace text node, this technique is prefered to insertHtml because the latter will create a new text node and the caret position will be lost!
                var text = focusNode.getText();

                if(text === null){

                    //record the existing nodes for future references
                    var existingNodes = getTextNodes(ranges[0].root.$);
                    editor.insertHtml(buildSpacedTab(tabSize));

                    //find the new text node that has just been added and select it
                    var newNode = findNewNode(getTextNodes(ranges[0].root.$), existingNodes);
                    focusNode = new CKEDITOR.dom.text(newNode);

                    ranges = sel.getRanges();//get the new ranges from the current selection

                    //address cross-browser issue (especially on EDGE): first, set the cursor in the text node (not on the edge)
                    ranges[0].setStart(focusNode, tabSize-1);
                    ranges[0].setEnd(focusNode, tabSize-1);
                    sel.selectRanges([ranges[0]]);

                    //finally, set the cursor at the end of the new text node
                    ranges[0].setStart(focusNode, tabSize);
                    ranges[0].setEnd(focusNode, tabSize);
                    sel.selectRanges([ranges[0]]);
                }else{

                    //get current caret position within the node
                    var caretPosition = ranges[0].startOffset;
                    focusNode.setText([text.slice(0, caretPosition), buildSpacedTab(tabSize), text.slice(caretPosition)].join(''));

                    //set the cursor at the end of the insertion
                    ranges[0].setStart(focusNode, caretPosition + tabSize);
                    ranges[0].setEnd(focusNode, caretPosition + tabSize);
                    sel.selectRanges([ranges[0]]);
                }
            }
        });

        editor.ui.addButton('TaoTab', {
            label: editor.lang.insertTab.button,
            command: 'insertTab',
            icon: this.path + 'images/taotab.png'
        });
    }
});
