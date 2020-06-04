/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @fileOverview The Save plugin.
 */

( function() {
	var saveCmd = {
		readOnly: 1,
		modes: { wysiwyg: 1,source: 1 },

		exec: function( editor ) {
			if ( editor.fire( 'save' ) ) {
				var $form = editor.element.$.form;

				if ( $form ) {
					try {
						$form.submit();
					} catch ( e ) {
						// If there's a button named "submit" then the form.submit
						// function is masked and can't be called in IE/FF, so we
						// call the click() method of that button.
						if ( $form.submit.click )
							$form.submit.click();
					}
				}
			}
		}
	};

	var pluginName = 'save';

	// Register a plugin named "save".
	CKEDITOR.plugins.add( pluginName, {
		// jscs:disable maximumLineLength
		lang: 'af,ar,az,bg,bn,bs,ca,cs,cy,da,de,de-ch,el,en,en-au,en-ca,en-gb,eo,es,es-mx,et,eu,fa,fi,fo,fr,fr-ca,gl,gu,he,hi,hr,hu,id,is,it,ja,ka,km,ko,ku,lt,lv,mk,mn,ms,nb,nl,no,oc,pl,pt,pt-br,ro,ru,si,sk,sl,sq,sr,sr-latn,sv,th,tr,tt,ug,uk,vi,zh,zh-cn', // %REMOVE_LINE_CORE%
		// jscs:enable maximumLineLength
		icons: 'save', // %REMOVE_LINE_CORE%
		hidpi: true, // %REMOVE_LINE_CORE%
		init: function( editor ) {
			// Save plugin is for replace mode only.
			if ( editor.elementMode != CKEDITOR.ELEMENT_MODE_REPLACE )
				return;

			var command = editor.addCommand( pluginName, saveCmd );
			command.startDisabled = !( editor.element.$.form );

			editor.ui.addButton && editor.ui.addButton( 'Save', {
				label: editor.lang.save.toolbar,
				command: pluginName,
				toolbar: 'document,10'
			} );
		}
	} );
} )();

/**
 * Fired when the user clicks the Save button on the editor toolbar.
 * This event allows to overwrite the default Save button behavior.
 *
 * @since 4.2.0
 * @event save
 * @member CKEDITOR.editor
 * @param {CKEDITOR.editor} editor This editor instance.
 */
