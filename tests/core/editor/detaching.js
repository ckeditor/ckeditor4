/* bender-tags: editor */
// jscs:disable maximumLineLength
/* bender-ckeditor-plugins: about,a11yhelp,basicstyles,bidi,blockquote,clipboard,colorbutton,colordialog,copyformatting,contextmenu,dialogadvtab,div,elementspath,enterkey,entities,filebrowser,find,flash,floatingspace,font,format,forms,horizontalrule,htmlwriter,image,iframe,indentlist,indentblock,justify,language,link,list,liststyle,magicline,maximize,newpage,pagebreak,pastefromword,pastetext,preview,print,removeformat,resize,save,selectall,showblocks,showborders,smiley,sourcearea,specialchar,stylescombo,tab,table,tableselection,tabletools,templates,toolbar,undo,uploadimage,wysiwygarea */
// jscs:enable maximumLineLength

( function() {
	var fakeComponent = CKEDITOR.document.findOne( '#fake-component' ),
		container = CKEDITOR.document.findOne( '#container' ),
		editor, currentError;

	window.onerror = function( error ) {
		currentError = error;
	};

	fakeComponent.remove();
	fakeComponent = fakeComponent.getOuterHtml();

	bender.test( {
		tearDown: function() {
			editor.destroy();
			editor = null;
		},
		// (#3115)
		'test detach and destroy synchronously': testDetach( function( editor, detach ) {
			detach();
		} ),

		// (#3115)
		'test detach and destroy asynchronously': testDetach( function( editor, detach ) {
			setTimeout( detach );
		} ),

		// (#3115)
		'test detach before firing editor#loaded event': testDetach( function( editor, detach ) {
			var mock, spy;

			editor.on( 'loaded', function() {
				mock = sinon.stub( this, '_shouldPreventInit' ).returns( true );
				spy = sinon.spy( this, 'setMode' );
				detach();
			}, null, null, -9999 );
		} ),

		// (#3115)
		'test detach before scriptLoader.load fires it\'s callback': testDetach( function( editor, detach ) {
			var pluginsLoad = CKEDITOR.plugins.load;

			CKEDITOR.plugins.load = function() {
				CKEDITOR.plugins.load = pluginsLoad;

				var scriptLoaderLoad = CKEDITOR.scriptLoader.load;

				CKEDITOR.scriptLoader.load = function() {
					CKEDITOR.scriptLoader.load = scriptLoaderLoad;

					var spy = sinon.spy();

					editor.once( 'loaded', spy );
					editor.once( 'pluginsLoaded', spy );
					editor.once( 'instanceLoaded', spy );

					detach( function() {
						assert.isFalse( spy.called, 'load events shouldn\'t be fired.' );
					} );

					scriptLoaderLoad.apply( this, arguments );
				};

				pluginsLoad.apply( this, arguments );
			};
		} ),

		// (#3115)
		'test editor set mode when editor is detached': testSetMode( function( editor ) {
			sinon.stub( editor.container, 'isDetached' ).returns( true );
		} ),

		// (#3115)
		'test editor set mode when editor is destroyed': testSetMode( function( editor ) {
			editor.status = 'destroyed';
		} )
	} );

	function testDetach( callback ) {
		return function() {
			// IE & Edge throws `Permission Denied` sometimes, but debugger won't break on that error, so can't fix it.
			if ( CKEDITOR.env.ie ) {
				assert.ignore();
			}
			var component = CKEDITOR.dom.element.createFromHtml( fakeComponent );

			container.append( component );

			editor = CKEDITOR.replace( 'editor' );

			callback( editor, detach );

			wait();

			function detach( callback ) {
				component.remove();

				editor.once( 'destroy', function() {
					// Wait for async callbacks.
					setTimeout( function() {
						resume( function() {
							if ( callback ) {
								callback();
							}

							assertErrors();
						} );
					}, 100 );
				} );

				editor.destroy();
			}
		};
	}

	function testSetMode( callback ) {
		return function() {
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 11 ) {
				assert.ignore();
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
} )();
