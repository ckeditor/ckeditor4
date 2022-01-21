/* bender-tags: editor, 4462 */
/* bender-ckeditor-plugins: basicstyles,toolbar,undo */

( function() {
	'use strict';

	function isSupportedEnvironment() {
		// Skip IE's below version 11. They don't support MutationObserver.
		return !( CKEDITOR.env.ie && CKEDITOR.env.version < 11 );
	}

	var startupData = '<p>CKEditor4</p>';

	bender.test( {
		'test recreating editor returns null from getSelection': function() {
			if ( !isSupportedEnvironment() ) {
				assert.ignore();
			}

			bender.editorBot.create( {
				startupData: startupData,
				name: 'editor' + new Date().getTime()
			}, function( bot ) {
				var editorContainer = bot.editor.container,
					editorContainerParent = editorContainer.getParent();

				bot.editor.on( 'contentDomUnload', function( evt ) {
					evt && evt.removeListener();
					resume( function() {
						var selection = bot.editor.getSelection();
						assert.isNull( selection, 'Selection should be null during recreation' );
					} );
				} );

				editorContainer.remove();
				editorContainerParent.append( editorContainer );

				wait();
			} );
		},

		'test reattached editor preserve undo step': function() {
			if ( !isSupportedEnvironment() ) {
				assert.ignore();
			}

			bender.editorBot.create( {
				startupData: startupData,
				name: 'editor' + new Date().getTime()
			}, function( bot ) {
				var editorContainer = bot.editor.container,
					editorContainerParent = editorContainer.getParent();

				bot.execCommand( 'bold' );

				editorContainer.remove();
				editorContainerParent.append( editorContainer );

				CKEDITOR.tools.setTimeout( function() {
					resume( function() {
						var undoCommand = bot.editor.getCommand( 'undo' );
						assert.areSame( CKEDITOR.TRISTATE_OFF, undoCommand.state, 'Reattached editor should preserve undo step' );
					} );
				}, 200 );

				wait();
			} );
		},

		'test reattached editor preserve redo step': function() {
			if ( !isSupportedEnvironment() ) {
				assert.ignore();
			}

			bender.editorBot.create( {
				startupData: startupData,
				name: 'editor' + new Date().getTime()
			}, function( bot ) {
				var editorContainer = bot.editor.container,
					editorContainerParent = editorContainer.getParent();

				bot.execCommand( 'bold' );
				bot.execCommand( 'undo' );

				editorContainer.remove();
				editorContainerParent.append( editorContainer );

				CKEDITOR.tools.setTimeout( function() {
					resume( function() {
						var redoCommand = bot.editor.getCommand( 'redo' );
						assert.areSame( CKEDITOR.TRISTATE_OFF, redoCommand.state, 'Reattached editor should preserve redo step' );
					} );
				}, 200 );

				wait();
			} );
		},

		'test reattached editor contains the same data with observed default dom object': function() {
			if ( !isSupportedEnvironment() ) {
				assert.ignore();
			}

			bender.editorBot.create( {
				startupData: startupData,
				name: 'editor' + new Date().getTime()
			}, function( bot ) {
				var editorContainer = bot.editor.container,
					editorContainerParent = editorContainer.getParent();

				editorContainer.remove();
				editorContainerParent.append( editorContainer );

				assertReattachedData( bot, startupData, 'Reattached editor should have the same data. Observing default object.' );

				wait();
			} );
		},

		'test reattached editor parent restores editor data with observed default dom object': function() {
			if ( !isSupportedEnvironment() ) {
				assert.ignore();
			}

			bender.editorBot.create( {
				startupData: startupData,
				name: 'editor' + new Date().getTime()
			}, function( bot ) {
				var editorContainerParent = bot.editor.container.getParent(),
					parentParent = editorContainerParent.getParent();

				editorContainerParent.remove();
				parentParent.append( editorContainerParent );

				assertReattachedData( bot, startupData, 'Reattached editor parent should restore editor data. Observing default object.' );

				wait();
			} );
		},

		'test reattached editor restores editor data with editor parent observed': function() {
			if ( !isSupportedEnvironment() ) {
				assert.ignore();
			}

			var observableParent = CKEDITOR.document.getById( 'editorDetachableParent' );

			bender.editorBot.create( {
				name: 'editor1',
				startupData: startupData,
				config: {
					observableParent: observableParent.$
				}
			}, function( bot ) {
				var editorContainer = bot.editor.container;

				editorContainer.remove();
				observableParent.append( editorContainer );

				assertReattachedData( bot, startupData, 'Reattached editor should restore data. Observing editor parent.' );

				wait();
			} );
		},

		'test reattached editor parent restores editor data with observed parent of detached element': function() {
			if ( !isSupportedEnvironment() ) {
				assert.ignore();
			}

			var observedParent = CKEDITOR.document.getById( 'editorObservedParent1' );

			bender.editorBot.create( {
				name: 'editor2',
				startupData: startupData,
				config: {
					observableParent: observedParent.$
				}
			}, function( bot ) {
				var editorContainerParent = bot.editor.container;

				editorContainerParent.remove();
				observedParent.append( editorContainerParent );

				assertReattachedData( bot, startupData, 'Reattached editor parent should restore data. Observing parent of detached element.' );

				wait();
			} );
		},

		'test reattached editor with iframe content contains the same data with observed default dom object': function() {
			if ( !isSupportedEnvironment() ) {
				assert.ignore();
			}

			bender.editorBot.create( {
				startupData: startupData,
				name: 'editor3',
				config: {
					extraAllowedContent: 'iframe'
				}
			}, function( bot ) {
				var editorContainer = bot.editor.container,
					editorContainerParent = editorContainer.getParent();

				editorContainer.remove();
				editorContainerParent.append( editorContainer );

				assertReattachedData( bot, startupData, 'Reattached editor should have the same data with iframe. Observing default object.' );

				wait();
			} );
		},

		'test reattached editor makes editor data empty with observed invalid DOM object': function() {
			if ( !isSupportedEnvironment() ) {
				assert.ignore();
			}

			var invalidObserveTarget = CKEDITOR.document.getById( 'invalidObserveTarget' ).$;

			bender.editorBot.create( {
				name: 'editor4',
				startupData: startupData,
				config: {
					observableParent: invalidObserveTarget
				}
			}, function( bot ) {
				var editorContainer = bot.editor.container,
					editorContainerParent = editorContainer.getParent();

				editorContainer.remove() ;
				editorContainerParent.append( editorContainer );

				assertReattachedData( bot, '', 'Reattached editor. Editor data should be empty. Observing invalid DOM object.' );

				wait();
			} );
		},

		'test reattached editor parent makes editor data empty with observed invalid DOM object': function() {
			if ( !isSupportedEnvironment() ) {
				assert.ignore();
			}

			var invalidObserveTarget = CKEDITOR.document.getById( 'invalidObserveTarget' ).$;

			bender.editorBot.create( {
				name: 'editor5',
				startupData: startupData,
				config: {
					observableParent: invalidObserveTarget
				}
			}, function( bot ) {
				var editorContainerParent = bot.editor.container.getParent(),
					parentParent = editorContainerParent.getParent();

				editorContainerParent.remove() ;
				parentParent.append( editorContainerParent );

				assertReattachedData( bot, '', 'Reattached editor parent. Editor data should be empty. Observing invalid DOM object.' );

				wait();
			} );
		},

		'test reattached editor parent makes editor data empty with observed detached parent element': function() {
			if ( !isSupportedEnvironment() ) {
				assert.ignore();
			}

			var invalidObserveTarget = CKEDITOR.document.getById( 'editorDetachableParent2' );

			bender.editorBot.create( {
				name: 'editor6',
				startupData: startupData,
				config: {
					observableParent: invalidObserveTarget.$
				}
			}, function( bot ) {
				invalidObserveTarget.remove() ;
				CKEDITOR.document.getBody().append( invalidObserveTarget );

				assertReattachedData( bot, '', 'Reattached editor parent. Editor data should be empty. Observing detached element.' );

				wait();
			} );
		}

	} );

	function assertReattachedData( bot, expectedData, customMessage ) {
		CKEDITOR.tools.setTimeout( function() {
			resume( function() {
				var iframeElement = bot.editor.ui.space( 'contents' ).findOne( 'iframe' ),
					editorData = iframeElement.getFrameDocument().getBody().getHtml();

				assert.beautified.html( expectedData, editorData, customMessage );
				bot.editor.destroy();
			} );
		}, 200 );
	}
} )();
