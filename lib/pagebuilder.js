var path = require('path'),
    files = [
        path.join(__dirname, '/../static/tools.js'),
        path.join(__dirname, '/../static/bot.js'),
        path.join(__dirname, '/../static/extensions.js')
    ];

function build(data) {
    var head = ['<head>'];

    head.push('<title>', data.id, '</title>');

    files.forEach(function (file) {
        head.push('<script src="/plugins', file, '"></script>');
    });

    if (data.editorPlugins) {
        head.push(
            '<script>(function (bender) {',
            'bender.editorPlugins = ',
            JSON.stringify(data.editorPlugins),
            ';})(bender);</script></head>'
        );
    }

    // TODO plugin removal

    data.parts.push(head.join(''));

    return data;
}

module.exports = {

    name: 'bender-pagebuilder-ckeditor',

    files: files,
    
    build: build,
    
    attach: function () {
        this.pagebuilders.push(build);
    }
};
