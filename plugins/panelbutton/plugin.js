/**
 * @license Copyright (c) 2003-2025, CKSource Holding sp. z o.o. All rights reserved.
 * CKEditor 4 LTS ("Long Term Support") is available under the terms of the Extended Support Model.
 */

CKEDITOR.plugins.add( 'panelbutton', {
	requires: 'button',
	onLoad: function() {
		function clickFn( editor ) {
			var _ = this._;

			if ( _.state == CKEDITOR.TRISTATE_DISABLED )
				return;

			this.createPanel( editor );

			if ( _.on ) {
				_.panel.hide();
				return;
			}

			_.panel.showBlock( this._.id, this.document.getById( this._.id ), 4 );
		}

		/**
		 * @class
		 * @extends CKEDITOR.ui.button
		 * @todo class and methods
		 */
		CKEDITOR.ui.panelButton = CKEDITOR.tools.createClass( {
			base: CKEDITOR.ui.button,

			/**
			 * Creates a panelButton class instance.
			 *
			 * @constructor
			 */
			$: function( definition ) {
				// We don't want the panel definition in this object.
				var panelDefinition = definition.panel || {};

				delete definition.panel;

				this.base( definition );

				this.document = ( panelDefinition.parent && panelDefinition.parent.getDocument() ) || CKEDITOR.document;

				panelDefinition.block = {
					attributes: panelDefinition.attributes
				};
				panelDefinition.toolbarRelated = true;

				this.hasArrow = 'listbox';

				this.click = clickFn;

				this._ = {
					panelDefinition: panelDefinition
				};
			},

			statics: {
				handler: {
					create: function( definition ) {
						return new CKEDITOR.ui.panelButton( definition );
					}
				}
			},

			proto: {
				createPanel: function( editor ) {
					var _ = this._;

					if ( _.panel ) {
						return;
					}

					var panelDefinition = this._.panelDefinition,
						panelBlockDefinition = this._.panelDefinition.block,
						panelParentElement = panelDefinition.parent || CKEDITOR.document.getBody(),
						buttonElement = CKEDITOR.document.getById( this._.id ),
						panel = this._.panel = new CKEDITOR.ui.floatPanel( editor, panelParentElement, panelDefinition ),
						block = panel.addBlock( _.id, panelBlockDefinition ),
						me = this,
						command = editor.getCommand( this.command );

					panel.onShow = function() {
						if ( me.className ) {
							this.element.addClass( me.className + '_panel' );
						}

						me.setState( CKEDITOR.TRISTATE_ON );

						// Indicates that panel button is open (#421, #5144).
						buttonElement.setAttribute( 'aria-expanded', 'true' );

						_.on = 1;

						me.editorFocus && editor.focus();

						if ( me.onOpen ) {
							me.onOpen();
						}
					};

					panel.onHide = function( preventOnClose ) {
						if ( me.className ) {
							this.element.getFirst().removeClass( me.className + '_panel' );
						}

						// Defined `modes` has priority over the command for a backward compatibility (#3727).
						if ( !me.modes && command ) {
							me.setStateFromCommand( command );
						} else {
							me.setState( me.modes && me.modes[ editor.mode ] ? CKEDITOR.TRISTATE_OFF : CKEDITOR.TRISTATE_DISABLED );
						}

						_.on = 0;

						// Indicates that panel button is closed (#421, #5144).
						buttonElement.setAttribute( 'aria-expanded', 'false' );

						if ( !preventOnClose && me.onClose ) {
							me.onClose();
						}
					};

					panel.onEscape = function() {
						panel.hide( 1 );
						me.document.getById( _.id ).focus();
					};

					if ( this.onBlock ) {
						this.onBlock( panel, block );
					}

					block.onHide = function() {
						_.on = 0;

						// Defined `modes` has priority over the command for a backward compatibility (#3727).
						if ( !me.modes && me.command ) {
							me.setStateFromCommand( command );
						} else {
							me.setState( CKEDITOR.TRISTATE_OFF );
						}
					};
				},

				setStateFromCommand: function( command ) {
					this.setState( command.state );
				}
			}
		} );

	},
	beforeInit: function( editor ) {
		editor.ui.addHandler( CKEDITOR.UI_PANELBUTTON, CKEDITOR.ui.panelButton.handler );
	}
} );

/**
 * Button UI element.
 *
 * @readonly
 * @property {String} [='panelbutton']
 * @member CKEDITOR
 */
CKEDITOR.UI_PANELBUTTON = 'panelbutton';
