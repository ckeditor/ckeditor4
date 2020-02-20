/*
* @file Ins_Spellchecker plugin for CKEditor
*/

(function () {

    'use strict';

    function Helper() { }

    var zeroWidthCharactersRegExp = /[\u200b-\u200d\ufeff]/g;

    var spaceRegExp = /^\s*$/;

    var floatingPointRegExp = /^[-+]?[0-9]+([\.,][0-9]+)?\.?$/;

    var romanNumberRegExp = /^[IVXLCDM]+\.?$/i;

    var atLeastOneLetterAndAtLeastOneNumberRegExp = /^(?=.*?[a-ż])(?=.*?\d)[a-ż\d]+$/i;

    var phoneNumberTimeOrDate = /^\+?\(?\d([-().:\/\d]\w?)+r?\.?$/;

    var oneLetterShortcut = /^(\w\.)+$/;

    var emailRegExp = /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;

    var urlRegExp = /^https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,}$/;

    var nonPrintableAsciiRegExp = /^[\x00-\x1F\x80-\xFF]+$/;

    var signatureSeparatorRegExp = /^[-]{2}$/;

    /**
    * Dodaje zewnętrzny zestaw styli do tagu nagłówkowego dokumentu html.
    */
    Helper.linkExternalStyleSheets = function (document, path, id) {
        if (!document.getElementById(id)) {
            var element = document.createElement('link');

            element.setAttribute('rel', 'stylesheet');
            element.setAttribute('type', 'text/css');
            element.setAttribute('href', path);
            element.setAttribute('id', id);

            var head = document.getElementsByTagName('head')[0];

            head.appendChild(element);
        }
    };

    Helper.removeAllZeroWidthCharacters = function (word) {
        return word.replace(zeroWidthCharactersRegExp, '');
    };

    /*
    * Sprawdza, czy string jest wyrazem.
    *
    * https://support.office.com/en-us/article/Choose-how-spell-check-and-grammar-check-work-71fd027a-be9c-42b0-8055-75f46324a16a
    */
    Helper.isWord = function (str) {
        if (!str || str.length === 0 || spaceRegExp.test(str)) {
            return false;
        }

        if (str.length === 1) {
            return false;
        }

        if (floatingPointRegExp.test(str)) {
            return false;
        }

        if (romanNumberRegExp.test(str)) {
            return false;
        }

        if (atLeastOneLetterAndAtLeastOneNumberRegExp.test(str)) {
            return false;
        }

        if (phoneNumberTimeOrDate.test(str)) {
            return false;
        }

        if (oneLetterShortcut.test(str)) {
            return false;
        }

        if (emailRegExp.test(str)) {
            return false;
        }

        if (urlRegExp.test(str)) {
            return false;
        }

        if (nonPrintableAsciiRegExp.test(str)) {
            return false;
        }

        if (signatureSeparatorRegExp.test(str)) {
            return false;
        }

        if (str.indexOf("SignatureInsERT") > -1) {
            return false;
        }

        return true;
    };

    function DomHelper() { }

    /*
    * Funkcja przechodzi po drzewie DOM (DFS) elementu przekazanego jako argument i zwraca wszystkie
    * węzły z tekstem.
    */
    DomHelper.getTextNodes = function (elem) {
        var textNodes = [];
        var child;

        function getTextNodes_r(elem) {
            for (var i = 0; i < elem.childNodes.length; ++i) {
                child = elem.childNodes[i];

                if (child.tagName != "STYLE") {
                    if (child.nodeType === Node.TEXT_NODE) {
                        textNodes.push(child);
                    } else if (child.hasChildNodes()) {
                        getTextNodes_r(child);
                    }
                }
            }
        }

        getTextNodes_r(elem);

        return textNodes;
    };

    /*
    * Zwraca ciąg znaków będący treścią węzła (i dzieci tego węzła) przekazanego do funkcji.
    */
    DomHelper.getNodeAsString = function (node) {
        var allTextNodes = DomHelper.getTextNodes(node);
        var fullTextContext = '';

        for (var i = 0; i < allTextNodes.length; ++i) {
            fullTextContext += allTextNodes[i].data + ' ';
        }

        return fullTextContext;
    };

    var SpellChecker = (function () {
        /*
        * Określa, czy sprawdzanie pisowni jest włączone, czy wyłączone.
        */
        var spellCheckingEnable = false;

        /*
        * Określa, czy jest focus na edytorze.
        */
        var editorHasFocus = false;

        /*
        * Klasa opisująca błędny wyraz.
        */
        var misspeledWordClass;

        /*
        * Klasa opisująca błędny wyraz, ale taki którego nie podkreślamy. Wykorzystywana wtedy, gdy użytkownik 
        * poprawia błędny wyraz (niby wyraz błędny, ale jest poprawiany, więc po co go podkreślać?).
        */
        var misspeledWordDisabledClass;

        /*
        * Liczba słów, która zostanie sprawdzona przy jednym żądaniu.
        */
        var maxWords = 100;

        /*
        * Znacznik kursora. Używany do zaznaczenia miejsca, w którym znajduje sie kursor.
        */
        var caretMarker = String.fromCharCode(8) + String.fromCharCode(127) + String.fromCharCode(1);

        /*
        * Tablica wyrazów opisująca, czy dany wyraz znajduje sie w słowniku.
        */
        var cache = {};

        /*
        * splitRegex - Wyrażenie do splitowania tekstu.
        * wordRegex - Wyrażenie do wyodrębnienia słowa.
        *
        * Nie splituje po:
        *   "-" <- wyrazy, np. czerwono-zielony
        *   ":" <- adres www z protokołem
        *   "." <- adres www lub skróty ("np.")
        *   "/" <- adres www
        */
        var splitRegex = /[\s?!,;+*=~^`„”“”"'\(\)\[\]\{\}<>]+/g;
        var wordRegex = /[^\s?!,;+*=~^`„”“”"'\(\)\[\]\{\}<>]+/g;

        /*
        * Wzorce, które będą ignorowane podczas sprawdzania pisowni.
        */
        var ignoredPatterns = [
            /<<([a-ż\x20]+)>>/g,
        ];

        /*
        * Znaki usuwane przy sprawdzaniu pisowni.
        * 
        *   ":" <- dwukropek na końcu wyrazu
        */
        var charactersAtTheEndToIgnored = /[:]$/;

        /*
        * Zwraca wyrazy z węzła podanego w argumencie.
        */
        function getWords(node, maxWords) {
            var text = DomHelper.getNodeAsString(node);
            var words = text.split(splitRegex);

            if (!words && words.length > 0) {
                return result;
            }

            var uniqueWords = {};
            var result = [];
            var word;

            for (var i = 0; i < words.length; ++i) {
                word = Helper.removeAllZeroWidthCharacters(words[i]);

                if (Helper.isWord(word) && typeof uniqueWords[word] === 'undefined' && typeof cache[word] === 'undefined') {
                    result.push(word);

                    uniqueWords[word] = true;

                    if (result.length >= maxWords) {
                        return result;
                    }
                }
            }

            return result;
        }

        /*
        * Oznacza wszystkie błędnie napisane wyrazy klasą określoną w zmiennej misspeledWordClass.
        */
        function markAllMisspeledWords(node) {
            var textNodes = DomHelper.getTextNodes(node);

            for (var i = 0; i < textNodes.length; ++i) {
                markAllMisspeledWordsInNode(textNodes[i]);
            }
        }

        // https://developer.mozilla.org/en-US/docs/Web/API/Text.splitText
        // http://stackoverflow.com/questions/1520800/why-regexp-with-global-flag-in-javascript-give-wrong-results
        function markAllMisspeledWordsInNode(textNode) {
            var currentNode = textNode;
            var match;
            var matchText;
            var matchTextToCheck;
            var span;
            var newNode;

            wordRegex.lastIndex = 0;

            var ignoredWords = getIgnoredWords(currentNode.data);

            while ((match = wordRegex.exec(currentNode.data)) != null) {
                matchText = removeIgnoredCharacters(match[0]);
                matchTextToCheck = Helper.removeAllZeroWidthCharacters(matchText);

                if (!Helper.isWord(matchTextToCheck) || cache[matchTextToCheck] || ignoredWords.indexOf(matchTextToCheck) > -1) {
                    continue;
                }

                span = new CKEDITOR.dom.element('span');
                span.setText(matchText);
                span.setAttribute('class', misspeledWordClass);

                newNode = currentNode.splitText(match.index);
                newNode.data = newNode.data.substr(matchText.length);

                currentNode.parentNode.insertBefore(span.$, newNode);

                currentNode = newNode;
                wordRegex.lastIndex = 0;
            }
        }

        /*
        * Zwraca wszystkie wyrazy, które mają byc zignorowane podczas sprawdzania pisowni.
        */
        function getIgnoredWords(text) {
            var ignoredWords = [];

            for (var i = 0; i < ignoredPatterns.length; ++i) {
                var match;

                while ((match = ignoredPatterns[i].exec(text)) != null) {
                    ignoredWords = ignoredWords.concat(match[1].split(' '));
                }
            }

            return ignoredWords;
        }

        /*
        * Usuwa znaki przy sprawdzaniu pisowni.
        */
        function removeIgnoredCharacters(word) {
            return word.replace(charactersAtTheEndToIgnored, '');
        }

        /*
        * Usuwa wszystkie węzły <span> z klasą wskazujacą na błędny wyraz, ale bez usuwania zawartości węzła.
        */
        function clearSpellCheckingSpans(document) {
            var nodes = document.getElementsByTagName('span');
            var node;

            for (var i = nodes.length - 1; i >= 0; --i) {
                node = nodes[i];

                if (node.className === misspeledWordClass || node.className === misspeledWordDisabledClass) {
                    node.outerHTML = node.innerHTML;
                }
            }
        }

        /*
        * Zwraca element na którym znajduje się kursor.
        */
        function getElementAtCursorPosition(editor) {
            if (!editor.getSelection()) {
                return null;
            }

            return editor.getSelection().getStartElement();
        }

        /*
        * Wstawia znacznik kursora w miejscu znajdowania się kursora.
        */
        function putCursor(editor) {
            if (!editorHasFocus) {
                return;
            }

            var selection = editor.getWindow().getSelection();

            if (selection.rangeCount) {
                var range = selection.getRangeAt(0);

                range.insertNode(editor.getDocument().createTextNode(caretMarker));
            }
        }

        /*
        * Zwraca pozycję kursora i węzeł w którym sie kursot znajduje.
        */
        function getCaret(editor) {
            if (!editorHasFocus) {
                return;
            }

            var allTextNodes = DomHelper.getTextNodes(editor.getBody());
            var caretPosition;
            var caretNode;

            for (var i = 0; i < allTextNodes.length; ++i) {
                if (allTextNodes[i].data.indexOf(caretMarker) > -1) {
                    caretPosition = allTextNodes[i].data.indexOf(caretMarker);
                    caretNode = allTextNodes[i];

                    allTextNodes[i].data = allTextNodes[i].data.replace(caretMarker, "");

                    return {
                        node: caretNode,
                        offset: caretPosition
                    };
                }
            }
        }

        /*
        * Odnajduje pozycję kursora i wstawia go na swoje miejsce.
        */
        function setCaret(editor, caret) {
            if (!editorHasFocus || !caret) {
                return;
            }

            var allTextNodes = DomHelper.getTextNodes(editor.getBody());
            var caretNode = caret.node;
            var nodeIndex = allTextNodes.indexOf(caretNode);

            if (nodeIndex >= 0) {
                var caretPosition = caret.offset;

                for (var i = nodeIndex; i < allTextNodes.length - 1; ++i) {
                    if (caretPosition <= allTextNodes[i].data.length) {
                        break;
                    }

                    caretPosition -= allTextNodes[i].data.length;
                    caretNode = allTextNodes[i + 1];
                }

                var selection = editor.getWindow().getSelection();

                if (selection.rangeCount) {
                    caretPosition = caretPosition < 0 ? 0 : caretPosition;

                    var range = selection.getRangeAt(0);
                    
                    var newCaretPosition = adjustCaretPositionToChromiumReality(caretPosition, caretNode);

                    range.collapse(true);
                    range.setStart(caretNode, newCaretPosition);
                    range.setEnd(caretNode, newCaretPosition);

                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }
        }

        /*
         * https://dev.ckeditor.com/ticket/10031
         * https://dev.ckeditor.com/ticket/13700
         * https://bugs.webkit.org/show_bug.cgi?id=15256
         * 
         * Obejście problemu związanego z dodawaniem ZWS przez edytor.
         * 
         * Funkcja znajduje pierwsze wystąpienie ZWS ostatniego podciągu składającego się 
         * tylko z ZWS i ustawia kursor bezpośrednio przed tym wystapieniem.
         */
        function adjustCaretPositionToChromiumReality(caretPosition, caretNode) {
            var newCaretPosition = caretPosition;
            while (--newCaretPosition > 0 && caretNode.textContent[newCaretPosition] === '\u200b');
            /^\u200b+$/.test(caretNode.textContent) && newCaretPosition > 0 && --newCaretPosition;
            return newCaretPosition + 1;
        }


        /*
        * Metoda:
        *  + zapamiętuje pozycję kursora (wywołanie putCursor),
        *  + usuwa wszystkie tagi span z klasą misspeledWordClass lub misspeledWordDisabledClass 
        *    bez zawartości (wywołanie clearSpellCheckingSpans),
        *  + sprowadza drzewo DOM do postaci znormalizowanej,
        *  + zaznacza wszystkie wyrazy nie występujące w słowniku,
        *  + wstawia kursor na swoje miejsce.
        */
        function render(editor) {
            putCursor(editor);

            clearSpellCheckingSpans(editor.getBody());

            // https://developer.mozilla.org/en-US/docs/Web/API/Node.normalize
            editor.getBody().normalize();

            var caret = getCaret(editor);

            markAllMisspeledWords(editor.getBody());

            setCaret(editor, caret);
        }

        /*
        * Wysyła żądanie do serwera.
        */
        function send(method, url, callback) {
            var xhr = new XMLHttpRequest();

            xhr.open(method, url);

            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    callback(xhr.responseText);
                }
            };

            xhr.send();
        }

        var spellCheckerStore = {};

        function SpellChecker(editor, serverUrl) {
            if (!editor instanceof CKEDITOR.editor) {
                return;
            }

            CKEDITOR.editor.prototype.getWindow = function () {
                return this.window.$;
            };

            CKEDITOR.editor.prototype.getDocument = function () {
                return this.document.$;
            };

            CKEDITOR.editor.prototype.getBody = function () {
                return this.document.$.body;
            };

            spellCheckerStore.editor = editor;
            spellCheckerStore.serverUrl = serverUrl;

            Object.defineProperty(this, 'misspeledWordClass', {
                get: function () {
                    return misspeledWordClass;
                },
                set: function (value) {
                    misspeledWordClass = value;
                }
            });

            Object.defineProperty(this, 'misspeledWordDisabledClass', {
                get: function () {
                    return misspeledWordDisabledClass;
                },
                set: function (value) {
                    misspeledWordDisabledClass = value;
                }
            });

            Object.defineProperty(this, 'isSpellCheckingEnable', {
                get: function () {
                    return spellCheckingEnable;
                }
            });

            Object.defineProperty(this, 'editorHasFocus', {
                set: function (value) {
                    editorHasFocus = value;
                }
            });
        }

        SpellChecker.prototype.on = function () {
            spellCheckingEnable = true;

            SpellChecker.prototype.check.call(this);
        };

        SpellChecker.prototype.off = function () {
            spellCheckingEnable = false;

            clearSpellCheckingSpans(spellCheckerStore.editor.getBody());
        };

        SpellChecker.prototype.check = function () {
            if (spellCheckingEnable) {
                var words = getWords(spellCheckerStore.editor.getBody(), maxWords).map(function (word) {
                    return removeIgnoredCharacters(word);
                });

                if (words.length === 0) {
                    render(spellCheckerStore.editor);
                } else {
                    var url = spellCheckerStore.serverUrl + '?words=' + words.join(',');

                    send('GET', url, function (responseText) {
                        if (spellCheckingEnable) {
                            var response = JSON.parse(responseText);
                            var word;

                            for (var i = 0; i < words.length; ++i) {
                                word = words[i];

                                if (response[word] == 0) {
                                    cache[word] = false;
                                } else {
                                    cache[word] = true;
                                }
                            }

                            render(spellCheckerStore.editor);

                            if (words.length >= maxWords) {
                                SpellChecker.prototype.check.call(this);
                            }
                        }
                    });
                }
            }
        };

        SpellChecker.prototype.reset = function () {
            cache = [];

            clearSpellCheckingSpans(spellCheckerStore.editor.getBody());
        };

        SpellChecker.prototype.removeUnderlining = function (document) {
            clearSpellCheckingSpans(document);
        };

        SpellChecker.prototype.removeUnderliningDuringTyping = function () {
            var target = getElementAtCursorPosition(spellCheckerStore.editor);

            if (target.$.className === misspeledWordClass) {
                target.$.className = misspeledWordDisabledClass;
            }
        };

        return SpellChecker;
    })();

    /*
    * Nazwa plugina.
    */
    var pluginName = 'ins_spellchecker';

    /*
    * Obiekt sprawdzacza pisowni.
    */
    var spellChecker = null;

    /*
    * Aktualnie wybrany język.
    */
    var chosenLanguage;

    /*
    * Ścieżka do arkusza stylów względem tego pliku.
    */
    var themePath = 'theme/' + pluginName + '.css';

    /*
    * Odstęp między kolejnymi testami poprawności pisowni.
    */
    var spellCheckingDelay = 250;

    /*
    * Nazwy komend pluginu do psrawdzania pisowni.
    */
    var switchOnCommandName = 'ins_spellchecker_switch_on';
    var switchOffCommandName = 'ins_spellchecker_switch_off';
    var checkNowCommandName = 'ins_spellchecker_check_now';
    var getDataCommandName = 'ins_spellchecker_getData';

    /*
    * Funkcja dodaje style wykorzystywane przez plugin.
    */
    function addStyles(editor, rootPath) {
        Helper.linkExternalStyleSheets(editor.document.$, rootPath + themePath, pluginName + '_theme');
    }

    CKEDITOR.plugins.add(pluginName, {
        icons: pluginName,
        requires: ['richcombo'],
        lang: 'en,pl',

        init: function (editor) {
            spellChecker = new SpellChecker(editor, 'nexo://spell.checker/');

            spellChecker.misspeledWordClass = 'misspelled-word';
            spellChecker.misspeledWordDisabledClass = 'misspelled-word-disabled';

            this.bindEvents(editor);
            this.createCommands(editor);

            var lang = editor.lang[pluginName];

            chosenLanguage = editor.config.spellCheckingLanguage !== null ? editor.config.spellCheckingLanguage : lang.disabled;

            editor.ui.addRichCombo(pluginName, {
                label: lang.title,
                title: lang.title,

                panel: {
                    css: [CKEDITOR.skin.getPath('editor')].concat(editor.config.contentsCss),
                    multiSelect: false
                },

                init: function () {
                    var languages = editor.config.spellCheckingLanguages;

                    this.startGroup(lang.title);

                    this.add(lang.disabled, '<i>' + lang.disabled + '</i>', lang.disabled);

                    for (var language in languages)
                        this.add(languages[language], languages[language], languages[language]);
                },

                onClick: function (value) {
                    var switchNeeded = chosenLanguage === lang.disabled ? value != lang.disabled : value === lang.disabled;

                    chosenLanguage = value;
                    editor.config.spellCheckingLanguage = chosenLanguage !== lang.disabled ? chosenLanguage : null;

                    if (chosenLanguage !== lang.disabled) {
                        var xhr = new XMLHttpRequest();

                        xhr.open('GET', 'nexo://spell.checker/change-language/' + value);

                        xhr.onreadystatechange = function () {
                            if (xhr.readyState === 4 && xhr.status === 200) {
                                spellChecker.reset();

                                if (spellChecker.isSpellCheckingEnable)
                                    editor.execCommand(checkNowCommandName);
                                else
                                    editor.execCommand(switchOnCommandName);
                            }
                        };

                        xhr.send();
                    } else {
                        editor.execCommand(switchOffCommandName);
                    }

                    this.setValue(value);
                    editor.focus();
                },

                refresh: function () {
                    this.setValue(chosenLanguage);
                }
            });
        },

        afterInit: function (editor) {
            var htmlFilter = editor.dataProcessor.htmlFilter;

            if (htmlFilter) {
                htmlFilter.addRules({
                    elements: {
                        span: function (node) {
                            var classAttr = node.attributes['class'];

                            if (classAttr === spellChecker.misspeledWordClass || classAttr === spellChecker.misspeledWordDisabledClass) {
                                // FIXME: w przypadku, kiedy węzeł span będzie miał więcej dzieci, to kilkoro się straci :(
                                return node.value;
                            }
                        }
                    }
                });
            }
        },

        /* ----------------- Metody nie będące cześcią CKEDITOR.pluginDefinition. ----------------- */

        createCommands: function (editor) {
            // włącza sprawdzanie pisowni
            editor.addCommand(switchOnCommandName, {
                exec: function (editor) {
                    if (!spellChecker.isSpellCheckingEnable && editor.config.spellCheckingLanguage !== null)
                        spellChecker.on();
                },
                editorFocus: false
            });

            // wyłącza sprawdzanie pisowni
            editor.addCommand(switchOffCommandName, {
                exec: function (editor) {
                    if (spellChecker.isSpellCheckingEnable)
                        spellChecker.off();
                },
                editorFocus: false
            });

            // sprawdza pisownię na żądanie, jeśli sprawdzanie pisowni jest włączone
            editor.addCommand(checkNowCommandName, {
                exec: function (editor) {
                    if (spellChecker.isSpellCheckingEnable)
                        spellChecker.check();
                },
                editorFocus: false
            });

            // pobiera treść bez podkreśleń
            editor.addCommand(getDataCommandName, {
                exec: function (editor, data) {
                    var body = editor.getBody().cloneNode(true);

                    spellChecker.removeUnderlining(body);

                    data.source = body.innerHTML;
                },
                editorFocus: false
            });
        },

        bindEvents: function (editor) {
            var self = this;

            editor.on('instanceReady', function () {
                if (editor.mode !== 'wysiwyg') {
                    return;
                }

                addStyles(editor, self.path);

                if (editor.config.spellCheckingLanguage !== null)
                    spellChecker.on();
            });

            editor.on('key', (function () {
                var spellTicker = setTimeout(spellChecker.check, spellCheckingDelay);

                return function (k) {
                    if (editor.mode !== 'wysiwyg') {
                        return;
                    }

                    spellChecker.editorHasFocus = true;

                    var character = k.data.keyCode;

                    // https://css-tricks.com/snippets/javascript/javascript-keycodes/
                    // 16 - data link escape, 31 - unit separator
                    if (character >= 16 && character <= 31) { return; }
                    // 32 - Space
                    // 33 - Page up, 45 - Insert
                    if (character >= 33 && character <= 45) { return; }
                    // 33 - Page up, 45 - Insert
                    if (character >= 33 && character <= 45) { return; }
                    // F1 ... F12
                    if (character >= 112 && character <= 123) { return; }
                    // numLock, ScrollLock
                    if (character == 144 || character == 145) { return; }
                    // Ctrl, Shift, Alt
                    if (character >= CKEDITOR.CTRL && character != CKEDITOR.CTRL + 'V'.charCodeAt()) { return; }

                    spellChecker.removeUnderliningDuringTyping();

                    clearTimeout(spellTicker);

                    spellTicker = setTimeout(spellChecker.check, spellCheckingDelay);
                };
            })());

            editor.on('focus', function () {
                if (editor.mode !== 'wysiwyg') {
                    return;
                }

                spellChecker.editorHasFocus = true;
            });

            editor.on('blur', function () {
                if (editor.mode !== 'wysiwyg') {
                    return;
                }

                spellChecker.editorHasFocus = false;
            });

            editor.on('mode', function () {
                if (editor.mode !== 'wysiwyg')
                    return;

                editor.execCommand(checkNowCommandName);

                addStyles(editor, self.path);
            });

            editor.on('dataReady', function () {
                if (editor.mode !== 'wysiwyg')
                    return;

                editor.execCommand(checkNowCommandName);

                addStyles(editor, self.path);
            });

            editor.on('beforeCommandExec', function (evt) {
                if (editor.mode !== 'wysiwyg' && evt.data.name.substring(0, pluginName.length) === pluginName) {
                    return false;
                }
            });

            // Poniższy "trick" służy do usunięcia podkreślenia obrazka, gdy wstawimy go w środku niepoprawnego wyrazu.
            // Nie jest to najlepsze i najwydajniejsze rozwiązanie, ale ze względu na częstotliwość wstawiania obrazków 
            // nie powinno też być problematyczne.
            var imageInserted = false;

            editor.on('insertElement', function (evt) {
                if (evt.data.getName() === 'img') {
                    imageInserted = true;
                }
            });

            editor.on('change', function () {
                if (imageInserted) {
                    imageInserted = false;

                    editor.execCommand(checkNowCommandName);
                }
            });
        }
    });

})();
