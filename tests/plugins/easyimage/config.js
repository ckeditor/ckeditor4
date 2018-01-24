/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: easyimage,toolbar */
/* bender-include: ../widget/_helpers/tools.js */
/* global widgetTestsTools */

( function() {
	'use strict';

	bender.editors = {
		standard: {},

		classCustomized: {
			config: {
				// Widget is identified by id.
				extraAllowedContent: 'figure[id]',
				easyimage_class: 'customClass',
				easyimage_sideClass: 'customSideClass'
			}
		},

		toolbarString: {
			config: {
				extraPlugins: 'basicstyles',
				easyimage_toolbar: 'Bold,Italic'
			}
		},

		toolbarArray: {
			config: {
				extraPlugins: 'basicstyles',
				easyimage_toolbar: [ 'Bold', 'Italic' ]
			}
		}
	};

	function createToolbarTest( editorName, expectedItems ) {
		return function() {
			var editor = bender.editors[ editorName ],
				balloonToolbar = editor.balloonToolbars._contexts[ 0 ].toolbar,
				items = CKEDITOR.tools.objectKeys( balloonToolbar._items );

			assert.areSame( expectedItems.length, items.length, 'Buttons count' );
			arrayAssert.containsItems( expectedItems, items, 'Buttons type' );
		};
	}

	bender.test( {
		'test easyimage_class - changed': function() {
			widgetTestsTools.assertWidget( {
				count: 1,
				widgetOffset: 0,
				nameCreated: 'easyimage',
				html: CKEDITOR.document.getById( 'changedClass' ).getHtml(),
				bot: this.editorBots.classCustomized
			} );
		},

		'test easyimage_sideClass - changed': function() {
			var bot = this.editorBots.classCustomized;

			bot.setData( CKEDITOR.document.getById( 'changedClass' ).getHtml(), function() {
				var editor = bot.editor,
					widgetInstance = widgetTestsTools.getWidgetById( editor, 'customSideId', true );

				widgetInstance.focus();

				// IE11 for some reasons needs to have the command state force refreshed, after focusing the widget with API only.
				editor.commands.easyimageSide.refresh( editor, editor.elementPath() );

				editor.execCommand( 'easyimageSide' );

				assert.beautified.html( CKEDITOR.document.getById( 'expectedCustomSideClass' ).getHtml(), editor.getData() );
			} );
		},

		'test balloon toolbar buttons (default settings)': createToolbarTest( 'standard',
			[ 'EasyimageFull', 'EasyimageSide', 'EasyimageAlt' ] ),
		'test balloon toolbar buttons (string syntax)': createToolbarTest( 'toolbarString', [ 'Bold', 'Italic' ] ),
		'test balloon toolbar buttons (array syntax)': createToolbarTest( 'toolbarArray', [ 'Bold', 'Italic' ] )
	} );
} )();
