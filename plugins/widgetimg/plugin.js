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
					'img[!src,alt,data-widget,width,height]{float,width,height}',

				parts: {
					image: 'img',
					caption: 'figcaption'
				},

				editables: {
					caption: 'figcaption'
				},

				init: function() {
					var image = this.parts.image;

					// Read initial float style from figure/image and then remove it.
					// This style will be set on wrapper in #data listener.
					this.setData( 'align', this.element.getStyle( 'float' ) || image.getStyle( 'float' ) || 'none' );
					this.element.removeStyle( 'float' );
					image.removeStyle( 'float' );

					// Initially, detect whether widget has caption.
					this.setData( 'hasCaption', !!this.parts.caption );

					// Read initial image SRC attribute.
					this.setData( 'src', image.getAttribute( 'src' ) );

					// Read initial image ALT attribute.
					this.setData( 'alt', image.getAttribute( 'alt' ) );

					// Read initial width from either attribute or style.
					this.setData( 'width', getDimension( image, 'width' ) );

					// Read initial height from either attribute or style.
					this.setData( 'height', getDimension( image, 'height' ) );

					updateInitialDimensions.call( this, image, true );

					// Once initial width and height are read, purge
					// styles. This widget converts style-driven dimensions to
					// attribute-driven values.
					image.removeStyle( 'width' );
					image.removeStyle( 'height' );

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

					updateInitialDimensions.call( this, image );

					// Set src attribute of the image.
					image.setAttribute( 'src', widget.data.src );
					image.data( 'cke-saved-src', widget.data.src );

					// Set alt attribute of the image.
					image.setAttribute( 'alt', widget.data.alt );

					// Set float style of the wrapper.
					widget.wrapper.setStyle( 'float', widget.data.align );

					// Clean up dimensions coming from the dialog.
					// As dimensions can be either "123", "123px", "123%" or "",
					// only "123%" value is stored with the unit.
					cleanDimensionsUp( widget.data );

					// Set dimensions of the image according to gathered data.
					setDimensions( image, {
						width: widget.data.width,
						height: widget.data.height
					} );
				},

				upcast: function( el ) {
					if ( el.name == 'img' )
						return el;
				},

				downcast: function( el ) {
					return downcastWidgetElement( el, this );
				}
			} );

			CKEDITOR.dialog.add( 'widgetimg', this.path + 'dialogs/widgetimg.js' );
		}
	} );

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

	// Cleans the values of width or height passed along with widget data,
	// according to the following formatting rules:
	//
	// 	* For "123%"    ->   "123%"
	// 	* For "123px"   ->   "123"
	// 	* For "123"     ->   "123"
	// 	* For ""        ->   "" (empty string)
	//
	// @param {Object} data
	var cleanDimensionsUp = (function() {

		// RegExp: 123, 123px, 123%
		var regexGetSize = /^\s*(\d+)((px)|\%)?\s*$/i,
			dimensions = { 'width': 1, 'height': 1 };

		return function( data ) {
			for ( var dim in dimensions ) {
				if ( !data[ dim ] )
					data[ dim ] = '';
				else {
					var match = data[ dim ].match( regexGetSize );

					if ( !match )
						data[ dim ] = '';
					else
						// Preserve "%" in value. It is allowed.
						data[ dim ] = match[ 1 ] + ( match[ 2 ] == '%' ? '%' : '' );
				}
			}
		};
	})();

	// Returns width or height value, either an attribute or style.
	// Values are cleaned up in "data" event (see: init).
	//
	// 	1. Check for an attribute:      <img src="foo.png" width="100" />
	// 	2. Then check for style:        <img src="foo.png" style="width:100px" />
	// 	3. If no dimension specified:   Return an empty string "".
	//
	// @param {CKEDITOR.dom.element} el
	// @param {String} dimension
	// @returns {String}
	function getDimension( el, dimension ) {
		return el.getAttribute( dimension ) || el.getStyle( dimension );
	}

	// @param {CKEDITOR.dom.element} el
	// @param {Object} values
	function setDimensions( el, values ) {
		for ( var v in values ) {
			if ( values[ v ] )
				el.setAttribute( v, values[ v ] );
			else
				el.removeAttribute( v );
		}
	}

	function updateInitialDimensions( image, immediate ) {
		var widget = this;

		function updateData( image ) {
			// Set initial width of the DOM element.
			this.setData( 'initWidth', image.$.width );

			// Set initial height of the DOM element.
			this.setData( 'initHeight', image.$.height );
		}

		if ( immediate )
			updateData.call( widget, image );
		else {
			image.on( 'load', function( evt ) {
				evt.removeListener();
				updateData.call( widget, this );
			} );
		}
	}
})();