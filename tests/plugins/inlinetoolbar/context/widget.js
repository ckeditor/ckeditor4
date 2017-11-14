/* bender-tags: inlinetoolbar,context */
/* bender-ckeditor-plugins: inlinetoolbar,button,widget */
/* bender-include: ../../widget/_helpers/tools.js */
/* global widgetTestsTools */

( function() {
	'use strict';

	bender.editor = {
		config: {
			extraAllowedContent: 'div[*]'
		}
	};

	bender.test( {
		'test simple positive matching with one item': function() {
			var editor = this.editor,
				context = this._getContextStub( [ 'positive' ] );

			editor.widgets.add( 'positive' );

			this.editorBot.setData(
				'<p>foo</p><div data-widget="positive" id="w1">foo</div></p>',
				function() {
					var widget = widgetTestsTools.getWidgetById( editor, 'w1' );

					widget.focus();

					context.refresh();

					assert.areSame( 0, context.toolbar.hide.callCount, 'Toolbar hide calls' );
					assert.areSame( 1, context.toolbar.show.callCount, 'Toolbar show calls' );
				} );
		},

		'test simple positive matching with multiple items': function() {
			var editor = this.editor,
				context = this._getContextStub( [ 'foo', 'bar', 'baz' ] );

			editor.widgets.add( 'bar' );

			this.editorBot.setData(
				'<p>foo</p><div data-widget="bar" id="w1">foo</div></p>',
				function() {
					var widget = widgetTestsTools.getWidgetById( editor, 'w1' );

					widget.focus();

					context.refresh();

					assert.areSame( 0, context.toolbar.hide.callCount, 'Toolbar hide calls' );
					assert.areSame( 1, context.toolbar.show.callCount, 'Toolbar show calls' );
				} );
		},

		'test simple mismatching with few items': function() {
			var editor = this.editor,
				context = this._getContextStub( [ 'foo', 'bar', 'baz', 'nega', 'negative-postfix' ] );

			editor.widgets.add( 'negative' );

			this.editorBot.setData(
				'<p>foo</p><div data-widget="negative" id="w1">foo</div></p>',
				function() {
					var widget = widgetTestsTools.getWidgetById( editor, 'w1' );

					widget.focus();

					context.refresh();

					assert.areSame( 1, context.toolbar.hide.callCount, 'Toolbar hide calls' );
					assert.areSame( 0, context.toolbar.show.callCount, 'Toolbar show calls' );
				} );
		},

		/*
		 * Returns a Context instance with toolbar show/hide methods stubbed.
		 *
		 * @param {String[]} widgetNames List of widget names to be set as `options.widgets`.
		 * @returns {CKEDITOR.plugins.inlinetoolbar.context}
		 */
		_getContextStub: function( widgetNames ) {
			var ret = this.editor.plugins.inlinetoolbar.create( {
				widgets: widgetNames
			} );

			sinon.stub( ret.toolbar, 'hide' );
			sinon.stub( ret.toolbar, 'show' );

			return ret;
		}
	} );
} )();
