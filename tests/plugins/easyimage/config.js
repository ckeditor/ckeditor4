/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: easyimage,toolbar,contextmenu */
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
				easyimage_class: 'customClass'
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

	function createMenuTest( editorName, expectedItems ) {
		expectedItems = [ 'cut', 'copy', 'paste' ].concat( expectedItems );

		function getItemsNames( items ) {
			var names = [];

			CKEDITOR.tools.array.forEach( items, function( item ) {
				names.push( item.name );
			} );

			return names;
		}

		return function() {
			var bot = bender.editorBots[ editorName ],
				editor = bot.editor;

			bot.setData( CKEDITOR.document.getById( 'standardWidget' ).getHtml(), function() {
				var element = editor.editable().findOne( 'figure' ),
					widget = editor.widgets.getByElement( element );

				widget.focus();

				bot.contextmenu( function( menu ) {
					arrayAssert.containsItems( expectedItems, getItemsNames( menu.items ), 'Context menu items types' );

					menu.hide();
				} );
			} );
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

		'test balloon toolbar buttons (default settings)': createToolbarTest( 'standard',
			[ 'EasyimageFull', 'EasyimageSide', 'EasyimageAlt' ] ),
		'test balloon toolbar buttons (string syntax)': createToolbarTest( 'toolbarString', [ 'Bold', 'Italic' ] ),
		'test balloon toolbar buttons (array syntax)': createToolbarTest( 'toolbarArray', [ 'Bold', 'Italic' ] ),

		'test context menu items (default settings)': createMenuTest( 'standard',
			[ 'easyimagefull', 'easyimageside', 'easyimagealt' ] ),
		'test context menu items (string syntax)': createMenuTest( 'toolbarString', [ 'bold', 'italic' ] ),
		'test context menu items (array syntax)': createMenuTest( 'toolbarArray', [ 'bold', 'italic' ] )
	} );
} )();
