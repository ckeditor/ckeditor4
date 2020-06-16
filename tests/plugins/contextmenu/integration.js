/* bender-tags: editor */
/* bender-ckeditor-plugins: clipboard,contextmenu */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		'test getItemByCommandName - not rendered menu': function() {
			assert.isNull( this.editor.contextMenu.findItemByCommandName( 'paste' ) );
		},

		'test getItemByCommandName - opened menu': function() {
			bender.editorBot.create( {
				name: 'editor1'
			}, function( bot ) {
				var editor = bot.editor;

				editor.once( 'menuShow', function() {
					resume( function() {
						var item = editor.contextMenu.findItemByCommandName( 'paste' );
						assert.isObject( item );
						assert.isTrue( item.item instanceof CKEDITOR.menuItem, 'Holds CKEDITOR.menuItem under item' );
						assert.isTrue( item.element instanceof CKEDITOR.dom.element, 'Holds CKEDITOR.dom.element under element' );

						assert.isNull( editor.contextMenu.findItemByCommandName( 'non-existent-item' ), 'Null for non-existing item' );
					} );
				} );

				editor.focus();
				editor.contextMenu.open( editor.editable() );

				wait();
			} );
		},

		'test getItemByCommandName - closed menu': function() {
			bender.editorBot.create( {
				name: 'editor2'
			}, function( bot ) {
				var editor = bot.editor;

				editor.once( 'menuShow', function() {
					editor.contextMenu.hide();
				} );

				editor.once( 'panelHide', function() {
					resume( function() {
						var item = editor.contextMenu.findItemByCommandName( 'paste' );
						assert.isObject( item );
						assert.isTrue( item.item instanceof CKEDITOR.menuItem, 'Holds CKEDITOR.menuItem under item' );
						assert.isTrue( item.element instanceof CKEDITOR.dom.element, 'Holds CKEDITOR.dom.element under element' );

						assert.isNull( editor.contextMenu.findItemByCommandName( 'non-existent-item' ), 'Null for non-existing item' );
					} );
				} );

				editor.focus();
				editor.contextMenu.open( editor.editable() );

				wait();
			} );
		},

		'test getItemByCommandName - reopened menu': function() {
			bender.editorBot.create( {
				name: 'editor3'
			}, function( bot ) {
				var editor = bot.editor,
					item1,
					item2;

				editor.once( 'menuShow', function() {
					item1 = editor.contextMenu.findItemByCommandName( 'paste' );
					editor.contextMenu.hide();
				} );

				editor.once( 'panelHide', function() {

					editor.once( 'menuShow', function() {
						resume( function() {
							item2 = editor.contextMenu.findItemByCommandName( 'paste' );
							assert.areSame( item1.item, item2.item, 'Menu item is the same' );
							assert.areNotSame( item1.element, item2.element, 'Element is updated' );
						} );
					} );

					editor.contextMenu.open( editor.editable() );
				} );

				editor.focus();
				editor.contextMenu.open( editor.editable() );

				wait();
			} );
		},

		'test "menuShow" event params': function() {
			bender.editorBot.create( {
				name: 'editor4'
			}, function( bot ) {
				bot.editor.on( 'menuShow', function( evt ) {
					resume( function() {
						assert.isTrue( evt.data[ 0 ] instanceof CKEDITOR.ui.floatPanel, 'CKEDITOR.ui.panel available' );
					} );
				} );

				bot.editor.focus();
				bot.editor.contextMenu.open( bot.editor.editable() );

				wait();
			} );
		}
	} );
} )();
