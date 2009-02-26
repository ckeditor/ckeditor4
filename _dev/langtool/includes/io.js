/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

importClass( java.io.BufferedReader );
importClass( java.io.BufferedWriter );
importClass( java.io.File );
importClass( java.io.FileWriter );
importClass( java.io.FileOutputStream );
importClass( java.io.FileInputStream );
importClass( java.io.InputStreamReader );
importClass( java.io.FileOutputStream );
importClass( java.io.OutputStreamWriter );
importClass( java.lang.StringBuffer );

(function() {
	function copyFile( sourceLocation, targetLocation ) {
		try {
			var inStream = new FileInputStream( sourceLocation );
			var outStream = new FileOutputStream( targetLocation );

			var len,
				buf = new Packages.java.lang.reflect.Array.newInstance( java.lang.Byte.TYPE, 1024 );

			while ( ( len = inStream.read( buf ) ) != -1 ) {
				outStream.write( buf, 0, len );
			}
			inStream.close();
			outStream.close();
		} catch ( e ) {
			throw "Cannot copy file:\n Source: " + sourceLocation.getCanonicalPath() + "\n Destination : "
									+ targetLocation.getCanonicalPath() + "\n" + e.message;
		}
	}

	CKLANGTOOL.io = {
		copyFile: copyFile,

		deleteDirectory: function( path ) {
			var dir = new File( path );

			if ( dir.isDirectory() ) {
				var children = dir.list();
				for ( var i = 0; i < children.length; i++ ) {
					if ( !this.deleteDirectory( new File( dir, children[ i ] ) ) ) {
						return false;
					}
				}
			}

			return dir[ "delete" ]();
		},

		deleteFile: function( path ) {
			var f = new File( path );

			if ( !f.exists() )
				return true;

			if ( !f.canWrite() )
				throw "Cannot delete file: " + f.getAbsolutePath();

			return f[ "delete" ]();
		},

		saveFile: function( file, text, includeBom ) {
			try {
				var stream = new BufferedWriter( new OutputStreamWriter( new FileOutputStream( file ), "UTF-8" ) );
				if ( includeBom )
					stream.write( 65279 );
				stream.write( text );
				stream.flush();
				stream.close();
			} catch ( e ) {
				throw "Cannot save file:\n Path: " + file.getCanonicalPath() + "\n Eception details: " + e.message;
			}
		},

		copy: function( sourceLocation, targetLocation ) {
			if ( CKLANGTOOL.verbose )
				print( "    Copy -> " + targetLocation.toString().replaceFirst( ".*?release(/|\\\\)?", '' ) );

			if ( sourceLocation.isDirectory() ) {
				if ( !targetLocation.exists() ) {
					targetLocation.mkdir();
				}

				var children = sourceLocation.list();
				for ( var i = 0; i < children.length; i++ ) {
					this.copy( new File( sourceLocation, children[ i ] ), new File( targetLocation, children[ i ] ) );
				}
			} else {
				copyFile( sourceLocation, targetLocation );
			}
		},

		/**
		 * Reads file and returns file contents without initial UTF-8 Byte Order
		 * Mark
		 */
		readFile: function( file ) {
			var buffer = new StringBuffer();
			var chars = new Packages.java.lang.reflect.Array.newInstance( java.lang.Character.TYPE, 8192 );
			var count;

			try {
				var inStream = new InputStreamReader( new FileInputStream( file ), "UTF-8" );

				while ( ( count = inStream.read( chars, 0, 8192 ) ) != -1 ) {
					if ( count > 0 ) {
						buffer.append( chars, 0, count );
					}
				}
			} catch ( e ) {
				throw 'An I/O error occurred while reading the ' + file.getCanonicalPath() + ' file.';
			} finally {
				inStream.close();
			}

			/* http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4508058 */
			if ( buffer.length() && buffer.charAt( 0 ) == 65279 )
				buffer.deleteCharAt( 0 );

			return String( buffer.toString() );
		},

		getDirectoryInfo: function( file ) {
			var path_iterator, current_file, files,
				result = {
				files: 0,
				size: 0
			};

			if ( !file.exists() )
				return result;

			files = file.listFiles();

			if ( !files )
				return result;

			path_iterator = ( java.util.Arrays.asList( files ) ).iterator();

			while ( path_iterator.hasNext() ) {
				current_file = path_iterator.next();
				if ( current_file.isFile() ) {
					result.size += current_file.length();
					result.files++;
				} else {
					var info = this.getDirectoryInfo( current_file );
					result.size += info.size;
					result.files += info.files;
				}
			}

			return result;
		},

		getFileName: function( filePath ) {
			var file = new File( filePath );
			return file.getName();
		},

		getExtension: function( fileName ) {
			var pos = fileName.lastIndexOf( "." );
			if ( pos == -1 )
				return "";
			else
				return String( fileName.substring( pos + 1 ).toLowerCase() );
		}
	};
})();
