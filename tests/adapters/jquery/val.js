/* bender-tags: editor,unit,jquery */
/* bender-ckeditor-adapters: jquery */
/* bender-ckeditor-plugins: wysiwygarea */

'use strict';

var FOO = '<p>foo</p>',
	BAR = '<p>bar</p>',

	tpl = new CKEDITOR.template( '<{tag} class="element {className}" />' ),

	instanceCount = 0,
	setDataCount = 0;

CKEDITOR.on( 'instanceReady', function( event ) {
	var editor = event.editor;

	editor.on( 'setData', function() {
		setDataCount++;
	}, null, null, -1000 );

	instanceCount++;
}, null, null, -1000 );

bender.test( {
	createDynamicElements: function( elements ) {
		var editorCount = 0,
			tag, className;

		for ( var i = elements.length; i--; ) {
			// <textarea> for 'editor', <tag> for 'tag'.
			tag = elements[ i ] == 'editor' ? 'textarea' : elements[ i ];

			// 'editor' for <textarea>, nothing for others
			className = elements[ i ] == 'editor' ? 'editor' : '';
			if ( className )
				editorCount++;

			$( '#dymanicTests' ).append( tpl.output( { tag: tag, className: className } ) );
		}

		return editorCount;
	},

	checkWithEditor: function( elements ) {
		var count = this.createDynamicElements( elements );

		$( '#dymanicTests .editor' ).ckeditor().promise.done( function() {
			$( '#dymanicTests .element' ).val( FOO ).done( function() {
				resume( function() {
					assert.areSame( count, instanceCount, 'Instance number matches' );
					assert.areSame( count, setDataCount, 'One setData per instance only' );

					$( '#dymanicTests .editor' ).each( function() {
						assert.areSame( FOO, bender.tools.compatHtml( $( this ).val() ) );
					} );
				} );
			} );
		} );

		wait();
	},

	checkWithoutEditor: function( elements ) {
		this.createDynamicElements( elements );

		var jqueryObj = $( '#dymanicTests .element' ).val( FOO );

		assert.areSame( 0, instanceCount, 'There should be no editors created.' );
		assert.areSame( 0, setDataCount, 'There should be no setData called.' );
		assert.isString( jqueryObj.jquery, 'jQuery object should be returned by val() when collection is not containing editors.' );

		$( '#dymanicTests .editor' ).each( function() {
			assert.areSame( FOO, bender.tools.compatHtml( $( this ).val() ) );
		} );
	},

	setUp: function() {
		var instances = CKEDITOR.instances;

		for ( var i in instances )
			CKEDITOR.instances[ i ].destroy();

		// Reset counters.
		instanceCount = 0;
		setDataCount = 0;

		// Reset dynamic container.
		$( '#dymanicTests' ).html( '' );
	},

	'test integrity of jQuery API: element': function() {
		this.checkWithoutEditor( [ 'textarea' ] );
	},

	'test integrity of jQuery API: collection': function() {
		this.checkWithoutEditor( [ 'textarea', 'input' ] );
	},

	'test integrity of jQuery API: editor': function() {
		this.checkWithEditor( [ 'editor' ] );
	},

	'test integrity of jQuery API: editor and element': function() {
		this.checkWithEditor( [ 'editor', 'textarea' ] );
	},

	'test integrity of jQuery API: element and editor': function() {
		this.checkWithEditor( [ 'textarea', 'editor' ] );
	},

	'test integrity of jQuery API: editor, element, editor': function() {
		this.checkWithEditor( [ 'editor', 'textarea', 'editor' ] );
	},

	'test value with val()': function() {
		var eventCounter = 0,
			editorGetValue;

		editorGetValue = $( '#editorGetValue' ).ckeditor( function() {
			this.setData( FOO, function() {
				var value = bender.tools.compatHtml( $( '#editorGetValue' ).val() );

				resume( function() {
					assert.areSame( FOO, value, 'Returned value should be the same as set.' );
					assert.areSame( 1, eventCounter, 'There should be only one event.' );
				} );
			} );
		} ).editor;

		$( '#editorGetValue' ).ckeditor().on( 'getData.ckeditor', function( event, editor, data ) {
			++eventCounter;

			resume( function() {
				assert.areSame( editorGetValue.name, editor.name );
				assert.areSame( 'getData', event.type );
				assert.areSame( FOO, bender.tools.compatHtml( data.dataValue ) );

				wait();
			} );
		} );

		wait();
	},

	'test val() of multiple editors (#7876)': function() {
		$( '.editorMultipleGet' ).ckeditor();

		$.when(
			$( '#editorMultipleGetA' ).val( FOO ),
			$( '#editorMultipleGetB' ).val( BAR ) ).then( function() {
				resume( function() {
					assert.areSame( FOO, bender.tools.compatHtml( $( '.editorMultipleGet' ).val() ), 'The value returned by val() called on multiple objects should return first result.' );
				} );
			} );

		wait();
	},

	'test use val() as called with undefined (#9019)': function() {
		$( '#editorUndefined' ).ckeditor();

		assert.isFunction( $( '#editorUndefined' ).val( undefined ).done, 'val( undefined ) should be treated as setter and return promise.' );
	}
} );