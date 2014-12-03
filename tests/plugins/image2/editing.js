/* bender-tags: editor,unit,widget */
/* bender-ckeditor-plugins: image2,toolbar */
/* global widgetTestsTools, image2TestsTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			extraAllowedContent: 'img figure[id]',
			autoParagraph: false
		}
	};

	var getWidgetById = widgetTestsTools.getWidgetById,
		fixHtml = image2TestsTools.fixHtml,
		assertWidgetDialog = widgetTestsTools.assertWidgetDialog,
		widgetsHtml = '<img src="_assets/foo.png" alt="xalt" width="100" id="x" />' +
			'<p>X</p>' +
			'<figure class="image" id="y">' +
				'<img src="_assets/bar.png" alt="yalt" />' +
				'<figcaption>boo</figcaption>' +
			'</figure>';

	function assertDialogFields( dialog, data ) {
		for ( var i in data )
			assert.areSame( data[ i ], dialog.getValueOf( 'info', i ), 'Value must match.' );
	}

	bender.test( {
		'test edit inline widget with global command': function() {

			assertWidgetDialog( this.editorBot, 'image', widgetsHtml, 'x', {
				src: '_assets/foo.png',
				alt: 'xalt',
				width: '100',
				height: '',
				align: 'none',
				hasCaption: false
			} );

		},

		'test edit block widget with global command': function() {

			// atm this code can not be checked with assertWidgetDialog
			var bot = this.editorBot,
				editor = bot.editor;

			editor.once( 'dialogShow', function( evt ) {
				var dialog = evt.data;

				resume( function() {
					assertDialogFields( dialog, {
						src: '_assets/bar.png',
						alt: 'yalt',
						width: '',
						height: '',
						align: 'none',
						hasCaption: true
					} );

					dialog.hide();
				} );
			} );

			getWidgetById( editor, 'y' ).focus();
			editor.execCommand( 'image' );
			wait();
		},

		'test create inline widget with a global command': function() {
			var editorBot = this.editorBot,
				onResume = function( dialog ) {
					dialog.setValueOf( 'info', 'src', '_assets/foo.png' );
					dialog.getButton( 'ok' ).click();
					assert.areSame( '<p>x<img alt="" src="_assets/foo.png" />x</p>', fixHtml( editorBot.editor.getData() ) );
				};

			assertWidgetDialog( editorBot, 'image', '', null, {
				src: '',
				alt: '',
				width: '',
				height: '',
				align: 'none',
				hasCaption: false
			}, '<p>x^x</p>', onResume );
		},

		'test create block widget in wrong context': function() {

			var editorBot = this.editorBot,
				onResume = function( dialog ) {
					dialog.setValueOf( 'info', 'src', '_assets/foo.png' );
					dialog.setValueOf( 'info', 'align', 'center' );

					dialog.getButton( 'ok' ).click();
					assert.areSame(
						'<p><span>foo</span></p>' +
						'<p style="text-align:center;">' +
							'<img alt="" src="_assets/foo.png" />' +
						'</p>' +
						'<p><span>bar</span></p>',
						fixHtml( editorBot.editor.getData() ),
						'Paragraph got split.' );
				};

			assertWidgetDialog( editorBot, 'image', '', null, null, '<p><span>foo^bar</span></p>', onResume );
		}
	} );
} )();