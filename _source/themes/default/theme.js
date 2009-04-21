/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.themes.add( 'default', ( function() {
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

			var tabIndex = editor.config.tabIndex || editor.element.getAttribute( 'tabindex' ) || 0;

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
				'<span' +
					' id="cke_', name, '"' +
					' onmousedown="return false;"' +
					' class="', editor.skinClass, '"' +
					' dir="', editor.lang.dir, '"' +
					' title="', ( CKEDITOR.env.gecko ? ' ' : '' ), '"' +
					' tabindex="' + tabIndex + '">' +
				'<span class="', CKEDITOR.env.cssClass, ' cke_', editor.lang.dir, '">' +
					'<table class="cke_editor" border="0" cellspacing="0" cellpadding="0" style="width:', width, '"><tbody>' +
						'<tr', topHtml ? '' : ' style="display:none"', '><td id="cke_top_', name, '" class="cke_top">', topHtml, '</td></tr>' +
						'<tr', contentsHtml ? '' : ' style="display:none"', '><td id="cke_contents_', name, '" class="cke_contents" style="height:', height, '">', contentsHtml, '</td></tr>' +
						'<tr', bottomHtml ? '' : ' style="display:none"', '><td id="cke_bottom_', name, '" class="cke_bottom">', bottomHtml, '</td></tr>' +
					'</tbody></table>' +
					//Hide the container when loading skins, later restored by skin css.
								'<style>.', editor.skinClass, '{visibility:hidden;}</style>' +
				'</span>' +
				'</span>' ].join( '' ) );

			container.getChild( [ 0, 0, 0, 0 ] ).unselectable();
			container.getChild( [ 0, 0, 0, 2 ] ).unselectable();

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
			var baseIdNumber = CKEDITOR.tools.getNextNumber();

			var element = CKEDITOR.dom.element.createFromHtml( [
				'<div class="cke_skin_', editor.skinName,
					' ', CKEDITOR.env.cssClass,
					'" dir="', editor.lang.dir, '">' +

					'<div class="cke_dialog',
						' cke_', editor.lang.dir, '" style="position:absolute">' +
						'<div class="%body">' +
							'<div id="%title#" class="%title"></div>' +
							'<div id="%close_button#" class="%close_button"></div>' +
							'<div id="%tabs#" class="%tabs"></div>' +
							'<div id="%contents#" class="%contents"></div>' +
							'<div id="%footer#" class="%footer"></div>' +
						'</div>' +
						'<div id="%tl#" class="%tl"></div>' +
						'<div id="%tc#" class="%tc"></div>' +
						'<div id="%tr#" class="%tr"></div>' +
						'<div id="%ml#" class="%ml"></div>' +
						'<div id="%mr#" class="%mr"></div>' +
						'<div id="%bl#" class="%bl"></div>' +
						'<div id="%bc#" class="%bc"></div>' +
						'<div id="%br#" class="%br"></div>' +
					'</div>',

					//Hide the container when loading skins, later restored by skin css.
			( CKEDITOR.env.ie ? '' : '<style>.cke_dialog{visibility:hidden;}</style>' ),

				'</div>'
				].join( '' ).replace( /#/g, '_' + baseIdNumber ).replace( /%/g, 'cke_dialog_' ) );

			var body = element.getChild( [ 0, 0 ] );

			// Make the Title unselectable.
			body.getChild( 0 ).unselectable();


			return {
				element: element,
				parts: {
					dialog: element.getChild( 0 ),
					title: body.getChild( 0 ),
					close: body.getChild( 1 ),
					tabs: body.getChild( 2 ),
					contents: body.getChild( 3 ),
					footer: body.getChild( 4 )
				}
			};
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

CKEDITOR.editor.prototype.resize = function( width, height, isContentHeight ) {
	var numberRegex = /^\d+$/;
	if ( numberRegex.test( width ) )
		width += 'px';

	var contents = CKEDITOR.document.getById( 'cke_contents_' + this.name );
	var outer = contents.getAscendant( 'table' );

	// Resize the width first.
	outer.setStyle( 'width', width );

	// Get the height delta between the outer table and the content area.
	// If we're setting the content area's height, then we don't need the delta.
	var delta = isContentHeight ? 0 : ( outer.$.offsetHeight || 0 ) - ( contents.$.clientHeight || 0 );

	// Resize the height.
	contents.setStyle( 'height', ( height - delta ) + 'px' );

	// Emit a resize event.
	this.fire( 'resize' );
};
