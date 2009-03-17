/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

CKEDITOR.plugins.add( 'button', {
	beforeInit: function( editor ) {
		editor.ui.addHandler( CKEDITOR.UI_BUTTON, CKEDITOR.ui.button.handler );
	}
});

/**
 * Button UI element.
 * @constant
 * @example
 */
CKEDITOR.UI_BUTTON = 1;

/**
 * Represents a button UI element. This class should not be called directly. To
 * create new buttons use {@link CKEDITOR.ui.prototype.addButton} instead.
 * @constructor
 * @param {Object} definition The button definition.
 * @example
 */
CKEDITOR.ui.button = function( definition ) {
	/**
	 * The button label.
	 * @name CKEDITOR.ui.button.prototype.label
	 * @type String
	 * @example
	 */
	this.label = definition.label;

	/**
	 * The button advisory title. It is usually displayed as the button tooltip.
	 * If not defined, the label is used.
	 * @name CKEDITOR.ui.button.prototype.title
	 * @type String
	 * @example
	 */
	this.title = definition.title || definition.label;

	/**
	 * The command name associated to the button. If no command is defined, the
	 * "click" event is used.
	 * @name CKEDITOR.ui.button.prototype.command
	 * @type String
	 * @example
	 */
	this.command = definition.command;

	this.className = definition.className || ( definition.command && 'cke_button_' + definition.command ) || '';

	this.icon = definition.icon;
	this.iconOffset = definition.iconOffset;

	/**
	 * The function to be called when the user clicks the button. If not
	 * defined, the "command" property is required, and the command gets
	 * executed on click.
	 * @function
	 * @name CKEDITOR.ui.button.prototype.click
	 * @example
	 */
	this.click = definition.click ||
	function( editor ) {
		editor.execCommand( definition.command );
	};

	this._ = {};
};

/**
 * Transforms a button definition in a {@link CKEDITOR.ui.button} instance.
 * @type Object
 * @example
 */
CKEDITOR.ui.button.handler = {
	create: function( definition ) {
		return new CKEDITOR.ui.button( definition );
	}
};

CKEDITOR.ui.button.prototype = {
	/**
	 * Renders the button.
	 * @param {CKEDITOR.editor} editor The editor instance which this button is
	 *		to be used by.
	 * @param {Array} output The output array to which append the HTML relative
	 *		to this button.
	 * @example
	 */
	render: function( editor, output ) {
		var env = CKEDITOR.env;

		var id = this._.id = 'cke_' + CKEDITOR.tools.getNextNumber();

		var instance = {
			id: id,
			button: this,
			editor: editor,
			focus: function() {
				var element = CKEDITOR.document.getById( id );
				element.focus();
			},
			execute: function() {
				this.button.click( editor );
			}
		};

		var index = CKEDITOR.ui.button._.instances.push( instance ) - 1;

		var classes = '';

		// Get the command name.
		var command = this.command;

		if ( command ) {
			// Get the command instance.
			command = editor.getCommand( command );

			if ( command ) {
				command.on( 'state', function() {
					this.setState( command.state );
				}, this );

				classes += ' cke_' + ( command.state == CKEDITOR.TRISTATE_ON ? 'on' : command.state == CKEDITOR.TRISTATE_DISABLED ? 'disabled' : 'off' );
			}
		}

		if ( this.className )
			classes += ' ' + this.className;

		output.push( '<span class="cke_button">', '<a id="', id, '"' +
			' class="', classes, '" href="javascript:void(\'', ( this.title || '' ).replace( "'", '' ), '\')"' +
			' title="', this.title, '"' +
			' tabindex="-1"' +
			' hidefocus="true"' );

		// Some browsers don't cancel key events in the keydown but in the
		// keypress.
		// TODO: Check if really needed for Gecko+Mac.
		if ( env.opera || ( env.gecko && env.mac ) ) {
			output.push( ' onkeypress="return false;"' );
		}

		// With Firefox, we need to force the button to redraw, otherwise it
		// will remain in the focus state.
		if ( env.gecko ) {
			output.push( ' onblur="this.style.cssText = this.style.cssText;"' );
		}

		output.push( ' onkeydown="return CKEDITOR.ui.button._.keydown(', index, ', event);"' +
			' onfocus="return CKEDITOR.ui.button._.focus(', index, ', event);"' +
			' onclick="return CKEDITOR.ui.button._.click(', index, ', event);">' +
				'<span class="cke_icon"' );

		if ( this.icon ) {
			var offset = ( this.iconOffset || 0 ) * -16;
			output.push( ' style="background-image:url(', CKEDITOR.getUrl( this.icon ), ');background-position:0 ' + offset + 'px;"' );
		}

		output.push( '></span>' +
			'<span class="cke_label">', this.label, '</span>' +
			'</a>', '</span>' );

		return instance;
	},

	setState: function( state ) {
		var element = CKEDITOR.document.getById( this._.id );

		if ( this._.currentState == state )
			return;

		switch ( state ) {
			case CKEDITOR.TRISTATE_ON:
				element.addClass( 'cke_on' );
				element.removeClass( 'cke_off' );
				element.removeClass( 'cke_disabled' );
				break;
			case CKEDITOR.TRISTATE_DISABLED:
				element.addClass( 'cke_disabled' );
				element.removeClass( 'cke_off' );
				element.removeClass( 'cke_on' );
				break;
			default:
				element.addClass( 'cke_off' );
				element.removeClass( 'cke_on' );
				element.removeClass( 'cke_disabled' );
				break;
		}

		this._.currentState = state;
	}
};

/**
 * Handles a button click.
 * @private
 */
CKEDITOR.ui.button._ = {
	instances: [],

	click: function( index ) {
		CKEDITOR.ui.button._.instances[ index ].execute();
		return false;
	},

	keydown: function( index, ev ) {
		var instance = CKEDITOR.ui.button._.instances[ index ];

		if ( instance.onkey ) {
			ev = new CKEDITOR.dom.event( ev );
			return ( instance.onkey( instance, ev.getKeystroke() ) !== false );
		}
	},

	focus: function( index, ev ) {
		var instance = CKEDITOR.ui.button._.instances[ index ];

		if ( instance.onfocus )
			return ( instance.onfocus( instance, new CKEDITOR.dom.event( ev ) ) !== false );
	}
};

/**
 * Adds a button definition to the UI elements list.
 * @param {String} The button name.
 * @param {Object} The button definition.
 * @example
 * editorInstance.ui.addButton( 'MyBold',
 *     {
 *         label : 'My Bold',
 *         command : 'bold'
 *     });
 */
CKEDITOR.ui.prototype.addButton = function( name, definition ) {
	this.add( name, CKEDITOR.UI_BUTTON, definition );
};
