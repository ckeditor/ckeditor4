CKEDITOR.plugins.add('taotab', {
    onLoad: function(){
        CKEDITOR.addCss('span.white-space-pre{white-space:pre}');
    },
    init: function(editor) {

        function insertTab(editor){
            if (!editor.getSelection() && editor.getSelection().document && editor.getSelection().document.$) {
                return;
            }
            var sel = editor.getSelection().document.$.getSelection();
            if (!sel.rangeCount){
                console.log('sel.rangeCount', sel.rangeCount);
                return;
            }
            var range = sel.getRangeAt(0);
            range.collapse(true);
            var span = document.createElement('span');
            span.className = 'white-space-pre';
            span.appendChild(document.createTextNode('\t'));
            // span.style.whiteSpace = 'pre';
            range.insertNode(span);
            // Move the caret immediately after the inserted span
            range.setStartAfter(span);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        }

        function setCaret(target, isStart) {
            var range = document.createRange();
            var sel = window.getSelection();
            if (isStart){
                var newText = document.createTextNode('');
                target.appendChild(newText);
                range.setStart(target.childNodes[0], 0);
            }
            else {
                range.selectNodeContents(target);
            }
            range.collapse(isStart);
            sel.removeAllRanges();
            sel.addRange(range);
            // target.focus();
            // target.select();
        }

        editor.addCommand('insertTab', {
            exec: function(editor) {

                // editor.insertText(String.fromCharCode(160)+String.fromCharCode(160)+String.fromCharCode(160)+String.fromCharCode(160));return;

                var sel = editor.getSelection();
                var element = sel.getStartElement();
                var text = element.getFirst().getText();
                var ranges = sel.getRanges();
                var caretPosition = ranges[0].startOffset;
                // console.log({w:text}, element);

                var focusNode = new CKEDITOR.dom.text(sel._.cache.nativeSel.focusNode);

                // editor.insertHtml('&nbsp;&nbsp;&nbsp;&nbsp;');
                // editor.getSelection().document.$.normalize();


                //replace text node
                var a = focusNode.getText();
                var b = String.fromCharCode(160)+String.fromCharCode(160)+String.fromCharCode(160)+String.fromCharCode(160);
                var position = caretPosition;
                console.log([a.slice(0, position), b, a.slice(position)])
                var output = [a.slice(0, position), b, a.slice(position)].join('');
                focusNode.setText(output);

                //set the cursor at the end
                ranges[0].setStart(focusNode, caretPosition+4);
                ranges[0].setEnd(focusNode, caretPosition+4);
                sel.selectRanges([ranges[0]]);
                return;

                // var sel = editor.getSelection();
                // var element = sel.getStartElement();
                // var text = element.getFirst().getText();
                // console.log({v:text});

                setTimeout(function(){
                    var sel = editor.getSelection();
                    var element = sel.getStartElement();
                    var ranges = editor.getSelection().getRanges();
                    var caretPosition = ranges[0].startOffset;
                    ranges[0].setStart(element.getFirst(), text.length + 4);
                    ranges[0].setEnd(element.getFirst(), text.length + 4);
                    sel.selectRanges([ranges[0]]);
                }, 100);


                // var sel = editor.getSelection();
                // var element = sel.getStartElement();
                // sel.selectElement(element);
                // var ranges = sel.getRanges();
                // ranges[0].setStart(element.getFirst(), 0);
                // ranges[0].setEnd(element.getFirst(), 0); //cursor
                //
                // sel.document.$.normalize();
                return;

                var sel = editor.getSelection().document.$.getSelection();
                var range = sel.getRangeAt(0);
                var textNode = document.createTextNode(String.fromCharCode(160)+String.fromCharCode(160)+String.fromCharCode(160)+String.fromCharCode(160));
                range.collapse(true);
                range.insertNode(textNode);
                range.setStartAfter(textNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);

                // setCaret(editor.getSelection().document.$.getSelection().focusNode, true);
                //
                // console.log('sel.focusNodesel.focusNode', editor.getSelection().document.$.getSelection().focusNode);
            }
        });

        editor.ui.addButton('TaoTab', {
            label: 'Insert Tab',
            command: 'insertTab',
            icon: this.path + 'images/taotab.png'
        });
    }
});