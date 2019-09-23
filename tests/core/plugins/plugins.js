/* bender-tags: editor */

( function() {
	bender.test( {
		'test: Loading self defined external plugin file paths': testAddExternal( {
			plugin: 'myplugin',
			path: '%TEST_DIR%_assets/myplugins/sample/',
			file: 'my_plugin.js',
			expectedFileName: 'my_plugin.js'
		} ),

		// (https://dev.ckeditor.com/ticket/10913)
		'test addExternal with file name separated': testAddExternal( {
			plugin: 'plugin1',
			path: '%TEST_DIR%_assets/myplugins/plugin1/',
			file: 'plugin.js',
			expectedFileName: 'plugin.js'
		} ),

		// (https://dev.ckeditor.com/ticket/10913)
		'test addExternal with file name empty': testAddExternal( {
			plugin: 'plugin2',
			path: '%TEST_DIR%_assets/myplugins/plugin2/plugin.js',
			file: '',
			expectedFileName: 'plugin.js'
		} ),

		// (#3477, https://dev.ckeditor.com/ticket/10913)
		'test addExternal with file name included in path': testAddExternal( {
			plugin: 'plugin3',
			path: '%TEST_DIR%_assets/myplugins/plugin3/myplugin.js',
			expectedFileName: 'myplugin.js'
		} ),

		// (#3477, https://dev.ckeditor.com/ticket/10913)
		'test addExternal with file name missing and path ending with slash': testAddExternal( {
			plugin: 'plugin4',
			path: '%TEST_DIR%_assets/myplugins/plugin4/',
			expectedFileName: 'plugin.js'
		} ),

		'errors thrown when required plugin specified in removePlugins list': function() {
			var log = sinon.stub( CKEDITOR, 'error' );

			CKEDITOR.plugins.add( 'errorplugin1', {
				requires: 'errorplugin3,errorplugin2'
			} );

			CKEDITOR.plugins.add( 'errorplugin2', {
				requires: 'errorplugin3,errorplugin4'
			} );

			CKEDITOR.plugins.add( 'errorplugin3', {
				init: function( editor ) {
					editor.plugin3Inited = true;
				}
			} );

			CKEDITOR.plugins.add( 'errorplugin4', {
				init: function( editor ) {
					editor.plugin4Inited = true;
				}
			} );

			setTimeout( function() {
				CKEDITOR.replace( 'errortest', {
					plugins: 'wysiwygarea,errorplugin1,errorplugin3',
					extraPlugins: 'errorplugin2',
					removePlugins: 'errorplugin3,errorplugin4',

					on: {
						instanceReady: function( evt ) {
							resume( function() {

								log.restore();

								// plugin 3 reqed by plugin 1 and plugins 4 & 3 reqed by plugin 2.
								assert.isTrue( log.calledThrice, 'CKEDITOR.error should be called three times.' );

								var call;
								for ( var i = 0; i < log.callCount; i++ ) {
									call = log.getCall( i );
									assert.areEqual( 'editor-plugin-required', call.args[ 0 ], 'Required plugin error should be logged.' );
								}

								// Plugins are corretly inited.
								assert.isTrue( evt.editor.plugin3Inited );
								assert.isTrue( evt.editor.plugin4Inited );
							} );
						}
					}
				} );
			} );

			wait();
		},

		// (#1791)
		'test detect plugins conflict - with conflicting plugins': function() {
			var editor = {
					plugins: {
						'plugin1': 1,
						'plugin2': 2
					}
				},
				spy = sinon.spy( CKEDITOR, 'warn' ),

				result = CKEDITOR.editor.prototype.plugins.detectConflict.call( editor.plugins,
					'plugin', [ 'plugin1', 'plugin2' ] );

			spy.restore();

			assert.isTrue( result, 'Conflicts detected.' );
			assert.isTrue( spy.calledWith( 'editor-plugin-conflict', { plugin: 'plugin', replacedWith: 'plugin1' } ) );
		},

		// (#1791)
		'test detect plugins conflict - without conflicting plugins': function() {
			var editor = {
					plugins: {}
				},
				spy = sinon.spy( CKEDITOR, 'warn' ),

				result = CKEDITOR.editor.prototype.plugins.detectConflict.call( editor.plugins,
					'plugin', [ 'plugin1', 'plugin2' ] );

			spy.restore();

			assert.isFalse( result, 'Conflicts not detected.' );
			assert.isFalse( spy.called );
		},

		// (#2692)
		'test supported environment': function() {
			CKEDITOR.plugins.add( 'envdefault', {} );
			CKEDITOR.plugins.add( 'envcustom', {
				isSupportedEnvironment: function() {
					return false;
				}
			} );

			var editor = CKEDITOR.replace( 'env', {
				plugins: 'wysiwygarea,envdefault,envcustom',
				on: {
					instanceReady: function() {
						resume( function() {
							assert.isTrue( editor.plugins.envdefault.isSupportedEnvironment(),
								'Plugin should be supported by default' );

							assert.isFalse( editor.plugins.envcustom.isSupportedEnvironment(),
								'Plugin should allow for custom isSupportedEnvironment implementation' );
						} );
					}
				}
			} );

			wait();
		}
	} );

	function testAddExternal( options ) {
		return function() {
			CKEDITOR.plugins.addExternal( options.plugin, options.path, options.file );

			CKEDITOR.plugins.load( options.plugin, function() {
				resume( function() {
					var plugin = CKEDITOR.plugins.get( options.plugin );

					assert.areEqual( options.expectedFileName, CKEDITOR.plugins.externals[ options.plugin ].file );
					assert.isTrue( plugin.definition );
				} );
			}, this );

			wait();
		};
	}
}() );
