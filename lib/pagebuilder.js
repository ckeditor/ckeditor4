var path = require('path'),
    files = [
        path.join(__dirname, '/../static/tools.js'),
        path.join(__dirname, '/../static/bot.js'),
        path.join(__dirname, '/../static/extensions.js')
    ];

module.exports = {

    name: 'bender-pagebuilder-ckeditor',

    files: files,

    build: null,
    
    attach: function () {
        var bender = this;

        function build(data) {
            var head = ['<head>'],
                reg;

            head.push('<title>', data.id, '</title>');

            files.forEach(function (file) {
                head.push('<script src="/plugins', file, '"></script>\n');
            });

            head.push('<script>(function (bender) {\n');

            // add CKEditor plugins configuration
            if (data.editorPlugins &&
                (data.editorPlugins.add || data.editorPlugins.remove)) {
                head.push(
                    'bender.editorPlugins = ',
                    JSON.stringify(data.editorPlugins),
                    ';\n'
                );
            }

            // add test regression configuration
            if ((reg = bender.conf.tests[data.group].regressions)) {
                head.push('bender.regressions = ', JSON.stringify(reg), ';\n');
            }

            head.push('})(bender);</script></head>');
            
            data.parts.push(head.join(''));

            return data;
        }

        module.exports.build = build;
        bender.pagebuilders.push(build);
    }
};
