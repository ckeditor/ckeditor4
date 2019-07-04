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
			filters: [ 'test1', 'test2' ],
			loaded: [ 'test1', 'test2' ]
		} ),

		'test loading one cached, one fresh': createLoaderTest( {
			name: 'one-cached',
			filters: [ 'test2', 'test3' ],
			loaded: [ 'test3' ]
		} ),

		'test loading all cached': createLoaderTest( {
			name: 'all-cached',
			filters: [ 'test1', 'test2', 'test3' ]
		} )
	} );

	function createLoaderTest( options ) {
		return function() {
			var loaded = options.loaded || [],
				handleStub = sinon.spy(),
				expectedEvents = loaded.length > 0 ? 2 : 1,
				eventsSpy = sinon.spy(),
				scriptLoaderStub;

			bender.editorBot.create( {
				name: 'test_' + options.name,
				config: {
					on: {
						pluginsLoaded: function( evt ) {
							evt.editor.pasteTools.register( {
								filters: options.filters,
								canHandle: function() {
									return true;
								},

								handle: handleStub
							} );

							scriptLoaderStub = sinon.stub( CKEDITOR.scriptLoader, 'load', function( urls, callback ) {
								callback( urls );
							} );
						}
					}
				}
			}, function( bot ) {
				var editor = bot.editor;

				editor.on( 'paste', eventsSpy, null, null, 2 );
				editor.on( 'paste', function() {
					var expectedOrder = [ handleStub ];

					if ( loaded.length > 0 ) {
						expectedOrder.unshift( scriptLoaderStub );
					}

					scriptLoaderStub.restore();

					try {
						assert.isUndefined( sinon.assert.callOrder.apply( null, expectedOrder ) );
					} catch ( e ) {
						assert.fail( 'Correct functions order: ' + e.message );
					}
					assert.areSame( expectedEvents, eventsSpy.callCount, 'Correct amount of paste events' );

					if ( loaded.length > 0 ) {
						assert.areSame( 1, scriptLoaderStub.callCount, 'Correct amount of script loading' );
						assert.isTrue( scriptLoaderStub.calledWith( loaded ) );
					}
				}, null, null, 999 );

				paste( editor, { dataValue: '<p>Test</p>' } );
			} );
		};
	}
} )();
