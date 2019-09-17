/* bender-tags: editor */
/* bender-include: _helpers/tools.js */
// jscs:disable maximumLineLength
/* bender-ckeditor-plugins: about,a11yhelp,basicstyles,bidi,blockquote,clipboard,colorbutton,colordialog,copyformatting,contextmenu,dialogadvtab,div,elementspath,enterkey,entities,filebrowser,find,flash,floatingspace,font,format,forms,horizontalrule,htmlwriter,image,iframe,indentlist,indentblock,justify,language,link,list,liststyle,magicline,maximize,newpage,pagebreak,pastefromword,pastetext,preview,print,removeformat,resize,save,selectall,showblocks,showborders,smiley,sourcearea,specialchar,stylescombo,tab,table,tableselection,tabletools,templates,toolbar,undo,uploadimage,wysiwygarea */
// jscs:enable maximumLineLength
/* global detachingTools */

( function() {
	var runBeforeScriptLoaded = detachingTools.runBeforeScriptLoaded,
		runAfterEditableIframeLoad = detachingTools.runAfterEditableIframeLoad,
		currentError;


	window.onerror = function( error ) {
		currentError = error;
	};

	bender.test( {
		init: function() {
			this.wrapper = CKEDITOR.document.getById( 'wrapper' );
		},

		tearDown: function() {
			// clean up after editor.
			this.wrapper.setHtml( '' );
			CKEDITOR.removeAllListeners();
			CKEDITOR.fire( 'reset' );
		},

		_should: {
			ignore: {
				'test should not throw any error after detach and destroy after iframe "load" event - classic editor in div': CKEDITOR.env.edge || CKEDITOR.env.safari, // (#3426)
				'test should not throw any error after detach and destroy after iframe "load" event - classic editor in textarea': CKEDITOR.env.safari, // (#3426)
				'test should not throw any error after detach and destroy asynchronously - classic editor in textarea': CKEDITOR.env.ie && CKEDITOR.env.version < 11,
				'test should not throw any error after detach and destroy asynchronously - classic editor in div': CKEDITOR.env.ie && CKEDITOR.env.version < 11,
				'test should not throw any error after detach and destroy asynchronously - divarea editor in textarea': CKEDITOR.env.ie && CKEDITOR.env.version < 11
			}
		},

		'test should not throw any error after detach and destroy synchronously - classic editor in textarea': getSimpleTestCase( {
			editorType: 'classic',
			elementName: 'textarea'
		} ),

		'test should not throw any error after detach and destroy synchronously - classic editor in div': getSimpleTestCase( {
			editorType: 'classic',
			elementName: 'div'
		} ),

		'test should not throw any error after detach and destroy synchronously - divarea editor in textarea': getSimpleTestCase( {
			editorType: 'divarea',
			elementName: 'textarea'
		} ),

		'test should not throw any error after detach and destroy synchronously - divarea editor in div': getSimpleTestCase( {
			editorType: 'divarea',
			elementName: 'div'
		} ),

		'test should not throw any error after detach and destroy synchronously - inline editor in textarea': getSimpleTestCase( {
			editorType: 'inline',
			elementName: 'textarea'
		} ),

		'test should not throw any error after detach and destroy synchronously - inline editor in div': getSimpleTestCase( {
			editorType: 'inline',
			elementName: 'div'
		} ),

		'test should not throw any error after detach and destroy asynchronously - classic editor in textarea': getSimpleTestCase( {
			editorType: 'classic',
			elementName: 'textarea',
			isAsynchronous: true
		} ),

		'test should not throw any error after detach and destroy asynchronously - classic editor in div': getSimpleTestCase( {
			editorType: 'classic',
			elementName: 'div',
			isAsynchronous: true
		} ),

		'test should not throw any error after detach and destroy asynchronously - divarea editor in textarea': getSimpleTestCase( {
			editorType: 'divarea',
			elementName: 'textarea',
			isAsynchronous: true
		} ),

		'test should not throw any error after detach and destroy asynchronously - divarea editor in div': getSimpleTestCase( {
			editorType: 'divarea',
			elementName: 'div',
			isAsynchronous: true
		} ),

		'test should not throw any error after detach and destroy asynchronously - inline editor in textarea': getSimpleTestCase( {
			editorType: 'inline',
			elementName: 'textarea',
			isAsynchronous: true
		} ),

		'test should not throw any error after detach and destroy asynchronously - inline editor in div': getSimpleTestCase( {
			editorType: 'inline',
			elementName: 'div',
			isAsynchronous: true
		} ),

		'test should not throw any error after detach and destroy before "load" event - classic editor in textarea': getBeforeLoadedTestCase( {
			editorType: 'classic',
			elementName: 'textarea'
		} ),

		'test should not throw any error after detach and destroy before "load" event - classic editor in div': getBeforeLoadedTestCase( {
			editorType: 'classic',
			elementName: 'div'
		} ),

		'test should not throw any error after detach and destroy before "load" event - divarea editor in textarea': getBeforeLoadedTestCase( {
			editorType: 'divarea',
			elementName: 'textarea'
		} ),

		'test should not throw any error after detach and destroy before "load" event - divarea editor in div': getBeforeLoadedTestCase( {
			editorType: 'divarea',
			elementName: 'div'
		} ),

		'test should not throw any error after detach and destroy before "load" event - inline editor in textarea': getBeforeLoadedTestCase( {
			editorType: 'inline',
			elementName: 'textarea'
		} ),

		'test should not throw any error after detach and destroy before "load" event - inline editor in div': getBeforeLoadedTestCase( {
			editorType: 'inline',
			elementName: 'div'
		} ),

		'test should not throw any error after detach and destroy before "scriptLoad.load" during plugins load - classic editor in textarea': getBeforeScriptLoadTestCase( {
			editorType: 'classic',
			elementName: 'textarea'
		} ),

		'test should not throw any error after detach and destroy before "scriptLoad.load" during plugins load - classic editor in div': getBeforeScriptLoadTestCase( {
			editorType: 'classic',
			elementName: 'div'
		} ),

		'test should not throw any error after detach and destroy before "scriptLoad.load" during plugins load - divarea editor in textarea': getBeforeScriptLoadTestCase( {
			editorType: 'divarea',
			elementName: 'textarea'
		} ),

		'test should not throw any error after detach and destroy before "scriptLoad.load" during plugins load - divarea editor in div': getBeforeScriptLoadTestCase( {
			editorType: 'divarea',
			elementName: 'div'
		} ),

		'test should not throw any error after detach and destroy before "scriptLoad.load" during plugins load - inline editor in textarea': getBeforeScriptLoadTestCase( {
			editorType: 'inline',
			elementName: 'textarea'
		} ),

		'test should not throw any error after detach and destroy before "scriptLoad.load" during plugins load - inline editor in div': getBeforeScriptLoadTestCase( {
			editorType: 'inline',
			elementName: 'div'
		} ),

		'test should not throw any error after detach and destroy after iframe "load" event - classic editor in textarea': getAfterIframeLoadTestCase( {
			editorType: 'classic',
			elementName: 'textarea'
		} ),

		'test should not throw any error after detach and destroy after iframe "load" event - classic editor in div': getAfterIframeLoadTestCase( {
			editorType: 'classic',
			elementName: 'div'
		} ),

		'test should not change mode when editor is detached': function() {
			bender.editorBot.create( {
				name: 'test_editor1'
			}, function( bot ) {
				var spy = sinon.spy(),
					editor = bot.editor,
					stub = sinon.stub( editor.container, 'isDetached' ).returns( true );


				editor.on( 'beforeSetMode', function() {
					setTimeout( function() {
						resume( function() {
							stub.restore();

							sinon.assert.notCalled( spy );
							assertErrors();
						} );
					}, 50 );
				} );

				editor.once( 'mode', spy );
				editor.setMode( 'source', spy );

				wait();
			} );
		},

		'test should not change mode when editor is destroyed': function() {
			bender.editorBot.create( {
				name: 'test_editor2'
			}, function( bot ) {
				var spy = sinon.spy(),
					editor = bot.editor;

				editor.status = 'destroyed';

				editor.on( 'beforeSetMode', function() {
					setTimeout( function() {
						resume( function() {
							sinon.assert.notCalled( spy );
							assertErrors();
						} );
					}, 50 );
				} );

				editor.once( 'mode', spy );
				editor.setMode( 'source', spy );

				wait();
			} );
		}
	} );

	// Function provides a single test case function, which creates an editor according to provided options.
	// Editor is immediately destroyed when creation function is called. The `isAsynchronous` flag indicates,
	// if destroy method should be run synchronously or asynchronously in `setTimeout` function.
	//
	// @param {Object} options See `options` for `initializeEditor()` function below.
	// @param {Boolean} options.isAsynchronous Whether to run `editor.destroy()` method in setTimeout.
	// @returns {Function}
	function getSimpleTestCase( options ) {
		return function() {
			options.wrapper = this.wrapper;

			var data = initializeEditor( options );

			if ( options.isAsynchronous ) {
				setTimeout( function() {
					data.editorContainer.remove();
					data.editor.destroy();
				}, 30 );
			} else {
				data.editorContainer.remove();
				data.editor.destroy();
			}

			wait();
		};
	}


	// Function provides a single test case function, which creates an editor according to provided options.
	// Editor is destroyed before `loaded` event.
	//
	// @param {Object} options See `options` for `initializeEditor()` function below.
	// @returns {Function}
	function getBeforeLoadedTestCase( options ) {
		return function() {
			options.wrapper = this.wrapper;

			var data = initializeEditor( options );

			data.editor.on( 'loaded', function() {
				data.editorContainer.remove();
				data.editor.destroy();
			}, this, null, -1000000 );

			wait();
		};
	}

	// Function provides a single test case function, which creates an editor according to provided options.
	// Editor is destroyed before `scriptLoader.load` is fired during plugins load.
	//
	// @param {Object} options See `options` for `initializeEditor()` function below.
	// @returns {Function}
	function getBeforeScriptLoadTestCase( options ) {
		return function() {
			options.wrapper = this.wrapper;

			var data = initializeEditor( options, true );

			runBeforeScriptLoaded( function() {
				data.editorContainer.remove();
				data.editor.destroy();
			} );

			data.editor = CKEDITOR[ data.createMethod ]( data.editorContainer.$, data.config );

			wait();
		};
	}

	// Function provides a single test case function, which creates an editor according to provided options.
	// Editor is destroyed just after iframe is load.
	//
	// Note: This test case has to be run exclusively with iframe-type editors.
	//
	// @param {Object} options See `options` for `initializeEditor()` function below.
	// @returns {Function}
	function getAfterIframeLoadTestCase( options ) {
		return function() {
			options.wrapper = this.wrapper;

			var data = initializeEditor( options );

			runAfterEditableIframeLoad( data.editor, function() {
				data.editorContainer.remove();
				data.editor.destroy();
			} );

			wait();
		};
	}

	// Creates editor instance according to provided options.
	//
	// @param {Object} options
	// @param {String} options.editorType One of the editor types: 'classic', 'divarea', 'inline'.
	// @param {String} options.elementName Name of html element where editor is initialized: 'textarea' or 'div'.
	// @param {Boolean} skipEditorCreate Whether to skip editor creation (`CKEDITOR.*`) call.
	// @returns {Function}
	function initializeEditor( options, skipEditorCreate ) {
		var editorType = options.editorType,
			editorContainer = CKEDITOR.dom.element.createFromHtml( options.elementName === 'textarea' ? '<textarea></textarea>' : '<div contenteditable="true"></div>' ),
			createMethod = editorType === 'inline' ? 'inline' : 'replace',
			config = {},
			editor;

		if ( editorType === 'divarea' ) {
			config.extraPlugins = 'divarea';
		} else if ( editorType === 'inline' ) {
			config.extraPlugins = 'floatingspace';
		}

		options.wrapper.append( editorContainer );

		CKEDITOR.on( 'instanceDestroyed', function() {
			resume( assertErrors );
		} );

		if ( skipEditorCreate !== true ) {
			editor = CKEDITOR[ createMethod ]( editorContainer.$, config );
		}

		return {
			editor: editor,
			editorContainer: editorContainer,
			createMethod: createMethod,
			config: config
		};
	}

	function assertErrors() {
		if ( currentError ) {
			var failMsg = currentError;

			currentError = null;

			assert.fail( failMsg );
		} else {
			assert.pass( 'Passed without errors.' );
		}
	}
} )();
