/* bender-tags: editor,unit,widgetcore */
/* bender-ckeditor-plugins: widget,contextmenu */

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: true,
			on: {
				instanceReady: function( evt ) {
					evt.editor.dataProcessor.writer.sortAttributes = 1;

					evt.editor.widgets.add( 'testwidget', {} );
				}
			}
		}
	};

	var fixHtml = widgetTestsTools.fixHtml,
		getWidgetById = widgetTestsTools.getWidgetById;

	bender.test( {
		'test contextMenu event firing': function() {
			var editor = this.editor;

			editor.widgets.add( 'testevent', {
				editables: {
					foo: '.foo'
				}
			} );

			this.editorBot.setData( '<p id="p1">foo</p><div data-widget="testevent" id="w1"><p class="foo">foo</p></div>' +
				'<p id="p2">foo</p><div data-widget="testevent" id="w2"><p class="foo">foo</p></div>', function() {
				var w1 = getWidgetById( editor, 'w1' ),
					w2 = getWidgetById( editor, 'w2' ),
					p1 = editor.document.getById( 'p1' ),
					p2 = editor.document.getById( 'p2' ),
					eFoo1 = w1.editables.foo,
					opened = '',
					range = editor.createRange();

				editor.focus();

				w1.on( 'contextMenu', function() {
					opened += '1';
				} );
				w2.on( 'contextMenu', function() {
					opened += '2';
				} );

				range.setStart( p1, 0 );
				range.collapse( true );
				range.select();

				editor.contextMenu.open( editor.editable() );
				editor.contextMenu.hide();
				assert.areSame( '', opened, 'events were not fired - #p1' );

				range.setStart( p1, 0 );
				range.setEnd( p2, 1 );
				range.select();

				editor.contextMenu.open( editor.editable() );
				editor.contextMenu.hide();
				assert.areSame( '', opened, 'events were not fired - #p1 to #p2' );

				w1.focus();
				editor.contextMenu.open( editor.editable() );
				editor.contextMenu.hide();
				assert.areSame( '1', opened, 'ctxmenu on #w1' );

				w2.focus();
				editor.contextMenu.open( editor.editable() );
				editor.contextMenu.hide();
				assert.areSame( '12', opened, 'ctxmenu on #w2' );

				eFoo1.focus();
				range.setStart( eFoo1, 0 );
				range.collapse( true );
				range.select();

				editor.contextMenu.open( editor.editable() );
				editor.contextMenu.hide();
				assert.areSame( '12', opened, 'events were not fired - #w1.foo' );
			} );
		},

		'test contextMenu passing a data': function() {
			var editor = this.editor;

			editor.widgets.add( 'testdata', {} );

			this.editorBot.setData( '<p>foo</p><div data-widget="testdata" id="w1">foo</div>', function() {
				var w1 = getWidgetById( editor, 'w1' ),
					range = editor.createRange();

				w1.on( 'contextMenu', function( evt ) {
					evt.data.testData = CKEDITOR.TRISTATE_OFF;
				} );

				editor.addCommand( 'testData', {} );

				editor.addMenuItems( {
					testData: {
						label: 'Foo',
						command: 'testData',
						group: 'image'
					}
				} );

				w1.focus();

				editor.contextMenu.open( editor.editable() );

				var itemsExist = 0;
				for ( var i = 0; i < editor.contextMenu.items.length; ++i )
					if ( editor.contextMenu.items[ i ].command == 'testData' )
						itemsExist += 1;

				editor.contextMenu.hide();

				assert.areSame( 1, itemsExist, 'there is one testData item in context menu' )
			} );
		}
	} );
} )();