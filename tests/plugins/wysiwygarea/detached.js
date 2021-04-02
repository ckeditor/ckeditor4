/* bender-tags: editor, 4462 */
/* bender-ckeditor-plugins: basicstyles,toolbar */

( function() {
	'use strict';

	bender.test( {
		'test reattached editor contains the same data with observed default dom object': function() {
			var startupData = '<p>CKEditor4</p>';

			bender.editorBot.create( {
				startupData: startupData,
				name: 'editor' + new Date().getTime()
			}, function( bot ) {
				var editorContainer = bot.editor.container,
					editorContainerParent = editorContainer.getParent();

				editorContainer.remove();
				editorContainerParent.append( editorContainer );

				CKEDITOR.tools.setTimeout( function() {
					resume( function() {
						var iframeElement = bot.editor.ui.space( 'contents' ).findOne( 'iframe' ),
							editorData = iframeElement.getFrameDocument().getBody().getHtml();

						assert.beautified.html( startupData, editorData, 'Reattached editor should have the same data. Observing default object.' );
					} );
				}, 500 );

				wait();
			} );
		},

		'test reattached editor parent restores editor data with observed default dom object': function() {
			var startupData = '<p>CKEditor4</p>';

			bender.editorBot.create( {
				startupData: startupData,
				name: 'editor' + new Date().getTime()
			}, function( bot ) {
				var editorContainerParent = bot.editor.container.getParent(),
					parentParent = editorContainerParent.getParent();

				editorContainerParent.remove();
				parentParent.append( editorContainerParent );

				CKEDITOR.tools.setTimeout( function() {
					resume( function() {
						var iframeElement = bot.editor.ui.space( 'contents' ).findOne( 'iframe' ),
							editorData = iframeElement.getFrameDocument().getBody().getHtml();

						assert.beautified.html( startupData, editorData, 'Reattached editor parent should restore editor data. Observing default object.' );
					} );
				}, 500 );

				wait();
			} );
		},

		'test reattached editor restores editor data with editor parent observed': function() {
			var startupData = '<p>CKEditor4</p>',
				detachableParent = CKEDITOR.document.getById( 'editorDetachableParent' );

			bender.editorBot.create( {
				name: 'editor',
				startupData: startupData,
				config: {
					detachableParent: detachableParent.$
				}
			}, function( bot ) {
				var editorContainer = bot.editor.container;

				editorContainer.remove();
				detachableParent.append( editorContainer );

				CKEDITOR.tools.setTimeout( function() {
					resume( function() {
						var iframeElement = bot.editor.ui.space( 'contents' ).findOne( 'iframe' ),
							editorData = iframeElement.getFrameDocument().getBody().getHtml();

						assert.beautified.html( startupData, editorData, 'Reattached editor should restore data. Observing editor parent.' );
					} );
				}, 500 );

				wait();
			} );
		},

		'test reattached editor parent restores editor data with observed parent of detached element': function() {
			var startupData = '<p>CKEditor4</p>',
				observedParent = CKEDITOR.document.getById( 'editorObservedParent1' );

			bender.editorBot.create( {
				name: 'editor1',
				startupData: startupData,
				config: {
					detachableParent: observedParent.$
				}
			}, function( bot ) {
				var editorContainerParent = bot.editor.container;

				editorContainerParent.remove();
				observedParent.append( editorContainerParent );

				CKEDITOR.tools.setTimeout( function() {
					resume( function() {
						var iframeElement = bot.editor.ui.space( 'contents' ).findOne( 'iframe' ),
							editorData = iframeElement.getFrameDocument().getBody().getHtml();

						assert.beautified.html( startupData, editorData, 'Reattached editor parent should restore data. Observing parent of detached element.' );
					} );
				}, 500 );

				wait();
			} );
		},

		'test reattached editor makes editor data empty with observed invalid DOM object': function() {
			var startupData = '<p>CKEditor4</p>',
				invalidObserveTarget = CKEDITOR.document.getById( 'invalidObserveTarget' ).$;

			bender.editorBot.create( {
				name: 'editor2',
				startupData: startupData,
				config: {
					detachableParent: invalidObserveTarget
				}
			}, function( bot ) {
				var editorContainer = bot.editor.container,
					editorContainerParent = editorContainer.getParent();

				editorContainer.remove() ;
				editorContainerParent.append( editorContainer );

				CKEDITOR.tools.setTimeout( function() {
					resume( function() {
						var iframeElement = bot.editor.ui.space( 'contents' ).findOne( 'iframe' ),
							editorData = iframeElement.getFrameDocument().getBody().getHtml();

						assert.areEqual( '', editorData, 'Reattached editor. Editor data should be empty. Observing invalid DOM object.' );
					} );
				}, 500 );

				wait();
			} );
		},

		'test reattached editor parent makes editor data empty with observed invalid DOM object': function() {
			var startupData = '<p>CKEditor4</p>',
				invalidObserveTarget = CKEDITOR.document.getById( 'invalidObserveTarget' ).$;

			bender.editorBot.create( {
				name: 'editor3',
				startupData: startupData,
				config: {
					detachableParent: invalidObserveTarget
				}
			}, function( bot ) {
				var editorContainerParent = bot.editor.container.getParent(),
					parentParent = editorContainerParent.getParent();

				editorContainerParent.remove() ;
				parentParent.append( editorContainerParent );

				CKEDITOR.tools.setTimeout( function() {
					resume( function() {
						var iframeElement = bot.editor.ui.space( 'contents' ).findOne( 'iframe' ),
							editorData = iframeElement.getFrameDocument().getBody().getHtml();

						assert.areEqual( '', editorData, 'Reattached editor parent. Editor data should be empty. Observing invalid DOM object.' );
					} );
				}, 500 );

				wait();
			} );
		},

		'test reattached editor parent makes editor data empty with observed detached parent element': function() {
			var startupData = '<p>CKEditor4</p>',
				invalidObserveTarget = CKEDITOR.document.getById( 'editorDetachableParent2' );

			bender.editorBot.create( {
				name: 'editor4',
				startupData: startupData,
				config: {
					detachableParent: invalidObserveTarget.$
				}
			}, function( bot ) {
				invalidObserveTarget.remove() ;
				CKEDITOR.document.getBody().append( invalidObserveTarget );

				CKEDITOR.tools.setTimeout( function() {
					resume( function() {
						var iframeElement = bot.editor.ui.space( 'contents' ).findOne( 'iframe' ),
							editorData = iframeElement.getFrameDocument().getBody().getHtml();

						assert.areEqual( '', editorData, 'Reattached editor parent. Editor data should be empty. Observing detached element.' );
					} );
				}, 500 );

				wait();
			} );
		},

		'test reattached editor with iframe content contains the same data with observed default dom object': function() {
			var startupData = '<p>CKEditor4</p>';

			bender.editorBot.create( {
				startupData: startupData,
				name: 'editor' + new Date().getTime(),
				config: {
					extraAllowedContent: 'iframe'
				}
			}, function( bot ) {
				var editorContainer = bot.editor.container,
					editorContainerParent = editorContainer.getParent();

				editorContainer.remove();
				editorContainerParent.append( editorContainer );

				CKEDITOR.tools.setTimeout( function() {
					resume( function() {
						var iframeElement = bot.editor.ui.space( 'contents' ).findOne( 'iframe' ),
							editorData = iframeElement.getFrameDocument().getBody().getHtml();

						assert.beautified.html( startupData, editorData, 'Reattached editor should have the same data with iframe. Observing default object.' );
					} );
				}, 500 );

				wait();
			} );
		}

	} );
} )();
