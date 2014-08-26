/* bender-tags: editor,unit */

( function() {
	'use strict';

	bender.test( {
		'test default configuration': function() {
			bender.editorBot.create( {
				name: 'test_default_config',
				config: {
					removePlugins: 'div,format,stylescombo,pagebreak'
				}
			}, function( bot ) {
				var editor = bot.editor,
					filter = editor.filter;

				assert.isTrue( filter instanceof CKEDITOR.filter );
				assert.isFalse( filter.customConfig );

				var rulesNumber = filter.allowedContent.length;

				assert.isTrue( filter.allow( 'a' ), 'Rule added' );
				assert.areEqual( rulesNumber + 1, filter.allowedContent.length );

				assert.isTrue( filter.allow( 'b', null, true ), 'Rule added in overwriteCustom mode' );
				assert.areEqual( rulesNumber + 2, filter.allowedContent.length );

				assert.areSame( editor, filter.editor );

				assert.isTrue( filter.check( 'p' ), 'P is allowed' );
				assert.isTrue( filter.check( 'br' ), 'BR is allowed' );
				assert.isFalse( filter.check( 'div' ), 'DIV is not allowed' );
			} );
		},

		'test custom configuration': function() {
			bender.editorBot.create( {
				name: 'test_custom_config',
				config: {
					allowedContent: 'p'
				}
			}, function( bot ) {
				var editor = bot.editor,
					filter = editor.filter;

				assert.isTrue( filter instanceof CKEDITOR.filter );
				assert.isTrue( filter.customConfig );

				var rulesNumber = filter.allowedContent.length;

				assert.isFalse( filter.allow( 'a' ), 'Rule rejected' );
				assert.areEqual( rulesNumber, filter.allowedContent.length );

				assert.isTrue( filter.allow( 'b', null, true ), 'Rule added in overwriteCustom mode' );
				assert.areEqual( rulesNumber + 1, filter.allowedContent.length );

				assert.areSame( editor, filter.editor );
			} );
		},

		'test extraAllowedContent': function() {
			bender.editorBot.create( {
				name: 'test_extra_allowed_content',
				config: {
					extraAllowedContent: 'b',
					removePlugins: 'basicstyles'
				}
			}, function( bot ) {
				var editor = bot.editor,
					filter = editor.filter;

				assert.isTrue( filter instanceof CKEDITOR.filter );
				assert.isFalse( filter.customConfig );

				assert.isTrue( filter.check( 'b' ) );
				assert.areSame( '<p>foo <b>bar</b> bom</p>', editor.dataProcessor.toHtml( '<p>foo <b>bar</b> <i>bom</i></p>' ) );

				var rulesNumber = filter.allowedContent.length;

				assert.isTrue( filter.allow( 'a' ), 'Rule added' );
				assert.areEqual( rulesNumber + 1, filter.allowedContent.length );

				assert.isTrue( filter.allow( 'c', null, true ), 'Rule added in overwriteCustom mode' );
				assert.areEqual( rulesNumber + 2, filter.allowedContent.length );

				assert.areSame( editor, filter.editor );
			} );
		},

		'test dynamic configuration': function() {
			bender.editorBot.create( {
				name: 'test_dynamic_config',
				config: {
					removePlugins: 'basicstyles'
				}
			}, function( bot ) {
				var editor = bot.editor,
					filter = editor.filter;

				assert.areSame( '<p>foo bar</p>', editor.dataProcessor.toHtml( '<p>foo <b>bar</b></p>' ), 'Test before.' );

				filter.allow( 'b' );

				assert.areSame( '<p>foo <b>bar</b></p>', editor.dataProcessor.toHtml( '<p>foo <b>bar</b></p>' ), 'Test after.' );
			} );
		},

		'test disabling filter': function() {
			bender.editorBot.create( {
				name: 'test_disabling_filter',
				config: {
					allowedContent: true
				}
			}, function( bot ) {
				var editor = bot.editor,
					filter = editor.filter;

				assert.areSame( '<p>foo <b class="a" foo="bar">bar</b></p>',
					editor.dataProcessor.toHtml( '<p>foo <b class="a" foo="bar">bar</b></p>' ) );

				assert.isTrue( filter.check( 'img[src]{width}' ) );
				assert.isTrue( filter.addFeature( {
					requiredContent: 'x',
					allowedContent: 'a'
				} ) );
			} );
		},

		'test disabling filter dynamically': function() {
			bender.editorBot.create( {
				name: 'test_disabling_filter_dyn',
				config: {
					removePlugins: 'format,basicstyles'
				}
			}, function( bot ) {
				var editor = bot.editor,
					filter = editor.filter;

				assert.isFalse( filter.check( 'h1' ) );
				assert.areSame( '<p>foo bar</p>',
					editor.dataProcessor.toHtml( '<p>foo <b class="a" foo="bar">bar</b></p>' ) );

				filter.disable();

				assert.areSame( '<p>foo <b class="a" foo="bar">bar</b></p>',
					editor.dataProcessor.toHtml( '<p>foo <b class="a" foo="bar">bar</b></p>' ) );
				assert.isTrue( filter.check( 'h1' ) );
				assert.isTrue( filter.addFeature( {
					requiredContent: 'x',
					allowedContent: 'a'
				} ) );
			} );
		},

		checkIntegration: function( bot ) {
			var editor = bot.editor;

			editor.focus();

			assert.areSame( '<p><strong>A</strong>B</p>', bot.getData(), 'Content was filtered on init' );

			assert.isFalse( editor.execCommand( 'italic' ), 'Italic is not allowed' );
			assert.isTrue( editor.execCommand( 'bold' ), 'Bold is allowed' );
		},

		'test integration - themedui': function() {
			bender.editorBot.create( {
				name: 'test_integration_themedui',
				config: {
					plugins: 'wysiwygarea,toolbar,basicstyles',
					removeButtons: 'Italic,Link'
				}
			}, this.checkIntegration );
		},

		'test integration - inline': function() {
			bender.editorBot.create( {
				creator: 'inline',
				name: 'test_integration_inline',
				config: {
					plugins: 'floatingspace,toolbar,basicstyles',
					removeButtons: 'Italic,Link'
				}
			}, this.checkIntegration );
		},

		'test whether rules are marked with feature name': function() {
			bender.editorBot.create( {
				name: 'test_rules_marking',
				config: {
					plugins: 'button'
				}
			}, function( bot ) {
				var editor = bot.editor;

				editor.ui.addButton( 'testButton', {
					allowedContent: 'a'
				} );

				editor.addCommand( 'testCommand', {
					allowedContent: 'b'
				} );

				editor.addFeature( editor.ui.items.testButton );
				editor.addFeature( editor.getCommand( 'testCommand' ) );

				var allowed = editor.filter.allowedContent;

				assert.areSame( 4, allowed.length );

				assert.areSame( 'default', allowed[ 0 ].featureName );
				assert.isTrue( CKEDITOR.tools.objectCompare( { br: true, p: true }, allowed[ 0 ].elements ) );

				assert.areSame( 'editorbot', allowed[ 1 ].featureName );

				assert.areSame( 'testbutton', allowed[ 2 ].featureName );
				assert.isTrue( CKEDITOR.tools.objectCompare( { a: true }, allowed[ 2 ].elements ) );

				assert.areSame( 'testcommand', allowed[ 3 ].featureName );
				assert.isTrue( CKEDITOR.tools.objectCompare( { b: true }, allowed[ 3 ].elements ) );
			} );
		},

		'test editor#dataFiltered event': function() {
			bender.editorBot.create( {
				name: 'test_editor_datafiltered_event',
				config: {
					plugins: 'basicstyles,toolbar,clipboard',
					allowedContent: 'p b; i(cl1){color}; a[href]; img[src]; div(!cl1)'
				}
			}, function( bot ) {
				var editor = bot.editor,
					fired = 0;

				editor.focus();

				editor.on( 'dataFiltered', function() {
					fired++;
				} );

				function test( input, num, msg ) {
					editor.dataProcessor.toHtml( input );
					assert.areSame( num, fired, msg );
				}

				test( '<p>A <b>B</b> <img src="a"></p>',				0, 'not filtered 1' );
				test( '<i class="cl1" style="color:red">A</i>',			0, 'not filtered 2' );
				test( '<a href="a">A</a>',								0, 'not filtered 3' );

				test( '<h1>A</h1>',										1, 'filtered 1' ); // transformed to <p>
				test( '<p><s>A</s></p>',								2, 'filtered 2' ); // stripped
				test( '<p class="x">A</p>',								3, 'filtered 3' ); // removed class
				test( '<p style="width:100px">A</p>',					4, 'filtered 4' ); // removed style
				test( '<p foo="bar">A<p>',								5, 'filtered 5' ); // removed attr
				test( '<p><i class="x cl1">A</i><p>',					6, 'filtered 6' ); // removed class when other is accepted
				test( '<p><img><p>',									7, 'filtered 7' ); // removed <img> without required src (src is required automatically by filter)
				test( '<div>A</div>',									8, 'filtered 8' ); // removed <div> without required class

				editor.execCommand( 'paste', '<h1>A</h1>' );
				assert.areSame( 9, fired, 'pasted data were filtered' );

				editor.insertHtml( '<h2>A</h2>' );
				assert.areSame( 10, fired, 'inserted data were filtered' );
			} );
		},

		// Rule of thumb - contextual processing - active filter,
		// global processing - main filter.
		'test active/main filter usage depending on context': function() {
			bender.editorBot.create( {
				name: 'test_editor_processing_active_filter',
				config: {
					allowedContent: 'u(!main); p'
				}
			}, function( bot ) {
				var editor = bot.editor;

				bot.setData( '<p></p>', function() {
					editor.focus();

					var filter = new CKEDITOR.filter( 'u(!active); p' );

					editor.setActiveFilter( filter );
					editor.insertHtml( '<u class="active">A1</u>-<u class="main">A2</u>' );

					filter.applyTo = function() {
						assert.fail( 'active filter should not be used while getting data from editor' );
					};
					assert.areSame( '<p><u class="active">A1</u>-A2</p>', editor.getData(), 'data was filtered using active filter' );

					bot.setData( '<p><u class="active">A1</u>-<u class="main">A2</u></p>', function() {
						assert.areSame( '<p>A1-<u class="main">A2</u></p>', editor.getData(), 'data was filtered using main filter' );
					} );
				} );
			} );
		},

		// Rule of thumb - contextual processing - active filter,
		// global processing - main filter.
		'test active/main filter usage depending on context - inline editor': function() {
			bender.editorBot.create( {
				name: 'test_editor_processing_active_filter_inline',
				creator: 'inline',
				config: {
					allowedContent: 'u(!main); p'
				}
			}, function( bot ) {
				var editor = bot.editor;

				bot.setData( '<p></p>', function() {
					editor.focus();

					var filter = new CKEDITOR.filter( 'u(!active); p' );

					editor.setActiveFilter( filter );
					editor.insertHtml( '<u class="active">A1</u>-<u class="main">A2</u>' );

					filter.applyTo = function() {
						assert.fail( 'active filter should not be used while getting data from editor' );
					};
					assert.areSame( '<p><u class="active">A1</u>-A2</p>', editor.getData(), 'data was filtered using active filter' );

					bot.setData( '<p><u class="active">A1</u>-<u class="main">A2</u></p>', function() {
						assert.areSame( '<p>A1-<u class="main">A2</u></p>', editor.getData(), 'data was filtered using main filter' );
					} );
				} );
			} );
		},

		'test filter is derefernced on editor.destroy()': function() {
			bender.editorBot.create( {
				name: 'test_editor_destroy',
				creator: 'inline'
			}, function( bot ) {
				var editor = bot.editor;

				editor.destroy();

				assert.isFalse( 'filter' in editor, 'editor.filter was deleted' );
				assert.isFalse( 'activeFilter' in editor, 'editor.activeFilter was deleted' );
			} );
		}
	} );
} )();