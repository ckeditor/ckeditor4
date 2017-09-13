/* bender-ckeditor-plugins: widget,wysiwygarea,undo,toolbar */


( function() {
	'use strict';

	bender.editor = {
		config: {
			allowedContent: true
		}
	};

	bender.test( {
		// #704
		'test keeping widget wrapper in editor when superfluous elements are checked': function() {
			CKEDITOR.plugins.add( 'test', {
				requires: 'widget',
				init: function( editor ) {
					editor.widgets.add( 'test', {
						upcast: function( element ) {
							if ( element.hasClass( 'test' ) ) {
								return true;
							}
						},

						init: function() {
							this.element.setStyle( 'background-color', '#FFBB00' );
							this.element.setStyle( 'padding', '30px' );
						}
					} );
				}
			} );
			bender.editorBot.create( {
				name: 'test_widget',
				startupData: '<h2 class="test">Test</h2><p>Preheat the oven to</p>',
				config: {
					extraPlugins: 'test',
					allowedContent: true
				}
			}, function( bot ) {
				var editor = bot.editor;

				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( {
					keyCode: 90,
					ctrlKey: true,
					shiftKey: false
				} ) );

				var snap = editor.getSnapshot();
				editor.loadSnapshot( snap );

				editor.editable().fire( 'keyup', new CKEDITOR.dom.event( {} ) );

				assert.areSame( 'div', editor.editable().getFirst().getName().toLowerCase() );
			} );
		}
	} );
} )();
