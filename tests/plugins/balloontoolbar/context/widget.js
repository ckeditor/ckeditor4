/* bender-tags: balloontoolbar,context */
/* bender-ckeditor-plugins: balloontoolbar,button,widget */
/* bender-include: ../../widget/_helpers/tools.js, _helpers/tools.js */
/* global widgetTestsTools, contextTools */

( function() {
	'use strict';

	var getContextStub = contextTools._getContextStub;

	bender.editor = {
		config: {
			extraAllowedContent: 'div[*];strong'
		}
	};

	bender.test( {
		setUp: function() {
			bender.tools.ignoreUnsupportedEnvironment( 'balloontoolbar' );
		},

		tearDown: function() {
			this.editor.balloonToolbars._clear();
		},

		'test simple positive matching with one item': function() {
			var editor = this.editor,
				context = getContextStub( editor, [ 'positive' ] );

			editor.widgets.add( 'positive' );

			this.editorBot.setData(
				'<p>foo</p><div data-widget="positive" id="w1">foo</div></p>',
				function() {
					var widget = widgetTestsTools.getWidgetById( editor, 'w1' );

					widget.focus();

					contextTools._assertToolbarVisible( true, context );
				} );
		},

		'test simple positive matching with multiple items': function() {
			var editor = this.editor,
				context = getContextStub( editor, [ 'foo', 'bar', 'baz' ] );

			editor.widgets.add( 'bar' );

			this.editorBot.setData(
				CKEDITOR.document.getById( 'simpleWidget' ).getHtml(),
				function() {
					var widget = widgetTestsTools.getWidgetById( editor, 'w1' );

					widget.focus();

					contextTools._assertToolbarVisible( true, context );
				} );
		},

		'test simple mismatching with few items': function() {
			var editor = this.editor,
				context = getContextStub( editor, [ 'foo', 'bar', 'baz', 'nega', 'negative-postfix' ] );

			editor.widgets.add( 'negative' );

			this.editorBot.setData(
				'<p>foo</p><div data-widget="negative" id="w1">foo</div></p>',
				function() {
					var widget = widgetTestsTools.getWidgetById( editor, 'w1' );

					widget.focus();

					contextTools._assertToolbarVisible( false, context );
				} );
		},

		'test matching with options.widgets as a string': function() {
			var editor = this.editor,
				context = getContextStub( editor, 'foo,bar,baz' );

			editor.widgets.add( 'bar' );

			this.editorBot.setData(
				CKEDITOR.document.getById( 'simpleWidget' ).getHtml(),
				function() {
					var widget = widgetTestsTools.getWidgetById( editor, 'w1' );

					widget.focus();

					contextTools._assertToolbarVisible( true, context );
				} );
		},

		'test negation with options.widgets as a string': function() {
			var editor = this.editor,
				context = getContextStub( editor, 'foo,zbarz,baz' );

			editor.widgets.add( 'bar' );

			this.editorBot.setData(
				CKEDITOR.document.getById( 'simpleWidget' ).getHtml(),
				function() {
					var widget = widgetTestsTools.getWidgetById( editor, 'w1' );

					widget.focus();

					contextTools._assertToolbarVisible( false, context );
				} );
		},

		'test widget selector does not trigger in nested editable': function() {
			var editor = this.editor,
				context = getContextStub( editor, 'widgetWithEditable' );

			editor.widgets.add( 'widgetWithEditable', {
				editables: {
					area: 'div.area'
				}
			} );

			this.editorBot.setData(
				CKEDITOR.document.getById( 'withCaption' ).getHtml(),
				function() {
					this.editor.getSelection().selectElement( this.editor.editable().findOne( 'strong' ) );

					contextTools._assertToolbarVisible( false, context );
				} );
		},

		'test widget toolbar points to a proper element': function() {
			// Toolbar matched to a widget, should point to a widget element.
			var editor = this.editor,
				context = getContextStub( editor, [ 'pointing' ] );

			editor.widgets.add( 'pointing' );

			this.editorBot.setData(
				'<p>foo</p><div data-widget="pointing" id="w1">foo</div></p>',
				function() {
					var widget = widgetTestsTools.getWidgetById( editor, 'w1' );

					sinon.stub( context, 'show' );

					widget.focus();

					sinon.assert.calledWithExactly( context.show, widget.element );
					assert.isTrue( true );
				} );
		}
	} );
} )();
