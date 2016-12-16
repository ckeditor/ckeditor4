/* bender-tags: editor,unit,widget */
/* bender-ckeditor-plugins: image2,link,toolbar */
/* global widgetTestsTools, image2TestsTools */

( function() {
	'use strict';

	var getById = widgetTestsTools.getWidgetById,
		fixHtml = image2TestsTools.fixHtml,

		blockStructure = /html,body,div,(figure|p),span,img/,
		blockStructureWithLink = /html,body,div,(figure|p),span,a,img/,
		inlineStructure = 'html,body,p,span,img',
		inlineStructureWithLink = 'html,body,p,span,a,img';

	bender.editor = {
		config: {
			extraAllowedContent: 'img figure[id]',
			language: 'en'
		}
	};

	bender.editors = {
		editor1: {
			name: 'test_editor1',
			config: {
				image2_alignClasses: [ 'align-left', 'align-center', 'align-right' ],
				image2_disableResizer: true,

				stylesSet: [
					{ name: 'Image 30%', type: 'widget', widget: 'image', attributes: { 'class': 'image30' } }
				]
			}
		}
	};

	function getParentsList( el ) {
		var parents = el.getParents(),
			arr = [];

		for ( var i = 0; i < parents.length; i++ )
			arr.push( parents[ i ].getName() );

		return arr.join( ',' );
	}

	function assertStructure( widget, structure ) {
		assert.isMatching( structure, getParentsList( widget.parts.image ), 'Link is a part of the block widget' );
	}

	function assertCommandStates( editor, states ) {
		var linkCmd = editor.getCommand( 'link' ),
			unlinkCmd = editor.getCommand( 'unlink' );

		assert.areSame( states[ 0 ], linkCmd.state, 'Link command state' );
		assert.areSame( states[ 1 ], unlinkCmd.state, 'Unlink command state' );
	}

	bender.test( {
		// Opens link dialog, then
		// 	-> sets URL (dialogCallback)
		// 	-> closes dialog
		// 	-> asserts internal structure of linked widget (afterStructure)
		// 	-> asserts widget.data.link (afterData)
		// 	-> asserts widget.parts.link
		//	-> asserts command states of focused widget (commandStates)
		// 	-> asserts data structure of linked widget (expected)
		linkWithDialog: function( expected, dialogCallback, afterStructure, commandStates, afterData ) {
			var bot = this.editorBot;

			bot.dialog( 'link', function( dialog ) {
				try {
					dialogCallback( dialog );
					dialog.getButton( 'ok' ).click();
				} catch ( e ) {
					throw e;
				} finally {
					dialog.hide();
				}

				var widget = getById( bot.editor, 'x' );

				assertStructure( widget, afterStructure );

				for ( var d in afterData )
					objectAssert.areEqual( afterData[ d ], widget.data.link[ d ], 'Data is set properly' );

				assert.areSame( 'a', widget.parts.link.getName(), 'Widget.parts.link is registered' );

				assertCommandStates( bot.editor, commandStates );

				assert.areSame( fixHtml( expected ), fixHtml( bot.getData() ), 'Link in the output data' );
			} );
		},

		// Sets editor data then,
		// 	-> focuses the widget
		// 	-> runs linkWithDialog.
		linkBareWithDialog: function( name, dialogCallback, afterStructure, afterData, commandStates ) {
			var bot = this.editorBot,
				that = this;

			bender.tools.testInputOut( name, function( source, expected ) {
				bot.setData( source, function() {
					// Executing link on selected widget.
					getById( bot.editor, 'x' ).focus();

					that.linkWithDialog( expected, dialogCallback, afterStructure, commandStates, afterData );
				} );
			} );
		},

		// Sets editor data then,
		// 	-> sets widget data
		// 	-> focuses the widget
		// 	-> asserts widget.parts.link
		// 	-> asserts internal structure of linked widget (afterStructure)
		//	-> asserts command states of focused widget (commandStates)
		// 	-> asserts data structure of linked widget (expected)
		linkBareWithSetData: function( name, linkData, afterStructure, commandStates ) {
			var bot = this.editorBot;

			bender.tools.testInputOut( name, function( source, expected ) {
				bot.setData( source, function() {
					// Setting link with data.
					getById( bot.editor, 'x' ).setData( 'link', linkData );

					var widget = getById( bot.editor, 'x' );

					widget.focus();

					assert.areSame( 'a', widget.parts.link.getName(), 'Widget.parts.link is registered' );
					assertStructure( widget, afterStructure );
					assertCommandStates( bot.editor, commandStates );

					assert.areSame( fixHtml( expected ), fixHtml( bot.getData() ), 'Link in the output data' );
				} );
			} );
		},

		// Sets editor data, then
		// 	-> sets widget data
		// 	-> focuses the widget
		// 	-> asserts internal structure of linked widget (afterStructure)
		//	-> asserts command states of focused widget (commandStates)
		// 	-> asserts data structure of linked widget
		setWidgetData: function( name, data, afterStructure, commandStates ) {
			var bot = this.editorBot;

			bender.tools.testInputOut( name, function( source, expected ) {
				bot.setData( source, function() {
					var widget = getById( bot.editor, 'x' );

					widget.setData( data );

					widget = getById( bot.editor, 'x' );
					widget.focus();
					assertStructure( widget, afterStructure );
					assertCommandStates( bot.editor, commandStates );
					assert.areSame( fixHtml( expected ), fixHtml( bot.getData() ), 'Link once shifted state' );
				} );
			} );
		},

		// Sets editor data, then
		// 	-> asserts internal structure of linked widget (beforeStructure)
		//	-> focuses the widget
		//	-> unlinks the widget
		// 	-> asserts widget.parts.link
		// 	-> asserts fake selection
		// 	-> asserts focused widget
		// 	-> asserts internal structure of unlinked widget (afterStructure)
		//	-> asserts command states of focused widget
		// 	-> asserts data structure of linked widget
		unlink: function( name, beforeStructure, afterStructure, commandStates ) {
			var bot = this.editorBot;

			bender.tools.testInputOut( name, function( source, expected ) {
				bot.setData( source, function() {
					var widget = getById( bot.editor, 'x' );
					widget.focus();
					assertStructure( widget, beforeStructure );

					bot.editor.execCommand( 'unlink' );

					widget = getById( bot.editor, 'x' );
					assert.isUndefined( widget.parts.link, 'Widget.parts.link is not registered' );
					assert.isTrue( !!bot.editor.getSelection().isFake, 'Fake selection once unlinked' );
					assert.areSame( bot.editor.widgets.focused, widget, 'Widget remains focused once unlinked' );
					assertStructure( widget, afterStructure );
					assertCommandStates( bot.editor, commandStates );
					assert.areSame( fixHtml( expected ), fixHtml( bot.getData() ), 'Unlinked the widget' );
				} );
			} );
		},

		// Sets editor data, then
		// 	-> focuses the widget
		//	-> opens link dialog
		// 	-> asserts field values in link dialog (fields)
		dialogFields: function( name, fields ) {
			var bot = this.editorBot,
				tab;

			bot.setData( bender.tools.getValueAsHtml( name ), function() {
				var widget = getById( bot.editor, 'x' );
				widget.focus();

				assert.isObject( widget.data.link, 'Widget is linked' );

				bot.dialog( 'link', function( dialog ) {
					try {
						for ( var t in fields ) {
							tab = fields[ t ];

							for ( var f in tab )
								assert.isMatching( tab[ f ], dialog.getValueOf( t, f ), 'Field ' + t + '.' + f + ': value must match.' );
						}
					} catch ( e ) {
						throw e;
					} finally {
						dialog.hide();
					}
				} );
			} );
		},

		// -- Link bare with dialog ---------------------------

		'test link bare widget (link dialog): inline, none': function() {
			this.linkBareWithDialog( 'inline-none', function( dialog ) {
				dialog.setValueOf( 'info', 'url', 'x' );
			}, inlineStructureWithLink, {
				url: {
					protocol: 'http://',
					url: 'x'
				}
			}, [ 2, 2 ] );
		},

		'test link bare widget (link dialog): inline, align': function() {
			this.linkBareWithDialog( 'inline-align', function( dialog ) {
				dialog.setValueOf( 'info', 'url', 'x' );
			}, inlineStructureWithLink, {
				url: {
					protocol: 'http://',
					url: 'x'
				}
			}, [ 2, 2 ] );
		},

		'test link bare widget (link dialog): inline, centered': function() {
			this.linkBareWithDialog( 'inline-centered', function( dialog ) {
				dialog.setValueOf( 'info', 'url', 'x' );
			}, blockStructureWithLink, {
				url: {
					protocol: 'http://',
					url: 'x'
				}
			}, [ 2, 2 ] );
		},

		'test link bare widget (link dialog): captioned, none': function() {
			this.linkBareWithDialog( 'captioned-none', function( dialog ) {
				dialog.setValueOf( 'info', 'url', 'x' );
			}, blockStructureWithLink, {
				url: {
					protocol: 'http://',
					url: 'x'
				}
			}, [ 2, 2 ] );
		},

		'test link bare widget (link dialog): captioned, align': function() {
			this.linkBareWithDialog( 'captioned-align', function( dialog ) {
				dialog.setValueOf( 'info', 'url', 'x' );
			}, blockStructureWithLink, {
				url: {
					protocol: 'http://',
					url: 'x'
				}
			}, [ 2, 2 ] );
		},

		'test link bare widget (link dialog): captioned, centered': function() {
			this.linkBareWithDialog( 'captioned-centered', function( dialog ) {
				dialog.setValueOf( 'info', 'url', 'x' );
			}, blockStructureWithLink, {
				url: {
					protocol: 'http://',
					url: 'x'
				}
			}, [ 2, 2 ] );
		},

		// -- Link bare with data ---------------------------

		'test link bare widget (widget.setData): inline, none': function() {
			this.linkBareWithSetData( 'inline-none', {
				type: 'url',
				url: {
					protocol: 'http://',
					url: 'x'
				}
			}, inlineStructureWithLink, [ 2, 2 ] );
		},

		'test link bare widget (widget.setData): inline, align': function() {
			this.linkBareWithSetData( 'inline-align', {
				type: 'url',
				url: {
					protocol: 'http://',
					url: 'x'
				}
			}, inlineStructureWithLink, [ 2, 2 ] );
		},

		'test link bare widget (widget.setData): inline, centered': function() {
			this.linkBareWithSetData( 'inline-centered', {
				type: 'url',
				url: {
					protocol: 'http://',
					url: 'x'
				}
			}, blockStructureWithLink, [ 2, 2 ] );
		},

		'test link bare widget (widget.setData): captioned, none': function() {
			this.linkBareWithSetData( 'captioned-none', {
				type: 'url',
				url: {
					protocol: 'http://',
					url: 'x'
				}
			}, blockStructureWithLink, [ 2, 2 ] );
		},

		'test link bare widget (widget.setData): captioned, align': function() {
			this.linkBareWithSetData( 'captioned-align', {
				type: 'url',
				url: {
					protocol: 'http://',
					url: 'x'
				}
			}, blockStructureWithLink, [ 2, 2 ] );
		},

		'test link bare widget (widget.setData): captioned, centered': function() {
			this.linkBareWithSetData( 'captioned-centered', {
				type: 'url',
				url: {
					protocol: 'http://',
					url: 'x'
				}
			}, blockStructureWithLink, [ 2, 2 ] );
		},

		// -- Shift state of linked ---------------------------

		'test shift state of linked widget: inline, set align': function() {
			this.setWidgetData( 'shift-inline-align', {
				align: 'right'
			}, inlineStructureWithLink, [ 2, 2 ] );
		},

		'test shift state of linked widget: inline, center': function() {
			this.setWidgetData( 'shift-inline-center', {
				align: 'center'
			}, blockStructureWithLink, [ 2, 2 ] );
		},

		'test shift state of linked widget: inline, add caption': function() {
			this.setWidgetData( 'shift-inline-caption', {
				hasCaption: true
			}, blockStructureWithLink, [ 2, 2 ] );
		},

		'test shift state of linked widget: captioned, set align': function() {
			this.setWidgetData( 'shift-captioned-align', {
				align: 'right'
			}, blockStructureWithLink, [ 2, 2 ] );
		},

		'test shift state of linked widget: captioned, center': function() {
			this.setWidgetData( 'shift-captioned-center', {
				align: 'center'
			}, blockStructureWithLink, [ 2, 2 ] );
		},

		'test shift state of linked widget: captioned, de-caption': function() {
			this.setWidgetData( 'shift-captioned-decaption', {
				hasCaption: false
			}, inlineStructureWithLink, [ 2, 2 ] );
		},

		// -- Update link attributes --------------------------------

		'test update link attributes (widget.setData)': function() {
			this.setWidgetData( 'update-link-setdata', {
				link: {
					type: 'url',
					url: {
						protocol: 'ftp://',
						url: 'y'
					},
					target: {
						type: null
					},
					advanced: {
						advId: 'foo',
						advLangDir: 'rtl'
					}
				}
			}, inlineStructureWithLink, [ 2, 2 ] );
		},

		// -- Unlink linked (with command) ---------------------------

		'test unlink linked widget (command): inline': function() {
			this.unlink( 'unlink-inline',
				inlineStructureWithLink, inlineStructure, [ 2, 0 ] );
		},

		'test unlink linked widget (command): inline, aligned': function() {
			this.unlink( 'unlink-inline-aligned',
				inlineStructureWithLink, inlineStructure, [ 2, 0 ] );
		},

		'test unlink linked widget (command): inline, centered': function() {
			this.unlink( 'unlink-inline-centered',
				blockStructureWithLink, blockStructure, [ 2, 0 ] );
		},

		'test unlink linked widget (command): captioned': function() {
			this.unlink( 'unlink-captioned',
				blockStructureWithLink, blockStructure, [ 2, 0 ] );
		},

		'test unlink linked widget (command): captioned, aligned': function() {
			this.unlink( 'unlink-captioned-aligned',
				blockStructureWithLink, blockStructure, [ 2, 0 ] );
		},

		'test unlink linked widget (command): captioned, centered': function() {
			this.unlink( 'unlink-captioned-centered',
				blockStructureWithLink, blockStructure, [ 2, 0 ] );
		},

		'test unlink inline widget from a link which does not belong to the widget (command)': function() {
			var bot = this.editorBot,
				editor = bot.editor,

				html = '<p>' +
					'<a href="http://foo.com">xx ' +
						'<img alt="z" src="_assets/foo.png" id="x" /> ' +
					'yy</a>' +
				'</p>',
				expected = '<p>' +
					'<a href="http://foo.com">xx </a>' +
						'<img alt="z" src="_assets/foo.png" id="x" /> ' +
					'<a href="http://foo.com">yy </a>' +
				'</p>';

			bot.setData( html, function() {
				var widget = getById( bot.editor, 'x' );
				widget.focus();

				assert.isFalse( !!widget.parts.link, 'widget.parts#link is not defined' );
				assertCommandStates( bot.editor, [ 2, 2 ] );

				editor.execCommand( 'unlink' );

				assert.areSame( fixHtml( expected ), fixHtml( editor.getData() ), 'Widget out of link' );
			} );
		},

		// -- Unlink linked (with data) ---------------------------

		'test unlink linked widget (widget.setData): inline': function() {
			this.setWidgetData( 'unlink-inline', {
				link: null
			}, inlineStructure, [ 2, 0 ] );
		},

		'test unlink linked widget (widget.setData): inline, aligned': function() {
			this.setWidgetData( 'unlink-inline-aligned', {
				link: null
			}, inlineStructure, [ 2, 0 ] );
		},

		'test unlink linked widget (widget.setData): inline, centered': function() {
			this.setWidgetData( 'unlink-inline-centered', {
				link: null
			}, blockStructure, [ 2, 0 ] );
		},

		'test unlink linked widget (widget.setData): captioned': function() {
			this.setWidgetData( 'unlink-captioned', {
				link: null
			}, blockStructure, [ 2, 0 ] );
		},

		'test unlink linked widget (widget.setData): captioned, aligned': function() {
			this.setWidgetData( 'unlink-captioned-aligned', {
				link: null
			}, blockStructure, [ 2, 0 ] );
		},

		'test unlink linked widget (widget.setData): captioned, centered': function() {
			this.setWidgetData( 'unlink-captioned-centered', {
				link: null
			}, blockStructure, [ 2, 0 ] );
		},

		// ---------------------------

		'test open dialog on doubleclick': function() {
			var bot = this.editorBot,
				editor = bot.editor;

			bot.setData( '<p><a href="http://x"><img alt="x" id="x" src="_assets/foo.png" /></a></p>', function() {
				var widget = getById( bot.editor, 'x' ),
					dialogs = [];

				// Selection must be right for link plugin to
				// handle doubleclick correctly.
				widget.focus();

				// We'll check which dialogs open on doubleclick.
				var revert = bender.tools.replaceMethod( editor, 'openDialog', function( name ) {
					dialogs.push( name );
				} );

				try {
					// Let the party on!
					editor.fire( 'doubleclick', { element: widget.element } );

					var sel = bot.editor.getSelection();

					assert.isTrue( !!sel.isFake, 'Selection is fake' );
					assert.areSame( widget.wrapper, sel.getSelectedElement(), 'Widget is selected element' );
					assert.areSame( widget, bot.editor.widgets.focused, 'Widget is still focused' );
					assert.areSame( 'image2', dialogs.join( ',' ), 'Link dialog does not open on widget doubleclick.' );
				} catch ( e ) {
					throw e;
				} finally {
					revert();
				}
			} );
		},

		'test open dialog on doubleclick - in link environment': function() {
			var bot = this.editorBot,
				editor = bot.editor;

			bot.setData( '<p><a href="http://x">x<img alt="x" id="x" src="_assets/foo.png" />x</a></p>', function() {
				var widget = getById( bot.editor, 'x' ),
					dialogs = [];

				// Selection must be right for link plugin to
				// handle doubleclick correctly.
				widget.focus();

				// We'll check which dialogs open on doubleclick.
				var revert = bender.tools.replaceMethod( editor, 'openDialog', function( name ) {
					dialogs.push( name );
				} );

				try {
					// Let the party on!
					editor.fire( 'doubleclick', { element: widget.element } );

					var sel = bot.editor.getSelection();

					assert.isTrue( !!sel.isFake, 'Selection is fake' );
					assert.areSame( widget.wrapper, sel.getSelectedElement(), 'Widget is selected element' );
					assert.areSame( widget, bot.editor.widgets.focused, 'Widget is still focused' );
					assert.areSame( 'image2', dialogs.join( ',' ), 'Link dialog does not open on widget doubleclick.' );
				} catch ( e ) {
					throw e;
				} finally {
					revert();
				}
			} );
		},

		// ----------------------------

		'test image in link environment': function() {
			var bot = this.editorBot,
				editor = bot.editor;

			bot.setData( '<p><a href="http://ping">x<img alt="x" id="x" src="_assets/foo.png" />x</a></p>', function() {
				var widget = getById( bot.editor, 'x' );

				widget.focus();

				bot.dialog( 'link', function( dialog ) {
					try {
						assert.areSame( 'ping', dialog.getValueOf( 'info', 'url' ), 'The outer link is being edited' );

						dialog.setValueOf( 'info', 'url', 'pong' );
						dialog.getButton( 'ok' ).click();

						assert.areSame( fixHtml( '<p><a href="http://pong">x<img alt="x" id="x" src="_assets/foo.png" />x</a></p>' ),
							fixHtml( editor.getData() ), 'The outer link was updated' );
					} catch ( e ) {
						throw e;
					} finally {
						dialog.hide();
					}
				} );
			} );
		},

		// ----------------------------

		'test load data into link dialog - all': function() {
			this.dialogFields( 'load-data-all', {
				info: {
					linkType: 'url',
					protocol: 'ftp://',
					url: 'x'
				},
				target: {
					linkTargetType: 'frame',
					linkTargetName: 'f'
				},
				advanced: {
					advId: 'foo',
					advLangDir: 'rtl',
					advAccessKey: 'k',
					advName: 'bar',
					advLangCode: 'es',
					advTabIndex: '42',
					advTitle: 'boom',
					advContentType: 'zoom',
					advCSSClasses: 'bang',
					advCharset: 'ding',
					advRel: 'dong',
					advStyles: /margin-left:\s*10px;?/i
				}
			} );
		},

		'test load data into link dialog - mailto': function() {
			this.dialogFields( 'load-data-mailto', {
				info: {
					linkType: 'email',
					emailAddress: 'a',
					emailSubject: 'b',
					emailBody: 'c'
				},
				target: {
					linkTargetType: 'notSet',
					linkTargetName: ''
				},
				advanced: {
					advId: '',
					advLangDir: '',
					advAccessKey: '',
					advName: '',
					advLangCode: '',
					advTabIndex: '',
					advTitle: '',
					advContentType: '',
					advCSSClasses: '',
					advCharset: '',
					advRel: '',
					advStyles: ''
				}
			} );
		},

		'test link in figcaption': function() {
			var bot = this.editorBot,
				editor = bot.editor,

				html = '<p>y</p>' +
					'<figure class="image" style="float:right">' +
						'<img alt="x" id="x" src="_assets/foo.png" />' +
						'<figcaption>cap<a href="http://captioned">tio</a>ned</figcaption>' +
					'</figure>',
				expected = '<p>y</p>' +
					'<figure class="image" style="float:right">' +
						'<a href="http://foo"><img alt="x" id="x" src="_assets/foo.png" /></a>' +
						'<figcaption>cap<a href="http://captioned">tio</a>ned</figcaption>' +
					'</figure>';

			bot.setData( html, function() {
				var widget = getById( bot.editor, 'x' );

				assert.isFalse( !!widget.parts.link, 'widget.parts#link is not defined' );

				widget.focus();

				bot.dialog( 'link', function( dialog ) {
					try {
						assert.areSame( '', dialog.getValueOf( 'info', 'url' ), 'There\'s no link' );

						dialog.setValueOf( 'info', 'url', 'foo' );
						dialog.getButton( 'ok' ).click();

						assert.areSame( fixHtml( expected ), fixHtml( editor.getData() ), 'The link was created' );
						assert.isTrue( !!widget.parts.link, 'widget.parts#link is defined' );

						widget = getById( bot.editor, 'x' );
						assertStructure( widget, blockStructureWithLink );
					} catch ( e ) {
						throw e;
					} finally {
						dialog.hide();
					}
				} );
			} );
		},

		// #11801
		'test load editor anchors into link dialog when linking for the first time': function() {
			var bot = this.editorBot,
				editor = bot.editor,

				html = '<p>' +
						'<a id="a" name="a"></a>' +
						'<img alt="x" id="x" src="_assets/foo.png" />' +
					'</p>',
				expected = '<p>' +
						'<a id="a" name="a"></a>' +
						'<a href="#a"><img alt="x" id="x" src="_assets/foo.png" /></a>' +
					'</p>';

			bot.setData( html, function() {
				var widget = getById( bot.editor, 'x' );

				widget.focus();

				bot.dialog( 'link', function( dialog ) {
					try {
						dialog.setValueOf( 'info', 'linkType', 'anchor' );

						// Note: There's always one empty <option>.
						assert.areSame( 2, dialog.getContentElement( 'info', 'anchorName' ).getInputElement().getChildCount(), 'Anchors loaded into dialog' );
						dialog.setValueOf( 'info', 'anchorName', 'a' );
						dialog.getButton( 'ok' ).click();
					} catch ( e ) {
						throw e;
					} finally {
						dialog.hide();
					}

					assert.areSame( fixHtml( expected ), fixHtml( editor.getData() ), 'The image links to an anchor' );

					widget = getById( bot.editor, 'x' );
					CKEDITOR.dom.element.createFromHtml( '<a id="b" name="b"></a>', editor.document ).insertAfter( widget.wrapper );

					bot.dialog( 'link', function( dialog ) {
						try {
							// Note: There's always one empty <option>.
							assert.areSame( 3, dialog.getContentElement( 'info', 'anchorName' ).getInputElement().getChildCount(), 'Updated anchors loaded into dialog' );
						} catch ( e ) {
							throw e;
						} finally {
							dialog.hide();
						}
					} );
				} );
			} );
		},

		// #13197
		'test align classes transfered from nested image to widget wrapper': function() {
			var bot = this.editorBots.editor1,
				html = '<p>' +
					'<a id="x" href="#foo">' +
						'<img src="_assets/foo.png" alt="bag" class="image30 align-right" />' +
					'</a>' +
				'</p>';

			bot.setData( html, function() {
				var widget = getById( bot.editor, 'x' );

				assert.isTrue( widget.wrapper.hasClass( 'align-right' ) );
				assert.areSame( 'right', widget.data.align );
				assert.isFalse( widget.parts.image.hasClass( 'align-right' ) );
			} );
		},

		// #13885
		'test custom link attributes getter': function() {
			CKEDITOR.plugins.image2.getLinkAttributesGetter = function() {
				return function() {
					return {
						set: {
							'data-cke-saved-href': 'custom-href',
							'data-custom': 'custom'
						},
						removed: [ 'target' ]
					};
				};
			};

			this.setWidgetData( 'custom-link-getter', {
				link: {
					type: 'url',
					url: {
						protocol: 'ftp://',
						url: 'y'
					},
					target: {
						type: null
					},
					advanced: {
						advId: 'foo',
						advLangDir: 'rtl'
					}
				}
			}, inlineStructureWithLink, [ 2, 2 ] );
		},

		// #13885
		'test custom link attributes parser': function() {
			var bot = this.editorBot;

			CKEDITOR.plugins.image2.getLinkAttributesParser = function() {
				return function() {
					return {
						href: 'foo',
						bar: 'baz'
					};
				};
			};

			bot.setData( '<p><a href="http://x"><img alt="x" id="x" src="_assets/foo.png" /></a></p>', function() {
				var widget = getById( bot.editor, 'x' );

				objectAssert.areEqual( {
					href: 'foo',
					bar: 'baz'
				}, widget.data.link, 'Custom attributes parser output.' );
			} );
		}
	} );
} )();
