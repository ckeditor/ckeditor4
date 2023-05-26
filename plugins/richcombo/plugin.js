/**
 * @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.plugins.add( 'richcombo', {
	requires: 'floatpanel,listblock,button',

	beforeInit: function( editor ) {
		editor.ui.addHandler( CKEDITOR.UI_RICHCOMBO, CKEDITOR.ui.richCombo.handler );
	}
} );

( function() {
	var template = '<span id="{id}"' +
		' class="cke_combo cke_combo__{name} {cls}"' +
		' role="presentation">' +
			'<span id="{id}_label" class="cke_combo_label">{label}</span>' +
			'<a class="cke_combo_button" title="{title}" tabindex="-1"' +
			( CKEDITOR.env.gecko && !CKEDITOR.env.hc ? '' : ' href="javascript:void(\'{titleJs}\')"' ) +
			' hidefocus="true"' +
			' role="button"' +
			' aria-labelledby="{id}_label"' +
			' aria-haspopup="listbox"',
		specialClickHandler = '';

	// Some browsers don't cancel key events in the keydown but in the
	// keypress.
	// TODO: Check if really needed.
	if ( CKEDITOR.env.gecko && CKEDITOR.env.mac )
		template += ' onkeypress="return false;"';

	// With Firefox, we need to force the button to redraw, otherwise it
	// will remain in the focus state.
	if ( CKEDITOR.env.gecko )
		template += ' onblur="this.style.cssText = this.style.cssText;"';

	// In IE/Edge right click opens rich combo (#2845).
	if ( CKEDITOR.env.ie ) {
		specialClickHandler = 'return false;" onmouseup="CKEDITOR.tools.getMouseButton(event)==CKEDITOR.MOUSE_BUTTON_LEFT&&';
	}

	template +=
		' onkeydown="return CKEDITOR.tools.callFunction({keydownFn},event,this);"' +
		' onfocus="return CKEDITOR.tools.callFunction({focusFn},event);"' +
		' onclick="' + specialClickHandler + 'CKEDITOR.tools.callFunction({clickFn},this);return false;">' +
			'<span id="{id}_text" class="cke_combo_text cke_combo_inlinelabel">{label}</span>' +
			'<span class="cke_combo_open">' +
				'<span class="cke_combo_arrow">' +
				// BLACK DOWN-POINTING TRIANGLE
	( CKEDITOR.env.hc ? '&#9660;' : CKEDITOR.env.air ? '&nbsp;' : '' ) +
				'</span>' +
			'</span>' +
		'</a>' +
		'</span>';

	var rcomboTpl = CKEDITOR.addTemplate( 'combo', template );

	/**
	 * Button UI element.
	 *
	 * @readonly
	 * @property {String} [='richcombo']
	 * @member CKEDITOR
	 */
	CKEDITOR.UI_RICHCOMBO = 'richcombo';

	/**
	 * @class
	 * @todo
	 */
	CKEDITOR.ui.richCombo = CKEDITOR.tools.createClass( {
		$: function( definition ) {
			// Copy all definition properties to this object.
			CKEDITOR.tools.extend( this, definition,
			// Set defaults.
			{
				// The combo won't participate in toolbar grouping.
				canGroup: false,
				title: definition.label,
				modes: { wysiwyg: 1 },
				editorFocus: 1
			} );

			// We don't want the panel definition in this object.
			var panelDefinition = this.panel || {};
			delete this.panel;

			this.id = CKEDITOR.tools.getNextNumber();

			this.document = ( panelDefinition.parent && panelDefinition.parent.getDocument() ) || CKEDITOR.document;

			panelDefinition.className = 'cke_combopanel';
			panelDefinition.block = {
				multiSelect: panelDefinition.multiSelect,
				attributes: panelDefinition.attributes
			};
			panelDefinition.toolbarRelated = true;

			this._ = {
				panelDefinition: panelDefinition,
				items: {},
				listeners: []
			};
		},

		proto: {
			renderHtml: function( editor ) {
				var output = [];
				this.render( editor, output );
				return output.join( '' );
			},

			/**
			 * Renders the rich combo.
			 *
			 * @param {CKEDITOR.editor} editor The editor instance which this button is
			 * to be used by.
			 * @param {Array} output The output array that the HTML relative
			 * to this button will be appended to.
			 */
			render: function( editor, output ) {
				var env = CKEDITOR.env,
					instance,
					selLocked;

				var id = 'cke_' + this.id;
				var clickFn = CKEDITOR.tools.addFunction( function( el ) {
					// Restore locked selection in Opera.
					if ( selLocked ) {
						editor.unlockSelection( 1 );
						selLocked = 0;
					}
					instance.execute( el );
				}, this );

				var combo = this;

				instance = {
					id: id,
					combo: this,
					focus: function() {
						var element = CKEDITOR.document.getById( id ).getChild( 1 );
						element.focus();
					},
					execute: function( el ) {
						var _ = combo._;

						if ( _.state == CKEDITOR.TRISTATE_DISABLED )
							return;

						combo.createPanel( editor );

						if ( _.on ) {
							_.panel.hide();
							return;
						}

						combo.commit();
						var value = combo.getValue();
						if ( value )
							_.list.mark( value );
						else
							_.list.unmarkAll();

						_.panel.showBlock( combo.id, new CKEDITOR.dom.element( el ), 4 );
					},
					clickFn: clickFn
				};

				function updateState() {
					// Don't change state while richcombo is active (https://dev.ckeditor.com/ticket/11793).
					if ( this.getState() == CKEDITOR.TRISTATE_ON )
						return;

					var state = this.modes[ editor.mode ] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED;

					if ( editor.readOnly && !this.readOnly )
						state = CKEDITOR.TRISTATE_DISABLED;

					this.setState( state );
					this.setValue( '' );

					// Let plugin to disable button.
					if ( state != CKEDITOR.TRISTATE_DISABLED && this.refresh )
						this.refresh();
				}

				// Update status when activeFilter, mode, selection or readOnly changes.
				this._.listeners.push( editor.on( 'activeFilterChange', updateState, this ) );
				this._.listeners.push( editor.on( 'mode', updateState, this ) );
				this._.listeners.push( editor.on( 'selectionChange', updateState, this ) );
				// If this combo is sensitive to readOnly state, update it accordingly.
				!this.readOnly && this._.listeners.push( editor.on( 'readOnly', updateState, this ) );

				var keyDownFn = CKEDITOR.tools.addFunction( function( ev, element ) {
					ev = new CKEDITOR.dom.event( ev );

					var keystroke = ev.getKeystroke();

					switch ( keystroke ) {
						case 13: // ENTER
						case 32: // SPACE
						case 40: // ARROW-DOWN
							// Show panel
							CKEDITOR.tools.callFunction( clickFn, element );
							break;
						default:
							// Delegate the default behavior to toolbar button key handling.
							instance.onkey( instance, keystroke );
					}

					// Avoid subsequent focus grab on editor document.
					ev.preventDefault();
				} );

				var focusFn = CKEDITOR.tools.addFunction( function() {
					instance.onfocus && instance.onfocus();
				} );

				selLocked = 0;

				// For clean up
				instance.keyDownFn = keyDownFn;

				var params = {
					id: id,
					name: this.name || this.command,
					label: this.label,
					title: this.title,
					cls: this.className || '',
					titleJs: env.gecko && !env.hc ? '' : ( this.title || '' ).replace( "'", '' ),
					keydownFn: keyDownFn,
					focusFn: focusFn,
					clickFn: clickFn
				};

				rcomboTpl.output( params, output );

				if ( this.onRender )
					this.onRender();

				return instance;
			},

			createPanel: function( editor ) {
				if ( this._.panel )
					return;

				var panelDefinition = this._.panelDefinition,
					panelBlockDefinition = this._.panelDefinition.block,
					panelParentElement = panelDefinition.parent || CKEDITOR.document.getBody(),
					namedPanelCls = 'cke_combopanel__' + this.name,
					panel = new CKEDITOR.ui.floatPanel( editor, panelParentElement, panelDefinition ),
					list = panel.addListBlock( this.id, panelBlockDefinition ),
					me = this;

				panel.onShow = function() {
					this.element.addClass( namedPanelCls );

					me.setState( CKEDITOR.TRISTATE_ON );

					me._.on = 1;

					me.editorFocus && !editor.focusManager.hasFocus && editor.focus();

					if ( me.onOpen )
						me.onOpen();
				};

				panel.onHide = function( preventOnClose ) {
					this.element.removeClass( namedPanelCls );

					me.setState( me.modes && me.modes[ editor.mode ] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED );

					me._.on = 0;

					if ( !preventOnClose && me.onClose )
						me.onClose();
				};

				panel.onEscape = function() {
					// Hide drop-down with focus returned.
					panel.hide( 1 );
				};

				list.onClick = function( value, marked ) {

					if ( me.onClick )
						me.onClick.call( me, value, marked );

					panel.hide();
				};

				this._.panel = panel;
				this._.list = list;

				panel.getBlock( this.id ).onHide = function() {
					me._.on = 0;
					me.setState( CKEDITOR.TRISTATE_OFF );
				};

				if ( this.init )
					this.init();
			},

			setValue: function( value, text ) {
				this._.value = value;

				var textElement = this.document.getById( 'cke_' + this.id + '_text' );
				if ( textElement ) {
					if ( !( value || text ) ) {
						text = this.label;
						textElement.addClass( 'cke_combo_inlinelabel' );
					} else {
						textElement.removeClass( 'cke_combo_inlinelabel' );
					}

					textElement.setText( typeof text != 'undefined' ? text : value );
				}

				var newLabel = createLabel( typeof text != 'undefined' ? text : value, this.label ),
					labelElement = this.document.getById( 'cke_' + this.id + '_label' );

				if ( labelElement ) {
					labelElement.setText( newLabel );
				}

				function createLabel( newLabel, initialLabel ) {
					if ( newLabel === initialLabel ) {
						return newLabel;
					}

					return newLabel + ', ' + initialLabel;
				}
			},

			getValue: function() {
				return this._.value || '';
			},

			unmarkAll: function() {
				this._.list.unmarkAll();
			},

			mark: function( value ) {
				this._.list.mark( value );
			},

			hideItem: function( value ) {
				this._.list.hideItem( value );
			},

			hideGroup: function( groupTitle ) {
				this._.list.hideGroup( groupTitle );
			},

			showAll: function() {
				this._.list.showAll();
			},

			/**
			 * Adds an entry displayed inside the rich combo panel.
			 *
			 * @param {String} value
			 * @param {String} html
			 * @param {String} text
			 * @param {String} language
			 */
			add: function( value, html, text, language ) {
				this._.items[ value ] = text || value;
				this._.list.add( value, html, text, language );
			},

			startGroup: function( title ) {
				this._.list.startGroup( title );
			},

			commit: function() {
				if ( !this._.committed ) {
					this._.list.commit();
					this._.committed = 1;
					CKEDITOR.ui.fire( 'ready', this );
				}
				this._.committed = 1;
			},

			setState: function( state ) {
				if ( this._.state == state )
					return;

				var el = this.document.getById( 'cke_' + this.id ),
					linkEl = el.getElementsByTag( 'a' ).getItem( 0 );

				el.setState( state, 'cke_combo' );

				state == CKEDITOR.TRISTATE_DISABLED ?
					el.setAttribute( 'aria-disabled', true ) :
					el.removeAttribute( 'aria-disabled' );

				if ( linkEl ) {
					linkEl.setAttribute( 'aria-expanded', state == CKEDITOR.TRISTATE_ON );
				}

				this._.state = state;
			},

			getState: function() {
				return this._.state;
			},

			enable: function() {
				if ( this._.state == CKEDITOR.TRISTATE_DISABLED )
					this.setState( this._.lastState );
			},

			disable: function() {
				if ( this._.state != CKEDITOR.TRISTATE_DISABLED ) {
					this._.lastState = this._.state;
					this.setState( CKEDITOR.TRISTATE_DISABLED );
				}
			},

			/**
			 * Removes all listeners from a rich combo element.
			 *
			 * @since 4.11.0
			 */
			destroy: function() {
				CKEDITOR.tools.array.forEach( this._.listeners, function( listener ) {
					listener.removeListener();
				} );
				this._.listeners = [];
			},

			/**
			 * Selects a rich combo item based on the first matching result from the given filter function.
			 * The filter function takes an object as an argument with `value` and `text` fields. The values of these
			 * fields match to arguments passed in the {@link #add} method.
			 * In order to obtain a correct result with this method, it is required to open or initialize the rich combo panel.
			 *
			 * ```js
			 * 	var richCombo = editor.ui.get( 'Font' );
			 *
			 * 	// Required when 'richcombo' was never open in a given editor instance.
			 * 	richCombo.createPanel( editor );
			 *
			 * 	richCombo.select( function( item ) {
			 * 		return item.value === 'Tahoma' || item.text === 'Tahoma';
			 * 	} );
			 * ```
			 *
			 * @since 4.14.0
			 * @param {Function} callback The function should return `true` if a matching element is found.
			 * @param {Object} callback.item An object containing the `value` and `text` fields which are compared by this callback.
			 */
			select: function( callback ) {
				if ( CKEDITOR.tools.isEmpty( this._.items ) ) {
					return;
				}

				for ( var value in this._.items ) {
					if ( callback( {
						value: value,
						text: this._.items[ value ]
					} ) ) {
						this.setValue( value );
						return;
					}
				}
			}
		},

		/**
		 * Represents a rich combo handler object.
		 *
		 * @class CKEDITOR.ui.richCombo.handler
		 * @singleton
		 * @extends CKEDITOR.ui.handlerDefinition
		 */
		statics: {
			handler: {
				/**
				 * Transforms a rich combo definition into a {@link CKEDITOR.ui.richCombo} instance.
				 *
				 * @param {Object} definition
				 * @returns {CKEDITOR.ui.richCombo}
				 */
				create: function( definition ) {
					return new CKEDITOR.ui.richCombo( definition );
				}
			}
		}
	} );

	/**
	 * @param {String} name
	 * @param {Object} definition
	 * @member CKEDITOR.ui
	 * @todo
	 */
	CKEDITOR.ui.prototype.addRichCombo = function( name, definition ) {
		this.add( name, CKEDITOR.UI_RICHCOMBO, definition );
	};

} )();
