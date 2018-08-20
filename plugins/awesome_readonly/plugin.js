'use strict';

(function() {
    CKEDITOR.plugins.add('awesome_readonly', {
        requires: 'widget',
        icons: 'awesome_readonly',

        onLoad: function() {
            CKEDITOR.addCss('.awesome_readonly {background-color:#EFF1F3}');
        },

        init: function(editor) {
            //register widget
            editor.widgets.add('awesome_readonly', {
                template: '<div class="awesome_readonly"></div>',
                upcast: function(el) {
                    return el.name === 'div' && el.hasClass('awesome_readonly');
                }
            });

            /*
             * This command can be executed using
             * editor.execCommand('makeTextReadOnly', data) whenever you want to
             * make data uneditable hence this will help in make data uneditable at
             * runtime.
             */
            editor.addCommand('makeTextReadOnly', {
                exec: function(editor, text) {
                    var existingData = editor.getData();
                    if (existingData.indexOf('awesome_readonly') === -1) {
                        var newData = existingData + '<div class="awesome_readonly">' + text + '</div>';
                        editor.setData(newData);
                    }
                }
            });
            // in future if the button is needed in toolbar, this code will help
            /*editor.ui.addButton('AwesomeReadonly',
              {
                label:'Add Readonly Text',
                toolbar: 'insert,100',
                command: 'awesome_readonly',
                icon: `${this.path  }icons/awesome_readonly.png`
              })*/
        },

        afterInit: function(editor) {
            editor.execCommand('awesome_readonly');
        }
    })
})()
