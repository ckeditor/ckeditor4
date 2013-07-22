/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

'use strict';

(function() {

	CKEDITOR.plugins.add( 'widgetimg', {
		requires: 'widget,dialog',
		icons: 'widgetimg',

		init: function( editor ) {
			editor.widgets.add( 'img', {
				dialog: 'widgetimg',
				button: 'Image',
				template:
					'<figure class="caption" data-widget="image">' +
						'<img alt="" src="" /><figcaption>caption...</figcaption>' +
					'</figure>',
				allowedContent: 'figure(!caption)[!data-widget]{float}; figcaption',

				parts: {
					image: 'img',
					caption: 'figcaption'
				},

				editables: {
					caption: 'figcaption'
				},

				init: function() {
					// Read float style from figure/image and remove it from these elements.
					// This style will be set on wrapper in #data listener.
					var floatStyle = this.element.getStyle( 'float' ) || this.parts.image.getStyle( 'float' );
					this.element.removeStyle( 'float' );
					this.parts.image.removeStyle( 'float' );
					this.setData( 'floatStyle', floatStyle );

					this.on( 'getOutput', function( evt ) {
						downcastWidgetElement( evt.data, this );
					} );

					this.on( 'dialog', function( evt ) {
						// We'll handle editing here.
						evt.cancel();

						// var dialog = evt.data,
						// 	widget = this,
						// 	okListener;

						// dialog.customImageElement = this.parts.image;

						// dialog.once( 'show', function() {
						// 	dialog.setValueOf( 'info', 'cmbAlign', widget.data.floatStyle );
						// 	dialog.hidePage( 'Link' );
						// } );

						// okListener = dialog.once( 'ok', function() {
						// 	widget.setData( 'floatStyle', dialog.getValueOf( 'info', 'cmbAlign' ) );
						// 	widget.parts.image.removeStyle( 'float' );
						// } );

						// dialog.once( 'hide', function() {
						// 	okListener.removeListener();
						// 	dialog.showPage( 'Link' );
						// } );
					} );
				},

				data: function() {
					this.wrapper.setStyle( 'float', this.data.floatStyle );
				},

				upcast: function( el ) {
					if ( el.name == 'img' )
						return upcastElement( el );
				},

				downcasts: {
					captionedImage: function( el ) {
						var img = el.getFirst( 'img' );

						downcastWidgetElement( el, this, img );

						return img;
					}
				}
			} );

			CKEDITOR.dialog.add( 'widgetimg', this.path + 'dialogs/widgetimg.js' );
		}
	} );

	function upcastElement( el ) {
		// Check whether <img> has data-caption attribute.
		var caption = el.attributes[ 'data-caption' ];

		// If there's no data-caption, turn <img> into widget.
		if ( !caption )
			return el;

		// If data-caption is set, wrap <img> into <figure>.
		var figure = el.wrapWith( new CKEDITOR.htmlParser.element( 'figure', { 'class': 'caption' } ) );

		// Append <caption> with data-caption to the <figure>.
		figure.add( CKEDITOR.htmlParser.fragment.fromHtml( caption, 'figcaption' ) );

		// Remove data-caption attribute as it's no longer necessary.
		delete el.attributes[ 'data-caption' ];

		return figure;
	}

	function downcastWidgetElement( element, widget, downcastTo ) {
		// if ( !downcastTo )
		// 	downcastTo = element;

		// var attrs = downcastTo.attributes;

		// // Downcasting to image - copy caption's content to data-caption attribute.
		// if ( downcastTo.name == 'img' ) {
		// 	var caption = element.getFirst( 'figcaption' );

		// 	// Something could happen that caption was removed. However,
		// 	// this was a widget, so it still should be.
		// 	attrs[ 'data-caption' ] = caption ? caption.getHtml() : '';
		// }

		// // Add float style to the downcasted element.
		// var floatStyle = widget.data.floatStyle;
		// if ( floatStyle ) {
		// 	var styles = CKEDITOR.tools.parseCssText( attrs.style || '' );
		// 	styles[ 'float' ] = floatStyle;
		// 	attrs.style = CKEDITOR.tools.writeCssText( styles );
		// }
	}

})();