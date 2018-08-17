/* bender-tags: editor,widget */
/* bender-ckeditor-plugins: codesnippet,toolbar */

( function() {
	'use strict';

	var objToArray = bender.tools.objToArray,
		htmlEncode = CKEDITOR.tools.htmlEncode;

	bender.editor = {
		config: {
			codeSnippet_languages: {
				javascript: 'JavaScript',
				php: 'PHP'
			},
			extraAllowedContent: 'em'
		}
	};

	function assertInternalStructure( widget ) {
		assert.areSame( 'code', widget.parts.code.getName(), 'code#parts detected' );
		assert.areSame( 'pre', widget.parts.pre.getName(), 'code#parts detected' );

		assert.isTrue( widget.parts.code.hasClass( 'hljs' ), 'Default codeSnippet_codeClass set' );

		var parents = widget.parts.code.getParents(),
			parentsNames = [];

		for ( var i = 0; i < parents.length; i++ )
			parentsNames.push( parents[ i ].getName() );

		assert.areSame( 'html,body,div,pre,code', parentsNames.join( ',' ), 'Structure is valid' );
	}

	bender.test( {
		'test upcast: regular': function() {
			var editor = this.editor,
				markup = CKEDITOR.document.getById( 'upcastables' ).getHtml();

			this.editorBot.setData( markup, function() {
				assert.areSame( 6, objToArray( editor.widgets.instances ).length, 'A number of instances created' );

				for ( var i in editor.widgets.instances )
					assertInternalStructure( editor.widgets.instances[ i ] );
			} );
		},

		'test upcast: elements inside code': function() {
			var editor = this.editor,
				data =
					'<pre><code class="language-javascript">' +
						'<em>foo</em>' +
					'</code></pre>' +
					'<pre><code class="language-javascript">' +
						'foo<em>foo</em>' +
					'</code></pre>';

			this.editorBot.setData( data, function() {
				var instances = objToArray( editor.widgets.instances );

				assert.areSame( 0, instances.length, 'Code with elements inside should not be upcasted at all' );
				assert.areSame( data, editor.getData(), 'Data has not been changed' );
			} );
		},

		'test upcast: no upcast (invalid DOM)': function() {
			var editor = this.editor,
				markup = CKEDITOR.document.getById( 'non-upcastables' ).getHtml();

			this.editorBot.setData( markup, function() {
				assert.areSame( 0, objToArray( editor.widgets.instances ).length, 'No widgets created' );
			} );
		},

		'test upcast: language recognition': function() {
			var editor = this.editor,
				code = 'function() {return "1";} // <foo />',
				inputCode = '<pre><code class="language-javascript">' + htmlEncode( code ) + '</code></pre>';

			this.editorBot.setData( inputCode, function() {
				var instances = objToArray( editor.widgets.instances );

				assert.areSame( 1, instances.length, 'A single widget should be created' );

				var widget = instances[ 0 ];

				assertInternalStructure( widget );
				assert.areSame( 'javascript', widget.data.lang, 'Language detected (data#lang)' );
				assert.areSame( code, widget.data.code, 'Code loaded (data#code)' );
			} );
		},

		'test upcast: language recognition (invalid language-* class)': function() {
			var editor = this.editor;

			this.editorBot.setData( '<pre><code class="language-foo">c</code></pre>', function() {
				var instances = objToArray( editor.widgets.instances );

				assert.areSame( 1, instances.length, 'A single widget should be created' );

				var widget = instances[ 0 ];

				assertInternalStructure( widget );
				assert.isUndefined( widget.data.lang, 'In case of unrecognized language, lang (data#lang) should remain null' );
				assert.areSame( 'c', widget.data.code, 'Code loaded (data#code)' );
			} );
		},

		'test upcast: language recognition (valid language-* class but config.codeSnippet_languages)': function() {
			var editor = this.editor;

			this.editorBot.setData( '<pre><code class="language-python">c</code></pre>', function() {
				var instances = objToArray( editor.widgets.instances );

				assert.areSame( 1, instances.length, 'A single widget should be created' );

				var widget = instances[ 0 ];

				assertInternalStructure( widget );
				assert.isUndefined( widget.data.lang, 'Language which don\'t match config.codeSnippet_languages should not be recognized' );
				assert.areSame( 'c', widget.data.code, 'Code loaded (data#code)' );
			} );
		},

		'test upcast: handle codeSnippet_codeClass': function() {
			var editor = this.editor,
				bot = this.editorBot;

			bot.setData( '<pre><code class="hljs wrongClass language-python">c</code></pre>', function() {
				var instances = objToArray( editor.widgets.instances );

				assert.areSame( 1, instances.length, 'A single widget should be created' );

				var widget = instances[ 0 ];

				assertInternalStructure( widget );

				assert.areSame( '<pre><code class="language-python">c</code></pre>',
					bot.getData(), 'codeSnippet_codeClass and wrong class stripped out' );
			} );
		}
	} );
} )();
