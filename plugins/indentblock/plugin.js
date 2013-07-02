/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview Allows block indentation.
 */

(function() {
	'use strict';

	var isListItem, getIndentCssProperty, getNumericalIndentLevel,
		isFirstListItemInPath;

	CKEDITOR.plugins.add( 'indentblock', {
		requires: 'indent',
		init: function( editor ) {
			var globalHelpers = CKEDITOR.plugins.indent;

			// Use global helper functions.
			isListItem = globalHelpers.isListItem;
			getIndentCssProperty = globalHelpers.getIndentCssProperty;
			getNumericalIndentLevel = globalHelpers.getNumericalIndentLevel;
			isFirstListItemInPath = globalHelpers.isFirstListItemInPath;

			// Register commands.
			globalHelpers.registerCommands( editor, {
				indentblock: new commandDefinition( editor, 'indentblock', true ),
				outdentblock: new commandDefinition( editor, 'outdentblock' )
			} );

			function commandDefinition( editor, name ) {
				globalHelpers.specificDefinition.apply( this, arguments );

				this.allowedContent = {
					'div h1 h2 h3 h4 h5 h6 ol p pre ul': {
						// Do not add elements, but only text-align style if element is validated by other rule.
						propertiesOnly: true,
						styles: !this.useIndentClasses ? 'margin-left,margin-right' : null,
						classes: this.useIndentClasses ? this.indentClasses : null
					}
				};

				if ( this.enterBr )
					this.allowedContent.div = true;

				this.requiredContent = ( this.enterBr ? 'div' : 'p' ) +
					( this.useIndentClasses ?
							'(' + this.indentClasses.join( ',' ) + ')'
						:
							'{margin-left}' );

				// Indent block is a kind of generic indentation. It must
				// be executed after any other indentation commands.
				this.execPriority = 90;

				// Indent and outdent entire list with TAB/SHIFT+TAB key. Indenting can
				// be done only when editor path is in the first child of the list.
				editor.on( 'key', function( evt ) {
					if ( editor.mode != 'wysiwyg' )
						return;

					var key = evt.data.keyCode;

					if ( evt.data.keyCode == this.indentKey && isFirstListItemInPath( editor.elementPath() ) ) {
						// Exec related global indentation command. Global
						// commands take care of bookmarks and selection,
						// so it's much easier to use them instead of
						// content-specific commands.
						editor.execCommand( this.relatedGlobal );

						// Cancel the key event so editor doesn't lose focus.
						evt.cancel();
					}
				}, this );
			}

			CKEDITOR.tools.extend( commandDefinition.prototype, globalHelpers.specificDefinition.prototype, {
				// Elements that, if in an elementpath, will be handled by this
				// command. They restrict the scope of the plugin.
				indentContext: { div: 1, dl: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, ul: 1, ol: 1, p: 1, pre: 1, table: 1 },

				refresh: function( editor, path ) {
					var firstBlock = path.block || path.blockLimit;

					if ( isListItem( firstBlock ) )
						firstBlock = firstBlock.getParent();

					//	- indentContext in the path or ENTER_BR
					//
					// 			Don't try to indent if the element is out of
					//		    this plugin's scope. This assertion is omitted
					//			if ENTER_BR is in use since there may be no block
					//			in the path.
					//
					if ( !this.enterBr && !this.getContext( path ) )
						this.state = CKEDITOR.TRISTATE_DISABLED;

					else if ( this.useIndentClasses ) {
						//	+ indentContext in the path or ENTER_BR
						//	+ IndentClasses
						//
						// 			If there are indentation classes, check if reached
						// 		    the highest level of indentation. If so, disable
						// 		    the command.
						//
						if ( this.checkIndentClassLeft( firstBlock ) )
							this.state = CKEDITOR.TRISTATE_OFF;
						else
							this.state = CKEDITOR.TRISTATE_DISABLED;
					}

					else {
						//	+ indentContext in the path or ENTER_BR
						//	- IndentClasses
						//	+ Indenting
						//
						// 			No indent-level limitations due to indent classes.
						// 		    Indent-like command can always be executed.
						//
						if ( this.isIndent )
							this.state = CKEDITOR.TRISTATE_OFF;

						//	+ indentContext in the path or ENTER_BR
						//	- IndentClasses
						//	- Indenting
						//	- Block in the path
						//
						// 			No block in path. There's no element to apply indentation
						// 		    so disable the command.
						//
						else if ( !firstBlock )
							this.state = CKEDITOR.TRISTATE_DISABLED;

						//	+ indentContext in the path or ENTER_BR
						//	- IndentClasses
						//	- Indenting
						//	+ Block in path.
						//
						// 			Not using indentClasses but there is firstBlock.
						//		    We can calculate current indentation level and
						//			try to increase/decrease it.
						//
						else {
							var indent = getNumericalIndentLevel( firstBlock );

							if ( isNaN( indent ) )
								indent = 0;

							if ( indent <= 0 )
								this.state = CKEDITOR.TRISTATE_DISABLED;
							else
								this.state = CKEDITOR.TRISTATE_OFF;
						}
					}
				},

				indent: function( editor ) {
					var listNodeNames = globalHelpers.listNodeNames,
						selection = editor.getSelection(),
						range = selection && selection.getRanges( 1 )[ 0 ],
						nearestListBlock;

					// If there's some list in the path, then it will be
					// a full-list indent by increasing or decreasing margin property.
					if ( ( nearestListBlock = editor.elementPath().contains( listNodeNames ) ) )
						this.indentElement( nearestListBlock );

					// If no list in the path, use iterator to indent all the possible
					// paragraphs in the range, creating them if necessary.
					else {
						var iterator = range.createIterator(),
							enterMode = editor.config.enterMode,
							block;

						iterator.enforceRealBlocks = true;
						iterator.enlargeBr = enterMode != CKEDITOR.ENTER_BR;

						while ( ( block = iterator.getNextParagraph( enterMode == CKEDITOR.ENTER_P ? 'p' : 'div' ) ) )
							this.indentElement( block );
					}

					return true;
				}
			} );
		}
	} );
})();