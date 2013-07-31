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
					'<figure class="caption">' +
						'<img alt="" src="" />' +
						'<figcaption>Caption</figcaption>' +
					'</figure>',

				allowedContent: {
					figure: {
						classes: '!caption',
						styles: 'float,display'
					},
					img: {
						attributes: '!src,alt,width,height',
						styles: 'float'
					},
					div: {
						match: isCenterWrapper,
						styles: 'text-align'
					},
					p: {
						match: isCenterWrapper,
						styles: 'text-align'
					},
					figcaption: true
				},

				contentTransformations: [
					[ 'img[width]: sizeToAttribute' ]
				],

				parts: {
					image: 'img',
					caption: 'figcaption'
				},

				editables: {
					caption: 'figcaption'
				},

				init: function() {
					var image = this.parts.image,
						data = {
							// Initially, detect whether widget has caption.
							hasCaption: !!this.parts.caption,

							// Read initial image SRC attribute.
							src: image.getAttribute( 'src' ),

							// Read initial image ALT attribute.
							alt: image.getAttribute( 'alt' ),

							// Read initial width from either attribute or style.
							width: image.getAttribute( 'width' ) || '',

							// Read initial height from either attribute or style.
							height: image.getAttribute( 'height' ) || ''
						};

					// If element was marked as centered when upcasting, update
					// the alignment both visually and in widget data (will call setAlign).
					if ( this.element.data( 'cke-centered' ) ) {
						this.element.data( 'cke-centered', false );
						data.align = 'center';
					}

					// Otherwise, read initial float style from figure/image and
					// then remove it. This style will be set on wrapper in #data listener.
					else {
						data.align = this.element.getStyle( 'float' ) || image.getStyle( 'float' ) || 'none';
						this.element.removeStyle( 'float' );
						image.removeStyle( 'float' );
					}

					// Set collected data.
					this.setData( data );

					// Setup getOutput listener to downcast the widget.
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

					var image = widget.parts.image;

					// Set src attribute of the image.
					image.setAttribute( 'src', widget.data.src );
					image.data( 'cke-saved-src', widget.data.src );

					// Set alt attribute of the image.
					image.setAttribute( 'alt', widget.data.alt );

					// Set float style of the wrapper.
					setAlign( widget );

					// Set dimensions of the image according to gathered data.
					setDimensions( widget );
				},

				upcast: upcastWidgetElement,

				downcast: downcastWidgetElement
			} );

			CKEDITOR.dialog.add( 'widgetimg', this.path + 'dialogs/widgetimg.js' );
		}
	} );

	// Creates widgets from all <img> and <figure class="caption">.
	//
	// @param {CKEDITOR.htmlParser.element} el
	var upcastWidgetElement = (function() {
			var regexPercent = /^\s*(\d+\%)\s*$/i,
				dimensions = { width:1,height:1 };

		function upcastElement( el ) {
			var name = el.name,
				image;

			if ( name == 'img' )
				image = el;

			else if ( name == 'figure' && el.hasClass( 'caption' ) )
				image = el.getFirst( 'img' );

			if ( !image )
				return;

			// If there's an image, then cool, we got a widget.
			// Now just remove dimension attributes expressed with %.
			for ( var d in dimensions ) {
				var dimension = image.attributes[ d ];

				if ( dimension && dimension.match( regexPercent ) )
					delete image.attributes[ d ];
			}

			return el;
		}

		return function( el ) {
			// Replace this centering wrapper with its first-child.
			// During editor lifetime, widget centering is based on
			// widget.wrapper (see "setAlign"). It will be restored
			// on downcast.
			if ( isCenterWrapper( el ) ) {
				var child = el.getFirst();

				el.replaceWith( child );

				// Mark this widget element as centered. As the
				// centering wrapper is gowne now, this will
				// be used to set internal centering when initing the widget.
				child.attributes[ 'data-cke-centered' ] = true;

				return upcastElement( child );
			}

			// Basically upcast the element if there is no special
			// wrapper around.
			else
				return upcastElement( el );
		};
	})();

	// Transforms the widget to the external format according to
	// the current configuration.
	//
	// @param {CKEDITOR.htmlParser.element} el
	function downcastWidgetElement( el ) {
		var attrs = el.attributes,
			align = this.data.align;

		if ( align && align != 'none' ) {
			// Parse element styles. Styles will be extended.
			var styles = CKEDITOR.tools.parseCssText( attrs.style || '' );

			// If centering, wrap downcasted element.
			if ( align == 'center' ) {
				// Wrappers for <img> and <figure> are <p> and <div>, respectively.
				el = el.wrapWith( new CKEDITOR.htmlParser.element( el.name == 'img' ? 'p' : 'div', {
					'style': 'text-align:center'
				} ) );

				// This is to override possible display:block on element.
				styles.display = 'inline-block';
			}

			// If left/right/none, add float style to the downcasted element.
			else
				styles.float = align;

			// Update element styles.
			if ( CKEDITOR.tools.objectKeys( styles ).length )
				attrs.style = CKEDITOR.tools.writeCssText( styles );
		}

		return el;
	}

	// Checks whether an element is a valid centering wrapper.
	//
	// @param {CKEDITOR.htmlParser.element} el
	// @returns {Boolean}
	function isCenterWrapper( el ) {
		var children = el.children;

		// Centering div can have only one child.
		if ( children.length !== 1 )
			return false;

		var styles = CKEDITOR.tools.parseCssText( el.attributes.style || '' );

		// Centering div got to be... centering.
		if ( !styles[ 'text-align' ] || styles[ 'text-align' ] != 'center' )
			return false;

		var child = children[ 0 ],
			childName = child.name;

		// The only child of <p> can be <img>.
		if ( el.name == 'p' && childName == 'img' )
			return true;

		// The only child of <div> can be <figure> with "caption" class
		else if ( el.name == 'div' && childName == 'figure' && child.hasClass( 'caption' ) )
			return true;

		return false;
	}

	// Sets width and height of the widget image according to
	// current widget data.
	//
	// @param {CKEDITOR.plugins.widget} widget
	function setDimensions( widget ) {
		var dimensions = CKEDITOR.tools.extend( {}, widget.data, false, { width: 1, height: 1 } ),
			image = widget.parts.image;

		for ( var d in dimensions ) {
			if ( dimensions[ d ] )
				image.setAttribute( d, dimensions[ d ] );
			else
				image.removeAttribute( d );
		}
	}

	// Sets the alignment according to widget data.
	// This method takes care of the alignment during editor's lifetime.
	// For output alignment, see "downcastWidgetElement" method.
	//
	// @param {CKEDITOR.plugins.widget} widget
	function setAlign( widget ) {
		var align = widget.data.align,
			wrapper = widget.wrapper,
			image = widget.parts.image;

		// For **internal purposes**, center the image inside of widget wrapper.
		// The real wrapper for centering is created while downcasting.
		if ( align == 'center' ) {
			widget.element.setStyle( 'display', 'inline-block' );
			wrapper.setStyle( 'text-align', 'center' );
			wrapper.removeStyle( 'float' );
		}

		// When setting alignment left/right/none, clean-up centering
		// mess (if any) and use float property on wrapper element.
		else {
			widget.element.removeStyle( 'display' );
			wrapper.removeStyle( 'text-align' );
			wrapper.setStyle( 'float', align );
		}
	}
})();