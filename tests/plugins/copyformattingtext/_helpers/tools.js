/* exported testExtractingFormatting */

'use strict';

function testExtractingFormatting( editor, bot, elementHtml, expectedStyle, computedStyles, additionalData ) {
	var isList = !!elementHtml.match( /^<(ul|ol|li)/g ),
		oldComputed = isList ? editor.config.copyFormatting_listsComputedStyles :
			editor.config.copyFormatting_computedStyles;

	computedStyles = computedStyles || oldComputed;

	if ( isList ) {
		editor.config.copyFormatting_listsComputedStyles = computedStyles;
	} else {
		editor.config.copyFormatting_computedStyles = computedStyles;
	}

	bot.setData( elementHtml, function() {
		var eventData = additionalData || {};

		eventData.element = editor.editable().findOne( expectedStyle.element );

		editor.copyFormatting.once( 'extractFormatting', function( evt ) {
			resume( function() {
				var style = evt.data.styleDef,
					inlineStyle;

				assert.isObject( style );

				assert.areSame( expectedStyle.element, style.element );
				assert.areSame( expectedStyle.type, style.type );
				objectAssert.areDeepEqual( expectedStyle.attributes, style.attributes );

				for ( inlineStyle in expectedStyle.styles ) {
					assert.areSame( expectedStyle.styles[ inlineStyle ], style.styles[ inlineStyle ] );
				}

				if ( additionalData ) {
					objectAssert.ownsKeys( computedStyles, style.styles );
				}

				if ( isList ) {
					editor.config.copyFormatting_listsComputedStyles = oldComputed;
				} else {
					editor.config.copyFormatting_computedStyles = oldComputed;
				}
			} );
		}, null, null, 1000 );

		wait( function() {
			editor.copyFormatting.fire( 'extractFormatting', eventData, editor );
		} );
	} );
}
