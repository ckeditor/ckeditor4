/* bender-tags: editor */
/* bender-ckeditor-plugins: wysiwygarea,toolbar,forms,widget,codesnippet,undo,basicstyles,entities */

'use strict';
( function() {

	var backspace = 8,
		deleteKey = 46,
		leftArrow = 37,
		rightArrow = 39;

	var input = (
		'<div class="simplebox">' +
		'<h2 class="simplebox-title">Title</h2>' +
		'<div class="simplebox-content"><p>Content...</p></div></div>' +
		'<p>&nbsp;</p>' +
		'<pre><code class="language-javascript">//Hello another world!</code></pre>'
	);

	var notEmptyInput = (
		'<div class="simplebox">' +
		'<h2 class="simplebox-title">Title</h2>' +
		'<div class="simplebox-content"><p>Content...</p></div></div>' +
		'<p>Hello, World!</p>' +
		'<pre><code class="language-javascript">//Hello another world!</code></pre>'
	);

	var result = (
		'<div class="simplebox">' +
		'<h2 class="simplebox-title">Title</h2>' +
		'<div class="simplebox-content"><p>Content...</p></div></div>' +
		'<pre><code class="language-javascript">//Hello another world!</code></pre>'
	);

	var simpleBox = {
		template: '<div class="simplebox">' +
			'<h2 class="simplebox-title">Title</h2>' +
			'<div class="simplebox-content"><p>Content...</p></div>' +
		'</div>',
		editables: {
			title: {
				selector: '.simplebox-title',
				allowedContent: 'br strong em'
			},
			content: {
				selector: '.simplebox-content',
				allowedContent: 'p br ul ol li strong em'
			}
		},
		allowedContent: 'div(!simplebox); div(!simplebox-content); h2(!simplebox-title)',
		requiredContent: 'div(simplebox)',

		upcast: function( element ) {
			return element.name === 'div' && element.hasClass( 'simplebox' );
		}
	};

	function selectEmptyParagraph( editor ) {
		var range = editor.createRange();

		range.moveToPosition( editor.document.getElementsByTag( 'P' ).getItem( 1 ), CKEDITOR.POSITION_AFTER_START );
		editor.getSelection().selectRanges( [ range ] );
	}

	bender.test( {

		// (#1572)
		'test fire delete to remove an empty paragraph between two widgets': function() {
			CKEDITOR.plugins.add( 'simplebox', {
				init: function( editor ) {
					editor.widgets.add( 'simplebox', simpleBox );
				}
			} );
			bender.editorBot.create( {
				name: 'editor1',
				startupData: input,
				config: {
					extraPlugins: 'simplebox',
					allowedContent: true
				}
			}, function( bot ) {
				var editor = bot.editor;
				selectEmptyParagraph( editor );
				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: deleteKey } ) );

				assert.areSame( result, editor.getData(), 'Empty paragraph between two widgets should be removed.' );
			} );
		},

		// (#1572)
		'test fire backspace to remove an empty paragraph between two widgets': function() {
			bender.editorBot.create( {
				name: 'editor2',
				startupData: input,
				config: {
					extraPlugins: 'simplebox',
					allowedContent: true
				}
			}, function( bot ) {
				var editor = bot.editor;
				selectEmptyParagraph( editor );
				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: backspace } ) );

				assert.areSame( result, editor.getData(), 'Empty paragraph between two widget should be removed.' );
			} );
		},

		// (#1572)
		'test fire right arrow must not remove a paragraph between two widgets': function() {
			bender.editorBot.create( {
				name: 'editor3',
				startupData: input,
				config: {
					extraPlugins: 'simplebox',
					allowedContent: true
				}
			}, function( bot ) {
				var editor = bot.editor;

				selectEmptyParagraph( editor );
				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: rightArrow } ) );

				assert.areSame( input, editor.getData(), 'Empty paragraph between two widgets should not be removed.' );
			} );
		},

		// (#1572)
		'test fire left arrow must not remove a paragraph between two widgets': function() {
			bender.editorBot.create( {
				name: 'editor4',
				startupData: input,
				config: {
					extraPlugins: 'simplebox',
					allowedContent: true
				}
			}, function( bot ) {
				var editor = bot.editor;

				selectEmptyParagraph( editor );
				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: leftArrow } ) );

				assert.areSame( input, editor.getData(), 'Empty paragraph between two widgets should not be removed.' );
			} );
		},

		// (#1572)
		'test delete must not remove a non empty paragraph between two widgets': function() {
			bender.editorBot.create( {
				name: 'editor5',
				startupData: notEmptyInput,
				config: {
					extraPlugins: 'simplebox',
					allowedContent: true
				}
			}, function( bot ) {
				var editor = bot.editor;
				var p;

				selectEmptyParagraph( editor );
				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: deleteKey } ) );
				p = editor.document.getElementsByTag( 'P' ).getItem( 0 );

				assert.isNotUndefined( p, 'Not empty paragraph should not be removed.' );

				assert.isNotNull( p, 'Not empty paragraph should not be removed.' );
			} );
		},

		// (#1572)
		'test backspace must not remove a non empty paragraph between two widgets': function() {
			bender.editorBot.create( {
				name: 'editor6',
				startupData: notEmptyInput,
				config: {
					extraPlugins: 'simplebox',
					allowedContent: true
				}
			}, function( bot ) {
				var editor = bot.editor;
				var p;

				selectEmptyParagraph( editor );
				editor.editable().fire( 'keydown', new CKEDITOR.dom.event( { keyCode: backspace } ) );
				p = editor.document.getElementsByTag( 'P' ).getItem( 0 );

				assert.isNotUndefined( p, 'Not empty paragraph should not be removed.' );

				assert.isNotNull( p, 'Not empty paragraph should not be removed.' );
			} );
		}
	} );

}() );
