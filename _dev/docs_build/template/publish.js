function publish( symbolSet ) {
	publish.conf = { // trailing slash expected for dirs
		ext: ".html",
		outDir: JSDOC.opt.d || SYS.pwd + "../out/jsdoc/",
		templatesDir: JSDOC.opt.t.replace( /\/+$/, '' ) + '/',
		symbolsDir: "symbols/",
		srcDir: "symbols/src/"
	};
	if ( !IO.exists( publish.conf.templatesDir ) ) {
		publish.conf.templatesDir = SYS.userDir.replace( /\\/g, '/' ).replace( /\/+$/ ) + '/' + JSDOC.opt.t.replace( /\/+$/, '' ) + '/';
	}

	if ( JSDOC.opt.s && defined( Link ) && Link.prototype._makeSrcLink ) {
		Link.prototype._makeSrcLink = function( srcFilePath ) {
			return "&lt;" + srcFilePath + "&gt;";
		}
	}

	IO.mkPath( ( publish.conf.outDir + "symbols/src" ).split( "/" ) );

	// used to check the details of things being linked to
	Link.symbolSet = symbolSet;

	try {
		var classTemplate = new JSDOC.JsPlate( publish.conf.templatesDir + "class.tmpl" );
		var classesTemplate = new JSDOC.JsPlate( publish.conf.templatesDir + "allclasses.tmpl" );
	} catch ( e ) {
		print( e.message );
		quit();
	}

	// filters
	function hasNoParent( $ ) {
		return ( $.memberOf == "" )
	}

	function isaFile( $ ) {
		return ( $.is( "FILE" ) )
	}

	function isaClass( $ ) {
		return ( $.is( "CONSTRUCTOR" ) || $.isNamespace )
	}

	var symbols = symbolSet.toArray();

	var files = JSDOC.opt.srcFiles;
	for ( var i = 0, l = files.length; i < l; i++ ) {
		var file = files[ i ];
		var srcDir = publish.conf.outDir + "symbols/src/";
		makeSrcFile( file, srcDir );
	}

	var classes = symbols.filter( isaClass ).sort( makeSortby( "alias" ) );

	Link.base = "../";
	publish.classesIndex = classesTemplate.process( classes ); // kept in memory

	for ( var i = 0, l = classes.length; i < l; i++ ) {
		var symbol = classes[ i ];
		var output = "";
		output = classTemplate.process( symbol );

		IO.saveFile( publish.conf.outDir + "symbols/", symbol.alias + publish.conf.ext, output );
	}

	// regenrate the index with different relative links
	Link.base = "";
	publish.classesIndex = classesTemplate.process( classes );

	try {
		var classesindexTemplate = new JSDOC.JsPlate( publish.conf.templatesDir + "index.tmpl" );
	} catch ( e ) {
		print( e.message );
		quit();
	}

	var classesIndex = classesindexTemplate.process( classes );
	IO.saveFile( publish.conf.outDir, "index" + publish.conf.ext, classesIndex );
	classesindexTemplate = classesIndex = classes = null;

	try {
		var fileindexTemplate = new JSDOC.JsPlate( publish.conf.templatesDir + "allfiles.tmpl" );
	} catch ( e ) {
		print( e.message );
		quit();
	}

	var documentedFiles = symbols.filter( isaFile );
	var allFiles = [];

	for ( var i = 0; i < files.length; i++ ) {
		allFiles.push( new JSDOC.Symbol( files[ i ], [], "FILE", new JSDOC.DocComment( "/** */" ) ) );
	}

	for ( var i = 0; i < documentedFiles.length; i++ ) {
		var offset = files.indexOf( documentedFiles[ i ].alias );
		allFiles[ offset ] = documentedFiles[ i ];
	}

	//Correct file names in files.html
	for ( var i = 0; i < allFiles.length; i++ ) {
		allFiles[ i ].alias = allFiles[ i ].alias.replace( /\/\\/, "\\" ).replace( /.*_source(\/|\\)+/, '' );
		allFiles[ i ].name = allFiles[ i ].alias;
	}

	allFiles = allFiles.sort( ckeditor_sortFiles );

	var filesIndex = fileindexTemplate.process( allFiles );
	IO.saveFile( publish.conf.outDir, "files" + publish.conf.ext, filesIndex );
	fileindexTemplate = filesIndex = files = null;
}


/** Just the first sentence. Should not break on dotted variable names. */
function summarize( desc ) {
	if ( typeof desc != "undefined" )
		return desc.match( /([\w\W]+?\.)[^a-z0-9_$]/i ) ? RegExp.$1 : desc;
}

/** make a symbol sorter by some attribute */
function makeSortby( attribute ) {
	return function( a, b ) {
		if ( a[ attribute ] != undefined && b[ attribute ] != undefined ) {
			a = a[ attribute ].toLowerCase();
			b = b[ attribute ].toLowerCase();
			if ( a < b )
				return -1;
			if ( a > b )
				return 1;
			return 0;
		}
	}
}

function include( path ) {
	var path = publish.conf.templatesDir + path;
	return IO.readFile( path );
}

function makeSrcFile( path, srcDir, name ) {
	if ( JSDOC.opt.s )
		return;

	if ( !name ) {
		name = path.replace( /.*\.\.?[\\\/](.*)/g, "$1" ).replace( /\/\\/, "\\" ).replace( /[\\\/]/g, "_" ).replace( /.*?_source_/, "" );
		name = name.replace( /\:/g, "_" );
	}

	var src = { path: path, name: name, charset: IO.encoding, hilited: "" };

	if ( defined( JSDOC.PluginManager ) ) {
		JSDOC.PluginManager.run( "onPublishSrc", src );
	}

	if ( src.hilited ) {
		IO.saveFile( srcDir, name + publish.conf.ext, src.hilited );
	}
}

function makeSignature( params ) {
	if ( !params )
		return "()";
	var signature = "(" +
		params.filter( function( $ ) {
		return $.name.indexOf( "." ) == -1; // don't show config params in signature
	}).map( function( $ ) {
		return $.name;
	}).join( ", " )
		+
		")";
	return signature;
}

/** Find symbol {@link ...} strings in text and turn into html links */
function resolveLinks( str, from ) {
	str = str.replace( /\{@link ([^} ]+) ?\}/gi, function( match, symbolName ) {
		return new Link().toSymbol( symbolName );
	});

	return str;
}

function ckeditor_sortFiles( a, b ) {
	a = a.name;
	b = b.name;
	return a < b ? -1 : a > b ? 1 : 0;
}

/** Sorts a symbol by its type */
function ckeditor_sortByType( a, b ) {
	var weightA = a.isConstant ? 1 : a.isStatic ? 2 : a.isPrivate ? 3 : a.isInner ? 4 : 5;

	var weightB = b.isConstant ? 1 : b.isStatic ? 2 : b.isPrivate ? 3 : b.isInner ? 4 : 5;

	if ( weightA == weightB ) {
		weightA = a.name.toLowerCase();
		weightB = b.name.toLowerCase();
	}

	return weightA < weightB ? -1 : weightA > weightB ? 1 : 0;
}

function ckeditor_FileLink( filePath ) {
	var text = filePath;

	if ( /_source/.test( text ) ) {
		text = text.replace( /[\/\\]+/g, '/' );
		text = text.replace( /.*_source(\/|\\)+/, '' );

		return new Link().toSrc( text ).withText( text );
	}

	return new Link().toSrc( filePath );
}
