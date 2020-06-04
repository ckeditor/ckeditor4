/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: codesnippet,toolbar */

( function() {
	'use strict';

	var setHighlighter;

	bender.editor = {
		config: {
			on: {
				pluginsLoaded: function() {
					// Normally setHighlighter can be used only during plugin init hooks, after that it is removed, so keep it for testing purposes.
					setHighlighter = CKEDITOR.plugins.registered.codesnippet.setHighlighter;
				}
			}
		}
	};

	var objToArray = bender.tools.objToArray,
		html = '<pre>' +
			'<code class="language-php">foo</code>' +
		'</pre>';

	function getHighlighter( editor ) {
		return editor._.codesnippet.highlighter;
	}

	function getLangs( editor ) {
		return editor._.codesnippet.langs;
	}

	bender.test( {
		// (#589)
		'test setHighlighter method is absent': function() {
			assert.isNull( CKEDITOR.plugins.registered.codesnippet.setHighlighter );
		},

		'test highlighter: change highlighter': function() {
			var editor = this.editor,
				langs = {};

			var highlighter = new CKEDITOR.plugins.codesnippet.highlighter( {
				languages: langs,
				highlighter: function() {}
			} );

			setHighlighter( highlighter );

			assert.areEqual( highlighter, getHighlighter( editor ), 'Highlighter has not been changed' );
			assert.areEqual( langs, getLangs( this.editor ), 'Highlighter languages has not been changed' );
		},

		'test highlighter: custom highlighter': function() {
			var editor = this.editor,
				langs = {
					php: 'PHP'
				},
				called = 0;

			var highlighter = new CKEDITOR.plugins.codesnippet.highlighter( {
				languages: langs,
				highlighter: function( code, language, callback ) {
					assert.areSame( 'foo', code, 'Contents of widget.parts#code passed correctly' );
					assert.areSame( 'php', language, 'Language of widget.data#lang passed correctly' );
					assert.isFunction( callback, 'Callback function passed correctly' );

					called++;

					// Return highlighted HTML.
					callback( 'highlighted' );
				}
			} );

			setHighlighter( highlighter );

			this.editorBot.setData( html, function() {
				var widget = objToArray( editor.widgets.instances )[ 0 ];

				// Method highlight should call our highlighterMockup function,
				// which changes widget.parts#pre.
				widget.highlight();

				assert.isTrue( !!highlighter.ready, 'Highlighter should be ready' );
				assert.areSame( 0, highlighter.queue.length, 'All jobs should be done' );
				assert.areSame( 2, called, 'Highlighter should be called twice (editor.setData(), highlight())' );
				assert.areEqual( 'highlighted', widget.parts.code.getHtml(), 'Widget.parts#code updated correctly' );
			} );
		},

		'test highlighter: custom highlighter with async init': function() {
			var editor = this.editor,
				langs = {
					php: 'PHP'
				},
				called = 0,
				ready;

			var highlighter = new CKEDITOR.plugins.codesnippet.highlighter( {
				languages: langs,
				init: function( callback ) {
					ready = callback;
				},
				highlighter: function( code, language, callback ) {
					assert.areSame( 'foo', code, 'Contents of widget.parts#code passed correctly' );
					assert.areSame( 'php', language, 'Language of widget.data#lang passed correctly' );
					assert.isFunction( callback, 'Callback function passed correctly' );

					called++;

					// Return highlighted HTML.
					callback( 'highlighted async' );
				}
			} );

			setHighlighter( highlighter );

			this.editorBot.setData( html, function() {
				var widget = objToArray( editor.widgets.instances )[ 0 ];

				// Method highlight should call our highlighterMockup function,
				// which changes widget.parts#pre.
				widget.highlight();

				assert.isFalse( !!highlighter.ready, 'Highlighter should not be ready yet' );
				assert.areSame( 2, highlighter.queue.length, 'Jobs queued: editor.setData(), highlight()' );
				assert.areSame( 0, called, 'Highlighter should not be called because it is not ready' );
				assert.areEqual( 'foo', widget.parts.code.getHtml(), 'Widget.parts#code not updated yet' );

				ready();

				assert.isTrue( !!highlighter.ready, 'Highlighter should be ready' );
				assert.areSame( 0, highlighter.queue.length, 'All jobs should be done' );
				assert.areSame( 2, called, 'Highlighter should be called twice (queued: editor.setData(), highlight())' );
				assert.areEqual( 'highlighted async', widget.parts.code.getHtml(), 'Widget.parts#code updated correctly' );
			} );
		}
	} );
} )();
