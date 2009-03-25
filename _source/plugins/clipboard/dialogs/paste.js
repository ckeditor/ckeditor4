/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.dialog.add( 'paste', function( editor ) {
	var isCustomDomain = CKEDITOR.env.ie && document.domain != window.location.hostname;

	var iframeId = 'cke_' + CKEDITOR.tools.getNextNumber();

	// For document.domain compatibility (#123) we must do all the magic in
	// the URL for IE.
	var src = isCustomDomain ? 'javascript:void((function(){' +
						'document.open();' +
						'document.domain=\'' + document.domain + '\';' +
						'document.write( window.parent.CKEDITOR._htmlToLoad );' +
						'document.close();' +
						'document.body.contentEditable = true;' +
						'delete window.parent.CKEDITOR._htmlToLoad;' +
						'window.focus();' +
					'})())'
				:
					'javascript:void(0)';

	var iframeHtml = '<iframe' +
					' src="' + src + '"' +
					' id="' + iframeId + '"' +
					' style="width:346px;background-color:white;height:130px;border:1px solid black"' +
					' frameborder="0"' +
					' allowtransparency="1">' +
				'</iframe>';

	var htmlToLoad = '<!doctype html>' +
				'<script type="text/javascript">' +
					'window.onload = function()' +
					'{' +
						( CKEDITOR.env.ie ? 'document.body.contentEditable = "true";' : 'document.designMode = "on";' ) +
						'window.focus();' +
					'};' +
					// Avoid errors if the pasted content has any script that
	// fails. (#389)
						'window.onerror = function()' +
					'{' +
						'return true;' +
					'};' +
				'</script><body style="margin:3px"></body>';

	return {
		title: editor.lang.clipboard.title,

		minWidth: 350,
		minHeight: 240,

		onShow: function() {
			if ( isCustomDomain )
				CKEDITOR._htmlToLoad = htmlToLoad;
			else {
				var iframe = CKEDITOR.document.getById( iframeId );

				var $doc = iframe.$.contentWindow.document;
				$doc.open();
				$doc.write( htmlToLoad );
				$doc.close();

				iframe.$.contentWindow.focus();
			}
		},

		onOk: function() {
			var iframe = CKEDITOR.document.getById( iframeId );

			var body = new CKEDITOR.dom.element( iframe.$.contentDocument ? oBody = iframe.$.contentDocument.body : oBody = iframe.$.contentWindow.document.body );

			var html = body.getHtml();

			// Fix relative anchor URLs (IE automatically adds the current page URL).
			var re = new RegExp( window.location + "#", 'g' );
			html = html.replace( re, '#' );

			this.restoreSelection();
			this.clearSavedSelection();

			this.getParentEditor().insertHtml( html );
		},

		contents: [
			{
			id: 'general',
			label: editor.lang.common.generalTab,
			elements: [
				{
				type: 'html',
				id: 'securityMsg',
				html: '<div style="white-space:normal;width:340px;">' + editor.lang.clipboard.securityMsg + '</div>'
			},
				{
				type: 'html',
				id: 'pasteMsg',
				html: '<div style="white-space:normal;width:340px;">' + editor.lang.clipboard.pasteMsg + '</div>'
			},
				{
				type: 'html',
				id: 'content',
				style: 'width:340px;height:130px',
				html: '<div>' + iframeHtml + '</div>'
			}
			]
		}
		]
	};
});
