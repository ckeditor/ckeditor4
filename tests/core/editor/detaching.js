/* bender-tags: editor */
/* bender-include: _helpers/tools.js */
/* bender-ui: collapsed */
// jscs:disable maximumLineLength
/* bender-ckeditor-plugins: about,a11yhelp,basicstyles,bidi,blockquote,clipboard,colorbutton,colordialog,copyformatting,contextmenu,dialogadvtab,div,elementspath,enterkey,entities,filebrowser,find,flash,floatingspace,font,format,forms,horizontalrule,htmlwriter,image,iframe,indentlist,indentblock,justify,language,link,list,liststyle,magicline,maximize,newpage,pagebreak,pastefromword,pastetext,preview,print,removeformat,resize,save,selectall,showblocks,showborders,smiley,sourcearea,specialchar,stylescombo,tab,table,tableselection,tabletools,templates,toolbar,undo,uploadimage,wysiwygarea */
// jscs:enable maximumLineLength
/* global detachingTools */

( function() {
	var detachWhenScriptLoaded = detachingTools.detachWhenScriptLoaded,
		detachBeforeIframeLoad = detachingTools.detachBeforeIframeLoad,
		fakeComponent = CKEDITOR.document.findOne( '#fake-component' ),
		container = CKEDITOR.document.findOne( '#container' ),
		editor, currentError;

	window.onerror = function( error ) {
		currentError = error;
	};

	fakeComponent.remove();
	fakeComponent = fakeComponent.getOuterHtml();

	// (#3115)
	var tests = createDetatchTests(
		[ {
			name: 'test detach and destroy synchronously',
			callback: function( detach ) {
				detach();
			}
		}, {
			name: 'test detach and destroy asynchronously',
			callback: function( detach ) {
				setTimeout( detach );
			}
		}, {
			name: 'test detach before firing editor#loaded event',
			callback: function( detach, editor ) {
				editor.once( 'loaded', detach, null, null, -9999 );
			}
		}, {
			name: 'test detach before scriptLoader.load fires it\'s callback',
			callback: detachWhenScriptLoaded
		}, {
			name: 'test detach before iframe#onload',
			callback: function( detach, editor ) {
				detachBeforeIframeLoad( detach, editor );
			},
			ignore: !CKEDITOR.env.gecko && !CKEDITOR.env.ie || CKEDITOR.env.edge,
			editor: 'classic'
		} ]
	);

	// (#3115)
	tests[ 'test editor set mode when editor is detached' ] = testSetMode( function( editor ) {
		sinon.stub( editor.container, 'isDetached' ).returns( true );
	} );

	// (#3115)
	tests[ 'test editor set mode when editor is destroyed' ] = testSetMode( function( editor ) {
		editor.status = 'destroyed';
	} );

	// bender.editor = true;

	bender.test( {
		init: function() {
			this.wrapper = CKEDITOR.document.getById( 'wrapper' );
		},

		tearDown: function() {
			this.wrapper.setHtml( '' );
			CKEDITOR.removeAllListeners();
			CKEDITOR.fire( 'reset' );
		},

		'test detach and destroy synchronously - classic editor in textarea': getSimpleTestCase( {
			editorType: 'classic',
			elementName: 'textarea'
		} ),

		'test detach and destroy synchronously - classic editor in div': getSimpleTestCase( {
			editorType: 'classic',
			elementName: 'div'
		} ),

		'test detach and destroy synchronously - divarea editor in textarea': getSimpleTestCase( {
			editorType: 'divarea',
			elementName: 'textarea'
		} ),

		'test detach and destroy synchronously - divarea editor in div': getSimpleTestCase( {
			editorType: 'divarea',
			elementName: 'div'
		} ),

		'test detach and destroy synchronously - inline editor in textarea': getSimpleTestCase( {
			editorType: 'inline',
			elementName: 'textarea'
		} ),

		'test detach and destroy synchronously - inline editor in div': getSimpleTestCase( {
			editorType: 'inline',
			elementName: 'div'
		} ),

		'test detach and destroy asynchronously - classic editor in textarea': getSimpleTestCase( {
			editorType: 'classic',
			elementName: 'textarea',
			isAsynchronous: true
		} ),

		'test detach and destroy asynchronously - classic editor in div': getSimpleTestCase( {
			editorType: 'classic',
			elementName: 'div',
			isAsynchronous: true
		} ),

		'test detach and destroy asynchronously - divarea editor in textarea': getSimpleTestCase( {
			editorType: 'divarea',
			elementName: 'textarea',
			isAsynchronous: true
		} ),

		'test detach and destroy asynchronously - divarea editor in div': getSimpleTestCase( {
			editorType: 'divarea',
			elementName: 'div',
			isAsynchronous: true
		} ),

		'test detach and destroy asynchronously - inline editor in textarea': getSimpleTestCase( {
			editorType: 'inline',
			elementName: 'textarea',
			isAsynchronous: true
		} ),

		'test detach and destroy asynchronously - inline editor in div': getSimpleTestCase( {
			editorType: 'inline',
			elementName: 'div',
			isAsynchronous: true
		} )
	} );


	function addAsynchronousAsserts() {
		CKEDITOR.on( 'instanceDestroyed', function() {
			resume( function() {
				var failMsg = currentError;

				if ( failMsg ) {
					currentError = null;

					assert.fail( failMsg );
				} else {
					assert.pass( 'Editor should be destroyed without errors.' );
				}

			} );
		} );
	}

	function getSimpleTestCase( options ) {
		return function() {
			var editorType = options.editorType,
				wrapper = this.wrapper,
				editorContainer = CKEDITOR.dom.element.createFromHtml( options.elementName === 'textarea' ? '<textarea></textarea>' : '<div contenteditable="true"></div>' ),
				createMethod = editorType === 'inline' ? 'inline' : 'replace',
				config = {},
				editor;

			if ( editorType === 'divarea' ) {
				config.extraPlugins = 'divarea';
			} else if ( editorType === 'inline' ) {
				config.extraPlugins = 'floatingspace';
			}

			wrapper.append( editorContainer );

			addAsynchronousAsserts();

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


	function createDetatchTests( tests ) {
		var editors = [ 'classic', 'inline', 'divarea' ],
			newTests = {};

		forEach( tests, function( testOptions ) {
			forEach( editors, function( editorName ) {
				var tcName = testOptions.name + ' (' + editorName + ', ';

				if ( testOptions.ignore ) {
					return;
				}

				if ( testOptions.editor && testOptions.editor !== editorName ) {
					return;
				}

				newTests[ tcName + 'div)' ] = testDetach( testOptions.callback, editorName, 'div' );
				newTests[ tcName + 'textarea)' ] = testDetach( testOptions.callback, editorName, 'textarea' );
			} );
		} );

		return newTests;
	}

	function testDetach( callback, editorName, elementName ) {
		return function() {
			var html = elementName === 'div' ? fakeComponent.replace( /textarea/g, 'div' ) : fakeComponent,
				component = CKEDITOR.dom.element.createFromHtml( html ),
				config = {};

			container.append( component );

			switch ( editorName ) {
				case 'divarea':
					config.extraPlugins = 'divarea';
					editor = CKEDITOR.replace( 'editor', config );
					break;
				case 'classic':
					editor = CKEDITOR.replace( 'editor', config );
					break;
				case 'inline':
					editor = CKEDITOR.inline( 'editor' );
			}

			callback( detach, editor );

			wait();

			function detach() {
				component.remove();

				editor.once( 'destroy', function() {
					// Wait for async callbacks.
					setTimeout( function() {
						resume( assertErrors );
					}, 100 );
				} );

				destroyEditor();
			}
		};
	}

	function testSetMode( callback ) {
		return function() {
			if ( editor ) {
				destroyEditor();
			}

			bender.editorBot.create( {}, function( bot ) {
				editor = bot.editor;

				callback( editor );

				var spy = sinon.spy();

				editor.once( 'mode', spy );
				editor.setMode( 'source', spy );

				setTimeout( function() {
					resume( function() {
						assert.isFalse( spy.called );

						assertErrors();
					} );
				}, 30 );

				wait();
			} );
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

	function destroyEditor() {
		editor.destroy();
		editor = null;
	}

	function forEach() {
		return CKEDITOR.tools.array.forEach.apply( null, arguments );
	}
} )();
