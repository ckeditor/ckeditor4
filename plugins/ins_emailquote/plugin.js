/*
* @file Ins_EmailQuote plugin for CKEditor
*/

(function () {

    'use strict';

    function setCaret(editor, node, selection, position) {
        if (selection.rangeCount) {
            var range = selection.getRangeAt(0);

            range.collapse(true);
            range.setStart(node, position);
            range.setEnd(node, position);

            selection.removeAllRanges();
            selection.addRange(range);

            var myNodelist = editor.window.$.document.getElementsByClassName("content");
            var i;
            for (i = 0; i < myNodelist.length; i++) {
                if (myNodelist[i].textContent == "[FocusInsERT]") {
                    editor.window.$.document.body.scrollTop = Math.max(0, myNodelist[i].offsetTop - 100);
                    break;
                }
            }
        }
    }

    var EmailQuote = (function () {
        var quoteCaretMarekr = "[FocusInsERT]";

        var emailQuoteStore = {};

        var child;

        function EmailQuote(editor) { }

        EmailQuote.prototype.replaceQuoteCaretMarkerWithCaret = function (editor, selection, elem, data) {
            var result;

            for (var i = 0; i < elem.childNodes.length; ++i) {
                child = elem.childNodes[i];

                if (child.nodeType === Node.TEXT_NODE) {
                    var indexOfQuoteCaretMarker = child.data.indexOf(quoteCaretMarekr);

                    if (indexOfQuoteCaretMarker > -1) {
                        if (elem.childNodes.length === 1 && elem.className === 'content') {
                            var content = elem.childNodes[0];

                            if (data.trim() === '<div class="content">' + quoteCaretMarekr + '</div>') {
                                content.parentNode.appendChild(document.createElement("br"));
                            }
                        }

                        setCaret(editor, child, selection, indexOfQuoteCaretMarker);
                        child.data = child.data.replace(quoteCaretMarekr, '   ');

                        result = {
                            node: child,
                            selection: selection,
                            position: indexOfQuoteCaretMarker
                        };
                    }
                } else if (child.hasChildNodes()) {
                    result = EmailQuote.prototype.replaceQuoteCaretMarkerWithCaret.call(this, editor, selection, child, data);
                }

                if (result) {
                    return result;
                }
            }
        };

        return EmailQuote;
    })();

    var pluginName = 'ins_emailquote';

    var emailQuote = null;

    var caretData = null;

    var data;

    CKEDITOR.plugins.add(pluginName, {

        init: function (editor) {
            emailQuote = new EmailQuote(editor);

            this.createCommands(editor);
            this.bindEvents(editor);
        },

        createCommands: function (editor) {
            editor.addCommand('InsERTFocus', {
                exec: function (editor) {
                    if (editor.mode == '') {
                        return;
                    }

                    try {
                        editor.execCommand('ins_spellchecker_switch_off');

                        editor.focus();

                        if (caretData != null) {
                            setCaret(editor, caretData.node, caretData.selection, caretData.position);
                            caretData = null;
                        }
                    }
                    finally {
                        editor.execCommand('ins_spellchecker_switch_on');
                    }
                },
                editorFocus: true
            });
        },

        bindEvents: function (editor) {
            editor.on('dataReady', function () {
                if (editor.mode == '') {
                    return;
                }

                try {
                    editor.execCommand('ins_spellchecker_switch_off');

                    data = editor.getData().trim();
                    caretData = emailQuote.replaceQuoteCaretMarkerWithCaret(editor, editor.window.$.getSelection(), editor.document.$.body, data);
                }
                finally {
                    editor.execCommand('ins_spellchecker_switch_on');
                }
            });
        }
    });

})();
