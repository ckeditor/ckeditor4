/*
 * @file Ins_Commands plugin for CKEditor
 */

(function () {

    'use strict';

    var pluginName = 'ins_commands';

    var escKeyCode = 27;

    CKEDITOR.plugins.add(pluginName, {

        init: function (editor) {
            //#region contentChanged

            var contentChanged = false;

            editor.on('key', function (evt) {
                if (evt.data.keyCode === escKeyCode) {
                    return;
                }

                if (!contentChanged) {
                    contentChanged = true;
                }
            });

            editor.addCommand('contentChanged', {
                exec: function () {
                    return contentChanged;
                },
                editorFocus: false
            });

            //#endregion

            //#region scrollbarDetected

            editor.addCommand('scrollbarDetected', {
                exec: function () {
                    var frameHeight = editor.window.getFrame().$.clientHeight;
                    var editorContentHeight = editor.document.$.body.scrollHeight;

                    return editorContentHeight > frameHeight;
                },
                editorFocus: false
            });

            //#endregion
        }
    });

})();