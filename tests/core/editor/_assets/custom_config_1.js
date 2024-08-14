/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

CKEDITOR.editorConfig = function( config ) {
	config.customConfig = bender.getAbsolutePath( '_assets/custom_config_2.js' );
	config.test_custom1 = 'Ok';
};
