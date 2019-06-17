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
		},

		customDefaultStyle: {
			config: {
				easyimage_class: null,
				easyimage_defaultStyle: 'side'
			}
		},

		unsetDefaultStyle: {
			config: {
				easyimage_class: null,
				easyimage_defaultStyle: null
			}
		}
	};

	function createCustomClassTest( command ) {
		return function() {
			var bot = this.editorBots.classCustomized;

			bot.setData( CKEDITOR.document.getById( 'changedClass' ).getHtml(), function() {
				var editor = bot.editor,
					widgetInstance = widgetTestsTools.getWidgetById( editor, 'customSideId', true );

				widgetInstance.focus();

				if ( CKEDITOR.env.ie && !CKEDITOR.env.edge ) {
					// IE11 for some reasons needs to have the command state force refreshed, after focusing the widget with API only.
					editor.commands[ 'easyimage' + command ].refresh( editor, editor.elementPath() );
				}

				editor.execCommand( 'easyimage' + command );

				assert.beautified.html( CKEDITOR.document.getById( 'expectedCustom' + command + 'Class' ).getHtml(), editor.getData() );
			} );
		};
	}

	function createToolbarTest( editorName, expectedItems ) {
		return function() {
			var editor = bender.editors[ editorName ],
				balloonToolbar = editor.balloonToolbars._contexts[ 0 ].toolbar,
				items = CKEDITOR.tools.object.keys( balloonToolbar._items );

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
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'easyimage' );
		},

		'test easyimage_class - changed': function() {
			widgetTestsTools.assertWidget( {
				count: 1,
				widgetOffset: 0,
				nameCreated: 'easyimage',
				html: CKEDITOR.document.getById( 'changedClass' ).getHtml(),
				bot: this.editorBots.classCustomized,
				assertNewData: function( widget ) {
					assert.isTrue( widget.element.hasClass( 'easyimage-full' ), 'Widget has a proper class by default' );
				}
			} );
		},

		'test easyimage_defaultStyle - changed': function() {
			widgetTestsTools.assertWidget( {
				widgetOffset: 0,
				nameCreated: 'easyimage',
				html: CKEDITOR.document.getById( 'standardWidget' ).getHtml(),
				bot: this.editorBots.customDefaultStyle,
				assertNewData: function( widget ) {
					assert.isTrue( widget.element.hasClass( 'easyimage-side' ), 'Widget element has a proper class' );
				}
			} );
		},

		'test easyimage_defaultStyle - unset': function() {
			widgetTestsTools.assertWidget( {
				widgetOffset: 0,
				nameCreated: 'easyimage',
				html: CKEDITOR.document.getById( 'standardWidget' ).getHtml(),
				bot: this.editorBots.unsetDefaultStyle,
				assertNewData: function( widget ) {
					assert.areSame( 'cke_widget_element', widget.element.getAttribute( 'class' ), 'Widget element classes' );
				}
			} );
		},

		'test default styles for alignLeft': createCustomClassTest( 'AlignLeft' ),
		'test default styles for alignCenter': createCustomClassTest( 'AlignCenter' ),
		'test default styles for alignRight': createCustomClassTest( 'AlignRight' ),

		'test balloon toolbar buttons (default settings)': createToolbarTest( 'standard',
			[ 'EasyImageFull', 'EasyImageSide', 'EasyImageAlt' ] ),
		'test balloon toolbar buttons (string syntax)': createToolbarTest( 'toolbarString', [ 'Bold', 'Italic' ] ),
		'test balloon toolbar buttons (array syntax)': createToolbarTest( 'toolbarArray', [ 'Bold', 'Italic' ] ),

		'test context menu items (default settings)': createMenuTest( 'standard',
			[ 'easyimagefull', 'easyimageside', 'easyimagealt' ] ),
		'test context menu items (string syntax)': createMenuTest( 'toolbarString', [ 'bold', 'italic' ] ),
		'test context menu items (array syntax)': createMenuTest( 'toolbarArray', [ 'bold', 'italic' ] )
	} );
} )();
