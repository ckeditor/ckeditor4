( function() {
	'use strict';

	CKEDITOR.plugins.add( 'livebutton', {
		// icons: 'livebutton',
		// hidpi: true,
		requires: 'panelbutton',
		beforeInit: function( editor ) {
			// Note that liveButton needs to be loaded in beforeInit method, rather than onLoad, as it depends on the livebutton, which is inited in onLoad.
			// Since CKEditor does not guarantee a proper onLoad order, it has to be defined in beforeInit method (#1142).

			/**
			 * @class
			 * @extends CKEDITOR.ui.button
			 */
			CKEDITOR.ui.liveButton = CKEDITOR.tools.createClass( {
				base: CKEDITOR.ui.panelButton,

				/**
				 * Creates a liveButton class instance.
				 *
				 * @constructor
				 * @param Object definition
				 * @todo
				 */
				$: function( definition ) {
					this.base( definition );
				},

				statics: {
					handler: {
						create: function( definition ) {
							return new CKEDITOR.ui.liveButton( definition );
						}
					}
				}
			} );

			editor.ui.addHandler( CKEDITOR.UI_LIVEBUTTON, CKEDITOR.ui.liveButton.handler );
		}
	} );

	/**
	 * Button UI element.
	 *
	 * @readonly
	 * @property {String} [='livebutton']
	 * @member CKEDITOR
	 */
	CKEDITOR.UI_LIVEBUTTON = 'livebutton';
} )();
