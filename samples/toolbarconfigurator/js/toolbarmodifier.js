/* global ToolbarConfigurator, alert */

'use strict';

( function() {
	var AbstractToolbarModifier = ToolbarConfigurator.AbstractToolbarModifier;

	/**
	 * @class ToolbarConfigurator.ToolbarModifier
	 * @param {String} editorId An id of modified editor
	 * @param {Object} cfg
	 * @extends AbstractToolbarModifier
	 * @constructor
	 */
	function ToolbarModifier( editorId, cfg ) {
		AbstractToolbarModifier.call( this, editorId, cfg );

		this.removedButtons = null;
		this.originalConfig = null;
		this.actualConfig = null;
		this.emptyVisible = false;

		// edit, paste, config
		this.state = 'edit';

		this.toolbarButtons = [
			{
				text: {
					active: 'Hide empty toolbar groups',
					inactive: 'Show empty toolbar groups'
				},
				group: 'edit',
				position: 'left',
				cssClass: 'button-a-soft',
				clickCallback: function( button, buttonDefinition ) {
					var className = 'button-a-background';

					button[ button.hasClass( className ) ? 'removeClass' : 'addClass' ]( className );

					this._toggleVisibilityEmptyElements();

					if ( this.emptyVisible ) {
						button.setText( buttonDefinition.text.active );
					} else {
						button.setText( buttonDefinition.text.inactive );
					}
				}
			},
			{
				text: 'Add row separator',
				group: 'edit',
				position: 'left',
				cssClass: 'button-a-soft',
				clickCallback: function() {
					this._addSeparator();
				}
			},
			/*{
				text: 'Paste config',
				group: 'edit',
				position: 'left',
				clickCallback: function() {
					this.state = 'paste';

					this.modifyContainer.addClass( 'hidden' );
					this.configContainer.removeClass( 'hidden' );
					this.configContainer.setHtml( '<textarea></textarea>' );
					this.showToolbarBtnsByGroupName( 'config' );
				}
			},*/
			{
				text: 'Select config',
				group: 'config',
				position: 'left',
				cssClass: 'button-a-soft',
				clickCallback: function() {
					this.configContainer.findOne( 'textarea' ).$.select();
				}
			},
			{
				text: 'Back to configurator',
				group: 'config',
				position: 'right',
				cssClass: 'button-a-background',
				clickCallback: function() {
					if ( this.state === 'paste' ) {
						var cfg = this.configContainer.findOne( 'textarea' ).getValue();
						cfg = ToolbarModifier.evaluateToolbarGroupsConfig( cfg );

						if ( cfg ) {
							this.setConfig( cfg );
						} else {
							alert( 'Your pasted config is wrong.' );
						}
					}

					this.state = 'edit';
					this._showConfigurationTool();
					this.showToolbarBtnsByGroupName( this.state );
				}
			},
			{
				text: 'Get toolbar <span class="highlight">config</span>',
				group: 'edit',
				position: 'right',
				cssClass: 'button-a-background icon-pos-left icon-download',
				clickCallback: function() {
					this.state = 'config';
					this._showConfig();
					this.showToolbarBtnsByGroupName( this.state );
				}
			}
		];

		this.cachedActiveElement = null;
	}

	// Expose the class.
	ToolbarConfigurator.ToolbarModifier = ToolbarModifier;

	ToolbarModifier.prototype = Object.create( ToolbarConfigurator.AbstractToolbarModifier.prototype );

	/**
	 * @returns {Object}
	 */
	ToolbarModifier.prototype.getActualConfig = function() {
		var copy = AbstractToolbarModifier.prototype.getActualConfig.call( this );

		if ( copy.toolbarGroups ) {

			var max = copy.toolbarGroups.length;
			for ( var i = 0; i < max; i += 1 ) {
				var currentGroup = copy.toolbarGroups[ i ];

				copy.toolbarGroups[ i ] = ToolbarModifier.parseGroupToConfigValue( currentGroup );
			}

		}

		return copy;
	};

	/**
	 * @param {Function} callback
	 * @param {String} [config]
	 * @param {Boolean} [forceKeepRemoveButtons=false]
	 * @private
	 */
	ToolbarModifier.prototype._onInit = function( callback, config, forceKeepRemoveButtons ) {
		forceKeepRemoveButtons = ( forceKeepRemoveButtons === true );
		AbstractToolbarModifier.prototype._onInit.call( this, undefined, config );

		this.removedButtons = [];

		if ( forceKeepRemoveButtons ) {
			if ( this.actualConfig.removeButtons ) {
				this.removedButtons = this.actualConfig.removeButtons.split( ',' );
			} else {
				this.removedButtons = [];
			}
		} else {
			if ( !( 'removeButtons' in this.originalConfig ) ) {
				this.originalConfig.removeButtons = '';
				this.removedButtons = [];
			} else {
				this.removedButtons = this.originalConfig.removeButtons ? this.originalConfig.removeButtons.split( ',' ) : [];
			}
		}

		if ( !this.actualConfig.toolbarGroups )
			this.actualConfig.toolbarGroups = this.fullToolbarEditor.getFullToolbarGroupsConfig();

		this._fixGroups( this.actualConfig );
		this._calculateTotalBtns();

		this._createModifier();
		this._refreshMoveBtnsAvalibility();
		this._refreshBtnTabIndexes();

		if ( typeof callback === 'function' )
			callback( this.mainContainer );
	};

	/**
	 * @private
	 */
	ToolbarModifier.prototype._showConfigurationTool = function() {
		this.configContainer.addClass( 'hidden' );
		this.modifyContainer.removeClass( 'hidden' );
	};

	/**
	 * Show configuration file in tool
	 *
	 * @private
	 */
	ToolbarModifier.prototype._showConfig = function() {
		var that = this,
			actualConfig = this.getActualConfig(),
			cfg = {};
		if ( actualConfig.toolbarGroups ) {
			cfg.toolbarGroups = actualConfig.toolbarGroups;

			var groups = prepareGroups( actualConfig.toolbarGroups, this.cfg.trimEmptyGroups );

			cfg.toolbarGroups = '\n\t\t' + groups.join( ',\n\t\t' );
		}

		function prepareGroups( toolbarGroups, trimEmptyGroups ) {
			var groups = [],
				max = toolbarGroups.length;

			for ( var i = 0; i < max; i++ ) {
				var group = toolbarGroups[ i ];

				if ( group === '/' ) {
					groups.push( '\'/\'' );
					continue;
				}

				if ( trimEmptyGroups ) {
					var max2 = group.groups.length;
					while ( max2-- ) {
						var subgroup = group.groups[ max2 ];

						if ( ToolbarModifier.getTotalSubGroupButtonsNumber( subgroup, that.fullToolbarEditor ) === 0 ) {
							group.groups.splice( max2, 1 );
						}
					}
				}

				if ( !( trimEmptyGroups && group.groups.length === 0 ) ) {
					groups.push( AbstractToolbarModifier.stringifyJSONintoOneLine( group, {
						addSpaces: true,
						noQuotesOnKey: true,
						singleQuotes: true
					} ) );
				}
			}

			return groups;
		}

		if ( actualConfig.removeButtons ) {
			cfg.removeButtons = actualConfig.removeButtons;
		}

		var content = [
			'<textarea readonly>',
			'CKEDITOR.editorConfig = function( config ) {\n',
			( cfg.toolbarGroups ? '\tconfig.toolbarGroups = [' + cfg.toolbarGroups + '\n\t];' : '' ),
			( cfg.removeButtons ? '\n\n' : '' ),
			( cfg.removeButtons ? '\tconfig.removeButtons = \'' + cfg.removeButtons + '\';' : '' ),
			'\n};',
			'</textarea>'
		].join( '' );



		this.modifyContainer.addClass( 'hidden' );
		this.configContainer.removeClass( 'hidden' );

		this.configContainer.setHtml( content );
	};

	/**
	 * Toggle empty groups and subgroups visibility.
	 *
	 * @private
	 */
	ToolbarModifier.prototype._toggleVisibilityEmptyElements = function() {
		if ( this.modifyContainer.hasClass( 'empty-visible' ) ) {
			this.modifyContainer.removeClass( 'empty-visible' );
			this.emptyVisible = false;
		} else {
			this.modifyContainer.addClass( 'empty-visible' );
			this.emptyVisible = true;
		}

		this._refreshMoveBtnsAvalibility();
	};

	/**
	 * Creates HTML main container of modifier.
	 *
	 * @returns {CKEDITOR.dom.element}
	 * @private
	 */
	ToolbarModifier.prototype._createModifier = function() {
		var that = this;

		AbstractToolbarModifier.prototype._createModifier.call( this );

		this.modifyContainer.setHtml( this._toolbarConfigToListString() );

		var groupLi = this.modifyContainer.find( 'li[data-type="group"]' );

		this.modifyContainer.on( 'mouseleave', function() {
			this._dehighlightActiveToolGroup();
		}, this );

		var max = groupLi.count();
		for ( var i = 0; i < max; i += 1 ) {
			groupLi.getItem( i ).on( 'mouseenter', onGroupHover );
		}

		function onGroupHover() {
			that._highlightGroup( this.data( 'name' ) );
		}

		CKEDITOR.document.on( 'keypress', function( e ) {
			var nativeEvent = e.data.$,
				keyCode = nativeEvent.keyCode,
				spaceOrEnter = ( keyCode === 32 || keyCode === 13 ),
				active = new CKEDITOR.dom.element( CKEDITOR.document.$.activeElement );

			var mainContainer = active.getAscendant( function( node ) {
				return node.$ === that.mainContainer.$;
			} );

			if ( !mainContainer || !spaceOrEnter ) {
				return;
			}

			if ( active.data( 'type' ) === 'button' ) {
				active.findOne( 'input' ).$.click();
			}
		} );

		this.modifyContainer.on( 'click', function( e ) {
			var origEvent = e.data.$,
				target = new CKEDITOR.dom.element( ( origEvent.target || origEvent.srcElement ) ),
				relativeGroupOrSeparatorLi = ToolbarModifier.getGroupOrSeparatorLiAncestor( target );

			if ( !relativeGroupOrSeparatorLi ) {
				return;
			}

			that.cachedActiveElement = document.activeElement;

			// checkbox clicked
			if ( target.$ instanceof HTMLInputElement )
				that._handleCheckboxClicked( target );

			// link clicked
			else if ( target.$ instanceof HTMLButtonElement ) {
				if ( origEvent.preventDefault )
					origEvent.preventDefault();
				else
					origEvent.returnValue = false;

				var result = that._handleAnchorClicked( target.$ );

				if ( result && result.action == 'remove' )
					return;

			}

			var elementType = relativeGroupOrSeparatorLi.data( 'type' ),
				elementName = relativeGroupOrSeparatorLi.data( 'name' );

			that._setActiveElement( elementType, elementName );

			if ( that.cachedActiveElement )
				that.cachedActiveElement.focus();
		} );

		if ( !this.toolbarContainer ) {
			this._createToolbar();
			this.toolbarContainer.insertBefore( this.mainContainer.getChildren().getItem( 0 ) );
		}

		this.showToolbarBtnsByGroupName( 'edit' );

		if ( !this.configContainer ) {
			this.configContainer = new CKEDITOR.dom.element( 'div' );
			this.configContainer.addClass( 'configContainer' );
			this.configContainer.addClass( 'hidden' );

			this.mainContainer.append( this.configContainer );
		}

		return this.mainContainer;
	};

	/**
	 * Show toolbar buttons related to group name provided in argument
	 * and hide other buttons
	 * Please note: this method works on toolbar in tool, which is located
	 * on top of the tool
	 *
	 * @param {String} groupName
	 */
	ToolbarModifier.prototype.showToolbarBtnsByGroupName = function( groupName ) {
		if ( !this.toolbarContainer ) {
			return;
		}

		var allButtons = this.toolbarContainer.find( 'button' );

		var max = allButtons.count();
		for ( var i = 0; i < max; i += 1 ) {
			var currentBtn = allButtons.getItem( i );

			if ( currentBtn.data( 'group' ) == groupName )
				currentBtn.removeClass( 'hidden' );
			else
				currentBtn.addClass( 'hidden' );

		}
	};

	/**
	 * Parse group "model" to configuration value
	 *
	 * @param {Object} group
	 * @returns {Object}
	 * @private
	 */
	ToolbarModifier.parseGroupToConfigValue = function( group ) {
		if ( group.type == 'separator' ) {
			return '/';
		}

		var groups = group.groups,
			max = groups.length;

		delete group.totalBtns;
		for ( var i = 0; i < max; i += 1 ) {
			groups[ i ] = groups[ i ].name;
		}

		return group;
	};

	/**
	 * Find closest Li ancestor in DOM tree which is group or separator element
	 *
	 * @param {CKEDITOR.dom.element} element
	 * @returns {CKEDITOR.dom.element}
	 */
	ToolbarModifier.getGroupOrSeparatorLiAncestor = function( element ) {
		if ( element.$ instanceof HTMLLIElement && element.data( 'type' ) == 'group' )
			return element;
		else {
			return ToolbarModifier.getFirstAncestor( element, function( ancestor ) {
				var type = ancestor.data( 'type' );

				return ( type == 'group' || type == 'separator' );
			} );
		}
	};

	/**
	 * Set active element in tool by provided type and name.
	 *
	 * @param {String} type
	 * @param {String} name
	 */
	ToolbarModifier.prototype._setActiveElement = function( type, name ) {
		// clear current active element
		if ( this.currentActive )
			this.currentActive.elem.removeClass( 'active' );

		if ( type === null ) {
			this._dehighlightActiveToolGroup();
			this.currentActive = null;
			return;
		}

		var liElem = this.mainContainer.findOne( 'ul[data-type=table-body] li[data-type="' + type + '"][data-name="' + name + '"]' );

		liElem.addClass( 'active' );

		// setup model
		this.currentActive = {
			type: type,
			name: name,
			elem: liElem
		};

		// highlight group in toolbar
		if ( type == 'group' )
			this._highlightGroup( name );

		if ( type == 'separator' )
			this._dehighlightActiveToolGroup();
	};

	/**
	 * @returns {CKEDITOR.dom.element|null}
	 */
	ToolbarModifier.prototype.getActiveToolGroup = function() {
		if ( this.editorInstance.container )
			return this.editorInstance.container.findOne( '.cke_toolgroup.active, .cke_toolbar.active' );
		else
			return null;
	};

	/**
	 * @private
	 */
	ToolbarModifier.prototype._dehighlightActiveToolGroup = function() {
		var currentActive = this.getActiveToolGroup();

		if ( currentActive )
			currentActive.removeClass( 'active' );

		// @see ToolbarModifier.prototype._highlightGroup.
		if ( this.editorInstance.container ) {
			this.editorInstance.container.removeClass( 'some-toolbar-active' );
		}
	};

	/**
	 * Highlight group by its name, and dehighlight current group.
	 *
	 * @param {String} name
	 */
	ToolbarModifier.prototype._highlightGroup = function( name ) {
		if ( !this.editorInstance.container )
			return;

		var foundBtnName = this.getFirstEnabledButtonInGroup( name ),
			foundBtn = this.editorInstance.container.findOne( '.cke_button__' + foundBtnName + ', .cke_combo__' + foundBtnName );

		this._dehighlightActiveToolGroup();

		// Helpful to dim other toolbar groups if one is highlighted.
		if ( this.editorInstance.container ) {
			this.editorInstance.container.addClass( 'some-toolbar-active' );
		}

		if ( foundBtn ) {
			var btnToolbar = ToolbarModifier.getFirstAncestor( foundBtn, function( ancestor ) {
				return ancestor.hasClass( 'cke_toolbar' );
			} );

			if ( btnToolbar )
				btnToolbar.addClass( 'active' );
		}
	};

	/**
	 * @param {String} groupName
	 * @return {String|null}
	 */
	ToolbarModifier.prototype.getFirstEnabledButtonInGroup = function( groupName ) {
		var groups = this.actualConfig.toolbarGroups,
			groupIndex = this.getGroupIndex( groupName ),
			group = groups[ groupIndex ];

		if ( groupIndex === -1 ) {
			return null;
		}

		var max = group.groups ? group.groups.length : 0;
		for ( var i = 0; i < max; i += 1 ) {
			var currSubgroupName = group.groups[ i ].name,
				firstEnabled = this.getFirstEnabledButtonInSubgroup( currSubgroupName );

			if ( firstEnabled )
				return firstEnabled;
		}
		return null;
	};

	/**
	 * @param {String} subgroupName
	 * @returns {String|null}
	 */
	ToolbarModifier.prototype.getFirstEnabledButtonInSubgroup = function( subgroupName ) {
		var subgroupBtns = this.fullToolbarEditor.buttonsByGroup[ subgroupName ];

		var max = subgroupBtns ? subgroupBtns.length : 0;
		for ( var i = 0; i < max; i += 1 ) {
			var currBtnName = subgroupBtns[ i ].name;
			if ( !this.isButtonRemoved( currBtnName ) )
				return currBtnName;
		}

		return null;
	};

	/**
	 * Sets up parameters and call adequate action.
	 *
	 * @param {CKEDITOR.dom.element} checkbox
	 * @private
	 */
	ToolbarModifier.prototype._handleCheckboxClicked = function( checkbox ) {
		var closestLi = checkbox.getAscendant( 'li' ),
			elementName = closestLi.data( 'name' ),
			aboutToAddToRemoved = !checkbox.$.checked;

		if ( aboutToAddToRemoved )
			this._addButtonToRemoved( elementName );
		else
			this._removeButtonFromRemoved( elementName );
	};

	/**
	 * Sets up parameters and call adequate action.
	 *
	 * @param {HTMLAnchorElement} anchor
	 * @private
	 */
	ToolbarModifier.prototype._handleAnchorClicked = function( anchor ) {
		var anchorDOM = new CKEDITOR.dom.element( anchor ),
			relativeLi = anchorDOM.getAscendant( 'li' ),
			relativeUl = relativeLi.getAscendant( 'ul' ),
			elementType = relativeLi.data( 'type' ),
			elementName = relativeLi.data( 'name' ),
			direction = anchorDOM.data( 'direction' ),
			nearestLi = ( direction === 'up' ? relativeLi.getPrevious() : relativeLi.getNext() ),
			groupName,
			subgroupName,
			newIndex;

		// nothing to do
		if ( anchorDOM.hasClass( 'disabled' ) )
			return null;

		// remove separator and nothing else
		if ( anchorDOM.hasClass( 'remove' ) ) {
			relativeLi.remove();
			this._removeSeparator( relativeLi.data( 'name' ) );
			this._setActiveElement( null );
			return { action: 'remove' };
		}

		if ( !anchorDOM.hasClass( 'move' ) || !nearestLi )
			return { action: null };

		// move group or separator
		if ( elementType === 'group' || elementType === 'separator' ) {
			groupName = elementName;
			newIndex = this._moveGroup( direction, groupName );
		}

		// move subgroup
		if ( elementType === 'subgroup' ) {
			subgroupName = elementName;
			groupName = relativeLi.getAscendant( 'li' ).data( 'name' );
			newIndex = this._moveSubgroup( direction, groupName, subgroupName );
		}

		// Visual effect
		if ( direction === 'up' )
			relativeLi.insertBefore( relativeUl.getChild( newIndex ) );

		if ( direction === 'down' )
			relativeLi.insertAfter( relativeUl.getChild( newIndex ) );

		// Should know whether there is next li element after modifications.
		var nextLi = relativeLi;

		// We are looking for next li element in list (to check whether current one is the last one)
		var found;
		while ( nextLi = ( direction === 'up' ? nextLi.getPrevious() : nextLi.getNext() ) ) {
			if ( !this.emptyVisible && nextLi.hasClass( 'empty' ) ) {
				continue;
			}

			found = nextLi;
			break;
		}

		// If not found, it means that we reached end.
		if ( !found ) {
			var selector = ( '[data-direction="' + ( direction === 'up' ? 'down' : 'up' ) + '"]' );

			// Shifting direction.
			this.cachedActiveElement = anchorDOM.getParent().findOne( selector );
		}

		this._refreshMoveBtnsAvalibility();
		this._refreshBtnTabIndexes();

		return {
			action: 'move'
		};
	};

	/**
	 * First element can not be moved up, and last element can not be moved down,
	 * so they are disabled.
	 */
	ToolbarModifier.prototype._refreshMoveBtnsAvalibility = function() {
		var that = this,
			disabledBtns = this.mainContainer.find( 'ul[data-type=table-body] li > p > span > button.move.disabled' );

		// enabling all disabled buttons
		var max = disabledBtns.count();
		for ( var i = 0; i < max; i += 1 ) {
			var currentBtn = disabledBtns.getItem( i );
			currentBtn.removeClass( 'disabled' );
		}


		function disableElementsInLists( ulList ) {
			var max = ulList.count();
			for ( i = 0; i < max; i += 1 ) {
				that._disableElementsInList( ulList.getItem( i ) );
			}
		}

		// Disable buttons in toolbars.
		disableElementsInLists( this.mainContainer.find( 'ul[data-type=table-body]' ) );

		// Disable buttons in toolbar groups.
		disableElementsInLists( this.mainContainer.find( 'ul[data-type=table-body] > li > ul' ) );
	};

	/**
	 * @private
	 */
	ToolbarModifier.prototype._refreshBtnTabIndexes = function() {
		var tabindexed = this.mainContainer.find( '[data-tab="true"]' );

		var max = tabindexed.count();
		for ( var i = 0; i < max; i++ ) {
			var item = tabindexed.getItem( i ),
				disabled = item.hasClass( 'disabled' );

			item.setAttribute( 'tabindex', disabled ? -1 : i );
		}
	};

	/**
	 * Disable buttons to move elements up and down which should be disabled.
	 *
	 * @param {CKEDITOR.dom.element} ul
	 * @private
	 */
	ToolbarModifier.prototype._disableElementsInList = function( ul ) {
		var liList = ul.getChildren();

		if ( !liList.count() )
			return;

		var firstDisabled, lastDisabled;
		if ( this.emptyVisible ) {
			firstDisabled = ul.getFirst();
			lastDisabled = ul.getLast();
		} else {
			firstDisabled = ul.getFirst( isNotEmptyChecker );
			lastDisabled = ul.getLast( isNotEmptyChecker );
		}

		function isNotEmptyChecker( element ) {
			return !element.hasClass( 'empty' );
		}

		if ( firstDisabled )
			var firstDisabledBtn = firstDisabled.findOne( 'p button[data-direction="up"]' );

		if ( lastDisabled )
			var lastDisabledBtn = lastDisabled.findOne( 'p button[data-direction="down"]' );

		if ( firstDisabledBtn ) {
			firstDisabledBtn.addClass( 'disabled' );
			firstDisabledBtn.setAttribute( 'tabindex', '-1' );
		}

		if ( lastDisabledBtn ) {
			lastDisabledBtn.addClass( 'disabled' );
			lastDisabledBtn.setAttribute( 'tabindex', '-1' );
		}
	};

	/**
	 * Gets group index in actual config toolbarGroups
	 *
	 * @param {String} name
	 * @returns {Number}
	 */
	ToolbarModifier.prototype.getGroupIndex = function( name ) {
		var groups = this.actualConfig.toolbarGroups;

		var max = groups.length;
		for ( var i = 0; i < max; i += 1 ) {
			if ( groups[ i ].name === name )
				return i;
		}

		return -1;
	};

	/**
	 * Handle adding separator.
	 *
	 * @private
	 */
	ToolbarModifier.prototype._addSeparator = function() {
		var separatorIndex = this._determineSeparatorToAddIndex(),
			separator = ToolbarModifier.createSeparatorLiteral(),
			domSeparator = CKEDITOR.dom.element.createFromHtml( ToolbarModifier.getToolbarSeparatorString( separator ) );

		this.actualConfig.toolbarGroups.splice( separatorIndex, 0, separator );

		domSeparator.insertBefore( this.modifyContainer.findOne( 'ul[data-type=table-body]' ).getChild( separatorIndex ) );

		this._setActiveElement( 'separator', separator.name );
		this._refreshMoveBtnsAvalibility();
		this._refreshBtnTabIndexes();
		this._refreshEditor();
	};

	/**
	 * Handle removing separator.
	 *
	 * @param {String} name
	 */
	ToolbarModifier.prototype._removeSeparator = function( name ) {
		var separatorIndex = CKEDITOR.tools.indexOf( this.actualConfig.toolbarGroups, function( group ) {
			return group.type == 'separator' && group.name == name;
		} );

		this.actualConfig.toolbarGroups.splice( separatorIndex, 1 );

		this._refreshMoveBtnsAvalibility();
		this._refreshBtnTabIndexes();
		this._refreshEditor();
	};

	/**
	 * Determine index where separator should be added, based on currently selected element.
	 *
	 * @returns {Number}
	 * @private
	 */
	ToolbarModifier.prototype._determineSeparatorToAddIndex = function() {
		if ( !this.currentActive )
			return 0;

		var groupLi;
		if ( this.currentActive.elem.data( 'type' ) == 'group' || this.currentActive.elem.data( 'type' ) == 'separator' )
			groupLi = this.currentActive.elem;
		else
			groupLi = this.currentActive.elem.getAscendant( 'li' );

		return groupLi.getIndex();
	};

	/**
	 * @param {Array} elementsArray
	 * @param {Number} elementIndex
	 * @param {String} direction
	 * @returns {Number}
	 * @private
	 */
	ToolbarModifier.prototype._moveElement = function( elementsArray, elementIndex, direction ) {
		var nextIndex;

		if ( this.emptyVisible )
			nextIndex = ( direction == 'down' ? elementIndex + 1 : elementIndex - 1 );
		else {
			// When empty elements are not visible, there is need to skip them.
			nextIndex = ToolbarModifier.getFirstElementIndexWith( elementsArray, elementIndex, direction, isEmptyOrSeparatorChecker );
		}

		function isEmptyOrSeparatorChecker( element ) {
			return element.totalBtns || element.type == 'separator';
		}

		var offset = nextIndex - elementIndex;

		return ToolbarModifier.moveTo( offset, elementsArray, elementIndex );
	};

	/**
	 * Moves group located in config level up or down and refresh editor.
	 *
	 * @param {String} direction
	 * @param {String} groupName
	 * @returns {Number}
	 */
	ToolbarModifier.prototype._moveGroup = function( direction, groupName ) {
		var groupIndex = this.getGroupIndex( groupName ),
			groups = this.actualConfig.toolbarGroups,
			newIndex = this._moveElement( groups, groupIndex, direction );

		this._refreshMoveBtnsAvalibility();
		this._refreshBtnTabIndexes();
		this._refreshEditor();

		return newIndex;
	};

	/**
	 * Moves subgroup located in config level up or down and refresh editor.
	 *
	 * @param {String} direction
	 * @param {String} groupName
	 * @param {String} subgroupName
	 * @private
	 */
	ToolbarModifier.prototype._moveSubgroup = function( direction, groupName, subgroupName ) {
		var groupIndex = this.getGroupIndex( groupName ),
			groups = this.actualConfig.toolbarGroups,
			group = groups[ groupIndex ],
			subgroupIndex = CKEDITOR.tools.indexOf( group.groups, function( subgroup ) {
				return subgroup.name == subgroupName;
			} ),
			newIndex = this._moveElement( group.groups, subgroupIndex, direction );

		this._refreshEditor();

		return newIndex;
	};

	/**
	 * Set `totalBtns` property in `actualConfig.toolbarGroups` elements.
	 *
	 * @private
	 */
	ToolbarModifier.prototype._calculateTotalBtns = function() {
		var groups = this.actualConfig.toolbarGroups;

		var i = groups.length;
		// from the end
		while ( i-- ) {
			var currentGroup = groups[ i ],
				totalBtns = ToolbarModifier.getTotalGroupButtonsNumber( currentGroup, this.fullToolbarEditor );

			if ( currentGroup.type == 'separator' ) {
				// nothing to do with separator
				continue;
			}

			currentGroup.totalBtns = totalBtns;
		}
	};

	/**
	 * Add button to removeButtons field in config and refresh editor.
	 *
	 * @param {String} buttonName
	 * @private
	 */
	ToolbarModifier.prototype._addButtonToRemoved = function( buttonName ) {
		if ( CKEDITOR.tools.indexOf( this.removedButtons, buttonName ) != -1 )
			throw 'Button already added to removed';

		this.removedButtons.push( buttonName );
		this.actualConfig.removeButtons = this.removedButtons.join( ',' );
		this._refreshEditor();
	};

	/**
	 * Remove button from removeButtons field in config and refresh editor.
	 *
	 * @param {String} buttonName
	 * @private
	 */
	ToolbarModifier.prototype._removeButtonFromRemoved = function( buttonName ) {
		var foundAtIndex =  CKEDITOR.tools.indexOf( this.removedButtons, buttonName );

		if ( foundAtIndex === -1 )
			throw 'Trying to remove button from removed, but not found';

		this.removedButtons.splice( foundAtIndex, 1 );
		this.actualConfig.removeButtons = this.removedButtons.join( ',' );
		this._refreshEditor();
	};

	/**
	 * Parse group "model" to configuration value
	 *
	 * @param {Object} group
	 * @returns {Object}
	 * @static
	 */
	ToolbarModifier.parseGroupToConfigValue = function( group ) {
		if ( group.type == 'separator' ) {
			return '/';
		}

		var groups = group.groups,
			max = groups.length;

		delete group.totalBtns;
		for ( var i = 0; i < max; i += 1 ) {
			groups[ i ] = groups[ i ].name;
		}

		return group;
	};

	/**
	 * Find closest Li ancestor in DOM tree which is group or separator element
	 *
	 * @param {CKEDITOR.dom.element} element
	 * @returns {CKEDITOR.dom.element}
	 * @static
	 */
	ToolbarModifier.getGroupOrSeparatorLiAncestor = function( element ) {
		if ( element.$ instanceof HTMLLIElement && element.data( 'type' ) == 'group' )
			return element;
		else {
			return ToolbarModifier.getFirstAncestor( element, function( ancestor ) {
				var type = ancestor.data( 'type' );

				return ( type == 'group' || type == 'separator' );
			} );
		}
	};

	/**
	 * Create separator literal with unique id.
	 *
	 * @public
	 * @static
	 * @return {Object}
	 */
	ToolbarModifier.createSeparatorLiteral = function() {
		return {
			type: 'separator',
			name: ( 'separator' + CKEDITOR.tools.getNextNumber() )
		};
	};

	/**
	 * Creates HTML unordered list string based on toolbarGroups field in config.
	 *
	 * @returns {String}
	 * @static
	 */
	ToolbarModifier.prototype._toolbarConfigToListString = function() {
		var groups = this.actualConfig.toolbarGroups || [],
			listString = '<ul data-type="table-body">';

		var max = groups.length;
		for ( var i = 0; i < max; i += 1 ) {
			var currentGroup = groups[ i ];

			if ( currentGroup.type === 'separator' )
				listString += ToolbarModifier.getToolbarSeparatorString( currentGroup );
			else
				listString += this._getToolbarGroupString( currentGroup );
		}

		listString += '</ul>';

		var headerString = ToolbarModifier.getToolbarHeaderString();

		return headerString + listString;
	};

	/**
	 * Created HTML group list element based on group field in config.
	 *
	 * @param {Object} group
	 * @returns {String}
	 * @private
	 */
	ToolbarModifier.prototype._getToolbarGroupString = function( group ) {
		var subgroups = group.groups,
			groupString = '';

		groupString += [
			'<li ',
				'data-type="group" ',
				'data-name="', group.name, '" ',
				( group.totalBtns ? '' : 'class="empty"' ),
			'>'
		].join( '' );
		groupString += ToolbarModifier.getToolbarElementPreString( group ) + '<ul>';

		var max = subgroups.length;

		for ( var i = 0; i < max; i += 1 ) {
			var currentSubgroup = subgroups[ i ],
				subgroupBtns = this.fullToolbarEditor.buttonsByGroup[ currentSubgroup.name ];

			groupString += this._getToolbarSubgroupString( currentSubgroup, subgroupBtns );
		}
		groupString += '</ul></li>';

		return groupString;
	};

	/**
	 * @param {Object} separator
	 * @returns {String}
	 * @static
	 */
	ToolbarModifier.getToolbarSeparatorString = function( separator ) {
		return [
			'<li ',
			'data-type="', separator.type , '" ',
			'data-name="', separator.name , '"',
			'>',
			ToolbarModifier.getToolbarElementPreString( 'row separator' ),
			'</li>'
		].join( '' );
	};

	/**
	 * @returns {string}
	 */
	ToolbarModifier.getToolbarHeaderString = function() {
		return '<ul data-type="table-header">' +
			'<li data-type="header">' +
				'<p>Toolbars</p>' +
				'<ul>' +
					'<li>' +
						'<p>Toolbar groups</p>' +
						'<p>Toolbar group items</p>' +
					'</li>' +
				'</ul>' +
			'</li>' +
		'</ul>';
	};

	/**
	 * Find and return first ancestor of element provided in first argument
	 * which match the criteria checked in function provided in second argument.
	 *
	 * @param {CKEDITOR.dom.element} element
	 * @param {Function} checker
	 * @returns {CKEDITOR.dom.element|null}
	 */
	ToolbarModifier.getFirstAncestor = function( element, checker ) {
		var ancestors = element.getParents(),
			i = ancestors.length;

		while ( i-- ) {
			if ( checker( ancestors[ i ] ) )
				return ancestors[ i ];
		}

		return null;
	};

	/**
	 * Looking through array elements start from index provided in second argument
	 * and go 'up' or 'down' in array
	 * last argument is condition checker which should return Boolean value
	 *
	 * User cases:
	 *
	 * ToolbarModifier.getFirstElementIndexWith( [3, 4, 8, 1, 4], 2, 'down', function( elem ) { return elem == 4; } ); // 4
	 * ToolbarModifier.getFirstElementIndexWith( [3, 4, 8, 1, 4], 2, 'up', function( elem ) { return elem == 4; } ); // 1
	 *
	 * @param {Array} array
	 * @param {Number} i
	 * @param {String} direction 'up' or 'down'
	 * @param {Function} conditionChecker
	 * @static
	 * @returns {Number} index of found element
	 */
	ToolbarModifier.getFirstElementIndexWith = function( array, i, direction, conditionChecker ) {
		function whileChecker() {
			var result;
			if ( direction === 'up' )
				result = i--;
			else
				result = ( ++i < array.length );

			return result;
		}

		while ( whileChecker() ) {
			if ( conditionChecker( array[ i ] ) )
				return i;

		}

		return -1;
	};

	/**
	 * Moves array element at index level up or down.
	 *
	 * @static
	 * @param {String} direction
	 * @param {Array} array
	 * @param {Number} index
	 * @returns {Number}
	 */
	ToolbarModifier.moveTo = function( offset, array, index ) {
		var element, newIndex;

		if ( index !== -1 )
			element = array.splice( index, 1 )[ 0 ];

		newIndex = index + offset;

		array.splice( newIndex, 0, element );

		return newIndex;
	};

	/**
	 * @static
	 * @param {Object} subgroup
	 * @returns {Number}
	 */
	ToolbarModifier.getTotalSubGroupButtonsNumber = function( subgroup, fullToolbarEditor ) {
		var subgroupName = ( typeof subgroup == 'string' ? subgroup : subgroup.name ),
			subgroupBtns = fullToolbarEditor.buttonsByGroup[ subgroupName ];

		return ( subgroupBtns ? subgroupBtns.length : 0 );
	};

	/**
	 * Returns all buttons number in group which are nested in subgroups also.
	 *
	 * @param {Object} group
	 * @param {ToolbarModifier.FullToolbarEditor}
	 * @static
	 * @returns {Number}
	 */
	ToolbarModifier.getTotalGroupButtonsNumber = function( group, fullToolbarEditor ) {
		var total = 0,
			subgroups = group.groups;

		var max = subgroups ? subgroups.length : 0;
		for ( var i = 0; i < max; i += 1 )
			total += ToolbarModifier.getTotalSubGroupButtonsNumber( subgroups[ i ], fullToolbarEditor );

		return total;
	};

	/**
	 * Creates HTML subgroup list element based on subgroup field in config.
	 *
	 * @param {Object} subgroup
	 * @param {Array} groupBtns
	 * @returns {String}
	 * @private
	 */
	ToolbarModifier.prototype._getToolbarSubgroupString = function( subgroup, groupBtns ) {
		var subgroupString = '';

		subgroupString += [
			'<li ',
				'data-type="subgroup" ',
				'data-name="', subgroup.name, '" ',
				( subgroup.totalBtns ? '' : 'class="empty" ' ),
			'>'
		].join( '' );
		subgroupString += ToolbarModifier.getToolbarElementPreString( subgroup.name );
		subgroupString += '<ul>';

		var max = groupBtns ? groupBtns.length : 0;
		for ( var i = 0; i < max; i += 1 )
			subgroupString += this.getButtonString( groupBtns[ i ] );

		subgroupString += '</ul>';

		subgroupString += '</li>';

		return subgroupString;
	};

	/**
	 * @param {String} buttonName
	 * @returns {String|null}
	 * @private
	 */
	ToolbarModifier.prototype._getConfigButtonName = function( buttonName ) {
		var items = this.fullToolbarEditor.editorInstance.ui.items;

		var name;
		for ( name in items ) {
			if ( items[ name ].name == buttonName )
				return name;
		}

		return null;
	};

	/**
	 * @param {String} buttonName
	 * @returns {Boolean}
	 */
	ToolbarModifier.prototype.isButtonRemoved = function( buttonName ) {
		return CKEDITOR.tools.indexOf( this.removedButtons, this._getConfigButtonName( buttonName ) ) != -1;
	};

	/**
	 * @param {CKEDITOR.ui.button/CKEDITOR.ui.richCombo} button
	 * @returns {String}
	 * @public
	 */
	ToolbarModifier.prototype.getButtonString = function( button ) {
		var checked = ( this.isButtonRemoved( button.name ) ? '' : 'checked="checked"' );

		return [
			'<li data-tab="true" data-type="button" data-name="', this._getConfigButtonName( button.name ), '">',
				'<label title="', button.label, '" >',
					'<input ',
						'tabindex="-1"',
						'type="checkbox"',
						checked,
					'/>',
					button.$.getOuterHtml(),
				'</label>',
			'</li>'
		].join( '' );
	};

	/**
	 * Creates group header string.
	 *
	 * @param {Object|String} group
	 * @returns {String}
	 * @static
	 */
	ToolbarModifier.getToolbarElementPreString = function( group ) {
		var name = ( group.name ? group.name : group );

		return [
			'<p>',
				'<span>',
					'<button title="Move element upward" data-tab="true" data-direction="up" class="move icon-up-big"></button>',
					'<button title="Move element downward" data-tab="true" data-direction="down" class="move icon-down-big"></button>',
					( name == 'row separator' ? '<button title="Remove element" data-tab="true" class="remove icon-trash"></button>' : '' ),
					name,
				'</span>',
			'</p>'
		].join( '' );
	};

	/**
	 * @static
	 * @param {String} cfg
	 * @returns {String}
	 */
	ToolbarModifier.evaluateToolbarGroupsConfig = function( cfg ) {
		cfg = ( function( cfg ) {
			var config = {}, result;

			/*jshint -W002 */
			try {
				result = eval( '(' + cfg + ')' );
			} catch ( e ) {
				try {
					result = eval( cfg );
				} catch ( e ) {
					return null;
				}
			}
			/*jshint +W002 */

			if ( config.toolbarGroups && typeof config.toolbarGroups.length === 'number' ) {
				return JSON.stringify( config );
			} else if ( result && typeof result.length === 'number' ) {
				return JSON.stringify( { toolbarGroups: result } );
			} else if ( result && result.toolbarGroups ) {
				return JSON.stringify( result );
			} else {
				return null;
			}

		}( cfg ) );

		return cfg;
	};

	return ToolbarModifier;
} )();

