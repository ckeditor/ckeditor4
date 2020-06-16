/* exported detachingTools */

var detachingTools = ( function() {
	function runBeforeScriptLoaded( callback ) {
		var originalPluginsLoad = CKEDITOR.plugins.load;

		CKEDITOR.plugins.load = function() {
			CKEDITOR.plugins.load = originalPluginsLoad;

			var originalScriptLoaderLoad = CKEDITOR.scriptLoader.load;

			CKEDITOR.scriptLoader.load = function() {
				CKEDITOR.scriptLoader.load = originalScriptLoaderLoad;

				callback();

				originalScriptLoaderLoad.apply( this, arguments );
			};

			originalPluginsLoad.apply( this, arguments );
		};
	}

	function runAfterEditableIframeLoad( editor, callback ) {
		var originalAddMode = editor.constructor.prototype.addMode;

		editor.addMode = function( mode, exec ) {
			if ( mode === 'wysiwyg' ) {
				delete editor.addMode;
				originalAddMode.call( this, mode, modeHandler );
			} else {
				originalAddMode.call( this, mode, exec );
			}

			function modeHandler() {
				exec.apply( this, arguments );

				editor.container.findOne( 'iframe.cke_wysiwyg_frame' )
					.on( 'load', callback, null, null, -100000 );
			}
		};
	}

	return {
		runBeforeScriptLoaded: runBeforeScriptLoaded,
		runAfterEditableIframeLoad: runAfterEditableIframeLoad
	};
} )();
