/* bender-tags: editor */

bender.test(
{
	'test loading self defined external plugin file paths': testExternal( { plugin: 'myplugin', path: '%TEST_DIR%_assets/myplugins/sample/', file: 'my_plugin.js',
		expectedFileName: 'my_plugin.js' } ),

	// (#917)
	'test loading with slash and without fileName': testExternal( { plugin: 'myplugin1', path: '%TEST_DIR%_assets/myplugins/myplugin1',
		expectedFileName: 'plugin.js' } ),

	// (#917)
	'test loading with slash and empty fileName': testExternal( { plugin: 'myplugin2', path: '%TEST_DIR%_assets/myplugins/myplugin2/', file: '',
		expectedFileName: 'plugin.js' } ),

	// (#917)
	'test loading without slash and with fileName': testExternal( { plugin: 'myplugin3', path: '%TEST_DIR%_assets/myplugins/myplugin3', file: 'plugin.js',
		expectedFileName: 'plugin.js' } ),

	// (#917) - This test ensures that the wrong parameter set will lead to the wrong file. Method 'addExternal()' will think here that 'myplugin4' is fileName.
	'test loading without slash and with empty fileName': testExternal( { plugin: 'myplugin4', path: '%TEST_DIR%_assets/myplugins/myplugin4', file: '',
		expectedFileName: 'myplugin4' } ),

	'test errors thrown when required plugin specified in removePlugins list': function() {
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

function testExternal( options ) {
	return function() {
		CKEDITOR.plugins.addExternal( options.plugin, options.path, options.file );

		CKEDITOR.plugins.load( options.plugin, function() {
			resume( function() {
				assert.areEqual( options.expectedFileName, CKEDITOR.plugins.externals[ options.plugin ].file );
				assert.isTrue( CKEDITOR.plugins.get( options.plugin ).definition );
			} );
		}, this );

		wait();
	};
}
