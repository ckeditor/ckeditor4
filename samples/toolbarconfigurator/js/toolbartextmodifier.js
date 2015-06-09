/* global CodeMirror, ToolbarConfigurator */

'use strict';

( function() {
	var AbstractToolbarModifier = ToolbarConfigurator.AbstractToolbarModifier,
		FullToolbarEditor = ToolbarConfigurator.FullToolbarEditor;

	/**
	 * @class ToolbarConfigurator.ToolbarTextModifier
	 * @param {String} editorId An id of modified editor
	 * @extends AbstractToolbarModifier
	 * @constructor
	 */
	function ToolbarTextModifier( editorId ) {
		AbstractToolbarModifier.call( this, editorId );

		this.codeContainer = null;
		this.hintContainer = null;
	}

	// Expose the class.
	ToolbarConfigurator.ToolbarTextModifier = ToolbarTextModifier;

	ToolbarTextModifier.prototype = Object.create( AbstractToolbarModifier.prototype );

	/**
	 * @param {Function} callback
	 * @param {String} [config]
	 * @private
	 */
	ToolbarTextModifier.prototype._onInit = function( callback, config ) {
		AbstractToolbarModifier.prototype._onInit.call( this, undefined, config );

		this._createModifier( config ? this.actualConfig : undefined );

		if ( typeof callback === 'function' )
			callback( this.mainContainer );
	};

	/**
	 * Creates HTML main container of modifier.
	 *
	 * @param {String} cfg
	 * @returns {CKEDITOR.dom.element}
	 * @private
	 */
	ToolbarTextModifier.prototype._createModifier = function( cfg ) {
		var that = this;

		this._createToolbar();

		if ( this.toolbarContainer ) {
			this.mainContainer.append( this.toolbarContainer );
		}

		AbstractToolbarModifier.prototype._createModifier.call( this );

		this._setupActualConfig( cfg );

		var toolbarCfg = this.actualConfig.toolbar,
			cfgValue;

		if ( CKEDITOR.tools.isArray( toolbarCfg ) ) {
			var stringifiedToolbar = '[\n\t\t' + FullToolbarEditor.map( toolbarCfg, function( json ) {
					return AbstractToolbarModifier.stringifyJSONintoOneLine( json, {
						addSpaces: true,
						noQuotesOnKey: true,
						singleQuotes: true
					} );
				} ).join( ',\n\t\t' ) + '\n\t]';

			cfgValue = '\tconfig.toolbar = ' + stringifiedToolbar + ';';
		} else {
			cfgValue = 'config.toolbar = [];';
		}

		cfgValue = [
			'CKEDITOR.editorConfig = function( config ) {\n',
				cfgValue,
			'\n};'
		].join( '' );

		function hint( cm ) {
			var data = setupData( cm );

			if ( data.charsBetween === null ) {
				return;
			}

			var unused = that.getUnusedButtonsArray( that.actualConfig.toolbar, true, data.charsBetween ),
				to = cm.getCursor(),
				from = CodeMirror.Pos( to.line, ( to.ch - ( data.charsBetween.length ) ) ),
				token = cm.getTokenAt( to ),
				prevToken = cm.getTokenAt( { line: to.line, ch: token.start } );

			// determine that we are at beginning of group,
			// so first key is "name"
			if ( prevToken.string === '{' )
				unused = [ 'name' ];

			// preventing close with special character and move cursor forward
			// when no autocomplete
			if ( unused.length === 0 )
				return;

			return new HintData( from, to, unused );
		}

		function HintData( from, to, list ) {
			this.from = from;
			this.to = to;
			this.list = list;
			this._handlers = [];
		}

		function setupData( cm, character ) {
			var result = {};

			result.cur = cm.getCursor();
			result.tok = cm.getTokenAt( result.cur );

			result[ 'char' ] = character || result.tok.string.charAt( result.tok.string.length - 1 );

			// Getting string between begin of line and cursor.
			var curLineTillCur = cm.getRange( CodeMirror.Pos( result.cur.line, 0 ), result.cur );

			// Reverse string.
			var currLineTillCurReversed = curLineTillCur.split( '' ).reverse().join( '' );

			// Removing proper string definitions :
			// FROM:
			// R' ,'odeR' ,'odnU' [ :smeti{
			//     ^^^^^^  ^^^^^^
			// TO:
			// R' , [ :smeti{
			currLineTillCurReversed = currLineTillCurReversed.replace( /(['|"]\w*['|"])/g, '' );

			// Matching letters till ' or " character and end string char.
			// R' , [ :smeti{
			// ^
			result.charsBetween = currLineTillCurReversed.match( /(^\w*)(['|"])/ );

			if ( result.charsBetween ) {
				result.endChar = result.charsBetween[ 2 ];

				// And reverse string (bring to original state).
				result.charsBetween = result.charsBetween[ 1 ].split( '' ).reverse().join( '' );
			}

			return result;
		}

		function complete( cm ) {
			setTimeout( function() {
				if ( !cm.state.completionActive ) {
					CodeMirror.showHint( cm, hint, {
						hintsClass: 'toolbar-modifier',
						completeSingle: false
					} );
				}
			}, 100 );

			return CodeMirror.Pass;
		}

		var codeMirrorWrapper = new CKEDITOR.dom.element( 'div' );
		codeMirrorWrapper.addClass( 'codemirror-wrapper' );
		this.modifyContainer.append( codeMirrorWrapper );
		this.codeContainer = CodeMirror( codeMirrorWrapper.$, {
			mode: { name: 'javascript', json: true },
			// For some reason (most likely CM's bug) gutter breaks CM's height.
			// Refreshing CM does not help.
			lineNumbers: false,
			lineWrapping: true,
			// Trick to make CM autogrow. http://codemirror.net/demo/resize.html
			viewportMargin: Infinity,
			value: cfgValue,
			smartIndent: false,
			indentWithTabs: true,
			indentUnit: 4,
			tabSize: 4,
			theme: 'neo',
			extraKeys: {
				'Left': complete,
				'Right': complete,
				"'''": complete,
				"'\"'": complete,
				Backspace: complete,
				Delete: complete,
				'Shift-Tab': 'indentLess'
			}
		} );

		this.codeContainer.on( 'endCompletion', function( cm, completionData ) {
			var data = setupData( cm );

			// preventing close with special character and move cursor forward
			// when no autocomplete
			if ( completionData === undefined )
				return;

			cm.replaceSelection( data.endChar );
		} );

		this.codeContainer.on( 'change', function() {
			var value = that.codeContainer.getValue();

			value =  that._evaluateValue( value );

			if ( value !== null ) {
				that.actualConfig.toolbar = ( value.toolbar ? value.toolbar : that.actualConfig.toolbar );

				that._fillHintByUnusedElements();
				that._refreshEditor();

				that.mainContainer.removeClass( 'invalid' );
			} else {
				that.mainContainer.addClass( 'invalid' );
			}
		} );

		this.hintContainer = new CKEDITOR.dom.element( 'div' );
		this.hintContainer.addClass( 'toolbarModifier-hints' );

		this._fillHintByUnusedElements();
		this.hintContainer.insertBefore( codeMirrorWrapper );
	};

	/**
	 * Create DOM string and set to hint container,
	 * show proper information when no unused element left.
	 *
	 * @private
	 */
	ToolbarTextModifier.prototype._fillHintByUnusedElements = function() {
		var unused = this.getUnusedButtonsArray( this.actualConfig.toolbar, true );
		unused = this.groupButtonNamesByGroup( unused );

		var unusedElements = FullToolbarEditor.map( unused, function( elem ) {
			var buttonsList = FullToolbarEditor.map( elem.buttons, function( buttonName ) {
				return '<code>' + buttonName + '</code> ';
			} ).join( '' );

			return [
				'<dt>',
					'<code>', elem.name, '</code>',
				'</dt>',
				'<dd>',
					buttonsList,
				'</dd>'
			].join( '' );
		} ).join( ' ' );

		var listHeader = [
			'<dt class="list-header">Toolbar group</dt>',
			'<dd class="list-header">Unused items</dd>'
		].join( '' );

		var header = '<h3>Unused toolbar items</h3>';

		if ( !unused.length ) {
			listHeader = '<p>All items are in use.</p>';
		}

		this.codeContainer.refresh();

		this.hintContainer.setHtml( header + '<dl>' + listHeader + unusedElements + '</dl>' );
	};

	/**
	 * @param {String} buttonName
	 * @returns {String}
	 */
	ToolbarTextModifier.prototype.getToolbarGroupByButtonName = function( buttonName ) {
		var buttonNames = this.fullToolbarEditor.buttonNamesByGroup;

		for ( var groupName in  buttonNames ) {
			var buttons = buttonNames[ groupName ];

			var i = buttons.length;
			while ( i-- ) {
				if ( buttonName === buttons[ i ] ) {
					return groupName;
				}
			}

		}

		return null;
	};

	/**
	 * Filter all available toolbar elements by array of elements provided in first argument.
	 * Returns elements which are not used.
	 *
	 * @param {Object} toolbar
	 * @param {Boolean} [sorted=false]
	 * @param {String} prefix
	 * @returns {Array}
	 */
	ToolbarTextModifier.prototype.getUnusedButtonsArray = function( toolbar, sorted, prefix ) {
		sorted = ( sorted === true ? true : false );
		var providedElements = ToolbarTextModifier.mapToolbarCfgToElementsList( toolbar ),
			allElements = Object.keys( this.fullToolbarEditor.editorInstance.ui.items );

		// get rid of "-" elements
		allElements = FullToolbarEditor.filter( allElements, function( elem ) {
			var isSeparator = ( elem === '-' ),
				matchPrefix = ( prefix === undefined || elem.toLowerCase().indexOf( prefix.toLowerCase() ) === 0 );

			return !isSeparator && matchPrefix;
		} );

		var elementsNotUsed = FullToolbarEditor.filter( allElements, function( elem ) {
			return CKEDITOR.tools.indexOf( providedElements, elem ) == -1;
		} );

		if ( sorted )
			elementsNotUsed.sort();

		return elementsNotUsed;
	};

	/**
	 *
	 * @param {Array} buttons
	 * @returns {Array}
	 */
	ToolbarTextModifier.prototype.groupButtonNamesByGroup = function( buttons ) {
		var result = [],
			groupedBtns = JSON.parse( JSON.stringify( this.fullToolbarEditor.buttonNamesByGroup ) );

		for ( var groupName in groupedBtns ) {
			var currGroup = groupedBtns[ groupName ];
			currGroup = FullToolbarEditor.filter( currGroup, function( btnName ) {
				return CKEDITOR.tools.indexOf( buttons, btnName ) !== -1;
			} );

			if ( currGroup.length ) {
				result.push( {
					name: groupName,
					buttons: currGroup
				} );
			}

		}

		return result;
	};

	/**
	 * Map toolbar config value to flat items list.
	 *
	 * input:
	 * [
	 *   { name: "basicstyles", items: ["Bold", "Italic"] },
	 *   { name: "advancedstyles", items: ["Bold", "Outdent", "Indent"] }
	 * ]
	 *
	 * output:
	 * ["Bold", "Italic", "Outdent", "Indent"]
	 *
	 * @param {Object} toolbar
	 * @returns {Array}
	 */
	ToolbarTextModifier.mapToolbarCfgToElementsList = function( toolbar ) {
		var elements = [];

		var max = toolbar.length;
		for ( var i = 0; i < max; i += 1 ) {
			if ( !toolbar[ i ] || typeof toolbar[ i ] === 'string' )
				continue;

			elements = elements.concat( FullToolbarEditor.filter( toolbar[ i ].items, checker ) );
		}

		function checker( elem ) {
			return elem !== '-';
		}

		return elements;
	};

	/**
	 * @param {String} cfg
	 * @private
	 */
	ToolbarTextModifier.prototype._setupActualConfig = function( cfg ) {
		cfg = cfg || this.editorInstance.config;

		// if toolbar already exists in config, there is nothing to do
		if ( CKEDITOR.tools.isArray( cfg.toolbar ) )
			return;

		// if toolbar group not present, we need to pick them from full toolbar instance
		if ( !cfg.toolbarGroups )
			cfg.toolbarGroups = this.fullToolbarEditor.getFullToolbarGroupsConfig( true );

		this._fixGroups( cfg );

		cfg.toolbar = this._mapToolbarGroupsToToolbar( cfg.toolbarGroups, this.actualConfig.removeButtons );

		this.actualConfig.toolbar = cfg.toolbar;
		this.actualConfig.removeButtons = '';
	};

	/**
	 * **Please note:** This method modify element provided in first argument.
	 *
	 * @param {Array} toolbarGroups
	 * @returns {Array}
	 * @private
	 */
	ToolbarTextModifier.prototype._mapToolbarGroupsToToolbar = function( toolbarGroups, removedBtns ) {
		removedBtns = removedBtns || this.editorInstance.config.removedBtns;
		removedBtns = typeof removedBtns == 'string' ? removedBtns.split( ',' ) : [];

		// from the end, because array indexes may change
		var i = toolbarGroups.length;
		while ( i-- ) {
			var mappedSubgroup = this._mapToolbarSubgroup( toolbarGroups[ i ], removedBtns );

			if ( toolbarGroups[ i ].type === 'separator' ) {
				toolbarGroups[ i ] = '/';
				continue;
			}

			// don't want empty groups
			if ( CKEDITOR.tools.isArray( mappedSubgroup ) && mappedSubgroup.length === 0 ) {
				toolbarGroups.splice( i, 1 );
				continue;
			}

			if ( typeof mappedSubgroup == 'string' )
				toolbarGroups[ i ] = mappedSubgroup;
			else {
				toolbarGroups[ i ] = {
					name: toolbarGroups[ i ].name,
					items: mappedSubgroup
				};
			}
		}

		return toolbarGroups;
	};

	/**
	 *
	 * @param {String|Object} group
	 * @param {Array} removedBtns
	 * @returns {Array}
	 * @private
	 */
	ToolbarTextModifier.prototype._mapToolbarSubgroup = function( group, removedBtns ) {
		var totalBtns = 0;
		if ( typeof group == 'string' )
			return group;

		var max = group.groups ? group.groups.length : 0,
			result = [];
		for ( var i = 0; i < max; i += 1 ) {
			var currSubgroup = group.groups[ i ];

			var buttons = this.fullToolbarEditor.buttonsByGroup[ typeof currSubgroup === 'string' ? currSubgroup : currSubgroup.name ] || [];
			buttons = this._mapButtonsToButtonsNames( buttons, removedBtns );
			var currTotalBtns = buttons.length;
			totalBtns += currTotalBtns;
			result = result.concat( buttons );

			if ( currTotalBtns )
				result.push( '-' );
		}

		if ( result[ result.length - 1 ] == '-' )
			result.pop();

		return result;
	};

	/**
	 *
	 * @param {Array} buttons
	 * @param {Array} removedBtns
	 * @returns {Array}
	 * @private
	 */
	ToolbarTextModifier.prototype._mapButtonsToButtonsNames = function( buttons, removedBtns ) {
		var i = buttons.length;
		while ( i-- ) {
			var currBtn = buttons[ i ],
				camelCasedName;

			if ( typeof currBtn === 'string' ) {
				camelCasedName = currBtn;
			} else {
				camelCasedName = this.fullToolbarEditor.getCamelCasedButtonName( currBtn.name );
			}

			if ( CKEDITOR.tools.indexOf( removedBtns, camelCasedName ) !== -1 ) {
				buttons.splice( i, 1 );
				continue;
			}

			buttons[ i ] = camelCasedName;
		}

		return buttons;
	};

	/**
	 * @param {String} val
	 * @returns {Object}
	 * @private
	 */
	ToolbarTextModifier.prototype._evaluateValue = function( val ) {
		var parsed;

		try {
			var config = {};
			( function() {
				var CKEDITOR = Function( 'var CKEDITOR = {}; ' + val + '; return CKEDITOR;' )();

				CKEDITOR.editorConfig( config );
				parsed = config;
			} )();

			// CKEditor does not handle empty arrays in configuration files
			// on IE8
			var i = parsed.toolbar.length;
			while ( i-- )
				if ( !parsed.toolbar[ i ] ) parsed.toolbar.splice( i, 1 );

		} catch ( e ) {
			parsed = null;
		}

		return parsed;
	};

	/**
	 * @param {Array} toolbar
	 * @returns {{toolbarGroups: Array, removeButtons: string}}
	 */
	ToolbarTextModifier.prototype.mapToolbarToToolbarGroups = function( toolbar ) {
		var usedGroups = {},
			removeButtons = [],
			toolbarGroups = [];

		var max = toolbar.length;
		for ( var i = 0; i < max; i++ ) {
			if ( toolbar[ i ] === '/' ) {
				toolbarGroups.push( '/' );
				continue;
			}

			var items = toolbar[ i ].items;

			var toolbarGroup = {};
			toolbarGroup.name = toolbar[ i ].name;
			toolbarGroup.groups = [];

			var max2 = items.length;
			for ( var j = 0; j < max2; j++ ) {
				var item = items[ j ];

				if ( item === '-' ) {
					continue;
				}

				var groupName = this.getToolbarGroupByButtonName( item );

				var groupIndex = toolbarGroup.groups.indexOf( groupName );
				if ( groupIndex === -1 ) {
					toolbarGroup.groups.push( groupName );
				}

				usedGroups[ groupName ] = usedGroups[ groupName ] || {};

				var buttons = ( usedGroups[ groupName ].buttons = usedGroups[ groupName ].buttons || {} );

				buttons[ item ] = buttons[ item ] || { used: 0, origin: toolbarGroup.name };
				buttons[ item ].used++;
			}

			toolbarGroups.push( toolbarGroup );
		}

		// Handling removed buttons
		removeButtons = prepareRemovedButtons( usedGroups, this.fullToolbarEditor.buttonNamesByGroup );

		function prepareRemovedButtons( usedGroups, buttonNames ) {
			var removed = [];

			for ( var groupName in usedGroups ) {
				var group = usedGroups[ groupName ];
				var allButtonsInGroup = buttonNames[ groupName ].slice();

				removed = removed.concat( removeStuffFromArray( allButtonsInGroup, Object.keys( group.buttons ) ) );
			}

			return removed;
		}

		function removeStuffFromArray( array, stuff ) {
			array = array.slice();
			var i = stuff.length;

			while ( i-- ) {
				var atIndex = array.indexOf( stuff[ i ] );
				if ( atIndex !== -1 ) {
					array.splice( atIndex, 1 );
				}
			}

			return array;
		}

		return { toolbarGroups: toolbarGroups, removeButtons: removeButtons.join( ',' ) };
	};

	return ToolbarTextModifier;
} )();
