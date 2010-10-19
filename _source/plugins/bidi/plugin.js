/*
Copyright (c) 2003-2010, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

(function() {
	var guardElements = { table:1,ul:1,ol:1,blockquote:1,div:1 },
		directSelectionGuardElements = {};
	CKEDITOR.tools.extend( directSelectionGuardElements, guardElements, { tr:1,p:1,div:1,li:1 } );

	function onSelectionChange( evt ) {
		var editor = evt.editor,
			path = evt.data.path;
		var useComputedState = editor.config.useComputedState,
			selectedElement;

		useComputedState = useComputedState === undefined || useComputedState;

		if ( useComputedState ) {
			var selection = editor.getSelection(),
				ranges = selection.getRanges();

			selectedElement = ranges && ranges[ 0 ].getEnclosedNode();

			// If this is not our element of interest, apply to fully selected elements from guardElements.
			if ( !selectedElement || selectedElement && !( selectedElement.type == CKEDITOR.NODE_ELEMENT && selectedElement.getName() in directSelectionGuardElements ) )
				selectedElement = getFullySelected( selection, guardElements );
		}

		selectedElement = selectedElement || path.block || path.blockLimit;

		if ( !selectedElement || selectedElement.getName() == 'body' )
			return;

		var selectionDir = useComputedState ? selectedElement.getComputedStyle( 'direction' ) : selectedElement.getStyle( 'direction' ) || selectedElement.getAttribute( 'dir' );

		editor.getCommand( 'bidirtl' ).setState( selectionDir == 'rtl' ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF );
		editor.getCommand( 'bidiltr' ).setState( selectionDir == 'ltr' ? CKEDITOR.TRISTATE_ON : CKEDITOR.TRISTATE_OFF );

		var chromeRoot = editor.container.getChild( 1 );

		if ( selectionDir != editor.lang.dir )
			chromeRoot.addClass( 'cke_mixed_dir_content' );
		else
			chromeRoot.removeClass( 'cke_mixed_dir_content' );
	}

	function switchDir( element, dir, editor, state ) {
		var dirBefore = element.getComputedStyle( 'direction' );

		element.removeStyle( 'direction' );
		element.removeAttribute( 'dir' );

		if ( state == CKEDITOR.TRISTATE_OFF && element.getComputedStyle( 'direction' ).toLowerCase() != dir )
			element.setAttribute( 'dir', dir );

		// If the element direction changed, we need to switch the margins of
		// the element and all its children, so it will get really reflected
		// like a mirror. (#5910)
		var dirAfter = element.getComputedStyle( 'direction' );
		if ( dirAfter != dirBefore )
			editor.fire( 'dirChanged', element );

		editor.forceNextSelectionCheck();
	}

	function getFullySelected( selection, elements ) {
		var selectedElement = selection.getCommonAncestor();
		while ( selectedElement.type == CKEDITOR.NODE_ELEMENT && !( selectedElement.getName() in elements ) && selectedElement.getParent().getChildCount() == 1 )
			selectedElement = selectedElement.getParent();

		return selectedElement.type == CKEDITOR.NODE_ELEMENT && ( selectedElement.getName() in elements ) && selectedElement;
	}

	function bidiCommand( dir ) {
		return function( editor ) {
			var selection = editor.getSelection(),
				enterMode = editor.config.enterMode,
				ranges = selection.getRanges();

			if ( ranges && ranges.length ) {
				// Apply do directly selected elements from guardElements.
				var selectedElement = ranges[ 0 ].getEnclosedNode();

				// If this is not our element of interest, apply to fully selected elements from guardElements.
				if ( !selectedElement || selectedElement && !( selectedElement.type == CKEDITOR.NODE_ELEMENT && selectedElement.getName() in directSelectionGuardElements ) )
					selectedElement = getFullySelected( selection, guardElements );

				if ( selectedElement ) {
					if ( !selectedElement.isReadOnly() )
						switchDir( selectedElement, dir, editor, this.state );
				} else {
					// Creates bookmarks for selection, as we may split some blocks.
					var bookmarks = selection.createBookmarks();

					var iterator, block;

					for ( var i = ranges.length - 1; i >= 0; i-- ) {
						// Array of elements processed as guardElements.
						var processedElements = [];
						// Walker searching for guardElements.
						var walker = new CKEDITOR.dom.walker( ranges[ i ] );
						walker.evaluator = function( node ) {
							return node.type == CKEDITOR.NODE_ELEMENT && node.getName() in guardElements && !( node.getName() == ( enterMode == CKEDITOR.ENTER_P ) ? 'p' : 'div' && node.getParent().type == CKEDITOR.NODE_ELEMENT && node.getParent().getName() == 'blockquote' );
						};

						while ( ( block = walker.next() ) ) {
							switchDir( block, dir, editor, this.state );
							processedElements.push( block );
						}

						iterator = ranges[ i ].createIterator();
						iterator.enlargeBr = enterMode != CKEDITOR.ENTER_BR;

						while ( ( block = iterator.getNextParagraph( enterMode == CKEDITOR.ENTER_P ? 'p' : 'div' ) ) ) {
							if ( block.isReadOnly() )
								continue;

							var _break = 0;

							// Check if block have been already processed by the walker above.
							for ( var ii = 0; ii < processedElements.length; ii++ ) {
								var parent = block.getParent();

								while ( parent && parent.getName() != 'body' ) {
									if ( ( parent.$.isSameNode && parent.$.isSameNode( processedElements[ ii ].$ ) ) || parent.$ == processedElements[ ii ].$ ) {
										_break = 1;
										break;
									}
									parent = parent.getParent();
								}

								if ( _break )
									break;
							}

							if ( !_break ) {
								switchDir( block, dir, editor, this.state );
							}
						}
					}

					editor.forceNextSelectionCheck();
					// Restore selection position.
					selection.selectBookmarks( bookmarks );
				}

				editor.focus();
			}
		};
	}

	CKEDITOR.plugins.add( 'bidi', {
		requires: [ 'styles', 'button' ],

		init: function( editor ) {
			// All buttons use the same code to register. So, to avoid
			// duplications, let's use this tool function.
			var addButtonCommand = function( buttonName, buttonLabel, commandName, commandExec ) {
					editor.addCommand( commandName, new CKEDITOR.command( editor, { exec: commandExec } ) );

					editor.ui.addButton( buttonName, {
						label: buttonLabel,
						command: commandName
					});
				};

			var lang = editor.lang.bidi;

			addButtonCommand( 'BidiLtr', lang.ltr, 'bidiltr', bidiCommand( 'ltr' ) );
			addButtonCommand( 'BidiRtl', lang.rtl, 'bidirtl', bidiCommand( 'rtl' ) );

			editor.on( 'selectionChange', onSelectionChange );
		}
	});

})();
