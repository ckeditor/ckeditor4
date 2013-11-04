/* 
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved. 
For licensing, see LICENSE.html or http://ckeditor.com/license 
*/
(function () {
    /** 
     * Represent plain text selection range. 
     */
    CKEDITOR.plugins.add('textselection',
    {
        init: function (editor) {
            var sourceBookmark, wysiwygBookmark,
                    textRange;  // Corresponding text range of wysiwyg bookmark.

            // Auto sync text selection with 'WYSIWYG' mode selection range.
            if (editor.config.syncSelection
                    && CKEDITOR.plugins.sourcearea) {
                editor.on('beforeModeUnload', function (evt) {
                    if (editor.mode == 'source') {
                        var range = editor.getTextSelection();
                        // Fly the range when create bookmark. 
                        delete range.element;
                        range.createBookmark();
                        sourceBookmark = true;
                        evt.data = range.content;
                    }
                });
                editor.on('mode', function (evt) {
                    if (editor.mode == 'wysiwyg' && sourceBookmark) {
                        editor.focus();
                        var doc = editor.document,
                                range = new CKEDITOR.dom.range(editor.document),
                                walker,
                                startNode,
                                endNode;
                        range.setStartAt(doc.getBody(), CKEDITOR.POSITION_AFTER_START);
                        range.setEndAt(doc.getBody(), CKEDITOR.POSITION_BEFORE_END);
                        walker = new CKEDITOR.dom.walker(range);
                        walker.type = CKEDITOR.NODE_COMMENT;
                        walker.evaluator = function (comment) {

                            var match = /cke_bookmark_\d+(\w)/.exec(comment.$.nodeValue);
                            if (match) {
                                if (match[1] == 'S')
                                    startNode = comment;
                                else (match[1] == 'E')
                                {
                                    endNode = comment;
                                    return false;
                                }
                            }

                        };
                        walker.lastForward();
                        range.setStartAfter(startNode);
                        range.setEndBefore(endNode);
                        range.select();
                        // Scroll into view for non-IE. 
                        if (!CKEDITOR.env.ie || (CKEDITOR.env.ie && CKEDITOR.env.version == 9))
                            editor.getSelection().getStartElement().scrollIntoView(true);
                        // Remove the comments node which are out of range. 
                        startNode.remove();
                        endNode.remove();
                    }
                }, null, null, 10);

                editor.on('beforeGetModeData', function (evt) {
                    if (editor.mode == 'wysiwyg') {
                        var sel = editor.getSelection(), range;
                        if (sel && (range = sel.getRanges()[0]))
                            wysiwygBookmark = range.createBookmark(true);
                    }
                });
                // Build text range right after wysiwyg has unloaded. 
                editor.on('afterModeUnload', function (evt) {
                    if (editor.mode == 'wysiwyg' && wysiwygBookmark) {
                        textRange = new CKEDITOR.dom.textRange(evt.data);
                        textRange.moveToBookmark(wysiwygBookmark);
                        evt.data = textRange.content;
                    }
                });
                editor.on('mode', function (evt) {
                    if (editor.mode == 'source' && textRange) {
                        textRange.element = new CKEDITOR.dom.element(editor._.editable.$);
                        textRange.select();
                    }
                });


            }
        }
    });

    /** 
     * Gets the current text selection from the editing area when in Source mode. 
     * @returns {CKEDITOR.dom.textRange} Text range represent the caret positoins. 
     * @example 
     * var textSelection = CKEDITOR.instances.editor1.<b>getTextSelection()</b>; 
     * alert( textSelection.startOffset ); 
     * alert( textSelection.endOffset ); 
     */
    CKEDITOR.editor.prototype.getTextSelection = function () {
        return this._.editable && getTextSelection(this._.editable.$) || null;
    };

    /** 
     * Returns the caret position of the specified textfield/textarea. 
     * @param {HTMLTextArea|HTMLTextInput} element 
     */
    function getTextSelection(element) {

        var startOffset, endOffset;

        if (!CKEDITOR.env.ie) {
            startOffset = element.selectionStart;
            endOffset = element.selectionEnd;
        }
        else {
            element.focus();

            // The current selection 
            var range = document.selection.createRange(),
                    textLength = range.text.length;

            // Create a 'measuring' range to help calculate the start offset by 
            // stretching it from start to current position. 
            var measureRange = range.duplicate();
            measureRange.moveToElementText(element);
            measureRange.setEndPoint('EndToEnd', range);

            endOffset = measureRange.text.length;
            startOffset = endOffset - textLength;
        }
        return new CKEDITOR.dom.textRange(
                new CKEDITOR.dom.element(element), startOffset, endOffset);
    }

    /** 
     * Represent the selection range within a html textfield/textarea element, 
     * or even a flyweight string content represent the text content. 
     * @constructor 
     * @param {CKEDITOR.dom.element|String} element 
     * @param {Number} start 
     * @param {Number} end 
     */
    CKEDITOR.dom.textRange = function (element, start, end) {
        if (element instanceof CKEDITOR.dom.element
            && (element.is('textarea')
                || element.is('input') && element.getAttribute('type') == 'text')) {
            this.element = element;
            this.content = element.$.value;
        } else if (typeof element == 'string')
            this.content = element;
        else
            throw 'Unkown "element" type.';
        this.startOffset = start || 0;
        this.endOffset = end || 0;
    };

    CKEDITOR.dom.textRange.prototype =
    {
        /** 
         * Sets the text selection of the specified textfield/textarea. 
         * @param {HTMLTextArea|HTMLTextInput} element 
         * @param {CKEDITOR.dom.textRange} range 
         */
        select: function () {

            var startOffset = this.startOffset,
                    endOffset = this.endOffset,
                    element = this.element.$;
            if (endOffset == undefined) {
                endOffset = startOffset;
            }

            if (CKEDITOR.env.ie && CKEDITOR.env.version == 9) {
                element.focus();
                element.selectionStart = startOffset;
                element.selectionEnd = startOffset;
                setTimeout(function() {
                    element.selectionStart = startOffset;
                    element.selectionEnd = endOffset;
                }, 20);

            }
            else {
                if (element.setSelectionRange) {
                    if (CKEDITOR.env.ie) {
                        element.focus();
                    }
                    element.setSelectionRange(startOffset, endOffset);
                    if (!CKEDITOR.env.ie) {
                        element.focus();
                    }
                }
                else if (element.createTextRange) {
                    element.focus();
                    var range = element.createTextRange();
                    range.collapse(true);
                    range.moveStart('character', startOffset);
                    range.moveEnd('character', endOffset - startOffset);
                    range.select();
                }
            }
        },

        /** 
         * Select the range included within the bookmark text with the bookmark 
         * text removed. 
         * @param {Object} bookmark Exactly the one created by CKEDITOR.dom.range.createBookmark( true ). 
         */
        moveToBookmark: function (bookmark) {
            var content = this.content;
            function removeBookmarkText(bookmarkId) {

                var bookmarkRegex = new RegExp('<span[^<]*?' + bookmarkId + '.*?/span>'),
                        offset;
                content = content.replace(bookmarkRegex, function (str, index) {
                    offset = index;
                    return '';
                });
                return offset;
            }

            this.startOffset = removeBookmarkText(bookmark.startNode);
            this.endOffset = removeBookmarkText(bookmark.endNode);
            this.content = content;
            this.updateElement();
        },

        /** 
         * If startOffset/endOffset anchor inside element tag, start the range before/after the element 
         */
        enlarge: function () {
            var htmlTagRegexp = /<[^>]+>/g;
            var content = this.content,
                    start = this.startOffset,
                    end = this.endOffset,
                    match,
                    tagStartIndex,
                    tagEndIndex;

            // Adjust offset position on parsing result. 
            while (match = htmlTagRegexp.exec(content)) {
                tagStartIndex = match.index;
                tagEndIndex = tagStartIndex + match[0].length;
                if (start > tagStartIndex && start < tagEndIndex)
                    start = tagStartIndex;
                if (end > tagStartIndex && end < tagEndIndex) {
                    end = tagEndIndex;
                    break;
                }
            }

            this.startOffset = start;
            this.endOffset = end;
        },

        createBookmark: function () {
            // Enlarge the range to avoid tag partial selection. 
            this.enlarge();
            var content = this.content,
                    start = this.startOffset,
                    end = this.endOffset,
                    id = CKEDITOR.tools.getNextNumber(),
                    bookmarkTemplate = '<!--cke_bookmark_%1-->';

            content = content.substring(0, start) + bookmarkTemplate.replace('%1', id + 'S')
                      + content.substring(start, end) + bookmarkTemplate.replace('%1', id + 'E')
                              + content.substring(end);

            this.content = content;
            this.updateElement();
        },

        updateElement: function () {
            if (this.element)
                this.element.$.value = this.content;
        }

    };

})();

// Seamless selection range across different modes. 
CKEDITOR.config.syncSelection = true;
