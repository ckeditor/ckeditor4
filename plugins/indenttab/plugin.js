CKEDITOR.plugins.add('indenttab', {
    init: function(editor) {
        editor.on('key', function(ev) {
            if (ev.data.keyCode == 9 || ev.data.keyCode == CKEDITOR.SHIFT + 9) {
                if (editor.focusManager.hasFocus) {
                    var sel = editor.getSelection();
                    var ancestor = sel.getCommonAncestor();
                    var ascendant = ancestor.getAscendant({td:1, th:1}, true);

                    // if (ascendant && ['TD', 'TH'].indexOf(ascendant.$.nodeName) === -1) {
                    if (!ascendant) {
                        editor.execCommand(ev.data.keyCode == 9 ? 'indent' : 'outdent');
                        ev.cancel();
                    }
                }
            }
        }, null, null, 5);
    }
});
