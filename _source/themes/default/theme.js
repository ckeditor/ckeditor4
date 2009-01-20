/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.themes.add( 'default', ( function() {
	// The CSS class to be appended on the main UI containers, making it easy
	// to apply browser specific styles to it.
	var browserCssClass = 'cke_browser_' + ( CKEDITOR.env.ie ? 'ie' : CKEDITOR.env.gecko ? 'gecko' : CKEDITOR.env.opera ? 'opera' : CKEDITOR.env.air ? 'air' : CKEDITOR.env.webkit ? 'webkit' : 'unknown' );

	return {
		build: function( editor, themePath ) {
			var name = editor.name,
				element = editor.element,
				elementMode = editor.elementMode;

			if ( !element || elementMode == CKEDITOR.ELEMENT_MODE_NONE )
				return;

			if ( elementMode == CKEDITOR.ELEMENT_MODE_REPLACE )
				element.hide();

			// Get the HTML for the predefined spaces.
			var topHtml = editor.fire( 'themeSpace', { space: 'top', html: '' } ).html;
			var contentsHtml = editor.fire( 'themeSpace', { space: 'contents', html: '' } ).html;
			var bottomHtml = editor.fireOnce( 'themeSpace', { space: 'bottom', html: '' } ).html;

			var height = contentsHtml && editor.config.height;
			var width = editor.config.width;

			// The editor height is considered only if the contents space got filled.
			if ( !contentsHtml )
				height = 'auto';
			else if ( !isNaN( height ) )
				height += 'px';

			if ( !isNaN( width ) )
				width += 'px';

			// Using a <div> as the outer element container can make IE goes crazy.
			// The fact is that a <textarea> is an inline element. We aim to
			// replace it with our structure, but <div> is a block element and it
			// seems to be the cause of it. Using a <span>, which is inline just
			// like <textarea>, makes it work.
			// <table> is also a block element and should not go inside a <span>,
			// not even in the places where <textarea> is valid. But this doesn't
			// bring any evident problem as it seems that tables are treated
			// differently by the browsers ("semi-inline").
			var container = CKEDITOR.dom.element.createFromHtml( [
				'<span id="cke_', name, '" onmousedown="return false;" class="cke_container cke_skin_', editor.config.skin, ' ', browserCssClass,
					' cke_', editor.lang.dir, '" dir="', editor.lang.dir, '">' +
					'<table class="cke_editor" border="0" cellspacing="0" cellpadding="0" style="width:', width, ';height:', height, '"><tbody>' +
						'<tr', topHtml ? '' : ' style="display:none"', '><td id="cke_top_', name, '" class="cke_top">', topHtml, '</td></tr>' +
						'<tr', contentsHtml ? '' : ' style="display:none"', '><td id="cke_contents_', name, '" class="cke_contents" style="height:100%">', contentsHtml, '</td></tr>' +
						'<tr', bottomHtml ? '' : ' style="display:none"', '><td id="cke_bottom_', name, '" class="cke_bottom">', bottomHtml, '</td></tr>' +
					'</tbody></table>' +
				'</span>' ].join( '' ) );

			container.getChild( [ 0, 0, 0 ] ).unselectable();
			container.getChild( [ 0, 0, 2 ] ).unselectable();

			if ( elementMode == CKEDITOR.ELEMENT_MODE_REPLACE )
				container.insertAfter( element );
			else
				element.append( container );

			/**
			 * The DOM element that holds the main editor interface.
			 * @name CKEDITOR.editor.prototype.container
			 * @type CKEDITOR.dom.element
			 * @example
			 * var editor = CKEDITOR.instances.editor1;
			 * alert( <b>editor.container</b>.getName() );  "span"
			 */
			editor.container = container;

			editor.fireOnce( 'themeLoaded' );
			editor.fireOnce( 'uiReady' );
		},

		buildDialog: function( editor ) {
			var container = CKEDITOR.dom.element.createFromHtml( [
				'<div class="cke_skin_', editor.config.skin, ' ', browserCssClass, ' ',
					CKEDITOR.document.$.compatMode == 'CSS1Compat' ? 'cke_mode_standards' : 'cke_mode_quirks',
					' ', 'cke_', editor.lang.dir,
					'" ', 'dir="', editor.lang.dir, '"><div id="%#" class="cke_dialog" style="position:',
					( CKEDITOR.env.ie6Compat ? 'absolute;' : 'fixed;' ),
					'">',
					'<div>',
						'<div id="%tl_#" class="%tl">',
							'<div id="%tl_resize_#" class="%tl_resize"></div>',
						'</div>',
						'<div id="%t_#" class="%t">',
							'<div id="%t_resize_#" class="%t_resize"></div>',
						'</div>',
						'<div id="%tr_#" class="%tr">',
							'<div id="%tr_resize_#" class="%tr_resize"></div>',
						'</div>',
					'</div>',
					'<div>',
						'<div id="%l_#" class="%l">',
							'<div id="%l_resize_#" class="%l_resize"></div>',
						'</div>',
						'<div id="%c_#" class="%c">',
							'<div id="%title_#" class="%title">',
								'<div id="%close_button_#" class="%close_button"></div>',
							'</div>',
							'<table id="%tabs_#" class="%tabs" cellpadding="0" border="0" cellspacing="0"><tbody><tr>',
							'<td class="head_filler">&nbsp;</td>',
							'<td class="tail_filler">&nbsp;</td>',
							'</tr></tbody></table>',
							'<div id="%contents_#" class="%contents"></div>',
							'<div id="%footer_#" class="%footer"></div>',
						'</div>',
						'<div id="%r_#" class="%r">',
							'<div id="%r_resize_#" class="%r_resize"></div>',
						'</div>',
					'</div>',
					'<div>',
						'<div id="%bl_#" class="%bl">',
							'<div id="%bl_resize_#" class="%bl_resize"></div>',
						'</div>',
						'<div id="%b_#" class="%b">',
							'<div id="%b_resize_#" class="%b_resize"></div>',
						'</div>',
						'<div id="%br_#" class="%br">',
							'<div id="%br_resize_#" class="%br_resize"></div>',
						'</div>',
					'</div>',
				'</div></div>'
				].join( '' ).replace( /#/g, CKEDITOR.tools.getNextNumber() ).replace( /%/g, 'cke_dialog_' ) );

			container.getChild( [ 0, 1, 1, 0 ] ).unselectable();

			return container;
		},

		destroy: function( editor ) {
			var container = editor.container;

			if ( container )
				container.remove();

			if ( editor.elementMode == CKEDITOR.ELEMENT_MODE_REPLACE )
				editor.element.show();
		}
	};
})() );

CKEDITOR.editor.prototype.getThemeSpace = function( spaceName ) {
	var spacePrefix = 'cke_' + spaceName;
	var space = this._[ spacePrefix ] || ( this._[ spacePrefix ] = CKEDITOR.document.getById( spacePrefix + '_' + this.name ) );
	return space;
};
