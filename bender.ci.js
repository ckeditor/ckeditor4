/* jshint browser: false, node: true */

'use strict';
var config = require( './bender' );

config.startBrowser = process.env.BROWSER || 'Chrome';
config.mathJaxLibPath = 'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML';

module.exports = config;
