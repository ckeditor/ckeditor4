﻿
/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function() {
	CKEDITOR.plugins.add( 'floatingspace', {
		requires: [],

		init: function( editor ) {
			editor.on( 'loaded', function() {
				attach( editor );
			});
		}
	});

	function attach( editor ) {
		var body = CKEDITOR.document.getBody();

		var floatSpace,
			template = CKEDITOR.ui.template( 'floatcontainer', '<div' +
			' id="{id}"' +
			' class="{id} cke cke_chrome cke_editor_{name}"' +
			' dir="{langDir}"' +
			' title="' + ( CKEDITOR.env.gecko ? ' ' : '' ) + '"' +
			' lang="{langCode}"' +
			' role="presentation"' +
			' style="{style}"' +
			'>' +
				'<div class="' + CKEDITOR.env.cssClass + '" role="presentation">' +
					'<div class="cke_' + editor.lang.dir + '" role="presentation">' +
						'<div class="cke_inner">' +
							'<div class="cke_contents" role="presentation">{content}</div>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>' );

		var vars = {
			langDir: editor.lang.dir,
			langCode: editor.langCode,
			'z-index': editor.config.baseFloatZIndex - 1
		};

		// Get the HTML for the predefined spaces.
		var topHtml = editor.fire( 'uiSpace', { space: 'top', html: '' } ).html;
		if ( topHtml ) {
			floatSpace = body.append( CKEDITOR.dom.element.createFromHtml( template.output( CKEDITOR.tools.extend({
				id: 'cke_top_' + editor.name,
				content: topHtml,
				style: 'display:none;position:absolute;top:0;left:0;'
			}, vars ) ) ) );

			editor.on( 'focus', function() {
				floatSpace.show();
			});

			editor.on( 'blur', function() {
				floatSpace.hide();
			});

			// Handle initial focus.
			if ( editor.focusManager.hasFocus )
				floatSpace.show();
		}
	}

})();
