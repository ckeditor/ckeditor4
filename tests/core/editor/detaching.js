/* bender-tags: editor */
/* bender-include: _helpers/tools.js */
/* bender-ui: collapsed */
// jscs:disable maximumLineLength
/* bender-ckeditor-plugins: about,a11yhelp,basicstyles,bidi,blockquote,clipboard,colorbutton,colordialog,copyformatting,contextmenu,dialogadvtab,div,elementspath,enterkey,entities,filebrowser,find,flash,floatingspace,font,format,forms,horizontalrule,htmlwriter,image,iframe,indentlist,indentblock,justify,language,link,list,liststyle,magicline,maximize,newpage,pagebreak,pastefromword,pastetext,preview,print,removeformat,resize,save,selectall,showblocks,showborders,smiley,sourcearea,specialchar,stylescombo,tab,table,tableselection,tabletools,templates,toolbar,undo,uploadimage,wysiwygarea */
// jscs:enable maximumLineLength
/* global detachingTools */

( function() {
	var runBeforeScriptLoaded = detachingTools.runBeforeScriptLoaded,
		runAafterEditableIframeLoad = detachingTools.runAafterEditableIframeLoad,
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

	//  * Function provides single test case function, which creates an editor according to provided options.
	//  * Editor is imediately destroyed when creation function is called.
	//  * `isAsynchronous` flags indicates, if destroy method should be run synchronously or asynchronoously in setTimout.
	//  *
	//  * @param {Object} options
	//  * @param {String} options.editorType one of the editor types: 'classic', 'divarea', 'inline'
	//  * @param {String} options.elemntName name of an html element where editor is initialized: 'textarea' or 'div'
	//  * @param {Boolean} options.isAsynchronous flag which run `editor.destroy()` method in setTimeout.
	//  * @returns {Funciton}
	function getSimpleTestCase( options ) {
		return function() {
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

			this.wrapper.append( editorContainer );

			registerAsserts();

			editor = CKEDITOR[ createMethod ]( editorContainer.$, config );

			if ( options.isAsynchronous ) {
				setTimeout( function() {
					editorContainer.remove();
					editor.destroy();
				}, 30 );
			} else {
				editorContainer.remove();
				editor.destroy();
			}
			wait();
		};
	}


	//  * Function provides single test case function, which creates an editor according to provided options.
	//  * Editor is destroyed before `loaded` event.
	//  *
	//  * @param {Object} options
	//  * @param {String} options.editorType one of the editor types: 'classic', 'divarea', 'inline'
	//  * @param {String} options.elemntName name of an html element where editor is initialized: 'textarea' or 'div'
	//  * @param {Boolean} options.isAsynchronous flag which run `editor.destroy()` method in setTimeout.
	//  * @returns {Funciton}
	function getBeforeLoadedTestCase( options ) {
		return function() {
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

			this.wrapper.append( editorContainer );

			registerAsserts();

			editor = CKEDITOR[ createMethod ]( editorContainer.$, config );

			editor.on( 'loaded', function() {
				editorContainer.remove();
				editor.destroy();
			}, this, null, -1000000 );

			wait();
		};
	}

	//  * Function provides single test case function, which creates an editor according to provided options.
	//  * Editor is destroyed before scriptLoad.load is fired during plugins load.
	//  *
	//  * @param {Object} options
	//  * @param {String} options.editorType one of the editor types: 'classic', 'divarea', 'inline'
	//  * @param {String} options.elemntName name of an html element where editor is initialized: 'textarea' or 'div'
	//  * @returns {Funciton}
	function getBeforeScriptLoadTestCase( options ) {
		return function() {
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

			this.wrapper.append( editorContainer );

			registerAsserts();

			runBeforeScriptLoaded( function() {
				editorContainer.remove();
				editor.destroy();
			} );

			editor = CKEDITOR[ createMethod ]( editorContainer.$, config );

			wait();
		};
	}

	//  * Function provides single test case function, which creates an editor according to provided options.
	//  * Editor is destroyed just after iframe is load.
	//  * Please notice this test case has to be run exclusively with iframe-type editors.
	//  *
	//  * @param {Object} options
	//  * @param {String} options.editorType one of the editor types: 'classic', 'divarea', 'inline'
	//  * @param {String} options.elemntName name of an html element where editor is initialized: 'textarea' or 'div'
	//  * @returns {Funciton}
	function getAfterIframeLoadTestCase( options ) {
		return function() {
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

			this.wrapper.append( editorContainer );

			registerAsserts();

			editor = CKEDITOR[ createMethod ]( editorContainer.$, config );

			runAafterEditableIframeLoad( editor, function() {
				editorContainer.remove();
				editor.destroy();
			} );

			wait();
		};
	}

	function registerAsserts() {
		CKEDITOR.on( 'instanceDestroyed', function() {
			resume( assertErrors );
		} );
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
