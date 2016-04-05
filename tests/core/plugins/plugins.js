/* bender-tags: editor,unit */

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
	}
} );
