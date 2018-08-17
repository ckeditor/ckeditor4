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
				upcast: function( element ) {
					return element.name == 'span';
				}
			} );

			this.editor.widgets.add( 'divwidget', {
				upcast: function( element ) {
					return element.name == 'div';
				}
			} );

			this.editor.widgets.add( 'smallwidget' );
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
						editor.editable().getElementsByTag( 'span' ).$[ 1 ].innerHTML.toLowerCase(), 'innerHTML', 'innerHtml string' );
					assert.areSame(
						'<p>lorem<span><strong> ipsum&nbsp;dolor</strong> sit </span>amet</p>',
						editor.editable().getData(), 'editor data' );
				} );
			} );

			editor.setData( '<p>lorem<span><strong> ipsum&nbsp;dolor</strong> sit </span>amet</p>' );
			wait();
		},

		'test block widget': function() {
			var editor = this.editor,
				listener;

			listener = editor.on( 'dataReady', function() {
				listener.removeListener();

				resume( function() {
					assert.areSame(
						'lorem ipsum dolor sit',
						editor.editable().getElementsByTag( 'div' ).$[ 1 ].innerHTML.toLowerCase(), 'innerHTML', 'innerHtml string' );
					assert.areSame(
						'<div>lorem ipsum dolor sit</div>',
						editor.editable().getData(), 'editor data' );
				} );
			} );

			editor.setData( '<div> lorem ipsum dolor sit </div>' );
			wait();
		},

		'test widget without upcast method': function() {
			var editor = this.editor,
				listener;

			listener = editor.on( 'dataReady', function() {
				listener.removeListener();

				resume( function() {
					assert.areSame(
						'&nbsp;lorem ipsum dolor sit&nbsp;',
						editor.editable().getElementsByTag( 'small' ).$[ 0 ].innerHTML.toLowerCase(), 'innerHTML', 'innerHtml string' );
					assert.areSame(
						'<p>lorem<small data-widget="smallwidget"> lorem ipsum dolor sit </small>ipsum</p>',
						editor.editable().getData(), 'editor data' );
				} );
			} );

			editor.setData( '<p>lorem<small data-widget="smallwidget"> lorem ipsum dolor sit </small>ipsum</p>' );
			wait();
		}
	} );
} )();
