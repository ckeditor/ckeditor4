/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function() {
	var floatingElement, innerElement, toolbox;

	CKEDITOR.plugins.add( 'floatingspace', {
		requires: [],

		init: function( editor ) {
			editor.on( 'loaded', function() {
				attach( editor );
			});
		}
	});

	function attach( editor ) {
		// Create the div that will hold the toolbar.
		if ( !floatingElement ) {
			var name = editor.name;

			// Replicate the structure found at theme.js, so the skin will work properly for it.
			floatingElement = CKEDITOR.document.getBody().append( CKEDITOR.dom.element.createFromHtml( '<div' +
				' id="cke_floating_toolbar"' +
				' class="' + editor.skinClass + '"' +
				' dir="' + editor.lang.dir + '"' +
				' title="' + ( CKEDITOR.env.gecko ? ' ' : '' ) + '"' +
				' lang="' + editor.langCode + '"' +
				//						( CKEDITOR.env.webkit ? ' tabindex="' + tabIndex + '"' : '' ) +
			//					' role="application"' +
			//					' aria-labelledby="cke_' + name + '_arialbl"' +
			//					( style ? ' style="' + style + '"' : '' ) +
							' style="display:none;position:absolute;top:0;left:0"' +
				'>' +
				//					'<span id="cke_', name, '_arialbl" class="cke_voice_label">' + editor.lang.editor + '</span>' +
							'<div class="' + CKEDITOR.env.cssClass + '" role="presentation">' +
					'<div class="cke_wrapper cke_' + editor.lang.dir + '" role="presentation">' +
						'<div class="cke_editor">' +
							'<div class="cke_top" role="presentation">' +
							'</div>' +
						'</div>' +
					'</div>' +
				'</div>' +
				'</div>' ) );

			toolbox = new CKEDITOR.toolbox();
			floatingElement.getChild( [ 0, 0, 0, 0 ] ).setHtml( toolbox.html( editor ) );
		}

		editor.on( 'focus', function() {
			floatingElement.setStyle( 'display', '' );
		});

		editor.on( 'blur', function() {
			floatingElement.setStyle( 'display', 'none' );
		});

		toolbox.attach( editor );
	}

})();
