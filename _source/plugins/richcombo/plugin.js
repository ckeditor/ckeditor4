/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'richcombo', {
	requires: [ 'floatpanel', 'listblock' ],

	beforeInit: function( editor ) {
		editor.ui.addHandler( CKEDITOR.UI_RICHCOMBO, CKEDITOR.ui.richCombo.handler );
	}
});

/**
 * Button UI element.
 * @constant
 * @example
 */
CKEDITOR.UI_RICHCOMBO = 3;

CKEDITOR.ui.richCombo = CKEDITOR.tools.createClass({
	$: function( definition ) {
		// Copy all definition properties to this object.
		CKEDITOR.tools.extend( this, definition,
		// Set defaults.
		{
			title: definition.label
		});

		// We don't want the panel definition in this object.
		delete this.panel;

		this.id = CKEDITOR.tools.getNextNumber();

		this.document = ( definition.panel && definition.panel.parent && definition.panel.parent.getDocument() ) || CKEDITOR.document;

		this._ = {
			panelDefinition: definition.panel,
			items: {}
		};
	},

	statics: {
		handler: {
			create: function( definition ) {
				return new CKEDITOR.ui.richCombo( definition );
			}
		}
	},

	proto: {
		renderHtml: function( editor ) {
			var output = [];
			this.render( editor, output );
			return output.join( '' );
		},

		/**
		 * Renders the combo.
		 * @param {CKEDITOR.editor} editor The editor instance which this button is
		 *		to be used by.
		 * @param {Array} output The output array to which append the HTML relative
		 *		to this button.
		 * @example
		 */
		render: function( editor, output ) {
			var id = 'cke_' + this.id;

			var clickFn = CKEDITOR.tools.addFunction( function( $element ) {
				var _ = this._;

				this.createPanel();

				if ( _.on ) {
					_.panel.hide();
					return;
				}

				if ( !_.committed ) {
					_.list.commit();
					_.committed = 1;
				}

				var value = this.getValue();
				if ( value )
					_.list.mark( value );
				else
					_.list.unmarkAll();

				_.panel.showBlock( this.id, new CKEDITOR.dom.element( $element ).getFirst(), 4 );
			}, this );

			output.push( '<span id=', id, ' class="cke_rcombo' );

			if ( this.className )
				output.push( ' ', this.className );

			output.push( '">' +
				'<span class=cke_label>', this.label, '</span>' +
				'<a hidefocus=true title="', this.title, '" href="javascript:void(\'', this.label, '\')"' );

			// Some browsers don't cancel key events in the keydown but in the
			// keypress.
			// TODO: Check if really needed for Gecko+Mac.
			if ( CKEDITOR.env.opera || ( CKEDITOR.env.gecko && CKEDITOR.env.mac ) ) {
				output.push( ' onkeypress="return false;"' );
			}

			// With Firefox, we need to force it to redraw, otherwise it
			// will remain in the focus state.
			if ( CKEDITOR.env.gecko ) {
				output.push( ' onblur="this.style.cssText = this.style.cssText;"' );
			}

			output.push(
			//					' onkeydown="return CKEDITOR.ui.button._.keydown(', id, ', event);"' +
			' onmousedown="CKEDITOR.tools.callFunction(', clickFn, ', this);">' +
				'<span id="', id, '_text" class=cke_text>&nbsp;</span>' +
				'<span class=cke_openbutton></span>' +
				'</a>' +
				'</span>' );

			if ( this.onRender )
				this.onRender();

			return {
				id: id,
				combo: this,
				focus: function() {
					var element = CKEDITOR.document.getById( id ).getChild( 1 );
					element.focus();
				},
				execute: clickFn
			};
		},

		createPanel: function() {
			if ( this._.panel )
				return;

			var panelDefinition = this._.panelDefinition || {},
				panelParentElement = panelDefinition.parent || CKEDITOR.document.getBody(),
				panel = new CKEDITOR.ui.floatPanel( panelParentElement, panelDefinition ),
				list = panel.addListBlock( this.id, this.multiSelect ),
				me = this;

			panel.onShow = function() {
				if ( me.className )
					this.element.addClass( me.className );

				me.document.getById( 'cke_' + me.id ).addClass( 'cke_on' );

				me._.on = 1;

				if ( me.onOpen )
					me.onOpen();
			};

			panel.onHide = function() {
				if ( me.className )
					this.element.removeClass( me.className );

				me.document.getById( 'cke_' + me.id ).removeClass( 'cke_on' );

				me._.on = 0;

				if ( me.onClose )
					me.onClose();
			};

			list.onClick = function( value, marked ) {
				// Move the focus to the main windows, otherwise it will stay
				// into the floating panel, even if invisible, and Safari and
				// Opera will go a bit crazy.
				me.document.getWindow().focus();

				if ( me.onClick )
					me.onClick.call( me, value, marked );

				if ( marked )
					me.setValue( value, me._.items[ value ] );
				else
					me.setValue( '' );

				panel.hide();
			};

			this._.panel = panel;
			this._.list = list;

			if ( this.init )
				this.init();
		},

		setValue: function( value, text ) {
			this._.value = value;

			var textElement = this.document.getById( 'cke_' + this.id + '_text' );
			textElement.setHtml( typeof text != 'undefined' ? text : value );
		},

		getValue: function() {
			return this._.value || '';
		},

		add: function( value, html, text ) {
			this._.items[ value ] = text || value;
			this._.list.add( value, html );
		},

		startGroup: function( title ) {
			this._.list.startGroup( title );
		}
	}
});

CKEDITOR.ui.prototype.addRichCombo = function( name, definition ) {
	this.add( name, CKEDITOR.UI_RICHCOMBO, definition );
};
