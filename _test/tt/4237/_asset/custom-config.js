/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.autoLanguage = false;
	// config.defaultLanguage = 'pt-br';

	config.toolbar = [
		[ 'Source', 'Image', 'Maximize', 'Preview', 'Print', '-', 'Cut', 'Copy', 'Paste', '-', 'Undo', 'Redo', '-', 'Find', 'Replace', '-', 'HorizontalRule', 'Table', 'imageUPLOAD', 'Link', 'Unlink', 'SpecialChar' ],
		[ 'Format', 'Font', 'FontSize', '-', 'Bold', 'Italic', 'Underline', 'Strike' ],
		[ 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'NumberedList', 'BulletedList', 'Outdent', 'Indent', '-', 'TextColor', 'BGColor' ]
		];

};
