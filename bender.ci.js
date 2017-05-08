/* jshint browser: false, node: true */

'use strict';
var config = require( './bender' );

config.startBrowser = process.env.BROWSER || 'Chrome';
config.mathJaxLibPath = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js?config=TeX-AMS_HTML';

module.exports = config;
