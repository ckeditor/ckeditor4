CKEDITOR.plugins.add('taountab', {
	lang: 'de,en,fr,nl', // %REMOVE_LINE_CORE%
    init: function(editor) {

        /**
         * Get the starting index of a pattern of successive whitespaces
         * @param {String} selectedText - the string to look into
         * @param {Number} spaceNum - number of successive spaces sequence to find
         * @returns {Number}
         */
        function getSuccessiveSpacesStartIndex(selectedText, spaceNum){
            var successive = 0;
            var startIndex = -1;
            for (var i = 0; i < selectedText.length; i++) {
                if(selectedText.charAt(i) === ' ' || selectedText.charAt(i) === String.fromCharCode(160)){//cross browser support
                    if(!successive){
                        startIndex = i;
                    }
                    successive++;
                    if(successive === spaceNum){
                        break;
                    }
                }else{
                    //reset counter
                    successive = 0;
                    startIndex = -1;
                }
            }

            return (successive === spaceNum) ? startIndex : -1;
        }

        editor.addCommand('removeTab', {
            exec: function(editor) {

                var spaceNum = 4;
                var sel = editor.getSelection();
                var ranges = editor.getSelection().getRanges();
                var caretPosition, selectedText, startIndex, position;

                //first, select a range of strings to verify if there are enough successive whitespaces, using the native selection is here more reliable than ckeditor's api
                var focusNode = new CKEDITOR.dom.text(sel._.cache.nativeSel.focusNode);
                var text = focusNode.getText();

                if(text === null){
                    return;//empty node so no tab to be removed
                }
                caretPosition = ranges[0].startOffset;
                ranges[0].setStart(focusNode, Math.max(0, caretPosition - spaceNum));
                ranges[0].setEnd(focusNode, Math.min(caretPosition + spaceNum, text.length));
                sel.selectRanges([ranges[0]]);

                selectedText = sel.getSelectedText();
                startIndex = getSuccessiveSpacesStartIndex(selectedText, spaceNum);

                if(startIndex >= 0){

                    //replace text node, this method is more reliable than range deletion as the latter would lose the caret position for successive call to this action
                    position = Math.max(0, caretPosition - spaceNum) + startIndex;
                    focusNode.setText([text.slice(0, position), text.slice(position + spaceNum)].join(''));

                    //place caret at the end of the delete string
                    ranges[0].setStart(focusNode, position);
                    ranges[0].setEnd(focusNode, position);
                    sel.selectRanges([ranges[0]]);
                }else{
                    //undo selection
                    ranges[0].setStart(focusNode, caretPosition);
                    ranges[0].setEnd(focusNode, caretPosition);
                    sel.selectRanges([ranges[0]]);
                }
            }
        });

        editor.ui.addButton('TaoUnTab', {
            label: editor.lang.removeTab.button,
            command: 'removeTab',
            icon: this.path + 'images/taountab.png'
        });
    }
});
