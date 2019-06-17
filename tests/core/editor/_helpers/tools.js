/* exported easyImageTools */

var detachingTools = ( function() {
	function detachWhenScriptLoaded( detach ) {
		var pluginsLoad = CKEDITOR.plugins.load;

		CKEDITOR.plugins.load = function() {
			CKEDITOR.plugins.load = pluginsLoad;

			var scriptLoaderLoad = CKEDITOR.scriptLoader.load;

			CKEDITOR.scriptLoader.load = function() {
				CKEDITOR.scriptLoader.load = scriptLoaderLoad;

				detach();

				scriptLoaderLoad.apply( this, arguments );
			};

			pluginsLoad.apply( this, arguments );
		};
	}

	function detachBeforeIframeLoad( detach, editor ) {
		var addMode = editor.addMode;

		editor.addMode = function( mode, originalModeHandler ) {
			if ( mode === 'wysiwyg' ) {
				editor.addMode = addMode;
				addMode.call( this, mode, modeHandler );
			} else {
				addMode.apply( this, arguments );
			}

			function modeHandler() {
				originalModeHandler.apply( this, arguments );

				editor.container.findOne( 'iframe.cke_wysiwyg_frame' )
					.on( 'load', detach, null, null, -9999 );
			}
		};
	}

	return {
		detachWhenScriptLoaded: detachWhenScriptLoaded,
		detachBeforeIframeLoad: detachBeforeIframeLoad
	};
} )();
