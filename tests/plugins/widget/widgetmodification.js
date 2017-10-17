/* bender-ckeditor-plugins: widget,toolbar,widgetselection */

( function() {
    'use strict';

	bender.editor = {
		config: {
			allowedContent: true
		}
	};

    bender.test( {

		init: function() {
			this.editor.widgets.add( 'spanwidget', {
				upcast: function( element ) {
					return element.name == 'span';
				}
			} );
		},

        'test widget modification': function() {
            var editor = this.editor;
            bender.tools.selection.setWithHtml( editor, '<span>lore[m]</span>' );

        }
    } );
} )();
