/* bender-tags: editor,clipboard */
/* bender-ckeditor-plugins: basicstyles, pastetools */
/* bender-include: ../clipboard/_helpers/pasting.js */
/* global createFixtures, assertPasteEvent, paste */

( function() {
	'use strict';

	var basicConfig = {
		language: 'en',
		on: {
			pluginsLoaded: function( evt ) {
				var editor = evt.editor;

				editor.pasteTools.register( {
					canHandle: function( evt ) {
						return evt.data.type === 'html';
					},

					handle: function( evt ) {
						evt.data.dataValue = '<p><strong>SURPRISE!</strong></p>';
					}
				} );
			}
		}
	};

	bender.editors = {
		classic: {
			config: basicConfig
		},

		divarea: {
			config: CKEDITOR.tools.object.merge( basicConfig, { extraPlugins: 'divarea' } )
		},

		inline: {
			creator: 'inline',
			config: basicConfig
		}
	};

	var fixtures = createFixtures( {
			html: {
				type: 'html',
				dataValue: '<p><strong>SURPRISE!</strong></p>'
			},

			text: {
				type: 'text',
				dataValue: 'foobar'
			}
		} ),
		tests = {
			'test transforming pasted html content': function( editor, bot ) {
				bot.setData( '', function() {
					var pasteData = fixtures.get( 'html' );

					assertPasteEvent( editor, { type: 'html', dataValue: '<p><s>Some striked text</s></p>' }, pasteData );
				} );
			},

			'test not transforming content of unregistered type': function( editor, bot ) {
				bot.setData( '', function() {
					var pasteData = fixtures.get( 'text' );

					assertPasteEvent( editor, { type: 'text', dataValue: 'foobar' }, pasteData );
				} );
			},

			'test getting clipboard data (custom types)': function( editor, bot ) {
				if ( !CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
					assert.ignore();
				}

				bot.setData( '', function() {
					var getClipboardData = CKEDITOR.plugins.pastetools.getClipboardData,
						dataTransfer = new CKEDITOR.plugins.clipboard.dataTransfer(),
						html = '<p>Test</p>',
						custom = 'hublabubla',
						fullHtml = '<meta charset="UTF-8">' + html;

					dataTransfer.setData( 'text/html', fullHtml );
					dataTransfer.setData( 'custom/type', custom );

					editor.once( 'paste', function( evt ) {
						resume( function() {
							var data = evt.data,
								actualHtml = getClipboardData( data, 'text/html' ),
								actualCustom = getClipboardData( data, 'custom/type' );

							assert.areSame( fullHtml, actualHtml, 'Correct HTML was returned' );
							assert.areSame( custom, actualCustom, 'Correct custom data was returned' );
						} );
					}, null, null, 999 );

					paste( editor, { dataTransfer: dataTransfer, dataValue: html } );
					wait();
				} );
			},

			'test getting clipboard data (no custom types)': function( editor, bot ) {
				if ( CKEDITOR.plugins.clipboard.isCustomDataTypesSupported ) {
					assert.ignore();
				}

				bot.setData( '', function() {
					var getClipboardData = CKEDITOR.plugins.pastetools.getClipboardData,
						text = 'Test',
						html = '<p>' + text + '</p>';

					editor.once( 'paste', function( evt ) {
						resume( function() {
							var data = evt.data,
								actualHtml = getClipboardData( data, 'text/html' ),
								actualCustom = getClipboardData( data, 'custom/type' );

							assert.areSame( html, actualHtml, 'Correct HTML was returned' );
							assert.areSame( null, actualCustom, 'Correct custom data was returned' );
						} );
					}, null, null, 999 );

					paste( editor, { dataValue: html } );
					wait();
				} );
			}
		};

	tests = bender.tools.createTestsForEditors( CKEDITOR.tools.object.keys( bender.editors ), tests );

	CKEDITOR.tools.extend( tests, {
		'test multiple handlers (priority & next)': function() {
			var order = [];

			bender.editorBot.create( {
				name: 'test_multiple-handlers1',
				config: {
					plugins: 'pastetools',
					on: {
						pluginsLoaded: function( evt ) {
							var editor = evt.editor;

							editor.pasteTools.register( {
								priority: 999,
								canHandle: function() {
									return true;
								},

								handle: function( evt, next ) {
									evt.data.dataValue = '<p><em>Oh yes!</em></p>';
									order.push( 1 );
									next();
								}
							} );

							editor.pasteTools.register( {
								canHandle: function() {
									return true;
								},

								handle: function( evt, next ) {
									evt.data.dataValue = '<p><strong>Oh no!</strong></p>';
									order.push( 2 );
									next();
								}
							} );
						}
					}
				}
			}, function( bot ) {
				var editor = bot.editor;
				editor.on( 'paste', function( evt ) {
					resume( function() {
						var handlers = editor.pasteTools.handlers;

						assert.areSame( 999, handlers[ 0 ].priority, 'Priority of handler 1' );
						assert.areSame( 10, handlers[ 1 ].priority, 'Priority of handler 2' );

						arrayAssert.itemsAreSame( [ 2, 1 ], order, 'Order of handlers' );
						assert.areSame( '<p><em>Oh yes!</em></p>', evt.data.dataValue, 'Correctly transformed content' );
					} );
				}, null, null, 999 );

				paste( editor, { dataValue: '<p>Test</p>' } );
				wait();
			} );
		},

		'test multiple handlers (no next)': function() {
			var handler1spy = sinon.spy(),
				handler2spy = sinon.spy();

			bender.editorBot.create( {
				name: 'test_multiple-handlers2',
				config: {
					on: {
						pluginsLoaded: function( evt ) {
							var editor = evt.editor;

							editor.pasteTools.register( {
								canHandle: function() {
									return true;
								},

								handle: handler1spy
							} );

							editor.pasteTools.register( {
								canHandle: function() {
									return true;
								},

								handle: handler2spy
							} );
						}
					}
				}
			}, function( bot ) {
				var editor = bot.editor;
				editor.on( 'paste', function() {
					resume( function() {
						assert.areSame( 1, handler1spy.callCount, 'Handler 1 call count' );
						assert.areSame( 0, handler2spy.callCount, 'Handler 2 call count' );
					} );
				}, null, null, 999 );

				paste( editor, { dataValue: '<p>Test</p>' } );
				wait();
			} );
		},

		'test getting config variables': function() {
			var cases = [
				{
					name: 'pasteTools one',
					configVariable: 'someConfigVariable',
					expected: 'whatever',
					editor: {
						config: {
							pasteTools_someConfigVariable: 'whatever'
						}
					}
				},

				{
					name: 'pasteFromWord one',
					configVariable: 'someConfigVariable',
					expected: 'whatever',
					editor: {
						config: {
							pasteFromWord_someConfigVariable: 'whatever'
						}
					}
				},

				{
					name: 'pasteFromWord one (without underscore)',
					configVariable: 'someConfigVariable',
					expected: 'whatever',
					editor: {
						config: {
							pasteFromWordSomeConfigVariable: 'whatever'
						}
					}
				},

				{
					name: 'overriding PfW value',
					configVariable: 'someConfigVariable',
					expected: 'whatever',
					editor: {
						config: {
							pasteFromWord_someConfigVariable: 'whenever',
							pasteTools_someConfigVariable: 'whatever',
							pasteToolsSomeConfigVariable: 'wherever'
						}
					}
				},

				{
					name: 'no variable',
					configVariable: 'someConfigVariable',
					expected: undefined,
					editor: {
						config: {}
					}
				},

				{
					name: 'no editor',
					configVariable: 'someConfigVariable',
					expected: undefined
				}
			];

			CKEDITOR.tools.array.forEach( cases, function( testCase ) {
				var value = CKEDITOR.plugins.pastetools.getConfigValue( testCase.editor, testCase.configVariable );

				assert.areSame( testCase.expected, value, testCase.name );
			} );
		},

		'test getContentGeneratorName detects \'microsoft\' generators': function() {
			var testCases = [
					'<meta name=Generator content="Microsoft Word 15">',
					'<meta name=Generator content="Microsoft Word 11">',
					'<meta name=Generator content="Microsoft Excel 15">',
					'<meta name=Generator content="Microsoft OneNote 15">',
					'<html><meta name=Generator content="Microsoft Word 14"></html>',
					'<meta name="Generator" content="Microsoft Word 14">',
					'<meta name=\'Generator\' content=\'Microsoft Word 14\'>',
					'<META NAME=GENERATOR content="Microsoft Word 15">'
				],
				getContentGeneratorName = CKEDITOR.plugins.pastetools.getContentGeneratorName;

			CKEDITOR.tools.array.forEach( testCases, function( content, index ) {
				assert.areSame( 'microsoft', getContentGeneratorName( content ),
					'The content number: ' + index + ', should return "microsoft" string.' );
			} );
		},

		'test getContentGeneratorName detects \'libreoffice\' generators': function() {
			var testCases = [
					'<meta name="generator" content="LibreOffice 6.3.2.2 (MacOSX)"/>',
					'<meta name="generator" content="LibreOffice 6.3.2.2 (Windows)"/>',
					'<html><meta name="generator" content="LibreOffice 6.3.2.2 (Windows)"/></html>',
					'<meta name=generator content=LibreOffice 6.3.2.2 (MacOSX) />',
					'<meta name=\'generator\' content=\'LibreOffice 6.3.2.2 (MacOSX)\'/>',
					'<META NAME=GENERATOR content="LibreOffice 6.3.2.2 (MacOSX)"/>'
				],
				getContentGeneratorName = CKEDITOR.plugins.pastetools.getContentGeneratorName;

			CKEDITOR.tools.array.forEach( testCases, function( content, index ) {
				assert.areSame( 'libreoffice', getContentGeneratorName( content ),
					'The content number: ' + index + ', should return "libreoffice" string.' );
			} );
		},

		'test getContentGeneratorName detects \'unknown\' generators': function() {
			var testCases = [
					'<meta name=Generator content="Foo">',
					'<meta name=Generator content=Foo>',
					'<meta name=Generator content="Fake Microsoft">',
					'<meta name=\'Generator\' content=\'Foo\'>'
				],
				getContentGeneratorName = CKEDITOR.plugins.pastetools.getContentGeneratorName;

			CKEDITOR.tools.array.forEach( testCases, function( content, index ) {
				assert.areSame( 'unknown', getContentGeneratorName( content ),
					'The content number: ' + index + ', should return "unknown" string.' );
			} );
		},

		'test getContentGeneratorName detects undefined generators': function() {
			var testCases = [
					'',
					'foo bar',
					'<html><meta name=sth content="not generator" /></html'
				],
				getContentGeneratorName = CKEDITOR.plugins.pastetools.getContentGeneratorName;

			CKEDITOR.tools.array.forEach( testCases, function( content, index ) {
				assert.isUndefined( getContentGeneratorName( content ),
					'The content number: ' + index + ', should return undefiend' );
			} );
		},

		'test CKEDITOR.pasteFilters is an alias of CKEDITOR.plugins.pastetools.filters': function() {
			assert.areSame( CKEDITOR.plugins.pastetools.filters, CKEDITOR.pasteFilters );
		}
	} );

	bender.test( tests );
} )();
