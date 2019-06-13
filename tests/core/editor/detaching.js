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
		'test detach and destroy synchronously': testDetach(),
		// (#3115)
		'test detach and destroy after 0ms': testDetach( 0 ),
		// (#3115)
		'test detach and destroy after 15ms': testDetach( 15 ),
		// (#3115)
		'test detach and destroy after 30ms': testDetach( 35 ),
		// (#3115)
		'test detach and destroy after 50ms': testDetach( 50 ),
		// (#3115)
		'test detach and destroy after 75ms': testDetach( 75 ),
		// (#3115)
		'test detach and destroy after 100ms': testDetach( 100 ),
		// (#3115)
		'test detach and destroy after 150ms': testDetach( 150 ),
		// (#3115)
		'test detach and destroy after 200ms': testDetach( 200 ),
		// (#3115)
		'test detach and destroy after 250ms': testDetach( 250 ),
		// (#3115)
		'test detach and destroy after 400ms': testDetach( 400 ),
		// (#3115)
		'test detach and destroy after 600ms': testDetach( 600 ),
		// (#3115)
		'test detach and destroy after 900ms': testDetach( 900 ),
		// (#3115)
		'test editor set mode when editor is detached': testSetMode( function( editor ) {
			sinon.stub( editor.container, 'isDetached' ).returns( true );
		} ),
		// (#3115)
		'test editor set mode when editor is destroyed': testSetMode( function( editor ) {
			editor.status = 'destroyed';
		} )
	} );

	function testDetach( time ) {
		return function() {
			// IE & Edge throws `Permission Denied` sometimes, but debugger won't break on that error, so can't fix it.
			if ( CKEDITOR.env.ie ) {
				assert.ignore();
			}
			var component = CKEDITOR.dom.element.createFromHtml( fakeComponent );

			container.append( component );

			editor = CKEDITOR.replace( 'editor' );

			if ( time !== undefined ) {
				setTimeout( detach, time );
			} else {
				detach();
			}

			wait();

			function detach() {
				component.remove();

				editor.once( 'destroy', function() {
					// Wait for async callbacks.
					setTimeout( function() {
						resume( function() {
							if ( currentError ) {
								var failMsg = currentError;

								currentError = null;

								assert.fail( failMsg );
							} else {
								assert.pass( 'Passed without errors.' );
							}
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

				editor.on( 'mode', spy );
				editor.setMode( 'testmode', spy );

				setTimeout( function() {
					resume( function() {
						assert.isFalse( spy.called );
					} );
				}, 30 );

				wait();
			} );
		};
	}
} )();
