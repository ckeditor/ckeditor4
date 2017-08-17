/* bender-tags: widgetcore */
/* bender-ckeditor-plugins: widget */

( function() {
	'use-strict';

	bender.editor = {
		config: {
			allowedContent: true
		}
	};

	// #605
	bender.test( {

		init: function() {
			this.editor.widgets.add( 'spanwidget', {
				editables: {
					content: {
						selector: 'span'
					}
				},
				upcast: function( element ) {
					return element.name == 'span';
				}
			} );
		},

		'test trailing space': function() {
			var editor = this.editor;

			var listener;

			listener = editor.on( 'dataReady', function() {
				listener.removeListener();

				resume( function() {
					assert.areSame( 'lorem&nbsp;' , editor.editable().getElementsByTag( 'span' ).$[ 1 ].innerHTML, 'innerHTML', 'innerHtml string' );
					assert.areSame( '<p><span>lorem </span>ipsum</p>', editor.editable().getData(), 'editor data' );
				} );
			} );

			editor.setData( '<span>lorem </span>ipsum' );
			wait();
		},

		'test initial, trailing space with additional signs': function() {
			var editor = this.editor,
				listener;

			listener = editor.on( 'dataReady', function() {
				listener.removeListener();

				resume( function() {
					assert.areSame( '&nbsp;ipsum&nbsp;dolor sit&nbsp;' , editor.editable().getElementsByTag( 'span' ).$[ 1 ].innerHTML, 'innerHTML', 'innerHtml string' );
					assert.areSame( '<p>lorem<span> ipsum&nbsp;dolor sit </span>amet</p>', editor.editable().getData(), 'editor data' );
				} );
			} );

			editor.setData( '<p>lorem<span> ipsum&nbsp;dolor sit </span>amet</p>' );
			wait();
		},

		'test initial and trailing space for nested structure': function() {
			var editor = this.editor,
				listener;

			listener = editor.on( 'dataReady', function() {
				listener.removeListener();

				resume( function() {
					assert.areSame(
						'<strong data-cke-white-space-first="1">&nbsp;ipsum&nbsp;dolor</strong> sit&nbsp;',
						editor.editable().getElementsByTag( 'span' ).$[ 1 ].innerHTML, 'innerHTML', 'innerHtml string' );
					assert.areSame(
						'<p>lorem<span><strong> ipsum&nbsp;dolor</strong> sit </span>amet</p>',
						editor.editable().getData(), 'editor data' );
				} );
			} );

			editor.setData( '<p>lorem<span><strong> ipsum&nbsp;dolor</strong> sit </span>amet</p>' );
			wait();
		}
	} );
} )();
