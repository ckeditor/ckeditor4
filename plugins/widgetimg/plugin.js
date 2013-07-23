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
					'<figure class="caption" data-widget="img">' +
						'<img alt="" src="" />' +
						'<figcaption>Caption</figcaption>' +
					'</figure>',

				allowedContent: 'figure(!caption)[!data-widget]{float};' +
					'figcaption;' +
					'img[!src,alt,data-widget,data-caption]{float,width,height}',

				parts: {
					image: 'img',
					caption: 'figcaption'
				},

				editables: {
					caption: 'figcaption'
				},

				init: function() {
					var image = this.parts.image;

					// Read float style from figure/image and remove it from these elements.
					// This style will be set on wrapper in #data listener.
					var align = this.element.getStyle( 'float' ) || image.getStyle( 'float' );
					this.element.removeStyle( 'float' );
					image.removeStyle( 'float' );
					this.setData( 'align', align || 'none' );

					// Detect whether widget has caption.
					this.setData( 'hasCaption', !!this.parts.caption );

					// Read image SRC attribute.
					this.setData( 'src', image.getAttribute( 'src' ) );

					// Read image ALT attribute.
					this.setData( 'alt', image.getAttribute( 'alt' ) );

					this.on( 'getOutput', function( evt ) {
						downcastWidgetElement( evt.data, this );
					} );
				},

				data: function() {
					var hasCaption = this.data.hasCaption,
						widget = this;

					// Caption was present, but now caption is removed.
					if ( widget.element.is( 'figure' ) && !hasCaption ) {
						// Destroy this widget.
						editor.widgets.destroy( widget );

						// Unwrap <img> from figure.
						widget.parts.image.replace( widget.element );

						// From now on <img> is "the widget".
						widget.parts.image.setAttribute( 'data-widget', 'img' );

						// Create a new widget without <figcaption>.
						widget = editor.widgets.initOn( widget.parts.image, 'img', widget.data );
					}

					// There was no caption, but the caption is added.
					else if ( this.element.is( 'img' ) && hasCaption ) {
						// Destroy this widget.
						editor.widgets.destroy( widget );

						// Create new <figure> from widget template.
						var figure = CKEDITOR.dom.element.createFromHtml( widget.template.output(), editor.document );

						// Re replace <img> with new <figure>.
						figure.replace( widget.element );

						// Use old <img> instead of the one from the template,
						// so we won't lose additional attributes.
						widget.element.replace( figure.findOne( 'img' ) );

						// Make sure <img> no longer has the "data-widget" attribute.
						widget.element.removeAttribute( 'data-widget' );

						// Preserve data-widget-keep-attr attribute.
						figure.setAttribute( 'data-widget-keep-attr', 1 );

						// Create a new widget with <figcaption>.
						widget = editor.widgets.initOn( figure, 'img', widget.data );
					}

					// Set src attribute of the image.
					widget.parts.image.setAttribute( 'src', widget.data.src );
					widget.parts.image.data( 'cke-saved-src', widget.data.src );

					// Set alt attribute of the image.
					widget.parts.image.setAttribute( 'alt', widget.data.alt );

					// Set float style of the wrapper.
					widget.wrapper.setStyle( 'float', widget.data.align );
				},

				upcast: function( el ) {
					if ( el.name == 'img' )
						return upcastElement( el, this );
				},

				downcast: function( el ) {
					return downcastWidgetElement( el, this );
				}
			} );

			CKEDITOR.dialog.add( 'widgetimg', this.path + 'dialogs/widgetimg.js' );
		}
	} );

	function upcastElement( img ) {
		// Check whether <img> has data-caption attribute.
		var caption = img.attributes[ 'data-caption' ];

		// If there's no data-caption, turn <img> into widget.
		if ( !caption )
			return img;

		// If data-caption is set, wrap <img> into <figure>.
		var figure = img.wrapWith( new CKEDITOR.htmlParser.element( 'figure', { 'class': 'caption' } ) );

		// Append <caption> with data-caption to the <figure>.
		figure.add( CKEDITOR.htmlParser.fragment.fromHtml( caption, 'figcaption' ) );

		// Remove data-caption attribute as it's no longer necessary.
		delete img.attributes[ 'data-caption' ];

		return figure;
	}

	function downcastWidgetElement( el, widget ) {
		var attrs = el.attributes,
			align = widget.data.align;

		// Add float style to the downcasted element.
		if ( align && align != 'none' ) {
			var styles = CKEDITOR.tools.parseCssText( attrs.style || '' );
			styles.float = align;
			attrs.style = CKEDITOR.tools.writeCssText( styles );
		}

		return el;
	}
})();