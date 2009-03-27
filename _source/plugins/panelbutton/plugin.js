/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'panelbutton', {
	requires: [ 'button' ],
	beforeInit: function( editor ) {
		editor.ui.addHandler( CKEDITOR.UI_PANELBUTTON, CKEDITOR.ui.panelButton.handler );
	}
});

/**
 * Button UI element.
 * @constant
 * @example
 */
CKEDITOR.UI_PANELBUTTON = 4;

CKEDITOR.ui.panelButton = CKEDITOR.tools.createClass({
	$: function( definition ) {
		// Copy all definition properties to this object.
		CKEDITOR.tools.extend( this, definition,
		// Set defaults.
		{
			title: definition.label,
			modes: { wysiwyg:1 }
		});

		// We don't want the panel definition in this object.
		var panelDefinition = this.panel;
		delete this.panel;

		this.document = ( panelDefinition && panelDefinition.parent && panelDefinition.parent.getDocument() ) || CKEDITOR.document;
		this._ = {
			panelDefinition: panelDefinition
		};
	},

	statics: {
		handler: {
			create: function( definition ) {
				return new CKEDITOR.ui.panelButton( definition );
			}
		}
	},

	proto: {
		render: function( editor, output ) {
			var id = this._.id = 'cke_' + CKEDITOR.tools.getNextNumber();

			var instance = {
				id: id,
				focus: function() {
					var element = CKEDITOR.document.getById( id );
					element.focus();
				},
				execute: function() {
					this.button.click( editor );
				}
			};

			var clickFn = CKEDITOR.tools.addFunction( function( $element ) {
				var _ = this._;

				if ( _.state == CKEDITOR.TRISTATE_DISABLED )
					return;

				this.createPanel( editor );

				if ( _.on ) {
					_.panel.hide();
					return;
				}

				_.panel.showBlock( this._.id, new CKEDITOR.dom.element( $element ), 4 );
			}, this );
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
			});

			var label = this.label || '';

			var classes = 'cke_off';

			if ( this.className )
				classes += ' ' + this.className;

			editor.on( 'mode', function() {
				this.setState( this.modes[ editor.mode ] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED );
			}, this );

			output.push( '<span class="cke_button">', '<a id="', id, '"' +
				' class="', classes, '" href="javascript:void(\'', ( this.title || '' ).replace( "'", '' ), '\')"' +
				' title="', this.title, '"' +
				' tabindex="-1"' +
				' hidefocus="true"' );

			// Some browsers don't cancel key events in the keydown but in the
			// keypress.
			// TODO: Check if really needed for Gecko+Mac.
			if ( CKEDITOR.env.opera || ( CKEDITOR.env.gecko && CKEDITOR.env.mac ) ) {
				output.push( ' onkeypress="return false;"' );
			}

			// With Firefox, we need to force the button to redraw, otherwise it
			// will remain in the focus state.
			if ( CKEDITOR.env.gecko ) {
				output.push( ' onblur="this.style.cssText = this.style.cssText;"' );
			}

			output.push( ' onkeydown="CKEDITOR.tools.callFunction( ', keyDownFn, ', event, this );"' +
				' onclick="CKEDITOR.tools.callFunction(', clickFn, ', this); return false;">' +
					'<span class="cke_icon"></span>' +
					'<span class="cke_label">', this.label, '</span>' +
					'<span class="cke_buttonarrow"></span>' +
				'</a>' +
				'</span>' );

			return instance;
		},

		createPanel: function( editor ) {
			var _ = this._;

			if ( _.panel )
				return;

			var panelDefinition = this._.panelDefinition || {},
				panelParentElement = panelDefinition.parent || CKEDITOR.document.getBody(),
				panel = this._.panel = new CKEDITOR.ui.floatPanel( editor, panelParentElement, panelDefinition ),
				me = this;

			panel.onShow = function() {
				if ( me.className )
					this.element.getFirst().addClass( me.className + '_panel' );

				me.setState( CKEDITOR.TRISTATE_ON );

				_.on = 1;

				if ( me.onOpen )
					me.onOpen();
			};

			panel.onHide = function() {
				if ( me.className )
					this.element.getFirst().removeClass( me.className + '_panel' );

				me.setState( CKEDITOR.TRISTATE_OFF );

				_.on = 0;

				if ( me.onClose )
					me.onClose();
			};

			panel.onEscape = function() {
				panel.hide();
				me.document.getById( _.id ).focus();
			};


			if ( this.onBlock )
				this.onBlock( panel, _.id );
		},

		setState: CKEDITOR.ui.button.prototype.setState
	}
});
