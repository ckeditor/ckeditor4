CKEDITOR.plugins.add('taotab', {
    onLoad: function(){
        CKEDITOR.addCss('span.white-space-pre{white-space:pre}');
    },
    init: function(editor) {

        /**
         * Build the tab string by concatenating spaces
         * @param {Number} num
         * @returns {string}
         */
        function buildSpacedTab(num){
            var i, tabStr = '';
            num = parseInt(num || 4, 10);//default is 4 spaces
            for(i = 0; i< num; i++){
                tabStr += String.fromCharCode(160);
            }
            return tabStr;
        }

        editor.addCommand('insertTab', {
            exec: function(editor) {

                //get selection info
                var sel = editor.getSelection();
                var ranges = sel.getRanges();
                var caretPosition = ranges[0].startOffset;

                //it is important to use the native selection node as the one provided by ck is somewhat buggy at times
                var focusNode = new CKEDITOR.dom.text(sel._.cache.nativeSel.focusNode);

                //replace text node, this technique is prefered to insertHtml because the latter will create a new text node and the caret position will be lost!
                var text = focusNode.getText();
                var position = caretPosition;
                var output = [text.slice(0, position), buildSpacedTab(), text.slice(position)].join('');
                focusNode.setText(output);

                //set the cursor at the end of the insertion
                ranges[0].setStart(focusNode, caretPosition+4);
                ranges[0].setEnd(focusNode, caretPosition+4);
                sel.selectRanges([ranges[0]]);
            }
        });

        editor.ui.addButton('TaoTab', {
            label: 'Insert Tab',
            command: 'insertTab',
            icon: this.path + 'images/taotab.png'
        });
    }
});