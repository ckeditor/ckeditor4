var widgetTestsTools = ( function() {
	'use strict';

	//
	// @param config
	// @param config.name
	// @param config.startupData
	// @param config.widgetName
	// @param [config.editorConfig]
	// @param [config.extraPlugins]
	// @param [config.extraAllowedContent]
	// @param [config.onWidgetDefinition]
	//
	// @param config.initialInstancesNumber
	// @param [config.checkData]
	// @param [config.assertWidgets]
	//
	// @param config.newData
	// @param config.createdWidgetPattern
	function addTests( tcs, config ) {
		var editor,
			editorBot,
			tcName = config.name,
			checkData = config.checkData !== false,
			initialData,
			editorConfig = {
				extraPlugins: config.extraPlugins + ',sourcearea,undo,clipboard,toolbar',
				removePlugins: config.removePlugins,
				extraAllowedContent: config.extraAllowedContent,
				on: {
					loaded: function( evt ) {
						editor = evt.editor;

						initialData = fixHtml( editor.getData(), config.ignoreStyle );

						editor.dataProcessor.writer.sortAttributes = true;
					},

					widgetDefinition: function( evt ) {
						if ( evt.data.name == config.widgetName && config.onWidgetDefinition )
							config.onWidgetDefinition( evt.data );
					}
				}
			};

		if ( config.editorConfig )
			CKEDITOR.tools.extend( editorConfig, config.editorConfig, true );

		tcs[ 'test ' + tcName + ' - init' ] = function() {
			bender.editorBot.create( {
				name: 'editor_' + tcName,
				creator: config.creator,
				config: editorConfig
			}, function( bot ) {
				editorBot = bot;
				editor.focus();

				assert.isNotUndefined( editor.widgets.registered[ config.widgetName ], 'widget definition is registered' );

				assertWidgets( 'on init' );
			} );
		};

		if ( config.creator != 'inline' ) {
			tcs[ 'test ' + tcName + ' - switch modes' ] = function() {
				var sourceModeData;

				// Wait & ensure async.
				wait( function() {
					editor.setMode( 'source', function() {
						sourceModeData = fixHtml( editor.getData(), config.ignoreStyle );

						editor.setMode( 'wysiwyg', function() {
							resume( function() {
								checkData && assert.areSame( initialData, sourceModeData, 'source mode data' );

								assertWidgets( 'after switching modes' );
							} );
						} );
					} );
				} );
			};
		}

		tcs[ 'test ' + tcName + ' - paste' ] = function() {
			var html = editor.editable().getHtml();

			editorBot.setData( '', function() {
				editor.once( 'afterPaste', function() {
					resume( function() {
						assertWidgets( 'after paste' );
					} );
				} );

				wait( function() {
					editor.execCommand( 'paste', html );
				} );
			} );
		};

		tcs[ 'test ' + tcName + ' - create' ] = function() {
			editorBot.setData( '', function() {
				var widgetDef = editor.widgets.registered[ config.widgetName ];

				editor.once( 'dialogShow', function( evt ) {
					var dialog = evt.data;

					setTimeout( function() {
						for ( var i = 0; i < config.newData.length; ++i )
							dialog.setValueOf.apply( dialog, config.newData[ i ] );

						dialog.getButton( 'ok' ).click();
					}, 50 );
				} );

				editor.once( 'dialogHide', function() {
					resume( function() {
						var instances = obj2Array( editor.widgets.instances );
						assert.areSame( 1, instances.length, 'one instance was created' );
						assert.isMatching( config.newWidgetPattern, editor.getData(), 'data' );
					} );
				} );

				editor.execCommand( widgetDef.name );
				wait();
			} );
		};

		function assertWidgets( msg ) {
			var instances = obj2Array( editor.widgets.instances );
			assert.areSame( config.initialInstancesNumber, instances.length, 'instances number ' + msg );

			checkData && assert.areSame( initialData, fixHtml( editor.getData(), config.ignoreStyle ), 'data ' + msg );

			var editable = editor.editable();
			for ( var i = 0; i < instances.length; ++i )
				assert.isTrue( editable.contains( instances[ i ].wrapper ), 'editable contains wrapper ' + msg );

			config.assertWidgets && config.assertWidgets( editor, msg );
		}
	}

	function obj2Array( obj ) {
		var arr = [];
		for ( var id in obj )
			arr.push( obj[ id ] );

		return arr;
	}

	function classes2Array( classesObj ) {
		return CKEDITOR.tools.objectKeys( classesObj ).sort();
	}

	function fixHtml( html, ignoreStyle ) {
		// Because IE modify style attribute we should fix it or totally ignore style attribute.
		var html = html.replace( /style="([^"]*)"/g, function( styleStr ) {
			// If there are too many problems with styles just ignore them.
			if ( ignoreStyle )
				return '';

			// If it is only the matter of spacers and semicolons fix attributes.
			var style = styleStr.substr( 7, styleStr.length - 8 );
			return 'style="' + CKEDITOR.tools.htmlEncodeAttr( CKEDITOR.tools.writeCssText( CKEDITOR.tools.parseCssText( style ) ) ) + '"';
		} );

		// And some additional cleanup.
		html = bender.tools.compatHtml( html, true, true, true, true );

		return html;
	}

	function data2Attr( data ) {
		return encodeURIComponent( JSON.stringify( data ) );
	}

	function getAttrData( widget ) {
		return JSON.parse( decodeURIComponent( widget.element.data( 'cke-widget-data' ) ) );
	}

	function getWidgetById( editor, id ) {
		return editor.widgets.getByElement( editor.document.getById( id ) );
	}

	// Retrives widget by its offset among parsed widgets.
	//
	// @param {CKEDITOR.editor} editor
	// @param {Number} offset 0-based widget offset.
	// @returns {CKEDITOR.plugins.widget/null} Returns null if widget was not found.
	function getWidgetByDOMOffset( editor, offset ) {
		var wrapper = editor.document.find( '.cke_widget_wrapper' ).getItem( offset ),
			ret = null;

		if ( wrapper )
			ret = editor.widgets.getByElement( wrapper );

		return ret;
	}

	// Sets editor content to given element and tests if its downcasted to expected widget.
	//
	// @param {bender.editorBot} editorBot
	// @param {String} id Id of element in document which.
	// @param {Number} [expectedInstancesCount=1] Expected widget instances count.
	// @param {String} [expectedWidgetName] Expected widget definiton name. In this case
	//											should have same definition name.
	function assertDowncast( editorBot, id, expectedInstancesCount, expectedWidgetName ) {
		var data = CKEDITOR.document.getById( id ).getHtml();

		if ( typeof expectedInstancesCount == 'undefined' )
			expectedInstancesCount = 1;

		editorBot.setData( data, function() {
			var instancesArray = obj2Array( editorBot.editor.widgets.instances );

			assert.areEqual( expectedInstancesCount, instancesArray.length, 'Invalid count of created widget instances.' );
			assert.areEqual( fixHtml( data ), fixHtml( editorBot.getData() ), 'Editor html after performing downcast is not matching.' );

			if ( expectedWidgetName ) {
				for ( var i = instancesArray.length-1; i >= 0; i-- )
					assert.areEqual( expectedWidgetName, instancesArray[ i ].name, 'Widget at index ' + i + ' has widget invalid definition name.' );
			}
		} );
	}

	// Asserts that dialog appears after executing given command, and that dialog
	// fields contains given values.
	//
	// Uses global functions: wait, resume.
	//
	// For sample use see: dt/plugins/image2/editing.html
	//
	// @param {bender.editorBot} editorBot
	// @param {String} commandName Name of command which should create dialog.
	// @param {String} editorHtml Initial HTML code for editor, should contain code transformable into the widget.
	// @param {Number/String} focusedWidgetIndex If String: id of widget which should be focused
	// if Number: index of widget which should be focused (0-based), otherwise: no widget will be focused (default)
	// @param {Object} expectedValues Expected dialog values object. If null - checking will be skipped.
	// @param {String} htmlWithSelectionSource If passed it will use htmlWithSelection() method and
	// override content set with editorHtml variable.
	// @param {Function} onResume Callback called after checking dialog values, passes
	// dialog object as its first argument.
	function assertWidgetDialog( editorBot, commandName, editorHtml, focusedWidgetIndex, expectedValues, htmlWithSelectionSource, onResume ) {
		var editor = editorBot.editor,
			dialogCheckedTab = 'info'; // Tab name in dialog.

		// Registering dialogShow listener, which will invoke resume().
		editor.once( 'dialogShow', function( evt ) {
			var dialog = evt.data;

			resume( function() {
				// Lets check dialog contents.
				try {
					expectedValues = expectedValues || {};

					for ( var i in expectedValues )
						assert.areSame( expectedValues[ i ], dialog.getValueOf( dialogCheckedTab, i ), 'Dialog field "' + i + '" in tab "' + dialogCheckedTab + '" has invalid value.' );
				} catch ( e ) {
					// Propagate error.
					dialog.hide();
					throw e;
				}

				onResume && onResume( dialog );
				dialog.hide();
			} );
		} );

		editorBot.setData( editorHtml, function() {

			var widget = null;

			// If html with seleciton was requested - override.
			if ( typeof htmlWithSelectionSource == 'string' )
				editorBot.htmlWithSelection( htmlWithSelectionSource );

			if ( typeof focusedWidgetIndex == 'number' ) {
				// If index of widget to be focused is number.
				widget = getWidgetByDOMOffset( editor, focusedWidgetIndex );
				assert.isNotNull( widget, 'Could not find widget with index ' + focusedWidgetIndex );
			} else if ( typeof focusedWidgetIndex == 'string' ) {
				// In this case id was given.
				widget = getWidgetById( editor, focusedWidgetIndex );
				assert.isNotNull( widget, 'Could not find widget with id ' + focusedWidgetIndex );
			}

			if ( widget )
				widget.focus();

			assert.isTrue( true );
			editor.execCommand( commandName );

			wait();
		} );
	}

	function assertWidget( config ) {
		var editor = config.bot.editor,
			// Widget instances as array.
			instancesArray = null;

		config.bot.setData( config.html, function() {

			var widget = null,
				pickWidget = function() {
					var ret = null;

					if ( config.widgetId )
						ret = widgetTestsTools.getWidgetById( editor, config.widgetId );
					else if ( typeof config.widgetOffset !== 'undefined' )
						ret = widgetTestsTools.getWidgetByDOMOffset( editor, config.widgetOffset );

					return ret;
				};

			instancesArray = widgetTestsTools.obj2Array( editor.widgets.instances );

			// If expected widgets count was specified, check if it's the same.
			typeof config.count !== 'undefined' && assert.areSame( Number( config.count ), instancesArray.length, 'Invalid count of widgets found.' );

			// There is a case that config.count will be 0, so we dont want to have any widgets found.
			if ( typeof config.count !== 'number' || config.count > 0 ) {

				widget = pickWidget();

				// Assert widget once it's created.
				config.assertCreated && config.assertCreated( widget );

				// Assert widget name.
				assert.areSame( config.nameCreated, widget.name, 'Initial widget name must match.' );

				// Set new widget data. This may destroy the widget.
				config.data && widget.setData( config.data );

				// Retrieve the widget once again as it may have been destroyed.
				widget = pickWidget();

				// Assert widget as new data is set.
				config.assertNewData && config.assertNewData( widget );

				// Assert widget name as new  data is set.
				config.nameNewData && assert.areSame( config.nameNewData, widget.name, 'Widget name must match after data is set.' );

				// Finally destroy the widget.
				editor.widgets.destroy( widget );
			}

			config.callback && config.callback( config );
		} );
	}

	return {
		addTests: addTests,
		data2Attribute: data2Attr,
		getAttributeData: getAttrData,
		fixHtml: fixHtml,
		getWidgetById: getWidgetById,
		getWidgetByDOMOffset: getWidgetByDOMOffset,
		obj2Array: obj2Array,
		classes2Array: classes2Array,
		assertDowncast: assertDowncast,
		assertWidgetDialog: assertWidgetDialog,
		assertWidget: assertWidget,

		widgetInitedWrapperAttributes:
			'class="cke_widget_wrapper cke_widget_(?:inline|block)" ' +
			'contenteditable="false" ' +
			'(?:data-cke-display-name="[a-z0-9]+" )?' +
			'(?:data-cke-expando="[0-9]+" )?' +
			'data-cke-filter="off" ' +
			'data-cke-widget-id="[0-9]+" ' +
			'data-cke-widget-wrapper="1" ' +
			'tabindex="-1"',
		widgetWrapperAttributes:
			'class="cke_widget_wrapper cke_widget_new cke_widget_(?:inline|block)" ' +
			'contenteditable="false" ' +
			'(?:data-cke-display-name="[a-z0-9]+" )?' +
			'(?:data-cke-expando="[0-9]+" )?' +
			'data-cke-filter="off" ' +
			'data-cke-widget-wrapper="1" ' +
			'tabindex="-1"',
		widgetDragHanlder:
			'<span class="cke_reset cke_widget_drag_handler_container" style="[^"]+">' +
				'<img class="cke_reset cke_widget_drag_handler" ' +
					'(?:data-cke-expando="[0-9]+" )?' +
					'data-cke-widget-drag-handler="1" ' +
					'(?:draggable="true" )?' +
					'height="\\d+" ' +
					'src="[^"]+" ' +
					'title="[^"]+" ' +
					'width="\\d+" ' +
				'/>' +
			'</span>'
	};

} )();