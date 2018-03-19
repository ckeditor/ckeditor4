/* bender-tags: widget */
/* bender-ckeditor-plugins: widget */
/* bender-include: _helpers/tools.js */
/* global widgetTestsTools */

( function() {
	'use strict';

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

	function createStyle( styleDefinition ) {
		styleDefinition.type = 'widget';
		styleDefinition.widget = 'testWidget';
		styleDefinition.element = 'img';
		return new CKEDITOR.style( styleDefinition );
	}

	var getWidgetById = widgetTestsTools.getWidgetById,
		initialStyles = {
			'border': '1px solid black',
			'border-radius': '3px'
		},
		initialAttributes = {
			'alt': 'alternative text',
			'height': '200px'
		};

	function getHtmlForTest( styles, attributes ) {
		styles = styles ? ' style=\"' + CKEDITOR.tools.writeCssText( styles ) + '\"' : undefined;
		attributes = attributes ? ' ' + CKEDITOR.tools.writeCssText( attributes ).replace( /:/g, '=\"' ).replace( /;/g, '\"' ) + '\"' : undefined;

		return '<img data-widget="testWidget" id="test-widget"' + styles + attributes + '>test</img>';
	}

	function assertTestStyles( element, sourceObject, attribute, assertFalse ) {
		attribute = attribute ? 'Style' : 'Attribute';

		for ( var key in sourceObject ) {
			var elementProp = element[ 'get' + attribute ]( key ),
				sourceProp = sourceObject[ key ];

			// Some browsers might return elements width and height without 'px', following code should prevent comparing e.g. `'200' == '200px'`
			if ( !( /\s/.test( sourceProp ) ) && parseInt( sourceProp, 10 ) ) {
				sourceProp = parseInt( sourceProp, 10 );
				elementProp = parseInt( elementProp, 10 );
			}

			if ( assertFalse ) {
				assert.isFalse( elementProp, sourceProp, attribute + 'should be removed' );
			} else {
				assert.areSame( elementProp, sourceProp, attribute + ' doesn\'t match' );
			}
		}
	}

	function assertTestRemovedStyles( element, sourceObject, styleOrAttribute ) {
		styleOrAttribute = styleOrAttribute ? 'Style' : 'Attribute';

		for ( var key in sourceObject ) {
			assert.isFalse( !!element[ 'get' + styleOrAttribute ]( key ) );
		}
	}

	// function setTest( bot, testStyles, testAttributes, config ) {
	function setTest( bot, config ) {
		bot.setData( getHtmlForTest( initialStyles, initialAttributes ), function() {
			var editor = bot.editor,
				widget = getWidgetById( editor, 'test-widget' ),
				item,
				style,
				action;

			var tests = {
				apply: function() {
					style = item.apply;
					style.apply( editor );

					// Test if styles and/or attributes from `style` are applied to widget
					assertTestStyles( widget.wrapper, style.getDefinition().styles, 1 );
					assertTestStyles( widget.element, style.getDefinition().attributes, 0 );
					assert.isTrue( widget.checkStyleActive( style ), 'Style should be active' );
				},
				remove: function() {
					style = item.remove;
					style.remove( editor );

					// Test if styles and/or attributes from `styles` are removed from widget
					assertTestRemovedStyles( widget.wrapper, style.getDefinition().styles, 1 );
					assertTestRemovedStyles( widget.element, style.getDefinition().attributes, 0 );
					assert.isFalse( widget.checkStyleActive( style ), 'Style shouldn\'t be active' );
				},
				test: function() {
					style = item.test;

					// Test without adding styles
					assertTestStyles( widget.wrapper, style.getDefinition().styles, 1 );
					assertTestStyles( widget.element, style.getDefinition().attributes, 0 );
				},
				checkInactive: function() {
					style = item.checkInactive;
					assert.isFalse( widget.checkStyleActive( style ) );
				}
			};

			// Apply styles and/or attributes from `style` object to widget, widget needs to be focused for that
			widget.focus();
			while ( item = config.shift() ) {
				action = CKEDITOR.tools.objectKeys( item )[ 0 ];

				tests[ action ]( item[ action ] );

				// Test if initial styles and/or attributes are preserved
				assertTestStyles( widget.wrapper, initialStyles, 1 );
				assertTestStyles( widget.element, initialAttributes, 0 );
			}
		} );
	}

	var styles = {
			'background-color': 'black',
			'width': '100px',
			'height': '200px'
		},
		attributes = {
			'data-foo': 'some data',
			'width': '100px'
		},
		styleStyles = {
			styles: styles
		},
		styleAttributes = {
			attributes: attributes
		},
		styleStylesAndAttributes = {
			styles: styles,
			attributes: attributes
		},
		styleFooBar = {
			styles: {
				'float': 'left',
				'clear': 'both'
			},
			attributes: {
				'foo': 'foo',
				'bar': 'bar'
			}
		};

	bender.test( {
		'test apply remove style with inline styles': function() {
			var style = createStyle( styleStyles );
			setTest( this.editorBots.editor, [
				{ apply: style },
				{ remove: style }
			] );
		},
		'test apply remove style with attributes': function() {
			var style = createStyle( styleAttributes );
			setTest( this.editorBots.editor, [
				{ apply: style },
				{ remove: style }
			] );
		},
		'test apply remove style with inline styles and attributes': function() {
			var style = createStyle( styleStylesAndAttributes );
			setTest( this.editorBots.editor, [
				{ apply: style },
				{ remove: style }
			] );
		},
		'test apply style and remove part of it': function() {
			var style1 = createStyle( styleStylesAndAttributes ),
				style2 = createStyle( styleAttributes );
			setTest( this.editorBots.editor, [
				{ apply: style1 },
				{ remove: style2 },
				{ checkInactive: style1 }
			] );
		},
		'test apply style and overwrite it with another style': function() {
			var style1 = createStyle( styleStylesAndAttributes ),
				style2 = createStyle( { styles: { 'background-color': 'yellow' } } );
			setTest( this.editorBots.editor, [
				{ apply: style1 },
				{ apply: style2 },
				{ checkInactive: style1 }
			] );
		},
		'test apply two styles remove first': function() {
			var style1 = createStyle( styleStylesAndAttributes ),
				style2 = createStyle( styleFooBar );
			setTest( this.editorBots.editor, [
				{ apply: style1 },
				{ apply: style2 },
				{ remove: style1 },
				{ test: style2 }
			] );
		},
		'test apply two styles remove second': function() {
			var style1 = createStyle( styleStylesAndAttributes ),
				style2 = createStyle( styleFooBar );
			setTest( this.editorBots.editor, [
				{ apply: style1 },
				{ apply: style1 },
				{ remove: style2 },
				{ test: style1 }
			] );
		},
		'test apply remove two styles': function() {
			var style1 = createStyle( styleStylesAndAttributes ),
				style2 = createStyle( styleFooBar );
			setTest( this.editorBots.editor, [
				{ apply: style1 },
				{ apply: style2 },
				{ remove: style1 },
				{ remove: style2 }
			] );
		}
	} );
} )();
