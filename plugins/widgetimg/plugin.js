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
		templateInline = '<img alt="" src="" />',
		templateResizer = '<span class="cke_widgetimg_resizer"></span>',
		templateResizerWrapper = '<span class="cke_widgetimg_resizer_wrapper"></span>';

	CKEDITOR.plugins.add( 'widgetimg', {
		requires: 'widget,dialog',
		icons: 'widgetimg',

		onLoad: function( editor ) {
			CKEDITOR.addCss( '.cke_widgetimg_resizer{' +
				'display:none;' +
				'position:absolute;' +
				'bottom:2px;' +
				'width: 0px;' +
				'height: 0px;' +
				'border-style:solid;' +
			'}' +
			'.cke_widgetimg_resizer_wrapper{' +
				'position:relative;' +
				'display:inline-block;' +
				'line-height:0;' +
			'}' +
			'.cke_widgetimg_resizer.cke_resizer_left{' +
				'left:2px;' +
				'border-width:10px 0 0 10px;' +
				'border-color:transparent transparent transparent #ccc;' +
				'box-shadow: -1px 1px 0px #777;' +
				'-moz-box-shadow: -1px 1px 0px #777;' +
				'-webkit-box-shadow: -1px 1px 0px #777;' +
				'cursor:sw-resize;' +
			'}' +
			'.cke_widgetimg_resizer.cke_resizer_right{' +
				'right:2px;' +
				'border-width:0 0 10px 10px;' +
				'border-color:transparent transparent #ccc transparent;' +
				'box-shadow: 1px 1px 0px #777;' +
				'-moz-box-shadow: 1px 1px 0px #777;' +
				'-webkit-box-shadow: 1px 1px 0px #777;' +
				'cursor:se-resize;' +
			'}' +
			'.cke_widget_wrapper:hover .cke_widgetimg_resizer{display:block;}' );
		},
		init: function( editor ) {
			// Register the inline widget.
			editor.widgets.add( 'imginline', imgInline );

			// Register the block widget.
			editor.widgets.add( 'imgblock', imgBlock );

			// Add the command for this plugin.
			editor.addCommand( 'widgetImg', {
				exec: function() {
					var focused = editor.widgets.focused;

					if ( focused && focused.name in { imginline:1,imgblock:1 } )
						focused.edit();
					else
						editor.execCommand( 'widgetImginline' );
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
	var definition = {
			// This widget converts style-driven dimensions to attributes.
			contentTransformations: [
				[ 'img[width]: sizeToAttribute' ]
			],

			data: function() {
				var widget = this,
					editor = widget.editor,
					oldState = widget.oldData,
					newState = widget.data;

				// Convert the internal form of the widget
				// from the old state to the new one.
				widget.shiftState( {
					element: widget.element,
					oldState: oldState,
					newState: newState,

					// Destroy the widget.
					destroy: function() {
						if ( this.destroyed )
							return;

						editor.widgets.destroy( widget );

						// Mark widget was destroyed.
						this.destroyed = true;
					},

					init: function( element ) {
						// Create a new widget. This widget will be either captioned
						// non-captioned, block or inline according to what is the
						// new state of the widget.
						if ( this.destroyed ) {
							var name = 'img' + ( newState.hasCaption || newState.align == 'center' ? 'block' : 'inline' );
							widget = editor.widgets.initOn( element, name, widget.data );
						}

						// If now widget was destroyed just update wrapper's alignment.
						// According to the new state.
						else
							setWrapperAlign( widget );
					}
				} );

				// Get the <img> from the widget. As widget may have been
				// re-initialized, this may be a totally different <img>.
				var image = widget.parts.image;

				// Set src attribute of the image.
				image.setAttribute( 'src', widget.data.src );

				// This internal is required by the editor.
				image.data( 'cke-saved-src', widget.data.src );

				// Set alt attribute of the image.
				image.setAttribute( 'alt', widget.data.alt );

				// Set dimensions of the image according to gathered data.
				setDimensions( widget );

				// Cache current data.
				widget.oldData = CKEDITOR.tools.extend( {}, widget.data );
			},

			// The name of this widget's dialog.
			dialog: 'widgetimg',

			// Initialization of this widget.
			init: function() {
				var image = this.parts.image,
					data = {
						// Check whether widget has caption.
						hasCaption: !!this.parts.caption,

						// Read initial image SRC attribute.
						src: image.getAttribute( 'src' ),

						// Read initial image ALT attribute.
						alt: image.getAttribute( 'alt' ) || '',

						// Read initial width from either attribute or style.
						width: image.getAttribute( 'width' ) || '',

						// Read initial height from either attribute or style.
						height: image.getAttribute( 'height' ) || ''
					};

				// If element was marked as centered when upcasting, update
				// the alignment both visually and in widget data.
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

				// Get rid of extra vertical space when there's no caption.
				// It will improve the look of the resizer.
				if ( !data.hasCaption )
					this.wrapper.setStyle( 'line-height', '0' );

				// Set collected data.
				this.setData( data );

				// Setup dynamic image resizing with mouse.
				setupResizer( this );

				// Create shift stater for this widget.
				this.shiftState = CKEDITOR.plugins.widgetimg.stateShifter( this.editor );
			},

			// Widget downcasting.
			downcast: downcastWidgetElement
		},

		imgInline = CKEDITOR.tools.extend( {
			// Widget-specific rules for Allowed Content Filter.
			allowedContent: {
				// This widget needs <img>.
				img: {
					attributes: '!src,alt,width,height',
					styles: 'float'
				}
			},

			// This widget is inline.
			inline: true,

			// Parts of this widget.
			parts: { image: 'img' },

			// Template of the widget: plain image.
			template: templateInline,

			// Widget upcasting.
			upcast: createUpcastFunction()
		}, definition ),

		imgBlock = CKEDITOR.tools.extend( {
			// Widget-specific rules for Allowed Content Filter.
			allowedContent: {
				// This widget needs <figcaption>.
				figcaption: true,

				// This widget needs <figure>.
				figure: {
					classes: '!caption',
					styles: 'float,display'
				},

				// This widget needs <img>.
				img: {
					attributes: '!src,alt,width,height'
				},

				// This widget may need <div> centering wrapper.
				div: {
					match: isCenterWrapper,
					styles: 'text-align'
				},

				// This widget may need <p> centering wrapper.
				p: {
					match: isCenterWrapper,
					styles: 'text-align'
				}
			},

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
		}, definition );

	CKEDITOR.plugins.widgetimg = {
		stateShifter: function( editor ) {
			// Tag name used for centering non-captioned widgets.
			var centerElement = editor.config.enterMode == CKEDITOR.ENTER_P ? 'p' : 'div',

				// The order that stateActions get executed. It matters!
				shiftables = [ 'hasCaption', 'align' ],

				editable = editor.editable(),

				// Atomic procedures, one per state variable.
				stateActions = {
					align: function( data, oldValue, newValue ) {
						var hasCaptionAfter = data.newState.hasCaption,
							element = data.element;

						// Alignment changed.
						if ( changed( data, 'align' ) ) {
							// No caption in the new state.
							if ( !hasCaptionAfter ) {
								// Changed to "center" (non-captioned).
								if ( newValue == 'center' ) {
									data.destroy();
									data.element = wrapInCentering( element );
								}

								// Changed to "non-center" from "center" while caption removed.
								if ( !changed( data, 'hasCaption' ) && oldValue == 'center' && newValue != 'center' ) {
									data.destroy();
									data.element = unwrapFromCentering( element );
								}
							}
						}

						// Alignment remains and "center" removed caption.
						else if ( newValue == 'center' && changed( data, 'hasCaption' ) && !hasCaptionAfter ) {
							data.destroy();
							data.element = wrapInCentering( element );
						}

						// Finally set display for figure.
						if ( element.is( 'figure' ) ) {
							if ( newValue == 'center' )
								element.setStyle( 'display', 'inline-block' );
							else
								element.removeStyle( 'display' );
						}
					},
					hasCaption:	function( data, oldValue, newValue ) {
						// This action is for real state change only.
						if ( !changed( data, 'hasCaption' ) )
							return;

						var element = data.element,
							oldState = data.oldState,
							newState = data.newState;

						// Switching hasCaption always destroys the widget.
						data.destroy();

						// There was no caption, but the caption is to be added.
						if ( newValue ) {
							// Get <img> from element. As element may be either
							// <img> or centering <p>, consider it now.
							var img = element.findOne( 'img' ) || element,

								// Create new <figure> from widget template.
								figure = CKEDITOR.dom.element.createFromHtml( template, editor.document );

							// Replace element with <figure>.
							replaceSafely( figure, element );

							// Use old <img> instead of the one from the template,
							// so we won't lose additional attributes.
							img.replace( figure.findOne( 'img' ) );

							// Update widget's element.
							data.element = figure;
						}

						// The caption was present, but now it's to be removed.
						else {
							// Unwrap <img> from figure.
							var img = element.findOne( 'img' );

							// Replace <figure> with <img>.
							img.replace( element );

							// Update widget's element.
							data.element = img;
						}
					}
				};

			function getValue( state, name ) {
				return state && state[ name ] !== undefined ? state[ name ] : null;
			}

			function changed( data, name ) {
				if ( !data.oldState )
					return false;
				else
					return data.oldState[ name ] !== data.newState[ name ];
			}

			function wrapInCentering( element ) {
				// When widget gets centered. Wrapper must be created.
				// Create new <p|div> with text-align:center.
				var center = editor.document.createElement( centerElement, {
					// Centering wrapper is.. centering.
					styles: { 'text-align': 'center' }
				} );

				// Replace element with centering wrapper.
				replaceSafely( center, element );

				// Append element into centering wrapper.
				element.move( center );

				return center;
			}

			function unwrapFromCentering( element ) {
				var img = element.findOne( 'img' );

				img.replace( element );

				return img;
			}

			function replaceSafely( replacing, replaced ) {
				if ( replaced.getParent() ) {
					// Create a range that corresponds with old element's position.
					var range = editor.createRange();

					// Move the range before old element.
					range.moveToPosition( replaced, CKEDITOR.POSITION_BEFORE_START );

					// Insert element at range position.
					editable.insertElementIntoRange( replacing, range );

					// Remove old element.
					replaced.remove();
				}
				else
					replacing.replace( replaced );
			}

			return function( data ) {
				var oldState = data.oldState,
					newState = data.newState,
					name;

				// Iterate over possible state variables.
				for ( var i = 0; i < shiftables.length; i++ ) {
					name = shiftables[ i ];

					stateActions[ name ]( data,
						oldState ? oldState[ name ] : null,
						newState[ name ] );
				}

				data.init( data.element );
			};
		}
	};

	function setWrapperAlign( widget ) {
		var wrapper = widget.wrapper,
			align = widget.data.align;

		if ( align == 'center' ) {
			if ( !widget.inline )
				wrapper.setStyle( 'text-align', 'center' );

			wrapper.removeStyle( 'float' );
		} else {
			if ( !widget.inline )
				wrapper.removeStyle( 'text-align' );

			if ( align == 'none' )
				wrapper.removeStyle( 'float' );
			else
				wrapper.setStyle( 'float', align );
		}
	}

	// Creates widgets from all <img> and <figure class="caption">.
	//
	// @param {CKEDITOR.htmlParser.element} el
	function createUpcastFunction( isBlock ) {
		var regexPercent = /^\s*(\d+\%)\s*$/i,
			dimensions = { width:1,height:1 };

		function upcastElement( el, isBlock, isCenter ) {
			var name = el.name,
				image;

			// Block widget to be upcasted.
			if ( isBlock ) {
				// If a center wrapper is found.
				if ( isCenter ) {
					// So the element is:
					// 		<div style="text-align:center"><figure></figure></div>.
					// Centering is done by widget.wrapper in such case. Hence, replace
					// centering wrapper with figure.
					// The other case is:
					// 		<p style="text-align:center"><img></p>.
					// Then <p> takes charge of <figure> and nothing is to be changed.
					if ( name == 'div' ) {
						var figure = el.getFirst( 'figure' );
						el.replaceWith( figure );
						el = figure;
					}

					// Mark the element as centered, so widget.data.align
					// can be correctly filled on init.
					el.attributes[ 'data-cke-centered' ] = true;

					image = el.getFirst( 'img' );
				}

				// No center wrapper has been found.
				else if ( name == 'figure' && el.hasClass( 'caption' ) )
					image = el.getFirst( 'img' );
			}

			// Inline widget from plain img.
			else if ( name == 'img' )
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

		return isBlock ?
				function( el ) {
					return upcastElement( el, true, isCenterWrapper( el ) );
				}
			:
				function( el ) {
					// Basically upcast the element if there is no special
					// wrapper around.
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
			// Wrappers for <img> and <figure> are <p> and <div>, respectively.
			if ( align == 'center' && el.name != 'p' ) {
				var name = el.name == 'img' ? 'p' : 'div';

				el = el.wrapWith( new CKEDITOR.htmlParser.element( name, {
					'style': 'text-align:center'
				} ) );
			}

			// If left/right, add float style to the downcasted element.
			else if ( align in { left:1,right:1 } )
				styles.float = align;

			// Update element styles.
			if ( CKEDITOR.tools.objectKeys( styles ).length )
				attrs.style = CKEDITOR.tools.writeCssText( styles );
		}

		return el;
	}

	function isCenterWrapper( el ) {
		// Wrapper must be either <div> or <p>.
		if ( !( el.name in { div:1,p:1 } ) )
			return false;

		var children = el.children;

		// Centering wrapper can have only one child.
		if ( children.length !== 1 )
			return false;

		var styles = CKEDITOR.tools.parseCssText( el.attributes.style || '' );

		// Centering wrapper got to be... centering.
		if ( !styles[ 'text-align' ] || styles[ 'text-align' ] != 'center' )
			return false;

		var child = children[ 0 ],
			childName = child.name;

		// The only child of centering wrapper can be <figure> with
		// class="caption" or plain <img>.
		if ( childName == 'img' || ( childName == 'figure' && child.hasClass( 'caption' ) ) )
			return true;

		return false;
	};

	// Sets width and height of the widget image according to
	// current widget data.
	//
	// @param {CKEDITOR.plugins.widget} widget
	function setDimensions( widget ) {
		var dimensions = CKEDITOR.tools.extend( {}, widget.data, false, { width:1,height:1 } ),
			image = widget.parts.image;

		for ( var d in dimensions ) {
			if ( dimensions[ d ] )
				image.setAttribute( d, dimensions[ d ] );
			else
				image.removeAttribute( d );
		}
	}

	// Defines all features related to drag-driven image
	// resizing.
	function setupResizer( widget ) {
		var doc = widget.editor.document,
			resizer = CKEDITOR.dom.element.createFromHtml( templateResizer ),
			dir = 1;

		if ( !widget.inline ) {
			var resizeWrapper = CKEDITOR.dom.element.createFromHtml( templateResizerWrapper );
			widget.parts.image.appendTo( resizeWrapper );
			resizer.appendTo( resizeWrapper );
			resizeWrapper.appendTo( widget.element, true );
		} else
			resizer.appendTo( widget.wrapper );

		// Calculate values of size variables and mouse
		// offsets. Start observing mousemove.
		resizer.on( 'mousedown', function( evt ) {
			var pageOffset = evt.data.getPageOffset(),
				image = widget.parts.image,

				// The x-coordinate of the mouse when button gets pressed.
				startX = pageOffset.x,

				// The initial dimensions and aspect ratio of the image.
				startWidth = image.$.clientWidth,
				startHeight = image.$.clientHeight,
				ratio = startWidth / startHeight,

				moveOffset, newWidth, newHeight, updateData,

				// Mousemove listener is removed on mouseup.
				moveListener = doc.on( 'mousemove', onMouseMove );

			function onMouseMove( evt ) {
				moveOffset = evt.data.getPageOffset();

				// Dir can be either 1 or -1. For right-aligned images, we need to
				// subtract the difference to get proper width. Without it,
				// resizer starts working the opposite way.
				newWidth = startWidth + dir * ( moveOffset.x - startX );

				newHeight = 0 | newWidth / ratio;

				// Don't update attributes if negative.
				if ( newWidth >= 0 && newHeight >= 0 ) {
					image.setAttributes( { width: newWidth, height: newHeight } );
					updateData = true;
				} else
					updateData = false;
			}

			function onMouseUp( evt ) {
				moveListener.removeListener();
				updateData && widget.setData( { width: newWidth, height: newHeight } );
			}

			// If editor is framed, stop resizing if the pointer goes out of
			// an iframe and the mouse button gets released.
			if ( !doc.equals( CKEDITOR.document ) )
				CKEDITOR.document.once( 'mouseup', onMouseUp );

			// Clean up the mousemove listener. Update widget
			// data if valid.
			doc.once( 'mouseup', onMouseUp );
		} );

		// Change the position of the widget resizer when data changes.
		// It's not only for UI but also for the algorithm because it must be
		// slightly different according to alignment.
		widget.on( 'data', function() {
			if ( widget.data.align == 'right' ) {
				resizer.removeClass( 'cke_resizer_right' );
				resizer.addClass( 'cke_resizer_left' );
				dir = -1;
			} else {
				resizer.removeClass( 'cke_resizer_left' );
				resizer.addClass( 'cke_resizer_right' );
				dir = 1;
			}
		} );
	}
})();