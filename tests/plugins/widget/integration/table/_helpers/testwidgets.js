CKEDITOR.plugins.add( 'inlineWidget', {
	requires: 'widget',
	init: function( editor ) {
		editor.widgets.add( 'test1', {
			button: 'Create Inline Widget',
			template: '<strong class="inline-widget" style="background-color:#C0392B;padding:5px;">Very strong text.</strong>',
			requiredContent: 'strong(inline-widget)',
			allowedContent: 'strong(!inline-widget){*}',
			upcast: function( element ) {
				return element.name === 'strong' && element.hasClass( 'inline-widget' );
			}
		} );
	}
} );

CKEDITOR.plugins.add( 'blockWidget', {
	requires: 'widget',
	init: function( editor ) {
		editor.widgets.add( 'test2', {
			button: 'Create Block Widget',
			template: '<div class="block-widget" style="background-color:#F4D03F;padding:5px;">Some text in div.</div>',
			requiredContent: 'div(block-widget)',
			allowedContent: 'div(!block-widget){*}',
			upcast: function( element ) {
				return element.name === 'div' && element.hasClass( 'block-widget' );
			}
		} );
	}
} );
