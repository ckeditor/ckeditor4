/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

( function() {
	'use strict';

	function convertElementToStyle( element ) {
		var attributes = {},
			styles = CKEDITOR.tools.parseCssText( element.getAttribute( 'style' ) ),
			// From which elements styles shouldn't be copied.
			elementsToExclude = [ 'p', 'div', 'body', 'html' ];

		if ( CKEDITOR.tools.indexOf( elementsToExclude, element.getName() ) !== -1 ) {
			return;
		}

		// Create attributes dictionary
		var attrDefs = element.$.attributes;
		for ( var i = 0; i < attrDefs.length; i++ ) {
			attributes[ attrDefs[ i ].name ] = attrDefs[ i ].value;
		}

		return new CKEDITOR.style( {
			element: element.getName(),
			type: CKEDITOR.STYLE_INLINE,
			attributes: attributes,
			styles: styles
		} );
	}

	function extractStylesFromElement( element ) {
		var styles = [ convertElementToStyle( element ) ];

		while ( ( element = element.getParent() ) && element.type === CKEDITOR.NODE_ELEMENT ) {
			var style = convertElementToStyle( element );
			style && styles.push(  style );
		}

		return styles;
	}

	// Get offsets and elements for selected word.
	// It handles also cases like lu<span style="color: #f00;">n</span>ar.
	function getSelectedWordOffset( range ) {
		var regex = /\b\w+\b/ig,
			contents, match,
			node, startNode, endNode,
			startOffset, endOffset;

		node = startNode = endNode = range.startContainer;

		// Get the word beggining/ending from previous/next node with content (skipping empty nodes and bookmarks)
		function getSiblingNodeOffset( isPrev ) {
			var getSibling = isPrev ? 'getPrevious' : 'getNext',
				currentNode = node,
				regex = /\b/g,
				contents, match;

				do {
					currentNode = currentNode[ getSibling ]();

					// If there is no sibling, text is probably inside element, so get it.
					if ( !currentNode ) {
						currentNode = node.getParent();
					}
				} while ( currentNode && currentNode.getStyle &&
					( currentNode.getStyle( 'display' ) == 'none' || !currentNode.getText() ) );

				// If the node is element, get its HTML and strip all tags and then search for
				// word boundaries. In node.getText tags are replaced by spaces, which breaks
				// getting the right offset.
				contents = currentNode.type == CKEDITOR.NODE_ELEMENT ?
							currentNode.getHtml().replace( /<.*>/g, '' ) : currentNode.getText();

				// If we search for next node, skip the first match (boundary at the start of word)
				if ( !isPrev ) {
					regex.lastIndex = 1;
				}
				match = regex.exec( contents );

				return {
					node: currentNode,
					offset: isPrev ? regex.lastIndex : ( match ? match.index : contents.length )
				};
		}

		contents = node.getText();

		while( ( match = regex.exec( contents ) ) != null ) {
			if ( match.index + match[ 0 ].length >= range.startOffset ) {
				var start = match.index,
					end = match.index + match[ 0 ].length;

				startOffset = match.index;
				endOffset = match.index + match[ 0 ].length;
				// The word probably begins in previous node.
				if ( match.index == 0 ) {
					var startInfo = getSiblingNodeOffset( true );

					startNode = startInfo.node;
					startOffset = startInfo.offset;
				}

				// The word probably ends in next node
				if ( match.index + match[ 0 ].length == range.endOffset ) {
					var endInfo = getSiblingNodeOffset();

					endNode = endInfo.node;
					endOffset = endInfo.offset;
				}

				return {
					startNode: startNode,
					startOffset: startOffset,
					endNode: endNode,
					endOffset: endOffset
				}
			}
		}

		return null;
	}

	function applyFormat( styles, editor ) {
		var range = editor.getSelection().getRanges()[ 0 ],
			bkms = editor.getSelection().createBookmarks();

		if ( !range ) {
			return;
		}

		if ( range.collapsed ) {
			var newRange = editor.createRange(),
				word = getSelectedWordOffset( range );

			if ( !word ) {
				return;
			}

			newRange.setStart( word.startNode, word.startOffset );
			newRange.setEnd( word.endNode, word.endOffset );
			newRange.select();
		}

		for ( var i = 0; i < styles.length; i++) {
			styles[ i ].apply( editor );
		}

		editor.getSelection().selectBookmarks( bkms );
	}

	var commandDefinition = {
		exec: function( editor ) {
			var	cmd = this;

			if ( cmd.state === CKEDITOR.TRISTATE_ON ) {
				return cmd.setState( CKEDITOR.TRISTATE_OFF );
			}

			cmd.styles = extractStylesFromElement( editor.elementPath().lastElement );
			cmd.setState( CKEDITOR.TRISTATE_ON );
		}
	},

	applyCommandDefinition = {
		exec: function( editor ) {
			var cmd = editor.getCommand( 'copyFormatting' );

			if ( cmd.state === CKEDITOR.TRISTATE_OFF ) {
				return;
			}

			applyFormat( cmd.styles, editor );

			cmd.setState( CKEDITOR.TRISTATE_OFF );
		}
	};

	CKEDITOR.plugins.add( 'copyformatting', {
		requires: 'contextmenu',
		lang: 'en',
		icons: 'copyformatting',
		hidpi: true,
		init: function( editor ) {
			editor.addCommand( 'copyFormatting', commandDefinition );
			editor.addCommand( 'applyFormatting', applyCommandDefinition );

			editor.ui.addButton( 'copyFormatting', {
				label: editor.lang.copyformatting.label,
				command: 'copyFormatting',
				toolbar: 'styles,90'
			} );

			editor.addMenuGroup( 'styles' );

			editor.addMenuItem( 'applyStyle', {
				label : editor.lang.copyformatting.menuLabel,
				command: 'applyFormatting',
				group : 'basicstyles',
				order : 1
			} );

			editor.contextMenu.addListener( function() {
				return editor.getCommand( 'copyFormatting').state === CKEDITOR.TRISTATE_ON ? {
					applyStyle : CKEDITOR.TRISTATE_ON
				} : null;
			} );

			editor.on( 'instanceReady', function() {
				editor.editable().on( 'click', function( evt ) {
					var editor = evt.editor || evt.sender.editor;
					editor.execCommand( 'applyFormatting' );
				} );
			} );
		}
	} );
} )();
