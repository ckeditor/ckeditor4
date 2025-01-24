/*
 * Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

( function() {

	// Add to collection with DUP examination.
	// @param {Object} collection
	// @param {Object} element
	// @param {Object} database
	function addSafely( collection, element, database ) {
		// 1. IE doesn't support customData on text nodes;
		// 2. Text nodes never get chance to appear twice;
		if ( !element.is || !element.getCustomData( 'block_processed' ) ) {
			element.is && CKEDITOR.dom.element.setMarker( database, element, 'block_processed', true );
			collection.push( element );
		}
	}

	// Dialog reused by both 'creatediv' and 'editdiv' commands.
	// @param {Object} editor
	// @param {String} command	The command name which indicate what the current command is.
	function divDialog( editor, command ) {
		// Definition of elements at which div operation should stopped.
		var divLimitDefinition = ( function() {

			// Customzie from specialize blockLimit elements
			var definition = CKEDITOR.tools.extend( {}, CKEDITOR.dtd.$blockLimit );

			if ( editor.config.div_wrapTable ) {
				delete definition.td;
				delete definition.th;
			}
			return definition;
		} )();

		// DTD of 'div' element
		var dtd = CKEDITOR.dtd.div;

		// Get the first div limit element on the element's path.
		// @param {Object} element
		function getDivContainer( element ) {
			var container = editor.elementPath( element ).blockLimit;

			// Never consider read-only (i.e. contenteditable=false) element as
			// a first div limit (https://dev.ckeditor.com/ticket/11083).
			if ( container.isReadOnly() )
				container = container.getParent();

			// Dont stop at 'td' and 'th' when div should wrap entire table.
			if ( editor.config.div_wrapTable && container.is( [ 'td', 'th' ] ) ) {
				var parentPath = editor.elementPath( container.getParent() );
				container = parentPath.blockLimit;
			}

			return container;
		}

		// Init all fields' setup/commit function.
		// @memberof divDialog
		function setupFields() {
			this.foreach( function( field ) {
				// Exclude layout container elements
				if ( /^(?!vbox|hbox)/.test( field.type ) ) {
					if ( !field.setup ) {
						// Read the dialog fields values from the specified
						// element attributes.
						field.setup = function( element ) {
							field.setValue( element.getAttribute( field.id ) || '', 1 );
						};
					}
					if ( !field.commit ) {
						// Set element attributes assigned by the dialog
						// fields.
						field.commit = function( element ) {
							var fieldValue = this.getValue();
							// ignore default element attribute values
							if ( field.id == 'dir' && element.getComputedStyle( 'direction' ) == fieldValue ) {
								return;
							}

							if ( fieldValue )
								element.setAttribute( field.id, fieldValue );
							else
								element.removeAttribute( field.id );
						};
					}
				}
			} );
		}

		// Wrapping 'div' element around appropriate blocks among the selected ranges.
		// @param {Object} editor
		function createDiv( editor ) {
			// new adding containers OR detected pre-existed containers.
			var containers = [];
			// node markers store.
			var database = {};
			// All block level elements which contained by the ranges.
			var containedBlocks = [],
				block;

			// Get all ranges from the selection.
			var selection = editor.getSelection(),
				ranges = selection.getRanges();
			var bookmarks = selection.createBookmarks();
			var i, iterator;

			// collect all included elements from dom-iterator
			for ( i = 0; i < ranges.length; i++ ) {
				iterator = ranges[ i ].createIterator();
				while ( ( block = iterator.getNextParagraph() ) ) {
					// include contents of blockLimit elements.
					if ( block.getName() in divLimitDefinition && !block.isReadOnly() ) {
						var j,
							childNodes = block.getChildren();
						for ( j = 0; j < childNodes.count(); j++ )
							addSafely( containedBlocks, childNodes.getItem( j ), database );
					} else {
						while ( !dtd[ block.getName() ] && !block.equals( ranges[ i ].root ) )
							block = block.getParent();
						addSafely( containedBlocks, block, database );
					}
				}
			}

			CKEDITOR.dom.element.clearAllMarkers( database );

			var blockGroups = groupByDivLimit( containedBlocks );
			var ancestor, divElement;

			for ( i = 0; i < blockGroups.length; i++ ) {
				// Sometimes we could get empty block group if all elements inside it
				// don't have parent's nodes (https://dev.ckeditor.com/ticket/13585).
				if ( !blockGroups[ i ].length ) {
					continue;
				}

				var currentNode = blockGroups[ i ][ 0 ];

				// Calculate the common parent node of all contained elements.
				ancestor = currentNode.getParent();
				for ( j = 1; j < blockGroups[ i ].length; j++ ) {
					ancestor = ancestor.getCommonAncestor( blockGroups[ i ][ j ] );
				}

				// If there is no ancestor, mark editable as one (https://dev.ckeditor.com/ticket/13585).
				if ( !ancestor ) {
					ancestor = editor.editable();
				}

				divElement = new CKEDITOR.dom.element( 'div', editor.document );

				// Normalize the blocks in each group to a common parent.
				for ( j = 0; j < blockGroups[ i ].length; j++ ) {
					currentNode = blockGroups[ i ][ j ];

					// Check if the currentNode has a parent before attempting to operate on it (https://dev.ckeditor.com/ticket/13585).
					while ( currentNode.getParent() && !currentNode.getParent().equals( ancestor ) ) {
						currentNode = currentNode.getParent();
					}

					// This could introduce some duplicated elements in array.
					blockGroups[ i ][ j ] = currentNode;
				}

				// Wrapped blocks counting
				for ( j = 0; j < blockGroups[ i ].length; j++ ) {
					currentNode = blockGroups[ i ][ j ];

					// Avoid DUP elements introduced by grouping.
					if ( !( currentNode.getCustomData && currentNode.getCustomData( 'block_processed' ) ) ) {
						currentNode.is && CKEDITOR.dom.element.setMarker( database, currentNode, 'block_processed', true );

						// Establish new container, wrapping all elements in this group.
						if ( !j ) {
							divElement.insertBefore( currentNode );
						}

						divElement.append( currentNode );
					}
				}

				CKEDITOR.dom.element.clearAllMarkers( database );
				containers.push( divElement );
			}

			selection.selectBookmarks( bookmarks );
			return containers;
		}

		// Divide a set of nodes to different groups by their path's blocklimit element.
		// Note: the specified nodes should be in source order naturally, which mean they are supposed to producea by following class:
		//  * CKEDITOR.dom.range.Iterator
		//  * CKEDITOR.dom.domWalker
		// @returns {Array[]} the grouped nodes
		function groupByDivLimit( nodes ) {
			var groups = [],
				lastDivLimit = null,
				block;

			for ( var i = 0; i < nodes.length; i++ ) {
				block = nodes[ i ];
				var limit = getDivContainer( block );
				if ( !limit.equals( lastDivLimit ) ) {
					lastDivLimit = limit;
					groups.push( [] );
				}

				// Sometimes we got nodes that are not inside the DOM, which causes error (https://dev.ckeditor.com/ticket/13585).
				if ( block.getParent() ) {
					groups[ groups.length - 1 ].push( block );
				}
			}

			return groups;
		}

		// Synchronous field values to other impacted fields is required, e.g. div styles
		// change should also alter inline-style text.
		function commitInternally( targetFields ) {
			var dialog = this.getDialog(),
				model = dialog.getModel( editor ),
				element = model && model.clone() || new CKEDITOR.dom.element( 'div', editor.document );

			// Commit this field and broadcast to target fields.
			this.commit( element, true );

			targetFields = [].concat( targetFields );
			var length = targetFields.length,
				field;
			for ( var i = 0; i < length; i++ ) {
				field = dialog.getContentElement.apply( dialog, targetFields[ i ].split( ':' ) );
				field && field.setup && field.setup( element, true );
			}
		}


		// Registered 'CKEDITOR.style' instances.
		var styles = {};

		// Hold a collection of created block container elements.
		var containers = [];

		// @type divDialog
		return {
			title: editor.lang.div.title,
			minWidth: 400,
			minHeight: 165,
			contents: [ {
				id: 'info',
				label: editor.lang.common.generalTab,
				title: editor.lang.common.generalTab,
				elements: [ {
					type: 'hbox',
					widths: [ '50%', '50%' ],
					children: [ {
						id: 'elementStyle',
						type: 'select',
						style: 'width: 100%;',
						label: editor.lang.div.styleSelectLabel,
						'default': '',
						// Options are loaded dynamically.
						items: [
							[ editor.lang.common.notSet, '' ]
						],
						onChange: function() {
							commitInternally.call( this, [ 'info:elementStyle', 'info:class', 'advanced:dir', 'advanced:style' ] );
						},
						setup: function( element ) {
							for ( var name in styles )
								styles[ name ].checkElementRemovable( element, true, editor ) && this.setValue( name, 1 );
						},
						commit: function( element ) {
							var styleName;
							if ( ( styleName = this.getValue() ) ) {
								var style = styles[ styleName ];
								style.applyToObject( element, editor );
							}
							else {
								element.removeAttribute( 'style' );
							}
						}
					},
					{
						id: 'class',
						type: 'text',
						requiredContent: 'div(cke-xyz)', // Random text like 'xyz' will check if all are allowed.
						label: editor.lang.common.cssClass,
						'default': ''
					} ]
				} ]
			},
			{
				id: 'advanced',
				label: editor.lang.common.advancedTab,
				title: editor.lang.common.advancedTab,
				elements: [ {
					type: 'vbox',
					padding: 1,
					children: [ {
						type: 'hbox',
						widths: [ '50%', '50%' ],
						children: [ {
							type: 'text',
							id: 'id',
							requiredContent: 'div[id]',
							label: editor.lang.common.id,
							'default': ''
						},
						{
							type: 'text',
							id: 'lang',
							requiredContent: 'div[lang]',
							label: editor.lang.common.langCode,
							'default': ''
						} ]
					},
					{
						type: 'hbox',
						children: [ {
							type: 'text',
							id: 'style',
							requiredContent: 'div{cke-xyz}', // Random text like 'xyz' will check if all are allowed.
							style: 'width: 100%;',
							label: editor.lang.common.cssStyle,
							'default': '',
							commit: function( element ) {
								element.setAttribute( 'style', this.getValue() );
							}
						} ]
					},
					{
						type: 'hbox',
						children: [ {
							type: 'text',
							id: 'title',
							requiredContent: 'div[title]',
							style: 'width: 100%;',
							label: editor.lang.common.advisoryTitle,
							'default': ''
						} ]
					},
					{
						type: 'select',
						id: 'dir',
						requiredContent: 'div[dir]',
						style: 'width: 100%;',
						label: editor.lang.common.langDir,
						'default': '',
						items: [
							[ editor.lang.common.notSet, '' ],
							[ editor.lang.common.langDirLtr, 'ltr' ],
							[ editor.lang.common.langDirRtl, 'rtl' ]
						]
					} ] }
				]
			} ],

			getModel: function( editor ) {
				if ( command === 'editdiv' ) {
					return CKEDITOR.plugins.div.getSurroundDiv( editor );
				}

				return null;
			},
			onLoad: function() {
				setupFields.call( this );

				// Preparing for the 'elementStyle' field.
				var dialog = this,
					stylesField = this.getContentElement( 'info', 'elementStyle' );

				// Reuse the 'stylescombo' plugin's styles definition.
				editor.getStylesSet( function( stylesDefinitions ) {
					var styleName, style;

					if ( stylesDefinitions ) {
						// Digg only those styles that apply to 'div'.
						for ( var i = 0; i < stylesDefinitions.length; i++ ) {
							var styleDefinition = stylesDefinitions[ i ];
							if ( styleDefinition.element && styleDefinition.element == 'div' ) {
								styleName = styleDefinition.name;
								styles[ styleName ] = style = new CKEDITOR.style( styleDefinition );

								if ( editor.filter.check( style ) ) {
									// Populate the styles field options with style name.
									stylesField.items.push( [ styleName, styleName ] );
									stylesField.add( styleName, styleName );
								}
							}
						}
					}

					// We should disable the content element
					// it if no options are available at all.
					stylesField[ stylesField.items.length > 1 ? 'enable' : 'disable' ]();

					// Now setup the field value manually if dialog was opened on element. (https://dev.ckeditor.com/ticket/9689)
					setTimeout( function() {
						var model = dialog.getModel( editor );
						if ( model ) {
							stylesField.setup( model );
						}
					}, 0 );
				} );
			},
			onShow: function() {
				// Whether always create new container regardless of existed
				// ones.
				if ( command == 'editdiv' ) {
					// Try to discover the containers that already existed in
					// ranges
					// update dialog field values
					this.setupContent( this.getModel( editor ) );
				}
			},
			onOk: function() {
				if ( command == 'editdiv' ) {
					containers = [ this.getModel( editor ) ];
				} else {
					containers = createDiv( editor, true );
				}

				// Update elements attributes
				var size = containers.length;
				for ( var i = 0; i < size; i++ ) {
					this.commitContent( containers[ i ] );

					// Remove empty 'style' attribute.
					!containers[ i ].getAttribute( 'style' ) && containers[ i ].removeAttribute( 'style' );
				}

				this.hide();
			},
			onHide: function() {
				// Remove style only when editing existing DIV. (https://dev.ckeditor.com/ticket/6315)
				if ( this.getMode( editor ) === CKEDITOR.dialog.EDITING_MODE ) {
					this.getModel( editor ).removeCustomData( 'elementStyle' );
				}
			}
		};
	}

	CKEDITOR.dialog.add( 'creatediv', function( editor ) {
		return divDialog( editor, 'creatediv' );
	} );

	CKEDITOR.dialog.add( 'editdiv', function( editor ) {
		return divDialog( editor, 'editdiv' );
	} );

} )();

/**
 * Whether to wrap the entire table instead of individual cells when creating a `<div>` in a table cell.
 *
 *		config.div_wrapTable = true;
 *
 * @cfg {Boolean} [div_wrapTable=false]
 * @member CKEDITOR.config
 */
