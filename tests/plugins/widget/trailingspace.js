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
					assert.areSame( 'lorem&nbsp;' , editor.editable().getElementsByTag( 'span' ).$[1].innerHTML, 'innerHTML' );
				} );
			}, 100 );

			wait();
		}
	} );
} )();
