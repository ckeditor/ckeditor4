/* exported ptTools */

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

		asyncLoadFilters: function( filters, referrence ) {
			return new CKEDITOR.tools.promise( function( resolve, reject ) {
				var loaded = 0;

				if ( typeof filters === 'string' ) {
					filters = [ filters ];
				}

				for ( var i = 0; i < filters.length; i++ ) {
					( function( currentFilter ) {
						CKEDITOR.scriptLoader.queue( currentFilter, function( status ) {
							if ( !status ) {
								reject( 'Couldn\'t load filter: ' + currentFilter );
							}

							loaded++;
							if ( loaded === filters.length ) {
								resolve( getFilterByName( referrence ) );
							}
						} );
					}( filters[ i ] ) );
				}
			} );
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
		}
	};

	function getFilterByName( referrence ) {
		var keyNames = referrence.split( '.' ),
			currentObject = window;

		for ( var i = 0; i < keyNames.length; i++ ) {
			if ( keyNames[ i ] in currentObject ) {
				currentObject = currentObject[ keyNames[ i ] ];
			} else {
				throw new Error( 'Cannot find property: ' + keyNames[ i ] );
			}
		}

		return currentObject;
	}
} )();
