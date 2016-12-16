/* bender-tags: editor,unit,widget */
/* bender-ckeditor-plugins: image2,toolbar */
/* global widgetTestsTools */

( function() {
	'use strict';

	function assertDowncast( id, expectedWidgetDefinitionName ) {
		return function() {
			widgetTestsTools.assertDowncast( this.editorBot, id, 1, expectedWidgetDefinitionName );
		};
	}

	var tcs = {
		'test downcast captioned widget':				assertDowncast( 'w1', 'image' ),
		'test downcast captioned, floated widget':		assertDowncast( 'w2', 'image' ),
		'test downcast captioned, centered widget':		assertDowncast( 'w3', 'image' ),

		'test downcast widget':							assertDowncast( 'w4', 'image' ),
		'test downcast floated widget':					assertDowncast( 'w5', 'image' ),
		'test downcast centered widget':				assertDowncast( 'w6', 'image' )
	};

	bender.editor = {
		config: {
			autoParagraph: false
		}
	};

	bender.test( tcs );
} )();