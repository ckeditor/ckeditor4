/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

'use strict';

(function() {

	var template =
			'<figure class="caption">' +
				'<img alt="" src="" />' +
				'<figcaption>Caption</figcaption>' +
			'</figure>',
		templateInline = '<img alt="" src="" />';

	CKEDITOR.plugins.add( 'widgetimg', {
		requires: 'widget,dialog',
		icons: 'widgetimg',

		init: function( editor ) {
			// Register the inline widget.
			editor.widgets.add( 'imginline', CKEDITOR.tools.extend( {
				// Widget-specific rules for Allowed Content Filter.
				allowedContent: {
					img: {
						attributes: '!src,alt,width,height',
						styles: 'float'
					},

					// A rule for centering wrapper.
					p: {
						match: createCenterCheckFunction(),
						styles: 'text-align'
					}
				},

				// Data listener overrides the shared one.
				data: CKEDITOR.tools.override( widgetDef.data, function( originalData ) {
					return function() {
						var widget = this;

						// There was no caption, but the caption is to be added.
						if ( widget.data.hasCaption ) {
							console.log( 'adding caption to inline' );

							// Destroy this widget.
							editor.widgets.destroy( widget );

							// Create new <figure> from widget template.
							var figure = CKEDITOR.dom.element.createFromHtml( template, editor.document );

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
							var widget = editor.widgets.initOn( figure, 'img', widget.data );
						}

						// Call the original "data" implementation.
						originalData.apply( widget, arguments );
					};
				} ),

				// This widget is inline.
				inline: true,

				// Parts of this widget.
				parts: { image: 'img' },

				// Template of the widget: plain image.
				template: templateInline,

				// Widget upcasting.
				upcast: createUpcastFunction()
			}, widgetDef ) );

			// Register the block widget.
			editor.widgets.add( 'img', CKEDITOR.tools.extend( {
				// Widget-specific rules for Allowed Content Filter.
				allowedContent: {
					figcaption: true,
					figure: {
						classes: '!caption',
						styles: 'float,display'
					},
					img: {
						attributes: '!src,alt,width,height'
					},

					// A rule for centering wrapper.
					div: {
						match: createCenterCheckFunction( true ),
						styles: 'text-align'
					}
				},

				// Data listener overrides the shared one.
				data: CKEDITOR.tools.override( widgetDef.data, function( originalData ) {
					return function() {
						var widget = this;

						// The caption was present, but now it's to be removed.
						if ( !widget.data.hasCaption ) {
							console.log( 'removing caption from block' );

							// Destroy this widget.
							editor.widgets.destroy( widget );

							// Unwrap <img> from figure.
							widget.parts.image.replace( widget.element );

							// From now on <img> is "the widget".
							widget.parts.image.setAttribute( 'data-widget', 'img' );

							// Create a new widget without <figcaption>.
							widget = editor.widgets.initOn( widget.parts.image, 'imginline', widget.data );
						}

						// Call the original "data" implementation.
						originalData.apply( widget, arguments );
					};
				} ),

				// This widget has an editable caption.
				editables: {
					caption: 'figcaption'
				},

				// Parts of this widget: image and caption.
				parts: {
					image: 'img',
					caption: 'figcaption'
				},

				// Template of the widget: figure with image and caption.
				template: template,

				// Widget upcasting.
				upcast: createUpcastFunction( true )
			}, widgetDef ) );

			// Add the command for this plugin.
			editor.addCommand( 'widgetImg', {
				exec: function() {
					var focused = editor.widgets.focused;
				}
			} );

			// Add toolbar button for this plugin.
			editor.ui.addButton && editor.ui.addButton( 'WidgetImg', {
				label: 'Image',
				command: 'widgetImg',
				toolbar: 'insert,10'
			} );

			// Add the dialog associated with both widgets.
			CKEDITOR.dialog.add( 'widgetimg', this.path + 'dialogs/widgetimg.js' );
		}
	} );

	// Default definition shared across widgets.
	var widgetDef = {
		// This widget converts style-driven dimensions to attributes.
		contentTransformations: [
			[ 'img[width]: sizeToAttribute' ]
		],

		data: function() {
			var image = this.parts.image;

			// Set src attribute of the image.
			image.setAttribute( 'src', this.data.src );
			image.data( 'cke-saved-src', this.data.src );

			// Set alt attribute of the image.
			image.setAttribute( 'alt', this.data.alt );

			// Set float style of the wrapper.
			setAlign( this );

			// Set dimensions of the image according to gathered data.
			setDimensions( this );
		},

		// The name of this widget's dialog.
		dialog: 'widgetimg',

		// Initialization of this widget.
		init: initWidget,

		// Widget downcasting.
		downcast: downcastWidgetElement
	};

	// Initializes the widget.
	function initWidget() {
		var image = this.parts.image,
			data = {
				// Check whether widget has caption.
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
			data.align = this.element.getStyle( 'float' ) ||
				image.getStyle( 'float' ) ||
				'none';

			this.element.removeStyle( 'float' );
			image.removeStyle( 'float' );
		}

		// Set collected data.
		this.setData( data );

		// Setup getOutput listener to downcast the widget.
		this.on( 'getOutput', function( evt ) {
			downcastWidgetElement( evt.data, this );
		} );
	}

	// Creates widgets from all <img> and <figure class="caption">.
	//
	// @param {CKEDITOR.htmlParser.element} el
	function createUpcastFunction( isBlock ) {
		var regexPercent = /^\s*(\d+\%)\s*$/i,
			dimensions = { width:1,height:1 },
			isCenterWrapper = createCenterCheckFunction( isBlock );

		function upcastElement( el ) {
			var name = el.name,
				image;

			if ( isBlock && name == 'figure' && el.hasClass( 'caption' ) )
				image = el.getFirst( 'img' );

			else if ( !isBlock && name == 'img' )
				image = el;

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
	}

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

	function createCenterCheckFunction( isBlock ) {
		return function( el ) {
			// For a block widget, wrapper must be <div>.
			if ( isBlock && el.name != 'div' )
				return false;

			// For an inline widget, wrapper must be <div>.
			else if ( !isBlock && el.name != 'p' )
				return false;

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

			// The only child of <div> can be <figure> with "caption" class
			if ( isBlock && childName == 'figure' && child.hasClass( 'caption' ) )
				return true;

			// The only child of <p> can be <img>.
			else if ( !isBlock && childName == 'img' )
				return true;

			return false;
		};
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