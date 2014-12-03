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
		var originalSetTimeout = window.setTimeout,
			errors = [];

		// Override native setTimeout to catch all errors.
		window.setTimeout = function( fn, timeout ) {
			originalSetTimeout( function() {
				try {
					fn.apply( this, Array.prototype.slice.call( arguments ) );
				} catch ( err ) {
					errors.push( err );

					// Do not fail silently on other errors.
					if ( !err.message || !err.message.match( /^Plugin "\w+" cannot be removed/ ) )
						throw err;
				}
			}, timeout );
		};

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

		originalSetTimeout( function() {
			CKEDITOR.replace( 'errortest', {
				plugins: 'wysiwygarea,errorplugin1,errorplugin3',
				extraPlugins: 'errorplugin2',
				removePlugins: 'errorplugin3,errorplugin4',

				on: {
					instanceReady: function( evt ) {
						resume( function() {
							// Reset overriden setTimeout.
							window.setTimeout = originalSetTimeout;

							// plugin 3 reqed by plugin 1 and plugins 4 & 3 reqed by plugin 2.
							assert.areEqual( 3, errors.length );

							var err;
							while ( ( err = errors.pop() ) )
								assert.isMatching( /^Plugin "\w+" cannot be removed/, err.message );

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