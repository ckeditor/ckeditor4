/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

// Compressed version of core/ckeditor_base.js. See original for instructions.
/*jsl:ignore*/
if ( !window.CKEDITOR ) {
	window.CKEDITOR = (function() {
		return /**@lends CKEDITOR*/ {
			_: {},
			status: 'unloaded', timestamp: '', basePath: (function() {
				var A = '';
				var B = document.getElementsByTagName( 'script' );
				for ( var i = 0; i < B.length; i++ ) {
					var C = B[ i ].src.match( /(^|.*[\\\/])ckeditor(?:_basic)?(?:_source)?.js(?:\?.*)?$/i );
					if ( C ) {
						A = C[ 1 ];
						break;
					}
				};
				if ( A.indexOf( '://' ) == -1 ) {
					if ( A.indexOf( '/' ) === 0 )
						A = location.href.match( /^.*?:\/\/[^\/]*/ )[ 0 ] + A;
					else
						A = location.href.match( /^[^\?]*\// )[ 0 ] + A;
				};
				return A;
			})(), getUrl: function( resource ) {
				if ( resource.indexOf( '://' ) == -1 && resource.indexOf( '/' ) !== 0 )
					resource = this.basePath + resource;
				if ( this.timestamp )
					resource += ( resource.indexOf( '?' ) >= 0 ? '&' : '?' ) + 't=' + this.timestamp;
				return resource;
			} };
	})();
};
/*jsl:end*/

// Uncomment the following line to have a new timestamp generated for each
// request, having clear cache load of the editor code.
// CKEDITOR.timestamp = ( new Date() ).valueOf();

// Set the script name to be loaded by the loader.
CKEDITOR._autoLoad = 'core/ckeditor_basic';

// Include the loader script.
document.write( '<script type="text/javascript" src="' + CKEDITOR.getUrl( '_source/core/loader.js' ) + '"></script>' );
