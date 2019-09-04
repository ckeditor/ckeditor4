/* bender-tags: editor */

bender.test(
{
	'test: Loading self defined external plugin file paths': function() {
		CKEDITOR.plugins.addExternal( 'myplugin', '%TEST_DIR%_assets/myplugins/sample/', 'my_plugin.js' );

		CKEDITOR.plugins.load( 'myplugin', function() {
			this.resume( function() {
				assert.isTrue( CKEDITOR.plugins.get( 'myplugin' ).definition );
			} );
		}, this );

		this.wait();
	},

	// (#917)
	'test parameters for addExternal() method': function() {
		CKEDITOR.plugins.addExternal( 'myplugin1', '%TEST_DIR%_assets/myplugins/myplugin1' );
		assert.areEqual( '/tests/core/plugins/_assets/myplugins/myplugin1/', CKEDITOR.plugins.externals.myplugin1.dir, 'Path is incorrect.' );
		assert.areEqual( 'plugin.js', CKEDITOR.plugins.externals.myplugin1.file, 'File name is incorrect' );

		CKEDITOR.plugins.addExternal( 'myplugin2', '%TEST_DIR%_assets/myplugins/myplugin2/' );
		assert.areEqual( '/tests/core/plugins/_assets/myplugins/myplugin2/', CKEDITOR.plugins.externals.myplugin2.dir, 'Path is incorrect.' );
		assert.areEqual( 'plugin.js', CKEDITOR.plugins.externals.myplugin2.file, 'File name is incorrect' );

		// This test case is a bit different - it should fail, so instead of 'assert.areEqual' there are 'assert.areNotEqual'.
		CKEDITOR.plugins.addExternal( 'myplugin3', '%TEST_DIR%_assets/myplugins/myplugin3', '' );
		assert.areNotEqual( '/tests/core/plugins/_assets/myplugins/myplugin3/', CKEDITOR.plugins.externals.myplugin3.dir, 'Path should be incorrect.' );
		assert.areNotEqual( 'plugin.js', CKEDITOR.plugins.externals.myplugin3.file, 'File name should be incorrect' );

		CKEDITOR.plugins.addExternal( 'myplugin4', '%TEST_DIR%_assets/myplugins/myplugin4/', '' );
		assert.areEqual( '/tests/core/plugins/_assets/myplugins/myplugin4/', CKEDITOR.plugins.externals.myplugin4.dir, 'Path is incorrect.' );
		assert.areEqual( 'plugin.js', CKEDITOR.plugins.externals.myplugin4.file, 'File name is incorrect' );

		CKEDITOR.plugins.addExternal( 'myplugin5', '%TEST_DIR%_assets/myplugins/myplugin5', 'plugin.js' );
		assert.areEqual( '/tests/core/plugins/_assets/myplugins/myplugin5/', CKEDITOR.plugins.externals.myplugin5.dir, 'Path is incorrect.' );
		assert.areEqual( 'plugin.js', CKEDITOR.plugins.externals.myplugin5.file, 'File name is incorrect' );

		CKEDITOR.plugins.addExternal( 'myplugin6', '%TEST_DIR%_assets/myplugins/myplugin6/', 'plugin.js' );
		assert.areEqual( '/tests/core/plugins/_assets/myplugins/myplugin6/', CKEDITOR.plugins.externals.myplugin6.dir, 'Path is incorrect.' );
		assert.areEqual( 'plugin.js', CKEDITOR.plugins.externals.myplugin6.file, 'File name is incorrect' );
	},

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
