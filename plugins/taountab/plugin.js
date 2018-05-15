CKEDITOR.plugins.add('taountab', {
    onLoad: function(){
        CKEDITOR.addCss('span.white-space-pre{white-space:pre}');
    },
    init: function(editor) {

        var nbsp = ' ';
        var pattern = nbsp+nbsp+nbsp;

        function replacer0(search, replace) {
            var sel = window.getSelection();
            if (!sel.focusNode) {
                return;
            }

            var startIndex = sel.focusNode.nodeValue.indexOf(search);
            var endIndex = startIndex + search.length;

            if (startIndex === -1) {
                return;
            }

            var range = document.createRange();
            range.setStart(sel.focusNode, startIndex);
            range.setEnd(sel.focusNode, endIndex);
            range.insertNode(document.createTextNode("bar"));

            sel.removeAllRanges();
            sel.addRange(range);
        }

        function getCaretPosition0(ctrl) {
            var caretPos = 0;   // IE Support
            if (ctrl.selectionStart || ctrl.selectionStart == '0'){
                caretPos = ctrl.selectionStart;
            }
            return (caretPos);
        }

        function getCaretPosition1(editor, editableDiv) {
            var caretPos = 0,
                sel, range;

            var win = editor.getSelection().document.$;
            if (win.getSelection) {
                sel = win.getSelection();
                console.log('debugger1');
                if (sel.rangeCount) {
                    range = sel.getRangeAt(0);
                    console.log('debugger2');
                    caretPos = range.endOffset;

                    if (range.commonAncestorContainer.parentNode == editableDiv) {
                        console.log('debugger3');

                        caretPos = range.endOffset;
                    }
                }
            } else if (document.selection && document.selection.createRange) {
                range = document.selection.createRange();
                if (range.parentElement() == editableDiv) {
                    var tempEl = document.createElement("span");
                    editableDiv.insertBefore(tempEl, editableDiv.firstChild);
                    var tempRange = range.duplicate();
                    tempRange.moveToElementText(tempEl);
                    tempRange.setEndPoint("EndToEnd", range);
                    caretPos = tempRange.text.length;
                }
            }
            return caretPos;
        }

        function getCaretPosition(doc, element) {
            var caretOffset = 0;
            var doc = element.ownerDocument || element.document;
            var win = doc.defaultView || doc.parentWindow;
            var sel;
            if (typeof win.getSelection != "undefined") {
                sel = win.getSelection();
                if (sel.rangeCount > 0) {
                    var range = win.getSelection().getRangeAt(0);
                    var preCaretRange = range.cloneRange();
                    preCaretRange.selectNodeContents(element);
                    preCaretRange.setEnd(range.endContainer, range.endOffset);
                    caretOffset = preCaretRange.toString().length;
                }
            } else if ( (sel = doc.selection) && sel.type != "Control") {
                var textRange = sel.createRange();
                var preCaretTextRange = doc.body.createTextRange();
                preCaretTextRange.moveToElementText(element);
                preCaretTextRange.setEndPoint("EndToEnd", textRange);
                caretOffset = preCaretTextRange.text.length;
            }
            return caretOffset;
        }

        function replaceCk(editor){
            var s = editor.getSelection();
            var cursor = s._.cache.nativeSel.anchorOffset;
            var data = s._.cache.nativeSel.focusNode.data;
            var node = s._.cache.nativeSel.focusNode;
            var selection = editor.getSelection();
            data = data.substring(0,cursor);
            console.log('data', data);
            var startIndex = data.lastIndexOf(" ");
            if (startIndex==-1) {
                startIndex=0;
            } else {
                startIndex=startIndex+1;
            }
            var key = data.substring(startIndex,data.length);
            // HERE KEY IS THE WORD BEFORE CURSOR, THERE IS NO ISSUE IN IT.
            key = key.trim();
            if (key.trim() == 'ck') {
                var ranges = [];
                var range, text, index;
                console.log(editor.getSelection().getStartElement());
                var text = getTextNodes( editor.getSelection().getStartElement() ,key );
                range = editor.createRange();
                range.setStart( text, cursor - (key.length));
                range.setEnd( text, cursor);
                ranges.push( range );
                selection.selectRanges( ranges );
                editor.insertHtml('CKEditor');
            }

            // GETTING NODE OF THE KEY

            function getTextNodes( element,key ) {
                var children = element.getChildren();
                var child;
                for (var i = children.count(); i--;) {
                    child = children.getItem(i);
                    if (child.type == CKEDITOR.NODE_ELEMENT){
                        getTextNodes(child);
                    }else if (child.type == CKEDITOR.NODE_TEXT) {
                        if (child.$.data.indexOf(key) != -1) {
                            var text = child;
                            return child;
                        }
                    }
                }
            }
        }

        function replacer(editor, search, replace) {


            var range = editor.createRange();
            var sel = editor.getSelection();
            var element = sel.getStartElement();

            var ranges = editor.getSelection().getRanges();
            var caretPosition = ranges[0].startOffset;
            console.log(ranges.length, ranges[0].startOffset, ranges, sel, sel._.cache.nativeSel.anchorOffset, sel._.cache.nativeSel.focusNode, element);//ok!

        // ._.cache.nativeSel.focusNode
            // ranges[0].setStartAt(element.getFirst(), CKEDITOR.POSITION_AFTER_START);
            // ranges[0].setEndAt(element.getFirst(), CKEDITOR.POSITION_BEFORE_END); //range

            var focusNode = new CKEDITOR.dom.text(sel._.cache.nativeSel.focusNode);
            var text = focusNode.getText();
            ranges[0].setStart(focusNode, Math.max(0, caretPosition-4));
            ranges[0].setEnd(focusNode, Math.min(caretPosition + 4, text.length));

            // var text = element.getFirst().getText();
            // ranges[0].setStart(element.getFirst(), Math.max(0, caretPosition-4));
            // ranges[0].setEnd(element.getFirst(), Math.min(caretPosition + 4, text.length));

            // var content = new CKEDITOR.dom.text(ranges[0].cloneContents().$);
            // console.log(ranges[0].cloneContents().$, content);
            // ranges[0].deleteContents();//this works!!
            sel.selectRanges([ranges[0]]);
            var selectedText = sel.getSelectedText();
            console.log({'sel.getSelectedText()': selectedText});


            var spaceNum = 4;
            var successive = 0;
            var startIndex = -1;
            for (var i = 0; i < selectedText.length; i++) {
                console.log('selectedText.charAt(i)', [selectedText.charAt(i), String.fromCharCode(160)], selectedText.charAt(i) == String.fromCharCode(160))
                if(selectedText.charAt(i) === ' ' || selectedText.charAt(i) === String.fromCharCode(160)){//cross browser
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

            if(successive === spaceNum){
                // startIndex += Math.max(0, caretPosition - spaceNum);
                // ranges[0].setStart(focusNode, startIndex);
                // ranges[0].setEnd(focusNode, startIndex + spaceNum);
                // // sel.selectRanges([ranges[0]]);
                // ranges[0].deleteContents();

                //replace text node
                var a = focusNode.getText();
                var position = Math.max(0, caretPosition-4) + startIndex;
                var output = [a.slice(0, position), a.slice(position + spaceNum)].join('');
                focusNode.setText(output);

                ranges[0].setStart(focusNode, position);
                ranges[0].setEnd(focusNode, position);
                sel.selectRanges([ranges[0]]);
            }else{
                //undo selection
                ranges[0].setStart(focusNode, caretPosition);
                ranges[0].setEnd(focusNode, caretPosition);
                sel.selectRanges([ranges[0]]);
            }

            console.log({'sel.getSelectedText()': selectedText}, successive, spaceNum);


            return;

            range.setStart(element.getFirst(), 2);
            range.setEnd(element.getFirst(), 3);
            // range.deleteContents();
            // range.moveToElementEditEnd( range.root );
            editor.getSelection().selectRanges( [range] );

            return;
            var win = editor.getSelection().document.$;
            var sel = win.getSelection();
            if (!sel.focusNode) {
                return;
            }
            var str = sel.focusNode.nodeValue;

            sel.focusNode.normalize();
            sel = win.getSelection();

            // console.log('IIII sel.focusNodesel.focusNode', sel.focusNode, getCaretPosition(sel.focusNode));

            if(!sel.focusNode.nodeValue || sel.focusNode.nodeValue.length === 0){
                console.log('tttttextContent', {node: sel.focusNode.textContent}, sel.focusNode.textContent.indexOf(String.fromCharCode(160)));
                str = sel.focusNode.textContent;

                // console.log('ppppreviousSibling', {node: sel.focusNode.previousSibling});
                // console.log(sel.focusNode.previousSibling.nodeValue.indexOf(String.fromCharCode(160)));
            }else{
                console.log('nnnnodeValue', {node: sel.focusNode}, sel.focusNode.nodeValue.indexOf(String.fromCharCode(160)));
                str = sel.focusNode.nodeValue;
            }

            var caretPos = getCaretPosition(editor, sel.focusNode);




            var spaceNum = 4;
            var successive = 0;
            var startIndex = -1;
            for (var i = 0; i < str.length; i++) {
                if(i < caretPos+spaceNum || i > caretPos-spaceNum){
                    if(str.charAt(i) === String.fromCharCode(160)){
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
                    // console.log({v:str.charAt(i)});
                }
            }

            console.log('getCaretPositiongetCaretPosition', caretPos, str.length, successive);


            if (startIndex === -1 && successive !== spaceNum) {
                return;
            }

            var endIndex = startIndex + spaceNum-1;

            var range = document.createRange();
            console.log(range);
            range.setStart(sel.focusNode, startIndex);
            range.setEnd(sel.focusNode, endIndex);
            range.deleteContents();
            range.insertNode(document.createTextNode(''));

            sel.removeAllRanges();
            sel.addRange(range);
        }

        editor.addCommand('removeTab', {
            exec: function(editor) {
                // replaceCk(editor);
                replacer(editor, pattern, "");
            }
        });

        editor.ui.addButton('TaoUnTab', {
            label: 'Remove Tab',
            command: 'removeTab',
            icon: this.path + 'images/taountab.png'
        });
    }
});