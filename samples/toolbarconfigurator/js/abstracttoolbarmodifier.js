/* global ToolbarConfigurator */

'use strict';

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
if ( typeof Object.create != 'function' ) {
	( function() {
		var F = function() {};
		Object.create = function( o ) {
			if ( arguments.length > 1 ) {
				throw Error( 'Second argument not supported' );
			}
			if ( o === null ) {
				throw Error( 'Cannot set a null [[Prototype]]' );
			}
			if ( typeof o != 'object' ) {
				throw TypeError( 'Argument must be an object' );
			}
			F.prototype = o;
			return new F();
		};
	} )();
}

// Copy of the divarea plugin (with some enhancements), so we always have some editable mode, regardless of the build's config.
CKEDITOR.plugins.add( 'toolbarconfiguratorarea', {
	// Use afterInit to override wysiwygarea's mode. May still fail to override divarea, but divarea is nice.
	afterInit: function( editor ) {
		editor.addMode( 'wysiwyg', function( callback ) {
			var editingBlock = CKEDITOR.dom.element.createFromHtml( '<div class="cke_wysiwyg_div cke_reset" hidefocus="true"></div>' );

			var contentSpace = editor.ui.space( 'contents' );
			contentSpace.append( editingBlock );

			editingBlock = editor.editable( editingBlock );

			editingBlock.detach = CKEDITOR.tools.override( editingBlock.detach,
				function( org ) {
					return function() {
						org.apply( this, arguments );
						this.remove();
					};
				} );

			editor.setData( editor.getData( 1 ), callback );
			editor.fire( 'contentDom' );
		} );

		// Additions to the divarea.

		// Speed up data processing.
		editor.dataProcessor.toHtml = function( html ) {
			return html;
		};
		editor.dataProcessor.toDataFormat = function( html ) {
			return html;
		};

		// End of the additions.
	}
} );

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if ( !Object.keys ) {
	Object.keys = ( function() {
		var hasOwnProperty = Object.prototype.hasOwnProperty,
			hasDontEnumBug = !( { toString: null } ).propertyIsEnumerable( 'toString' ),
			dontEnums = [
				'toString',
				'toLocaleString',
				'valueOf',
				'hasOwnProperty',
				'isPrototypeOf',
				'propertyIsEnumerable',
				'constructor'
			],
			dontEnumsLength = dontEnums.length;

		return function( obj ) {
			if ( typeof obj !== 'object' && ( typeof obj !== 'function' || obj === null ) )
				throw new TypeError( 'Object.keys called on non-object' );

			var result = [], prop, i;

			for ( prop in obj ) {
				if ( hasOwnProperty.call( obj, prop ) )
					result.push( prop );

			}

			if ( hasDontEnumBug ) {
				for ( i = 0; i < dontEnumsLength; i++ ) {
					if ( hasOwnProperty.call( obj, dontEnums[ i ] ) )
						result.push( dontEnums[ i ] );

				}
			}
			return result;
		};
	}() );
}

( function() {
	/**
	 * @class ToolbarConfigurator.AbstractToolbarModifier
	 * @param {String} editorId An id of modified editor
	 * @constructor
	 */
	function AbstractToolbarModifier( editorId, cfg ) {
		this.cfg = cfg || {};
		this.hidden = false;
		this.editorId = editorId;
		this.fullToolbarEditor = new ToolbarConfigurator.FullToolbarEditor();

		this.mainContainer = null;

		this.originalConfig = null;
		this.actualConfig = null;

		this.waitForReady = false;
		this.isEditableVisible = false;

		this.toolbarContainer = null;
		this.toolbarButtons = [];
	}

	// Expose the class.
	ToolbarConfigurator.AbstractToolbarModifier = AbstractToolbarModifier;

	/**
	 * @param {String} config
	 */
	AbstractToolbarModifier.prototype.setConfig = function( config ) {
		this._onInit( undefined, config, true );
	};

	/**
	 * @param {Function} [callback]
	 */
	AbstractToolbarModifier.prototype.init = function( callback ) {
		var that = this;

		this.mainContainer = new CKEDITOR.dom.element( 'div' );

		if ( this.fullToolbarEditor.editorInstance !== null ) {
			throw 'Only one instance of ToolbarModifier is allowed';
		}

		if ( !this.editorInstance ) {
			// Do not refresh yet, let's wait for the full toolbar editor (see below).
			this._createEditor( false );
		}

		this.editorInstance.once( 'loaded', function() {
			that.fullToolbarEditor.init( function() {
				that._onInit( callback );

				if ( typeof that.onRefresh == 'function' ) {
					that.onRefresh();
				}
			}, that.editorInstance.config );
		} );

		return this.mainContainer;
	};

	/**
	 * Called editor initialization finished.
	 *
	 * @param {Function} callback
	 * @param {String} [actualConfig]
	 * @private
	 */
	AbstractToolbarModifier.prototype._onInit = function( callback, actualConfig ) {
		this.originalConfig = this.editorInstance.config;

		if ( !actualConfig ) {
			this.actualConfig = JSON.parse( JSON.stringify( this.originalConfig ) );
		} else {
			this.actualConfig = JSON.parse( actualConfig );
		}

		if ( !this.actualConfig.toolbarGroups && !this.actualConfig.toolbar ) {
			this.actualConfig.toolbarGroups = getDefaultToolbarGroups( this.editorInstance );
		}

		if ( typeof callback === 'function' )
			callback( this.mainContainer );

		// Here we are going to keep only `name` and `groups` data from editor `toolbar` property.
		function getDefaultToolbarGroups( editor ) {
			var toolbarGroups = editor.toolbar,
				copy = [];

			var max = toolbarGroups.length;
			for ( var i = 0; i < max; i++ ) {
				var group = toolbarGroups[ i ];

				if ( typeof group == 'string' ) {
					copy.push( group ); // separator
				} else {
					copy.push( {
						name: group.name,
						groups: group.groups ? group.groups.slice() : []
					} );
				}
			}

			return copy;
		}
	};

	/**
	 * Creates DOM structure of tool.
	 *
	 * @returns {CKEDITOR.dom.element}
	 * @private
	 */
	AbstractToolbarModifier.prototype._createModifier = function() {
		this.mainContainer.addClass( 'unselectable' );

		if ( this.modifyContainer ) {
			this.modifyContainer.remove();
		}

		this.modifyContainer = new CKEDITOR.dom.element( 'div' );
		this.modifyContainer.addClass( 'toolbarModifier' );

		this.mainContainer.append( this.modifyContainer );

		return this.mainContainer;
	};

	/**
	 * Find editable area in CKEditor instance DOM container
	 *
	 * @returns {CKEDITOR.dom.element}
	 */
	AbstractToolbarModifier.prototype.getEditableArea = function() {
		var selector = ( '#' + this.editorInstance.id + '_contents' );

		return this.editorInstance.container.findOne( selector );
	};

	/**
	 * Hide editable area in modified editor by sets its height to 0.
	 *
	 * @private
	 */
	AbstractToolbarModifier.prototype._hideEditable = function() {
		var area = this.getEditableArea();

		this.isEditableVisible = false;

		this.lastEditableAreaHeight = area.getStyle( 'height' );
		area.setStyle( 'height', '0' );
	};

	/**
	 * Show editable area in modified editor.
	 *
	 * @private
	 */
	AbstractToolbarModifier.prototype._showEditable = function() {
		this.isEditableVisible = true;

		this.getEditableArea().setStyle( 'height', this.lastEditableAreaHeight || 'auto' );
	};

	/**
	 * Toggle editable area visibility.
	 *
	 * @private
	 */
	AbstractToolbarModifier.prototype._toggleEditable = function() {
		if ( this.isEditableVisible )
			this._hideEditable();
		else
			this._showEditable();
	};

	/**
	 * Usually called when configuration changes.
	 *
	 * @private
	 */
	AbstractToolbarModifier.prototype._refreshEditor = function() {
		var that = this,
			status = this.editorInstance.status;

		// Wait for ready only once.
		if ( this.waitForReady )
			return;

		// Not ready.
		if ( status == 'unloaded' || status == 'loaded' ) {
			this.waitForReady = true;

			this.editorInstance.once( 'instanceReady', function() {
				refresh();
			}, this );
			// Ready or destroyed.
		} else {
			refresh();
		}

		function refresh() {
			that.editorInstance.destroy();
			that._createEditor( true, that.getActualConfig() );
			that.waitForReady = false;
		}
	};

	/**
	 * Creates editor that can be used to present the toolbar configuration.
	 *
	 * @private
	 */
	AbstractToolbarModifier.prototype._createEditor = function( doRefresh, configOverrides ) {
		var that = this;

		this.editorInstance = CKEDITOR.replace( this.editorId );

		this.editorInstance.on( 'configLoaded', function() {
			var config = that.editorInstance.config;

			if ( configOverrides ) {
				CKEDITOR.tools.extend( config, configOverrides, true );
			}

			AbstractToolbarModifier.extendPluginsConfig( config );
		} );

		// Prevent creating any other space than the top one.
		this.editorInstance.on( 'uiSpace', function( evt ) {
			if ( evt.data.space != 'top' ) {
				evt.stop();
			}
		}, null, null, -999 );

		this.editorInstance.once( 'loaded', function() {
			var btns = that.editorInstance.ui.instances;

			for ( var i in btns ) {
				if ( btns[ i ] ) {
					btns[ i ].click = empty;
					btns[ i ].onClick = empty;
				}
			}

			if ( !that.isEditableVisible ) {
				that._hideEditable();
			}

			if ( that.currentActive && that.currentActive.name ) {
				that._highlightGroup( that.currentActive.name );
			}

			if ( that.hidden ) {
				that.hideUI();
			} else {
				that.showUI();
			}

			if ( doRefresh && ( typeof that.onRefresh === 'function' ) ) {
				that.onRefresh();
			}
		} );

		function empty() {}
	};

	/**
	 * Always returns copy of config.
	 *
	 * @returns {Object}
	 */
	AbstractToolbarModifier.prototype.getActualConfig = function() {
		return JSON.parse( JSON.stringify( this.actualConfig ) );
	};

	/**
	 * Creates toolbar in tool.
	 *
	 * @private
	 */
	AbstractToolbarModifier.prototype._createToolbar = function() {
		if ( !this.toolbarButtons.length ) {
			return;
		}

		this.toolbarContainer = new CKEDITOR.dom.element( 'div' );
		this.toolbarContainer.addClass( 'toolbar' );

		var max = this.toolbarButtons.length;
		for ( var i = 0; i < max; i += 1 ) {
			this._createToolbarBtn( this.toolbarButtons[ i ] );
		}
	};

	/**
	 * Create toolbar button and add it to toolbar container
	 *
	 * @param {Object} cfg
	 * @returns {CKEDITOR.dom.element}
	 * @private
	 */
	AbstractToolbarModifier.prototype._createToolbarBtn = function( cfg ) {
		var btnText = ( typeof cfg.text === 'string' ? cfg.text : cfg.text.inactive ),
			btn = ToolbarConfigurator.FullToolbarEditor.createButton( btnText, cfg.cssClass );

		this.toolbarContainer.append( btn );
		btn.data( 'group', cfg.group );
		btn.addClass( cfg.position );
		btn.on( 'click', function() {
			cfg.clickCallback.call( this, btn, cfg );
		}, this );

		return btn;
	};

	/**
	 * @private
	 * @param {Object} config
	 */
	AbstractToolbarModifier.prototype._fixGroups = function( config ) {
		var groups = config.toolbarGroups || [];

		var max = groups.length;
		for ( var i = 0; i < max; i += 1 ) {
			var currentGroup = groups[ i ];

			// separator, in config, is in raw format
			// need to make it more sophisticated to keep unique id
			// for each one
			if ( currentGroup == '/' ) {
				currentGroup = groups[ i ] = {};
				currentGroup.type = 'separator';
				currentGroup.name = ( 'separator' + CKEDITOR.tools.getNextNumber() );
				continue;
			}

			// sometimes subgroups are not set (basic package), so need to
			// create them artifically
			currentGroup.groups = currentGroup.groups || [];

			// when there is no subgroup with same name like its parent name
			// then it have to be added artificially
			// in order to maintain consistency between user interface and config
			if ( CKEDITOR.tools.indexOf( currentGroup.groups, currentGroup.name ) == -1 ) {
				this.editorInstance.ui.addToolbarGroup( currentGroup.name, currentGroup.groups[ currentGroup.groups.length - 1 ], currentGroup.name );
				currentGroup.groups.push( currentGroup.name );
			}

			this._fixSubgroups( currentGroup );
		}
	};

	/**
	 * Transform subgroup string to object literal
	 * with keys: {String} name and {Number} totalBtns
	 * Please note: this method modify Object provided in first argument
	 *
	 * input:
	 * [
	 *   { groups: [ 'nameOne', 'nameTwo' ] }
	 * ]
	 *
	 * output:
	 * [
	 *   { groups: [ { name: 'nameOne', totalBtns: 3 }, { name: 'nameTwo', totalBtns: 5 } ] }
	 * ]
	 *
	 * @param {Object} group
	 * @private
	 */
	AbstractToolbarModifier.prototype._fixSubgroups = function( group ) {
		var subGroups = group.groups;

		var max = subGroups.length;
		for ( var i = 0; i < max; i += 1 ) {
			var subgroupName = subGroups[ i ];

			subGroups[ i ] = {
				name: subgroupName,
				totalBtns: ToolbarConfigurator.ToolbarModifier.getTotalSubGroupButtonsNumber( subgroupName, this.fullToolbarEditor )
			};
		}
	};

	/**
	 * Same as JSON.stringify method but returned string is in one line
	 *
	 * @param {Object} json
	 * @param {Object} opts
	 * @param {Boolean} opts.addSpaces
	 * @param {Boolean} opts.noQuotesOnKey
	 * @param {Boolean} opts.singleQuotes
	 * @returns {Object}
	 */
	AbstractToolbarModifier.stringifyJSONintoOneLine = function( json, opts ) {
		opts = opts || {};
		var stringJSON = JSON.stringify( json, null, '' );

		// IE8 make new line characters
		stringJSON = stringJSON.replace( /\n/g, '' );

		if ( opts.addSpaces ) {
			stringJSON = stringJSON.replace( /(\{|:|,|\[|\])/g, function( sentence ) {
				return sentence + ' ';
			} );

			stringJSON = stringJSON.replace( /(\])/g, function( sentence ) {
				return ' ' + sentence;
			} );
		}

		if ( opts.noQuotesOnKey ) {
			stringJSON = stringJSON.replace( /"(\w*)":/g, function( sentence, word ) {
				return word + ':';
			} );
		}

		if ( opts.singleQuotes ) {
			stringJSON = stringJSON.replace( /\"/g, '\'' );
		}

		return stringJSON;
	};

	/**
	 * Hide toolbar configurator
	 */
	AbstractToolbarModifier.prototype.hideUI = function() {
		this.hidden = true;
		this.mainContainer.hide();
		if ( this.editorInstance.container ) {
			this.editorInstance.container.hide();
		}
	};

	/**
	 * Show toolbar configurator
	 */
	AbstractToolbarModifier.prototype.showUI = function() {
		this.hidden = false;
		this.mainContainer.show();
		if ( this.editorInstance.container ) {
			this.editorInstance.container.show();
		}
	};


	/**
	 * Extends plugins setttings in the specified config with settings useful for
	 * the toolbar configurator.
	 *
	 * @static
	 */
	AbstractToolbarModifier.extendPluginsConfig = function( config ) {
		var extraPlugins = config.extraPlugins,
			removePlugins = config.removePlugins;

		// Enable the special, lightweight area to replace wysiwygarea.
		config.extraPlugins = ( extraPlugins ? extraPlugins + ',' : '' ) + 'toolbarconfiguratorarea';
		// Disable plugins which do not affect toolbar buttons, to make the editor more lightweight.
		config.removePlugins = ( removePlugins ? removePlugins + ',' : '' ) +
			'autogrow,dialogadvtab,elementspath,enterkey,floatingspace,htmlwriter,magicline,resize,sharedspace,tab,wysiwygarea';
	};
} )();
