/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

importPackage( java.util.regex );

var CKLANGTOOL = {
	languageDir: "",
	templateFile: "",
	/**
	 * Holds the content of en.js language file where strings are replaced with
	 * special placeholders: #ckeditor_translation.placeholder.key#.
	 */
	template: ""
};

(function() {
	CKLANGTOOL.translator = function() {
		CKLANGTOOL.englishTranslation = {};
	};

	/**
	 * Language code of currently processed file (taken from
	 * CKEDITOR.lang['code']).
	 */
	var languageCode;
	var fileOverviewBlock;

	/**
	 * Check whether the javascript file is valid.
	 */
	function checkFile( file ) {
		var compilerEnv = new CompilerEnvirons();
		var errorReporter = compilerEnv.getErrorReporter();
		var parser = new Parser( compilerEnv, errorReporter );

		try {
			parser.parse( 'var CKEDITOR = { lang : {} }; ' + CKLANGTOOL.io.readFile( file ), null, 1 );
			return false;
		} catch ( e ) {
			throw ( "Error in " + file.getAbsolutePath() + "\n" + "Line: " + e.lineNumber + "\nMessage: " + e.message );
		}
	}

	/**
	 * Load language file and return an object with the whole translation.
	 */
	function loadLanguageFile( file ) {
		var translationCode = 'var CKEDITOR = { lang : {} }; ' + CKLANGTOOL.io.readFile( file );

		var cx = Context.enter(),
			scope = cx.initStandardObjects();

		cx.evaluateString( scope, translationCode, file.getName(), 1, null );

		try {
			languageCode = '';

			/*
			 * Get the number of variables in parent scope.
			 */
			var size = 0;
			for ( var i in scope ) {
				size++;
			}

			/*
			 * If there is more than one variable, then it's not a CKEDITOR language file.
			 */
			if ( size > 1 ) {
				/**
				 * Return the first variable from parent scope different than
				 * CKEDITOR.
				 */
				for ( var i in scope ) {
					if ( i != "CKEDITOR" )
						return scope[ i ];
				}
			} else {
				/*
				 * Return the first entry from scope.CKEDITOR.lang object
				 */
				for ( var i in scope.CKEDITOR.lang ) {
					languageCode = i;
					return scope.CKEDITOR.lang[ i ];
				}
			}
		} catch ( e ) {
			throw ( "Language file is invalid (" + file.getAbsolutePath() + ")" );
		}
	}

	var regexLib = {
		inlineComment: Pattern.compile( "^\\s*\\/\\/" ),
		missing: Pattern.compile( "\\/\\/\\s*MISSING", Pattern.CASE_INSENSITIVE ),
		blockCommentStart: Pattern.compile( "\\/\\*" ),
		blockCommentEnd: Pattern.compile( "\\*\\/" ),
		entry: Pattern.compile( "^(\\s*)([a-z0-9]+)(\\s*:\\s*\\').*?(\\'.*)$", Pattern.CASE_INSENSITIVE ),
		arrayEntry: Pattern.compile( "^(\\s*)([a-z0-9]+)(\\s*:\\s*\\[)(.*?)(\\].*)$", Pattern.CASE_INSENSITIVE ),
		arrayItemEntry: Pattern.compile( "\\s*(?:'(.*?)'(?:\\s*,\\s*)?)" ),
		arrayTranslationKey: Pattern.compile( "^(.*)\\[(\\d+)\\]$" ),
		objectName: Pattern.compile( "^\\s*([a-z][a-z0-9]*)\\s*:\\s*$", Pattern.CASE_INSENSITIVE ),
		objectStart: Pattern.compile( "\\{" ),
		objectEnd: Pattern.compile( "\\}" ),
		fileOverview: Pattern.compile( " @fileOverview" ),
		translation: Pattern.compile( "#ckeditor_translation[^#]*?#" ),
		ckeditorLang: Pattern.compile( "(.*CKEDITOR\\.lang\\[).*?(\\]\\s*=.*)" )
	};

	/**
	 * Returns an array with missing keys (already marked as //MISSING).
	 */
	function analyzeLanguageFile( file ) {
		fileOverviewBlock = '/**\n* @fileOverview \n*/';

		var key = "ckeditor_translation";
		var out = {};
		var inBlockComment = false;
		var blockComment = [];
		var objectName, matcher, line, translationKey;
		var lines = CKLANGTOOL.io.readFileIntoArray( file );

		for ( var j = 0; j < lines.length; j++ ) {
			line = lines[ j ];
			if ( !inBlockComment ) {
				matcher = regexLib.inlineComment.matcher( line );
				if ( matcher.find() ) {
					continue;
				}

				matcher = regexLib.blockCommentStart.matcher( line );
				if ( matcher.find() ) {
					inBlockComment = true;
					blockComment.push( line );
					continue;
				}

				matcher = regexLib.objectName.matcher( line );
				if ( matcher.find() ) {
					objectName = matcher.group( 1 );
					continue;
				}

				if ( objectName ) {
					matcher = regexLib.objectStart.matcher( line );
					/*
					 * We have found an opening bracket, key -> key.objectName
					 */
					if ( matcher.find() ) {
						key = key + "." + objectName;
						continue;
					}

					matcher = regexLib.objectEnd.matcher( line );
					/*
					 * We have found a closing bracket, key.objectName -> key
					 */
					if ( matcher.find() ) {
						key = key.slice( 0, key.lastIndexOf( "." ) );
						continue;
					}
				}

				/*
				 * Get rid of all escaped quotes, we don't need the exact content at this stage, just the key
				 */
				matcher = regexLib.entry.matcher( line.replaceAll( "\\\\'", "" ) );
				if ( matcher.find() && regexLib.missing.matcher( line ).find() ) {
					translationKey = key + "." + matcher.group( 2 );
					translationKey = translationKey.replace( /^ckeditor_translation\./, "" );
					out[ translationKey ] = true;
				}

				/* 
				 * Get rid of all escaped quotes, we don't need the exact content at this stage, just the key.
				 */
				matcher = regexLib.arrayEntry.matcher( line.replaceAll( "\\\\'", "" ) );
				if ( matcher.find() && regexLib.missing.matcher( line ).find() ) {
					translationKey = key + "." + matcher.group( 2 );
					translationKey = translationKey.replace( /^ckeditor_translation\./, "" );
					out[ translationKey ] = true;
				}
			} else {
				blockComment.push( line );

				matcher = regexLib.blockCommentEnd.matcher( line );
				if ( matcher.find() ) {
					inBlockComment = false;

					matcher = regexLib.fileOverview.matcher( blockComment.join( "" ) );
					if ( matcher.find() ) {
						fileOverviewBlock = blockComment.join( "\n" );
					}
					blockComment = [];
				}
			}
		}

		return out;
	}

	/**
	 * Creates template from the english language file.
	 * 
	 * All strings are replaced with placeholders:
	 * #ckeditor_translation.translationKey#
	 * 
	 * There are also two special placeholders:
	 * #ckeditor_translation.__languageCode# (language code)
	 * 
	 * #ckeditor_translation.__fileOverview# (the block comment with the file
	 * description)
	 */
	function createTemplate( file ) {
		var key = "ckeditor_translation";
		var out = [];
		var inBlockComment = false;
		var blockComment = [];
		var i, matcher, matchResult, objectName, string, line;
		var arrayEntryItems, arrayEntryItemsMatcher, arrayEntryLineEnd, arrayEntryLine, arrayEntryKey;
		var lines = CKLANGTOOL.io.readFileIntoArray( file );

		for ( var j = 0; j < lines.length; j++ ) {
			line = lines[ j ];

			if ( !inBlockComment ) {
				matcher = regexLib.inlineComment.matcher( line );
				if ( matcher.find() ) {
					out.push( line );
					continue;
				}

				matcher = regexLib.blockCommentStart.matcher( line );
				if ( matcher.find() ) {
					inBlockComment = true;
					blockComment.push( line );
					continue;
				}

				matcher = regexLib.objectName.matcher( line );
				if ( matcher.find() ) {
					objectName = matcher.group( 1 );
					out.push( line );
					continue;
				}

				if ( objectName ) {
					matcher = regexLib.objectStart.matcher( line );
					/*
					 * We have found an opening bracket, key -> key.objectName
					 */
					if ( matcher.find() ) {
						key = key + "." + objectName;
						out.push( line );
						continue;
					}

					matcher = regexLib.objectEnd.matcher( line );
					/*
					 * We have found a closing bracket, key.objectName -> key
					 */
					if ( matcher.find() ) {
						key = key.slice( 0, key.lastIndexOf( "." ) );
						out.push( line );
						continue;
					}
				}

				/* 
				 * Find CKEDITOR.lang['en']
				 */
				matcher = regexLib.ckeditorLang.matcher( line );
				if ( matcher.find() ) {
					out.push( matcher.group( 1 ) + "'#ckeditor_translation.__languageCode#'" + matcher.group( 2 ) );
					continue;
				}

				/* 
				 * Get rid of all escaped quotes, we don't need the exact content at this stage, just the key.
				 * We're changing here the entry into the key.
				 * So 'Upload' becomes '#ckeditor_translation.Upload#' in our temporary template.  
				 */
				matcher = regexLib.entry.matcher( line.replaceAll( "\\\\'", "" ) );
				if ( matcher.find() ) {
					out.push( matcher.group( 1 ) + matcher.group( 2 ) + matcher.group( 3 ) + "#" + key + "." + matcher.group( 2 ) + "#"
													+ matcher.group( 4 ) );
					continue;
				}

				/* 
				 * Get rid of all escaped quotes, we don't need the exact content at this stage, just the key.
				 * We're changing here the entry into the key.
				 * So ['AM', 'PM'] becomes 
				 * ['#ckeditor_translation.DateAmPm[0]#', '#ckeditor_translation.DateAmPm[1]#'] 
				 * in our temporary template.  
				 */
				matcher = regexLib.arrayEntry.matcher( line.replaceAll( "\\\\'", "" ) );
				if ( matcher.find() ) {
					i = 0;

					arrayEntryLine = matcher.group( 1 ) + matcher.group( 2 ) + matcher.group( 3 );
					arrayEntryKey = matcher.group( 2 );
					arrayEntryLineEnd = matcher.group( 5 );
					arrayEntryItems = matcher.group( 4 );

					arrayEntryItemsMatcher = regexLib.arrayItemEntry.matcher( arrayEntryItems );
					while ( arrayEntryItemsMatcher.find() ) {
						matchResult = arrayEntryItemsMatcher.toMatchResult();
						if ( i > 0 ) {
							arrayEntryLine += ", ";
						}
						arrayEntryLine += "'#" + key + "." + arrayEntryKey + "[" + i + "]" + "#'";
						i++;
					}
					arrayEntryLine += arrayEntryLineEnd;
					out.push( arrayEntryLine );
					continue;
				}

				out.push( line );
			} else {
				blockComment.push( line );

				matcher = regexLib.blockCommentEnd.matcher( line );
				if ( matcher.find() ) {
					inBlockComment = false;

					matcher = regexLib.fileOverview.matcher( blockComment.join( "" ) );
					/**
					 * Add a placeholder for the fileOverview section.
					 */
					if ( matcher.find() ) {
						out.push( "#ckeditor_translation.__fileOverview#" );
					} else {
						out.push( blockComment.join( "\n" ) );
					}
					blockComment = [];
				}
			}
		}

		/**
		 * Uncomment this line to see the template.
		 */
		// CKLANGTOOL.io.saveFile( new File( CKLANGTOOL.languageDir, "template.txt" ), out.join( "\r\n" ), false );
		return out.join( "\n" );
	}

	/**
	 * Return translation[translationKey].
	 * 
	 * If translation contains dots, for example: common.textField then return
	 * translation[common][textfield]
	 */
	function getTranslation( translation, translationKey ) {
		var dotPos;
		var result = translation;

		/**
		 * Special case, return the language code of processed file.
		 */
		if ( translationKey == "__languageCode" )
			return languageCode;

		/**
		 * Special case, return the fileOverview block of processed file.
		 */
		if ( translationKey == "__fileOverview" )
			return fileOverviewBlock;

		while ( ( dotPos = translationKey.indexOf( "." ) ) != -1 ) {
			result = result[ translationKey.substring( 0, dotPos ) ];
			if ( typeof( result ) == "undefined" ) {
				return false;
			}
			translationKey = translationKey.slice( dotPos + 1 );
		}

		/*
		 * First make sure that the translationKey is not an array.
		 */
		var matcher = regexLib.arrayTranslationKey.matcher( translationKey );
		if ( matcher.find() ) {
			if ( typeof( result[ matcher.group( 1 ) ] ) != "object" ) {
				return false;
			}
			result = result[ matcher.group( 1 ) ][ matcher.group( 2 ) ];
		} else {
			result = result[ translationKey ];
		}

		if ( typeof( result ) == "undefined" ) {
			return false;
		}

		return result.replace( "\\", "\\\\" ).replace( "\r", "\\r" ).replace( "\n", "\\n" ).replace( "'", "\\'" );
	}

	function processFile( file ) {
		translation = loadLanguageFile( file );
		var missingKeys = analyzeLanguageFile( file );
		var matchResult, replacement, translationKey;
		var string = CKLANGTOOL.template;
		var matcher = regexLib.translation.matcher( string );
		var found = 0,
			missing = 0;

		while ( matcher.find() ) {
			matchResult = matcher.toMatchResult();
			/*
			 * #ckeditor_translation.common.textField# -> common.textField
			 */
			translationKey = matchResult.group( 0 ).slice( 22, -1 );
			replacement = getTranslation( translation, translationKey );

			if ( translationKey.substring( 0, 2 ) != "__" )
				found++;
			/*
			 * common.textField[1] -> common.textField
			 */
			if ( replacement == false || missingKeys[ translationKey.replace( /\[\d+\]$/, "" ) ] ) {
				/**
				 * FoldersTitle : '#ckeditor_translation.FoldersTitle#', ->
				 * FoldersTitle : '[MISSING_TRANSLATION]Folders',
				 */
				replacement = "[MISSING_TRANSLATION]" + getTranslation( CKLANGTOOL.englishTranslation, translationKey );
				string = ( string.substring( 0, matchResult.start() ) + replacement + string.substring( matchResult.end() ) );

				if ( translationKey.substring( 0, 2 ) != "__" )
					missing++;
			} else {
				string = ( string.substring( 0, matchResult.start() ) + replacement + string.substring( matchResult.end() ) );
			}

			matcher.reset( string );
		}

		/**
		 * Loop through all lines, remove [MISSING_TRANSLATION] and add
		 * //MISSING comment at the end of line (if necessary).
		 */
		var line,
			lines = string.split( "\n" );
		for ( var i = 0; i < lines.length; i++ ) {
			line = lines[ i ];
			if ( line.indexOf( "[MISSING_TRANSLATION]" ) != -1 ) {
				if ( line.indexOf( "//" ) == -1 ) {
					lines[ i ] = line.replace( /\[MISSING_TRANSLATION\]/g, '' ) + " // MISSING";
				} else {
					lines[ i ] = line.replace( "//", "// MISSING" ).replace( /\[MISSING_TRANSLATION\]/g, '' );
				}
			}
		}

		CKLANGTOOL.io.saveFile( file, lines.join( "\r\n" ), false );

		var result = {
			found: found,
			missing: missing
		};

		return result;
	}

	function padRight( value, length ) {
		return value + Array( length - value.length() ).join( " " );
	}

	CKLANGTOOL.translator.prototype = {
		run: function() {
			CKLANGTOOL.template = createTemplate( CKLANGTOOL.templateFile );
			CKLANGTOOL.englishTranslation = loadLanguageFile( CKLANGTOOL.templateFile );

			var children = CKLANGTOOL.languageDir.list();
			var errors, file,
				status = [];
			var foundFiles = false;

			for ( var i = 0; i < children.length; i++ ) {
				if ( children[ i ] == 'en.js' )
					continue;

				if ( CKLANGTOOL.io.getExtension( children[ i ] ) != "js" )
					continue;

				file = new File( CKLANGTOOL.languageDir, children[ i ] );
				if ( file.isFile() ) {
					print( "Processing " + file.getAbsolutePath() );
					result = processFile( file );
					checkFile( file );

					status.push( padRight( children[ i ], 12 ) + "Found: " + result.found + " Missing: " + result.missing );
					foundFiles = true;
				}
			}

			if ( !foundFiles ) {
				print( "WARNING: language files not found." );
			}

			CKLANGTOOL.io.saveFile( new File( CKLANGTOOL.languageDir, "_translationstatus.txt" ), status.join( "\r\n" ), false );
			print( "Process completed." );
		}
	};
})();
