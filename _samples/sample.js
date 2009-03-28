/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

// This file is not required by CKEditor and may be safely ignored.
// It is just a helper file that displays a red message about browser compatibility
// at the top of the samples (if incompatible browser is detected).
// %REMOVE_START%
// In the SVN version of CKEditor, it does some more magic, for example it
// redirects all samples to the sample.html file. It still can be ignored anyway.
// %REMOVE_END%

// Firebug has been presented some bugs with console. It must be "initialized"
// before the page load to work.
// FIXME: Remove the following in the future, if Firebug gets fixed.
if ( typeof console != 'undefined' )
	console.log();

// %REMOVE_START%
(function() {
	// The sample##.html files also include this script. We don't want them to
	// run, so we redirect to the samples.html page, passing the correct
	// querystring parameter to load the desired page.

	var sampleMatch = window.location.pathname.match( /[\/\\]([^\/\\]+).html/ );
	if ( sampleMatch && sampleMatch[ 1 ] != 'sample' )
		window.location = 'sample.html?sample=' + sampleMatch[ 1 ] + ( location.search.length > 1 ? '&' + location.search.substr( 1 ) : '' );
})();
// %REMOVE_END%

if ( window.CKEDITOR ) {
	// %REMOVE_START%
	CKEDITOR.samples = (function() {
		var ajax = CKEDITOR.ajax;

		// Default values for the CKEDITOR.samples properties.
		var samples = {
			htmlData: '<p>No HTML data available.</p>',
			codeData: '<p>No code data available.</p>'
		};

		if ( /[?&]sample=[^&]+/.test( document.location.search ) ) {
			var currentSample = document.location.search.match( /[?&]sample=([^&]+)/ )[ 1 ];
			var sampleData = ajax.loadXml( CKEDITOR.getUrl( '_samples/' + currentSample + '.html' ) );

			if ( sampleData ) {
				var getNodeHtml = function( id ) {
						return sampleData.getInnerXml( '//*[@id="' + id + '"]' );
					};

				samples.headScript = getNodeHtml( 'headscript' ) || '';
				samples.styles = getNodeHtml( 'styles' ) || '';
				samples.htmlData = getNodeHtml( 'html' ) || '';
				samples.codeData = getNodeHtml( 'code' ) || '';

				if ( samples.headScript )
					samples.headScript = '<script id="headscript" type="text/javascript">' + samples.headScript + '</script>';

				if ( samples.styles )
					samples.styles = '<style id="styles" type="text/css">' + samples.styles + '</style>';

				// The '//*/*/*' XPath is the only way to make it work with
				// xmlns="http://www.w3.org/1999/xhtml" without workarounds. It
				// means that we must always have <html><head><title> in this
				// precise order.
				document.title = sampleData.getInnerXml( '//*/*/*' );
			}
		}

		return samples;
	})();
	// %REMOVE_END%
	(function() {
		var showCompatibilityMsg = function() {
				var env = CKEDITOR.env;

				var html = '<p><strong>Your browser is not compatible with CKEditor.</strong>';

				var browsers = {
					gecko: 'Firefox 1.5',
					ie: 'Internet Explorer 6.0',
					opera: 'Opera 9.5',
					webkit: 'Safari 3.0'
				};

				var alsoBrowsers = '';

				for ( var key in env ) {
					if ( browsers[ key ] ) {
						if ( env[ key ] )
							html += ' CKEditor is compatible with ' + browsers[ key ] + ' or higher.';
						else
							alsoBrowsers += browsers[ key ] + '+, ';
					}
				}

				alsoBrowsers = alsoBrowsers.replace( /\+,([^,]+), $/, '+ and $1' );

				html += ' It is also compatible with ' + alsoBrowsers + '.';

				html += '</p><p>With non compatible browsers, you should still be able to see and edit the contents (HTML) in a plain text field.</p>';

				document.getElementById( 'alerts' ).innerHTML = html;
			};

		var onload = function() {
				// Show a friendly compatibility message as soon as the page is loaded,
				// for those browsers that are not compatible with CKEditor.
				if ( !CKEDITOR.env.isCompatible )
					showCompatibilityMsg();
			};

		// Register the onload listener.
		if ( window.addEventListener )
			window.addEventListener( 'load', onload, false );
		else if ( window.attachEvent )
			window.attachEvent( 'onload', onload );
	})();
}
