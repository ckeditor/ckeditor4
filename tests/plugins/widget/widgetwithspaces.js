/* bender-tags: widgetcore */
/* bender-ckeditor-plugins: widget */

( function() {
	'use-strict';

	bender.editor = {
		config: {
			allowedContent: true
		}
	};

	// 605
	bender.test( {
		'test trailing space': function() {
			var editor = this.editor;
			editor.widgets.add( 'spanwidget', {
				editables: {
					content: {
						selector: 'span'
					}
				},
				upcast: function( element ) {
					return element.name == 'span';
				}
			} );

			editor.setData( '<span>lorem </span>ipsum' );

			setTimeout( function() {
				resume( function() {
					assert.areSame( 'lorem&nbsp;' , editor.editable().getElementsByTag( 'span' ).$[ 1 ].innerHTML, 'innerHTML', 'innerHtml string' );
					assert.areSame( '<p><span>lorem </span>ipsum</p>', editor.editable().getData(), 'editor data' );
				} );
			}, 100 );

			wait();
		},

		// 605
		'test initial, trailing space with additional signs': function() {
			var editor = this.editor;
			editor.widgets.add( 'spanwidget', {
				editables: {
					content: {
						selector: 'span'
					}
				},
				upcast: function( element ) {
					return element.name == 'span';
				}
			} );

			editor.setData( '<p>lorem<span> ipsum&nbsp;dolor sit </span>amet</p>' );

			setTimeout( function() {
				resume( function() {
					assert.areSame( '&nbsp;ipsum&nbsp;dolor sit&nbsp;' , editor.editable().getElementsByTag( 'span' ).$[ 1 ].innerHTML, 'innerHTML', 'innerHtml string' );
					assert.areSame( '<p>lorem<span> ipsum&nbsp;dolor sit </span>amet</p>', editor.editable().getData(), 'editor data' );
				} );
			}, 100 );

			wait();
		}
	} );
} )();
