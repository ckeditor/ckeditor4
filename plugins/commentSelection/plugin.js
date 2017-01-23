CKEDITOR.plugins.add('commentSelection', {
    icons: 'comment-part-hover',
    init: function(editor) {
        editor.addCommand('commentSelection', {
            exec: function(editor) {
                var html = editor.getSelectedHtml().getHtml();
                html && editor.fire('comment', html);
            }
        });
        editor.ui.addButton('commentSelection', {
            label: 'Write comment to selected part of paragraph',
            command: 'commentSelection',
            toolbar: 'comment'
        });

        //!editor.readOnly && editor.on('selectionChange', function() {
        //    var command = editor.getCommand('commentSelection');
        //
        //    var html = editor.getSelectedHtml().getHtml();
        //    // enable disable button if need
        //    // command.setState(CKEDITOR[html ? 'TRISTATE_ON' : 'TRISTATE_OFF']);
        //});
    }
});
