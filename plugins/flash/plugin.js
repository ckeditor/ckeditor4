/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.plugins.add( 'flash', {
	init: function() {
		CKEDITOR.error( 'editor-plugin-deprecated', { plugin: 'flash' } );
	}
} );

CKEDITOR.tools.extend( CKEDITOR.config, {
	/**
	 * Save as `<embed>` tag only. This tag is unrecommended.
	 *
	 * **Note**: This option is deprecated due to the plugin being removed.
	 *
	 * @deprecated 4.17.0
	 * @cfg {Boolean} [flashEmbedTagOnly=false]
	 * @member CKEDITOR.config
	 */
	flashEmbedTagOnly: false,

	/**
	 * Add `<embed>` tag as alternative: `<object><embed></embed></object>`.
	 *
	 * **Note**: This option is deprecated due to the plugin being removed.
	 *
	 * @deprecated 4.17.0
	 * @cfg {Boolean} [flashAddEmbedTag=false]
	 * @member CKEDITOR.config
	 */
	flashAddEmbedTag: true,

	/**
	 * Use {@link #flashEmbedTagOnly} and {@link #flashAddEmbedTag} values on edit.
	 *
	 * **Note**: This option is deprecated due to the plugin being removed.
	 *
	 * @deprecated 4.17.0
	 * @cfg {Boolean} [flashConvertOnEdit=false]
	 * @member CKEDITOR.config
	 */
	flashConvertOnEdit: false
} );
