/* exported ToolbarConfigurator */
/* global ToolbarConfigurator */

'use strict';

window.ToolbarConfigurator = {};

( function() {
	/**
	 * @class ToolbarConfigurator.FullToolbarEditor
	 * @constructor
	 */
	function FullToolbarEditor() {
		this.instanceid = 'fte' + CKEDITOR.tools.getNextId();
		this.textarea = new CKEDITOR.dom.element( 'textarea' );
		this.textarea.setAttributes( {
			id: this.instanceid,
			name: this.instanceid,
			contentEditable: true
		} );

		this.buttons = null;
		this.editorInstance = null;
	}

	// Expose the class.
	ToolbarConfigurator.FullToolbarEditor = FullToolbarEditor;

	/**
	 * @param {Function} callback
	 * @param {Object} cfg
	 */
	FullToolbarEditor.prototype.init = function( callback ) {
		var that = this;

		document.body.appendChild( this.textarea.$ );

		CKEDITOR.replace( this.instanceid );

		this.editorInstance = CKEDITOR.instances[ this.instanceid ];

		this.editorInstance.once( 'configLoaded', function( e ) {
			var cfg = e.editor.config;

			// We want all the buttons.
			delete cfg.removeButtons;
			delete cfg.toolbarGroups;
			delete cfg.toolbar;
			ToolbarConfigurator.AbstractToolbarModifier.extendPluginsConfig( cfg );

			e.editor.once( 'loaded', function() {
				that.buttons = FullToolbarEditor.toolbarToButtons( that.editorInstance.toolbar );

				that.buttonsByGroup = FullToolbarEditor.groupButtons( that.buttons );

				that.buttonNamesByGroup = that.groupButtonNamesByGroup( that.buttons );

				e.editor.container.hide();

				if ( typeof callback === 'function' )
					callback( that.buttons );
			} );
		} );
	};

	/**
	 * Group array of button names by their group parents.
	 *
	 * @param {Array} buttons
	 * @returns {Object}
	 */
	FullToolbarEditor.prototype.groupButtonNamesByGroup = function( buttons ) {
		var that = this,
			groups = FullToolbarEditor.groupButtons( buttons );

		for ( var groupName in groups ) {
			var currGroup = groups[ groupName ];

			groups[ groupName ] = FullToolbarEditor.map( currGroup, function( button ) {
				return that.getCamelCasedButtonName( button.name );
			} );
		}

		return groups;
	};

	/**
	 * Returns group literal.
	 *
	 * @param {String} name
	 * @returns {Object}
	 */
	FullToolbarEditor.prototype.getGroupByName = function( name ) {
		var groups = this.editorInstance.config.toolbarGroups || this.getFullToolbarGroupsConfig();

		var max = groups.length;
		for ( var i = 0; i < max; i += 1 ) {
			if ( groups[ i ].name === name )
				return groups[ i ];
		}

		return null;
	};

	/**
	 * @param {String} name
	 * @returns {String | null}
	 */
	FullToolbarEditor.prototype.getCamelCasedButtonName = function( name ) {
		var items = this.editorInstance.ui.items;

		for ( var key in items ) {
			if ( items[ key ].name == name )
				return key;
		}

		return null;
	};

	/**
	 * Returns full toolbarGroups config value which is used when
	 * there is no toolbarGroups field in config.
	 *
	 * @param {Boolean} [pickSeparators=false]
	 * @returns {Array}
	 */
	FullToolbarEditor.prototype.getFullToolbarGroupsConfig = function( pickSeparators ) {
		pickSeparators = ( pickSeparators === true ? true : false );

		var result = [],
			toolbarGroups = this.editorInstance.toolbar;

		var max = toolbarGroups.length;
		for ( var i = 0; i < max; i += 1 ) {
			var currentGroup = toolbarGroups[ i ],
				copiedGroup = {};

			if ( typeof currentGroup.name != 'string' ) {
				// this is not a group
				if ( pickSeparators ) {
					result.push( '/' );
				}
				continue;
			}

			copiedGroup.name = currentGroup.name;
			if ( currentGroup.groups )
				copiedGroup.groups = Array.prototype.slice.call( currentGroup.groups );

			result.push( copiedGroup );
		}

		return result;
	};

	/**
	 * Filters array items based on checker provided in second argument.
	 * Returns new array.
	 *
	 * @param {Array} arr
	 * @param {Function} checker
	 * @returns {Array}
	 */
	FullToolbarEditor.filter = function( arr, checker ) {
		var max = ( arr && arr.length ? arr.length : 0 ),
			result = [];

		for ( var i = 0; i < max; i += 1 ) {
			if ( checker( arr[ i ] ) )
				result.push( arr[ i ] );
		}

		return result;
	};

	/**
	 * Simplified http://underscorejs.org/#map functionality
	 *
	 * @param {Array | Object} enumerable
	 * @param {Function} modifier
	 * @returns {Array | Object}
	 */
	FullToolbarEditor.map = function( enumerable, modifier ) {
		var result;

		if ( CKEDITOR.tools.isArray( enumerable ) ) {
			result = [];

			var max = enumerable.length;
			for ( var i = 0; i < max; i += 1 )
				result.push( modifier( enumerable[ i ] ) );
		} else {
			result = {};

			for ( var key in enumerable )
				result[ key ] = modifier( enumerable[ key ] );
		}

		return result;
	};

	/**
	 * Group buttons by their parent names.
	 *
	 * @static
	 * @param {Array} buttons
	 * @returns {Object} The object (`name => group`) representing CKEDITOR.ui.button or CKEDITOR.ui.richCombo
	 */
	FullToolbarEditor.groupButtons = function( buttons ) {
		var groups = {};

		var max = buttons.length;
		for ( var i = 0; i < max; i += 1 ) {
			var currBtn = buttons[ i ],
				currBtnGroupName = !!currBtn.toolbar ? currBtn.toolbar.split( ',' )[ 0 ] : 'others';

			groups[ currBtnGroupName ] = groups[ currBtnGroupName ] || [];

			groups[ currBtnGroupName ].push( currBtn );
		}

		return groups;
	};

	/**
	 * Pick all buttons from toolbar.
	 *
	 * @static
	 * @param {Array} groups
	 * @returns {Array}
	 */
	FullToolbarEditor.toolbarToButtons = function( groups ) {
		var buttons = [];

		var max = groups.length;
		for ( var i = 0; i < max; i += 1 ) {
			var currentGroup = groups[ i ];

			if ( typeof currentGroup == 'object' )
				buttons = buttons.concat( FullToolbarEditor.groupToButtons( groups[ i ] ) );
		}

		return buttons;
	};

	/**
	 * Creates HTML button representation for view.
	 *
	 * @static
	 * @param {CKEDITOR.ui.button | CKEDITOR.ui.richCombo} button
	 * @returns {CKEDITOR.dom.element}
	 */
	FullToolbarEditor.createToolbarButton = function( button ) {
		var $button = new CKEDITOR.dom.element( 'a' ),
			icon = FullToolbarEditor.createIcon( button.name, button.icon, button.command );

		$button.setStyle( 'float', 'none' );

		$button.addClass( 'cke_' + ( CKEDITOR.lang.dir == 'rtl' ? 'rtl' : 'ltr' ) );

		if ( button instanceof CKEDITOR.ui.button ) {
			$button.addClass( 'cke_button' );
			$button.addClass( 'cke_toolgroup' );

			$button.append( icon );
		} else if ( CKEDITOR.ui.richCombo && button instanceof CKEDITOR.ui.richCombo ) {
			var comboLabel = new CKEDITOR.dom.element( 'span' ),
				comboOpen = new CKEDITOR.dom.element( 'span' ),
				comboArrow = new CKEDITOR.dom.element( 'span' );

			$button.addClass( 'cke_combo_button' );

			comboLabel.addClass( 'cke_combo_text' );
			comboLabel.addClass( 'cke_combo_inlinelabel' );
			comboLabel.setText( button.label );

			comboOpen.addClass( 'cke_combo_open' );
			comboArrow.addClass( 'cke_combo_arrow' );
			comboOpen.append( comboArrow );

			$button.append( comboLabel );
			$button.append( comboOpen );
		}

		return $button;
	};

	/**
	 * Create and return icon element.
	 *
	 * @param {String} name
	 * @param {String} icon
	 * @param {String} command
	 * @static
	 * @returns {CKEDITOR.dom.element}
	 */
	FullToolbarEditor.createIcon = function( name, icon, command ) {
		var iconStyle = CKEDITOR.skin.getIconStyle( name, ( CKEDITOR.lang.dir == 'rtl' ) );

		// We don't know exactly how to get icon style. Especially for extra plugins,
		// Which definition may vary.
		iconStyle = iconStyle || CKEDITOR.skin.getIconStyle( icon, ( CKEDITOR.lang.dir == 'rtl' ) );
		iconStyle = iconStyle || CKEDITOR.skin.getIconStyle( command, ( CKEDITOR.lang.dir == 'rtl' ) );

		var iconElement = new CKEDITOR.dom.element( 'span' );

		iconElement.addClass( 'cke_button_icon' );
		iconElement.addClass( 'cke_button__' + name + '_icon' );
		iconElement.setAttribute( 'style', iconStyle );
		iconElement.setStyle( 'float', 'none' );

		return iconElement;
	};

	/**
	 * Create and return button element
	 *
	 * @param {String} text
	 * @param {String} cssClasses
	 * @returns {CKEDITOR.dom.element}
	 */
	FullToolbarEditor.createButton = function( text, cssClasses ) {
		var $button = new CKEDITOR.dom.element( 'button' );

		$button.addClass( 'button-a' );

		$button.setAttribute( 'type', 'button' );

		if ( typeof cssClasses == 'string' ) {
			cssClasses = cssClasses.split( ' ' );

			var i = cssClasses.length;
			while ( i-- ) {
				$button.addClass( cssClasses[ i ] );
			}
		}

		$button.setHtml( text );

		return $button;
	};

	/**
	 * @static
	 * @param {Object} group
	 * @returns {Array} representing HTML buttons for view
	 */
	FullToolbarEditor.groupToButtons = function( group ) {
		var buttons = [],
			items = group.items;

		var max = items ? items.length : 0;
		for ( var i = 0; i < max; i += 1 ) {
			var item = items[ i ];

			if ( item instanceof CKEDITOR.ui.button || CKEDITOR.ui.richCombo && item instanceof CKEDITOR.ui.richCombo ) {
				item.$ = FullToolbarEditor.createToolbarButton( item );
				buttons.push( item );
			}
		}

		return buttons;
	};

} )();
