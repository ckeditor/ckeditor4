/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

CKEDITOR.dialog.add( 'about', function( editor ) {
	var lang = editor.lang.about,
		imagePath = CKEDITOR.getUrl( CKEDITOR.plugins.get( 'about' ).path + 'dialogs/' + ( CKEDITOR.env.hidpi ? 'hidpi/' : '' ) + 'logo_ckeditor.png' );

	return {
		title: lang.dlgTitle,
		minWidth: 390,
		minHeight: 210,
		contents: [ {
			id: 'tab1',
			label: '',
			title: '',
			expand: true,
			padding: 0,
			elements: [
				{
					type: 'html',
					html: '<style type="text/css">' +
						'.cke_about_container' +
						'{' +
							'color:#000 !important;' +
							'padding:10px 10px 0;' +
							'margin-top:5px' +
						'}' +
						'.cke_about_container p' +
						'{' +
							'margin: 0 0 10px;' +
						'}' +
						'.cke_about_container .cke_about_logo' +
						'{' +
							'height:81px;' +
							'background-color:#fff;' +
							'background-image:url(' + imagePath + ');' +
							( CKEDITOR.env.hidpi ? 'background-size:194px 58px;' : '' ) +
							'background-position:center; ' +
							'background-repeat:no-repeat;' +
							'margin-bottom:10px;' +
						'}' +
						'.cke_about_container a' +
						'{' +
							'cursor:pointer !important;' +
							'color:#00B2CE !important;' +
							'text-decoration:underline !important;' +
						'}' +
						'.cke_about_container > p,' +
						'.cke_rtl .cke_about_container > p' +
						'{' +
							'text-align:center;' +
						'}' +
						'.cke_about_version-check > strong' +
						'{' +
							'color: inherit;' +
						'}' +
						'</style>' +
						'<div class="cke_about_container">' +
						'<div class="cke_about_logo"></div>' +
						'<p>' +
							'CKEditor ' + CKEDITOR.version + ' (revision ' + CKEDITOR.revision + ')<br>' +
							'<a target="_blank" rel="noopener noreferrer" href="https://ckeditor.com/">https://ckeditor.com</a>' +
						'</p>' +
						'<p class="cke_about_version-check"></p>' +
						'<p>' +
							lang.moreInfo + '<br>' +
							'<a target="_blank" rel="noopener noreferrer" href="https://ckeditor.com/legal/ckeditor-oss-license/">https://ckeditor.com/legal/ckeditor-oss-license/</a>' +
						'</p>' +
						'<p>' +
							lang.copy.replace( '$1', '<a target="_blank" rel="noopener noreferrer" href="https://cksource.com/">CKSource</a> Holding sp. z o.o' ) +
						'</p>' +
						'</div>'
				}
			]
		} ],
		buttons: [ CKEDITOR.dialog.cancelButton ]
	};
} );
