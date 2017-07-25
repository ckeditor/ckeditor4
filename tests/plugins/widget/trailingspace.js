/* bender-tags: widgetcore */
/* bender-ckeditor-plugins: widget */

( function() {
	'use-strict';

	bender.editor = {
		config: {
			allowedContent: true
		}
	};

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
				assert.areSame( 'lorem ' , editor.editable().getElementsByTag( 'span' ).$[1].innerText, 'innerText' );
				assert.areSame( 'lorem ' , editor.editable().getElementsByTag( 'span' ).$[1].outerText, 'outerText' );
				resume();
			}, 100 );

			wait();
		}
	} );
} )();
