/*
Copyright (c) 2003-2011, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.dialog.add( 'paste', function( editor ) {
	var lang = editor.lang.clipboard;
	var isCustomDomain = CKEDITOR.env.isCustomDomain();

	function onPasteFrameLoad( win ) {
		var doc = new CKEDITOR.dom.document( win.document ),
			docElement = doc.$;

		var script = doc.getById( 'cke_actscrpt' );
		script && script.remove();

		CKEDITOR.env.ie ? docElement.body.contentEditable = "true" : docElement.designMode = "on";

		// IE before version 8 will leave cursor blinking inside the document after
		// editor blurred unless we clean up the selection. (#4716)
		if ( CKEDITOR.env.ie && CKEDITOR.env.version < 8 ) {
			doc.getWindow().on( 'blur', function() {
				docElement.selection.empty();
			});
		}

		doc.on( "keydown", function( e ) {
			var domEvent = e.data,
				key = domEvent.getKeystroke(),
				processed;

			switch ( key ) {
				case 27:
					this.hide();
					processed = 1;
					break;

				case 9:
				case CKEDITOR.SHIFT + 9:
					this.changeFocus( 1 );
					processed = 1;
			}

			processed && domEvent.preventDefault();
		}, this );

		editor.fire( 'ariaWidget', new CKEDITOR.dom.element( win.frameElement ) );
	}

	// If pasteDialogCommit wasn't canceled by e.g. editor.getClipboardData
	// then fire paste event.
	editor.on( 'pasteDialogCommit', function( evt ) {
		if ( evt.data )
			editor.fire( 'paste', { type: 'auto', data: evt.data } );
	}, null, null, 1000 );

	return {
		title: lang.title,

		minWidth: CKEDITOR.env.ie && CKEDITOR.env.quirks ? 370 : 350,
		minHeight: CKEDITOR.env.quirks ? 250 : 245,
		onShow: function() {
			// FIREFOX BUG: Force the browser to render the dialog to make the to-be-
			// inserted iframe editable. (#3366)
			this.parts.dialog.$.offsetHeight;

			this.setupContent();

			// Set dialog title to the custom value (set e.g. in editor.openDialog callback) and reset this value.
			// If custom title not set, use default one.
			this.parts.title.setHtml( this.customTitle || lang.title );
			this.customTitle = null;
		},

		onHide: function() {
			if ( CKEDITOR.env.ie )
				this.getParentEditor().document.getBody().$.contentEditable = 'true';
		},

		onLoad: function() {
			if ( ( CKEDITOR.env.ie7Compat || CKEDITOR.env.ie6Compat ) && editor.lang.dir == 'rtl' )
				this.parts.contents.setStyle( 'overflow', 'hidden' );
		},

		onOk: function() {
			this.commitContent();
		},

		contents: [
			{
			id: 'general',
			label: editor.lang.common.generalTab,
			elements: [
				{
				type: 'html',
				id: 'securityMsg',
				html: '<div style="white-space:normal;width:340px;">' + lang.securityMsg + '</div>'
			},
				{
				type: 'html',
				id: 'pasteMsg',
				html: '<div style="white-space:normal;width:340px;">' + lang.pasteMsg + '</div>'
			},
				{
				type: 'html',
				id: 'editing_area',
				style: 'width: 100%; height: 100%;',
				html: '',
				focus: function() {
					var win = this.getInputElement().$.contentWindow;

					// #3291 : JAWS needs the 500ms delay to detect that the editor iframe
					// iframe is no longer editable. So that it will put the focus into the
					// Paste from Word dialog's editable area instead.
					setTimeout( function() {
						win.focus();
					}, 500 );
				},
				setup: function() {
					var dialog = this.getDialog();
					var htmlToLoad = '<html dir="' + editor.config.contentsLangDirection + '"' +
														' lang="' + ( editor.config.contentsLanguage || editor.langCode ) + '">' +
														'<head><style>body { margin: 3px; height: 95%; } </style></head><body>' +
														'<script id="cke_actscrpt" type="text/javascript">' +
														'window.parent.CKEDITOR.tools.callFunction( ' + CKEDITOR.tools.addFunction( onPasteFrameLoad, dialog ) + ', this );' +
														'</script></body>' +
														'</html>';

					var src = CKEDITOR.env.air ? 'javascript:void(0)' : isCustomDomain ? 'javascript:void((function(){' +
																'document.open();' +
																'document.domain=\'' + document.domain + '\';' +
																'document.close();' +
															'})())"'
														:
															'';

					var iframe = CKEDITOR.dom.element.createFromHtml( '<iframe' +
						' class="cke_pasteframe"' +
						' frameborder="0" ' +
						' allowTransparency="true"' +
						' src="' + src + '"' +
						' role="region"' +
						' aria-label="' + lang.pasteArea + '"' +
						' aria-describedby="' + dialog.getContentElement( 'general', 'pasteMsg' ).domId + '"' +
						' aria-multiple="true"' +
						'></iframe>' );

					iframe.on( 'load', function( e ) {
						e.removeListener();

						var doc = iframe.getFrameDocument();
						doc.write( htmlToLoad );

						if ( CKEDITOR.env.air )
							onPasteFrameLoad.call( this, doc.getWindow().$ );
					}, dialog );

					iframe.setCustomData( 'dialog', dialog );

					var container = this.getElement();
					container.setHtml( '' );
					container.append( iframe );

					// IE need a redirect on focus to make
					// the cursor blinking inside iframe. (#5461)
					if ( CKEDITOR.env.ie ) {
						var focusGrabber = CKEDITOR.dom.element.createFromHtml( '<span tabindex="-1" style="position:absolute;" role="presentation"></span>' );
						focusGrabber.on( 'focus', function() {
							iframe.$.contentWindow.focus();
						});
						container.append( focusGrabber );

						// Override focus handler on field.
						this.focus = function() {
							focusGrabber.focus();
							this.fire( 'focus' );
						};
					}

					this.getInputElement = function() {
						return iframe;
					};

					// Force container to scale in IE.
					if ( CKEDITOR.env.ie ) {
						container.setStyle( 'display', 'block' );
						container.setStyle( 'height', ( iframe.$.offsetHeight + 2 ) + 'px' );
					}
				},
				commit: function( data ) {
					var editor = this.getDialog().getParentEditor(),
						body = this.getInputElement().getFrameDocument().getBody(),
						bogus = body.getBogus(),
						html;
					bogus && bogus.remove();

					// Saving the contents so changes until paste is complete will not take place (#7500)
					html = body.getHtml();

					// Opera needs some time to think about what has happened and what it should do now.
					setTimeout( function() {
						editor.fire( 'pasteDialogCommit', html );
					}, 0 );
				}
			}
			]
		}
		]
	};
});

/**
 * Internal event to pass dialog's data to the listeners.
 * @name CKEDITOR.editor#pasteDialogCommit
 * @event
 */
