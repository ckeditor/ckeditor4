/* bender-tags: editor,imagebase */
/* bender-ckeditor-plugins: easyimage */
/* bender-include: ../../../easyimage/_helpers/tools.js */
/* global easyImageTools */

( function() {
	'use strict';

	var widget = '<figure class="image easyimage easyimage-side">' +
		'<img src="../../../image2/_assets/foo.png" alt="foo">' +
		'<figcaption>Test image</figcaption>' +
		'</figure>';

	var testHtml = widget + widget;

	function testAssert( editorBot, captionedWidgetId, otherWidgedId, initialFocus ) {
		var editor = editorBot.editor;

		// Safari doesn't fire event `selectionChange` when calling `element.focus()` so we need to make sure this event is fired
		function reselect() {
			if ( CKEDITOR.env.safari )
			editor.getSelection().selectRanges( editor.getSelection().getRanges() );
		}
		if ( CKEDITOR.tools.objectKeys( editor.widgets.instances ).length ) {
			editor.widgets.destroyAll();
			editor.widgets._.nextId = 0;
		}
		editorBot.setData( testHtml, function() {
			var editor = this.editorBot.editor,
				widgets = editor.widgets.instances;

			initialFocus && widgets[ otherWidgedId ].parts.caption.focus();
			reselect();
			widgets[ captionedWidgetId ].parts.caption.focus();
			reselect();
			widgets[ captionedWidgetId ].editables.caption.setData( '' );
			widgets[ otherWidgedId ].parts.caption.focus();
			reselect();
			assert.areSame( widgets[ captionedWidgetId ].parts.caption.getComputedStyle( 'display' ), 'none' );
		} );
	}
	bender.editor = {};

	var tests = {
		setUp: function() {
			if ( easyImageTools.isUnsupportedEnvironment() ) {
				assert.ignore();
			}
		},
		'test remove first caption': function() {
			testAssert( this.editorBot, 0, 1 );
		},
		'test remove second caption ': function() {
			testAssert( this.editorBot, 1, 0 );
		},
		'test focus first remove second caption ': function() {
			testAssert( this.editorBot, 0, 1, 1 );
		},
		'test focus second remove first caption ': function() {
			testAssert( this.editorBot, 1, 0, 1 );
		}
	};

	bender.test( tests );
} )();
