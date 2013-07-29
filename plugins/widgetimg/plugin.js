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

				allowedContent: 'figure(!caption){float};' +
					'figcaption;' +
					'img[!src,alt,width,height]{float}',

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
					var image = this.parts.image;

					// A function for loading images.
					this.loadImage = preLoader( editor, this );

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
					this.setData( 'width', image.getAttribute( 'width' ) || '' );

					// Read initial height from either attribute or style.
					this.setData( 'height', image.getAttribute( 'height' ) || '' );

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
					widget.wrapper.setStyle( 'float', widget.data.align );

					// Set dimensions of the image according to gathered data.
					setDimensions( this );
				},

				upcast: upcastWidgetElement,

				downcast: downcastWidgetElement
			} );

			CKEDITOR.dialog.add( 'widgetimg', this.path + 'dialogs/widgetimg.js' );
		}
	} );

	var upcastWidgetElement = (function() {
			var regexPercent = /^\s*(\d+\%)\s*$/i,
				dimensions = { width:1,height:1 };

		// Removes width and height attributes expressed with %.
		// @param {CKEDITOR.htmlParser.element} el
		function cleanDimensionsUp( el ) {
			for ( var d in dimensions ) {
				var dimension = el.attributes[ d ];

				if ( dimension && dimension.match( regexPercent ) )
					delete el.attributes[ d ];
			}
		}

		// Creates widgets from all <img> and <figure class="caption">.
		// @param {CKEDITOR.htmlParser.element} el
		return function( el ) {
			var name = el.name,
				image;

			if ( name == 'img' )
				image = el;
			else if ( name == 'figure' && el.hasClass( 'caption' ) )
				image = el.getFirst( 'img' );

			if ( !image )
				return;

			cleanDimensionsUp( image );

			return el;
		};
	})();

	function downcastWidgetElement( el ) {
		var attrs = el.attributes,
			align = this.data.align;

		// Add float style to the downcasted element.
		if ( align && align != 'none' ) {
			var styles = CKEDITOR.tools.parseCssText( attrs.style || '' );
			styles.float = align;
			attrs.style = CKEDITOR.tools.writeCssText( styles );
		}

		return el;
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

	// Creates a function that pre-loads images. The callback function passes
	// [image, width, height] or null if loading failed.
	//
	// @param {CKEDITOR.editor} editor
	// @param {CKEDITOR.plugins.widget} widget
	// @returns {Function}
	function preLoader( editor, widget ) {
		var image = editor.document.createElement( 'img' ),
			listeners = [];

		function addListener( event, callback ) {
			listeners.push( image.once( event, function( evt ) {
				removeListeners();
				callback( evt );
			} ) );
		}

		function removeListeners() {
			var l;

			while ( ( l = listeners.pop() ) )
				l.removeListener();
		}

		// @param {String} src.
		// @param {Function} callback.
		return function( src, callback, scope ) {
			addListener( 'load', function() {
				callback.call( scope, image, image.$.width, image.$.height );
			} );

			addListener( 'error', function() {
				callback( null );
			} );

			addListener( 'abort', function() {
				callback( null );
			} );

			image.setAttribute( 'src', src + '?' + Math.random().toString( 16 ).substring( 2 ) );
		};
	}
})();