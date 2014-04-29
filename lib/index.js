var path = require('path'),
    fs = require('fs');

module.exports = {
    name: 'bender-ckeditor',

    attach: function () {
        var bender = this;

        fs.readdirSync(__dirname).forEach(function (file) {
            if (file === 'index.js') return;

            bender.use(require(path.join(__dirname, file)));
        });
    }
};
