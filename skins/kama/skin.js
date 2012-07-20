/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

// This is the only mandatory property to be defined in this file.
CKEDITOR.skin.name = 'kama';

// The available user-agent specific skin files (e.g. editor_ie.css, dialog_ie.css).
CKEDITOR.skin.ua_editor = 'ie,ie6,ie7,ie8';
CKEDITOR.skin.ua_dialog = 'ie,ie6,ie7,ie8,opera';

// The function that builds the CSS template used to change the skin color.
// The "$color" placeholder can be used in the string. It'll be replaced with
// the desired color.
CKEDITOR.skin.chameleon = function( editor, part ) {
	var css,
		cssId = '.' + editor.id;

	if ( part == 'editor' ) {
		css = cssId + ' .cke_inner,' +
			cssId + '_dialog .cke_dialog_contents,' +
			cssId + '_dialog a.cke_dialog_tab,' +
			cssId + '_dialog .cke_dialog_footer' +
			'{' +
				'background-color:$color !important;' +
				'background:-webkit-gradient(linear,0 -15,0 40,from(#fff),to($color));' +
				getLinearBackground( 'top,#fff -15px,$color 40px' ) +
			'}' +

			cssId + ' .cke_toolgroup' +
			'{' +
				'background:-webkit-gradient(linear,0 0,0 100,from(#fff),to($color));' +
				getLinearBackground( 'top,#fff,$color 100px' ) +
			'}' +

			cssId + ' .cke_combo_button' +
			'{' +
				'background:-webkit-gradient(linear, left bottom, left -100, from(#fff), to($color));' +
				getLinearBackground( 'bottom,#fff,$color 100px' ) +
			'}' +

			// TODO: This is not working because the panel doesn't go under the main UI element (cssID).
			cssId + ' .cke_combopanel' +
			'{' +
				'border: 1px solid $color;' +
			'}';
	} else if ( part == 'panel' ) {
		css = '.cke_menuitem .cke_icon_wrapper' +
			'{' +
				'background-color:$color !important;' +
				'border-color:$color !important;' +
			'}' +

			'.cke_menuitem a:hover .cke_icon_wrapper,' +
			'.cke_menuitem a:focus .cke_icon_wrapper,' +
			'.cke_menuitem a:active .cke_icon_wrapper' +
			'{' +
				'background-color:$color !important;' +
				'border-color:$color !important;' +
			'}' +

			'.cke_menuitem a:hover .cke_label,' +
			'.cke_menuitem a:focus .cke_label,' +
			'.cke_menuitem a:active .cke_label' +
			'{' +
				'background-color:$color !important;' +
			'}' +

			'.cke_menuitem a.cke_disabled:hover .cke_label,' +
			'.cke_menuitem a.cke_disabled:focus .cke_label,' +
			'.cke_menuitem a.cke_disabled:active .cke_label' +
			'{' +
				'background-color: transparent !important;' +
			'}' +

			'.cke_menuitem a.cke_disabled:hover .cke_icon_wrapper,' +
			'.cke_menuitem a.cke_disabled:focus .cke_icon_wrapper,' +
			'.cke_menuitem a.cke_disabled:active .cke_icon_wrapper' +
			'{' +
				'background-color:$color !important;' +
				'border-color:$color !important;' +
			'}' +

			'.cke_menuitem a.cke_disabled .cke_icon_wrapper' +
			'{' +
				'background-color:$color !important;' +
				'border-color:$color !important;' +
			'}' +

			'.cke_menuseparator' +
			'{' +
				'background-color:$color !important;' +
			'}' +

			'.cke_menuitem a:hover,' +
			'.cke_menuitem a:focus,' +
			'.cke_menuitem a:active' +
			'{' +
				'background-color:$color !important;' +
			'}';
	}

	return css;

	function getLinearBackground( definition ) {
		return 'background:-moz-linear-gradient(' + definition + ');' + // FF3.6+
			'background:-webkit-linear-gradient(' + definition + ');' + // Chrome10+, Safari5.1+
			'background:-o-linear-gradient(' + definition + ');' + // Opera 11.10+
			'background:-ms-linear-gradient(' + definition + ');' + // IE10+
			'background:linear-gradient(' + definition + ');'; // W3C
	}
};

// %REMOVE_START%

// Register the skin icons for development purposes only.

// If a required icon is not available here, the plugin defined icon will be
// used instead. This means that a skin is not required to provide all icons.
// Actually, it is not required to provide icons at all.

(function() {
	var icons = ( 'about,anchor-rtl,anchor,bgcolor,bidiltr,bidirtl,blockquote,' +
		'bold,bulletedlist-rtl,bulletedlist,button,checkbox,copy-rtl,copy,' +
		'creatediv,cut-rtl,cut,docprops-rtl,docprops,find-rtl,find,flash,form,' +
		'hiddenfield,horizontalrule,icons,iframe,image,imagebutton,indent-rtl,' +
		'indent,italic,justifyblock,justifycenter,justifyleft,justifyright,' +
		'link,maximize,newpage-rtl,newpage,numberedlist-rtl,numberedlist,' +
		'outdent-rtl,outdent,pagebreak-rtl,pagebreak,paste-rtl,paste,' +
		'pastefromword-rtl,pastefromword,pastetext-rtl,pastetext,preview-rtl,' +
		'preview,print,radio,redo-rtl,redo,removeformat,replace,save,scayt,' +
		'select-rtl,select,selectall,showblocks-rtl,showblocks,smiley,' +
		'source-rtl,source,specialchar,spellchecker,strike,subscript,' +
		'superscript,table,templates-rtl,templates,textarea-rtl,textarea,' +
		'textcolor,textfield,underline,undo-rtl,undo,unlink' ).split( ',' );

	var iconsFolder = CKEDITOR.getUrl( CKEDITOR.skin.path() + 'icons/' );

	for ( var i = 0; i < icons.length; i++ ) {
		CKEDITOR.skin.addIcon( icons[ i ], iconsFolder + icons[ i ] + '.png' );
	}
})();

// %REMOVE_END%

