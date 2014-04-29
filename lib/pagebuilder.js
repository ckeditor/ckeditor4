var path = require('path'),
    files = [
        path.join(__dirname, '/../static/tools.js'),
        path.join(__dirname, '/../static/bot.js'),
        path.join(__dirname, '/../static/extensions.js')
    ];

function build(data) {
    var scripts = ['<head>'];

    files.forEach(function (file) {
        scripts.push('<script src="/plugins', file, '"></script>');
    });

    if (data.editorPlugins) {
        scripts.push(
            '<script>(function (bender) {',
            'bender.editorPlugins = ',
            JSON.stringify(data.editorPlugins),
            ';})(bender);</script></head>'
        );
    }

    data.parts.push(scripts.join(''));

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
