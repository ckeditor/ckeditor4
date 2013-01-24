/**
 * @license Copyright (c) 2003-2012, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */


(function() {
	'use strict';

	var panelTpl = '<div class="cke_reset_all cke_props_panel" tabindex="-1"></div>',
		titleTpl = '<div class="cke_props_panel_title">&nbsp;</div>',
		innerTpl = '<div class="cke_props_panel_inner">&nbsp;</div>';

	CKEDITOR.plugins.add( 'propspanel', {
		requires: 'floatpanel'
	});

	CKEDITOR.ui.propsPanel = CKEDITOR.tools.createClass({
		$: function( editor ) {
			var doc = CKEDITOR.document;

			this._ = {
				editor: editor,
				editable: editor.editable(),
				panelParent: doc.getBody(),
				win: doc.getWindow()
			};
		},

		proto: {
			destroy: function() {
				this._.panel && this._.panel.remove();
			},

			hide: function() {
				if ( this._.isHidden )
					return;

				this._.panel.hide();

				if ( this.checkDirtyTimeout )
					clearTimeout( this.checkDirtyTimeout );

				this._.isHidden = true;

				this.fire( 'hide' );
			},

			show: function( element, html, title, initialData ) {
				var panel = this._.panel,
					editor = this._.editor,
					me = this;

				// Update current reference element of a widget.
				this._.element = element;

				if ( !panel ) {
					panel = this._.panel = new CKEDITOR.dom.element.createFromHtml( panelTpl );
					panel.append( this._.title = CKEDITOR.dom.element.createFromHtml( titleTpl ) );
					panel.append( this._.panelInner = new CKEDITOR.dom.element.createFromHtml( innerTpl ) );
					panel.appendTo( this._.panelParent );
					panel.hide();

					panel.disableContextMenu();

					// TODO: The following stuff is definitely todo.
					editor.on( 'selectionChange', this.hide, this );
					editor.on( 'blur', this.hide, this );
					editor.on( 'destroy', function() {
						me.destroy();
					});
					editor.focusManager.add( panel );

					this._.win.on( 'resize', function() {
						this.setPosition( this._.element );
					}, this );
				}

				this._.title.setText( title || 'Properties' );
				this.setFormHtml( html );
				this.setData( initialData );
				this.checkDirty( true );

				// Order matters. Panel must be visible for positioning.
				// Otherwise we cannot compute position, width, etc.
				panel.show();
				this.setPosition( element );

				this._.isHidden = false;
				this.fire( 'show' );
			},

			setPosition: (function() {
				var sizePrefixes = [ 'top', 'left', 'right', 'bottom' ];

				function getStyle( element, name ) {
					return parseInt( element.getComputedStyle( name ), 10 );
				}

				function getStyles( element, name ) {
					var style = {};
					for ( var i = sizePrefixes.length; i--; )
						style[ sizePrefixes[ i ] ] = parseInt( element.getComputedStyle( name + '-' + sizePrefixes[ i ] ), 10 ) || 0;

					return style;
				}

				function getHStyle( element, name ) {
					var style = getStyles( element, name );
					return style.left + style.right;
				}

				return function() {
					var element = this._.element,
						panel = this._.panel,
						win = this._.win,

						// Styles to be set.
						styles = {},

				 		elementPosition = element.getDocumentPosition(),
				 		editablePosition = this._.editable.getDocumentPosition(),
				 		editableWidth = getStyle( this._.editable, 'width' ),
				 		editableHPadding = getHStyle( this._.editable, 'padding' ),
				 		editableHBorder = getHStyle( this._.editable, 'border' ),
				 		editableHTotal = editableWidth + editableHPadding + editableHBorder,

						panelHeight = getStyle( panel, 'height' ),
						panelWidth = getStyle( panel, 'width' ),
						panelHBorder = getHStyle( panel, 'border' ),
						winView = win.getViewPaneSize(),
						winScroll = win.getScrollPosition(),

						// Final panel position.
						panelLeft = editablePosition.x + editableHTotal,
						panelTop = elementPosition.y;


					// V-flip the panel if necessary. Additionally, when the panel has
					// been vflipped due to limited space below the initial origin,
					// make sure the arrow is in the bottom (add class).
					if ( panelTop + panelHeight > winView.height + winScroll.y ) {
						panelTop -= panelHeight;
						panel.addClass( 'cke_props_panel_vflip' );
					}
					else
						panel.removeClass( 'cke_props_panel_vflip' );

					styles = { left: panelLeft + 'px', top: panelTop + 'px' };

					// When the panel hovers over editable, make sure that
					// its right edge is touching the viewport's edge to save space.
					if ( panelLeft + panelWidth + panelHBorder > winView.width + winScroll.x ) {
						styles.left = 'auto';
						styles.right = '0px';
					}

					panel.setStyles( styles );
				};
			})(),

			setFormHtml: function( html ) {
				this._.panelInner.setHtml( '<form name="cke_propspanel_form" onsubmit="return false">' + html + '</form>' );
				this._.form = this._.panelInner.getFirst();
				this._.inputs = findInputs( this._.form );

				// TODO/DIRTY
				// Iterate to add all the inputs to the focus manager.
				for ( var i in this._.inputs ) {
					var input = this._.inputs[ i ];

					// Text input.
					if ( input.is )
						this._.editor.focusManager.add( input );

					// Radio/checkbox group.
					else {
						// Decide over which group of elements to iterate.
						var group = input.radios || input.boxes;

						for ( var j in group )
							this._.editor.focusManager.add( group[ j ] );
					}
				}
			},

			setData: function( data ) {
				this._.data = data;

				for ( var name in data ) {
					this.setInputValue( name, data[ name ] );
				}
			},

			setInputValue: function( name, value ) {
				this._.inputs[ name ].setValue( value );
			},

			checkDirty: function( loop ) {
				var that = this,
					changed = {},
					changedCount = 0;

				for ( var name in this._.inputs ) {
					var newValue;

					if ( this._.inputs[ name ].getAttribute && this._.inputs[ name ].getAttribute( 'type' ) == 'checkbox' )
						newValue = this._.inputs[ name ].$.checked;
					else
						newValue = this._.inputs[ name ].getValue();

					if ( newValue != this._.data[ name ] ) {
						this._.data[ name ] = changed[ name ] = newValue;
						changedCount++;
					}
				}

				if ( changedCount ) {
					this.fire( 'change', changed );
				}

				if ( loop ) {
					that.checkDirtyTimeout = setTimeout( function() {
						that.checkDirty( true );
					}, 100 );
				}
			}
		}
	});

	CKEDITOR.event.implementOn( CKEDITOR.ui.propsPanel.prototype );

	function findInputs( form ) {
		var inputs = {},
			elements = form.$.elements,
			element,
			name;

		for ( var i = 0; i < elements.length; ++i ) {
			element = new CKEDITOR.dom.element( elements[ i ] );
			name = element.getAttribute( 'name' );

			switch ( element.getAttribute( 'type' ) ) {
				case 'text':
					inputs[ name ] = element;
					break;
				case 'radio':
					if ( inputs[ name ] )
						inputs[ name ].addElement( element );
					else
						inputs[ name ] = inputRadio( element );
					break;
				case 'checkbox':
					inputs[ name ] = inputCheckbox( element );
					break;
			}
		}

		return inputs;
	}

	function inputRadio( element ) {
		var that = {
			radios: {},
			addElement: function( element ) {
				// Prepend name with 'i' to handle empty values ('').
				this.radios[ 'i' + element.getAttribute( 'value' ) ] = element;
			},

			getValue: function() {
				for ( var value in this.radios ) {
					if ( this.radios[ value ].$.checked )
						return value.slice( 1 ); // Remove 'i' from value.
				}
				return null;
			},

			setValue: function( value ) {
				this.radios[ 'i' + value ].$.checked = true;
			}
		};

		that.addElement( element );

		return that;
	}

	function inputCheckbox( element ) {
		var that = {
			boxes: {},
			addElement: function( element ) {
				// Prepend name with 'i' to handle empty values ('').
				this.boxes[ 'i' + element.getAttribute( 'value' ) ] = element;
			},

			getValue: function() {
				return element.$.checked;
			},

			setValue: function( value ) {
				element.$.checked = value;
			}
		};

		that.addElement( element );

		return that;
	}
})();