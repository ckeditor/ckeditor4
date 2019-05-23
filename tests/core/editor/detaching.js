/* bender-tags: editor */
// jscs:disable maximumLineLength
/* bender-ckeditor-plugins: about,a11yhelp,basicstyles,bidi,blockquote,clipboard,colorbutton,colordialog,copyformatting,contextmenu,dialogadvtab,div,elementspath,enterkey,entities,filebrowser,find,flash,floatingspace,font,format,forms,horizontalrule,htmlwriter,image,iframe,indentlist,indentblock,justify,language,link,list,liststyle,magicline,maximize,newpage,pagebreak,pastefromword,pastetext,preview,print,removeformat,resize,save,selectall,showblocks,showborders,smiley,sourcearea,specialchar,stylescombo,tab,table,tableselection,tabletools,templates,toolbar,undo,uploadimage,wysiwygarea */
// jscs:enable maximumLineLength

( function() {
	var fakeComponent = CKEDITOR.document.findOne( '#fake-component' ),
		container = CKEDITOR.document.findOne( '#container' ),
		currentError;

	window.onerror = function( error ) {
		currentError = error;
	};

	fakeComponent.remove();
	fakeComponent = fakeComponent.getOuterHtml();

	bender.test( {
		// (#3115)
		'test detach and destroy after 0ms': test( 0 ),
		// (#3115)
		'test detach and destroy after 15ms': test( 15 ),
		// (#3115)
		'test detach and destroy after 30ms': test( 35 ),
		// (#3115)
		'test detach and destroy after 50ms': test( 50 ),
		// (#3115)
		'test detach and destroy after 75ms': test( 75 ),
		// (#3115)
		'test detach and destroy after 100ms': test( 100 ),
		// (#3115)
		'test detach and destroy after 150ms': test( 150 ),
		// (#3115)
		'test detach and destroy after 200ms': test( 200 ),
		// (#3115)
		'test detach and destroy after 250ms': test( 250 ),
		// (#3115)
		'test detach and destroy after 400ms': test( 400 ),
		// (#3115)
		'test detach and destroy after 600ms': test( 600 ),
		// (#3115)
		'test detach and destroy after 900ms': test( 900 )
	} );

	function test( time ) {
		return function() {
			// IE & Edge throws `Permission Denied` sometimes, but debugger won't break on that error, so can't fix it.
			if ( CKEDITOR.env.ie ) {
				assert.ignore();
			}
			var component = CKEDITOR.dom.element.createFromHtml( fakeComponent ),
				editor;

			container.append( component );

			editor = CKEDITOR.replace( 'editor' );

			setTimeout( detach, time );

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
} )();
