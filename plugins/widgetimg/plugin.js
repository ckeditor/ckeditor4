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
				// the alignment both visually and in widget data (will call setElementAlign).
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

				// Create shift stater for this widget.
				this.shiftState = CKEDITOR.plugins.widgetimg.stateShifter( this.editor );

				// Setup getOutput listener to downcast the widget.
				this.on( 'getOutput', function( evt ) {
					downcastWidgetElement( evt.data, this );
				} );
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

				// Atomic procedures, one per state variable.
				stateActions = {
					align: function( data, oldValue, newValue ) {
						var hasCaptionAfter = data.newState.hasCaption,
							element = data.element;

						// Clean the alignment first.
						setElementAlign( element, 'none' );

						// Alignment changed.
						if ( changed( data, 'align' ) ) {
							// Changed align to "center" (non-captioned).
							if ( newValue == 'center' && !hasCaptionAfter ) {
								data.destroy();
								data.element = wrapInCentering( element );
							}

							// Changed align to "non-center" from "center"
							// while caption has been removed.
							if ( !changed( data, 'hasCaption' ) && !hasCaptionAfter && oldValue == 'center' && newValue != 'center' ) {
								data.destroy();
								data.element = unwrapFromCentering( element );
							}
						}

						// Alignment remains.
						else {
							// Caption removed while align was "center".
							if ( newValue == 'center' && changed( data, 'hasCaption' ) && !hasCaptionAfter ) {
								data.destroy();
								data.element = wrapInCentering( element );
							}
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

							// Clean align on old <img>.
							setElementAlign( img, 'none' );

							// Preserve alignment from old <img>.
							setElementAlign( figure, oldState.align );

							// Insert new new <figure> before old element.
							insertElement( figure, element );

							// Remove old element from DOM.
							element.remove();

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

				// Insert centering wrapper before the element.
				insertElement( center, element );

				// Move element into centering wrapper so it's wrapped.
				element.move( center );

				return center;
			}

			function unwrapFromCentering( element ) {
				var img = element.findOne( 'img' );

				img.replace( element );

				return img;
			}

			function insertElement( element, oldElement ) {
				// Create a range that corresponds with old element's position.
				var range = editor.createRange();
				range.moveToPosition( oldElement, CKEDITOR.POSITION_BEFORE_START );

				// Insert element wrapper at range position.
				editor.editable().insertElementIntoRange( element, range );
			}

			function setElementAlign( element, align ) {
				if ( align in { center:1,none:1 } )
					element.removeStyle( 'float' );
				else
					element.setStyle( 'float', align );
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
			if ( align == 'center' ) {
				el = el.wrapWith( new CKEDITOR.htmlParser.element( el.name == 'img' ? 'p' : 'div', {
					'style': 'text-align:center'
				} ) );
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
})();