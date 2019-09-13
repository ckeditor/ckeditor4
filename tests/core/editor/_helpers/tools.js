/* exported detachingTools */

var detachingTools = ( function() {
	function runBeforeScriptLoaded( callback ) {
		var oryginalPluginsLoad = CKEDITOR.plugins.load;

		CKEDITOR.plugins.load = function() {
			CKEDITOR.plugins.load = oryginalPluginsLoad;

			var oryginalScriptLoaderLoad = CKEDITOR.scriptLoader.load;

			CKEDITOR.scriptLoader.load = function() {
				CKEDITOR.scriptLoader.load = oryginalScriptLoaderLoad;

				callback();

				oryginalScriptLoaderLoad.apply( this, arguments );
			};

			oryginalPluginsLoad.apply( this, arguments );
		};
	}

	function runAafterEditableIframeLoad( editor, callback ) {
		var oryginalAddMode = editor.constructor.prototype.addMode;

		editor.addMode = function( mode, exec ) {
			if ( mode === 'wysiwyg' ) {
				delete editor.addMode;
				oryginalAddMode.call( this, mode, modeHandler );
			} else {
				oryginalAddMode.call( this, mode, exec );
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
		runAafterEditableIframeLoad: runAafterEditableIframeLoad
	};
} )();
