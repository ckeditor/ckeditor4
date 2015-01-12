/* bender-tags: editor,unit,widget */
/* bender-ckeditor-plugins: image2,justify,toolbar */
/* global widgetTestsTools, image2TestsTools */

( function() {
	'use strict';

	CKEDITOR.addCss(
		'.never.gonna.give.you.up { border: 10px cyan dotted }' +
		'.gonna.give.you.up { border: 10px red solid }'
	);

	var getWidgetById = widgetTestsTools.getWidgetById,
		fixHtml = image2TestsTools.fixHtml,
		styleDef = {
			name: '80\'s pop',
			type: 'widget',
			widget: 'image',
			attributes: {
				'class': 'never gonna give you up'
			}
		};

	bender.editors = {
		editor: {
			name: 'editor1',
			config: {
				extraAllowedContent: 'img figure[id]',
				autoParagraph: false,
				language: 'en',
				image2_alignClasses: [ 'al', 'ac', 'ar' ],
				image2_captionedClass: 'cap'
			}
		},

		editorACFStyles: {
			name: 'editor2',
			config: {
				extraAllowedContent: 'img figure[id]',
				autoParagraph: false,
				language: 'en',
				image2_captionedClass: 'cap',
				on: {
					loaded: function() {
						this.filter.allow( new CKEDITOR.style( styleDef ) );
					}
				}
			}
		},

		editorACFClasses: {
			name: 'editor3',
			config: {
				extraAllowedContent: 'img figure[id]',
				autoParagraph: false,
				language: 'en',
				image2_alignClasses: [ 'al', 'ac', 'ar' ],
				image2_captionedClass: 'cap',
				on: {
					loaded: function() {
						this.filter.allow( new CKEDITOR.style( styleDef ) );
					}
				}
			}
		}
	};

	bender.test( {
		'test style non-captioned, right-aligned widget': function() {
			var bot = this.editorBots.editor,
				editor = bot.editor,
				style = new CKEDITOR.style( styleDef );

			bot.setData( '<img src="_assets/foo.png" alt="rick" class="ar" id="x" />', function() {
				var widget = getWidgetById( editor, 'x' );

				widget.applyStyle( style );

				assert.areSame( fixHtml( '<img src="_assets/foo.png" alt="rick" class="give gonna never up you ar" id="x" />' ),
					fixHtml( editor.getData() ), 'Styles in output data' );

				widget.removeStyle( new CKEDITOR.style( {
					attributes: { 'class': 'never' }
				} ) );

				assert.areSame( fixHtml( '<img src="_assets/foo.png" alt="rick" class="give gonna up you ar" id="x" />' ),
					fixHtml( editor.getData() ), 'Styles in output data after removeStyle' );
			} );
		},

		'test style captioned widget': function() {
			var bot = this.editorBots.editor,
				editor = bot.editor,
				style = new CKEDITOR.style( styleDef ),

				html = '<figure class="cap al" id="x">' +
					'<img src="_assets/bar.png" alt="rick" />' +
					'<figcaption>boo</figcaption>' +
				'</figure>',

				expected = '<figure class="cap up you give gonna never al" id="x">' +
					'<img src="_assets/bar.png" alt="rick" />' +
					'<figcaption>boo</figcaption>' +
				'</figure>',

				expectedRemoveStyle = '<figure class="cap up you give gonna al" id="x">' +
					'<img src="_assets/bar.png" alt="rick" />' +
					'<figcaption>boo</figcaption>' +
				'</figure>';

			bot.setData( html, function() {
				var widget = getWidgetById( editor, 'x' );

				widget.applyStyle( style );

				assert.areSame( fixHtml( expected ),
					fixHtml( editor.getData() ), 'Styles in output data' );

				widget.removeStyle( new CKEDITOR.style( {
					attributes: { 'class': 'never' }
				} ) );

				assert.areSame( fixHtml( expectedRemoveStyle ),
					fixHtml( editor.getData() ), 'Styles in output data' );
			} );
		},

		'test transition: add caption to non-captioned, right-aligned, styled widget': function() {
			var bot = this.editorBots.editor,
				editor = bot.editor,
				style = new CKEDITOR.style( styleDef ),

				expected = '<figure class="cap up you give gonna never ar">' +
					'<img alt="rick" id="x" src="_assets/foo.png" />' +
					'<figcaption>caption</figcaption>' +
				'</figure>';

			bot.setData( '<img src="_assets/foo.png" alt="rick" class="ar" id="x" />', function() {
				var widget = getWidgetById( editor, 'x' );

				widget.applyStyle( style );

				widget.setData( {
					hasCaption: true
				} );

				widget = getWidgetById( editor, 'x' );

				assert.isFalse( widget.parts.image.hasAttribute( 'class' ), 'Image has no classes left' );

				for ( var c in widget.data.classes )
					assert.isTrue( widget.element.hasClass( c ), '.' + c + ' class transferred from img' );

				assert.areSame( fixHtml( expected ),
					fixHtml( editor.getData() ), 'Styles in output data' );
			} );
		},

		'test transition: center non-captioned, right-aligned, styled widget': function() {
			var bot = this.editorBots.editor,
				editor = bot.editor,
				style = new CKEDITOR.style( styleDef ),

				expected = '<p class="ac">' +
					'<img alt="rick" class="give gonna never up you" id="x" src="_assets/foo.png" />' +
				'</p>';

			bot.setData( '<img src="_assets/foo.png" alt="rick" class="ar" id="x" />', function() {
				var widget = getWidgetById( editor, 'x' );

				widget.applyStyle( style );

				widget.setData( {
					align: 'center'
				} );

				widget = getWidgetById( editor, 'x' );

				for ( var c in widget.data.classes )
					assert.isTrue( widget.parts.image.hasClass( c ), '.' + c + ' class of img is set' );

				assert.areSame( fixHtml( expected ),
					fixHtml( editor.getData() ), 'Styles in output data' );
			} );
		},

		'test transition: center captioned, right-aligned, styled widget': function() {
			var bot = this.editorBots.editor,
				editor = bot.editor,
				style = new CKEDITOR.style( styleDef ),

				html = '<figure class="cap">' +
					'<img alt="rick" id="x" src="_assets/foo.png" />' +
					'<figcaption>caption</figcaption>' +
				'</figure>',

				expected = '<div class="ac">' +
					'<figure class="cap up you give gonna never">' +
						'<img alt="rick" id="x" src="_assets/foo.png" />' +
						'<figcaption>caption</figcaption>' +
					'</figure>' +
				'</div>';

			bot.setData( html, function() {
				var widget = getWidgetById( editor, 'x' );

				widget.applyStyle( style );

				widget.setData( {
					align: 'center'
				} );

				assert.areSame( fixHtml( expected ),
					fixHtml( editor.getData() ), 'Styles in output data' );
			} );
		},

		'test ACF integration - widget using styles': function() {
			var bot = this.editorBots.editorACFStyles,
				editor = bot.editor,

				html = '<figure class="cap gonna never xxx" style="float: right">' +
					'<img alt="rick" src="_assets/foo.png" />' +
					'<figcaption>caption</figcaption>' +
				'</figure>' +
				'<p><img alt="rick" class="give up you xxx" src="_assets/foo.png" style="float: right" /></p>',

				expected = '<figure class="cap gonna never" style="float: right">' +
					'<img alt="rick" src="_assets/foo.png" />' +
					'<figcaption>caption</figcaption>' +
				'</figure>' +
				'<p><img alt="rick" class="give up you" src="_assets/foo.png" style="float: right" /></p>';

			bot.setData( html, function() {
				assert.areSame( fixHtml( expected ),
					fixHtml( editor.getData() ), 'Styles in output data' );
			} );
		},

		'test ACF integration - widget using classes': function() {
			var bot = this.editorBots.editorACFClasses,
				editor = bot.editor,

				html = '<figure class="cap gonna never ar xxx">' +
					'<img alt="rick" src="_assets/foo.png" />' +
					'<figcaption>caption</figcaption>' +
				'</figure>' +
				'<p><img alt="rick" class="give up you ar xxx" src="_assets/foo.png" /></p>',

				expected = '<figure class="cap gonna never ar">' +
					'<img alt="rick" src="_assets/foo.png" />' +
					'<figcaption>caption</figcaption>' +
				'</figure>' +
				'<p><img alt="rick" class="give up you ar" src="_assets/foo.png" /></p>';

			bot.setData( html, function() {
				assert.areSame( fixHtml( expected ),
					fixHtml( editor.getData() ), 'Styles in output data' );
			} );
		}
	} );
} )();