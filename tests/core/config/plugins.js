/* bender-tags: editor */

( function() {
	bender.test( {

		// (#1712)
		'test extraPlugins allows whitespaces': function() {
			bender.editorBot.create( {
				name: 'editor_extraplugins',
				config: {
					plugins: '',
					extraPlugins: 'basicstyles, image2, toolbar '
				}
			}, function( bot ) {
				var editor = bot.editor,
					plugins = CKEDITOR.tools.object.keys( editor.plugins );

				assert.isTrue( contains( plugins, 'basicstyles' ) );
				assert.isTrue( contains( plugins, 'image2' ) );
				assert.isTrue( contains( plugins, 'toolbar' ) );
			} );
		},

		// (#1712)
		'test plugins allows whitespaces': function() {
			bender.editorBot.create( {
				name: 'editor_plugins',
				config: {
					plugins: 'basicstyles, image2, toolbar '
				}
			}, function( bot ) {
				var editor = bot.editor,
					plugins = CKEDITOR.tools.object.keys( editor.plugins );

				assert.isTrue( contains( plugins, 'basicstyles' ) );
				assert.isTrue( contains( plugins, 'image2' ) );
				assert.isTrue( contains( plugins, 'toolbar' ) );
			} );
		},

		// (#1712)
		'test removePlugins allows whitespaces': function() {
			bender.editorBot.create( {
				name: 'editor_removePlugins', config: {
					plugins: 'basicstyles,image2,toolbar',
					removePlugins: 'basicstyles, image2, toolbar '
				}
			}, function( bot ) {
				var editor = bot.editor,
					plugins = CKEDITOR.tools.object.keys( editor.plugins );

				assert.isFalse( contains( plugins, 'basicstyles' ) );
				assert.isFalse( contains( plugins, 'image2' ) );
				assert.isFalse( contains( plugins, 'toolbar' ) );
			} );
		},

		// (#1712)
		"test plugins doesn't throw with undefined": function() {
			bender.editorBot.create( {
				name: 'editor_plugins_undefined',
				config: {
					plugins: undefined
				}
			}, function() {
				assert.pass();
			} );

			bender.editorBot.create( {
				name: 'editor_removePlugins_undefined',
				config: {
					removePlugins: undefined
				}
			}, function() {
				assert.pass();
			} );

			bender.editorBot.create( {
				name: 'editor_extraPlugins_undefined',
				config: {
					extraPlugins: undefined
				}
			}, function() {
				assert.pass();
			} );
		},

		// (#1802)
		'test extraPlugins allows array': function() {
			bender.editorBot.create( {
				name: 'editor_extraPluginsarray',
				config: {
					plugins: '',
					extraPlugins: [ 'basicstyles', 'image2', 'toolbar' ]
				}
			}, function( bot ) {
				var editor = bot.editor,
					plugins = CKEDITOR.tools.object.keys( editor.plugins );

				assert.isTrue( contains( plugins, 'basicstyles' ) );
				assert.isTrue( contains( plugins, 'image2' ) );
				assert.isTrue( contains( plugins, 'toolbar' ) );
			} );
		},

		// (#1802)
		'test plugins allows array': function() {
			bender.editorBot.create( {
				name: 'editor_pluginsarray',
				config: {
					plugins: [ 'basicstyles', 'image2', 'toolbar' ]
				}
			}, function( bot ) {
				var editor = bot.editor,
					plugins = CKEDITOR.tools.object.keys( editor.plugins );

				assert.isTrue( contains( plugins, 'basicstyles' ) );
				assert.isTrue( contains( plugins, 'image2' ) );
				assert.isTrue( contains( plugins, 'toolbar' ) );
			} );
		},

		// (#1802)
		'test removePlugins allows array': function() {
			bender.editorBot.create( {
				name: 'editor_removePluginsarray',
				config: {
					plugins: 'basicstyles,image2,toolbar',
					removePlugins: [ 'basicstyles', 'image2', 'toolbar' ]
				}
			}, function( bot ) {
				var editor = bot.editor,
					plugins = CKEDITOR.tools.object.keys( editor.plugins );

				assert.isFalse( contains( plugins, 'basicstyles' ) );
				assert.isFalse( contains( plugins, 'image2' ) );
				assert.isFalse( contains( plugins, 'toolbar' ) );
			} );
		}
	} );

	function contains( array, value ) {
		return CKEDITOR.tools.array.indexOf( array, value ) !== -1;
	}
} )();
