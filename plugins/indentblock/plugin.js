/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

/**
 * @fileOverview Allows block indentation.
 */

(function() {
	CKEDITOR.plugins.add( 'indentblock', {
		requires: 'indent',
		init: function( editor ) {
			var	indentBlockCommand = CKEDITOR.tools.createClass( {
				base: CKEDITOR.plugins.indent.indentSomeCommand,

				$: function( editor, name ) {
					this.base.apply( this, arguments );

					this.allowedContent = {
						'div h1 h2 h3 h4 h5 h6 p pre': {
							// Do not add elements, but only text-align style if element is validated by other rule.
							propertiesOnly: true,
							styles: !this.useIndentClasses ? 'margin-left,margin-right' : null,
							classes: this.useIndentClasses ? this.indentClasses : null
						}
					};

					this.requiredContent = 'p' + ( this.useIndentClasses ? '(' + this.indentClasses.join( ',' ) + ')' : '{margin-left}' );

					this.execPriority = 15;
				},

				proto: {
					refresh: function( editor, path ) {
						// console.log( '	\\-> refreshing ', this.name );
						var firstBlock = path.block || path.blockLimit;

						//	+ HandledNode in the path
						//
						// 		\-> Don't try to indent if the element is handled
						// 		    by some other, more specific plugin. This will prevent
						// 		    indentblock from being executed in all possible cases.
						if ( path.contains( this.handledNodeNames ) )
							this.setState( CKEDITOR.TRISTATE_DISABLED );

						else if ( this.useIndentClasses ) {
							//	- HandledNode in the path
							//	+ indentClasses
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
							//	- HandledNode in the path
							//	- IndentClasses
							//	+ Indenting
							//
							// 		\-> No indent-level limitations due to indent classes.
							// 		    indent-like command can always be executed.
							if ( this.isIndent )
								this.setState( CKEDITOR.TRISTATE_OFF );

							//	- HandledNode in the path
							//	- IndentClasses
							//	- Indenting
							//	- Block in the path
							//
							// 		\-> No block in path. There's no element to apply indentation
							// 		    so disable the command.
							else if ( !firstBlock )
								this.setState( CKEDITOR.TRISTATE_DISABLED );

							//	- HandledNode in the path
							//	- IndentClasses
							//	- Indenting
							//	+ Block in path.
							//
							// 		\-> Not using indentClasses but there is firstBlock.
							//		    We can calculate current indentation level and
							//			try to increase/decrease it.
							else {
								var indent = parseInt(
											firstBlock.getStyle( this.getIndentCssProperty( firstBlock ) )
										, 10 );

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
							range = selection && selection.getRanges( 1 )[ 0 ];

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
				}
			});

			// Register commands.
			CKEDITOR.plugins.indent.registerIndentCommands( editor, {
				'indentblock': new indentBlockCommand( editor, 'indentblock' ),
				'outdentblock': new indentBlockCommand( editor, 'outdentblock' )
			});
		}
	});
})();