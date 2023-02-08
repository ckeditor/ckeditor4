/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
	config.customConfig = bender.getAbsolutePath( '_assets/custom_config_2.js' );
	config.test_custom1 = 'Ok';
};
