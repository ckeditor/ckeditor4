(function (window, bender) {
    var overrides = ['areSame', 'areNotSame', 'areEqual', 'areNotEqual'],
        YTest = bender.Y.Test,
        i;

    window.assert = bender.assert;
    window.arrayAssert = bender.arrayAssert;

    function override(org) {
        return function (expected, actual, message) {
            org.apply(this,
                expected instanceof CKEDITOR.dom.node &&
                actual instanceof CKEDITOR.dom.node ?
                    [expected.$, actual.$, message] :
                    arguments
            );
        };
    }

    for (i = 0; i < overrides.length; i++) {
        bender.assert[overrides[i]] = bender.tools.override(
                bender.assert[overrides[i]],
                override
            );
    }

    bender.assert.isMatching = function (expected, actual, message) {
        YTest.Assert._increment();
        // Using regexp.test may lead to unpredictable bugs when using global flag for regexp.
        if (typeof actual != 'string' || !actual.match(expected)) {
            throw new YTest.ComparisonFailure(
                    YTest.Assert._formatMessage(message, 'Value should match expected pattern.'),
                    expected.toString(), actual
                );
        }
    };

    bender.assert.ignore = function () {
        // TODO
    };

    if (typeof CKEDITOR != 'undefined') {
        CKEDITOR.replaceClass = false;
        CKEDITOR.disableAutoInline = true;
    }

    window.alert = function (msg) {
        throw {
            message: 'window.alert function called with message "' + msg + '".'
        };
    };

    // Override YUITest.TestCase#resume to error proof of: "resume() called without wait()."
    window.resume = YTest.Case.prototype.resume = (function () {
        var org = YTest.Case.prototype.resume;

        return function (segment) {
            var tc = this;

            if (this._waiting) {
                org.call(tc, segment);
            } else {
                setTimeout(function () {
                    org.call(tc, segment);
                });
            }
        };
    })();

    window.wait = function (callback) {
        var args = [].slice.apply(arguments);

        if (args.length == 1 && typeof callback == 'function') {
            setTimeout(callback);
            YTest.Case.prototype.wait.call(null);
        } else {
            YTest.Case.prototype.wait.apply(null, args);
        }
    };

    bender.test = function (tests) {
        var plugins = bender.editorPlugins,
            regexp;

        if (!plugins) return this.startRunner(tests);

        if (plugins.add) CKEDITOR.config.plugins = plugins.add.join(',');

        if (plugins.remove) {
            CKEDITOR.config.removePlugins = plugins.remove.join(',');

            regexp = new RegExp('(?:^|,)(' + plugins.remove.join('|') + ')(?:$|,)', 'g');

            CKEDITOR.config.plugins = CKEDITOR.config.plugins
                .replace(regexp, '')
                .replace(/,+/g, ',')
                .replace(/^,|,$/g, '');

            if (plugins.add) {
                plugins.add = plugins.add.join(',')
                    .replace(regexp, '')
                    .replace(/,+/g, ',')
                    .replace(/^,|,$/g, '')
                    .split(',');
            }
        }

        CKEDITOR.plugins.load(plugins.add, function () {
            if (tests) bender.startRunner(tests);
        });
    };

    bender.startRunner = function (tests) {
        if (!tests.name) tests.name = document.title;

        function startRunner() {
            // catch exceptions
            if (bender.editor) {
                if (tests['async:init'] || tests.init)
                    throw 'The "init/async:init" is not supported in conjunction' +
                        ' with bender.editor, use "setUp" instead.';

                tests['async:init'] = function () {
                    bender.editorBot.create(bender.editor, function (bot) {
                        bender.editor = bender.testCase.editor = bot.editor;
                        bender.testCase.editorBot = bot;
                        bender.testCase.callback();
                    });
                };

                if (bender.runner._running) wait();
            }

            bender.testCase = new YTest.Case(tests);
            bender.testCase.callback = bender.testCase.callback(); //yeah... that's lovely ^_^

            bender.runner.add(bender.testCase);
            bender.runner.run();
        }

        // TODO add support for old IEs
        if (document.readyState === 'complete') startRunner();
        else window.addEventListener('load', startRunner);
    };

    bender.getAbsolutePath = function (path) {
        var suffixIndex, suffix, temp;

        // If this is not a full or absolute path.
        if (path.indexOf('://') == -1 && path.indexOf('/') !== 0) {
            // Webkit bug: Avoid requesting with original file name (MIME type)
            // which will stop browser from interpreting resources from same URL.
            suffixIndex = path.lastIndexOf('.');
            suffix = suffixIndex == -1 ? '' : path.substring(suffixIndex, path.length);

            if (suffix) path = path.substring(0, suffixIndex);

            temp = window.document.createElement('img');
            temp.src = path;

            return temp.src + suffix;
        } else {
            return path;
        }
    };
})(this, bender);
