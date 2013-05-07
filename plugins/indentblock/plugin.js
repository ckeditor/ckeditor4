/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview Allows block indentation.
 */

(function() {
	'use strict';

	CKEDITOR.plugins.add( 'indentblock', {
		requires: 'indent',
		init: function( editor ) {
			function commandDefinition( editor, name ) {
				CKEDITOR.plugins.indent.specificDefinition.apply( this, arguments );

				this.allowedContent = {
					'div h1 h2 h3 h4 h5 h6 ol p pre ul': {
						// Do not add elements, but only text-align style if element is validated by other rule.
						propertiesOnly: true,
						styles: !this.useIndentClasses ? 'margin-left,margin-right' : null,
						classes: this.useIndentClasses ? this.indentClasses : null
					}
				};

				this.requiredContent = 'p' + ( this.useIndentClasses ? '(' + this.indentClasses.join( ',' ) + ')' : '{margin-left}' );

				// Indent block is a kind of generic indentation. It must
				// be executed after any other indentation commands.
				this.execPriority = 90;
			};

			CKEDITOR.tools.extend( commandDefinition.prototype, CKEDITOR.plugins.indent.specificDefinition.prototype, {
				// Elements that, if in an elementpath, will be handled by this
				// command. They restrict the scope of the plugin.
				indentContext: { div: 1, dl: 1, h1: 1, h2: 1, h3: 1, h4: 1, h5: 1, h6: 1, p: 1, pre: 1, table: 1 },

				refresh: function( editor, path ) {
					// console.log( '	\\-> refreshing ', this.name );
					var firstBlock = path.block || path.blockLimit;

					//	- indentContext in the path
					//
					// 		\-> Don't try to indent if the element is out of
					//		    this plugin's scope.
					if ( !this.getContext( path ) )
						this.setState( CKEDITOR.TRISTATE_DISABLED );

					else if ( this.useIndentClasses ) {
						//	+ indentContext in the path
						//	+ IndentClasses
						//
						// 		\-> If there are indentation classes, check if reached
						// 		    the highest level of indentation. If so, disable
						// 		    the command.
						if ( this.checkIndentClassLeft( firstBlock ) )
							this.setState( CKEDITOR.TRISTATE_OFF );
						else
							this.setState( CKEDITOR.TRISTATE_DISABLED );
					}

					else {
						//	+ indentContext in the path
						//	- IndentClasses
						//	+ Indenting
						//
						// 		\-> No indent-level limitations due to indent classes.
						// 		    indent-like command can always be executed.
						if ( this.isIndent )
							this.setState( CKEDITOR.TRISTATE_OFF );

						//	+ indentContext in the path
						//	- IndentClasses
						//	- Indenting
						//	- Block in the path
						//
						// 		\-> No block in path. There's no element to apply indentation
						// 		    so disable the command.
						else if ( !firstBlock )
							this.setState( CKEDITOR.TRISTATE_DISABLED );

						//	+ indentContext in the path
						//	- IndentClasses
						//	- Indenting
						//	+ Block in path.
						//
						// 		\-> Not using indentClasses but there is firstBlock.
						//		    We can calculate current indentation level and
						//			try to increase/decrease it.
						else {
							var indent = parseInt( firstBlock.getStyle( this.getIndentCssProperty( firstBlock ) ), 10 );

							if ( isNaN( indent ) )
								indent = 0;

							if ( indent <= 0 )
								this.setState( CKEDITOR.TRISTATE_DISABLED );
							else
								this.setState( CKEDITOR.TRISTATE_OFF );
						}
					}
				},

				exec: function( editor ) {
					var selection = editor.getSelection(),
						range = selection && selection.getRanges( 1 )[ 0 ],
						path = editor.elementPath();

					function indentBlock() {
						var iterator = range.createIterator(),
							enterMode = editor.config.enterMode,
							block;

						iterator.enforceRealBlocks = true;
						iterator.enlargeBr = enterMode != CKEDITOR.ENTER_BR;

						while ( ( block = iterator.getNextParagraph( enterMode == CKEDITOR.ENTER_P ? 'p' : 'div' ) ) )
							this.indentElement( block );
					}

					indentBlock.call( this );

					return true;
				}
			});

			// Register commands.
			CKEDITOR.plugins.indent.registerCommands( editor, {
				indentblock: new commandDefinition( editor, 'indentblock' ),
				outdentblock: new commandDefinition( editor, 'outdentblock' )
			});
		}
	});
})();