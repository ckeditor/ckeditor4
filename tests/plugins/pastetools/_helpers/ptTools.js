/* exported pfwTools */

( function() {
	'use strict';

	window.ptTools = {
		ignoreTestsOnMobiles: function( tests ) {
			tests._should = tests._should || { ignore: {} };

			if ( bender.tools.env.mobile ) {
				CKEDITOR.tools.array.forEach( CKEDITOR.tools.object.keys( tests ), function( tcName ) {
					tests._should.ignore[ tcName ] = true;
				} );
			}

			return tests;
		},

		loadFilters: function loadFilters( filters, callback ) {
			var loaded = 0,
				i;

			for ( i = 0; i < filters.length; i++ ) {
				( function( current ) {
					CKEDITOR.scriptLoader.queue( current, function() {
						if ( ++loaded === filters.length ) {
							callback();
						}
					} );
				}( filters[ i ] ) );
			}
		},

		testWithFilters: function( tests, filters, callback ) {
			this.loadFilters( filters, function() {
				tests[ 'async:init' ] = function() {
					if ( callback ) {
						callback( this );
					}

					this.callback();
				};

				bender.test( tests );
			} );
		},

		asyncFilterLoad: function( filters, refference ) {
			return new CKEDITOR.tools.promise( function( resolve, reject ) {
				if ( typeof filters == 'string' ) {
					filters = [ filters ];
				}

				CKEDITOR.scriptLoader.load( filters, function( completed, failed ) {
					if ( failed.length > 0 ) {
						reject( 'Couldn\'t load scripts: "' + failed.join( '", "' ) + '"' );
					}

					resolve( getByString( refference ) );
				} );
			} );
		}
	};

	function getByString( refference ) {
		var keyNames = refference.split( '.' ),
			i,
			currentObject = window;

		for ( i = 0; i < keyNames.length; i++ ) {
			if ( keyNames[ i ] in currentObject ) {
				currentObject = currentObject[ keyNames[ i ] ];
			} else {
				throw new Error( 'Cannot find property: ' + keyNames[ i ] );
			}
		}

		return currentObject;
	}
} )();

