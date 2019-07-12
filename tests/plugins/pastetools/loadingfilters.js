/* bender-tags: editor,clipboard */
/* bender-ckeditor-plugins: pastetools */
/* bender-include: ../clipboard/_helpers/pasting.js */
/* global paste */

( function() {
	'use strict';

	bender.test( {
		'test loading no filters': createLoaderTest( {
			name: 'no-filters'
		} ),

		'test basic loading filters': createLoaderTest( {
			name: 'basic',
			filters: [ [ 'test1', 'test2' ] ],
			loaded: [ 'test1', 'test2' ]
		} ),

		'test loading one cached, one fresh': createLoaderTest( {
			name: 'one-cached',
			filters: [ [ 'test2', 'test3' ] ],
			loaded: [ 'test3' ]
		} ),

		'test loading all cached': createLoaderTest( {
			name: 'all-cached',
			filters: [ [ 'test1', 'test2', 'test3' ] ]
		} ),

		'test loading multiple handlers': createLoaderTest( {
			name: 'multiple',
			loaded: [ 'test4', 'test5', 'test6' ],
			filters: [ [ 'test4', 'test5' ], [ 'test5', 'test6' ] ]
		} )
	} );

	function createLoaderTest( options ) {
		return function() {
			var loaded = options.loaded || [],
				// Please, forgive me this ugly hack.
				handleStub = sinon.stub( { a: function() {} }, 'a', function( evt, next ) {
					next();
				} ),
				expectedEvents = loaded.length > 0 ? 2 : 1,
				eventsSpy = sinon.spy(),
				scriptLoaderStub;

			bender.editorBot.create( {
				name: 'test_' + options.name,
				config: {
					on: {
						pluginsLoaded: function( evt ) {
							var editor = evt.editor;

							CKEDITOR.tools.array.forEach( options.filters || [], function( filters ) {
								editor.pasteTools.register( {
									filters: filters,
									canHandle: function() {
										return true;
									},

									handle: handleStub
								} );
							} );

							// It should simulate unpredictable nature of async requests.
							scriptLoaderStub = sinon.stub( CKEDITOR.scriptLoader, 'load', function( urls, callback ) {
								var randomTime = Math.floor( Math.random() * 10 ) + 1;

								setTimeout( function() {
									callback( urls );
								}, randomTime );
							} );
						}
					}
				}
			}, function( bot ) {
				var editor = bot.editor;

				editor.on( 'paste', eventsSpy, null, null, 2 );
				editor.on( 'paste', function() {
					resume( function() {
						var expectedOrder = [],
							i;

						if ( loaded.length > 0 ) {
							for ( i = 0; i < loaded.length; i++ ) {
								expectedOrder.push( scriptLoaderStub );
							}
						}

						if ( options.filters && options.filters.length > 0 ) {
							for ( i = 0; i < options.filters.length; i++ ) {
								expectedOrder.push( handleStub );
							}
						}

						scriptLoaderStub.restore();

						try {
							assert.isUndefined( sinon.assert.callOrder.apply( null, expectedOrder ) );
						} catch ( e ) {
							assert.fail( 'Correct functions order: ' + e.message );
						}
						assert.areSame( expectedEvents, eventsSpy.callCount, 'Correct amount of paste events' );

						if ( loaded.length > 0 ) {
							assert.areSame( loaded.length, scriptLoaderStub.callCount, 'Correct amount of script loading' );

							for ( i = 0; i < loaded.length; i++ ) {
								assert.isTrue( scriptLoaderStub.getCall( i ).calledWith( loaded[ i ] ),
									loaded[ i ] + ' was loaded as #' + i );
							}
						}
					} );
				}, null, null, 999 );

				paste( editor, { dataValue: '<p>Test</p>' } );
				wait();
			} );
		};
	}
} )();
