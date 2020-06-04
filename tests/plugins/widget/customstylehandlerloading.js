/* bender-tags: widgetcore */

( function() {
	'use strict';

	bender.editor = false;

	bender.test( {
		'test widget styles customHandler is not added if plugin file added': function() {
			// Widget plugin may be bundled in ckeditor.js so there is no need to load file separately.
			if ( !CKEDITOR.plugins.registered.widget ) {
				CKEDITOR.scriptLoader.load( CKEDITOR.getUrl( '/plugins/widget/plugins.js' ), function() {
					resume( function() {
						assert.isUndefined( CKEDITOR.style.customHandlers.widget );
					} );
				}, null, true );

				wait();
			} else {
				assert.isUndefined( CKEDITOR.style.customHandlers.widget );
			}
		},

		'test widget styles customHandler is added after plugin is loaded': function() {
			bender.editorBot.create( {
				name: 'widget_editor',
				config: {
					extraPlugins: 'widget'
				}
			}, function() {
				assert.isObject( CKEDITOR.style.customHandlers.widget );
			} );
		}
	} );
} )();
