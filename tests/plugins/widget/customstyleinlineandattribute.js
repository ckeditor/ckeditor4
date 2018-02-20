/* bender-tags: widget */
/* bender-ckeditor-plugins: widget */
/* bender-include: _helpers/tools.js */
/* global widgetTestsTools */

( function() {
	'use strict';

	function createStyle( styleDefinition ) {
		return new CKEDITOR.style( styleDefinition );
	}

	var getWidgetById = widgetTestsTools.getWidgetById,
		styles = {
			'background-color': 'black',
			'width': '100px',
			'height': '200px'
		},
		attributes = {
			'src': './some/fake/src',
			'width': '100px'
		},
		initialStyles = {
			'border': '1px solid black',
			'border-radius': '3px'
		},
		initialAttributes = {
			'alt': 'alternative text',
			'height': '200px'
		},
		testHtml = '<img data-widget="testWidget" id="test-widget">test</img>';

	function setFromObject( targetElement, sourceObject, styleOrAttr ) {
		styleOrAttr = styleOrAttr ? 'Style' : 'Attribute';
		for ( var key in sourceObject ) {
			targetElement[ 'set' + styleOrAttr ]( key, sourceObject[ key ] );
		}
	}

	function assertTestStyles( element, sourceObject, styleOrAttribute ) {
		styleOrAttribute = styleOrAttribute ? 'Style' : 'Attribute';

		for ( var key in sourceObject ) {
			var elementProp = element[ 'get' + styleOrAttribute ]( key ),
				sourceProp = sourceObject[ key ];

			// Some browsers might return elements width and height without 'px', following code should prevent comparing e.g. '200' == '200px'
			if ( !( /\s/.test( sourceProp ) ) && parseInt( sourceProp, 10 ) ) {
				sourceProp = parseInt( sourceProp, 10 );
				elementProp = parseInt( elementProp, 10 );
			}

			assert.areSame( elementProp, sourceProp, styleOrAttribute + ' doesn\'t match' );
		}
	}

	function assertTestRemovedStyles( element, sourceObject, styleOrAttribute ) {
		styleOrAttribute = styleOrAttribute ? 'Style' : 'Attribute';

		for ( var key in sourceObject ) {
			assert.isFalse( !!element[ 'get' + styleOrAttribute ]( key ) );
		}
	}

	function setTest( bot, testStyles, testAttributes ) {
		var style = createStyle( {
				type: 'widget',
				widget: 'testWidget',
				styles: testStyles ? styles : undefined,
				attributes: testAttributes ? attributes : undefined
			} );

		style.element = 'img';
		bot.setData( testHtml, function() {
			var editor = bot.editor;
			var widget = getWidgetById( editor, 'test-widget' );

			// Apply initial styles and/or attributes to widget
			testStyles && setFromObject( widget.element, initialStyles, 1 );
			testAttributes && setFromObject( widget.element, initialAttributes, 0 );

			// Apply styles and/or attributes from `style` object to widget, widget needs to be focused for that
			widget.focus();
			style.apply( editor );

			// Test if styles and/or attributes from `style` are applied to widget
			testStyles && assertTestStyles( widget.element, style.getDefinition().styles, 1 );
			testAttributes && assertTestStyles( widget.element, style.getDefinition().attributes, 0 );
			assert.isTrue( widget.checkStyleActive( style ), 'Style should be active' );

			style.remove( editor );
			// Test if styles and/or attributes from `styles` are removed from widget
			testStyles && assertTestRemovedStyles( widget.element, style.getDefinition().styles, 1 );
			testAttributes && assertTestRemovedStyles( widget.element, style.getDefinition().attributes, 0 );
			assert.isFalse( widget.checkStyleActive( style ), 'Style should\' be active' );

			// Test if initial styles and/or attributes are preserved
			testStyles && assertTestStyles( widget.element, initialStyles, 1 );
			testAttributes && assertTestStyles( widget.element, initialAttributes, 0 );
		} );
	}

	CKEDITOR.plugins.add( 'testWidget', {
		init: function( editor ) {
			editor.widgets.add( 'testWidget', {} );
		}
	} );

	bender.editors = {
		editor: {
			name: 'editor1',
			creator: 'inline',
			config: {
				extraPlugins: 'testWidget',
				allowedContent: true
			}
		}
	};

	bender.test( {
		'test apply remove inline style': function() {
			setTest( this.editorBots.editor, 1 );
		},
		'test apply remove attribute': function() {
			setTest( this.editorBots.editor, 0, 1 );
		},
		'test apply remove inline style and attribute': function() {
			setTest( this.editorBots.editor, 1, 1 );
		}
	} );
} )();
