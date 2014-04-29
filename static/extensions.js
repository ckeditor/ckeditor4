(function (window, bender) {

    if (typeof CKEDITOR != 'undefined') {
        CKEDITOR.replaceClass = false;
        CKEDITOR.disableAutoInline = true;
    }

    window.assert = bender.assert;
    window.arrayAssert = bender.arrayAssert;

    var overrides = ['areSame', 'areNotSame', 'areEqual', 'areNotEqual'];
    for (var i = 0; i < overrides.length; i++) {
        assert[overrides[i]] = bender.tools.override(assert[overrides[i]], function (org) {
            return function (expected, actual, message) {
                if (expected instanceof CKEDITOR.dom.node && actual instanceof CKEDITOR.dom.node)
                    org.apply(this, [expected.$, actual.$, message]);
                else
                    org.apply(this, arguments);
            };
        });
    }

    var TestCase = bender.Y.Test.Case.prototype;
    // Override YUITest.TestCase#resume to error proof of: "resume() called without wait()."
    TestCase.resume = (function () {
        var org = TestCase.resume;
        return function (segment) {
            var tc = this;
            if (this._waiting)
                org.call(tc, segment);
            else
                setTimeout(function () {
                    org.call(tc, segment);
                });
        };
    })();

    window.wait = function (callback) {
        var args = [].slice.apply(arguments);

        if (args.length == 1 && typeof callback == 'function') {
            setTimeout(function () {
                callback();
            });
            bender.Y.Test.Case.prototype.wait.call(null);
        } else
            bender.Y.Test.Case.prototype.wait.apply(null, args);
    };

    window.resume = bender.Y.Test.Case.prototype.resume;

    bender.test = function (tests) {
        if (!tests.name) tests.name = '';

        function startRunner() {
            var tc;

            if (bender.editor) {
                if (tests['async:init'] || tests.init)
                    throw 'The "init/async:init" is not supported in conjunction with bender.editor, use "setUp" instead.';

                tests['async:init'] = function () {
                    bender.editorBot.create(bender.editor, function (bot) {
                        console.log('bot ready');
                        bender.editor = tc.editor = bot.editor;
                        tc.editorBot = bot;
                        tc.callback();
                    });
                };
            }

            tc = bender.testCase = new bender.Y.Test.Case(tests);
            
            bender.runner.add(tc);
            
            bender.runner.run();
        }
        
        window.addEventListener('load', startRunner);
    };

    bender.getAbsolutePath = function (path) {
        // If this is not a full or absolute path.
        if (path.indexOf('://') == -1 && path.indexOf('/') !== 0) {
            // Webkit bug: Avoid requesting with original file name (MIME type)
            //  which will stop browser from interpreting resources from same URL.
            var suffixIndex = path.lastIndexOf('.'),
                suffix = suffixIndex == -1 ? '' : path.substring(suffixIndex, path.length);

            suffix && (path = path.substring(0, suffixIndex));

            var temp = window.document.createElement('img');
            temp.src = path;
            return temp.src + suffix;
        } else
            return path;
    };

    bender.assert.isMatching = function (expected, actual, message) {
        bender.Y.Test.Assert._increment();
        // Using regexp.test may lead to unpredictable bugs when using global flag for regexp.
        if (typeof actual != 'string' || !actual.match(expected)) {
            throw new bender.Y.Test.ComparisonFailure(
                bender.Y.Test.Assert._formatMessage(message, 'Value should match expected pattern.'), expected.toString(), actual);
        }
    };

})(this, bender);
