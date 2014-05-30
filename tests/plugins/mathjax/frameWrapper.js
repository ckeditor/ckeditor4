/* bender-tags: editor,unit,widget */
/* bender-ckeditor-plugins: mathjax */

( function() {
	'use strict';

	bender.test( {
		checkIFrame: function( config ) {
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 )
				assert.ignore();

			CKEDITOR.document.getById( 'playground' ).setHtml( config.html );

			var iFrame = CKEDITOR.document.getById( config.id ),
				frameWrapper,
				counter = 0,
				doc = iFrame.getFrameDocument(),
				fakeEditor = {
					config: {
						mathJaxLib: '_assets/truncated-mathjax/MathJax.js?config=TeX-AMS_HTML'
					},
					fire: function() {
						//mock
					},
					lang: {
						mathjax: {
							loading: "loading..."
						}
					}
				};

			CKEDITOR.on( 'mathJaxLoaded', function() {
				if ( config.loadedSync )
					config.loadedSync( frameWrapper, doc );

				if ( config.loaded ) {
					// IE9 need forced asynchrony
					setTimeout( function() {
						config.loaded( frameWrapper, doc );
					} );
				}
			} );

			CKEDITOR.on( 'mathJaxUpdateDone', function() {
				if ( config.done )
					config.done( frameWrapper, doc );

				++counter;

				if ( counter > config.expectedUpdateCount )
					resume( function() {
						assert.fail( 'Too many MathJaxUpdateDone (expected: ' + config.expectedUpdateCount + ', actual: ' + counter + ').' );
					} );

				if ( counter == config.expectedUpdateCount ) {
					resume( function() {
						assert.areSame( config.expectedValue,
							bender.tools.compatHtml( doc.getById( 'preview' ).getElementsByTag( 'script' ).$[ 0 ].innerHTML ),
							'MathJax should create script element containing equation.' );
						assert.areSame( config.expectedValue,
							bender.tools.compatHtml( doc.getById( 'buffer' ).getElementsByTag( 'script' ).$[ 0 ].innerHTML ),
							'MathJax should create script element containing equation.' );

						assert.isTrue( parseInt( iFrame.getStyle( 'width' ) ) > 0, 'Width of iFrame should be grater that 0.' );
						assert.isTrue( parseInt( iFrame.getStyle( 'height' ) ) > 0, 'Height of iFrame should be grater that 0.' );

						CKEDITOR.document.getById( 'playground' ).setHtml( '' );
					} );
				}
			} );

			function startTest() {
				frameWrapper = new CKEDITOR.plugins.mathjax.frameWrapper( iFrame, fakeEditor );

				if ( config.setValue ) {
					frameWrapper.setValue( config.setValue );
				}
			}

			// For some reason IE9 sometimes likes to run tests before loading all scripts.
			if ( CKEDITOR.plugins.mathjax )
				startTest();
			else
				setTimeout( startTest, 100 );

			wait();
		},

		tearDown: function() {
			CKEDITOR.removeAllListeners();
		},

		'test init': function() {
			this.checkIFrame( {
				html: '<iframe id="init" style="border:0;width:0;height:0"></iframe>',
				id: 'init',
				loaded: function( frameWrapper, doc ) {
					resume( function() {
						assert.isTrue( doc.getHead().getChildCount() > 6, 'MathJax should create additional style tags in head (number depends on browser).' );

						assert.isFunction( frameWrapper.setValue, 'Constructor should create wrapper' );
					} );
				},
				expectedUpdateCount: 0
			} );
		},

		'test set value': function() {
			this.checkIFrame( {
				html: '<iframe id="setValue" style="border:0;width:0;height:0"></iframe>',
				id: 'setValue',
				setValue: '\\(1 + 1 = 2\\)',
				expectedUpdateCount: 1,
				expectedValue: '1 + 1 = 2'
			} );
		},

		'test set value after init': function() {
			this.checkIFrame( {
				html: '<iframe id="setValueAfterInit" style="border:0;width:0;height:0"></iframe>',
				id: 'setValueAfterInit',
				loaded: function( frameWrapper, doc ) {
					frameWrapper.setValue( '\\(1 + 1 = 2\\)' );
				},
				expectedUpdateCount: 1,
				expectedValue: '1 + 1 = 2'
			} );
		 },

		'test set value twice': function() {
			this.checkIFrame( {
				html: '<iframe id="setValueTwice" style="border:0;width:0;height:0"></iframe>',
				id: 'setValueTwice',
				setValue: '\\(1 + 1 = 2\\)',
				loaded: function( frameWrapper, doc ) {
					frameWrapper.setValue( '\\(2 + 2 = 4\\)' );
				},
				expectedUpdateCount: 2,
				expectedValue: '2 + 2 = 4'
			} );
		},

		'test copy style': function() {
			this.checkIFrame( {
				html: '<div style="font-size:15px"><iframe id="copyStyles" style="border:0;width:0;height:0"></iframe></div>',
				id: 'copyStyles',
				setValue: '\\(1 + 1 = 2\\)',
				done: function( frameWrapper, doc ) {
					assert.areSame( '15px', doc.getById( 'preview' ).getComputedStyle( 'font-size' ) );
					assert.areSame( 'normal', doc.getById( 'preview' ).getComputedStyle( 'font-style' ) );
				},
				expectedUpdateCount: 1,
				expectedValue: '1 + 1 = 2'
			} );
		},

		'test loading indicator': function() {
			this.checkIFrame( {
				html: '<iframe id="loadingIndicator" style="border:0;width:0;height:0"></iframe>',
				id: 'loadingIndicator',
				setValue: '\\(1 + 1 = 2\\)',
				loadedSync: function( frameWrapper, doc ) {
					resume( function() {
						assert.areSame( 'img', doc.getById( 'preview' ).getChild( 0 ).getName() );
						assert.areSame( CKEDITOR.plugins.mathjax.loadingIcon,
							doc.getById( 'preview' ).getChild( 0 ).getAttribute( 'src' ) );
						wait();
					} );
				},
				expectedUpdateCount: 1,
				expectedValue: '1 + 1 = 2'
			} );
		}
	} );
} )();