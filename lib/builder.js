var fs = require('fs'),
    whenNode = require('when/node'),
    whenKeys = require('when/keys'),
    pattern = /\/\* bender\-ckeditor\-plugins\:([\w\, ]+)([^*]|[\r\n])*\*\//i;

/**
 * Find "bender-ckeditor-plugins" comment and return matched plugins
 * @param  {Buffer} data File buffer
 * @return {Array.<String>}
 */
function parseMeta(data) {
    var match = pattern.exec(data.toString());

    return match ? match[1].replace(/\s/g, '').split(',') : [];
}

/**
 * Add CKEditor plugins to tests in given group
 * @param  {Object} data Group object
 * @return {Promise}
 */
function build(data) {
    var files = {};

    // add plugins to tests in given group object 
    function addPlugins(results) {
        Object.keys(results).forEach(function (id) {
            data.tests[id].editorPlugins = results[id];
        });

        return data;
    }

    // create a promise for given test id
    function makePromise(id) {
        files[id] = whenNode
            .call(fs.readFile, data.tests[id].js)
            .then(parseMeta);
    }

    Object.keys(data.tests).forEach(makePromise);

    return whenKeys
        .all(files)
        .then(addPlugins);
}

module.exports = {
    name: 'bender-builder-ckeditor',

    attach: function () {
        this.builders.push(build);
    }
};
