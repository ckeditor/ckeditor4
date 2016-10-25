/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

// Compressed version of core/ckeditor_base.js. See original for instructions.
/* jshint ignore:start */
/* jscs:disable */
window.CKEDITOR||(window.CKEDITOR=function(){var e=/(^|.*[\\\/])ckeditor\.js(?:\?.*|;.*)?$/i,b={timestamp:"",version:"%VERSION%",revision:"%REV%",rnd:Math.floor(900*Math.random())+100,_:{pending:[],basePathSrcPattern:e},status:"unloaded",basePath:function(){var a=window.CKEDITOR_BASEPATH||"";if(!a)for(var b=document.getElementsByTagName("script"),c=0;c<b.length;c++){var f=b[c].src.match(e);if(f){a=f[1];break}}-1==a.indexOf(":/")&&"//"!=a.slice(0,2)&&(a=0===a.indexOf("/")?location.href.match(/^.*?:\/\/[^\/]*/)[0]+
a:location.href.match(/^[^\?]*\/(?:)/)[0]+a);if(!a)throw'The CKEditor installation path could not be automatically detected. Please set the global variable "CKEDITOR_BASEPATH" before creating editor instances.';return a}(),getUrl:function(a){-1==a.indexOf(":/")&&0!==a.indexOf("/")&&(a=this.basePath+a);this.timestamp&&"/"!=a.charAt(a.length-1)&&!/[&?]t=/.test(a)&&(a+=(0<=a.indexOf("?")?"&":"?")+"t="+this.timestamp);return a},domReady:function(){function a(){try{document.addEventListener?(document.removeEventListener("DOMContentLoaded",
a,!1),b()):document.attachEvent&&"complete"===document.readyState&&(document.detachEvent("onreadystatechange",a),b())}catch(f){}}function b(){for(var a;a=c.shift();)a()}var c=[];return function(b){c.push(b);"complete"===document.readyState&&setTimeout(a,1);if(1==c.length)if(document.addEventListener)document.addEventListener("DOMContentLoaded",a,!1),window.addEventListener("load",a,!1);else if(document.attachEvent){document.attachEvent("onreadystatechange",a);window.attachEvent("onload",a);b=!1;try{b=
!window.frameElement}catch(e){}if(document.documentElement.doScroll&&b){var d=function(){try{document.documentElement.doScroll("left")}catch(b){setTimeout(d,1);return}a()};d()}}}}()},d=window.CKEDITOR_GETURL;if(d){var g=b.getUrl;b.getUrl=function(a){return d.call(b,a)||g.call(b,a)}}return b}());
/* jscs:enable */
/* jshint ignore:end */

if ( CKEDITOR.loader )
	CKEDITOR.loader.load( 'ckeditor' );
else {
	// Set the script name to be loaded by the loader.
	CKEDITOR._autoLoad = 'ckeditor';

	// Include the loader script.
if (false)
	// MP 12/22/2014: Following this code path we get this error:
	// Failed to execute 'write' on 'Document': It isn't possible to write into a document from an asynchronously-loaded external script unless it is explicitly opened.
	// See also core/loader.js
	if ( document.body && ( !document.readyState || document.readyState == 'complete' ) ) {
		var script = document.createElement( 'script' );
		script.type = 'text/javascript';
		script.src = CKEDITOR.getUrl( 'core/loader.js' );
		document.body.appendChild( script );
	} else {
		document.write( '<script type="text/javascript" src="' + CKEDITOR.getUrl( 'core/loader.js' ) + '"></script>' );
	}
else
	$('head').append($('<script>').attr({
	    type: 'text/javascript',
	    src: CKEDITOR.getUrl('core/loader.js')
	}));

}

/**
 * The skin to load for all created instances, it may be the name of the skin
 * folder inside the editor installation path, or the name and the path separated
 * by a comma.
 *
 * **Note:** This is a global configuration that applies to all instances.
 *
 *		CKEDITOR.skinName = 'moono';
 *
 *		CKEDITOR.skinName = 'myskin,/customstuff/myskin/';
 *
 * @cfg {String} [skinName='moono']
 * @member CKEDITOR
 */
CKEDITOR.skinName = 'moono';
