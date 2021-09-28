/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/*
skin.js
=========

In this file we interact with the CKEditor JavaScript API to register the skin
and enable additional skin related features.

The level of complexity of this file depends on the features available in the
skin. There is only one mandatory line of code to be included here, which is
setting CKEDITOR.skin.name. All the rest is optional, but recommended to be
implemented as they make higher quality skins.

For this skin, the following tasks are achieved in this file:

	1. Register the skin.
	2. Register browser specific skin files.
	3. Define the "Chameleon" feature.
	4. Register the skin icons, to have them used on the development version of
		the skin.
*/

// 1. Register the skin
// ----------------------
// The CKEDITOR.skin.name property must be set to the skin name. This is a
// lower-cased name, which must match the skin folder name as well as the value
// used on config.skin to tell the editor to use the skin.
//
// This is the only mandatory property to be defined in this file.
CKEDITOR.skin.name = 'moono-lisa';

// 2. Register browser specific skin files
// -----------------------------------------
// (https://ckeditor.com/docs/ckeditor4/latest/guide/skin_sdk_browser_hacks.html)
//
// To help implementing browser specific "hacks" to the skin files and have it
// easy to maintain, it is possible to have dedicated files for such browsers,
// for both the main skin CSS files: editor.css and dialog.css.
//
// The browser files must be named after the main file names, appended by an
// underscore and the browser name (e.g. editor_ie.css, dialog_ie8.css).
//
// The accepted browser names must match the CKEDITOR.env properties. The most
// common names are: ie, webkit and gecko. Check the documentation for the complete
// list:
// https://ckeditor.com/docs/ckeditor4/latest/api/CKEDITOR_env.html
//
// Internet explorer is an expection and the browser version is also accepted
// (ie7, ie8, ie9, ie10), as well as a special name for IE in Quirks mode (iequirks).
//
// The available browser specific files must be set separately for editor.css
// and dialog.css.
CKEDITOR.skin.ua_editor = 'ie,iequirks,ie8,gecko';
CKEDITOR.skin.ua_dialog = 'ie,iequirks,ie8';

// 3. Define the "Chameleon" feature
// -----------------------------------
// (https://ckeditor.com/docs/ckeditor4/latest/guide/skin_sdk_chameleon.html)
//
// "Chameleon" is a unique feature available in CKEditor. It makes it possible
// to end users to specify which color to use as the basis for the editor UI.
// It is enough to set config.uiColor to any color value and voila, the UI is
// colored.
//
// The only detail here is that the skin itself must be compatible with the
// Chameleon feature. That's because the skin CSS files are the responsible to
// apply colors in the UI and each skin do that in different way and on
// different places.
//
// Implementing the Chameleon feature requires a bit of JavaScript programming.
// The CKEDITOR.skin.chameleon function must be defined. It must return the CSS
// "template" to be used to change the color of a specific CKEditor instance
// available in the page. When a color change is required, this template is
// appended to the page holding the editor, overriding styles defined in the
// skin files.
//
// The "$color" placeholder can be used in the returned string. It'll be
// replaced with the desired color.
CKEDITOR.skin.chameleon = ( function() {
	// This method can be used to adjust colour brightness of various element.
	// Colours are accepted in 7-byte hex format, for example: #00ff00.
	// Brightness ratio must be a float number within [-1, 1],
	// where -1 is black, 1 is white and 0 is the original colour.
	var colorBrightness = ( function() {
		function channelBrightness( channel, ratio ) {
			var brighten = ratio < 0 ? (
					0 | channel * ( 1 + ratio )
				) : (
					0 | channel + ( 255 - channel ) * ratio
				);

			return ( '0' + brighten.toString( 16 ) ).slice( -2 );
		}

		return function( hexColor, ratio ) {
			var channels = hexColor.match( /[^#]./g );

			for ( var i = 0 ; i < 3 ; i++ )
				channels[ i ] = channelBrightness( parseInt( channels[ i ], 16 ), ratio );

			return '#' + channels.join( '' );
		};
	} )(),

	// Style templates for various user interface parts:
	// 	* Default editor template.
	// 	* Default panel template.
	templates = {
		editor: new CKEDITOR.template(
			'{id}.cke_chrome [' +
					'border-color:{defaultBorder};' +
				'] ' +
			'{id} .cke_top [ ' +
					'background-color:{defaultBackground};' +
					'border-bottom-color:{defaultBorder};' +
				'] ' +
			'{id} .cke_bottom [' +
					'background-color:{defaultBackground};' +
					'border-top-color:{defaultBorder};' +
				'] ' +
			'{id} .cke_resizer [' +
					'border-right-color:{ckeResizer}' +
				'] ' +

			// Dialogs.
			'{id} .cke_dialog_title [' +
					'background-color:{defaultBackground};' +
					'border-bottom-color:{defaultBorder};' +
				'] ' +
			'{id} .cke_dialog_footer [' +
					'background-color:{defaultBackground};' +
					'outline-color:{defaultBorder};' +
				'] ' +
			'{id} .cke_dialog_tab [' +
					'background-color:{dialogTab};' +
					'border-color:{defaultBorder};' +
				'] ' +
			'{id} .cke_dialog_tab:hover [' +
					'background-color:{lightBackground};' +
				'] ' +
			'{id} .cke_dialog_contents [' +
					'border-top-color:{defaultBorder};' +
				'] ' +
			'{id} .cke_dialog_tab_selected, {id} .cke_dialog_tab_selected:hover [' +
					'background:{dialogTabSelected};' +
					'border-bottom-color:{dialogTabSelectedBorder};' +
				'] ' +
			'{id} .cke_dialog_body [' +
					'background:{dialogBody};' +
					'border-color:{defaultBorder};' +
				'] ' +

			// Toolbars, buttons.
			'{id} a.cke_button_off:hover,' +
			'{id} a.cke_button_off:focus,' +
			'{id} a.cke_button_off:active [' +
					'background-color:{darkBackground};' +
					'border-color:{toolbarElementsBorder};' +
				'] ' +
			'{id} .cke_button_on [' +
					'background-color:{ckeButtonOn};' +
					'border-color:{toolbarElementsBorder};' +
				'] ' +
			'{id} .cke_toolbar_separator,' +
			'{id} .cke_toolgroup a.cke_button:last-child:after,' +
			'{id} .cke_toolgroup a.cke_button.cke_button_disabled:hover:last-child:after [' +
					'background-color: {toolbarElementsBorder};' +
					'border-color: {toolbarElementsBorder};' +
				'] ' +

			// Combo buttons.
			'{id} a.cke_combo_button:hover,' +
			'{id} a.cke_combo_button:focus,' +
			'{id} .cke_combo_on a.cke_combo_button [' +
					'border-color:{toolbarElementsBorder};' +
					'background-color:{darkBackground};' +
				'] ' +
			'{id} .cke_combo:after [' +
					'border-color:{toolbarElementsBorder};' +
				'] ' +

			// Elementspath.
			'{id} .cke_path_item [' +
					'color:{elementsPathColor};' +
				'] ' +
			'{id} a.cke_path_item:hover,' +
			'{id} a.cke_path_item:focus,' +
			'{id} a.cke_path_item:active [' +
					'background-color:{darkBackground};' +
				'] ' +
			'{id}.cke_panel [' +
				'border-color:{defaultBorder};' +
			'] '
		),
		panel: new CKEDITOR.template(
			// Panel drop-downs.
			'.cke_panel_grouptitle [' +
					'background-color:{lightBackground};' +
					'border-color:{defaultBorder};' +
				'] ' +

			// Context menus.
			'.cke_menubutton_icon [' +
					'background-color:{menubuttonIcon};' +
				'] ' +
			'.cke_menubutton:hover,' +
			'.cke_menubutton:focus,' +
			'.cke_menubutton:active [' +
					'background-color:{menubuttonHover};' +
				'] ' +
			'.cke_menubutton:hover .cke_menubutton_icon, ' +
			'.cke_menubutton:focus .cke_menubutton_icon, ' +
			'.cke_menubutton:active .cke_menubutton_icon [' +
					'background-color:{menubuttonIconHover};' +
				'] ' +
			'.cke_menubutton_disabled:hover .cke_menubutton_icon,' +
			'.cke_menubutton_disabled:focus .cke_menubutton_icon,' +
			'.cke_menubutton_disabled:active .cke_menubutton_icon [' +
					'background-color:{menubuttonIcon};' +
				'] ' +
			'.cke_menuseparator [' +
					'background-color:{menubuttonIcon};' +
				'] ' +

			// Color boxes.
			'a:hover.cke_colorbox, ' +
			'a:active.cke_colorbox [' +
					'border-color:{defaultBorder};' +
				'] ' +
			'a:hover.cke_colorauto, ' +
			'a:hover.cke_colormore, ' +
			'a:active.cke_colorauto, ' +
			'a:active.cke_colormore [' +
					'background-color:{ckeColorauto};' +
					'border-color:{defaultBorder};' +
				'] '
		)
	};

	return function( editor, part ) {
		var uiColor = editor.uiColor,
			baseColor = colorBrightness( uiColor, 0.4 ),
			// The following are CSS styles used in templates.
			// Styles are generated according to current editor.uiColor.
			templateStyles = {
				// CKEditor instances have a unique ID, which is used as class name into
				// the outer container of the editor UI (e.g. ".cke_1").
				//
				// The Chameleon feature is available for each CKEditor instance,
				// independently. Because of this, we need to prefix all CSS selectors with
				// the unique class name of the instance.
				id: '.' + editor.id,

				// These styles are used by various UI elements.
				defaultBorder: colorBrightness( baseColor, -0.2 ),
				toolbarElementsBorder: colorBrightness( baseColor, -0.25 ),
				defaultBackground: baseColor,
				lightBackground: colorBrightness( baseColor, 0.8 ),
				darkBackground: colorBrightness( baseColor, -0.15 ),

				// These are for specific UI elements.
				ckeButtonOn: colorBrightness( baseColor, 0.4 ),
				ckeResizer: colorBrightness( baseColor, -0.4 ),
				ckeColorauto: colorBrightness( baseColor, 0.8 ),
				dialogBody: colorBrightness( baseColor, 0.7 ),
				dialogTab: colorBrightness( baseColor, 0.65 ),
				dialogTabSelected: '#FFF',
				dialogTabSelectedBorder: '#FFF',
				elementsPathColor: colorBrightness( baseColor, -0.6 ),
				menubuttonHover: colorBrightness( baseColor, 0.1 ),
				menubuttonIcon: colorBrightness( baseColor, 0.5 ),
				menubuttonIconHover: colorBrightness( baseColor, 0.3 )
			};

		return templates[ part ]
			.output( templateStyles )
			.replace( /\[/g, '{' )				// Replace brackets with braces.
			.replace( /\]/g, '}' );
	};
} )();

// %REMOVE_START%

// 4. Register the skin icons for development purposes only
// ----------------------------------------------------------
// (https://ckeditor.com/docs/ckeditor4/latest/guide/skin_sdk_icons.html)
//
// Note: As "moono-lisa" is the default CKEditor skin, it provides no custom icons,
// thus this code is commented out.
//
// This code is here just to make the skin work fully when using its "source"
// version. Without this, the skin will still work, but its icons will not be
// used (again, on source version only).
//
// This block of code is not necessary on the release version of the skin.
// Because of this it is very important to include it inside the REMOVE_START
// and REMOVE_END comment markers, so the skin builder will properly clean
// things up.
//
// If a required icon is not available here, the plugin defined icon will be
// used instead. This means that a skin is not required to provide all icons.
// Actually, it is not required to provide icons at all.
//
// (function() {
//		// The available icons. This list must match the file names (without
//		// extension) available inside the "icons" folder.
//		var icons = ( 'about,anchor-rtl,anchor,bgcolor,bidiltr,bidirtl,blockquote,' +
//			'bold,bulletedlist-rtl,bulletedlist,button,checkbox,copy-rtl,copy,' +
//			'creatediv,cut-rtl,cut,docprops-rtl,docprops,find-rtl,find,form,' +
//			'hiddenfield,horizontalrule,icons,iframe,image,imagebutton,indent-rtl,' +
//			'indent,italic,justifyblock,justifycenter,justifyleft,justifyright,' +
//			'link,maximize,newpage-rtl,newpage,numberedlist-rtl,numberedlist,' +
//			'outdent-rtl,outdent,pagebreak-rtl,pagebreak,paste-rtl,paste,' +
//			'pastefromword-rtl,pastefromword,pastetext-rtl,pastetext,preview-rtl,' +
//			'preview,print,radio,redo-rtl,redo,removeformat,replace,save,scayt,' +
//			'select-rtl,select,selectall,showblocks-rtl,showblocks,smiley,' +
//			'source-rtl,source,specialchar,spellchecker,strike,subscript,' +
//			'superscript,table,templates-rtl,templates,textarea-rtl,textarea,' +
//			'textcolor,textfield-rtl,textfield,uicolor,underline,undo-rtl,undo,unlink' ).split( ',' );
//
//		var iconsFolder = CKEDITOR.getUrl( CKEDITOR.skin.path() + 'icons/' + ( CKEDITOR.env.hidpi ? 'hidpi/' : '' ) );
//
//		for ( var i = 0; i < icons.length; i++ ) {
//			CKEDITOR.skin.addIcon( icons[ i ], iconsFolder + icons[ i ] + '.png' );
//		}
// })();

// %REMOVE_END%
