/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

'use strict';

window.ignoreUnsupportedEnvironment = function( editor ) {
	editor.on( 'pluginsLoaded', function() {
		if ( !CKEDITOR.plugins.registered.autolink.isSupportedEnvironment() ) {
			bender.ignore();
		}
	} );

	return editor;
};
