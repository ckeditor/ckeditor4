/* bender-tags: widget */
/* bender-ckeditor-plugins: widget, undo */
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
		initial = {
			styles: {
				'border': '1px solid black',
				'border-radius': '3px'
			},
			attributes: {
				'alt': 'alternative text',
				'height': '200px'
			},
			getDefinition: function() {
				return { styles: this.styles, attributes: this.attributes };
			}
		};

	function getHtmlForTest( styles, attributes ) {
		styles = styles ? ' style=\"' + CKEDITOR.tools.writeCssText( styles ) + '\"' : undefined;
		attributes = attributes ? ' ' + CKEDITOR.tools.writeCssText( attributes ).replace( /:/g, '=\"' ).replace( /;/g, '\"' ) + '\"' : undefined;

		return '<img data-widget="testWidget" id="test-widget"' + styles + attributes + '>test</img>';
	}

	function testStyles( element, sourceObject, attribute, assertFalse ) {
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

	function testRemovedStyles( element, sourceObject, styleOrAttribute ) {
		styleOrAttribute = styleOrAttribute ? 'Style' : 'Attribute';

		for ( var key in sourceObject ) {
			assert.isFalse( !!element[ 'get' + styleOrAttribute ]( key ) );
		}
	}

	function assertTestStyles( widget, style, testRemoved ) {
		if ( testRemoved ) {
			testRemovedStyles( widget.wrapper, style.getDefinition().styles, 1 );
			testRemovedStyles( widget.element, style.getDefinition().attributes, 0 );
		} else {
			testStyles( widget.wrapper, style.getDefinition().styles, 1 );
			testStyles( widget.element, style.getDefinition().attributes, 0 );
		}
	}

	function testUndoRedoStyle( config, widget ) {
		var style;

		if ( style = config.unexpectedStyle ) {
			if ( style instanceof Array ) {
				CKEDITOR.tools.array.forEach( style, function( item ) {
					assertTestStyles( widget, item, 1 );
				} );
			} else {
				assertTestStyles( widget, style, 1 );
			}
		}

		if ( style = config.expectedStyle ) {
			if ( style instanceof Array ) {
				CKEDITOR.tools.array.forEach( style, function( item ) {
					assertTestStyles( widget, item );
				} );
			} else {
				assertTestStyles( widget, style );
			}
		}
	}

	function setTest( bot, config ) {
		bot.setData( getHtmlForTest( initial.styles, initial.attributes ), function() {
			var editor = bot.editor,
				widget = getWidgetById( editor, 'test-widget' ),
				item,
				action;

			function undoRedo( command, widget ) {
				var editable = editor.editable(),
					id = widget.element.getId();
				editor.execCommand( command );
				widget = editor.widgets.getByElement( editable.findOne( '#' + id ) );
				return widget;
			}

			var tests = {
				apply: function( style ) {
					style.apply( editor );
					editor.undoManager.save();

					// Test if styles and/or attributes from `style` are applied to widget
					assertTestStyles( widget, style );
					assert.isTrue( widget.checkStyleActive( style ), 'Style should be active' );
				},
				remove: function( style ) {
					style.remove( editor );
					editor.undoManager.save();

					// Test if styles and/or attributes from `styles` are removed from widget
					assertTestStyles( widget, style, 1 );
					assert.isFalse( widget.checkStyleActive( style ), 'Style shouldn\'t be active' );
				},
				test: function( style ) {
					// Test without adding styles
					assertTestStyles( widget, style );
				},
				checkInactive: function( style ) {
					assert.isFalse( widget.checkStyleActive( style ) );
				},
				undo: function( config ) {
					widget = undoRedo( 'undo', widget );
					testUndoRedoStyle( config, widget );
				},
				redo: function( config ) {
					widget = undoRedo( 'redo', widget );
					testUndoRedoStyle( config, widget );
				}
			};

			// Apply styles and/or attributes from `style` object to widget, widget needs to be focused for that
			widget.focus();
			while ( item = config.shift() ) {
				action = CKEDITOR.tools.objectKeys( item )[ 0 ];

				tests[ action ]( item[ action ] );

				// Test if initial styles and/or attributes are preserved
				assertTestStyles( widget, initial );
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
		},
		'test undo redo style': function() {
			var style = createStyle( styleStylesAndAttributes );
			setTest( this.editorBots.editor, [
				{ apply: style },
				{ undo: { unexpectedStyle: style } },
				{ redo: { expectedStyle: style } },
				{ remove: style },
				{ undo: { expectedStyle: style } },
				{ redo: { unexpectedStyle: style } }
			] );
		},
		'test undo redo two styles': function() {
			var style1 = createStyle( styleStylesAndAttributes ),
				style2 = createStyle( styleFooBar );
			setTest( this.editorBots.editor, [
				{ apply: style1 },
				{ apply: style2 },
				{ undo: { expectedStyle: style1, unexpectedStyle: style2 } },
				{ undo: { unexpectedStyle: [ style2, style1 ] } },
				{ redo: { expectedStyle: style1, unexpectedStyle: style2 } },
				{ redo: { expectedStyle: [ style1, style2 ] } },
				{ remove: style1 },
				{ remove: style2 },
				{ undo: { expectedStyle: style2, unexpectedStyle: style1 } },
				{ undo: { expectedStyle: [ style1, style2 ] } },
				{ redo: { expectedStyle: style2, unexpectedStyle: style1 } },
				{ redo: { unexpectedStyle: [ style1, style2 ] } }
			] );
		}
	} );
} )();
