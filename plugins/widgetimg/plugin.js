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

					// Detect whether widget has caption.
					this.setData( 'hasCaption', !!this.parts.caption );
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
						widget.parts.image.setAttribute( 'data-widget' )

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

						// Create a new widget with <figcaption>.
						widget = editor.widgets.initOn( figure, 'img', widget.data );
					}

					widget.wrapper.setStyle( 'float', widget.data.floatStyle );
				},

				upcast: function( el ) {
					if ( el.name == 'img' )
						return upcastElement( el, this );
				},

				downcast: function( el ) {
					// Get first <img> from <figure> or directly <img>
					// depending on the presence of the caption.
					var img = el.getFirst( 'img' ) || el,

						// Get <figcaption> from <figure>.
						figcaption = el.getFirst( 'figcaption' );

					downcastWidgetElement( img, this, figcaption );

					return img;
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

	function downcastWidgetElement( img, widget, figcaption ) {
		var attrs = img.attributes,
			caption = figcaption ? figcaption.getHtml() : null;

		// Downcasting caption: copy content to data-caption attribute if
		// caption exists.
		if ( caption )
			attrs[ 'data-caption' ] = caption;

		// Add float style to the downcasted element.
		var floatStyle = widget.data.floatStyle;

		if ( floatStyle ) {
			var styles = CKEDITOR.tools.parseCssText( attrs.style || '' );
			styles[ 'float' ] = floatStyle;
			attrs.style = CKEDITOR.tools.writeCssText( styles );
		}
	}

})();