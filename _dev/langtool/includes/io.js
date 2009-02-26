/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

importClass( java.io.BufferedReader );
importClass( java.io.BufferedWriter );
importClass( java.io.DataInputStream );
importClass( java.io.File );
importClass( java.io.FileInputStream );
importClass( java.io.FileOutputStream );
importClass( java.io.InputStreamReader );
importClass( java.io.OutputStreamWriter );
importClass( java.lang.StringBuffer );

(function() {
	CKLANGTOOL.io = {
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

		readFileIntoArray: function( file ) {
			var out = [];

			try {
				var fstream = new FileInputStream( file );
				var dis = new DataInputStream( fstream );
				var br = new BufferedReader( new InputStreamReader( dis, "UTF-8" ) );
				var line;

				while ( ( line = br.readLine() ) != null ) {
					out.push( line );
				}
			} catch ( e ) {
				throw 'An I/O error occurred while reading the ' + file.getCanonicalPath() + ' file.';
			} finally {
				dis.close();
			}

			return out;
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
