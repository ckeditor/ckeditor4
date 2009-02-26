/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

importPackage( org.mozilla.javascript );
importClass( java.lang.System );
importClass( java.io.File );

load( "includes/cklangtool.js" );
load( "includes/io.js" );

if ( !arguments[ 0 ] ) {
	error( 'Usage: java -jar js.jar langtool.js [lang_dir]' );
}

CKLANGTOOL.languageDir = new File( arguments[ 0 ] );
CKLANGTOOL.templateFile = new File( arguments[ 0 ], 'en.js' );

if ( !CKLANGTOOL.templateFile.exists() ) {
	error( 'ERROR: The english language file "en.js" was not found (' + CKLANGTOOL.templateFile.getAbsolutePath() + ')' );
}

function error( msg ) {
	print( msg );
	print( '' );
	quit();
}

(function() {
	try {
		var translator = new CKLANGTOOL.translator();
		translator.run();
	} catch ( e ) {
		print( "" );
		error( e );
	}
})();
