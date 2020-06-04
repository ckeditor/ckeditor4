/* bender-tags: editor */
/* bender-ckeditor-plugins: widget */

( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: true
		}
	};

	bender.test( {

		setUp: function() {
			// Creates mockup widget definition.
			this.sampleWidgetDefinition = {
				allowedContent: true,
				requiredContent: 'div',
				editables: {
					header: {
						selector: '.mockup_header',
						allowedContent: 'span em strong'
					}
				},
				template: '<div>' +
					'<h2 class="mockup_header">foobar</h2>' +
				'</div>',

				upcast: function( element ) {
					return element.name == 'div' && element.hasClass( 'mockup_widget' );
				}
			};

		},

		'test1': function() {
			var editor = this.editor,
				bot = this.editorBot;

			// Registers widget.
			editor.widgets.add( 'mockupWidget', this.sampleWidgetDefinition );

			bot.setData( bender.tools.getValueAsHtml( 'editorContent' ), function() {
				var headerSpan = editor.document.getElementsByTag( 'span' ).getItem( 0 );
				// Puts selection on span element.
				editor.getSelection().selectElement( headerSpan );
				assert.isTrue( true );
			} );
		},

		'test2': function() {
			var bot = this.editorBot;

			bot.setData( bender.tools.getValueAsHtml( 'editorContent' ), function() {
				assert.isTrue( true );
			} );
		}
	} );
} )();
